'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, ArrowRight, CreditCard, Shield, Check, Clock, Star, 
  Lock, Zap, CheckCircle, Gift, Percent, AlertCircle, Users, 
  Phone, Mail, User, MapPin, Calendar, Save, Eye, EyeOff,
  Sparkles, Award, Target, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface UltraCheckoutProps {
  productId: string
  productName: string
  price: number
  description?: string
  features?: string[]
  variant?: 'default' | 'premium' | 'vip'
  onSuccess?: () => void
}

interface UpsellOffer {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  features: string[]
  urgency?: string
  savings: number
  recommended?: boolean
  category: 'speed' | 'support' | 'bonus'
  icon: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  country: string
  nationality: string
  targetCountry: string
  cpf?: string
  terms: boolean
  newsletter: boolean
  expressCheckout: boolean
}

// Dados dos produtos para melhor UX
const PRODUCT_DATA: Record<string, any> = {
  'vaga-express-vip': {
    badge: '👑 VIP',
    badgeColor: 'from-purple-600 to-pink-600',
    highlight: 'Mais Completo',
    guarantee: '90 dias de monitoramento',
    trustScore: 98,
    customers: '2.5k+',
    specialFeatures: [
      'Consultoria dedicada inclusa', 
      'Notificação em 2 minutos', 
      'Suporte 24/7',
      'Ligação imediata para vagas'
    ]
  },
  'vaga-express-premium': {
    badge: '🥈 Premium',
    badgeColor: 'from-blue-600 to-purple-600',
    highlight: 'Mais Popular',
    guarantee: '60 dias de monitoramento',
    trustScore: 96,
    customers: '5k+',
    specialFeatures: [
      'Garantia de reembolso', 
      'Notificação em 5 minutos', 
      'Suporte prioritário',
      'Relatório detalhado'
    ]
  },
  'vaga-express-basic': {
    badge: '🥉 Basic',
    badgeColor: 'from-green-600 to-blue-600',
    highlight: 'Melhor Custo',
    guarantee: '30 dias de monitoramento',
    trustScore: 94,
    customers: '8k+',
    specialFeatures: [
      'Notificação em 15 minutos', 
      'WhatsApp + Email', 
      'Suporte padrão',
      'Relatório semanal'
    ]
  }
}

export default function UltraCheckout({
  productId,
  productName,
  price,
  description,
  features = [],
  variant = 'default',
  onSuccess
}: UltraCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentSection, setCurrentSection] = useState<'overview' | 'upsells' | 'customer' | 'payment'>('overview')
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    country: 'BR',
    nationality: 'brasileiro',
    targetCountry: '',
    cpf: '',
    terms: false,
    newsletter: true,
    expressCheckout: false
  })

  const productData = PRODUCT_DATA[productId] || {}

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem(`checkout_${productId}`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setCustomerData(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Failed to parse saved data:', e)
      }
    }
  }, [productId])

  const autoSave = useCallback(() => {
    setAutoSaveStatus('saving')
    localStorage.setItem(`checkout_${productId}`, JSON.stringify(customerData))
    setTimeout(() => {
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    }, 300)
  }, [customerData, productId])

  useEffect(() => {
    if (customerData.name || customerData.email || customerData.phone) {
      const timeoutId = setTimeout(autoSave, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [customerData, autoSave])

  // Upsells inteligentes e categorizados,  const getUpsellOffers = (): UpsellOffer[] => {
    const offers: UpsellOffer[] = []

    // Ofertas de velocidade,    if (!productId.includes('vip')) {
      offers.push({
        id: 'instant-notifications',
        name: '⚡ Notificações Instantâneas',
        description: 'Receba alertas em tempo real - sem atraso',
        originalPrice: 197,
        discountedPrice: 97,
        savings: 100,
        category: 'speed',
        icon: '⚡',
        features: ['Notificação em 30 segundos', 'Push + SMS + Email', 'Prioridade máxima'],
        urgency: 'Acelere 10x sua resposta'
      })
    }

    // Ofertas de suporte,    if (productId.includes('basic') || productId.includes('premium')) {
      offers.push({
        id: 'personal-consultant',
        name: '👨‍💼 Consultor Pessoal',
        description: 'Tenha um especialista dedicado ao seu caso',
        originalPrice: 497,
        discountedPrice: 297,
        savings: 200,
        category: 'support',
        icon: '👨‍💼',
        features: ['Consultor dedicado', 'WhatsApp direto', 'Estratégia personalizada'],
        recommended: true,
        urgency: 'Apenas 3 consultores disponíveis hoje'
      })
    }

    // Ofertas de bônus,    offers.push({
      id: 'interview-mastery',
      name: '🎯 Preparação Completa',
      description: 'Kit completo de preparação para entrevista',
      originalPrice: 397,
      discountedPrice: 197,
      savings: 200,
      category: 'bonus',
      icon: '🎯',
      features: ['Simulação de entrevista', 'Perguntas + respostas', 'Coaching de postura'],
      urgency: 'Bônus exclusivo do checkout'
    })

    return offers
  }

  const upsellOffers = getUpsellOffers()

  // Cálculos de preço,  const selectedUpsellsData = upsellOffers.filter(offer => selectedUpsells.includes(offer.id))
  const upsellsTotal = selectedUpsellsData.reduce((sum, offer) => sum + offer.discountedPrice, 0)
  const totalSavings = selectedUpsellsData.reduce((sum, offer) => sum + offer.savings, 0)
  const subtotal = price + upsellsTotal
  const total = subtotal

  // Validação em tempo real,  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return value.length < 2 ? 'Nome muito curto' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : ''
      case 'phone':
        return value.length < 10 ? 'Telefone inválido' : ''
      default:
        return ''
    }
  }

  const handleInputChange = (field: keyof CustomerData, value: any) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
    
    if (typeof value === 'string') {
      const error = validateField(field, value)
      setFormErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  useEffect(() => {
    const hasRequiredFields = customerData.name && customerData.email && customerData.phone && customerData.terms
    const hasNoErrors = Object.values(formErrors).every(error => !error)
    setIsFormValid(hasRequiredFields && hasNoErrors)
  }, [customerData, formErrors])

  const handleUpsellToggle = (upsellId: string) => {
    setSelectedUpsells(prev => 
      prev.includes(upsellId)
        ? prev.filter(id => id !== upsellId)
        : [...prev, upsellId]
    )
  }

  const handleFormSubmit = async () => {
    if (!isFormValid) return
    
    setIsProcessing(true)
    
    try {
      // Usar API real do MercadoPago,      const response = await fetch('/api/payments/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            cpf: customerData.cpf
          },
          items: [{
            id: productId,
            title: productName,
            description: description || `${productName} - Checkout Ultra`,
            unit_price: total,
            quantity: 1
          }],
          payer: {
            name: customerData.name,
            email: customerData.email,
            phone: { number: customerData.phone }
          },
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          external_reference: `ultra-${productId}-${Date.now()}`,
          metadata: {
            originalPrice: price,
            upsellsTotal,
            totalSavings,
            packageName: productName,
            checkoutVersion: 'ultra-checkout-v1',
            selectedUpsells: selectedUpsells.map(u => u.id)
          }
        })
      })

      const data = await response.json()
      
      if (data.success && data.init_point) {
        // Limpar dados salvos após sucesso,        localStorage.removeItem(`checkout_${productId}`)
        window.location.href = data.init_point
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header com progress moderno */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/vaga-express" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Link>
            
            {/* Auto-save indicator */}
            <div className="flex items-center gap-2">
              {autoSaveStatus === 'saving' && (
                <div className="flex items-center text-blue-600 text-sm">
                  <Save className="h-4 w-4 mr-1 animate-pulse" />
                  Salvando...
                </div>
              )}
              {autoSaveStatus === 'saved' && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Salvo
                </div>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              Checkout Seguro
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Product Overview */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className={`inline-block bg-gradient-to-r ${productData.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold mb-3`}>
                    {productData.badge}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{productName}</h1>
                  <p className="text-gray-600 mb-4">{description}</p>
                  
                  {/* Trust indicators */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-green-500" />
                      {productData.customers} clientes
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {productData.trustScore}% aprovação
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-blue-500" />
                      {productData.guarantee}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    R$ {price.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {productData.highlight}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ou 12x de R$ {(price / 12).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Incluído no seu plano
                  </h3>
                  <ul className="space-y-3">
                    {features.slice(0, Math.ceil(features.length / 2)).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                    Recursos especiais
                  </h3>
                  <ul className="space-y-3">
                    {productData.specialFeatures?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <Star className="h-4 w-4 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Upsells modernas */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🚀 Turbine seus Resultados
                </h2>
                <p className="text-gray-600">
                  Ofertas exclusivas para maximizar suas chances de sucesso
                </p>
                <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mt-4">
                  ⏰ Disponível apenas durante o checkout
                </div>
              </div>

              <div className="grid gap-6">
                {upsellOffers.map((offer) => {
                  const isSelected = selectedUpsells.includes(offer.id)
                  
                  return (
                    <div
                      key={offer.id}
                      className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-lg transform scale-[1.02]'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      } ${offer.recommended ? 'ring-2 ring-orange-300' : ''}`}
                      onClick={() => handleUpsellToggle(offer.id)}
                    >
                      {offer.recommended && (
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          RECOMENDADO
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-green-500 bg-green-500 scale-110' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </div>
                            <div className="text-2xl">{offer.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900">{offer.name}</h3>
                          </div>
                          
                          <p className="text-gray-600 mb-4 ml-11">{offer.description}</p>
                          
                          {offer.urgency && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 ml-11">
                              <div className="flex items-center text-red-700 text-sm font-medium">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {offer.urgency}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                            {offer.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-sm text-gray-500 line-through mb-1">
                            R$ {offer.originalPrice}
                          </div>
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            R$ {offer.discountedPrice}
                          </div>
                          <div className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                            Economize R$ {offer.savings}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Formulário de dados */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Seus Dados
                </h2>
                <p className="text-gray-600">
                  Preencha para ativar seu monitoramento
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {formErrors.name && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {formErrors.phone && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      País de destino
                    </label>
                    <select
                      value={customerData.targetCountry}
                      onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o país</option>
                      <option value="USA">🇺🇸 Estados Unidos</option>
                      <option value="CAN">🇨🇦 Canadá</option>
                      <option value="AUS">🇦🇺 Austrália</option>
                      <option value="POR">🇵🇹 Portugal</option>
                      <option value="ESP">🇪🇸 Espanha</option>
                      <option value="UK">🇬🇧 Reino Unido</option>
                      <option value="GER">🇩🇪 Alemanha</option>
                      <option value="OTHER">🌎 Outro país</option>
                    </select>
                  </div>
                </div>

                {/* Checkbox moderno */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={customerData.terms}
                      onChange={(e) => handleInputChange('terms', e.target.checked)}
                      className="mt-1 mr-4 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      Eu concordo com os{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                        Termos de Serviço
                      </Link>{' '}
                      e{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                        Política de Privacidade
                      </Link>
                      . Entendo que o Vaga Express monitora consulados e me notifica sobre vagas.
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={customerData.newsletter}
                      onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                      className="mt-1 mr-4 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700">
                      Quero receber dicas sobre vistos e novidades por email
                    </label>
                  </div>
                </div>

                {/* Botão de finalizar */}
                <Button 
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                    isFormValid 
                      ? `bg-gradient-to-r ${productData.badgeColor} hover:shadow-lg transform hover:scale-[1.02]`
                      : 'bg-gray-300 cursor-not-allowed'
                  } text-white`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Finalizar Compra - R$ {total.toLocaleString('pt-BR')}
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar - Resumo Fixo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Resumo do Pedido
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{productName}</div>
                    <div className="text-sm text-gray-600">{productData.guarantee}</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    R$ {price.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                {selectedUpsellsData.map((offer) => (
                  <div key={offer.id} className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div className="flex-1">
                      <div className="font-medium text-green-700 flex items-center">
                        <span className="mr-2">{offer.icon}</span>
                        {offer.name}
                      </div>
                      <div className="text-sm text-gray-600">Extra selecionado</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      R$ {offer.discountedPrice.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
                
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="text-green-800 font-medium flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Economia total
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      -R$ {totalSavings.toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2 text-center">
                  💳 Em até 12x de R$ {(total / 12).toFixed(2).replace('.', ',')} sem juros
                </div>
              </div>
              
              {/* Trust signals */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-3" />
                  Pagamento 100% seguro
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 text-green-500 mr-3" />
                  Dados protegidos por SSL
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-green-500 mr-3" />
                  Ativação em até 30 minutos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-3" />
                  Taxa de sucesso de {productData.trustScore}%
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm text-blue-800">
                  <strong>💳 Formas de pagamento:</strong><br />
                  PIX (instantâneo), Cartão de Crédito, Cartão de Débito, Boleto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}