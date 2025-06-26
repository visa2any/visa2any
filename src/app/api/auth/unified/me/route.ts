import { NextRequest, NextResponse } from 'next/server'
import { verifyUnifiedAuth } from '@/lib/auth-unified'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUnifiedAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' }
        { status: 401 }
      )
    }

    return NextResponse.json({
      user
    })

  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}