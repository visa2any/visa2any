import { NextRequest, NextResponse } from 'next/server',
export async function POST(request: NextRequest) {,  try {,    console.log('🧪 API de teste chamada'),    
    const body = await request.json(),    console.log('📋 Dados recebidos:', body)
    
    // Simular sucesso,    return NextResponse.json({,      preference_id: 'test-preference-' + Date.now(),      public_key: process.env.MERCADOPAGO_PUBLIC_KEY || 'TEST-PUBLIC-KEY',      message: 'Preferência de teste criada com sucesso'
    })
    
  } catch (error) {,    console.error('❌ Erro na API de teste:', error),    
    return NextResponse.json({,      error: 'Erro na API de teste',      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}