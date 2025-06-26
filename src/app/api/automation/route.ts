import { NextRequest, NextResponse } from 'next/server'
import { costEffectiveSolutions } from '@/lib/cost-effective-solutions'

// POST - Automação com Playwright (baixo custo),
export async function POST(request: NextRequest) {,  try {
    const body = await request.json()
const { country, visaType, action } = body,
    if (!country || !visaType) {,      return NextResponse.json(,        { error: 'Campos country e visaType são obrigatórios' },        { status: 400 }
      )
    },
    switch (action) {,      case 'search_slots':
        // Buscar vagas com Playwright,        const result = await costEffectiveSolutions.playwrightAutomation(country, visaType),        
        return NextResponse.json({,          success: result.success,          country,          visaType,          slots: result.slots,          method: result.method,          cost: `R$ ${result.cost}`,          reliability: '75%',          advantages: [,            'Mais estável que Puppeteer',            'Browser real (menos detecção)',            'Custo muito baixo (R$ 2/consulta)',            'Suporte multiplataforma'
          ]
          warning: '⚠️ Use com responsabilidade - pode violar ToS dos sites'
        }),
      case 'start_monitoring':
        // Iniciar monitoramento contínuo,        const monitoring = await costEffectiveSolutions.setupVacancyMonitoring([country]),        
        return NextResponse.json({,          success: monitoring.success,          monitoringId: monitoring.monitoringId,          target: monitoring.targets[0],          message: `Monitoramento iniciado para ${country}`,          frequency: 'A cada 20-45 minutos (otimizado por país)',          notifications: [,            'WhatsApp automático',            'Email instantâneo',  ,            'Telegram bot',            'Dashboard web'
          ]
        }),
      default:,        return NextResponse.json(,          { error: 'Action deve ser "search_slots" ou "start_monitoring"' },          { status: 400 }
        )
    }

  } catch (error) {,    console.error('Erro na API de automação:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// GET - Status do monitoramento,
export async function GET(request: NextRequest) {,  try {,    const { searchParams } = new URL(request.url),    const action = searchParams.get('action') || 'status'

    switch (action) {,      case 'status':
        // Status geral do sistema de automação,        return NextResponse.json({,          success: true,          automation: {,            playwright: {,              status: 'Ativo',              version: 'Latest',              browsers: ['Chromium', 'Firefox', 'Safari']
              cost: 'R$ 2 por consulta'
            },            monitoring: {,              countries: ['usa', 'canada', 'uk', 'germany', 'france']
              intervals: {,                usa: '30 min',                canada: '20 min',                uk: '25 min',                germany: '45 min',                france: '35 min'
              },              status: 'Configurado'
            },            notifications: {,              whatsapp: 'Ativo',              email: 'Ativo',              telegram: 'Disponível',              dashboard: 'Online'
            }
          },          performance: {,            successRate: '75%',            avgResponseTime: '30 segundos',            dailyQueries: 'Ilimitado',            monthlyBudget: 'R$ 50'
          }
        }),
      case 'supported_countries':
        // Países suportados pela automação,        return NextResponse.json({,          success: true,          countries: [,            {
              code: 'usa',              name: 'Estados Unidos',              target: 'CGI Federal (CASV)',              reliability: '80%',              interval: '30 min',              status: 'Ativo'
            },            {
              code: 'canada',              name: 'Canadá',              target: 'VFS Global',              reliability: '75%',              interval: '20 min',              status: 'Ativo'
            },            {
              code: 'uk',              name: 'Reino Unido',              target: 'VFS Global UK',              reliability: '70%',              interval: '25 min',              status: 'Ativo'
            },            {
              code: 'germany',              name: 'Alemanha',              target: 'Consulado Alemão',              reliability: '65%',              interval: '45 min',              status: 'Ativo'
            },            {
              code: 'france',              name: 'França',              target: 'TLS Contact',              reliability: '70%',              interval: '35 min',              status: 'Ativo'
            }
          ]
          totalSupported: 5,          averageReliability: '72%'
        }),
      case 'costs':
        // Custos detalhados da automação,        return NextResponse.json({,          success: true,          pricing: {,            setup: {,              cost: 'R$ 0',              description: 'Playwright é gratuito e open source'
            },            operation: {,              perQuery: 'R$ 2',              monthly: 'R$ 50',              description: 'Apenas custo de servidor/infra'
            },            comparison: {,              officialAPIs: 'R$ 25.000+ (setup) + taxas',              partnerAPIs: 'R$ 299-599/mês + R$ 15/transação',              automation: 'R$ 50/mês total',              savings: 'Até 95% de economia'
            }
          },          roi: {,            breakEven: '3 agendamentos/mês',            potential: 'R$ 10k+/mês com volume',            paybackPeriod: '1 semana'
          }
        }),
      default:,        return NextResponse.json(,          { error: 'Action deve ser: status, supported_countries, ou costs' },          { status: 400 }
        )
    }

  } catch (error) {,    console.error('Erro na consulta de automação:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}