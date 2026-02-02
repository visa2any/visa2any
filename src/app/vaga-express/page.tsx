'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Star, Zap, Clock, Shield, Users, Globe, AlertTriangle, Target, Calendar, Bell, Plus, Minus, User, Baby } from 'lucide-react'
import AffiliateBanner from '@/components/AffiliateBanner'

// Configuração dos planos Vaga Express
const VAGA_EXPRESS_PLANS = {
  'vaga-express-basic': {
    name: '🥉 Vaga Express Basic',
    price: 297,
    description: 'Perfeito para quem quer acompanhar 1 consulado',
    duration: '30 dias',
    features: [
      '✅ Monitoramento por 30 dias',
      '📱 Notificações WhatsApp + Email',
      '🎯 1 país/consulado',
      '⏰ Vagas até 30 dias de antecedência',
      '🔔 Prioridade média (15min)',
      '📊 Relatório semanal'
    ],
    color: 'blue',
    popular: false,
    icon: '🥉'
  },
  'vaga-express-premium': {
    name: '🥈 Vaga Express Premium',
    price: 497,
    description: 'O mais popular! Inclui garantia de reembolso',
    duration: '60 dias',
    features: [
      '✅ Monitoramento por 60 dias',
      '📱 Notificações multi-canal prioritárias',
      '🌍 Até 2 países/consulados',
      '⏰ Vagas até 60 dias de antecedência',
      '💰 Garantia de reembolso',
      '🔔 Prioridade alta (5min)',
      '📊 Relatório semanal detalhado',
      '🎯 Suporte prioritário'
    ],
    color: 'orange',
    popular: true,
    icon: '🥈'
  },
  'vaga-express-vip': {
    name: '🥇 Vaga Express VIP',
    price: 797,
    description: 'Serviço completo com consultoria dedicada',
    duration: '90 dias',
    features: [
      '✅ Monitoramento por 90 dias',
      '🚨 Notificação imediata (2 minutos)',
      '🌎 Países ilimitados',
      '👑 Prioridade máxima',
      '👨‍💼 Consultoria dedicada inclusa',
      '🎯 Suporte 24/7 dedicado',
      '📞 Ligação imediata para vagas urgentes',
      '🔔 Prioridade urgente (imediato)',
      '📋 Acompanhamento personalizado'
    ],
    color: 'purple',
    popular: false,
    icon: '🥇'
  }
}

// Componente de Card de Produto com Seleção de Quantidade (SEM MODAL)
function ProductCard({ planKey, plan }: { planKey: string, plan: any }) {
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  // Estratégia de preços

  const getAdultPrice = () => plan.price
  const getChildPrice = () => Math.round(plan.price * 0.7) // 30% desconto para crianças,  
  const getQuantityDiscount = (totalPeople: number) => {
    if (totalPeople >= 5) return 0.15 // 15% desconto para 5+ pessoas,    if (totalPeople >= 3) return 0.10 // 10% desconto para 3-4 pessoas
    return 0
  }

  const calculateTotal = () => {
    const adultTotal = adults * getAdultPrice()
    const childTotal = children * getChildPrice()
    const subtotal = adultTotal + childTotal
    const totalPeople = adults + children
    const discount = getQuantityDiscount(totalPeople)
    return Math.round(subtotal * (1 - discount))
  }

  const getSavingsAmount = () => {
    const adultTotal = adults * getAdultPrice()
    const childTotal = children * getChildPrice()
    const subtotal = adultTotal + childTotal
    const totalPeople = adults + children
    const discount = getQuantityDiscount(totalPeople)
    return Math.round(subtotal * discount)
  }

  const handleClick = () => {
    const params = new URLSearchParams({
      product: planKey,
      adults: adults.toString(),
      children: children.toString(),
      total: calculateTotal().toString()
    })
    const checkoutUrl = `/checkout-moderno?${params.toString()}`
    window.location.href = checkoutUrl
  }

  const getCardClass = () => {
    if (plan.popular) {
      return 'border-2 border-orange-500 shadow-xl transform scale-105 relative'
    }
    if (planKey === 'vaga-express-vip') {
      return 'border-2 border-purple-300 shadow-lg relative bg-gradient-to-br from-purple-50 to-pink-50'
    }
    return 'border border-gray-200 shadow-md'
  }

  const getButtonClass = () => {
    if (planKey === 'vaga-express-vip') {
      return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    }
    if (plan.popular) {
      return 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
    }
    return 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
  }

  return (
    <div className={`bg-white rounded-2xl p-6 ${getCardClass()}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-1">
            <Star className="h-4 w-4" />
            MAIS POPULAR
          </div>
        </div>
      )}

      {planKey === 'vaga-express-vip' && (
        <div className="absolute -top-3 right-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold">
            👑 VIP
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-2xl font-bold text-gray-500 line-through mb-1">
          R$ {plan.price.toLocaleString('pt-BR')} por pessoa
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          R$ {calculateTotal().toLocaleString('pt-BR')}
        </div>
        {getSavingsAmount() > 0 && (
          <div className="text-sm font-medium text-green-600 mb-2">
            Economize R$ {getSavingsAmount().toLocaleString('pt-BR')}
          </div>
        )}
        <p className="text-gray-600 text-sm">{plan.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* Seleção de Quantidade */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">👥 Quantas pessoas?</h4>

        <div className="grid grid-cols-2 gap-4">
          {/* Adultos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <User className="h-4 w-4" />
              Adultos
            </label>
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-3 py-2 text-lg font-medium text-gray-900">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              R$ {getAdultPrice().toLocaleString('pt-BR')} cada
            </div>
          </div>

          {/* Crianças */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Baby className="h-4 w-4" />
              Crianças
            </label>
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-3 py-2 text-lg font-medium text-gray-900">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(Math.min(10, children + 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              R$ {getChildPrice().toLocaleString('pt-BR')} cada (30% desc.)
            </div>
          </div>
        </div>

        {/* Desconto por quantidade */}
        {getQuantityDiscount(adults + children) > 0 && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <div className="flex items-center justify-center text-green-800 text-sm font-medium">
              <Star className="h-4 w-4 mr-2" />
              {adults + children >= 5 ? '15% de desconto' : '10% de desconto'} para {adults + children} pessoas!
            </div>
          </div>
        )}

        {/* Resumo rápido */}
        <div className="mt-4 pt-3 border-t border-blue-200">
          <div className="flex justify-between text-sm text-gray-700">
            <span>{adults} adulto{adults > 1 ? 's' : ''}</span>
            <span>R$ {(adults * getAdultPrice()).toLocaleString('pt-BR')}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-sm text-gray-700">
              <span>{children} criança{children > 1 ? 's' : ''}</span>
              <span>R$ {(children * getChildPrice()).toLocaleString('pt-BR')}</span>
            </div>
          )}
          {getSavingsAmount() > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Desconto</span>
              <span>-R$ {getSavingsAmount().toLocaleString('pt-BR')}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-blue-600 pt-2 border-t border-blue-200">
            <span>Total</span>
            <span>R$ {calculateTotal().toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

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
            <CheckCircle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <span className="text-xs text-gray-600">Garantido</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition-all ${getButtonClass()}`}
      >
        {planKey === 'vaga-express-vip' ? 'Contratar VIP' : 'Escolher Pacote'}
        <ArrowRight className="ml-2 h-5 w-5 inline" />
      </button>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>PIX, Cartão, Boleto</span>
        </div>
      </div>
    </div>
  )
}

export default function VagaExpressPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return null // Hidden for now

  /* Original Content Hidden
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
<section className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        🚨 <span className="text-red-600">PARE!</span> Você está perdendo vagas de visto!
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
        Enquanto você verifica manualmente, outros já agendaram.
        <span className="font-bold text-orange-600"> Nossa IA monitora 24/7 e te avisa em segundos!</span>
      </p>
    </div>
  </div>
</section>

{/* Pricing Section */ }
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Escolha Seu Plano Vaga Express
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Planos flexíveis para diferentes necessidades e orçamentos
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {Object.entries(VAGA_EXPRESS_PLANS).map(([key, plan]) => (
        <div key={key} className="transition-all duration-300 hover:scale-105">
          <ProductCard planKey={key} plan={plan} />
        </div>
      ))}
    </div>
  </div>
</section>

{/* Trust Section */ }
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="font-bold text-lg mb-2">100% Seguro</h3>
        <p className="text-gray-600">Pagamentos protegidos e dados criptografados</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="text-4xl mb-4">⚡</div>
        <h3 className="font-bold text-lg mb-2">Ativação Imediata</h3>
        <p className="text-gray-600">Seu monitoramento começa em até 30 minutos</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="font-bold text-lg mb-2">Garantia de Resultado</h3>
        <p className="text-gray-600">Ou seu dinheiro de volta (planos Premium e VIP)</p>
      </div>
    </div>
  </div>
</section>

{/* Banner de Afiliados */ }
<section className="py-16 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">⚡ Acelere Sua Renda</h2>
      <p className="text-lg text-gray-600">Assim como você está buscando vagas mais rápido, ganhe dinheiro mais rápido também!</p>
    </div>
    <AffiliateBanner variant="full" />
  </div>
</section>

    </div >
  )
  */
}