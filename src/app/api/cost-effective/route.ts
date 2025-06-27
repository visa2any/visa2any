import { NextRequest, NextResponse } from 'next/server'
import { costEffectiveSolutions, ManualBookingRequest } from '@/lib/cost-effective-solutions'

// POST - Agendamento manual assistido (gratuito)

export async function POST(request: NextRequest) {
try {
const { searchParams } = new URL(request.url)
    const action =  
const body = await request.json(),
    switch (action) {,      case 'manual_booking':
        // Agendamento manual assistido
        const bookingRequest: ManualBookingRequest = body,        
        if (!bookingRequest.applicantInfo?.fullName || !bookingRequest.consularInfo?.country) {,          return NextResponse.json(,            { error: 'Campos applicantInfo.fullName e consularInfo.country são obrigatórios' },            { status: 400 }
          )
        },
        const result = await costEffectiveSolutions.manualAssistedBooking(bookingRequest),        
        return NextResponse.json({,          success: result.success,          method: 'Agendamento Manual Assistido',          cost: `R$ ${result.cost}`,          estimatedTime: result.estimatedTime,          trackingId: result.trackingId,          instructions: result.instructions,          error: result.error,          benefits: [,            '✅ Custo baixo (R$ 25-75)',            '✅ 100% legal e seguro',            '✅ Acompanhamento humano',            '✅ Alta taxa de sucesso'
          ]
        }),
      case 'setup_monitoring':
        // Configurar monitoramento gratuito
        const { countries } = body,        
        if (!Array.isArray(countries) || countries.length === 0) {,          return NextResponse.json(,            { error: 'Campo countries deve ser um array não vazio' },            { status: 400 }
          )
        },
        const monitoring = await costEffectiveSolutions.setupVacancyMonitoring(countries),        
        return NextResponse.json({,          success: monitoring.success,          monitoringId: monitoring.monitoringId,          targets: monitoring.targets,          message: `Monitoramento configurado para ${countries.length} países`,          cost: 'GRATUITO',          instructions: 'Sistema monitora automaticamente e notifica quando encontrar vagas'
        }),
      case 'optimized_workflow':
        // Workflow manual otimizado
        const workflowRequest: ManualBookingRequest = body,        
        const workflow = await costEffectiveSolutions.optimizedManualWorkflow(workflowRequest),        
        return NextResponse.json({,          success: workflow.success,          workflow: workflow.workflow,          totalTime: workflow.totalTime,          cost: `R$ ${workflow.cost}`,          efficiency: 'Processo otimizado para máxima eficiência'
        }),
      default:,        return NextResponse.json(,          { error: 'Action deve ser: manual_booking, setup_monitoring, ou optimized_workflow' },          { status: 400 }
        )
    }

  } catch (error) {,    console.error('Erro na API de soluções econômicas:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// GET - Listar métodos econômicos e calcular ROI

export async function GET(request: NextRequest) {
try {
const { searchParams } = new URL(request.url)
const action = searchParams.get('action') || 'methods'

    switch (action) {,      case 'methods':
        // Listar todos os métodos econômicos
        const methods = costEffectiveSolutions.getCostEffectiveMethods(),        
        return NextResponse.json({,          success: true,          methods: methods.map(method => ({
            ...method,            costDescription: `Setup: R$ ${method.cost.setup} | Mensal: R$ ${method.cost.monthly} | Por transação: R$ ${method.cost.perTransaction}`
          })),          recommendation: 'Para começar imediatamente, use "Agendamento Manual Assistido"',          bestOption: {,            immediate: 'manual_assisted',            scalable: 'api_monitoring',            cheapest: 'telegram_bots'
          }
        }),
      case 'roi':
        // Calcular ROI de um método específico
        const method =  
const monthlyVolume = parseInt(searchParams.get('volume') || '10')
        const revenuePerBooking = parseInt(searchParams.get('revenue') || '100'),        
        if (!method) {,          return NextResponse.json(,            { error: 'Parâmetro method é obrigatório' },            { status: 400 }
          )
        },
        try {
        const roi = costEffectiveSolutions.calculateROI(method, monthlyVolume, revenuePerBooking),          
          return NextResponse.json({,            success: true,            method: roi.method,            analysis: {,              monthlyVolume,              revenuePerBooking: `R$ ${revenuePerBooking}`,              monthlyCost: `R$ ${roi.monthlyCost}`,              monthlyRevenue: `R$ ${roi.monthlyRevenue}`,              profit: `R$ ${roi.profit}`,              roi: `${roi.roi.toFixed(1)}%`
            },            viability: roi.roi > 200 ? 'Excelente' : roi.roi > 100 ? 'Bom' : roi.roi > 0 ? 'Viável' : 'Não viável'
          })
        } catch (error) {,          return NextResponse.json(,            { error: `Método '${method}' não encontrado` },            { status: 400 }
          )
        },
      case 'telegram_setup':
        // Configurar alertas Telegram gratuitos
        const telegramSetup = await costEffectiveSolutions.setupTelegramAlerts(),        
        return NextResponse.json({,          success: telegramSetup.success,          setup: telegramSetup.botInfo,          instructions: telegramSetup.instructions,          cost: 'GRATUITO',          reliability: '70%',          benefits: [,            'Notificações instantâneas',            'Múltiplos canais monitorados',            'Comandos personalizados',            'Zero custo operacional'
          ]
        }),
      case 'email_setup':
        // Configurar monitoramento por email
        const emailSetup = await costEffectiveSolutions.setupEmailMonitoring(),        
        return NextResponse.json({,          success: emailSetup.success,          config: emailSetup.emailConfig,          instructions: emailSetup.instructions,          cost: 'R$ 20/mês',          roi: 'Altíssimo (quase gratuito)',          providers: emailSetup.emailConfig.providers
        }),
      default:,        return NextResponse.json(,          { error: 'Action deve ser: methods, roi, telegram_setup, ou email_setup' },          { status: 400 }
        )
    }

  } catch (error) {,    console.error('Erro na API de métodos econômicos:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}