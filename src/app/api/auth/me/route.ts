import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/auth/me - Verificar usuário logado
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação usando a função centralizada
    const user = await verifyAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { status: 401 }
      )
    }
    
    // Retornar dados do usuário
    return NextResponse.json({
      user: user
      data: user,
    })

  } catch (error) {
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ /api/auth/me: Erro:', error)
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}