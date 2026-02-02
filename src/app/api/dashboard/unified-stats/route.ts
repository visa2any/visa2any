import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')
    const periodDate = new Date()
    periodDate.setDate(periodDate.getDate() - period)

    // Data de início da semana (para comparação de clientsStats)
    const weekDate = new Date()
    weekDate.setDate(weekDate.getDate() - 7)

    // === PARALLEL QUERIES FOR EFFICIENCY ===
    const [
      totalClients,
      newClientsThisPeriod,
      activeConsultations,
      completedConsultations,
      totalRevenueAgg,
      revenueThisPeriodAgg,
      clientsThisWeek,
      pendingDocumentsCount,
      pendingAppointmentsCount,
      totalLeads,
      clientsByStatus,
      consultationsByType,
      recentLogs,
      topConsultants,
      interactionsToday
    ] = await Promise.all([
      // 1. Client Counts
      prisma.client.count(),
      prisma.client.count({ where: { createdAt: { gte: periodDate } } }),

      // 2. Consultation Counts
      prisma.consultation.count({ where: { status: { in: ['SCHEDULED', 'IN_PROGRESS'] } } }),
      prisma.consultation.count({ where: { status: 'COMPLETED', createdAt: { gte: periodDate } } }),

      // 3. Revenue (All Time)
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
      }),

      // 4. Revenue (This Period)
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED', paidAt: { gte: periodDate } }
      }),

      // 5. Clients This Week
      prisma.client.count({ where: { createdAt: { gte: weekDate } } }),

      // 6. Pending Tasks (Proxies)
      prisma.document.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),

      // 7. Conversion Rate Base
      prisma.client.count({ where: { status: 'LEAD' } }),

      // 8. Clients by Status Grouping
      prisma.client.groupBy({
        by: ['status'],
        _count: { status: true }
      }),

      // 9. Consultations by Type
      prisma.consultation.groupBy({
        by: ['type'],
        _count: { type: true }
      }),

      // 10. Recent Activity (Automation Logs + Payments Mixed? For now just Logs)
      prisma.automationLog.findMany({
        take: 5,
        orderBy: { executedAt: 'desc' },
        include: { client: { select: { id: true, name: true, email: true } } }
      }),

      // 11. Top Performers (Allocated Clients)
      prisma.user.findMany({
        where: { role: { in: ['CONSULTANT', 'ADMIN', 'MANAGER'] } },
        select: {
          name: true,
          _count: {
            select: { assignedClients: true, consultations: true }
          }
        },
        take: 3,
        orderBy: { assignedClients: { _count: 'desc' } }
      }),

      // 12. Interactions Today
      prisma.interaction.groupBy({
        by: ['channel'],
        _count: { channel: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ])

    // === CALCULATIONS ===

    // Clients Growth (Simple approximation based on period)
    const clientsGrowth = totalClients > 0 ?
      Math.round(((newClientsThisPeriod / totalClients) * 100)) : 0

    // Revenue
    const totalRevenue = totalRevenueAgg._sum.amount || 0
    const revenueThisPeriod = revenueThisPeriodAgg._sum.amount || 0
    // Mocking revenue growth for now as we don't have previous period easily without another query
    const revenueGrowth = 0

    // Average Ticket
    const completedPaymentsCount = await prisma.payment.count({ where: { status: 'COMPLETED' } })
    const averageTicket = completedPaymentsCount > 0 ? (totalRevenue / completedPaymentsCount) : 0

    // Tasks
    const pendingTasks = pendingDocumentsCount + pendingAppointmentsCount
    // Urgent tasks could be documents waiting for > 2 days, etc. For now, just a subset.
    const urgentTasks = Math.round(pendingTasks * 0.3)

    // Conversion
    const convertedClients = totalClients - totalLeads
    const conversionRate = totalClients > 0 ?
      Math.round((convertedClients / totalClients) * 100) : 0

    // Status Counts Format
    const statusCounts = clientsByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
      growth: 0 // Hard to calculate per status without historical snapshots
    }))

    // Consultations Format
    const consultationsFormatted = consultationsByType.map(item => ({
      type: item.type,
      count: item._count.type,
      revenue: 0 // Revenue per consultation type is hard to attribute directly without join
    }))

    // Recent Activity Mapping
    const recentActivity = recentLogs.map(log => ({
      id: log.id,
      type: log.type,
      action: log.action,
      client: log.client || { id: 'unknown', name: 'Sistema', email: '' },
      executedAt: log.executedAt.toISOString(),
      priority: 'medium'
    }))

    // Top Performers Mapping
    const topPerformersFormatted = topConsultants.map(user => ({
      consultant: user.name,
      clientsHandled: user._count.assignedClients,
      consultations: user._count.consultations,
      satisfaction: 5.0 // Placeholder as we don't have rating system yet
    }))

    // Urgent Tasks List (Real Documents Pending)
    const urgentDocs = await prisma.document.findMany({
      where: { status: 'PENDING' },
      take: 5,
      include: { client: { select: { id: true, name: true } } },
      orderBy: { uploadedAt: 'asc' } // Oldest first = Urgent
    })

    const urgentTasksList = urgentDocs.map(doc => ({
      id: doc.id,
      title: `Revisar: ${doc.type}`,
      client: doc.client,
      dueDate: new Date(doc.uploadedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(), // SLA 24h
      priority: 'high',
      type: 'document_review'
    }))

    // Communication Stats
    const whatsappCount = interactionsToday.find(i => i.channel === 'WHATSAPP')?._count.channel || 0
    const emailCount = interactionsToday.find(i => i.channel === 'EMAIL')?._count.channel || 0
    const callCount = interactionsToday.find(i => i.channel === 'PHONE_CALL')?._count.channel || 0

    const communicationStats = {
      whatsappToday: whatsappCount,
      emailsToday: emailCount,
      callsToday: callCount,
      responseTime: 0, // Need tracking
      pendingMessages: 0,
      unreadMessages: 0
    }

    const dashboardStats = {
      overview: {
        totalClients,
        newClientsThisPeriod,
        clientsGrowth,
        activeConsultations,
        completedConsultations,
        conversionRate,
        totalRevenue,
        revenueThisPeriod,
        revenueGrowth,
        averageTicket,
        clientsThisWeek,
        clientsThisMonth: newClientsThisPeriod, // Approximation
        pendingTasks,
        urgentTasks
      },
      clientsByStatus: statusCounts,
      consultationsByType: consultationsFormatted,
      recentActivity,
      topPerformers: topPerformersFormatted,
      urgentTasks: urgentTasksList,
      communicationStats
    }

    return NextResponse.json({
      data: dashboardStats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}