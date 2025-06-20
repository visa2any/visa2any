import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para criar pagamento
const createPaymentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  currency: z.string().default('BRL'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  paymentMethod: z.string().optional(),
  dueDate: z.string().datetime().optional()
})

// GET /api/payments - Listar pagamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }

    // Buscar pagamentos
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { 
              id: true, 
              name: true, 
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ])

    // Estatísticas
    const stats = await prisma.payment.aggregate({
      where: clientId ? { clientId } : {},
      _sum: { amount: true },
      _count: { id: true }
    })

    const statusStats = await prisma.payment.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { amount: true },
      where: clientId ? { clientId } : {}
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        payments,
        stats: {
          totalAmount: stats._sum.amount || 0,
          totalPayments: stats._count || 0,
          byStatus: statusStats.reduce((acc, stat) => {
            acc[stat.status] = {
              count: stat._count.status,
              amount: stat._sum.amount || 0
            }
            return acc
          }, {} as Record<string, any>)
        },
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Criar pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPaymentSchema.parse(body)

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Gerar ID de transação único
    const transactionId = generateTransactionId()

    // Criar pagamento
    const payment = await prisma.payment.create({
      data: {
        ...validatedData,
        transactionId,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        status: 'PENDING'
      },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true
          }
        }
      }
    })

    // Log da criação
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_CREATED',
        action: 'create_payment',
        details: {
          paymentId: payment.id,
          clientId: validatedData.clientId,
          amount: validatedData.amount,
          currency: validatedData.currency,
          transactionId
        },
        success: true,
        clientId: validatedData.clientId
      }
    })

    // Gerar link de pagamento (simulado)
    const paymentLink = await generatePaymentLink(payment)

    return NextResponse.json({
      success: true,
      data: {
        ...payment,
        paymentLink
      },
      message: 'Pagamento criado com sucesso'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para gerar ID de transação
function generateTransactionId(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 10)
  return `TXN_${timestamp}_${random}`.toUpperCase()
}

// Função para gerar link de pagamento (simulado)
async function generatePaymentLink(payment: any) {
  // Em produção, integraria com Stripe, Mercado Pago, etc.
  
  // Simular diferentes métodos de pagamento baseado na moeda
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  if (payment.currency === 'BRL') {
    // Mercado Pago para BRL
    return {
      provider: 'Mercado Pago',
      url: `${baseUrl}/api/payments/${payment.id}/mercadopago`,
      qrCode: `${baseUrl}/api/payments/${payment.id}/qr`,
      pixKey: generatePixKey(),
      methods: ['PIX', 'Cartão de Crédito', 'Boleto']
    }
  } else if (payment.currency === 'USD') {
    // Stripe para USD
    return {
      provider: 'Stripe',
      url: `${baseUrl}/api/payments/${payment.id}/stripe`,
      methods: ['Credit Card', 'Bank Transfer']
    }
  } else {
    // PayPal para outras moedas
    return {
      provider: 'PayPal',
      url: `${baseUrl}/api/payments/${payment.id}/paypal`,
      methods: ['PayPal', 'Credit Card']
    }
  }
}

// Gerar chave PIX simulada
function generatePixKey(): string {
  return `visa2any.${Date.now().toString().slice(-6)}@mp.com.br`
}

// POST /api/payments/packages - Criar pacotes de pagamento pré-definidos
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'get_plans') {
      // Retornar pacotes disponíveis
      const packages = [
        {
          id: 'basic_consultation',
          name: 'Consulta Básica',
          description: 'Análise de elegibilidade com IA + Consultoria humana de 30min',
          price: 299,
          currency: 'BRL',
          features: [
            'Análise IA completa de elegibilidade',
            'Consultoria humana de 30 minutos',
            'Relatório detalhado por país',
            'Lista de documentos necessários',
            'Suporte por email 48h'
          ],
          popular: false
        },
        {
          id: 'premium_consultation',
          name: 'Consulta Premium',
          description: 'Análise + Consultoria + Preparação de documentos',
          price: 599,
          currency: 'BRL',
          features: [
            'Tudo do pacote Básico',
            'Consultoria humana de 60 minutos',
            'Revisão e preparação de documentos',
            'Timeline personalizado',
            'Acompanhamento por 30 dias',
            'Suporte prioritário'
          ],
          popular: true
        },
        {
          id: 'vip_full_service',
          name: 'Serviço VIP Completo',
          description: 'Serviço completo hands-off até a aprovação',
          price: 1299,
          currency: 'BRL',
          features: [
            'Tudo do pacote Premium',
            'Preenchimento completo de formulários',
            'Agendamento de entrevistas',
            'Acompanhamento até aprovação',
            'Garantia de reembolso*',
            'Suporte 24/7',
            'Consultor dedicado'
          ],
          popular: false,
          guarantee: true
        },
        // Pacotes internacionais
        {
          id: 'international_basic',
          name: 'International Basic',
          description: 'AI Analysis + 30min Human Consultation',
          price: 99,
          currency: 'USD',
          features: [
            'Complete AI eligibility analysis',
            '30-minute human consultation',
            'Detailed country report',
            'Required documents list',
            '48h email support'
          ],
          popular: false
        },
        {
          id: 'international_premium',
          name: 'International Premium',
          description: 'Analysis + Consultation + Document Prep',
          price: 199,
          currency: 'USD',
          features: [
            'Everything in Basic',
            '60-minute human consultation',
            'Document review and preparation',
            'Personalized timeline',
            '30-day follow-up',
            'Priority support'
          ],
          popular: true
        }
      ]

      return NextResponse.json({
        success: true,
        data: { packages }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao processar planos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}