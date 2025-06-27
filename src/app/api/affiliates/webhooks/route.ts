import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

interface WebhookEvent {
  id: string
  event: string
  data: any
  timestamp: string
  signature?: string
}

interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  affiliateId?: string
}

// Simulação de storage de webhooks (em produção usar Redis ou banco)
const webhookEndpoints = new Map<string, WebhookEndpoint[]>()

// GET - Listar webhooks configurados
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const affiliateId = url.searchParams.get('affiliateId')

    if (!affiliateId) {
      return NextResponse.json({
        error: 'ID do afiliado é obrigatório'
      }, { status: 400 })
    }

    const endpoints = webhookEndpoints.get(affiliateId) || []

    return NextResponse.json({
      data: endpoints.map(endpoint => ({
        ...endpoint,
        secret: undefined // Não retornar o secret
      }))
    })

  } catch (error) {
    console.error('Erro ao buscar webhooks:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Configurar novo webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, url: webhookUrl, events = [], secret } = body

    if (!affiliateId || !webhookUrl || !Array.isArray(events)) {
      return NextResponse.json({
        error: 'affiliateId, url e events são obrigatórios'
      }, { status: 400 })
    }

    // Validar URL
    try {
      new URL(webhookUrl)
    } catch {
      return NextResponse.json({
        error: 'URL inválida'
      }, { status: 400 })
    }

    // Validar eventos
    const validEvents = [
      'conversion.created',
      'commission.approved',
      'payment.completed',
      'tier.promoted',
      'bonus.awarded',
      'click.registered'
    ]

    const invalidEvents = events.filter(event => !validEvents.includes(event))
    if (invalidEvents.length > 0) {
      return NextResponse.json({
        error: `Eventos inválidos: ${invalidEvents.join(', ')}`
      }, { status: 400 })
    }

    const endpoint: WebhookEndpoint = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: webhookUrl,
      events,
      secret: secret || generateWebhookSecret(),
      active: true,
      affiliateId
    }

    // Adicionar ao storage
    const existing = webhookEndpoints.get(affiliateId) || []
    existing.push(endpoint)
    webhookEndpoints.set(affiliateId, existing)

    // Testar webhook
    const testResult = await testWebhook(endpoint)

    return NextResponse.json({
      data: {
        ...endpoint,
        secret: undefined, // Não retornar o secret
        testResult
      }
    })

  } catch (error) {
    console.error('Erro ao configurar webhook:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Atualizar webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, webhookId, ...updateData } = body

    if (!affiliateId || !webhookId) {
      return NextResponse.json({
        error: 'affiliateId e webhookId são obrigatórios'
      }, { status: 400 })
    }

    const endpoints = webhookEndpoints.get(affiliateId) || []
    const index = endpoints.findIndex(e => e.id === webhookId)

    if (index === -1) {
      return NextResponse.json({
        error: 'Webhook não encontrado'
      }, { status: 404 })
    }

    // Atualizar endpoint
    endpoints[index] = { ...endpoints[index], ...updateData }
    webhookEndpoints.set(affiliateId, endpoints)

    return NextResponse.json({
      data: {
        ...endpoints[index],
        secret: undefined
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar webhook:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Remover webhook
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const affiliateId = url.searchParams.get('affiliateId')
    const webhookId = url.searchParams.get('webhookId')

    if (!affiliateId || !webhookId) {
      return NextResponse.json({
        error: 'affiliateId e webhookId são obrigatórios'
      }, { status: 400 })
    }

    const endpoints = webhookEndpoints.get(affiliateId) || []
    const filteredEndpoints = endpoints.filter(e => e.id !== webhookId)

    if (filteredEndpoints.length === endpoints.length) {
      return NextResponse.json({
        error: 'Webhook não encontrado'
      }, { status: 404 })
    }

    webhookEndpoints.set(affiliateId, filteredEndpoints)

    return NextResponse.json({
      data: { message: 'Webhook removido com sucesso' }
    })

  } catch (error) {
    console.error('Erro ao remover webhook:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Função para gerar secret do webhook
function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Função para gerar assinatura do webhook
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// Função para testar webhook
async function testWebhook(endpoint: WebhookEndpoint): Promise<{ success: boolean; message: string }> {
  try {
    const testEvent: WebhookEvent = {
      id: 'test_event',
      event: 'webhook.test',
      data: {
        message: 'Este é um evento de teste para verificar se seu webhook está funcionando corretamente.',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }

    const payload = JSON.stringify(testEvent)
    const signature = generateSignature(payload, endpoint.secret)

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': `sha256=${signature}`,
        'User-Agent': 'Visa2Any-Webhooks/1.0'
      },
      body: payload,
      signal: AbortSignal.timeout(10000) // 10 segundos timeout
    })

    if (response.ok) {
      return { 
        success: true,
        message: 'Webhook testado com sucesso'
      }
    } else {
      return { 
        success: false,
        message: `Erro HTTP ${response.status}: ${response.statusText}`
      }
    }

  } catch (error) {
    return { 
      success: false,
      message: `Erro ao testar webhook: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    }
  }
}

// Função para enviar evento para webhooks
async function sendWebhookEvent(
  affiliateId: string, 
  eventType: string, 
  eventData: any
): Promise<void> {
  try {
    const endpoints = webhookEndpoints.get(affiliateId) || []
    const relevantEndpoints = endpoints.filter(
      endpoint => endpoint.active && endpoint.events.includes(eventType)
    )

    if (relevantEndpoints.length === 0) {
      return
    }

    const webhookEvent: WebhookEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event: eventType,
      data: eventData,
      timestamp: new Date().toISOString()
    }

    // Enviar para todos os endpoints relevantes
    const promises = relevantEndpoints.map(async (endpoint) => {
      try {
        const payload = JSON.stringify(webhookEvent)
        const signature = generateSignature(payload, endpoint.secret)

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `sha256=${signature}`,
            'X-Webhook-Event': eventType,
            'User-Agent': 'Visa2Any-Webhooks/1.0'
          },
          body: payload,
          signal: AbortSignal.timeout(10000)
        })

        if (!response.ok) {
          console.error(`Erro ao enviar webhook para ${endpoint.url}: ${response.status}`)
        }

      } catch (error) {
        console.error(`Erro ao enviar webhook para ${endpoint.url}:`, error)
      }
    })

    await Promise.allSettled(promises)

  } catch (error) {
    console.error('Erro ao enviar webhooks:', error)
  }
}

// Funções específicas para diferentes tipos de eventos
async function sendConversionWebhook(affiliateId: string, conversionData: any) {
  await sendWebhookEvent(affiliateId, 'conversion.created', {
    conversionId: conversionData.id,
    affiliateId,
    clientId: conversionData.clientId,
    conversionType: conversionData.conversionType,
    conversionValue: conversionData.conversionValue,
    commissionValue: conversionData.commissionValue,
    referralCode: conversionData.referralCode,
    timestamp: new Date().toISOString()
  })
}

async function sendCommissionWebhook(affiliateId: string, commissionData: any) {
  await sendWebhookEvent(affiliateId, 'commission.approved', {
    commissionId: commissionData.id,
    affiliateId,
    amount: commissionData.amount,
    type: commissionData.type,
    description: commissionData.description,
    dueDate: commissionData.dueDate,
    timestamp: new Date().toISOString()
  })
}

async function sendPaymentWebhook(affiliateId: string, paymentData: any) {
  await sendWebhookEvent(affiliateId, 'payment.completed', {
    paymentId: paymentData.id,
    affiliateId,
    amount: paymentData.amount,
    method: paymentData.method,
    transactionId: paymentData.transactionId,
    processedAt: paymentData.processedAt,
    timestamp: new Date().toISOString()
  })
}

async function sendTierPromotionWebhook(affiliateId: string, tierData: any) {
  await sendWebhookEvent(affiliateId, 'tier.promoted', {
    affiliateId,
    oldTier: tierData.oldTier,
    newTier: tierData.newTier,
    newCommissionRate: tierData.newCommissionRate,
    reason: tierData.reason,
    timestamp: new Date().toISOString()
  })
}

async function sendClickWebhook(affiliateId: string, clickData: any) {
  await sendWebhookEvent(affiliateId, 'click.registered', {
    clickId: clickData.id,
    affiliateId,
    referralCode: clickData.referralCode,
    url: clickData.url,
    country: clickData.country,
    device: clickData.device,
    source: clickData.source,
    campaign: clickData.campaign,
    timestamp: new Date().toISOString()
  })
}