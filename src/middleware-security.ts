import { NextRequest, NextResponse } from 'next/server'

// Headers de segurança essenciais
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Previne clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Previne MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Força HTTPS em produção
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Previne XSS
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Controla referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy (antigas Feature Policy)
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  
  // Content Security Policy básica
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.mercadopago.com https://api.whatsapp.com https://api.sendgrid.com https://api.resend.com",
    "frame-src 'self' https://www.mercadopago.com.br",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
}

// Middleware específico para segurança
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}