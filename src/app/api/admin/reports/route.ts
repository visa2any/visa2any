import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthError } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        // 1. Verify Authentication
        const user = await verifyAuth(request)
        if (!user || user.role === 'STAFF') {
            // Assuming only Admin/Manager/Consultant can see full reports? 
            // Adjust role check as needed. For now allow non-staff (maybe just internal users)
            if (!user) return createAuthError('Acesso não autorizado')
        }

        const { searchParams } = new URL(request.url)
        const periodDays = parseInt(searchParams.get('period') || '30')

        // Date ranges
        const now = new Date()
        const periodStart = new Date()
        periodStart.setDate(now.getDate() - periodDays)

        // Previous period for growth calculation
        const previousPeriodStart = new Date(periodStart)
        previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays)

        // === PARALLEL DATA FETCHING ===
        const [
            totalClients,
            newClients,
            prevNewClients,
            totalConsultations,
            newConsultations,
            prevNewConsultations,
            completedPayments,
            prevCompletedPayments,
            clientsByStatus,
            clientsByCountry,
            revenueByMonth,
            topConsultantsData
        ] = await Promise.all([
            // 1. Client Metrics
            prisma.client.count(),
            prisma.client.count({ where: { createdAt: { gte: periodStart } } }),
            prisma.client.count({ where: { createdAt: { gte: previousPeriodStart, lt: periodStart } } }),

            // 2. Consultation Metrics
            prisma.consultation.count(),
            prisma.consultation.count({ where: { createdAt: { gte: periodStart } } }),
            prisma.consultation.count({ where: { createdAt: { gte: previousPeriodStart, lt: periodStart } } }),

            // 3. Revenue Metrics
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED', paidAt: { gte: periodStart } }
            }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED', paidAt: { gte: previousPeriodStart, lt: periodStart } }
            }),

            // 4. Conversion Funnel (Approximation via Status)
            prisma.client.groupBy({
                by: ['status'],
                _count: { status: true }
            }),

            // 5. Clients by Country (Top 5)
            prisma.client.groupBy({
                by: ['targetCountry'],
                _count: { targetCountry: true },
                orderBy: { _count: { targetCountry: 'desc' } },
                take: 6
            }),

            // 6. Revenue Trend (Last 6 months) - simplified, usually requires raw query for efficient date grouping
            // For now, we will do a rough check of last 6 months via simple loop or raw query if supported
            // Let's use a simpler approach: fetch aggregated payments and map in JS or use separate queries (expensive)
            // Attempting aggregation by month is hard in Prisma without raw SQL. 
            // We will stick to fetching payments and aggregating in JS for the graph for now (assuming not huge valid dataset yet)
            prisma.payment.findMany({
                where: {
                    status: 'COMPLETED',
                    paidAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
                },
                select: { amount: true, paidAt: true }
            }),

            // 7. Top Consultants
            prisma.user.findMany({
                where: { role: { in: ['CONSULTANT', 'ADMIN', 'MANAGER'] } },
                select: {
                    name: true,
                    _count: {
                        select: { filteredConsultations: { where: { status: 'COMPLETED' } } as any } // Workaround if relation name differs
                    },
                    // Just fetching users, we'll need to join manually or assume `consultations` relation exists
                    consultations: { select: { id: true }, where: { status: 'COMPLETED' } }
                },
                take: 4
            })
        ])

        // === CALCULATIONS ===

        // Growth Rates
        const clientsGrowth = prevNewClients > 0 ? ((newClients - prevNewClients) / prevNewClients) * 100 : 0
        const consultationsGrowth = prevNewConsultations > 0 ? ((newConsultations - prevNewConsultations) / prevNewConsultations) * 100 : 0

        const revenueCurrent = completedPayments._sum.amount || 0
        const revenuePrev = prevCompletedPayments._sum.amount || 0
        const revenueGrowth = revenuePrev > 0 ? ((revenueCurrent - revenuePrev) / revenuePrev) * 100 : 0

        // Average Ticket
        const paymentCount = await prisma.payment.count({ where: { status: 'COMPLETED', paidAt: { gte: periodStart } } })
        const avgTicket = paymentCount > 0 ? revenueCurrent / paymentCount : 0

        // Conversion Funnel Mapping
        const statusMap = clientsByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status
            return acc
        }, {} as Record<string, number>)

        const funnel = {
            leads: (statusMap['LEAD'] || 0) + (statusMap['QUALIFIED'] || 0) + (statusMap['IN_PROCESS'] || 0) + (statusMap['APPROVED'] || 0),
            qualified: (statusMap['QUALIFIED'] || 0) + (statusMap['IN_PROCESS'] || 0) + (statusMap['APPROVED'] || 0),
            inProcess: (statusMap['IN_PROCESS'] || 0) + (statusMap['APPROVED'] || 0),
            approved: (statusMap['APPROVED'] || 0),
            completed: (statusMap['COMPLETED'] || 0)
        }

        const conversionRate = funnel.leads > 0 ? ((funnel.completed / funnel.leads) * 100) : 0

        // Country Mapping
        const countriesData = clientsByCountry.map(item => ({
            country: item.targetCountry || 'Não informado',
            count: item._count.targetCountry,
            percentage: totalClients > 0 ? (item._count.targetCountry / totalClients) * 100 : 0
        }))

        // Revenue Graph Mapping (Group by Month)
        const revenueGraphMap = new Map<string, { revenue: number, count: number }>()
        revenueByMonth.forEach(p => {
            if (!p.paidAt) return
            const key = p.paidAt.toLocaleString('pt-BR', { month: 'short' })
            const curr = revenueGraphMap.get(key) || { revenue: 0, count: 0 }
            revenueGraphMap.set(key, {
                revenue: curr.revenue + p.amount,
                count: curr.count + 1
            })
        })

        // Fill last 6 months order
        const revenueByPeriod = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = d.toLocaleString('pt-BR', { month: 'short' })
            const data = revenueGraphMap.get(key) || { revenue: 0, count: 0 }
            revenueByPeriod.push({ period: key, clients: data.count, revenue: data.revenue })
        }

        // Top Consultants Mapping
        const topConsultants = topConsultantsData.map(c => ({
            name: c.name,
            consultations: c.consultations.length,
            revenue: 0, // Hard to attribute revenue strictly to consultant without commission table
            rating: 5.0 // Placeholder
        })).sort((a, b) => b.consultations - a.consultations)

        return NextResponse.json({
            period: `Últimos ${periodDays} dias`,
            metrics: {
                totalClients,
                newClients,
                clientsGrowth: Math.round(clientsGrowth * 10) / 10,
                consultations: totalConsultations,
                consultationsGrowth: Math.round(consultationsGrowth * 10) / 10,
                revenue: revenueCurrent,
                revenueGrowth: Math.round(revenueGrowth * 10) / 10,
                conversionRate: Math.round(conversionRate * 10) / 10,
                avgTicket: Math.round(avgTicket),
                avgProcessingTime: 0 // Need calculated field
            },
            conversionFunnel: funnel,
            clientsByCountry: countriesData,
            revenueByPeriod,
            topConsultants
        })

    } catch (error) {
        console.error('Reports API Error:', error)
        return NextResponse.json(
            { error: 'Erro ao gerar relatório' },
            { status: 500 }
        )
    }
}
