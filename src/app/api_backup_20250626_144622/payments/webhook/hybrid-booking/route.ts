import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook híbrido recebido:', body)

    // Validar webhook do MercadoPago

    const { data, type } = body
    
    if (type !== 'payment') {
      return NextResponse.json({ status: 'ignored', reason: 'not a payment event' })
    }

    // Buscar detalhes do pagamento no MercadoPago

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
      }
    })

    if (!paymentResponse.ok) {
      throw new Error('Erro ao buscar pagamento no MercadoPago')
    }

    const paymentData = await paymentResponse.json()
    console.log('Dados do pagamento:', paymentData)

    // Validar se é um pagamento híbrido

    const paymentId = paymentData.external_reference
    if (!paymentId) {
      return NextResponse.json({ status: 'ignored', reason: 'no external_reference' })
    }

    // Buscar registro de pagamento híbrido

    const hybridPayment = await prisma.hybridPayment.findUnique({
      where: { id: paymentId }
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!hybridPayment) {
      console.error('Pagamento híbrido não encontrado:', paymentId)
      return NextResponse.json({ status: 'error', reason: 'payment not found' })
    }

    // Processar baseado no status do pagamento

    switch (paymentData.status) {
      case 'approved':
        await processApprovedPayment(hybridPayment, paymentData)
        break
      
      case 'pending':
        await processPendingPayment(hybridPayment, paymentData)
        break
      
      case 'rejected':
      case 'cancelled':
        await processRejectedPayment(hybridPayment, paymentData)
        break
      
      default:
        console.log('Status não tratado:', paymentData.status)
    }

    return NextResponse.json({ status: 'processed' })

  } catch (error) {
    console.error('Erro no webhook híbrido:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}

// Processar pagamento aprovado
async function processApprovedPayment(hybridPayment: any, paymentData: any) {
  try {
    // Atualizar status do pagamento
    await prisma.hybridPayment.update({
      where: { id: hybridPayment.id }
      data: {
        status: 'APPROVED',
        paymentMethod: paymentData.payment_method_id,
        paymentId: paymentData.id.toString()
        paidAmount: paymentData.transaction_amount,
        paidAt: new Date(paymentData.date_approved)
        updatedAt: new Date()
      }
    })

    // Criar registro de agendamento para consultor

    const booking = await prisma.hybridBooking.create({
      data: {
        paymentId: hybridPayment.id,
        clientId: hybridPayment.clientId,
        country: hybridPayment.country,
        consulate: hybridPayment.consulate,
        availableDates: hybridPayment.availableDates,
        plan: hybridPayment.plan,
        urgency: hybridPayment.urgency,
        status: 'CONSULTANT_ASSIGNED',
        assignedAt: new Date()
        deadline: new Date(Date.now() + getBookingDeadline(hybridPayment.urgency))
        createdAt: new Date()
      }
    })

    // Notificar consultor para agendar

    await notifyConsultantToBook({
      bookingId: booking.id,
      paymentId: hybridPayment.id,
      client: hybridPayment.client,
      country: hybridPayment.country,
      consulate: hybridPayment.consulate,
      plan: hybridPayment.plan,
      urgency: hybridPayment.urgency,
      availableDates: hybridPayment.availableDates,
      paidAmount: paymentData.transaction_amount,
      paymentMethod: paymentData.payment_method_id,
      deadline: booking.deadline
    })

    // Notificar cliente sobre confirmação

    await notifyClientPaymentConfirmed({
      client: hybridPayment.client,
      country: hybridPayment.country,
      consulate: hybridPayment.consulate,
      plan: hybridPayment.plan,
      paidAmount: paymentData.transaction_amount,
      paymentMethod: getPaymentMethodName(paymentData.payment_method_id)
      bookingId: booking.id
    })

    console.log('Pagamento aprovado processado:', hybridPayment.id)

  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error)
  }
}

// Processar pagamento pendente
async function processPendingPayment(hybridPayment: any, paymentData: any) {
  try {
    await prisma.hybridPayment.update({
      where: { id: hybridPayment.id }
      data: {
        status: 'PENDING_PAYMENT',
        paymentId: paymentData.id.toString()
        updatedAt: new Date()
      }
    })

    // Notificar cliente sobre pendência

    const message = `⏳ PAGAMENTO EM PROCESSAMENTO

Olá ${hybridPayment.client.name}!

Recebemos seu pagamento e ele está sendo processado:

💳 Método: ${getPaymentMethodName(paymentData.payment_method_id)}
💰 Valor: R$ ${paymentData.transaction_amount}
🆔 ID: ${paymentData.id}

${paymentData.payment_method_id === 'pix' ? 
  '⚡ PIX: Confirmação em até 5 minutos' : 
  '📄 Boleto: Confirmação em até 2 dias úteis'
}

✅ Assim que confirmado, agendaremos sua vaga automaticamente!

📞 Dúvidas? Responda esta mensagem.`

    await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        to: hybridPayment.client.phone,
        message: message
      })
    })

  } catch (error) {
    console.error('Erro ao processar pagamento pendente:', error)
  }
}

// Processar pagamento rejeitado
async function processRejectedPayment(hybridPayment: any, paymentData: any) {
  try {
    await prisma.hybridPayment.update({
      where: { id: hybridPayment.id }
      data: {
        status: 'REJECTED',
        paymentId: paymentData.id.toString()
        rejectionReason: paymentData.status_detail,
        updatedAt: new Date()
      }
    })

    // Notificar cliente sobre rejeição

    const message = `❌ PAGAMENTO NÃO APROVADO

Olá ${hybridPayment.client.name}

Infelizmente seu pagamento não foi aprovado:

💳 Método: ${getPaymentMethodName(paymentData.payment_method_id)}
💰 Valor: R$ ${paymentData.transaction_amount}
❌ Motivo: ${getRejectionReason(paymentData.status_detail)}

🔄 SOLUÇÕES:
• Tente outro cartão
• Use PIX para aprovação instantânea
• Verifique dados do cartão
• Entre em contato com seu banco

🎯 Sua vaga ainda está reservada por mais 15 minutos!

🔗 Tentar novamente: ${process.env.NEXTAUTH_URL}/hybrid-booking/retry/${hybridPayment.id}

📞 Precisa de ajuda? Responda esta mensagem.`

    await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        to: hybridPayment.client.phone,
        message: message
      })
    })

  } catch (error) {
    console.error('Erro ao processar pagamento rejeitado:', error)
  }
}

// Notificar consultor para fazer agendamento
async function notifyConsultantToBook(data: any) {
  const urgencyEmoji = {
    'NORMAL': '⏰',
    'URGENT': '🚨',
    'EMERGENCY': '🔥'
  }

  const planEmoji = {
    'BASIC': '🥉',
    'PREMIUM': '🥈',
    'VIP': '🥇'
  }

  const deadlineText = new Date(data.deadline).toLocaleString('pt-BR')
  
  const message = `${urgencyEmoji[data.urgency]} PAGAMENTO CONFIRMADO - AGENDAR AGORA!

${planEmoji[data.plan]} CLIENTE: ${data.client.name}
📧 Email: ${data.client.email}  
📱 WhatsApp: ${data.client.phone}

💰 PAGAMENTO APROVADO:
• Valor: R$ ${data.paidAmount}
• Método: ${getPaymentMethodName(data.paymentMethod)}
• Status: ✅ CONFIRMADO

🏛️ AGENDAR:
• Destino: ${data.consulate} - ${data.country}
• Plano: ${data.plan}
• Urgência: ${data.urgency}

📅 DATAS DISPONÍVEIS:
${data.availableDates.map((date: string) => `• ${date}`).join('\n')}

⏰ PRAZO: ${deadlineText}
🆔 Booking ID: ${data.bookingId}

🎯 AÇÃO IMEDIATA NECESSÁRIA:
1. Acessar site do consulado
2. Fazer agendamento manual
3. Confirmar no sistema

🔗 Guia Completo: ${process.env.NEXTAUTH_URL}/consultor-guia
🔗 Ver Booking: ${process.env.NEXTAUTH_URL}/admin/hybrid-bookings/${data.bookingId}

⚡ ${data.plan === 'VIP' ? 'CLIENTE VIP - PRIORIDADE MÁXIMA!' : 'CLIENTE PAGOU - AGENDAR AGORA!'}`

  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('Erro ao notificar consultor:', error)
  }
}

// Notificar cliente sobre confirmação de pagamento
async function notifyClientPaymentConfirmed(data: any) {
  const message = `✅ PAGAMENTO CONFIRMADO!

Parabéns ${data.client.name}! 🎉

Seu pagamento foi aprovado com sucesso:

💰 Valor: R$ ${data.paidAmount}
💳 Método: ${data.paymentMethod}
🏛️ Destino: ${data.consulate} - ${data.country}
🎯 Plano: ${data.plan}

🚀 PRÓXIMOS PASSOS:
1. ✅ Pagamento confirmado
2. 👨‍💼 Consultor será notificado agora
3. 📅 Agendamento será feito em breve
4. 📧 Você receberá confirmação por email

⏰ TEMPO ESTIMADO:
${data.plan === 'VIP' ? '• VIP: Até 30 minutos' : 
  data.plan === 'PREMIUM' ? '• Premium: Até 2 horas' : 
  '• Basic: Até 4 horas'
}

📱 ACOMPANHE:
🆔 Booking ID: ${data.bookingId}
🔗 Status: ${process.env.NEXTAUTH_URL}/booking-status/${data.bookingId}

🎯 Fique tranquilo! Nossa equipe está trabalhando para você.

📞 Dúvidas? Responda esta mensagem a qualquer momento.`

  try {
    await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        to: data.client.phone,
        message: message
      })
    })
  } catch (error) {
    console.error('Erro ao notificar cliente:', error)
  }
}

// Utilitários
function getBookingDeadline(urgency: string): number {
  const deadlines = {
    'NORMAL': 4 * 60 * 60 * 1000, // 4 horas,    'URGENT': 2 * 60 * 60 * 1000,  // 2 horas
    'EMERGENCY': 30 * 60 * 1000    // 30 minutos  }
  return deadlines[urgency as keyof typeof deadlines] || deadlines.NORMAL
}

function getPaymentMethodName(methodId: string): string {
  const methods: { [key: string]: string } = {
    'pix': 'PIX'
    'master': 'Mastercard',
    'visa': 'Visa',
    'elo': 'Elo',
    'hipercard': 'Hipercard',
    'bolbradesco': 'Boleto Bradesco',
    'account_money': 'Saldo Mercado Pago'
  }
  return methods[methodId] || 'Cartão'
}

function getRejectionReason(detail: string): string {
  const reasons: { [key: string]: string } = {
    'cc_rejected_insufficient_amount': 'Saldo/limite insuficiente'
    'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
    'cc_rejected_bad_filled_date': 'Data de vencimento inválida',
    'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
    'cc_rejected_bad_filled_other': 'Dados do cartão incorretos',
    'cc_rejected_blacklist': 'Cartão bloqueado',
    'cc_rejected_high_risk': 'Transação de alto risco',
    'cc_rejected_max_attempts': 'Muitas tentativas'
  }
  return reasons[detail] || 'Verifique os dados e tente novamente'
}