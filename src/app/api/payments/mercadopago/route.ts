import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const preference = new Preference(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🛒 Criando preferência MercadoPago:', body)

    // Detectar ambiente
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Criar preferência no MercadoPago
    const preferenceData = {
      items: body.items || [
        {
          id: `visa2any-${Date.now()}`,
          title: body.items?.[0]?.title || 'Consultoria Express - Visa2Any',
          description: body.items?.[0]?.description || 'Consultoria personalizada para processo de visto',
          unit_price: body.items?.[0]?.unit_price || 297,
          quantity: 1,
        }
      ],
      // Em produção, sempre enviar dados do cliente
      // Em desenvolvimento, omitir para evitar conflitos de teste
      ...(isProduction && body.customer ? {
        payer: {
          name: body.customer.name,
          email: body.customer.email,
          phone: body.customer.phone ? {
            number: body.customer.phone.replace(/\D/g, ''),
          } : undefined,
          identification: body.customer.cpf ? {
            type: 'CPF',
            number: body.customer.cpf.replace(/\D/g, ''),
          } : undefined,
        },
      } : {}),
      back_urls: {
        success: body.back_urls?.success || `${process.env.NEXTAUTH_URL}/payment/success`,
        failure: body.back_urls?.failure || `${process.env.NEXTAUTH_URL}/payment/failure`,
        pending: body.back_urls?.pending || `${process.env.NEXTAUTH_URL}/payment/pending`,
      },
      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,
      external_reference: body.external_reference || `visa2any-${Date.now()}`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: body.installments || 12,
        default_installments: body.installments || 1,
        default_payment_method_id: null,
        default_card_id: null,
      },
      statement_descriptor: 'VISA2ANY',
    }

    console.log('📋 Dados da preferência:', JSON.stringify(preferenceData, null, 2))

    // Criar preferência
    const result = await preference.create({ body: preferenceData })
    
    console.log('✅ Preferência criada:', result)

    return NextResponse.json({
      id: result.id,
      preference_id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      checkout_url: result.init_point,
      public_key: process.env.MERCADOPAGO_PUBLIC_KEY,
    })

  } catch (error) {
    console.error('❌ Erro ao criar preferência MercadoPago:', error)
    
    return NextResponse.json({
      error: 'Erro ao criar pagamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 }),
  },
}