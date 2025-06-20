'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UrgencyBanner from '@/components/UrgencyBanner'
import ActivityIndicators from '@/components/ActivityIndicators'
import TrustSignals from '@/components/TrustSignals'
import SimpleCheckout from '@/components/SimpleCheckout'
import Breadcrumb from '@/components/Breadcrumb'
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

// Países e consulados monitorados
const MONITORED_LOCATIONS = [
  { country: '🇺🇸 EUA', consulates: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Recife', 'Porto Alegre'] },
  { country: '🇨🇦 Canadá', consulates: ['São Paulo', 'Rio de Janeiro', 'Brasília'] },
  { country: '🇬🇧 Reino Unido', consulates: ['São Paulo', 'Rio de Janeiro'] },
  { country: '🇦🇺 Austrália', consulates: ['São Paulo', 'Rio de Janeiro'] },
  { country: '🇩🇪 Alemanha', consulates: ['São Paulo', 'Rio de Janeiro', 'Porto Alegre'] },
  { country: '🇫🇷 França', consulates: ['São Paulo', 'Rio de Janeiro'] },
  { country: '🇮🇹 Itália', consulates: ['São Paulo', 'Rio de Janeiro', 'Brasília'] },
  { country: '🇪🇸 Espanha', consulates: ['São Paulo', 'Rio de Janeiro'] }
]

export default function VagaExpressPage() {
  const [selectedPlan, setSelectedPlan] = useState('vaga-express-premium')
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 page-content pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-orange-800 px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse">
              🔥 EXCLUSIVO VISA2ANY - PRIMEIRO DO BRASIL
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              <Zap className="inline h-16 w-16 text-orange-600 mr-4" />
              Vaga Express
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              O primeiro sistema do Brasil que monitora cancelamentos consulares em tempo real. 
              <span className="text-orange-600 font-semibold"> Adiante sua entrevista automaticamente!</span>
            </p>
          </div>
          
          {/* Indicadores de atividade elegantes */}
          <div className="flex flex-wrap gap-6 text-sm justify-center items-center mb-8">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">12 pessoas monitorando agora</span>
            </div>
            <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-orange-700 font-medium">7 vagas encontradas hoje</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700 font-medium">95% taxa de sucesso</span>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">2min</div>
              <div className="text-sm text-gray-600">Verificação automática</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoramento ativo</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
              <div className="text-sm text-gray-600">Países monitorados</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Taxa de sucesso</div>
            </div>
          </div>

          {/* Trust Signals */}
          <TrustSignals variant="badges" className="mb-8" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              😤 Cansado de Esperar Meses pela Entrevista?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sabemos como é frustrante ter que esperar até 2024 ou 2025 para conseguir uma data de entrevista consular.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Datas Esgotadas</h3>
              <p className="text-gray-600">
                Consulados lotados com datas apenas para 2024/2025
              </p>
            </div>
            
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center">
              <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Espera Longa</h3>
              <p className="text-gray-600">
                Meses perdidos esperando uma oportunidade aparecer
              </p>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <Target className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Oportunidades Perdidas</h3>
              <p className="text-gray-600">
                Cancelamentos acontecem, mas você não fica sabendo
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ⚡ MAS E SE VOCÊ PUDESSE ADIANTAR SUA ENTREVISTA?
            </h3>
            <p className="text-lg text-gray-600">
              Cancelamentos acontecem TODOS OS DIAS. O problema é que você não fica sabendo a tempo.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              🎯 A Solução: Vaga Express
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nosso sistema monitora consulados 24/7 e te avisa INSTANTANEAMENTE quando uma vaga aparece.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Monitoramento Automático</h3>
              <p className="text-sm text-gray-600">
                Sistema verifica consulados a cada 2 minutos, 24 horas por dia
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Alerta Instantâneo</h3>
              <p className="text-sm text-gray-600">
                Notificação imediata via WhatsApp quando vaga aparecer
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Agende Rapidamente</h3>
              <p className="text-sm text-gray-600">
                Link direto para agendamento no site do consulado
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Entrevista Antecipada</h3>
              <p className="text-sm text-gray-600">
                Adiante sua entrevista em semanas ou meses
              </p>
            </div>
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
              <div key={key} className={`transition-all duration-300 hover:scale-105 ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                <SimpleCheckout
                  productId={key}
                  productName={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  variant={key === 'vaga-express-vip' ? 'vip' : plan.popular ? "premium" : "default"}
                  popular={plan.popular}
                />
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              📊 Comparação Detalhada dos Planos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="border border-gray-300 p-4 text-left">Recurso</th>
                    <th className="border border-gray-300 p-4 text-center">🥉 Basic</th>
                    <th className="border border-gray-300 p-4 text-center">🥈 Premium</th>
                    <th className="border border-gray-300 p-4 text-center">🥇 VIP</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="border border-gray-300 p-4 font-medium">Período de monitoramento</td>
                    <td className="border border-gray-300 p-4 text-center">30 dias</td>
                    <td className="border border-gray-300 p-4 text-center">60 dias</td>
                    <td className="border border-gray-300 p-4 text-center">90 dias</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-4 font-medium">Países/consulados</td>
                    <td className="border border-gray-300 p-4 text-center">1</td>
                    <td className="border border-gray-300 p-4 text-center">2</td>
                    <td className="border border-gray-300 p-4 text-center">Ilimitado</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-medium">Tempo de notificação</td>
                    <td className="border border-gray-300 p-4 text-center">15 minutos</td>
                    <td className="border border-gray-300 p-4 text-center">5 minutos</td>
                    <td className="border border-gray-300 p-4 text-center">2 minutos</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-4 font-medium">Canais de notificação</td>
                    <td className="border border-gray-300 p-4 text-center">WhatsApp + Email</td>
                    <td className="border border-gray-300 p-4 text-center">Multi-canal</td>
                    <td className="border border-gray-300 p-4 text-center">Todos + Ligação</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-medium">Garantia de reembolso</td>
                    <td className="border border-gray-300 p-4 text-center">❌</td>
                    <td className="border border-gray-300 p-4 text-center">✅</td>
                    <td className="border border-gray-300 p-4 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-4 font-medium">Consultoria dedicada</td>
                    <td className="border border-gray-300 p-4 text-center">❌</td>
                    <td className="border border-gray-300 p-4 text-center">❌</td>
                    <td className="border border-gray-300 p-4 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-medium">Suporte</td>
                    <td className="border border-gray-300 p-4 text-center">Standard</td>
                    <td className="border border-gray-300 p-4 text-center">Prioritário</td>
                    <td className="border border-gray-300 p-4 text-center">24/7 Dedicado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Monitored Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🌍 Países e Consulados Monitorados
            </h2>
            <p className="text-lg text-gray-600">
              Cobrimos os principais destinos dos brasileiros
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MONITORED_LOCATIONS.map((location, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{location.country}</h3>
                <ul className="space-y-2">
                  {location.consulates.map((consulate, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {consulate}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Não encontrou seu destino? Entre em contato conosco!
            </p>
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              Solicitar Novo Destino
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏆 Histórias de Sucesso
            </h2>
            <p className="text-lg text-gray-600">
              Clientes que anteciparam suas entrevistas com o Vaga Express
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Consegui antecipar minha entrevista em 3 meses! De dezembro para setembro. 
                O Vaga Express me alertou em 2 minutos quando a vaga apareceu."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Carlos M.</div>
                <div className="text-gray-600">Visto H1B - EUA</div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Incrível! Estava agendada para março de 2024 e consegui uma vaga para novembro de 2023. 
                Valeu cada centavo do VIP!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Mariana S.</div>
                <div className="text-gray-600">Visto F1 - EUA</div>
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "O sistema funcionou perfeitamente. Antecipei em 6 semanas minha entrevista no Canadá. 
                Recomendo o Premium com garantia!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Rafael P.</div>
                <div className="text-gray-600">Express Entry - Canadá</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ❓ Perguntas Frequentes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ⚡ Quão rápido é a detecção?
                </h3>
                <p className="text-gray-600 text-sm">
                  Nosso sistema verifica a cada 2 minutos. Você será notificado instantaneamente quando uma vaga aparecer.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔒 Como funciona a garantia?
                </h3>
                <p className="text-gray-600 text-sm">
                  Nos planos Premium e VIP, se não detectarmos nenhuma vaga no período, reembolsamos 100%.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📱 Como recebo as notificações?
                </h3>
                <p className="text-gray-600 text-sm">
                  WhatsApp, email, SMS e ligação (VIP). Você escolhe quais canais quer ativar.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎯 Posso monitorar múltiplos consulados?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sim! Basic (1), Premium (2) e VIP (ilimitado). Monitore todos os consulados que fazem sentido para você.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ⏰ Posso cancelar a qualquer momento?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sim, você pode cancelar a qualquer momento. O monitoramento continua até o final do período pago.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🚀 Quando começa o monitoramento?
                </h3>
                <p className="text-gray-600 text-sm">
                  Imediatamente após a confirmação do pagamento. Em até 30 minutos você já estará sendo monitorado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Adiantar sua Entrevista?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Não perca mais tempo esperando. Comece seu monitoramento agora e seja notificado das próximas vagas!
          </p>
          
          {/* Indicadores finais de urgência */}
          <div className="flex flex-wrap gap-4 text-sm justify-center items-center mb-8">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full border border-white border-opacity-30">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-white font-medium">Sistema 24/7 ativo</span>
            </div>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full border border-white border-opacity-30">
              <Clock className="h-4 w-4 text-green-300" />
              <span className="text-white font-medium">Notificação em 2 minutos</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4">
                <Zap className="mr-2 h-5 w-5" />
                Começar Monitoramento Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 bg-transparent">
              Falar com Especialista
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-orange-100 text-sm">
              ✅ Ativação imediata • ⚡ Monitoramento 24/7 • 🛡️ Garantia de qualidade • 💳 Parcelamento disponível
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 text-orange-400 mr-3" />
            <span className="text-2xl font-bold">Vaga Express</span>
          </div>
          <p className="text-gray-300 mb-6">
            O primeiro sistema do Brasil de monitoramento de cancelamentos consulares em tempo real.
          </p>
          <p className="text-gray-400 text-sm">
            &copy; 2024 Visa2Any. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}