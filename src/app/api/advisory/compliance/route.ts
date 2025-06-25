import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para verificação de compliance
const complianceCheckSchema = z.object({
  clientId: z.string(),
  country: z.string(),
  visaType: z.string(),
  documents: z.array(z.object({
    id: z.string(),
    type: z.string(),
    fileName: z.string(),
    status: z.string(),
    uploadDate: z.string(),
    expiryDate: z.string().optional()
    issuingCountry: z.string().optional(),
    metadata: z.record(z.any()).optional()
  }))
  checkType: z.enum([
    'pre_submission',
    'embassy_compliance',
    'document_validity',
    'completeness_check',
    'authenticity_verification'
  ])
})

// POST /api/advisory/compliance - Verificar compliance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = complianceCheckSchema.parse(body)

    // Obter requisitos específicos do país/visto
    const requirements = await getComplianceRequirements(
      validatedData.country,
      validatedData.visaType
    )

    // Realizar verificação de compliance
    const complianceResult = await performComplianceCheck(
      validatedData.documents,
      requirements,
      validatedData.checkType
    )

    // Gerar relatório detalhado
    const detailedReport = await generateComplianceReport(
      complianceResult,
      requirements,
      validatedData.country,
      validatedData.visaType
    )

    // Salvar resultado da verificação
    await prisma.automationLog.create({
      data: {,
        type: 'COMPLIANCE_CHECK',
        action: `compliance_${validatedData.checkType}`,
        clientId: validatedData.clientId,
        success: true,
        details: {,
          checkType: validatedData.checkType,
          complianceScore: complianceResult.overallScore,
          complianceLevel: complianceResult.complianceLevel,
          issuesCount: complianceResult.issues.length,
          passedCount: complianceResult.passed.length
        }
      }
    })

    return NextResponse.json({
      data: {,
        compliance: complianceResult
        report: detailedReport,
        recommendations: generateComplianceRecommendations(complianceResult),
        nextSteps: generateComplianceNextSteps(complianceResult, validatedData.checkType)
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

    console.error('Erro na verificação de compliance:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/advisory/compliance/requirements - Obter requisitos por país/visto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const visaType = searchParams.get('visaType')
    const detailed = searchParams.get('detailed') === 'true'

    if (!country || !visaType) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    const requirements = await getComplianceRequirements(country, visaType, detailed)

    return NextResponse.json({
      data: {,
        country: country
        visaType: visaType,
        requirements: requirements,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro ao obter requisitos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Obter requisitos de compliance por país/visto
async function getComplianceRequirements(country: string, visaType: string, detailed = false) {
  // Base de dados de requisitos por país/visto
  const requirementsDatabase: Record<string, any> = {
    'Canada': {
      'SKILLED': {
        mandatory: [
          {
            type: 'passport',
            name: 'Passaporte válido',
            validity: '6 months beyond intended stay',
            pages: 'At least 2 blank pages',
            specifications: {,
              format: 'PDF scan',
              resolution: '300 DPI minimum',
              color: 'Color scan required',
              pages: 'All pages including blank ones'
            }
          },
          {
            type: 'language_test',
            name: 'Teste de idioma',
            validity: '2 years',
            acceptedTests: ['IELTS', 'CELPIP', 'TEF', 'TCF'],
            minimumScores: {
              'IELTS': 'CLB 7 (6.0 each band)',
              'CELPIP': 'CLB 7 (7 each skill)',
              'TEF': 'CLB 7 equivalent',
              'TCF': 'CLB 7 equivalent'
            }
          },
          {
            type: 'education_assessment',
            name: 'Avaliação educacional',
            validity: '5 years',
            organizations: ['WES', 'ICAS', 'IQAS', 'CES', 'MCC'],
            requirements: {,
              transcripts: 'Official sealed transcripts',
              diplomas: 'Original or certified copies',
              translation: 'If not in English/French'
            }
          },
          {
            type: 'work_experience',
            name: 'Comprovante de experiência',
            format: 'Reference letters on company letterhead',
            content: [
              'Job title and duties',
              'Employment period',
              'Hours per week',
              'Annual salary',
              'Contact information'
            ]
          },
          {
            type: 'proof_of_funds',
            name: 'Comprovante financeiro',
            amount: 'CAD $13,213 for single applicant',
            format: 'Bank statements (6 months)',
            requirements: [
              'Average balance maintained',
              'No large deposits without explanation',
              'Liquid funds only'
            ]
          }
        ],
        optional: [
          {
            type: 'job_offer',
            name: 'Oferta de emprego',
            points: '50-200 CRS points',
            requirements: ['LMIA or LMIA-exempt', 'NOC A, B, or 0']
          },
          {
            type: 'french_test',
            name: 'Teste de francês',
            points: 'Up to 50 additional points',
            acceptedTests: ['TEF', 'TCF']
          }
        ],
        embassySpecific: {,
          processingTimes: '6-8 months',
          interviewRequired: 'Rarely',
          medicalExam: 'Country-specific',
          biometrics: 'Required'
        }
      }
      'WORK': {
        mandatory: [
          {
            type: 'lmia',
            name: 'LMIA ou LMIA-exempt job offer',
            validity: 'Valid at time of application'
          },
          {
            type: 'employment_contract',
            name: 'Contrato de trabalho',
            requirements: [
              'Signed by both parties',
              'Detailed job description',
              'Salary and benefits',
              'Work location'
            ]
          }
        ]
      }
    }
    
    'Australia': {
      'SKILLED': {
        mandatory: [
          {
            type: 'skills_assessment',
            name: 'Skills Assessment',
            validity: '3 years (varies by occupation)',
            organizations: 'Occupation-specific assessing authority',
            requirements: {,
              qualifications: 'Relevant to nominated occupation',
              experience: 'Closely related work experience',
              documentation: 'Comprehensive evidence package'
            }
          },
          {
            type: 'english_test',
            name: 'English Language Test',
            validity: '3 years',
            acceptedTests: ['IELTS', 'PTE', 'TOEFL', 'OET', 'CAE'],
            minimumScores: {
              'IELTS': 'Competent English (6.0 each band)',
              'PTE': '50 each component',
              'TOEFL': '12 L, 13 R, 21 W, 18 S'
            }
          },
          {
            type: 'age_evidence',
            name: 'Comprovante de idade',
            requirement: 'Under 45 years at time of invitation'
          }
        ]
      }
    }
    
    'Portugal': {
      'INVESTMENT': {
        mandatory: [
          {
            type: 'investment_proof',
            name: 'Comprovante de investimento',
            minimumAmount: '€350,000',
            acceptedInvestments: [
              'Real estate acquisition',
              'Capital transfer',
              'Job creation',
              'Research activities',
              'Investment funds'
            ]
          },
          {
            type: 'criminal_record',
            name: 'Certidão de antecedentes',
            validity: '3 months',
            requirements: [
              'Country of residence',
              'Country of nationality',
              'Any country lived 1+ years (last 5 years)'
            ]
          },
          {
            type: 'health_insurance',
            name: 'Seguro saúde',
            coverage: 'Valid in Portugal',
            minimum: '€30,000 coverage'
          }
        ]
      }
      'WORK': {
        mandatory: [
          {
            type: 'employment_contract',
            name: 'Contrato de trabalho',
            requirements: [
              'Approved by ACT',
              'Minimum wage compliance',
              'Valid for at least 1 year'
            ]
          },
          {
            type: 'accommodation_proof',
            name: 'Comprovante de alojamento',
            options: [
              'Rental contract',
              'Property ownership',
              'Accommodation declaration'
            ]
          }
        ]
      }
    }
  }

  const countryReqs = requirementsDatabase[country]
  if (!countryReqs || !countryReqs[visaType]) {
    return {
      mandatory: [],
      optional: [],
      note: 'Requirements not available - contact specialist',
      lastUpdated: new Date().toISOString()
    }
  }

  return {
    ...countryReqs[visaType]
    lastUpdated: new Date().toISOString(),
    source: 'Official embassy requirements'
  }
}

// Realizar verificação de compliance
async function performComplianceCheck(documents: any[], requirements: any, checkType: string) {
  const result = {
    overallScore: 0,
    complianceLevel: 'non_compliant' as 'compliant' | 'partial' | 'non_compliant',
    issues: [] as any[],
    passed: [] as any[],
    missing: [] as any[],
    expiring: [] as any[],
    recommendations: [] as any[],
    breakdown: {,
      mandatory: { completed: 0, total: 0, score: 0 }
      optional: { completed: 0, total: 0, score: 0 }
      technical: { score: 0, issues: 0 }
    }
  }

  // Verificar documentos obrigatórios
  if (requirements.mandatory) {
    result.breakdown.mandatory.total = requirements.mandatory.length
    
    for (const req of requirements.mandatory) {
      const matchingDocs = documents.filter(doc => 
        doc.type === req.type || 
        doc.type.includes(req.type) ||
        req.type.includes(doc.type)
      )
      
      if (matchingDocs.length === 0) {
        result.missing.push({
          type: req.type,
          name: req.name,
          severity: 'critical',
          description: `Required document missing: ${req.name}`
        })
        result.issues.push({
          type: 'missing_document',
          severity: 'critical',
          document: req.name,
          message: `Missing required document: ${req.name}`
        })
      } else {
        // Verificar cada documento correspondente
        for (const doc of matchingDocs) {
          const docCheck = await checkDocumentCompliance(doc, req)
          
          if (docCheck.compliant) {
            result.passed.push({
              type: doc.type,
              name: req.name,
              status: 'compliant'
            })
            result.breakdown.mandatory.completed++
          } else {
            result.issues.push(...docCheck.issues)
          }
          
          // Verificar validade
          if (doc.expiryDate) {
            const expiryDate = new Date(doc.expiryDate)
            const now = new Date()
            const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
            
            if (expiryDate < now) {
              result.issues.push({
                type: 'expired_document',
                severity: 'critical',
                document: doc.fileName,
                message: `Document expired on ${expiryDate.toLocaleDateString()}`
              })
            } else if (expiryDate < sixMonthsFromNow) {
              result.expiring.push({
                type: doc.type,
                name: doc.fileName,
                expiryDate: doc.expiryDate,
                daysUntilExpiry: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              })
            }
          }
        }
      }
    }
    
    result.breakdown.mandatory.score = (result.breakdown.mandatory.completed / result.breakdown.mandatory.total) * 100
  }

  // Verificar documentos opcionais
  if (requirements.optional) {
    result.breakdown.optional.total = requirements.optional.length
    
    for (const req of requirements.optional) {
      const matchingDocs = documents.filter(doc => doc.type === req.type)
      
      if (matchingDocs.length > 0) {
        result.breakdown.optional.completed++
        result.passed.push({
          type: req.type,
          name: req.name,
          status: 'bonus',
          benefit: req.points || req.benefit
        })
      }
    }
    
    if (result.breakdown.optional.total > 0) {
      result.breakdown.optional.score = (result.breakdown.optional.completed / result.breakdown.optional.total) * 100
    }
  }

  // Calcular score geral
  const mandatoryWeight = 0.8
  const optionalWeight = 0.2
  
  result.overallScore = (
    (result.breakdown.mandatory.score * mandatoryWeight) +
    (result.breakdown.optional.score * optionalWeight)
  )

  // Determinar nível de compliance
  if (result.overallScore >= 90 && result.missing.length === 0) {
    result.complianceLevel = 'compliant'
  } else if (result.overallScore >= 70 && result.issues.filter(i => i.severity === 'critical').length === 0) {
    result.complianceLevel = 'partial'
  } else {
    result.complianceLevel = 'non_compliant'
  }

  return result
}

// Verificar compliance de documento individual
async function checkDocumentCompliance(document: any, requirement: any) {
  const check = {
    compliant: true,
    issues: [] as any[],
    warnings: [] as any[]
  }

  // Verificar especificações técnicas
  if (requirement.specifications) {
    const specs = requirement.specifications
    
    // Verificar formato
    if (specs.format && !document.fileName.toLowerCase().endsWith('.pdf')) {
      check.issues.push({
        type: 'format_issue',
        severity: 'medium',
        document: document.fileName,
        message: `Document should be in ${specs.format} format`
      })
      check.compliant = false
    }
    
    // Verificar resolução (se disponível nos metadados)
    if (specs.resolution && document.metadata?.resolution) {
      const requiredDPI = parseInt(specs.resolution)
      const docDPI = parseInt(document.metadata.resolution)
      
      if (docDPI < requiredDPI) {
        check.issues.push({
          type: 'quality_issue',
          severity: 'medium',
          document: document.fileName,
          message: `Resolution ${docDPI} DPI is below required ${requiredDPI} DPI`
        })
        check.compliant = false
      }
    }
  }

  return check
}

// Gerar relatório detalhado de compliance
async function generateComplianceReport(result: any, requirements: any, country: string, visaType: string) {
  const report = {
    summary: {,
      country: country,
      visaType: visaType,
      overallScore: result.overallScore,
      complianceLevel: result.complianceLevel,
      totalIssues: result.issues.length,
      criticalIssues: result.issues.filter((i: any) => i.severity === 'critical').length,
      readinessLevel: getReadinessLevel(result)
    }
    sections: {,
      mandatory: {
        title: 'Documentos Obrigatórios',
        completed: result.breakdown.mandatory.completed,
        total: result.breakdown.mandatory.total,
        score: result.breakdown.mandatory.score,
        status: result.breakdown.mandatory.score === 100 ? 'complete' : 'incomplete'
      }
      optional: {,
        title: 'Documentos Opcionais',
        completed: result.breakdown.optional.completed,
        total: result.breakdown.optional.total,
        score: result.breakdown.optional.score,
        benefit: 'Additional points/advantages'
      }
      issues: {,
        critical: result.issues.filter((i: any) => i.severity === 'critical'),
        medium: result.issues.filter((i: any) => i.severity === 'medium'),
        low: result.issues.filter((i: any) => i.severity === 'low')
      }
      timeline: {,
        documentsExpiring: result.expiring,
        actionRequired: result.issues.filter((i: any) => i.severity === 'critical').length > 0
      }
    }
    recommendations: generateDetailedRecommendations(result, requirements)
  }

  return report
}

// Determinar nível de prontidão
function getReadinessLevel(result: any) {
  if (result.complianceLevel === 'compliant') return 'ready_to_submit'
  if (result.complianceLevel === 'partial') return 'needs_minor_fixes'
  return 'major_work_required'
}

// Gerar recomendações de compliance
function generateComplianceRecommendations(result: any) {
  const recommendations = []
  
  // Recomendações para documentos faltando
  if (result.missing.length > 0) {
    recommendations.push({
      priority: 'critical',
      category: 'missing_documents',
      action: `Provide ${result.missing.length} missing required documents`,
      timeline: 'Before submission',
      documents: result.missing.map((m: any) => m.name)
    })
  }
  
  // Recomendações para documentos expirando
  if (result.expiring.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'expiring_documents', 
      action: `Renew ${result.expiring.length} documents expiring soon`,
      timeline: 'Within 30 days',
      documents: result.expiring.map((e: any) => `${e.name} (expires ${e.expiryDate})`)
    })
  }
  
  // Recomendações para problemas de qualidade
  const qualityIssues = result.issues.filter((i: any) => i.type === 'quality_issue')
  if (qualityIssues.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'document_quality',
      action: 'Improve document quality (resolution, format)',
      timeline: 'Before submission',
      details: 'Ensure all scans meet embassy requirements'
    })
  }
  
  return recommendations
}

// Gerar recomendações detalhadas
function generateDetailedRecommendations(result: any, requirements: any) {
  const recommendations = {
    immediate: [] as any[],
    shortTerm: [] as any[],
    longTerm: [] as any[],
    optional: [] as any[]
  }
  
  // Ações imediatas para problemas críticos
  const criticalIssues = result.issues.filter((i: any) => i.severity === 'critical')
  criticalIssues.forEach((issue: any) => {
    recommendations.immediate.push({
      action: `Resolve: ${issue.message}`,
      document: issue.document,
      timeline: '1-3 days'
    })
  })
  
  // Ações de curto prazo
  if (result.expiring.length > 0) {
    recommendations.shortTerm.push({
      action: 'Renew expiring documents',
      documents: result.expiring.map((e: any) => e.name),
      timeline: '2-4 weeks'
    })
  }
  
  // Melhorias opcionais
  if (requirements.optional && result.breakdown.optional.completed < result.breakdown.optional.total) {
    recommendations.optional.push({
      action: 'Consider providing optional documents for additional points',
      benefit: 'Improved application strength',
      timeline: 'Before submission'
    })
  }
  
  return recommendations
}

// Gerar próximos passos
function generateComplianceNextSteps(result: any, checkType: string) {
  const steps = []
  
  if (result.complianceLevel === 'compliant') {
    steps.push('✅ Ready for submission')
    steps.push('Schedule final review call')
    steps.push('Prepare submission timeline')
  } else if (result.complianceLevel === 'partial') {
    steps.push('🔧 Address medium-priority issues')
    steps.push('Verify document formats and quality')
    steps.push('Schedule compliance review')
  } else {
    steps.push('🚨 Address critical issues immediately')
    steps.push('Gather missing required documents')
    steps.push('Schedule emergency consultation')
  }
  
  return steps
}