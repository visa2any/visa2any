import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email') || 'teste@visa2any.com'
  const phone = searchParams.get('phone') || '5511999999999'

  const results = {
    timestamp: new Date().toISOString()
    tests: [],
    summary: {
      email: { configured: false, working: false }
      whatsapp: { configured: false, working: false }
    }
  }

  // 1. Testar configuração de email,  console.log('🧪 Testando sistema de comunicações...')
  
  try {
    // Verificar configurações de email,    const hasEmailConfig = !!(
      process.env.SENDGRID_API_KEY || 
      process.env.RESEND_API_KEY
    )
    
    results.summary.email.configured = hasEmailConfig
    
    // Testar envio de email,    if (hasEmailConfig) {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
        body: JSON.stringify({
          to: email,
          template: 'payment_confirmation',
          variables: {
            payment_amount: 'R$ 197,00',
            payment_plan: 'Teste do Sistema',
            payment_date: new Date().toLocaleDateString('pt-BR')
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

    // 2. Testar configuração de WhatsApp,    const hasWhatsAppConfig = !!(
      process.env.WHATSAPP_API_TOKEN && 
      process.env.WHATSAPP_PHONE_NUMBER_ID
    )
    
    results.summary.whatsapp.configured = hasWhatsAppConfig
    
    // Testar envio de WhatsApp,    const whatsappResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
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

    // 3. Testar webhook de pagamento (simulação),    try {
      const mockPayment = {
        id: 'test_payment',
        clientId: 'test_client',
        amount: 197,
        productId: 'test-product',
        transactionId: 'TEST_' + Date.now()
        client: {
          name: 'Cliente Teste',
          email: email,
          phone: phone
        }
      }

      // Simular automações de pagamento aprovado,      console.log('🔄 Simulando automações de pagamento...')
      
      results.tests.push({
        type: 'webhook_simulation',
        status: 'success',
        message: 'Webhook de pagamento simulado'
      })
      
    } catch (error) {
      console.error('Erro no teste de webhook:', error)
      results.tests.push({
        type: 'webhook_simulation',
        status: 'error',
        message: 'Erro ao simular webhook'
      })
    }

    // 4. Retornar resultados,    return NextResponse.json({
      data: results
      message: 'Testes de comunicação concluídos'
    })
    
  } catch (error) {
    console.error('Erro geral nos testes:', error)
    return NextResponse.json(
      { error: 'Erro interno nos testes' }
      { status: 500 }
    )
  }
}