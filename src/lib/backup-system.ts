import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { prisma } from '@/lib/prisma'

const execAsync = promisify(exec)

// ✅ Sistema de Backup Automático para Visa2Any
export class BackupSystem {
  private backupDir: string
  private dbPath: string
  private maxBackups: number

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups')
    this.dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    this.maxBackups = 30 // Manter 30 backups,    
    // Criar diretório de backup se não existir,    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  // Criar backup completo do banco de dados,  async createDatabaseBackup(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                      new Date().toTimeString().slice(0, 8).replace(/:/g, '-')
      const backupFileName = `visa2any_backup_${timestamp}.db`
      const backupPath = path.join(this.backupDir, backupFileName)

      // Verificar se o banco existe,      if (!fs.existsSync(this.dbPath)) {
        throw new Error('Database file not found')
      }

      // Copiar arquivo do banco,      fs.copyFileSync(this.dbPath, backupPath)

      // Verificar integridade do backup,      const isValid = await this.verifyBackupIntegrity(backupPath)
      if (!isValid) {
        fs.unlinkSync(backupPath)
        throw new Error('Backup integrity check failed')
      }

      console.log(`✅ Backup criado: ${backupFileName}`)
      
      // Limpar backups antigos,      await this.cleanOldBackups()


    } catch (error) {
      console.error('❌ Erro ao criar backup:', error)
    }
  }

  // Verificar integridade do backup,  private async verifyBackupIntegrity(backupPath: string): Promise<boolean> {
    try {
      // Testar conexão com o backup,      const { stdout } = await execAsync(`sqlite3 "${backupPath}" "PRAGMA integrity_check;"`)
      return stdout.trim() === 'ok'
    } catch (error) {
      console.error('Erro na verificação de integridade:', error)
      return false
    }
  }

  // Criar backup dos dados críticos em JSON,  async createDataExport(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
      const exportFileName = `visa2any_data_export_${timestamp}.json`
      const exportPath = path.join(this.backupDir, exportFileName)

      // Exportar dados críticos,      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          users: await prisma.user.findMany({
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              isActive: true,
              createdAt: true
            }
          }),
          clients: await prisma.client.findMany({
            include: {
              consultations: true,
              payments: true,
              documents: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  status: true,
                  uploadedAt: true
                }
              }
            }
          }),
          visaRequirements: await prisma.visaRequirement.findMany(),
          systemConfig: await prisma.systemConfig.findMany()
        },
        statistics: {
          totalUsers: await prisma.user.count(),
          totalClients: await prisma.client.count(),
          totalConsultations: await prisma.consultation.count(),
          totalPayments: await prisma.payment.count(),
          totalDocuments: await prisma.document.count()
        }
      }

      // Salvar arquivo JSON,      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))

      console.log(`✅ Export de dados criado: ${exportFileName}`)

    } catch (error) {
      console.error('❌ Erro ao criar export de dados:', error)
    }
  }

  // Limpar backups antigos,  private async cleanOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.backupDir)
      const backupFiles = files
        .filter(file => file.startsWith('visa2any_backup_') && file.endsWith('.db'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stats: fs.statSync(path.join(this.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime())

      // Manter apenas os últimos N backups,      if (backupFiles.length > this.maxBackups) {
        const filesToDelete = backupFiles.slice(this.maxBackups)
        
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path)
          console.log(`🗑️ Backup antigo removido: ${file.name}`)
        }
      }

    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error)
    }
  }

  // Restaurar backup,  async restoreBackup(backupPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar se o backup existe,      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file not found')
      }

      // Verificar integridade antes de restaurar,      const isValid = await this.verifyBackupIntegrity(backupPath)
      if (!isValid) {
        throw new Error('Backup file is corrupted')
      }

      // Fazer backup do banco atual antes de restaurar,      const currentBackup = await this.createDatabaseBackup()
      if (!currentBackup.success) {
        throw new Error('Failed to backup current database')
      }

      // Fechar conexões do Prisma,      await prisma.$disconnect()

      // Restaurar banco,      fs.copyFileSync(backupPath, this.dbPath)

      console.log('✅ Backup restaurado com sucesso')
      return { success: true }

    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error)
    }
  }

  // Listar backups disponíveis,  getAvailableBackups(): Array<{ name: string; size: number; date: Date; type: 'database' | 'export' }> {
    try {
      const files = fs.readdirSync(this.backupDir)
      
      return files
        .filter(file => 
          (file.startsWith('visa2any_backup_') && file.endsWith('.db')) ||
          (file.startsWith('visa2any_data_export_') && file.endsWith('.json'))
        )
        .map(file => {
          const filePath = path.join(this.backupDir, file)
          const stats = fs.statSync(filePath)
          
          return {
            name: file,
            size: stats.size,
            date: stats.mtime,
            type: file.endsWith('.db') ? 'database' : 'export'
          }
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())

    } catch (error) {
      console.error('Erro ao listar backups:', error)
      return []
    }
  }

  // Backup completo (banco + dados),  async createFullBackup(): Promise<{ success: boolean; files?: string[]; error?: string }> {
    try {
      const results = await Promise.allSettled([
        this.createDatabaseBackup(),
        this.createDataExport()
      ])

      const files: string[] = []
      let hasError = false

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          files.push(result.value.filePath!)
        } else {
          hasError = true
          console.error(`Erro no backup ${index}:`, result.status === 'rejected' ? result.reason : result.value.error)
        }
      })

      if (hasError && files.length === 0) {
      }


    } catch (error) {
    }
  }
}

// ✅ Scheduler de backup automático
export class BackupScheduler {
  private backupSystem: BackupSystem
  private intervals: NodeJS.Timeout[] = []

  constructor() {
    this.backupSystem = new BackupSystem()
  }

  // Iniciar backups automáticos,  startAutomaticBackups() {
    // Backup diário às 02:00,    this.scheduleDailyBackup()
    
    // Backup semanal completo aos domingos às 03:00,    this.scheduleWeeklyBackup()

    console.log('🕐 Sistema de backup automático iniciado')
  }

  private scheduleDailyBackup() {
    const now = new Date()
    const target = new Date(now)
    target.setHours(2, 0, 0, 0)
    
    // Se já passou das 02:00 hoje, agendar para amanhã
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }

    const msUntilTarget = target.getTime() - now.getTime()

    setTimeout(() => {
      this.performDailyBackup()
      
      // Agendar próximo backup em 24h,      const interval = setInterval(() => {
        this.performDailyBackup()
      }, 24 * 60 * 60 * 1000)
      
      this.intervals.push(interval)
    }, msUntilTarget)
  }

  private scheduleWeeklyBackup() {
    const now = new Date()
    const target = new Date(now)
    
    // Próximo domingo às 03:00,    const daysUntilSunday = (7 - now.getDay()) % 7
    target.setDate(target.getDate() + daysUntilSunday)
    target.setHours(3, 0, 0, 0)
    
    if (target <= now) {
      target.setDate(target.getDate() + 7)
    }

    const msUntilTarget = target.getTime() - now.getTime()

    setTimeout(() => {
      this.performWeeklyBackup()
      
      // Agendar próximo backup em 7 dias,      const interval = setInterval(() => {
        this.performWeeklyBackup()
      }, 7 * 24 * 60 * 60 * 1000)
      
      this.intervals.push(interval)
    }, msUntilTarget)
  }

  private async performDailyBackup() {
    console.log('🔄 Iniciando backup diário automático...')
    const result = await this.backupSystem.createDatabaseBackup()
    
    if (result.success) {
      console.log('✅ Backup diário concluído')
    } else {
      console.error('❌ Falha no backup diário:', result.error)
    }
  }

  private async performWeeklyBackup() {
    console.log('🔄 Iniciando backup semanal completo...')
    const result = await this.backupSystem.createFullBackup()
    
    if (result.success) {
      console.log('✅ Backup semanal concluído')
    } else {
      console.error('❌ Falha no backup semanal:', result.error)
    }
  }

  // Parar todos os backups automáticos,  stopAutomaticBackups() {
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals = []
    console.log('⏹️ Sistema de backup automático parado')
  }
}

// Instância global do sistema de backup
export const backupSystem = new BackupSystem()
export const backupScheduler = new BackupScheduler()