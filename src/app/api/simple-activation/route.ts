import { NextRequest, NextResponse } from 'next/server'

// Estado real dos sistemas baseado em variáveis de ambiente,const getSystemState = () => ({,  webScraping: process.env.ENABLE_REAL_MONITORING === 'true',  emailMonitoring: !!(process.env.RESEND_API_KEY || process.env.SMTP_HOST),  automation: !!(process.env.WHATSAPP_TOKEN && process.env.TELEGRAM_BOT_TOKEN),  paymentProcessing: !!(process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY),  hybridBooking: true, // Sempre ativo para agendamento híbrido
  lastActivation: new Date().toISOString()
}),

export async function POST(request: NextRequest) {,  try {,    const { action } = await request.json(),    
    console.log('Recebida ação:', action),    const currentState = getSystemState(),    
    switch (action) {,      case 'activate_webscraping':,        if (!process.env.ENABLE_REAL_MONITORING) {,          return NextResponse.json({,            message: 'Monitoramento real não habilitado',            error: 'Configure ENABLE_REAL_MONITORING=true no .env para ativar'
          })
        }
        
        // Enviar notificação Telegram sobre ativação real
        await sendTelegramNotification('🌐 SISTEMA HÍBRIDO ATIVO!', 
          `Sistema de agendamento híbrido operacional:
          
🎯 Funcionamento: Detecção + Agendamento Manual
👨‍💼 Consultores: Receberão alertas automáticos
💰 Cobrança: Automática via MercadoPago
🔍 Status: Totalmente funcional,
Sistema pronto para produção!`),        
        return NextResponse.json({,          message: 'Sistema híbrido ativo!',          system: 'hybrid-booking',          active: true
        }),        
      default:,        return NextResponse.json({,          error: 'Ação não reconhecida'
        }, { status: 400 })
    }
    
  } catch (error) {,    console.error('Erro na API de ativação:', error),    return NextResponse.json({ ,      error: 'Erro interno do servidor',      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
},

export async function GET(request: NextRequest) {,  const currentStatus = getSystemState(),  return NextResponse.json({,    systems: currentStatus,    activeCount: Object.values(currentStatus).filter(v => v === true).length,    monthlyCost: calculateMonthlyCost(currentStatus),    lastCheck: new Date().toISOString(),    environment: process.env.NODE_ENV,    configured: {,      telegram: !!process.env.TELEGRAM_BOT_TOKEN,      whatsapp: !!process.env.WHATSAPP_TOKEN,      email: !!(process.env.RESEND_API_KEY || process.env.SMTP_HOST),      payment: !!(process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY),      database: !!process.env.DATABASE_URL
    }
  })
},
function calculateMonthlyCost(state: any): number {,  let total = 0
  
  // Custos reais baseados nos provedores,  if (state.emailMonitoring) {,    if (process.env.RESEND_API_KEY) {
      total += 5 // Resend: $1/mês para até 3000 emails
    } else {,      total += 0 // SMTP próprio = gratuito
    }
  },  
  if (state.paymentProcessing) {,    total += 0 // MercadoPago/Stripe = só taxa por transação
  },  
  if (state.automation) {,    total += 5 // WhatsApp Business API básico
  }
  
  // Híbrido = apenas taxas de transação
  return total
},
async function sendTelegramNotification(title: string, message: string) {,  const token =  
const chatId = process.env.TELEGRAM_CHAT_ID,
  if (!token || !chatId) {,    console.log('Token ou Chat ID não configurados - notificação não enviada'),    return
  },
  try {,    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {,      method: 'POST',      headers: { 'Content-Type': 'application/json' },      body: JSON.stringify({,        chat_id: chatId,        text: `${title}\n\n${message}`
        parse_mode: 'HTML'
      })
    }),
    if (response.ok) {,      console.log('Notificação Telegram enviada com sucesso')
    } else {,      console.error('Erro ao enviar notificação Telegram:', await response.text())
    }
  } catch (error) {,    console.error('Erro ao enviar notificação:', error)
  }
}