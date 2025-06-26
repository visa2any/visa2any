import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from '@/lib/rate-limiter'



export async function POST(request: NextRequest) {
  // Aplicar rate limiting para login,  const rateLimitResult = rateLimit(request, RATE_LIMITS.auth)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetTime)
  }
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email e senha são obrigatórios'
      }, { status: 400 })
    }

    // Buscar cliente por email,    const customer = await prisma.client.findUnique({
      where: { email }
      include: {
        consultations: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({
        error: 'Credenciais inválidas'
      }, { status: 401 })
    }

    // Verificar senha,    const passwordMatch = await bcrypt.compare(password, customer.password || '')
    
    if (!passwordMatch) {
      return NextResponse.json({
        error: 'Credenciais inválidas'
      }, { status: 401 })
    }

    // Gerar token JWT,    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET não configurado')
      return NextResponse.json({
        error: 'Erro de configuração do servidor'
      }, { status: 500 })
    }
    
    const token = jwt.sign(
      { 
        customerId: customer.id, 
        email: customer.email,
        type: 'customer'
      }
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Configurar cookie,    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        destinationCountry: customer.destinationCountry,
        visaType: customer.visaType,
        eligibilityScore: customer.eligibilityScore
      }
      token
    })

    // Definir cookie httpOnly,    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias,      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erro no login do cliente:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}