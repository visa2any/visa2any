
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function startWhatsApp() {
    console.log('📱 Conectando ao WhatsApp...');
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('\n📱 ESCANEIE O QR CODE ABAIXO COM SEU WHATSAPP:\n');
                qrcode.generate(qr, { small: true });
                console.log('\n📲 Abra o WhatsApp > Menu (⋯) > Dispositivos conectados > Conectar dispositivo\n');
            }
            
            if (connection === 'close') {
                console.log('🔌 Conexão fechada, tentando reconectar...');
                setTimeout(() => startWhatsApp(), 3000);
            } else if (connection === 'open') {
                console.log('✅ WhatsApp conectado com sucesso!');
                console.log('🎉 Agora você pode usar o sistema de WhatsApp da Visa2Any!');
            }
        });

        sock.ev.on('creds.update', saveCreds);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        setTimeout(() => startWhatsApp(), 5000);
    }
}

startWhatsApp();
