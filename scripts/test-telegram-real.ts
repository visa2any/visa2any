
// Load env vars
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
// import { notificationService } from '../src/lib/notification-service';

const envProdPath = path.resolve(process.cwd(), '.env.production');
if (fs.existsSync(envProdPath)) {
    console.log('Loading .env.production...');
    dotenv.config({ path: envProdPath });
} else {
    console.log('.env.production not found, using default env');
}

async function runTest() {
    // Import dynamically after env vars are loaded
    const { notificationService } = await import('../src/lib/notification-service');

    console.log('Testing Telegram Notification with UPDATED credentials...');
    console.log('Telegram Bot Token:', process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Missing');
    console.log('Telegram Chat ID:', process.env.TELEGRAM_CHAT_ID ? 'Set' : 'Missing');

    // Explicitly override internal config just in case process.env propagation is weird in this test setup
    // But since we are reloading the module or env, it should be fine. 
    // Actually, notificationService is a singleton initialized at module load time.
    // So if we imported it BEFORE setting env vars (which we didn't, we used dynamic import), it would be stale.
    // Dynamic import ensures it sees the new vars.

    const result = await notificationService.sendAdminAlert(
        'TESTE DE CREDENCIAIS',
        '✅ Confirmação de que as novas credenciais estão funcionando!',
        {
            credentials: 'User Provided',
            chatId: process.env.TELEGRAM_CHAT_ID
        }
    );

    if (result) {
        console.log('✅ SUCESSO! Notificação enviada para o novo Chat ID.');
    } else {
        console.error('❌ Falha ao enviar notificação.');
    }
}

runTest().catch(console.error);
