import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, countries, terms } = body

    // Validação
    if (!name || !phone || !terms) {
      return NextResponse.json(
        { error: 'Nome, telefone e aceite dos termos são obrigatórios' }
        { status: 400 }
      )
    }

    // Validar formato do telefone
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Formato de telefone inválido. Use +55 11 99999-9999' }
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existingSubscriber = await prisma.whatsAppSubscriber.findUnique({
      where: { phone }
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Este número já está cadastrado na nossa newsletter' }
        { status: 409 }
      )
    }

    // Criar novo assinante
    const subscriber = await prisma.whatsAppSubscriber.create({
      data: {
        name
        phone,
        countries: countries || ['Global'],
        isActive: true,
        source: 'blog_newsletter'
      }
    })

    // Enviar mensagem de boas-vindas via WhatsApp
    try {
      await sendWelcomeMessage(phone, name)
    } catch (error) {
      console.error('Erro ao enviar mensagem de boas-vindas:', error)
      // Não falhar o cadastro se a mensagem não for enviada
    }

    // Log da atividade
    console.log(`[WHATSAPP NEWSLETTER] Novo cadastro: ${name} - ${phone}`)

    return NextResponse.json({
      success: true
      message: 'Cadastro realizado com sucesso! Você receberá uma mensagem de confirmação em breve.',
      subscriber: {
        id: subscriber.id,
        name: subscriber.name,
        phone: subscriber.phone,
        countries: subscriber.countries
      }
    })

  } catch (error) {
    console.error('[WHATSAPP NEWSLETTER] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// Função para enviar mensagem de boas-vindas
async function sendWelcomeMessage(phone: string, name: string) {
  const message = `🎉 Olá ${name}!

Bem-vindo(a) à Newsletter WhatsApp da *Visa2Any*!

Você agora receberá:
📱 Notificações instantâneas sobre mudanças em leis de imigração
🚨 Alertas urgentes em tempo real
📊 Resumos semanais personalizados
💬 Acesso direto aos nossos especialistas
🎁 Conteúdo exclusivo para assinantes

Para acessar nosso blog completo: https://visa2any.com/blog

📞 *Precisa de ajuda imediata?*
- Consultoria IA Gratuita: https://visa2any.com/consultoria-ia
- WhatsApp Direto: https://wa.me/5511519447117

_Para cancelar, responda SAIR_`

  // Aqui você integraria com sua API do WhatsApp
  // Por exemplo
 usando a biblioteca @whiskeysockets/baileys ou WhatsApp Business API
  
  const whatsappResponse = await fetch('http://localhost:3000/api/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    body: JSON.stringify({
      to: phone,
      message: message,
      type: 'newsletter_welcome'
    })
  })

  if (!whatsappResponse.ok) {
    throw new Error('Falha ao enviar mensagem de boas-vindas')
  }

  return true
}

// GET - Listar assinantes (admin only)
export async function GET() {
  try {
    const subscribers = await prisma.whatsAppSubscriber.findMany({
      where: { isActive: true }
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    const stats = {
      total: subscribers.length,
      byCountry: subscribers.reduce((acc, sub) => {
        sub.countries.forEach(country => {
          acc[country] = (acc[country] || 0) + 1,
        })
        return acc
      }, {} as Record<string, number>)
      recent: subscribers.slice(0, 10)
    }

    return NextResponse.json({
      success: true
      stats,
      subscribers: subscribers.map(sub => ({
        id: sub.id,
        name: sub.name,
        phone: sub.phone.replace(/(\+\d{2})(\d{2})(\d{4,5})(\d{4})/, '$1 $2 $3-$4')
        countries: sub.countries,
        createdAt: sub.createdAt
      }))
    })

  } catch (error) {
    console.error('[WHATSAPP NEWSLETTER] Erro ao listar:', error)
    return NextResponse.json(
      { error: 'Erro ao listar assinantes' }
      { status: 500 }
    )
  }
}