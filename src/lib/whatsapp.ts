import { makeWASocket, useMultiFileAuthState, DisconnectReason, WAMessage } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import { Boom } from '@hapi/boom'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export interface WhatsAppMessage {
  to: string
  message: string
  clientId?: string
  template?: string
  variables?: Record<string, any>
}

class WhatsAppService {
  private sock: any = null
  private isReady = false
  private qrCodeGenerated = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private authDir = path.join(process.cwd(), 'whatsapp_auth')
  private messageQueue: WhatsAppMessage[] = []
  private isProcessingQueue = false

  constructor() {
    // Garantir que o diretório de auth existe
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true })
    }
    
    this.initialize()
    this.startQueueProcessor()
  }

  private async initialize() {
    try {
      console.log('🤖 Iniciando WhatsApp Service integrado...')
      
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir)
      
      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Visa2Any', 'Chrome', '4.0.0'],
        defaultQueryTimeoutMs: 60000,
        logger: {
          level: 'silent',
          log: (level: any, ...args: any[]) => {
            if (level === 'error') {
              console.error('WhatsApp Error:', ...args)
            }
          }
        }
      })

      this.sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr && !this.qrCodeGenerated) {
          console.log('\n🔍 ESCANEIE O QR CODE ABAIXO COM SEU WHATSAPP:\n')
          qrcode.generate(qr, { small: true })
          console.log('\n📱 Abra o WhatsApp > Menu > Dispositivos conectados > Conectar dispositivo\n')
          this.qrCodeGenerated = true
        }
        
        if (connection === 'close') {
          this.isReady = false
          const shouldReconnect = this.handleDisconnection(lastDisconnect)
          
          if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`🔄 Tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts} de reconexão...`)
            setTimeout(() => this.initialize(), 5000)
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp conectado com sucesso!')
          this.isReady = true
          this.qrCodeGenerated = false
          this.reconnectAttempts = 0
          console.log(`📊 Fila de mensagens: ${this.messageQueue.length} pendentes`)
        }
      })

      this.sock.ev.on('creds.update', saveCreds)
      
    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp:', error)
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.initialize(), 5000)
      }
    }
  }

  private handleDisconnection(lastDisconnect: any): boolean {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    
    switch (reason) {
      case DisconnectReason.badSession:
        console.log('🚫 Sessão inválida. Deletando e reconectando...')
        fs.rmSync(this.authDir, { recursive: true, force: true })
        this.qrCodeGenerated = false
        return true
      
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.timedOut:
        console.log('🔌 Conexão perdida. Reconectando...')
        return true
      
      case DisconnectReason.loggedOut:
        console.log('👋 Logout detectado. Necessário escanear QR Code novamente.')
        fs.rmSync(this.authDir, { recursive: true, force: true })
        this.qrCodeGenerated = false
        return true
      
      default:
        console.log('❓ Desconexão por motivo desconhecido:', reason)
        return true
    }
  }

  private startQueueProcessor() {
    setInterval(async () => {
      if (!this.isProcessingQueue && this.messageQueue.length > 0 && this.isReady) {
        this.isProcessingQueue = true
        await this.processMessageQueue()
        this.isProcessingQueue = false
      }
    }, 3000)
  }

  private async processMessageQueue() {
    const batch = this.messageQueue.splice(0, 5)
    
    for (const messageData of batch) {
      try {
        await this.sendMessageDirect(messageData)
        console.log(`✅ Mensagem da fila enviada para ${messageData.to}`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error: any) {
        console.error(`❌ Erro ao enviar mensagem da fila:`, error.message)
      }
    }
  }

  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.length === 11) {
      if (cleaned.startsWith('55')) {
        return cleaned + '@s.whatsapp.net'
      } else {
        return '55' + cleaned + '@s.whatsapp.net'
      }
    } else if (cleaned.length === 10) {
      return '55' + cleaned + '@s.whatsapp.net'
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return cleaned + '@s.whatsapp.net'
    } else {
      return '55' + cleaned + '@s.whatsapp.net'
    }
  }

  public async sendMessage(messageData: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; queued?: boolean; error?: string }> {
    // Adicionar à fila se não estiver conectado
    if (!this.isReady || !this.sock) {
      console.log(`📬 Adicionando mensagem à fila para ${messageData.to}`)
      this.messageQueue.push(messageData)
      return {
        success: true,
        queued: true
      }
    }

    return await this.sendMessageDirect(messageData)
  }

  private async sendMessageDirect(messageData: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const formattedPhone = this.formatPhoneNumber(messageData.to)
      
      console.log(`📤 Enviando mensagem para ${formattedPhone}`)
      
      // Processar template se especificado
      let finalMessage = messageData.message
      if (messageData.template) {
        finalMessage = await this.processTemplate(messageData.template, messageData.variables || {}, messageData.clientId)
      }
      
      const result = await this.sock.sendMessage(formattedPhone, { text: finalMessage })
      
      // Salvar no banco de dados
      if (messageData.clientId) {
        await prisma.interaction.create({
          data: {
            type: 'WHATSAPP_SENT',
            channel: 'whatsapp',
            direction: 'outbound',
            content: finalMessage,
            clientId: messageData.clientId,
            completedAt: new Date()
          }
        })
      }
      
      console.log('✅ Mensagem enviada com sucesso!')
      
      return {
        success: true,
        messageId: result.key.id
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  private async processTemplate(templateName: string, variables: Record<string, any>, clientId?: string): Promise<string> {
    const templates = this.getTemplates()
    const template = templates[templateName]
    
    if (!template) {
      throw new Error(`Template ${templateName} não encontrado`)
    }

    let client = null
    if (clientId) {
      client = await prisma.client.findUnique({
        where: { id: clientId }
      })
    }

    const defaultVariables = {
      client_name: client?.name || 'Cliente',
      client_first_name: client?.name?.split(' ')[0] || 'Cliente',
      target_country: client?.targetCountry || '',
      visa_type: client?.visaType || '',
      company_name: 'Visa2Any',
      support_phone: '+55 11 99999-9999',
      website_url: process.env.NEXTAUTH_URL || 'https://visa2any.com',
      current_date: new Date().toLocaleDateString('pt-BR'),
      ...variables
    }

    let message = template.message
    Object.entries(defaultVariables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      message = message.replace(new RegExp(placeholder, 'g'), String(value))
    })

    return message
  }

  private getTemplates() {
    return {
      welcome: {
        name: 'Boas-vindas',
        message: `🌎 Olá {{client_first_name}}! Bem-vindo(a) à {{company_name}}!

Estamos muito animados para ajudá-lo(a) a realizar seu sonho de viver em {{target_country}} 🎉

📋 Próximos passos:
1. Complete seu perfil na plataforma
2. Faça upload dos seus documentos
3. Receba sua análise IA gratuita
4. Agende sua consultoria

Qualquer dúvida, estamos aqui! 😊

{{website_url}}`
      },
      analysis_ready: {
        name: 'Análise Pronta',
        message: `🎉 Ótimas notícias {{client_first_name}}!

Sua análise de elegibilidade para *{{target_country}}* está pronta! 📊

✅ Score: {{eligibility_score}}/100
✅ Visto recomendado: {{visa_type}}
✅ Próximos passos definidos

Acesse sua plataforma para ver todos os detalhes:
{{website_url}}

Parabéns por dar este importante passo! 🌟`
      },
      consultation_reminder: {
        name: 'Lembrete de Consultoria',
        message: `⏰ Lembrete: Sua consultoria é amanhã!

Olá {{client_first_name}}! 

📅 Data: {{consultation_date}}
🕐 Horário: {{consultation_time}}
👥 Consultor: {{consultant_name}}

📋 Prepare-se:
✅ Documentos em mãos
✅ Lista de dúvidas
✅ Ambiente silencioso

Até amanhã! 😊`
      }
    }
  }

  public getStatus() {
    return {
      connected: this.isReady,
      queueSize: this.messageQueue.length,
      authDir: this.authDir,
      needsQR: !this.isReady && !this.qrCodeGenerated
    }
  }

  public async disconnect() {
    if (this.sock) {
      await this.sock.logout()
      this.sock = null
      this.isReady = false
    }
  }
}

// Singleton instance
let whatsappService: WhatsAppService | null = null

export function getWhatsAppService(): WhatsAppService {
  if (!whatsappService) {
    whatsappService = new WhatsAppService()
  }
  return whatsappService
}

export default WhatsAppService