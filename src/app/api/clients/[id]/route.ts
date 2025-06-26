import { NextRequest, NextResponse } from 'next/server',import { prisma } from '@/lib/prisma',import { verifyAuth, createAuthError } from '@/lib/auth',import { z } from 'zod'

// Schema para atualizar cliente,const updateClientSchema = z.object({,  name: z.string().min(2).optional(),  email: z.string().email().optional(),  phone: z.string().optional(),  country: z.string().optional(),  nationality: z.string().optional(),  age: z.number().min(0).max(120).optional(),  profession: z.string().optional(),  education: z.string().optional(),  targetCountry: z.string().optional(),  visaType: z.string().optional(),  status: z.enum(['LEAD', 'QUALIFIED', 'CONSULTATION_SCHEDULED', 'IN_PROCESS', 'DOCUMENTS_PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'INACTIVE']).optional(),  score: z.number().min(0).max(100).optional(),  notes: z.string().optional(),  source: z.string().optional(),  assignedUserId: z.string().optional()
})

// GET /api/clients/[id] - Buscar cliente específico,export async function GET(,  request: NextRequest,  { params }: { params: { id: string } }
) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return createAuthError('Acesso não autorizado')
    },    const { id } = params,
    const client = await prisma.client.findUnique({,      where: { id },      include: {,        assignedUser: {,          select: { id: true, name: true, email: true, role: true }
        },        consultations: {,          orderBy: { createdAt: 'desc' },          include: {,            consultant: {,              select: { id: true, name: true, email: true }
            }
          }
        },        payments: {,          orderBy: { createdAt: 'desc' }
        },        documents: {,          orderBy: { uploadedAt: 'desc' },          include: {,            uploadedBy: {,              select: { id: true, name: true }
            }
          }
        },        interactions: {,          orderBy: { createdAt: 'desc' },          take: 50 // Últimas 50 interações
        }
      }
    }),
    if (!client) {,      return NextResponse.json(,        { status: 404 }
      )
    },
    return NextResponse.json({,      data: client
    })

  } catch (error) {,    console.error('Erro ao buscar cliente:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// PATCH /api/clients/[id] - Atualizar campo específico (inline edit),export async function PATCH(,  request: NextRequest,  { params }: { params: { id: string } }
) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return createAuthError('Acesso não autorizado')
    },    const { id } = params,    const body = await request.json()

    // Validar dados,    const validatedData = updateClientSchema.parse(body)

    // Verificar se cliente existe,    const existingClient = await prisma.client.findUnique({,      where: { id }
    }),
    if (!existingClient) {,      return NextResponse.json(,        { status: 404 }
      )
    }

    // Atualizar cliente,    const updatedClient = await prisma.client.update({,      where: { id },      data: validatedData,      include: {,        assignedUser: {,          select: { id: true, name: true, email: true }
        }
      }
    })

    // Log da atualização,    await prisma.automationLog.create({,      data: {,        type: 'CLIENT_UPDATED',        action: 'inline_edit',        clientId: id,        details: {,          timestamp: new Date().toISOString(),          action: 'automated_action'
        },        success: true
      }
    }),
    return NextResponse.json({,      data: updatedClient
    })

  } catch (error) {,    if (error instanceof z.ZodError) {,      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro ao atualizar cliente:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Atualizar cliente completo,export async function PUT(,  request: NextRequest,  { params }: { params: { id: string } }
) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return createAuthError('Acesso não autorizado')
    },    const { id } = params,    const body = await request.json()

    // Validar dados,    const validatedData = updateClientSchema.parse(body)

    // Verificar se cliente existe,    const existingClient = await prisma.client.findUnique({,      where: { id }
    }),
    if (!existingClient) {,      return NextResponse.json(,        { status: 404 }
      )
    }

    // Atualizar cliente,    const updatedClient = await prisma.client.update({,      where: { id },      data: validatedData,      include: {,        assignedUser: {,          select: { id: true, name: true, email: true }
        }
      }
    })

    // Log da atualização,    await prisma.automationLog.create({,      data: {,        type: 'CLIENT_UPDATED',        action: 'update_client',        clientId: id,        details: {,          timestamp: new Date().toISOString(),          action: 'automated_action'
        },        success: true
      }
    }),
    return NextResponse.json({,      data: updatedClient
    })

  } catch (error) {,    if (error instanceof z.ZodError) {,      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro ao atualizar cliente:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Deletar cliente,export async function DELETE(,  request: NextRequest,  { params }: { params: { id: string } }
) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return createAuthError('Acesso não autorizado')
    },    const { id } = params

    // Verificar se cliente existe,    const existingClient = await prisma.client.findUnique({,      where: { id }
    }),
    if (!existingClient) {,      return NextResponse.json(,        { status: 404 }
      )
    }

    // Deletar cliente (cascade irá deletar relacionamentos),    await prisma.client.delete({,      where: { id }
    })

    // Log da deleção,    await prisma.automationLog.create({,      data: {,        type: 'CLIENT_DELETED',        action: 'delete_client',        success: true,        details: {,          timestamp: new Date().toISOString(),          action: 'automated_action'
        }
      }
    }),
    return NextResponse.json({,      message: 'Cliente deletado com sucesso'
    })

  } catch (error) {,    console.error('Erro ao deletar cliente:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}