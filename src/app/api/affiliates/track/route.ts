import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import { headers } from 'next/headers'



// Função para extrair informações do User-Agent
function parseUserAgent(userAgent: string) {
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop'
  
  let browser = 'unknown'
  if (userAgent.includes('Chrome')) browser = 'chrome'
  else if (userAgent.includes('Firefox')) browser = 'firefox'
  else if (userAgent.includes('Safari')) browser = 'safari'
  else if (userAgent.includes('Edge')) browser = 'edge'
  
  return { device, browser }
}

// Função para obter informações de geolocalização por IP
async function getLocationFromIP(ip: string) {
  try {
    // Em produção, usar um serviço como ipapi.co ou similar
    // Para desenvolvimento, retornar valores padrão
    if (process.env.NODE_ENV === 'development') {
      return { country: 'Brazil', city: 'São Paulo' }
    }
    
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown'
    }
  } catch (error) {
    console.error('Erro ao obter localização:', error)
    return { country: 'Unknown', city: 'Unknown' }
  }
}

// GET - Redirecionar com tracking
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const referralCode = url.searchParams.get('ref')
    const targetUrl = url.searchParams.get('url') || '/'
    const campaign = url.searchParams.get('campaign')
    const source = url.searchParams.get('source')

    if (!referralCode) {
      return NextResponse.redirect(new URL(targetUrl, request.url))
    }

    // Buscar afiliado pelo código de referência
    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode }
    })

    if (!affiliate || affiliate.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL(targetUrl, request.url))
    }

    // Obter informações do request
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               request.ip || 
               '127.0.0.1'

    // Parsear User-Agent
    const { device, browser } = parseUserAgent(userAgent)
    
    // Obter localização
    const { country, city } = await getLocationFromIP(ip)

    // Registrar o clique
    await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        referralCode,
        url: targetUrl,
        ipAddress: ip,
        userAgent,
        country,
        city,
        device,
        browser,
        source,
        campaign,
      }
    })

    // Atualizar contador de cliques do afiliado
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: { increment: 1 },
        lastActivity: new Date()
      }
    })

    // Definir cookie para tracking de conversão
    const response = NextResponse.redirect(new URL(targetUrl, request.url))
    response.cookies.set('affiliate_ref', referralCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response

  } catch (error) {
    console.error('Erro no tracking de afiliado:', error)
    const targetUrl = request.nextUrl.searchParams.get('url') || '/'
    return NextResponse.redirect(new URL(targetUrl, request.url))
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Registrar conversão
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, conversionType, conversionValue, referralCode: bodyReferralCode } = body

    // Tentar obter código de referência do cookie ou do body
    const cookieReferralCode = request.cookies.get('affiliate_ref')?.value
    const referralCode = bodyReferralCode || cookieReferralCode

    if (!referralCode || !clientId) {
      return NextResponse.json(
        { error: 'Código de referência e ID do cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar afiliado
    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Afiliado não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe uma conversão para este cliente
    const existingReferral = await prisma.affiliateReferral.findFirst({
      where: {
        affiliateId: affiliate.id,
        clientId,
      }
    })

    if (existingReferral) {
      return NextResponse.json({
        data: { message: 'Conversão já registrada', referralId: existingReferral.id }
      })
    }

    // Calcular comissão
    const commissionRate = affiliate.commissionRate
    const commissionValue = conversionValue * commissionRate

    // Criar referral e comissão
    const referral = await prisma.affiliateReferral.create({
      data: {
        affiliateId: affiliate.id,
        clientId,
        referralCode,
        status: 'CONVERTED',
        conversionType,
        conversionValue,
        commissionRate,
        commissionValue,
        convertedAt: new Date()
      }
    })

    // Criar comissão
    const dueDate = new Date()
    dueDate.setMonth(dueDate.getMonth() + 1) // Pagamento no próximo mês

    await prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        referralId: referral.id,
        amount: commissionValue,
        status: 'PENDING',
        type: conversionType,
        description: `Comissão por ${conversionType}`,
        dueDate,
      }
    })

    // Atualizar estatísticas do afiliado
    const conversionRate = affiliate.totalClicks > 0 
      ? ((affiliate.totalConversions + 1) / affiliate.totalClicks) * 100 
      : 0

    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalConversions: { increment: 1 },
        totalEarnings: { increment: commissionValue },
        pendingEarnings: { increment: commissionValue },
        conversionRate,
        lastActivity: new Date()
      }
    })

    // Marcar clique como convertido se existir
    await prisma.affiliateClick.updateMany({
      where: {
        affiliateId: affiliate.id,
        referralCode,
        converted: false
      }
      data: {
        converted: true,
        conversionValue,
      }
    })

    return NextResponse.json({ 
      referralId: referral.id
      commissionValue ,
    })

  } catch (error) {
    console.error('Erro ao registrar conversão:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}