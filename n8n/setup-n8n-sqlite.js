// Script para configurar N8N com SQLite
const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURANDO N8N PARA SQLITE...\n');

// 1. Criar arquivo de configuração do N8N
const n8nConfig = {
  "database.type": "sqlite",
  "database.sqlite.database": "../prisma/dev.db",
  "endpoints.rest": "rest",
  "endpoints.webhook": "webhook",
  "endpoints.webhookTest": "webhook-test",
  "host": "localhost",
  "port": 5678,
  "protocol": "http",
  "security.excludeEndpoints": "webhook,webhook-test"
};

// Salvar configuração
const configPath = path.join(__dirname, '.n8n', 'config.json');
const configDir = path.dirname(configPath);

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(configPath, JSON.stringify(n8nConfig, null, 2));
console.log('✅ Arquivo de configuração N8N criado em:', configPath);

// 2. Criar variáveis de ambiente para N8N
const envVars = `
# N8N Configuration for Visa2Any
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
DB_TYPE=sqlite
DB_SQLITE_DATABASE=../prisma/dev.db
WEBHOOK_URL=http://localhost:5678/
N8N_BASIC_AUTH_ACTIVE=false
N8N_SECURE_COOKIE=false
EXECUTIONS_PROCESS=main
EXECUTIONS_MODE=regular

# Visa2Any Integration
VISA2ANY_API_URL=http://localhost:3000
VISA2ANY_WEBHOOK_SECRET=visa2any_webhook_secret_2024
WHATSAPP_API_URL=http://localhost:3000/api/notifications/whatsapp
EMAIL_API_URL=http://localhost:3000/api/notifications/email
`;

const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envVars.trim());
console.log('✅ Arquivo .env criado para N8N');

// 3. Instruções de uso
console.log('\n📋 INSTRUÇÕES PARA USAR N8N:');
console.log('');
console.log('1. 🚀 INICIAR N8N:');
console.log('   cd n8n');
console.log('   npx n8n start');
console.log('');
console.log('2. 🌐 ACESSAR INTERFACE:');
console.log('   http://localhost:5678');
console.log('');
console.log('3. 📥 IMPORTAR WORKFLOWS:');
console.log('   - Na interface do N8N, clique em "Import workflow"');
console.log('   - Selecione os arquivos:');
console.log('     * whatsapp-integration-corrected.json');
console.log('     * client-notifications-sqlite.json');
console.log('');
console.log('4. 🔧 CONFIGURAR CREDENCIAIS:');
console.log('   - Criar credencial SQLite:');
console.log('     Nome: "Visa2Any SQLite DB"');
console.log('     Database: "../prisma/dev.db"');
console.log('');
console.log('5. ✅ TESTAR WORKFLOWS:');
console.log('   - Ativar workflows importados');
console.log('   - Testar via webhook ou API');
console.log('');

// 4. Criar script de teste
const testScript = `
// Script de teste para workflows N8N
const axios = require('axios');

async function testWhatsAppWorkflow() {
  try {
    console.log('🧪 Testando workflow WhatsApp...');
    
    const response = await axios.post('http://localhost:5678/webhook/whatsapp-trigger', {
      clientId: 'test-client-123',
      clientName: 'Cliente Teste',
      clientEmail: 'teste@visa2any.com',
      phone: '11999999999',
      message: 'Teste de workflow N8N!',
      template: 'welcome',
      variables: {
        target_country: 'Canadá'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': 'visa2any_webhook_secret_2024'
      }
    });
    
    console.log('✅ Workflow WhatsApp testado:', response.status);
    return true;
  } catch (error) {
    console.log('❌ Erro no teste WhatsApp:', error.message);
    return false;
  }
}

async function testNotificationWorkflow() {
  try {
    console.log('🧪 Testando workflow Notificações...');
    
    const response = await axios.post('http://localhost:5678/webhook/client-notification', {
      clientId: 'test-client-456',
      type: 'WELCOME',
      clientName: 'Cliente Teste 2',
      clientEmail: 'teste2@visa2any.com',
      clientPhone: '11988888888',
      targetCountry: 'Estados Unidos',
      visaType: 'Turismo',
      channels: ['whatsapp', 'email'],
      variables: {
        eligibility_score: '85'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': 'visa2any_webhook_secret_2024'
      }
    });
    
    console.log('✅ Workflow Notificações testado:', response.status);
    return true;
  } catch (error) {
    console.log('❌ Erro no teste Notificações:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 INICIANDO TESTES DOS WORKFLOWS N8N\\n');
  
  const whatsappOk = await testWhatsAppWorkflow();
  const notificationOk = await testNotificationWorkflow();
  
  console.log('\\n📊 RESULTADOS DOS TESTES:');
  console.log('WhatsApp Workflow:', whatsappOk ? '✅ OK' : '❌ FALHOU');
  console.log('Notification Workflow:', notificationOk ? '✅ OK' : '❌ FALHOU');
  
  if (whatsappOk && notificationOk) {
    console.log('\\n🎉 TODOS OS WORKFLOWS FUNCIONANDO!');
  } else {
    console.log('\\n⚠️  Alguns workflows precisam de ajustes');
  }
}

// Executar testes se for chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testWhatsAppWorkflow, testNotificationWorkflow };
`;

const testPath = path.join(__dirname, 'test-workflows.js');
fs.writeFileSync(testPath, testScript);
console.log('✅ Script de teste criado:', testPath);

console.log('\n🎯 RESUMO DA CONFIGURAÇÃO:');
console.log('✅ Banco configurado: SQLite (prisma/dev.db)');
console.log('✅ Workflows corrigidos: 2 workflows criados');
console.log('✅ N8N configurado para usar SQLite');
console.log('✅ Scripts de teste criados');
console.log('');
console.log('🚀 PRÓXIMO PASSO: Execute "npx n8n start" na pasta n8n');
console.log('📱 Depois importe os workflows na interface web!');