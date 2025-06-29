import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para criar/atualizar requisitos de visto
const visaRequirementSchema = z.object({
  country: z.string().min(1, 'País é obrigatório'),
  visaType: z.string().min(1, 'Tipo de visto é obrigatório'),
  visaSubtype: z.string().optional(),
  requiredDocuments: z.array(z.object({
    type: z.string(),
    name: z.string(),
    required: z.boolean(),
    description: z.string().optional(),
    validityMonths: z.number().optional()
  })),
  processingTime: z.string(),
  fees: z.object({
    government: z.number(),
    service: z.number().optional(),
    currency: z.string().default('USD')
  }),
  eligibilityCriteria: z.array(z.object({
    criterion: z.string(),
    description: z.string(),
    required: z.boolean()
  })),
  commonPitfalls: z.array(z.string()),
  successTips: z.array(z.string()),
  governmentLinks: z.array(z.object({
    name: z.string(),
    url: z.string()
  }))
})

// GET /api/visa-requirements - Listar requisitos de visto

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const visaType = searchParams.get('visaType')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = { isActive: true }
    
    if (country) {
      where.country = { contains: country, mode: 'insensitive' }
    }
    
    if (visaType) {
      where.visaType = { contains: visaType, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { country: { contains: search, mode: 'insensitive' } },
        { visaType: { contains: search, mode: 'insensitive' } },
        { visaSubtype: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar requisitos

    const [requirements, total] = await Promise.all([,      prisma.visaRequirement.findMany({        where,        skip,        take: limit,        orderBy: [,          { country: 'asc' },          { visaType: 'asc' }
        ]
      }),      prisma.visaRequirement.count({ where })
    ])

    // Estatísticas

    const countries = await prisma.visaRequirement.groupBy({      by: ['country'],      _count: { country: true },      where: { isActive: true }
    }),
    const visaTypes = await prisma.visaRequirement.groupBy({      by: ['visaType'],      _count: { visaType: true },      where: { isActive: true }
    }),
    const totalPages = Math.ceil(total / limit),
    return NextResponse.json({      data: {        requirements,        stats: {          totalCountries: countries.length,          totalVisaTypes: visaTypes.length,          totalRequirements: total,          countries: countries.map(c => ({            country: c.country,            count: c._count.country
          })),          visaTypes: visaTypes.map(v => ({            type: v.visaType,            count: v._count.visaType
          }))
        },        pagination: {          page,          limit,          total,          totalPages,          hasMore: page < totalPages
        }
      }
    })

  } catch (error) {    console.error('Erro ao buscar requisitos:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// POST /api/visa-requirements - Criar requisitos de visto

export async function POST(request: NextRequest) {  try {
    const body = await request.json()
const validatedData = visaRequirementSchema.parse(body)

    // Verificar se já existe

    const existing = await prisma.visaRequirement.findUnique({      where: {        country_visaType_visaSubtype: {          country: validatedData.country,          visaType: validatedData.visaType,          visaSubtype: validatedData.visaSubtype || ''
        }
      }
    }),
    if (existing) {      return NextResponse.json(,      { error: 'Dados inválidos' },      { status: 400 }
    )
    }

    // Criar requisitos

    const requirement = await prisma.visaRequirement.create({      data: {
        ...validatedData,        visaSubtype: validatedData.visaSubtype || null,        lastUpdated: new Date()
      }
    })

    // Log da criação

    await prisma.automationLog.create({      data: {        type: 'VISA_REQUIREMENT_CREATED',        action: 'create_visa_requirement',        success: true,        details: {          timestamp: new Date().toISOString(),          action: 'automated_action'
        }
      }
    }),
    return NextResponse.json({      data: requirement,      message: 'Requisitos criados com sucesso'
    }, { status: 201 })

  } catch (error) {    if (error instanceof z.ZodError) {      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro ao criar requisitos:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// PUT /api/visa-requirements - Atualizar requisitos

export async function PUT(request: NextRequest) {  try {
    const body = await request.json()
const { id, ...updateData } = body,    
    if (!id) {      return NextResponse.json(,      { error: 'Dados inválidos' },      { status: 400 }
    )
    },
    const validatedData =  
const requirement = await prisma.visaRequirement.update({      where: { id },      data: {
        ...validatedData,        lastUpdated: new Date()
      }
    })

    // Log da atualização

    await prisma.automationLog.create({      data: {        type: 'VISA_REQUIREMENT_UPDATED',        action: 'update_visa_requirement',        success: true,        details: {          timestamp: new Date().toISOString(),          action: 'automated_action'
        }
      }
    }),
    return NextResponse.json({      data: requirement,      message: 'Requisitos atualizados com sucesso'
    })

  } catch (error) {    console.error('Erro ao atualizar requisitos:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}