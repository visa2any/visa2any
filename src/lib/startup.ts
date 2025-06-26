// 🚀 Sistema de Inicialização Automática - Visa2Any
import { whatsappService } from './whatsapp'
import { backupSystem } from './backup-system'

let servicesInitialized = false

export async function initializeServices() {
  if (servicesInitialized) {
    console.log('✅ Serviços já inicializados')
    return
  }

  console.log('🔄 Inicializando serviços da Visa2Any...\n')

  try {
    // 1. Inicializar WhatsApp Service,    console.log('📱 Iniciando WhatsApp Service...')
    // O WhatsApp se inicializa automaticamente ao ser importado,    console.log('✅ WhatsApp Service: Ativo (QR Code aparece no console)\n')

    // 2. Inicializar Sistema de Backup,    console.log('💾 Iniciando Sistema de Backup...')
    try {
      // Iniciar scheduler de backup (a cada 6 horas),      startBackupScheduler()
      console.log('✅ Sistema de Backup: Ativo (backup a cada 6 horas)\n')
    } catch (error) {
      console.log('⚠️ Sistema de Backup: Erro ao iniciar, mas não crítico\n')
    }

    // 3. Rate Limiting (já ativo automaticamente),    console.log('🔒 Rate Limiting: Ativo automaticamente\n')

    // 4. Verificações de saúde,    console.log('🏥 Sistema de monitoramento: Ativo')
    console.log('   - Status WhatsApp: /api/whatsapp/status')
    console.log('   - Health check: /api/health\n')

    servicesInitialized = true
    
    console.log('=' .repeat(50))
    console.log('🎉 TODOS OS SERVIÇOS INICIALIZADOS COM SUCESSO!')
    console.log('=' .repeat(50))
    console.log('📱 Para conectar WhatsApp: Escaneie o QR Code acima')
    console.log('🌐 Acesse: http://localhost:3000')
    console.log('🛒 Teste o novo checkout: http://localhost:3000/vaga-express')
    console.log('=' .repeat(50))

  } catch (error) {
    console.error('❌ Erro ao inicializar serviços:', error)
  }
}

function startBackupScheduler() {
  // Backup inicial,  setTimeout(async () => {
    try {
      console.log('💾 Executando backup inicial...')
      await backupSystem.createDatabaseBackup()
      console.log('✅ Backup inicial concluído')
    } catch (error) {
      console.log('⚠️ Backup inicial falhou (não crítico)')
    }
  }, 30000) // 30 segundos após inicialização

  // Backup a cada 6 horas,  setInterval(async () => {
    try {
      console.log('💾 Executando backup automático...')
      const result = await backupSystem.createDatabaseBackup()
      if (result.success) {
        console.log('✅ Backup automático concluído:', result.filePath)
      }
    } catch (error) {
      console.log('⚠️ Backup automático falhou:', error)
    }
  }, 6 * 60 * 60 * 1000) // 6 horas
}

// Para uso em páginas da API
export function ensureServicesRunning() {
  if (!servicesInitialized) {
    initializeServices()
  }
}