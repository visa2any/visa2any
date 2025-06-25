import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




interface NotificationData {
  id: string,
  type: 'conversion' | 'payment' | 'tier_promotion' | 'bonus' | 'commission' | 'system',
  title: string,
  message: string
  data?: any,
  read: boolean,
  createdAt: string,
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

// Simulação de storage de notificações (em produção, usar Redis ou banco)
const notificationsStore = new Map<string, NotificationData[]>()

// GET - Buscar notificações do afiliado
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const affiliateId = url.searchParams.get('affiliateId')
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(url.searchParams.get('limit') || '50')

    if (!affiliateId) {
      return NextResponse.json({
        error: 'ID do afiliado é obrigatório'
      }, { status: 400 })
    }

    // Buscar notificações do storage
    let notifications = notificationsStore.get(affiliateId) || []

    // Se não há notificações, criar algumas de exemplo
    if (notifications.length === 0) {
      notifications = generateSampleNotifications(affiliateId)
      notificationsStore.set(affiliateId, notifications)
    }

    // Filtrar apenas não lidas se solicitado
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }

    // Limitar quantidade
    notifications = notifications.slice(0, limit)

    // Contar não lidas
    const unreadCount = (notificationsStore.get(affiliateId) || [])
      .filter(n => !n.read).length

    return NextResponse.json({
      data: {
        notifications,
        unreadCount,
        total: notifications.length
      }
    })

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Criar nova notificação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      affiliateId,
      type,
      title,
      message,
      data = {},
      priority = 'medium',
    } = body

    if (!affiliateId || !type || !title || !message) {
      return NextResponse.json({
        error: 'Campos obrigatórios: affiliateId, type, title, message',
      }, { status: 400 })
    }

    const notification: NotificationData = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString(),
      priority
    }

    // Adicionar ao storage
    const existing = notificationsStore.get(affiliateId) || []
    existing.unshift(notification) // Adicionar no início
    
    // Manter apenas últimas 100 notificações
    if (existing.length > 100) {
      existing.splice(100)
    }
    
    notificationsStore.set(affiliateId, existing)

    // TODO: Enviar push notification real
    // await sendPushNotification(affiliateId, notification)

    // TODO: Enviar email se for urgente
    // if (priority === 'urgent') {
    //   await sendEmailNotification(affiliateId, notification)
    // }

    return NextResponse.json({
      data: notification
    })

  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Marcar notificações como lidas
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateId, notificationIds, markAllAsRead = false } = body

    if (!affiliateId) {
      return NextResponse.json({
        error: 'ID do afiliado é obrigatório'
      }, { status: 400 })
    }

    const notifications = notificationsStore.get(affiliateId) || []

    if (markAllAsRead) {
      // Marcar todas como lidas
      notifications.forEach(n => n.read = true)
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Marcar específicas como lidas
      notifications.forEach(n => {
        if (notificationIds.includes(n.id)) {
          n.read = true
        }
      })
    }

    notificationsStore.set(affiliateId, notifications)

    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      data: {
        message: 'Notificações atualizadas',
        unreadCount,
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar notificações:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Função para gerar notificações de exemplo
function generateSampleNotifications(affiliateId: string): NotificationData[] {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  return [
    {
      id: 'notif_1',
      type: 'conversion',
      title: '🎉 Nova Conversão!',
      message: 'Parabéns! Você acabou de gerar uma nova conversão no valor de R$ 89,55 através do seu link de Consultoria EUA.',
      data: {
        conversionValue: 89.55,
        commissionValue: 13.43,
        conversionType: 'CONSULTATION',
        clientName: 'Maria Silva'
      }
      read: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      priority: 'high'
    }
    {
      id: 'notif_2',
      type: 'payment',
      title: '💰 Pagamento Processado',
      message: 'Seu pagamento de R$ 1.450,75 foi processado com sucesso via PIX. O dinheiro deve aparecer em sua conta em até 1 hora.',
      data: {
        amount: 1450.75,
        paymentMethod: 'PIX',
        transactionId: 'TXN123456789'
      }
      read: false,
      createdAt: yesterday.toISOString()
      priority: 'high'
    }
    {
      id: 'notif_3',
      type: 'tier_promotion',
      title: '⭐ Promoção de Nível!',
      message: 'Parabéns! Você foi promovido para o nível GOLD devido ao seu excelente desempenho. Suas comissões agora são de até 25%!',
      data: {
        oldTier: 'SILVER',
        newTier: 'GOLD',
        newCommissionRate: 0.25
      }
      read: true,
      createdAt: twoDaysAgo.toISOString()
      priority: 'urgent'
    }
    {
      id: 'notif_4',
      type: 'bonus',
      title: '🎁 Bônus Mensal',
      message: 'Você recebeu um bônus de R$ 250,00 por superar suas metas mensais! Continue assim!',
      data: {
        bonusAmount: 250.00,
        reason: 'Meta mensal superada',
        month: 'Junho'
      }
      read: true,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      priority: 'medium'
    }
    {
      id: 'notif_5',
      type: 'system',
      title: '📊 Novos Materiais Disponíveis',
      message: 'Adicionamos 5 novos banners e 3 templates de email ao seu kit de materiais promocionais. Confira agora!',
      data: {
        newMaterials: 8,
        categories: ['banners', 'email_templates'],
      }
      read: false,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
      priority: 'low'
    }
    {
      id: 'notif_6',
      type: 'commission',
      title: '💵 Nova Comissão Aprovada',
      message: 'Sua comissão de R$ 375,00 referente ao processo de visto do cliente João Santos foi aprovada e será paga no próximo ciclo.',
      data: {
        amount: 375.00,
        clientName: 'João Santos',
        conversionType: 'VISA_PROCESS',
        dueDate: '2024-07-15'
      }
      read: true,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
      priority: 'medium'
    }
  ]
}

// Funções utilitárias para envio de notificações específicas
async function sendConversionNotification(affiliateId: string, conversionData: any) {
  const notification = {
    affiliateId,
    type: 'conversion',
    title: '🎉 Nova Conversão!',
    message: `Parabéns! Nova conversão de R$ ${conversionData.value.toFixed(2)} através do seu link.`,
    data: conversionData,
    priority: 'high'
  }

  // Simular envio da notificação
  return await fetch('/api/affiliates/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    body: JSON.stringify(notification)
  })
}

async function sendPaymentNotification(affiliateId: string, paymentData: any) {
  const notification = {
    affiliateId,
    type: 'payment',
    title: '💰 Pagamento Processado',
    message: `Seu pagamento de R$ ${paymentData.amount.toFixed(2)} foi processado com sucesso.`,
    data: paymentData,
    priority: 'high'
  }

  return await fetch('/api/affiliates/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    body: JSON.stringify(notification)
  })
}

async function sendTierPromotionNotification(affiliateId: string, tierData: any) {
  const notification = {
    affiliateId,
    type: 'tier_promotion',
    title: '⭐ Promoção de Nível!',
    message: `Parabéns! Você foi promovido para o nível ${tierData.newTier}!`,
    data: tierData,
    priority: 'urgent'
  }

  return await fetch('/api/affiliates/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    body: JSON.stringify(notification)
  })
}