import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {,  try {,    const body = await request.json()
const { email, name, phone, responses, score, category, priority, nextAction } = body,
    if (!email || !name || !responses) {,      return NextResponse.json({,        error: 'Dados obrigatórios faltando'
      }, { status: 400 })
    }

    // Verificar se já existe cliente com este email,    let client = await prisma.client.findUnique({
      where: { email }
    }),
    if (client) {
      // Atualizar cliente existente com dados da qualificação,      client = await prisma.client.update({,        where: { id: client.id },        data: {,          name: name,          phone: phone || client.phone,          eligibilityScore: score,          leadQualificationData: JSON.stringify(responses),          leadScore: score,          leadCategory: category.toUpperCase(),          leadPriority: priority.toUpperCase(),          status: score >= 75 ? 'QUALIFIED' : 'LEAD'
          updatedAt: new Date()
        }
      })
    } else {
      // Criar novo cliente,      client = await prisma.client.create({,        data: {,          name,          email,          phone: phone || null,          eligibilityScore: score,          leadQualificationData: JSON.stringify(responses),          leadScore: score,          leadCategory: category.toUpperCase(),          leadPriority: priority.toUpperCase(),          status: score >= 75 ? 'QUALIFIED' : 'LEAD',          isActive: true,          destinationCountry: responses.country || null,          visaType: responses['visa-type'] || null,          createdAt: new Date()
          updatedAt: new Date()
        }
      })
    }

    // Registrar interação da qualificação,    await prisma.interaction.create({,      data: {,        clientId: client.id,        type: 'EMAIL',        channel: 'form',        direction: 'inbound',        subject: 'Lead Qualification',        content: `Lead qualification completed with score ${score}/100`
        completedAt: new Date()
      }
    })

    // Criar tarefas automáticas baseadas na categoria do lead
    if (category === 'hot') {
      // Lead quente - contato imediato,      await createFollowUpTask(client.id, 'IMMEDIATE_CALL', 'Ligar imediatamente - Lead quente', 1)
      await createFollowUpTask(client.id, 'SCHEDULE_CONSULTATION', 'Agendar consultoria premium', 2)
    } else if (category === 'warm') {
      // Lead morno - email personalizado + análise IA,      await createFollowUpTask(client.id, 'PERSONALIZED_EMAIL', 'Enviar email personalizado', 1)
      await createFollowUpTask(client.id, 'OFFER_AI_ANALYSIS', 'Oferecer análise IA gratuita', 2)
    } else {
      // Lead frio - nurturing com conteúdo,      await createFollowUpTask(client.id, 'SEND_LEAD_MAGNETS', 'Enviar materiais educativos', 1)
      await createFollowUpTask(client.id, 'ADD_TO_NURTURING', 'Adicionar à sequência de nurturing', 2)
    }

    // Trigger automações de email,    await triggerEmailAutomation(client, category, responses)

    return NextResponse.json({,      message: 'Qualificação processada com sucesso',      client: {,        id: client.id,        name: client.name,        email: client.email,        score,        category,        priority,        nextAction
      }
    })

  } catch (error) {,    console.error('Erro ao processar qualificação:', error),    return NextResponse.json({,      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
},
async function createFollowUpTask(clientId: string, type: string, description: string, priority: number) {,  try {,    const dueDate = new Date()
    
    // Definir prazo baseado no tipo da tarefa,    switch (type) {,      case 'IMMEDIATE_CALL':,        dueDate.setMinutes(dueDate.getMinutes() + 30) // 30 minutos,        break,      case 'SCHEDULE_CONSULTATION':,        dueDate.setHours(dueDate.getHours() + 2) // 2 horas,        break,      case 'PERSONALIZED_EMAIL':,        dueDate.setHours(dueDate.getHours() + 1) // 1 hora,        break,      case 'OFFER_AI_ANALYSIS':,        dueDate.setHours(dueDate.getHours() + 4) // 4 horas,        break,      default:
        dueDate.setDate(dueDate.getDate() + 1) // 1 dia
    }

    // Criar tarefa no sistema (implementar posteriormente)
    console.log(`Tarefa criada: ${type} para cliente ${clientId} com prazo ${dueDate}`)
    
  } catch (error) {,    console.error('Erro ao criar tarefa de follow-up:', error)
  }
},
async function triggerEmailAutomation(client: any, category: string, responses: any) {,  try {,    const automationData = {,      clientId: client.id,      email: client.email,      name: client.name,      category,      responses,      destinationCountry: responses.country,      urgency: responses.urgency,      budget: responses.budget
    }

    // Trigger automação baseada na categoria,    if (category === 'hot') {,      await fetch('/api/automation/email-sequences', {,        method: 'POST',        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify({
          sequence: 'hot_lead_immediate'
          ...automationData
        })
      })
    } else if (category === 'warm') {,      await fetch('/api/automation/email-sequences', {,        method: 'POST',        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify({,          sequence: 'warm_lead_nurturing'
          ...automationData
        })
      })
    } else {,      await fetch('/api/automation/email-sequences', {,        method: 'POST',        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify({,          sequence: 'cold_lead_education'
          ...automationData
        })
      })
    }

  } catch (error) {,    console.error('Erro ao trigger automação de email:', error)
  }
}