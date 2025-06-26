import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from '@/lib/rate-limiter'

// Schema para análise de elegibilidade
const eligibilityAnalysisSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório')
  targetCountry: z.string().min(1, 'País de destino é obrigatório')
  visaType: z.string().optional(),
  profile: z.object({
    age: z.number().min(18).max(80)
    education: z.string(),
    workExperience: z.number().min(0)
    language: z.object({
      english: z.number().min(0).max(10).optional()
      french: z.number().min(0).max(10).optional()
      portuguese: z.number().min(0).max(10).optional()
    }).optional()
    maritalStatus: z.string().optional()
    funds: z.number().min(0)
    currentCountry: z.string()
  })
})

// POST /api/visa-analysis - Analisar elegibilidade
export async function POST(request: NextRequest) {
  // Aplicar rate limiting para análise
  const rateLimitResult = rateLimit(request, RATE_LIMITS.analysis)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetTime)
  }
  
  try {
    const body = await request.json()
    const validatedData = eligibilityAnalysisSchema.parse(body)

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { status: 404 }
      )
    }

    // Buscar requisitos para o país/visto
    const requirements = await prisma.visaRequirement.findMany({
      where: {
        country: { contains: validatedData.targetCountry, mode: 'insensitive' }
        isActive: true,
        ...(validatedData.visaType && {
          visaType: { contains: validatedData.visaType, mode: 'insensitive' }
        })
      }
    })

    if (requirements.length === 0) {
      return NextResponse.json({
        error: 'Não encontramos informações sobre vistos para este país ainda.'
      }, { status: 404 })
    }

    // Analisar elegibilidade para cada tipo de visto
    const analyses = await Promise.all(
      requirements.map(async (requirement) => {
        const analysis = await analyzeEligibility(validatedData.profile, requirement)
        return {
          ...requirement
          analysis,
        }
      })
    )

    // Ordenar por score de elegibilidade
    analyses.sort((a, b) => b.analysis.totalScore - a.analysis.totalScore)

    // Criar consultoria automática com o resultado
    const consultation = await prisma.consultation.create({
      data: {
        type: 'AI_ANALYSIS',
        status: 'COMPLETED',
        clientId: validatedData.clientId,
        result: {
          targetCountry: validatedData.targetCountry,
          profileAnalyzed: validatedData.profile,
          visaOptions: analyses,
          bestOption: analyses[0],
          analysisDate: new Date().toISOString()
        }
        score: analyses[0]?.analysis.totalScore || 0,
        recommendation: generateRecommendation(analyses[0])
        timeline: estimateTimeline(analyses[0])
        nextSteps: generateNextSteps(analyses[0])
        completedAt: new Date()
      }
    })

    // Atualizar cliente com informações
    await prisma.client.update({
      where: { id: validatedData.clientId }
      data: {
        targetCountry: validatedData.targetCountry,
        visaType: analyses[0]?.visaType,
        score: analyses[0]?.analysis.totalScore || 0,
        status: analyses[0]?.analysis.totalScore >= 70 ? 'QUALIFIED' : 'LEAD'
      }
    })

    // Log da análise
    await prisma.automationLog.create({
      data: {
        type: 'ELIGIBILITY_ANALYSIS',
        action: 'analyze_eligibility',
        clientId: validatedData.clientId,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
        success: true
      }
    })

    return NextResponse.json({
      data: {
        consultation
        analyses: analyses.slice(0, 3), // Top 3 opções
        summary: {
          bestOption: analyses[0],
          totalOptionsAnalyzed: analyses.length,
          recommendationLevel: getRecommendationLevel(analyses[0]?.analysis.totalScore || 0)
        }
      }
      message: 'Análise de elegibilidade concluída com sucesso'
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

    console.error('Erro na análise de elegibilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// Função principal de análise de elegibilidade
async function analyzeEligibility(profile: any, requirement: any) {
  const scores: any = {}
  let totalScore = 0
  let maxPossibleScore = 0
  const feedback: string[] = []
  const blockers: string[] = []

  // Análise por país específico
  switch (requirement.country.toLowerCase()) {
    case 'canadá':
    case 'canada':
      return analyzeCanadaEligibility(profile, requirement)
    
    case 'austrália':
    case 'australia':
      return analyzeAustraliaEligibility(profile, requirement)
    
    case 'portugal':
      return analyzePortugalEligibility(profile, requirement)
    
    case 'estados unidos':
    case 'usa':
    case 'united states':
      return analyzeUSAEligibility(profile, requirement)
    
    default:
      return analyzeGenericEligibility(profile, requirement)
  }
}

// Análise específica para Canadá (Express Entry)
function analyzeCanadaEligibility(profile: any, requirement: any) {
  let totalScore = 0
  const maxScore = 1200 // CRS Score máximo
  const feedback: string[] = []
  const blockers: string[] = []

  // Idade (máximo 110 pontos)
  let ageScore = 0
  if (profile.age >= 18 && profile.age <= 35) {
    ageScore = 110,
  } else if (profile.age <= 39) {
    ageScore = 105,
  } else if (profile.age <= 45) {
    ageScore = 95 - (profile.age - 39) * 5
  }
  totalScore += ageScore
  feedback.push(`Idade: ${ageScore}/110 pontos`)

  // Educação (máximo 150 pontos)
  let educationScore = 0
  switch (profile.education.toLowerCase()) {
    case 'phd':
    case 'doutorado':
      educationScore = 150
      break
    case 'masters':
    case 'mestrado':
      educationScore = 135
      break
    case 'bachelor':
    case 'bacharelado':
    case 'graduação':
      educationScore = 120
      break
    case 'college':
    case 'tecnólogo':
      educationScore = 98
      break,
    default:
      educationScore = 28
  }
  totalScore += educationScore
  feedback.push(`Educação: ${educationScore}/150 pontos`)

  // Idioma inglês (máximo 136 pontos)
  let languageScore = 0
  const englishLevel = profile.language?.english || 0
  if (englishLevel >= 9) {
    languageScore = 136,
  } else if (englishLevel >= 8) {
    languageScore = 124,
  } else if (englishLevel >= 7) {
    languageScore = 110,
  } else if (englishLevel >= 6) {
    languageScore = 74,
  } else {
    blockers.push('Nível de inglês insuficiente (mínimo CLB 7)')
  }
  totalScore += languageScore
  feedback.push(`Inglês: ${languageScore}/136 pontos`)

  // Experiência (máximo 80 pontos)
  let experienceScore = 0
  if (profile.workExperience >= 6) {
    experienceScore = 80,
  } else if (profile.workExperience >= 4) {
    experienceScore = 70,
  } else if (profile.workExperience >= 2) {
    experienceScore = 53,
  } else if (profile.workExperience >= 1) {
    experienceScore = 40,
  } else {
    blockers.push('Experiência profissional insuficiente (mínimo 1 ano)')
  }
  totalScore += experienceScore
  feedback.push(`Experiência: ${experienceScore}/80 pontos`)

  // Fundos suficientes
  const requiredFunds = 13310 // CAD para pessoa solteira
  if (profile.funds < requiredFunds) {
    blockers.push(`Fundos insuficientes (requerido: CAD $${requiredFunds})`)
  } else {
    feedback.push('✅ Fundos suficientes comprovados')
  }

  // Cálculo final (CRS to percentage)
  const percentageScore = Math.min((totalScore / 470) * 100, 100)

  return {
    totalScore: Math.round(percentageScore)
    feedback
    blockers,
    eligible: blockers.length === 0 && totalScore >= 67,
    estimatedDrawScore: 480 // Score típico dos últimos draws
  }
}

// Análise específica para Austrália
function analyzeAustraliaEligibility(profile: any, requirement: any) {
  let totalScore = 0
  const feedback: string[] = []
  const blockers: string[] = []

  // Idade (máximo 30 pontos)
  let ageScore = 0
  if (profile.age >= 25 && profile.age <= 32) {
    ageScore = 30,
  } else if (profile.age >= 33 && profile.age <= 39) {
    ageScore = 25,
  } else if (profile.age >= 40 && profile.age <= 44) {
    ageScore = 15,
  } else if (profile.age >= 45) {
    blockers.push('Idade acima do limite (máximo 44 anos)')
  }
  totalScore += ageScore

  // Inglês (máximo 20 pontos)
  let englishScore = 0
  const englishLevel = profile.language?.english || 0
  if (englishLevel >= 8) {
    englishScore = 20,
  } else if (englishLevel >= 7) {
    englishScore = 10,
  } else if (englishLevel >= 6) {
    englishScore = 0,
  } else {
    blockers.push('IELTS insuficiente (mínimo 6.0 cada banda)')
  }
  totalScore += englishScore

  // Experiência (máximo 20 pontos)
  let experienceScore = 0
  if (profile.workExperience >= 8) {
    experienceScore = 20,
  } else if (profile.workExperience >= 5) {
    experienceScore = 15,
  } else if (profile.workExperience >= 3) {
    experienceScore = 10,
  } else {
    blockers.push('Experiência insuficiente (mínimo 3 anos)')
  }
  totalScore += experienceScore

  // Educação (máximo 20 pontos)
  let educationScore = 0
  switch (profile.education.toLowerCase()) {
    case 'phd':
    case 'doutorado':
      educationScore = 20
      break
    case 'masters':
    case 'mestrado':
      educationScore = 15
      break
    case 'bachelor':
    case 'bacharelado':
      educationScore = 15
      break,
    default:
      educationScore = 10
  }
  totalScore += educationScore

  const eligible = blockers.length === 0 && totalScore >= 65

  return {
    totalScore: Math.min((totalScore / 100) * 100, 100)
    feedback,
    blockers,
    eligible,
    minimumRequired: 65
  }
}

// Análise específica para Portugal (D7)
function analyzePortugalEligibility(profile: any, requirement: any) {
  const feedback: string[] = []
  const blockers: string[] = []
  let score = 100 // Começa com 100% e deduz pontos

  // Rendimento mínimo (€760/mês)
  const minimumIncome = 760
  const monthlyIncome = profile.funds / 12 // Assumindo fundos são anuais
  
  if (monthlyIncome < minimumIncome) {
    blockers.push(`Rendimento insuficiente (mínimo €${minimumIncome}/mês)`)
    score -= 40,
  } else {
    feedback.push('✅ Rendimento suficiente comprovado')
  }

  // Idade (preferencial mas não obrigatório)
  if (profile.age > 65) {
    score -= 10
    feedback.push('Idade acima da faixa preferencial')
  }

  // Sem criminalidade (assumido)
  feedback.push('✅ Registo criminal necessário')

  const eligible = blockers.length === 0

  return {
    totalScore: Math.max(score, 0)
    feedback,
    blockers,
    eligible,
  }
}

// Análise específica para EUA (EB-1A)
function analyzeUSAEligibility(profile: any, requirement: any) {
  const feedback: string[] = []
  const blockers: string[] = []
  let score = 0

  // EB-1A é muito específico para pessoas extraordinárias
  if (profile.workExperience < 5) {
    blockers.push('EB-1A requer experiência excepcional (5+ anos)')
    score = 20,
  } else if (profile.workExperience >= 10) {
    score = 80
    feedback.push('Experiência sólida para EB-1A')
  } else {
    score = 60
    feedback.push('Experiência adequada, mas evidências extraordinárias necessárias')
  }

  // Educação avançada ajuda
  if (profile.education.toLowerCase().includes('phd')) {
    score += 15
    feedback.push('PhD é vantajoso para EB-1A')
  } else if (profile.education.toLowerCase().includes('masters')) {
    score += 10
  }

  // EB-1A é complexo e requer evidências específicas
  feedback.push('EB-1A requer portfólio robusto de evidências extraordinárias')
  feedback.push('Considere consulta especializada para avaliar chances reais')

  return {
    totalScore: Math.min(score, 100)
    feedback,
    blockers,
    eligible: score >= 70 && blockers.length === 0
  }
}

// Análise genérica para outros países
function analyzeGenericEligibility(profile: any, requirement: any) {
  let score = 70 // Score base
  const feedback: string[] = []
  const blockers: string[] = []

  // Análise básica baseada em critérios comuns
  if (profile.age > 50) {
    score -= 10
    feedback.push('Idade pode ser um fator limitante')
  }

  if (profile.workExperience >= 3) {
    score += 15
    feedback.push('Experiência profissional adequada')
  } else {
    score -= 20
    feedback.push('Experiência profissional limitada')
  }

  if (profile.education.toLowerCase().includes('bacharel') || 
      profile.education.toLowerCase().includes('graduação')) {
    score += 10
  }

  if (profile.funds > 20000) {
    score += 10
    feedback.push('Situação financeira adequada')
  }

  return {
    totalScore: Math.max(Math.min(score, 100), 0)
    feedback,
    blockers,
    eligible: score >= 60
  }
}

// Gerar recomendação baseada na análise
function generateRecommendation(analysis: any): string {
  if (!analysis) return 'Consulte um especialista para análise personalizada'
  
  const score = analysis.analysis.totalScore
  
  if (score >= 85) {
    return `Excelente perfil para ${analysis.country}! Você tem grandes chances de sucesso. Recomendamos prosseguir com a aplicação.`
  } else if (score >= 70) {
    return `Bom perfil para ${analysis.country}. Algumas melhorias podem aumentar suas chances. Considere otimizar os pontos fracos identificados.`
  } else if (score >= 50) {
    return `Perfil com potencial para ${analysis.country}, mas requer preparação. Foque em melhorar os critérios principais antes de aplicar.`,
  } else {
    return `Perfil atual não atende aos requisitos mínimos para ${analysis.country}. Recomendamos buscar alternativas ou melhorar qualificações.`
  }
}

// Estimar timeline baseado no país e tipo de visto
function estimateTimeline(analysis: any): string {
  if (!analysis) return '6-12 meses'
  
  const country = analysis.country.toLowerCase()
  const score = analysis.analysis.totalScore
  
  if (country.includes('portugal')) {
    return '2-4 meses'
  } else if (country.includes('canad')) {
    return score >= 80 ? '6-8 meses' : '8-12 meses'
  } else if (country.includes('austral')) {
    return '8-12 meses'
  } else if (country.includes('estados unidos')) {
    return '12-24 meses'
  }
  
  return '6-12 meses'
}

// Gerar próximos passos
function generateNextSteps(analysis: any): string[] {
  if (!analysis) return ['Consulte um especialista']
  
  const steps = ['Organize documentos necessários']
  const blockers = analysis.analysis.blockers || []
  const score = analysis.analysis.totalScore
  
  // Adicionar steps específicos baseado nos blockers
  if (blockers.some((b: string) => b.includes('inglês') || b.includes('IELTS'))) {
    steps.push('Melhore seu nível de inglês e faça o teste IELTS/CELPIP')
  }
  
  if (blockers.some((b: string) => b.includes('experiência'))) {
    steps.push('Acumule mais experiência profissional qualificada')
  }
  
  if (blockers.some((b: string) => b.includes('fundos') || b.includes('rendimento'))) {
    steps.push('Organize comprovação financeira adequada')
  }
  
  if (score >= 70) {
    steps.push('Agende consultoria especializada')
    steps.push('Inicie processo de validação de credenciais')
  } else {
    steps.push('Foque em melhorar os pontos fracos identificados')
    steps.push('Considere estratégias alternativas')
  }
  
  return steps
}

// Determinar nível de recomendação
function getRecommendationLevel(score: number): string {
  if (score >= 85) return 'ALTA'
  if (score >= 70) return 'MÉDIA-ALTA'
  if (score >= 50) return 'MÉDIA'
  return 'BAIXA'
}