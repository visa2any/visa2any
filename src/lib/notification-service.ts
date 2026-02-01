// Sistema de Notificações - WhatsApp e Email
// Comunicação automática com clientes

interface NotificationData {
  trackingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceLevel: 'basic' | 'premium' | 'express'
  country: string
  visaType: string
  amount?: number
  paymentId?: string
  appointmentDetails?: {
    location?: string
    date?: string
    time?: string
    confirmationCode?: string
  }
}

interface WhatsAppMessage {
  to: string
  message: string
  type: 'text' | 'template' | 'media'
  templateName?: string
  templateData?: any
}

interface EmailMessage {
  to: string
  subject: string
  html: string
  attachments?: any[]
}

class NotificationService {
  private readonly whatsappConfig = {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessPhone: process.env.WHATSAPP_BUSINESS_PHONE || '+551151971375'
  }

  private readonly emailConfig = {
    apiKey: process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'visa2any@gmail.com',
    fromName: 'Visa2Any',
    provider: process.env.SENDGRID_API_KEY ? 'sendgrid' : 'resend'
  }

  // === NOTIFICAÇÕES DE AGENDAMENTO ===

  // Notificar criação de agendamento
  async sendBookingCreated(data: NotificationData): Promise<{
    whatsappSent: boolean
    emailSent: boolean
    errors: string[]
  }> {
    const errors: string[] = []
    let whatsappSent = false
    let emailSent = false

    try {
      // WhatsApp
      const whatsappMessage = this.generateBookingCreatedWhatsApp(data)
      whatsappSent = await this.sendWhatsApp(whatsappMessage)

      if (!whatsappSent) {
        errors.push('Falha ao enviar WhatsApp')
      }
    } catch (error) {
      errors.push(`WhatsApp: ${error instanceof Error ? error.message : String(error)}`)
    }

    try {
      // Email
      const emailMessage = this.generateBookingCreatedEmail(data)
      emailSent = await this.sendEmail(emailMessage)

      if (!emailSent) {
        errors.push('Falha ao enviar email')
      }
    } catch (error) {
      errors.push(`Email: ${error instanceof Error ? error.message : String(error)}`)
    }

    return { whatsappSent, emailSent, errors }
  }

  // Notificar confirmação de pagamento
  async sendPaymentConfirmation(trackingId: string): Promise<boolean> {
    try {
      // Buscar dados do agendamento
      const bookingData = await this.getBookingData(trackingId)

      if (!bookingData) {
        console.error('Dados do agendamento não encontrados para confirmação de pagamento:', trackingId)
        return false
      }

      // WhatsApp
      const whatsappMessage: WhatsAppMessage = {
        to: bookingData.customerPhone,
        message: `🎉 *Pagamento Confirmado!*\n\n✅ Agendamento: ${trackingId}\n💰 Valor: R$ ${bookingData.amount}\n🚀 Processamento iniciado!\n\nEm breve enviaremos atualizações sobre seu agendamento.\n\n_Visa2Any - Seu visto sem complicação_`,
        type: 'text'
      }

      // Email
      const emailMessage: EmailMessage = {
        to: bookingData.customerEmail,
        subject: '🎉 Pagamento Confirmado - Visa2Any',
        html: this.generatePaymentConfirmedEmailTemplate(bookingData)
      }

      const [whatsappSent, emailSent] = await Promise.all([
        this.sendWhatsApp(whatsappMessage),
        this.sendEmail(emailMessage)
      ])

      return whatsappSent || emailSent

    } catch (error) {
      console.error('Erro ao enviar confirmação de pagamento:', error)
      return false
    }
  }

  // Notificar atualização do agendamento
  async sendBookingUpdate(trackingId: string, status: string, details?: string): Promise<boolean> {
    try {
      const bookingData = await this.getBookingData(trackingId)
      if (!bookingData) return false

      const updates = this.getStatusMessage(status)

      const whatsappMessage: WhatsAppMessage = {
        to: bookingData.customerPhone,
        message: `📋 *Atualização do Agendamento*\n\n🎯 Tracking: ${trackingId}\n${updates.icon} ${updates.title}\n\n${updates.description}${details ? `\n\nDetalhes: ${details}` : ''}\n\n${updates.nextSteps}\n\n_Visa2Any_`,
        type: 'text'
      }

      return await this.sendWhatsApp(whatsappMessage)

    } catch (error) {
      console.error('Erro ao enviar atualização:', error)
      return false
    }
  }

  // Notificar agendamento concluído
  async sendBookingCompleted(trackingId: string, appointmentDetails: any): Promise<boolean> {
    try {
      const bookingData = await this.getBookingData(trackingId)
      if (!bookingData) return false

      const whatsappMessage: WhatsAppMessage = {
        to: bookingData.customerPhone,
        message: `🎉 *AGENDAMENTO CONFIRMADO!*\n\n✅ Consulado: ${appointmentDetails.location}\n📅 Data: ${appointmentDetails.date}\n⏰ Horário: ${appointmentDetails.time}\n🎫 Confirmação: ${appointmentDetails.confirmationCode}\n\n📋 *Próximos passos:*\n• Prepare seus documentos\n• Chegue 30min antes\n• Leve a confirmação impressa\n\n🎯 Tracking: ${trackingId}\n\n_Visa2Any - Missão cumprida!_ 🚀`,
        type: 'text'
      }

      const emailMessage: EmailMessage = {
        to: bookingData.customerEmail,
        subject: '🎉 Agendamento Confirmado - Visa2Any',
        html: this.generateBookingCompletedEmailTemplate(bookingData, appointmentDetails)
      }

      const [whatsappSent, emailSent] = await Promise.all([
        this.sendWhatsApp(whatsappMessage),
        this.sendEmail(emailMessage)
      ])

      return whatsappSent || emailSent

    } catch (error) {
      console.error('Erro ao enviar confirmação final:', error)
      return false
    }
  }

  // === NOTIFICAÇÕES DE PAGAMENTO ===

  // Enviar link de pagamento
  async sendPaymentLink(trackingId: string, paymentUrl: string, pixCode?: string): Promise<boolean> {
    try {
      const bookingData = await this.getBookingData(trackingId)
      if (!bookingData) return false

      const whatsappMessage: WhatsAppMessage = {
        to: bookingData.customerPhone,
        message: `💳 *Link de Pagamento - Visa2Any*\n\n🎯 Agendamento: ${trackingId}\n💰 Valor: R$ ${bookingData.amount}\n⏰ Validade: 24 horas\n\n🔗 *Pagar agora:*\n${paymentUrl}\n\n${pixCode ? `📱 *PIX Copia e Cola:*\n\`${pixCode}\`\n\n` : ''}⚡ Confirmação automática após pagamento!\n\n_Visa2Any_`,
        type: 'text'
      }

      return await this.sendWhatsApp(whatsappMessage)

    } catch (error) {
      console.error('Erro ao enviar link de pagamento:', error)
      return false
    }
  }

  // === MÉTODOS DE ENVIO ===

  // Enviar WhatsApp
  private async sendWhatsApp(message: WhatsAppMessage): Promise<boolean> {
    try {
      if (!this.whatsappConfig.token || !this.whatsappConfig.phoneNumberId) {
        console.log('WhatsApp não configurado - simulando envio:', message.message)
        return true // Simular sucesso em desenvolvimento
      }

      const response = await fetch(`${this.whatsappConfig.apiUrl}/${this.whatsappConfig.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.whatsappConfig.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.to.replace(/\D/g, ''), // Apenas números
          type: message.type,
          text: { body: message.message }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API do WhatsApp:', errorData)
        return false
      }
      return true

    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error)
      return false
    }
  }

  // Enviar Email
  private async sendEmail(message: EmailMessage): Promise<boolean> {
    try {
      if (!this.emailConfig.apiKey) {
        console.log('Email não configurado - simulando envio para:', message.to)
        return true // Simular sucesso em desenvolvimento
      }

      if (this.emailConfig.provider === 'sendgrid') {
        return await this.sendViaSendGrid(message)
      } else {
        return await this.sendViaResend(message)
      }

    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  private async sendViaSendGrid(message: EmailMessage): Promise<boolean> {
    const { default: sgMail } = await import('@sendgrid/mail')
    sgMail.setApiKey(this.emailConfig.apiKey)

    const msg = {
      to: message.to,
      from: {
        email: this.emailConfig.fromEmail,
        name: this.emailConfig.fromName
      },
      subject: message.subject,
      html: message.html,
      ...(message.attachments ? { attachments: message.attachments } : {})
    }

    try {
      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Erro SendGrid:', error)
      return false
    }
  }

  private async sendViaResend(message: EmailMessage): Promise<boolean> {
    const { Resend } = await import('resend')
    const resend = new Resend(this.emailConfig.apiKey)

    try {
      await resend.emails.send({
        from: `${this.emailConfig.fromName} <${this.emailConfig.fromEmail}>`,
        to: message.to,
        subject: message.subject,
        html: message.html,
        ...(message.attachments ? { attachments: message.attachments } : {})
      })
      return true
    } catch (error) {
      console.error('Erro Resend:', error)
      return false
    }
  }

  // === TEMPLATES E DADOS ===

  // Busca dados de um agendamento (simulado)
  private async getBookingData(trackingId: string): Promise<NotificationData | null> {
    // Em um sistema real, buscaria no banco de dados
    console.log(`Buscando dados para trackingId: ${trackingId}`)
    return {
      trackingId,
      customerName: 'Cliente Exemplo',
      customerEmail: 'cliente@example.com',
      customerPhone: '+5511987654321', // Número de teste
      serviceLevel: 'premium',
      country: 'EUA',
      visaType: 'Visto de Turista B1/B2',
      amount: 45.00,
      paymentId: 'PAY-' + Date.now()
    }
  }

  private getStatusMessage(status: string): { icon: string; title: string; description: string; nextSteps: string } {
    const messages: Record<string, any> = {
      'SEARCHING': {
        icon: '🔍',
        title: 'Buscando Vagas...',
        description: 'Nossos robôs estão ativamente procurando por vagas de agendamento que atendam às suas preferências.',
        nextSteps: 'Nenhuma ação é necessária no momento. Você será notificado assim que uma vaga for encontrada.'
      },
      'SLOT_FOUND': {
        icon: '🎯',
        title: 'Vaga Encontrada!',
        description: 'Encontramos uma vaga compatível! Estamos agora no processo de pré-reserva para garantir seu lugar.',
        nextSteps: 'Aguarde a confirmação do agendamento. Este processo pode levar alguns minutos.'
      },
      'BOOKING_FAILED': {
        icon: '❌',
        title: 'Falha no Agendamento',
        description: 'Infelizmente, a vaga encontrada foi preenchida antes que pudéssemos confirmar. Não se preocupe, já reiniciamos a busca.',
        nextSteps: 'Continuaremos monitorando ativamente e notificaremos você sobre a próxima vaga.'
      },
      default: {
        icon: 'ℹ️',
        title: 'Status Desconhecido',
        description: 'Ocorreu uma atualização no seu processo. Para mais detalhes, entre em contato com nosso suporte.',
        nextSteps: 'Visite nosso site ou responda esta mensagem para falar com um de nossos especialistas.'
      }
    }
    return messages[status] || messages.default
  }

  // Geração de mensagens
  private generateBookingCreatedWhatsApp(data: NotificationData): WhatsAppMessage {
    const message = `Olá ${data.customerName}, seu pedido de agendamento para *${data.visaType} - ${data.country}* foi recebido!\n\nSeu código de rastreio é *${data.trackingId}*.\n\nVocê receberá atualizações por aqui. Obrigado por escolher a Visa2Any! 🚀`
    return { to: data.customerPhone, message, type: 'text' }
  }

  private generateBookingCreatedEmail(data: NotificationData): EmailMessage {
    return {
      to: data.customerEmail,
      subject: `✅ Pedido de Agendamento Recebido - ${data.trackingId}`,
      html: `<p>Olá ${data.customerName},</p><p>Confirmamos o recebimento do seu pedido de agendamento para <strong>${data.visaType} - ${data.country}</strong>.</p><p>Seu código de rastreio é: <strong>${data.trackingId}</strong></p><p>Manteremos você informado sobre cada etapa do processo. Fique de olho no seu email e WhatsApp!</p><p>Atenciosamente,<br>Equipe Visa2Any</p>`
    }
  }

  private generatePaymentConfirmedEmailTemplate(data: NotificationData): string {
    return `<p>Olá ${data.customerName},</p><p>Seu pagamento no valor de R$ ${data.amount} foi confirmado com sucesso!</p><p>Já iniciamos o processo de busca e agendamento para seu visto. Em breve, você receberá novas atualizações.</p><p><strong>Tracking ID:</strong> ${data.trackingId}</p><p>Obrigado,<br>Equipe Visa2Any</p>`
  }

  private generateBookingCompletedEmailTemplate(data: NotificationData, appointmentDetails: any): string {
    return `<p>Olá ${data.customerName},</p>
            <p><strong>Ótima notícia! Seu agendamento foi confirmado com sucesso!</strong></p>
            <hr>
            <h3>Detalhes do Agendamento:</h3>
            <ul>
              <li><strong>Local:</strong> ${appointmentDetails.location}</li>
              <li><strong>Data:</strong> ${appointmentDetails.date}</li>
              <li><strong>Horário:</strong> ${appointmentDetails.time}</li>
              <li><strong>Código de Confirmação:</strong> ${appointmentDetails.confirmationCode}</li>
            </ul>
            <hr>
            <h3>Instruções Importantes:</h3>
            <ul>
              <li>Compareça ao local com <strong>30 minutos de antecedência</strong>.</li>
              <li>Leve seu <strong>passaporte válido</strong> e todos os <strong>documentos originais</strong> solicitados.</li>
              <li>Imprima e leve esta <strong>confirmação de agendamento</strong>.</li>
            </ul>
            <p>Estamos muito felizes por mais esta conquista!</p>
            <p>Atenciosamente,<br>Equipe Visa2Any</p>`
  }

  private readonly telegramConfig = {
    botToken: process.env.TELEGRAM_ADMIN_BOT_TOKEN || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || ''
  }

  // === ADMIN ALERTS (TELEGRAM) ===

  async sendAdminAlert(topic: string, message: string, data?: any): Promise<boolean> {
    try {
      if (!this.telegramConfig.botToken || !this.telegramConfig.adminChatId) {
        // Silently fail if not configured (to avoid noise if user only wants one bot active)
        return false
      }

      const formattedMessage = `
🔔 *${topic.toUpperCase()}*
──────────────────
${message}
──────────────────
${data ? `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`` : ''}
_Visa2Any System_ 🤖
      `.trim()

      return await this.sendTelegramRaw(this.telegramConfig.adminChatId, formattedMessage)
    } catch (error) {
      console.error('Erro ao enviar alerta admin:', error)
      return false
    }
  }

  async sendPaymentAlert(paymentData: { amount: number, customer: string, product: string, id: string }): Promise<boolean> {
    return this.sendAdminAlert(
      '💰 NOVA VENDA REALIZADA',
      `*Cliente:* ${paymentData.customer}\n*Valor:* R$ ${paymentData.amount.toFixed(2)}\n*Produto:* ${paymentData.product}\n*ID:* ${paymentData.id}`
    )
  }

  async sendLeadAlert(leadData: { name: string, email: string, score: number, country: string }): Promise<boolean> {
    const icon = leadData.score >= 80 ? '🔥' : (leadData.score >= 60 ? '✨' : '⚠️')
    return this.sendAdminAlert(
      '👤 NOVO LEAD QUALIFICADO',
      `${icon} *Score:* ${leadData.score}/100\n*Nome:* ${leadData.name}\n*Email:* ${leadData.email}\n*Interesse:* ${leadData.country}`
    )
  }

  async sendErrorAlert(context: string, error: any): Promise<boolean> {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'

    return this.sendAdminAlert(
      '🚨 ERRO CRÍTICO DO SISTEMA',
      `*Contexto:* ${context}\n*Erro:* ${errorMessage}`,
      { stack: errorStack.substring(0, 500) } // Limit stack size
    )
  }

  private async sendTelegramRaw(chatId: string, text: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.telegramConfig.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      })
      return response.ok
    } catch (e) {
      console.error('Telegram API Error:', e)
      return false
    }
  }

  async testConfiguration(): Promise<{
    whatsapp: { configured: boolean; status: string }
    email: { configured: boolean; status: string; provider: string }
    telegram: { configured: boolean; status: string }
    overall: boolean
  }> {
    const whatsappConfigured = !!(this.whatsappConfig.token && this.whatsappConfig.phoneNumberId)
    const emailConfigured = !!this.emailConfig.apiKey
    const telegramConfigured = !!(this.telegramConfig.botToken && this.telegramConfig.adminChatId)

    return {
      whatsapp: {
        configured: whatsappConfigured,
        status: whatsappConfigured ? 'Configurado' : 'Token ou Phone Number ID não configurado'
      },
      email: {
        configured: emailConfigured,
        status: emailConfigured ? 'Configurado' : 'API Key não configurada',
        provider: this.emailConfig.provider
      },
      telegram: {
        configured: telegramConfigured,
        status: telegramConfigured ? 'Active (Admin Bot)' : 'TELEGRAM_ADMIN_BOT_TOKEN missing'
      },
      overall: whatsappConfigured || emailConfigured || telegramConfigured
    }
  }
}

export const notificationService = new NotificationService()

// Types export
export type { NotificationData, WhatsAppMessage, EmailMessage }