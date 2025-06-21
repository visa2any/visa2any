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
  
  // Controla referrer - mais flexível para MercadoPago
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  
  // Permissions Policy (antigas Feature Policy)
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  
  // Content Security Policy otimizada para MercadoPago
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://sdk.mercadopago.com https://http2.mlstatic.com https://js-agent.newrelic.com https://www.gstatic.com https://static.hotjar.com https://script.hotjar.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://http2.mlstatic.com",
    "font-src 'self' https://fonts.gstatic.com https://http2.mlstatic.com",
    "img-src 'self' data: https: blob: https://http2.mlstatic.com https://images.unsplash.com",
    "connect-src 'self' https://api.mercadopago.com https://api.mercadolibre.com https://www.mercadolibre.com https://vc.hotjar.io https://bam.nr-data.net https://api.whatsapp.com https://api.sendgrid.com https://api.resend.com",
    "frame-src 'self' https://www.mercadopago.com.br https://www.mercadopago.com https://www.google.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.mercadopago.com.br"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
}

// Middleware específico para segurança
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}