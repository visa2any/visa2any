import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthError } from '@/lib/auth'
import { z } from 'zod'

// Schema de validação para criar cliente
const createClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  country: z.string().optional(),
  nationality: z.string().optional(),
  age: z.number().optional(),
  profession: z.string().optional(),
  education: z.string().optional(),
  targetCountry: z.string().optional(),
  visaType: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional()
})

// GET /api/clients - Listar clientes
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar clientes com paginação
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedUser: {
            select: { id: true, name: true, email: true }
          },
          consultations: {
            select: { 
              id: true,
              type: true,
              status: true,
              scheduledAt: true,
              score: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          payments: {
            select: { 
              id: true,
              amount: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              consultations: true,
              documents: true,
              interactions: true
            }
          }
        }
      }),
      prisma.client.count({ where })
    ])

    // Calcular métricas
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      data: {
        clients,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }

    const body = await request.json()
    
    // Validar dados
    const validatedData = createClientSchema.parse(body)

    // Verificar se email já existe
    const existingClient = await prisma.client.findUnique({
      where: { email: validatedData.email }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar cliente
    const client = await prisma.client.create({
      data: {
        ...validatedData,
        status: 'LEAD'
      },
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Log da criação
    await prisma.automationLog.create({
      data: {
        type: 'CLIENT_CREATED',
        action: 'create_client',
        clientId: client.id,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action'
        },
        success: true
      }
    })

    return NextResponse.json({
      data: client
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}