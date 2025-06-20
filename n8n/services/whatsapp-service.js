// WhatsApp Baileys Service for Visa2Any - Updated Version
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');

class WhatsAppService {
    constructor() {
        this.sock = null;
        this.isReady = false;
        this.qrCodeGenerated = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.authDir = path.join(__dirname, '../auth_info_baileys');
        this.messageQueue = [];
        this.isProcessingQueue = false;
        this.connectionRetryDelay = 5000;
        
        // Ensure auth directory exists
        if (!fs.existsSync(this.authDir)) {
            fs.mkdirSync(this.authDir, { recursive: true });
        }
        
        // Initialize message queue processor
        this.startQueueProcessor();
        this.initialize();
    }

    async initialize() {
        try {
            console.log('🤖 Iniciando WhatsApp Baileys Service...');
            
            // Get latest Baileys version
            const { version, isLatest } = await fetchLatestBaileysVersion();
            console.log(`📱 Usando Baileys versão ${version.join('.')}, latest: ${isLatest}`);
            
            const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
            
            this.sock = makeWASocket({
                version,
                auth: state,
                printQRInTerminal: false,
                browser: ['Visa2Any', 'Chrome', '4.0.0'],
                defaultQueryTimeoutMs: 60000,
                logger: {
                    level: 'silent', // Reduce log noise
                    log: (level, ...args) => {
                        if (level === 'error') {
                            console.error('WhatsApp Error:', ...args);
                        }
                    }
                },
                shouldIgnoreJid: jid => jid.endsWith('@newsletter'),
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: true
            });

            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect, qr } = update;
                
                if (qr && !this.qrCodeGenerated) {
                    console.log('\n🔍 ESCANEIE O QR CODE ABAIXO COM SEU WHATSAPP:\n');
                    qrcode.generate(qr, { small: true });
                    console.log('\n📱 Abra o WhatsApp > Menu > Dispositivos conectados > Conectar dispositivo\n');
                    this.qrCodeGenerated = true;
                }
                
                if (connection === 'close') {
                    this.isReady = false;
                    const shouldReconnect = this.handleDisconnection(lastDisconnect);
                    
                    if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        const delay = this.connectionRetryDelay * this.reconnectAttempts;
                        console.log(`🔄 Tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts} de reconexão em ${delay/1000}s...`);
                        setTimeout(() => this.initialize(), delay);
                    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                        console.log('❌ Máximo de tentativas de reconexão atingido. Verifique a conexão.');
                        this.reconnectAttempts = 0;
                    }
                } else if (connection === 'open') {
                    console.log('✅ WhatsApp conectado com sucesso!');
                    this.isReady = true;
                    this.qrCodeGenerated = false;
                    this.reconnectAttempts = 0;
                    console.log('📊 Status da fila de mensagens:', this.messageQueue.length, 'mensagens pendentes');
                }
            });

            this.sock.ev.on('creds.update', saveCreds);
            
            // Handle incoming messages for debugging
            this.sock.ev.on('messages.upsert', (messageUpdate) => {
                const messages = messageUpdate.messages;
                messages.forEach(message => {
                    if (!message.key.fromMe && message.message) {
                        const from = message.key.remoteJid;
                        const text = message.message.conversation || 
                                   message.message.extendedTextMessage?.text || '';
                        console.log(`📥 Mensagem recebida de ${from}: ${text}`);
                    }
                });
            });

        } catch (error) {
            console.error('❌ Erro ao inicializar WhatsApp:', error);
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = this.connectionRetryDelay * this.reconnectAttempts;
                console.log(`⏳ Tentando novamente em ${delay/1000}s...`);
                setTimeout(() => this.initialize(), delay);
            }
        }
    }

    handleDisconnection(lastDisconnect) {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        
        switch (reason) {
            case DisconnectReason.badSession:
                console.log('🚫 Sessão inválida. Deletando e reconectando...');
                fs.rmSync(this.authDir, { recursive: true, force: true });
                this.qrCodeGenerated = false;
                return true;
            
            case DisconnectReason.connectionClosed:
                console.log('🔌 Conexão fechada. Reconectando...');
                return true;
            
            case DisconnectReason.connectionLost:
                console.log('📡 Conexão perdida. Reconectando...');
                return true;
            
            case DisconnectReason.connectionReplaced:
                console.log('🔄 Conexão substituída em outro dispositivo.');
                return false;
            
            case DisconnectReason.loggedOut:
                console.log('👋 Logout detectado. Necessário escanear QR Code novamente.');
                fs.rmSync(this.authDir, { recursive: true, force: true });
                this.qrCodeGenerated = false;
                return true;
            
            case DisconnectReason.restartRequired:
                console.log('🔄 Restart necessário. Reiniciando...');
                return true;
            
            case DisconnectReason.timedOut:
                console.log('⏰ Timeout de conexão. Tentando novamente...');
                return true;
            
            default:
                console.log('❓ Desconexão por motivo desconhecido:', reason);
                return true;
        }
    }

    startQueueProcessor() {
        setInterval(async () => {
            if (!this.isProcessingQueue && this.messageQueue.length > 0 && this.isReady) {
                this.isProcessingQueue = true;
                await this.processMessageQueue();
                this.isProcessingQueue = false;
            }
        }, 3000);
    }

    async processMessageQueue() {
        const batch = this.messageQueue.splice(0, 5); // Process 5 messages at a time
        
        for (const messageData of batch) {
            try {
                await this.sendMessageDirect(messageData.phone, messageData.message, messageData.options);
                console.log(`✅ Mensagem da fila enviada para ${messageData.phone}`);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Erro ao enviar mensagem da fila para ${messageData.phone}:`, error.message);
                
                // Re-queue failed messages (max 3 attempts)
                if ((messageData.attempts || 0) < 3) {
                    messageData.attempts = (messageData.attempts || 0) + 1;
                    this.messageQueue.push(messageData);
                }
            }
        }
    }

    formatPhoneNumber(phone) {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Handle different phone number formats for Brazil
        if (cleaned.length === 11) {
            // Mobile number with area code (11 digits)
            if (cleaned.startsWith('55')) {
                return cleaned + '@s.whatsapp.net';
            } else {
                return '55' + cleaned + '@s.whatsapp.net';
            }
        } else if (cleaned.length === 10) {
            // Landline or mobile without country code
            return '55' + cleaned + '@s.whatsapp.net';
        } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
            // Full international format
            return cleaned + '@s.whatsapp.net';
        } else if (cleaned.length === 12 && cleaned.startsWith('55')) {
            // Missing a digit, probably mobile
            return cleaned + '@s.whatsapp.net';
        } else {
            // Default: add country code
            return '55' + cleaned + '@s.whatsapp.net';
        }
    }

    async validatePhoneNumber(phone) {
        try {
            const formattedPhone = this.formatPhoneNumber(phone);
            const [result] = await this.sock.onWhatsApp(formattedPhone.replace('@s.whatsapp.net', ''));
            return result?.exists || false;
        } catch (error) {
            console.warn(`⚠️ Não foi possível validar o número ${phone}:`, error.message);
            return true; // Assume valid if can't check
        }
    }

    async sendMessage(phone, message, options = {}) {
        // Add to queue if not connected or busy
        if (!this.isReady || !this.sock) {
            console.log(`📬 Adicionando mensagem à fila para ${phone}`);
            this.messageQueue.push({ phone, message, options });
            return {
                success: true,
                queued: true,
                message: 'Mensagem adicionada à fila de envio'
            };
        }

        return await this.sendMessageDirect(phone, message, options);
    }

    async sendMessageDirect(phone, message, options = {}) {
        try {
            const formattedPhone = this.formatPhoneNumber(phone);
            
            // Validate phone number if required
            if (options.validatePhone) {
                const isValid = await this.validatePhoneNumber(phone);
                if (!isValid) {
                    throw new Error(`Número ${phone} não está no WhatsApp`);
                }
            }
            
            console.log(`📤 Enviando mensagem para ${formattedPhone}`);
            console.log(`💬 Mensagem: ${message.substring(0, 100)}...`);
            
            // Prepare message content
            const messageContent = { text: message };
            
            // Add link preview if URL detected
            if (message.includes('http')) {
                messageContent.linkPreview = true;
            }
            
            const result = await this.sock.sendMessage(formattedPhone, messageContent);
            
            console.log('✅ Mensagem enviada com sucesso!');
            
            return {
                success: true,
                messageId: result.key.id,
                timestamp: result.messageTimestamp,
                phone: formattedPhone,
                queued: false
            };
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            
            // Handle different error types
            if (error.message.includes('Connection Closed') || 
                error.message.includes('Connection Lost')) {
                this.isReady = false;
                console.log('🔄 Conexão perdida, iniciando reconexão...');
                this.initialize();
            }
            
            throw new Error(`Falha ao enviar WhatsApp: ${error.message}`);
        }
    }

    async sendBulkMessages(messages) {
        const results = [];
        
        for (const msg of messages) {
            try {
                const result = await this.sendMessage(msg.phone, msg.message, msg.options);
                results.push({ ...msg, result, success: true });
                
                // Rate limiting - wait 2 seconds between messages
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                results.push({ ...msg, error: error.message, success: false });
            }
        }
        
        return results;
    }

    getStatus() {
        return {
            connected: this.isReady,
            authDir: this.authDir,
            needsQR: !this.isReady && !this.qrCodeGenerated
        };
    }

    async disconnect() {
        if (this.sock) {
            await this.sock.logout();
            this.sock = null;
            this.isReady = false;
        }
    }
}

module.exports = WhatsAppService;