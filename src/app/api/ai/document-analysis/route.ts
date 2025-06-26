import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para análise de documento
const documentAnalysisSchema = z.object({
  documentId: z.string().min(1, 'ID do documento é obrigatório'),
  forceReanalysis: z.boolean().default(false)
})

// POST /api/ai/document-analysis - Analisar documento com IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = documentAnalysisSchema.parse(body)

    // Buscar documento
    const document = await prisma.document.findUnique({
      where: { id: validatedData.documentId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            targetCountry: true,
            visaType: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { status: 404 }
      )
    }

    // Verificar se já foi analisado
    if (document.analysis && !validatedData.forceReanalysis) {
      return NextResponse.json({
        data: {
          documentId: document.id,
          analysis: document.analysis,
          cached: true
        },
        message: 'Análise recuperada do cache'
      })
    }

    // Marcar como analisando
    await prisma.document.update({
      where: { id: validatedData.documentId },
      data: { status: 'ANALYZING' }
    })

    // Fazer análise com IA
    const analysisResult = await performAdvancedDocumentAnalysis(document)

    // Atualizar documento com resultado
    const updatedDocument = await prisma.document.update({
      where: { id: validatedData.documentId },
      data: {
        status: analysisResult.isValid ? 'VALID' : (analysisResult.needsReview ? 'NEEDS_REVIEW' : 'INVALID'),
        isValid: analysisResult.isValid,
        ocrText: analysisResult.ocrText,
        analysis: analysisResult.analysis,
        validationNotes: analysisResult.validationNotes,
        validatedAt: new Date()
      }
    })

    // Log da análise
    await prisma.automationLog.create({
      data: {
        type: 'AI_DOCUMENT_ANALYSIS',
        action: 'analyze_document_ai',
        clientId: document.clientId,
        success: analysisResult.isValid,
        details: {
          documentId: document.id,
          documentType: document.type,
          confidence: analysisResult.confidence,
          processingTime: analysisResult.processingTime
        }
      }
    })

    // Se documento foi aprovado, verificar se pode prosseguir com próximo passo
    if (analysisResult.isValid) {
      await checkAndTriggerNextSteps(document.clientId, document.type)
    }

    return NextResponse.json({
      data: {
        documentId: document.id,
        analysis: analysisResult,
        document: updatedDocument
      },
      message: 'Análise concluída com sucesso'
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

    console.error('Erro na análise de documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/ai/document-analysis/[id] - Obter análise de documento
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            targetCountry: true,
            visaType: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        documentId: document.id,
        ocrText: document.ocrText,
        analysis: document.analysis,
        isValid: document.isValid,
        validationNotes: document.validationNotes,
        validatedAt: document.validatedAt
      }
    })

  } catch (error) {
    console.error('Erro ao buscar análise:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função principal de análise avançada de documentos
async function performAdvancedDocumentAnalysis(document: any) {
  const startTime = Date.now()
  
  try {
    // Simular OCR (em produção usar Google Vision API, AWS Textract, etc.)
    const ocrResult = await performOCR(document)
    
    // Análise específica por tipo de documento
    const analysisResult = await analyzeByDocumentType(document, ocrResult)
    
    // Validação cruzada com requisitos do país
    const countryValidation = await validateAgainstCountryRequirements(
      document, 
      analysisResult
    )
    
    // Detecção de fraudes/problemas
    const fraudDetection = await detectPotentialIssues(document, ocrResult, analysisResult)
    
    const processingTime = Date.now() - startTime
    
    return {
      isValid: analysisResult.isValid && countryValidation.isValid && !fraudDetection.hasCriticalIssues,
      needsReview: analysisResult.needsReview || countryValidation.needsReview || fraudDetection.hasWarnings,
      confidence: Math.min(analysisResult.confidence, countryValidation.confidence),
      ocrText: ocrResult.text,
      analysis: {
        ocr: ocrResult,
        typeSpecific: analysisResult,
        countryValidation: countryValidation,
        fraudDetection: fraudDetection,
        recommendations: generateRecommendations(analysisResult, countryValidation, fraudDetection),
        processingTime: processingTime
      },
      validationNotes: generateValidationNotes(analysisResult, countryValidation, fraudDetection),
      processingTime: processingTime
    }
    
  } catch (error) {
    console.error('Erro na análise avançada:', error)
    return {
      isValid: false,
      needsReview: true,
      confidence: 0,
      ocrText: '',
      analysis: {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        processingTime: Date.now() - startTime
      }
      validationNotes: 'Erro durante análise automática. Revisão manual necessária.',
      processingTime: Date.now() - startTime
    }
  }
}

// Simular OCR
async function performOCR(document: any) {
  // Em produção, usar serviço real de OCR
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simular processamento
  
  const mockTexts: Record<string, string> = {
    'PASSPORT': `PASSPORT
REPUBLIC OF BRAZIL
PASSAPORTE
Type/Tipo: P
Country Code/Código do País: BRA
Passport No./No do Passaporte: YB123456
Surname/Nome: ${document.client?.name?.split(' ').pop() || 'SILVA'}
Given Names/Prenomes: ${document.client?.name?.split(' ').slice(0, -1).join(' ') || 'MARIA'}
Nationality/Nacionalidade: BRAZILIAN
Date of Birth/Data de Nascimento: 15/03/1990
Sex/Sexo: F
Place of Birth/Local de Nascimento: SAO PAULO, SP
Date of Issue/Data de Emissão: 10/01/2020
Date of Expiry/Data de Expiração: 10/01/2030
Authority/Autoridade: DPF/SP`,

    'DIPLOMA': `UNIVERSIDADE DE SÃO PAULO
FACULDADE DE ENGENHARIA
DIPLOMA DE GRADUAÇÃO
Confere o grau de BACHAREL EM ENGENHARIA CIVIL
a ${document.client?.name || 'MARIA SILVA'}
nascido(a) em 15 de março de 1990
natural de São Paulo, SP
por ter concluído o curso de Engenharia Civil
São Paulo, 15 de dezembro de 2015,
Reitor: Prof. Dr. João Santos`,

    'BANK_STATEMENT': `BANCO DO BRASIL S.A.
EXTRATO BANCÁRIO,
Titular: ${document.client?.name || 'MARIA SILVA'}
Conta: 12345-6
Período: 01/01/2024 a 31/03/2024
Saldo Inicial: R$ 45.000,00
Saldo Final: R$ 52.000,00
Maior Saldo: R$ 58.000,00
Menor Saldo: R$ 42.000,00`,

    'WORK_CERTIFICATE': `CERTIFICADO DE TRABALHO,
Empresa: Tech Solutions Ltda,
CNPJ: 12.345.678/0001-90
Certificamos que ${document.client?.name || 'MARIA SILVA'}
trabalhou em nossa empresa no período de
01/03/2018 a 15/12/2023,
Cargo: Engenheira de Software Sênior
Salário: R$ 12.000,00
Função: Desenvolvimento de sistemas, liderança de equipe
São Paulo, 20 de dezembro de 2023`
  }
  
  const text = mockTexts[document.type] || `Document content for ${document.fileName}`
  
  return {
    text: text
    confidence: 0.95,
    language: 'pt',
    pages: 1,
    extractedFields: extractFieldsFromText(text, document.type)
  }
}

// Extrair campos específicos do texto OCR
function extractFieldsFromText(text: string, documentType: string) {
  const fields: any = {}
  
  switch (documentType) {
    case 'PASSPORT':
      fields.passportNumber = text.match(/Passport No.*?(\w+)/i)?.[1]
      fields.expiryDate = text.match(/Date of Expiry.*?(\d{2}\/\d{2}\/\d{4})/i)?.[1]
      fields.nationality = text.match(/Nationality.*?(\w+)/i)?.[1]
      fields.dateOfBirth = text.match(/Date of Birth.*?(\d{2}\/\d{2}\/\d{4})/i)?.[1]
      break
      
    case 'BANK_STATEMENT':
      fields.finalBalance = text.match(/Saldo Final.*?R\$\s*([\d.,]+)/i)?.[1]
      fields.period = text.match(/Período.*?(\d{2}\/\d{2}\/\d{4}.*?\d{2}\/\d{2}\/\d{4})/i)?.[1]
      fields.accountHolder = text.match(/Titular.*?([A-Z\s]+)/i)?.[1]
      break
      
    case 'DIPLOMA':
      fields.degree = text.match(/grau de (.*?) a/i)?.[1]
      fields.university = text.match(/^([A-Z\s]+UNIVERSIDADE[A-Z\s]*)/i)?.[1]
      fields.graduationDate = text.match(/(\d{2} de \w+ de \d{4})/i)?.[1]
      break
      
    case 'WORK_CERTIFICATE':
      fields.company = text.match(/Empresa:(.*?)(?:\n|CNPJ)/i)?.[1]?.trim()
      fields.position = text.match(/Cargo:(.*?)(?:\n|Salário)/i)?.[1]?.trim()
      fields.salary = text.match(/Salário.*?R\$\s*([\d.,]+)/i)?.[1]
      fields.period = text.match(/período de(.*?)(?:\n|Cargo)/i)?.[1]?.trim()
      break
  }
  
  return fields
}

// Análise específica por tipo de documento
async function analyzeByDocumentType(document: any, ocrResult: any) {
  const analysisRules: Record<string, any> = {
    'PASSPORT': analyzePassport,
    'DIPLOMA': analyzeDiploma,
    'BANK_STATEMENT': analyzeBankStatement,
    'WORK_CERTIFICATE': analyzeWorkCertificate,
    'BIRTH_CERTIFICATE': analyzeBirthCertificate,
    'POLICE_CLEARANCE': analyzePoliceClearance
  }
  
  const analyzeFunction = analysisRules[document.type] || analyzeGenericDocument
  return await analyzeFunction(document, ocrResult)
}

// Análise específica de passaporte
async function analyzePassport(document: any, ocrResult: any) {
  const fields = ocrResult.extractedFields
  const issues: string[] = []
  let confidence = 0.9
  
  // Verificar validade
  if (fields.expiryDate) {
    const expiryDate = new Date(fields.expiryDate.split('/').reverse().join('-'))
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    
    if (expiryDate < sixMonthsFromNow) {
      issues.push('Passaporte expira em menos de 6 meses')
      confidence -= 0.3,
    }
  } else {
    issues.push('Data de expiração não identificada')
    confidence -= 0.2
  }
  
  // Verificar se tem número do passaporte
  if (!fields.passportNumber) {
    issues.push('Número do passaporte não identificado')
    confidence -= 0.2
  }
  
  return {
    isValid: issues.length === 0 || issues.every(issue => !issue.includes('expira'))
    needsReview: issues.length > 0
    confidence: Math.max(confidence, 0.1)
    extractedData: fields,
    issues: issues,
    recommendations: issues.length > 0 ? ['Renovar passaporte se próximo do vencimento'] : []
  }
}

// Análise específica de diploma
async function analyzeDiploma(document: any, ocrResult: any) {
  const fields = ocrResult.extractedFields
  const issues: string[] = []
  let confidence = 0.85
  
  if (!fields.degree) {
    issues.push('Tipo de diploma não identificado')
    confidence -= 0.2
  }
  
  if (!fields.university) {
    issues.push('Universidade não identificada')
    confidence -= 0.2
  }
  
  if (!fields.graduationDate) {
    issues.push('Data de graduação não identificada')
    confidence -= 0.1
  }
  
  return {
    isValid: issues.length < 2
    needsReview: issues.length > 0,
    confidence: Math.max(confidence, 0.1)
    extractedData: fields,
    issues: issues,
    recommendations: ['Verificar se precisa de validação/apostilamento']
  }
}

// Análise específica de extrato bancário
async function analyzeBankStatement(document: any, ocrResult: any) {
  const fields = ocrResult.extractedFields
  const issues: string[] = []
  let confidence = 0.9
  
  if (fields.finalBalance) {
    const balance = parseFloat(fields.finalBalance.replace(/[.,]/g, ''))
    if (balance < 10000) {
      issues.push('Saldo pode ser insuficiente para alguns países')
      confidence -= 0.2,
    }
  } else {
    issues.push('Saldo final não identificado')
    confidence -= 0.3
  }
  
  if (!fields.period) {
    issues.push('Período do extrato não identificado')
    confidence -= 0.1
  }
  
  return {
    isValid: issues.length === 0 || !issues.some(i => i.includes('não identificado'))
    needsReview: issues.length > 0
    confidence: Math.max(confidence, 0.1)
    extractedData: fields,
    issues: issues,
    recommendations: ['Verificar se período está adequado (mínimo 3 meses)']
  }
}

// Análise específica de certificado de trabalho
async function analyzeWorkCertificate(document: any, ocrResult: any) {
  const fields = ocrResult.extractedFields
  const issues: string[] = []
  let confidence = 0.85
  
  if (!fields.company) {
    issues.push('Nome da empresa não identificado')
    confidence -= 0.2
  }
  
  if (!fields.position) {
    issues.push('Cargo não identificado')
    confidence -= 0.2
  }
  
  if (!fields.period) {
    issues.push('Período de trabalho não identificado')
    confidence -= 0.2
  }
  
  return {
    isValid: issues.length < 2
    needsReview: issues.length > 0,
    confidence: Math.max(confidence, 0.1)
    extractedData: fields,
    issues: issues,
    recommendations: ['Verificar se atende tempo mínimo de experiência']
  }
}

// Análises genéricas para outros tipos
async function analyzeBirthCertificate(document: any, ocrResult: any) {
  return {
    isValid: true
    needsReview: false,
    confidence: 0.8,
    extractedData: {}
    issues: [],
    recommendations: ['Verificar se precisa de apostilamento']
  }
}

async function analyzePoliceClearance(document: any, ocrResult: any) {
  return {
    isValid: true
    needsReview: false,
    confidence: 0.8,
    extractedData: {}
    issues: [],
    recommendations: ['Verificar validade (máximo 12 meses)']
  }
}

async function analyzeGenericDocument(document: any, ocrResult: any) {
  return {
    isValid: true
    needsReview: true,
    confidence: 0.6,
    extractedData: {}
    issues: ['Tipo de documento requer análise manual'],
    recommendations: ['Solicitar revisão de especialista']
  }
}

// Validar contra requisitos do país
async function validateAgainstCountryRequirements(document: any, analysisResult: any) {
  if (!document.client?.targetCountry) {
    return {
      isValid: true
      needsReview: true,
      confidence: 0.7,
      countrySpecificIssues: ['País de destino não especificado']
    }
  }
  
  // Buscar requisitos específicos
  const requirements = await prisma.visaRequirement.findFirst({
    where: {
      country: { contains: document.client.targetCountry }
      isActive: true
    }
  })
  
  if (!requirements) {
    return {
      isValid: true
      needsReview: true,
      confidence: 0.7,
      countrySpecificIssues: ['Requisitos específicos não encontrados']
    }
  }
  
  const requiredDocs = requirements.requiredDocuments as any[]
  const relevantDoc = requiredDocs.find(doc => doc.type === document.type)
  
  if (!relevantDoc) {
    return {
      isValid: true
      needsReview: false,
      confidence: 0.8,
      countrySpecificIssues: []
    }
  }
  
  const issues: string[] = []
  
  // Verificar validade específica
  if (relevantDoc.validityMonths && document.type === 'PASSPORT') {
    const extractedData = analysisResult.extractedData
    if (extractedData.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate.split('/').reverse().join('-'))
      const requiredValidUntil = new Date()
      requiredValidUntil.setMonth(requiredValidUntil.getMonth() + relevantDoc.validityMonths)
      
      if (expiryDate < requiredValidUntil) {
        issues.push(`Passaporte deve ser válido por pelo menos ${relevantDoc.validityMonths} meses`)
      }
    }
  }
  
  return {
    isValid: issues.length === 0
    needsReview: issues.length > 0,
    confidence: issues.length === 0 ? 0.9 : 0.6,
    countrySpecificIssues: issues,
    requirement: relevantDoc
  }
}

// Detecção de fraudes e problemas
async function detectPotentialIssues(document: any, ocrResult: any, analysisResult: any) {
  const warnings: string[] = []
  const criticalIssues: string[] = []
  
  // Verificar qualidade da imagem/OCR
  if (ocrResult.confidence < 0.7) {
    warnings.push('Qualidade da imagem pode estar comprometida')
  }
  
  // Verificar consistência de dados
  if (document.client && analysisResult.extractedData) {
    const extractedName = ocrResult.text.toUpperCase()
    const clientName = document.client.name.toUpperCase()
    
    if (extractedName.includes(clientName.split(' ')[0]) === false) {
      warnings.push('Nome no documento pode não corresponder ao cliente')
    }
  }
  
  // Verificar padrões suspeitos no texto
  const suspiciousPatterns = [
    /COPY/gi,
    /REPLICA/gi,
    /SAMPLE/gi,
    /SPECIMEN/gi
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(ocrResult.text)) {
      criticalIssues.push('Documento pode ser uma cópia ou amostra')
      break,
    }
  }
  
  return {
    hasWarnings: warnings.length > 0
    hasCriticalIssues: criticalIssues.length > 0,
    warnings: warnings,
    criticalIssues: criticalIssues,
    riskScore: criticalIssues.length * 0.8 + warnings.length * 0.3
  }
}

// Gerar recomendações
function generateRecommendations(analysisResult: any, countryValidation: any, fraudDetection: any) {
  const recommendations: string[] = []
  
  // Adicionar recomendações da análise específica
  if (analysisResult.recommendations) {
    recommendations.push(...analysisResult.recommendations)
  }
  
  // Adicionar recomendações de validação do país
  if (countryValidation.countrySpecificIssues?.length > 0) {
    recommendations.push('Verificar requisitos específicos do país de destino')
  }
  
  // Adicionar recomendações de segurança
  if (fraudDetection.hasWarnings) {
    recommendations.push('Revisar qualidade e autenticidade do documento')
  }
  
  if (fraudDetection.hasCriticalIssues) {
    recommendations.push('URGENTE: Documento requer validação manual imediata')
  }
  
  return recommendations
}

// Gerar notas de validação
function generateValidationNotes(analysisResult: any, countryValidation: any, fraudDetection: any) {
  const notes: string[] = []
  
  if (analysisResult.issues?.length > 0) {
    notes.push(`Análise técnica: ${analysisResult.issues.join(', ')}`)
  }
  
  if (countryValidation.countrySpecificIssues?.length > 0) {
    notes.push(`Requisitos do país: ${countryValidation.countrySpecificIssues.join(', ')}`)
  }
  
  if (fraudDetection.warnings?.length > 0) {
    notes.push(`Alertas: ${fraudDetection.warnings.join(', ')}`)
  }
  
  if (fraudDetection.criticalIssues?.length > 0) {
    notes.push(`CRÍTICO: ${fraudDetection.criticalIssues.join(', ')}`)
  }
  
  return notes.join(' | ')
}

// Verificar e disparar próximos passos
async function checkAndTriggerNextSteps(clientId: string, documentType: string) {
  try {
    // Buscar todos os documentos do cliente
    const clientDocuments = await prisma.document.findMany({
      where: { clientId, status: 'VALID' }
    })
    
    // Verificar se tem documentos essenciais
    const hasPassport = clientDocuments.some(d => d.type === 'PASSPORT')
    const hasEducation = clientDocuments.some(d => ['DIPLOMA', 'TRANSCRIPT'].includes(d.type))
    const hasWork = clientDocuments.some(d => d.type === 'WORK_CERTIFICATE')
    
    if (hasPassport && hasEducation && hasWork) {
      // Cliente tem documentos básicos, pode agendar consultoria
      const existingConsultation = await prisma.consultation.findFirst({
        where: { 
          clientId,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        }
      })
      
      if (!existingConsultation) {
        // Agendar consultoria automática
        await prisma.consultation.create({
          data: {
            type: 'HUMAN_CONSULTATION',
            status: 'SCHEDULED',
            clientId: clientId,
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            notes: 'Consultoria agendada automaticamente após validação de documentos essenciais'
          }
        })
        
        // Enviar notificação
        // (implementar call para API de email/whatsapp)
      }
    }
    
  } catch (error) {
    console.error('Erro ao verificar próximos passos:', error)
  }
}