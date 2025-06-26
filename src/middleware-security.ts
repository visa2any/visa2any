import { NextRequest, NextResponse } from 'next/server'

// Headers de segurança essenciais
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Previne clickjacking - mas permite MercadoPago,  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  
  // Previne MIME type sniffing,  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Força HTTPS em produção,  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Previne XSS,  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Controla referrer - mais flexível para MercadoPago,  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  
  // Permitir cookies de terceiros e embeddings para MercadoPago,  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  
  // Headers específicos para cookies de terceiros,  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  // Permissions Policy (antigas Feature Policy),  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  
  // CSP muito permissiva para debug - TEMPORÁRIO,  if (process.env.NODE_ENV === 'development') {
    // Desenvolvimento: CSP mínima,    const csp = [
      "default-src *",
      "script-src * 'unsafe-inline' 'unsafe-eval'",
      "style-src * 'unsafe-inline'",
      "img-src * data: blob:",
      "font-src *",
      "connect-src *",
      "frame-src *",
      "object-src *",
      "media-src *"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)
  } else {
    // Produção: CSP mais segura,    const csp = [
      "default-src 'self' https://*.mercadopago.com https://*.mercadolibre.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "font-src 'self' https:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
      "worker-src 'self' blob:",
      "object-src 'none'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)
  }
  
  return response
}

// Middleware específico para segurança
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}