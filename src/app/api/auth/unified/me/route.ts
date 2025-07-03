import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUnifiedAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user
    })

  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para verificar autenticação unificada
async function verifyUnifiedAuth(request: NextRequest) {
  try {
    // Buscar token do header ou cookie
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return null
    }

    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      throw new Error('JWT secret não configurado')
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, jwtSecret) as any

    // Retornar dados do usuário baseado no tipo
    return {
      id: decoded.userId,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role || null
    }
  } catch (error) {
    console.error('Erro na verificação de auth:', error)
    return null
  }
}