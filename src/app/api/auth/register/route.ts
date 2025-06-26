import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schema para registro de usuário
const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório')
  email: z.string().email('Email inválido')
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'CONSULTANT']).optional()
})

// POST /api/auth/register - Registrar novo usuário (funcionário)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validatedData = registerSchema.parse(body)

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Dados inválidos' }
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name
        email: validatedData.email
        password: hashedPassword
        role: validatedData.role || 'STAFF'
      }
      select: {
        id: true
        name: true
        email: true
        role: true
        isActive: true
        createdAt: true
      }
    })

    // Log da criação
    await prisma.automationLog.create({
      data: {
        type: 'USER_CREATED'
        action: 'register_user'
        success: true
        clientId: null
        details: {
          userId: user.id
          email: user.email
          name: user.name
          role: user.role
          registrationTimestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      data: user
      message: 'Usuário criado com sucesso'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos'
          details: error.errors
        }
        { status: 400 }
      )
    }

    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}