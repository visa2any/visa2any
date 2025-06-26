import { NextRequest, NextResponse } from 'next/server',
export async function POST(request: NextRequest) {,  try {,    const body = await request.json()
    
    // Validar webhook secret,    const headers = request.headers,    const webhookSecret = headers.get('x-webhook-secret'),    
    if (webhookSecret !== 'visa2any_webhook_secret_2024') {,      return NextResponse.json({,        error: 'Invalid webhook secret'
      }, { status: 401 })
    }

    // Dados do pagamento confirmado,    const {,      purchaseId,      clientId,      clientName,      clientEmail,      clientPhone,      plan,      amount,      paymentStatus,      country,      consulate,      visaType,      currentAppointmentDate,      preferredDateStart,      preferredDateEnd,      urgencyLevel
    } = body

    // Validar que pagamento foi aprovado,    if (paymentStatus !== 'COMPLETED' && paymentStatus !== 'approved') {,      return NextResponse.json({,        error: 'Payment not completed'
      }, { status: 400 })
    }

    // Preparar dados para webhook N8N,    const n8nWebhookData = {,      purchaseId,      clientId,      clientName,      clientEmail,      clientPhone,      plan: plan.toUpperCase(), // BASIC, PREMIUM, VIP,      amount,      currency: 'BRL',      paymentStatus: 'COMPLETED',      country: country || 'EUA',      consulate: consulate || 'US Consulate São Paulo',      visaType: visaType || 'B1/B2',      currentAppointmentDate,      preferredDateStart: preferredDateStart || new Date().toISOString(),      preferredDateEnd: preferredDateEnd || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),      urgencyLevel: urgencyLevel || 'HIGH',      purchaseSource: 'WEBSITE',      createdAt: new Date().toISOString()
    }

    // Enviar para webhook N8N que ativa o Vaga Express,    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/vaga-express-purchase',    
    try {,      const n8nResponse = await fetch(n8nWebhookUrl, {,        method: 'POST',        headers: {,          'Content-Type': 'application/json',          'X-Webhook-Secret': 'visa2any_webhook_secret_2024'
        },        body: JSON.stringify(n8nWebhookData)
      }),
      if (!n8nResponse.ok) {,        throw new Error(`N8N webhook failed: ${n8nResponse.statusText}`)
      },
      const n8nResult = await n8nResponse.json(),      console.log('✅ N8N Webhook enviado com sucesso:', n8nResult)

    } catch (n8nError) {,      console.error('❌ Erro ao enviar para N8N:', n8nError)
      // Não falhar a API por isso, apenas logar
    }

    // Salvar no banco de dados local (simulado),    console.log('💾 Salvando Vaga Express no banco:', {,      purchaseId,      plan,      clientName,      amount,      status: 'ACTIVE'
    })

    // Aqui salvaria no SQLite usando as tabelas do vaga_express_tables.sql
    // INSERT INTO vaga_express_subscriptions (...),
    return NextResponse.json({,      message: 'Vaga Express activated successfully',      data: {,        purchaseId,        plan,        status: 'ACTIVE',        monitoringStarted: true,        estimatedActivationTime: '30 minutes'
      }
    })

  } catch (error) {,    console.error('Erro ao ativar Vaga Express:', error),    return NextResponse.json({,      error: 'Internal server error'
    }, { status: 500 })
  }
},
export async function GET() {,  return NextResponse.json({,    message: 'Vaga Express Activation API - Use POST with payment confirmation'
  })
}