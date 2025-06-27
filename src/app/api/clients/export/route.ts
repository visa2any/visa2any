import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from 'next/server'

export const dynamic = 'force-dynamic',

export async function GET(request: NextRequest) {,  try {
    // Verificar autenticação
    const user = await verifyAuth(request),    if (!user) {,      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todos os clientes

    const clients = await prisma.client.findMany({,      select: {,        id: true,        name: true,        email: true,        phone: true,        country: true,        nationality: true,        age: true,        profession: true,        education: true,        targetCountry: true,        visaType: true,        status: true,        createdAt: true,        assignedUser: {,          select: {,            name: true
          }
        },        _count: {,          select: {,            consultations: true,            payments: true
          }
        }
      },      orderBy: {,        createdAt: 'desc'
      }
    })

    // Gerar CSV

    const csvRows = [
      // Header,      [,        'ID',        'Nome',        'Email', ,        'Telefone',        'País',        'Nacionalidade',        'Idade',        'Profissão',        'Educação',        'País Destino',        'Tipo de Visto',        'Status',        'Consultor',        'Consultorias',        'Pagamentos',        'Data Cadastro'
      ].join(',')
      
      // Dados dos clientes,      ...clients.map(client => [,        client.id
        `"${client.name}"`,        client.email,        client.phone || '',        client.country || '',        client.nationality || '',        client.age || ''
        `"${client.profession || ''}"`,        client.education || '',        client.targetCountry || '',        client.visaType || '',        client.status
        `"${client.assignedUser?.name || 'Não atribuído'}"`,        client._count.consultations,        client._count.payments,        client.createdAt.toISOString().split('T')[0]
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    
    // Adicionar BOM para suporte ao UTF-8 no Excel
    
    const bom =  
const finalCsv = bom + csvContent,    
    return new NextResponse(finalCsv, {,      headers: {,        'Content-Type': 'text/csv; charset=utf-8',        'Content-Disposition': `attachment; filename="clientes-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {,    console.error('Erro no export de clientes:', error),    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}