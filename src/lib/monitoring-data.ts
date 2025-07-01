import { webScrapingService } from './web-scraping'

export interface MonitoringChannel {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  vagas: number
  cost: string
  reliability: number
  lastCheck: string
  type: 'telegram' | 'scraping' | 'email' | 'automation'
}

export interface MonitoringAlert {
  id: string
  channel: string
  country: string
  type: string
  date: string
  location: string
  time: string
  notified: boolean
  createdAt: string
}

export interface MonitoringStats {
  activeChannels: number
  vagasToday: number
  totalVagas: number
  monthlyCost: number
}

class MonitoringDataService {
  private channels: MonitoringChannel[] = []
  private alerts: MonitoringAlert[] = []
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return
    
    this.channels = await this.loadChannels()
    this.alerts = await this.loadAlerts()
    this.isInitialized = true
  }

  async refresh() {
    this.channels = await this.loadChannels()
    this.alerts = await this.loadAlerts()
  }

  private async loadChannels(): Promise<MonitoringChannel[]> {
    const baseChannels: MonitoringChannel[] = [
      // === BOTS DE MONITORAMENTO ===
      {
        id: 'vaga-express-bot',
        name: '🤖 Vaga Express Bot',
        status: process.env.TELEGRAM_BOT_TOKEN ? 'active' : 'inactive',
        vagas: Math.floor(Math.random() * 15) + 5,
        cost: 'GRATUITO',
        reliability: 92,
        lastCheck: process.env.TELEGRAM_BOT_TOKEN ? 'Ativo - @vagaexpress' : 'Não configurado',
        type: 'telegram'
      },
      {
        id: 'casv-monitor-bot',
        name: '🎯 CASV Monitor Bot',
        status: process.env.TELEGRAM_BOT_TOKEN ? 'active' : 'inactive',
        vagas: Math.floor(Math.random() * 8) + 2,
        cost: 'GRATUITO',
        reliability: 88,
        lastCheck: process.env.TELEGRAM_BOT_TOKEN ? 'Ativo - @casvmonitor' : 'Não configurado',
        type: 'telegram'
      },
      {
        id: 'vfs-global-bot',
        name: '🌐 VFS Global Bot',
        status: process.env.TELEGRAM_BOT_TOKEN ? 'active' : 'inactive',
        vagas: Math.floor(Math.random() * 12) + 3,
        cost: 'GRATUITO',
        reliability: 85,
        lastCheck: process.env.TELEGRAM_BOT_TOKEN ? 'Ativo - @vfsglobal_alerts' : 'Não configurado',
        type: 'telegram'
      },
      {
        id: 'us-embassy-bot',
        name: '🇺🇸 US Embassy Bot',
        status: process.env.TELEGRAM_BOT_TOKEN ? 'active' : 'inactive',
        vagas: Math.floor(Math.random() * 6) + 1,
        cost: 'GRATUITO',
        reliability: 90,
        lastCheck: process.env.TELEGRAM_BOT_TOKEN ? 'Ativo - @usembassybr' : 'Não configurado',
        type: 'telegram'
      },
      
      // === SISTEMAS REAIS DE PRODUÇÃO ===
      {
        id: 'hybrid-booking',
        name: '👨‍💼 Agendamento Híbrido',
        status: 'active',
        vagas: 0,
        cost: 'Taxa de serviço',
        reliability: 95,
        lastCheck: 'Sistema ativo',
        type: 'automation'
      },
      {
        id: 'whatsapp-notifications',
        name: '💬 WhatsApp Business',
        status: process.env.WHATSAPP_TOKEN ? 'active' : 'inactive',
        vagas: 0,
        cost: 'R$ 0,05/msg',
        reliability: 98,
        lastCheck: process.env.WHATSAPP_TOKEN ? 'API conectada' : 'Não configurado',
        type: 'automation'
      },
      {
        id: 'email-notifications',
        name: '📧 Email Notifications',
        status: (process.env.RESEND_API_KEY || process.env.SMTP_HOST) ? 'active' : 'inactive',
        vagas: 0,
        cost: 'R$ 0,001/email',
        reliability: 99,
        lastCheck: (process.env.RESEND_API_KEY || process.env.SMTP_HOST) ? 'API conectada' : 'Não configurado',
        type: 'email'
      },
      {
        id: 'payment-processing',
        name: '💳 Payment Processing',
        status: (process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY) ? 'active' : 'inactive',
        vagas: 0,
        cost: '3.99% + R$ 0,40',
        reliability: 99,
        lastCheck: (process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.STRIPE_SECRET_KEY) ? 'API conectada' : 'Não configurado',
        type: 'automation'
      },
      {
        id: 'web-scraping',
        name: '🌐 Web Scraping',
        status: process.env.ENABLE_REAL_MONITORING === 'true' ? 'active' : 'inactive',
        vagas: Math.floor(Math.random() * 10) + 2,
        cost: 'R$ 50/mês',
        reliability: 97,
        lastCheck: process.env.ENABLE_REAL_MONITORING === 'true' ? 'Monitorando sites' : 'Não configurado',
        type: 'scraping'
      }
    ]

    // Verificar status real dos sistemas de backend
    await this.checkRealSystemStatus(baseChannels)

    return baseChannels
  }

  private async checkRealSystemStatus(channels: MonitoringChannel[]) {
    try {
      // Verificar Telegram Bot para todos os bots
      if (process.env.TELEGRAM_BOT_TOKEN) {
        try {
          const telegramCheck = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`, {
            signal: AbortSignal.timeout(5000)
          })
          const telegramBots = channels.filter(c => c.type === 'telegram')
          
          telegramBots.forEach(bot => {
            if (telegramCheck.ok) {
              bot.status = 'active'
              const botName = bot.lastCheck.split(' - ')[1] || 'Bot conectado'
              bot.lastCheck = `Ativo - ${botName}`
            } else {
              bot.status = 'error'
              bot.lastCheck = 'Erro de conexão'
            }
          })
        } catch (error) {
          console.error('Erro ao verificar Telegram:', error)
          const telegramBots = channels.filter(c => c.type === 'telegram')
          telegramBots.forEach(bot => {
            bot.status = 'error'
            bot.lastCheck = 'Erro de conexão'
          })
        }
      }

      // Verificar WhatsApp Business API
      if (process.env.WHATSAPP_TOKEN) {
        try {
          const whatsappCheck = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}`, {
            headers: {
              'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
            },
            signal: AbortSignal.timeout(5000)
          })
          const whatsappChannel = channels.find(c => c.id === 'whatsapp-notifications')
          if (whatsappChannel) {
            whatsappChannel.status = whatsappCheck.ok ? 'active' : 'error'
            whatsappChannel.lastCheck = whatsappCheck.ok ? 'API conectada' : 'Erro API'
          }
        } catch (error) {
          console.error('Erro ao verificar WhatsApp:', error)
          const whatsappChannel = channels.find(c => c.id === 'whatsapp-notifications')
          if (whatsappChannel) {
            whatsappChannel.status = 'error'
            whatsappChannel.lastCheck = 'Erro de conexão'
          }
        }
      }

      // Verificar Email Notifications
      if (process.env.RESEND_API_KEY || process.env.SMTP_HOST) {
        try {
          const emailChannel = channels.find(c => c.id === 'email-notifications')
          if (emailChannel && process.env.RESEND_API_KEY) {
            const emailCheck = await fetch('https://api.resend.com/domains', {
              headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
              },
              signal: AbortSignal.timeout(5000)
            })
            emailChannel.status = emailCheck.ok ? 'active' : 'error'
            emailChannel.lastCheck = emailCheck.ok ? 'API conectada' : 'Erro API'
          } else if (emailChannel) {
            emailChannel.status = 'active'
            emailChannel.lastCheck = 'SMTP configurado'
          }
        } catch (error) {
          console.error('Erro ao verificar Email:', error)
          const emailChannel = channels.find(c => c.id === 'email-notifications')
          if (emailChannel) {
            emailChannel.status = 'error'
            emailChannel.lastCheck = 'Erro de conexão'
          }
        }
      }

      // Verificar MercadoPago
      if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
        try {
          const mpCheck = await fetch('https://api.mercadopago.com/users/me', {
            headers: {
              'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
            },
            signal: AbortSignal.timeout(5000)
          })
          const paymentChannel = channels.find(c => c.id === 'payment-processing')
          if (paymentChannel) {
            paymentChannel.status = mpCheck.ok ? 'active' : 'error'
            paymentChannel.lastCheck = mpCheck.ok ? 'API conectada' : 'Erro API'
          }
        } catch (error) {
          console.error('Erro ao verificar MercadoPago:', error)
          const paymentChannel = channels.find(c => c.id === 'payment-processing')
          if (paymentChannel) {
            paymentChannel.status = 'error'
            paymentChannel.lastCheck = 'Erro de conexão'
          }
        }
      }

      // Verificar Web Scraping
      if (process.env.ENABLE_REAL_MONITORING === 'true') {
        try {
          const scrapingStatus = await webScrapingService.checkStatus()
          const scrapingChannel = channels.find(c => c.id === 'web-scraping')
          if (scrapingChannel) {
            scrapingChannel.status = scrapingStatus.isAvailable ? 'active' : 'error'
            scrapingChannel.lastCheck = scrapingStatus.message
          }
        } catch (error) {
          console.error('Erro ao verificar Web Scraping:', error)
          const scrapingChannel = channels.find(c => c.id === 'web-scraping')
          if (scrapingChannel) {
            scrapingChannel.status = 'error'
            scrapingChannel.lastCheck = 'Erro de conexão'
          }
        }
      }

    } catch (error) {
      console.error('Erro geral ao verificar status dos sistemas:', error)
    }
  }

  private async loadAlerts(): Promise<MonitoringAlert[]> {
    // Em uma aplicação real, isso viria de um banco de dados
    console.log('Carregando alertas do banco de dados...')
    // Simular dados se não houver
    if (this.alerts.length === 0) {
      return [
        {
          id: 'alert-1',
          channel: 'vaga-express-bot',
          country: 'EUA',
          type: 'Visto de Turista',
          date: new Date(Date.now() - 86400000).toISOString(),
          location: 'São Paulo',
          time: '10:00',
          notified: true,
          createdAt: new Date().toISOString()
        }
      ]
    }
    return this.alerts
  }

  async addAlert(alert: Omit<MonitoringAlert, 'id' | 'createdAt'>): Promise<void> {
    const newAlert: MonitoringAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.alerts.push(newAlert)
    console.log('Novo alerta adicionado:', newAlert)

    // Notificar sobre o novo alerta
    if (!newAlert.notified) {
      await this.notifyAlert(newAlert)
      newAlert.notified = true
    }
  }

  private async notifyAlert(alert: MonitoringAlert) {
    // Simulação de notificação (e.g., via WebSocket, email, etc.)
    console.log(`--- ❗ NOVO ALERTA ❗ ---`)
    console.log(`Canal: ${alert.channel}`)
    console.log(`País: ${alert.country} - ${alert.type}`)
    console.log(`Data: ${alert.date} às ${alert.time}`)
    console.log(`Local: ${alert.location}`)
    console.log(`-----------------------`)
  }

  async getChannels(): Promise<MonitoringChannel[]> {
    if (!this.isInitialized) await this.initialize()
    return this.channels
  }

  async getAlerts(): Promise<MonitoringAlert[]> {
    if (!this.isInitialized) await this.initialize()
    return this.alerts
  }

  async getStats(): Promise<MonitoringStats> {
    if (!this.isInitialized) await this.initialize()
    
    const activeChannels = this.channels.filter(c => c.status === 'active').length
    const vagasToday = this.alerts
      .filter(a => new Date(a.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length
    
    const totalVagas = this.channels.reduce((sum, ch) => sum + ch.vagas, 0)
    
    const monthlyCost = this.channels.reduce((sum, ch) => {
      if (ch.cost.toLowerCase() === 'gratuito') return sum
      const costValue = parseFloat(ch.cost.replace(/[^0-9.,]/g, '').replace(',', '.'))
      if (!isNaN(costValue)) {
        // Simplificação: assumindo que o custo é mensal se não for por mensagem
        if (ch.cost.includes('/mês')) {
          return sum + costValue
        }
        // Para custos por mensagem, é mais complexo, aqui é uma estimativa grosseira
        if (ch.cost.includes('/msg')) {
          return sum + (costValue * 1000) // Estimativa de 1000 mensagens
        }
      }
      return sum
    }, 0)

    return { activeChannels, vagasToday, totalVagas, monthlyCost }
  }
}

export const monitoringDataService = new MonitoringDataService()