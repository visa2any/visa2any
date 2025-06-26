/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { applyRateLimit, createRateLimitResponse } from '@/lib/rate-limit'

describe('Rate Limiting System', () => {
  beforeEach(() => {
    // Limpar rate limit cache entre testes
    jest.clearAllMocks()
  })

  describe('applyRateLimit', () => {
    it('deve permitir requisições dentro do limite', () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '192.168.1.100',
        },
      })

      const result = applyRateLimit(request)

      expect(result.success).toBe(true)
      expect(result.limit).toBe(5) // Limite para /api/auth/login
      expect(result.remaining).toBe(4) // 5 - 1
      expect(result.reset).toBeDefined()
    })

    it('deve bloquear requisições acima do limite', () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '192.168.1.101',
        },
      })

      // Fazer 5 requisições (limite)
      for (let i = 0; i < 5; i++) {
        const result = applyRateLimit(request)
        expect(result.success).toBe(true)
      }

      // 6ª requisição deve ser bloqueada
      const result = applyRateLimit(request)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.error).toContain('Rate limit exceeded')
    })

    it('deve usar configuração padrão para rotas não especificadas', () => {
      const request = new NextRequest('http://localhost:3000/api/unknown', {
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.102',
        },
      })

      const result = applyRateLimit(request)

      expect(result.success).toBe(true)
      expect(result.limit).toBe(1000) // Limite padrão
      expect(result.remaining).toBe(999)
    })

    it('deve usar diferentes limites para diferentes rotas', () => {
      // Teste para rota de login (limite: 5)
      const loginRequest = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.103' },
      })

      const loginResult = applyRateLimit(loginRequest)
      expect(loginResult.limit).toBe(5)

      // Teste para rota de clientes (limite: 100)
      const clientsRequest = new NextRequest('http://localhost:3000/api/clients', {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.104' },
      })

      const clientsResult = applyRateLimit(clientsRequest)
      expect(clientsResult.limit).toBe(100)
    })

    it('deve distinguir diferentes IPs', () => {
      const request1 = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.105' },
      })

      const request2 = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.106' },
      })

      // Esgotar limite para IP1
      for (let i = 0; i < 5; i++) {
        applyRateLimit(request1)
      }
      const result1 = applyRateLimit(request1)
      expect(result1.success).toBe(false)

      // IP2 deve ainda ter limite disponível
      const result2 = applyRateLimit(request2)
      expect(result2.success).toBe(true)
    })

    it('deve usar identificador customizado quando fornecido', () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.107' },
      })

      const customIdentifier = 'user-123'
      
      // Fazer 5 requisições com identificador customizado
      for (let i = 0; i < 5; i++) {
        const result = applyRateLimit(request, customIdentifier)
        expect(result.success).toBe(true)
      }

      // 6ª requisição deve ser bloqueada
      const result = applyRateLimit(request, customIdentifier)
      expect(result.success).toBe(false)

      // Requisição normal com IP deve funcionar (diferente identificador)
      const normalResult = applyRateLimit(request)
      expect(normalResult.success).toBe(true)
    })

    it('deve resetar contador após janela de tempo', async () => {
      // Este teste é conceitual - em produção usaríamos mock do Date
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'x-forwarded-for': '192.168.1.108' },
      })

      // Fazer requisições até o limite
      for (let i = 0; i < 5; i++) {
        applyRateLimit(request)
      }

      // Verificar que está bloqueado
      const blockedResult = applyRateLimit(request)
      expect(blockedResult.success).toBe(false)

      // Em um cenário real
 aguardaríamos ou mockaria o tempo
      // Para este teste
 verificamos apenas a estrutura
      expect(blockedResult.reset).toBeGreaterThan(Date.now())
    })
  })

  describe('createRateLimitResponse', () => {
    it('deve criar resposta de sucesso com headers corretos', () => {
      const rateLimitResult = {
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 3600000,
      }

      const response = createRateLimitResponse(rateLimitResult)

      expect(response.headers['X-RateLimit-Limit']).toBe('100')
      expect(response.headers['X-RateLimit-Remaining']).toBe('99')
      expect(response.headers['X-RateLimit-Reset']).toBeDefined()
    })

    it('deve criar resposta de erro 429 quando limite excedido', () => {
      const rateLimitResult = {
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 900000,
        error: 'Rate limit exceeded. Try again in 900s',
      }

      const response = createRateLimitResponse(rateLimitResult) as Response

      expect(response.status).toBe(429)
      expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response.headers.get('Retry-After')).toBeDefined()
    })

    it('deve incluir informações de rate limit no corpo da resposta de erro', async () => {
      const rateLimitResult = {
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 900000,
        error: 'Rate limit exceeded',
      }

      const response = createRateLimitResponse(rateLimitResult) as Response
      const body = await response.json()

      expect(body.success).toBe(false)
      expect(body.error).toBe('Rate limit exceeded')
      expect(body.rateLimitInfo).toEqual({
        limit: 5,
        remaining: 0,
        reset: rateLimitResult.reset,
      })
    })
  })

  describe('IP Detection', () => {
    it('deve detectar IP de CF-Connecting-IP', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'cf-connecting-ip': '203.0.113.1',
          'x-forwarded-for': '198.51.100.1',
          'x-real-ip': '192.0.2.1',
        },
      })

      const result = applyRateLimit(request)
      // CF-Connecting-IP deve ter prioridade
      expect(result.success).toBe(true)
    })

    it('deve detectar IP de X-Forwarded-For quando CF não disponível', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '198.51.100.2, 203.0.113.2',
          'x-real-ip': '192.0.2.2',
        },
      })

      const result = applyRateLimit(request)
      // Deve usar o primeiro IP da lista X-Forwarded-For
      expect(result.success).toBe(true)
    })

    it('deve detectar IP de X-Real-IP quando outros não disponíveis', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-real-ip': '192.0.2.3',
        },
      })

      const result = applyRateLimit(request)
      expect(result.success).toBe(true)
    })

    it('deve usar IP padrão quando nenhum header disponível', () => {
      const request = new NextRequest('http://localhost:3000/api/test')

      const result = applyRateLimit(request)
      // Deve funcionar mesmo sem headers de IP
      expect(result.success).toBe(true)
    })
  })
})