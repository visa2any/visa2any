import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function handleLegalChange(data: any) {
  const { country, changeType, description, affectedVisaTypes, sourceUrl, priority } = data
  
  // Log the legal change
  await prisma.automationLog.create({
    data: {
      type: 'LEGAL_CHANGE_DETECTED',
      action: 'legal_change',
      executedAt: new Date(),
      details: {
        timestamp: new Date().toISOString(),
        action: 'automated_action'
      },
      success: true
    }
  })

  // Find affected clients
  if (affectedVisaTypes?.length > 0) {
    const affectedClients = await prisma.client.findMany({
      where: {
        targetCountry: country,
        visaType: { in: affectedVisaTypes },
        status: { in: ['IN_PROCESS', 'DOCUMENTS_PENDING'] }
      },
      select: { id: true, name: true, email: true, phone: true }
    })

    // Create notifications for affected clients
    for (const client of affectedClients) {
      await prisma.interaction.create({
        data: {
          clientId: client.id,
          type: 'AUTOMATED_EMAIL',
          channel: 'EMAIL',
          content: `Nova atualização legal para ${country}: ${description}`,
          scheduledAt: new Date(),
          direction: 'outbound'
        }
      })
    }
  }
}

async function handleConsularSlot(data: any) {
  const { country, consulate, city, availableSlots, visaType, earliestDate } = data
  
  // Log the slot availability
  await prisma.automationLog.create({
    data: {
      type: 'CONSULAR_SLOT_DETECTED',
      action: 'consular_slot',
      executedAt: new Date(),
      details: {
        timestamp: new Date().toISOString(),
        action: 'automated_action'
      },
      success: true
    }
  })

  // Find clients waiting for appointments
  const waitingClients = await prisma.client.findMany({
    where: {
      targetCountry: country,
      visaType,
      status: { in: ['IN_PROCESS', 'DOCUMENTS_PENDING'] }
    },
    select: { id: true, name: true, email: true, phone: true }
  })

  // Notify eligible clients immediately
  for (const client of waitingClients) {
    await prisma.interaction.create({
      data: {
        clientId: client.id,
        type: 'AUTOMATED_WHATSAPP',
        channel: 'WHATSAPP',
        content: `🚨 VAGA DISPONÍVEL! Nova vaga para ${visaType} em ${consulate}, ${city}. Data mais cedo: ${earliestDate}. Responda RAPIDAMENTE!`,
        scheduledAt: new Date(),
        direction: 'outbound'
      }
    })

    // Also send SMS backup
    await prisma.interaction.create({
      data: {
        clientId: client.id,
        type: 'SMS',
        channel: 'SMS',
        content: `VISA2ANY: Vaga disponível ${visaType} ${city}. Acesse: visa2any.com/appointment`,
        scheduledAt: new Date(Date.now() + 2 * 60 * 1000), // 2 min delay
        direction: 'outbound'
      }
    })
  }
}

async function handleDocumentValidation(data: any) {
  const { clientId, documentId, validationResult, issues, recommendations } = data
  
  // Update document status
  if (documentId) {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: validationResult.isValid ? 'VALID' : 'INVALID'
      }
    })
  }

  // Log validation
  await prisma.automationLog.create({
    data: {
      type: 'DOCUMENT_VALIDATED',
      action: 'validate_document',
      clientId: clientId,
      success: true,
      details: {
        timestamp: new Date().toISOString(),
        action: 'automated_action'
      }
    }
  })

  // Create client notification
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, email: true }
    })
    
    if (client) {
      const message = validationResult.isValid 
        ? `✅ Documento validado com sucesso! Seu processo está avançando.`
        : `❌ Documento precisa de correções: ${issues?.join(', ')}. Recomendações: ${recommendations?.join(', ')}`
      
      await prisma.interaction.create({
        data: {
          clientId: clientId,
          type: 'AUTOMATED_EMAIL',
          channel: 'EMAIL',
          content: message,
          scheduledAt: new Date(),
          direction: 'outbound'
        }
      })
    }
  }
}

async function handleClientRiskAlert(data: any) {
  const { clientId, riskType, riskScore, factors, recommendations } = data
  
  // Log risk alert
  await prisma.automationLog.create({
    data: {
      type: 'CLIENT_RISK_ALERT',
      action: 'risk_alert',
      clientId: clientId,
      success: true,
      details: {
        riskType,
        riskScore,
        factors,
        timestamp: new Date().toISOString()
      }
    }
  })

  // Create internal alert for team
  await prisma.interaction.create({
    data: {
      clientId: clientId,
      type: 'FOLLOW_UP',
      channel: 'SYSTEM',
      content: `⚠️ Cliente em risco: ${riskType} (Score: ${riskScore}). Fatores: ${factors?.join(', ')}`,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      direction: 'outbound'
    }
  })

  // If high risk, schedule immediate consultant contact
  if (riskScore > 80) {
    await prisma.consultation.create({
      data: {
        clientId: clientId,
        type: 'HUMAN_CONSULTATION',
        status: 'SCHEDULED',
        notes: `Consulta de emergência - Cliente em alto risco: ${riskType}`,
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now,
      }
    })
  }
}

async function handleAutomationCompleted(data: any) {
  const { workflowId, workflowName, clientId, result, metrics } = data
  
  // Log automation completion
  await prisma.automationLog.create({
    data: {
      type: 'AUTOMATION_COMPLETED',
      action: 'complete_workflow',
      clientId: clientId || null,
      success: result.success || true,
      details: {
        workflowId,
        workflowName,
        result,
        metrics,
        timestamp: new Date().toISOString()
      }
    }
  })

  // Update client status if applicable
  if (clientId && result.newStatus) {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        status: result.newStatus
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'legal_change':
        await handleLegalChange(data)
        break
      case 'consular_slot':
        await handleConsularSlot(data)
        break
      case 'document_validation':
        await handleDocumentValidation(data)
        break
      case 'client_risk_alert':
        await handleClientRiskAlert(data)
        break
      case 'automation_completed':
        await handleAutomationCompleted(data)
        break
      default:
        console.warn('Unknown webhook type:', type)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('N8N Webhook error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}