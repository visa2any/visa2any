import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email e senha são obrigatórios'
      }, { status: 400 })
    }

    // Buscar cliente por email
    const customer = await prisma.client.findUnique({
      where: { email },
      include: {
        consultations: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({
        success: false,
        error: 'Credenciais inválidas'
      }, { status: 401 })
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, customer.password || '')
    
    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        error: 'Credenciais inválidas'
      }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        customerId: customer.id, 
        email: customer.email,
        type: 'customer'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Configurar cookie
    const response = NextResponse.json({
      success: true,
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
      },
      token
    })

    // Definir cookie httpOnly
    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erro no login do cliente:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}