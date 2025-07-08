import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CONSULTANT'
  isActive: boolean
}

// Verificar autenticação em API routes
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Buscar token no header ou cookie
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return null
    }

    // ✅ Verificar se JWT secret está configurado

    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      console.error('❌ NEXTAUTH_SECRET não está configurado!')
      return null
    }

    // Verificar e decodificar token

    const decoded = jwt.verify(token, jwtSecret) as any

    // Buscar usuário no banco

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user

  } catch (error) {
    console.error('Erro na verificação de auth:', error)
    return null
  }
}

// Verificar se usuário tem permissão de admin
export function isAdmin(user: AuthUser): boolean {
  return ['ADMIN', 'MANAGER'].includes(user.role)
}

// Verificar se usuário tem permissão específica
export function hasRole(user: AuthUser, roles: string[]): boolean {
  return roles.includes(user.role)
}

// Middleware de autenticação para API routes
export function requireAuth() {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)
    
    if (!user) {
      return {
        error: 'Não autorizado',
        status: 401
      }
    }

    return {
      user,
      status: 200
    }
  }
}

// Middleware de admin para API routes
export function requireAdmin() {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)
    
    if (!user) {
      return {
        error: 'Não autorizado',
        status: 401
      }
    }

    if (!isAdmin(user)) {
      return {
        error: 'Acesso negado. Permissão de administrador necessária.',
        status: 403
      }
    }

    return {
      user,
      status: 200
    }
  }
}

// Helper para criar responses de erro de auth
export function createAuthError(message: string, status: number = 401) {
  return Response.json(
    { status }
  )
}
