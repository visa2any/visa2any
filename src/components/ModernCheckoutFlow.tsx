'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CreditCard, Shield, Check, Clock, Star, Users, Lock, Zap, AlertCircle, Gift, Percent, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

interface ModernCheckoutFlowProps {
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
}

// Dados dos produtos para melhor UX
const PRODUCT_DATA: Record<string, any> = {
  'vaga-express-vip': {
    badge: '👑 VIP',
    highlight: 'Mais Completo',
    guarantee: '90 dias de monitoramento',
    specialFeatures: ['Consultoria dedicada inclusa', 'Notificação em 2 minutos', 'Suporte 24/7']
  },
  'vaga-express-premium': {
    badge: '🥈 Premium',
    highlight: 'Mais Popular',
    guarantee: '60 dias de monitoramento',
    specialFeatures: ['Garantia de reembolso', 'Notificação em 5 minutos', 'Suporte prioritário']
  },
  'vaga-express-basic': {
    badge: '🥉 Basic',
    highlight: 'Melhor Custo',
    guarantee: '30 dias de monitoramento',
    specialFeatures: ['Notificação em 15 minutos', 'WhatsApp + Email', 'Suporte padrão']
  }
}

export default function ModernCheckoutFlow({
  productId,
  productName,
  price,
  description,
  features = [],
  variant = 'default',
  onSuccess
}: ModernCheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    country: 'BR',
    nationality: 'brasileiro',
    targetCountry: '',
    cpf: '',
    terms: false,
    newsletter: true
  })

  // Upsells inteligentes baseados no produto
  const getUpsellOffers = (): UpsellOffer[] => {
    const offers: UpsellOffer[] = []

    if (productId.includes('vip')) {
      offers.push({
        id: 'segunda-sessao-vip',
        name: '🔄 Segunda Sessão VIP',
        description: 'Sessão de acompanhamento exclusiva em 30 dias',
        originalPrice: 597,
        discountedPrice: 297,
        savings: 300,
        features: ['Follow-up personalizado', 'Revisão de estratégia', 'Suporte prioritário'],
        urgency: '50% OFF exclusivo para clientes VIP',
        recommended: true
      })
    } else if (productId.includes('premium')) {
      offers.push({
        id: 'upgrade-vip',
        name: '👑 Upgrade para VIP',
        description: 'Desbloqueie todos os recursos VIP agora',
        originalPrice: 300,
        discountedPrice: 200,
        savings: 100,
        features: ['Consultoria dedicada', 'Notificação em 2min', 'Suporte 24/7'],
        urgency: 'Upgrade por apenas R$ 200 adicional',
        recommended: true
      })
    }

    offers.push({
      id: 'preparacao-entrevista',
      name: '🎯 Preparação para Entrevista',
      description: 'Simulação completa + coaching personalizado',
      originalPrice: 397,
      discountedPrice: 197,
      savings: 200,
      features: ['Simulação realista', 'Feedback detalhado', 'Dicas dos especialistas'],
      urgency: 'R$ 200 de desconto exclusivo'
    })

    return offers
  }

  const upsellOffers = getUpsellOffers()
  const productData = PRODUCT_DATA[productId] || {}

  // Cálculos de preço

  const selectedUpsellsData = upsellOffers.filter(offer => selectedUpsells.includes(offer.id))
  const upsellsTotal = selectedUpsellsData.reduce((sum, offer) => sum + offer.discountedPrice, 0)
  const totalSavings = selectedUpsellsData.reduce((sum, offer) => sum + offer.savings, 0)
  const subtotal = price + upsellsTotal
  const total = subtotal

  const handleUpsellToggle = (upsellId: string) => {
    setSelectedUpsells(prev => 
      prev.includes(upsellId)
        ? prev.filter(id => id !== upsellId)
        : [...prev, upsellId]
    )
  }

  const handleFormSubmit = async () => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerData,
          upsells: selectedUpsells,
          totalAmount: total,
          metadata: {
            originalPrice: price,
            upsellsTotal,
            totalSavings,
            packageName: productName,
            checkoutVersion: 'modern-flow-v2'
          }
        })
      })

      const data = await response.json()
      
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl
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

  const validateStep = (step: number): boolean => {
    if (step === 3) {
      return customerData.name && customerData.email && customerData.phone && customerData.terms
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com progresso */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/vaga-express" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para Vaga Express
            </Link>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          
          {/* Conteúdo Principal */}
          <div className="md:col-span-2 lg:col-span-2">
            
            {/* Step 1: Confirmação do Produto */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Confirme seu Plano
                  </h1>
                  <p className="text-gray-600">
                    Você escolheu o melhor plano para acelerar sua entrevista consular
                  </p>
                </div>

                {/* Product Showcase */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {productData.badge && (
                        <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                          {productData.badge}
                        </div>
                      )}
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{productName}</h2>
                      <p className="text-gray-600 mb-4">{description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        R$ {price.toLocaleString('pt-BR')}
                      </div>
                      {productData.highlight && (
                        <div className="text-sm text-green-600 font-medium">
                          {productData.highlight}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Incluído no plano:</h3>
                      <ul className="space-y-1">
                        {features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Destaques especiais:</h3>
                      <ul className="space-y-1">
                        {productData.specialFeatures?.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-800">100% Seguro</div>
                    <div className="text-xs text-green-600">SSL Certificado</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-800">Ativação Imediata</div>
                    <div className="text-xs text-blue-600">Em até 30 minutos</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-800">{productData.guarantee}</div>
                    <div className="text-xs text-purple-600">Monitoramento garantido</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setCurrentStep(2)} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                >
                  Continuar para Extras <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Upsells */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🚀 Potencialize seus Resultados
                  </h1>
                  <p className="text-gray-600">
                    Ofertas exclusivas para maximizar suas chances de sucesso
                  </p>
                  <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mt-4">
                    ⏰ Ofertas válidas apenas durante o checkout
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  {upsellOffers.map((offer) => {
                    const isSelected = selectedUpsells.includes(offer.id)
                    
                    return (
                      <div
                        key={offer.id}
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        } ${offer.recommended ? 'ring-2 ring-orange-300' : ''}`}
                        onClick={() => handleUpsellToggle(offer.id)}
                      >
                        {offer.recommended && (
                          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                            RECOMENDADO
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected 
                                  ? 'border-green-500 bg-green-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="h-4 w-4 text-white" />}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">{offer.name}</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-4 ml-9">{offer.description}</p>
                            
                            {offer.urgency && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 ml-9">
                                <div className="flex items-center text-red-700 text-sm font-medium">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  {offer.urgency}
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-9">
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
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              R$ {offer.discountedPrice}
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              Economize R$ {offer.savings}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setCurrentStep(1)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)} 
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Finalizar Pedido <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Dados do Cliente */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Seus Dados
                  </h1>
                  <p className="text-gray-600">
                    Preencha os dados para ativar seu monitoramento
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País de destino
                      </label>
                      <select
                        value={customerData.targetCountry}
                        onChange={(e) => setCustomerData({...customerData, targetCountry: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          checked={customerData.terms}
                          onChange={(e) => setCustomerData({...customerData, terms: e.target.checked})}
                          className="mt-1 mr-3"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          Eu concordo com os{' '}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Termos de Serviço
                          </Link>{' '}
                          e{' '}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Política de Privacidade
                          </Link>
                          . Entendo que o Vaga Express monitora consulados e me notifica sobre vagas, mas não garante agendamento.
                        </label>
                      </div>
                      
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="newsletter"
                          checked={customerData.newsletter}
                          onChange={(e) => setCustomerData({...customerData, newsletter: e.target.checked})}
                          className="mt-1 mr-3"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-700">
                          Quero receber dicas sobre vistos e novidades da Visa2Any por email
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(2)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!validateStep(3) || isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      {isProcessing ? (
                        'Processando...'
                      ) : (
                        <>
                          Finalizar Compra <CreditCard className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar - Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{productName}</div>
                    <div className="text-sm text-gray-600">{productData.guarantee}</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    R$ {price.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                {selectedUpsellsData.map((offer) => (
                  <div key={offer.id} className="flex justify-between items-start border-t pt-4">
                    <div className="flex-1">
                      <div className="font-medium text-green-700">{offer.name}</div>
                      <div className="text-sm text-gray-600">Extra selecionado</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      R$ {offer.discountedPrice.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
                
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-green-800 font-medium">
                      <Gift className="inline h-4 w-4 mr-1" />
                      Economia total
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      -R$ {totalSavings.toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Em até 12x de R$ {(total / 12).toFixed(2).replace('.', ',')} no cartão
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Pagamento 100% seguro
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 text-green-500 mr-2" />
                  Dados protegidos por SSL
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-green-500 mr-2" />
                  Ativação em até 30 minutos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {productData.guarantee}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <strong>💳 Formas de pagamento:</strong><br />
                  PIX, Cartão de Crédito, Cartão de Débito, Boleto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}