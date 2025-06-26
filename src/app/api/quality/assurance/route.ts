import { NextRequest, NextResponse } from 'next/server',import { prisma } from '@/lib/prisma',import { z } from 'zod'

// Schema para avaliação de qualidade,const qualityAssessmentSchema = z.object({,  clientId: z.string(),  assessmentType: z.enum([,    'document_review',    'application_completeness',    'compliance_check',    'submission_readiness',    'full_audit'
  ]),  scope: z.object({,    includeDocuments: z.boolean().default(true),    includeProfile: z.boolean().default(true),    includeStrategy: z.boolean().default(true),    includeCompliance: z.boolean().default(true)
  }).optional(),  criteria: z.object({,    documentQuality: z.number().min(0).max(100).default(80),    completenessThreshold: z.number().min(0).max(100).default(90),    complianceLevel: z.enum(['basic', 'standard', 'strict']).default('standard')
  }).optional()
})

// POST /api/quality/assurance - Realizar avaliação de qualidade,export async function POST(request: NextRequest) {,  try {,    const body = await request.json(),    const validatedData = qualityAssessmentSchema.parse(body)

    // Buscar dados do cliente,    const client = await prisma.client.findUnique({,      where: { id: validatedData.clientId },      include: {,        documents: {,          where: { status: { in: ['UPLOADED', 'PROCESSED', 'VERIFIED'] } }
        },        consultations: {,          orderBy: { createdAt: 'desc' },          take: 5
        },        interactions: {,          orderBy: { createdAt: 'desc' },          take: 20
        }
      }
    }),
    if (!client) {,      return NextResponse.json(,        { status: 404 }
      )
    }

    // Realizar avaliação de qualidade,    const qualityAssessment = await performQualityAssessment(,      client,      validatedData.assessmentType,      validatedData.scope,      validatedData.criteria
    )

    // Gerar relatório detalhado,    const detailedReport = await generateQualityReport(,      qualityAssessment,      client,      validatedData.assessmentType
    )

    // Criar checklist de ações,    const actionChecklist = generateActionChecklist(,      qualityAssessment,      validatedData.assessmentType
    )

    // Calcular score de prontidão,    const readinessScore = calculateReadinessScore(qualityAssessment)

    // Salvar avaliação,    await prisma.automationLog.create({,      data: {,        type: 'QUALITY_ASSESSMENT',        action: `quality_${validatedData.assessmentType}`,        clientId: validatedData.clientId,        details: {,          timestamp: new Date().toISOString(),          action: 'automated_action'
        },        success: true
      }
    }),
    return NextResponse.json({,      data: {,        assessment: qualityAssessment,        report: detailedReport,        checklist: actionChecklist,        readinessScore: readinessScore,        recommendations: prioritizeRecommendations(qualityAssessment.recommendations),        timeline: generateQualityTimeline(qualityAssessment)
      }
    })

  } catch (error) {,    if (error instanceof z.ZodError) {,      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro na avaliação de qualidade:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// GET /api/quality/assurance/history - Histórico de avaliações,export async function GET(request: NextRequest) {,  try {,    const { searchParams } = new URL(request.url),    const clientId = searchParams.get('clientId'),    const assessmentType = searchParams.get('assessmentType'),    const period = parseInt(searchParams.get('period') || '90'),
    if (!clientId) {,      return NextResponse.json(,      { error: 'Dados inválidos' },      { status: 400 }
    )
    },
    const startDate = new Date(),    startDate.setDate(startDate.getDate() - period),
    const whereClause: any = {,      clientId: clientId,      type: 'QUALITY_ASSESSMENT',      createdAt: { gte: startDate }
    },
    if (assessmentType) {,      whereClause.action = `quality_${assessmentType}`
    },
    const assessments = await prisma.automationLog.findMany({,      where: whereClause,      orderBy: { createdAt: 'desc' },      take: 20
    })

    // Analisar tendências,    const trends = analyzeQualityTrends(assessments),
    return NextResponse.json({,      data: {,        assessments: assessments.map(a => ({,          id: a.id,          type: a.action?.replace('quality_', ''),          overallScore: a.details?.overallScore || 0,          readinessLevel: a.details?.readinessLevel,          criticalIssues: a.details?.criticalIssues || 0,          createdAt: a.createdAt
        })),        trends: trends,        summary: {,          totalAssessments: assessments.length,          averageScore: assessments.reduce((sum, a) => sum + (a.details?.overallScore || 0), 0) / assessments.length || 0,          latestReadinessLevel: assessments[0]?.details?.readinessLevel || 'unknown'
        }
      }
    })

  } catch (error) {,    console.error('Erro ao buscar histórico de qualidade:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// Realizar avaliação de qualidade,async function performQualityAssessment(client: any, assessmentType: string, scope: any, criteria: any) {,  const assessment = {,    overallScore: 0,    readinessLevel: 'not_ready' as 'ready' | 'almost_ready' | 'needs_work' | 'not_ready',    breakdown: {,      documents: { score: 0, weight: 0.4 },      profile: { score: 0, weight: 0.2 },      compliance: { score: 0, weight: 0.3 },      strategy: { score: 0, weight: 0.1 }
    },    issues: [] as any[],    strengths: [] as any[]
    recommendations: [] as any[],    metrics: {} as any
  }

  // Avaliar documentos,  if (scope?.includeDocuments !== false) {,    const documentAssessment = await assessDocumentQuality(client.documents, criteria),    assessment.breakdown.documents.score = documentAssessment.score,    assessment.issues.push(...documentAssessment.issues),    assessment.strengths.push(...documentAssessment.strengths),    assessment.recommendations.push(...documentAssessment.recommendations),    assessment.metrics.documents = documentAssessment.metrics
  }

  // Avaliar perfil do cliente,  if (scope?.includeProfile !== false) {,    const profileAssessment = assessClientProfile(client),    assessment.breakdown.profile.score = profileAssessment.score,    assessment.issues.push(...profileAssessment.issues),    assessment.strengths.push(...profileAssessment.strengths),    assessment.recommendations.push(...profileAssessment.recommendations),    assessment.metrics.profile = profileAssessment.metrics
  }

  // Avaliar compliance,  if (scope?.includeCompliance !== false) {,    const complianceAssessment = await assessCompliance(client, criteria),    assessment.breakdown.compliance.score = complianceAssessment.score,    assessment.issues.push(...complianceAssessment.issues),    assessment.strengths.push(...complianceAssessment.strengths),    assessment.recommendations.push(...complianceAssessment.recommendations),    assessment.metrics.compliance = complianceAssessment.metrics
  }

  // Avaliar estratégia,  if (scope?.includeStrategy !== false) {,    const strategyAssessment = assessApplicationStrategy(client),    assessment.breakdown.strategy.score = strategyAssessment.score,    assessment.issues.push(...strategyAssessment.issues),    assessment.strengths.push(...strategyAssessment.strengths),    assessment.recommendations.push(...strategyAssessment.recommendations),    assessment.metrics.strategy = strategyAssessment.metrics
  }

  // Calcular score geral,  assessment.overallScore = Object.values(assessment.breakdown).reduce(
    (sum, category) => sum + (category.score * category.weight), 0
  )

  // Determinar nível de prontidão,  assessment.readinessLevel = determineReadinessLevel(,    assessment.overallScore,    assessment.issues
  ),
  return assessment
}

// Avaliar qualidade dos documentos,async function assessDocumentQuality(documents: any[], criteria: any) {,  const assessment = {,    score: 0,    issues: [] as any[]
    strengths: [] as any[],    recommendations: [] as any[]
    metrics: {,      totalDocuments: documents.length,      processedDocuments: 0,      averageConfidence: 0,      averageQuality: 0,      missingDocuments: [] as string[]
      expiredDocuments: [] as any[],      lowQualityDocuments: [] as any[]
    }
  }

  // Documentos obrigatórios por tipo de aplicação,  const requiredDocuments = [,    'passport', 'identity_card', 'birth_certificate', ,    'diploma', 'employment_letter', 'bank_statement'
  ]

  // Verificar documentos obrigatórios,  const documentTypes = documents.map(d => d.type.toLowerCase()),  const missingDocs = requiredDocuments.filter(req => 
    !documentTypes.some(type => type.includes(req))
  ),  assessment.metrics.missingDocuments = missingDocs

  // Avaliar documentos processados,  const processedDocs = documents.filter(d => d.status === 'PROCESSED' && d.ocrData),  assessment.metrics.processedDocuments = processedDocs.length,
  if (processedDocs.length > 0) {
    // Calcular métricas de qualidade,    const confidences = processedDocs.map(d => d.confidence || 0),    const qualities = processedDocs.map(d => d.ocrData?.documentAnalysis?.quality?.overallScore || 0),    
    assessment.metrics.averageConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length,    assessment.metrics.averageQuality = qualities.reduce((sum, q) => sum + q, 0) / qualities.length

    // Identificar documentos de baixa qualidade,    const lowQualityThreshold = criteria?.documentQuality || 70,    assessment.metrics.lowQualityDocuments = processedDocs.filter(d => 
      (d.ocrData?.documentAnalysis?.quality?.overallScore || 0) < lowQualityThreshold
    )

    // Verificar documentos expirados ou próximos do vencimento,    const now = new Date(),    const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000),    
    assessment.metrics.expiredDocuments = documents.filter(d => {,      if (!d.expiryDate) return false,      const expiryDate = new Date(d.expiryDate),      return expiryDate < sixMonthsFromNow
    })
  }

  // Calcular score de documentos,  let documentScore = 0
  
  // Score por completude (40%),  const completenessScore = Math.max(0, 100 - (missingDocs.length * 20)),  documentScore += completenessScore * 0.4
  
  // Score por qualidade (30%),  const qualityScore = assessment.metrics.averageQuality || 0,  documentScore += qualityScore * 0.3
  
  // Score por status processamento (20%),  const processingScore = documents.length > 0 ? 
    (assessment.metrics.processedDocuments / documents.length) * 100 : 0,  documentScore += processingScore * 0.2
  
  // Score por validade (10%),  const validityScore = documents.length > 0 ? ,    Math.max(0, 100 - (assessment.metrics.expiredDocuments.length * 25)) : 100,  documentScore += validityScore * 0.1,  
  assessment.score = Math.min(100, documentScore)

  // Gerar issues e recomendações,  if (missingDocs.length > 0) {,    assessment.issues.push({,      type: 'missing_documents',      severity: 'critical',      message: `${missingDocs.length} required documents missing`,      details: missingDocs
    }),    assessment.recommendations.push({,      priority: 'high',      category: 'documents',      action: 'Provide missing required documents',      details: `Missing: ${missingDocs.join(', ')}`
    })
  },
  if (assessment.metrics.lowQualityDocuments.length > 0) {,    assessment.issues.push({,      type: 'low_quality_documents',      severity: 'medium',      message: `${assessment.metrics.lowQualityDocuments.length} documents below quality threshold`,      details: assessment.metrics.lowQualityDocuments.map(d => d.fileName)
    }),    assessment.recommendations.push({,      priority: 'medium',      category: 'quality',      action: 'Improve document quality',      details: 'Rescan documents with higher resolution'
    })
  },
  if (assessment.metrics.expiredDocuments.length > 0) {,    assessment.issues.push({,      type: 'expiring_documents',      severity: 'high',      message: `${assessment.metrics.expiredDocuments.length} documents expired or expiring soon`,      details: assessment.metrics.expiredDocuments.map(d => ({ name: d.fileName, expiry: d.expiryDate }))
    }),    assessment.recommendations.push({,      priority: 'high',      category: 'validity',      action: 'Renew expiring documents',      details: 'Update documents before submission'
    })
  }

  // Identificar pontos fortes,  if (assessment.metrics.averageConfidence > 85) {,    assessment.strengths.push({,      type: 'high_ocr_confidence',      message: 'Documents have high OCR extraction confidence'
    })
  },
  if (assessment.metrics.averageQuality > 85) {,    assessment.strengths.push({,      type: 'high_document_quality',      message: 'Documents meet high quality standards'
    })
  },
  return assessment
}

// Avaliar perfil do cliente,function assessClientProfile(client: any) {,  const assessment = {,    score: 0,    issues: [] as any[]
    strengths: [] as any[],    recommendations: [] as any[]
    metrics: {,      completenessScore: 0,      accuracyScore: 0,      consistencyScore: 0,      missingFields: [] as string[],      inconsistentFields: [] as string[]
    }
  }

  // Campos obrigatórios,  const requiredFields = [,    'name', 'email', 'phone', 'targetCountry', 'visaType',    'education', 'experience', 'maritalStatus'
  ]

  // Verificar completude,  const missingFields = requiredFields.filter(field => !client[field] || client[field] === ''),  assessment.metrics.missingFields = missingFields,  assessment.metrics.completenessScore = Math.max(0, 100 - (missingFields.length * 12.5))

  // Verificar consistência (exemplo simplificado),  const inconsistentFields = [],  if (client.email && !client.email.includes('@')) {,    inconsistentFields.push('email')
  },  if (client.phone && client.phone.length < 10) {,    inconsistentFields.push('phone')
  },  assessment.metrics.inconsistentFields = inconsistentFields,  assessment.metrics.consistencyScore = Math.max(0, 100 - (inconsistentFields.length * 20))

  // Accuracy score (simplificado),  assessment.metrics.accuracyScore = 85 // Baseado em validações

  // Score geral do perfil,  assessment.score = (,    assessment.metrics.completenessScore * 0.5 +,    assessment.metrics.accuracyScore * 0.3 +,    assessment.metrics.consistencyScore * 0.2
  )

  // Gerar issues e recomendações,  if (missingFields.length > 0) {,    assessment.issues.push({,      type: 'incomplete_profile',      severity: 'medium',      message: `${missingFields.length} required profile fields missing`,      details: missingFields
    }),    assessment.recommendations.push({,      priority: 'medium',      category: 'profile',      action: 'Complete profile information',      details: `Missing: ${missingFields.join(', ')}`
    })
  },
  if (inconsistentFields.length > 0) {,    assessment.issues.push({,      type: 'profile_inconsistencies',      severity: 'low',      message: `${inconsistentFields.length} profile fields need correction`,      details: inconsistentFields
    }),    assessment.recommendations.push({,      priority: 'low',      category: 'profile',      action: 'Correct profile inconsistencies',      details: `Review: ${inconsistentFields.join(', ')}`
    })
  }

  // Pontos fortes,  if (assessment.metrics.completenessScore > 90) {,    assessment.strengths.push({,      type: 'complete_profile',      message: 'Profile is comprehensive and complete'
    })
  },
  return assessment
}

// Avaliar compliance,async function assessCompliance(client: any, criteria: any) {,  const assessment = {,    score: 0,    issues: [] as any[]
    strengths: [] as any[],    recommendations: [] as any[]
    metrics: {,      documentCompliance: 0,      timelineCompliance: 0,      requirementCompliance: 0,      riskLevel: 'low' as 'low' | 'medium' | 'high'
    }
  }

  // Avaliar compliance de documentos (simplificado),  const documentsWithValidation = client.documents.filter((d: any) => ,    d.ocrData?.validationResults
  ),  
  if (documentsWithValidation.length > 0) {,    const validationScores = documentsWithValidation.map((d: any) => {,      const validResults = d.ocrData.validationResults.filter((v: any) => v.isValid).length,      const totalResults = d.ocrData.validationResults.length,      return totalResults > 0 ? (validResults / totalResults) * 100 : 100
    }),    
    assessment.metrics.documentCompliance = validationScores.reduce((sum, score) => sum + score, 0) / validationScores.length
  } else {,    assessment.metrics.documentCompliance = 50 // Penalizar falta de validação
  }

  // Avaliar timeline compliance,  assessment.metrics.timelineCompliance = 80 // Simplificado

  // Avaliar requirement compliance,  assessment.metrics.requirementCompliance = 75 // Simplificado

  // Score geral de compliance,  assessment.score = (,    assessment.metrics.documentCompliance * 0.5 +,    assessment.metrics.timelineCompliance * 0.3 +,    assessment.metrics.requirementCompliance * 0.2
  )

  // Determinar nível de risco,  if (assessment.score < 60) assessment.metrics.riskLevel = 'high',  else if (assessment.score < 80) assessment.metrics.riskLevel = 'medium',  else assessment.metrics.riskLevel = 'low',
  return assessment
}

// Avaliar estratégia de aplicação,function assessApplicationStrategy(client: any) {,  const assessment = {,    score: 0,    issues: [] as any[]
    strengths: [] as any[],    recommendations: [] as any[]
    metrics: {,      strategyAlignment: 0,      timelineRealism: 0,      preparationLevel: 0
    }
  }

  // Simplificado para demonstração,  assessment.score = 75,  assessment.metrics.strategyAlignment = 80,  assessment.metrics.timelineRealism = 70,  assessment.metrics.preparationLevel = 75,
  return assessment
}

// Determinar nível de prontidão,function determineReadinessLevel(overallScore: number, issues: any[]) {,  const criticalIssues = issues.filter(i => i.severity === 'critical').length,  const highSeverityIssues = issues.filter(i => i.severity === 'high').length,
  if (criticalIssues > 0) return 'not_ready',  if (overallScore >= 90 && highSeverityIssues === 0) return 'ready',  if (overallScore >= 75 && highSeverityIssues <= 1) return 'almost_ready',  return 'needs_work'
}

// Gerar relatório de qualidade,async function generateQualityReport(assessment: any, client: any, assessmentType: string) {,  return {,    summary: {,      overallScore: assessment.overallScore,      readinessLevel: assessment.readinessLevel,      totalIssues: assessment.issues.length,      criticalIssues: assessment.issues.filter((i: any) => i.severity === 'critical').length,      recommendations: assessment.recommendations.length
    },    breakdown: assessment.breakdown,    issues: groupIssuesBySeverity(assessment.issues),    strengths: assessment.strengths,    metrics: assessment.metrics,    timeline: generateQualityTimeline(assessment),    nextSteps: generateQualityNextSteps(assessment, assessmentType)
  }
}

// Agrupar issues por severidade,function groupIssuesBySeverity(issues: any[]) {,  return {,    critical: issues.filter(i => i.severity === 'critical'),    high: issues.filter(i => i.severity === 'high'),    medium: issues.filter(i => i.severity === 'medium'),    low: issues.filter(i => i.severity === 'low')
  }
}

// Outras funções auxiliares,function generateActionChecklist(assessment: any, assessmentType: string) {,  const checklist = []
  
  // Ações críticas,  const criticalIssues = assessment.issues.filter((i: any) => i.severity === 'critical'),  criticalIssues.forEach((issue: any) => {,    checklist.push({,      priority: 'critical',      action: `Resolve: ${issue.message}`,      category: issue.type,      completed: false,      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
    })
  })
  
  // Ações de alta prioridade,  const highPriorityRecs = assessment.recommendations.filter((r: any) => r.priority === 'high'),  highPriorityRecs.forEach((rec: any) => {,    checklist.push({,      priority: 'high',      action: rec.action,      category: rec.category,      completed: false,      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    })
  }),  
  return checklist
},
function calculateReadinessScore(assessment: any) {,  const readinessLevels = {,    'ready': 95,    'almost_ready': 80,    'needs_work': 60,    'not_ready': 30
  },  
  return readinessLevels[assessment.readinessLevel as keyof typeof readinessLevels] || 0
},
function prioritizeRecommendations(recommendations: any[]) {,  const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 },  return recommendations.sort((a, b) => 
    (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
    (priorityOrder[b.priority as keyof typeof priorityOrder] || 4)
  )
},
function generateQualityTimeline(assessment: any) {,  const timeline = []
  
  // Timeline baseado nos issues,  const criticalIssues = assessment.issues.filter((i: any) => i.severity === 'critical').length,  const highIssues = assessment.issues.filter((i: any) => i.severity === 'high').length,  
  if (criticalIssues > 0) {,    timeline.push({,      phase: 'Critical Issues Resolution',      duration: '3-5 days',      description: 'Address all critical blocking issues'
    })
  },  
  if (highIssues > 0) {,    timeline.push({,      phase: 'High Priority Improvements',      duration: '1-2 weeks',      description: 'Implement high priority recommendations'
    })
  },  
  timeline.push({,    phase: 'Final Review & Submission',    duration: '2-3 days',    description: 'Final quality check and submission preparation'
  }),  
  return timeline
},
function generateQualityNextSteps(assessment: any, assessmentType: string) {,  const steps = []
  ,  if (assessment.readinessLevel === 'ready') {,    steps.push('✅ Quality assessment passed'),    steps.push('📋 Schedule final review session'),    steps.push('🚀 Proceed with submission preparation')
  } else if (assessment.readinessLevel === 'almost_ready') {,    steps.push('⚡ Address remaining high-priority issues'),    steps.push('🔍 Perform targeted quality improvements'),    steps.push('🔄 Schedule follow-up assessment')
  } else if (assessment.readinessLevel === 'needs_work') {,    steps.push('🔧 Significant improvements needed'),    steps.push('📝 Create detailed improvement plan'),    steps.push('📞 Schedule consultation for guidance')
  } else {,    steps.push('🚨 Critical issues must be resolved'),    steps.push('🛑 Submission not recommended at this time'),    steps.push('🤝 Urgent consultation required')
  },  
  return steps
},
function analyzeQualityTrends(assessments: any[]) {,  if (assessments.length < 2) {,    return {,      trend: 'insufficient_data',      scoreChange: 0,      improvement: false
    }
  },  
  const scores = assessments.map(a => a.details?.overallScore || 0),  const latestScore = scores[0]
  const previousScore = scores[1]
  const scoreChange = latestScore - previousScore,  
  return {,    trend: scoreChange > 5 ? 'improving' : scoreChange < -5 ? 'declining' : 'stable',    scoreChange: scoreChange,    improvement: scoreChange > 0,    averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
  }
}