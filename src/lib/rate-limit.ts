import { NextRequest } from 'next/server'

// ✅ Sistema de Rate Limiting em memória (para produção use Redis)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimit = new Map<string, RateLimitEntry>()

// Configurações de rate limiting por rota
const RATE_LIMIT_CONFIG = {
  '/api/auth/login': { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 tentativas em 15 min,  '/api/auth/register': { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 registros por hora
  '/api/clients': { limit: 100, windowMs: 60 * 60 * 1000 }, // 100 requests por hora,  '/api/payments': { limit: 20, windowMs: 60 * 60 * 1000 }, // 20 pagamentos por hora
  '/api/documents': { limit: 50, windowMs: 60 * 60 * 1000 }, // 50 uploads por hora,  '/api/whatsapp': { limit: 30, windowMs: 60 * 60 * 1000 }, // 30 mensagens por hora
  default: { limit: 1000, windowMs: 60 * 60 * 1000 } // Limite padrão
}

export function applyRateLimit(request: NextRequest, identifier?: string): {
  success: boolean
  limit: number
  remaining: number
  reset: number
  error?: string
} {
  const pathname = request.nextUrl.pathname
  const ip = getClientIP(request)
  const key = identifier || ip
  
  // Buscar configuração para a rota
  
  const config = RATE_LIMIT_CONFIG[pathname] || RATE_LIMIT_CONFIG.default
  
  const now = Date.now()
  const entry = rateLimit.get(key)
  
  // Limpar entradas expiradas periodicamente
  
  if (Math.random() < 0.01) { // 1% das vezes
    cleanupExpiredEntries()
  }
  
  if (!entry || now > entry.resetTime) {
    // Primeira requisição ou janela expirada
    rateLimit.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + config.windowMs
    }
  }
  
  if (entry.count >= config.limit) {
    // Limite excedido
    return {
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
      error: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetTime - now) / 1000)}s`
    }
  }
  
  // Incrementar contador
  
  entry.count++
  rateLimit.set(key, entry)
  
  return {
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetTime
  }
}

// Obter IP do cliente considerando proxies
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIp) return cfConnectingIp
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  
  return request.ip || 'unknown'
}

// Limpar entradas expiradas para economizar memória
function cleanupExpiredEntries() {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  for (const [key, entry] of rateLimit.entries()) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => rateLimit.delete(key))
  
  if (process.env.NODE_ENV === 'development' && keysToDelete.length > 0) {
    console.log(`🧹 Rate limit cleanup: removed ${keysToDelete.length} expired entries`)
  }
}

// Helper para criar response de rate limit
export function createRateLimitResponse(rateLimitResult: ReturnType<typeof applyRateLimit>) {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString()
  }
  
  if (!rateLimitResult.success) {
    headers['Retry-After'] = Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
    
    return Response.json(
      { 
        error: rateLimitResult.error,
        rateLimitInfo: {
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset
        }
      },
      { 
        status: 429,
        headers
      }
    )
  }
  
  return { headers }
}

// Middleware de rate limiting para APIs
export function withRateLimit<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const request = args[0] as NextRequest
    
    // Aplicar rate limiting
    
    const rateLimitResult = applyRateLimit(request)
    
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult) as Response
    }
    
    // Continuar com o handler original
    
    const response = await handler(...args)
    
    // Adicionar headers de rate limit à resposta
    
    const { headers } = createRateLimitResponse(rateLimitResult)
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}