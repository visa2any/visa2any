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
      const client = await prisma.client.findUnique({
        where: { email: data.payer.email }
      })
      if (client) {
        clientId = client.id
        console.log('✅ Cliente encontrado:', clientId)
      } else {
        // Opcional: Criar cliente se não existir? Ou retornar erro?
        // Por segurança, vamos tentar encontrar ou falhar.
        // Mas como o checkout já cria, deve existir.
      }
    }

    if (!clientId) {
      return NextResponse.json({
        error: 'ID do cliente é obrigatório e não foi encontrado',
        code: 'MISSING_CLIENT_ID'
      }, { status: 400 });
    }

    // Obter IP do cliente
    const clientIP = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Preparar dados do pagamento com todos os campos obrigatórios e recomendados
    const payer: any = {
      email: data.payer.email,
      first_name: data.payer.first_name,
      last_name: data.payer.last_name,
      identification: data.payer.identification
    };
    if (data.payer.phone) payer.phone = data.payer.phone;
    if (data.payer.address) payer.address = data.payer.address;

    // Montar payer para additional_info sem phone undefined
    const additionalInfoPayer: any = {
      email: data.payer.email,
      first_name: data.payer.first_name,
      last_name: data.payer.last_name,
      identification: data.payer.identification
    };
    if (data.payer.phone) additionalInfoPayer.phone = data.payer.phone;
    if (data.payer.address) additionalInfoPayer.address = data.payer.address;

    const additionalInfo: any = {
      items: data.additional_info?.items || [
        {
          id: `visa2any-${Date.now()}`,
          title: 'Consultoria Express - Visa2Any',
          description: 'Consultoria personalizada para processo de visto',
          category_id: 'services',
          quantity: 1,
          unit_price: Number(data.transaction_amount)
        }
      ],
      payer: additionalInfoPayer
    };
    if (data.payer.address) {
      additionalInfo.shipments = {
        receiver_address: {
          street_name: data.payer.address.street_name || '',
          street_number: data.payer.address.street_number || '',
          zip_code: data.payer.address.zip_code?.replace(/\D/g, '') || '',
          city_name: data.payer.address.city || '',
          state_name: data.payer.address.federal_unit || ''
        }
      };
    }

    const paymentData = {
      // Token do cartão (obrigatório)
      token: data.token,

      // Dados básicos da transação
      transaction_amount: Number(data.transaction_amount),
      installments: Number(data.installments) || 1,
      payment_method_id: data.payment_method_id || 'credit_card',

      // Emissor do cartão (recomendado)
      issuer_id: data.issuer_id,

      // Dados completos do pagador (obrigatórios e recomendados)
      payer,

      // Informações dos itens (recomendado para melhor aprovação)
      additional_info: additionalInfo,

      // Referência externa (obrigatório para conciliação)
      external_reference: data.external_reference || `visa2any-${Date.now()}`,

      // Descrição na fatura do cartão (recomendado)
      statement_descriptor: 'VISA2ANY',

      // URL de notificação webhook (obrigatório)
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,

      // Modo binário para aprovação imediata (boas práticas)
      binary_mode: data.binary_mode || true,

      // Captura automática (boas práticas)
      capture: data.capture !== false,

      // Metadata para análise de fraude
      metadata: {
        platform: 'visa2any',
        version: '1.0',
        device_id: data.device_id || '', // Device ID (obrigatório)
        ip_address: clientIP,
        user_agent: data.metadata?.user_agent || '',
        session_id: data.external_reference || `session-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    }

    console.log('📋 Dados do pagamento preparados:', JSON.stringify(paymentData, null, 2))

    // Processar pagamento no MercadoPago
    const result = await payment.create({ body: paymentData })

    console.log('✅ Resposta do MercadoPago:', JSON.stringify(result, null, 2))

    // Salvar pagamento no banco de dados
    try {
      await prisma.payment.create({
        data: {
          id: `mp_${result.id}`,
          amount: Number(result.transaction_amount),
          currency: result.currency_id || 'BRL',
          status: (result.status as any) || 'pending',
          paymentMethod: result.payment_method?.id || 'unknown',
          clientId: clientId, // Usar variável resolvida
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      console.log('✅ Pagamento salvo no banco de dados')
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar no banco:', dbError)
      // Não falhar o pagamento por erro de DB
    }

    // Preparar resposta
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

        // Informações de segurança (apenas em desenvolvimento)
        ...(process.env.NODE_ENV === 'development' && {
          raw_response: result
        })
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')

    // Análise do tipo de erro do MercadoPago
    let errorCode = 'PAYMENT_ERROR'
    let errorMessage = 'Erro ao processar pagamento'

    if (error instanceof Error) {
      // Erros comuns do MercadoPago
      if (error.message.includes('invalid_token')) {
        errorCode = 'INVALID_TOKEN'
        errorMessage = 'Token do cartão inválido'
      } else if (error.message.includes('card_not_found')) {
        errorCode = 'CARD_NOT_FOUND'
        errorMessage = 'Cartão não encontrado'
      } else if (error.message.includes('insufficient_amount')) {
        errorCode = 'INSUFFICIENT_AMOUNT'
        errorMessage = 'Valor insuficiente'
      } else if (error.message.includes('cc_rejected')) {
        errorCode = 'CARD_REJECTED'
        errorMessage = 'Cartão rejeitado'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      code: errorCode,
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      })
    }, { status: 500 })
  }
}