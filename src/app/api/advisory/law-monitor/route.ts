import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para monitoramento de mudanças legais
const lawMonitorSchema = z.object({
  country: z.string(),
  visaType: z.string().optional(),
  alertType: z.enum(['immediate', 'daily', 'weekly']),
  clientId: z.string().optional(),
  keywords: z.array(z.string()).optional()
})

// POST /api/advisory/law-monitor - Configurar monitoramento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = lawMonitorSchema.parse(body)

    // Verificar mudanças recentes
    const recentChanges = await checkRecentLawChanges(
      validatedData.country,
      validatedData.visaType
    )

    // Configurar alertas se necessário
    if (validatedData.clientId) {
      await setupLawChangeAlerts(validatedData)
    }

    return NextResponse.json({
      success: true,
      data: {
        country: validatedData.country,
        visaType: validatedData.visaType,
        recentChanges: recentChanges,
        monitoring: {
          active: true,
          alertType: validatedData.alertType,
          lastChecked: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro no monitoramento legal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/advisory/law-monitor/changes - Obter mudanças recentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const days = parseInt(searchParams.get('days') || '30')
    const visaType = searchParams.get('visaType')

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'País é obrigatório' },
        { status: 400 }
      )
    }

    const changes = await getLawChanges(country, days, visaType)
    const analysis = await analyzeLawChanges(changes, country, visaType)

    return NextResponse.json({
      success: true,
      data: {
        country: country,
        visaType: visaType,
        period: `${days} dias`,
        changes: changes,
        analysis: analysis,
        recommendations: generateLawChangeRecommendations(changes, analysis)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar mudanças legais:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Verificar mudanças recentes nas leis
async function checkRecentLawChanges(country: string, visaType?: string) {
  // Simular integração com fontes oficiais
  const mockChanges = await getLawChanges(country, 30, visaType)
  
  // Em produção, integrar com:
  // - APIs governamentais
  // - RSS feeds de departamentos de imigração
  // - Web scraping de sites oficiais
  // - Serviços de monitoramento legal
  
  return mockChanges
}

// Obter mudanças nas leis por país
async function getLawChanges(country: string, days: number, visaType?: string) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Base de dados simulada de mudanças legais
  const lawChangesDatabase: Record<string, any[]> = {
    'Canada': [
      {
        id: 'ca-2024-001',
        date: '2024-01-15',
        title: 'Aumento do salário mínimo para LMIA',
        description: 'Novo salário mínimo para aplicações LMIA aumentou para CAD $27/hora em algumas províncias',
        visaTypes: ['WORK', 'SKILLED'],
        impact: 'high',
        source: 'IRCC',
        category: 'requirements',
        affectedPrograms: ['LMIA', 'Temporary Foreign Worker Program'],
        details: {
          previousRequirement: 'CAD $25/hora',
          newRequirement: 'CAD $27/hora',
          effectiveDate: '2024-02-01',
          provinces: ['Ontario', 'British Columbia', 'Alberta']
        }
      },
      {
        id: 'ca-2024-002', 
        date: '2024-01-10',
        title: 'Novos critérios para Express Entry',
        description: 'IRCC introduziu sorteios baseados em categoria para certas ocupações',
        visaTypes: ['SKILLED'],
        impact: 'medium',
        source: 'IRCC',
        category: 'selection_criteria',
        affectedPrograms: ['Federal Skilled Worker', 'Canadian Experience Class'],
        details: {
          newCategories: ['Healthcare', 'STEM', 'French language', 'Trades'],
          minimumCRS: 'Varia por categoria',
          firstDraw: '2024-02-15'
        }
      }
    ],
    
    'Australia': [
      {
        id: 'au-2024-001',
        date: '2024-01-20',
        title: 'Aumento do English requirement',
        description: 'Competent English (6.0 IELTS) agora é mínimo para todos os vistos skilled',
        visaTypes: ['SKILLED'],
        impact: 'high',
        source: 'Department of Home Affairs',
        category: 'language_requirements',
        details: {
          previousRequirement: 'Functional English (5.0 IELTS)',
          newRequirement: 'Competent English (6.0 IELTS)',
          effectiveDate: '2024-03-01'
        }
      }
    ],
    
    'Portugal': [
      {
        id: 'pt-2024-001',
        date: '2024-01-12',
        title: 'Mudanças no Golden Visa',
        description: 'Investimento mínimo em fundos aumentou para €500,000',
        visaTypes: ['INVESTMENT'],
        impact: 'high',
        source: 'SEF',
        category: 'investment_amounts',
        details: {
          previousAmount: '€350,000',
          newAmount: '€500,000',
          applicableInvestments: ['Investment funds', 'Research activities']
        }
      }
    ],
    
    'Germany': [
      {
        id: 'de-2024-001',
        date: '2024-01-18',
        title: 'Skilled Immigration Act atualizado',
        description: 'Novas facilidades para profissionais de IT sem degree universitário',
        visaTypes: ['SKILLED', 'WORK'],
        impact: 'medium',
        source: 'BAMF',
        category: 'education_requirements',
        details: {
          newProvision: 'IT professionals with 3+ years experience can qualify without university degree',
          requiredExperience: '3 years minimum',
          salaryThreshold: '€40,000 annually'
        }
      }
    ],
    
    'United States': [
      {
        id: 'us-2024-001',
        date: '2024-01-08',
        title: 'H-1B lottery system modificado',
        description: 'Novo sistema de beneficiários únicos para reduzir múltiplas aplicações',
        visaTypes: ['WORK'],
        impact: 'high',
        source: 'USCIS',
        category: 'application_process',
        details: {
          change: 'One registration per person regardless of multiple petitions',
          effectiveDate: '2024 H-1B season',
          impact: 'Reduces advantage of multiple employer petitions'
        }
      }
    ]
  }

  let changes = lawChangesDatabase[country] || []
  
  // Filtrar por período
  changes = changes.filter(change => {
    const changeDate = new Date(change.date)
    return changeDate >= startDate
  })
  
  // Filtrar por tipo de visto se especificado
  if (visaType) {
    changes = changes.filter(change => 
      change.visaTypes.includes(visaType)
    )
  }
  
  return changes
}

// Analisar impacto das mudanças legais
async function analyzeLawChanges(changes: any[], country: string, visaType?: string) {
  const analysis = {
    totalChanges: changes.length,
    impactLevel: 'low' as 'low' | 'medium' | 'high',
    categories: {} as Record<string, number>,
    recommendations: [] as string[],
    timeline: {
      immediate: 0,
      upcoming: 0,
      future: 0
    },
    affectedPrograms: new Set<string>()
  }

  // Analisar cada mudança
  changes.forEach(change => {
    // Contar por categoria
    analysis.categories[change.category] = (analysis.categories[change.category] || 0) + 1
    
    // Identificar programas afetados
    if (change.affectedPrograms) {
      change.affectedPrograms.forEach((program: string) => {
        analysis.affectedPrograms.add(program)
      })
    }
    
    // Analisar timeline
    const effectiveDate = change.details?.effectiveDate
    if (effectiveDate) {
      const daysUntilEffective = Math.ceil(
        (new Date(effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysUntilEffective <= 0) analysis.timeline.immediate++
      else if (daysUntilEffective <= 90) analysis.timeline.upcoming++
      else analysis.timeline.future++
    }
  })

  // Determinar nível de impacto geral
  const highImpactChanges = changes.filter(c => c.impact === 'high').length
  const mediumImpactChanges = changes.filter(c => c.impact === 'medium').length
  
  if (highImpactChanges > 0) analysis.impactLevel = 'high'
  else if (mediumImpactChanges > 0) analysis.impactLevel = 'medium'
  else analysis.impactLevel = 'low'

  // Gerar recomendações baseadas na análise
  if (analysis.impactLevel === 'high') {
    analysis.recommendations.push('Revisar estratégia de aplicação imediatamente')
    analysis.recommendations.push('Considerar acelerar timeline de aplicação')
  }
  
  if (analysis.timeline.immediate > 0) {
    analysis.recommendations.push('Verificar compliance com mudanças já em vigor')
  }
  
  if (analysis.timeline.upcoming > 0) {
    analysis.recommendations.push('Preparar-se para mudanças que entram em vigor nos próximos 90 dias')
  }

  return analysis
}

// Configurar alertas de mudanças legais
async function setupLawChangeAlerts(data: any) {
  // Em produção, configurar sistema de alertas
  // - Email notifications
  // - SMS alerts
  // - In-app notifications
  // - Webhook integrations
  
  await prisma.automationLog.create({
    data: {
      type: 'LAW_CHANGE_ALERT_SETUP',
      action: 'setup_monitoring',
      details: {
        country: data.country,
        visaType: data.visaType,
        alertType: data.alertType,
        keywords: data.keywords
      },
      success: true,
      clientId: data.clientId
    }
  })
  
  return { success: true }
}

// Gerar recomendações baseadas em mudanças legais
function generateLawChangeRecommendations(changes: any[], analysis: any) {
  const recommendations = []
  
  // Recomendações específicas por tipo de mudança
  const requirementChanges = changes.filter(c => c.category === 'requirements')
  if (requirementChanges.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'compliance',
      action: 'Review new requirements and ensure compliance',
      timeline: 'Immediate',
      details: 'Requirements have changed - verify your application meets new criteria'
    })
  }
  
  const investmentChanges = changes.filter(c => c.category === 'investment_amounts')
  if (investmentChanges.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'financial',
      action: 'Review investment strategy',
      timeline: 'Before application',
      details: 'Investment amounts have changed - adjust financial planning accordingly'
    })
  }
  
  const languageChanges = changes.filter(c => c.category === 'language_requirements')
  if (languageChanges.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'preparation',
      action: 'Update language testing strategy',
      timeline: '2-3 months',
      details: 'Language requirements have been updated - may need to retake tests'
    })
  }
  
  // Recomendações gerais baseadas no nível de impacto
  if (analysis.impactLevel === 'high') {
    recommendations.push({
      priority: 'urgent',
      category: 'strategy',
      action: 'Schedule emergency consultation',
      timeline: 'Within 48 hours',
      details: 'Significant changes detected - expert review recommended'
    })
  }
  
  return recommendations
}