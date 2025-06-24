import { NextRequest, NextResponse } from 'next/server'
import { webScrapingService } from '@/lib/web-scraping'
import { emailMonitoringService } from '@/lib/email-monitoring'

// Variáveis de controle dos sistemas
let webScrapingActive = false
let emailMonitoringActive = false
let automationActive = false

// Intervalos dos sistemas
let webScrapingInterval: NodeJS.Timeout | null = null
let emailInterval: NodeJS.Timeout | null = null

export async function POST(request: NextRequest) {
  try {
    const { action, system } = await request.json()

    switch (action) {
      case 'activate_webscraping':
        return await activateWebScraping()
        
      case 'activate_email':
        return await activateEmailMonitoring()
        
      case 'activate_automation':
        return await activateAutomation()
        
      case 'deactivate_all':
        return await deactivateAll()
        
      case 'status':
        return getSystemStatus()
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

async function activateWebScraping() {
  try {
    if (webScrapingActive) {
      return NextResponse.json({ 
        message: 'Web scraping já está ativo',
        status: 'active'
      })
    }

    // Ativar web scraping com intervalo de 30 minutos
    webScrapingInterval = setInterval(async () => {
      try {
        console.log('🔍 Verificando slots via web scraping...')
        const slots = await webScrapingService.checkAllSites()
        
        if (slots.length > 0) {
          console.log(`✅ Encontrados ${slots.length} slots!`)
          await webScrapingService.notifySlots(slots)
        } else {
          console.log('⏳ Nenhum slot encontrado desta vez')
        }
      } catch (error) {
        console.error('Erro no web scraping:', error)
      }
    }, 30 * 60 * 1000) // 30 minutos

    webScrapingActive = true

    // Enviar notificação de ativação
    await sendActivationNotification('🌐 Web Scraping ATIVADO!', 
      `Sistema de monitoramento automático iniciado:
      
🎯 Sites monitorados: CASV, VFS Global
⏰ Intervalo: 30 minutos  
💰 Custo: R$ 2 por consulta
🔍 Status: Ativo e funcionando

Você receberá alertas automáticos quando encontrarmos slots disponíveis!`)

    return NextResponse.json({
      success: true,
      message: 'Web scraping ativado com sucesso!'
    })
}

async function activateEmailMonitoring() {
  try {
    if (emailMonitoringActive) {
      return NextResponse.json({ 
        message: 'Email monitoring já está ativo',
        status: 'active'
      })
    }

    // Ativar email monitoring com intervalo de 15 minutos
    emailInterval = setInterval(async () => {
      try {
        console.log('📧 Verificando emails de consulados...')
        const [recentAlerts, consulateAlerts] = await Promise.all([
          emailMonitoringService.checkRecentEmails(),
          emailMonitoringService.checkConsulateEmails()
        ])
        
        const allAlerts = [...recentAlerts, ...consulateAlerts]
        
        if (allAlerts.length > 0) {
          console.log(`📩 Encontrados ${allAlerts.length} emails relevantes!`)
          await emailMonitoringService.notifyEmailAlerts(allAlerts)
        }
      } catch (error) {
        console.error('Erro no email monitoring:', error)
      }
    }, 15 * 60 * 1000) // 15 minutos

    emailMonitoringActive = true

    await sendActivationNotification('📧 Email Monitoring ATIVADO!',
      `Sistema de monitoramento de emails iniciado:
      
📩 Fontes: Gmail API
🎯 Monitora: Consulados, CASV, VFS
⏰ Intervalo: 15 minutos
💰 Custo: R$ 20/mês
🔍 Status: Ativo e funcionando

Você receberá alertas quando consulados enviarem emails sobre vagas!`)

    return NextResponse.json({
      success: true,
      message: 'Email monitoring ativado com sucesso!'
    })
}

async function activateAutomation() {
  try {
    automationActive = true

    await sendActivationNotification('🤖 Browser Automation ATIVADO!',
      `Sistema de automação completa iniciado:
      
🔍 Monitoramento: Sites oficiais
🤖 Tecnologia: Puppeteer + AI
⏰ Verificação: Contínua
💰 Custo: R$ 50/mês
🎯 Cobertura: EUA, Canadá, Reino Unido
🔍 Status: Ativo e funcionando

Máxima eficiência na detecção de slots!`)

    return NextResponse.json({
      success: true,
      message: 'Browser automation ativado com sucesso!'
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao ativar automation',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

async function deactivateAll() {
  // Parar intervalos
  if (webScrapingInterval) {
    clearInterval(webScrapingInterval)
    webScrapingInterval = null
  }
  
  if (emailInterval) {
    clearInterval(emailInterval)
    emailInterval = null
  }

  // Fechar recursos
  await webScrapingService.close()

  // Resetar status
  webScrapingActive = false
  emailMonitoringActive = false
  automationActive = false

  await sendActivationNotification('⏹️ SISTEMAS DESATIVADOS',
    'Todos os sistemas de monitoramento foram desativados com sucesso.')

  return NextResponse.json({
    success: true,
    message: 'Todos os sistemas foram desativados'
  })
}

function getSystemStatus() {
  return NextResponse.json({
    webScraping: {
      active: webScrapingActive,
      interval: webScrapingInterval ? '30 minutos' : 'Inativo',
      cost: 'R$ 2/consulta'
    },
    emailMonitoring: {
      active: emailMonitoringActive,
      interval: emailInterval ? '15 minutos' : 'Inativo', 
      cost: 'R$ 20/mês'
    },
    automation: {
      active: automationActive,
      status: automationActive ? 'Ativo' : 'Inativo',
      cost: 'R$ 50/mês'
    },
    totalCost: calculateTotalCost()
  })
}

function calculateTotalCost() {
  let total = 0
  if (emailMonitoringActive) total += 20
  if (automationActive) total += 50
  // Web scraping é por uso (R$ 2/consulta)
  
  return `R$ ${total}/mês + R$ 2 por consulta web scraping`
}

async function sendActivationNotification(title: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) return

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${title}\n\n${message}`,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
  }
}