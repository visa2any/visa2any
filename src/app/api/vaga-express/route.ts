import { NextRequest, NextResponse } from 'next/server'
import { vagaExpressIntegration } from '@/lib/vaga-express-integration'

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'process_order':
        await vagaExpressIntegration.processVagaExpressOrder(data)
        return NextResponse.json({
          success: true,
          message: 'Pedido processado e monitoramento ativado!',
          orderId: `VE-${Date.now()}`
        })

      case 'simulate_vaga':
        await vagaExpressIntegration.simulateVagaForCustomer(data.orderId, data.vagaDetails)
        return NextResponse.json({
          success: true,
          message: 'Vaga simulada para cliente!'
        })

      case 'get_statistics':
        const stats = await vagaExpressIntegration.getOrderStatistics()
        return NextResponse.json({
          success: true,
          statistics: stats
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Ação não reconhecida'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro na API Vaga Express:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'orders':
        // Retornar lista de pedidos (em produção, do banco de dados)
        if (typeof window !== 'undefined') {
          const orders = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
          return NextResponse.json({
            success: true,
            orders: orders.slice(-10) // Últimos 10 pedidos
          })
        }
        return NextResponse.json({ success: true, orders: [] })

      case 'statistics':
        const stats = await vagaExpressIntegration.getOrderStatistics()
        return NextResponse.json({
          success: true,
          statistics: stats
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Tipo não especificado'
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar dados',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}