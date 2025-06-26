import { NextRequest, NextResponse } from 'next/server'
import { appointmentBookingService, BookingRequest, AppointmentSlot } from '@/lib/appointment-booking'

// GET - Buscar vagas disponíveis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const consulate = searchParams.get('consulate')
    const visaType = searchParams.get('visaType')
    const days = parseInt(searchParams.get('days') || '60')

    if (!consulate || !visaType) {
      return NextResponse.json(
        { error: 'Parâmetros consulate e visaType são obrigatórios' },
        { status: 400 }
      )
    }

    const slots = await appointmentBookingService.getAvailableSlots(consulate, visaType, days)

    return NextResponse.json({
      slots,
      total: slots.length,
      consulate,
      visaType,
      message: slots.length > 0 
        ? `${slots.length} vagas encontradas` 
        : 'Nenhuma vaga disponível no período',
    })

  } catch (error) {
    console.error('Erro ao buscar vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Fazer agendamento
export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()

    // Validação dos dados obrigatórios
    const required = ['applicantId', 'consulate', 'visaType', 'applicantInfo']
    for (const field of required) {
      if (!body[field as keyof BookingRequest]) {
        return NextResponse.json(
          { error: `Campo ${field} é obrigatório` },
          { status: 400 }
        )
      }
    }

    // Validação dos dados do requerente
    const requiredApplicantInfo = ['fullName', 'email', 'phone', 'nationality']
    for (const field of requiredApplicantInfo) {
      if (!body.applicantInfo[field as keyof typeof body.applicantInfo]) {
        return NextResponse.json(
          { error: `Campo applicantInfo.${field} é obrigatório` }
          { status: 400 }
        )
      }
    }

    // Tentar fazer o agendamento
    const bookingResult = await appointmentBookingService.bookAppointment(body)

    if (bookingResult.success) {
      // Salvar agendamento no banco de dados
      // TODO: Implementar salvamento no Prisma
      
      return NextResponse.json({
        appointment: {
          id: bookingResult.appointmentId
          confirmationCode: bookingResult.confirmationCode,
          date: bookingResult.date,
          time: bookingResult.time,
          location: bookingResult.location,
          instructions: bookingResult.instructions
        }
        message: 'Agendamento realizado com sucesso!'
      })
    } else {
      return NextResponse.json(
        { 
          error: bookingResult.error
          message: 'Não foi possível realizar o agendamento'
        }
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Erro ao fazer agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// PUT - Reagendar
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, newDate, newTime, consulate } = body

    if (!appointmentId || !newDate || !newTime || !consulate) {
      return NextResponse.json(
        { error: 'Campos appointmentId, newDate, newTime e consulate são obrigatórios' }
        { status: 400 }
      )
    }

    const result = await appointmentBookingService.rescheduleAppointment(
      appointmentId,
      newDate,
      newTime,
      consulate
    )

    if (result.success) {
      return NextResponse.json({
        appointment: {
          id: result.appointmentId
          confirmationCode: result.confirmationCode,
          date: result.date,
          time: result.time,
          location: result.location
        }
        message: 'Agendamento reagendado com sucesso!'
      })
    } else {
      return NextResponse.json(
      { error: 'Dados inválidos' }
      { status: 400 }
    )
    }

  } catch (error) {
    console.error('Erro ao reagendar:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}