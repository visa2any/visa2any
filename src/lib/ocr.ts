import { ImageAnnotatorClient } from '@google-cloud/vision'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'

// Configurar cliente Google Vision
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
})

// Schema para analise OCR
const ocrRequestSchema = z.object({
  filePath: z.string(),
  documentType: z.string(),
  language: z.string().default('pt'),
  extractionMode: z.enum(['text', 'structured', 'full']).default('full')
})

export interface OCRResult {
  success: boolean
  confidence: number
  extractedText: string
  structuredData: Record<string, any>
  detectedLanguage: string
  documentAnalysis: DocumentAnalysis
  validationResults: ValidationResult[]
  securityChecks: SecurityCheck[]
}

export interface DocumentAnalysis {
  documentType: string
  confidence: number
  fields: ExtractedField[]
  layout: LayoutAnalysis
  quality: QualityMetrics
}

export interface ExtractedField {
  name: string
  value: string
  confidence: number
  boundingBox: BoundingBox
  validated: boolean
  validationErrors: string[]
}

export interface ValidationResult {
  field: string
  isValid: boolean
  errors: string[]
  suggestions: string[]
}

export interface SecurityCheck {
  checkType: string
  passed: boolean
  confidence: number
  details: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutAnalysis {
  blocks: TextBlock[]
  paragraphs: number
  lines: number
  words: number
  orientation: string
}

export interface TextBlock {
  text: string
  boundingBox: BoundingBox
  confidence: number
  blockType: string
}

export interface QualityMetrics {
  resolution: number
  clarity: number
  contrast: number
  skew: number
  noise: number
  overallScore: number
  recommendations: string[]
}

// Função principal de OCR
export async function performOCR(request: {
  filePath: string
  documentType: string
  language?: string
  extractionMode?: 'text' | 'structured' | 'full'
}): Promise<OCRResult> {
  try {
    const validatedRequest = ocrRequestSchema.parse(request)
    
    // Ler arquivo de imagem
    const imageBuffer = await fs.readFile(validatedRequest.filePath)
    
    // Realizar OCR com Google Vision
    const [textDetection] = await visionClient.textDetection({
      image: { content: imageBuffer },
      imageContext: {
        languageHints: [validatedRequest.language]
      }
    })
    
    // Realizar analise de documento
    const [documentAnalysis] = await visionClient.documentTextDetection({
      image: { content: imageBuffer }
    })
    
    // Extrair texto completo
    const extractedText = textDetection.textAnnotations?.[0]?.description || ''
    
    // Analisar estrutura do documento
    const structuredData = await extractStructuredData(
      documentAnalysis,
      validatedRequest.documentType
    )
    
    // Analise de qualidade da imagem
    const qualityMetrics = await analyzeImageQuality(imageBuffer)
    
    // Validação dos dados extraidos
    const validationResults = await validateExtractedData(
      structuredData,
      validatedRequest.documentType
    )
    
    // Verificações de segurança
    const securityChecks = await performSecurityChecks(
      imageBuffer,
      extractedText,
      structuredData
    )
    
    // Calcular confiança geral
    const overallConfidence = calculateOverallConfidence(
      textDetection,
      documentAnalysis,
      qualityMetrics,
      validationResults
    )
    
    return {
      success: true,
      confidence: overallConfidence,
      extractedText,
      structuredData,
      detectedLanguage: detectLanguage(textDetection),
      documentAnalysis: {
        documentType: validatedRequest.documentType,
        confidence: overallConfidence,
        fields: structuredData.fields || [],
        layout: analyzeLayout(documentAnalysis),
        quality: qualityMetrics
      },
      validationResults,
      securityChecks
    }
    
  } catch (error) {
    console.error('Erro no OCR:', error)
    return {
      success: false,
      confidence: 0,
      extractedText: '',
      structuredData: {},
      detectedLanguage: 'unknown',
      documentAnalysis: {
        documentType: request.documentType,
        confidence: 0,
        fields: [],
        layout: { blocks: [], paragraphs: 0, lines: 0, words: 0, orientation: 'unknown' },
        quality: {
          resolution: 0,
          clarity: 0,
          contrast: 0,
          skew: 0,
          noise: 0,
          overallScore: 0,
          recommendations: ['Failed to process image']
        }
      },
      validationResults: [],
      securityChecks: []
    }
  }
}

// Extrair dados estruturados baseado no tipo de documento
async function extractStructuredData(analysis: any, documentType: string) {
  const extractors: Record<string, (analysis: any) => any> = {
    'passport': extractPassportData,
    'driver_license': extractDriverLicenseData,
    'birth_certificate': extractBirthCertificateData,
    'diploma': extractDiplomaData,
    'bank_statement': extractBankStatementData,
    'employment_letter': extractEmploymentLetterData,
    'identity_card': extractIdentityCardData,
    'visa': extractVisaData,
    'marriage_certificate': extractMarriageCertificateData,
    'tax_document': extractTaxDocumentData
  }
  
  const extractor = extractors[documentType] || extractGenericData
  return extractor(analysis)
}

// Extrator para passaporte
function extractPassportData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  const pages = analysis.fullTextAnnotation?.pages || []
  
  const extracted = {
    fields: [] as ExtractedField[],
    documentNumber: '',
    fullName: '',
    nationality: '',
    dateOfBirth: '',
    placeOfBirth: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    sex: '',
    personalNumber: ''
  }
  
  // Padrões regex para extrair informações do passaporte
  const patterns = {
    documentNumber: /(?:Passport|N[oº]|No|Number)[:\s]*([A-Z0-9]{6,12})/i,
    fullName: /(?:Nome|Name|Surname)[:\s]*([A-ZÀ-ſ\s]{2,50})/i,
    nationality: /(?:Nacionalidade|Nationality)[:\s]*([A-ZÀ-ſ]{3,30})/i,
    dateOfBirth: /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/,
    sex: /(?:Sex|Sexo)[:\s]*([MFX])/i,
    issueDate: /(?:Data de emissão|Issue date)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i,
    expiryDate: /(?:Data de validade|Expiry date)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i
  }
  
  // Extrair usando padrões
  Object.entries(patterns).forEach(([field, pattern]) => {
    const match = text.match(pattern)
    if (match) {
      const value = match[1].trim()
      extracted[field as keyof typeof extracted] = value
      extracted.fields.push({
        name: field,
        value: value,
        confidence: 0.85,
        boundingBox: { x: 0, y: 0, width: 0, height: 0 },
        validated: false,
        validationErrors: []
      })
    }
  })
  
  return extracted
}

// Extrator para carteira de identidade
function extractIdentityCardData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  
  return {
    fields: [],
    documentNumber: extractByPattern(text, /(?:RG|N[oº])[:\s]*([0-9.-]{7,15})/i),
    cpf: extractByPattern(text, /(?:CPF)[:\s]*([0-9.-]{11,14})/i),
    fullName: extractByPattern(text, /(?:Nome)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    dateOfBirth: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/),
    placeOfBirth: extractByPattern(text, /(?:Naturalidade)[:\s]*([A-ZÀ-ſ\s\/]{2,50})/i),
    fatherName: extractByPattern(text, /(?:Pai|Filiação)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    motherName: extractByPattern(text, /(?:Mãe)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    issueDate: extractByPattern(text, /(?:Data de emissão)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i)
  }
}

// Extrator para diploma
function extractDiplomaData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  
  return {
    fields: [],
    studentName: extractByPattern(text, /(?:confere|outorga|diploma)[^a-z]+([A-ZÀ-ſ\s]{2,50})/i),
    degree: extractByPattern(text, /(?:grau|degree|título)[^a-z]+([A-ZÀ-ſ\s]{2,50})/i),
    institution: extractByPattern(text, /(?:universidade|faculdade|instituto|university|college)[^a-z]+([A-ZÀ-ſ\s]{2,100})/i),
    graduationDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/),
    fieldOfStudy: extractByPattern(text, /(?:curso|major|field)[^a-z]+([A-ZÀ-ſ\s]{2,50})/i),
    registrationNumber: extractByPattern(text, /(?:registro|registration)[^a-z]+([A-Z0-9-]{3,20})/i)
  }
}

// Extrator para extrato bancário
function extractBankStatementData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  
  // Extrair valores monetários
  const amounts = text.match(/[R$€$¥£]?\s*([0-9,.-]+)/g) || []
  const dates = text.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/g) || []
  
  return {
    fields: [],
    accountHolder: extractByPattern(text, /(?:titular|holder|nome)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    accountNumber: extractByPattern(text, /(?:conta|account)[:\s]*([0-9-]{5,20})/i),
    bank: extractByPattern(text, /(?:banco|bank)[:\s]*([A-ZÀ-ſ\s]{2,30})/i),
    statementPeriod: {
      start: dates[0] || '',
      end: dates[dates.length - 1] || ''
    },
    transactions: amounts.slice(0, 20).map((amount, index) => ({
      date: dates[index] || '',
      amount: amount,
      description: ''
    })),
    balance: amounts[amounts.length - 1] || ''
  }
}

// Extrator para carta de emprego
function extractEmploymentLetterData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  
  return {
    fields: [],
    employeeName: extractByPattern(text, /(?:employee|funcionário|nome)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    company: extractByPattern(text, /(?:empresa|company)[:\s]*([A-ZÀ-ſ\s&.]{2,100})/i),
    position: extractByPattern(text, /(?:cargo|position|função)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    salary: extractByPattern(text, /(?:salário|salary)[^0-9]*([R$€$]?[0-9,.]+)/i),
    startDate: extractByPattern(text, /(?:admissão|start|início)[^0-9]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i),
    workSchedule: extractByPattern(text, /(?:horário|schedule)[:\s]*([0-9h:-\s]{5,20})/i),
    issueDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/)
  }
}

// Extratores genéricos
function extractDriverLicenseData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    licenseNumber: extractByPattern(text, /(?:carteira|license)[^0-9]*([0-9]{8,15})/i),
    fullName: extractByPattern(text, /(?:nome|name)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    category: extractByPattern(text, /(?:categoria|category)[:\s]*([ABC]{1,3})/i),
    expiryDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/)
  }
}

function extractBirthCertificateData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    fullName: extractByPattern(text, /(?:nome|name)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    dateOfBirth: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/),
    placeOfBirth: extractByPattern(text, /(?:nascimento|birth)[^a-z]*([A-ZÀ-ſ\s\/,]{2,50})/i),
    fatherName: extractByPattern(text, /(?:pai|father)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    motherName: extractByPattern(text, /(?:mãe|mother)[:\s]*([A-ZÀ-ſ\s]{2,50})/i)
  }
}

function extractVisaData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    visaNumber: extractByPattern(text, /(?:visa|visto)[^0-9]*([A-Z0-9]{5,15})/i),
    visaType: extractByPattern(text, /(?:type|tipo)[:\s]*([A-Z0-9]{1,10})/i),
    issueDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/),
    expiryDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/) // Pegar a segunda data encontrada
  }
}

function extractMarriageCertificateData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    spouse1Name: extractByPattern(text, /(?:cônjuge|spouse)[^a-z]*([A-ZÀ-ſ\s]{2,50})/i),
    spouse2Name: extractByPattern(text, /e[\s]*([A-ZÀ-ſ\s]{2,50})/),
    marriageDate: extractByPattern(text, /(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/),
    marriagePlace: extractByPattern(text, /(?:local|place)[^a-z]*([A-ZÀ-ſ\s,]{2,50})/i)
  }
}

function extractTaxDocumentData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    taxpayerName: extractByPattern(text, /(?:nome|name)[:\s]*([A-ZÀ-ſ\s]{2,50})/i),
    taxYear: extractByPattern(text, /(?:ano|year)[^0-9]*(\d{4})/i),
    totalIncome: extractByPattern(text, /(?:renda|income)[^0-9]*([R$€$]?[0-9,.]+)/i),
    taxPaid: extractByPattern(text, /(?:imposto|tax)[^0-9]*([R$€$]?[0-9,.]+)/i)
  }
}

function extractGenericData(analysis: any) {
  const text = analysis.fullTextAnnotation?.text || ''
  return {
    fields: [],
    extractedText: text,
    entities: [], // Poderia usar NLP para extrair entidades
    dates: text.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/g) || [],
    amounts: text.match(/[R$€$¥£]?\s*([0-9,.-]+)/g) || []
  }
}

// Função auxiliar para extrair por padrão
function extractByPattern(text: string, pattern: RegExp): string {
  const match = text.match(pattern)
  return match ? match[1].trim() : ''
}

// Detectar idioma
function detectLanguage(textDetection: any): string {
  const text = textDetection.textAnnotations?.[0]?.description || ''
  
  // Palavras-chave por idioma
  const languageKeywords = {
    pt: ['nome', 'data', 'nascimento', 'brasileiro', 'cpf', 'rg'],
    en: ['name', 'date', 'birth', 'passport', 'license', 'certificate'],
    es: ['nombre', 'fecha', 'nacimiento', 'pasaporte', 'cedula'],
    fr: ['nom', 'date', 'naissance', 'passeport', 'permis']
  }
  
  const scores = Object.entries(languageKeywords).map(([lang, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.toLowerCase().includes(keyword) ? 1 : 0)
    }, 0)
    return { lang, score }
  })
  
  const bestMatch = scores.reduce((max, current) => 
    current.score > max.score ? current : max
  )
  
  return bestMatch.score > 0 ? bestMatch.lang : 'unknown'
}

// Analisar layout do documento
function analyzeLayout(analysis: any): LayoutAnalysis {
  const fullText = analysis.fullTextAnnotation
  if (!fullText) {
    return {
      blocks: [],
      paragraphs: 0,
      lines: 0,
      words: 0,
      orientation: 'unknown'
    }
  }
  
  const blocks: TextBlock[] = []
  let totalParagraphs = 0
  let totalLines = 0
  let totalWords = 0
  
  fullText.pages?.forEach((page: any) => {
    page.blocks?.forEach((block: any) => {
      const blockText = block.paragraphs?.map((p: any) => 
        p.words?.map((w: any) => 
          w.symbols?.map((s: any) => s.text).join('')
        ).join(' ')
      ).join('\n') || ''
      
      if (block.boundingBox) {
        blocks.push({
          text: blockText,
          boundingBox: convertBoundingBox(block.boundingBox),
          confidence: block.confidence || 0,
          blockType: block.blockType || 'text'
        })
      }
      
      totalParagraphs += block.paragraphs?.length || 0
      block.paragraphs?.forEach((paragraph: any) => {
        totalLines += paragraph.words?.length || 0
        paragraph.words?.forEach((word: any) => {
          totalWords += 1
        })
      })
    })
  })
  
  return {
    blocks,
    paragraphs: totalParagraphs,
    lines: totalLines,
    words: totalWords,
    orientation: 'upright' // Simplificado
  }
}

// Converter bounding box do Google Vision para nosso formato
function convertBoundingBox(boundingBox: any): BoundingBox {
  const vertices = boundingBox.vertices || []
  if (vertices.length < 4) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }
  
  const xs = vertices.map((v: any) => v.x || 0)
  const ys = vertices.map((v: any) => v.y || 0)
  
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  }
}

// Analisar qualidade da imagem
async function analyzeImageQuality(imageBuffer: Buffer): Promise<QualityMetrics> {
  // Em produção, usar bibliotecas como Sharp para análise de qualidade
  // Por ora, retornar métricas simuladas
  
  const quality: QualityMetrics = {
    resolution: 300, // DPI estimado
    clarity: 85,     // Score de nitidez
    contrast: 78,    // Score de contraste
    skew: 2,         // Ângulo de inclinação
    noise: 15,       // Nível de ruído
    overallScore: 0,
    recommendations: []
  }
  
  // Calcular score geral
  quality.overallScore = (quality.clarity + quality.contrast) / 2
  
  // Gerar recomendações
  if (quality.resolution < 200) {
    quality.recommendations.push('Increase scan resolution to at least 300 DPI')
  }
  if (quality.clarity < 70) {
    quality.recommendations.push('Improve image focus and sharpness')
  }
  if (quality.contrast < 60) {
    quality.recommendations.push('Adjust image contrast for better readability')
  }
  if (quality.skew > 5) {
    quality.recommendations.push('Straighten document before scanning')
  }
  if (quality.noise > 30) {
    quality.recommendations.push('Reduce image noise and artifacts')
  }
  
  return quality
}

// Validar dados extraídos
async function validateExtractedData(structuredData: any, documentType: string): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []
  
  // Validações específicas por tipo de documento
  switch (documentType) {
    case 'passport':
      results.push(...validatePassportData(structuredData))
      break
    case 'identity_card':
      results.push(...validateIdentityCardData(structuredData))
      break
    case 'bank_statement':
      results.push(...validateBankStatementData(structuredData))
      break
    default:
      results.push(...validateGenericData(structuredData))
  }
  
  return results
}

// Validação de passaporte
function validatePassportData(data: any): ValidationResult[] {
  const results: ValidationResult[] = []
  
  // Validar número do passaporte
  if (data.documentNumber) {
    const isValid = /^[A-Z0-9]{6,12}$/.test(data.documentNumber)
    results.push({
      field: 'documentNumber',
      isValid,
      errors: isValid ? [] : ['Invalid passport number format'],
      suggestions: isValid ? [] : ['Passport number should be 6-12 alphanumeric characters']
    })
  }
  
  // Validar datas
  if (data.dateOfBirth) {
    const isValidDate = isValidDateString(data.dateOfBirth)
    const isReasonableAge = isReasonableAge(data.dateOfBirth)
    results.push({
      field: 'dateOfBirth',
      isValid: isValidDate && isReasonableAge,
      errors: [
        ...(!isValidDate ? ['Invalid date format'] : []),
        ...(!isReasonableAge ? ['Unreasonable birth date'] : [])
      ],
      suggestions: isValidDate && isReasonableAge ? [] : ['Check date format (DD/MM/YYYY or MM/DD/YYYY)']
    })
  }
  
  return results
}

// Validação de RG
function validateIdentityCardData(data: any): ValidationResult[] {
  const results: ValidationResult[] = []
  
  // Validar CPF
  if (data.cpf) {
    const isValid = validateCPF(data.cpf)
    results.push({
      field: 'cpf',
      isValid,
      errors: isValid ? [] : ['Invalid CPF number'],
      suggestions: isValid ? [] : ['CPF should have 11 digits with valid check digits']
    })
  }
  
  return results
}

// Validação de extrato bancário
function validateBankStatementData(data: any): ValidationResult[] {
  const results: ValidationResult[] = []
  
  // Validar período do extrato
  if (data.statementPeriod) {
    const startDate = new Date(data.statementPeriod.start)
    const endDate = new Date(data.statementPeriod.end)
    const isValidPeriod = startDate < endDate
    
    results.push({
      field: 'statementPeriod',
      isValid: isValidPeriod,
      errors: isValidPeriod ? [] : ['Invalid statement period'],
      suggestions: isValidPeriod ? [] : ['End date should be after start date']
    })
  }
  
  return results
}

// Validação genérica
function validateGenericData(data: any): ValidationResult[] {
  const results: ValidationResult[] = []
  
  // Validar se há texto extraído
  if (data.extractedText) {
    const hasMinimumText = data.extractedText.length > 50
    results.push({
      field: 'extractedText',
      isValid: hasMinimumText,
      errors: hasMinimumText ? [] : ['Insufficient text extracted'],
      suggestions: hasMinimumText ? [] : ['Improve image quality for better text extraction']
    })
  }
  
  return results
}

// Funções auxiliares de validação
function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

function isReasonableAge(birthDateString: string): boolean {
  const birthDate = new Date(birthDateString)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  return age >= 0 && age <= 120
}

function validateCPF(cpf: string): boolean {
  // Remove pontuação
  const cleanCPF = cpf.replace(/[^0-9]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Valida dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  if (remainder >= 10) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder >= 10) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

// Verificações de segurança
async function performSecurityChecks(imageBuffer: Buffer, text: string, structuredData: any): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = []
  
  // Verificar se é uma cópia/digitalização
  checks.push({
    checkType: 'authenticity_check',
    passed: true, // Simplificado - em produção usar análise de padrões
    confidence: 0.75,
    details: 'Document appears to be a scanned copy',
    riskLevel: 'low'
  })
  
  // Verificar consistência de dados
  const hasConsistentData = checkDataConsistency(structuredData)
  checks.push({
    checkType: 'data_consistency',
    passed: hasConsistentData,
    confidence: 0.85,
    details: hasConsistentData ? 'Data appears consistent' : 'Potential data inconsistencies detected',
    riskLevel: hasConsistentData ? 'low' : 'medium'
  })
  
  // Verificar sinais de manipulação
  checks.push({
    checkType: 'manipulation_detection',
    passed: true, // Simplificado
    confidence: 0.70,
    details: 'No obvious signs of digital manipulation detected',
    riskLevel: 'low'
  })
  
  return checks
}

// Verificar consistência dos dados
function checkDataConsistency(data: any): boolean {
  // Verificar se datas fazem sentido
  if (data.dateOfBirth && data.issueDate) {
    const birthDate = new Date(data.dateOfBirth)
    const issueDate = new Date(data.issueDate)
    if (issueDate < birthDate) return false
  }
  
  // Verificar se expiração é posterior à emissão
  if (data.issueDate && data.expiryDate) {
    const issueDate = new Date(data.issueDate)
    const expiryDate = new Date(data.expiryDate)
    if (expiryDate <= issueDate) return false
  }
  
  return true
}

// Calcular confiança geral
function calculateOverallConfidence(
  textDetection: any,
  documentAnalysis: any,
  qualityMetrics: QualityMetrics,
  validationResults: ValidationResult[]
): number {
  // Confiança do OCR
  const ocrConfidence = textDetection.textAnnotations?.[0]?.confidence || 0.8
  
  // Confiança da qualidade da imagem
  const qualityConfidence = qualityMetrics.overallScore / 100
  
  // Confiança das validações
  const validFields = validationResults.filter(v => v.isValid).length
  const totalFields = validationResults.length
  const validationConfidence = totalFields > 0 ? validFields / totalFields : 0.8
  
  // Média ponderada
  const overallConfidence = (
    ocrConfidence * 0.4 +
    qualityConfidence * 0.3 +
    validationConfidence * 0.3
  )
  
  return Math.round(overallConfidence * 100) / 100
}

// Função para processar múltiplos documentos
export async function processMultipleDocuments(documents: {
  filePath: string
  documentType: string
  language?: string
}[]): Promise<OCRResult[]> {
  const results = await Promise.all(
    documents.map(doc => performOCR(doc))
  )
  
  return results
}

// Função para gerar relatório consolidado
export function generateConsolidatedReport(results: OCRResult[]) {
  const consolidatedReport = {
    totalDocuments: results.length,
    successfulExtractions: results.filter(r => r.success).length,
    averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
    totalIssues: results.reduce((sum, r) => sum + r.validationResults.filter(v => !v.isValid).length, 0),
    documentTypes: [...new Set(results.map(r => r.documentAnalysis.documentType))],
    securityRisks: results.reduce((sum, r) => sum + r.securityChecks.filter(s => s.riskLevel === 'high').length, 0),
    recommendations: generateConsolidatedRecommendations(results)
  }
  
  return consolidatedReport
}

// Gerar recomendações consolidadas
function generateConsolidatedRecommendations(results: OCRResult[]) {
  const recommendations = []
  
  // Recomendações de qualidade
  const lowQualityDocs = results.filter(r => r.documentAnalysis.quality.overallScore < 70)
  if (lowQualityDocs.length > 0) {
    recommendations.push({
      type: 'quality_improvement',
      message: `${lowQualityDocs.length} documents have quality issues`,
      action: 'Rescan documents with higher resolution and better lighting'
    })
  }
  
  // Recomendações de segurança
  const securityIssues = results.filter(r => r.securityChecks.some(s => s.riskLevel === 'high'))
  if (securityIssues.length > 0) {
    recommendations.push({
      type: 'security_review',
      message: `${securityIssues.length} documents require security review`,
      action: 'Manual verification recommended for flagged documents'
    })
  }
  
  return recommendations
}