'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Crown, 
  Zap, 
  Target, 
  Shield, 
  CheckCircle, 
  CreditCard, 
  Lock,
  ArrowLeft,
  Star,
  Users
} from 'lucide-react'

interface UpsellProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  benefits: string[]
  icon: any
  urgency: string
  validUntil?: Date
}

export default function UpsellCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<UpsellProduct | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const offerId = searchParams.get('offer')
  const price = searchParams.get('price')

  const products: Record<string, UpsellProduct> = {
    'vip-upgrade': {
      id: 'vip-upgrade',
      name: 'Upgrade VIP',
      description: 'Serviço premium com garantia de aprovação e acompanhamento dedicado',
      price: 3497,
      originalPrice: 4997,
      urgency: 'high',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: Crown,
      benefits: [
        '✅ Preparação completa de documentos',
        '✅ Submissão e acompanhamento personalizado',
        '✅ Garantia de retrabalho em caso de negativa',
        '✅ Suporte prioritário 24/7',
        '✅ Especialista dedicado exclusivo',
        '✅ 99% de taxa de aprovação'
      ]
    },
    'priority-processing': {
      id: 'priority-processing',
      name: 'Processamento Prioritário',
      description: 'Acelere seu processo e tenha prioridade em todas as etapas',
      price: 697,
      originalPrice: 997,
      urgency: 'medium',
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      icon: Zap,
      benefits: [
        '⚡ Análise em 24h ao invés de 5 dias',
        '🎯 Fila prioritária em todos os processos',
        '📞 Contato direto com especialista',
        '📋 Revisão expressa de documentos',
        '🚀 50% mais rápido que o processo normal'
      ]
    },
    'consultation-boost': {
      id: 'consultation-boost',
      name: 'Consultoria Estratégica',
      description: 'Sessão especializada para fortalecer seu perfil e aumentar aprovação',
      price: 397,
      originalPrice: 797,
      urgency: 'high',
      validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      icon: Target,
      benefits: [
        '📈 Estratégias para aumentar elegibilidade',
        '📋 Plano personalizado de fortalecimento',
        '🎯 Foco nos pontos mais críticos',
        '📞 1h de consultoria individual',
        '📊 Aumento médio de 24 pontos no score'
      ]
    },
    'interview-prep': {
      id: 'interview-prep',
      name: 'Preparação para Entrevista',
      description: 'Treinamento especializado para garantir sucesso na entrevista consular',
      price: 497,
      originalPrice: 697,
      urgency: 'medium',
      icon: Users,
      benefits: [
        '🎭 Simulação de entrevista real',
        '📝 Roteiro personalizado de respostas',
        '💡 Dicas de postura e comunicação',
        '📊 Análise de pontos fortes/fracos',
        '🎯 40% mais chance de aprovação'
      ]
    }
  }

  useEffect(() => {
    if (offerId && products[offerId]) {
      setProduct(products[offerId])
    }
  }, [offerId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getTimeRemaining = (validUntil?: Date) => {
    if (!validUntil) return null
    
    const now = new Date()
    const diff = validUntil.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} dias restantes`
    if (hours > 0) return `${hours} horas restantes`
    return 'Expira em breve'
  }

  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirecionar para página de sucesso
      router.push(`/success?upsell=${offerId}&source=upsell`)
    } catch (error) {
      console.error('Erro no pagamento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Produto não encontrado</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const Icon = product.icon
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const timeRemaining = getTimeRemaining(product.validUntil)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Checkout Seguro</h1>
              <p className="text-sm text-gray-500 flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Pagamento protegido
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-3 rounded-full ${
                product.urgency === 'high' ? 'bg-red-100' :
                product.urgency === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <Icon className={`h-8 w-8 ${
                  product.urgency === 'high' ? 'text-red-600' :
                  product.urgency === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  {product.originalPrice && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                {timeRemaining && (
                  <div className="text-right">
                    <div className="text-sm text-red-600 font-medium">
                      ⏰ {timeRemaining}
                    </div>
                    <div className="text-xs text-gray-500">Oferta limitada</div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✨ O que está incluído:
              </h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Signals */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-700">Garantia</div>
                  <div className="text-xs text-gray-500">30 dias</div>
                </div>
                <div>
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-700">Avaliação</div>
                  <div className="text-xs text-gray-500">4.9/5 ⭐</div>
                </div>
                <div>
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-700">Aprovados</div>
                  <div className="text-xs text-gray-500">+10k clientes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              💳 Informações de Pagamento
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Resumo do Pedido</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Desconto aplicado</span>
                    <span className="text-green-600">-{formatCurrency(product.originalPrice - product.price)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(product.price)}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Finalizar Compra - {formatCurrency(product.price)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Seus dados estão seguros. Processamento via SSL 256-bit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}