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

// Storage em memória para webhooks (em produção, usar banco de dados)
const webhookEndpoints = new Map<string, WebhookEndpoint[]>()

// GET - Listar webhooks do afiliado
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

// Função para gerar secret do webhook
function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex')
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

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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