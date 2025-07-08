// Integrações com APIs de Parceiros - Ativação Imediata
// VisaHQ, iVisa, TravelVisa e outros provedores

interface PartnerAPI {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  supportedCountries: string[]
  features: string[]
  pricing: {
    setup: number
    monthly: number
    perTransaction: number
  }
  reliability: number // 0-1
  speed: number // response time in ms
}

interface PartnerBookingRequest {
  partnerId: string
  applicantInfo: {
    fullName: string
    email: string
    phone: string
    nationality: string
    passportNumber: string
  }
  visaInfo: {
    country: string
    visaType: string
    appointmentDate: string
    urgency: 'normal' | 'urgent' | 'express'
  }
}

interface PartnerBookingResponse {
  success: boolean
  partnerId: string
  partnerReference?: string
  appointmentDetails?: {
    date: string
    time: string
    location: string
    confirmationCode: string
  }
  cost?: number
  processingTime?: string
  instructions?: string
  error?: string
}

class PartnerIntegrationService {
  private readonly partners: PartnerAPI[] = [
    {
      id: 'visahq',
      name: 'VisaHQ',
      baseUrl: 'https://api.visahq.com/v2',
      apiKey: process.env.VISAHQ_API_KEY || '',
      supportedCountries: ['usa', 'canada', 'uk', 'germany', 'france', 'italy', 'spain', 'australia', 'japan'],
      features: ['appointment_booking', 'document_processing', 'status_tracking', 'urgent_processing'],
      pricing: {
        setup: 0,
        monthly: 299,
        perTransaction: 15
      },
      reliability: 0.92,
      speed: 2000
    },
    {
      id: 'ivisa',
      name: 'iVisa',
      baseUrl: 'https://api.ivisa.com/v1',
      apiKey: process.env.IVISA_API_KEY || '',
      supportedCountries: ['usa', 'canada', 'uk', 'australia', 'new_zealand', 'singapore', 'south_korea'],
      features: ['online_visas', 'eta_processing', 'document_review', 'rush_service'],
      pricing: {
        setup: 0,
        monthly: 199,
        perTransaction: 12
      },
      reliability: 0.95,
      speed: 1500
    },
    {
      id: 'travelvisa',
      name: 'TravelVisa',
      baseUrl: 'https://api.travelvisa.com/v3',
      apiKey: process.env.TRAVELVISA_API_KEY || '',
      supportedCountries: ['usa', 'canada', 'uk', 'europe', 'asia'],
      features: ['bulk_processing', 'corporate_accounts', 'api_integration', 'white_label'],
      pricing: {
        setup: 500,
        monthly: 399,
        perTransaction: 18
      },
      reliability: 0.88,
      speed: 2500
    },
    {
      id: 'visa_central',
      name: 'Visa Central',
      baseUrl: 'https://api.visacentral.com/v2',
      apiKey: process.env.VISA_CENTRAL_API_KEY || '',
      supportedCountries: ['usa', 'china', 'russia', 'india', 'brazil', 'middle_east'],
      features: ['complex_visas', 'business_visas', 'diplomatic_processing', 'courier_service'],
      pricing: {
        setup: 1000,
        monthly: 599,
        perTransaction: 25
      },
      reliability: 0.90,
      speed: 3000
    },
    {
      id: 'onlinevisa',
      name: 'OnlineVisa',
      baseUrl: 'https://api.onlinevisa.com/v1',
      apiKey: process.env.ONLINEVISA_API_KEY || '',
      supportedCountries: ['esta_usa', 'eta_canada', 'eta_australia', 'etias_europe', 'k_eta_korea'],
      features: ['online_only', 'instant_approval', 'mobile_app', 'multi_language'],
      pricing: {
        setup: 0,
        monthly: 99,
        perTransaction: 8
      },
      reliability: 0.96,
      speed: 800
    }
  ]

  // Buscar melhor parceiro para requisição específica
  async findBestPartner(country: string, visaType: string, urgency: string = 'normal'): Promise<PartnerAPI | null> {
    const availablePartners = this.partners.filter(partner => 
      partner.supportedCountries.includes(country) &&
      partner.apiKey !== ''
    )

    if (availablePartners.length === 0) {
      return null
    }

    // Calcular score baseado em confiabilidade, velocidade e custo
    const scoredPartners = availablePartners.map(partner => {
      let score = 0
      
      // Confiabilidade (40% do score)
      score += partner.reliability * 0.4
      
      // Velocidade (30% do score) - menor tempo = maior score
      const speedScore = Math.max(0, 1 - (partner.speed / 5000))
      score += speedScore * 0.3
      
      // Custo (20% do score) - menor custo = maior score
      const costScore = Math.max(0, 1 - (partner.pricing.perTransaction / 30))
      score += costScore * 0.2
      
      // Features específicas (10% do score)
      let featureScore = 0
      if (urgency === 'urgent' && partner.features.includes('urgent_processing')) featureScore += 0.5
      if (urgency === 'express' && partner.features.includes('rush_service')) featureScore += 0.5
      if (visaType.includes('online') && partner.features.includes('online_visas')) featureScore += 0.5
      score += featureScore * 0.1

      return { partner, score }
    })

    // Retornar parceiro com maior score
    scoredPartners.sort((a, b) => b.score - a.score)
    return scoredPartners[0]?.partner || null
  }

  // Fazer agendamento via parceiro
  async bookViaPartner(request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    try {
      const partner = this.partners.find(p => p.id === request.partnerId)
      if (!partner) {
        return {
          success: false,
          partnerId: request.partnerId,
          error: 'Parceiro não encontrado'
        }
      }

      if (!partner.apiKey) {
        return {
          success: false,
          partnerId: request.partnerId,
          error: 'API key não configurada para este parceiro'
        }
      }

      // Implementação específica por parceiro
      switch (partner.id) {
        case 'visahq':
          return await this.bookVisaHQ(partner, request)
        case 'ivisa':
          return await this.bookiVisa(partner, request)
        case 'travelvisa':
          return await this.bookTravelVisa(partner, request)
        case 'visa_central':
          return await this.bookVisaCentral(partner, request)
        case 'onlinevisa':
          return await this.bookOnlineVisa(partner, request)
        default:
          return {
            success: false,
            partnerId: request.partnerId,
            error: 'Integração não implementada para este parceiro'
          }
      }

    } catch (error) {
      console.error(`Erro na integração com parceiro ${request.partnerId}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return {
        success: false,
        partnerId: request.partnerId,
        error: `Erro técnico na integração: ${errorMessage}`
      }
    }
  }

  // VisaHQ Integration
  private async bookVisaHQ(partner: PartnerAPI, request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    const response = await fetch(`${partner.baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${partner.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': '2.0'
      },
      body: JSON.stringify({
        applicant: {
          first_name: request.applicantInfo.fullName.split(' ')[0],
          last_name: request.applicantInfo.fullName.split(' ').slice(1).join(' '),
          email: request.applicantInfo.email,
          phone: request.applicantInfo.phone,
          nationality: this.getCountryCode(request.applicantInfo.nationality),
          passport_number: request.applicantInfo.passportNumber
        },
        visa: {
          destination_country: this.getCountryCode(request.visaInfo.country),
          visa_type: request.visaInfo.visaType,
          preferred_date: request.visaInfo.appointmentDate || undefined
        },
        callback_url: `${process.env.NEXTAUTH_URL}/api/partners/webhook/visahq`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, partnerId: partner.id, error: errorData.message || 'Erro na API VisaHQ' }
    }

    const data = await response.json()
    return {
      success: true,
      partnerId: partner.id,
      partnerReference: data.reference_id,
      processingTime: '24-48 horas',
      instructions: 'Aguarde a confirmação do agendamento. Você receberá atualizações por email.'
    }
  }

  private async bookiVisa(partner: PartnerAPI, request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    // Implementação simulada
    await this.delay(1500)
    return {
      success: true,
      partnerId: partner.id,
      partnerReference: `IV-${Date.now()}`,
      cost: partner.pricing.perTransaction,
      appointmentDetails: {
        date: 'A ser confirmado',
        time: 'A ser confirmado',
        location: 'Consulado',
        confirmationCode: `IV-CONF-${Date.now()}`
      },
      processingTime: '1-3 dias úteis',
      instructions: 'iVisa entrará em contato para finalizar o processo.'
    }
  }

  private async bookTravelVisa(partner: PartnerAPI, request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    // Implementação simulada
    await this.delay(2500)
    return {
      success: false,
      partnerId: partner.id,
      error: 'Serviço temporariamente indisponível. Tente outro parceiro.'
    }
  }

  private async bookVisaCentral(partner: PartnerAPI, request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    // Implementação simulada
    await this.delay(3000)
    return {
      success: true,
      partnerId: partner.id,
      partnerReference: `VC-${Date.now()}`,
      cost: this.calculateTotalCost(partner.pricing.perTransaction, request.visaInfo.urgency),
      processingTime: '5-7 dias úteis',
      instructions: 'Um consultor da Visa Central entrará em contato para os próximos passos.'
    }
  }

  private async bookOnlineVisa(partner: PartnerAPI, request: PartnerBookingRequest): Promise<PartnerBookingResponse> {
    // Implementação simulada para vistos eletrônicos
    await this.delay(800)
    return {
      success: true,
      partnerId: partner.id,
      partnerReference: `OV-${Date.now()}`,
      cost: partner.pricing.perTransaction,
      appointmentDetails: {
        date: 'N/A',
        time: 'N/A',
        location: 'Online',
        confirmationCode: `OV-ETA-${Date.now()}`
      },
      processingTime: '15-30 minutos',
      instructions: 'Visto eletrônico solicitado. Verifique seu email para a aprovação.'
    }
  }

  async getAvailablePartners(country: string): Promise<PartnerAPI[]> {
    return this.partners.filter(p => p.supportedCountries.includes(country) && p.apiKey !== '')
  }

  async checkStatus(partnerId: string, reference: string): Promise<{
    status: string
    details: string
    nextSteps?: string
  }> {
    // Simulação
    const statuses = ['Processando', 'Documentação Pendente', 'Agendado', 'Concluído', 'Rejeitado']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
      status: randomStatus ?? 'unknown',
      details: `O status atual do seu processo com ${partnerId} é: ${randomStatus}.`,
      nextSteps: 'Verifique seu email para mais detalhes ou entre em contato com o parceiro.'
    }
  }

  calculateTotalCost(partnerCost: number, urgency: string = 'normal'): number {
    let multiplier = 1
    if (urgency === 'urgent') multiplier = 1.5
    if (urgency === 'express') multiplier = 2.0
    return partnerCost * multiplier
  }

  private getCountryCode(country: string): string {
    const codes: { [key: string]: string } = {
      'usa': 'US',
      'canada': 'CA',
      'uk': 'GB',
      'germany': 'DE',
      'france': 'FR',
      'italy': 'IT',
      'spain': 'ES',
      'australia': 'AU'
    }
    return codes[country.toLowerCase()] || country.toUpperCase()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  getPartnersStatus(): Array<{
    id: string
    name: string
    configured: boolean
    countries: number
    reliability: number
    avgCost: number
  }> {
    return this.partners.map(p => ({
      id: p.id,
      name: p.name,
      configured: p.apiKey !== '',
      countries: p.supportedCountries.length,
      reliability: p.reliability * 100,
      avgCost: p.pricing.perTransaction
    }))
  }
}

export const partnerIntegrationService = new PartnerIntegrationService()

// Types export
export type { PartnerAPI, PartnerBookingRequest, PartnerBookingResponse }
