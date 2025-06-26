import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para iniciar sequência de nurturing
const nurturingSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  sequenceType: z.enum([
    'welcome_lead',
    'assessment_follow_up', 
    'cart_abandonment',
    'post_purchase',
    'consultation_prep',
    'document_submission',
    'visa_application',
    'success_celebration',
    'referral_request'
  ]),
  triggerData: z.record(z.any()).optional(),
  customSchedule: z.array(z.object({
    day: z.number(),
    hour: z.number().optional(),
    template: z.string()
  })).optional()
})

// POST /api/automation/nurturing - Iniciar sequência de nurturing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = nurturingSchema.parse(body)

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { status: 404 }
      )
    }

    // Verificar se já existe sequência ativa
    const existingSequence = await prisma.automationLog.findFirst({
      where: {
        clientId: validatedData.clientId,
        type: 'NURTURING_SEQUENCE',
        executedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
        }
      }
    })

    if (existingSequence) {
      return NextResponse.json({
        error: 'Sequência já ativa para este cliente'
      }, { status: 400 })
    }

    // Obter configuração da sequência
    const sequenceConfig = getNurturingSequence(validatedData.sequenceType, client)
    
    // Personalizar sequência baseada no perfil do cliente
    const personalizedSequence = personalizeSequence(sequenceConfig, client, validatedData.triggerData)

    // Agendar envios da sequência
    const scheduledEmails = await scheduleNurturingEmails(
      validatedData.clientId,
      personalizedSequence,
      validatedData.customSchedule
    )

    // Log do início da sequência
    await prisma.automationLog.create({
      data: {
        type: 'NURTURING_SEQUENCE',
        action: 'start_sequence',
        clientId: validatedData.clientId,
        success: true,
        details: {
          sequenceType: validatedData.sequenceType,
          emailsScheduled: scheduledEmails.length,
          duration: personalizedSequence.duration,
          clientName: client.name
        }
      }
    })

    return NextResponse.json({
      data: {
        sequenceType: validatedData.sequenceType,
        emailsScheduled: scheduledEmails.length,
        duration: `${personalizedSequence.duration} dias`,
        firstEmail: scheduledEmails[0]?.sendAt
      },
      message: 'Sequência de nurturing iniciada com sucesso'
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

    console.error('Erro ao iniciar sequência de nurturing:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/automation/nurturing/sequences - Listar sequências ativas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    const sequences = await prisma.automationLog.findMany({
      where: {
        type: 'NURTURING_SEQUENCE',
        ...(clientId && { clientId })
      },
      orderBy: { executedAt: 'desc' },
      take: 50,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        }
      }
    })

    return NextResponse.json({
      data: sequences.map(seq => ({
        id: seq.id,
        client: seq.client,
        sequenceType: (seq.details as { sequenceType?: string })?.sequenceType,
        status: seq.success ? 'active' : 'failed',
        createdAt: seq.executedAt,
        emailsScheduled: (seq.details as { emailsScheduled?: number })?.emailsScheduled || 0,
      }))
    })

  } catch (error) {
    console.error('Erro ao listar sequências:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Configurações das sequências de nurturing
function getNurturingSequence(type: string, client: any) {
  const sequences = {
    welcome_lead: {
      name: 'Boas-vindas para Lead',
      duration: 14,
      emails: [
        { day: 0, hour: 2, template: 'welcome_immediate', subject: 'Bem-vindo! Seu material está aqui 🎁' },
        { day: 1, hour: 10, template: 'education_1', subject: 'Os 3 erros mais comuns em vistos (evite!)' },
        { day: 3, hour: 14, template: 'social_proof', subject: 'Como Maria conseguiu seu visto em 45 dias' },
        { day: 5, hour: 11, template: 'education_2', subject: 'Checklist: está pronto para aplicar?' },
        { day: 7, hour: 16, template: 'soft_sell', subject: 'Pronto para acelerar seu processo?' },
        { day: 10, hour: 13, template: 'urgency', subject: 'Últimas vagas - não perca!' },
        { day: 14, hour: 15, template: 'last_chance', subject: 'Última chance: oferta especial expira hoje' }
      ],
    },

    assessment_follow_up: {
      name: 'Follow-up Assessment',
      duration: 7,
      emails: [
        { day: 0, hour: 1, template: 'assessment_results', subject: 'Sua análise está pronta! 📊' },
        { day: 1, hour: 12, template: 'assessment_explanation', subject: 'Como interpretar sua análise' },
        { day: 3, hour: 14, template: 'next_steps', subject: 'Próximos passos para seu visto' },
        { day: 5, hour: 10, template: 'consultation_offer', subject: 'Quer acelerar? Fale com especialista' },
        { day: 7, hour: 16, template: 'assessment_final', subject: 'Não deixe sua análise esquecida' }
      ],
    },

    cart_abandonment: {
      name: 'Recuperação Carrinho',
      duration: 3,
      emails: [
        { day: 0, hour: 2, template: 'cart_reminder', subject: 'Esqueceu algo? Seu carrinho está esperando' },
        { day: 1, hour: 12, template: 'cart_discount', subject: '15% OFF para finalizar hoje!' }
        { day: 2, hour: 18, template: 'cart_urgency', subject: 'Último dia: itens saindo do estoque' }
      ],
    }

    post_purchase: {
      name: 'Pós-compra',
      duration: 30,
      emails: [
        { day: 0, hour: 1, template: 'purchase_confirmation', subject: 'Pagamento confirmado! Vamos começar 🚀' }
        { day: 1, hour: 10, template: 'onboarding_1', subject: 'Primeiros passos do seu processo' }
        { day: 3, hour: 14, template: 'document_prep', subject: 'Como preparar seus documentos' }
        { day: 7, hour: 11, template: 'progress_update', subject: 'Update: como está seu processo' }
        { day: 14, hour: 15, template: 'halfway_check', subject: 'Metade do caminho percorrido!' }
        { day: 21, hour: 13, template: 'final_preparations', subject: 'Preparativos finais' }
        { day: 30, hour: 16, template: 'success_followup', subject: 'Como foi sua experiência?' }
      ],
    }

    consultation_prep: {
      name: 'Preparação Consultoria',
      duration: 2,
      emails: [
        { day: 0, hour: 24, template: 'consultation_reminder', subject: 'Sua consultoria é amanhã! 📅' }
        { day: 0, hour: 2, template: 'consultation_prep', subject: 'Como se preparar para consultoria' }
      ],
    }

    document_submission: {
      name: 'Submissão Documentos',
      duration: 7,
      emails: [
        { day: 0, hour: 2, template: 'docs_received', subject: 'Documentos recebidos - em análise' }
        { day: 2, hour: 10, template: 'docs_progress', subject: 'Análise em andamento...' }
        { day: 5, hour: 14, template: 'docs_feedback', subject: 'Feedback dos seus documentos' }
        { day: 7, hour: 16, template: 'docs_completion', subject: 'Documentos aprovados! 🎉' }
      ],
    }
  }

  return sequences[type as keyof typeof sequences] || sequences.welcome_lead
}

// Personalizar sequência baseada no perfil do cliente
function personalizeSequence(sequence: any, client: any, triggerData?: any) {
  const personalized = { ...sequence }

  // Personalizar baseado no país de interesse
  if (client.targetCountry) {
    personalized.emails = personalized.emails.map((email: any) => ({
      ...email,
      variables: {
        ...email.variables,
        target_country: client.targetCountry,
        country_specific: getCountrySpecificContent(client.targetCountry)
      }
    }))
  }

  // Personalizar baseado no lead score
  const leadScore = calculateClientScore(client)
  if (leadScore >= 70) {
    // Lead quente: acelerar sequência
    personalized.emails = personalized.emails.map((email: any) => ({
      ...email,
      day: Math.floor(email.day / 2) // Reduzir delay pela metade
    }))
  }

  // Personalizar baseado em interações anteriores
  const hasHighEngagement = client.interactions?.length > 3
  if (hasHighEngagement) {
    // Adicionar emails mais avançados
    personalized.emails.push({
      day: personalized.duration + 3,
      hour: 14,
      template: 'advanced_strategies',
      subject: 'Estratégias avançadas para seu perfil'
    })
  }

  return personalized
}

// Agendar emails da sequência
async function scheduleNurturingEmails(clientId: string, sequence: any, customSchedule?: any[]) {
  const scheduledEmails = []

  for (const email of sequence.emails) {
    const sendAt = new Date()
    sendAt.setDate(sendAt.getDate() + email.day)
    sendAt.setHours(email.hour || 10, 0, 0, 0)

    // Em produção
 usar sistema de filas (Redis/Bull) para agendar
    console.log(`📅 Agendando email: ${email.template} para ${sendAt.toISOString()}`)

    scheduledEmails.push({
      clientId,
      template: email.template,
      subject: email.subject,
      sendAt: sendAt,
      sequenceType: sequence.name,
      day: email.day
    })

    // Simular agendamento (em produção usar scheduler real)
    setTimeout(async () => {
      await sendScheduledEmail(clientId, email.template, email.subject, email.variables)
    }, (email.day * 24 * 60 * 60 * 1000) + (email.hour * 60 * 60 * 1000))
  }

  return scheduledEmails
}

// Enviar email agendado
async function sendScheduledEmail(clientId: string, template: string, subject: string, variables: any = {}) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      body: JSON.stringify({
        template: template,
        clientId: clientId,
        variables: variables
      })
    })

    const result = await response.json()

    // Log do envio
    await prisma.automationLog.create({
      data: {
        type: 'AUTOMATED_EMAIL',
        action: 'send_scheduled_email',
        clientId: clientId,
        success: true,
        details: {
          template: template,
          subject: subject,
          emailSent: true,
          timestamp: new Date().toISOString()
        }
      }
    })

    return result

  } catch (error) {
    console.error('Erro ao enviar email agendado:', error)
    
    await prisma.automationLog.create({
      data: {
        type: 'AUTOMATED_EMAIL',
        action: 'send_scheduled_email',
        clientId: clientId,
        success: false,
        details: {
          error: error?.toString() || 'Unknown error',
          template: template,
          subject: subject,
          timestamp: new Date().toISOString()
        }
      }
    })

  }
}

// Calcular score do cliente
function calculateClientScore(client: any): number {
  let score = 0

  // Score baseado em interações
  if (client.interactions?.length > 0) score += 20
  if (client.interactions?.length > 3) score += 20
  if (client.interactions?.length > 5) score += 20

  // Score baseado em dados completos
  if (client.phone) score += 15
  if (client.targetCountry) score += 15
  if (client.visaType) score += 10

  return Math.min(score, 100)
}

// Conteúdo específico por país
function getCountrySpecificContent(country: string): any {
  const countryContent: Record<string, any> = {
    'Canada': {
      tips: 'Dica especial: CRS score é fundamental para Express Entry',
      processing_time: '6-8 meses',
      success_rate: '85%'
    }
    'Australia': {
      tips: 'Skills Assessment é obrigatório para maioria dos vistos',
      processing_time: '8-12 meses', 
      success_rate: '78%'
    }
    'Portugal': {
      tips: 'D7 visa é ideal para renda passiva/aposentados',
      processing_time: '2-4 meses',
      success_rate: '92%'
    }
  }

  return countryContent[country] || {
    tips: 'Cada país tem suas especificidades'
    processing_time: 'Varia por país',
    success_rate: '80%+'
  }
}