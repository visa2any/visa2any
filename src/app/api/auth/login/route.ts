import { NextRequest, NextResponse } from 'next/server',import { prisma } from '@/lib/prisma',import bcrypt from 'bcryptjs',import jwt from 'jsonwebtoken',import { z } from 'zod',import crypto from 'crypto',import { applyRateLimit } from '@/lib/rate-limit'

// Schema para login,const loginSchema = z.object({,  email: z.string().email('Email inválido'),  password: z.string().min(1, 'Senha é obrigatória')
})

// POST /api/auth/login - Login de usuário com rate limiting,export async function POST(request: NextRequest) {,  try {
    // ✅ Aplicar rate limiting,    const rateLimitResult = applyRateLimit(request),    if (!rateLimitResult.success) {,      return NextResponse.json(,        { ,          error: rateLimitResult.error,          rateLimitInfo: {,            limit: rateLimitResult.limit,            remaining: rateLimitResult.remaining,            reset: rateLimitResult.reset
          }
        },        { ,          status: 429,          headers: {,            'X-RateLimit-Limit': rateLimitResult.limit.toString(),            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
          }
        }
      )
    },
    const body = await request.json()
    
    // Validar dados,    const validatedData = loginSchema.parse(body)

    // Buscar usuário,    const user = await prisma.user.findUnique({,      where: { email: validatedData.email },      select: {,        id: true,        name: true,        email: true,        password: true,        role: true,        isActive: true
      }
    }),
    if (!user) {,      return NextResponse.json(,        { status: 401 }
      )
    }

    // Verificar se usuário está ativo,    if (!user.isActive) {,      return NextResponse.json(,        { status: 401 }
      )
    }

    // Verificar senha,    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password),
    if (!isPasswordValid) {,      return NextResponse.json(,        { status: 401 }
      )
    }

    // ✅ Verificar se JWT secret está configurado,    const jwtSecret = process.env.NEXTAUTH_SECRET,    if (!jwtSecret) {,      console.error('❌ NEXTAUTH_SECRET não está configurado!'),      return NextResponse.json(,        { error: 'Erro interno do servidor' },        { status: 500 }
      )
    }

    // Gerar JWT token com configurações de segurança melhoradas,    const token = jwt.sign(,      { ,        userId: user.id,        email: user.email, ,        role: user.role,        iat: Math.floor(Date.now() / 1000), // ✅ Issued at,        jti: crypto.randomUUID() // ✅ JWT ID único
      },      jwtSecret,      { ,        expiresIn: '24h', // ✅ Reduzido de 7d para 24h (mais seguro),        issuer: 'visa2any-api',        audience: 'visa2any-client'
      }
    )

    // Dados do usuário para retorno (sem senha),    const userData = {,      id: user.id,      name: user.name,      email: user.email,      role: user.role,      isActive: user.isActive
    }

    // Log do login (skip if fails),    try {,      await prisma.automationLog.create({,        data: {,          type: 'USER_LOGIN',          action: 'login',          success: true,          clientId: null,          details: {,            userId: user.id,            email: user.email,            role: user.role,            loginTimestamp: new Date().toISOString()
          }
        }
      })
    } catch (logError) {,      console.warn('Failed to log login:', logError)
    }

    // Configurar cookie httpOnly,    const response = NextResponse.json({,      data: {,        user: userData,        token
      },      message: 'Login realizado com sucesso'
    })

    // ✅ Definir cookie seguro com configurações melhoradas,    response.cookies.set('auth-token', token, {,      httpOnly: true,      secure: process.env.NODE_ENV === 'production',      sameSite: 'strict', // ✅ Mais seguro que 'lax',      maxAge: 24 * 60 * 60, // ✅ 24h ao invés de 7 dias,      path: '/',      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    }),    
    console.log('🍪 Cookie auth-token definido com sucesso')

    // ✅ Adicionar headers de rate limit,    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString()),    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString()),    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString()),
    return response

  } catch (error) {,    if (error instanceof z.ZodError) {,      return NextResponse.json(,        { ,          error: 'Dados inválidos',          details: error.errors
        },        { status: 400 }
      )
    },
    console.error('Erro no login:', error),    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido',    const errorStack = error instanceof Error ? error.stack : undefined,    console.error('Error details:', errorMessage, errorStack),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}