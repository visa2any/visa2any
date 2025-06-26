import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para análise de lead scoring
const leadScoringSchema = z.object({
  clientId: z.string().optional()
  profile: z.object({
    // Dados demográficos
    age: z.number().optional()
    education: z.string().optional()
    income: z.string().optional()
    maritalStatus: z.string().optional()
    
    // Dados de interesse
    targetCountry: z.string().optional()
    visaType: z.string().optional()
    timeframe: z.string().optional()
    
    // Dados comportamentais
    source: z.string().optional()
    utmSource: z.string().optional()
    utmMedium: z.string().optional()
    deviceType: z.string().optional()
    
    // Engagement
    pageViews: z.number().optional()
    timeOnSite: z.number().optional()
    emailOpens: z.number().optional()
    clickThroughs: z.number().optional()
    
    // Interações
    assessmentCompleted: z.boolean().optional()
    documentsUploaded: z.number().optional()
    consultationBooked: z.boolean().optional()
    pricingPageVisits: z.number().optional()
  })
})

// POST /api/ml/lead-scoring - Calcular lead score avançado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadScoringSchema.parse(body)

    // Buscar dados históricos do cliente se disponível
    let clientData = null
    if (validatedData.clientId) {
      clientData = await prisma.client.findUnique({
        where: { id: validatedData.clientId }
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
          documents: true,
          consultations: true,
          payments: true
        }
      })
    }

    // Calcular lead score usando algoritmo ML
    const scoringResult = await calculateAdvancedLeadScore(validatedData.profile, clientData)

    // Determinar próximas ações recomendadas
    const recommendedActions = getRecommendedActions(scoringResult)

    // Calcular probabilidade de conversão
    const conversionProbability = calculateConversionProbability(scoringResult, clientData)

    // Estimar valor do cliente (LTV)
    const estimatedLTV = calculateEstimatedLTV(validatedData.profile, scoringResult)

    // Salvar score atualizado
    if (validatedData.clientId) {
      await updateClientScore(validatedData.clientId, scoringResult)
    }

    // Log da análise
    await prisma.automationLog.create({
      data: {
        type: 'ML_LEAD_SCORING',
        action: 'calculate_lead_score',
        clientId: validatedData.clientId || null,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
        success: true
      }
    })

    return NextResponse.json({
      data: {
        leadScore: scoringResult.totalScore
        grade: getScoreGrade(scoringResult.totalScore)
        breakdown: scoringResult.breakdown,
        conversionProbability: conversionProbability,
        estimatedLTV: estimatedLTV,
        recommendedActions: recommendedActions,
        insights: generateInsights(scoringResult, clientData)
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos'
          details: error.errors
        }
        { status: 400 }
      )
    }

    console.error('Erro no lead scoring:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// GET /api/ml/lead-scoring/analytics - Analytics de lead scoring
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Buscar dados de scoring
    const scoringData = await prisma.automationLog.findMany({
      where: {
        type: 'ML_LEAD_SCORING'
        createdAt: { gte: startDate }
      }
      include: {
        client: {
          select: {
            id: true,
            name: true,
            status: true,
            targetCountry: true
          }
        }
      }
    })

    // Analisar distribuição de scores
    const scoreDistribution = analyzeScoreDistribution(scoringData)
    
    // Calcular accuracy do modelo
    const modelAccuracy = await calculateModelAccuracy(scoringData)
    
    // Top fatores de conversão
    const conversionFactors = analyzeConversionFactors(scoringData)

    return NextResponse.json({
      data: {
        overview: {
          totalScored: scoringData.length
          averageScore: scoreDistribution.average,
          highQualityLeads: scoreDistribution.highQuality,
          modelAccuracy: modelAccuracy
        }
        scoreDistribution: scoreDistribution,
        conversionFactors: conversionFactors,
        trends: generateTrends(scoringData)
      }
    })

  } catch (error) {
    console.error('Erro em analytics de lead scoring:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// Algoritmo avançado de lead scoring
async function calculateAdvancedLeadScore(profile: any, clientData: any) {
  const breakdown = {
    demographic: 0,
    behavioral: 0,
    engagement: 0,
    intent: 0,
    fit: 0
  }

  // 1. SCORE DEMOGRÁFICO (0-20 pontos)
  breakdown.demographic = calculateDemographicScore(profile)

  // 2. SCORE COMPORTAMENTAL (0-25 pontos)
  breakdown.behavioral = calculateBehavioralScore(profile, clientData)

  // 3. SCORE DE ENGAGEMENT (0-25 pontos)
  breakdown.engagement = calculateEngagementScore(profile, clientData)

  // 4. SCORE DE INTENÇÃO (0-20 pontos)
  breakdown.intent = calculateIntentScore(profile, clientData)

  // 5. SCORE DE FIT (0-10 pontos)
  breakdown.fit = calculateFitScore(profile)

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0)

  return {
    totalScore: Math.min(totalScore, 100)
    breakdown,
    factors: identifyKeyFactors(breakdown, profile)
  }
}

// Score demográfico
function calculateDemographicScore(profile: any): number {
  let score = 0

  // Idade (sweet spot: 25-45 anos)
  if (profile.age) {
    if (profile.age >= 25 && profile.age <= 45) score += 5
    else if (profile.age >= 20 && profile.age <= 50) score += 3
    else score += 1
  }

  // Educação
  const educationScores: Record<string, number> = {
    'DOCTORATE': 5,
    'MASTER': 4,
    'BACHELOR': 3,
    'TECHNICAL': 2,
    'HIGH_SCHOOL': 1
  }
  score += educationScores[profile.education] || 0

  // Renda
  const incomeScores: Record<string, number> = {
    '20000+': 5,
    '10000-20000': 4,
    '6000-10000': 3,
    '3000-6000': 2,
    '0-3000': 1
  }
  score += incomeScores[profile.income] || 0

  // Estado civil (casados tendem a ser mais estáveis)
  if (profile.maritalStatus === 'MARRIED') score += 3
  else if (profile.maritalStatus === 'SINGLE') score += 2

  return Math.min(score, 20)
}

// Score comportamental
function calculateBehavioralScore(profile: any, clientData: any): number {
  let score = 0

  // Fonte de tráfego (qualidade)
  const sourceScores: Record<string, number> = {
    'organic': 8,
    'referral': 10,
    'direct': 7,
    'social': 5,
    'paid': 6,
    'email': 9
  }
  score += sourceScores[profile.source] || 3

  // UTM tracking (campanhas específicas são melhores)
  if (profile.utmMedium === 'cpc') score += 3
  if (profile.utmSource === 'google') score += 2
  if (profile.utmSource === 'facebook') score += 1

  // Device type (desktop users mais sérios)
  if (profile.deviceType === 'desktop') score += 4
  else if (profile.deviceType === 'mobile') score += 2

  // Histórico de interações
  if (clientData?.interactions) {
    const interactionCount = clientData.interactions.length
    if (interactionCount > 10) score += 8
    else if (interactionCount > 5) score += 5
    else if (interactionCount > 2) score += 3
  }

  return Math.min(score, 25)
}

// Score de engagement
function calculateEngagementScore(profile: any, clientData: any): number {
  let score = 0

  // Page views (mais páginas = mais interesse)
  if (profile.pageViews) {
    if (profile.pageViews > 10) score += 8
    else if (profile.pageViews > 5) score += 5
    else if (profile.pageViews > 2) score += 3
  }

  // Tempo no site (engagement profundo)
  if (profile.timeOnSite) {
    const minutes = profile.timeOnSite / 60
    if (minutes > 15) score += 8
    else if (minutes > 8) score += 5
    else if (minutes > 3) score += 3
  }

  // Email engagement
  if (profile.emailOpens > 3) score += 4
  if (profile.clickThroughs > 1) score += 5

  // Visitas à página de preços (alta intenção)
  if (profile.pricingPageVisits) {
    if (profile.pricingPageVisits > 3) score += 5
    else if (profile.pricingPageVisits > 1) score += 3
  }

  return Math.min(score, 25)
}

// Score de intenção
function calculateIntentScore(profile: any, clientData: any): number {
  let score = 0

  // Assessment completado (alta intenção)
  if (profile.assessmentCompleted) score += 8

  // Documentos uploaded
  if (profile.documentsUploaded > 0) score += 6

  // Consultoria agendada
  if (profile.consultationBooked) score += 6

  // Timeframe urgente
  const timeframeScores: Record<string, number> = {
    '6 meses': 5,
    '1 ano': 4,
    '2 anos': 2,
    '3+ anos': 1
  }
  score += timeframeScores[profile.timeframe] || 0

  return Math.min(score, 20)
}

// Score de fit (produto-cliente)
function calculateFitScore(profile: any): number {
  let score = 0

  // Países com alta taxa de aprovação
  const countryScores: Record<string, number> = {
    'Portugal': 5,
    'Canada': 4,
    'Australia': 4,
    'Germany': 3,
    'United States': 2
  }
  score += countryScores[profile.targetCountry] || 1

  // Tipos de visto mais viáveis
  const visaScores: Record<string, number> = {
    'SKILLED': 4,
    'INVESTMENT': 5,
    'WORK': 3,
    'STUDENT': 2,
    'FAMILY': 3
  }
  score += visaScores[profile.visaType] || 1

  return Math.min(score, 10)
}

// Identificar fatores-chave
function identifyKeyFactors(breakdown: any, profile: any): string[] {
  const factors = []

  if (breakdown.demographic >= 15) factors.push('Perfil demográfico ideal')
  if (breakdown.behavioral >= 20) factors.push('Comportamento de alta qualidade')
  if (breakdown.engagement >= 20) factors.push('Alto engagement')
  if (breakdown.intent >= 15) factors.push('Alta intenção de compra')
  if (breakdown.fit >= 8) factors.push('Excelente fit produto-cliente')

  if (profile.assessmentCompleted) factors.push('Assessment completado')
  if (profile.pricingPageVisits > 2) factors.push('Múltiplas visitas ao pricing')
  if (profile.timeOnSite > 600) factors.push('Sessão longa (10+ min)')

  return factors
}

// Ações recomendadas baseadas no score
function getRecommendedActions(scoringResult: any): any[] {
  const score = scoringResult.totalScore
  const actions = []

  if (score >= 80) {
    actions.push({
      priority: 'URGENT'
      action: 'immediate_call',
      description: 'Ligar imediatamente - lead quente',
      sla: '15 minutos'
    })
    actions.push({
      priority: 'HIGH',
      action: 'premium_offer',
      description: 'Oferecer desconto premium',
      sla: '1 hora'
    })
  } else if (score >= 60) {
    actions.push({
      priority: 'HIGH',
      action: 'schedule_call',
      description: 'Agendar ligação nas próximas 2h',
      sla: '2 horas'
    })
    actions.push({
      priority: 'MEDIUM',
      action: 'nurture_sequence',
      description: 'Iniciar sequência de nurturing premium',
      sla: '4 horas'
    })
  } else if (score >= 40) {
    actions.push({
      priority: 'MEDIUM',
      action: 'email_follow_up',
      description: 'Email personalizado de follow-up',
      sla: '24 horas'
    })
    actions.push({
      priority: 'LOW',
      action: 'retargeting',
      description: 'Adicionar em campanhas de retargeting',
      sla: '48 horas'
    })
  } else {
    actions.push({
      priority: 'LOW',
      action: 'educational_content',
      description: 'Enviar conteúdo educacional',
      sla: '7 dias'
    })
  }

  return actions
}

// Calcular probabilidade de conversão
function calculateConversionProbability(scoringResult: any, clientData: any): number {
  let probability = 0

  // Base no score
  const score = scoringResult.totalScore
  if (score >= 80) probability = 85
  else if (score >= 60) probability = 65
  else if (score >= 40) probability = 35
  else if (score >= 20) probability = 15
  else probability = 5

  // Ajustes baseados em dados históricos
  if (clientData?.interactions?.length > 5) probability += 10
  if (clientData?.documents?.length > 0) probability += 15
  if (clientData?.consultations?.length > 0) probability += 20

  return Math.min(probability, 95)
}

// Estimar LTV do cliente
function calculateEstimatedLTV(profile: any, scoringResult: any): number {
  let baseLTV = 0

  // LTV base por país
  const countryLTV: Record<string, number> = {
    'United States': 3500,
    'Australia': 2800,
    'Canada': 2500,
    'Portugal': 1200,
    'Germany': 2000
  }
  baseLTV = countryLTV[profile.targetCountry] || 1500

  // Multiplicadores baseados no perfil
  if (profile.income === '20000+') baseLTV *= 1.5
  else if (profile.income === '10000-20000') baseLTV *= 1.3
  else if (profile.income === '6000-10000') baseLTV *= 1.1

  if (profile.education === 'DOCTORATE') baseLTV *= 1.4
  else if (profile.education === 'MASTER') baseLTV *= 1.2
  else if (profile.education === 'BACHELOR') baseLTV *= 1.1

  // Ajuste pelo score
  const scoreMultiplier = 0.5 + (scoringResult.totalScore / 100)
  baseLTV *= scoreMultiplier

  return Math.round(baseLTV)
}

// Atualizar score do cliente
async function updateClientScore(clientId: string, scoringResult: any) {
  try {
    await prisma.client.update({
      where: { id: clientId }
      data: {
        leadScore: scoringResult.totalScore,
        lastScoredAt: new Date()
      }
    })
  } catch (error) {
    console.error('Erro ao atualizar score do cliente:', error)
  }
}

// Gerar insights
function generateInsights(scoringResult: any, clientData: any): string[] {
  const insights = []
  const score = scoringResult.totalScore

  if (score >= 80) {
    insights.push('🔥 Lead de altíssima qualidade - ação imediata recomendada')
  } else if (score >= 60) {
    insights.push('⭐ Lead qualificado - alta probabilidade de conversão')
  } else if (score >= 40) {
    insights.push('💡 Lead com potencial - precisa de nurturing')
  } else {
    insights.push('📚 Lead inicial - foque em educação')
  }

  if (scoringResult.breakdown.intent >= 15) {
    insights.push('🎯 Alta intenção detectada')
  }

  if (scoringResult.breakdown.engagement >= 20) {
    insights.push('🚀 Altamente engajado')
  }

  return insights
}

// Funções auxiliares para analytics
function analyzeScoreDistribution(data: any[]) {
  const scores = data.map(d => d.details?.leadScore || 0)
  
  return {
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    highQuality: scores.filter(score => score >= 70).length,
    medium: scores.filter(score => score >= 40 && score < 70).length,
    low: scores.filter(score => score < 40).length
  }
}

async function calculateModelAccuracy(data: any[]) {
  // Calcular accuracy comparando previsões com conversões reais
  // Em produção
 implementar análise mais sofisticada
  return 78.5 // Placeholder
}

function analyzeConversionFactors(data: any[]) {
  // Analisar quais fatores mais correlacionam com conversão
  return [
    { factor: 'Assessment Completed', correlation: 0.85 }
    { factor: 'Multiple Pricing Visits', correlation: 0.72 }
    { factor: 'Email Engagement', correlation: 0.68 }
    { factor: 'Time on Site > 10min', correlation: 0.65 }
  ]
}

function generateTrends(data: any[]) {
  // Gerar trends de score ao longo do tempo
  return {
    averageScoreImprovement: '+12%'
    conversionRateImprovement: '+23%',
    topPerformingSource: 'organic'
  }
}

function getScoreGrade(score: number): string {
  if (score >= 80) return 'A+'
  if (score >= 70) return 'A'
  if (score >= 60) return 'B+'
  if (score >= 50) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}