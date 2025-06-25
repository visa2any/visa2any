import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPayment, mapPaymentStatus, processWebhook } from '@/lib/mercadopago'

// POST /api/payments/webhook/mercadopago - Webhook do MercadoPago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log do webhook recebido
    console.log('🔔 Webhook MercadoPago recebido:', JSON.stringify(body, null, 2))

    const webhookResult = processWebhook(body)

    if (!webhookResult.success) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    // Processar apenas webhooks de pagamento
    if (webhookResult.type !== 'payment') {
    }

    const paymentId = webhookResult.payment_id

    if (!paymentId) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    // Buscar informações do pagamento no MercadoPago
    const mpPaymentResult = await getPayment(paymentId)

    if (!mpPaymentResult.success) {
      console.error('Erro ao buscar pagamento no MercadoPago:', mpPaymentResult.error)
      return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
    }

    const mpPayment = mpPaymentResult.payment

    // Encontrar pagamento no nosso banco pelo external_reference
    const payment = await prisma.payment.findFirst({
      where: {
        externalReference: mpPayment.external_reference,
      },
      include: {
        client: true,
      },
    })

    if (!payment) {
      console.error('Pagamento não encontrado no banco:', mpPayment.external_reference)
      return NextResponse.json(
        { status: 404 }
      )
    }

    // Mapear status do MercadoPago para nosso sistema
    const newStatus = mapPaymentStatus(mpPayment.status)
    const wasCompleted = payment.status === 'COMPLETED'

    // Atualizar pagamento no banco
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus as any,
        transactionId: mpPayment.id.toString(),
        paidAt: newStatus === 'COMPLETED' ? new Date() : null,
        paymentDetails: {
          mp_payment_id: mpPayment.id,
          mp_status: mpPayment.status,
          mp_status_detail: mpPayment.status_detail,
          payment_method_id: mpPayment.payment_method_id,
          payment_type_id: mpPayment.payment_type_id,
          transaction_amount: mpPayment.transaction_amount,
          date_approved: mpPayment.date_approved,
          date_created: mpPayment.date_created,
        },
      },
    })

    // Log do webhook processado
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_WEBHOOK_PROCESSED',
        action: 'process_mercadopago_webhook',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    })

    // Se pagamento foi aprovado e não estava aprovado antes, processar automações
    if (newStatus === 'COMPLETED' && !wasCompleted) {
      await processPaymentSuccess(updatedPayment)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao processar webhook MercadoPago:', error)
    
    // Log do erro
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_WEBHOOK_ERROR',
        action: 'process_mercadopago_webhook',
        clientId: null,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    }).catch(() => {}) // Não falhar se log não funcionar

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  }
}

// Processar automações quando pagamento é confirmado
async function processPaymentSuccess(payment: any) {
  try {
    // 1. Atualizar status do cliente
    await prisma.client.update({
      where: { id: payment.clientId },
      data: { 
        status: 'IN_PROCESS',
      },
    })

    // 2. Enviar email de confirmação
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: payment.client.email,
          template: 'payment_confirmation',
          clientId: payment.clientId,
          variables: {
            payment_amount: `R$ ${payment.amount.toFixed(2)}`,
            payment_plan: getPaymentPackageName(payment.productId),
            payment_date: new Date().toLocaleDateString('pt-BR'),
            transaction_id: payment.transactionId,
          },
        }),
      })
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError)
    }

    // 3. Enviar WhatsApp de confirmação
    try {
      if (payment.client.phone) {
        await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: payment.client.phone,
            template: 'payment_confirmation',
            clientId: payment.clientId,
            variables: {
              payment_amount: `R$ ${payment.amount.toFixed(2)}`,
              payment_plan: getPaymentPackageName(payment.productId),
            },
          }),
        })
      }
    } catch (whatsappError) {
      console.error('Erro ao enviar WhatsApp de confirmação:', whatsappError)
    }

    // 4. Criar consultoria se aplicável
    const consultationTypes = ['consultoria-express', 'servico-vip']
    
    if (consultationTypes.some(type => payment.productId.includes(type))) {
      const existingConsultation = await prisma.consultation.findFirst({
        where: { 
          clientId: payment.clientId,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        },
      })

      if (!existingConsultation) {
        await prisma.consultation.create({
          data: {
            type: payment.productId.includes('vip') ? 'VIP_SERVICE' : 'HUMAN_CONSULTATION',
            status: 'SCHEDULED',
            clientId: payment.clientId,
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            notes: `Consultoria criada automaticamente após pagamento confirmado (${payment.transactionId})`,
          },
        }),
      }
    }

    // 5. Log das automações
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_SUCCESS_AUTOMATIONS',
        action: 'process_payment_success_automations',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    })

  } catch (error) {
    console.error('Erro ao processar automações do pagamento:', error)
    
    await prisma.automationLog.create({
      data: {
        type: 'PAYMENT_SUCCESS_AUTOMATIONS_ERROR',
        action: 'process_payment_success_automations',
        clientId: payment.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
        success: true,
      },
    }).catch(() => {}),
  }
}

function getPaymentPackageName(productId: string): string {
  const packageNames: Record<string, string> = {
    'pre-analise': 'Pré-análise Gratuita',
    'relatorio-premium': 'Relatório Premium',
    'consultoria-express': 'Consultoria Express',
    'servico-vip': 'Serviço VIP'
  }

  // Encontrar o pacote baseado no productId
  for (const [key, name] of Object.entries(packageNames)) {
    if (productId.includes(key)) {
      return name,
    }
  }

  return 'Serviço Visa2Any'
}