import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para envio de email
const sendEmailSchema = z.object({
  to: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  clientId: z.string().optional(),
  template: z.string().optional(),
  variables: z.record(z.any()).optional()
})

// POST /api/notifications/email - Enviar email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sendEmailSchema.parse(body)

    // Se tem template, processar template
    let finalContent = validatedData.content
    let finalSubject = validatedData.subject

    if (validatedData.template) {
      const templateResult = await processEmailTemplate(
        validatedData.template, 
        validatedData.variables || {},
        validatedData.clientId
      )
      finalContent = templateResult.content
      finalSubject = templateResult.subject
    }

    // Enviar email (simulado - em produção usar SendGrid/Mailgun)
    const emailResult = await sendEmail({
      to: validatedData.to,
      subject: finalSubject,
      content: finalContent
    })

    // Salvar interação
    if (validatedData.clientId) {
      await prisma.interaction.create({
        data: {
          type: 'AUTOMATED_EMAIL',
          channel: 'email',
          direction: 'outbound',
          subject: finalSubject,
          content: finalContent,
          clientId: validatedData.clientId,
          completedAt: emailResult.success ? new Date() : null
        }
      })
    }

    // Log do envio
    await prisma.automationLog.create({
      data: {
        type: 'EMAIL_SENT',
        action: 'send_email',
        details: {
          to: validatedData.to,
          subject: finalSubject,
          template: validatedData.template,
          emailId: emailResult.messageId
        },
        success: emailResult.success,
        clientId: validatedData.clientId || null,
        error: emailResult.success ? null : emailResult.error
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        messageId: emailResult.messageId,
        sent: emailResult.success
      },
      message: 'Email enviado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/notifications/email/templates - Obter templates disponíveis
export async function GET(request: NextRequest) {
  try {
    const templates = getEmailTemplates()

    return NextResponse.json({
      success: true,
      data: { templates }
    })

  } catch (error) {
    console.error('Erro ao buscar templates:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para enviar email real usando Resend
async function sendEmail({ to, subject, content }: { to: string, subject: string, content: string }) {
  try {
    // Usar Resend (ou fallback SMTP) para emails reais
    const { sendEmailWithFallback } = await import('@/lib/resend')
    
    const result = await sendEmailWithFallback({
      to: to,
      subject: subject,
      html: content
    })

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 EMAIL ENVIADO:')
      console.log('Para:', to)
      console.log('Assunto:', subject)
      console.log('Success:', result.success)
      console.log('MessageID:', result.messageId)
      console.log('---')
    }

    return result

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    
    // Se não conseguiu enviar, simular sucesso em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 EMAIL SIMULADO (desenvolvimento):')
      console.log('Para:', to)
      console.log('Assunto:', subject)
      console.log('Conteúdo:', content.substring(0, 100) + '...')
      console.log('---')
      
      return {
        success: true,
        messageId: `dev-${Date.now()}`,
        error: null
      }
    }
    
    return {
      success: false,
      messageId: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Processar template de email
async function processEmailTemplate(templateName: string, variables: any, clientId?: string) {
  const templates = getEmailTemplates()
  const template = templates[templateName]

  if (!template) {
    throw new Error(`Template ${templateName} não encontrado`)
  }

  let client = null
  if (clientId) {
    client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        consultations: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })
  }

  // Variáveis padrão
  const defaultVariables = {
    client_name: client?.name || 'Cliente',
    client_email: client?.email || '',
    target_country: client?.targetCountry || '',
    visa_type: client?.visaType || '',
    company_name: 'Visa2Any',
    support_email: 'suporte@visa2any.com',
    website_url: process.env.NEXTAUTH_URL || 'https://visa2any.com',
    current_date: new Date().toLocaleDateString('pt-BR'),
    ...variables
  }

  // Substituir variáveis no template
  let content = template.content
  let subject = template.subject

  Object.entries(defaultVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    content = content.replace(new RegExp(placeholder, 'g'), String(value))
    subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
  })

  return { content, subject }
}

// Templates de email disponíveis
function getEmailTemplates() {
  return {
    welcome: {
      name: 'Boas-vindas',
      subject: 'Bem-vindo à {{company_name}}! 🌎',
      content: `
        <h1>Olá, {{client_name}}!</h1>
        
        <p>Seja muito bem-vindo(a) à <strong>{{company_name}}</strong>! 🎉</p>
        
        <p>Estamos muito animados para ajudá-lo(a) a realizar seu sonho de viver em {{target_country}}.</p>
        
        <h2>Próximos passos:</h2>
        <ol>
          <li>📋 Complete seu perfil na plataforma</li>
          <li>📄 Faça upload dos seus documentos</li>
          <li>🤖 Receba sua análise de elegibilidade IA</li>
          <li>👥 Agende sua consultoria humana</li>
        </ol>
        
        <p>Qualquer dúvida, estamos aqui para ajudar!</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
        
        <hr>
        <small>📧 {{support_email}} | 🌐 {{website_url}}</small>
      `
    },

    analysis_ready: {
      name: 'Análise Pronta',
      subject: 'Sua análise de elegibilidade está pronta! 📊',
      content: `
        <h1>Ótimas notícias, {{client_name}}! 🎉</h1>
        
        <p>Sua análise de elegibilidade para <strong>{{target_country}}</strong> está pronta!</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>📊 Resultado da Análise</h2>
          <p><strong>País de destino:</strong> {{target_country}}</p>
          <p><strong>Tipo de visto recomendado:</strong> {{visa_type}}</p>
          <p><strong>Score de elegibilidade:</strong> {{eligibility_score}}/100</p>
        </div>
        
        <h2>🚀 Próximos passos:</h2>
        <ol>
          <li>Acesse sua plataforma para ver os detalhes completos</li>
          <li>Revise os documentos necessários</li>
          <li>Agende sua consultoria humana</li>
        </ol>
        
        <a href="{{website_url}}/admin/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Ver Análise Completa
        </a>
        
        <p>Parabéns por dar este importante passo! 🌟</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
      `
    },

    consultation_scheduled: {
      name: 'Consultoria Agendada',
      subject: 'Consultoria agendada para {{consultation_date}} ⏰',
      content: `
        <h1>Consultoria agendada com sucesso! 📅</h1>
        
        <p>Olá, {{client_name}}!</p>
        
        <p>Sua consultoria foi agendada com sucesso! Estamos ansiosos para conversar com você.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>📅 Detalhes da Consultoria</h2>
          <p><strong>Data:</strong> {{consultation_date}}</p>
          <p><strong>Horário:</strong> {{consultation_time}}</p>
          <p><strong>Duração:</strong> {{consultation_duration}} minutos</p>
          <p><strong>Tipo:</strong> {{consultation_type}}</p>
          <p><strong>Consultor:</strong> {{consultant_name}}</p>
        </div>
        
        <h2>📋 Prepare-se para a consultoria:</h2>
        <ul>
          <li>✅ Tenha seus documentos em mãos</li>
          <li>✅ Prepare suas dúvidas principais</li>
          <li>✅ Esteja em um ambiente silencioso</li>
          <li>✅ Teste sua conexão de internet</li>
        </ul>
        
        <a href="{{meeting_link}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Entrar na Reunião
        </a>
        
        <p>Até logo!</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
      `
    },

    payment_confirmation: {
      name: 'Confirmação de Pagamento',
      subject: 'Pagamento confirmado - Seu processo foi iniciado! 💳',
      content: `
        <h1>Pagamento confirmado! 🎉</h1>
        
        <p>Olá, {{client_name}}!</p>
        
        <p>Recebemos seu pagamento e seu processo foi oficialmente iniciado!</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>💳 Detalhes do Pagamento</h2>
          <p><strong>Valor:</strong> {{payment_amount}}</p>
          <p><strong>Plano:</strong> {{payment_plan}}</p>
          <p><strong>Data:</strong> {{payment_date}}</p>
          <p><strong>ID da Transação:</strong> {{transaction_id}}</p>
        </div>
        
        <h2>🚀 O que acontece agora:</h2>
        <ol>
          <li>📞 Nossa equipe entrará em contato em até 24h</li>
          <li>📅 Agendaremos sua consultoria especializada</li>
          <li>📄 Iniciaremos a preparação dos seus documentos</li>
          <li>📊 Acompanhamento personalizado do seu caso</li>
        </ol>
        
        <p><strong>Seu consultor dedicado:</strong> {{consultant_name}}</p>
        <p><strong>Email de contato:</strong> {{consultant_email}}</p>
        
        <a href="{{website_url}}/admin/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Acompanhar Processo
        </a>
        
        <p>Obrigado por confiar em nós! 🙏</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
      `
    },

    document_approved: {
      name: 'Documento Aprovado',
      subject: 'Documento aprovado! ✅ {{document_name}}',
      content: `
        <h1>Documento aprovado! ✅</h1>
        
        <p>Olá, {{client_name}}!</p>
        
        <p>Temos boas notícias! Seu documento foi analisado e aprovado.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>📄 Documento Aprovado</h2>
          <p><strong>Nome:</strong> {{document_name}}</p>
          <p><strong>Tipo:</strong> {{document_type}}</p>
          <p><strong>Status:</strong> ✅ Aprovado</p>
          <p><strong>Data da análise:</strong> {{analysis_date}}</p>
        </div>
        
        <p>Este documento está pronto para ser incluído no seu processo de visto.</p>
        
        <h2>📋 Próximos documentos necessários:</h2>
        {{pending_documents}}
        
        <a href="{{website_url}}/admin/documents" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Ver Todos os Documentos
        </a>
        
        <p>Continue o bom trabalho! 💪</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
      `
    },

    follow_up: {
      name: 'Follow-up',
      subject: 'Como está seu processo? Estamos aqui para ajudar! 🤝',
      content: `
        <h1>Olá, {{client_name}}! 👋</h1>
        
        <p>Esperamos que esteja tudo bem! Queremos saber como está andando seu processo de visto para <strong>{{target_country}}</strong>.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>📊 Status Atual do Seu Processo</h2>
          <p><strong>País de destino:</strong> {{target_country}}</p>
          <p><strong>Tipo de visto:</strong> {{visa_type}}</p>
          <p><strong>Status:</strong> {{client_status}}</p>
          <p><strong>Última atividade:</strong> {{last_activity_date}}</p>
        </div>
        
        <h2>💡 Precisa de ajuda?</h2>
        <p>Nossa equipe está sempre disponível para:</p>
        <ul>
          <li>📞 Tirar dúvidas sobre documentos</li>
          <li>📅 Agendar nova consultoria</li>
          <li>📋 Revisar sua estratégia</li>
          <li>🚀 Acelerar seu processo</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{website_url}}/admin/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
            Acessar Plataforma
          </a>
          
          <a href="mailto:{{support_email}}?subject=Preciso de ajuda - {{client_name}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px;">
            Falar com Especialista
          </a>
        </div>
        
        <p>Estamos torcendo pelo seu sucesso! 🌟</p>
        
        <p>Atenciosamente,<br>
        Equipe {{company_name}}</p>
      `
    }
  }
}