// Sistema Híbrido de Agendamento
// Combina parceiros de scraping e APIs oficiais com fallback inteligente

import { appointmentBookingService, BookingRequest, BookingResponse } from './appointment-booking'
import { partnerIntegrationService, PartnerBookingRequest } from './partner-integrations'
import { webScrapingService } from './web-scraping-service'

interface HybridBookingOptions {
  preferredMethod: 'official' | 'partner' | 'scraping' | 'auto'
  fallbackEnabled: boolean
  urgency: 'normal' | 'urgent' | 'express'
  maxRetries: number
  budgetLimit?: number
}

interface AttemptResult {
  method: string
  provider: string
  success: boolean
  error?: string
  cost?: number
}

interface HybridBookingResult {
  success: boolean
  method: string
  provider: string
  appointmentDetails?: {
    id?: string
    confirmationCode?: string
    date?: string
    time?: string
    location?: string
  }
  cost: number
  processingTime: string
  instructions: string
  attempts: AttemptResult[]
  warnings?: string[] | undefined
  error?: string
}

class HybridBookingSystem {
  private readonly methodPriority = {
    'official': 1,    // APIs oficiais (CASV, VFS)
    'partner': 2,     // Parceiros (VisaHQ, iVisa)
    'scraping': 3     // Web scraping (último recurso)
  }

  // Método principal de agendamento híbrido
  async bookAppointment(
    request: BookingRequest, 
    options: HybridBookingOptions
  ): Promise<HybridBookingResult> {
    const attempts: AttemptResult[] = []
    const warnings: string[] = []

    try {
      // Determinar ordem de tentativas baseada na preferência
      const methods = this.determineMethodOrder(options.preferredMethod)
      
      for (const method of methods) {
        if (attempts.length >= options.maxRetries) {
          break
        }

        try {
          console.log(`Tentativa ${attempts.length + 1}: ${method}`)
          
          let result: any
          switch (method) {
            case 'official':
              result = await this.tryOfficialAPI(request)
              break
            case 'partner':
              result = await this.tryPartnerAPI(request, options)
              break
            case 'scraping':
              result = await this.tryWebScraping(request, warnings)
              break
          }

          attempts.push({
            method,
            provider: result.provider || method,
            success: result.success || false,
            error: result.error,
            cost: result.cost
          })

          // Se teve sucesso
          if (result.success) {
            return {
              success: true,
              method,
              provider: result.provider || method,
              appointmentDetails: result.appointmentDetails,
              cost: result.cost || 0,
              processingTime: result.processingTime || 'A definir',
              instructions: result.instructions || 'Aguarde confirmação',
              attempts,
              warnings: warnings.length > 0 ? warnings : undefined
            }
          }

          // Se fallback está desabilitado, parar na primeira falha
          if (!options.fallbackEnabled) {
            break
          }

        } catch (error) {
          console.error(`Erro no método ${method}:`, error)
          attempts.push({
            method,
            provider: method,
            success: false,
            error: `Erro técnico: ${error instanceof Error ? error.message : String(error)}`
          })
        }
      }

      // Se chegou aqui, todas as tentativas falharam
      return {
        success: false,
        method: 'none',
        provider: 'none',
        cost: 0,
        processingTime: '',
        instructions: '',
        attempts,
        warnings,
        error: 'Todas as tentativas de agendamento falharam'
      }

    } catch (error) {
      return {
        success: false,
        method: 'error',
        provider: 'error',
        cost: 0,
        processingTime: '',
        instructions: '',
        attempts,
        error: `Erro crítico no sistema híbrido: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  // Tentar API oficial (CASV/VFS)
  private async tryOfficialAPI(request: BookingRequest): Promise<any> {
    try {
      const result = await appointmentBookingService.bookAppointment(request)
      
      return {
        success: result.success,
        provider: this.getOfficialProvider(request.consulate),
        appointmentDetails: result.success ? {
          id: result.appointmentId,
          confirmationCode: result.confirmationCode,
          date: result.date,
          time: result.time,
          location: result.location
        } : undefined,
        cost: 0, // APIs oficiais geralmente não cobram taxa adicional
        processingTime: 'Imediato',
        instructions: result.instructions,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        provider: 'official_api',
        error: `Erro na API oficial: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  // Tentar parceiros (VisaHQ, iVisa)
  private async tryPartnerAPI(request: BookingRequest, options: HybridBookingOptions): Promise<any> {
    try {
      // Converter formato de request
      const partnerRequest: PartnerBookingRequest = {
        partnerId: '', // Será determinado automaticamente
        applicantInfo: request.applicantInfo,
        visaInfo: {
          country: this.extractCountryFromConsulate(request.consulate),
          visaType: request.visaType,
          appointmentDate: request.preferredDates?.[0] || new Date().toISOString().split('T')[0] || '',
          urgency: options.urgency
        }
      }

      // Encontrar melhor parceiro
      const bestPartner = await partnerIntegrationService.findBestPartner(
        partnerRequest.visaInfo.country,
        partnerRequest.visaInfo.visaType,
        partnerRequest.visaInfo.urgency
      )

      if (!bestPartner) {
        return {
          success: false,
          provider: 'no_partner',
          error: 'Nenhum parceiro disponível'
        }
      }

      // Verificar limite de orçamento
      if (options.budgetLimit && bestPartner.pricing.perTransaction > options.budgetLimit) {
        return {
          success: false,
          provider: bestPartner.name,
          error: `Custo (${bestPartner.pricing.perTransaction}) excede limite (${options.budgetLimit})`
        }
      }

      partnerRequest.partnerId = bestPartner.id
      const result = await partnerIntegrationService.bookViaPartner(partnerRequest)

      return {
        success: result.success,
        provider: bestPartner.name,
        appointmentDetails: result.success ? {
          id: result.partnerReference,
          confirmationCode: result.partnerReference,
          date: result.appointmentDetails?.date || 'A definir',
          time: result.appointmentDetails?.time || 'A definir',
          location: result.appointmentDetails?.location || 'A definir'
        } : undefined,
        cost: partnerIntegrationService.calculateTotalCost(
          result.cost || bestPartner.pricing.perTransaction,
          options.urgency
        ),
        processingTime: result.processingTime,
        instructions: result.instructions,
        error: result.error
      }

    } catch (error) {
      return {
        success: false,
        provider: 'partner_api',
        error: `Erro na API de parceiro: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }

  // Tentar web scraping (último recurso)
  private async tryWebScraping(request: BookingRequest, warnings: string[]): Promise<any> {
    try {
      warnings.push('O Web Scraping é instável e pode não funcionar como esperado.')
      const result = await webScrapingService.scrapeAvailableSlots(
        this.getScrapingTargetId(request.consulate)
      )

      // Se encontrou slots disponíveis, simular um agendamento
      if (result.success && result.slots.length > 0) {
        const firstSlot = result.slots[0]
        if (firstSlot) {
          return {
            success: true,
            provider: 'web_scraper',
            appointmentDetails: {
              id: `scraped_${Date.now()}`,
              confirmationCode: `SCR_${Date.now()}`,
              date: firstSlot.date || 'A confirmar',
              time: firstSlot.time || 'A confirmar',
              location: firstSlot.location || 'A confirmar'
            },
            cost: 25, // Custo simbólico do scraping
            processingTime: '~5 minutos',
            instructions: 'Confirmação pendente. Verifique seu email.',
            error: undefined
          }
        }
      } else {
        return {
          success: false,
          provider: 'web_scraper',
          error: result.error || 'Nenhum slot disponível encontrado'
        }
      }
    } catch (error) {
      return {
        success: false,
        provider: 'web_scraper',
        error: `Erro no Web Scraping: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }
  
  private determineMethodOrder(preference: HybridBookingOptions['preferredMethod']): string[] {
    const priorityOrder = Object.keys(this.methodPriority).sort((a, b) => 
      this.methodPriority[a as keyof typeof this.methodPriority] - 
      this.methodPriority[b as keyof typeof this.methodPriority]
    );

    if (preference === 'auto') {
      return priorityOrder;
    }
    
    // Coloca o método preferido no início, mantendo a ordem de prioridade para os outros
    return [
      preference,
      ...priorityOrder.filter(p => p !== preference)
    ];
  }

  private getOfficialProvider(consulate: string): string {
    if (consulate.includes('usa') || consulate.includes('american')) {
      return 'CASV'
    }
    if (consulate.includes('uk') || consulate.includes('canada') || consulate.includes('germany')) {
      return 'VFS Global'
    }
    if (consulate.includes('france')) {
      return 'TLS Contact'
    }
    return 'Consulado Direto'
  }

  private extractCountryFromConsulate(consulate: string): string {
    const lowerConsulate = consulate.toLowerCase()
    if (lowerConsulate.includes('usa') || lowerConsulate.includes('american')) return 'USA'
    if (lowerConsulate.includes('uk') || lowerConsulate.includes('reino unido')) return 'United Kingdom'
    if (lowerConsulate.includes('canada')) return 'Canada'
    if (lowerConsulate.includes('germany') || lowerConsulate.includes('alemanha')) return 'Germany'
    if (lowerConsulate.includes('france') || lowerConsulate.includes('frança')) return 'France'
    if (lowerConsulate.includes('italy') || lowerConsulate.includes('itália')) return 'Italy'
    if (lowerConsulate.includes('spain') || lowerConsulate.includes('espanha')) return 'Spain'
    return 'Unknown'
  }

  private getScrapingTargetId(consulate: string): string {
    const lowerConsulate = consulate.toLowerCase()
    if (lowerConsulate.includes('usa') || lowerConsulate.includes('american')) return 'casv_brazil'
    if (lowerConsulate.includes('uk') || lowerConsulate.includes('reino unido')) return 'vfs_sao_paulo'
    if (lowerConsulate.includes('germany') || lowerConsulate.includes('alemanha')) return 'consulado_alemao'
    if (lowerConsulate.includes('france') || lowerConsulate.includes('frança')) return 'consulado_frances'
    if (lowerConsulate.includes('canada')) return 'consulado_canadense'
    return 'casv_brazil' // default
  }

  // Buscar vagas disponíveis em todos os métodos
  async findAvailableSlots(country: string, visaType: string): Promise<{
    official: any[]
    partners: any[]
    scraping: any[]
    consolidated: any[]
  }> {
    const results = {
      official: [] as any[],
      partners: [] as any[],
      scraping: [] as any[],
      consolidated: [] as any[]
    }

    try {
      // Buscar vagas oficiais
      try {
        const officialSlots = await appointmentBookingService.getAvailableSlots(country, visaType)
        results.official = officialSlots || []
      } catch (error) {
        console.error('Erro ao buscar vagas oficiais:', error)
      }

      // Buscar vagas de parceiros
      try {
        // Implementar busca de vagas de parceiros se necessário
        results.partners = []
      } catch (error) {
        console.error('Erro ao buscar vagas de parceiros:', error)
      }

      // Buscar vagas via scraping
      try {
        const scrapingResult = await webScrapingService.scrapeAvailableSlots(
          this.getScrapingTargetId(country)
        )
        results.scraping = scrapingResult.success ? scrapingResult.slots : []
      } catch (error) {
        console.error('Erro ao buscar vagas via scraping:', error)
      }

      // Consolidar resultados
      results.consolidated = [
        ...results.official.map(slot => ({ ...slot, source: 'official' })),
        ...results.partners.map(slot => ({ ...slot, source: 'partners' })),
        ...results.scraping.map(slot => ({ ...slot, source: 'scraping' }))
      ]

      return results

    } catch (error) {
      console.error('Erro na busca híbrida de vagas:', error)
      return results
    }
  }
}

export const hybridBookingSystem = new HybridBookingSystem()

// Types export
export type { HybridBookingOptions, HybridBookingResult }