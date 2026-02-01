import { prisma } from '@/lib/prisma'

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
  duration: number
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

  private planConfigs: Record<string, PlanConfig> = {
    'vaga-express-basic': {
      duration: 30,
      priority: 'basic',
      maxCountries: 1,
      maxAdvanceDays: 30,
      notificationDelay: 15,
      features: ['whatsapp', 'email', 'weekly-report']
    },
    'vaga-express-premium': {
      duration: 60,
      priority: 'premium',
      maxCountries: 2,
      maxAdvanceDays: 60,
      notificationDelay: 5,
      features: ['whatsapp', 'email', 'sms', 'priority-support', 'refund-guarantee', 'detailed-reports']
    },
    'vaga-express-vip': {
      duration: 90,
      priority: 'vip',
      maxCountries: 999,
      maxAdvanceDays: 90,
      notificationDelay: 2,
      features: ['whatsapp', 'email', 'sms', 'phone-call', '24-7-support', 'dedicated-consultant', 'unlimited-countries']
    }
  }

  // Helper to manage persistent state in SystemConfig (Server-Side)
  private async getPersistentState<T>(key: string, defaultValue: T): Promise<T> {
    try {
      if (typeof window !== 'undefined') {
        console.warn('VagaExpressIntegration running on client side - state might be stale')
        return defaultValue
      }

      const config = await prisma.systemConfig.findUnique({ where: { key } })
      return config?.value ? (config.value as unknown as T) : defaultValue
    } catch (e) {
      console.error(`Failed to get persistent state for ${key}`, e)
      return defaultValue
    }
  }

  private async setPersistentState<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window !== 'undefined') return // Do not save from client

      await prisma.systemConfig.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any }
      })
    } catch (e) {
      console.error(`Failed to set persistent state for ${key}`, e)
    }
  }

  async processVagaExpressOrder(orderData: any): Promise<void> {
    try {
      const planConfig = this.planConfigs[orderData.product];
      if (!planConfig) {
        throw new Error(`Invalid product id: ${orderData.product}`);
      }

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

      await this.saveOrder(order)
      await this.setupMonitoringForOrder(order)
      await this.activateRequiredSystems(order)
      await this.sendActivationNotification(order)
      await this.scheduleAutomatedTasks(order)

    } catch (error) {
      console.error('Erro ao processar pedido Vaga Express:', error)
      throw error
    }
  }

  private async saveOrder(order: VagaExpressOrder): Promise<void> {
    const orders = await this.getPersistentState<VagaExpressOrder[]>('vaga_express_orders', [])
    orders.push(order)
    await this.setPersistentState('vaga_express_orders', orders)
  }

  private async getOrder(orderId: string): Promise<VagaExpressOrder | null> {
    const orders = await this.getPersistentState<VagaExpressOrder[]>('vaga_express_orders', [])
    return orders.find(o => o.orderId === orderId) || null
  }

  private async saveNotificationConfig(orderId: string, config: any): Promise<void> {
    const configs = await this.getPersistentState<Record<string, any>>('vaga_express_notify_configs', {})
    configs[orderId] = config
    await this.setPersistentState('vaga_express_notify_configs', configs)
  }

  private async setupMonitoringForOrder(order: VagaExpressOrder): Promise<void> {
    const channelsToActivate = new Set<string>();
    channelsToActivate.add('telegram-monitoring');
    channelsToActivate.add('basic-scraping');

    if (order.priority === 'premium' || order.priority === 'vip') {
      channelsToActivate.add('advanced-scraping');
      channelsToActivate.add('email-monitoring');
    }

    if (order.priority === 'vip') {
      channelsToActivate.add('browser-automation');
      channelsToActivate.add('phone-notifications');
    }

    for (const channel of Array.from(channelsToActivate)) {
      await this.activateMonitoringChannel(channel, order)
    }
  }

  private async activateMonitoringChannel(channel: string, order: VagaExpressOrder): Promise<void> {
    console.log(`Activating ${channel} for ${order.orderId}`)
    // Real logic would go here
  }

  private async activateRequiredSystems(order: VagaExpressOrder): Promise<void> {
    const config = this.planConfigs[order.productId]
    if (!config) return

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

    if (order.priority === 'premium' || order.priority === 'vip') {
      notificationConfig.channels.push('email', 'whatsapp')
    }

    if (order.priority === 'vip') {
      notificationConfig.channels.push('sms', 'phone-call')
    }

    await this.saveNotificationConfig(order.orderId, notificationConfig)
  }

  private async sendActivationNotification(order: VagaExpressOrder): Promise<void> {
    const planName = order.productId.replace('vaga-express-', '').toUpperCase()
    console.log(`Sending activation notification for ${planName} to ${order.customerEmail}`)
  }

  private async scheduleAutomatedTasks(order: VagaExpressOrder): Promise<void> {
    console.log(`Scheduled automated tasks for ${order.orderId}`)
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
    const configs = await this.getPersistentState<Record<string, any>>('vaga_express_notify_configs', {})
    const notificationConfig = configs[order.orderId]

    if (!notificationConfig) return

    const message = `🚨 ALERTA DE VAGA! 🚨\n\nConsulado: ${alert.consulate}\nData: ${alert.date}\nHorário: ${alert.time}\n\nLink: ${alert.link}`

    for (const channel of notificationConfig.channels) {
      console.log(`Sending ${channel} notification for ${order.orderId}: ${message}`)
    }
  }

  async getOrderStatistics(): Promise<any> {
    const orders = await this.getPersistentState<VagaExpressOrder[]>('vaga_express_orders', [])
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
}

export const vagaExpressIntegration = new VagaExpressIntegration()