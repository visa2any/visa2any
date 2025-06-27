import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const country = searchParams.get('country') || ''
    const offset = (page - 1) * limit

    // Construir filtros

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { profession: { contains: search } },
        { nationality: { contains: search } },
        { targetCountry: { contains: search } }
      ]
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (country && country !== 'ALL') {
      where.targetCountry = country
    }

    // Buscar clientes com fallback em caso de erro

    let clients: any[] = []
    let total = 0

    try {
      [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profession: true,
            nationality: true,
            targetCountry: true,
            visaType: true,
            status: true,
            score: true,
            createdAt: true,
            updatedAt: true,
            notes: true
          }
        }),
        prisma.client.count({ where })
      ])
    } catch (dbError) {
      console.error('Erro na consulta do banco:', dbError)
      // Retornar dados simulados em caso de erro
      clients = []
      total = 0
    }

    return NextResponse.json({
      data: {
        clients,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: offset + clients.length < total,
          hasPrev: page > 1,
          totalItems: total
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error)
    
    // Retornar resposta de fallback
    
    return NextResponse.json({
      data: {
        clients: [],
        pagination: {
          current: 1,
          total: 0,
          hasNext: false,
          hasPrev: false,
          totalItems: 0
        }
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    
    const { name, email, phone, profession, nationality, targetCountry, visaType } = body
    
    if (!name || !email) {
      return NextResponse.json(
        {
          error: 'Nome e email são obrigatórios'
        },
        { status: 400 }
      )
    }

    // Verificar se cliente já existe

    const existingClient = await prisma.client.findFirst({
      where: { email }
    })

    if (existingClient) {
      return NextResponse.json(
        {
          error: 'Cliente já cadastrado com este email'
        },
        { status: 409 }
      )
    }

    // Criar cliente

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        profession: profession || null,
        nationality: nationality || null,
        targetCountry: targetCountry || null,
        visaType: visaType || null,
        status: 'LEAD',
        score: 0,
        notes: body.notes || null
      }
    })

    return NextResponse.json({
      data: client
    })

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}