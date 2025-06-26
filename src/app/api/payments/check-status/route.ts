import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configurar MercadoPago,const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN,if (!accessToken) {
  console.error('❌ MERCADOPAGO_ACCESS_TOKEN não configurado')
},
const client = new MercadoPagoConfig({,  accessToken: accessToken!
}),
const payment = new Payment(client),

export async function GET(request: NextRequest) {,  try {,    const { searchParams } = new URL(request.url),    const paymentId = searchParams.get('payment_id'),
    if (!paymentId) {,      return NextResponse.json({,        error: 'payment_id é obrigatório'
      }, { status: 400 })
    },
    console.log('🔍 Verificando status do pagamento:', paymentId)

    // Buscar informações do pagamento no MercadoPago,    const result = await payment.get({ id: paymentId })
    
    console.log('📊 Status atual:', result.status),    console.log('📋 Detalhes:', {,      id: result.id,      status: result.status,      status_detail: result.status_detail,      payment_method: result.payment_method_id
    }),
    return NextResponse.json({,      payment_id: result.id,      status: result.status,      status_detail: result.status_detail,      payment_method: result.payment_method_id,      transaction_amount: result.transaction_amount,      date_created: result.date_created,      date_approved: result.date_approved,      payer_email: result.payer?.email,      external_reference: result.external_reference
    })

  } catch (error) {,    console.error('❌ Erro ao verificar status do pagamento:', error),    
    return NextResponse.json({,      error: 'Erro ao verificar status do pagamento',      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}