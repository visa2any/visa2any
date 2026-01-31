import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Configurar MercadoPago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
if (!accessToken) {
  console.error('❌ MERCADOPAGO_ACCESS_TOKEN não configurado')
}

const client = new MercadoPagoConfig({
  accessToken: accessToken!
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('💳 Processando pagamento (DEBUG FULL):', JSON.stringify(body, null, 2))
    console.log('🔍 Flattened keys:', Object.keys(body))
    console.log('🔍 FormData check:', body.formData ? JSON.stringify(body.formData, null, 2) : 'No formData')

    // 1. Normalizar dados (Flatten formData se existir)
    const data = {
      ...body,
      ...(body.formData || {})
    }

    console.log('🔄 Dados normalizados:', JSON.stringify(data, null, 2))

    // Validar dados obrigatórios do MercadoPago
    if (!data.token) {
      console.error('❌ ERRO CRÍTICO: Token faltando. Recebido:', JSON.stringify(body))
      return NextResponse.json({
        error: 'Token do cartão é obrigatório',
        code: 'MISSING_TOKEN',
        debug_normalized_data: data
      }, { status: 400 })
    }

    if (!data.payer?.email) {
      return NextResponse.json({
        error: 'Email do comprador é obrigatório',
        code: 'MISSING_PAYER_EMAIL'
      }, { status: 400 })
    }

    if (!data.transaction_amount || data.transaction_amount <= 0) {
      return NextResponse.json({
        error: 'Valor da transação deve ser maior que zero',
        code: 'INVALID_AMOUNT'
      }, { status: 400 })
    }

    // 2. Garantir Client ID (Buscar por email se não vier)
    let clientId = data.clientId
    if (!clientId) {
      console.log('⚠️ ClientId não fornecido. Buscando por email:', data.payer.email)
      const dbClient = await prisma.client.findUnique({
        where: { email: data.payer.email }
      })
      if (dbClient) {
        clientId = dbClient.id
        console.log('✅ Cliente encontrado:', clientId)
      } else {
        console.log('⚠️ Cliente não encontrado no banco, continuando sem clientId')
        // Não falhar - permitir pagamento mesmo sem cliente cadastrado
      }
    }

    // Obter IP do cliente
    const clientIP = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Preparar dados do pagamento com todos os campos obrigatórios
    const paymentData: any = {
      // Token do cartão (obrigatório)
      token: data.token,

      // Dados básicos da transação (obrigatórios)
      transaction_amount: Number(data.transaction_amount),
      installments: Number(data.installments) || 1,
      payment_method_id: data.payment_method_id,

      // Descrição (obrigatório para processamento)
      description: 'Consultoria Express - Visa2Any',

      // Emissor do cartão (converter para número se existir)
      ...(data.issuer_id && { issuer_id: Number(data.issuer_id) }),

      // Dados do pagador (obrigatório)
      payer: {
        email: data.payer.email,
        ...(data.payer.identification && { identification: data.payer.identification }),
        ...(data.payer.first_name && { first_name: data.payer.first_name }),
        ...(data.payer.last_name && { last_name: data.payer.last_name })
      },

      // Referência externa para conciliação
      external_reference: `visa2any-${Date.now()}`,

      // Descrição na fatura do cartão
      statement_descriptor: 'VISA2ANY',

      // URL de notificação webhook
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,

      // Modo binário para aprovação imediata
      binary_mode: true,

      // Captura automática
      capture: true,

      // Metadata
      metadata: {
        platform: 'visa2any',
        ip_address: clientIP
      }
    }

    console.log('📋 Dados do pagamento preparados:', JSON.stringify(paymentData, null, 2))

    // Processar pagamento no MercadoPago
    let result
    try {
      result = await payment.create({ body: paymentData })
      console.log('✅ Resposta do MercadoPago:', JSON.stringify(result, null, 2))
    } catch (mpError: any) {
      // Capturar erro específico do Mercado Pago
      console.error('❌ Erro do MercadoPago API:', mpError)
      console.error('❌ Erro completo (stringify):', JSON.stringify(mpError, null, 2))

      // O SDK do MercadoPago pode retornar erros em diferentes formatos
      let mpErrorMessage = 'Erro da API do Mercado Pago'
      let mpErrorCode = 'MERCADOPAGO_API_ERROR'
      let mpErrorDetails = ''

      if (mpError?.cause) {
        // Erro do SDK v2 geralmente tem 'cause' com array de erros
        mpErrorDetails = JSON.stringify(mpError.cause)
        if (Array.isArray(mpError.cause) && mpError.cause.length > 0) {
          const firstCause = mpError.cause[0]
          mpErrorMessage = firstCause.description || firstCause.message || mpErrorMessage
          mpErrorCode = firstCause.code || mpErrorCode
        }
      } else if (mpError?.message) {
        mpErrorMessage = mpError.message
      } else if (typeof mpError === 'string') {
        mpErrorMessage = mpError
      }

      return NextResponse.json({
        success: false,
        error: mpErrorMessage,
        code: mpErrorCode,
        details: mpErrorDetails || JSON.stringify(mpError),
        debug: {
          paymentDataSent: paymentData,
          rawError: String(mpError)
        }
      }, { status: 400 })
    }

    // Salvar pagamento no banco de dados (se tivermos clientId)
    // NOTE: Salvamos mesmo se for rejeitado, para ter histórico
    if (clientId) {
      try {
        await prisma.payment.create({
          data: {
            id: `mp_${result.id}`,
            amount: Number(result.transaction_amount),
            currency: result.currency_id || 'BRL',
            status: (result.status as any) || 'pending',
            paymentMethod: result.payment_method?.id || 'unknown',
            clientId: clientId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log('✅ Pagamento salvo no banco de dados')
      } catch (dbError) {
        console.error('⚠️ Erro ao salvar no banco:', dbError)
        // Não falhar o pagamento por erro de DB
      }
    }

    // Verificação explícita de status (CRITICAL FIX)
    // Se o status for rejected ou cancelled, retornamos ERRO para o frontend
    if (result.status === 'rejected' || result.status === 'cancelled') {
      let errorMessage = 'Pagamento recusado pelo banco.';
      const statusDetail = result.status_detail;

      // Mapeamento de erros comuns
      switch (statusDetail) {
        case 'cc_rejected_bad_filled_card_number': errorMessage = 'Número do cartão incorreto.'; break;
        case 'cc_rejected_bad_filled_date': errorMessage = 'Data de validade incorreta.'; break;
        case 'cc_rejected_bad_filled_other': errorMessage = 'Verifique os dados do cartão.'; break;
        case 'cc_rejected_bad_filled_security_code': errorMessage = 'CVV incorreto.'; break;
        case 'cc_rejected_blacklist': errorMessage = 'Pagamento não processado por segurança.'; break;
        case 'cc_rejected_call_for_authorize': errorMessage = 'Autorize o pagamento com seu banco.'; break;
        case 'cc_rejected_card_disabled': errorMessage = 'Ligue para o banco para habilitar o cartão.'; break;
        case 'cc_rejected_card_error': errorMessage = 'Não conseguimos processar o pagamento.'; break;
        case 'cc_rejected_duplicated_payment': errorMessage = 'Você já fez um pagamento com esse valor.'; break;
        case 'cc_rejected_high_risk': errorMessage = 'Pagamento recusado por análise de risco.'; break;
        case 'cc_rejected_insufficient_amount': errorMessage = 'Saldo insuficiente.'; break;
        case 'cc_rejected_invalid_installments': errorMessage = 'Número de parcelas inválido.'; break;
        case 'cc_rejected_max_attempts': errorMessage = 'Você atingiu o limite de tentativas.'; break;
        case 'cc_rejected_other_reason': errorMessage = 'Pagamento recusado pelo banco emissor.'; break;
      }

      console.log('❌ Pagamento REJEITADO:', statusDetail, errorMessage)

      return NextResponse.json({
        success: false,
        error: errorMessage,
        code: 'PAYMENT_REJECTED',
        details: statusDetail,
        payment: {
          id: result.id,
          status: result.status,
          status_detail: result.status_detail
        }
      }, { status: 400 }) // Retornar 400 para que o frontend mostre o erro
    }

    // Preparar resposta de sucesso real
    const response = {
      success: true,
      payment: {
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        payment_method_id: result.payment_method?.id,
        transaction_amount: result.transaction_amount,
        installments: result.installments,
        external_reference: result.external_reference,
        date_created: result.date_created,
        date_approved: result.date_approved,

        // Para cartão de crédito
        card: result.card ? {
          first_six_digits: result.card.first_six_digits,
          last_four_digits: result.card.last_four_digits,
          cardholder_name: result.card.cardholder?.name
        } : undefined,

        // Para outros métodos (PIX, boleto, etc)
        point_of_interaction: result.point_of_interaction,

        // Dados de fees
        fee_details: result.fee_details,

        // Debug
        ...(process.env.NODE_ENV === 'development' && {
          raw_response: result
        })
      }
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Erro geral ao processar pagamento:', error)
    console.error('❌ Tipo do erro:', typeof error)
    console.error('❌ Erro stringify:', JSON.stringify(error, Object.getOwnPropertyNames(error)))

    // Tentar extrair informação útil do erro
    let errorMessage = 'Erro ao processar pagamento'
    let errorCode = 'PAYMENT_ERROR'
    let errorDetails = ''

    if (error instanceof Error) {
      errorMessage = error.message || errorMessage
      errorDetails = error.stack || ''
    } else if (typeof error === 'object' && error !== null) {
      errorDetails = JSON.stringify(error)
      if (error.message) errorMessage = error.message
      if (error.code) errorCode = error.code
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      code: errorCode,
      details: errorDetails
    }, { status: 500 })
  }
}