import { NextRequest, NextResponse } from 'next/server'
import { addSecurityHeaders } from './middleware-security'

// Inicializar serviços automaticamente
let servicesInitialized = false

function initializeServicesAsync() {
  if (!servicesInitialized && process.env.NODE_ENV === 'development') {
    servicesInitialized = true
    // Importar e inicializar serviços de forma assíncrona,    import('./lib/startup').then(({ initializeServices }) => {
      initializeServices().catch(console.error)
    }).catch(console.error)
  }
}

// Função para decodificar JWT sem verificar assinatura (apenas para middleware)
function decodeJWTUnsafe(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🚀 Inicializar serviços automaticamente na primeira requisição,  initializeServicesAsync()

  // ✅ Log apenas em desenvolvimento,  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Middleware verificando:', pathname)
  }

  // Redirecionamentos para páginas duplicadas/depreciadas,  const redirects: Record<string, string> = {
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

  // Pular verificação para rotas que não precisam de auth,  if (pathname.includes('/login') || 
      pathname.includes('/unauthorized') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth/login') ||
      pathname.startsWith('/api/auth/register') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api/dashboard')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Rota liberada sem auth:', pathname)
    }
    return addSecurityHeaders(NextResponse.next())
  }

  // Apenas proteger rotas admin específicas,  if (pathname.startsWith('/admin')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Verificando auth para rota admin:', pathname)
    }
    
    // Verificar token de autenticação,    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    
    // Também verificar em outros possíveis formatos de cookie,    const allCookies = request.headers.get('cookie') || ''
    const cookieMatch = allCookies.match(/auth-token=([^;]+)/)
    const backupToken = cookieMatch ? cookieMatch[1] : null
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken || backupToken

    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Auth header presente:', authHeader ? 'SIM' : 'NÃO')
      console.log('🍪 Cookie token presente:', cookieToken ? 'SIM' : 'NÃO')
      console.log('🍪 Backup token presente:', backupToken ? 'SIM' : 'NÃO')
      console.log('🍪 Token final encontrado:', token ? 'SIM' : 'NÃO')
      // Removido log de cookies por segurança    }

    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Sem token, redirecionando para login')
      }
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Decodificar token (sem verificar assinatura - isso será feito pelas APIs),      const decoded = decodeJWTUnsafe(token)
      
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
      
      // Verificar permissões de admin,      const adminRoles = ['ADMIN', 'MANAGER']
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
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Erro ao processar token:', error.message)
      } else {
        console.error('Auth middleware error:', error.message)
      }
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Outras rotas passam sem verificação,  if (process.env.NODE_ENV === 'development') {
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