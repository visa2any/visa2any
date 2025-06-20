import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para criar interação
const createInteractionSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  type: z.enum(['EMAIL', 'WHATSAPP', 'PHONE_CALL', 'SMS', 'IN_PERSON', 'AUTOMATED_EMAIL', 'AUTOMATED_WHATSAPP', 'FOLLOW_UP', 'REMINDER']),
  channel: z.string().min(1, 'Canal é obrigatório'),
  direction: z.enum(['inbound', 'outbound']),
  subject: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  response: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional()
})

// GET /api/interactions - Listar interações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const clientId = searchParams.get('clientId')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (type && type !== 'ALL') {
      where.type = type
    }

    // Buscar interações
    const [interactions, total] = await Promise.all([
      prisma.interaction.findMany({
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
              status: true
            }
          }
        }
      }),
      prisma.interaction.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        interactions,
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
    console.error('Erro ao buscar interações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/interactions - Criar nova interação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validatedData = createInteractionSchema.parse(body)

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

    // Criar interação
    const interaction = await prisma.interaction.create({
      data: {
        ...validatedData,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        completedAt: validatedData.completedAt ? new Date(validatedData.completedAt) : null
      },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            status: true
          }
        }
      }
    })

    // Log da criação
    await prisma.automationLog.create({
      data: {
        type: 'INTERACTION_CREATED',
        action: 'create_interaction',
        details: {
          interactionId: interaction.id,
          clientId: validatedData.clientId,
          type: validatedData.type,
          channel: validatedData.channel,
          direction: validatedData.direction
        },
        success: true,
        clientId: validatedData.clientId
      }
    })

    return NextResponse.json({
      success: true,
      data: interaction
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

    console.error('Erro ao criar interação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}