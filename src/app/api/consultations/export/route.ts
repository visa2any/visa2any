import { NextRequest, NextResponse } from 'next/server',import { prisma } from '@/lib/prisma',import { verifyAuth } from '@/lib/auth',
export const dynamic = 'force-dynamic',
export async function GET(request: NextRequest) {,  try {
    // Verificar autenticação,    const user = await verifyAuth(request),    if (!user) {,      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todas as consultorias,    const consultations = await prisma.consultation.findMany({,      include: {,        client: {,          select: {,            name: true,            email: true,            phone: true
          }
        },        consultant: {,          select: {,            name: true,            email: true
          }
        }
      },      orderBy: {,        createdAt: 'desc'
      }
    })

    // Gerar CSV,    const csvRows = [
      // Header,      [
        'ID',        'Tipo',        'Status', ,        'Cliente',        'Email Cliente',        'Telefone Cliente',        'Consultor',        'Data Agendada',        'Data Realizada',        'Duração (min)',        'Notas',        'Score',        'Data Criação'
      ].join(',')
      
      // Dados das consultorias
      ...consultations.map(consultation => [,        consultation.id,        consultation.type,        consultation.status
        `"${consultation.client?.name || 'N/A'}"`,        consultation.client?.email || '',        consultation.client?.phone || ''
        `"${consultation.consultant?.name || 'Não atribuído'}"`,        consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().split('T')[0] : '',        consultation.completedAt ? new Date(consultation.completedAt).toISOString().split('T')[0] : '',        consultation.duration || ''
        `"${consultation.notes || ''}"`,        consultation.score || '',        consultation.createdAt.toISOString().split('T')[0]
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    
    // Adicionar BOM para suporte ao UTF-8 no Excel,    const bom = '\uFEFF',    const finalCsv = bom + csvContent,    
    return new NextResponse(finalCsv, {,      headers: {,        'Content-Type': 'text/csv; charset=utf-8',        'Content-Disposition': `attachment; filename="consultorias-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {,    console.error('Erro no export de consultorias:', error),    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}