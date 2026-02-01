'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Menu, X, LogOut, User, Settings, Bell, Brain, Sparkles } from 'lucide-react'

interface ClientHeaderProps {
  customerData?: {
    name: string
    email: string
    eligibilityScore: number
    profilePhoto?: string
    automationInsights?: {
      engagementScore: number
    }
  }
  onSofiaChat: () => void
  onProfileEdit?: () => void
  onLogout?: () => void
}

export default function ClientHeader({ customerData, onSofiaChat, onProfileEdit, onLogout }: ClientHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-gray-900">Visa2Any</span>
            <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              Portal Cliente
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/cliente" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">Dashboard</a>
            <a href="/cliente/documentos" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">Documentos</a>
            <a href="/cliente/consultorias" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">Consultorias</a>
            <a href="/cliente/pagamentos" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">Pagamentos</a>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Sofia IA Button */}
            <button
              onClick={onSofiaChat}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm text-sm"
            >
              <Brain className="h-3 w-3" />
              Sofia
              {customerData?.automationInsights && (
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Score Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
              <div className="w-12 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${customerData?.eligibilityScore || 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {customerData?.eligibilityScore || 0}%
              </span>
              <Sparkles className="h-3 w-3 text-yellow-500" />
            </div>

            {/* User Info with Profile Menu */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                  {customerData?.profilePhoto ? (
                    <img
                      src={customerData.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    customerData?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{customerData?.name?.split(' ')[0] || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{customerData?.email || 'email@exemplo.com'}</p>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <button
                    onClick={() => {
                      onProfileEdit?.()
                      setShowProfileMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => {
                      onProfileEdit?.()
                      setShowProfileMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      onLogout?.()
                      setShowProfileMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <nav className="flex flex-col space-y-2">
              <a
                href="/cliente"
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Dashboard
              </a>
              <a
                href="/cliente/documentos"
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                📄 Documentos
              </a>
              <a
                href="/cliente/consultorias"
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍💼 Consultorias
              </a>
              <a
                href="/cliente/pagamentos"
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                💳 Pagamentos
              </a>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => {
                    onLogout?.()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors text-sm py-1"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}