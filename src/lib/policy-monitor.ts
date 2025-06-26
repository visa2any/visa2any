'use client'

/**
 * Sistema de Monitoramento de Políticas de Imigração - Visa2Any
 * Monitora mudanças em tempo real nas leis e requisitos de visto
 */

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
  reliability: number // 0-1
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

/**
 * Engine principal de monitoramento de políticas
 */
export class PolicyMonitoringEngine {
  private sources: Map<string, MonitoringSource> = new Map()
  private changes: Map<string, PolicyChange> = new Map()
  private alerts: Map<string, PolicyAlert> = new Map()
  private isMonitoring: boolean = false

  constructor() {
    this.initializeSources()
  }

  /**
   * Inicia o monitoramento contínuo
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return

    this.isMonitoring = true
    console.log('🔍 Iniciando monitoramento de políticas de imigração...')

    // Verificação a cada 4 horas
    setInterval(() => {
      this.performFullScan()
    }, 4 * 60 * 60 * 1000)

    // Verificação inicial
    await this.performFullScan()
  }

  /**
   * Para o monitoramento
   */
  stopMonitoring(): void {
    this.isMonitoring = false
    console.log('⏹️ Monitoramento de políticas interrompido')
  }

  /**
   * Executa varredura completa de todas as fontes
   */
  private async performFullScan(): Promise<void> {
    console.log('🔍 Executando varredura completa de políticas...')
    
    const activeSources = Array.from(this.sources.values()).filter(s => s.isActive)
    
    for (const source of activeSources) {
      try {
        await this.scanSource(source)
        await this.sleep(2000) // Rate limiting
      } catch (error) {
        console.error(`Erro ao monitorar ${source.name}:`, error)
      }
    }

    console.log(`✅ Varredura concluída. ${activeSources.length} fontes verificadas.`)
  }

  /**
   * Escaneia uma fonte específica
   */
  private async scanSource(source: MonitoringSource): Promise<void> {
    console.log(`📡 Verificando ${source.name} (${source.country})...`)

    try {
      // Simulação de busca por mudanças (em produção
 usaria web scraping real)
      const changes = await this.detectChanges(source)
      
      for (const change of changes) {
        await this.processPolicyChange(change)
      }

      // Atualiza timestamp da última verificação
      source.lastChecked = new Date().toISOString()
      
    } catch (error) {
      console.error(`Erro ao escanear ${source.name}:`, error)
    }
  }

  /**
   * Detecta mudanças em uma fonte (simulado)
   */
  private async detectChanges(source: MonitoringSource): Promise<PolicyChange[]> {
    // Em produção
 isto seria web scraping real ou API calls
    // Por agora
 simulamos algumas mudanças baseadas em padrões reais
    
    const mockChanges: PolicyChange[] = []
    
    // Simula mudanças baseadas na data atual e fonte
    const now = new Date()
    const shouldGenerateChange = Math.random() > 0.85 // 15% chance de mudança
    
    if (shouldGenerateChange) {
      const change = this.generateMockChange(source, now)
      mockChanges.push(change)
    }

    return mockChanges
  }

  /**
   * Gera mudança mockada baseada em padrões reais
   */
  private generateMockChange(source: MonitoringSource, date: Date): PolicyChange {
    const changeTypes = ['requirement', 'fee', 'process', 'eligibility', 'timeline', 'document'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    
    const mockChanges = {
      'USA': [
        {
          type: 'fee' as const,
          title: 'Aumento nas taxas de visto H-1B',
          description: 'USCIS anuncia aumento de 15% nas taxas de processamento para vistos H-1B',
          impact: ['Maior custo para empregadores', 'Possível redução no número de aplicações']
        },
        {
          type: 'requirement' as const,
          title: 'Nova exigência para vistos B-1/B-2',
          description: 'Agora é obrigatório comprovar vínculos econômicos com país de origem',
          impact: ['Documentação adicional necessária', 'Processo mais rigoroso']
        }
      ],
      'Canada': [
        {
          type: 'eligibility' as const,
          title: 'Alteração no sistema CRS do Express Entry',
          description: 'Novos critérios de pontuação para profissões em demanda',
          impact: ['Mudança nas pontuações mínimas', 'Favorece certas profissões']
        },
        {
          type: 'timeline' as const,
          title: 'Redução no tempo de processamento do PNP',
          description: 'Provincial Nominee Program agora processa em 4-6 meses',
          impact: ['Processo mais rápido', 'Maior eficiência']
        }
      ],
      'Portugal': [
        {
          type: 'requirement' as const,
          title: 'Golden Visa: novos valores mínimos',
          description: 'Aumento no investimento mínimo para €350.000 em 2024',
          impact: ['Maior barreira de entrada', 'Foco em investimentos culturais']
        }
      ],
      'UK': [
        {
          type: 'process' as const,
          title: 'Skilled Worker: novo sistema de pontos',
          description: 'Introdução de pontos adicionais para setores prioritários',
          impact: ['Favorece profissões em demanda', 'Mudança nos critérios']
        }
      ],
      'Germany': [
        {
          type: 'document' as const,
          title: 'EU Blue Card: documentos simplificados',
          description: 'Redução na documentação exigida para profissionais de TI',
          impact: ['Processo mais simples', 'Foco em digitalização']
        }
      ],
      'Spain': [
        {
          type: 'eligibility' as const,
          title: 'Visto não-lucrativo: novos requisitos de renda',
          description: 'Aumento da renda mínima exigida para 4x IPREM',
          impact: ['Maior exigência financeira', 'Mais rigor na comprovação']
        }
      ]
    }

    const countryChanges = mockChanges[source.country as keyof typeof mockChanges] || []
    const selectedChange = countryChanges[Math.floor(Math.random() * countryChanges.length)]
    
    if (!selectedChange) {
      // Fallback genérico
      return this.createGenericChange(source, date)
    }

    return {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      country: source.country,
      visaType: this.getRandomVisaType(source.country),
      changeType: selectedChange.type,
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: selectedChange.title,
      description: selectedChange.description,
      effectiveDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias no futuro
      source: source.name,
      sourceUrl: source.url,
      impact: selectedChange.impact,
      affectedClients: [],
      actionRequired: selectedChange.type !== 'timeline',
      actionDescription: this.generateActionDescription(selectedChange.type),
      detectedAt: date.toISOString()
    }
  }

  /**
   * Cria mudança genérica quando não há mock específico
   */
  private createGenericChange(source: MonitoringSource, date: Date): PolicyChange {
    return {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      country: source.country,
      visaType: 'general',
      changeType: 'process',
      severity: 'medium',
      title: `Atualização nas políticas de ${source.country}`,
      description: `Detectada mudança nas políticas de imigração de ${source.country}`,
      effectiveDate: new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      source: source.name,
      sourceUrl: source.url,
      impact: ['Possível impacto nos processos de visto'],
      affectedClients: [],
      actionRequired: true,
      actionDescription: 'Verificar detalhes da mudança e atualizar processos',
      detectedAt: date.toISOString()
    }
  }

  /**
   * Retorna tipo de visto aleatório para um país
   */
  private getRandomVisaType(country: string): string {
    const visaTypes = {
      'USA': ['H-1B', 'L-1', 'EB-1', 'EB-5', 'B-1/B-2', 'F-1'],
      'Canada': ['Express Entry', 'PNP', 'Study Permit', 'Work Permit'],
      'Portugal': ['D7', 'Golden Visa', 'Student', 'Work'],
      'UK': ['Skilled Worker', 'Student', 'Visitor', 'Global Talent'],
      'Germany': ['EU Blue Card', 'Job Seeker', 'Student', 'Work'],
      'Spain': ['Non-Lucrative', 'Golden Visa', 'Student', 'Work']
    }

    const countryVisas = visaTypes[country as keyof typeof visaTypes] || ['General']
    return countryVisas[Math.floor(Math.random() * countryVisas.length)]
  }

  /**
   * Gera descrição da ação necessária
   */
  private generateActionDescription(changeType: string): string {
    const actions = {
      'requirement': 'Revisar documentação de clientes e atualizar checklists',
      'fee': 'Atualizar orçamentos e informar clientes sobre novos custos',
      'process': 'Modificar workflows internos e treinar equipe',
      'eligibility': 'Reavaliar elegibilidade de clientes atuais',
      'timeline': 'Atualizar estimativas de tempo para clientes',
      'document': 'Modificar lista de documentos necessários'
    }

    return actions[changeType as keyof typeof actions] || 'Analisar impacto e tomar ações apropriadas'
  }

  /**
   * Processa uma mudança de política detectada
   */
  private async processPolicyChange(change: PolicyChange): Promise<void> {
    // Verifica se já conhecemos esta mudança
    const existingChange = this.findSimilarChange(change)
    if (existingChange) {
      console.log(`🔄 Mudança similar já detectada: ${change.title}`)
      return
    }

    // Armazena a mudança
    this.changes.set(change.id, change)
    console.log(`🚨 Nova mudança detectada: ${change.title} (${change.country})`)

    // Identifica clientes afetados
    change.affectedClients = await this.identifyAffectedClients(change)

    // Cria alertas apropriados
    await this.createAlerts(change)

    // Verifica e marca como verificada se confiável
    if (this.isReliableSource(change.source)) {
      change.verifiedAt = new Date().toISOString()
    }
  }

  /**
   * Busca mudanças similares já detectadas
   */
  private findSimilarChange(change: PolicyChange): PolicyChange | null {
    for (const existing of this.changes.values()) {
      if (
        existing.country === change.country &&
        existing.changeType === change.changeType &&
        Math.abs(Date.parse(existing.detectedAt) - Date.parse(change.detectedAt)) < 24 * 60 * 60 * 1000 && // Dentro de 24h
        this.calculateSimilarity(existing.title, change.title) > 0.7
      ) {
        return existing
      }
    }
    return null
  }

  /**
   * Calcula similaridade entre dois textos
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(' ')
    const words2 = text2.toLowerCase().split(' ')
    const intersection = words1.filter(word => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]
    return intersection.length / union.length
  }

  /**
   * Identifica clientes afetados por uma mudança
   */
  private async identifyAffectedClients(change: PolicyChange): Promise<string[]> {
    // Em produção
 consultaria o banco de dados de clientes
    // Por agora
 simula alguns clientes afetados
    const mockAffectedClients: string[] = []
    
    if (change.severity === 'high' || change.severity === 'critical') {
      // Simula que mudanças críticas afetam mais clientes
      const numAffected = Math.floor(Math.random() * 10) + 1
      for (let i = 0; i < numAffected; i++) {
        mockAffectedClients.push(`client_${change.country.toLowerCase()}_${i + 1}`)
      }
    }

    return mockAffectedClients
  }

  /**
   * Cria alertas apropriados para uma mudança
   */
  private async createAlerts(change: PolicyChange): Promise<void> {
    // Alerta para equipe interna
    const internalAlert: PolicyAlert = {
      id: `alert_${Date.now()}_internal`,
      policyChangeId: change.id,
      type: change.severity === 'critical' ? 'immediate' : 'scheduled',
      priority: change.severity === 'critical' ? 'urgent' : 'high',
      message: `Nova mudança detectada: ${change.title}. ${change.affectedClients.length} clientes afetados.`,
      channels: ['dashboard', 'email'],
      sentAt: new Date().toISOString()
    }
    
    this.alerts.set(internalAlert.id, internalAlert)

    // Alertas para clientes afetados
    for (const clientId of change.affectedClients) {
      const clientAlert: PolicyAlert = {
        id: `alert_${Date.now()}_client_${clientId}`,
        policyChangeId: change.id,
        clientId,
        type: 'scheduled',
        priority: change.severity === 'critical' ? 'urgent' : 'medium',
        message: this.generateClientMessage(change),
        channels: ['email', 'whatsapp'],
        sentAt: new Date().toISOString()
      }
      
      this.alerts.set(clientAlert.id, clientAlert)
    }
  }

  /**
   * Gera mensagem personalizada para cliente
   */
  private generateClientMessage(change: PolicyChange): string {
    const countryNames = {
      'USA': 'Estados Unidos',
      'Canada': 'Canadá',
      'Portugal': 'Portugal',
      'UK': 'Reino Unido',
      'Germany': 'Alemanha',
      'Spain': 'Espanha'
    }

    const countryName = countryNames[change.country as keyof typeof countryNames] || change.country

    return `
Olá! Detectamos uma mudança importante nas políticas de imigração de ${countryName} que pode afetar seu processo:

📋 ${change.title}
📅 Data de vigência: ${new Date(change.effectiveDate).toLocaleDateString('pt-BR')}

${change.description}

${change.actionRequired ? '⚠️ Ação necessária: ' + change.actionDescription : ''}

Nossa equipe está analisando o impacto em seu caso específico e entraremos em contato em breve com orientações detalhadas.

Atenciosamente,
Equipe Visa2Any
    `.trim()
  }

  /**
   * Verifica se uma fonte é confiável
   */
  private isReliableSource(sourceName: string): boolean {
    const source = Array.from(this.sources.values()).find(s => s.name === sourceName)
    return source ? source.reliability > 0.8 : false
  }

  /**
   * Inicializa fontes de monitoramento
   */
  private initializeSources(): void {
    const sources: MonitoringSource[] = [
      // Estados Unidos
      {
        id: 'uscis_official',
        name: 'USCIS Official',
        country: 'USA',
        type: 'government',
        url: 'https://www.uscis.gov/news/alerts'

        keywords: ['visa', 'immigration', 'policy', 'fee', 'requirement'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      },
      {
        id: 'state_dept_usa',
        name: 'U.S. State Department',
        country: 'USA',
        type: 'government',
        url: 'https://travel.state.gov/content/travel/en/News.html'

        keywords: ['visa', 'consular', 'processing', 'interview'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      },

      // Canadá
      {
        id: 'ircc_official',
        name: 'IRCC Official',
        country: 'Canada',
        type: 'government',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news.html'

        keywords: ['immigration', 'express entry', 'pnp', 'crs', 'processing'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      },

      // Portugal
      {
        id: 'sef_portugal',
        name: 'SEF Portugal',
        country: 'Portugal',
        type: 'government',
        url: 'https://www.sef.pt/pt/pages/noticias.aspx'

        keywords: ['visto', 'residência', 'golden visa', 'd7'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.90
      },

      // Reino Unido
      {
        id: 'ukvi_official',
        name: 'UK Visas and Immigration',
        country: 'UK',
        type: 'government',
        url: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration/news'

        keywords: ['visa', 'immigration', 'points', 'skilled worker'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.95
      },

      // Alemanha
      {
        id: 'bamf_germany',
        name: 'BAMF Germany',
        country: 'Germany',
        type: 'government',
        url: 'https://www.bamf.de/DE/Startseite/startseite_node.html'

        keywords: ['visa', 'aufenthaltstitel', 'blue card', 'fachkräfte'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.90
      },

      // Espanha
      {
        id: 'extranjeria_spain',
        name: 'Extranjería España',
        country: 'Spain',
        type: 'government',
        url: 'https://extranjeros.inclusion.gob.es/es/noticias/index.html'

        keywords: ['visado', 'extranjería', 'residencia', 'golden visa'],
        lastChecked: new Date().toISOString(),
        isActive: true,
        reliability: 0.90
      }
    ]

    sources.forEach(source => {
      this.sources.set(source.id, source)
    })

    console.log(`📡 Inicializadas ${sources.length} fontes de monitoramento`)
  }

  /**
   * Retorna todas as mudanças detectadas
   */
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

  /**
   * Retorna alertas pendentes
   */
  public getPendingAlerts(): PolicyAlert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.readAt)
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
  }

  /**
   * Marca alerta como lido
   */
  public markAlertAsRead(alertId: string): void {
    const alert = this.alerts.get(alertId)
    if (alert) {
      alert.readAt = new Date().toISOString()
    }
  }

  /**
   * Força verificação imediata de um país
   */
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

  /**
   * Utilitário para sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Retorna estatísticas do monitoramento
   */
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

/**
 * Instância global do engine de monitoramento
 */
export const policyMonitor = new PolicyMonitoringEngine()

/**
 * Funções de conveniência
 */
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

export default {
  PolicyMonitoringEngine,
  policyMonitor,
  startPolicyMonitoring,
  stopPolicyMonitoring,
  getPolicyChanges,
  getPendingAlerts
}