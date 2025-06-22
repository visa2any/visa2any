import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email') || 'teste@visa2any.com'
  const phone = searchParams.get('phone') || '5511999999999'

  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      email: { configured: false, working: false },
      whatsapp: { configured: false, working: false }
    }
  }

  // 1. Testar configuração de email
  console.log('🧪 Testando sistema de comunicações...')
  
  try {
    // Verificar configurações de email
    const hasEmailConfig = !!(
      process.env.SENDGRID_API_KEY || 
      process.env.RESEND_API_KEY
    )
    
    results.summary.email.configured = hasEmailConfig
    
    // Testar envio de email
    if (hasEmailConfig) {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          template: 'payment_confirmation',
          variables: {
            payment_amount: 'R$ 197,00',
            payment_plan: 'Teste do Sistema',
            payment_date: new Date().toLocaleDateString('pt-BR'),
            transaction_id: 'TEST_' + Date.now()
          }
        })
      })
      
      const emailResult = await emailResponse.json()
      results.summary.email.working = emailResult.success
      
      results.tests.push({
        type: 'email',
        status: emailResult.success ? 'success' : 'error',
        message: emailResult.success ? 'Email enviado com sucesso' : emailResult.error,
        details: emailResult.data
      })
    } else {
      results.tests.push({
        type: 'email',
        status: 'warning',
        message: 'Email não configurado - usando simulação',
        details: 'Configure SENDGRID_API_KEY ou RESEND_API_KEY'
      })
    }

    // 2. Testar configuração de WhatsApp
    const hasWhatsAppConfig = !!(
      process.env.WHATSAPP_API_TOKEN && 
      process.env.WHATSAPP_PHONE_NUMBER_ID
    )
    
    results.summary.whatsapp.configured = hasWhatsAppConfig
    
    // Testar envio de WhatsApp
    const whatsappResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        message: `🧪 TESTE VISA2ANY\n\nSistema de comunicações funcionando!\n\nData: ${new Date().toLocaleString('pt-BR')}\nTipo: WhatsApp Business API\n\n✅ Teste realizado com sucesso!`
      })
    })
    
    const whatsappResult = await whatsappResponse.json()
    results.summary.whatsapp.working = whatsappResult.success
    
    results.tests.push({
      type: 'whatsapp',
      status: whatsappResult.success ? 'success' : 'error',
      message: whatsappResult.success ? 'WhatsApp enviado com sucesso' : 'WhatsApp em modo simulação',
      details: whatsappResult.data
    })

    // 3. Testar webhook de pagamento (simulação)
    try {
      const mockPayment = {
        id: 'test_payment',
        clientId: 'test_client',
        amount: 197,
        productId: 'test-product',
        transactionId: 'TEST_' + Date.now(),
        client: {
          name: 'Cliente Teste',
          email: email,
          phone: phone
        }
      }

      // Simular automações de pagamento aprovado
      console.log('🔄 Simulando automações de pagamento...')
      
      results.tests.push({
        type: 'webhook_simulation',
        status: 'success',
        message: 'Webhook de pagamento simulado',
        details: {
          payment_id: mockPayment.id,
          automations: ['email_confirmation', 'whatsapp_confirmation'],
          simulation: true
        }
      })

    } catch (webhookError) {
      results.tests.push({
        type: 'webhook_simulation',
        status: 'error',
        message: 'Erro na simulação do webhook',
        details: webhookError.message
      })
    }

  } catch (error) {
    console.error('Erro no teste:', error)
    results.tests.push({
      type: 'system_error',
      status: 'error',
      message: 'Erro geral no sistema',
      details: error.message
    })
  }

  // 4. Gerar relatório final
  const allWorking = results.tests.every(test => test.status === 'success')
  const hasWarnings = results.tests.some(test => test.status === 'warning')
  
  console.log('📊 RESULTADO DOS TESTES:')
  console.log('Email configurado:', results.summary.email.configured)
  console.log('Email funcionando:', results.summary.email.working)
  console.log('WhatsApp configurado:', results.summary.whatsapp.configured)
  console.log('WhatsApp funcionando:', results.summary.whatsapp.working)

  return NextResponse.json({
    success: true,
    data: {
      overall_status: allWorking ? 'all_working' : hasWarnings ? 'partial_working' : 'needs_configuration',
      tested_at: results.timestamp,
      test_email: email,
      test_phone: phone,
      results: results.tests,
      summary: results.summary,
      recommendations: generateRecommendations(results.summary)
    }
  })
}

function generateRecommendations(summary: any) {
  const recommendations = []

  if (!summary.email.configured) {
    recommendations.push({
      priority: 'high',
      type: 'email_config',
      title: 'Configurar provedor de email',
      description: 'Configure SENDGRID_API_KEY ou RESEND_API_KEY para envios reais',
      action: 'Adicione uma das chaves no arquivo .env'
    })
  }

  if (!summary.whatsapp.configured) {
    recommendations.push({
      priority: 'high',
      type: 'whatsapp_config',
      title: 'Configurar WhatsApp Business API',
      description: 'Configure WHATSAPP_API_TOKEN e WHATSAPP_PHONE_NUMBER_ID',
      action: 'Obtenha credenciais no Meta Business'
    })
  }

  if (summary.email.configured && !summary.email.working) {
    recommendations.push({
      priority: 'medium',
      type: 'email_debug',
      title: 'Verificar configuração de email',
      description: 'Email configurado mas não está funcionando',
      action: 'Verifique se as credenciais estão corretas'
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      type: 'all_good',
      title: 'Sistema funcionando perfeitamente!',
      description: 'Todas as comunicações estão ativas',
      action: 'Nenhuma ação necessária'
    })
  }

  return recommendations
}

// POST para testar com dados específicos
export async function POST(request: NextRequest) {
  try {
    const { email, phone, test_type } = await request.json()
    
    const testUrl = new URL('/api/test-communications', process.env.NEXTAUTH_URL)
    if (email) testUrl.searchParams.set('email', email)
    if (phone) testUrl.searchParams.set('phone', phone)
    
    const response = await fetch(testUrl.toString())
    const result = await response.json()
    
    return NextResponse.json(result)
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao executar teste',
      details: error.message
    }, { status: 500 })
  }
}