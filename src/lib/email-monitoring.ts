import { google } from 'googleapis'

interface EmailAlert {
  subject: string
  from: string
  date: string
  snippet: string
  hasSlots: boolean
}

export class EmailMonitoringService {
  private gmail: any = null

  async init() {
    try {
      // Configurar Gmail API (necessário OAuth2 setup)
      const auth = new google.auth.GoogleAuth({
        keyFile: './credentials/gmail-credentials.json', // Você precisa criar este arquivo
        scopes: ['https://www.googleapis.com/auth/gmail.readonly']
      })

      this.gmail = google.gmail({ version: 'v1', auth })
    } catch (error) {
      console.error('Erro ao inicializar Gmail API:', error)
    }
  }

  // Palavras-chave para detectar vagas
  private readonly keywords = [
    'appointment available',
    'slot available', 
    'vaga disponível',
    'agendamento disponível',
    'interview appointment',
    'visa appointment',
    'consulado',
    'embassy',
    'consulate'
  ]

  // Verificar emails recentes
  async checkRecentEmails(): Promise<EmailAlert[]> {
    const alerts: EmailAlert[] = []

    try {
      if (!this.gmail) await this.init()

      // Buscar emails das últimas 24 horas
      const query = `newer_than:1d (${this.keywords.map(k => `"${k}"`).join(' OR ')})`
      
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50
      })

      if (!response.data.messages) return alerts

      // Processar cada email
      for (const message of response.data.messages) {
        const email = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id
        })

        const headers = email.data.payload.headers
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || ''
        const from = headers.find((h: any) => h.name === 'From')?.value || ''
        const date = headers.find((h: any) => h.name === 'Date')?.value || ''

        // Verificar se contém palavras-chave de slots
        const hasSlots = this.keywords.some(keyword => 
          subject.toLowerCase().includes(keyword.toLowerCase()) ||
          (email.data.snippet || '').toLowerCase().includes(keyword.toLowerCase())
        )

        if (hasSlots) {
          alerts.push({
            subject,
            from,
            date,
            snippet: email.data.snippet || '',
            hasSlots: true
          })
        }
      }
    } catch (error) {
      console.error('Erro ao verificar emails:', error)
    }

    return alerts
  }

  // Monitorar remetentes específicos de consulados
  async checkConsulateEmails(): Promise<EmailAlert[]> {
    const consulateEmails = [
      'noreply@ustraveldocs.com',
      'appointments@vfsglobal.com', 
      'noreply@blsconnect.com',
      'consulado@itamaraty.gov.br'
    ]

    const alerts: EmailAlert[] = []

    try {
      for (const sender of consulateEmails) {
        const query = `from:${sender} newer_than:1d`
        
        const response = await this.gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 10
        })

        if (response.data.messages) {
          for (const message of response.data.messages) {
            const email = await this.gmail.users.messages.get({
              userId: 'me',
              id: message.id
            })

            const headers = email.data.payload.headers
            const subject = headers.find((h: any) => h.name === 'Subject')?.value || ''

            alerts.push({
              subject,
              from: sender,
              date: new Date().toISOString(),
              snippet: email.data.snippet || '',
              hasSlots: true
            })
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar emails de consulados:', error)
    }

    return alerts
  }

  // Notificar sobre emails relevantes
  async notifyEmailAlerts(alerts: EmailAlert[]) {
    if (alerts.length === 0) return

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) return

    for (const alert of alerts) {
      const message = `📧 ALERTA EMAIL DETECTADO!

📩 Assunto: ${alert.subject}
👤 De: ${alert.from}
📅 Data: ${alert.date}

📋 Conteúdo: ${alert.snippet.substring(0, 200)}...

🔍 Fonte: Email Monitoring
⏰ Verificado: ${new Date().toLocaleString('pt-BR')}`

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        })
      } catch (error) {
        console.error('Erro ao notificar email:', error)
      }
    }
  }
}

export const emailMonitoringService = new EmailMonitoringService()