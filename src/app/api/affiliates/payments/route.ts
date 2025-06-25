import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




// GET - Listar pagamentos e comissões
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const affiliateId = url.searchParams.get('affiliateId')
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (affiliateId) {
      where.affiliateId = affiliateId
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    // Buscar comissões
    const [commissions, total] = await Promise.all([,
      prisma.affiliateCommission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          affiliate: {
            select: {
              id: true,
              name: true,
              email: true,
              referralCode: true
            }
          },
          referral: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          payment: true
        }
      }),
      prisma.affiliateCommission.count({ where })
    ])

    // Buscar estatísticas de pagamentos
    const stats = await prisma.affiliateCommission.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: {
        id: true
      },
      where: affiliateId ? { affiliateId } : {}
    })

    const paymentStats = stats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: stat._count.id,
        amount: stat._sum.amount || 0
      }
      return acc
    }, {} as Record<string, { count: number; amount: number }>)

    return NextResponse.json({
      data: {
        commissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: paymentStats
      }
    })

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Processar pagamento em lote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { commissionIds, paymentMethod = 'PIX', notes } = body

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return NextResponse.json({
        error: 'IDs de comissões são obrigatórios'
      }, { status: 400 })
    }

    // Buscar comissões pendentes
    const commissions = await prisma.affiliateCommission.findMany({
      where: {
        id: { in: commissionIds },
        status: 'PENDING'
      },
      include: {
        affiliate: true
      }
    })

    if (commissions.length === 0) {
      return NextResponse.json({
        error: 'Nenhuma comissão pendente encontrada'
      }, { status: 400 })
    }

    // Agrupar comissões por afiliado
    const groupedByAffiliate = commissions.reduce((acc, commission) => {
      const affiliateId = commission.affiliateId
      if (!acc[affiliateId]) {
        acc[affiliateId] = {
          affiliate: commission.affiliate,
          commissions: [],
          totalAmount: 0
        }
      }
      acc[affiliateId].commissions.push(commission)
      acc[affiliateId].totalAmount += commission.amount
      return acc
    }, {} as Record<string, any>)

    // Criar pagamentos para cada afiliado
    const payments = []
    
    for (const affiliateId of Object.keys(groupedByAffiliate)) {
      const group = groupedByAffiliate[affiliateId]
      
      // Gerar código de referência único
      const referenceCode = `PAY${Date.now()}${affiliateId.slice(-4)}`
      
      // Criar pagamento
      const payment = await prisma.affiliatePayment.create({
        data: {
          affiliateId,
          amount: group.totalAmount,
          method: paymentMethod,
          referenceCode,
          status: 'PENDING',
          notes,
          details: {
            paymentMethod: paymentMethod,
            commissionCount: group.commissions.length,
            paymentPeriod: 'manual',
            processedAt: new Date().toISOString()
          }
        }
      })

      // Atualizar comissões para referenciar o pagamento
      await prisma.affiliateCommission.updateMany({
        where: {
          id: { in: group.commissions.map((c: any) => c.id) }
        }
        data: {
          status: 'APPROVED',
          paymentId: payment.id
        }
      })

      // Atualizar saldos do afiliado
      await prisma.affiliate.update({
        where: { id: affiliateId }
        data: {
          pendingEarnings: { decrement: group.totalAmount }
        }
      })

      payments.push(payment)
    }

    // TODO: Integrar com sistema de pagamento (PIX, transferência, etc.)
    // await processPayments(payments)

    return NextResponse.json({
      data: {
        payments
        message: `${payments.length} pagamento(s) criado(s) com sucesso`,
      }
    })

  } catch (error) {
    console.error('Erro ao processar pagamentos:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Atualizar status de pagamento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status, transactionId, receipt, notes } = body

    if (!paymentId || !status) {
      return NextResponse.json({
        error: 'ID do pagamento e status são obrigatórios'
      }, { status: 400 })
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        error: 'Status inválido'
      }, { status: 400 })
    }

    // Atualizar pagamento
    const updateData: any = {
      status,
      notes
    }

    if (status === 'COMPLETED') {
      updateData.processedAt = new Date()
      
      if (transactionId) {
        updateData.transactionId = transactionId
      }
      
      if (receipt) {
        updateData.receipt = receipt
      }
    }

    const payment = await prisma.affiliatePayment.update({
      where: { id: paymentId }
      data: updateData,
      include: {
        affiliate: true,
        commissions: true
      }
    })

    // Se pagamento foi completado, atualizar comissões e afiliado
    if (status === 'COMPLETED') {
      // Marcar comissões como pagas
      await prisma.affiliateCommission.updateMany({
        where: { paymentId }
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      })

      // Atualizar saldos do afiliado
      await prisma.affiliate.update({
        where: { id: payment.affiliateId }
        data: {
          paidEarnings: { increment: payment.amount }
        }
      })
    }

    // Se pagamento falhou, reverter comissões
    if (status === 'FAILED' || status === 'CANCELLED') {
      await prisma.affiliateCommission.updateMany({
        where: { paymentId }
        data: {
          status: 'PENDING',
          paymentId: null
        }
      })

      // Reverter saldos do afiliado
      await prisma.affiliate.update({
        where: { id: payment.affiliateId }
        data: {
          pendingEarnings: { increment: payment.amount }
        }
      })
    }

    // TODO: Enviar notificação para o afiliado
    // await sendPaymentNotification(payment)

    return NextResponse.json({
      data: payment
    })

  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}