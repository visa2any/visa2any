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
    phone?: string
    country?: string
    nationality?: string
    targetCountry?: string
    status: string
    score?: number
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
          phone: client.phone || undefined,
          country: client.country || undefined,
          nationality: client.nationality || undefined,
          targetCountry: client.targetCountry || undefined,
          status: client.status,
          score: client.score || undefined
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
    }

    // Se não tem senha, é primeiro login (criar senha)
    if (!password) {
      return { 
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
        phone: client.phone || undefined,
        country: client.country || undefined,
        nationality: client.nationality || undefined,
        targetCountry: client.targetCountry || undefined,
        status: client.status,
        score: client.score || undefined
      }
    }

    const token = generateToken(user)


  } catch (error) {
    console.error('Erro no login do cliente:', error)
  }
}

// Login de admin/staff
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: UnifiedUser; token?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.isActive) {
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
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


  } catch (error) {
    console.error('Erro no login do admin:', error)
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
          phone: data.phone,
          country: data.country,
          nationality: data.nationality,
          targetCountry: data.targetCountry,
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
          phone: data.phone || client.phone,
          country: data.country || client.country,
          nationality: data.nationality || client.nationality,
          targetCountry: data.targetCountry || client.targetCountry,
          status: client.status === 'LEAD' ? 'QUALIFIED' : client.status
        }
      })
    }

    // Se foi passado dados de compra
 criar registro de pagamento
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
        phone: client.phone || undefined,
        country: client.country || undefined,
        nationality: client.nationality || undefined,
        targetCountry: client.targetCountry || undefined,
        status: client.status,
        score: client.score || undefined
      }
    }

    const token = generateToken(user)


  } catch (error) {
    console.error('Erro ao criar conta do cliente:', error)
  }
}

// Middleware unificado para API routes
export function requireUnifiedAuth(allowedTypes: ('CUSTOMER' | 'ADMIN' | 'CONSULTANT')[] = ['CUSTOMER', 'ADMIN', 'CONSULTANT']) {
  return async (request: NextRequest) => {
    const user = await verifyUnifiedAuth(request)
    
    if (!user) {
      return {
        error: 'Não autorizado',
        status: 401
      }
    }

    if (!allowedTypes.includes(user.type)) {
      return {
        error: 'Tipo de usuário não autorizado',
        status: 403
      }
    }

  }
}

// Helper para criar responses de erro de auth
export function createUnifiedAuthError(message: string, status: number = 401) {
  return Response.json(
    { status }
  )
}

// Verificar se é admin
export function isAdminUser(user: UnifiedUser): boolean {
  return user.type === 'ADMIN' && user.role && ['ADMIN', 'MANAGER'].includes(user.role)
}

// Verificar se é cliente
export function isCustomer(user: UnifiedUser): boolean {
  return user.type === 'CUSTOMER'
}

// Verificar se é consultor
export function isConsultant(user: UnifiedUser): boolean {
  return user.type === 'CONSULTANT'
}