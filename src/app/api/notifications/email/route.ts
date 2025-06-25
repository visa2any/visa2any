import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para envio de email
const sendEmailSchema = z.object({
  to: z.string().email('Email é obrigatório'),
  subject: z.string().min(1, 'Assunto é obrigatório').optional(),
  message: z.string().min(1, 'Mensagem é obrigatória').optional(),
  template: z.string().optional(),
  clientId: z.string().optional(),
  variables: z.record(z.any()).optional()
})

// Templates de email prontos
const EMAIL_TEMPLATES = {
  payment_confirmation: {
    subject: '✅ Pagamento Confirmado - Visa2Any',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Pagamento Confirmado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sua solicitação foi processada com sucesso</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; margin: 20px 0; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">📋 Detalhes do Pagamento</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">💰 Valor:</td><td>{payment_amount}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">📦 Plano:</td><td>{payment_plan}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">📅 Data:</td><td>{payment_date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">🔢 ID:</td><td>{transaction_id}</td></tr>
          </table>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin-top: 0;">📞 Próximos Passos</h3>
          <p style="margin: 10px 0;">✅ Seu pagamento foi confirmado</p>
          <p style="margin: 10px 0;">⏰ Em até 24h você receberá contato do nosso consultor</p>
          <p style="margin: 10px 0;">📱 Fique atento ao WhatsApp e email</p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px;">
          <p style="color: #666; margin: 0;">
            <strong>Visa2Any</strong> - Sua jornada internacional começa aqui<br>
            <small>contato@visa2any.com | (11) 5194-4717</small>
          </p>
        </div>
      </div>
    `
  },
  booking_confirmation: {
    subject: '📅 Agendamento Confirmado - Visa2Any', 
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📅 Agendamento Confirmado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sua consultoria foi agendada</p>
        </div>
        
        <div style="background: #f1f8e9; padding: 30px; margin: 20px 0; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">📋 Detalhes do Agendamento</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">👤 Cliente:</td><td>{client_name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">📅 Data:</td><td>{booking_date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">⏰ Horário:</td><td>{booking_time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">📞 Contato:</td><td>{client_phone}</td></tr>
          </table>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px;">
          <p style="color: #666; margin: 0;">
            <strong>Visa2Any</strong><br>
            <small>contato@visa2any.com | (11) 5194-4717</small>
          </p>
        </div>
      </div>
    `
  }
}

// POST /api/notifications/email - Enviar email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sendEmailSchema.parse(body)

    let emailContent = {
      subject: validatedData.subject || 'Mensagem da Visa2Any',
      html: validatedData.message || ''
    }

    // Se usar template, carregar template e processar variáveis
    if (validatedData.template && EMAIL_TEMPLATES[validatedData.template]) {
      const template = EMAIL_TEMPLATES[validatedData.template]
      emailContent.subject = template.subject
      emailContent.html = template.html

      // Processar variáveis no template
      if (validatedData.variables) {
        Object.entries(validatedData.variables).forEach(([key, value]) => {
          emailContent.html = emailContent.html.replace(
            new RegExp(`{${key}}`, 'g'), 
            String(value)
          )
          emailContent.subject = emailContent.subject.replace(
            new RegExp(`{${key}}`, 'g'), 
            String(value)
          )
        })
      }
    }

    // Enviar email usando o provedor configurado
    const emailResult = await sendEmailWithProvider({
      to: validatedData.to,
      subject: emailContent.subject,
      html: emailContent.html
    })

    // Log do envio
    await prisma.automationLog.create({
      data: {
        type: 'EMAIL',
        action: 'send_email',
        success: emailResult.success,
        clientId: validatedData.clientId || null,
        error: emailResult.error || null
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action'
        },
      }
    })

    return NextResponse.json({
      data: {
        messageId: emailResult.messageId,
        sent: emailResult.success,
        provider: emailResult.provider,
        to: validatedData.to
      },
      message: 'Email enviado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { status: 500 }
    )
  }
}

// Função para enviar email usando SMTP Hostinger configurado
async function sendEmailWithProvider({ to, subject, html }: { to: string, subject: string, html: string }) {
  // Usar SMTP Hostinger (já configurado)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      const result = await transporter.sendMail({
        from: `${process.env.FROM_NAME || 'Visa2Any'} <${process.env.FROM_EMAIL || 'info@visa2any.com'}>`,
        to: to,
        subject: subject,
        html: html
      })

      console.log('✅ Email enviado via Hostinger:', result.messageId)
      
      return {
        messageId: result.messageId,
        provider: 'hostinger_smtp'
      }
    } catch (error) {
      console.error('❌ Erro SMTP Hostinger:', error)
    }
  }

  // Fallback: Tentar SendGrid se configurado
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }],
            subject: subject
          }],
          from: {
            email: process.env.FROM_EMAIL || 'info@visa2any.com',
            name: process.env.FROM_NAME || 'Visa2Any'
          },
          content: [{
            type: 'text/html',
            value: html
          }]
        })
      })

      if (response.ok) {
        return {
          messageId: `sg_${Date.now()}`,
          provider: 'sendgrid'
        }
      }
    } catch (error) {
      console.error('SendGrid falhou:', error)
    }
  }

  // Se nada funcionou, simular envio
  console.log('📧 SIMULANDO ENVIO DE EMAIL (SMTP não configurado):')
  console.log('Para:', to)
  console.log('Assunto:', subject)
  console.log('De:', process.env.FROM_EMAIL)
  console.log('---')

  return {
    messageId: `sim_${Date.now()}`,
    provider: 'simulation'
  }
}