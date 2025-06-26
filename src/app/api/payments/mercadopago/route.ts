import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar MercadoPago,const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
}),
const preference = new Preference(client),

export async function POST(request: NextRequest) {,  try {,    const body = await request.json(),    
    console.log('🛒 Criando preferência MercadoPago:', body)

    // Detectar ambiente
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Validar dados obrigatórios,    if (!body.customer?.email) {,      return NextResponse.json({,        error: 'Email do comprador é obrigatório'
        code: 'MISSING_PAYER_EMAIL'
      }, { status: 400 })
    }

    // Preparar dados dos items com informações completas,    const items = body.items?.map((item: any, index: number) => ({,      id: item.id || `visa2any-item-${index + 1}`,      title: item.title || 'Consultoria Express - Visa2Any',      description: item.description || 'Consultoria personalizada para processo de visto',      category_id: item.category_id || 'services',      unit_price: Number(item.unit_price) || 297,      quantity: Number(item.quantity) || 1
      currency_id: 'BRL'
    })) || [,      {
        id: `visa2any-${Date.now()}`,        title: 'Consultoria Express - Visa2Any',        description: 'Consultoria personalizada para processo de visto',        category_id: 'services',        unit_price: 297,        quantity: 1,        currency_id: 'BRL'
      }
    ]

    // Preparar dados do payer com informações completas,    const payer: any = {
      email: body.customer.email
    }

    // Adicionar nome e sobrenome se disponível,    if (body.customer.name) {,      const nameParts = body.customer.name.split(' '),      payer.first_name = nameParts[0] || ''
      payer.last_name = nameParts.slice(1).join(' ') || nameParts[0] || ''
    }

    // Adicionar telefone se disponível,    if (body.customer.phone) {,      payer.phone = {,        area_code: body.customer.phone.replace(/\D/g, '').substring(0, 2)
        number: body.customer.phone.replace(/\D/g, '').substring(2)
      }
    }

    // Adicionar identificação se disponível,    if (body.customer.cpf) {,      payer.identification = {,        type: 'CPF'
        number: body.customer.cpf.replace(/\D/g, '')
      }
    }

    // Adicionar endereço se disponível,    if (body.customer.address) {,      payer.address = {,        street_name: body.customer.address.street || '',        street_number: body.customer.address.number || ''
        zip_code: body.customer.address.zipcode?.replace(/\D/g, '') || ''
      }
    }

    // Criar preferência no MercadoPago,    const preferenceData = {,      items,      payer,      back_urls: {,        success: body.back_urls?.success || `${process.env.NEXTAUTH_URL}/payment/success`,        failure: body.back_urls?.failure || `${process.env.NEXTAUTH_URL}/payment/failure`
        pending: body.back_urls?.pending || `${process.env.NEXTAUTH_URL}/payment/pending`
      },      notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook/mercadopago`,      external_reference: body.external_reference || `visa2any-${Date.now()}`,      expires: true,      expiration_date_from: new Date().toISOString(),      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas,      payment_methods: {
        excluded_payment_methods: []
        excluded_payment_types: [],        installments: body.installments || 12,        default_installments: body.installments || 1,        default_payment_method_id: null,        default_card_id: null
      },      statement_descriptor: 'VISA2ANY'
    },
    console.log('📋 Dados da preferência:', JSON.stringify(preferenceData, null, 2))

    // Criar preferência,    const result = await preference.create({ body: preferenceData })
    
    console.log('✅ Preferência criada:', result),
    return NextResponse.json({,      id: result.id,      preference_id: result.id,      init_point: result.init_point,      sandbox_init_point: result.sandbox_init_point,      checkout_url: result.init_point,      public_key: process.env.MERCADOPAGO_PUBLIC_KEY
    })

  } catch (error) {,    console.error('❌ Erro ao criar preferência MercadoPago:', error),    
    return NextResponse.json({,      error: 'Erro ao criar pagamento',      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}