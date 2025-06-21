import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, selectedPaymentMethod, preferenceId, customerData } = body
    
    console.log('🔄 Processando pagamento inline:', { 
      paymentMethod: selectedPaymentMethod,
      preferenceId,
      customerEmail: customerData?.email 
    })

    // Criar pagamento no MercadoPago
    const paymentData = {
      transaction_amount: formData.transaction_amount,
      token: formData.token,
      description: formData.description || 'Consultoria Visa2Any',
      installments: formData.installments || 1,
      payment_method_id: formData.payment_method_id,
      issuer_id: formData.issuer_id,
      payer: {
        email: customerData.email,
        identification: formData.payer?.identification || {
          type: 'CPF',
          number: formData.payer?.identification?.number
        }
      },
      external_reference: `visa2any-${preferenceId}-${Date.now()}`
    }

    console.log('📋 Dados do pagamento:', JSON.stringify(paymentData, null, 2))

    // Processar pagamento
    const result = await payment.create({ body: paymentData })
    
    console.log('✅ Pagamento processado:', result)

    // Salvar no banco de dados
    if (result.status === 'approved') {
      try {
        // Buscar ou criar cliente
        let client = await prisma.client.findUnique({
          where: { email: customerData.email }
        })

        if (!client) {
          client = await prisma.client.create({
            data: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              status: 'PAYING'
            }
          })
        }

        // Criar registro de pagamento
        await prisma.payment.create({
          data: {
            clientId: client.id,
            amount: result.transaction_amount,
            status: 'COMPLETED',
            method: result.payment_method_id,
            transactionId: result.id?.toString(),
            externalReference: paymentData.external_reference,
            paidAt: new Date()
          }
        })

        // Atualizar status do cliente
        await prisma.client.update({
          where: { id: client.id },
          data: { status: 'IN_PROCESS' }
        })

        console.log('💾 Pagamento salvo no banco de dados')

      } catch (dbError) {
        console.error('❌ Erro ao salvar no banco:', dbError)
        // Continuar mesmo com erro no banco
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        payment_method_id: result.payment_method_id,
        transaction_amount: result.transaction_amount,
        installments: result.installments
      },
      redirect_url: getRedirectUrl(result.status)
    })

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao processar pagamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

function getRedirectUrl(status: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  switch (status) {
    case 'approved':
      return `${baseUrl}/payment/success`
    case 'pending':
      return `${baseUrl}/payment/pending`
    case 'rejected':
    case 'cancelled':
      return `${baseUrl}/payment/failure`
    default:
      return `${baseUrl}/payment/pending`
  }
}