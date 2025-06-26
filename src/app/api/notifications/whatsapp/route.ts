import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWhatsAppService } from '@/lib/whatsapp'
import { z } from 'zod'

// Schema para envio de WhatsApp
const sendWhatsAppSchema = z.object({
  to: z.string().min(10, 'Número de telefone é obrigatório')
  message: z.string().min(1, 'Mensagem é obrigatória')
  clientId: z.string().optional(),
  template: z.string().optional()
  variables: z.record(z.any()).optional(),
  mediaUrl: z.string().url().optional()
})

// POST /api/notifications/whatsapp - Enviar WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sendWhatsAppSchema.parse(body)

    // Obter serviço WhatsApp integrado
    const whatsappService = getWhatsAppService()

    // Enviar WhatsApp usando o serviço integrado
    const whatsAppResult = await whatsappService.sendMessage({
      to: validatedData.to,
      message: validatedData.message,
      clientId: validatedData.clientId,
      template: validatedData.template,
      variables: validatedData.variables
    })

    // Log do envio
    await prisma.automationLog.create({
      data: {
        type: 'WHATSAPP',
        action: 'send_whatsapp',
        success: whatsAppResult.success,
        clientId: validatedData.clientId || null,
        error: whatsAppResult.error || null,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
      }
    })

    return NextResponse.json({
      data: {
        messageId: whatsAppResult.messageId
        sent: whatsAppResult.success,
        queued: whatsAppResult.queued || false,
        to: validatedData.to
      }
      message: whatsAppResult.queued ? 'WhatsApp adicionado à fila' : 'WhatsApp enviado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos'
          details: error.errors
        }
        { status: 400 }
      )
    }

    console.error('Erro ao enviar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// GET /api/notifications/whatsapp/status - Obter status do WhatsApp
export async function GET(request: NextRequest) {
  try {
    const whatsappService = getWhatsAppService()
    const status = whatsappService.getStatus()

    return NextResponse.json({
      data: {
        status
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro ao buscar status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

