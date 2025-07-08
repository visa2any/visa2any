/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

// Mock do bcrypt
jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

// Mock do crypto
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-123'),
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve fazer login com credenciais válidas', async () => {
    // Arrange
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@visa2any.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      isActive: true,
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    mockBcrypt.compare.mockResolvedValue(true as never)
    ;(prisma.automationLog.create as jest.Mock).mockResolvedValue({})

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@visa2any.com',
        password: 'password123',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.user.email).toBe('test@visa2any.com')
    expect(data.data.token).toBeDefined()
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@visa2any.com' },
      select: expect.any(Object),
    })
  })

  it('deve rejeitar credenciais inválidas', async () => {
    // Arrange
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid@email.com',
        password: 'wrongpassword',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Credenciais inválidas')
  })

  it('deve rejeitar usuário inativo', async () => {
    // Arrange
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@visa2any.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      isActive: false, // Usuário inativo
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@visa2any.com',
        password: 'password123',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Usuário inativo. Contate o administrador.')
  })

  it('deve validar dados de entrada', async () => {
    // Arrange
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email', // Email inválido
        password: '', // Senha vazia
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Dados inválidos')
    expect(data.details).toBeDefined()
  })

  it('deve aplicar rate limiting', async () => {
    // Este teste verifica se o rate limiting está sendo aplicado
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@visa2any.com',
        password: 'password123',
      }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.1',
      },
    })

    // Simular múltiplas tentativas
    for (let i = 0; i < 6; i++) {
      const response = await POST(request)
      
      if (i < 5) {
        // Primeiras 5 tentativas devem passar pelo rate limit
        expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
      } else {
        // 6ª tentativa deve ser bloqueada
        expect(response.status).toBe(429)
        const data = await response.json()
        expect(data.success).toBe(false)
        expect(data.error).toContain('Rate limit exceeded')
      }
    }
  })

  it('deve retornar erro quando NEXTAUTH_SECRET não está configurado', async () => {
    // Arrange
    const originalSecret = process.env.NEXTAUTH_SECRET
    delete process.env.NEXTAUTH_SECRET

    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@visa2any.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      isActive: true,
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    mockBcrypt.compare.mockResolvedValue(true as never)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@visa2any.com',
        password: 'password123',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Configuração de segurança inválida')

    // Restore
    process.env.NEXTAUTH_SECRET = originalSecret
  })
})
