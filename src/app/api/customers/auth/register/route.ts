import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = body
    console.log('[Register] Payload received:', { email, name, phone })

    if (!name || !email || !password) {
      return NextResponse.json({
        error: 'Nome, email e senha são obrigatórios'
      }, { status: 400 })
    }

    // Verificar se já existe cliente com este email
    const existingCustomer = await prisma.client.findUnique({
      where: { email }
    })
    console.log('[Register] Existing check:', existingCustomer ? 'Found' : 'Not Found')

    if (existingCustomer) {
      return NextResponse.json({
        error: 'Já existe uma conta com este email'
      }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('[Register] Password hashed')

    // Criar novo cliente COM a senha hasheada
    const customer = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword, // Armazenar a senha hasheada!
        phone: phone || null,
        status: 'LEAD',
        score: 0
      }
    })

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET || 'temporary-dev-secret-123'
    // if (!jwtSecret) check removed to allow fallback

    const token = jwt.sign(
      {
        customerId: customer.id,
        email: customer.email,
        type: 'customer'
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Enviar email de boas-vindas (implementar posteriormente)
    // await sendWelcomeEmail(customer.email, customer.name)

    // Configurar resposta com cookie
    const response = NextResponse.json({
      message: 'Conta criada com sucesso',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        eligibilityScore: customer.score
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
    console.error('Erro no registro do cliente:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}