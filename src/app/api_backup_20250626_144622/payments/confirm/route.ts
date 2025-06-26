import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  // Aplicar rate limiting para checkout/pagamento
  const rateLimitResult = rateLimit(request, RATE_LIMITS.checkout)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetTime)
  }
  
  try {
    const { payment_id, status, external_reference } = await request.json()

    if (!payment_id || !status) {
      return NextResponse.json(
      { error: 'Dados inválidos' }
      { status: 400 }
    )
    }

    // Atualizar status do pagamento no banco
    if (external_reference) {
      const payment = await prisma.payment.findFirst({
        where: { 
          OR: [
            { transactionId: payment_id }
            { id: external_reference }
          ]
        }
        include: {
          client: true
        }
      })

      if (payment) {
        // Atualizar pagamento
        await prisma.payment.update({
          where: { id: payment.id }
          data: {
            status: status === 'approved' ? 'COMPLETED' : 'FAILED',
            transactionId: payment_id,
            paidAt: status === 'approved' ? new Date() : null
          }
        })

        // Se pagamento aprovado
 atualizar status do cliente
        if (status === 'approved') {
          await prisma.client.update({
            where: { id: payment.clientId }
            data: {
              status: 'IN_PROCESS' // Cliente que pagou entra em processo
            }
          })

          // Criar interaction de pagamento confirmado
          await prisma.interaction.create({
            data: {
              clientId: payment.clientId,
              type: 'AUTOMATED_EMAIL',
              channel: 'email',
              direction: 'outbound',
              subject: 'Pagamento Confirmado - Acesso Liberado',
              content: `Pagamento de R$ ${payment.amount} confirmado. ID: ${payment_id}`,
              completedAt: new Date()
            }
          })

          console.log('✅ Pagamento confirmado:', {
            paymentId: payment.id,
            clientId: payment.clientId,
            amount: payment.amount,
            transactionId: payment_id
          })
        }

        return NextResponse.json({
          message: 'Pagamento processado com sucesso'
          data: {
            paymentId: payment.id,
            clientId: payment.clientId,
            status: status === 'approved' ? 'COMPLETED' : 'FAILED'
          }
        })
      }
    }

    // Se não encontrou o pagamento
 criar log
    console.warn('⚠️ Pagamento não encontrado:', {
      payment_id,
      external_reference,
      status,
    })

    return NextResponse.json({
      message: 'Confirmação recebida mas pagamento não encontrado no sistema'
    })

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}