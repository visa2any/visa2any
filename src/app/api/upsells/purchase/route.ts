import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {  try {    const { offerId, customerId, priceId } = await request.json(),
    console.log('🛒 Processando compra de upsell:', { offerId, customerId, priceId })

    // Aqui integraria com o sistema de pagamentos (MercadoPago

    Stripe, etc.)
    // Por agora
    vamos simular uma resposta de sucesso

    const upsellProducts = {      'vip-upgrade': {        name: 'Upgrade VIP',        price: 3497,        description: 'Serviço premium com garantia de aprovação'
      },      'priority-processing': {        name: 'Processamento Prioritário',        price: 697,        description: 'Acelere seu processo em 50%'
      },      'consultation-boost': {        name: 'Consultoria Estratégica',        price: 397,        description: 'Aumente seu score de elegibilidade'
      },      'followup-service': {        name: 'Seguro de Aprovação',        price: 997,        description: 'Acompanhamento até aprovação final'
      },      'interview-prep': {        name: 'Preparação para Entrevista',        price: 497,        description: 'Treinamento para entrevista consular'
      }
    },
    const product = upsellProducts[offerId as keyof typeof upsellProducts]
    ,    if (!product) {      return NextResponse.json(,        { error: 'Produto não encontrado' },        { status: 404 }
      )
    }

    // Simular criação de ordem de pagamento

    const paymentUrl = `/checkout?product=${offerId}&customer=${customerId}&price=${product.price}`

    return NextResponse.json({      success: true,      message: 'Redirecionando para pagamento',      paymentUrl,      product
    })

  } catch (error) {    console.error('❌ Erro ao processar upsell:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}