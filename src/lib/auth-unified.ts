import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export interface UnifiedUser {
  id: string
  email: string
  name: string
  type: 'CUSTOMER' | 'ADMIN' | 'CONSULTANT'
  role?: 'ADMIN' | 'MANAGER' | 'STAFF' | 'CONSULTANT'
  isActive: boolean
  clientData?: {
    phone?: string | null
    country?: string | null
    nationality?: string | null
    targetCountry?: string | null
    status: string
    score?: number | null
  }
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'visa2any-secret-key'

// Gerar token JWT unificado
export function generateToken(user: UnifiedUser): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      type: user.type,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verificar token e buscar usuário (unificado)
export async function verifyUnifiedAuth(request: NextRequest): Promise<UnifiedUser | null> {
  try {
    // Buscar token no header ou cookie
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return null
    }

    // Verificar e decodificar token

    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (decoded.type === 'CUSTOMER') {
      // Buscar como cliente
      const client = await prisma.client.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          nationality: true,
          targetCountry: true,
          status: true,
          score: true,
          createdAt: true
        }
      })

      if (!client) return null

      return {
        id: client.id,
        email: client.email,
        name: client.name,
        type: 'CUSTOMER',
        isActive: true,
        clientData: {
          phone: client.phone ?? null,
          country: client.country ?? null,
          nationality: client.nationality ?? null,
          targetCountry: client.targetCountry ?? null,
          status: client.status,
          score: client.score ?? null
        }
      }
    } else {
      // Buscar como usuário admin/staff
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

      if (!user || !user.isActive) return null

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.role === 'CONSULTANT' ? 'CONSULTANT' : 'ADMIN',
        role: user.role,
        isActive: user.isActive
      }
    }

  } catch (error) {
    console.error('Erro na verificação de auth unificado:', error)
    return null
  }
}

// Login de cliente (para portal do cliente)
export async function loginCustomer(email: string, password?: string): Promise<{ success: boolean; user?: UnifiedUser; token?: string; error?: string }> {
  try {
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        payments: {
          where: { status: 'COMPLETED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!client) {
      return { success: false, error: 'CLIENT_NOT_FOUND' }
    }

    // Se não tem senha, é primeiro login (criar senha)
    if (!password) {
      return { 
        success: true,
        error: 'NEEDS_PASSWORD_SETUP',
        user: {
          id: client.id,
          email: client.email,
          name: client.name,
          type: 'CUSTOMER',
          isActive: true
        }
      }
    }

    const user: UnifiedUser = {
      id: client.id,
      email: client.email,
      name: client.name,
      type: 'CUSTOMER',
      isActive: true,
      clientData: {
        phone: client.phone ?? null,
        country: client.country ?? null,
        nationality: client.nationality ?? null,
        targetCountry: client.targetCountry ?? null,
        status: client.status,
        score: client.score ?? null
      }
    }

    const token = generateToken(user)
    return { success: true, user, token }

  } catch (error) {
    console.error('Erro no login do cliente:', error)
    return { success: false, error: 'LOGIN_FAILED' }
  }
}

// Login de admin/staff
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: UnifiedUser; token?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.isActive) {
      return { success: false, error: 'USER_NOT_FOUND' }
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return { success: false, error: 'INVALID_PASSWORD' }
    }

    const unifiedUser: UnifiedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.role === 'CONSULTANT' ? 'CONSULTANT' : 'ADMIN',
      role: user.role,
      isActive: user.isActive
    }

    const token = generateToken(unifiedUser)
    return { success: true, user: unifiedUser, token }

  } catch (error) {
    console.error('Erro no login do admin:', error)
    return { success: false, error: 'LOGIN_FAILED' }
  }
}

// Criar cliente automaticamente (para integração com checkout)
export async function createCustomerAccount(data: {
  name: string
  email: string
  phone?: string
  country?: string
  nationality?: string
  targetCountry?: string
  source?: string
  product?: string
  amount?: number
}): Promise<{ success: boolean; user?: UnifiedUser; token?: string; error?: string }> {
  try {
    // Verificar se cliente já existe
    let client = await prisma.client.findUnique({
      where: { email: data.email }
    })

    if (!client) {
      // Criar novo cliente
      client = await prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          country: data.country ?? null,
          nationality: data.nationality ?? null,
          targetCountry: data.targetCountry ?? null,
          source: data.source || 'website_purchase',
          status: 'QUALIFIED' // Cliente que comprou já é qualificado
        }
      })
    } else {
      // Atualizar dados se cliente já existe
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: data.name,
          phone: data.phone ?? client.phone,
          country: data.country ?? client.country,
          nationality: data.nationality ?? client.nationality,
          targetCountry: data.targetCountry ?? client.targetCountry,
          status: client.status === 'LEAD' ? 'QUALIFIED' : client.status
        }
      })
    }

    // Se foi passado dados de compra
    // Criar registro de pagamento
    if (data.product && data.amount) {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: data.amount,
          status: 'COMPLETED',
          description: data.product,
          paymentMethod: 'credit_card',
          paidAt: new Date()
        }
      })
    }

    const user: UnifiedUser = {
      id: client.id,
      email: client.email,
      name: client.name,
      type: 'CUSTOMER',
      isActive: true,
      clientData: {
        phone: client.phone ?? null,
        country: client.country ?? null,
        nationality: client.nationality ?? null,
        targetCountry: client.targetCountry ?? null,
        status: client.status,
        score: client.score ?? null
      }
    }

    const token = generateToken(user)
    return { success: true, user, token }

  } catch (error) {
    console.error('Erro ao criar conta do cliente:', error)
    return { success: false, error: 'ACCOUNT_CREATION_FAILED' }
  }
}

// Middleware unificado para API routes
export function requireUnifiedAuth(allowedTypes: ('CUSTOMER' | 'ADMIN' | 'CONSULTANT')[] = ['CUSTOMER', 'ADMIN', 'CONSULTANT']) {
  return async (request: NextRequest) => {
    const user = await verifyUnifiedAuth(request)
    
    if (!user) {
      return createUnifiedAuthError('Não autorizado', 401)
    }

    if (!allowedTypes.includes(user.type)) {
      return createUnifiedAuthError('Tipo de usuário não autorizado', 403)
    }

    return {
      user,
      status: 200
    }
  }
}

// Helper para criar responses de erro de auth
export function createUnifiedAuthError(message: string, status: number = 401) {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    status
  }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// Verificar se é admin
export function isAdminUser(user: UnifiedUser): boolean {
  return !!(user.type === 'ADMIN' && user.role && ['ADMIN', 'MANAGER'].includes(user.role))
}

// Verificar se é cliente
export function isCustomer(user: UnifiedUser): boolean {
  return user.type === 'CUSTOMER'
}

// Verificar se é consultor
export function isConsultant(user: UnifiedUser): boolean {
  return user.type === 'CONSULTANT'
}
