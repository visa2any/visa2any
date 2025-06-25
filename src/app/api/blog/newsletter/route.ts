import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, countries = [] } = body
    
    // Validação básica
    if (!name || !phone) {
      return NextResponse.json(
        {
          error: 'Nome e telefone são obrigatórios'
        }
        { status: 400 }
      )
    }

    // Limpar e validar telefone
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        {
          error: 'Telefone inválido'
        }
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existingSubscriber = await prisma.whatsAppSubscriber.findFirst({
      where: {
        phone: cleanPhone
      }
    })

    if (existingSubscriber) {
      // Atualizar dados existentes
      const updatedSubscriber = await prisma.whatsAppSubscriber.update({
        where: {
          id: existingSubscriber.id
        }
        data: {
          name,
          countries: countries.length > 0 ? countries : ['Global'],
          isActive: true,
          source: 'blog_newsletter'
        }
      })

      return NextResponse.json({
        message: 'Dados atualizados com sucesso!'
        subscriber: {
          id: updatedSubscriber.id,
          name: updatedSubscriber.name,
          isActive: updatedSubscriber.isActive
        }
      })
    }

    // Criar novo assinante
    const newSubscriber = await prisma.whatsAppSubscriber.create({
      data: {
        name,
        phone: cleanPhone,
        countries: countries.length > 0 ? countries : ['Global'],
        isActive: true,
        source: 'blog_newsletter'
      }
    })

    // Aqui você pode integrar com API do WhatsApp para enviar mensagem de boas-vindas
    // await sendWelcomeMessage(cleanPhone, name)

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso! Você receberá atualizações no WhatsApp.'
      subscriber: {
        id: newSubscriber.id,
        name: newSubscriber.name,
        isActive: newSubscriber.isActive
      }
    })

  } catch (error) {
    console.error('❌ Erro ao cadastrar newsletter:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      }
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') !== 'false'
    
    // Estatísticas da newsletter
    const [totalSubscribers, activeSubscribers, recentSubscribers] = await Promise.all([,
      prisma.whatsAppSubscriber.count()
      prisma.whatsAppSubscriber.count({
        where: { isActive: true }
      })
      prisma.whatsAppSubscriber.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
          }
        }
      })
    ])

    // Distribuição por países de interesse
    const countryDistribution = await prisma.whatsAppSubscriber.findMany({
      where: { isActive: active }
      select: { countries: true }
    })

    // Contar países
    const countryCount: Record<string, number> = {}
    countryDistribution.forEach(sub => {
      const countries = Array.isArray(sub.countries) ? sub.countries : ['Global']
      countries.forEach(country => {
        const countryKey = String(country)
        countryCount[countryKey] = (countryCount[countryKey] || 0) + 1
      })
    })

    // Assinantes por fonte
    const sourceDistribution = await prisma.whatsAppSubscriber.groupBy({
      by: ['source'],
      where: { isActive: active }
      _count: {
        source: true
      }
    })

    return NextResponse.json({
      stats: {
        total: totalSubscribers
        active: activeSubscribers,
        inactive: totalSubscribers - activeSubscribers,
        recent: recentSubscribers,
        distribution: {
          countries: Object.entries(countryCount)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
          sources: sourceDistribution.map(item => ({
            source: item.source,
            count: item._count.source
          }))
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      }
      { status: 500 }
    )
  }
}

// Função para enviar mensagem de boas-vindas (placeholder)
async function sendWelcomeMessage(phone: string, name: string) {
  // Aqui você integraria com a API do WhatsApp Business
  // Por exemplo: Twilio, WhatsApp Business API, etc.
  
  const message = `Olá ${name}! 👋

Bem-vindo à Newsletter WhatsApp da Visa2Any! 🎉

Agora você receberá:
✅ Notícias urgentes sobre imigração
🔥 Atualizações de vagas de consulado
📊 Mudanças em leis de visto
🎯 Dicas exclusivas de aprovação

Para parar de receber, responda "PARAR" a qualquer momento.

Sua jornada internacional começa agora! 🌍✈️`

  console.log(`📱 Enviando mensagem de boas-vindas para ${phone}:`, message)
  
  // Implementar integração real aqui
  // const result = await whatsappApi.sendMessage(phone, message)
  // return result
}