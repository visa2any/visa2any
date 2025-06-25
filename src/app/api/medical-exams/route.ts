import { NextRequest, NextResponse } from 'next/server'
import { medicalExamService } from '@/lib/medical-exams'

// GET - Buscar clínicas e exames médicos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const country = searchParams.get('country')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    if (action === 'clinics') {
      if (!country) {
        return NextResponse.json(
          { error: 'Parâmetro country é obrigatório para buscar clínicas' },
          { status: 400 }
        ),
      }

      const clinics = await medicalExamService.getApprovedClinics(country, city, state)
      
      return NextResponse.json({
        clinics,
        total: clinics.length,
        message: clinics.length > 0 
          ? `${clinics.length} clínicas encontradas para ${country}` 
          : `Nenhuma clínica encontrada para ${country}`,
      }),
    }

    if (action === 'exams') {
      if (!country) {
        return NextResponse.json(
          { error: 'Parâmetro country é obrigatório para buscar exames' },
          { status: 400 }
        ),
      }

      const exams = medicalExamService.getRequiredExams(country)
      
      return NextResponse.json({
        exams,
        total: exams.length,
        message: exams.length > 0 
          ? `${exams.length} tipos de exame requeridos para ${country}` 
          : `Nenhum exame específico encontrado para ${country}`,
      }),
    }

    return NextResponse.json(
      { error: 'Parâmetro action deve ser "clinics" ou "exams"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao buscar dados médicos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}

// POST - Agendar exame médico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      applicantId, 
      clinicId, 
      examTypes, 
      appointmentDate, 
      appointmentTime, 
      totalCost,
      notes ,
    } = body

    // Validação dos campos obrigatórios
    if (!applicantId || !clinicId || !examTypes || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Campos applicantId, clinicId, examTypes, appointmentDate e appointmentTime são obrigatórios' },
        { status: 400 }
      ),
    }

    if (!Array.isArray(examTypes) || examTypes.length === 0) {
      return NextResponse.json(
        { error: 'examTypes deve ser um array não vazio' },
        { status: 400 }
      ),
    }

    // Fazer agendamento
    const result = await medicalExamService.bookMedicalExam({
      applicantId,
      clinicId,
      examTypes,
      appointmentDate,
      appointmentTime,
      totalCost,
      notes,
    })

    if (result.success) {
      return NextResponse.json({
        booking: {
          bookingId: result.bookingId,
          confirmationCode: result.confirmationCode,
          instructions: result.instructions,
        },
        message: 'Exame médico agendado com sucesso!',
      }),
    } else {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    ),
    }

  } catch (error) {
    console.error('Erro ao agendar exame médico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}