'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Shield, Check, X, Clock, Star, Users, User, Baby, Tag, Gift, Percent, Lock, Zap } from 'lucide-react'

interface ModernCheckoutProps {
  productId: string
  productName: string
  price: number
  description?: string
  features?: string[]
  className?: string
  variant?: 'default' | 'premium' | 'vip'
  popular?: boolean
  disabled?: boolean
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
}

export default function ModernCheckout({
  productId,
  productName,
  price,
  description,
  features = [],
  className = '',
  variant = 'default',
  popular = false,
  disabled = false,
  onSuccess
}: ModernCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<'package' | 'upsell' | 'checkout'>('package')
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'BR',
    nationality: 'brasileiro',
    targetCountry: ''
  })
  
  // Upsells inteligentes baseados no pacote selecionado,  const getUpsellOffers = (): UpsellOffer[] => {
    const baseOffers: UpsellOffer[] = []
    
    if (productId.includes('relatorio') || variant === 'premium') {
      baseOffers.push({
        id: 'document-review',
        name: '📋 Revisão de Documentos',
        description: 'Revisão profissional de todos os seus documentos antes do envio',
        originalPrice: 197,
        discountedPrice: 97,
        features: [
          '✅ Revisão de formulários',
          '✅ Verificação de documentos',
          '✅ Correção de erros',
          '✅ Otimização para aprovação'
        ],
        urgency: 'Oferta válida apenas hoje!'
      })
    }
    
    if (!productId.includes('vip')) {
      baseOffers.push({
        id: 'fast-track',
        name: '⚡ Processamento Prioritário',
        description: 'Tenha seu caso processado em 24h ao invés de 3-5 dias',
        originalPrice: 297,
        discountedPrice: 147,
        features: [
          '⚡ Resultado em 24h',
          '🎯 Prioridade máxima',
          '📱 Notificações SMS',
          '🏃‍♂️ Fila preferencial'
        ],
        urgency: 'Últimas 3 vagas disponíveis!'
      })
    }
    
    baseOffers.push({
      id: 'consultation-upgrade',
      name: '👨‍💼 Consultoria Express',
      description: 'Adicione 30min de consultoria individual com especialista',
      originalPrice: 397,
      discountedPrice: 197,
      features: [
        '👨‍💼 30min com especialista',
        '🎯 Análise personalizada',
        '📋 Estratégia customizada',
        '📞 Suporte direto'
      ]
    })
    
    return baseOffers
  }

  const upsellOffers = getUpsellOffers()
  
  // Cálculo de preços,  const selectedUpsellsData = upsellOffers.filter(offer => selectedUpsells.includes(offer.id))
  const upsellsTotal = selectedUpsellsData.reduce((sum, offer) => sum + offer.discountedPrice, 0)
  const subtotal = price + upsellsTotal
  const discount = selectedUpsellsData.reduce((sum, offer) => sum + (offer.originalPrice - offer.discountedPrice), 0)
  const total = subtotal
  
  // Estilos do card baseado na variante,  const getCardStyles = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    
    switch (variant) {
      case 'premium':
        return `relative border-2 border-blue-500 shadow-xl ${popular ? 'ring-4 ring-blue-200' : ''}`
      case 'vip':
        return 'relative border-2 border-purple-500 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50'
      default:
        return 'border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
    }
  }

  const handlePurchase = async () => {
    if (disabled) return
    
    if (price === 0) {
      // Para produtos gratuitos, ir direto para o formulário
      window.open('/consultoria-ia', '_blank')
      return
    }
    
    setShowModal(true)
    setStep('upsell')
  }

  const proceedToCheckout = async () => {
    setIsProcessing(true)
    setStep('checkout')
    
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
            discount,
            packageName: productName
          }
        })
      })

      const { paymentUrl } = await response.json()
      
      if (paymentUrl) {
        window.open(paymentUrl, '_blank')
        setShowModal(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Card do Pacote */}
      <div className={`bg-white rounded-2xl p-6 ${getCardStyles()} ${className}`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="h-4 w-4" />
              Mais Popular
            </div>
          </div>
        )}
        
        {variant === 'vip' && (
          <div className="absolute -top-3 right-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold">
              👑 VIP
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{productName}</h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-600">
              {price === 0 ? 'GRÁTIS' : `R$ ${price.toLocaleString('pt-BR')}`}
            </span>
            {variant === 'premium' && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Economia de R$ 100+
              </div>
            )}
          </div>
          {description && <p className="text-gray-600 text-sm">{description}</p>}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <span className="text-xs text-gray-600">Seguro</span>
            </div>
            <div>
              <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs text-gray-600">Rápido</span>
            </div>
            <div>
              <Check className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <span className="text-xs text-gray-600">Garantido</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handlePurchase}
          disabled={disabled || isProcessing}
          className={`w-full py-3 text-lg font-semibold ${
            variant === 'vip' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : variant === 'premium'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
          } text-white`}
        >
          {isProcessing ? (
            'Processando...'
          ) : price === 0 ? (
            <>
              Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              {variant === 'vip' ? 'Contratar VIP' : 'Escolher Pacote'} <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Payment Methods */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <CreditCard className="h-4 w-4" />
            <span>PIX, Cartão, Boleto</span>
          </div>
        </div>
      </div>

      {/* Modal de Checkout Moderno */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Finalize sua compra</h2>
                  <p className="text-blue-100">Acelere seu processo de visto hoje mesmo</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                <div className={`flex items-center gap-2 ${step === 'package' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 'package' ? 'bg-white text-blue-600' : 'bg-blue-500'
                  }`}>1</div>
                  <span className="hidden sm:inline">Pacote</span>
                </div>
                <div className="w-8 h-px bg-blue-300"></div>
                <div className={`flex items-center gap-2 ${step === 'upsell' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 'upsell' ? 'bg-white text-blue-600' : 'bg-blue-500'
                  }`}>2</div>
                  <span className="hidden sm:inline">Extras</span>
                </div>
                <div className="w-8 h-px bg-blue-300"></div>
                <div className={`flex items-center gap-2 ${step === 'checkout' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 'checkout' ? 'bg-white text-blue-600' : 'bg-blue-500'
                  }`}>3</div>
                  <span className="hidden sm:inline">Pagamento</span>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              
              {/* Step 2: Upsells */}
              {step === 'upsell' && (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🚀 Acelere ainda mais seu processo!
                    </h3>
                    <p className="text-gray-600">
                      Ofertas especiais disponíveis apenas agora
                    </p>
                  </div>

                  <div className="grid gap-6 mb-8">
                    {upsellOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          selectedUpsells.includes(offer.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedUpsells(prev => 
                            prev.includes(offer.id)
                              ? prev.filter(id => id !== offer.id)
                              : [...prev, offer.id]
                          )
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedUpsells.includes(offer.id)
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedUpsells.includes(offer.id) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">{offer.name}</h4>
                              {offer.urgency && (
                                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                  {offer.urgency}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{offer.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {offer.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-sm text-gray-700">
                                  <Check className="h-3 w-3 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-green-600">
                              R$ {offer.discountedPrice}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              R$ {offer.originalPrice}
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Economia de R$ {offer.originalPrice - offer.discountedPrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Resumo do Pedido</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{productName}</span>
                        <span>R$ {price}</span>
                      </div>
                      {selectedUpsellsData.map((offer) => (
                        <div key={offer.id} className="flex justify-between text-green-600">
                          <span>{offer.name}</span>
                          <span>R$ {offer.discountedPrice}</span>
                        </div>
                      ))}
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Desconto total</span>
                          <span>-R$ {discount}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>R$ {total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setStep('checkout')}
                      variant="outline"
                      className="flex-1"
                    >
                      Pular Extras
                    </Button>
                    <Button
                      onClick={() => setStep('checkout')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Continuar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Checkout Form */}
              {step === 'checkout' && (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Dados para finalizar
                    </h3>
                    <p className="text-gray-600">
                      Preencha os dados para processar seu pagamento
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    {/* Formulário */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          value={customerData.name}
                          onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerData.email}
                          onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          País de destino
                        </label>
                        <select
                          value={customerData.targetCountry}
                          onChange={(e) => setCustomerData({...customerData, targetCountry: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Resumo Final */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Resumo Final</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{productName}</span>
                          <span>R$ {price}</span>
                        </div>
                        {selectedUpsellsData.map((offer) => (
                          <div key={offer.id} className="flex justify-between text-green-600">
                            <span>{offer.name}</span>
                            <span>R$ {offer.discountedPrice}</span>
                          </div>
                        ))}
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600 font-medium">
                            <span>💰 Desconto total</span>
                            <span>-R$ {discount}</span>
                          </div>
                        )}
                        <div className="border-t pt-3 flex justify-between font-bold text-xl text-blue-600">
                          <span>Total</span>
                          <span>R$ {total}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Pagamento 100% seguro</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Lock className="h-4 w-4 text-green-500" />
                          <span>Dados protegidos por SSL</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span>Resultado em 24-48h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button
                      onClick={() => setStep('upsell')}
                      variant="outline"
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={proceedToCheckout}
                      disabled={!customerData.name || !customerData.email || isProcessing}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}