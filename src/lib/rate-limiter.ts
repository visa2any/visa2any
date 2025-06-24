import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateStore = new Map<string, RateLimitEntry>()

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 tentativas por 15 min
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests por minuto
  analysis: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 análises por minuto
  email: { windowMs: 60 * 1000, maxRequests: 2 }, // 2 emails por minuto
  checkout: { windowMs: 60 * 1000, maxRequests: 5 } // 5 checkouts por minuto
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { success: boolean; remaining: number; resetTime: number } {
  const ip = getClientIP(request)
  const key = `${ip}-${request.nextUrl.pathname}`
  const now = Date.now()
  
  // Limpar entradas expiradas periodicamente
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }
  
  const entry = rateStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    // Nova janela de tempo
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateStore.set(key, newEntry)
    
    return {
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime
    }
  }
  
  if (entry.count >= config.maxRequests) {
    // Limite excedido
    return {
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  // Incrementar contador
  entry.count++
  rateStore.set(key, entry)
  
  return {
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = request.headers.get('x-vercel-forwarded-for')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  if (ip) {
    return ip.trim()
  }
  
  return 'unknown'
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateStore.entries()) {
    if (now > entry.resetTime) {
      rateStore.delete(key)
    }
  }
}

export function createRateLimitResponse(resetTime: number) {
  const timeToReset = Math.ceil((resetTime - Date.now()) / 1000)
  
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${timeToReset} seconds.`,
      retryAfter: timeToReset
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': timeToReset.toString(),
        'X-RateLimit-Reset': resetTime.toString()
      }
    }
  )
}