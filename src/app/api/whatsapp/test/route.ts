import { NextRequest, NextResponse } from 'next/server'

// GET /api/whatsapp/test - Testar se API está funcionando
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'WhatsApp API está funcionando!',
      timestamp: new Date().toISOString(),
      info: {
        integrated: true,
        backend: 'Next.js',
        status: 'Pronto para integração com Baileys',
      },
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erro na API de teste',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    ),
  }
}

// POST /api/whatsapp/test - Testar envio simulado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message } = body

    if (!phone || !message) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    // Simular envio bem-sucedido
    const messageId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('📱 WHATSAPP INTEGRADO - SIMULAÇÃO:')
    console.log('Para:', phone)
    console.log('Mensagem:', message)
    console.log('MessageID:', messageId)
    console.log('---')

    return NextResponse.json({
      data: {
        messageId,
        phone,
        sent: true,
        backend: 'Next.js integrado',
        timestamp: new Date().toISOString(),
      },
      message: 'Mensagem enviada com sucesso (simulação)',
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erro no teste de envio',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    ),
  }
}