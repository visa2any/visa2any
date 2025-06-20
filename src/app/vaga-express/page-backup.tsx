'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Star, Zap, Clock, Shield, Users, Globe, AlertTriangle, Target, Calendar, Bell } from 'lucide-react'

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

// Componente de Card de Produto Simples (SEM MODAL)
function ProductCard({ planKey, plan }: { planKey: string, plan: any }) {
  const handleClick = () => {
    const checkoutUrl = `/checkout-moderno?product=${encodeURIComponent(planKey)}`
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
        <div className="text-3xl font-bold text-blue-600 mb-2">
          R$ {plan.price.toLocaleString('pt-BR')}
        </div>
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

      {/* Pricing Section */}
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

      {/* Trust Section */}
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
    </div>
  )
}