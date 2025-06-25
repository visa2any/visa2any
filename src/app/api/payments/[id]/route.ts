import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para atualizar pagamento
const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
})

// GET /api/payments/[id] - Buscar pagamento específico
export async function GET(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true,
            targetCountry: true,
            visaType: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { status: 404 }
      ),
    }

    // Gerar informações de pagamento baseado no status
    let paymentInfo: any = {}
    
    if (payment.status === 'PENDING') {
      paymentInfo = await generatePaymentInfo(payment),
    }

    return NextResponse.json({
      data: {
        ...payment,
        paymentInfo,
      },
    })

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// PUT /api/payments/[id] - Atualizar pagamento
export async function PUT(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updatePaymentSchema.parse(body)

    // Verificar se pagamento existe
    const existingPayment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { client: true },
    })

    if (!existingPayment) {
      return NextResponse.json(
        { status: 404 }
      ),
    }

    // Atualizar pagamento
    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        paidAt: validatedData.status === 'COMPLETED' ? new Date() : existingPayment.paidAt,
      },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true ,
          },
        },
      },
    })

    // Se pagamento foi confirmado, processar automações
    if (validatedData.status === 'COMPLETED' && existingPayment.status !== 'COMPLETED') {
      await processPaymentSuccess(payment),
    }

    // Log da atualização
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_UPDATED',
        action: 'update_payment',
        clientId: existingPayment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    })

    return NextResponse.json({
      data: payment,
      message: 'Pagamento atualizado com sucesso',
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors,
        },
        { status: 400 }
      ),
    }

    console.error('Erro ao atualizar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// POST /api/payments/[id]/webhook - Webhook para notificações de pagamento
export async function POST(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { provider, status, transaction_id, external_id } = body

    // Verificar se pagamento existe
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { client: true },
    })

    if (!payment) {
      return NextResponse.json(
        { status: 404 }
      ),
    }

    // Mapear status do provider para nosso status
    let newStatus = 'PENDING'
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'paid':
      case 'completed':
        newStatus = 'COMPLETED'
        break
      case 'processing':
      case 'pending':
        newStatus = 'PROCESSING'
        break
      case 'failed':
      case 'rejected':
        newStatus = 'FAILED'
        break
      case 'cancelled':
        newStatus = 'CANCELLED'
        break
      case 'refunded':
        newStatus = 'REFUNDED'
        break,
    }

    // Atualizar pagamento
    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: newStatus as any,
        paymentMethod: provider,
        transactionId: transaction_id || external_id || payment.transactionId,
        paidAt: newStatus === 'COMPLETED' ? new Date() : null,
      },
    })

    // Se pagamento foi confirmado, processar automações
    if (newStatus === 'COMPLETED' && payment.status !== 'COMPLETED') {
      await processPaymentSuccess(updatedPayment),
    }

    // Log do webhook
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_WEBHOOK',
        action: 'webhook_received',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    })

    return NextResponse.json({
      message: 'Webhook processado com sucesso',
    })

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// Função para gerar informações de pagamento
async function generatePaymentInfo(payment: any) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  if (payment.currency === 'BRL') {
    return {
      provider: 'Mercado Pago',
      methods: [
        {
          type: 'PIX',
          name: 'PIX (Instantâneo)',
          fee: 0,
          processingTime: 'Imediato',
          qrCode: `${baseUrl}/api/payments/${payment.id}/pix-qr`,
          pixKey: 'visa2any@mercadopago.com.br',
        },
        {
          type: 'CREDIT_CARD',
          name: 'Cartão de Crédito',
          fee: payment.amount * 0.039, // 3.9%
          processingTime: '1-2 dias úteis',
          installments: calculateInstallments(payment.amount),
        },
        {
          type: 'BOLETO',
          name: 'Boleto Bancário',
          fee: 2.99,
          processingTime: '1-3 dias úteis',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
        }
      ],
    },
  } else if (payment.currency === 'USD') {
    return {
      provider: 'Stripe',
      methods: [
        {
          type: 'CREDIT_CARD',
          name: 'Credit Card',
          fee: payment.amount * 0.029 + 0.30, // 2.9% + $0.30
          processingTime: '1-2 business days',
        },
        {
          type: 'BANK_TRANSFER',
          name: 'Bank Transfer (ACH)',
          fee: 0.80,
          processingTime: '3-5 business days',
        }
      ],
    },
  }

  return {
    provider: 'PayPal',
    methods: [
      {
        type: 'PAYPAL',
        name: 'PayPal',
        fee: payment.amount * 0.034 + 0.30, // 3.4% + fee
        processingTime: 'Instant',
      }
    ],
  },
}

// Calcular opções de parcelamento
function calculateInstallments(amount: number) {
  const installments = []
  const maxInstallments = amount >= 100 ? 12 : 6

  for (let i = 1; i <= maxInstallments; i++) {
    let interestRate = 0
    if (i > 6) {
      interestRate = 0.0199 // 1.99% a.m.
    }

    const installmentAmount = i === 1 
      ? amount 
      : amount * Math.pow(1 + interestRate, i) / i

    installments.push({
      number: i,
      amount: Math.round(installmentAmount * 100) / 100,
      total: Math.round(installmentAmount * i * 100) / 100,
      interestRate: interestRate * 100,
      text: i === 1 
        ? `1x R$ ${amount.toFixed(2)} sem juros`
        : `${i}x R$ ${installmentAmount.toFixed(2)} ${interestRate > 0 ? 'com juros' : 'sem juros'}`,
    }),
  }

  return installments,
}

// Processar automações quando pagamento é confirmado
async function processPaymentSuccess(payment: any) {
  try {
    // 1. Atualizar status do cliente
    await prisma.client.update({
      where: { id: payment.clientId },
      data: { 
        status: 'IN_PROCESS' // Cliente pagou, agora está em processo
      },
    })

    // 2. Criar interação de confirmação
    await prisma.interaction.create({
      data: {
        type: 'AUTOMATED_EMAIL',
        channel: 'email',
        direction: 'outbound',
        subject: 'Pagamento confirmado - Próximos passos',
        content: `Olá! Seu pagamento de ${payment.currency} ${payment.amount} foi confirmado. Em breve nossa equipe entrará em contato para dar início ao seu processo.`,
        clientId: payment.clientId,
        completedAt: new Date(),
      },
    })

    // 3. Agendar consultoria se aplicável
    const existingConsultation = await prisma.consultation.findFirst({
      where: { 
        clientId: payment.clientId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
    })

    if (!existingConsultation) {
      // Criar consultoria baseada no valor pago
      let consultationType = 'HUMAN_CONSULTATION'
      if (payment.amount >= 1000) {
        consultationType = 'VIP_SERVICE',
      }

      await prisma.consultation.create({
        data: {
          type: consultationType as any,
          status: 'SCHEDULED',
          clientId: payment.clientId,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Agendar para amanhã
          notes: `Consultoria criada automaticamente após confirmação do pagamento de ${payment.currency} ${payment.amount}`,
        },
      }),
    }

    // 4. Log do processamento
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_SUCCESS_PROCESSED',
        action: 'process_payment_success',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    })

  } catch (error) {
    console.error('Erro ao processar automações do pagamento:', error)
    
    // Log do erro
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_SUCCESS_ERROR',
        action: 'process_payment_success',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    }),
  },
}