'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CreditCard, Shield, Check, Star, Zap, CheckCircle, Gift, Users, Lock, Phone, Mail, User, MapPin, Plus, Minus, Baby, Globe, FileText } from 'lucide-react'
import Link from 'next/link'
import ServiceContract from './ServiceContract'
import InlineCheckout from './InlineCheckout'
import CheckoutTest from './CheckoutTest'
// import Header from '@/components/Header'
// import Footer from '@/components/Footer'

interface Product {
  id: string
  name: string
  description: string
  originalPrice: number
  currentPrice: number
  features: string[]
  variant: 'free' | 'premium' | 'consultation' | 'default' | 'vip'
  category: string
  popular?: boolean
  childPrice?: number
  childDiscount?: number
  disabled?: boolean
}

interface CheckoutModernoProps {
  // Nova interface
  title?: string
  subtitle?: string
  ctaText?: string
  supportsQuantity?: boolean
  showGroupDiscount?: boolean
  products?: Product[]
  
  // Interface legacy (para backward compatibility)
  productId?: string
  productName?: string
  price?: number
  originalPrice?: number
  adults?: number
  children?: number
  description?: string
  features?: string[]
  variant?: 'default' | 'premium' | 'vip'
}

interface CustomerData {
  name: string
  email: string
  phone: string
  phoneCountry: string
  cpf: string
  targetCountry: string
  terms: boolean
  newsletter: boolean
  contractAccepted: boolean
}

const PHONE_COUNTRIES = [
  { code: '+55', flag: '🇧🇷', name: 'Brasil', format: '(11) 99999-9999' },
  { code: '+1', flag: '🇺🇸', name: 'Estados Unidos', format: '(555) 123-4567' },
  { code: '+1', flag: '🇨🇦', name: 'Canadá', format: '(555) 123-4567' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', format: '912 345 678' },
  { code: '+34', flag: '🇪🇸', name: 'Espanha', format: '612 34 56 78' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido', format: '7123 456789' },
  { code: '+49', flag: '🇩🇪', name: 'Alemanha', format: '1512 3456789' },
  { code: '+33', flag: '🇫🇷', name: 'França', format: '6 12 34 56 78' },
  { code: '+39', flag: '🇮🇹', name: 'Itália', format: '312 345 6789' },
  { code: '+61', flag: '🇦🇺', name: 'Austrália', format: '412 345 678' },
  { code: '+64', flag: '🇳🇿', name: 'Nova Zelândia', format: '21 123 4567' },
  { code: '+31', flag: '🇳🇱', name: 'Holanda', format: '6 12345678' },
  { code: '+41', flag: '🇨🇭', name: 'Suíça', format: '78 123 45 67' },
  { code: '+353', flag: '🇮🇪', name: 'Irlanda', format: '85 123 4567' },
  { code: '+47', flag: '🇳🇴', name: 'Noruega', format: '412 34 567' },
  { code: '+46', flag: '🇸🇪', name: 'Suécia', format: '70 123 45 67' },
  { code: '+45', flag: '🇩🇰', name: 'Dinamarca', format: '12 34 56 78' },
  { code: '+358', flag: '🇫🇮', name: 'Finlândia', format: '50 123 4567' },
  { code: '+43', flag: '🇦🇹', name: 'Áustria', format: '664 123456' },
  { code: '+32', flag: '🇧🇪', name: 'Bélgica', format: '4XX XX XX XX' },
  { code: '+52', flag: '🇲🇽', name: 'México', format: '55 1234 5678' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', format: '11 1234-5678' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', format: '9 1234 5678' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguai', format: '99 123 456' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguai', format: '99X XXX XXX' },
  { code: '+57', flag: '🇨🇴', name: 'Colômbia', format: '321 123 4567' },
  { code: '+51', flag: '🇵🇪', name: 'Peru', format: '999 123 456' },
  { code: '+593', flag: '🇪🇨', name: 'Equador', format: '99 123 4567' },
  { code: '+81', flag: '🇯🇵', name: 'Japão', format: '90-1234-5678' },
  { code: '+82', flag: '🇰🇷', name: 'Coreia do Sul', format: '010-1234-5678' },
  { code: '+86', flag: '🇨🇳', name: 'China', format: '138 0013 8000' },
  { code: '+65', flag: '🇸🇬', name: 'Singapura', format: '8123 4567' },
  { code: '+91', flag: '🇮🇳', name: 'Índia', format: '98765 43210' },
  { code: '+971', flag: '🇦🇪', name: 'Emirados Árabes', format: '50 123 4567' },
  { code: '+972', flag: '🇮🇱', name: 'Israel', format: '50-123-4567' },
  { code: '+27', flag: '🇿🇦', name: 'África do Sul', format: '82 123 4567' }
]

const PRODUCT_DATA: Record<string, any> = {
  'vaga-express-vip': {
    badge: '👑 VIP',
    badgeColor: 'from-purple-600 to-pink-600',
    highlight: 'Mais Completo',
    trustScore: 98,
    customers: '2.5k+'
  },
  'vaga-express-premium': {
    badge: '🥈 Premium',
    badgeColor: 'from-blue-600 to-purple-600',
    highlight: 'Mais Popular',
    trustScore: 96,
    customers: '5k+'
  },
  'vaga-express-basic': {
    badge: '🥉 Basic',
    badgeColor: 'from-green-600 to-blue-600',
    highlight: 'Melhor Custo',
    trustScore: 94,
    customers: '8k+'
  }
}

export default function CheckoutModerno(props: CheckoutModernoProps) {
  // Detect if using new interface (with products array) or legacy interface
  const isNewInterface = !!(props.products && props.products.length > 0)
  
  // Extract props based on interface type
  const {
    title,
    subtitle, 
    ctaText = "Contratar Agora",
    supportsQuantity = true,
    showGroupDiscount = true,
    products = [],
    // Legacy props
    productId = '',
    productName = '',
    price = 0,
    originalPrice,
    adults = 1,
    children = 0,
    description = '',
    features = [],
    variant = 'default'
  } = props
  
  // Use first product for calculations if new interface, otherwise use legacy props
  const currentProduct = isNewInterface ? products[0] : {
    id: productId,
    name: productName,
    description,
    originalPrice: originalPrice || price * 1.3,
    currentPrice: price,
    features,
    variant: variant as any,
    category: 'legacy',
    popular: false
  }
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAdults, setCurrentAdults] = useState(adults)
  const [currentChildren, setCurrentChildren] = useState(children)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    phoneCountry: '+55',
    cpf: '',
    targetCountry: '',
    terms: false,
    newsletter: true,
    contractAccepted: false
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showContract, setShowContract] = useState(false)
  const [showInlineCheckout, setShowInlineCheckout] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    preferenceId: string
    publicKey: string
  } | null>(null)

  const productData = PRODUCT_DATA[currentProduct.id] || {}
  
  // Debug logs
  console.log('CheckoutModerno Props:', {
    isNewInterface,
    currentProduct,
    supportsQuantity,
    showGroupDiscount
  })

  // Preços base
  const getBaseAdultPrice = () => currentProduct.originalPrice || currentProduct.currentPrice
  const getBaseChildPrice = () => currentProduct.childPrice || (currentProduct.originalPrice || currentProduct.currentPrice)
  
  // Preços finais com desconto
  const getFinalAdultPrice = () => {
    const basePrice = getBaseAdultPrice()
    // 15% desconto APENAS se 4+ adultos
    return currentAdults >= 4 ? Math.round(basePrice * 0.85) : basePrice
  }
  
  const getFinalChildPrice = () => {
    // Crianças SEMPRE têm 30% desconto do preço base
    return Math.round(getBaseChildPrice() * 0.7)
  }
  
  // Cálculo das economias
  const getAdultGroupSavings = () => {
    // Sempre calcular se tem 4+ adultos, independente do supportsQuantity para display
    if (currentAdults < 4) return 0
    const originalTotal = currentAdults * getBaseAdultPrice()
    const discountedTotal = currentAdults * getFinalAdultPrice()
    return originalTotal - discountedTotal
  }
  
  const getChildrenSavings = () => {
    // Sempre calcular se tem crianças, independente do supportsQuantity para display
    if (currentChildren === 0) return 0
    const originalTotal = currentChildren * getBaseChildPrice()
    const discountedTotal = currentChildren * getFinalChildPrice()
    return originalTotal - discountedTotal
  }
  
  // Total final
  const calculateCurrentTotal = () => {
    // Se não suporta quantidade, usar preço base
    if (!supportsQuantity) {
      console.log('Product does not support quantity, using base price:', price)
      return price
    }
    
    const adultTotal = currentAdults * getFinalAdultPrice()
    const childTotal = currentChildren * getFinalChildPrice()
    const total = adultTotal + childTotal
    
    console.log('Calculating total:', {
      currentAdults,
      currentChildren,
      adultPrice: getFinalAdultPrice(),
      childPrice: getFinalChildPrice(),
      adultTotal,
      childTotal,
      total,
      supportsQuantity
    })
    
    return total
  }
  
  const getCurrentSavings = () => {
    return getAdultGroupSavings() + getChildrenSavings()
  }

  const currentTotal = calculateCurrentTotal()
  const currentSavings = getCurrentSavings()

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false // CPFs com números repetidos
    
    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF[9])) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF[10])) return false
    
    return true
  }

  // Validação em tempo real
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return value.length < 2 ? 'Nome muito curto' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : ''
      case 'phone':
        // Validação básica - pelo menos 8 dígitos
        const digitsOnly = value.replace(/\D/g, '')
        return digitsOnly.length < 8 ? 'Telefone muito curto' : ''
      case 'cpf':
        return !validateCPF(value) ? 'CPF inválido' : ''
      default:
        return ''
    }
  }

  // Função para formatar CPF
  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const handleInputChange = (field: keyof CustomerData, value: any) => {
    // Aplicar formatação do CPF
    if (field === 'cpf' && typeof value === 'string') {
      value = formatCPF(value)
    }
    
    setCustomerData(prev => ({ ...prev, [field]: value }))
    
    if (typeof value === 'string') {
      const error = validateField(field, value)
      setFormErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const isFormValid = customerData.name && customerData.email && customerData.phone && customerData.cpf && 
                     customerData.terms && customerData.contractAccepted && 
                     Object.values(formErrors).every(error => !error)

  const handleSubmit = async () => {
    if (!isFormValid) return
    
    setIsProcessing(true)
    
    try {
      // Combinar código do país + número de telefone
      const fullPhone = `${customerData.phoneCountry} ${customerData.phone}`
      
      const orderData = {
        ...customerData,
        fullPhone,
        product: currentProduct.id,
        total: currentTotal,
        adults: adults,
        children: children
      }
      
      console.log('Dados do cliente:', orderData)
      
      // Criar pagamento no MercadoPago
      console.log('Criando pagamento MercadoPago...')
      
      const paymentResponse = await fetch('/api/payments/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone: fullPhone,
            cpf: customerData.cpf
          },
          items: [{
            id: currentProduct.id,
            title: currentProduct.name,
            description: currentProduct.description,
            unit_price: currentTotal,
            quantity: 1
          }],
          payer: {
            name: customerData.name,
            email: customerData.email,
            phone: { number: fullPhone }
          },
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          external_reference: `${currentProduct.id}-${Date.now()}`
        })
      })
      
      const paymentData = await paymentResponse.json()
      
      console.log('🔍 Resposta da API:', paymentData)
      
      if (paymentData.success && paymentData.preference_id) {
        console.log('✅ Preferência criada, iniciando checkout inline:', paymentData.preference_id)
        
        // DEBUG: Testar sem API - forçar checkout inline
        alert('🧪 TESTE: Forçando checkout inline para debug!')
        
        // Configurar dados para checkout inline
        setPaymentData({
          preferenceId: paymentData.preference_id || 'test-preference',
          publicKey: paymentData.public_key || 'TEST-public-key'
        })
        
        // Mostrar checkout inline
        setShowInlineCheckout(true)
        console.log('🔧 DEBUG: showInlineCheckout set to true')
        return
      } else {
        console.error('❌ Erro ao criar pagamento:', paymentData)
        alert(`Erro ao processar pagamento: ${paymentData.error || 'Erro desconhecido'}. Tente novamente.`)
        return
      }
      
      // Se for produto Vaga Express, processar com integração
      if (currentProduct.id.includes('vaga-express')) {
        console.log('Processando pedido Vaga Express:', orderData)

        const vagaExpressData = {
          product: currentProduct.id,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: fullPhone,
          targetCountry: customerData.targetCountry,
          adults: adults,
          children: children,
          total: currentTotal,
          cpf: customerData.cpf,
          paymentMethod: 'pix', // ou selectedPayment se disponível
          createdAt: new Date().toISOString()
        }

        // Processar via API Vaga Express
        const response = await fetch('/api/vaga-express', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_order',
            data: vagaExpressData
          })
        })

        const result = await response.json()
        
        if (result.success) {
          console.log('Pedido Vaga Express processado:', result)
          // Redirecionar com informações específicas do Vaga Express
          window.location.href = `/success?product=${currentProduct.id}&checkout=moderno&orderId=${result.orderId}&type=vaga-express`
        } else {
          console.error('Erro ao processar Vaga Express:', result.error)
          alert('Erro ao ativar monitoramento. Contacte o suporte.')
        }
      } else {
        // Produtos normais - fluxo original
        window.location.href = `/success?product=${currentProduct.id}&checkout=moderno`
      }
      
    } catch (error) {
      console.error('❌ Erro ao processar:', error)
      
      let errorMessage = 'Erro ao processar pedido. Tente novamente.'
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
      } else if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  // Se checkout inline ativo, renderizar apenas ele
  if (showInlineCheckout && paymentData) {
    return (
      <InlineCheckout
        preferenceId={paymentData.preferenceId}
        publicKey={paymentData.publicKey}
        amount={currentTotal}
        customerData={{
          name: customerData.name,
          email: customerData.email,
          phone: `${customerData.phoneCountry}${customerData.phone}`
        }}
        onSuccess={(payment) => {
          console.log('✅ Pagamento realizado com sucesso:', payment)
          // Redirecionar para página de sucesso
          window.location.href = payment.redirect_url || '/payment/success'
        }}
        onError={(error) => {
          console.error('❌ Erro no pagamento:', error)
          alert('Erro no pagamento. Tente novamente.')
          setShowInlineCheckout(false)
        }}
        onBack={() => {
          setShowInlineCheckout(false)
          setPaymentData(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* COMPONENTE DE TESTE - REMOVER DEPOIS */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <CheckoutTest />
      </div>
      
      {/* Header simplificado temporário */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2 text-gray-600" />
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-2xl font-bold text-gray-900">Visa2Any</span>
              </div>
            </Link>
            
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              Checkout Seguro
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Product Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {productData.badge && (
                    <div className={`inline-block bg-gradient-to-r ${productData.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold mb-3`}>
                      {productData.badge}
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{title || currentProduct.name}</h1>
                  <p className="text-gray-600 mb-4">{subtitle || currentProduct.description}</p>
                  
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
                  </div>
                </div>
                
                <div className="text-right">
                  {(currentAdults > 1 || currentChildren > 0 || getAdultGroupSavings() > 0 || getChildrenSavings() > 0) && (
                    <div className="text-sm text-gray-500 line-through mb-1">
                      De: R$ {(currentAdults * getBaseAdultPrice() + currentChildren * getBaseChildPrice()).toLocaleString('pt-BR')}
                    </div>
                  )}
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    R$ {currentTotal.toLocaleString('pt-BR')}
                  </div>
                  {(currentAdults > 1 || currentChildren > 0) && (
                    <div className="text-sm text-gray-600 mb-1">
                      👥 {currentAdults} adulto{currentAdults > 1 ? 's' : ''}{currentChildren > 0 ? ` + ${currentChildren} criança${currentChildren > 1 ? 's' : ''}` : ''}
                    </div>
                  )}
                  {currentSavings > 0 && (
                    <div className="text-sm text-green-600 font-medium mb-1">
                      Economize R$ {currentSavings.toLocaleString('pt-BR')}
                    </div>
                  )}
                  <div className="text-sm text-green-600 font-medium">
                    {productData.highlight}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ou 12x de R$ {(currentTotal / 12).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              {/* Features - Restauradas */}
              {currentProduct.features.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Incluído no seu plano
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Formulário de dados */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Seus Dados
                </h2>
                <p className="text-gray-600">
                  Preencha para ativar seu monitoramento
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
                    <div className="flex gap-2">
                      <select
                        value={customerData.phoneCountry}
                        onChange={(e) => handleInputChange('phoneCountry', e.target.value)}
                        className="w-32 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        {PHONE_COUNTRIES.map((country) => (
                          <option key={`${country.code}-${country.name}`} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        value={customerData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={PHONE_COUNTRIES.find(c => c.code === customerData.phoneCountry)?.format || '(11) 99999-9999'}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      📱 Formato: {PHONE_COUNTRIES.find(c => c.code === customerData.phoneCountry)?.format || '(11) 99999-9999'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.cpf ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    {formErrors.cpf && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.cpf}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      📄 Necessário para assinatura do contrato
                    </p>
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

                {/* Seleção de Quantidade - Melhorada */}
                {supportsQuantity && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Quantas pessoas vão viajar?
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Selecione a quantidade para ver os descontos automáticos aplicados
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Adultos */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-600" />
                          Adultos (18+ anos)
                        </label>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setCurrentAdults(Math.max(1, currentAdults - 1))}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            disabled={currentAdults <= 1}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{currentAdults}</div>
                            <div className="text-sm text-gray-600">
                              {currentAdults >= 4 ? (
                                <>
                                  <div className="line-through text-gray-500">
                                    R$ {getBaseAdultPrice().toLocaleString('pt-BR')} cada
                                  </div>
                                  <div className="text-green-600 font-bold">
                                    R$ {getFinalAdultPrice().toLocaleString('pt-BR')} cada
                                  </div>
                                  <div className="text-xs text-green-600 font-medium">
                                    ✨ 15% OFF grupo!
                                  </div>
                                </>
                              ) : (
                                <div>
                                  R$ {getBaseAdultPrice().toLocaleString('pt-BR')} cada
                                  {currentAdults === 3 && (
                                    <div className="text-xs text-blue-600">
                                      +1 adulto = 15% OFF
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setCurrentAdults(currentAdults + 1)}
                            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4 text-blue-600" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Crianças */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Baby className="h-4 w-4 mr-2 text-green-600" />
                          Crianças (0-17 anos)
                        </label>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setCurrentChildren(Math.max(0, currentChildren - 1))}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            disabled={currentChildren <= 0}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{currentChildren}</div>
                            <div className="text-sm text-gray-600">
                              {currentChildren > 0 ? (
                                <>
                                  <div className="line-through text-gray-500 text-xs">
                                    R$ {getBaseChildPrice().toLocaleString('pt-BR')} cada
                                  </div>
                                  <div className="text-green-600 font-bold">
                                    R$ {getFinalChildPrice().toLocaleString('pt-BR')} cada
                                  </div>
                                  <div className="text-xs text-green-600 font-medium">
                                    👶 30% OFF crianças!
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-500">
                                  R$ {getFinalChildPrice().toLocaleString('pt-BR')} cada
                                  <div className="text-xs text-green-600">
                                    30% desconto automático
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setCurrentChildren(currentChildren + 1)}
                            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Resumo dos Descontos em Tempo Real */}
                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                      {/* Linha de Adultos */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          👨‍💼 {currentAdults} adulto{currentAdults > 1 ? 's' : ''}
                        </span>
                        <div className="text-right">
                          {currentAdults >= 4 ? (
                            <>
                              <div className="text-xs text-gray-500 line-through">
                                R$ {(currentAdults * getBaseAdultPrice()).toLocaleString('pt-BR')}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                R$ {(currentAdults * getFinalAdultPrice()).toLocaleString('pt-BR')}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              R$ {(currentAdults * getFinalAdultPrice()).toLocaleString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Linha de Crianças */}
                      {currentChildren > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            👶 {currentChildren} criança{currentChildren > 1 ? 's' : ''}
                          </span>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 line-through">
                              R$ {(currentChildren * getBaseChildPrice()).toLocaleString('pt-BR')}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              R$ {(currentChildren * getFinalChildPrice()).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Linha de Descontos Aplicados */}
                      {(getAdultGroupSavings() > 0 || getChildrenSavings() > 0) && (
                        <div className="border-t pt-2 mt-2">
                          {getAdultGroupSavings() > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-green-600">
                                ✨ Desconto grupo (4+ adultos)
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                -R$ {getAdultGroupSavings().toLocaleString('pt-BR')}
                              </span>
                            </div>
                          )}
                          
                          {getChildrenSavings() > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-green-600">
                                👶 Desconto crianças (-30%)
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                -R$ {getChildrenSavings().toLocaleString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Total Final */}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total Final:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            R$ {currentTotal.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        {getCurrentSavings() > 0 && (
                          <div className="text-right text-sm text-green-600 font-medium mt-1">
                            💰 Você economiza R$ {getCurrentSavings().toLocaleString('pt-BR')}!
                          </div>
                        )}
                        {currentAdults === 3 && (
                          <div className="text-right text-xs text-blue-600 mt-1">
                            💡 Adicione +1 adulto e ganhe 15% OFF!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkbox moderno */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
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
                  
                  {/* Contrato de Prestação */}
                  <div className="border-t pt-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="contract"
                        required
                        checked={customerData.contractAccepted}
                        onChange={(e) => handleInputChange('contractAccepted', e.target.checked)}
                        className="mt-1 mr-4 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <label htmlFor="contract" className="text-sm text-gray-700 font-medium">
                          Li e aceito o{' '}
                          <button
                            type="button"
                            onClick={() => {
                              if (!customerData.cpf) {
                                alert('Por favor, preencha o CPF antes de visualizar o contrato.')
                                return
                              }
                              setShowContract(true)
                            }}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Contrato de Prestação de Serviços
                          </button>
                          {' '}*
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          📄 Assinatura eletrônica com CPF: {customerData.cpf || 'Preencha o CPF acima'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de finalizar */}
                <button 
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
                      {ctaText} - R$ {currentTotal.toLocaleString('pt-BR')}
                    </div>
                  )}
                </button>
                
                {/* BOTÃO DE DEBUG - REMOVER DEPOIS */}
                <button
                  type="button"
                  onClick={() => {
                    console.log('🧪 Forçando checkout inline para teste')
                    setPaymentData({
                      preferenceId: 'test-preference-123',
                      publicKey: 'TEST-key'
                    })
                    setShowInlineCheckout(true)
                  }}
                  className="w-full mt-4 py-3 px-6 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  🧪 TESTE: Forçar Checkout Inline
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Resumo do Pedido
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{currentProduct.name}</div>
                    <div className="text-sm text-gray-600">
                      {(currentAdults > 1 || currentChildren > 0) ? (
                        <span>👥 {currentAdults} adulto{currentAdults > 1 ? 's' : ''}{currentChildren > 0 ? ` + ${currentChildren} criança${currentChildren > 1 ? 's' : ''}` : ''}</span>
                      ) : (
                        'Monitoramento individual'
                      )}
                    </div>
                    {currentSavings > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Descontos aplicados: R$ {currentSavings.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {currentSavings > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        R$ {(currentAdults * getBaseAdultPrice() + currentChildren * getBaseChildPrice()).toLocaleString('pt-BR')}
                      </div>
                    )}
                    <div className="text-lg font-bold text-gray-900">
                      R$ {currentTotal.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {currentTotal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2 text-center">
                  💳 Em até 12x de R$ {(currentTotal / 12).toFixed(2).replace('.', ',')} sem juros
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
      
      {/* Modal do Contrato */}
      {showContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <ServiceContract
              serviceType={currentProduct.variant === 'premium' ? 'relatorio-premium' : 
                          currentProduct.variant === 'consultation' ? 'consultoria-express' : 'assessoria-vip'}
              clientName={customerData.name}
              clientEmail={customerData.email}
              clientCPF={customerData.cpf}
              price={currentTotal}
              onAccept={() => {
                setCustomerData(prev => ({ ...prev, contractAccepted: true }))
                setShowContract(false)
              }}
              onDecline={() => {
                setShowContract(false)
              }}
            />
          </div>
        </div>
      )}
      
    </div>
  )
}