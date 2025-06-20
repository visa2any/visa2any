import { NextRequest, NextResponse } from 'next/server'
import { processSocialComments } from '@/lib/sofia-chatbot'

// Esta rota deve ser chamada por um cron job para processar comentários
export async function POST(request: NextRequest) {
  try {
    // Verificar authorization header se necessário
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🤖 Sofia iniciando processamento automático de comentários...')
    
    // Processar comentários com a Sofia
    await processSocialComments()
    
    console.log('✅ Sofia finalizou processamento de comentários')
    
    return NextResponse.json({
      success: true,
      message: 'Comentários processados pela Sofia com sucesso',
      timestamp: new Date().toISOString(),
      service: 'Sofia AI Assistant'
    })

  } catch (error) {
    console.error('❌ Erro no processamento de comentários pela Sofia:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro no processamento de comentários',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        service: 'Sofia AI Assistant'
      },
      { status: 500 }
    )
  }
}

// GET para verificar status da Sofia
export async function GET() {
  return NextResponse.json({
    service: 'Sofia AI Assistant',
    status: 'active',
    description: 'Responde automaticamente comentários nas redes sociais',
    capabilities: [
      'Análise de sentimento',
      'Respostas contextuais',
      'Detecção de intenção',
      'Escalação para humanos',
      'Suporte a 5 plataformas'
    ],
    schedule: 'A cada 2 minutos',
    lastRun: new Date().toISOString()
  })
}