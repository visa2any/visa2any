import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({
        error: 'Nome, email e senha são obrigatórios',
      }, { status: 400 })
    }

    // Verificar se já existe cliente com este email
    const existingCustomer = await prisma.client.findUnique({
      where: { email }
    })

    if (existingCustomer) {
      return NextResponse.json({
        error: 'Já existe uma conta com este email'
      }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar novo cliente
    const customer = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        status: 'LEAD',
        isActive: true,
        eligibilityScore: 0,
        createdAt: new Date()
        updatedAt: new Date()
      }
    })

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET
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

    // Enviar email de boas-vindas (implementar posteriormente)
    // await sendWelcomeEmail(customer.email
 customer.name)

    // Configurar resposta com cookie
    const response = NextResponse.json({
      message: 'Conta criada com sucesso',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        eligibilityScore: customer.eligibilityScore
      }
      token,
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
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}