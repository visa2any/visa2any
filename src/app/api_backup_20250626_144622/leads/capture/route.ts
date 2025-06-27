import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para captura de leads
const leadCaptureSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório')
  email: z.string().email('Email inválido')
  phone: z.string().optional()
  source: z.string().default('website')
  leadMagnet: z.string().optional()
  utmSource: z.string().optional()
  utmMedium: z.string().optional()
  utmCampaign: z.string().optional()
  utmContent: z.string().optional()
  referrer: z.string().optional()
  userAgent: z.string().optional()
  ip: z.string().optional()
  interests: z.array(z.string()).optional()
  notes: z.string().optional()
})

// POST /api/leads/capture - Capturar lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadCaptureSchema.parse(body)

    // Obter IP do cliente

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Verificar se lead já existe

    let existingClient = await prisma.client.findUnique({
      where: { email: validatedData.email }
    })

    let client
    let isNewLead = false

    if (existingClient) {
      // Atualizar lead existente
      client = await prisma.client.update({
        where: { id: existingClient.id }
        data: {
          name: validatedData.name,
          phone: validatedData.phone || existingClient.phone,
          lastActivityAt: new Date()
        }
      })
    } else {
      // Criar novo lead
      client = await prisma.client.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          status: 'LEAD',
          source: validatedData.source,
          utmSource: validatedData.utmSource,
          utmMedium: validatedData.utmMedium,
          utmCampaign: validatedData.utmCampaign,
          utmContent: validatedData.utmContent,
          lastActivityAt: new Date()
        }
      })
      isNewLead = true
    }

    // Calcular lead score baseado em dados disponíveis

    const leadScore = calculateLeadScore({
      source: validatedData.source,
      leadMagnet: validatedData.leadMagnet,
      hasPhone: !!validatedData.phone,
      utmSource: validatedData.utmSource,
      utmMedium: validatedData.utmMedium
    })

    // Salvar interação de captura

    await prisma.interaction.create({
      data: {
        type: 'LEAD_CAPTURE',
        channel: getChannelFromSource(validatedData.source)
        direction: 'inbound',
        content: `Lead magnet: ${validatedData.leadMagnet || 'none'}`,
        response: {
          userAgent: request.headers.get('user-agent')
          ip: ip,
          referrer: validatedData.referrer,
          leadScore: leadScore
        }
        clientId: client.id,
        completedAt: new Date()
      }
    })

    // Log da captura

    await prisma.automationLog.create({
      data: {
        type: 'LEAD_CAPTURED',
        action: 'capture_lead',
        clientId: client.id,
        success: true,
        details: {
          source: validatedData.source,
          leadMagnet: validatedData.leadMagnet,
          leadScore: leadScore,
          country: validatedData.country
        }
      }
    })

    // Disparar automações baseadas no lead score

    if (isNewLead) {
      await triggerWelcomeSequence(client.id, validatedData.leadMagnet)
    }

    if (leadScore >= 70) {
      await triggerHighPriorityActions(client.id, leadScore)
    }

    // Resposta baseada no lead score

    let responseMessage = 'Lead capturado com sucesso'
    let recommendations = []

    if (leadScore >= 80) {
      responseMessage = 'Lead de alta qualidade capturado'
      recommendations = ['priority_contact', 'premium_offer']
    } else if (leadScore >= 60) {
      responseMessage = 'Lead qualificado capturado'
      recommendations = ['nurture_sequence', 'assessment_offer']
    } else {
      recommendations = ['basic_nurture', 'educational_content']
    }

    return NextResponse.json({
      data: {
        leadId: client.id
        leadScore: leadScore,
        isNewLead: isNewLead,
        recommendations: recommendations
      }
      message: responseMessage
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

    console.error('Erro ao capturar lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// GET /api/leads/capture/stats - Estatísticas de leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // dias,    const days = parseInt(period)
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Buscar estatísticas

    const [totalLeads, newLeads, leadsBySource, leadsByMagnet] = await Promise.all([
      // Total de leads

      prisma.client.count({
        where: { status: 'LEAD' }
      })
      
      // Novos leads no período
      
      prisma.client.count({
        where: {
          status: 'LEAD',
          createdAt: { gte: startDate }
        }
      })
      
      // Leads por fonte
      
      prisma.client.groupBy({
        by: ['source'],
        where: {
          status: 'LEAD',
          createdAt: { gte: startDate }
        }
        _count: { id: true }
      })
      
      // Leads por lead magnet
      
      prisma.interaction.groupBy({
        by: ['details'],
        where: {
          type: 'LEAD_CAPTURE',
          createdAt: { gte: startDate }
        }
        _count: { id: true }
      })
    ])

    return NextResponse.json({
      data: {
        overview: {
          totalLeads
          newLeads,
          growthRate: totalLeads > 0 ? Math.round((newLeads / totalLeads) * 100) : 0
        }
        leadsBySource: leadsBySource.map(item => ({
          source: item.source,
          count: item._count.id
        }))
        leadsByMagnet: leadsByMagnet.slice(0, 10), // Top 10,        period: `${days} dias`
      }
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas de leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// Calcular score do lead baseado em fatores
function calculateLeadScore(factors: {
  source?: string
  leadMagnet?: string
  hasPhone: boolean
  utmSource?: string
  utmMedium?: string
}) {
  let score = 0

  // Score por fonte

  const sourceScores: Record<string, number> = {
    'lead_magnet': 30,
    'assessment': 40,
    'pricing_page': 50,
    'consultation_page': 60,
    'referral': 70,
    'organic': 20,
    'paid': 35,
    'social': 25,
    'email': 45
  }
  score += sourceScores[factors.source || ''] || 10

  // Score por lead magnet (interesse específico)

  const magnetScores: Record<string, number> = {
    'ebook-50-erros': 25,
    'checklist-documentos': 20,
    'calculadora-tempo': 35,
    'guia-entrevista': 30,
    'planilha-financeira': 40,
    'kit-emergencia': 50
  }
  score += magnetScores[factors.leadMagnet || ''] || 0

  // Score por ter telefone (mais engajado)

  if (factors.hasPhone) score += 15

  // Score por UTM (campanhas específicas)

  if (factors.utmMedium === 'paid') score += 10
  if (factors.utmSource === 'google') score += 5
  if (factors.utmSource === 'facebook') score += 8

  // Normalizar para 0-100

  return Math.min(score, 100)
}

// Determinar canal baseado na fonte
function getChannelFromSource(source: string): string {
  const channelMap: Record<string, string> = {
    'lead_magnet': 'website',
    'assessment': 'website',
    'pricing_page': 'website',
    'consultation_page': 'website',
    'referral': 'referral',
    'organic': 'organic',
    'paid': 'paid_ads',
    'social': 'social_media',
    'email': 'email'
  }
  return channelMap[source] || 'website'
}

// Disparar sequência de boas-vindas
async function triggerWelcomeSequence(clientId: string, leadMagnet?: string) {
  try {
    // Enviar email de boas-vindas imediato
    await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        template: 'welcome_lead',
        clientId: clientId,
        variables: {
          lead_magnet: leadMagnet || 'website'
        }
      })
    })

    // Agendar emails de nurturing,    // Em produção
 usar queue/scheduler
    console.log(`Agendando sequência de nurturing para cliente ${clientId}`)
    
  } catch (error) {
    console.error('Erro ao disparar sequência de boas-vindas:', error)
  }
}

// Disparar ações para leads de alta prioridade
async function triggerHighPriorityActions(clientId: string, leadScore: number) {
  try {
    // Notificar equipe de vendas
    await prisma.automationLog.create({
      data: {
        type: 'HIGH_PRIORITY_LEAD',
        action: 'notify_sales_team',
        clientId: clientId,
        details: {
          timestamp: new Date().toISOString()
          action: 'automated_action'
        }
        success: true
      }
    })

    // Em produção: enviar notificação Slack/Teams para vendas

    console.log(`🚨 LEAD QUENTE: Cliente ${clientId} com score ${leadScore}`)
    
  } catch (error) {
    console.error('Erro ao processar lead de alta prioridade:', error)
  }
}