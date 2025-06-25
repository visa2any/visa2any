import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PaymentRequest {
  clientId: string,
  country: string,
  consulate: string,
  availableDates: string[],
  plan: 'BASIC' | 'PREMIUM' | 'VIP',
  urgency: 'NORMAL' | 'URGENT' | 'EMERGENCY',
}

interface ConsularFees {
  [key: string]: {
    visaFee: number,
    serviceFee: number
    biometricFee?: number
    additionalFees?: number,
    currency: string,
    paymentMethods: string[]
    officialPaymentUrl?: string,
  },
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
  },
}

// Multiplicadores por plano
const PLAN_MULTIPLIERS = {
  'BASIC': 1.0,
  'PREMIUM': 2.2,
  'VIP': 3.0,
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
        supportedCountries: Object.keys(CONSULAR_FEES),
      }, { status: 400 }),
    }

    // 2. Calcular custos detalhados
    const multiplier = PLAN_MULTIPLIERS[data.plan]
    const baseFee = Math.round(countryFees.serviceFee * multiplier)
    
    const costs = {
      breakdown: {
        visaFee: countryFees.visaFee,
        serviceFee: baseFee,
        biometricFee: countryFees.biometricFee || 0,
        additionalFees: countryFees.additionalFees || 0,
      },
      subtotal: countryFees.visaFee + baseFee + (countryFees.biometricFee || 0) + (countryFees.additionalFees || 0),
      discounts: {
        pix: Math.round((countryFees.visaFee + baseFee) * PIX_DISCOUNT),
      },
      total: {
        withoutDiscount: 0,
        withPixDiscount: 0,
      },
      currency: countryFees.currency,
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
        phone: true,
      },
    })

    if (!client) {
      return NextResponse.json({
        error: 'Cliente não encontrado',
      }, { status: 404 }),
    }

    // 4. Criar registro de cobrança híbrida
    const payment = await prisma.hybridPayment.create({
      data: {
        clientId: data.clientId,
        country: data.country,
        consulate: data.consulate,
        availableDates: data.availableDates,
        plan: data.plan,
        urgency: data.urgency,
        costs: costs,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        createdAt: new Date(),
      },
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
      availableDates: data.availableDates,
    })

    // 7. Notificar cliente sobre cobrança
    await notifyClientAboutPayment(client, {
      paymentId: payment.id,
      costs: costs,
      paymentLinks: paymentLinks,
      expiresIn: 30,
      country: data.country,
      consulate: data.consulate,
    })

    return NextResponse.json({
      payment: {
        id: payment.id,
        costs: costs,
        paymentLinks: paymentLinks,
        expiresAt: payment.expiresAt,
        officialPaymentUrl: countryFees.officialPaymentUrl,
      },
      client: {
        name: client.name,
        email: client.email,
      },
      consultantNotified: true,
      message: 'Cobrança criada e notificações enviadas',
    })

  } catch (error) {
    console.error('Erro na cobrança híbrida:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 }),
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const clientId = searchParams.get('clientId')

    if (paymentId) {
      // Buscar pagamento específico
      const payment = await prisma.hybridPayment.findUnique({
        where: { id: paymentId },
        include: {
          client: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      })

      if (!payment) {
        return NextResponse.json({
          error: 'Pagamento não encontrado',
        }, { status: 404 }),
      }

      return NextResponse.json({
        payment,
      }),
    }

    if (clientId) {
      // Buscar pagamentos do cliente
      const payments = await prisma.hybridPayment.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          client: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json({
        payments,
      }),
    }

    return NextResponse.json({
      error: 'paymentId ou clientId obrigatório',
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 }),
  },
}

// Gerar links de pagamento para diferentes métodos
async function generatePaymentLinks(paymentId: string, costs: any, client: any) {
  const links = {
    pix: null as string | null,
    card: null as string | null,
    boleto: null as string | null,
  }

  try {
    // PIX (com desconto)
    const pixPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withPixDiscount,
      title: 'Vaga Express - Agendamento de Visto (PIX)',
      description: `${client.name} - Taxa consular + serviço (5% desconto PIX)`,
      paymentMethods: ['pix'],
      discount: costs.discounts.pix,
    })
    links.pix = pixPreference?.init_point || null

    // Cartão de Crédito
    const cardPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withoutDiscount,
      title: 'Vaga Express - Agendamento de Visto (Cartão)',
      description: `${client.name} - Taxa consular + serviço`,
      paymentMethods: ['credit_card', 'debit_card'],
      installments: 12,
    })
    links.card = cardPreference?.init_point || null

    // Boleto
    const boletoPreference = await createMercadoPagoPreference({
      paymentId,
      amount: costs.total.withoutDiscount,
      title: 'Vaga Express - Agendamento de Visto (Boleto)',
      description: `${client.name} - Taxa consular + serviço`,
      paymentMethods: ['ticket'],
    })
    links.boleto = boletoPreference?.init_point || null

  } catch (error) {
    console.error('Erro ao gerar links de pagamento:', error),
  }

  return links,
}

// Criar preferência no MercadoPago
async function createMercadoPagoPreference(options: any) {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [{
          title: options.title,
          description: options.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: options.amount,
        }],
        external_reference: options.paymentId,
        payment_methods: {
          excluded_payment_types: options.paymentMethods ? [] : ['credit_card', 'debit_card', 'ticket', 'digital_wallet'],
          included_payment_types: options.paymentMethods || undefined,
          installments: options.installments || 1,
        },
        back_urls: {
          success: `${process.env.NEXTAUTH_URL}/hybrid-booking/payment/success?id=${options.paymentId}`,
          failure: `${process.env.NEXTAUTH_URL}/hybrid-booking/payment/failure?id=${options.paymentId}`,
          pending: `${process.env.NEXTAUTH_URL}/hybrid-booking/payment/pending?id=${options.paymentId}`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/hybrid-booking`,
        metadata: {
          payment_id: options.paymentId,
          discount: options.discount || 0,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`MercadoPago API error: ${response.status}`),
    }

    return await response.json(),
  } catch (error) {
    console.error('Erro MercadoPago:', error)
    return null,
  },
}

// Notificar consultor via Telegram
async function notifyConsultant(data: any) {
  const urgencyEmoji = {
    'NORMAL': '⏰',
    'URGENT': '🚨',
    'EMERGENCY': '🔥',
  }

  const planEmoji = {
    'BASIC': '🥉',
    'PREMIUM': '🥈',
    'VIP': '🥇',
  }

  const message = `${urgencyEmoji[data.urgency]} COBRANÇA HÍBRIDA GERADA

${planEmoji[data.plan]} Cliente: ${data.client.name}
📧 Email: ${data.client.email}
📱 WhatsApp: ${data.client.phone}
🎯 Plano: ${data.plan}

🏛️ Destino: ${data.consulate} - ${data.country}
📅 Datas Disponíveis:
${data.availableDates.map((date: string) => `• ${date}`).join('\n')}

💰 VALORES:
• Taxa Consular: R$ ${data.costs.breakdown.visaFee}
• Nossa Taxa: R$ ${data.costs.breakdown.serviceFee}
• Biometria: R$ ${data.costs.breakdown.biometricFee}
• Extras: R$ ${data.costs.breakdown.additionalFees}

💳 TOTAL:
• Normal: R$ ${data.costs.total.withoutDiscount}
• PIX (5% desc): R$ ${data.costs.total.withPixDiscount}

🆔 Payment ID: ${data.paymentId}
⏰ Expira em: 30 minutos

🔗 Ver Detalhes: ${process.env.NEXTAUTH_URL}/admin/hybrid-payments/${data.paymentId}

⚡ AGUARDANDO PAGAMENTO PARA AGENDAR`

  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    }),
  } catch (error) {
    console.error('Erro ao notificar consultor:', error),
  },
}

// Notificar cliente sobre cobrança
async function notifyClientAboutPayment(client: any, data: any) {
  const whatsappMessage = `🎯 VAGA ENCONTRADA! PAGAMENTO NECESSÁRIO

Olá ${client.name}! 🎉

Conseguimos encontrar vagas para:
🏛️ ${data.consulate} - ${data.country}

💰 VALORES:
• Taxa Consular: R$ ${data.costs.breakdown.visaFee}
• Taxa de Serviço: R$ ${data.costs.breakdown.serviceFee}
${data.costs.breakdown.biometricFee > 0 ? `• Biometria: R$ ${data.costs.breakdown.biometricFee}` : ''}
${data.costs.breakdown.additionalFees > 0 ? `• Taxas Extras: R$ ${data.costs.breakdown.additionalFees}` : ''}

💳 FORMAS DE PAGAMENTO:

${data.paymentLinks.pix ? `🟢 PIX (5% DESCONTO): R$ ${data.costs.total.withPixDiscount}
🔗 ${data.paymentLinks.pix}` : ''}

${data.paymentLinks.card ? `💳 CARTÃO (até 12x): R$ ${data.costs.total.withoutDiscount}
🔗 ${data.paymentLinks.card}` : ''}

${data.paymentLinks.boleto ? `📄 BOLETO: R$ ${data.costs.total.withoutDiscount}
🔗 ${data.paymentLinks.boleto}` : ''}

⏰ IMPORTANTE: Expire em ${data.expiresIn} minutos!

💡 RECOMENDAÇÃO: Use PIX para economia de R$ ${data.costs.discounts.pix}

⚡ Após o pagamento, agendaremos automaticamente sua vaga!

❓ Dúvidas? Responda esta mensagem.`

  try {
    await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: client.phone,
        message: whatsappMessage,
      }),
    })

    // Enviar email com detalhes completos
    await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: client.email,
        subject: `🎯 Vaga Encontrada - Pagamento Necessário`,
        template: 'hybrid-payment-notification',
        data: {
          clientName: client.name,
          country: data.country,
          consulate: data.consulate,
          costs: data.costs,
          paymentLinks: data.paymentLinks,
          paymentId: data.paymentId,
          expiresIn: data.expiresIn,
        },
      }),
    })

  } catch (error) {
    console.error('Erro ao notificar cliente:', error),
  },
}