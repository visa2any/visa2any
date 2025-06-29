import { NextRequest, NextResponse } from 'next/server'
import { partnerIntegrationService } from '@/lib/partner-integrations'

// GET - Verificar status de aplicação via parceiro

export async function GET(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  try {
    const partnerId = params.partnerId
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    
    if (!reference) {
      return NextResponse.json(
        { error: 'Parâmetro reference é obrigatório' },
        { status: 400 }
      )
    }
    
    const status = await partnerIntegrationService.checkStatus(partnerId, reference)
    
    return NextResponse.json({
      success: true,
      partnerId,
      reference,
      status: status.status,
      details: status.details,
      nextSteps: status.nextSteps,
      lastChecked: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}