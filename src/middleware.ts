import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { addSecurityHeaders } from './middleware-security'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Middleware verificando:', pathname)
  }

  // Redirecionamentos para páginas duplicadas/depreciadas
  const redirects: Record<string, string> = {
    '/page-simple': '/',
    '/page-original': '/',
    '/precos-novo': '/precos',
    '/admin/login-simple': '/admin/login',
    '/admin/dashboard-simple': '/admin/dashboard-unified'
  }

  if (redirects[pathname]) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Redirecionando:', pathname, '->', redirects[pathname])
    }
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301)
  }

  // Pular verificação para rotas que não precisam de auth
  const isPublicRoute =
    pathname.includes('/login') ||
    pathname.includes('/unauthorized') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/dashboard')

  if (isPublicRoute) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Rota liberada sem auth:', pathname)
    }
    return addSecurityHeaders(NextResponse.next())
  }

  // Apenas proteger rotas admin específicas
  if (pathname.startsWith('/admin')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Verificando auth para rota admin:', pathname)
    }

    // Verificar token de autenticação

    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value

    // Também verificar em outros possíveis formatos de cookie

    const allCookies = request.headers.get('cookie') || ''
    const cookieMatch = allCookies.match(/auth-token=([^;]+)/)
    const backupToken = cookieMatch ? cookieMatch[1] : null

    const token = authHeader?.replace('Bearer ', '') || cookieToken || backupToken

    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Auth header presente:', !!authHeader)
      console.log('🍪 Cookie token presente:', !!cookieToken)
      console.log('🍪 Backup token presente:', !!backupToken)
      console.log('🍪 Token final encontrado:', !!token)
    }

    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Sem token, redirecionando para login')
      }
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Decodificar token e verificar assinatura com jose
      // ⚠️ IMPORTANT: Must match the secret used in /api/auth/login (NEXTAUTH_SECRET)
      const secretEnv = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'temporary-dev-secret-123'
      const secret = new TextEncoder().encode(secretEnv)
      const { payload: decoded } = await jwtVerify(token, secret) as any

      if (!decoded || !decoded.email || !decoded.role) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Token malformado')
        }
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Token válido para usuário verificado')
      }

      // Verificar permissões de admin

      const adminRoles = ['ADMIN', 'MANAGER']
      if (!adminRoles.includes(decoded.role)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Role insuficiente:', decoded.role)
        }
        const unauthorizedUrl = new URL('/admin/unauthorized', request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Acesso autorizado para:', pathname)
      }
      return addSecurityHeaders(NextResponse.next())

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Erro ao processar token:', errorMessage)
      } else {
        console.error('Auth middleware error:', errorMessage)
      }
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Outras rotas passam sem verificação

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Rota pública:', pathname)
  }
  return addSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/page-simple',
    '/page-original',
    '/precos-novo',
    '/admin/login-simple',
    '/admin/dashboard-simple'
  ]
}