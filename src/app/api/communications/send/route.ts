import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, clientId, template, subject, priority = 'medium' } = body

    if (!type || !content || !clientId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client information
    let client
    try {
      client = await prisma.client.findUnique({
        where: { id: clientId },
        select: { id: true, name: true, email: true, phone: true }
      })
    } catch (error) {
      // If client not found in database, use mock data
      client = {
        id: clientId,
        name: 'Cliente',
        email: 'cliente@email.com',
        phone: '+5511999999999'
      }
    }

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
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
    let deliveryResult = { success: true, messageId: '', status: 'sent' }

    switch (type) {
      case 'whatsapp':
        deliveryResult = await sendWhatsApp(client.phone, processedContent)
        break
      case 'email':
        deliveryResult = await sendEmail(client.email, subject || 'Mensagem da Visa2Any', processedContent)
        break
      case 'sms':
        deliveryResult = await sendSMS(client.phone, processedContent)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported communication type' },
          { status: 400 }
        )
    }

    if (!deliveryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
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
      success: true,
      messageId: deliveryResult.messageId,
      status: deliveryResult.status,
      communication: communicationRecord
    })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulated communication functions
async function sendWhatsApp(phone: string, message: string) {
  // Simulate WhatsApp API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    messageId: `wa_${Date.now()}`,
    status: 'sent'
  }
}

async function sendEmail(email: string, subject: string, content: string) {
  // Simulate Email API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    success: true,
    messageId: `email_${Date.now()}`,
    status: 'sent'
  }
}

async function sendSMS(phone: string, message: string) {
  // Simulate SMS API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    messageId: `sms_${Date.now()}`,
    status: 'sent'
  }
}