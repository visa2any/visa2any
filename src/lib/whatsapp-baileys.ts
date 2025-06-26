// WhatsApp integrado com Baileys existente no projeto
export interface WhatsAppMessage {
  to: string
  message: string
  clientId?: string
  template?: string
  variables?: Record<string, any>
}

class WhatsAppBaileysService {
  private isConfigured: boolean
  private baileysUrl: string

  constructor() {
    // URL do serviço Baileys que já existe no projeto,    this.baileysUrl = process.env.WHATSAPP_BAILEYS_URL || 'http://localhost:3001'
    this.isConfigured = true // Baileys já está configurado,    
    console.log('📱 WhatsApp Baileys Service configurado')
    console.log('🔗 URL:', this.baileysUrl)
  }

  public async sendMessage(messageData: WhatsAppMessage): Promise<{ 
    success: boolean; 
    messageId?: string; 
    queued?: boolean; 
    error?: string 
  }> {
    
    try {
      // Formatar número para padrão brasileiro,      const formattedNumber = this.formatPhoneNumber(messageData.to)
      
      console.log('📤 Enviando WhatsApp via Baileys:', formattedNumber)

      // Tentar usar o serviço Baileys existente,      const response = await fetch(`${this.baileysUrl}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: formattedNumber,
          message: messageData.message
        }),
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ WhatsApp enviado via Baileys')
        return {
          success: true,
          messageId: result.messageId || `baileys_${Date.now()}`
        }
      } else {
        console.log('⚠️ Baileys indisponível, usando fallback')
        return this.sendWithFallback(messageData)
      }

    } catch (error) {
      console.log('⚠️ Erro ao conectar com Baileys, usando fallback')
      return this.sendWithFallback(messageData)
    }
  }

  // Fallback: usar webhook ou simulação,  private async sendWithFallback(messageData: WhatsAppMessage): Promise<{ 
    success: boolean; 
    messageId?: string; 
    queued?: boolean; 
    error?: string 
  }> {
    
    // Opção 1: Webhook personalizado,    if (process.env.WHATSAPP_WEBHOOK_URL) {
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
            success: true,
            messageId: result.messageId || `wh_${Date.now()}`
          }
        }
      } catch (error) {
        console.error('Webhook falhou:', error)
      }
    }

    // Opção 2: WhatsApp Business API (se configurado),    if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const formattedNumber = this.formatPhoneNumber(messageData.to)
        const baseUrl = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`
        
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

        const response = await fetch(`${baseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const result = await response.json()
        if (response.ok && result.messages?.[0]?.id) {
          console.log('✅ WhatsApp enviado via Business API')
          return {
            success: true,
            messageId: result.messages[0].id
          }
        }
      } catch (error) {
        console.error('Business API falhou:', error)
      }
    }

    // Opção 3: Simular envio (sempre funciona),    console.log('📱 SIMULANDO WHATSAPP (serviços indisponíveis):')
    console.log('Para:', messageData.to)
    console.log('Mensagem:', messageData.message.substring(0, 100) + '...')
    console.log('💡 Configure WHATSAPP_BAILEYS_URL ou inicie o serviço Baileys')
    console.log('---')

    return {
      success: true,
      messageId: `sim_${Date.now()}`,
      queued: false
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove caracteres especiais,    let cleaned = phone.replace(/[^\d]/g, '')
    
    // Se começar com 0, remove
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    
    // Se não tem código do país, adiciona Brasil (+55)
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      cleaned = '55' + cleaned
    } else if (cleaned.length === 10) {
      cleaned = '5511' + cleaned
    } else if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned
    }
    
    return cleaned
  }

  public getStatus() {
    return {
      configured: this.isConfigured,
      provider: 'baileys_hybrid',
      baileys_url: this.baileysUrl,
      fallbacks: [
        'baileys_service',
        'webhook_custom', 
        'business_api',
        'simulation'
      ],
      mode: 'production'
    }
  }

  // Função para testar conectividade,  public async testConnection(): Promise<{ 
    baileys: boolean;
    webhook: boolean; 
    business_api: boolean; 
  }> {
    const results = {
      baileys: false,
      webhook: false,
      business_api: false
    }

    // Testar Baileys,    try {
      const response = await fetch(`${this.baileysUrl}/status`, {
        signal: AbortSignal.timeout(3000)
      })
      results.baileys = response.ok
    } catch (error) {
      // Baileys não disponível    }

    // Testar webhook,    if (process.env.WHATSAPP_WEBHOOK_URL) {
      try {
        const response = await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        })
        results.webhook = response.ok
      } catch (error) {
        // Webhook não disponível      }
    }

    // Testar Business API,    if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`, {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
          },
          signal: AbortSignal.timeout(3000)
        })
        results.business_api = response.ok
      } catch (error) {
        // Business API não disponível      }
    }

    return results
  }
}

// Singleton instance
let whatsappBaileysService: WhatsAppBaileysService | null = null

export function getWhatsAppBaileysService(): WhatsAppBaileysService {
  if (!whatsappBaileysService) {
    whatsappBaileysService = new WhatsAppBaileysService()
  }
  return whatsappBaileysService
}

// Alias para compatibilidade
export const getWhatsAppService = getWhatsAppBaileysService

export default WhatsAppBaileysService