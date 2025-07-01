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
  duration: number // dias de monitoramento
  priority: 'basic' | 'premium' | 'vip'
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

type PlanConfig = {
    duration: number;
    priority: 'basic' | 'premium' | 'vip';
    maxCountries: number;
    maxAdvanceDays: number;
    notificationDelay: number;
    features: string[];
};

export class VagaExpressIntegration {
  
  // Configurações dos planos
  private planConfigs: Record<string, PlanConfig> = {
    'vaga-express-basic': {
      duration: 30,
      priority: 'basic',
      maxCountries: 1,
      maxAdvanceDays: 30,
      notificationDelay: 15, // minutos
      features: ['whatsapp', 'email', 'weekly-report']
    },
    'vaga-express-premium': {
      duration: 60,
      priority: 'premium',
      maxCountries: 2,
      maxAdvanceDays: 60,
      notificationDelay: 5, // minutos
      features: ['whatsapp', 'email', 'sms', 'priority-support', 'refund-guarantee', 'detailed-reports']
    },
    'vaga-express-vip': {
      duration: 90,
      priority: 'vip',
      maxCountries: 999,
      maxAdvanceDays: 90,
      notificationDelay: 2, // minutos
      features: ['whatsapp', 'email', 'sms', 'phone-call', '24-7-support', 'dedicated-consultant', 'unlimited-countries']
    }
  }

  // Processar novo pedido do Vaga Express
  async processVagaExpressOrder(orderData: any): Promise<void> {
    try {
        const planConfig = this.planConfigs[orderData.product];
        if(!planConfig) {
            throw new Error(`Invalid product id: ${orderData.product}`);
        }
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
        duration: planConfig.duration,
        priority: planConfig.priority,
        features: planConfig.features,
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
    const channelsToActivate = new Set<string>();

    // Todos os planos incluem monitoramento básico
    channelsToActivate.add('telegram-monitoring');
    channelsToActivate.add('basic-scraping');

    // Premium e VIP incluem monitoramento avançado
    if (order.priority === 'premium' || order.priority === 'vip') {
        channelsToActivate.add('advanced-scraping');
        channelsToActivate.add('email-monitoring');
    }

    // VIP inclui monitoramento premium
    if (order.priority === 'vip') {
        channelsToActivate.add('browser-automation');
        channelsToActivate.add('phone-notifications');
    }

    // Configurar cada canal
    for (const channel of Array.from(channelsToActivate)) {
      await this.activateMonitoringChannel(channel, order)
    }
  }

  private async activateMonitoringChannel(channel: string, order: VagaExpressOrder): Promise<void> {
    switch (channel) {
      case 'telegram-monitoring':
        // Ativar monitoramento Telegram
        // await monitoringDataService.updateChannelStatus('telegram-vagaexpress', 'active')
        console.log(`Telegram monitoring ativado para ${order.customerName}`)
        break
        
      case 'basic-scraping':
        // Ativar web scraping básico
        await this.activateSystemAPI('activate_webscraping')
        break
        
      case 'advanced-scraping':
        // Ativar web scraping avançado
        // await monitoringDataService.updateChannelStatus('scraping-casv', 'active')
        // await monitoringDataService.updateChannelStatus('scraping-vfs', 'active')
        console.log('Advanced scraping ativado')
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

    const message = `🎉 VAGA EXPRESS ATIVADO!\n\n👤 Cliente: ${order.customerName}\n📦 Plano: ${order.productId.replace('vaga-express-', '').toUpperCase()}\n🌍 País: ${order.targetCountry}\n👥 Pessoas: ${order.adults + order.children}\n💰 Valor: R$ ${order.totalPaid}\n\n⏰ Duração: ${config.duration} dias\n🔔 Prioridade: ${config.notificationDelay} min\n🎯 Máx países: ${config.maxCountries}\n\n✅ Sistema ativo e monitorando!\n📱 Cliente receberá alertas em tempo real.\n\nID: ${order.orderId}`

    // Enviar para admin via Telegram
    await this.sendTelegramMessage(message)
    
    // Enviar confirmação ao cliente
    await this.sendCustomerConfirmation(order)
  }

  private async sendCustomerConfirmation(order: VagaExpressOrder): Promise<void> {
    const planName = order.productId.replace('vaga-express-', '').toUpperCase()
    const message = `Olá ${order.customerName}, seu plano Vaga Express ${planName} foi ativado com sucesso! Estamos monitorando vagas para ${order.targetCountry} e você será notificado em tempo real.`
    
    // Simulação de envio para o cliente (e.g., via WhatsApp)
    console.log(`Enviando confirmação para ${order.customerPhone}: ${message}`)
  }

  private async sendTelegramMessage(message: string): Promise<void> {
    // Simulação de envio de mensagem via API do Telegram
    console.log(`Enviando para Telegram: ${message}`)
    try {
      await fetch('/api/telegram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch(e) {
      console.error(e);
    }
  }

  private async scheduleAutomatedTasks(order: VagaExpressOrder): Promise<void> {
    // Agendar verificação semanal de status, relatórios, etc.
    console.log(`Agendando tarefas automáticas para o pedido ${order.orderId}`)
  }

  async simulateVagaForCustomer(orderId: string, vagaDetails: any): Promise<void> {
    const order = await this.getOrder(orderId)
    if (!order) {
      console.error(`Pedido ${orderId} não encontrado para simulação.`)
      return
    }

    const alert = {
      ...vagaDetails,
      timestamp: new Date().toISOString()
    }

    await this.notifyCustomerAboutVaga(order, alert)
  }

  private async notifyCustomerAboutVaga(order: VagaExpressOrder, alert: any): Promise<void> {
    const notificationConfig = JSON.parse(localStorage.getItem('notification-configs') || '{}')[order.orderId]
    
    if (!notificationConfig) return

    const message = `🚨 ALERTA DE VAGA! 🚨\n\nConsulado: ${alert.consulate}\nData: ${alert.date}\nHorário: ${alert.time}\n\nLink para agendamento: ${alert.link}`

    for (const channel of notificationConfig.channels) {
      switch (channel) {
        case 'telegram':
        case 'whatsapp':
          // Simulação de envio
          console.log(`Enviando para ${order.customerPhone} via ${channel}: ${message}`)
          break
        case 'email':
          console.log(`Enviando para ${order.customerEmail} via Email: ${message}`)
          break
        case 'sms':
          console.log(`Enviando SMS para ${order.customerPhone}: ${message}`)
          break
        case 'phone-call':
          console.log(`Realizando chamada para ${order.customerPhone}`)
          break
      }
    }
  }

  private async getOrder(orderId: string): Promise<VagaExpressOrder | null> {
    if (typeof window !== 'undefined') {
      const orders: VagaExpressOrder[] = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
      return orders.find(o => o.orderId === orderId) || null
    }
    return null
  }

  async getOrderStatistics(): Promise<any> {
    if (typeof window !== 'undefined') {
      const orders: VagaExpressOrder[] = JSON.parse(localStorage.getItem('vaga-express-orders') || '[]')
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalPaid, 0)
      const planCounts = orders.reduce((counts, o) => {
        counts[o.productId] = (counts[o.productId] || 0) + 1
        return counts
      }, {} as Record<string, number>)
      
      return {
        totalOrders: orders.length,
        totalRevenue,
        planCounts
      }
    }
    return { totalOrders: 0, totalRevenue: 0, planCounts: {} }
  }
}

export const vagaExpressIntegration = new VagaExpressIntegration()