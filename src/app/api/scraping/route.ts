import { NextRequest, NextResponse } from 'next/server'
import { webScrapingService } from '@/lib/web-scraping-service'

// GET - Buscar vagas via web scraping
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const targetId = searchParams.get('targetId')

    if (action === 'targets') {
      // Listar targets disponíveis
      const targets = webScrapingService.getAvailableTargets()
      
      return NextResponse.json({
        success: true
        targets,
        total: targets.length,
        warning: 'Web scraping pode violar ToS dos sites consultares. Use com responsabilidade legal.',
        message: 'Targets de scraping listados',
      })
    }

    if (action === 'slots' && targetId) {
      // Buscar slots via scraping
      const result = await webScrapingService.scrapeAvailableSlots(targetId)
      
      return NextResponse.json({
        success: result.success
        slots: result.slots,
        error: result.error,
        lastUpdated: result.lastUpdated,
        source: result.source,
        warning: 'Dados obtidos via web scraping - podem estar desatualizados',
        disclaimer: 'Este serviço é apenas para fins informativos',
      })
    }

    return NextResponse.json(
      { error: 'Parâmetro action deve ser "targets" ou "slots" (com targetId)' }
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro na API de scraping:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// POST - Configurar scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, targetId, enabled, legalConfirmation } = body

    if (action === 'configure') {
      if (!targetId || typeof enabled !== 'boolean') {
        return NextResponse.json(
          { error: 'Campos targetId e enabled são obrigatórios' }
          { status: 400 }
        )
      }

      if (enabled && !legalConfirmation) {
        return NextResponse.json(
          { 
            error: 'Confirmação legal necessária para habilitar scraping'
            warning: 'Web scraping pode violar ToS dos sites. Você assume total responsabilidade legal.',
            required: 'Envie legalConfirmation: true para confirmar',
          }
          { status: 400 }
        )
      }

      const success = webScrapingService.setTargetEnabled(targetId, enabled, legalConfirmation)
      
      if (success) {
        return NextResponse.json({
          success: true
          targetId,
          enabled,
          message: `Target ${enabled ? 'habilitado' : 'desabilitado'} com sucesso`,
          warning: enabled ? 'Scraping ativo - monitore possíveis bloqueios' : undefined,
        })
      } else {
        return NextResponse.json(
          { error: 'Falha ao configurar target' }
          { status: 400 }
        )
      }
    }

    if (action === 'start_monitoring') {
      const { targetIds, intervalMinutes } = body
      
      if (!Array.isArray(targetIds) || targetIds.length === 0) {
        return NextResponse.json(
          { error: 'Campo targetIds deve ser um array não vazio' }
          { status: 400 }
        )
      }

      // Iniciar monitoramento em background
      webScrapingService.startMonitoring(targetIds, intervalMinutes || 30)
      
      return NextResponse.json({
        success: true
        monitoring: {
          targets: targetIds,
          interval: intervalMinutes || 30,
          status: 'started',
        }
        message: 'Monitoramento iniciado',
        warning: 'Monitoramento contínuo pode ser detectado pelos sites',
      })
    }

    return NextResponse.json(
      { error: 'Action deve ser "configure" ou "start_monitoring"' }
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro na configuração de scraping:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}