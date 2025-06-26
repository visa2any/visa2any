import { NextRequest, NextResponse } from 'next/server'
import { loginCustomer, loginAdmin } from '@/lib/auth-unified'

export async function POST(request: NextRequest) {
  try {
    const { email, password, type } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    let result

    if (type === 'admin') {
      // Login para admin/staff
      if (!password) {
        return NextResponse.json(
          { error: 'Dados inválidos' },
          { status: 400 }
        )
      }
      result = await loginAdmin(email, password)
    } else {
      // Login para cliente (pode não ter senha na primeira vez)
      result = await loginCustomer(email, password)
    }

    if (!result.success) {
      return NextResponse.json(
        { status: result.error === 'NEEDS_PASSWORD_SETUP' ? 202 : 401 }
      )
    }

    // Criar cookie de autenticação
    const response = NextResponse.json({
      user: result.user,
      token: result.token
    })

    // Configurar cookie httpOnly
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erro no login unificado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}