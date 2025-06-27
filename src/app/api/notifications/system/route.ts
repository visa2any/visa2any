import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// GET /api/notifications/system - Get system notifications for current user

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request),    if (!user) {,      return NextResponse.json(,        { status: 401 }
      )
    },
    const userId = user.id

    // Get recent automation logs that should generate notifications

    const recentLogs = await prisma.automationLog.findMany({,      where: {,        executedAt: {,          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        },        type: {,          in: [,            'EMAIL_SENT',            'WHATSAPP_SENT', ,            'ANALYSIS_COMPLETED',            'DOCUMENT_VALIDATED',            'PAYMENT_CONFIRMED',            'CLIENT_STATUS_CHANGED'
          ]
        }
      },      include: {,        client: {,          select: {,            id: true,            name: true,            email: true
          }
        }
      },      orderBy: {,        executedAt: 'desc'
      },      take: 10
    })

    // Convert automation logs to notifications

    const notifications =  
const baseNotification = {,        type: 'info' as const,        title: '',        message: '',        actionUrl: '',        actionLabel: ''
      },
      switch (log.type) {,        case 'EMAIL_SENT':,          return {
            ...baseNotification,            type: 'success' as const,            title: 'Email enviado',            message: `Email enviado para ${log.client?.name || 'cliente'}`,            actionUrl: `/admin/clients`,            actionLabel: 'Ver cliente'
          },
        case 'WHATSAPP_SENT':,          return {
            ...baseNotification,            type: 'success' as const,            title: 'WhatsApp enviado',            message: `Mensagem WhatsApp enviada para ${log.client?.name || 'cliente'}`,            actionUrl: `/admin/clients`,            actionLabel: 'Ver cliente'
          },
        case 'ANALYSIS_COMPLETED':,          return {
            ...baseNotification,            type: 'success' as const,            title: 'Análise concluída',            message: `Análise de elegibilidade concluída para ${log.client?.name || 'cliente'}`,            actionUrl: `/admin/consultations`,            actionLabel: 'Ver análise'
          },
        case 'DOCUMENT_VALIDATED':,          const details = log.details as { documentName?: string },          return {
            ...baseNotification,            type: 'success' as const,            title: 'Documento validado',            message: `Documento ${details?.documentName || 'novo'} foi validado`,            actionUrl: `/admin/documents`,            actionLabel: 'Ver documentos'
          },
        case 'PAYMENT_CONFIRMED':,          return {
            ...baseNotification,            type: 'success' as const,            title: 'Pagamento confirmado',            message: `Pagamento recebido de ${log.client?.name || 'cliente'}`,            actionUrl: `/admin/payments`,            actionLabel: 'Ver pagamentos'
          },
        case 'CLIENT_STATUS_CHANGED':,          const statusDetails = log.details as { newStatus?: string },          return {
            ...baseNotification,            type: 'info' as const,            title: 'Status atualizado',            message: `Status do cliente ${log.client?.name || 'cliente'} foi atualizado para ${statusDetails?.newStatus || 'novo status'}`,            actionUrl: `/admin/clients`,            actionLabel: 'Ver cliente'
          },
        default:,          return {
            ...baseNotification,            title: 'Nova atividade',            message: `Nova atividade registrada no sistema`,            actionUrl: `/admin`,            actionLabel: 'Ver dashboard'
          }
      }
    })

    // Also check for pending tasks that need attention

    const pendingConsultations = await prisma.consultation.count({,      where: {,        status: 'SCHEDULED',        scheduledAt: {,          lte: new Date(Date.now() + 60 * 60 * 1000) // Next hour
        }
      }
    }),
    const pendingDocuments = await prisma.document.count({,      where: {,        status: 'PENDING'
      }
    })

    // Add system notifications for pending items

    if (pendingConsultations > 0) {,      notifications.push({,        type: 'warning' as const,        title: 'Consultorias pendentes',        message: `${pendingConsultations} consultoria${pendingConsultations > 1 ? 's' : ''} agendada${pendingConsultations > 1 ? 's' : ''} para a próxima hora`,        actionUrl: '/admin/consultations',        actionLabel: 'Ver consultorias'
      })
    },
    if (pendingDocuments > 0) {,      notifications.push({,        type: 'info' as const,        title: 'Documentos pendentes',        message: `${pendingDocuments} documento${pendingDocuments > 1 ? 's' : ''} aguardando validação`,        actionUrl: '/admin/documents',        actionLabel: 'Ver documentos'
      })
    },
    return NextResponse.json({,      notifications: notifications.slice(0, 5) // Return max 5 notifications    })

  } catch (error) {,    console.error('Erro ao buscar notificações do sistema:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// POST /api/notifications/system - Mark system notifications as read (optional)

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request),    if (!user) {,      return NextResponse.json(,        { status: 401 }
      )
    },
    const body = await request.json()
const { notificationIds } = body

    // In a real implementation

    you might want to store read status
    // For now
    we'll just return success,    console.log(`User ${user.id} marked notifications as read:`, notificationIds)

    return NextResponse.json({,      message: 'Notificações marcadas como lidas'
    })

  } catch (error) {,    console.error('Erro ao marcar notificações como lidas:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}