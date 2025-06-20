// WhatsApp API Server for N8N Integration
const express = require('express');
const WhatsAppService = require('./whatsapp-service');

const app = express();
const port = process.env.WHATSAPP_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for N8N
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Initialize WhatsApp Service
const whatsappService = new WhatsAppService();

// Routes

// Health check
app.get('/health', (req, res) => {
    const status = whatsappService.getStatus();
    res.json({
        service: 'WhatsApp Baileys API',
        status: 'running',
        whatsapp: status,
        timestamp: new Date().toISOString()
    });
});

// Send single message
app.post('/whatsapp/send', async (req, res) => {
    try {
        const { phone, message, priority = 'NORMAL', clientId, campaign } = req.body;
        
        if (!phone || !message) {
            return res.status(400).json({
                success: false,
                error: 'Phone and message are required'
            });
        }

        // Log for analytics
        console.log(`📊 WhatsApp Send Request:`, {
            phone: phone.substring(0, 5) + '***',
            messageLength: message.length,
            priority,
            clientId,
            campaign,
            timestamp: new Date().toISOString()
        });

        const result = await whatsappService.sendMessage(phone, message);
        
        res.json({
            success: true,
            data: result,
            metadata: {
                priority,
                clientId,
                campaign,
                processedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ WhatsApp Send Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Send bulk messages
app.post('/whatsapp/bulk', async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Messages array is required'
            });
        }

        console.log(`📊 WhatsApp Bulk Send: ${messages.length} messages`);

        const results = await whatsappService.sendBulkMessages(messages);
        
        const summary = {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
        };

        res.json({
            success: true,
            data: results,
            summary,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ WhatsApp Bulk Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get WhatsApp status
app.get('/whatsapp/status', (req, res) => {
    const status = whatsappService.getStatus();
    res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
    });
});

// Webhook endpoint for N8N
app.post('/webhook/whatsapp', async (req, res) => {
    try {
        const { phone, message, priority, clientId, campaign, metadata } = req.body;
        
        // Validate webhook secret
        const webhookSecret = req.headers['x-webhook-secret'];
        if (webhookSecret !== 'visa2any_webhook_secret_2024') {
            return res.status(401).json({
                success: false,
                error: 'Invalid webhook secret'
            });
        }

        console.log('🔗 N8N Webhook received:', {
            clientId,
            campaign,
            priority,
            timestamp: new Date().toISOString()
        });

        const result = await whatsappService.sendMessage(phone, message);
        
        res.json({
            success: true,
            data: result,
            source: 'n8n_webhook',
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ N8N Webhook Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(port, () => {
    console.log(`\n🚀 WhatsApp Baileys API Server started!`);
    console.log(`📡 Server: http://localhost:${port}`);
    console.log(`💊 Health: http://localhost:${port}/health`);
    console.log(`📱 WhatsApp: http://localhost:${port}/whatsapp/status`);
    console.log(`\n🔗 N8N Webhook URL: http://localhost:${port}/webhook/whatsapp`);
    console.log(`📤 Send Message: POST http://localhost:${port}/whatsapp/send`);
    console.log(`\n⚡ Aguardando conexão WhatsApp...\n`);
});

module.exports = app;