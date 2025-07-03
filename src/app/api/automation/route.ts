import { NextRequest, NextResponse } from 'next/server'
import { costEffectiveSolutions } from '@/lib/cost-effective-solutions'

// POST - Automação com Playwright (baixo custo)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { country, visaType, action } = body
    
    if (!country || !visaType) {
      return NextResponse.json(
        { error: 'Campos country e visaType são obrigatórios' },
        { status: 400 }
      )}
    
    switch (action) {
      case 'search_slots':
        // Buscar vagas com Playwright
        const result = await costEffectiveSolutions.playwrightAutomation(country, visaType)
        
        return NextResponse.json({
          success: result.success,
          country,
          visaType,
          slots: result.slots,
          method: result.method,
          cost: `R$ ${result.cost}`,
          reliability: '75%',
          advantages: [
            'Mais estável que Puppeteer',
            'Browser real (menos detecção)',
            'Custo muito baixo (R$ 2/consulta)',
            'Suporte multiplataforma'
          ],
          warning: '⚠️ Use com responsabilidade - pode violar ToS dos sites'})

      case 'start_monitoring':
        // Iniciar monitoramento contínuo
        const monitoring = await costEffectiveSolutions.setupVacancyMonitoring([country])
        
        return NextResponse.json({
          success: monitoring.success,
          monitoringId: monitoring.monitoringId,
          target: monitoring.targets[0],
          message: `Monitoramento iniciado para ${country}`,
          frequency: 'A cada 20-45 minutos (otimizado por país)',
          notifications: [
            'WhatsApp automático',
            'Email instantâneo',
            'Telegram bot',
            'Dashboard web'
          ]})

      default:
        return NextResponse.json(
          { error: 'Action deve ser "search_slots" ou "start_monitoring"' },
          { status: 400 }
        )}

  } catch (error) {
    console.error('Erro na API de automação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}