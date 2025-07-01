// Sistema de Tradução Automática para Documentos
// Integração com múltiplos provedores de tradução

interface TranslationRequest {
  text: string
  sourceLanguage: string
  targetLanguage: string
  documentType?: 'passport' | 'birth_certificate' | 'marriage_certificate' | 'academic_diploma' | 'employment_letter' | 'bank_statement' | 'medical_report' | 'police_clearance' | 'other'
  isOfficial?: boolean // Se precisa de tradução juramentada
}

interface TranslationResponse {
  success: boolean
  translatedText?: string
  confidence?: number
  provider?: string
  cost?: number
  estimatedTime?: string
  isOfficialTranslation?: boolean
  certificationNumber?: string
  error?: string
}

interface OfficialTranslator {
  id: string
  name: string
  languages: string[]
  specializations: string[]
  location: string
  email: string
  phone: string
  certification: string
  rating: number
  costPerPage: number
  turnaroundTime: string
  availability: boolean
}

interface DocumentForTranslation {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  pageCount: number
  sourceLanguage: string
  targetLanguage: string
  documentType: string
  isOfficial: boolean
  priority: 'normal' | 'urgent' | 'express'
}

class TranslationService {
  private readonly apiKeys = {
    google: process.env.GOOGLE_TRANSLATE_API_KEY,
    azure: process.env.AZURE_TRANSLATOR_KEY,
    aws: process.env.AWS_TRANSLATE_KEY,
    deepl: process.env.DEEPL_API_KEY
  }

  private readonly supportedLanguages = {
    'pt': { name: 'Português', code: 'pt-BR' },
    'en': { name: 'English', code: 'en-US' },
    'es': { name: 'Español', code: 'es-ES' },
    'fr': { name: 'Français', code: 'fr-FR' },
    'de': { name: 'Deutsch', code: 'de-DE' },
    'it': { name: 'Italiano', code: 'it-IT' },
    'nl': { name: 'Nederlands', code: 'nl-NL' },
    'sv': { name: 'Svenska', code: 'sv-SE' },
    'da': { name: 'Dansk', code: 'da-DK' },
    'no': { name: 'Norsk', code: 'no-NO' },
    'zh': { name: '中文', code: 'zh-CN' },
    'ja': { name: '日本語', code: 'ja-JP' },
    'ko': { name: '한국어', code: 'ko-KR' },
    'ar': { name: 'العربية', code: 'ar-SA' },
    'ru': { name: 'Русский', code: 'ru-RU' },
    'hi': { name: 'हिन्दी', code: 'hi-IN' }
  }

  private readonly officialTranslators: OfficialTranslator[] = [
    {
      id: 'translator-br-001',
      name: 'Ana Paula Santos Silva',
      languages: ['pt', 'en', 'es'],
      specializations: ['legal', 'academic', 'medical', 'business'],
      location: 'São Paulo, SP',
      email: 'ana.silva@tradutorajuramentada.com.br',
      phone: '+55 11 99999-0001',
      certification: 'JUCESP - Matrícula 1234',
      rating: 4.9,
      costPerPage: 45.00,
      turnaroundTime: '2-3 dias úteis',
      availability: true
    },
    {
      id: 'translator-br-002',
      name: 'Carlos Eduardo Mendes',
      languages: ['pt', 'en', 'fr', 'de'],
      specializations: ['academic', 'technical', 'immigration'],
      location: 'Rio de Janeiro, RJ',
      email: 'carlos.mendes@traducoes.com.br',
      phone: '+55 21 98888-0002',
      certification: 'JUCERJA - Matrícula 5678',
      rating: 4.8,
      costPerPage: 42.00,
      turnaroundTime: '1-2 dias úteis',
      availability: true
    },
    {
      id: 'translator-br-003',
      name: 'Mariana Costa Oliveira',
      languages: ['pt', 'en', 'it', 'es'],
      specializations: ['medical', 'pharmaceutical', 'immigration'],
      location: 'Brasília, DF',
      email: 'mariana.oliveira@tradutorjuramentado.com.br',
      phone: '+55 61 97777-0003',
      certification: 'TJDFT - Matrícula 9012',
      rating: 4.9,
      costPerPage: 48.00,
      turnaroundTime: '2-4 dias úteis',
      availability: true
    },
    {
      id: 'translator-br-004',
      name: 'Roberto Silva Fernandes',
      languages: ['pt', 'en', 'de', 'nl'],
      specializations: ['legal', 'business', 'immigration', 'academic'],
      location: 'Porto Alegre, RS',
      email: 'roberto.fernandes@traducoes-rs.com.br',
      phone: '+55 51 96666-0004',
      certification: 'JUCRS - Matrícula 3456',
      rating: 4.7,
      costPerPage: 40.00,
      turnaroundTime: '3-5 dias úteis',
      availability: true
    }
  ]

  // Tradução automática (não oficial)
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      if (request.isOfficial) {
        return this.requestOfficialTranslation(request)
      }

      // Tentar diferentes provedores em ordem de preferência
      const providers = ['deepl', 'google', 'azure', 'aws']
      
      for (const provider of providers) {
        try {
          const result = await this.translateWithProvider(request, provider)
          if (result.success) {
            return result
          }
        } catch (error) {
          console.warn(`Falha no provedor ${provider}:`, error)
        }
      }

      return {
        success: false,
        error: 'Todos os provedores de tradução falharam'
      }

    } catch (error) {
      console.error('Erro na tradução:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return {
        success: false,
        error: `Erro interno do serviço de tradução: ${errorMessage}`
      }
    }
  }

  // Tradução com provedor específico
  private async translateWithProvider(request: TranslationRequest, provider: string): Promise<TranslationResponse> {
    const cost = this.calculateTranslationCost(request.text, provider, false)
    
    switch (provider) {
      case 'deepl':
        return this.translateWithDeepL(request, cost)
      case 'google':
        return this.translateWithGoogle(request, cost)
      case 'azure':
        return this.translateWithAzure(request, cost)
      case 'aws':
        return this.translateWithAWS(request, cost)
      default:
        throw new Error(`Provedor não suportado: ${provider}`)
    }
  }

  // DeepL - Melhor qualidade para idiomas suportados
  private async translateWithDeepL(request: TranslationRequest, cost: number): Promise<TranslationResponse> {
    // Simular API do DeepL
    await this.delay(1500)

    if (!this.apiKeys.deepl) {
      throw new Error('Chave API DeepL não configurada')
    }

    // Simular tradução de alta qualidade
    const mockTranslation = this.generateMockTranslation(request.text, request.targetLanguage, 0.95)

    return {
      success: true,
      translatedText: mockTranslation,
      confidence: 0.95,
      provider: 'DeepL',
      cost,
      estimatedTime: 'Instantâneo',
      isOfficialTranslation: false
    }
  }

  // Google Translate
  private async translateWithGoogle(request: TranslationRequest, cost: number): Promise<TranslationResponse> {
    await this.delay(1000)

    if (!this.apiKeys.google) {
      throw new Error('Chave API Google não configurada')
    }

    const mockTranslation = this.generateMockTranslation(request.text, request.targetLanguage, 0.85)

    return {
      success: true,
      translatedText: mockTranslation,
      confidence: 0.85,
      provider: 'Google Translate',
      cost,
      estimatedTime: 'Instantâneo',
      isOfficialTranslation: false
    }
  }

  // Azure Translator
  private async translateWithAzure(request: TranslationRequest, cost: number): Promise<TranslationResponse> {
    await this.delay(1200)

    if (!this.apiKeys.azure) {
      throw new Error('Chave API Azure não configurada')
    }

    const mockTranslation = this.generateMockTranslation(request.text, request.targetLanguage, 0.88)

    return {
      success: true,
      translatedText: mockTranslation,
      confidence: 0.88,
      provider: 'Azure Translator',
      cost,
      estimatedTime: 'Instantâneo',
      isOfficialTranslation: false
    }
  }

  // AWS Translate
  private async translateWithAWS(request: TranslationRequest, cost: number): Promise<TranslationResponse> {
    await this.delay(1800)

    if (!this.apiKeys.aws) {
      throw new Error('Chave API AWS não configurada')
    }

    const mockTranslation = this.generateMockTranslation(request.text, request.targetLanguage, 0.82)

    return {
      success: true,
      translatedText: mockTranslation,
      confidence: 0.82,
      provider: 'AWS Translate',
      cost,
      estimatedTime: 'Instantâneo',
      isOfficialTranslation: false
    }
  }

  // Lógica para tradução juramentada
  private async requestOfficialTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    const suitableTranslators = this.findSuitableTranslators(
      request.sourceLanguage,
      request.targetLanguage,
      request.documentType
    )

    if (suitableTranslators.length === 0) {
      return {
        success: false,
        error: 'Nenhum tradutor juramentado disponível para os idiomas e especialização solicitados.'
      }
    }

    // Selecionar o tradutor com melhor custo-benefício (rating/cost)
    const sortedTranslators = suitableTranslators.sort((a, b) => {
      const scoreA = a.rating / a.costPerPage
      const scoreB = b.rating / b.costPerPage
      return scoreB - scoreA
    })
    
    const bestTranslator = sortedTranslators[0]
    
    if (!bestTranslator) {
        return {
            success: false,
            error: 'Could not determine the best translator.'
        }
    }

    // Simular o processo de envio e aceite
    await this.delay(500)

    // Custo estimado (simplificado)
    const pageCount = Math.ceil(request.text.length / 2500) // 2500 caracteres por página
    const estimatedCost = pageCount * bestTranslator.costPerPage

    return {
      success: true,
      provider: 'Tradutor Juramentado',
      cost: estimatedCost,
      estimatedTime: bestTranslator.turnaroundTime,
      isOfficialTranslation: true,
      certificationNumber: `Aguardando aceite de ${bestTranslator.name}`,
      translatedText: `Seu documento foi enviado para ${bestTranslator.name} (${bestTranslator.email}).`
    }
  }

  private findSuitableTranslators(
    sourceLanguage: string, 
    targetLanguage: string, 
    documentType?: string
  ): OfficialTranslator[] {
    return this.officialTranslators.filter(translator => 
      translator.availability &&
      translator.languages.includes(sourceLanguage) &&
      translator.languages.includes(targetLanguage) &&
      (!documentType || this.hasSpecialization(translator, documentType))
    )
  }

  private hasSpecialization(translator: OfficialTranslator, documentType: string): boolean {
    const specializationMap: Record<string, string[]> = {
      passport: ['legal', 'immigration'],
      birth_certificate: ['legal', 'immigration'],
      marriage_certificate: ['legal', 'immigration'],
      academic_diploma: ['academic'],
      employment_letter: ['business', 'legal'],
      bank_statement: ['business', 'legal'],
      medical_report: ['medical'],
      police_clearance: ['legal'],
      other: ['general']
    }
    
    const requiredSpecializations = specializationMap[documentType] || ['general']
    return requiredSpecializations.some(spec => translator.specializations.includes(spec))
  }

  // Traduzir um documento completo (upload)
  async translateDocument(document: DocumentForTranslation): Promise<{
    success: boolean
    translationId?: string
    estimatedCost?: number
    estimatedDelivery?: string
    translator?: string
    error?: string
  }> {
    try {
      if (!document.isOfficial) {
        return {
          success: false,
          error: 'Tradução automática de documentos completos ainda não implementada. Use a tradução de texto.'
        }
      }

      const translators = this.findSuitableTranslators(
        document.sourceLanguage,
        document.targetLanguage,
        document.documentType
      )

      if (translators.length === 0) {
        return { success: false, error: 'Nenhum tradutor qualificado encontrado.' }
      }

      // Lógica de prioridade e custo
      const baseTranslator = translators[0]
      if(!baseTranslator) {
        return { success: false, error: 'Nenhum tradutor qualificado encontrado.' }
      }
      let costMultiplier = 1
      if (document.priority === 'urgent') costMultiplier = 1.5
      if (document.priority === 'express') costMultiplier = 2.0

      const estimatedCost = document.pageCount * baseTranslator.costPerPage * costMultiplier

      // Simular criação de um job de tradução
      const translationId = `doc-trans-${Date.now()}`

      return {
        success: true,
        translationId,
        estimatedCost,
        estimatedDelivery: baseTranslator.turnaroundTime,
        translator: baseTranslator.name
      }

    } catch (error) {
      console.error('Erro ao processar tradução de documento:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return { success: false, error: `Falha no sistema: ${errorMessage}` }
    }
  }

  getSupportedLanguages(): Record<string, { name: string, code: string }> {
    return this.supportedLanguages
  }

  getAvailableTranslators(sourceLanguage?: string, targetLanguage?: string): OfficialTranslator[] {
    if (sourceLanguage && targetLanguage) {
      return this.officialTranslators.filter(t => 
        t.languages.includes(sourceLanguage) && t.languages.includes(targetLanguage)
      )
    }
    return this.officialTranslators
  }

  private calculateTranslationCost(text: string, provider: string, isOfficial: boolean): number {
    const characters = text.length
    
    if (isOfficial) {
      return 0 // Custo de tradução juramentada é por página
    }
    
    let costPerChar = 0.00015 // Custo base (Google)
    
    switch (provider) {
      case 'deepl':
        costPerChar = 0.00020
        break
      case 'azure':
        costPerChar = 0.00018
        break
      case 'aws':
        costPerChar = 0.00016
        break
    }

    return characters * costPerChar
  }

  private generateMockTranslation(text: string, targetLanguage: string, confidence: number): string {
    return `[${targetLanguage.toUpperCase()}] Mock translation of: "${text.substring(0, 50)}..." (Confidence: ${confidence * 100}%)`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const translationService = new TranslationService()

// Types export
export type { 
  TranslationRequest, 
  TranslationResponse, 
  OfficialTranslator, 
  DocumentForTranslation 
}