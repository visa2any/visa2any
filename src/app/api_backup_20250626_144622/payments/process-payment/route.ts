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
    console.log('💳 Processando pagamento com token:', JSON.stringify(body, null, 2))

    // Validar dados obrigatórios do MercadoPago,    if (!body.token) {
      return NextResponse.json({
        error: 'Token do cartão é obrigatório',
        code: 'MISSING_TOKEN'
      }, { status: 400 })
    }

    if (!body.payer?.email) {
      return NextResponse.json({
        error: 'Email do comprador é obrigatório',
        code: 'MISSING_PAYER_EMAIL'
      }, { status: 400 })
    }

    if (!body.transaction_amount || body.transaction_amount <= 0) {
      return NextResponse.json({
        error: 'Valor da transação deve ser maior que zero',
        code: 'INVALID_AMOUNT'
      }, { status: 400 })
    }

    // Obter IP do cliente,    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'

    // Preparar dados do pagamento com todos os campos obrigatórios e recomendados,    const paymentData = {
      // Token do cartão (obrigatório),      token: body.token,
      
      // Dados básicos da transação,      transaction_amount: Number(body.transaction_amount),
      installments: Number(body.installments) || 1,
      payment_method_id: body.payment_method_id || 'credit_card',
      
      // Emissor do cartão (recomendado),      issuer_id: body.issuer_id,
      
      // Dados completos do pagador (obrigatórios e recomendados),      payer: {
        email: body.payer.email, // Obrigatório,        first_name: body.payer.first_name || '', // Recomendado
        last_name: body.payer.last_name || '', // Recomendado,        identification: body.payer.identification ? {
          type: body.payer.identification.type || 'CPF',
          number: body.payer.identification.number.replace(/\D/g, '')
        } : undefined,
        phone: body.payer.phone ? {
          area_code: body.payer.phone.area_code || '',
          number: body.payer.phone.number || ''
        } : undefined,
        address: body.payer.address ? {
          street_name: body.payer.address.street_name || '',
          street_number: body.payer.address.street_number || '',
          zip_code: body.payer.address.zip_code?.replace(/\D/g, '') || '',
          city: body.payer.address.city || '',
          federal_unit: body.payer.address.federal_unit || ''
        } : undefined
      },

      // Informações dos itens (recomendado para melhor aprovação),      additional_info: {
        items: body.additional_info?.items || [
          {
            id: `visa2any-${Date.now()}`, // Código do item,            title: 'Consultoria Express - Visa2Any', // Nome do item
            description: 'Consultoria personalizada para processo de visto', // Descrição do item,            category_id: 'services', // Categoria do item
            quantity: 1, // Quantidade,            unit_price: Number(body.transaction_amount) // Preço unitário
          }
        ],
        payer: {
          first_name: body.payer.first_name || '',
          last_name: body.payer.last_name || '',
          phone: body.payer.phone ? {
            area_code: body.payer.phone.area_code || '',
            number: body.payer.phone.number || ''
          } : undefined,
          address: body.payer.address || undefined,
          registration_date: new Date().toISOString()
        },
        shipments: body.payer.address ? {
          receiver_address: {
            street_name: body.payer.address.street_name || '',
            street_number: body.payer.address.street_number || '',
            zip_code: body.payer.address.zip_code?.replace(/\D/g, '') || '',
            city_name: body.payer.address.city || '',
            state_name: body.payer.address.federal_unit || ''
          }
        } : undefined
      },

      // Referência externa (obrigatório para conciliação),      external_reference: body.external_reference || `visa2any-${Date.now()}`,
      
      // Descrição na fatura do cartão (recomendado),      statement_descriptor: 'VISA2ANY',
      
      // URL de notificação webhook (obrigatório),      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,
      
      // Modo binário para aprovação imediata (boas práticas),      binary_mode: body.binary_mode || true,
      
      // Captura automática (boas práticas),      capture: body.capture !== false,

      // Metadata para análise de fraude,      metadata: {
        platform: 'visa2any',
        version: '1.0',
        device_id: body.device_id || '', // Device ID (obrigatório),        ip_address: clientIP,
        user_agent: body.metadata?.user_agent || '',
        session_id: body.external_reference || `session-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    }

    console.log('📋 Dados do pagamento preparados:', JSON.stringify(paymentData, null, 2))

    // Processar pagamento no MercadoPago,    const result = await payment.create({ body: paymentData })
    
    console.log('✅ Resposta do MercadoPago:', JSON.stringify(result, null, 2))

    // Salvar pagamento no banco de dados,    try {
      await prisma.payment.create({
        data: {
          id: `mp_${result.id}`,
          paymentId: result.id?.toString() || '',
          amount: Number(result.transaction_amount),
          currency: result.currency_id || 'BRL',
          status: result.status || 'pending',
          paymentMethod: result.payment_method?.id || 'unknown',
          externalReference: result.external_reference || '',
          payerEmail: result.payer?.email || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          mercadopagoData: result as any
        }
      })
      
      console.log('✅ Pagamento salvo no banco de dados')
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar no banco:', dbError)
      // Não falhar o pagamento por erro de DB    }

    // Preparar resposta,    const response = {
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
        
        // Para cartão de crédito,        card: result.card ? {
          first_six_digits: result.card.first_six_digits,
          last_four_digits: result.card.last_four_digits,
          cardholder_name: result.card.cardholder?.name
        } : undefined,

        // Para outros métodos (PIX, boleto, etc)
        point_of_interaction: result.point_of_interaction,
        
        // Dados de fees,        fee_details: result.fee_details,
        
        // Informações de segurança (apenas em desenvolvimento),        ...(process.env.NODE_ENV === 'development' && {
          raw_response: result
        })
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Análise do tipo de erro do MercadoPago,    let errorCode = 'UNKNOWN_ERROR'
    let errorMessage = 'Erro ao processar pagamento'
    
    if (error instanceof Error) {
      // Erros comuns do MercadoPago,      if (error.message.includes('invalid_token')) {
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