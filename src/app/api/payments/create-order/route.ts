import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para criar pedido
const createOrderSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório')
  productName: z.string().min(1, 'Nome do produto é obrigatório')
  quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1')
  adults: z.number().min(1, 'Número de adultos deve ser pelo menos 1')
  children: z.number().min(0, 'Número de crianças não pode ser negativo')
  unitPrice: z.number().min(0, 'Preço unitário não pode ser negativo')
  totalAmount: z.number().min(0, 'Valor total não pode ser negativo')
  discountAmount: z.number().min(0, 'Valor do desconto não pode ser negativo').optional()
  clientInfo: z.object({
    name: z.string().optional()
    email: z.string().email().optional()
    phone: z.string().optional()
  }).optional()
})

// POST /api/payments/create-order - Criar pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Criar ou encontrar cliente se informações foram fornecidas
    let clientId = null
    if (validatedData.clientInfo?.email) {
      try {
        // Tentar encontrar cliente existente
        let client = await prisma.client.findUnique({
          where: { email: validatedData.clientInfo.email }
        })

        // Se não encontrar, criar novo
        if (!client) {
          client = await prisma.client.create({
            data: {
              name: validatedData.clientInfo.name || 'Cliente',
              email: validatedData.clientInfo.email,
              phone: validatedData.clientInfo.phone,
              status: 'LEAD',
              source: 'checkout'
            }
          })
        }
        
        clientId = client.id
      } catch (error) {
        console.error('Erro ao criar/encontrar cliente:', error)
        // Não bloquear o pedido se houver erro com cliente
      }
    }

    // Criar pedido no banco
    const payment = await prisma.payment.create({
      data: {
        amount: validatedData.totalAmount,
        currency: 'BRL',
        status: 'PENDING',
        paymentMethod: 'MERCADO_PAGO',
        description: `${validatedData.productName} - ${validatedData.adults} adulto(s)${validatedData.children > 0 ? ` + ${validatedData.children} criança(s)` : ''} - Total: R$ ${validatedData.totalAmount}`,
        clientId: clientId
      }
    })

    // Gerar link de pagamento do Mercado Pago
    const paymentUrl = await createMercadoPagoPayment({
      orderId: payment.id,
      title: validatedData.productName,
      quantity: validatedData.quantity,
      unitPrice: validatedData.totalAmount, // MP recebe o valor total
      description: `${validatedData.productName} - ${validatedData.adults} adulto(s)${validatedData.children > 0 ? ` + ${validatedData.children} criança(s)` : ''}`,
      clientEmail: validatedData.clientInfo?.email
    })

    // Log da criação do pedido
    await prisma.automationLog.create({
      data: {
        type: 'ORDER_CREATED',
        action: 'create_order',
        clientId: clientId,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
        success: true
      }
    })

    return NextResponse.json({
      data: {
        orderId: payment.id
        paymentUrl: paymentUrl,
        amount: validatedData.totalAmount,
        status: 'pending'
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos'
          details: error.errors
        }
        { status: 400 }
      )
    }

    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// Função para criar pagamento no Mercado Pago
async function createMercadoPagoPayment(orderData: {
  orderId: string,
  title: string,
  quantity: number,
  unitPrice: number,
  description: string
  clientEmail?: string,
}) {
  try {
    // Configurar dados da preferência
    const preferenceData = {
      items: [
        {
          id: orderData.orderId,
          title: orderData.title,
          description: orderData.description,
          quantity: 1, // Sempre 1 no MP, preço já é total
          unit_price: orderData.unitPrice,
          currency_id: 'BRL'
        }
      ],
      payer: orderData.clientEmail ? {
        email: orderData.clientEmail
      } : undefined,
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/success?payment_id=simulated&status=approved&external_reference=${orderData.orderId}`,
        failure: `${process.env.NEXTAUTH_URL}/cliente?payment=failed&order=${orderData.orderId}`,
        pending: `${process.env.NEXTAUTH_URL}/cliente?payment=pending&order=${orderData.orderId}`,
      }
      auto_return: 'approved',
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,
      external_reference: orderData.orderId,
      expires: true,
      expiration_date_from: new Date().toISOString()
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      }
    }

    // Usar SDK do Mercado Pago real
    console.log('Criando preferência MP:', preferenceData)
    
    // Importar e usar SDK do MercadoPago
    const { MercadoPagoConfig, Preference } = await import('mercadopago')
    
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
    })
    
    const preference = new Preference(client)
    const result = await preference.create({ body: preferenceData })
    
    return result.init_point
    
  } catch (error) {
    console.error('Erro ao criar pagamento MP:', error)
    // Fallback para checkout interno
    return null
  }
}