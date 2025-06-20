import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { performOCR, processMultipleDocuments, generateConsolidatedReport } from '@/lib/ocr'
import { z } from 'zod'
import path from 'path'
import { promises as fs } from 'fs'

// Schema para processamento OCR
const ocrRequestSchema = z.object({
  documentId: z.string().optional(),
  clientId: z.string(),
  filePath: z.string(),
  documentType: z.string(),
  language: z.string().default('pt'),
  extractionMode: z.enum(['text', 'structured', 'full']).default('full'),
  validateData: z.boolean().default(true),
  performSecurityChecks: z.boolean().default(true)
})

// Schema para processamento múltiplo
const batchOcrSchema = z.object({
  clientId: z.string(),
  documents: z.array(z.object({
    documentId: z.string().optional(),
    filePath: z.string(),
    documentType: z.string(),
    language: z.string().default('pt')
  })),
  generateReport: z.boolean().default(true)
})

// POST /api/documents/ocr - Processar OCR de documento único
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ocrRequestSchema.parse(body)

    // Verificar se arquivo existe
    try {
      await fs.access(validatedData.filePath)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Realizar OCR
    const ocrResult = await performOCR({
      filePath: validatedData.filePath,
      documentType: validatedData.documentType,
      language: validatedData.language,
      extractionMode: validatedData.extractionMode
    })

    // Salvar resultado no banco de dados
    const documentRecord = await saveOcrResult(
      validatedData.clientId,
      validatedData.documentId,
      ocrResult,
      validatedData.filePath
    )

    // Atualizar status do documento se ID fornecido
    if (validatedData.documentId) {
      await updateDocumentWithOcrData(validatedData.documentId, ocrResult)
    }

    // Gerar relatório de compliance se solicitado
    let complianceReport = null
    if (ocrResult.success && validatedData.validateData) {
      complianceReport = await generateComplianceReport(
        ocrResult,
        validatedData.documentType,
        validatedData.clientId
      )
    }

    // Log da operação
    await prisma.automationLog.create({
      data: {
        type: 'OCR_PROCESSING',
        action: 'process_document',
        details: {
          documentType: validatedData.documentType,
          success: ocrResult.success,
          confidence: ocrResult.confidence,
          extractionMode: validatedData.extractionMode,
          validationResults: ocrResult.validationResults.length,
          securityChecks: ocrResult.securityChecks.length,
          qualityScore: ocrResult.documentAnalysis.quality.overallScore
        },
        success: ocrResult.success,
        clientId: validatedData.clientId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        documentId: documentRecord?.id,
        ocr: ocrResult,
        compliance: complianceReport,
        recommendations: generateOcrRecommendations(ocrResult),
        nextSteps: generateNextSteps(ocrResult, validatedData.documentType)
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

    console.error('Erro no processamento OCR:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/ocr/batch - Processar múltiplos documentos
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = batchOcrSchema.parse(body)

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Processar documentos em lote
    const ocrResults = await processMultipleDocuments(
      validatedData.documents.map(doc => ({
        filePath: doc.filePath,
        documentType: doc.documentType,
        language: doc.language
      }))
    )

    // Salvar resultados
    const savedDocuments = []
    for (let i = 0; i < ocrResults.length; i++) {
      const result = ocrResults[i]
      const docData = validatedData.documents[i]
      
      const savedDoc = await saveOcrResult(
        validatedData.clientId,
        docData.documentId,
        result,
        docData.filePath
      )
      
      savedDocuments.push(savedDoc)
      
      // Atualizar documento existente se ID fornecido
      if (docData.documentId) {
        await updateDocumentWithOcrData(docData.documentId, result)
      }
    }

    // Gerar relatório consolidado
    let consolidatedReport = null
    if (validatedData.generateReport) {
      consolidatedReport = generateConsolidatedReport(ocrResults)
    }

    // Log da operação em lote
    await prisma.automationLog.create({
      data: {
        type: 'OCR_BATCH_PROCESSING',
        action: 'process_multiple_documents',
        details: {
          totalDocuments: validatedData.documents.length,
          successfulProcessed: ocrResults.filter(r => r.success).length,
          averageConfidence: ocrResults.reduce((sum, r) => sum + r.confidence, 0) / ocrResults.length,
          documentTypes: [...new Set(validatedData.documents.map(d => d.documentType))],
          consolidatedReport: consolidatedReport
        },
        success: true,
        clientId: validatedData.clientId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: ocrResults.length,
        successful: ocrResults.filter(r => r.success).length,
        failed: ocrResults.filter(r => !r.success).length,
        results: ocrResults.map((result, index) => ({
          documentId: savedDocuments[index]?.id,
          documentType: validatedData.documents[index].documentType,
          success: result.success,
          confidence: result.confidence,
          extractedData: result.structuredData,
          validationIssues: result.validationResults.filter(v => !v.isValid).length,
          securityFlags: result.securityChecks.filter(s => s.riskLevel === 'high').length
        })),
        consolidatedReport,
        recommendations: generateBatchRecommendations(ocrResults)
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

    console.error('Erro no processamento OCR em lote:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/documents/ocr/results - Obter resultados OCR
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const documentId = searchParams.get('documentId')
    const documentType = searchParams.get('documentType')
    const includeDetails = searchParams.get('includeDetails') === 'true'

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Cliente é obrigatório' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      clientId: clientId,
      type: 'DOCUMENT_OCR'
    }

    if (documentId) {
      whereClause.documentId = documentId
    }

    if (documentType) {
      whereClause.details = {
        path: ['documentType'],
        equals: documentType
      }
    }

    const ocrRecords = await prisma.document.findMany({
      where: {
        clientId: clientId,
        type: documentType || undefined,
        status: 'PROCESSED'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const results = ocrRecords.map(record => ({
      id: record.id,
      documentType: record.type,
      fileName: record.fileName,
      status: record.status,
      confidence: record.ocrData?.confidence || 0,
      extractedData: includeDetails ? record.ocrData?.structuredData : null,
      validationSummary: {
        totalChecks: record.ocrData?.validationResults?.length || 0,
        passed: record.ocrData?.validationResults?.filter((v: any) => v.isValid).length || 0,
        failed: record.ocrData?.validationResults?.filter((v: any) => !v.isValid).length || 0
      },
      securitySummary: {
        totalChecks: record.ocrData?.securityChecks?.length || 0,
        highRisk: record.ocrData?.securityChecks?.filter((s: any) => s.riskLevel === 'high').length || 0,
        mediumRisk: record.ocrData?.securityChecks?.filter((s: any) => s.riskLevel === 'medium').length || 0
      },
      qualityScore: record.ocrData?.documentAnalysis?.quality?.overallScore || 0,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalResults: results.length,
        results: results,
        summary: {
          averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length || 0,
          averageQuality: results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length || 0,
          documentTypes: [...new Set(results.map(r => r.documentType))],
          totalValidationIssues: results.reduce((sum, r) => sum + r.validationSummary.failed, 0),
          totalSecurityFlags: results.reduce((sum, r) => sum + r.securitySummary.highRisk, 0)
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar resultados OCR:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Salvar resultado OCR no banco de dados
async function saveOcrResult(
  clientId: string,
  documentId: string | undefined,
  ocrResult: any,
  filePath: string
) {
  try {
    const fileName = path.basename(filePath)
    
    // Se documentId fornecido, atualizar registro existente
    if (documentId) {
      return await prisma.document.update({
        where: { id: documentId },
        data: {
          status: ocrResult.success ? 'PROCESSED' : 'ERROR',
          ocrData: ocrResult,
          extractedText: ocrResult.extractedText,
          confidence: ocrResult.confidence,
          processedAt: new Date()
        }
      })
    } else {
      // Criar novo registro
      return await prisma.document.create({
        data: {
          clientId: clientId,
          type: ocrResult.documentAnalysis.documentType.toUpperCase(),
          fileName: fileName,
          filePath: filePath,
          status: ocrResult.success ? 'PROCESSED' : 'ERROR',
          ocrData: ocrResult,
          extractedText: ocrResult.extractedText,
          confidence: ocrResult.confidence,
          processedAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('Erro ao salvar resultado OCR:', error)
    return null
  }
}

// Atualizar documento existente com dados OCR
async function updateDocumentWithOcrData(documentId: string, ocrResult: any) {
  try {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: ocrResult.success ? 'PROCESSED' : 'ERROR',
        ocrData: ocrResult,
        extractedText: ocrResult.extractedText,
        confidence: ocrResult.confidence,
        processedAt: new Date(),
        // Atualizar campos específicos baseados no tipo de documento
        ...(ocrResult.structuredData.expiryDate && {
          expiryDate: new Date(ocrResult.structuredData.expiryDate)
        }),
        ...(ocrResult.structuredData.issueDate && {
          issueDate: new Date(ocrResult.structuredData.issueDate)
        })
      }
    })
    
    // Criar interação para documentar o processamento
    await prisma.interaction.create({
      data: {
        type: 'DOCUMENT_PROCESSED',
        channel: 'system',
        direction: 'inbound',
        content: `OCR processado para ${ocrResult.documentAnalysis.documentType}`,
        details: {
          documentId: documentId,
          confidence: ocrResult.confidence,
          extractionMode: 'full',
          validationIssues: ocrResult.validationResults.filter((v: any) => !v.isValid).length,
          securityFlags: ocrResult.securityChecks.filter((s: any) => s.riskLevel === 'high').length
        },
        clientId: '', // Will be updated by caller
        completedAt: new Date()
      }
    })
    
  } catch (error) {
    console.error('Erro ao atualizar documento com dados OCR:', error)
  }
}

// Gerar relatório de compliance baseado no OCR
async function generateComplianceReport(ocrResult: any, documentType: string, clientId: string) {
  const compliance = {
    documentType: documentType,
    overallScore: 0,
    status: 'non_compliant' as 'compliant' | 'partial' | 'non_compliant',
    issues: [] as any[],
    recommendations: [] as any[],
    requiredFields: [] as any[],
    extractedFields: [] as any[]
  }
  
  // Definir campos obrigatórios por tipo de documento
  const requiredFieldsByType: Record<string, string[]> = {
    'passport': ['documentNumber', 'fullName', 'dateOfBirth', 'expiryDate', 'nationality'],
    'identity_card': ['documentNumber', 'fullName', 'dateOfBirth', 'cpf'],
    'diploma': ['studentName', 'degree', 'institution', 'graduationDate'],
    'bank_statement': ['accountHolder', 'accountNumber', 'statementPeriod'],
    'employment_letter': ['employeeName', 'company', 'position', 'salary']
  }
  
  const requiredFields = requiredFieldsByType[documentType] || []
  compliance.requiredFields = requiredFields
  
  // Verificar campos extraídos
  const extractedData = ocrResult.structuredData
  const extractedFields = Object.keys(extractedData).filter(key => 
    extractedData[key] && extractedData[key] !== ''
  )
  compliance.extractedFields = extractedFields
  
  // Calcular score de compliance
  const foundRequired = requiredFields.filter(field => extractedFields.includes(field))
  const fieldScore = requiredFields.length > 0 ? (foundRequired.length / requiredFields.length) * 100 : 100
  
  // Considerar qualidade e validação
  const qualityScore = ocrResult.documentAnalysis.quality.overallScore
  const validationScore = ocrResult.validationResults.length > 0 ? 
    (ocrResult.validationResults.filter((v: any) => v.isValid).length / ocrResult.validationResults.length) * 100 : 100
  
  compliance.overallScore = Math.round((fieldScore * 0.5 + qualityScore * 0.3 + validationScore * 0.2))
  
  // Determinar status
  if (compliance.overallScore >= 90 && foundRequired.length === requiredFields.length) {
    compliance.status = 'compliant'
  } else if (compliance.overallScore >= 70) {
    compliance.status = 'partial'
  } else {
    compliance.status = 'non_compliant'
  }
  
  // Identificar problemas
  const missingFields = requiredFields.filter(field => !extractedFields.includes(field))
  missingFields.forEach(field => {
    compliance.issues.push({
      type: 'missing_field',
      severity: 'high',
      field: field,
      message: `Required field '${field}' not extracted`
    })
  })
  
  // Adicionar problemas de validação
  ocrResult.validationResults.filter((v: any) => !v.isValid).forEach((validation: any) => {
    compliance.issues.push({
      type: 'validation_error',
      severity: 'medium',
      field: validation.field,
      message: validation.errors.join(', ')
    })
  })
  
  // Gerar recomendações
  if (qualityScore < 70) {
    compliance.recommendations.push({
      priority: 'high',
      action: 'Improve image quality',
      details: 'Rescan document with higher resolution and better lighting'
    })
  }
  
  if (missingFields.length > 0) {
    compliance.recommendations.push({
      priority: 'high',
      action: 'Provide clearer document image',
      details: `Missing fields: ${missingFields.join(', ')}`
    })
  }
  
  return compliance
}

// Gerar recomendações para OCR individual
function generateOcrRecommendations(ocrResult: any) {
  const recommendations = []
  
  // Recomendações de qualidade
  if (ocrResult.documentAnalysis.quality.overallScore < 70) {
    recommendations.push({
      type: 'quality',
      priority: 'high',
      title: 'Melhorar qualidade da imagem',
      description: 'A qualidade da imagem está abaixo do ideal para OCR preciso',
      actions: ocrResult.documentAnalysis.quality.recommendations
    })
  }
  
  // Recomendações de validação
  const validationIssues = ocrResult.validationResults.filter((v: any) => !v.isValid)
  if (validationIssues.length > 0) {
    recommendations.push({
      type: 'validation',
      priority: 'medium',
      title: 'Corrigir problemas de validação',
      description: `${validationIssues.length} campos não passaram na validação`,
      actions: validationIssues.map((v: any) => v.suggestions).flat()
    })
  }
  
  // Recomendações de segurança
  const securityFlags = ocrResult.securityChecks.filter((s: any) => s.riskLevel === 'high')
  if (securityFlags.length > 0) {
    recommendations.push({
      type: 'security',
      priority: 'critical',
      title: 'Verificação manual necessária',
      description: 'Documento requer verificação manual devido a flags de segurança',
      actions: ['Schedule manual review', 'Verify document authenticity']
    })
  }
  
  return recommendations
}

// Gerar recomendações para lote
function generateBatchRecommendations(ocrResults: any[]) {
  const recommendations = []
  
  const lowQualityCount = ocrResults.filter(r => r.documentAnalysis.quality.overallScore < 70).length
  if (lowQualityCount > 0) {
    recommendations.push({
      type: 'batch_quality',
      priority: 'high',
      title: `${lowQualityCount} documentos com qualidade baixa`,
      description: 'Múltiplos documentos precisam ser reescaneados',
      action: 'Rescan documents with better quality settings'
    })
  }
  
  const securityFlagsCount = ocrResults.filter(r => 
    r.securityChecks.some((s: any) => s.riskLevel === 'high')
  ).length
  if (securityFlagsCount > 0) {
    recommendations.push({
      type: 'batch_security',
      priority: 'critical',
      title: `${securityFlagsCount} documentos requerem verificação manual`,
      description: 'Múltiplos documentos flagados para revisão de segurança',
      action: 'Schedule batch manual review'
    })
  }
  
  return recommendations
}

// Gerar próximos passos
function generateNextSteps(ocrResult: any, documentType: string) {
  const steps = []
  
  if (ocrResult.success) {
    if (ocrResult.confidence >= 0.9) {
      steps.push('✅ OCR completed successfully - high confidence')
      steps.push('📋 Review extracted data for accuracy')
      steps.push('🚀 Proceed with document verification')
    } else if (ocrResult.confidence >= 0.7) {
      steps.push('⚠️ OCR completed - medium confidence')
      steps.push('🔍 Manual review recommended')
      steps.push('📋 Verify critical fields manually')
    } else {
      steps.push('❌ OCR completed - low confidence')
      steps.push('🔄 Consider rescanning document')
      steps.push('👥 Manual data entry may be required')
    }
  } else {
    steps.push('❌ OCR processing failed')
    steps.push('🔄 Try rescanning with better quality')
    steps.push('📞 Contact support if issue persists')
  }
  
  return steps
}