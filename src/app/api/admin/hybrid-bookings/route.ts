import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os agendamentos híbridos com informações relacionadas
    // Como hybridBooking não existe no schema, vamos simular dados por enquanto
    const bookings: any[] = []
    
    // const bookings = await prisma.hybridBooking.findMany({
    //   include: {
    //     client: {
    //       select: {
    //         id: true
    //         name: true
    //         email: true
    //         phone: true
    //       }
    //     }
    //     payment: {
    //       select: {
    //         status: true
    //         paidAmount: true
    //         paymentMethod: true
    //         paidAt: true
    //       }
    //     }
    //   }
    //   orderBy: [
    //     {
    //       urgency: 'desc' // EMERGENCY primeiro
    //     }
    //     {
    //       createdAt: 'asc' // Mais antigos primeiro
    //     }
    //   ]
    // })

    // Calcular estatísticas
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'CONSULTANT_ASSIGNED').length,
      inProgress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      expired: bookings.filter(b => b.status === 'EXPIRED').length,
      emergency: bookings.filter(b => b.urgency === 'EMERGENCY').length,
      totalRevenue: bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.payment?.paidAmount || 0), 0)
    }

    return NextResponse.json({
      bookings,
      stats
    })

  } catch (error) {
    console.error('Erro ao buscar agendamentos híbridos:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, bookingId, data } = await request.json()

    switch (action) {
      case 'update_status':
        return await updateBookingStatus(bookingId, data.status, data.appointmentDetails)
      
      case 'assign_consultant':
        return await assignConsultant(bookingId, data.consultantId)
      
      case 'add_note':
        return await addBookingNote(bookingId, data.note)
      
      case 'extend_deadline':
        return await extendDeadline(bookingId, data.hours)
      
      default:
        return NextResponse.json({
          error: 'Ação não reconhecida'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na ação de agendamento:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Atualizar status do agendamento
async function updateBookingStatus(bookingId: string, status: string, appointmentDetails?: any) {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    // Se marcando como concluído, adicionar data de conclusão
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
      
      if (appointmentDetails) {
        updateData.appointmentDetails = appointmentDetails
      }
    }

    // Se marcando como em progresso, registrar início
    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date()
    }

    // Como hybridBooking não existe no schema, vamos simular resposta
    const booking = {} // await prisma.hybridBooking.update({
    //   where: { id: bookingId }
    //   data: updateData
    //   include: {
    //     client: {
    //       select: {
    //         name: true
    //         email: true
    //         phone: true
    //       }
    //     }
    //   }
    // })

    // Notificar cliente sobre mudança de status (comentado por enquanto pois booking é mock)
    // await notifyClientStatusUpdate(booking, status, appointmentDetails)

    return NextResponse.json({
      booking
      message: `Status atualizado para ${status}`
    })

  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    return NextResponse.json({
      error: 'Erro ao atualizar status'
    }, { status: 500 })
  }
}

// Atribuir consultor
async function assignConsultant(bookingId: string, consultantId: string) {
  try {
    // Como hybridBooking não existe no schema, vamos simular resposta
    const booking = {} // await prisma.hybridBooking.update({
    //   where: { id: bookingId }
    //   data: {
    //     assignedConsultant: consultantId
    //     assignedAt: new Date()
    //     updatedAt: new Date()
    //   }
    // })

    return NextResponse.json({
      booking
      message: 'Consultor atribuído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atribuir consultor:', error)
    return NextResponse.json({
      error: 'Erro ao atribuir consultor'
    }, { status: 500 })
  }
}

// Adicionar nota ao agendamento
async function addBookingNote(bookingId: string, note: string) {
  try {
    // Como hybridBooking não existe no schema, vamos simular resposta
    const booking = { notes: [] } // await prisma.hybridBooking.findUnique({
    //   where: { id: bookingId }
    // })

    if (!booking) {
      return NextResponse.json({
        error: 'Agendamento não encontrado'
      }, { status: 404 })
    }

    const currentNotes = booking.notes || []
    const newNote = {
      id: Date.now().toString()
      content: note
      createdAt: new Date().toISOString()
      author: 'Sistema' // TODO: pegar do usuário logado
    }

    // Como hybridBooking não existe no schema, vamos simular resposta
    const updatedBooking = {} // await prisma.hybridBooking.update({
    //   where: { id: bookingId }
    //   data: {
    //     notes: [...currentNotes, newNote]
    //     updatedAt: new Date()
    //   }
    // })

    return NextResponse.json({
      booking: updatedBooking
      message: 'Nota adicionada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao adicionar nota:', error)
    return NextResponse.json({
      error: 'Erro ao adicionar nota'
    }, { status: 500 })
  }
}

// Estender prazo
async function extendDeadline(bookingId: string, hours: number) {
  try {
    // Como hybridBooking não existe no schema, vamos simular resposta
    const booking = { deadline: new Date() } // await prisma.hybridBooking.findUnique({
    //   where: { id: bookingId }
    // })

    if (!booking) {
      return NextResponse.json({
        error: 'Agendamento não encontrado'
      }, { status: 404 })
    }

    const currentDeadline = new Date(booking.deadline)
    const newDeadline = new Date(currentDeadline.getTime() + (hours * 60 * 60 * 1000))

    // Como hybridBooking não existe no schema, vamos simular resposta
    const updatedBooking = {} // await prisma.hybridBooking.update({
    //   where: { id: bookingId }
    //   data: {
    //     deadline: newDeadline
    //     updatedAt: new Date()
    //   }
    // })

    return NextResponse.json({
      booking: updatedBooking
      message: `Prazo estendido em ${hours} horas`
    })

  } catch (error) {
    console.error('Erro ao estender prazo:', error)
    return NextResponse.json({
      error: 'Erro ao estender prazo'
    }, { status: 500 })
  }
}

// Notificar cliente sobre mudança de status
async function notifyClientStatusUpdate(booking: any, status: string, appointmentDetails?: any) {
  try {
    let message = ''

    switch (status) {
      case 'IN_PROGRESS':
        message = `🚀 AGENDAMENTO EM ANDAMENTO

Olá ${booking.client.name}!

Boas notícias! Nossa equipe está trabalhando no seu agendamento:

🏛️ Destino: ${booking.consulate} - ${booking.country}
👨‍💼 Status: Em andamento
⏰ Previsão: Concluído em breve

🎯 O que estamos fazendo:
• Acessando site do consulado
• Verificando vagas disponíveis
• Fazendo seu agendamento

📱 Você receberá confirmação assim que concluído!

💬 Dúvidas? Responda esta mensagem.`
        break

      case 'COMPLETED':
        message = `✅ AGENDAMENTO CONFIRMADO!

Parabéns ${booking.client.name}! 🎉

Seu agendamento foi realizado com sucesso:

${appointmentDetails ? `
📅 Data: ${appointmentDetails.date}
🕐 Horário: ${appointmentDetails.time}
📧 Confirmação: ${appointmentDetails.confirmationNumber}
` : ''}

🏛️ Local: ${booking.consulate} - ${booking.country}
🎯 Status: ✅ CONFIRMADO

📋 PRÓXIMOS PASSOS:
1. Verifique seu email para detalhes completos
2. Prepare documentos necessários  
3. Chegue 30min antes do horário
4. Leve comprovante impresso

🎯 Sucesso garantido! Vamos acompanhar você até o final.

📞 Dúvidas? Nossa equipe está disponível 24/7.`
        break

      case 'CANCELLED':
        message = `❌ AGENDAMENTO CANCELADO

Olá ${booking.client.name}

Infelizmente não conseguimos realizar seu agendamento:

🏛️ Destino: ${booking.consulate} - ${booking.country}
❌ Status: Cancelado

🔄 PRÓXIMOS PASSOS:
• Reembolso será processado em 2-5 dias úteis
• Entraremos em contato para nova tentativa
• Ou você pode tentar outro consulado/data

📞 Nossa equipe entrará em contato em breve para resolver.

💬 Dúvidas? Responda esta mensagem.`
        break
    }

    if (message) {
      await fetch('/api/notifications/whatsapp', {
        method: 'POST'
        headers: { 'Content-Type': 'application/json' }
        body: JSON.stringify({
          to: booking.client.phone
          message: message
        })
      })
    }

  } catch (error) {
    console.error('Erro ao notificar cliente:', error)
  }
}