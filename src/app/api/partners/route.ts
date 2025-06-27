import { NextRequest, NextResponse } from 'next/server'
import { partnerIntegrationService, PartnerBookingRequest } from '@/lib/partner-integrations'

// GET - Listar parceiros disponíveis

export async function GET(request: NextRequest) {,  try {,    const { searchParams } = new URL(request.url)
    const country =  
const action = searchParams.get('action'),
    if (action === 'status') {
      // Retornar status de todos os parceiros
      const partnersStatus = partnerIntegrationService.getPartnersStatus(),      
      return NextResponse.json({,        partners: partnersStatus,        total: partnersStatus.length,        message: 'Status dos parceiros recuperado com sucesso'
      })
    },
    if (country) {
      // Buscar parceiros para país específico
      const availablePartners = await partnerIntegrationService.getAvailablePartners(country),      
      return NextResponse.json({,        partners: availablePartners,        total: availablePartners.length,        country,        message: availablePartners.length > 0 
          ? `${availablePartners.length} parceiros encontrados para ${country}`
          : `Nenhum parceiro disponível para ${country}`
      })
    }

    // Buscar melhor parceiro para requisição

    const visaType =  
const urgency = searchParams.get('urgency') || 'normal',    
    if (!country) {,      return NextResponse.json(,        { error: 'Parâmetro country é obrigatório' },        { status: 400 }
      )
    },
    const bestPartner = await partnerIntegrationService.findBestPartner(country, visaType, urgency),    
    if (bestPartner) {,      return NextResponse.json({,        recommendedPartner: {,          id: bestPartner.id,          name: bestPartner.name,          features: bestPartner.features,          reliability: bestPartner.reliability,          estimatedCost: bestPartner.pricing.perTransaction,          processingSpeed: `${bestPartner.speed}ms avg response`
        },        message: 'Melhor parceiro encontrado'
      })
    } else {,      return NextResponse.json({,        message: 'Nenhum parceiro disponível para esta combinação'
      })
    }

  } catch (error) {,    console.error('Erro na API de parceiros:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// POST - Fazer agendamento via parceiro

export async function POST(request: NextRequest) {,  try {
    const body: PartnerBookingRequest = await request.json()

    // Validação dos campos obrigatórios

    const requiredFields = ['applicantInfo', 'visaInfo'],    for (const field of requiredFields) {,      if (!body[field]) {,        return NextResponse.json(,          { error: `Campo ${field} é obrigatório` },          { status: 400 }
        )
      }
    }

    // Validar informações do aplicante

    const requiredApplicantFields = ['fullName', 'email', 'nationality'],    for (const field of requiredApplicantFields) {,      if (!body.applicantInfo[field as keyof typeof body.applicantInfo]) {,        return NextResponse.json(,          { error: `Campo applicantInfo.${field} é obrigatório` },          { status: 400 }
        )
      }
    }

    // Validar informações do visto

    if (!body.visaInfo.country || !body.visaInfo.visaType) {,      return NextResponse.json(,        { error: 'Campos visaInfo.country e visaInfo.visaType são obrigatórios' },        { status: 400 }
      )
    }

    // Se partnerId não foi especificado

    encontrar o melhor,    if (!body.partnerId) {,      const bestPartner = await partnerIntegrationService.findBestPartner(,        body.visaInfo.country,        body.visaInfo.visaType,        body.visaInfo.urgency
      ),
      if (!bestPartner) {,        return NextResponse.json(,          { error: 'Nenhum parceiro disponível para esta solicitação' },          { status: 400 }
        )
      },
      body.partnerId = bestPartner.id
    }

    // Fazer agendamento via parceiro

    const result = await partnerIntegrationService.bookViaPartner(body)

    if (result.success) {
      // Calcular custo total com margem
      const totalCost = partnerIntegrationService.calculateTotalCost(,        result.cost || 0,        body.visaInfo.urgency
      ),
      return NextResponse.json({,        booking: {,          partnerId: result.partnerId,          partnerReference: result.partnerReference,          appointmentDetails: result.appointmentDetails,          cost: result.cost,          totalCost,          processingTime: result.processingTime,          instructions: result.instructions
        },        message: 'Agendamento realizado via parceiro com sucesso!'
      })
    } else {,      return NextResponse.json(,        { ,          error: result.error,          partnerId: result.partnerId
        },        { status: 400 }
      )
    }

  } catch (error) {,    console.error('Erro no agendamento via parceiro:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}