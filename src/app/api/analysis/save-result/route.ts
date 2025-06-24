import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { clientId, score, level, answers, recommendations, nextSteps } = await request.json()

    if (!clientId || !score) {
      return NextResponse.json(
        { status: 400 }
      )
    }

    // Criar consultoria IA com o resultado
    const consultation = await prisma.consultation.create({
      data: {
        clientId,
        type: 'AI_ANALYSIS',
        status: 'COMPLETED',
        completedAt: new Date(),
        duration: 15, // 15 minutos estimados para análise IA
        score,
        recommendation: recommendations.join('\n'),
        nextSteps: nextSteps.join('\n'),
        notes: `Análise de elegibilidade automática - Nível: ${level}`,
        result: {
          score,
          level,
          answers,
          recommendations,
          nextSteps,
          calculatedAt: new Date().toISOString()
        }
      }
    })

    // Atualizar score do cliente
    await prisma.client.update({
      where: { id: clientId },
      data: {
        score,
        status: score >= 80 ? 'QUALIFIED' : 'LEAD'
      }
    })

    // Criar interação de análise realizada
    await prisma.interaction.create({
      data: {
        clientId,
        type: 'AUTOMATED_EMAIL',
        channel: 'system',
        direction: 'inbound',
        subject: 'Análise de Elegibilidade Realizada',
        content: `Score calculado: ${score}% - Nível: ${level}`,
        completedAt: new Date()
      }
    })

    // Determinar próxima ação automática baseada no score
    let automationAction = null
    if (score >= 85) {
      automationAction = 'high_score_followup'
    } else if (score >= 60) {
      automationAction = 'medium_score_nurturing'
    } else {
      automationAction = 'low_score_education'
    }

    // Criar log de automação
    await prisma.automationLog.create({
      data: {
        clientId,
        type: 'ANALYSIS_COMPLETED',
        action: `analysis_saved`,
        success: true,
        details: {
          score: score,
          automationAction: automationAction,
          analysisType: 'eligibility_analysis',
          triggeredAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      data: {
        consultationId: consultation.id,
        score,
        level,
        automationAction
      }
    })

  } catch (error) {
    console.error('Erro ao salvar resultado da análise:', error)
    return NextResponse.json(
      { status: 500 }
    )
  }
}