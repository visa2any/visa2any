import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { withErrorAlert } from '@/lib/api-wrapper'
import { verifyAuth, createAuthError } from '@/lib/auth'

async function getClientsHandler(request: NextRequest) {
  // 1. Verify Auth
  const user = await verifyAuth(request)
  if (!user) return createAuthError('Acesso não autorizado')

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
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { profession: { contains: search, mode: 'insensitive' } },
      { nationality: { contains: search, mode: 'insensitive' } },
      { targetCountry: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (status && status !== 'ALL') {
    where.status = status
  }
  if (country && country !== 'ALL') {
    where.targetCountry = country
  }

  const [clients, total] = await Promise.all([
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
}

async function createClientHandler(request: NextRequest) {
  // 1. Verify Auth
  const user = await verifyAuth(request)
  if (!user) return createAuthError('Acesso não autorizado')

  const body = await request.json()

  // Validação básica
  const { name, email, phone, profession, nationality, targetCountry, visaType } = body

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Nome e email são obrigatórios' },
      { status: 400 }
    )
  }

  // Verificar se cliente já existe
  const existingClient = await prisma.client.findFirst({
    where: { email }
  })

  if (existingClient) {
    return NextResponse.json(
      { error: 'Cliente já cadastrado com este email' },
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
      notes: body.notes || null,
      assignedUserId: user.id // Auto-assign creator
    }
  })

  return NextResponse.json({
    data: client
  }, { status: 201 })
}

export const GET = withErrorAlert(getClientsHandler, 'GET /api/admin/clients')
export const POST = withErrorAlert(createClientHandler, 'POST /api/admin/clients')