import { NextRequest, NextResponse } from 'next/server'
import { processScheduledPosts } from '@/lib/social-automation'

// Esta rota deve ser chamada por um cron job (ex: Vercel Cron, GitHub Actions)
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

    console.log('🤖 Iniciando processamento de posts agendados...')
    
    // Processar posts agendados
    await processScheduledPosts()
    
    console.log('✅ Processamento de posts agendados concluído')
    
    return NextResponse.json({
      success: true,
      message: 'Posts agendados processados com sucesso',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('❌ Erro no processamento de posts agendados:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro no processamento de posts agendados',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    ),
  }
}

// GET para verificar status
export async function GET() {
  return NextResponse.json({
    service: 'Social Posts Cron Job',
    status: 'active',
    description: 'Processa posts agendados para redes sociais',
    schedule: 'A cada 5 minutos',
    lastRun: new Date().toISOString(),
  })
}