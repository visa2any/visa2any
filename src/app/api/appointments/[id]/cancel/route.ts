import { NextRequest, NextResponse } from 'next/server'
import { appointmentBookingService } from '@/lib/appointment-booking'

// DELETE - Cancelar agendamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id
    const { searchParams } = new URL(request.url)
    const consulate = searchParams.get('consulate')

    if (!consulate) {
      return NextResponse.json(
        { error: 'Parâmetro consulate é obrigatório' }
        { status: 400 }
      )
    }

    const result = await appointmentBookingService.cancelAppointment(appointmentId, consulate)

    if (result.success) {
      // TODO: Atualizar status no banco de dados
      
      return NextResponse.json({
        message: result.message
        cancelledAt: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
      { error: 'Dados inválidos' }
      { status: 400 }
    )
    }

  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}