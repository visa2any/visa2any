import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// POST /api/auth/logout - Logout de usuário
export async function POST(request: NextRequest) {
  try {
    // Buscar token para log
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    const token = authHeader?.replace('Bearer ', '') || cookieToken
    
    if (token) {
      try {
        const jwtSecret = process.env.NEXTAUTH_SECRET
        if (!jwtSecret) {
          console.error('NEXTAUTH_SECRET não configurado')
          // Continue with logout even if token verification fails
        } else {
          const decoded = jwt.verify(token, jwtSecret) as any
        
          // Log do logout
          await prisma.automationLog.create({
            data: {
              type: 'USER_LOGOUT',
              action: 'logout',
              success: true,
              clientId: null,
              details: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                logoutTimestamp: new Date().toISOString()
              }
            }
          })
        }
      } catch (tokenError) {
        // Token inválido, mas continua com logout
        console.warn('Token inválido durante logout:', tokenError)
      }
    }

    // Criar resposta de sucesso
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

    // Remover cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expira imediatamente
    })

    return response

  } catch (error) {
    console.error('Erro no logout:', error)
    
    // Mesmo com erro, remover cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    })

    return response
  }
}