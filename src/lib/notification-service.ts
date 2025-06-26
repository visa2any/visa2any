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
    apiUrl: process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send'

    token: process.env.WHATSAPP_API_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessPhone: process.env.WHATSAPP_BUSINESS_PHONE || '+5511999999999'
  }

  private readonly emailConfig = {
    apiKey: process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@visa2any.com',
    fromName: process.env.FROM_NAME || 'Visa2Any',
    provider: process.env.EMAIL_PROVIDER || 'sendgrid' // 'sendgrid' ou 'resend'
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
      errors.push(`WhatsApp: ${error}`)
    }

    try {
      // Email
      const emailMessage = this.generateBookingCreatedEmail(data)
      emailSent = await this.sendEmail(emailMessage)
      
      if (!emailSent) {
        errors.push('Falha ao enviar email')
      }
    } catch (error) {
      errors.push(`Email: ${error}`)
    }

    return { whatsappSent, emailSent, errors }
  }

  // Notificar confirmação de pagamento
  async sendPaymentConfirmation(trackingId: string): Promise<boolean> {
    try {
      // Buscar dados do agendamento
      const bookingData = await this.getBookingData(trackingId)
      
      if (!bookingData) {
        console.error('Dados do agendamento não encontrados:', trackingId)
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

      const whatsappSent = await this.sendWhatsApp(whatsappMessage)
      const emailSent = await this.sendEmail(emailMessage)

      return whatsappSent || emailSent

    } catch (error) {
      console.error('Erro ao enviar confirmação de pagamento:', error)
      return false
    }
  }

  // Notificar atualização do agendamento
  async sendBookingUpdate(trackingId: string, status: string): Promise<boolean> {
    try {
      const bookingData = await this.getBookingData(trackingId)
      if (!bookingData) return false

      const updates = this.getStatusMessage(status)
      
      const whatsappMessage: WhatsAppMessage = {
        to: bookingData.customerPhone,
        message: `📋 *Atualização do Agendamento*\n\n🎯 Tracking: ${trackingId}\n${updates.icon} ${updates.title}\n\n${updates.description}\n\n${updates.nextSteps}\n\n_Visa2Any_`,
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

      const whatsappSent = await this.sendWhatsApp(whatsappMessage)
      const emailSent = await this.sendEmail(emailMessage)

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
      if (!this.whatsappConfig.token) {
        console.log('WhatsApp não configurado - simulando envio:', message.message)
        return true // Simular sucesso em desenvolvimento
      }

      // Implementação real com WhatsApp Business API
      const response = await fetch(`${this.whatsappConfig.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.whatsappConfig.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.to.replace(/\\D/g, ''), // Apenas números
          type: message.type,
          text: { body: message.message }
        })
      })

      return response.ok

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

  // SendGrid
  private async sendViaSendGrid(message: EmailMessage): Promise<boolean> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.emailConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: message.to }] }],
        from: { email: this.emailConfig.fromEmail, name: this.emailConfig.fromName },
        subject: message.subject,
        content: [{ type: 'text/html', value: message.html }]
      })
    })

    return response.ok
  }

  // Resend
  private async sendViaResend(message: EmailMessage): Promise<boolean> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.emailConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${this.emailConfig.fromName} <${this.emailConfig.fromEmail}>`,
        to: [message.to],
        subject: message.subject,
        html: message.html
      })
    })

    return response.ok
  }

  // === GERADORES DE MENSAGENS ===

  private generateBookingCreatedWhatsApp(data: NotificationData): WhatsAppMessage {
    const serviceEmoji = { basic: '🌟', premium: '💎', express: '🚀' }
    
    return {
      to: data.customerPhone,
      message: `${serviceEmoji[data.serviceLevel]} *Agendamento Criado - Visa2Any*\n\nOlá ${data.customerName}!\n\n✅ Tracking: ${data.trackingId}\n🎯 Destino: ${data.country.toUpperCase()}\n📋 Tipo: ${data.visaType}\n⭐ Nível: ${data.serviceLevel.toUpperCase()}\n\n📞 Em breve nossa equipe entrará em contato com as próximas instruções.\n\n_Visa2Any - Seu visto sem complicação_`,
      type: 'text'
    }
  }

  private generateBookingCreatedEmail(data: NotificationData): EmailMessage {
    return {
      to: data.customerEmail,
      subject: `✅ Agendamento Criado - ${data.trackingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Agendamento Criado - Visa2Any</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">🎯 Agendamento Criado com Sucesso!</h1>
            
            <p>Olá <strong>${data.customerName}</strong>,</p>
            
            <p>Seu agendamento foi criado e está sendo processado por nossa equipe especializada.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 Detalhes do Agendamento</h3>
              <ul>
                <li><strong>Tracking ID:</strong> ${data.trackingId}</li>
                <li><strong>Destino:</strong> ${data.country.toUpperCase()}</li>
                <li><strong>Tipo de Visto:</strong> ${data.visaType}</li>
                <li><strong>Nível de Serviço:</strong> ${data.serviceLevel.toUpperCase()}</li>
              </ul>
            </div>
            
            <h3>🚀 Próximos Passos</h3>
            <ol>
              <li>Nossa equipe verificará as melhores datas disponíveis</li>
              <li>Você receberá o link de pagamento em breve</li>
              <li>Após o pagamento, processaremos seu agendamento</li>
              <li>Enviaremos a confirmação com todos os detalhes</li>
            </ol>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              💡 <strong>Dica:</strong> Mantenha seus documentos atualizados e válidos.
            </div>
            
            <p>Qualquer dúvida, entre em contato conosco!</p>
            
            <p>Atenciosamente,<br><strong>Equipe Visa2Any</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Visa2Any - Facilitando sua jornada internacional<br>
              Este é um email automático, não responda.
            </p>
          </div>
        </body>
        </html>
      `
    }
  }

  private generatePaymentConfirmedEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pagamento Confirmado - Visa2Any</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #059669;">🎉 Pagamento Confirmado!</h1>
          
          <p>Olá <strong>${data.customerName}</strong>,</p>
          
          <p>Recebemos seu pagamento com sucesso! Seu agendamento está sendo processado pela nossa equipe.</p>
          
          <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💰 Detalhes do Pagamento</h3>
            <ul>
              <li><strong>Valor:</strong> R$ ${data.amount}</li>
              <li><strong>Tracking:</strong> ${data.trackingId}</li>
              <li><strong>Status:</strong> ✅ Confirmado</li>
            </ul>
          </div>
          
          <p>Em breve você receberá a confirmação do agendamento com todos os detalhes.</p>
          
          <p>Obrigado por escolher a Visa2Any!</p>
          
          <p>Atenciosamente,<br><strong>Equipe Visa2Any</strong></p>
        </div>
      </body>
      </html>
    `
  }

  private generateBookingCompletedEmailTemplate(data: any, appointmentDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Agendamento Confirmado - Visa2Any</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">🎉 AGENDAMENTO CONFIRMADO!</h1>
          
          <p>Parabéns <strong>${data.customerName}</strong>!</p>
          
          <p>Seu agendamento foi confirmado com sucesso!</p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3>📅 Detalhes do Agendamento</h3>
            <ul>
              <li><strong>Local:</strong> ${appointmentDetails.location}</li>
              <li><strong>Data:</strong> ${appointmentDetails.date}</li>
              <li><strong>Horário:</strong> ${appointmentDetails.time}</li>
              <li><strong>Confirmação:</strong> ${appointmentDetails.confirmationCode}</li>
            </ul>
          </div>
          
          <h3>📋 Próximos Passos Importantes</h3>
          <ol>
            <li><strong>Prepare seus documentos</strong> conforme a lista oficial</li>
            <li><strong>Chegue 30 minutos antes</strong> do horário agendado</li>
            <li><strong>Leve esta confirmação impressa</strong></li>
            <li><strong>Siga as instruções</strong> do consulado</li>
          </ol>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            💡 <strong>Importante:</strong> Não falte ao agendamento. Reagendamentos podem ter custos adicionais.
          </div>
          
          <p><strong>Obrigado por confiar na Visa2Any!</strong></p>
          
          <p>Boa viagem! 🌍</p>
          
          <p>Atenciosamente,<br><strong>Equipe Visa2Any</strong></p>
        </div>
      </body>
      </html>
    `
  }

  private getStatusMessage(status: string): { icon: string, title: string, description: string, nextSteps: string } {
    const messages: Record<string, any> = {
      payment_approved: {
        icon: '✅',
        title: 'Pagamento Aprovado',
        description: 'Processamento do agendamento iniciado.',
        nextSteps: 'Aguarde a confirmação da data e horário.'
      },
      searching_slots: {
        icon: '🔍',
        title: 'Buscando Vagas',
        description: 'Procurando as melhores datas disponíveis.',
        nextSteps: 'Notificaremos assim que encontrarmos uma vaga.'
      },
      slot_found: {
        icon: '🎯',
        title: 'Vaga Encontrada',
        description: 'Encontramos uma vaga e estamos fazendo a reserva.',
        nextSteps: 'Confirmação em breve!'
      },
      booking_confirmed: {
        icon: '🎉',
        title: 'Agendamento Confirmado',
        description: 'Seu agendamento foi confirmado com sucesso!',
        nextSteps: 'Verifique os detalhes e prepare-se para o consulado.'
      }
    }

    return messages[status] || {
      icon: 'ℹ️',
      title: 'Atualização',
      description: 'Status do agendamento atualizado.',
      nextSteps: 'Acompanhe pelo nosso portal.'
    }
  }

  // Método auxiliar para buscar dados do agendamento
  private async getBookingData(trackingId: string): Promise<any> {
    // Em produção
 buscaria do banco de dados
    // Por enquanto
 retornamos dados simulados
    return {
      trackingId,
      customerName: 'Cliente Teste',
      customerEmail: 'cliente@email.com',
      customerPhone: '+5511999999999',
      amount: 45.00,
      serviceLevel: 'premium',
      country: 'usa',
      visaType: 'tourist'
    }
  }

  // Testar configuração das notificações
  async testConfiguration(): Promise<{
    whatsapp: { configured: boolean, status: string }
    email: { configured: boolean, status: string, provider: string }
  }> {
    return {
      whatsapp: {
        configured: !!this.whatsappConfig.token,
        status: this.whatsappConfig.token ? 'Configurado' : 'Não configurado - Configure WHATSAPP_API_TOKEN'
      },
      email: {
        configured: !!this.emailConfig.apiKey,
        status: this.emailConfig.apiKey ? 'Configurado' : 'Não configurado - Configure SENDGRID_API_KEY ou RESEND_API_KEY',
        provider: this.emailConfig.provider
      }
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Types export
export type { NotificationData, WhatsAppMessage, EmailMessage }