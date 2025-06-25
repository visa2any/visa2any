import { NextRequest, NextResponse } from 'next/server'
import { createCustomerAccount } from '@/lib/auth-unified'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { name, email, phone, country, nationality, targetCountry, source, product, amount } = data

    if (!name || !email) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    const result = await createCustomerAccount({
      name,
      email,
      phone,
      country,
      nationality,
      targetCountry,
      source,
      product,
      amount,
    })

    if (!result.success) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    )
    }

    // Criar cookie de autenticação automática
    const response = NextResponse.json({
      user: result.user,
      token: result.token,
      message: 'Conta criada e login automático realizado',
    })

    // Configurar cookie httpOnly
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Erro na criação automática de conta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  }
}