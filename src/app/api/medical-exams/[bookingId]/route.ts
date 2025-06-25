import { NextRequest, NextResponse } from 'next/server'
import { medicalExamService } from '@/lib/medical-exams'

// GET - Verificar status do exame
export async function GET(,
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId

    const result = await medicalExamService.getExamStatus(bookingId)

    if (result.success) {
      return NextResponse.json({
        booking: result.booking,
        message: 'Status do exame recuperado com sucesso',
      }),
    } else {
      return NextResponse.json(
        { status: 404 }
      ),
    }

  } catch (error) {
    console.error('Erro ao verificar status do exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// PUT - Reagendar exame
export async function PUT(,
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId
    const body = await request.json()
    const { newDate, newTime } = body

    if (!newDate || !newTime) {
      return NextResponse.json(
        { error: 'Campos newDate e newTime são obrigatórios' },
        { status: 400 }
      ),
    }

    const result = await medicalExamService.rescheduleExam(bookingId, newDate, newTime)

    if (result.success) {
      return NextResponse.json({
        confirmationCode: result.confirmationCode,
        message: result.message,
      }),
    } else {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    ),
    }

  } catch (error) {
    console.error('Erro ao reagendar exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// DELETE - Cancelar exame
export async function DELETE(,
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId

    const result = await medicalExamService.cancelExam(bookingId)

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        cancelledAt: new Date().toISOString(),
      }),
    } else {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    ),
    }

  } catch (error) {
    console.error('Erro ao cancelar exame:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}