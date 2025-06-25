import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')
    
    const periodDate = new Date()
    periodDate.setDate(periodDate.getDate() - period)

    // Overview Stats
    const totalClients = await prisma.client.count()
    const newClientsThisPeriod = await prisma.client.count({
      where: { createdAt: { gte: periodDate } },
    })
    
    const clientsGrowth = totalClients > 0 ? 
      Math.round(((newClientsThisPeriod / totalClients) * 100)) : 0

    const activeConsultations = await prisma.consultation.count({
      where: { 
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
    })

    const completedConsultations = await prisma.consultation.count({
      where: { 
        status: 'COMPLETED',
        createdAt: { gte: periodDate },
      },
    })

    // Revenue calculations (mock data for now)
    const totalRevenue = 150000
    const revenueThisPeriod = 45000
    const revenueGrowth = 15
    const averageTicket = 2500

    // Client stats
    const clientsThisWeek = await prisma.client.count({
      where: { 
        createdAt: { 
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ,
        },
      },
    })

    const clientsThisMonth = await prisma.client.count({
      where: { 
        createdAt: { 
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ,
        },
      },
    })

    // Tasks (mock data)
    const pendingTasks = 15
    const urgentTasks = 5

    // Conversion rate calculation
    const totalLeads = await prisma.client.count({
      where: { status: 'LEAD' },
    })
    const convertedClients = totalClients - totalLeads
    const conversionRate = totalClients > 0 ? 
      Math.round((convertedClients / totalClients) * 100) : 0

    // Clients by status
    const clientsByStatus = await prisma.client.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const statusCounts = clientsByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
      growth: Math.floor(Math.random() * 20) - 10 // Mock growth data
    }))

    // Consultations by type (mock data)
    const consultationsByType = [
      { type: 'Inicial', count: 45, revenue: 22500 },
      { type: 'Revisão', count: 23, revenue: 11500 },
      { type: 'Urgente', count: 12, revenue: 18000 },
      { type: 'Especializada', count: 8, revenue: 12000 }
    ]

    // Recent activity
    const recentActivity = [
      {
        id: '1',
        type: 'client_created',
        action: 'Novo cliente cadastrado',
        client: { id: '1', name: 'João Silva', email: 'joao@email.com' },
        executedAt: new Date().toISOString(),
        priority: 'medium' as const,
      },
      {
        id: '2',
        type: 'consultation_completed',
        action: 'Consulta finalizada',
        client: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
        executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high' as const,
      },
      {
        id: '3',
        type: 'document_uploaded',
        action: 'Documento enviado',
        client: { id: '3', name: 'Pedro Costa', email: 'pedro@email.com' },
        executedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 'low' as const,
      }
    ]

    // Top performers (mock data)
    const topPerformers = [
      { consultant: 'Ana Silva', clientsHandled: 23, revenue: 57500, satisfaction: 4.8 },
      { consultant: 'Carlos Santos', clientsHandled: 19, revenue: 47500, satisfaction: 4.6 },
      { consultant: 'Lucia Costa', clientsHandled: 17, revenue: 42500, satisfaction: 4.7 }
    ]

    // Urgent tasks (mock data)
    const urgentTasksList = [
      {
        id: '1',
        title: 'Revisão de documentos - João Silva',
        client: { id: '1', name: 'João Silva' },
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high' as const,
        type: 'document_review',
      },
      {
        id: '2',
        title: 'Consulta de acompanhamento - Maria Santos',
        client: { id: '2', name: 'Maria Santos' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high' as const,
        type: 'consultation',
      }
    ]

    // Communication stats (mock data)
    const communicationStats = {
      whatsappToday: 45,
      emailsToday: 23,
      callsToday: 12,
      responseTime: 2.3,
      pendingMessages: 8,
      unreadMessages: 15,
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
        clientsThisMonth,
        pendingTasks,
        urgentTasks,
      },
      clientsByStatus: statusCounts,
      consultationsByType,
      recentActivity,
      topPerformers,
      urgentTasks: urgentTasksList,
      communicationStats,
    }

    return NextResponse.json({
      data: dashboardStats,
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}