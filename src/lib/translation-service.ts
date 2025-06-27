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
        return await this.requestOfficialTranslation(request)
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
          continue
        }
      }

      return {
        error: 'Todos os provedores de tradução falharam'
      }

    } catch (error) {
      console.error('Erro na tradução:', error)
      return {
        error: 'Erro interno do serviço de tradução'
      }
    }
  }

  // Tradução com provedor específico

  private async translateWithProvider(request: TranslationRequest, provider: string): Promise<TranslationResponse> {
    const cost = this.calculateTranslationCost(request.text, provider, false)
    
    switch (provider) {
      case 'deepl':
        return await this.translateWithDeepL(request, cost)
      case 'google':
        return await this.translateWithGoogle(request, cost)
      case 'azure':
        return await this.translateWithAzure(request, cost)
      case 'aws':
        return await this.translateWithAWS(request, cost)
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
    await this.delay(1100)

    if (!this.apiKeys.aws) {
      throw new Error('Chave API AWS não configurada')
    }

    const mockTranslation = this.generateMockTranslation(request.text, request.targetLanguage, 0.82)

    return {
      translatedText: mockTranslation,
      confidence: 0.82,
      provider: 'AWS Translate',
      cost,
      estimatedTime: 'Instantâneo',
      isOfficialTranslation: false
    }
  }

  // Solicitar tradução juramentada/oficial

  private async requestOfficialTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      // Encontrar tradutor adequado
      const availableTranslators = this.findSuitableTranslators(
        request.sourceLanguage, 
        request.targetLanguage, 
        request.documentType
      )

      if (availableTranslators.length === 0) {
        return {
          error: 'Nenhum tradutor juramentado disponível para este par de idiomas'
        }
      }

      // Selecionar o melhor tradutor (por rating e disponibilidade)

      const selectedTranslator = availableTranslators[0]
      
      const wordCount = request.text.split(' ').length
      const estimatedPages = Math.ceil(wordCount / 250) // ~250 palavras por página,      const cost = estimatedPages * selectedTranslator.costPerPage

      // Simular envio da solicitação

      await this.delay(2000)

      const certificationNumber = this.generateCertificationNumber()

      return {
        translatedText: 'Tradução oficial será entregue em ' + selectedTranslator.turnaroundTime,
        confidence: 1.0,
        provider: selectedTranslator.name,
        cost,
        estimatedTime: selectedTranslator.turnaroundTime,
        isOfficialTranslation: true,
        certificationNumber
      }

    } catch (error) {
      return {
        error: 'Erro ao processar solicitação de tradução oficial'
      }
    }
  }

  // Buscar tradutores adequados

  private findSuitableTranslators(
    sourceLanguage: string, 
    targetLanguage: string, 
    documentType?: string
  ): OfficialTranslator[] {
    return this.officialTranslators
      .filter(translator => 
        translator.availability &&
        translator.languages.includes(sourceLanguage) &&
        translator.languages.includes(targetLanguage) &&
        (!documentType || this.hasSpecialization(translator, documentType))
      )
      .sort((a, b) => b.rating - a.rating)
  }

  // Verificar especialização do tradutor

  private hasSpecialization(translator: OfficialTranslator, documentType: string): boolean {
    const specializationMap: Record<string, string[]> = {
      'birth_certificate': ['legal', 'civil'],
      'marriage_certificate': ['legal', 'civil'],
      'academic_diploma': ['academic', 'educational'],
      'employment_letter': ['business', 'corporate'],
      'medical_report': ['medical', 'health'],
      'police_clearance': ['legal', 'criminal'],
      'bank_statement': ['financial', 'business']
    }

    const requiredSpecs = specializationMap[documentType] || ['legal']
    return requiredSpecs.some(spec => 
      translator.specializations.some(ts => ts.includes(spec))
    )
  }

  // Traduzir documento completo

  async translateDocument(document: DocumentForTranslation): Promise<{
    success: boolean
    translationId?: string
    estimatedCost?: number
    estimatedDelivery?: string
    translator?: string
    error?: string
  }> {
    try {
      if (document.isOfficial) {
        const translators = this.findSuitableTranslators(
          document.sourceLanguage, 
          document.targetLanguage, 
          document.documentType
        )

        if (translators.length === 0) {
          return {
            error: 'Nenhum tradutor juramentado disponível'
          }
        }

        const selectedTranslator = translators[0]
        const cost = document.pageCount * selectedTranslator.costPerPage

        // Aplicar urgência

        const urgencyMultiplier = {
          'normal': 1.0,
          'urgent': 1.5,
          'express': 2.0
        }[document.priority]

        const finalCost = cost * urgencyMultiplier
        const deliveryTime = this.calculateDeliveryTime(selectedTranslator.turnaroundTime, document.priority)

        return {
          translationId: 'TRANS-' + Date.now(),
          estimatedCost: finalCost,
          estimatedDelivery: deliveryTime,
          translator: selectedTranslator.name
        }
      } else {
        // Tradução automática para documentos não oficiais
        const baseCost = document.pageCount * 2.50 // R$ 2,50 por página para tradução automática
        
        return {
          translationId: 'AUTO-' + Date.now(),
          estimatedCost: baseCost,
          estimatedDelivery: 'Até 30 minutos',
          translator: 'Sistema Automático'
        }
      }

    } catch (error) {
      return {
        error: 'Erro ao processar documento para tradução'
      }
    }
  }

  // Obter idiomas suportados

  getSupportedLanguages(): typeof this.supportedLanguages {
    return this.supportedLanguages
  }

  // Obter tradutores disponíveis

  getAvailableTranslators(sourceLanguage?: string, targetLanguage?: string): OfficialTranslator[] {
    let translators = this.officialTranslators.filter(t => t.availability)

    if (sourceLanguage && targetLanguage) {
      translators = translators.filter(t => 
        t.languages.includes(sourceLanguage) && t.languages.includes(targetLanguage)
      )
    }

    return translators.sort((a, b) => b.rating - a.rating)
  }

  // Métodos auxiliares privados

  private calculateTranslationCost(text: string, provider: string, isOfficial: boolean): number {
    const characterCount = text.length
    
    if (isOfficial) {
      const wordCount = text.split(' ').length
      const pageCount = Math.ceil(wordCount / 250)
      return pageCount * 45.00 // Média R$ 45 por página    }

    // Preços por 1000 caracteres para tradução automática

    const rates: Record<string, number> = {
      'deepl': 0.02,    // R$ 0,02 por 1000 chars,      'google': 0.015,  // R$ 0,015 por 1000 chars
      'azure': 0.018,   // R$ 0,018 por 1000 chars,      'aws': 0.016      // R$ 0,016 por 1000 chars
    }

    const rate = rates[provider] || 0.02
    return Math.max(0.50, (characterCount / 1000) * rate) // Mínimo R$ 0,50  }

  private calculateDeliveryTime(baseTime: string, priority: string): string {
    if (priority === 'express') {
      return 'Até 24 horas'
    } else if (priority === 'urgent') {
      return baseTime.replace(/(\d+)-(\d+)/, (match, min, max) => {
        return `${Math.ceil(parseInt(min) / 2)}-${Math.ceil(parseInt(max) / 2)}`
      })
    }
    return baseTime
  }

  private generateMockTranslation(text: string, targetLanguage: string, confidence: number): string {
    // Simulação simples de tradução
    const translations: Record<string, string> = {
      'en': text.replace(/português|brasil/gi, 'english|america'),
      'es': text.replace(/português|brasil/gi, 'español|américa'),
      'fr': text.replace(/português|brasil/gi, 'français|amérique'),
      'de': text.replace(/português|brasil/gi, 'deutsch|amerika'),
      'it': text.replace(/português|brasil/gi, 'italiano|america')
    }

    return translations[targetLanguage] || `[TRADUZIDO PARA ${targetLanguage.toUpperCase()}] ${text}`
  }

  private generateCertificationNumber(): string {
    return 'CERT-' + Date.now().toString().slice(-8) + '-' + 
           Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const translationService = new TranslationService()

// Types export
export type { 
  TranslationRequest, 
  TranslationResponse, 
  OfficialTranslator, 
  DocumentForTranslation 
}