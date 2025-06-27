import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Rotas que requerem autenticação
const protectedRoutes = ['/admin']

// Rotas de API que requerem autenticação
const protectedApiRoutes = [
  '/api/clients',
  '/api/consultations',
  '/api/dashboard',
  '/api/documents',
  '/api/users'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pular autenticação para página de login

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Verificar se é rota protegida

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute || isProtectedApiRoute) {
    // Buscar token
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { status: 401 }
        )
      } else {
        // Redirecionar para login
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    try {
      // Verificar token
      const jwtSecret = process.env.NEXTAUTH_SECRET
      if (!jwtSecret) {
        console.error('NEXTAUTH_SECRET não configurado')
        if (isProtectedApiRoute) {
          return NextResponse.json(
            { status: 500 }
          )
        } else {
          const loginUrl = new URL('/admin/login', request.url)
          return NextResponse.redirect(loginUrl)
        }
      }
      
      const decoded = jwt.verify(token, jwtSecret) as any

      // Adicionar dados do usuário ao header para as APIs

      if (isProtectedApiRoute) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', decoded.userId)
        requestHeaders.set('x-user-role', decoded.role)

        return NextResponse.next({
          request: {
            headers: requestHeaders
          }
        })
      }

    } catch (error) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { status: 401 }
        )
      } else {
        // Redirecionar para login
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Rotas do admin,    '/admin/:path*',
    // APIs protegidas,    '/api/clients/:path*',
    '/api/consultations/:path*',
    '/api/dashboard/:path*',
    '/api/documents/:path*',
    '/api/users/:path*'
  ]
}