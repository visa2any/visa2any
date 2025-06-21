'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UrgencyBanner from '@/components/UrgencyBanner'
import ActivityIndicators from '@/components/ActivityIndicators'
import TrustSignals from '@/components/TrustSignals'
import SimpleCheckout from '@/components/SimpleCheckout'
import Breadcrumb from '@/components/Breadcrumb'
import AffiliateBanner from '@/components/AffiliateBanner'
import { ArrowRight, CheckCircle, Star, Crown, Zap, FileText, Users, Clock, Shield, Download, Check } from 'lucide-react'

// Configuração do Vaga Express
const VAGA_EXPRESS_PLANS = {
  'vaga-express-basic': {
    name: '🥉 Vaga Express Basic',
    price: 297,
    description: 'Monitore cancelamentos por 30 dias',
    features: [
      '✅ Monitoramento por 30 dias',
      '📱 Notificações WhatsApp + Email',
      '🎯 1 país/consulado',
      '⏰ Vagas até 30 dias de antecedência',
      '🔔 Prioridade média (15min)'
    ],
    color: 'orange',
    popular: false
  },
  'vaga-express-premium': {
    name: '🥈 Vaga Express Premium',
    price: 497,
    description: 'Monitore cancelamentos por 60 dias + Garantia',
    features: [
      '✅ Monitoramento por 60 dias',
      '📱 Notificações multi-canal prioritárias',
      '🌍 Até 2 países/consulados',
      '⏰ Vagas até 60 dias de antecedência',
      '💰 Garantia de reembolso',
      '🔔 Prioridade alta (5min)'
    ],
    color: 'orange',
    popular: true
  },
  'vaga-express-vip': {
    name: '🥇 Vaga Express VIP',
    price: 797,
    description: 'Monitore cancelamentos por 90 dias + Consultoria',
    features: [
      '✅ Monitoramento por 90 dias',
      '🚨 Notificação imediata (2 minutos)',
      '🌎 Países ilimitados',
      '👑 Prioridade máxima',
      '👨‍💼 Consultoria inclusa',
      '🎯 Suporte dedicado',
      '🔔 Prioridade urgente (imediato)'
    ],
    color: 'orange',
    popular: false
  }
}

// Configuração de países e preços
const COUNTRIES = {
  usa: {
    name: 'EUA',
    flag: '🇺🇸',
    tier: 'premium',
    color: 'red',
    description: 'Muito complexo',
    prices: { 
      free: 0, 
      report: { base: 197, estudo: 247, trabalho: 297, investimento: 497, arte: 347, familia: 227, religioso: 217, aposentadoria: 187 },
      consultation: { base: 497, estudo: 597, trabalho: 797, investimento: 1297, arte: 697, familia: 547, religioso: 497, aposentadoria: 447 },
      vip: { base: 2497, estudo: 2997, trabalho: 3497, investimento: 4997, arte: 3297, familia: 2747, religioso: 2497, aposentadoria: 2197 }
    }
  },
  canada: {
    name: 'Canadá',
    flag: '🇨🇦',
    tier: 'high',
    color: 'orange',
    description: 'Complexo',
    prices: { 
      free: 0, 
      report: { base: 147, estudo: 167, trabalho: 197, investimento: 297, arte: 217, familia: 167, religioso: 157, aposentadoria: 137 },
      consultation: { base: 397, estudo: 447, trabalho: 547, investimento: 797, arte: 497, familia: 427, religioso: 397, aposentadoria: 347 },
      vip: { base: 1997, estudo: 2297, trabalho: 2597, investimento: 3497, arte: 2397, familia: 2147, religioso: 1997, aposentadoria: 1797 }
    }
  },
  australia: {
    name: 'Austrália',
    flag: '🇦🇺',
    tier: 'premium',
    color: 'red',
    description: 'Muito complexo',
    prices: { 
      free: 0, 
      report: { base: 197, estudo: 247, trabalho: 297, investimento: 447, arte: 327, familia: 217, religioso: 207, aposentadoria: 177 },
      consultation: { base: 497, estudo: 597, trabalho: 747, investimento: 1197, arte: 647, familia: 527, religioso: 497, aposentadoria: 447 },
      vip: { base: 2497, estudo: 2897, trabalho: 3297, investimento: 4497, arte: 3097, familia: 2647, religioso: 2497, aposentadoria: 2197 }
    }
  },
  portugal: {
    name: 'Portugal',
    flag: '🇵🇹',
    tier: 'standard',
    color: 'blue',
    description: 'Moderado',
    prices: { 
      free: 0, 
      report: { base: 97, estudo: 117, trabalho: 137, investimento: 197, arte: 147, familia: 107, religioso: 97, aposentadoria: 87 },
      consultation: { base: 297, estudo: 347, trabalho: 397, investimento: 597, arte: 427, familia: 327, religioso: 297, aposentadoria: 267 },
      vip: { base: 1497, estudo: 1697, trabalho: 1897, investimento: 2497, arte: 1997, familia: 1597, religioso: 1497, aposentadoria: 1297 }
    }
  },
  espanha: {
    name: 'Espanha',
    flag: '🇪🇸',
    tier: 'standard',
    color: 'yellow',
    description: 'Moderado',
    prices: { 
      free: 0, 
      report: { base: 97, estudo: 117, trabalho: 137, investimento: 197, arte: 147, familia: 107, religioso: 97, aposentadoria: 77 },
      consultation: { base: 297, estudo: 347, trabalho: 397, investimento: 597, arte: 427, familia: 327, religioso: 297, aposentadoria: 247 },
      vip: { base: 1497, estudo: 1697, trabalho: 1897, investimento: 2497, arte: 1997, familia: 1597, religioso: 1497, aposentadoria: 1197 }
    }
  },
  reino_unido: {
    name: 'Reino Unido',
    flag: '🇬🇧',
    tier: 'high',
    color: 'indigo',
    description: 'Complexo',
    prices: { 
      free: 0, 
      report: { base: 167, estudo: 197, trabalho: 227, investimento: 347, arte: 247, familia: 187, religioso: 167, aposentadoria: 157 },
      consultation: { base: 447, estudo: 497, trabalho: 597, investimento: 897, arte: 547, familia: 477, religioso: 447, aposentadoria: 397 },
      vip: { base: 2197, estudo: 2497, trabalho: 2797, investimento: 3797, arte: 2597, familia: 2297, religioso: 2197, aposentadoria: 1997 }
    }
  },
  alemanha: {
    name: 'Alemanha',
    flag: '🇩🇪',
    tier: 'high',
    color: 'gray',
    description: 'Complexo',
    prices: { 
      free: 0, 
      report: { base: 147, estudo: 167, trabalho: 197, investimento: 297, arte: 217, familia: 157, religioso: 147, aposentadoria: 137 },
      consultation: { base: 397, estudo: 447, trabalho: 547, investimento: 797, arte: 497, familia: 427, religioso: 397, aposentadoria: 347 },
      vip: { base: 1997, estudo: 2297, trabalho: 2597, investimento: 3497, arte: 2397, familia: 2147, religioso: 1997, aposentadoria: 1797 }
    }
  },
  outros: {
    name: 'Outros países',
    flag: '🌎',
    tier: 'medium',
    color: 'green',
    description: 'França, Itália, Irlanda, +40 países',
    countries: [
      '🇫🇷 França', '🇮🇹 Itália', '🇮🇪 Irlanda', '🇳🇱 Holanda', '🇧🇪 Bélgica', 
      '🇸🇪 Suécia', '🇳🇴 Noruega', '🇩🇰 Dinamarca', '🇫🇮 Finlândia', '🇦🇹 Áustria',
      '🇨🇭 Suíça', '🇯🇵 Japão', '🇰🇷 Coreia do Sul', '🇸🇬 Singapura', '🇳🇿 Nova Zelândia',
      '🇮🇱 Israel', '🇦🇪 Emirados Árabes', '🇲🇽 México', '🇨🇱 Chile', '🇦🇷 Argentina',
      '🇺🇾 Uruguai', '🇵🇪 Peru', '🇨🇴 Colômbia', '🇪🇨 Equador', '🇵🇾 Paraguai',
      '🇿🇦 África do Sul', '🇹🇭 Tailândia', '🇲🇾 Malásia', '🇻🇳 Vietnã', '🇮🇳 Índia',
      '🇷🇺 Rússia', '🇨🇳 China', '🇭🇰 Hong Kong', '🇹🇼 Taiwan', '🇵🇭 Filipinas',
      '🇮🇩 Indonésia', '🇹🇷 Turquia', '🇪🇬 Egito', '🇲🇦 Marrocos', '🇰🇪 Quênia',
      '🇳🇬 Nigéria', '🇬🇭 Gana', '🇪🇹 Etiópia', '🇺🇬 Uganda', '🇹🇿 Tanzânia'
    ],
    prices: { 
      free: 0, 
      report: { base: 127, estudo: 147, trabalho: 167, investimento: 247, arte: 177, familia: 137, religioso: 127, aposentadoria: 117 },
      consultation: { base: 347, estudo: 397, trabalho: 447, investimento: 647, arte: 447, familia: 367, religioso: 347, aposentadoria: 317 },
      vip: { base: 1797, estudo: 2097, trabalho: 2297, investimento: 2997, arte: 2197, familia: 1897, religioso: 1797, aposentadoria: 1597 }
    }
  }
}

const VISA_TYPES = {
  turismo: {
    name: 'Turismo/Negócios',
    icon: '🏖️',
    description: 'B1/B2, Visitor, Schengen, viagem',
    color: 'blue',
    complexity: 'baixa'
  },
  estudo: {
    name: 'Estudo/Educação',
    icon: '🎓',
    description: 'F1, Study Permit, Student Visa',
    color: 'purple',
    complexity: 'media'
  },
  trabalho: {
    name: 'Trabalho/Carreira',
    icon: '💼',
    description: 'H1B, Express Entry, Blue Card',
    color: 'green',
    complexity: 'alta'
  },
  investimento: {
    name: 'Investimento/Negócios',
    icon: '💰',
    description: 'EB5, Golden Visa, Start-up Visa',
    color: 'orange',
    complexity: 'muito-alta'
  },
  arte: {
    name: 'Arte/Cultura/Esporte',
    icon: '🎨',
    description: 'O1, P1, Artista, Atleta, Talento',
    color: 'pink',
    complexity: 'alta'
  },
  familia: {
    name: 'Família/Relacionamento',
    icon: '👨‍👩‍👧‍👦',
    description: 'K1, Spouse, Reagrupamento Familiar',
    color: 'red',
    complexity: 'media'
  },
  religioso: {
    name: 'Religioso/Humanitário',
    icon: '⛪',
    description: 'R1, Missionário, Voluntário',
    color: 'indigo',
    complexity: 'media'
  },
  aposentadoria: {
    name: 'Aposentadoria/Renda Passiva',
    icon: '🏝️',
    description: 'D7, Nômade Digital, Pensionista',
    color: 'teal',
    complexity: 'baixa'
  }
}

const PACKAGES = [
  {
    id: 'free',
    name: '🆓 Análise Gratuita',
    description: 'Perfeito para começar',
    features: [
      '✅ Análise IA de 15 minutos',
      '✅ Score de elegibilidade',
      '✅ 3 recomendações básicas',
      '✅ Resumo por email',
      '⚡ Resultado imediato'
    ],
    variant: 'default'
  },
  {
    id: 'report',
    name: '📄 Relatório Completo',
    description: 'Análise completa e detalhada',
    features: [
      '✅ Tudo do pacote anterior',
      '✅ Relatório PDF de 15+ páginas',
      '✅ Lista completa de documentos',
      '✅ Timeline personalizado',
      '✅ Custos estimados detalhados',
      '🎯 Preço varia por país'
    ],
    variant: 'premium',
    popular: true
  },
  {
    id: 'consultation',
    name: '👨‍💼 Consultoria 1:1',
    description: 'Orientação especializada humana',
    features: [
      '✅ Tudo do pacote anterior',
      '✅ 60min com especialista humano',
      '✅ Análise ao vivo do seu caso',
      '✅ Plano de ação personalizado',
      '✅ Suporte WhatsApp 30 dias',
      '🔥 Mais popular para complexos'
    ],
    variant: 'default'
  },
  {
    id: 'vip',
    name: '👑 Serviço VIP Completo',
    description: 'Fazemos tudo para você',
    features: [
      '✅ Tudo dos pacotes anteriores',
      '✅ Preparação completa de docs',
      '✅ Submissão da aplicação',
      '✅ Acompanhamento até aprovação',
      '✅ Suporte ilimitado',
      '🛡️ Garantia de retrabalho'
    ],
    variant: 'vip'
  }
]

export default function PrecosPage() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedVisaType, setSelectedVisaType] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [showOtherCountries, setShowOtherCountries] = useState(false)

  // Função para gerar product ID baseado nas seleções
  const generateProductId = (planId, country, visaType) => {
    if (planId === 'free') return 'pre-analise'
    
    const countryPrefix = country === 'usa' ? 'usa' : 
                         country === 'canada' ? 'canada' : 
                         country === 'australia' ? 'australia' :
                         country === 'portugal' ? 'europa' :
                         country === 'espanha' ? 'europa' :
                         country === 'reino_unido' ? 'uk' :
                         country === 'alemanha' ? 'europa' : 'outros'
    
    const visaTypeSuffix = visaType === 'turismo' ? 'turismo' :
                          visaType === 'estudo' ? 'estudo' :
                          visaType === 'trabalho' ? 'trabalho' :
                          visaType === 'investimento' ? 'investimento' :
                          visaType === 'arte' ? 'arte' :
                          visaType === 'familia' ? 'familia' :
                          visaType === 'religioso' ? 'religioso' :
                          visaType === 'aposentadoria' ? 'aposentadoria' : 'geral'
    
    const planSuffix = planId === 'report' ? 'relatorio' :
                      planId === 'consultation' ? 'consultoria' : 'vip'
    
    return `${countryPrefix}-${visaTypeSuffix}-${planSuffix}`
  }

  // Função para obter preço baseado nas seleções
  const getPrice = (planId) => {
    if (planId === 'free') return 0
    if (!selectedCountry || !selectedVisaType) return 97
    
    const countryData = COUNTRIES[selectedCountry]
    const planPrices = countryData.prices[planId]
    
    if (typeof planPrices === 'object') {
      // Se tem preços específicos por tipo de visto
      return planPrices[selectedVisaType] || planPrices.base || 97
    } else {
      // Se é preço fixo (para backward compatibility)
      return planPrices || 97
    }
  }

  // Função para resetar seleção
  const resetSelection = () => {
    setSelectedCountry('')
    setSelectedVisaType('')
    setSelectedPlan('')
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-visible">
      {/* Modal Outros Países */}
      {showOtherCountries && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">🌎 Outros Países Disponíveis</h3>
                <button
                  onClick={() => setShowOtherCountries(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Check className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Oferecemos assessoria para mais de 45 países ao redor do mundo</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {COUNTRIES.outros.countries.map((country, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedCountry('outros')
                      setShowOtherCountries(false)
                    }}
                    className="bg-gray-50 hover:bg-blue-50 p-3 rounded-lg text-center transition-colors cursor-pointer border border-gray-200 hover:border-blue-300 hover:scale-105"
                  >
                    <div className="text-sm font-medium text-gray-700">
                      {country}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Países populares inclusos:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>França:</strong> Visa de longa duração, PVT (Férias-Trabalho)</div>
                  <div>• <strong>Itália:</strong> Visto de estudo, trabalho, reunificação familiar</div>
                  <div>• <strong>Irlanda:</strong> Stamp 2 (estudo), Critical Skills, Working Holiday</div>
                  <div>• <strong>Suíça:</strong> Trabalho qualificado, residência por investimento</div>
                  <div>• <strong>Japão:</strong> Visto de trabalho, business manager, estudante</div>
                  <div>• <strong>Nova Zelândia:</strong> Working Holiday, Skilled Migrant</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  <p>🎯 <strong>Preços especiais:</strong> Oferecemos preços competitivos para todos esses destinos</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedCountry('outros')
                      setShowOtherCountries(false)
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✅ Selecionar "Outros Países"
                  </button>
                  <button
                    onClick={() => setShowOtherCountries(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* Breadcrumb */}
      <div className="bg-gray-50 page-content pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Escolha o Pacote <span className="text-blue-600">Ideal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Mais de 8.400 brasileiros já realizaram o sonho internacional conosco. Qual será seu próximo destino?
            </p>
          </div>
          
          {/* Urgency Banner */}
          {/* Indicadores de confiança */}
          <div className="flex flex-wrap gap-6 text-sm justify-center items-center mb-8">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">15 clientes ativos agora</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700 font-medium">89 consultorias este mês</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
              <Star className="h-4 w-4 text-purple-500" />
              <span className="text-purple-700 font-medium">4.9/5 avaliação média</span>
            </div>
          </div>
          
          {/* Trust Signals */}
          <TrustSignals variant="badges" className="mb-8" />
        </div>
      </section>

      {/* Seção Vaga Express - DESTAQUE */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 border-y-4 border-orange-200 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 NOVO - EXCLUSIVO VISA2ANY
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <Zap className="inline h-10 w-10 text-orange-600 mr-3" />
              Vaga Express
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Monitore cancelamentos consulares 24/7 e adiante sua entrevista automaticamente. 
              O primeiro sistema do Brasil que detecta vagas em tempo real!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(VAGA_EXPRESS_PLANS).map(([key, plan]) => (
              <div key={key} className="relative h-full">
                <SimpleCheckout
                  productId={key}
                  productName={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  variant={plan.popular ? "premium" : "default"}
                  popular={plan.popular}
                  className="h-full"
                />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              ⚡ Como o Vaga Express funciona?
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Escolha seu Plano</h4>
                <p className="text-sm text-gray-600">
                  Selecione o período e países que quer monitorar
                </p>
              </div>
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Monitoramento Automático</h4>
                <p className="text-sm text-gray-600">
                  Sistema verifica consulados a cada 2 minutos
                </p>
              </div>
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Alerta Instantâneo</h4>
                <p className="text-sm text-gray-600">
                  Notificação imediata quando vaga aparecer
                </p>
              </div>
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Agende Rapidamente</h4>
                <p className="text-sm text-gray-600">
                  Adiante sua entrevista em semanas ou meses
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-900 mb-3 text-center">🏆 Diferenciais Exclusivos</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Primeiro sistema do Brasil de monitoramento</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Verificação a cada 2 minutos (mais rápido do mercado)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Suporte para múltiplos consulados simultaneamente</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Garantia de reembolso nos planos Premium e VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Principal de Seleção */}
      <section className="py-8 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
          
          {/* PASSO 1: ONDE QUER IR? */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              🌍 <span className="text-blue-600">PASSO 1:</span> Para onde você quer ir?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 max-w-6xl mx-auto">
              {Object.entries(COUNTRIES).map(([key, country]) => (
                <div
                  key={key}
                  onClick={() => setSelectedCountry(key)}
                  className={`p-3 rounded-xl text-center transition-all cursor-pointer border-2 ${
                    selectedCountry === key
                      ? `bg-${country.color}-100 border-${country.color}-500 shadow-lg ring-2 ring-${country.color}-300`
                      : `bg-${country.color}-50 border-${country.color}-200 hover:shadow-lg hover:border-${country.color}-300`
                  }`}
                >
                  <div className="text-2xl mb-1">{country.flag}</div>
                  <div className="font-semibold text-sm">{country.name}</div>
                  <div className={`text-xs text-${country.color}-600`}>{country.description}</div>
                  {selectedCountry === key && (
                    <div className="mt-1">
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedCountry && (
              <div className="mt-4 text-center">
                <p className="text-green-600 font-medium">
                  ✅ {COUNTRIES[selectedCountry].name} selecionado! 
                  <button 
                    onClick={() => {
                      if (selectedCountry === 'outros') {
                        setShowOtherCountries(true)
                      } else {
                        setSelectedCountry('')
                      }
                    }}
                    className="ml-2 text-blue-600 underline"
                  >
                    {selectedCountry === 'outros' ? 'Ver países' : 'Alterar'}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* PASSO 2: QUAL SEU OBJETIVO? */}
          <div className={`bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 transition-all ${
            selectedCountry ? 'border-blue-200 opacity-100' : 'border-gray-200 opacity-50'
          }`}>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              🎯 <span className="text-blue-600">PASSO 2:</span> Qual seu objetivo?
            </h3>
            {!selectedCountry && (
              <p className="text-center text-gray-500 mb-4">
                👆 Primeiro selecione um país acima
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {Object.entries(VISA_TYPES).map(([key, visaType]) => (
                <div
                  key={key}
                  onClick={() => selectedCountry && setSelectedVisaType(key)}
                  className={`p-4 rounded-xl text-center transition-all border-2 ${
                    !selectedCountry 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                      : selectedVisaType === key
                        ? `bg-${visaType.color}-100 border-${visaType.color}-500 shadow-lg ring-2 ring-${visaType.color}-300 cursor-pointer`
                        : `bg-${visaType.color}-50 border-${visaType.color}-200 hover:shadow-lg hover:border-${visaType.color}-300 cursor-pointer`
                  }`}
                >
                  <div className="text-2xl mb-2">{visaType.icon}</div>
                  <div className="font-semibold text-sm mb-1">{visaType.name}</div>
                  <div className={`text-xs ${selectedCountry ? `text-${visaType.color}-600` : 'text-gray-400'}`}>
                    {visaType.description}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${selectedCountry ? `text-${visaType.color}-700` : 'text-gray-400'}`}>
                    Complexidade: {visaType.complexity}
                  </div>
                  {selectedVisaType === key && (
                    <div className="mt-2">
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedVisaType && (
              <div className="mt-4 text-center">
                <p className="text-green-600 font-medium">
                  ✅ {VISA_TYPES[selectedVisaType].name} selecionado!
                  <button 
                    onClick={() => setSelectedVisaType('')}
                    className="ml-2 text-blue-600 underline"
                  >
                    Alterar
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* PASSO 3: NIVEL DE SUPORTE */}
          <div className={`bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 transition-all overflow-visible ${
            selectedCountry && selectedVisaType ? 'border-green-200 opacity-100' : 'border-gray-200 opacity-50'
          }`}>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              🚀 <span className="text-blue-600">PASSO 3:</span> Quanto suporte você precisa?
            </h3>
            {(!selectedCountry || !selectedVisaType) && (
              <p className="text-center text-gray-500 mb-6">
                👆 Complete os passos anteriores primeiro
              </p>
            )}
            
            {selectedCountry && selectedVisaType && (
              <div className="mb-6 text-center">
                <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-gray-900">
                    {COUNTRIES[selectedCountry].flag} {COUNTRIES[selectedCountry].name} → {VISA_TYPES[selectedVisaType].icon} {VISA_TYPES[selectedVisaType].name}
                  </p>
                  <p className="text-sm text-gray-600">Preços ajustados para sua seleção</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PACKAGES.map((plan) => {
                const price = getPrice(plan.id)
                const productId = generateProductId(plan.id, selectedCountry, selectedVisaType)
                const isDisabled = !selectedCountry || !selectedVisaType
                
                return (
                  <div key={plan.id} className={`${isDisabled ? 'opacity-50' : ''} h-full`}>
                      <SimpleCheckout
                        productId={productId}
                        productName={plan.name}
                        price={price}
                        description={plan.description}
                        features={plan.features}
                        variant={plan.variant}
                        popular={plan.popular}
                        disabled={isDisabled}
                        className="h-full"
                      />
                  </div>
                )
              })}
            </div>
            
            {selectedCountry && selectedVisaType && (
              <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-center text-gray-900 mb-4">
                  💡 Sua seleção personalizada
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>País:</strong> {COUNTRIES[selectedCountry].name} ({COUNTRIES[selectedCountry].description})
                  </div>
                  <div>
                    <strong>Objetivo:</strong> {VISA_TYPES[selectedVisaType].name}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={resetSelection}
                    className="text-blue-600 underline font-medium"
                  >
                    🔄 Recomeçar seleção
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabela de Comparação de Preços */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-200">
            <h4 className="text-xl font-bold text-center text-gray-900 mb-6">
              📊 Tabela de Preços por País
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 p-2 text-left text-sm">País</th>
                    <th className="border border-gray-300 p-2 text-center text-sm">🆓 Gratuita</th>
                    <th className="border border-gray-300 p-2 text-center text-sm">📄 Relatório</th>
                    <th className="border border-gray-300 p-2 text-center text-sm">👨‍💼 Consultoria</th>
                    <th className="border border-gray-300 p-2 text-center text-sm">👑 VIP</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(COUNTRIES).map(([key, country]) => (
                    <tr key={key} className={`hover:bg-gray-50 ${selectedCountry === key ? 'bg-blue-50 border-2 border-blue-300' : ''}`}>
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{country.flag}</span>
                          <div>
                            <div className="font-semibold text-sm">{country.name}</div>
                            <div className="text-xs text-gray-600">{country.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2 text-center text-green-600 font-bold text-sm">GRÁTIS</td>
                      <td className="border border-gray-300 p-2 text-center font-medium text-sm">
                        {typeof country.prices.report === 'object' ? (
                          <div>
                            <div>R$ {country.prices.report.base}</div>
                            <div className="text-xs text-gray-500">varia por tipo</div>
                          </div>
                        ) : (
                          `R$ ${country.prices.report}`
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-center font-medium text-sm">
                        {typeof country.prices.consultation === 'object' ? (
                          <div>
                            <div>R$ {country.prices.consultation.base}</div>
                            <div className="text-xs text-gray-500">varia por tipo</div>
                          </div>
                        ) : (
                          `R$ ${country.prices.consultation}`
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-center font-medium text-sm">
                        {typeof country.prices.vip === 'object' ? (
                          <div>
                            <div>R$ {country.prices.vip.base.toLocaleString('pt-BR')}</div>
                            <div className="text-xs text-gray-500">varia por tipo</div>
                          </div>
                        ) : (
                          `R$ ${country.prices.vip.toLocaleString('pt-BR')}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              💡 <strong>Dica:</strong> Comece sempre com a análise gratuita. Você pode fazer upgrade depois!
            </p>
          </div>

        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSignals variant="full" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            O que nossos clientes dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "O relatório premium foi fundamental para organizar minha documentação. Consegui meu visto para o Canadá!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Marina S.</div>
                <div className="text-gray-600">Engenheira → Canadá</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "A consultoria express me salvou! O especialista identificou um erro que poderia ter custado meu visto."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Carlos R.</div>
                <div className="text-gray-600">Designer → Portugal</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Assessoria VIP valeu cada centavo. Do primeiro dia até a aprovação, suporte impecável!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Juliana P.</div>
                <div className="text-gray-600">Médica → Austrália</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Otimizado */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  ⚡ Quando recebo meu relatório?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Relatório Premium: Imediatamente após o pagamento. Consultoria Express: Agendamento em até 24h.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  🔒 Como funciona a garantia?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Garantimos a qualidade da assessoria. Se houver erro nosso, refazemos gratuitamente.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  💳 Quais formas de pagamento?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  PIX (desconto de 5%), cartão de crédito em até 12x, boleto bancário.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  🎯 Por que preços diferentes por país?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Cada país tem complexidade diferente. EUA é mais complexo que Portugal, por exemplo.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  📱 Posso fazer upgrade depois?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Claro! O valor já pago é descontado do pacote superior. Upgrade a qualquer momento.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  🎯 Garantem aprovação do visto?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Não. A aprovação é decisão das autoridades. Garantimos apenas a qualidade da nossa assessoria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para começar sua jornada internacional?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Comece agora com nossa pré-análise gratuita ou acelere com nossos pacotes premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="/consultoria-ia" className="w-full sm:w-auto">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </a>
            <Button className="border-2 border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto bg-transparent">
              Ver Pacotes Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Banner de Afiliados */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <AffiliateBanner variant="full" />
        </div>
      </section>

    </div>
  )
}