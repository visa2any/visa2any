import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from 'next/server'

export const dynamic = 'force-dynamic',

export async function GET(request: NextRequest) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    },
    const { searchParams } = new URL(request.url)
    const period =  
const startDate = new Date(),    startDate.setDate(startDate.getDate() - period)

    // Buscar dados do período,    const [clients, consultations, payments] = await Promise.all([,      prisma.client.findMany({,        where: {,          createdAt: { gte: startDate }
        },        select: {,          id: true,          name: true,          email: true,          phone: true,          status: true,          createdAt: true,          assignedUserId: true
        }
      }),      prisma.consultation.findMany({,        where: {,          createdAt: { gte: startDate }
        },        include: {,          client: {,            select: { name: true, email: true }
          }
        }
      }),      prisma.payment.findMany({,        where: {,          createdAt: { gte: startDate }
        },        select: {,          amount: true,          currency: true,          status: true,          createdAt: true
        }
      })
    ])

    // Gerar CSV,    const csvRows = [
      // Header,      ['Tipo', 'Data', 'Cliente', 'Email', 'Status', 'Valor', 'Descrição'].join(','),      
      // Clientes,      ...clients.map(client => [,        'Cliente',        client.createdAt.toISOString().split('T')[0]
        `"${client.name}"`,        client.email,        client.status,        '',        'Novo cliente cadastrado'
      ].join(','))
      
      // Consultorias,      ...consultations.map(consultation => [,        'Consultoria',        consultation.createdAt.toISOString().split('T')[0]
        `"${consultation.client?.name || 'N/A'}"`,        consultation.client?.email || '',        consultation.status,        ''
        `Consultoria ${consultation.type}`
      ].join(','))
      
      // Pagamentos,      ...payments.map(payment => [,        'Pagamento',        payment.createdAt.toISOString().split('T')[0]
        '',        '',        payment.status
        `${payment.amount} ${payment.currency}`,        'Pagamento recebido'
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    
    // Retornar CSV como download,    return new NextResponse(csvContent, {,      headers: {,        'Content-Type': 'text/csv; charset=utf-8',        'Content-Disposition': `attachment; filename="dashboard-export-${period}d.csv"`
      }
    })

  } catch (error) {,    console.error('Erro no export:', error),    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}