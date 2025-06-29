import { NextRequest, NextResponse } from 'next/server'
import { hybridBookingSystem, HybridBookingOptions } from '@/lib/hybrid-booking-system'
import { BookingRequest } from '@/lib/appointment-booking'

// POST - Agendamento híbrido inteligente

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingRequest, options }: { 
      bookingRequest: BookingRequest,
      options: HybridBookingOptions 
    } = body

    // Validação dos campos obrigatórios
    if (!bookingRequest.applicantInfo || !bookingRequest.consulate || !bookingRequest.visaType) {
      return NextResponse.json(
        { error: 'Campos applicantInfo, consulate e visaType são obrigatórios' },
        { status: 400 }
      )
    }

    // Configurações padrão se não fornecidas
    const defaultOptions: HybridBookingOptions = {
      preferredMethod: 'auto',
      fallbackEnabled: true,
      urgency: 'normal',
      maxRetries: 3,
      ...options
    }

    // Log da tentativa de agendamento
    console.log(`Agendamento híbrido iniciado:`, {
      consulate: bookingRequest.consulate,
      visaType: bookingRequest.visaType,
      method: defaultOptions.preferredMethod,
      urgency: defaultOptions.urgency
    })

    // Executar agendamento híbrido
    const result = await hybridBookingSystem.bookAppointment(bookingRequest, defaultOptions)

    if (result.success) {
      return NextResponse.json({
        booking: {
          method: result.method,
          provider: result.provider,
          appointmentDetails: result.appointmentDetails,
          cost: result.cost,
          processingTime: result.processingTime,
          instructions: result.instructions
        },
        attempts: result.attempts,
        warnings: result.warnings,
        message: `Agendamento realizado via ${result.method} (${result.provider})`
      })
    } else {
      return NextResponse.json({
        error: result.error,
        attempts: result.attempts,
        warnings: result.warnings,
        recommendations: generateRecommendations(result.attempts)
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro no agendamento híbrido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Buscar vagas disponíveis em todos os métodos

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const visaType = searchParams.get('visaType')
    
    if (!country || !visaType) {
      return NextResponse.json(
        { error: 'Parâmetros country e visaType são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar vagas em todos os métodos
    const results = await hybridBookingSystem.findAvailableSlots(country, visaType)

    return NextResponse.json({
      country,
      visaType,
      availability: {
        official: {
          source: 'APIs Oficiais (CASV/VFS)',
          slots: results.official,
          reliability: 'Alta',
          cost: 'Gratuito'
        },
        partners: {
          source: 'Parceiros (VisaHQ/iVisa)',
          slots: results.partners,
          reliability: 'Alta',
          cost: 'Pago'
        },
        scraping: {
          source: 'Web Scraping',
          slots: results.scraping,
          reliability: 'Baixa',
          cost: 'Gratuito',
          warning: 'Dados podem estar desatualizados'
        }
      },
      consolidated: results.consolidated,
      summary: {
        totalSlots: results.consolidated.length,
        sourcesAvailable: [
          results.official.length > 0 && 'official',
          results.partners.length > 0 && 'partners',
          results.scraping.length > 0 && 'scraping'
        ].filter(Boolean),
        recommendations: generateAvailabilityRecommendations(results)
      },
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro na busca híbrida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Métodos auxiliares para recomendações
function generateRecommendations(attempts: any[]): string[] {
  const recommendations: string[] = []

  const failedMethods = attempts.filter(a => !a.success).map(a => a.method)
  const hasOfficialFailure = failedMethods.includes('official')
  const hasPartnerFailure = failedMethods.includes('partners')
  const hasScrapingFailure = failedMethods.includes('scraping')
  
  if (hasOfficialFailure) {
    recommendations.push('APIs oficiais indisponíveis - considere tentar novamente em algumas horas')
  }
  
  if (hasPartnerFailure) {
    recommendations.push('Parceiros indisponíveis - verifique se há saldo/créditos suficientes')
  }
  
  if (hasScrapingFailure) {
    recommendations.push('Web scraping bloqueado - sites podem ter anti-bot ativo')
  }
  
  if (attempts.length === 0) {
    recommendations.push('Nenhum método disponível - verifique configurações de API')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Tente novamente com urgência "express" para mais opções')
    recommendations.push('Entre em contato com suporte para agendamento manual')
  }
  
  return recommendations
}

function generateAvailabilityRecommendations(results: any): string[] {
  const recommendations: string[] = []
  
  if (results.official.length > 0) {
    recommendations.push('✅ Use APIs oficiais para melhor confiabilidade')
  }
  
  if (results.partners.length > 0 && results.official.length === 0) {
    recommendations.push('💰 Parceiros disponíveis - agendamento pago mas confiável')
  }
  
  if (results.scraping.length > 0 && results.official.length === 0 && results.partners.length === 0) {
    recommendations.push('⚠️ Apenas web scraping disponível - dados podem estar desatualizados')
  }
  
  if (results.consolidated.length === 0) {
    recommendations.push('❌ Nenhuma vaga encontrada - tente outros períodos ou consulados')
  }
  
  if (results.consolidated.length > 10) {
    recommendations.push('✨ Muitas opções disponíveis - escolha o melhor horário')
  }
  
  return recommendations
}