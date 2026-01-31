import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, clientId, template, subject, priority = 'medium' } = body

    if (!type || !content || !clientId) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Get client information
    let client

    // 1. Try to find by ID if valid
    if (clientId && clientId !== 'unknown' && !clientId.startsWith('payment-')) {
      try {
        client = await prisma.client.findUnique({
          where: { id: clientId },
          select: { id: true, name: true, email: true, phone: true }
        })
      } catch (error) {
        console.error('Error finding client:', error)
      }
    }

    // 2. If not found, check if data was passed directly
    if (!client && body.email) {
      client = {
        id: clientId || 'adhoc',
        name: body.name || 'Cliente',
        email: body.email,
        phone: body.phone || ''
      }
    } else if (!client) {
      // fallback for mock environment or testing
      client = {
        id: clientId,
        name: 'Cliente',
        email: 'cliente@email.com',
        phone: '+551151971375'
      }
    }

    // Process template if provided

    let processedContent = content
    if (template && client) {
      processedContent = content
        .replace(/{nome}/g, client.name)
        .replace(/{email}/g, client.email)
        .replace(/{data}/g, new Date().toLocaleDateString('pt-BR'))
        .replace(/{hora}/g, new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }

    // Simulate different communication channels
    let deliveryResult: any

    switch (type) {
      case 'whatsapp':
        if (!client.phone) {
          return NextResponse.json(
            { error: 'Telefone do cliente não disponível' },
            { status: 400 }
          )
        }
        deliveryResult = await sendWhatsApp(client.phone, processedContent)
        break
      case 'email':
        deliveryResult = await sendEmail(client.email, subject || 'Mensagem da Visa2Any', processedContent)
        break
      case 'sms':
        if (!client.phone) {
          return NextResponse.json(
            { error: 'Telefone do cliente não disponível' },
            { status: 400 }
          )
        }
        deliveryResult = await sendSMS(client.phone, processedContent)
        break
      default:
        return NextResponse.json(
          { error: 'Tipo de comunicação inválido' },
          { status: 400 }
        )
    }

    if (!deliveryResult.success) {
      return NextResponse.json(
        { error: 'Falha no envio da mensagem' },
        { status: 500 }
      )
    }

    // Create communication record

    const communicationRecord = {
      id: deliveryResult.messageId,
      clientId,
      client,
      type,
      direction: 'outbound' as const,
      content: processedContent,
      subject,
      status: deliveryResult.status,
      timestamp: new Date().toISOString(),
      assignedTo: 'Current User',
      tags: template ? [template] : [],
      priority,
      attachments: [],
      metadata: {
        templateUsed: template,
        sentAt: new Date().toISOString(),
        channel: type
      }
    }

    // Here you would save to database
    // await saveCommunicationRecord(communicationRecord)

    return NextResponse.json({
      messageId: deliveryResult.messageId,
      status: deliveryResult.status,
      communication: communicationRecord
    })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Simulated communication functions
async function sendWhatsApp(phone: string, message: string) {
  // Simulate WhatsApp API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    messageId: `wa_${Date.now()}`,
    status: 'sent',
    success: true
  }
}

async function sendEmail(email: string, subject: string, content: string) {
  // 1. Tentar Nodemailer (SMTP) - Otimizado para Gmail
  // Se tiver senha configurada, tenta usar, mesmo sem host explícito (default: smtp.gmail.com)
  const smtpPass = process.env.SMTP_PASS
  if (smtpPass) {
    try {
      const { default: nodemailer } = await import('nodemailer')

      const host = process.env.SMTP_HOST || 'smtp.gmail.com'
      const port = parseInt(process.env.SMTP_PORT || '465')
      const user = process.env.SMTP_USER || process.env.FROM_EMAIL || 'visa2any@gmail.com'
      const secure = process.env.SMTP_SECURE === 'true' || port === 465 // Auto-detect secure for 465

      console.log(`📧 Configurando SMTP: ${host}:${port} (${secure ? 'SSL' : 'TLS'}) User: ${user}`)

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass: smtpPass
        },
        tls: {
          // Necessário para alguns casos de certificado auto-assinado ou redes restritivas,
          // mas para Gmail padrão, rejectUnauthorized: true é o seguro.
          rejectUnauthorized: true
        }
      })

      const info = await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Visa2Any'}" <${user}>`,
        to: email,
        subject: subject,
        html: content
      })

      console.log('✅ Email enviado via SMTP:', info.messageId)
      return {
        messageId: info.messageId,
        status: 'sent',
        success: true,
        provider: 'smtp'
      }
    } catch (error: any) {
      console.error('❌ Falha ao enviar via SMTP:', error)
      if (error.code === 'EAUTH') {
        console.error('💡 DICA: Para Gmail, você precisa usar uma "Senha de App". A senha normal não funciona.')
        console.error('👉 https://myaccount.google.com/apppasswords')
      }
    }
  }

  // 2. Tentar SendGrid (se SMTP falhar ou não existir)
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
            to: [{ email: email }],
            subject: subject
          }],
          from: {
            email: process.env.FROM_EMAIL || 'visa2any@gmail.com',
            name: process.env.FROM_NAME || 'Visa2Any'
          },
          content: [{
            type: 'text/html',
            value: content
          }]
        })
      })

      if (response.ok) {
        console.log('✅ Email enviado via SendGrid')
        return {
          messageId: `sg_${Date.now()}`,
          status: 'sent',
          success: true,
          provider: 'sendgrid'
        }
      } else {
        const err = await response.text()
        console.error('❌ Falha SendGrid:', err)
      }
    } catch (error) {
      console.error('❌ Erro na chamada SendGrid:', error)
    }
  }

  // 3. Fallback: Mock (Apenas se em desenvolvimento e sem credenciais)
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️ SEM PROVEDOR DE EMAIL CONFIGURADO. SIMULANDO ENVIO:')
    console.log(`Para: ${email}`)
    console.log(`Assunto: ${subject}`)
    // console.log(`Conteúdo:`, content) // Omitido para não poluir

    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      messageId: `mock_${Date.now()}`,
      status: 'sent',
      success: true,
      provider: 'mock'
    }
  }

  console.error('❌ Nenhum provedor de email disponível')
  return {
    messageId: '',
    status: 'failed',
    success: false,
    error: 'Nenhum provedor de email configurado'
  }
}

async function sendSMS(phone: string, message: string) {
  // Simulate SMS API call
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    messageId: `sms_${Date.now()}`,
    status: 'sent',
    success: true
  }
}