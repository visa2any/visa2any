'use client'

import { ClientProfile, CountryProfile, PromptContext } from './ai-prompts'

/**
 * Sistema de Análise Preditiva para Visa2Any
 * IA para prever probabilidade de aprovação, timeline e riscos
 */

export interface PredictionResult {
  successProbability: number
  confidence: number
  timeline: TimelinePrediction
  riskFactors: RiskFactor[]
  recommendations: Recommendation[]
  comparableCases: ComparableCase[]
  nextSteps: NextStep[]
}

export interface TimelinePrediction {
  optimistic: number // dias
  realistic: number
  pessimistic: number
  milestones: Milestone[]
  criticalPath: string[]
}

export interface RiskFactor {
  id: string
  category: 'document' | 'financial' | 'personal' | 'temporal' | 'strategic'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  impact: number // 0-100
  probability: number // 0-100
  mitigation: string
  cost: number
  timeToResolve: number
}

export interface Recommendation {
  id: string
  type: 'immediate' | 'short_term' | 'long_term'
  priority: number
  action: string
  rationale: string
  impact: string
  resources: string[]
  timeline: number
  cost: number
}

export interface ComparableCase {
  id: string
  similarity: number
  profile: Partial<ClientProfile>
  outcome: 'approved' | 'rejected' | 'pending'
  timeline: number
  keyFactors: string[]
  lessons: string[]
}

export interface Milestone {
  stage: string
  description: string
  estimatedDays: number
  dependencies: string[]
  criticalSuccess: boolean
}

export interface NextStep {
  step: string
  description: string
  deadline: string
  responsible: 'client' | 'consultant' | 'system'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  estimatedTime: string
}

/**
 * Engine principal de análise preditiva
 */
export class PredictiveAnalysisEngine {
  private historicalData: Map<string, any[]> = new Map()
  private policyDatabase: Map<string, any> = new Map()
  private seasonalTrends: Map<string, number[]> = new Map()

  constructor() {
    this.initializeData()
  }

  /**
   * Análise preditiva completa
   */
  async analyzePrediction(context: PromptContext): Promise<PredictionResult> {
    const [
      successProbability,
      timeline,
      riskFactors,
      recommendations,
      comparableCase,
      nextSteps
    ] = await Promise.all([
      this.calculateSuccessProbability(context),
      this.predictTimeline(context),
      this.analyzeRiskFactors(context),
      this.generateRecommendations(context),
      this.findComparableCases(context),
      this.generateNextSteps(context)
    ])

    return {
      successProbability: successProbability.probability,
      confidence: successProbability.confidence,
      timeline,
      riskFactors,
      recommendations,
      comparableCase,
      nextSteps
    }
  }

  /**
   * Calcula probabilidade de sucesso usando múltiplos fatores
   */
  private async calculateSuccessProbability(context: PromptContext): Promise<{probability: number, confidence: number}> {
    const factors = {
      // Fatores do perfil (peso: 40%)
      profile: this.analyzeProfileStrength(context.client, context.country),
      
      // Fatores documentais (peso: 25%)
      documents: this.analyzeDocumentReadiness(context),
      
      // Fatores temporais (peso: 15%)
      timing: this.analyzeTimingFactors(context),
      
      // Fatores históricos (peso: 20%)
      historical: this.analyzeHistoricalTrends(context)
    }

    // Cálculo ponderado
    const probability = (
      factors.profile.score * 0.40 +
      factors.documents.score * 0.25 +
      factors.timing.score * 0.15 +
      factors.historical.score * 0.20
    )

    // Confiança baseada na qualidade dos dados
    const confidence = Math.min(
      factors.profile.confidence * 0.4 +
      factors.documents.confidence * 0.3 +
      factors.timing.confidence * 0.15 +
      factors.historical.confidence * 0.15,
      95 // Máximo 95% de confiança
    )

    return {
      probability: Math.round(probability),
      confidence: Math.round(confidence)
    }
  }

  /**
   * Analisa força do perfil do cliente
   */
  private analyzeProfileStrength(client: ClientProfile, country: CountryProfile): {score: number, confidence: number} {
    let score = 50 // Base neutra
    let confidence = 80

    // Análise por país
    switch (country.code) {
      case 'CA': // Canadá
        score = this.calculateCanadaScore(client)
        break
      case 'US': // Estados Unidos  
        score = this.calculateUSAScore(client)
        break
      case 'PT': // Portugal
        score = this.calculatePortugalScore(client)
        break
      case 'AU': // Austrália
        score = this.calculateAustraliaScore(client)
        break
      default:
        confidence = 60 // Menor confiança para países não modelados
    }

    return { score: Math.max(0, Math.min(100, score)), confidence }
  }

  /**
   * Cálculo específico para Canadá (CRS + fatores)
   */
  private calculateCanadaScore(client: ClientProfile): number {
    let score = 0

    // Idade (máximo 30 pontos no CRS)
    if (client.age >= 20 && client.age <= 29) score += 30
    else if (client.age >= 30 && client.age <= 35) score += 25
    else if (client.age >= 36 && client.age <= 40) score += 20
    else if (client.age >= 41 && client.age <= 45) score += 10
    else score += 5

    // Educação
    const educationPoints = {
      phd: 25,
      master: 23,
      bachelor: 21,
      high_school: 5
    }
    score += educationPoints[client.education] || 5

    // Experiência
    if (client.workExperience >= 6) score += 15
    else if (client.workExperience >= 4) score += 13
    else if (client.workExperience >= 2) score += 11
    else score += 9

    // Idiomas (simplificado)
    const englishLevel = client.languageSkills.english || 'basic'
    const frenchLevel = client.languageSkills.french || 'basic'
    
    if (englishLevel === 'advanced') score += 20
    else if (englishLevel === 'intermediate') score += 16
    else score += 6

    if (frenchLevel === 'advanced') score += 10
    else if (frenchLevel === 'intermediate') score += 5

    // Conversão para porcentagem (CRS competitivo ~470+)
    const crsEstimate = score
    if (crsEstimate >= 470) return 85
    else if (crsEstimate >= 450) return 70
    else if (crsEstimate >= 400) return 55
    else if (crsEstimate >= 350) return 40
    else return 25
  }

  /**
   * Cálculo específico para EUA
   */
  private calculateUSAScore(client: ClientProfile): number {
    let score = 50

    // Fatores positivos
    if (client.income > 100000) score += 15
    if (client.education === 'phd' || client.education === 'master') score += 10
    if (client.workExperience > 5) score += 10
    if (client.languageSkills.english === 'advanced') score += 10
    if (client.nationality === 'brasileira') score += 5 // Relações diplomáticas

    // Fatores de risco para B1/B2
    if (client.age < 25 || client.age > 65) score -= 10
    if (client.maritalStatus === 'single' && !client.hasChildren) score -= 5
    if (client.income < 30000) score -= 15

    return Math.max(20, Math.min(90, score))
  }

  /**
   * Cálculo específico para Portugal
   */
  private calculatePortugalScore(client: ClientProfile): number {
    let score = 75 // Portugal é mais acessível

    // D7 - renda passiva
    const minIncome = client.hasChildren ? 1200 : 670
    if (client.income >= minIncome * 2) score += 15
    else if (client.income >= minIncome) score += 10
    else score -= 20

    // Idade favorável
    if (client.age >= 35 && client.age <= 55) score += 5

    // Educação
    if (client.education === 'bachelor' || client.education === 'master') score += 5

    // Idioma português
    if (client.languageSkills.portuguese === 'advanced') score += 10
    else if (client.languageSkills.portuguese === 'intermediate') score += 5

    return Math.max(30, Math.min(95, score))
  }

  /**
   * Cálculo específico para Austrália
   */
  private calculateAustraliaScore(client: ClientProfile): number {
    let score = 0

    // Sistema de pontos similar ao Canadá
    // Idade
    if (client.age >= 25 && client.age <= 32) score += 30
    else if (client.age >= 33 && client.age <= 39) score += 25
    else if (client.age >= 40 && client.age <= 44) score += 15
    else score += 0

    // Inglês
    if (client.languageSkills.english === 'advanced') score += 20
    else if (client.languageSkills.english === 'intermediate') score += 10

    // Educação
    if (client.education === 'phd') score += 20
    else if (client.education === 'master') score += 15
    else if (client.education === 'bachelor') score += 15

    // Experiência
    if (client.workExperience >= 8) score += 15
    else if (client.workExperience >= 5) score += 10
    else if (client.workExperience >= 3) score += 5

    // Conversão para porcentagem
    if (score >= 70) return 80
    else if (score >= 60) return 65
    else if (score >= 50) return 50
    else return 30
  }

  /**
   * Analisa prontidão documental
   */
  private analyzeDocumentReadiness(context: PromptContext): {score: number, confidence: number} {
    const documents = context.documents || []
    
    // Lista de documentos essenciais por país/visto
    const requiredDocs = this.getRequiredDocuments(context.country.code, context.client.visaType)
    
    const completeness = documents.length / requiredDocs.length
    const score = Math.min(100, completeness * 120) // Bonificação por documentos extras
    
    return {
      score: Math.round(score),
      confidence: 85
    }
  }

  /**
   * Analisa fatores temporais
   */
  private analyzeTimingFactors(context: PromptContext): {score: number, confidence: number} {
    const now = new Date()
    const month = now.getMonth() + 1
    
    let score = 50
    
    // Sazonalidade por país
    const seasonalFactors = this.getSeasonalFactors(context.country.code, month)
    score += seasonalFactors * 30
    
    // Urgência vs complexidade
    if (context.client.age >= 44) score += 10 // Urgência de idade
    
    return {
      score: Math.max(20, Math.min(90, score)),
      confidence: 70
    }
  }

  /**
   * Analisa tendências históricas
   */
  private analyzeHistoricalTrends(context: PromptContext): {score: number, confidence: number} {
    const historical = this.historicalData.get(`${context.country.code}-${context.client.visaType}`) || []
    
    if (historical.length === 0) {
      return { score: 50, confidence: 40 }
    }
    
    const recentApprovals = historical
      .filter(case => case.outcome === 'approved')
      .slice(-100) // Últimos 100 casos
    
    const approvalRate = recentApprovals.length / Math.min(100, historical.length)
    
    return {
      score: Math.round(approvalRate * 100),
      confidence: Math.min(90, historical.length / 10)
    }
  }

  /**
   * Predição de timeline
   */
  private async predictTimeline(context: PromptContext): Promise<TimelinePrediction> {
    const baseTimes = this.getBaseProcessingTimes(context.country.code, context.client.visaType)
    
    // Fatores de ajuste
    const complexity = this.assessComplexity(context)
    const seasonal = this.getSeasonalDelay(context.country.code, new Date().getMonth() + 1)
    
    const optimistic = Math.round(baseTimes.min * (1 + complexity * 0.1))
    const realistic = Math.round(baseTimes.typical * (1 + complexity * 0.2 + seasonal))
    const pessimistic = Math.round(baseTimes.max * (1 + complexity * 0.3 + seasonal))
    
    const milestones = this.generateMilestones(context, realistic)
    const criticalPath = this.identifyCriticalPath(milestones)
    
    return {
      optimistic,
      realistic, 
      pessimistic,
      milestones,
      criticalPath
    }
  }

  /**
   * Análise de fatores de risco
   */
  private async analyzeRiskFactors(context: PromptContext): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = []
    
    // Riscos documentais
    risks.push(...this.identifyDocumentRisks(context))
    
    // Riscos financeiros
    risks.push(...this.identifyFinancialRisks(context))
    
    // Riscos pessoais
    risks.push(...this.identifyPersonalRisks(context))
    
    // Riscos temporais
    risks.push(...this.identifyTemporalRisks(context))
    
    // Riscos estratégicos
    risks.push(...this.identifyStrategicRisks(context))
    
    return risks.sort((a, b) => (b.severity === 'critical' ? 2 : b.severity === 'high' ? 1 : 0) - 
                               (a.severity === 'critical' ? 2 : a.severity === 'high' ? 1 : 0))
  }

  /**
   * Geração de recomendações
   */
  private async generateRecommendations(context: PromptContext): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    
    // Baseado na análise de força do perfil
    const profileAnalysis = this.analyzeProfileStrength(context.client, context.country)
    
    if (profileAnalysis.score < 60) {
      recommendations.push({
        id: 'improve_profile',
        type: 'short_term',
        priority: 1,
        action: 'Fortalecer perfil antes da aplicação',
        rationale: 'Score atual abaixo do ideal para aprovação',
        impact: 'Pode aumentar chances em 20-30%',
        resources: ['Cursos de idioma', 'Certificações profissionais'],
        timeline: 90,
        cost: 5000
      })
    }
    
    // Recomendações específicas por país
    recommendations.push(...this.getCountrySpecificRecommendations(context))
    
    return recommendations.slice(0, 5) // Top 5 recomendações
  }

  /**
   * Busca casos comparáveis
   */
  private async findComparableCases(context: PromptContext): Promise<ComparableCase[]> {
    const historical = this.historicalData.get(`${context.country.code}-${context.client.visaType}`) || []
    
    return historical
      .map(case => ({
        ...case,
        similarity: this.calculateSimilarity(context.client, case.profile)
      }))
      .filter(case => case.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
  }

  /**
   * Geração de próximos passos
   */
  private async generateNextSteps(context: PromptContext): Promise<NextStep[]> {
    const steps: NextStep[] = []
    
    // Passos baseados no estágio atual
    steps.push({
      step: '1',
      description: 'Reunir documentação completa',
      deadline: this.addDays(new Date(), 14).toISOString().split('T')[0],
      responsible: 'client',
      priority: 'urgent',
      estimatedTime: '2 semanas'
    })
    
    steps.push({
      step: '2', 
      description: 'Revisar e validar documentos',
      deadline: this.addDays(new Date(), 21).toISOString().split('T')[0],
      responsible: 'consultant',
      priority: 'high',
      estimatedTime: '1 semana'
    })
    
    // Passos específicos por país
    steps.push(...this.getCountrySpecificSteps(context))
    
    return steps
  }

  // Métodos auxiliares
  private initializeData(): void {
    // Inicializa dados históricos simulados
    this.historicalData.set('CA-expressEntry', this.generateMockHistoricalData('canada', 1000))
    this.historicalData.set('US-b1b2', this.generateMockHistoricalData('usa', 800))
    this.historicalData.set('PT-d7', this.generateMockHistoricalData('portugal', 600))
  }

  private generateMockHistoricalData(country: string, count: number): any[] {
    // Simula dados históricos para treinamento do modelo
    return Array.from({ length: count }, (_, i) => ({
      id: `case_${country}_${i}`,
      profile: this.generateMockProfile(),
      outcome: Math.random() > 0.3 ? 'approved' : 'rejected',
      timeline: Math.floor(Math.random() * 365) + 30,
      keyFactors: ['education', 'experience', 'language'],
      lessons: ['Document quality matters', 'Timing is important']
    }))
  }

  private generateMockProfile(): Partial<ClientProfile> {
    return {
      age: Math.floor(Math.random() * 40) + 25,
      education: ['bachelor', 'master', 'phd'][Math.floor(Math.random() * 3)] as any,
      workExperience: Math.floor(Math.random() * 15) + 1,
      income: Math.floor(Math.random() * 150000) + 30000
    }
  }

  private getRequiredDocuments(countryCode: string, visaType: string): string[] {
    const docs = {
      'CA-expressEntry': ['passport', 'education', 'language', 'experience', 'medical', 'police'],
      'US-b1b2': ['passport', 'financial', 'employment', 'invitation'],
      'PT-d7': ['passport', 'income', 'accommodation', 'insurance', 'criminal']
    }
    return docs[`${countryCode}-${visaType}`] || ['passport', 'financial']
  }

  private getSeasonalFactors(countryCode: string, month: number): number {
    // Retorna fator sazonal (-0.5 a +0.5)
    const trends = {
      CA: [0.1, 0.2, 0.3, 0.1, -0.1, -0.2, -0.3, -0.2, 0.0, 0.1, 0.2, 0.1],
      US: [0.0, 0.1, 0.2, 0.1, -0.1, -0.2, -0.1, 0.0, 0.1, 0.2, 0.1, 0.0],
      PT: [0.2, 0.3, 0.1, 0.0, -0.1, -0.2, -0.3, -0.2, 0.0, 0.1, 0.2, 0.2]
    }
    return trends[countryCode]?.[month - 1] || 0
  }

  private getBaseProcessingTimes(countryCode: string, visaType: string): {min: number, typical: number, max: number} {
    const times = {
      'CA-expressEntry': { min: 180, typical: 270, max: 365 },
      'US-b1b2': { min: 14, typical: 45, max: 90 },
      'PT-d7': { min: 60, typical: 120, max: 180 }
    }
    return times[`${countryCode}-${visaType}`] || { min: 30, typical: 90, max: 180 }
  }

  private assessComplexity(context: PromptContext): number {
    // Retorna fator de complexidade (0-1)
    let complexity = 0
    
    if (context.client.age > 45) complexity += 0.2
    if (context.client.hasChildren) complexity += 0.1
    if (context.client.maritalStatus === 'divorced') complexity += 0.1
    
    return Math.min(1, complexity)
  }

  private getSeasonalDelay(countryCode: string, month: number): number {
    // Similar ao seasonal factors mas para delays
    return Math.abs(this.getSeasonalFactors(countryCode, month)) * 0.2
  }

  private generateMilestones(context: PromptContext, totalDays: number): Milestone[] {
    const milestones: Milestone[] = [
      {
        stage: 'document_preparation',
        description: 'Preparação de documentos',
        estimatedDays: Math.round(totalDays * 0.3),
        dependencies: [],
        criticalSuccess: true
      },
      {
        stage: 'application_submission',
        description: 'Submissão da aplicação',
        estimatedDays: Math.round(totalDays * 0.1),
        dependencies: ['document_preparation'],
        criticalSuccess: true
      },
      {
        stage: 'initial_review',
        description: 'Revisão inicial',
        estimatedDays: Math.round(totalDays * 0.4),
        dependencies: ['application_submission'],
        criticalSuccess: false
      },
      {
        stage: 'final_decision',
        description: 'Decisão final',
        estimatedDays: Math.round(totalDays * 0.2),
        dependencies: ['initial_review'],
        criticalSuccess: true
      }
    ]
    
    return milestones
  }

  private identifyCriticalPath(milestones: Milestone[]): string[] {
    return milestones
      .filter(m => m.criticalSuccess)
      .map(m => m.stage)
  }

  private identifyDocumentRisks(context: PromptContext): RiskFactor[] {
    const risks: RiskFactor[] = []
    
    if (!context.documents || context.documents.length < 3) {
      risks.push({
        id: 'insufficient_docs',
        category: 'document',
        severity: 'high',
        description: 'Documentação insuficiente',
        impact: 70,
        probability: 80,
        mitigation: 'Reunir documentos faltantes',
        cost: 2000,
        timeToResolve: 14
      })
    }
    
    return risks
  }

  private identifyFinancialRisks(context: PromptContext): RiskFactor[] {
    // Implementação similar para riscos financeiros
    return []
  }

  private identifyPersonalRisks(context: PromptContext): RiskFactor[] {
    // Implementação similar para riscos pessoais
    return []
  }

  private identifyTemporalRisks(context: PromptContext): RiskFactor[] {
    // Implementação similar para riscos temporais
    return []
  }

  private identifyStrategicRisks(context: PromptContext): RiskFactor[] {
    // Implementação similar para riscos estratégicos
    return []
  }

  private getCountrySpecificRecommendations(context: PromptContext): Recommendation[] {
    // Implementação específica por país
    return []
  }

  private getCountrySpecificSteps(context: PromptContext): NextStep[] {
    // Implementação específica por país
    return []
  }

  private calculateSimilarity(profile1: ClientProfile, profile2: Partial<ClientProfile>): number {
    // Algoritmo de similaridade entre perfis
    let similarity = 0
    let factors = 0
    
    if (profile2.age) {
      similarity += 1 - Math.abs(profile1.age - profile2.age) / 50
      factors++
    }
    
    if (profile2.education === profile1.education) {
      similarity += 1
      factors++
    }
    
    return factors > 0 ? similarity / factors : 0
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}

/**
 * Instância global do engine preditivo
 */
export const predictiveEngine = new PredictiveAnalysisEngine()

/**
 * Função de conveniência para análise rápida
 */
export async function analyzePrediction(context: PromptContext): Promise<PredictionResult> {
  return predictiveEngine.analyzePrediction(context)
}

export default {
  PredictiveAnalysisEngine,
  predictiveEngine,
  analyzePrediction
}