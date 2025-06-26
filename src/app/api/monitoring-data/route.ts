import { NextRequest, NextResponse } from 'next/server'
import { monitoringDataService } from '@/lib/monitoring-data'
import { monitoring } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'channels':
        const channels = await monitoringDataService.getChannels()
        return NextResponse.json({ channels })

      case 'alerts':
        const alerts = await monitoringDataService.getAlerts()
        return NextResponse.json({ alerts })

      case 'stats':
        const stats = await monitoringDataService.getStats()
        const appStats = monitoring.getStats()
        return NextResponse.json({ 
          stats: {
            ...stats
            application: appStats
          }
        })

      case 'all':
        const [allChannels, allAlerts, allStats] = await Promise.all([
          monitoringDataService.getChannels()
          monitoringDataService.getAlerts()
          monitoringDataService.getStats()
        ])
        return NextResponse.json({
          channels: allChannels
          alerts: allAlerts
          stats: allStats
        })

      default:
        return NextResponse.json({ error: 'Tipo de dados não especificado' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao buscar dados de monitoramento'
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'add_alert':
        await monitoringDataService.addAlert(data)
        return NextResponse.json({ success: true, message: 'Alerta adicionado' })

      case 'mark_notified':
        await monitoringDataService.markAlertAsNotified(data.alertId)
        return NextResponse.json({ success: true, message: 'Alerta marcado como notificado' })

      case 'update_channel':
        await monitoringDataService.updateChannelStatus(data.channelId, data.status)
        return NextResponse.json({ success: true, message: 'Status do canal atualizado' })

      case 'simulate_vaga':
        const simulatedAlert = await monitoringDataService.simulateVagaDetection()
        return NextResponse.json({ 
          success: true 
          message: 'Vaga simulada criada', 
          alert: simulatedAlert 
        })

      case 'refresh':
        await monitoringDataService.refresh()
        return NextResponse.json({ 
          success: true 
          message: 'Dados atualizados com sucesso' 
        })

      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao processar ação'
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}