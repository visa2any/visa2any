'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

interface SocialAuthProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'signup'
  onSuccess?: (user: any) => void
}

export default function SocialAuth({ isOpen, onClose, defaultTab = 'login', onSuccess }: SocialAuthProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing,    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ ${activeTab === 'login' ? 'Login' : 'Cadastro'} realizado com sucesso`)
        
        // Trigger header update,        window.dispatchEvent(new Event('user-login'))
        
        onSuccess?.(data.user)
        onClose()
      } else {
        setErrors({ submit: data.message || 'Erro ao processar solicitação' })
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      setErrors({ submit: 'Erro de conexão. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setIsLoading(true)
    
    try {
      // Redirect to social auth endpoint,      window.location.href = `/api/auth/${provider}`
    } catch (error) {
      console.error(`Erro no login com ${provider}:`, error)
      setErrors({ submit: `Erro no login com ${provider}. Tente novamente.` })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-auto relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'login' ? 'Entrar' : 'Criar conta'}
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Criar conta
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2 mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 text-sm border hover:bg-gray-50 transition-colors"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </div>
            </Button>
          </div>

          <div className="relative mb-3">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
              ou
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === 'signup' && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome completo
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`pl-10 h-9 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 h-9 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="seu@email.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {activeTab === 'signup' && (
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefone (opcional)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 h-9"
                    placeholder="(11) 99999-9999"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 h-9 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Sua senha"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {activeTab === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar senha
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pl-10 h-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirme sua senha"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Processando...' 
                : activeTab === 'login' 
                  ? 'Entrar' 
                  : 'Criar conta'
              }
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-sm text-gray-600">
            {activeTab === 'login' ? (
              <>
                Não tem conta?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Criar
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Entrar
                </button>
              </>
            )}
          </div>

          {activeTab === 'signup' && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Ao criar conta, você aceita nossos{' '}
              <a href="/termos" className="text-blue-600 hover:underline">
                Termos
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-blue-600 hover:underline">
                Privacidade
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}