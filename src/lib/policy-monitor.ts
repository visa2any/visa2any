// Sistema de Monitoramento de Políticas de Visto
// Monitora mudanças em políticas de imigração de diferentes países

export interface PolicyChange {
  id: string
  country: string
  visaType: string
  changeType: 'requirement' | 'fee' | 'process' | 'eligibility' | 'timeline' | 'document'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  effectiveDate: string
  source: string
  sourceUrl: string
  impact: string[]
  affectedClients: string[]
  actionRequired: boolean
  actionDescription?: string
  detectedAt: string
  verifiedAt?: string
  notifiedAt?: string
}

export interface MonitoringSource {
  id: string
  name: string
  country: string
  type: 'government' | 'embassy' | 'news' | 'legal' | 'blog'
  url: string
  selector?: string
  keywords: string[]
  lastChecked: string
  isActive: boolean
  reliability: number
}

export interface PolicyAlert {
  id: string
  policyChangeId: string
  clientId?: string
  consultantId?: string
  type: 'immediate' | 'scheduled' | 'digest'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  message: string
  channels: ('email' | 'sms' | 'whatsapp' | 'dashboard')[]
  sentAt?: string
  readAt?: string
  actionTaken?: string
}

export class PolicyMonitoringEngine {
  private sources: Map<string, MonitoringSource> = new Map()
  private changes: Map<string, PolicyChange> = new Map()
  private alerts: Map<string, PolicyAlert> = new Map()
  private isMonitoring: boolean = false

  constructor() {
    this.initializeSources()
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('Monitoramento já está ativo')
      return
    }

    this.isMonitoring = true
    console.log('🚀 Iniciando monitoramento de políticas...')

    // Primeira verificação imediata
    await this.performFullScan()

    // Configurar verificação periódica (a cada 6 horas)
    setInterval(async () => {
      if (this.isMonitoring) {
        await this.performFullScan()
      }
    }, 6 * 60 * 60 * 1000)
  }

  stopMonitoring(): void {
    this.isMonitoring = false
    console.log('⏹️ Monitoramento de políticas parado')
  }

  private async performFullScan(): Promise<void> {
    console.log('🔍 Iniciando verificação completa de fontes...')
    
    const sources = Array.from(this.sources.values()).filter(s => s.isActive)
    
    for (const source of sources) {
      try {
        await this.scanSource(source)
        // Delay entre verificações para evitar sobrecarga
        await this.sleep(1000)
      } catch (error) {
        console.error(`Erro ao verificar ${source.name}:`, error)
      }
    }
    
    console.log('✅ Verificação completa concluída')
  }

  private async scanSource(source: MonitoringSource): Promise<void> {
    try {
      console.log(`📡 Verificando ${source.name}...`)
      
      // Simular detecção de mudanças (implementação real seria mais complexa)
      const changes = await this.detectChanges(source)
      
      for (const change of changes) {
        await this.processPolicyChange(change)
      }
      
      // Atualizar timestamp da última verificação
      source.lastChecked = new Date().toISOString()
      
    } catch (error) {
      console.error(`Erro ao verificar fonte ${source.name}:`, error)
    }
  }

  private async detectChanges(source: MonitoringSource): Promise<PolicyChange[]> {
    // Implementação simulada - em produção, faria web scraping ou API calls
    const changes: PolicyChange[] = []
    
    // Simular mudança ocasional (5% de chance)
    if (Math.random() < 0.05) {
      const change = this.generateMockChange(source, new Date())
      changes.push(change)
    }
    
    return changes
  }

  private generateMockChange(source: MonitoringSource, date: Date): PolicyChange {
    const changeTypes = ['requirement', 'fee', 'process', 'eligibility', 'timeline', 'document']
    const severities = ['low', 'medium', 'high', 'critical']
    const visaTypes = ['tourist', 'business', 'student', 'work', 'family', 'permanent']
    
    const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const visaType = visaTypes[Math.floor(Math.random() * visaTypes.length)]
    
    const changeId = `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      id: changeId,
      country: source.country,
      visaType: visaType || '',
      changeType: changeType as any,
      severity: severity as any,
      title: `Mudança em ${changeType} para ${visaType}`,
      description: `Nova política implementada para ${visaType} visas em ${source.country}`,
      effectiveDate: date.toISOString().split('T')[0] || '',
      source: source.name,
      sourceUrl: source.url,
      impact: ['Processamento', 'Documentação', 'Custos'],
      affectedClients: [],
      actionRequired: severity === 'critical' || severity === 'high',
      actionDescription: severity === 'critical' ? 'Ação imediata necessária' : 'Monitorar situação',
      detectedAt: date.toISOString()
    }
  }

  private async processPolicyChange(change: PolicyChange): Promise<void> {
    // Verificar se já existe mudança similar
    const similarChange = this.findSimilarChange(change)
    if (similarChange) {
      console.log(`Mudança similar já detectada: ${change.title}`)
      return
    }

    // Salvar mudança
    this.changes.set(change.id, change)
    
    // Identificar clientes afetados
    const affectedClients = await this.identifyAffectedClients(change)
    change.affectedClients = affectedClients
    
    // Criar alertas
    await this.createAlerts(change)
    
    console.log(`🚨 Nova mudança detectada: ${change.title} (${change.severity})`)
  }

  private findSimilarChange(change: PolicyChange): PolicyChange | null {
    const existingChanges = Array.from(this.changes.values())
    
    return existingChanges.find(existing => 
      existing.country === change.country &&
      existing.visaType === change.visaType &&
      existing.changeType === change.changeType &&
      this.calculateSimilarity(existing.title, change.title) > 0.8
    ) || null
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Implementação simples de similaridade
    const words1 = text1.toLowerCase().split(' ')
    const words2 = text2.toLowerCase().split(' ')
    const intersection = words1.filter(word => words2.includes(word))
    return intersection.length / Math.max(words1.length, words2.length)
  }

  private async identifyAffectedClients(change: PolicyChange): Promise<string[]> {
    // Em produção, consultaria o banco de dados
    // Por enquanto, retorna array vazio
    return []
  }

  private async createAlerts(change: PolicyChange): Promise<void> {
    if (!change.actionRequired) return
    
    const alertId = `alert_${change.id}`
    const priority = change.severity === 'critical' ? 'urgent' : 
                    change.severity === 'high' ? 'high' : 'medium'
    
    const alert: PolicyAlert = {
      id: alertId,
      policyChangeId: change.id,
      type: 'immediate',
      priority,
      message: this.generateClientMessage(change),
      channels: ['email', 'dashboard'],
      sentAt: new Date().toISOString()
    }
    
    this.alerts.set(alertId, alert)
  }

  private generateClientMessage(change: PolicyChange): string {
    return `🚨 Nova mudança de política detectada em ${change.country}:
    
${change.title}

${change.description}

Severidade: ${change.severity}
Data efetiva: ${change.effectiveDate}

${change.actionRequired ? 'AÇÃO NECESSÁRIA: ' + change.actionDescription : 'Monitorar situação'}

Fonte: ${change.source}
URL: ${change.sourceUrl}`
  }

  private initializeSources(): void {
    const sources: MonitoringSource[] = [
      {
        id: 'uscis_official',
        name: 'USCIS Official',
        country: 'USA',
        type: 'government',
        url: 'https://www.uscis.gov/news/alerts',
        keywords: ['visa', 'immigration', 'policy'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      },
      {
        id: 'ircc_official',
        name: 'IRCC Official',
        country: 'Canada',
        type: 'government',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news.html',
        keywords: ['immigration', 'express entry', 'pnp', 'crs', 'processing'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      }
    ]

    sources.forEach(source => {
      this.sources.set(source.id, source)
    })

    console.log(`📡 Inicializadas ${sources.length} fontes de monitoramento`)
  }

  public getChanges(filters?: {
    country?: string
    severity?: string
    dateFrom?: string
    dateUntil?: string
  }): PolicyChange[] {
    let changes = Array.from(this.changes.values())

    if (filters) {
      if (filters.country) {
        changes = changes.filter(c => c.country === filters.country)
      }
      if (filters.severity) {
        changes = changes.filter(c => c.severity === filters.severity)
      }
      if (filters.dateFrom) {
        changes = changes.filter(c => c.detectedAt >= filters.dateFrom!)
      }
      if (filters.dateUntil) {
        changes = changes.filter(c => c.detectedAt <= filters.dateUntil!)
      }
    }

    return changes.sort((a, b) => 
      Date.parse(b.detectedAt) - Date.parse(a.detectedAt)
    )
  }

  public getPendingAlerts(): PolicyAlert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.readAt)
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
  }

  public markAlertAsRead(alertId: string): void {
    const alert = this.alerts.get(alertId)
    if (alert) {
      alert.readAt = new Date().toISOString()
    }
  }

  public async forceCheckCountry(country: string): Promise<PolicyChange[]> {
    const countrySources = Array.from(this.sources.values())
      .filter(s => s.country === country && s.isActive)

    const changes: PolicyChange[] = []

    for (const source of countrySources) {
      try {
        const sourceChanges = await this.detectChanges(source)
        for (const change of sourceChanges) {
          await this.processPolicyChange(change)
          changes.push(change)
        }
      } catch (error) {
        console.error(`Erro ao verificar ${source.name}:`, error)
      }
    }

    return changes
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public getMonitoringStats(): {
    totalSources: number
    activeSources: number
    totalChanges: number
    recentChanges: number
    pendingAlerts: number
    criticalChanges: number
  } {
    const now = Date.now()
    const last24h = now - 24 * 60 * 60 * 1000
    
    const changes = Array.from(this.changes.values())
    const alerts = Array.from(this.alerts.values())

    return {
      totalSources: this.sources.size,
      activeSources: Array.from(this.sources.values()).filter(s => s.isActive).length,
      totalChanges: changes.length,
      recentChanges: changes.filter(c => Date.parse(c.detectedAt) > last24h).length,
      pendingAlerts: alerts.filter(a => !a.readAt).length,
      criticalChanges: changes.filter(c => c.severity === 'critical').length
    }
  }
}

export const policyMonitor = new PolicyMonitoringEngine()

export async function startPolicyMonitoring(): Promise<void> {
  return policyMonitor.startMonitoring()
}

export function stopPolicyMonitoring(): void {
  return policyMonitor.stopMonitoring()
}

export function getPolicyChanges(filters?: any): PolicyChange[] {
  return policyMonitor.getChanges(filters)
}

export function getPendingAlerts(): PolicyAlert[] {
  return policyMonitor.getPendingAlerts()
}
