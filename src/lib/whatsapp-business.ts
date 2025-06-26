// WhatsApp Business API - Implementação Real
// Suporte para Meta Cloud API e webhook oficial

export interface WhatsAppMessage {
  to: string
  message: string
  clientId?: string
  template?: string
  variables?: Record<string, any>
  mediaUrl?: string
}

class WhatsAppBusinessService {
  private baseUrl: string
  private phoneNumberId: string
  private accessToken: string
  private isConfigured: boolean

  constructor() {
    this.accessToken = process.env.WHATSAPP_API_TOKEN || ''
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
    this.baseUrl = `https://graph.facebook.com/v17.0/${this.phoneNumberId}`
    
    this.isConfigured = !!(this.accessToken && this.phoneNumberId)
    
    if (!this.isConfigured) {
      console.log('⚠️ WhatsApp Business API não configurado')
      console.log('🔧 Para ativar, configure:')
      console.log('   WHATSAPP_API_TOKEN=seu_token_meta')
      console.log('   WHATSAPP_PHONE_NUMBER_ID=seu_phone_id')
    } else {
      console.log('✅ WhatsApp Business API configurado')
    }
  }

  public async sendMessage(messageData: WhatsAppMessage): Promise<{ 
    success: boolean; 
    messageId?: string; 
    queued?: boolean; 
    error?: string 
  }> {
    
    // Se não configurado
 usar fallback
    if (!this.isConfigured) {
      return this.sendWithFallback(messageData)
    }

    try {
      // Formatar número para padrão internacional
      const formattedNumber = this.formatPhoneNumber(messageData.to)
      
      // Preparar payload para Meta API
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: messageData.message
        }
      }

      console.log('📤 Enviando WhatsApp via Meta API:', formattedNumber)

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.messages?.[0]?.id) {
        console.log('✅ WhatsApp enviado:', result.messages[0].id)
        return {
          messageId: result.messages[0].id
        }
      } else {
        console.error('❌ Erro Meta API:', result)
        return {
          error: result.error?.message || 'Erro desconhecido'
        }
      }

    } catch (error) {
      console.error('❌ Erro ao enviar WhatsApp:', error)
      return {
        error: error.message || 'Erro de conexão'
      }
    }
  }

  // Fallback: usar serviço de terceiros ou simulação
  private async sendWithFallback(messageData: WhatsAppMessage): Promise<{ 
    success: boolean; 
    messageId?: string; 
    queued?: boolean; 
    error?: string 
  }> {
    
    // Opção 1: Tentar WhatsApp via webhook terceirizado
    if (process.env.WHATSAPP_WEBHOOK_URL) {
      try {
        const response = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: messageData.to,
            message: messageData.message,
            clientId: messageData.clientId
          })
        })

        if (response.ok) {
          const result = await response.json()
          return {
            messageId: result.messageId || `wh_${Date.now()}`
          }
        }
      } catch (error) {
        console.error('Webhook falhou:', error)
      }
    }

    // Opção 2: Simular envio com log detalhado
    console.log('📱 SIMULANDO WHATSAPP (API não configurada):')
    console.log('Para:', messageData.to)
    console.log('Mensagem:', messageData.message.substring(0, 100) + '...')
    console.log('💡 Para ativar envios reais, configure WHATSAPP_API_TOKEN')
    console.log('---')

    return {
      messageId: `sim_${Date.now()}`,
      queued: false
    }
  }

  // Templates pré-aprovados (para uso com Meta API)
  public async sendTemplate(to: string, templateName: string, variables: Record<string, any> = {}): Promise<{ 
    success: boolean; 
    messageId?: string; 
    error?: string 
  }> {
    
    if (!this.isConfigured) {
      console.log(`📱 TEMPLATE SIMULADO: ${templateName} para ${to}`)
    }

    try {
      const formattedNumber = this.formatPhoneNumber(to)
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'pt_BR' },
          components: this.buildTemplateComponents(variables)
        }
      }

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.messages?.[0]?.id) {
        return {
          messageId: result.messages[0].id
        }
      } else {
        return {
          error: result.error?.message || 'Erro no template'
        }
      }

    } catch (error) {
      console.error('❌ Erro template:', error)
      return {
        error: error.message
      }
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove caracteres especiais
    let cleaned = phone.replace(/[^\d]/g, '')
    
    // Se começar com 0
 remove
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    
    // Se não tem código do país
 adiciona Brasil (+55)
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      cleaned = '55' + cleaned
    } else if (cleaned.length === 10) {
      cleaned = '5511' + cleaned
    } else if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned
    }
    
    return cleaned
  }

  private buildTemplateComponents(variables: Record<string, any>) {
    const components = []
    
    if (Object.keys(variables).length > 0) {
      const parameters = Object.values(variables).map(value => ({
        type: 'text',
        text: String(value)
      }))
      
      components.push({
        type: 'body',
        parameters
      })
    }
    
    return components
  }

  public getStatus() {
    return {
      configured: this.isConfigured,
      provider: this.isConfigured ? 'meta_cloud_api' : 'simulation',
      phoneNumberId: this.phoneNumberId ? '***' + this.phoneNumberId.slice(-4) : null,
      hasToken: !!this.accessToken,
      mode: this.isConfigured ? 'production' : 'simulation'
    }
  }

  public async verifyWebhook(verifyToken: string, challenge: string): Promise<string | null> {
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'visa2any_webhook'
    
    if (verifyToken === expectedToken) {
      console.log('✅ Webhook verificado com sucesso')
      return challenge
    } else {
      console.log('❌ Token de verificação inválido')
      return null
    }
  }
}

// Singleton instance
let whatsappBusinessService: WhatsAppBusinessService | null = null

export function getWhatsAppBusinessService(): WhatsAppBusinessService {
  if (!whatsappBusinessService) {
    whatsappBusinessService = new WhatsAppBusinessService()
  }
  return whatsappBusinessService
}

// Alias para compatibilidade
export const getWhatsAppService = getWhatsAppBusinessService

export default WhatsAppBusinessService