'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  User,
  ChevronRight,
  Zap,
  Search,
  TrendingUp
} from 'lucide-react'
import { NotificationProvider, NotificationBell, ToastContainer } from '@/components/NotificationSystem'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { Visa2AnyLogoCompact } from '@/components/Visa2AnyLogo'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function AdminLayoutContent({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  
  // Initialize system notifications,  useSystemNotifications()

  const isLoginPage = pathname.includes('/login')

  const checkAuth = useCallback(async () => {
    // Não verificar se estivermos na página de login,    if (pathname.includes('/login')) {
      setIsLoading(false)
      return
    }
    
    console.log('🔍 Verificando autenticação para:', pathname)
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      console.log('📡 Resposta do /api/auth/me:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Usuário autenticado:', data.data)
        setUser(data.data)
      } else {
        console.log('❌ Não autenticado, redirecionando...')
        router.push('/admin/login')
      }
    } catch (error) {
      console.log('❌ Erro na verificação:', error)
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }, [router, pathname])

  useEffect(() => {
    // Se estivermos na página de login, não fazer verificação,    if (isLoginPage) {
      setIsLoading(false)
      return
    }
    
    // Só verificar autenticação se não tivermos usuário e não estivermos na página de login,    if (!user) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [isLoginPage, checkAuth, user])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
      }
      
      router.push('/admin/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push('/admin/login')
    }
  }

  const navigation = [
    {
      name: '🚀 Command Center',
      href: '/admin/dashboard-unified',
      icon: Zap,
      current: pathname.startsWith('/admin/dashboard-unified') || pathname === '/admin',
      description: 'Dashboard administrativo unificado - Principal',
      isNew: false,
      isPrimary: true
    },
    {
      name: 'Clientes',
      href: '/admin/clients',
      icon: Users,
      current: pathname.startsWith('/admin/clients'),
      description: 'Gestao de clientes e leads'
    },
    {
      name: 'Revenue Ops',
      href: '/admin/revenue',
      icon: TrendingUp,
      current: pathname.startsWith('/admin/revenue'),
      description: 'Revenue operations e analytics'
    },
    {
      name: 'Consultorias',
      href: '/admin/consultations',
      icon: Calendar,
      current: pathname.startsWith('/admin/consultations'),
      description: 'Agendamentos e consultas'
    },
    {
      name: 'Documentos',
      href: '/admin/documents',
      icon: FileText,
      current: pathname.startsWith('/admin/documents'),
      description: 'Documentos e analises'
    },
    {
      name: 'Relatorios',
      href: '/admin/reports',
      icon: BarChart3,
      current: pathname.startsWith('/admin/reports'),
      description: 'Analytics e reports'
    },
    {
      name: '🤝 Afiliados',
      href: '/admin/affiliates',
      icon: Users,
      current: pathname.startsWith('/admin/affiliates'),
      description: 'Sistema de afiliados e parcerias',
      isNew: true
    },
    {
      name: 'Configuracoes',
      href: '/admin/settings',
      icon: Settings,
      current: pathname.startsWith('/admin/settings'),
      description: 'Configuracoes do sistema'
    }
  ]

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
          </div>
          <p className="text-gray-700 mt-4 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Para o dashboard unificado, usar layout sem sidebar,  if (pathname.startsWith('/admin/dashboard-unified')) {
    return (
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, rgb(240 249 255) 0%, rgb(224 242 254) 25%, rgb(243 232 255) 50%, rgb(254 243 226) 75%, rgb(248 250 252) 100%)'
      }}>
        <main className="w-full">
          {children}
        </main>
        
        {/* Toast notifications */}
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ 
      background: 'linear-gradient(135deg, rgb(240 249 255) 0%, rgb(224 242 254) 25%, rgb(243 232 255) 50%, rgb(254 243 226) 75%, rgb(248 250 252) 100%)'
    }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white/20 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} user={user} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent navigation={navigation} user={user} onLogout={handleLogout} />
      </div>

      <div className="md:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden bg-white/70 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <NotificationBell />
            </div>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white/70 backdrop-blur-sm border-t border-white/20 mt-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Visa2Any
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  © 2024 Visa2Any. Todos os direitos reservados.
                </span>
              </div>
              
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema Online</span>
                </div>
                <span className="text-xs text-gray-500">
                  Versão 2.1.0
                </span>
                <span className="text-xs text-gray-500">
                  Última atualização: Hoje
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </NotificationProvider>
  )
}

function SidebarContent({ 
  navigation, 
  user, 
  onLogout 
}: { 
  navigation: any[], 
  user: User, 
  onLogout: () => void 
}) {
  const router = useRouter()
  
  const roleLabels: Record<string, string> = {
    'ADMIN': 'Administrador',
    'MANAGER': 'Gerente',
    'STAFF': 'Funcionario',
    'CONSULTANT': 'Consultor'
  }

  const roleColors: Record<string, string> = {
    'ADMIN': 'from-red-500 to-pink-500',
    'MANAGER': 'from-blue-500 to-indigo-500',
    'STAFF': 'from-green-500 to-teal-500',
    'CONSULTANT': 'from-purple-500 to-violet-500'
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 border-r" style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <Visa2AnyLogoCompact />
        </div>
        
        <div className="mt-6 px-6">
          <div className="rounded-2xl p-4 border shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
          }}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-gradient-to-r ${roleColors[user.role] || 'from-gray-400 to-gray-500'} rounded-xl`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                <div className="text-xs font-medium text-gray-600">{roleLabels[user.role] || user.role}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.name} className="relative">
                {item.isNew && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                      NOVO
                    </span>
                  </div>
                )}
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                    item.current
                      ? item.isPrimary 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105 ring-2 ring-blue-300 border-2 border-blue-400'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : item.isPrimary
                        ? 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:scale-105 hover:shadow-lg border-2 border-blue-200 font-semibold'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <Icon
                    className={`mr-4 flex-shrink-0 h-5 w-5 transition-all ${
                      item.current 
                        ? 'text-white' 
                        : item.isPrimary
                          ? 'text-blue-600 group-hover:text-blue-700'
                          : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    {!item.current && (
                      <div className={`text-xs transition-colors ${
                        item.isPrimary 
                          ? 'text-blue-500 group-hover:text-blue-600 font-medium'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.current && (
                    <ChevronRight className="h-4 w-4 text-white/70" />
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        <div className="px-6 py-4">
          <div className="rounded-2xl p-4 border" style={{
            background: 'linear-gradient(135deg, rgb(236 253 245) 0%, rgb(239 246 255) 100%)',
            borderColor: 'rgba(34, 197, 94, 0.2)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-700">Status do Sistema</div>
                <div className="text-xs text-gray-500">Todos os servicos operacionais</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 border-t border-white/20 p-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
        >
          <LogOut className="mr-4 h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Sair do Sistema</span>
        </button>
      </div>
    </div>
  )
}