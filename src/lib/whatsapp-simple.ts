// Versão simplificada do WhatsApp sem dependências externas
// Para testar a integração primeiro

export interface WhatsAppMessage {
  to: string
  message: string
  clientId?: string
  template?: string
  variables?: Record<string, any>
}

class WhatsAppServiceSimple {
  private isReady = false
  private messageQueue: WhatsAppMessage[] = []

  constructor() {
    console.log('🤖 WhatsApp Service Simplificado iniciado')
    this.simulateConnection()
  }

  private simulateConnection() {
    console.log('📱 Simulando conexão WhatsApp...')
    console.log('')
    console.log('🔍 PARA VER O QR CODE REAL:')
    console.log('1. Instale as dependências: npm install')
    console.log('2. Reinicie o servidor: npm run dev')
    console.log('3. O QR Code aparecerá aqui no console')
    console.log('')
    console.log('📱 QR CODE SIMULADO:')
    console.log('████ ▄▄▄▄▄▄▄ ▄▄▄▄ ▄ ▄▄▄▄▄▄▄ ████')
    console.log('████ █ ▄▄▄ █ ▀▄▀█▄█ █ ▄▄▄ █ ████')
    console.log('████ █ ███ █ ██▀▀▄█ █ ███ █ ████')
    console.log('████ ▀▀▀▀▀▀▀ █ ▀ █ █ ▀▀▀▀▀▀▀ ████')
    console.log('████ ██▄█▀▄▀▄▀█▄▀▄▀▄▀█▄█▀▄█ ████')
    console.log('████ ▄▄▄▄▄▄▄ ▀▄█▀ ▄ ██▄▀ ▄▄ ████')
    console.log('████ █ ▄▄▄ █ ▄▀█▄█▀█▄▀█ ▄██ ████')
    console.log('████ █ ███ █ █▄▄▀▄▀▄█▀▀██▄█ ████')
    console.log('████ ▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ████')
    console.log('')
    console.log('📲 Como escanear:')
    console.log('1. Abra WhatsApp no celular')
    console.log('2. Menu > Dispositivos conectados')
    console.log('3. Conectar dispositivo')
    console.log('4. Aponte para o QR Code acima')
    console.log('')
    
    // Simular conexão após 3 segundos
    setTimeout(() => {
      this.isReady = true
      console.log('✅ WhatsApp conectado com sucesso! (simulação)')
      console.log('📊 Sistema pronto para enviar mensagens')
    }, 3000)
  }

  public async sendMessage(messageData: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; queued?: boolean; error?: string }> {
    if (!this.isReady) {
      console.log(`📬 Adicionando mensagem à fila para ${messageData.to}`)
      this.messageQueue.push(messageData)
      return {
        success: true,
        queued: true
      }
    }

    const messageId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('📤 ENVIANDO WHATSAPP (SIMULAÇÃO):')
    console.log('Para:', messageData.to)
    console.log('Mensagem:', messageData.message.substring(0, 100) + '...')
    console.log('MessageID:', messageId)
    console.log('---')

    return {
      success: true,
      messageId
    }
  }

  public getStatus() {
    return {
      connected: this.isReady,
      queueSize: this.messageQueue.length,
      authDir: './whatsapp_auth',
      needsQR: !this.isReady,
      mode: 'simulation'
    }
  }

  public async disconnect() {
    console.log('👋 WhatsApp desconectado (simulação)')
    this.isReady = false
  }
}

// Singleton instance
let whatsappServiceSimple: WhatsAppServiceSimple | null = null

export function getWhatsAppServiceSimple(): WhatsAppServiceSimple {
  if (!whatsappServiceSimple) {
    whatsappServiceSimple = new WhatsAppServiceSimple()
  }
  return whatsappServiceSimple
}

export default WhatsAppServiceSimple