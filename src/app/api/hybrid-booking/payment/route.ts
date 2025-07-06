import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PaymentRequest {
  clientId: string,
  country: string,
  consulate: string,
  availableDates: string[],
  plan: 'BASIC' | 'PREMIUM' | 'VIP',
  urgency: 'NORMAL' | 'URGENT' | 'EMERGENCY'
}

interface ConsularFees {
  [key: string]: {
    visaFee: number,
    serviceFee: number,
    biometricFee?: number,
    additionalFees?: number,
    currency: string,
    paymentMethods: string[],
    officialPaymentUrl?: string
  }
}

// Tabela completa de taxas consulares atualizadas
const CONSULAR_FEES: ConsularFees = {
  'EUA': {
    visaFee: 950, // USD 185 ≈ R$ 950
    serviceFee: 150, // Basic
    currency: 'BRL',
    paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
    officialPaymentUrl: 'https://ais.usvisa-info.com/pt-br/niv/users/payment'
  },
  'CANADA': {
    visaFee: 380, // CAD 100 ≈ R$ 380
    serviceFee: 200,
    biometricFee: 320, // CAD 85 ≈ R$ 320
    additionalFees: 95, // Taxa VAC
    currency: 'BRL',
    paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
    officialPaymentUrl: 'https://visa.vfsglobal.com/bra/pt/can/pay-fees'
  },
  'REINO_UNIDO': {
    visaFee: 650, // GBP 100 ≈ R$ 650
    serviceFee: 180,
    biometricFee: 125, // GBP 19.20 ≈ R$ 125
    additionalFees: 120, // Taxa TLS
    currency: 'BRL',
    paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
    officialPaymentUrl: 'https://uk.tlscontact.com/br/sao/payment'
  },
  'FRANCA': {
    visaFee: 480, // EUR 80 ≈ R$ 480
    serviceFee: 160,
    biometricFee: 120,
    additionalFees: 100,
    currency: 'BRL',
    paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
    officialPaymentUrl: 'https://france-visas.gouv.fr/payment'
  }
}

// Multiplicadores por plano
const PLAN_MULTIPLIERS = {
  'BASIC': 1.0,
  'PREMIUM': 2.2,
  'VIP': 3.0
}

// Desconto PIX
const PIX_DISCOUNT = 0.05 // 5%

export async function POST(request: NextRequest) {
  try {
    const data: PaymentRequest = await request.json()

    // 1. Validar país suportado
    const countryKey = data.country.toUpperCase().replace(' ', '_')
    const countryFees = CONSULAR_FEES[countryKey]
    
    if (!countryFees) {
      return NextResponse.json({
        error: 'País não suportado no momento',
        supportedCountries: Object.keys(CONSULAR_FEES)
      }, { status: 400 })
    }

    // 2. Calcular custos detalhados
    const multiplier = PLAN_MULTIPLIERS[data.plan]
    const baseFee = Math.round(countryFees.serviceFee * multiplier)
    
    const costs = {
      breakdown: {
        visaFee: countryFees.visaFee,
        serviceFee: baseFee,
        biometricFee: countryFees.biometricFee || 0,
        additionalFees: countryFees.additionalFees || 0
      },
      subtotal: countryFees.visaFee + baseFee + (countryFees.biometricFee || 0) + (countryFees.additionalFees || 0),
      discounts: {
        pix: Math.round((countryFees.visaFee + baseFee) * PIX_DISCOUNT)
      },
      total: {
        withoutDiscount: 0,
        withPixDiscount: 0
      },
      currency: countryFees.currency
    }
    
    costs.total.withoutDiscount = costs.subtotal
    costs.total.withPixDiscount = costs.subtotal - costs.discounts.pix

    // 3. Buscar dados do cliente
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    })
    
    if (!client) {
      return NextResponse.json({
        error: 'Cliente não encontrado'
      }, { status: 404 })
    }

    // 4. Criar registro de pagamento
    const payment = await prisma.payment.create({
      data: {
        clientId: data.clientId,
        amount: costs.total.withoutDiscount,
        currency: 'BRL',
        status: 'PENDING',
        description: `Agendamento de visto - ${data.country} - ${data.consulate}`,
        dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        createdAt: new Date()
      }
    })

    // 5. Gerar links de pagamento
    const paymentLinks = await generatePaymentLinks(payment.id, costs, client)

    // 6. Notificar consultor via Telegram
    await notifyConsultant({
      paymentId: payment.id,
      client: client,
      country: data.country,
      consulate: data.consulate,
      plan: data.plan,
      urgency: data.urgency,
      costs: costs,
      availableDates: data.availableDates
    })

    // 7. Notificar cliente sobre cobrança
    await notifyClientAboutPayment(client, {
      paymentId: payment.id,
      costs: costs,
      paymentLinks: paymentLinks,
      expiresIn: 30,
      country: data.country,
      consulate: data.consulate
    })
    
    return NextResponse.json({
      payment: {
        id: payment.id,
        costs: costs,
        paymentLinks: paymentLinks,
        expiresAt: payment.dueDate,
        officialPaymentUrl: countryFees.officialPaymentUrl
      },
      client: {
        name: client.name,
        email: client.email
      },
      consultantNotified: true,
      message: 'Cobrança criada e notificações enviadas'
    })

  } catch (error) {
    console.error('Erro na cobrança híbrida:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const clientId = searchParams.get('clientId')
    
    if (paymentId) {
      // Buscar pagamento específico
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          client: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      })
      
      if (!payment) {
        return NextResponse.json({
          error: 'Pagamento não encontrado'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        payment
      })
    }
    
    if (clientId) {
      // Buscar pagamentos do cliente
      const payments = await prisma.payment.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
      
      return NextResponse.json({
        payments
      })
    }
    
    return NextResponse.json({
      error: 'paymentId ou clientId obrigatório'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Gerar links de pagamento para diferentes métodos
async function generatePaymentLinks(paymentId: string, costs: any, client: any) {
  const links = {
    pix: null as string | null,
    card: null as string | null,
    boleto: null as string | null
  }
  
  try {
    // PIX (com desconto)
    const pixPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withPixDiscount,
      title: 'Vaga Express - Agendamento de Visto (PIX)',
      description: `${client.name} - Taxa consular + serviço (5% desconto PIX)`,
      paymentMethods: ['pix'],
      discount: costs.discounts.pix
    })
    links.pix = pixPreference?.init_point || null

    // Cartão de Crédito
    const cardPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withoutDiscount,
      title: 'Vaga Express - Agendamento de Visto (Cartão)',
      description: `${client.name} - Taxa consular + serviço`,
      paymentMethods: ['credit_card', 'debit_card'],
      installments: 12
    })
    links.card = cardPreference?.init_point || null

    // Boleto
    const boletoPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withoutDiscount,
      title: 'Vaga Express - Agendamento de Visto (Boleto)',
      description: `${client.name} - Taxa consular + serviço`,
      paymentMethods: ['ticket']
    })
    links.boleto = boletoPreference?.init_point || null

  } catch (error) {
    console.error('Erro ao gerar links de pagamento:', error)
  }
  
  return links
}

// Criar preferência no MercadoPago
async function createMercadoPagoPreference(options: any) {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          title: options.title,
          description: options.description,
          quantity: 1,
          unit_price: options.amount / 100 // MercadoPago espera em centavos
        }],
        payment_methods: {
          excluded_payment_types: options.paymentMethods ? [] : undefined,
          installments: options.installments || 1
        },
        external_reference: options.paymentId,
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`
        }
      })
    })

    if (!response.ok) {
      throw new Error(`MercadoPago error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar preferência MercadoPago:', error)
    return null
  }
}

// Notificar consultor via Telegram
async function notifyConsultant(data: {
  paymentId: string;
  client: { name: string; email: string; phone: string | null };
  country: string;
  consulate: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  urgency: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  costs: any;
  availableDates: string[];
}) {
  try {
    const message = `💰 *Nova Cobrança Criada*

👤 **Cliente:** ${data.client.name}
📧 **Email:** ${data.client.email}
📱 **Telefone:** ${data.client.phone || 'Não informado'}

🌍 **País:** ${data.country}
🏛️ **Consulado:** ${data.consulate}
📋 **Plano:** ${data.plan}
⚡ **Urgência:** ${data.urgency}

💵 **Valor Total:** R$ ${data.costs.total.withoutDiscount.toFixed(2)}
🎫 **Desconto PIX:** R$ ${data.costs.discounts.pix.toFixed(2)}
💳 **Com PIX:** R$ ${data.costs.total.withPixDiscount.toFixed(2)}

📅 **Datas Disponíveis:** ${data.availableDates.slice(0, 3).join(', ')}...

🆔 **ID Pagamento:** ${data.paymentId}

⏰ **Expira em:** 30 minutos`

    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      console.error('Erro ao enviar notificação Telegram:', response.statusText)
    }
  } catch (error) {
    console.error('Erro ao notificar consultor:', error)
  }
}

// Notificar cliente sobre pagamento
async function notifyClientAboutPayment(client: any, data: any) {
  try {
    // Aqui você pode implementar notificação por email, WhatsApp, etc.
    console.log(`Cliente ${client.name} notificado sobre pagamento ${data.paymentId}`)
  } catch (error) {
    console.error('Erro ao notificar cliente:', error)
  }
} 