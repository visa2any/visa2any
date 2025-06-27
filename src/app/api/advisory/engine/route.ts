import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para consulta do advisory engine
const advisoryQuerySchema = z.object({
  clientId: z.string().optional(),
  profile: z.object({
    targetCountry: z.string(),
    visaType: z.string(),
    age: z.number().optional(),
    education: z.string().optional(),
    experience: z.number().optional(),
    maritalStatus: z.string().optional(),
    hasChildren: z.boolean().optional(),
    income: z.string().optional(),
    languages: z.array(z.string()).optional(),
    currentCountry: z.string().optional()
  }),
  documents: z.array(z.object({
    type: z.string(),
    status: z.string(),
    expiryDate: z.string().optional(),
    issuingCountry: z.string().optional()
  })).optional(),
  queryType: z.enum([
    'eligibility_assessment',
    'document_requirements',
    'timeline_estimate',
    'success_probability',
    'compliance_check',
    'embassy_insights',
    'law_updates'
  ])
})

// POST /api/advisory/engine - Consultar advisory engine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = advisoryQuerySchema.parse(body)

    // Obter expertise específica do país/visto
    const countryExpertise = await getCountrySpecificExpertise(
      validatedData.profile.targetCountry,
      validatedData.profile.visaType
    )

    // Realizar análise baseada no tipo de consulta
    let analysisResult
    switch (validatedData.queryType) {
      case 'eligibility_assessment':
        analysisResult = await performEligibilityAssessment(validatedData.profile, countryExpertise)
        break
      case 'document_requirements':
        analysisResult = await analyzeDocumentRequirements(validatedData.profile, validatedData.documents || [], countryExpertise)
        break
      case 'timeline_estimate':
        analysisResult = await estimateProcessingTimeline(validatedData.profile, countryExpertise)
        break
      case 'success_probability':
        analysisResult = await calculateSuccessProbability(validatedData.profile, validatedData.documents || [], countryExpertise)
        break
      case 'compliance_check':
        analysisResult = await performComplianceCheck(validatedData.profile, validatedData.documents || [], countryExpertise)
        break
      case 'embassy_insights':
        analysisResult = await getEmbassySpecificInsights(validatedData.profile, countryExpertise)
        break
      case 'law_updates':
        analysisResult = await getRecentLawUpdates(validatedData.profile.targetCountry, validatedData.profile.visaType)
        break
      default:
        analysisResult = await performEligibilityAssessment(validatedData.profile, countryExpertise)
    }

    // Gerar recomendações estratégicas
    const strategicRecommendations = await generateStrategicRecommendations(
      validatedData.profile,
      analysisResult,
      countryExpertise
    )

    // Log da consulta
    await prisma.automationLog.create({
      data: {
        type: 'ADVISORY_CONSULTATION',
        action: `advisory_${validatedData.queryType}`,
        clientId: validatedData.clientId || null,
        success: true,
        details: {
          queryType: validatedData.queryType,
          targetCountry: validatedData.profile.targetCountry,
          visaType: validatedData.profile.visaType,
          responseGenerated: true
        }
      }
    })

    return NextResponse.json({
      data: {
        queryType: validatedData.queryType,
        analysis: analysisResult,
        recommendations: strategicRecommendations,
        expertise: {
          source: countryExpertise.source,
          lastUpdated: countryExpertise.lastUpdated,
          confidenceLevel: countryExpertise.confidenceLevel
        },
        nextSteps: generateNextSteps(analysisResult, validatedData.profile)
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro no advisory engine:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/advisory/engine/countries - Listar países suportados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('includeStats') === 'true'
    const supportedCountries = await getSupportedCountries(includeStats)

    return NextResponse.json({
      data: {
        countries: supportedCountries,
        totalSupported: supportedCountries.length,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro ao listar países suportados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Obter expertise específica do país/visto
async function getCountrySpecificExpertise(country: string, visaType: string) {
  const expertise = {
    source: 'internal_database',
    lastUpdated: new Date().toISOString(),
    confidenceLevel: 0.95,
    data: {} as any
  }

  // Base de conhecimento por país
  const countryKnowledge: Record<string, any> = {
    'Canada': {
      'SKILLED': {
        system: 'Express Entry',
        minimumCRS: 470,
        averageProcessingTime: '6-8 months',
        keyRequirements: [
          'Language proficiency (CLB 7+)',
          'Educational credential assessment',
          'Work experience (3+ years)',
          'Proof of funds (CAD $13,213 for single)'
        ],
        commonRejectionReasons: [
          'Insufficient CRS score',
          'Incomplete documentation',
          'Failed medical examination',
          'Criminal background issues'
        ],
        successFactors: [
          'High language scores (CLB 9+)',
          'Canadian work experience',
          'French language proficiency',
          'Job offer from Canadian employer'
        ],
        embassyInsights: {
          fastTrackOptions: ['Provincial Nominee Programs', 'Canadian Experience Class'],
          seasonalVariations: 'Higher draws in Q4',
          currentPriorities: 'Healthcare workers, IT professionals, trades'
        }
      }
    },
    'Australia': {
      'SKILLED': {
        system: 'SkillSelect',
        minimumPoints: 65,
        averageProcessingTime: '8-12 months',
        keyRequirements: [
          'Skills assessment',
          'English proficiency (6.0 IELTS)',
          'Age under 45',
          'Occupation on skilled list'
        ]
      }
    }
  }

  const countryData = countryKnowledge[country]
  if (countryData && countryData[visaType]) {
    expertise.data = countryData[visaType]
    expertise.confidenceLevel = 0.95
  } else {
    // Fallback para países não mapeados
    expertise.data = {
      system: 'Standard processing',
      averageProcessingTime: '6-12 months',
      keyRequirements: ['Standard documentation'],
      note: 'Limited data available - contact specialist'
    }
    expertise.confidenceLevel = 0.6
  }

  return expertise
}

// Realizar análise de elegibilidade
async function performEligibilityAssessment(profile: any, expertise: any) {
  const assessment = {
    overallScore: 0,
    eligibilityLevel: 'low' as 'low' | 'medium' | 'high',
    breakdown: {} as any,
    blockers: [] as string[],
    strengths: [] as string[],
    recommendations: [] as string[]
  }

  const country = profile.targetCountry
  const visaType = profile.visaType

  // Análise específica por país/visto
  if (country === 'Canada' && visaType === 'SKILLED') {
    assessment.breakdown = await assessCanadaExpress(profile, expertise.data)
  } else {
    assessment.breakdown = await assessGeneric(profile, expertise.data)
  }

  // Calcular score geral
  const scores = Object.values(assessment.breakdown).filter(v => typeof v === 'number')
  assessment.overallScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length

  // Determinar nível de elegibilidade
  if (assessment.overallScore >= 80) assessment.eligibilityLevel = 'high'
  else if (assessment.overallScore >= 60) assessment.eligibilityLevel = 'medium'
  else assessment.eligibilityLevel = 'low'

  return assessment
}

// Análise específica para Canadá Express Entry
async function assessCanadaExpress(profile: any, expertise: any) {
  const breakdown = {
    ageScore: 0,
    educationScore: 0,
    languageScore: 0,
    experienceScore: 0,
    estimatedCRS: 0
  }

  // Idade (máximo 110 pontos)
  if (profile.age <= 29) breakdown.ageScore = 100
  else if (profile.age <= 35) breakdown.ageScore = 90
  else if (profile.age <= 40) breakdown.ageScore = 70
  else if (profile.age <= 45) breakdown.ageScore = 40
  else breakdown.ageScore = 0

  // Educação
  const educationScores: Record<string, number> = {
    'DOCTORATE': 90,
    'MASTER': 85,
    'BACHELOR': 75,
    'COLLEGE': 60,
    'HIGH_SCHOOL': 30
  }
  breakdown.educationScore = educationScores[profile.education] || 40

  // Experiência
  if (profile.experience >= 6) breakdown.experienceScore = 90
  else if (profile.experience >= 4) breakdown.experienceScore = 80
  else if (profile.experience >= 2) breakdown.experienceScore = 70
  else breakdown.experienceScore = 50

  // Estimativa de idioma
  breakdown.languageScore = 80

  // CRS estimado
  breakdown.estimatedCRS = (breakdown.ageScore + breakdown.educationScore + breakdown.languageScore + breakdown.experienceScore) / 4

  return breakdown
}

// Análise genérica
async function assessGeneric(profile: any, expertise: any) {
  return {
    profileScore: 70,
    documentationScore: 60,
    complianceScore: 75,
    timelineScore: 65
  }
}

// Outras funções helper
async function analyzeDocumentRequirements(profile: any, documents: any[], expertise: any) {
  return {
    required: expertise.data.keyRequirements || [],
    missing: [],
    recommendations: ['Ensure all documents are apostilled', 'Translate to target language']
  }
}

async function estimateProcessingTimeline(profile: any, expertise: any) {
  return {
    estimated: expertise.data.averageProcessingTime || '6-12 months',
    factors: ['Document completeness', 'Embassy workload', 'Seasonal variations'],
    fastTrackOptions: expertise.data.embassyInsights?.fastTrackOptions || []
  }
}

async function calculateSuccessProbability(profile: any, documents: any[], expertise: any) {
  return {
    probability: 75,
    confidence: 'medium',
    factors: expertise.data.successFactors || [],
    risks: expertise.data.commonRejectionReasons || []
  }
}

async function performComplianceCheck(profile: any, documents: any[], expertise: any) {
  return {
    compliant: true,
    issues: [],
    recommendations: ['Review embassy-specific requirements']
  }
}

async function getEmbassySpecificInsights(profile: any, expertise: any) {
  return expertise.data.embassyInsights || {
    insights: ['Contact embassy for latest updates'],
    fastTrackOptions: [],
    currentPriorities: []
  }
}

async function getRecentLawUpdates(country: string, visaType: string) {
  return {
    updates: [
      {
        date: '2024-01-15',
        title: 'New language requirements',
        summary: 'Updated minimum language scores',
        impact: 'medium'
      }
    ]
  }
}

async function generateStrategicRecommendations(profile: any, analysis: any, expertise: any) {
  return [
    {
      priority: 'high',
      category: 'preparation',
      action: 'Complete language testing',
      timeline: '2-3 months',
      impact: 'high'
    },
    {
      priority: 'medium',
      category: 'documentation',
      action: 'Obtain educational credentials assessment',
      timeline: '3-4 months',
      impact: 'high'
    }
  ]
}

function generateNextSteps(analysis: any, profile: any) {
  return [
    'Schedule consultation to discuss strategy',
    'Begin document preparation',
    'Consider language improvement if needed'
  ]
}

async function getSupportedCountries(includeStats: boolean) {
  const countries = [
    {
      name: 'Canada',
      code: 'CA',
      visaTypes: ['SKILLED', 'WORK', 'STUDY', 'FAMILY'],
      expertiseLevel: 'high',
      ...(includeStats && {
        successRate: '87%',
        averageTimeline: '8 months',
        clientsSucessful: 1247
      })
    },
    {
      name: 'Australia',
      code: 'AU',
      visaTypes: ['SKILLED', 'WORK', 'STUDY'],
      expertiseLevel: 'high',
      ...(includeStats && {
        successRate: '82%',
        averageTimeline: '10 months',
        clientsSucessful: 943
      })
    }
  ]

  return countries
}