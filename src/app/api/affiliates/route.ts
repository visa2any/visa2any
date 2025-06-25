import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'



// Função para gerar código de referência único
function generateReferralCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const namePrefix = cleanName.substring(0, 4)
  const timestamp = Date.now().toString().slice(-4)
  return `${namePrefix}${timestamp}`
}

// GET - Listar afiliados (Admin)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    const tier = url.searchParams.get('tier')
    const search = url.searchParams.get('search')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (tier && tier !== 'all') {
      where.tier = tier
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { referralCode: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar afiliados
    const [affiliates, total] = await Promise.all([,
      prisma.affiliate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              referrals: true,
              clicks: true,
              commissions: true
            }
          }
        }
      }),
      prisma.affiliate.count({ where })
    ])

    // Buscar estatísticas gerais
    const stats = await prisma.affiliate.aggregate({
      _count: { id: true },
      _sum: {
        totalEarnings: true,
        pendingEarnings: true,
        totalClicks: true,
        totalConversions: true
      }
    })

    const activeCount = await prisma.affiliate.count({
      where: { status: 'ACTIVE' }
    })

    const pendingCount = await prisma.affiliate.count({
      where: { status: 'PENDING' }
    })

    return NextResponse.json({
      data: {
        affiliates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
        stats: {
          totalAffiliates: stats._count.id || 0,
          activeAffiliates: activeCount,
          pendingAffiliates: pendingCount,
          totalCommissions: stats._sum.totalEarnings || 0,
          pendingCommissions: stats._sum.pendingEarnings || 0,
          totalClicks: stats._sum.totalClicks || 0,
          totalConversions: stats._sum.totalConversions || 0
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar afiliados:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Criar novo afiliado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      company,
      website,
      bio,
      socialMedia = {}
      commissionRate = 0.10,
    } = body

    // Validações básicas
    if (!name || !email) {
      return NextResponse.json({
        error: 'Nome e email são obrigatórios'
      }, { status: 400 })
    }

    // Verificar se email já existe
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { email }
    })

    if (existingAffiliate) {
      return NextResponse.json({
        error: 'Email já cadastrado'
      }, { status: 400 })
    }

    // Gerar código de referência único
    let referralCode = generateReferralCode(name)
    let attempts = 0
    
    while (attempts < 10) {
      const existing = await prisma.affiliate.findUnique({
        where: { referralCode }
      })
      
      if (!existing) break
      
      attempts++
      referralCode = generateReferralCode(name) + attempts
    }

    // Criar afiliado
    const affiliate = await prisma.affiliate.create({
      data: {
        name,
        email,
        phone,
        company,
        website,
        bio,
        socialMedia,
        referralCode,
        commissionRate,
        paymentDetails: {}, // Campo obrigatório - dados bancários/PIX vazios por enquanto
        status: 'PENDING', // Aguardando aprovação
        tier: 'BRONZE'
      }
    })

    // TODO: Enviar email de confirmação
    // await sendAffiliateWelcomeEmail(affiliate)

    return NextResponse.json({
      data: affiliate
      message: 'Inscrição enviada com sucesso! Entraremos em contato em até 24 horas.'
    })

  } catch (error) {
    console.error('Erro ao criar afiliado:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Atualizar afiliado (Admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({
        error: 'ID do afiliado é obrigatório'
      }, { status: 400 })
    }

    const affiliate = await prisma.affiliate.update({
      where: { id }
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      data: affiliate
    })

  } catch (error) {
    console.error('Erro ao atualizar afiliado:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}