import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configurar MercadoPago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
if (!accessToken) {
  console.error('❌ MERCADOPAGO_ACCESS_TOKEN não configurado')
}

const client = new MercadoPagoConfig({
  accessToken: accessToken!,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('💳 Processando pagamento MercadoPago:', JSON.stringify(body, null, 2))

    const { selectedPaymentMethod, formData, preferenceId } = body

    // Validar dados essenciais
    if (!selectedPaymentMethod || !formData || !preferenceId) {
      return NextResponse.json({
        error: 'Dados obrigatórios ausentes'
        details: 'selectedPaymentMethod, formData e preferenceId são obrigatórios',
      }, { status: 400 })
    }

    if (!formData.transaction_amount || formData.transaction_amount <= 0) {
      return NextResponse.json({
        error: 'Valor inválido'
        details: 'transaction_amount deve ser maior que zero',
      }, { status: 400 })
    }

    // Criar dados do pagamento com base no método selecionado
    let paymentData: any = {
      transaction_amount: formData.transaction_amount,
      description: 'Consultoria Express - Visa2Any',
      external_reference: preferenceId,
      payment_method_id: selectedPaymentMethod
    }

    // Configurar dados específicos por método de pagamento
    if (selectedPaymentMethod === 'pix' || selectedPaymentMethod === 'bank_transfer') {
      // PIX (pode vir como 'pix' ou 'bank_transfer' do MercadoPago Bricks)
      paymentData.payment_method_id = 'pix'
      console.log('🎯 Processando PIX com payment_method_id:', paymentData.payment_method_id)
    } else if (formData.token) {
      // Cartão de crédito/débito
      paymentData.token = formData.token
      paymentData.installments = formData.installments || 1
      paymentData.issuer_id = formData.issuer_id
      console.log('💳 Processando cartão')
    } else if (selectedPaymentMethod === 'bolbradesco' || selectedPaymentMethod === 'pec') {
      // Boleto
      paymentData.payment_method_id = selectedPaymentMethod
      console.log('🎫 Processando boleto')
    }

    // Adicionar dados do pagador se disponíveis
    if (formData.payer) {
      paymentData.payer = {
        email: formData.payer.email,
        first_name: formData.payer.first_name,
        last_name: formData.payer.last_name,
        identification: formData.payer.identification,
      }
    }

    console.log('📋 Dados do pagamento:', JSON.stringify(paymentData, null, 2))

    // Processar pagamento
    const result = await payment.create({ body: paymentData })
    
    console.log('✅ Pagamento criado:', JSON.stringify(result, null, 2))

    // Para PIX, certificar que temos os dados necessários
    if ((selectedPaymentMethod === 'pix' || selectedPaymentMethod === 'bank_transfer')) {
      console.log('🎯 PIX - Dados de interação:', result.point_of_interaction)
      console.log('🎯 PIX - QR Code:', result.point_of_interaction?.transaction_data?.qr_code ? 'Presente' : 'Ausente')
      console.log('🎯 PIX - QR Code Base64:', result.point_of_interaction?.transaction_data?.qr_code_base64 ? 'Presente' : 'Ausente')
    }

    return NextResponse.json({
      payment_id: result.id
      status: result.status,
      status_detail: result.status_detail,
      payment_method: result.payment_method?.id || selectedPaymentMethod,
      point_of_interaction: result.point_of_interaction,
      qr_code: result.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: result.point_of_interaction?.transaction_data?.ticket_url,
      raw_result: result // Para debugging
    })

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({
      error: 'Erro ao processar pagamento'
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      paymentData: JSON.stringify(paymentData, null, 2)
    }, { status: 500 })
  }
}