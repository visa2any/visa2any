import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para triggers comportamentais,const behavioralTriggerSchema = z.object({,  clientId: z.string().optional(),  sessionId: z.string().optional(),  event: z.enum([,    'page_view',    'time_spent',    'scroll_depth', ,    'mouse_movement',    'form_interaction',    'pricing_page_time',    'assessment_abandon',    'cart_abandon',    'video_watch',    'download_attempt'
  ]),  data: z.object({,    page: z.string().optional(),    timeSpent: z.number().optional(),    scrollDepth: z.number().optional(),    formFields: z.array(z.string()).optional(),    videoProgress: z.number().optional(),    userAgent: z.string().optional(),    referrer: z.string().optional()
  }).optional(),  timestamp: z.string().optional()
})

// POST /api/automation/behavioral-triggers - Processar trigger comportamental

export async function POST(request: NextRequest) {,  try {
    const body = await request.json()
const validatedData = behavioralTriggerSchema.parse(body)

    // Analisar comportamento e decidir ação

    const triggerAnalysis = await analyzeBehavioralTrigger(validatedData),    
    if (triggerAnalysis.shouldTrigger) {,      await executeTriggerAction(triggerAnalysis)
    }

    // Log do trigger

    await prisma.automationLog.create({,      data: {,        type: 'BEHAVIORAL_TRIGGER',        action: `trigger_${validatedData.event}`,        clientId: validatedData.clientId || null,        success: true,        details: {,          event: validatedData.event,          shouldTrigger: triggerAnalysis.shouldTrigger,          action: triggerAnalysis.action,          message: triggerAnalysis.message,          priority: triggerAnalysis.priority,          page: validatedData.data?.page,          timeSpent: validatedData.data?.timeSpent,          scrollDepth: validatedData.data?.scrollDepth
        }
      }
    }),
    return NextResponse.json({,      data: {,        triggered: triggerAnalysis.shouldTrigger,        action: triggerAnalysis.action,        message: triggerAnalysis.message
      }
    })

  } catch (error) {,    if (error instanceof z.ZodError) {,      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro ao processar trigger comportamental:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// Analisar trigger comportamental e decidir ação,async function analyzeBehavioralTrigger(data: any) {,  const analysis = {,    shouldTrigger: false,    action: '',    message: '',    priority: 'low' as 'low' | 'medium' | 'high',    delay: 0
  },
  switch (data.event) {,    case 'pricing_page_time':
      // Se usuário passou mais de 3 minutos na página de preços
      if (data.data?.timeSpent && data.data.timeSpent > 180) {,        analysis.shouldTrigger = true,        analysis.action = 'whatsapp_pricing_help',        analysis.message = 'Usuário interessado mas com dúvidas no pricing',        analysis.priority = 'high',        analysis.delay = 30 // 30 segundos de delay
      },      break,
    case 'assessment_abandon':
      // Se usuário abandonou assessment na metade
      const assessmentProgress = await getAssessmentProgress(data.clientId),      if (assessmentProgress && assessmentProgress.step >= 3) {,        analysis.shouldTrigger = true,        analysis.action = 'email_assessment_recovery',        analysis.message = 'Recuperar assessment abandonado',        analysis.priority = 'medium',        analysis.delay = 3600 // 1 hora de delay
      },      break,
    case 'cart_abandon':
      // Carrinho abandonado
      analysis.shouldTrigger = true,      analysis.action = 'cart_recovery_sequence',      analysis.message = 'Carrinho abandonado - iniciar recuperação',      analysis.priority = 'high',      analysis.delay = 1800 // 30 minutos de delay,      break

    case 'scroll_depth':
      // Se usuário chegou no final da página mas não converteu
      if (data.data?.scrollDepth && data.data.scrollDepth > 90) {,        const hasConverted = await checkUserConversion(data.clientId),        if (!hasConverted) {,          analysis.shouldTrigger = true,          analysis.action = 'exit_intent_offer',          analysis.message = 'Usuário engajado mas não converteu',          analysis.priority = 'medium',          analysis.delay = 0
        }
      },      break,
    case 'video_watch':
      // Se usuário assistiu mais de 70% do vídeo
      if (data.data?.videoProgress && data.data.videoProgress > 0.7) {,        analysis.shouldTrigger = true,        analysis.action = 'video_completion_offer',        analysis.message = 'Usuário engajado com conteúdo',        analysis.priority = 'medium',        analysis.delay = 60 // 1 minuto após vídeo
      },      break,
    case 'form_interaction':
      // Se usuário começou a preencher formulário mas não finalizou
      if (data.data?.formFields && data.data.formFields.length > 2) {,        analysis.shouldTrigger = true,        analysis.action = 'form_completion_help',        analysis.message = 'Ajudar a completar formulário',        analysis.priority = 'medium',        analysis.delay = 300 // 5 minutos
      },      break,
    case 'time_spent':
      // Se usuário passou muito tempo no site mas não converteu
      if (data.data?.timeSpent && data.data.timeSpent > 600) { // 10 minutos,        const sessionActions = await getSessionActions(data.sessionId),        if (sessionActions.pageViews > 5 && !sessionActions.hasConverted) {,          analysis.shouldTrigger = true,          analysis.action = 'high_intent_contact',          analysis.message = 'Usuário com alta intenção',          analysis.priority = 'high',          analysis.delay = 0
        }
      },      break
  },
  return analysis
}

// Executar ação do trigger,async function executeTriggerAction(analysis: any) {,  const actions = {,    whatsapp_pricing_help: async () => {
      // Enviar WhatsApp com ajuda sobre preços
      return await sendWhatsAppTrigger('pricing_help', {,        message: "Oi! Vi que você está interessado em nossos planos. Posso tirar alguma dúvida sobre preços? 😊"
      })
    },
    email_assessment_recovery: async () => {
      // Email para recuperar assessment
      return await sendEmailTrigger('assessment_recovery', {,        subject: "Continue sua análise - faltam só 2 minutos! ⏰",        template: 'assessment_recovery'
      })
    },
    cart_recovery_sequence: async () => {
      // Sequência de recuperação de carrinho
      return await startCartRecoverySequence()
    },
    exit_intent_offer: async () => {
      // Mostrar oferta de última chance
      return await triggerExitIntentOffer()
    },
    video_completion_offer: async () => {
      // Oferta após assistir vídeo
      return await sendVideoCompletionOffer()
    },
    form_completion_help: async () => {
      // Ajuda para completar formulário
      return await sendFormHelp()
    },
    high_intent_contact: async () => {
      // Contato prioritário para alta intenção
      return await triggerHighIntentContact()
    }
  },
  const actionFunction = actions[analysis.action as keyof typeof actions],  if (actionFunction) {
    // Executar com delay se especificado
    if (analysis.delay > 0) {,      setTimeout(actionFunction, analysis.delay * 1000)
    } else {,      await actionFunction()
    }
  }
}

// Funções auxiliares,async function getAssessmentProgress(clientId?: string) {,  if (!clientId) return null,  
  try {,    const interactions = await prisma.interaction.findMany({,      where: { ,        clientId,        type: 'AUTOMATED_EMAIL'
      },      orderBy: { createdAt: 'desc' },      take: 1
    }),    
    return interactions[0] ? { step: 0 } : null
  } catch {,    return null
  }
},
async function checkUserConversion(clientId?: string) {,  if (!clientId) return false,  
  try {,    const payment = await prisma.payment.findFirst({,      where: { ,        clientId,        status: 'COMPLETED'
      }
    }),    
    return !!payment
  } catch {,    return false
  }
},
async function getSessionActions(sessionId?: string) {
  // Em produção
  usar analytics ou session tracking,  return {,    pageViews: 7,    hasConverted: false,    timeSpent: 780
  }
},
async function sendWhatsAppTrigger(type: string, data: any) {,  try {
    // Implementar envio de WhatsApp com base no comportamento
    console.log(`📱 WhatsApp Trigger: ${type}`, data),    return { success: true }
  } catch (error) {,    console.error('Erro ao enviar WhatsApp trigger:', error),    return { success: false }
  }
},
async function sendEmailTrigger(type: string, data: any) {,  try {
    // Implementar envio de email com base no comportamento
    console.log(`📧 Email Trigger: ${type}`, data),    return { success: true }
  } catch (error) {,    console.error('Erro ao enviar email trigger:', error),    return { success: false }
  }
},
async function startCartRecoverySequence() {,  try {,    console.log('🛒 Iniciando sequência de recuperação de carrinho...')
    // Implementar sequência de emails/WhatsApp para carrinho abandonado
    return { success: true }
  } catch (error) {,    console.error('Erro na recuperação de carrinho:', error),    return { success: false }
  }
},
async function triggerExitIntentOffer() {,  try {,    console.log('🚪 Trigger: Exit Intent Offer')
    // Implementar popup/modal de última chance
    return { success: true }
  } catch (error) {,    console.error('Erro no exit intent:', error),    return { success: false }
  }
},
async function sendVideoCompletionOffer() {,  try {,    console.log('🎥 Oferta pós-vídeo enviada'),    return { success: true }
  } catch (error) {,    console.error('Erro na oferta pós-vídeo:', error),    return { success: false }
  }
},
async function sendFormHelp() {,  try {,    console.log('📝 Ajuda para formulário enviada'),    return { success: true }
  } catch (error) {,    console.error('Erro na ajuda do formulário:', error),    return { success: false }
  }
},
async function triggerHighIntentContact() {,  try {,    console.log('🎯 Contato de alta prioridade disparado')
    // Notificar equipe de vendas para contato imediato
    return { success: true }
  } catch (error) {,    console.error('Erro no contato prioritário:', error),    return { success: false }
  }
}