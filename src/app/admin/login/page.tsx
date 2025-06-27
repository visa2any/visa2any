'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Eye, EyeOff, Lock, Mail, Zap, Shield, Users, AlertCircle, CheckCircle, 
  Loader2, Globe, TrendingUp, Star, Award, Plane, MapPin, Clock
} from 'lucide-react'
import { Visa2AnyLogo, Visa2AnyLogoCompact } from '@/components/Visa2AnyLogo'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validação client-side

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido')
      setIsLoading(false)
      return
    }

    try {
      console.log('🔐 Fazendo login com:', { email, password: '***' })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password 
        })
      })

      console.log('📡 Status da resposta:', response.status)
      
      const data = await response.json()
      console.log('📄 Dados da resposta:', data)

      if (data.success && data.data?.user) {
        console.log('✅ Login bem-sucedido:', data.data.user.email)
        
        // Salvar dados no localStorage
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.data.token)
          localStorage.setItem('user', JSON.stringify(data.data.user))
          
          if (rememberMe) {
            localStorage.setItem('remember-email', email)
          } else {
            localStorage.removeItem('remember-email')
          }
        }
        
        setSuccess('Login realizado com sucesso! Redirecionando...')
        
        // Aguardar um pouco e redirecionar para o dashboard unificado
        
        setTimeout(() => {
          router.push('/admin/dashboard-unified')
        }, 1500)
        
      } else {
        const errorMsg = data.error || 'Credenciais inválidas'
        console.log('❌ Erro no login:', errorMsg)
        setError(errorMsg)
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error)
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }


  // Carregar email salvo


  useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('remember-email')
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    }
  })

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Lado Esquerdo - Branding & Visual */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%)] bg-[length:30px_30px]"></div>
        
        {/* Floating Travel Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
          <Globe className="w-16 h-16 text-white/60" />
        </div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse delay-300">
          <Award className="w-12 h-12 text-white/60" />
        </div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse delay-700">
          <MapPin className="w-10 h-10 text-white/60" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-8 text-white h-full">
          {/* Logo e Branding */}
          <div className="mb-8">
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/30">
                    <Plane className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Visa2Any</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <p className="text-white/90 text-lg font-medium">Global Immigration Platform</p>
                  </div>
                </div>
              </div>
              <p className="text-blue-100 text-lg mt-4 font-medium">Sua jornada global começa aqui</p>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 leading-tight">
              🌍 Conectando você ao mundo
            </h2>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Especialistas em imigração com tecnologia de ponta para realizar seu sonho internacional.
            </p>
          </div>

          {/* Features Compactas */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-300" />
                <div>
                  <div className="text-xl font-bold">12k+</div>
                  <div className="text-blue-200 text-xs">Aprovações</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-green-300" />
                <div>
                  <div className="text-xl font-bold">50+</div>
                  <div className="text-blue-200 text-xs">Países</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-300" />
                <div>
                  <div className="text-xl font-bold">24h</div>
                  <div className="text-blue-200 text-xs">Suporte</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-purple-300" />
                <div>
                  <div className="text-xl font-bold">95%</div>
                  <div className="text-blue-200 text-xs">Sucesso</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Compacto */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-sm text-blue-200 ml-2">4.9/5</span>
            </div>
            <p className="text-blue-100 text-sm italic mb-2">
              "Processo incrível! Meu visto foi aprovado em tempo recorde."
            </p>
            <div className="text-xs text-blue-200">
              <strong>Ana Costa</strong> • 🇨🇦 Canadá
            </div>
          </div>

          {/* Países em destaque */}
          <div className="mt-6">
            <div className="text-sm text-blue-200 mb-2">Destinos mais procurados:</div>
            <div className="flex space-x-3 text-lg">
              <span title="Estados Unidos">🇺🇸</span>
              <span title="Canadá">🇨🇦</span>
              <span title="Portugal">🇵🇹</span>
              <span title="Alemanha">🇩🇪</span>
              <span title="Austrália">🇦🇺</span>
              <span title="Reino Unido">🇬🇧</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-full overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Header do Login */}
          <div className="text-center mb-6">
            {/* Logo Mobile */}
            <div className="lg:hidden flex justify-center mb-4">
              <Visa2AnyLogoCompact />
            </div>
            
            <div className="hidden lg:block">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Acesso Administrativo
            </h2>
            <p className="text-gray-600 text-sm">
              Painel de controle da plataforma
            </p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Status Messages */}
            {error && (
              <div className="flex items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-red-800 text-xs">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-green-800 text-xs">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email de Acesso
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-gray-600">
                  Lembrar email
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Autenticando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Acessar Dashboard
                  </div>
                )}
              </button>

            </form>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Conexão segura SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}