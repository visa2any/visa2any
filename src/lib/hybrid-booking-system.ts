// Sistema Híbrido de Agendamento
// Combina parceiros, scraping e APIs oficiais com fallback inteligente

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

interface HybridBookingResult {
  success: boolean
  method: string
  provider: string
  appointmentDetails?: {
    id: string
    confirmationCode: string
    date: string
    time: string
    location: string
  }
  cost: number
  processingTime: string
  instructions: string
  attempts: Array<{
    method: string
    provider: string
    success: boolean
    error?: string
    cost?: number
  }>
  warnings?: string[]
  error?: string
}

class HybridBookingSystem {
  private readonly methodPriority = {
    'official': 1,    // APIs oficiais (CASV, VFS)
    'partner': 2,     // Parceiros (VisaHQ, iVisa)
    'scraping': 3     // Web scraping (último recurso)  }

  // Método principal de agendamento híbrido,  async bookAppointment(
    request: BookingRequest, 
    options: HybridBookingOptions
  ): Promise<HybridBookingResult> {
    const attempts: Array<any> = []
    const warnings: string[] = []
    let finalResult: HybridBookingResult

    try {
      // Determinar ordem de tentativas baseada na preferência,      const methods = this.determineMethodOrder(options.preferredMethod)
      
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
            success: result.success,
            error: result.error,
            cost: result.cost
          })

          // Se teve sucesso, retornar resultado
          if (result.success) {
            return {
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
            error: `Erro técnico: ${error}`
          })
        }
      }

      // Se chegou aqui, todas as tentativas falharam
      return {
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
        method: 'error',
        provider: 'error',
        cost: 0,
        processingTime: '',
        instructions: '',
        attempts,
        error: `Erro crítico no sistema híbrido: ${error}`
      }
    }
  }

  // Tentar API oficial (CASV/VFS),  private async tryOfficialAPI(request: BookingRequest): Promise<any> {
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
        cost: 0, // APIs oficiais geralmente não cobram taxa adicional,        processingTime: 'Imediato',
        instructions: result.instructions,
        error: result.error
      }
    } catch (error) {
      return {
        provider: 'official_api',
        error: `Erro na API oficial: ${error}`
      }
    }
  }

  // Tentar parceiros (VisaHQ, iVisa)
  private async tryPartnerAPI(request: BookingRequest, options: HybridBookingOptions): Promise<any> {
    try {
      // Converter formato de request,      const partnerRequest: PartnerBookingRequest = {
        partnerId: '', // Será determinado automaticamente,        applicantInfo: request.applicantInfo,
        visaInfo: {
          country: this.extractCountryFromConsulate(request.consulate),
          visaType: request.visaType,
          urgency: options.urgency
        }
      }

      // Encontrar melhor parceiro,      const bestPartner = await partnerIntegrationService.findBestPartner(
        partnerRequest.visaInfo.country,
        partnerRequest.visaInfo.visaType,
        partnerRequest.visaInfo.urgency
      )

      if (!bestPartner) {
        return {
          provider: 'no_partner',
          error: 'Nenhum parceiro disponível'
        }
      }

      // Verificar limite de orçamento,      if (options.budgetLimit && bestPartner.pricing.perTransaction > options.budgetLimit) {
        return {
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
        provider: 'partner_api',
        error: `Erro na API de parceiro: ${error}`
      }
    }
  }

  // Tentar web scraping (último recurso),  private async tryWebScraping(request: BookingRequest, warnings: string[]): Promise<any> {
    try {
      warnings.push('⚠️ Usando web scraping - pode violar ToS dos sites')
      warnings.push('⚠️ Dados podem estar desatualizados')
      warnings.push('⚠️ Método instável - use apenas como último recurso')

      // Determinar target de scraping baseado no consulado,      const targetId = this.getScrapingTarget(request.consulate)
      
      if (!targetId) {
        return {
          provider: 'scraping',
          error: 'Target de scraping não disponível para este consulado'
        }
      }

      // Buscar vagas via scraping,      const result = await webScrapingService.scrapeAvailableSlots(targetId)
      
      if (!result.success || result.slots.length === 0) {
        return {
          provider: 'scraping',
          error: result.error || 'Nenhuma vaga encontrada via scraping'
        }
      }

      // Para web scraping, apenas retornamos as vagas encontradas
      // NÃO fazemos agendamento real (muito arriscado),      const firstSlot = result.slots[0]
      
      return {
        provider: 'Web Scraping',
        appointmentDetails: {
          id: 'SCRAPING-' + Date.now(),
          confirmationCode: 'MANUAL-BOOKING-REQUIRED',
          date: firstSlot.date,
          time: firstSlot.time,
          location: firstSlot.location
        },
        cost: 0,
        processingTime: 'Agendamento manual necessário',
        instructions: `Vaga encontrada via scraping: ${firstSlot.date} às ${firstSlot.time}. ATENÇÃO: Você deve fazer o agendamento manualmente no site do consulado.`,
        error: undefined
      }

    } catch (error) {
      return {
        provider: 'scraping',
        error: `Erro no web scraping: ${error}`
      }
    }
  }

  // Buscar vagas disponíveis em todos os métodos,  async findAvailableSlots(country: string, visaType: string): Promise<{
    official: any[]
    partners: any[]
    scraping: any[]
    consolidated: any[]
  }> {
    const results = {
      official: [],
      partners: [],
      scraping: [],
      consolidated: []
    }

    try {
      // Buscar via API oficial,      try {
        const officialSlots = await appointmentBookingService.getAvailableSlots(
          this.getConsulateFromCountry(country), 
          visaType
        )
        results.official = officialSlots
      } catch (error) {
        console.error('Erro ao buscar via API oficial:', error)
      }

      // Buscar via parceiros,      try {
        const partners = await partnerIntegrationService.getAvailablePartners(country)
        for (const partner of partners.slice(0, 2)) { // Limitar a 2 parceiros,          // Simular busca de vagas (partners geralmente não expõem slots específicos)
          results.partners.push({
            provider: partner.name,
            available: true,
            processingTime: '1-5 business days',
            cost: partner.pricing.perTransaction
          })
        }
      } catch (error) {
        console.error('Erro ao buscar via parceiros:', error)
      }

      // Buscar via scraping,      try {
        const targetId = this.getScrapingTarget(this.getConsulateFromCountry(country))
        if (targetId) {
          const scrapingResult = await webScrapingService.scrapeAvailableSlots(targetId)
          if (scrapingResult.success) {
            results.scraping = scrapingResult.slots
          }
        }
      } catch (error) {
        console.error('Erro ao buscar via scraping:', error)
      }

      // Consolidar resultados,      results.consolidated = [
        ...results.official.map(slot => ({ ...slot, source: 'official' })),
        ...results.partners.map(slot => ({ ...slot, source: 'partner' })),
        ...results.scraping.map(slot => ({ ...slot, source: 'scraping' }))
      ]

      return results

    } catch (error) {
      console.error('Erro na busca consolidada:', error)
      return results
    }
  }

  // Métodos auxiliares,  private determineMethodOrder(preference: string): string[] {
    switch (preference) {
      case 'official':
        return ['official', 'partner', 'scraping']
      case 'partner':
        return ['partner', 'official', 'scraping']
      case 'scraping':
        return ['scraping', 'partner', 'official']
      case 'auto':
      default:
        return ['official', 'partner', 'scraping']
    }
  }

  private getOfficialProvider(consulate: string): string {
    const providers: Record<string, string> = {
      'usa': 'CASV (CGI Federal)',
      'uk': 'VFS Global UK',
      'canada': 'VFS Global Canada',
      'germany': 'German Consulate',
      'france': 'TLS Contact France'
    }
    return providers[consulate] || 'Official Consulate'
  }

  private extractCountryFromConsulate(consulate: string): string {
    // Extrair país do identificador do consulado,    if (consulate.includes('usa')) return 'usa'
    if (consulate.includes('uk')) return 'uk'
    if (consulate.includes('canada')) return 'canada'
    if (consulate.includes('germany')) return 'germany'
    if (consulate.includes('france')) return 'france'
    return consulate
  }

  private getConsulateFromCountry(country: string): string {
    return country // Simplificado para este exemplo  }

  private getScrapingTarget(consulate: string): string | null {
    const targets: Record<string, string> = {
      'usa': 'casv_brazil',
      'uk': 'vfs_sao_paulo',
      'canada': 'consulado_canadense',
      'germany': 'consulado_alemao',
      'france': 'consulado_frances'
    }
    return targets[consulate] || null
  }
}

// Export singleton instance
export const hybridBookingSystem = new HybridBookingSystem()

// Types export
export type { HybridBookingOptions, HybridBookingResult }