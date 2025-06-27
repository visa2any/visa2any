'use client'

import { ArrowRight, Globe, Menu, X, LogIn, ChevronDown, Bell, User, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(3) // Mock notifications count
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Páginas que não precisam verificar autenticação
  
  const publicPages = ['/checkout-wizard', '/checkout-moderno', '/payment', '/']
  const [notificationsList, setNotificationsList] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Documento aprovado',
      message: 'Seu passaporte foi aprovado e está pronto para retirada',
      timestamp: '2 min atrás',
      read: false
    },
    {
      id: '2', 
      type: 'info',
      title: 'Nova atualização disponível',
      message: 'Mudanças nas regras de visto americano - confira',
      timestamp: '1 hora atrás',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Documento pendente',
      message: 'Lembre-se de enviar a certidão de nascimento',
      timestamp: '2 horas atrás',
      read: true
    }
  ])

  // Check user authentication on component mount

  useEffect(() => {
    // Não verificar autenticação em páginas públicas para evitar erros desnecessários
    const isPublicPage = publicPages.some(page => pathname.startsWith(page))
    if (isPublicPage) return
    
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        } else {
          // Status 401 é normal para usuários não logados
          setUser(null)
        }
      } catch (error) {
        // Falha na rede ou erro de servidor - usuário não logado
        setUser(null)
      }
    }
    
    // Initial check
    
    checkAuth()
    
    // Listen for login events
    
    const handleUserLogin = () => {
      setTimeout(checkAuth, 100) // Small delay to ensure cookie is set
    }
    
    const handleStorageChange = () => {
      checkAuth()
    }
    
    // Add event listeners
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-login', handleUserLogin)
    
    // Cleanup
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-login', handleUserLogin)
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setIsUserMenuOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotificationsList(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
    
    // Update unread count
    
    const unreadCount = notificationsList.filter(n => !n.read && n.id !== notificationId).length
    setNotifications(unreadCount)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      case 'info':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3">
          <a href="/" className="flex items-center">
            <Globe className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">Visa2Any</span>
          </a>
          
          {/* Desktop Navigation - ALINHADO À DIREITA */}
          <nav className="hidden lg:flex items-center space-x-6 ml-auto">
            {/* Serviços de Imigração */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Serviços
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide px-4 mb-2">🌟 Consultoria & Vistos</div>
                  <a href="/consultoria-ia" className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="font-semibold text-gray-900">🤖 IA Consultoria</div>
                    <div className="text-sm text-gray-600">Análise de elegibilidade gratuita</div>
                  </a>
                  <a href="/vaga-express" className="block px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors">
                    <div className="font-semibold text-gray-900">⚡ Vaga Express</div>
                    <div className="text-sm text-gray-600">Monitore vagas de consulado</div>
                  </a>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">Documentação</div>
                    <a href="/certidoes" className="block px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                      <div className="font-semibold text-gray-900">📜 Certidões</div>
                      <div className="text-sm text-gray-600">Nascimento, casamento, óbito</div>
                    </a>
                    <a href="/traducao" className="block px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                      <div className="font-semibold text-gray-900">🌐 Tradução Juramentada</div>
                      <div className="text-sm text-gray-600">Express 24-48h</div>
                    </a>
                    <a href="/apostilamento" className="block px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="font-semibold text-gray-900">✅ Apostilamento</div>
                      <div className="text-sm text-gray-600">Validação internacional</div>
                    </a>
                    <a href="/antecedentes" className="block px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                      <div className="font-semibold text-gray-900">🛡️ Antecedentes Criminais</div>
                      <div className="text-sm text-gray-600">Federal + estadual</div>
                    </a>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide px-4 mb-2">✨ Imigração & Pacotes</div>
                    <a href="/assessoria-juridica" className="block px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                      <div className="font-semibold text-gray-900">⚖️ Assessoria Jurídica</div>
                      <div className="text-sm text-gray-600">Cidadania, residência permanente</div>
                    </a>
                    <a href="/kit-emigracao" className="block px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors">
                      <div className="font-semibold text-gray-900">📋 Kit Emigração</div>
                      <div className="text-sm text-gray-600">Tudo para sair do Brasil</div>
                    </a>
                    <a href="/precos" className="block px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="font-semibold text-gray-900">👑 Pacotes Premium</div>
                      <div className="text-sm text-gray-600">Assessoria completa</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Páginas principais */}
            <a href="/precos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Preços</a>
            <a href="/sobre" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sobre</a>
            <a href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Blog</a>
            <a href="/afiliados" className="text-yellow-600 hover:text-yellow-700 transition-colors font-bold">💰 Afiliados</a>
            
            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                          <span className="text-sm text-gray-500">{notifications} novas</span>
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notificationsList.length > 0 ? (
                          notificationsList.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-1.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm font-medium ${
                                      !notification.read ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {notification.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Nenhuma notificação</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Ver todas as notificações
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.avatar ? (
                              <Image 
                                src={user.avatar} 
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                              {user.role}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <a href="/cliente" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Meu Perfil</span>
                        </a>
                        <a href="/cliente" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Configurações</span>
                        </a>
                        <a href="/cliente/documentos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Meus Processos</span>
                        </a>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Sair</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <a 
                href="/cliente/login" 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
              >
                <LogIn className="h-4 w-4" />
                Área Cliente
              </a>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu Otimizado */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {/* Serviços principais */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide px-2">Serviços</div>
                <a 
                  href="/consultoria-ia" 
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">🤖</span>
                  IA Consultoria
                </a>
                <a 
                  href="/vaga-express" 
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">⚡</span>
                  Vaga Express
                </a>
                
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 pt-2">Documentação</div>
                <a 
                  href="/certidoes" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">📜</span>
                  Certidões
                </a>
                <a 
                  href="/traducao" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">🌐</span>
                  Tradução
                </a>
                <a 
                  href="/apostilamento" 
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">✅</span>
                  Apostilamento
                </a>
                <a 
                  href="/antecedentes" 
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">🛡️</span>
                  Antecedentes
                </a>
                
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide px-2 pt-2">Imigração & Pacotes</div>
                <a 
                  href="/assessoria-juridica" 
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">⚖️</span>
                  Assessoria Jurídica
                </a>
                <a 
                  href="/kit-emigracao" 
                  className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">📋</span>
                  Kit Emigração
                </a>
                <a 
                  href="/precos" 
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">👑</span>
                  Pacotes Premium
                </a>
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Empresa</div>
                <a 
                  href="/sobre" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre Nós
                </a>
                <a 
                  href="/blog" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </a>
                <a 
                  href="/afiliados" 
                  className="text-yellow-600 hover:text-yellow-700 transition-colors px-2 py-1 block font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💰 Programa de Afiliados
                </a>
              </div>
              
              {/* Área Cliente */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <a 
                  href="/cliente/login" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Área Cliente
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}