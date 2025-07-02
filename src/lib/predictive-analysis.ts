// Sistema de Análise Preditiva para Vistos

export interface ClientProfile {
  id: string
  name: string
  age: number
  nationality: string
  education: string
  workExperience: number
  languageSkills: string[]
  financialCapacity: number
  travelHistory: string[]
  criminalRecord: boolean
  healthStatus: string
  familyInDestination: boolean
  purpose: string
  destination: string
  visaType: string
}

export interface AnalysisResult {
  successProbability: number
  processingTime: {
    min: number
    typical: number
    max: number
  }
  riskFactors: RiskFactor[]
  recommendations: Recommendation[]
  nextSteps: NextStep[]
  milestones: Milestone[]
  criticalPath: string[]
}

export interface RiskFactor {
  type: 'document' | 'financial' | 'personal' | 'temporal' | 'strategic'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  impact: string
  mitigation: string
}

export interface Recommendation {
  category: 'document' | 'timeline' | 'strategy' | 'preparation'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actionRequired: boolean
  estimatedCost?: number
  timeRequired?: number
}

export interface NextStep {
  order: number
  title: string
  description: string
  deadline: string
  responsible: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  dependencies: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  critical: boolean
  dependencies: string[]
}

export interface PromptContext {
  client: ClientProfile
  destination: string
  visaType: string
  urgency: 'normal' | 'urgent' | 'express'
  budget: number
  timeline: number
}

export class PredictiveAnalysisEngine {
  private historicalData: Map<string, any[]> = new Map()

  constructor() {
    this.initializeData()
  }

  async analyzeVisaApplication(context: PromptContext): Promise<AnalysisResult> {
    try {
      console.log(`🔍 Analisando aplicação para ${context.destination} - ${context.visaType}`)

      const successProbability = this.calculateSuccessProbability(context)
      const processingTime = this.estimateProcessingTime(context)
      const riskFactors = this.identifyRiskFactors(context)
      const recommendations = this.generateRecommendations(context)
      const nextSteps = await this.generateNextSteps(context)
      const milestones = this.generateMilestones(context, processingTime.typical)
      const criticalPath = this.identifyCriticalPath(milestones)

      return {
        successProbability,
        processingTime,
        riskFactors,
        recommendations,
        nextSteps,
        milestones,
        criticalPath
      }

    } catch (error) {
      console.error('Erro na análise preditiva:', error)
      throw new Error('Falha na análise preditiva')
    }
  }

  private calculateSuccessProbability(context: PromptContext): number {
    let baseProbability = 0.7

    // Fatores positivos
    if (context.client.education === 'university') baseProbability += 0.1
    if (context.client.workExperience > 5) baseProbability += 0.05
    if (context.client.languageSkills.includes('english')) baseProbability += 0.1
    if (context.client.financialCapacity > 50000) baseProbability += 0.1
    if (!context.client.criminalRecord) baseProbability += 0.05

    // Fatores negativos
    if (context.client.criminalRecord) baseProbability -= 0.3
    if (context.client.age > 60) baseProbability -= 0.1
    if (context.client.financialCapacity < 10000) baseProbability -= 0.2

    return Math.max(0.1, Math.min(0.95, baseProbability))
  }

  private estimateProcessingTime(context: PromptContext): { min: number; typical: number; max: number } {
    const baseTimes = this.getBaseProcessingTimes(context.destination, context.visaType)
    
    let multiplier = 1.0
    
    if (context.urgency === 'express') multiplier = 0.5
    if (context.urgency === 'urgent') multiplier = 0.7
    
    return {
      min: Math.round(baseTimes.min * multiplier),
      typical: Math.round(baseTimes.typical * multiplier),
      max: Math.round(baseTimes.max * multiplier)
    }
  }

  private getBaseProcessingTimes(destination: string, visaType: string): { min: number; typical: number; max: number } {
    const times: Record<string, { min: number; typical: number; max: number }> = {
      'usa-tourist': { min: 7, typical: 14, max: 30 },
      'usa-business': { min: 14, typical: 30, max: 60 },
      'canada-express': { min: 30, typical: 90, max: 180 },
      'uk-visitor': { min: 10, typical: 21, max: 45 },
      'australia-tourist': { min: 14, typical: 30, max: 60 }
    }

    const key = `${destination}-${visaType}`
    return times[key] || { min: 30, typical: 60, max: 120 }
  }

  private identifyRiskFactors(context: PromptContext): RiskFactor[] {
    const risks: RiskFactor[] = []

    // Riscos de documentos
    if (context.client.education === 'high_school') {
      risks.push({
        type: 'document',
        severity: 'medium',
        description: 'Educação limitada pode requerer documentação adicional',
        impact: 'Pode aumentar tempo de processamento',
        mitigation: 'Obter certificados de qualificação profissional'
      })
    }

    // Riscos financeiros
    if (context.client.financialCapacity < 20000) {
      risks.push({
        type: 'financial',
        severity: 'high',
        description: 'Capacidade financeira limitada',
        impact: 'Pode resultar em rejeição',
        mitigation: 'Demonstrar fontes adicionais de renda'
      })
    }

    // Riscos pessoais
    if (context.client.age > 55) {
      risks.push({
        type: 'personal',
        severity: 'medium',
        description: 'Idade avançada pode ser considerada',
        impact: 'Processamento mais rigoroso',
        mitigation: 'Demonstrar saúde e independência financeira'
      })
    }

    return risks
  }

  private generateRecommendations(context: PromptContext): Recommendation[] {
    const recommendations: Recommendation[] = []

    recommendations.push({
      category: 'document',
      priority: 'high',
      title: 'Preparar documentação completa',
      description: 'Reunir todos os documentos necessários com antecedência',
      actionRequired: true,
      timeRequired: 7
    })

    recommendations.push({
      category: 'timeline',
      priority: 'medium',
      title: 'Planejar cronograma',
      description: 'Criar cronograma detalhado para evitar atrasos',
      actionRequired: true,
      timeRequired: 3
    })

    return recommendations
  }

  private async generateNextSteps(context: PromptContext): Promise<NextStep[]> {
    const steps: NextStep[] = []

    steps.push({
      order: 1,
      title: 'Reunir documentos pessoais',
      description: 'Passaporte, certidões, comprovantes',
      deadline: this.addDays(new Date(), 7).toISOString(),
      responsible: 'Cliente',
      status: 'pending',
      dependencies: []
    })

    steps.push({
      order: 2,
      title: 'Preparar formulários',
      description: 'Preencher formulários de aplicação',
      deadline: this.addDays(new Date(), 14).toISOString(),
      responsible: 'Consultor',
      status: 'pending',
      dependencies: ['Reunir documentos pessoais']
    })

    return steps
  }

  private generateMilestones(context: PromptContext, totalDays: number): Milestone[] {
    const milestones: Milestone[] = []
    const startDate = new Date()

    milestones.push({
      id: 'documents',
      title: 'Documentação Completa',
      description: 'Todos os documentos reunidos e verificados',
      targetDate: this.addDays(startDate, Math.round(totalDays * 0.2)).toISOString(),
      status: 'pending',
      critical: true,
      dependencies: []
    })

    milestones.push({
      id: 'application',
      title: 'Aplicação Submetida',
      description: 'Formulário enviado com sucesso',
      targetDate: this.addDays(startDate, Math.round(totalDays * 0.4)).toISOString(),
      status: 'pending',
      critical: true,
      dependencies: ['Documentação Completa']
    })

    milestones.push({
      id: 'processing',
      title: 'Em Processamento',
      description: 'Aplicação sendo analisada',
      targetDate: this.addDays(startDate, Math.round(totalDays * 0.7)).toISOString(),
      status: 'pending',
      critical: false,
      dependencies: ['Aplicação Submetida']
    })

    return milestones
  }

  private identifyCriticalPath(milestones: Milestone[]): string[] {
    return milestones
      .filter(m => m.critical)
      .map(m => m.id)
  }

  private initializeData(): void {
    // Inicializar dados históricos simulados
    this.historicalData.set('usa-tourist', [])
    this.historicalData.set('canada-express', [])
    this.historicalData.set('uk-visitor', [])
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}

export const predictiveAnalysis = new PredictiveAnalysisEngine()

export async function analyzeVisaApplication(context: any): Promise<AnalysisResult> {
  return predictiveAnalysis.analyzeVisaApplication(context)
} 