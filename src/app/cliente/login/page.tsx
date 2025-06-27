'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Globe, Lock, Mail, ArrowRight, CheckCircle, Shield, Clock } from 'lucide-react'

export default function CustomerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // BYPASS TEMPORÁRIO PARA DEMONSTRAÇÃO,    // Simular login bem-sucedido com dados de exemplo
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay de API,      
      const mockCustomerData = {
        id: 'cliente-demo-1',
        name: name || 'Cliente Demonstração',
        email: email,
        phone: phone || '(11) 99999-9999',
        status: 'IN_PROCESS',
        destinationCountry: 'Estados Unidos',
        visaType: 'Turismo B1/B2',
        eligibilityScore: 85
      }

      // Salvar dados no localStorage

      if (typeof window !== 'undefined') {
        localStorage.setItem('customer-token', 'demo-token-123')
        localStorage.setItem('customer', JSON.stringify(mockCustomerData))
      }
      
      console.log('✅ Login de demonstração realizado com sucesso')
      
      // Redirecionar para o dashboard
      
      router.push('/cliente')
      
    } catch (error) {
      console.error('Erro na autenticação:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portal do Cliente
          </h1>
          <p className="text-gray-600">
            {isRegisterMode ? 'Crie sua conta e acompanhe seu processo' : 'Acesse sua conta Visa2Any'}
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegisterMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegisterMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone/WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required={isRegisterMode}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={isRegisterMode ? 'Crie uma senha segura' : 'Sua senha'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isRegisterMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, com letras e números
                </p>
              )}
            </div>

            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password || (isRegisterMode && (!name || !phone))}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isRegisterMode ? 'Criar Conta' : 'Entrar no Portal'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegisterMode ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
            </p>
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode)
                setError('')
                setEmail('')
                setPassword('')
                setName('')
                setPhone('')
              }}
              className="mt-2 text-blue-600 hover:text-blue-500 font-semibold"
            >
              {isRegisterMode ? 'Fazer Login' : 'Criar Conta Gratuita'}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-center">
                <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Seguro</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Confiável</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Precisa de ajuda? {' '}
            <a href="mailto:suporte@visa2any.com" className="text-blue-600 hover:text-blue-500">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}