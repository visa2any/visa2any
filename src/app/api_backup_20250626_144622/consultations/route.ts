import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthError } from '@/lib/auth'
import { z } from 'zod'

// Schema para criar consultoria
const createConsultationSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório')
  type: z.enum(['AI_ANALYSIS', 'HUMAN_CONSULTATION', 'FOLLOW_UP', 'DOCUMENT_REVIEW', 'INTERVIEW_PREP', 'VIP_SERVICE']),
  scheduledAt: z.string().datetime().optional()
  duration: z.number().min(15).max(480).optional(), // 15 min - 8 horas,  consultantId: z.string().optional()
  notes: z.string().optional()
})

// GET /api/consultations - Listar consultorias
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação,    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const clientId = searchParams.get('clientId')

    const skip = (page - 1) * limit

    // Construir filtros,    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (type && type !== 'ALL') {
      where.type = type
    }

    if (clientId) {
      where.clientId = clientId
    }

    // Buscar consultorias,    const [consultations, total] = await Promise.all([,
      prisma.consultation.findMany({
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
              phone: true,
              targetCountry: true,
              visaType: true,
              status: true
            }
          }
          consultant: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      })
      prisma.consultation.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: {
        consultations
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
    console.error('Erro ao buscar consultorias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// POST /api/consultations - Criar nova consultoria
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação,    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const body = await request.json()
    
    // Validar dados,    const validatedData = createConsultationSchema.parse(body)

    // Verificar se cliente existe,    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { status: 404 }
      )
    }

    // Se for consultoria humana, verificar se consultor existe
    if (validatedData.consultantId) {
      const consultant = await prisma.user.findUnique({
        where: { id: validatedData.consultantId }
      })

      if (!consultant) {
        return NextResponse.json(
          { status: 404 }
        )
      }
    }

    // Criar consultoria,    const consultation = await prisma.consultation.create({
      data: {
        ...validatedData
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        duration: validatedData.duration || 60, // Default 1 hora,        status: validatedData.scheduledAt ? 'SCHEDULED' : 'IN_PROGRESS'
      }
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            targetCountry: true,
            visaType: true
          }
        }
        consultant: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Atualizar status do cliente se necessário,    if (client.status === 'LEAD' || client.status === 'QUALIFIED') {
      await prisma.client.update({
        where: { id: validatedData.clientId }
        data: { status: 'CONSULTATION_SCHEDULED' }
      })
    }

    // Log da criação,    await prisma.automationLog.create({
      data: {
        type: 'CONSULTATION_CREATED',
        action: 'create_consultation',
        clientId: validatedData.clientId,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
        success: true
      }
    })

    return NextResponse.json({
      data: consultation
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

    console.error('Erro ao criar consultoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}