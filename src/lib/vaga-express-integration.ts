// import { monitoringDataService } from './monitoring-data' // Comentado temporariamente

interface VagaExpressOrder {
  orderId: string
  productId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  targetCountry: string
  adults: number
  children: number
  totalPaid: number
  duration: number // dias de monitoramento,  priority: 'basic' | 'premium' | 'vip'
  features: string[]
  createdAt: string
}

interface MonitoringConfig {
  countries: string[]
  duration: number
  priority: 'basic' | 'premium' | 'vip'
  notificationMethods: string[]
  maxAdvanceDays: number
}

export class VagaExpressIntegration {
  
  // Configurações dos planos
  
  private planConfigs = {
    'vaga-express-basic': {
      duration: 30,
      priority: 'basic' as const,
      maxCountries: 1,
      maxAdvanceDays: 30,
      notificationDelay: 15, // minutos,      features: ['whatsapp', 'email', 'weekly-report']
    },
    'vaga-express-premium': {
      duration: 60,
      priority: 'premium' as const,
      maxCountries: 2,
      maxAdvanceDays: 60,
      notificationDelay: 5, // minutos,      features: ['whatsapp', 'email', 'sms', 'priority-support', 'refund-guarantee', 'detailed-reports']
    },
    'vaga-express-vip': {
      duration: 90,
      priority: 'vip' as const,
      maxCountries: 999,
      maxAdvanceDays: 90,
      notificationDelay: 2, // minutos,      features: ['whatsapp', 'email', 'sms', 'phone-call', '24-7-support', 'dedicated-consultant', 'unlimited-countries']
    }
  }

  // Processar novo pedido do Vaga Express

  async processVagaExpressOrder(orderData: any): Promise<void> {
    try {
      // Criar registro do pedido
      const order: VagaExpressOrder = {
        orderId: `VE-${Date.now()}`,
        productId: orderData.product,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        targetCountry: orderData.targetCountry,
        adults: orderData.adults || 1,
        children: orderData.children || 0,
        totalPaid: orderData.total,
        duration: this.planConfigs[orderData.product]?.duration || 30,
        priority: this.planConfigs[orderData.product]?.priority || 'basic',
        features: this.planConfigs[orderData.product]?.features || [],
        createdAt: new Date().toISOString()
      }

      // Salvar pedido

      await this.saveOrder(order)

      // Configurar monitoramento

      await this.setupMonitoringForOrder(order)

      // Ativar sistemas necessários

      await this.activateRequiredSystems(order)

      // Enviar notificação de ativação

      await this.sendActivationNotification(order)

      // Agendar tarefas automáticas

      await this.scheduleAutomatedTasks(order)

    } catch (error) {
      console.error('Erro ao processar pedido Vaga Express:', error)
      throw error
    }
  }

  private async saveOrder(order: VagaExpressOrder): Promise<void> {
    // Salvar no localStorage (em produção seria banco de dados)
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
      orders.push(order)
      localStorage.setItem('vaga-express-orders', JSON.stringify(orders))
    }
  }

  private async setupMonitoringForOrder(order: VagaExpressOrder): Promise<void> {
    const config = this.planConfigs[order.productId]
    if (!config) return

    // Ativar canais baseados no plano

    const channelsToActivate = []

    // Todos os planos incluem monitoramento básico

    channelsToActivate.push('telegram-monitoring', 'basic-scraping')

    // Premium e VIP incluem monitoramento avançado

    if (order.priority === 'premium' || order.priority === 'vip') {
      channelsToActivate.push('advanced-scraping', 'email-monitoring')
    }

    // VIP inclui monitoramento premium

    if (order.priority === 'vip') {
      channelsToActivate.push('browser-automation', 'phone-notifications')
    }

    // Configurar cada canal

    for (const channel of channelsToActivate) {
      await this.activateMonitoringChannel(channel, order)
    }
  }

  private async activateMonitoringChannel(channel: string, order: VagaExpressOrder): Promise<void> {
    switch (channel) {
      case 'telegram-monitoring':
        // Ativar monitoramento Telegram,        // await monitoringDataService.updateChannelStatus('telegram-vagaexpress', 'active')
        console.log('Telegram monitoring ativado')
        break
        
      case 'basic-scraping':
        // Ativar web scraping básico
        await this.activateSystemAPI('activate_webscraping')
        break
        
      case 'advanced-scraping':
        // Ativar web scraping avançado,        // await monitoringDataService.updateChannelStatus('scraping-casv', 'active')
        // await monitoringDataService.updateChannelStatus('scraping-vfs', 'active'),        console.log('Advanced scraping ativado')
        break
        
      case 'email-monitoring':
        // Ativar monitoramento de email
        await this.activateSystemAPI('activate_email')
        break
        
      case 'browser-automation':
        // Ativar automação completa
        await this.activateSystemAPI('activate_automation')
        break
    }
  }

  private async activateSystemAPI(action: string): Promise<void> {
    try {
      const response = await fetch('/api/simple-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (!response.ok) {
        console.error(`Erro ao ativar ${action}:`, await response.text())
      }
    } catch (error) {
      console.error(`Erro na API ${action}:`, error)
    }
  }

  private async activateRequiredSystems(order: VagaExpressOrder): Promise<void> {
    const config = this.planConfigs[order.productId]
    if (!config) return

    // Configurar notificações baseadas no plano

    const notificationConfig = {
      channels: ['telegram'],
      priority: config.priority,
      delay: config.notificationDelay,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        targetCountry: order.targetCountry
      }
    }

    // Adicionar canais premium

    if (order.priority === 'premium' || order.priority === 'vip') {
      notificationConfig.channels.push('email', 'whatsapp')
    }

    if (order.priority === 'vip') {
      notificationConfig.channels.push('sms', 'phone-call')
    }

    // Salvar configuração

    await this.saveNotificationConfig(order.orderId, notificationConfig)
  }

  private async saveNotificationConfig(orderId: string, config: any): Promise<void> {
    if (typeof window !== 'undefined') {
      const configs = JSON.parse(localStorage.getItem('notification-configs') || '{}')
      configs[orderId] = config
      localStorage.setItem('notification-configs', JSON.stringify(configs))
    }
  }

  private async sendActivationNotification(order: VagaExpressOrder): Promise<void> {
    const config = this.planConfigs[order.productId]
    if (!config) return

    const message = `🎉 VAGA EXPRESS ATIVADO!

👤 Cliente: ${order.customerName}
📦 Plano: ${order.productId.replace('vaga-express-', '').toUpperCase()}
🌍 País: ${order.targetCountry}
👥 Pessoas: ${order.adults + order.children}
💰 Valor: R$ ${order.totalPaid}

⏰ Duração: ${config.duration} dias
🔔 Prioridade: ${config.notificationDelay} min
🎯 Máx países: ${config.maxCountries}

✅ Sistema ativo e monitorando!
📱 Cliente receberá alertas em tempo real.

ID: ${order.orderId}`

    // Enviar para admin via Telegram

    await this.sendTelegramMessage(message)

    // Enviar confirmação para cliente

    await this.sendCustomerConfirmation(order)
  }

  private async sendCustomerConfirmation(order: VagaExpressOrder): Promise<void> {
    const config = this.planConfigs[order.productId]
    const planName = order.productId.replace('vaga-express-', '').toUpperCase()

    const customerMessage = `🎯 VAGA EXPRESS ${planName} ATIVADO!

Olá ${order.customerName}! 

Seu monitoramento já está ATIVO! 🚀

📋 DETALHES DO SEU PLANO:
• Duração: ${config.duration} dias
• País monitorado: ${order.targetCountry}
• Pessoas: ${order.adults + order.children}
• Notificações: A cada ${config.notificationDelay} minutos

🔔 VOCÊ RECEBERÁ ALERTAS:
• WhatsApp: ${order.customerPhone}
• Email: ${order.customerEmail}
• Telegram (opcional)

⏰ ATIVADO EM: ${new Date().toLocaleString('pt-BR')}
🆔 SEU ID: ${order.orderId}

Agora relaxe! Nossa IA está trabalhando 24/7 para você! 💪`

    // Em produção

    enviaria WhatsApp/Email real para o cliente
    console.log('Mensagem para cliente:', customerMessage)
  }

  private async sendTelegramMessage(message: string): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) return

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      })
    } catch (error) {
      console.error('Erro ao enviar Telegram:', error)
    }
  }

  private async scheduleAutomatedTasks(order: VagaExpressOrder): Promise<void> {
    // Agendar relatórios semanais,    // Agendar verificação de renovação
    // Agendar follow-ups com cliente
    console.log(`Tarefas automáticas agendadas para pedido ${order.orderId}`)
  }

  // Simular detecção de vaga para cliente específico

  async simulateVagaForCustomer(orderId: string, vagaDetails: any): Promise<void> {
    const order = await this.getOrder(orderId)
    if (!order) return

    const alert = {
      channel: 'Vaga Express Premium',
      country: vagaDetails.country || order.targetCountry,
      type: vagaDetails.type || 'Turismo',
      date: vagaDetails.date || new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      location: vagaDetails.location || 'São Paulo',
      time: new Date().toLocaleTimeString('pt-BR'),
      notified: false,
      customerId: order.orderId,
      customerName: order.customerName,
      priority: order.priority
    }

    // await monitoringDataService.addAlert(alert)

    console.log('Alert criado:', alert)

    // Notificar cliente baseado na prioridade do plano

    await this.notifyCustomerAboutVaga(order, alert)
  }

  private async notifyCustomerAboutVaga(order: VagaExpressOrder, alert: any): Promise<void> {
    const config = this.planConfigs[order.productId]
    const urgencyLevel = config.notificationDelay <= 5 ? 'URGENTE' : 'NOVA'

    const message = `🚨 ${urgencyLevel} VAGA DETECTADA!

${order.customerName}, encontramos uma vaga para você!

🎯 ${alert.country} - ${alert.type}
📅 Data: ${alert.date}
📍 Local: ${alert.location}
⏰ Detectada: ${alert.time}

${order.priority === 'vip' ? '👑 PRIORIDADE VIP - Ligando para você agora!' : ''}
${order.priority === 'premium' ? '⚡ PRIORIDADE ALTA - Ação recomendada imediata!' : ''}

💰 Agendar agora por apenas R$ 45!

ID: ${order.orderId}
Plano: ${order.productId.replace('vaga-express-', '').toUpperCase()}`

    // Simular notificação (em produção seria WhatsApp/Email real)

    console.log(`Notificação para ${order.customerName}:`, message)
    
    // Enviar também para admin
    
    await this.sendTelegramMessage(`📨 Vaga notificada para cliente ${order.customerName} (${order.orderId})`)
  }

  private async getOrder(orderId: string): Promise<VagaExpressOrder | null> {
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
      return orders.find((order: VagaExpressOrder) => order.orderId === orderId) || null
    }
    return null
  }

  // Obter estatísticas dos pedidos

  async getOrderStatistics(): Promise<any> {
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
      
      const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: VagaExpressOrder) => sum + order.totalPaid, 0),
        activeCustomers: orders.filter((order: VagaExpressOrder) => {
          const expiryDate = new Date(order.createdAt)
          expiryDate.setDate(expiryDate.getDate() + order.duration)
          return expiryDate > new Date()
        }).length,
        planDistribution: {
          basic: orders.filter((o: VagaExpressOrder) => o.productId === 'vaga-express-basic').length,
          premium: orders.filter((o: VagaExpressOrder) => o.productId === 'vaga-express-premium').length,
          vip: orders.filter((o: VagaExpressOrder) => o.productId === 'vaga-express-vip').length
        }
      }

      return stats
    }
    return {}
  }
}

export const vagaExpressIntegration = new VagaExpressIntegration()