// Conditional import para Resend (opcional)
let resend: any = null
try {
  const { Resend } = require('resend')
  resend = new Resend(process.env.RESEND_API_KEY)
} catch (error) {
  console.log('Resend package not available, using SMTP only')
}

export interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  reply_to?: string
  attachments?: Array<{
    filename: string
    content: string
    content_type: string
  }>
}

// Função principal para enviar emails
export async function sendEmail(data: EmailData) {
  try {
    // Se Resend não estiver disponível, retorna erro
    if (!resend) {
      return {
        success: false,
        error: 'Resend package not available',
        messageId: null
      }
    }

    const fromEmail = data.from || process.env.FROM_EMAIL || 'contato@visa2any.com'
    
    const emailData = {
      from: fromEmail,
      to: Array.isArray(data.to) ? data.to : [data.to],
      subject: data.subject,
      html: data.html,
      text: data.text || stripHtml(data.html),
      reply_to: data.reply_to || fromEmail,
      attachments: data.attachments
    }

    const result = await resend.emails.send(emailData)

    if (result.error) {
      console.error('Erro Resend:', result.error)
      return {
        success: false,
        error: result.error.message,
        messageId: null
      }
    }

    return {
      success: true,
      messageId: result.data?.id || null,
      error: null
    }

  } catch (error) {
    console.error('Erro ao enviar email via Resend:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      messageId: null
    }
  }
}

// Função fallback para SMTP (caso Resend falhe)
export async function sendEmailSMTP(data: EmailData) {
  try {
    // Usar nodemailer como fallback (opcional)
    let nodemailer
    try {
      nodemailer = require('nodemailer')
    } catch (error) {
      return {
        success: false,
        error: 'Nodemailer package not available',
        messageId: null
      }
    }
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const mailOptions = {
      from: data.from || process.env.FROM_EMAIL || 'contato@visa2any.com',
      to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
      subject: data.subject,
      html: data.html,
      text: data.text || stripHtml(data.html),
      replyTo: data.reply_to,
      attachments: data.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.content_type
      }))
    }

    const result = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: result.messageId,
      error: null
    }

  } catch (error) {
    console.error('Erro ao enviar email via SMTP:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      messageId: null
    }
  }
}

// Função principal com fallback automático
export async function sendEmailWithFallback(data: EmailData) {
  // Primeiro tentar Resend
  let result = await sendEmail(data)
  
  // Se falhar e temos configuração SMTP, tentar SMTP
  if (!result.success && process.env.SMTP_HOST) {
    console.log('Resend falhou, tentando SMTP fallback...')
    result = await sendEmailSMTP(data)
  }
  
  return result
}

// Função para remover HTML e deixar apenas texto
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; com espaço
    .replace(/&amp;/g, '&') // Replace &amp; com &
    .replace(/&lt;/g, '<') // Replace &lt; com <
    .replace(/&gt;/g, '>') // Replace &gt; com >
    .replace(/&quot;/g, '"') // Replace &quot; com "
    .replace(/&#39;/g, "'") // Replace &#39; com '
    .replace(/\s+/g, ' ') // Replace múltiplos espaços com um
    .trim()
}

// Enviar email de teste para verificar configuração
export async function sendTestEmail(to: string = 'test@visa2any.com') {
  const testData: EmailData = {
    to: to,
    subject: '✅ Teste de Email - Visa2Any',
    html: `
      <h1>🎉 Email funcionando!</h1>
      <p>Este é um email de teste do sistema Visa2Any.</p>
      <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      <p><strong>Provedor:</strong> ${process.env.RESEND_API_KEY ? 'Resend' : 'SMTP'}</p>
      <hr>
      <p><small>Este email foi enviado automaticamente pelo sistema.</small></p>
    `
  }

  return await sendEmailWithFallback(testData)
}

// Templates de email prontos
export const emailTemplates = {
  welcome: (variables: Record<string, string>) => ({
    subject: `Bem-vindo à Visa2Any! 🌎`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌎 Bem-vindo à Visa2Any!</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${variables.client_name || 'Cliente'}</strong>!</p>
            
            <p>Seja muito bem-vindo(a) à <strong>Visa2Any</strong>! 🎉</p>
            
            <p>Estamos muito animados para ajudá-lo(a) a realizar seu sonho de viver em <strong>${variables.target_country || 'seu país de destino'}</strong>.</p>
            
            <h3>📋 Próximos passos:</h3>
            <ol>
              <li>📄 Complete seu perfil na plataforma</li>
              <li>📤 Faça upload dos seus documentos</li>
              <li>🤖 Receba sua análise de elegibilidade IA</li>
              <li>👥 Agende sua consultoria humana</li>
            </ol>
            
            <a href="${variables.website_url || 'https://visa2any.com'}/admin/dashboard" class="button">
              Acessar Plataforma
            </a>
            
            <p>Qualquer dúvida, estamos aqui para ajudar!</p>
            
            <p>Atenciosamente,<br>
            Equipe Visa2Any</p>
          </div>
          <div class="footer">
            <p>📧 ${variables.support_email || 'suporte@visa2any.com'} | 🌐 ${variables.website_url || 'https://visa2any.com'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  paymentConfirmation: (variables: Record<string, string>) => ({
    subject: `Pagamento confirmado - Seu processo foi iniciado! 💳`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
          .payment-details { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Pagamento confirmado! 🎉</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${variables.client_name || 'Cliente'}</strong>!</p>
            
            <p>Recebemos seu pagamento e seu processo foi oficialmente iniciado!</p>
            
            <div class="payment-details">
              <h3>💳 Detalhes do Pagamento</h3>
              <p><strong>Valor:</strong> ${variables.payment_amount || 'R$ 0,00'}</p>
              <p><strong>Plano:</strong> ${variables.payment_plan || 'Serviço Visa2Any'}</p>
              <p><strong>Data:</strong> ${variables.payment_date || new Date().toLocaleDateString('pt-BR')}</p>
              <p><strong>ID da Transação:</strong> ${variables.transaction_id || 'N/A'}</p>
            </div>
            
            <h3>🚀 O que acontece agora:</h3>
            <ol>
              <li>📞 Nossa equipe entrará em contato em até 24h</li>
              <li>📅 Agendaremos sua consultoria especializada</li>
              <li>📄 Iniciaremos a preparação dos seus documentos</li>
              <li>📊 Acompanhamento personalizado do seu caso</li>
            </ol>
            
            <a href="${variables.website_url || 'https://visa2any.com'}/admin/dashboard" class="button">
              Acompanhar Processo
            </a>
            
            <p>Obrigado por confiar em nós! 🙏</p>
            
            <p>Atenciosamente,<br>
            Equipe Visa2Any</p>
          </div>
          <div class="footer">
            <p>📧 ${variables.support_email || 'suporte@visa2any.com'} | 🌐 ${variables.website_url || 'https://visa2any.com'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  analysisReady: (variables: Record<string, string>) => ({
    subject: `Sua análise de elegibilidade está pronta! 📊`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #cce5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
          .result-box { background: #f0f8ff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #007bff; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Análise pronta!</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${variables.client_name || 'Cliente'}</strong>!</p>
            
            <p>Sua análise de elegibilidade para <strong>${variables.target_country || 'seu país de destino'}</strong> está pronta!</p>
            
            <div class="result-box">
              <h3>📊 Resultado da Análise</h3>
              <p><strong>País de destino:</strong> ${variables.target_country || 'N/A'}</p>
              <p><strong>Tipo de visto recomendado:</strong> ${variables.visa_type || 'N/A'}</p>
              <p><strong>Score de elegibilidade:</strong> ${variables.eligibility_score || 'N/A'}/100</p>
            </div>
            
            <h3>🚀 Próximos passos:</h3>
            <ol>
              <li>Acesse sua plataforma para ver os detalhes completos</li>
              <li>Revise os documentos necessários</li>
              <li>Agende sua consultoria humana</li>
            </ol>
            
            <a href="${variables.website_url || 'https://visa2any.com'}/admin/dashboard" class="button">
              Ver Análise Completa
            </a>
            
            <p>Parabéns por dar este importante passo! 🌟</p>
            
            <p>Atenciosamente,<br>
            Equipe Visa2Any</p>
          </div>
          <div class="footer">
            <p>📧 ${variables.support_email || 'suporte@visa2any.com'} | 🌐 ${variables.website_url || 'https://visa2any.com'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}