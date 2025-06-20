'use client'

import { useState } from 'react'
import { 
  Crown, 
  Zap, 
  Target, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle, 
  X, 
  ArrowRight,
  Sparkles,
  Timer,
  TrendingUp
} from 'lucide-react'

interface UpsellRecommendation {
  id: string
  type: 'service_upgrade' | 'additional_service' | 'priority_processing' | 'consultation_upgrade'
  title: string
  description: string
  originalPrice: number
  discountedPrice?: number
  discountPercentage?: number
  urgency: 'low' | 'medium' | 'high'
  validUntil?: Date
  reasons: string[]
  cta: string
  benefits: string[]
  testimonial?: {
    name: string
    text: string
    country: string
  }
}

interface IntelligentUpsellsProps {
  recommendations: UpsellRecommendation[]
  isLoading: boolean
  onDismiss: (offerId: string) => void
  onAccept: (offerId: string) => void
}

export default function IntelligentUpsells({ 
  recommendations, 
  isLoading, 
  onDismiss, 
  onAccept 
}: IntelligentUpsellsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Você está no caminho certo! 🎉
          </h3>
          <p className="text-gray-600">
            Seu plano atual atende perfeitamente às suas necessidades. 
            Continuaremos monitorando para oferecer as melhores oportunidades.
          </p>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔥 Urgente'
      case 'medium': return '⚡ Limitado'
      case 'low': return '💡 Recomendado'
      default: return '📋 Disponível'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service_upgrade': return Crown
      case 'priority_processing': return Zap
      case 'consultation_upgrade': return Target
      case 'additional_service': return Shield
      default: return Star
    }
  }

  const getTimeRemaining = (validUntil?: Date) => {
    if (!validUntil) return null
    
    const now = new Date()
    const diff = validUntil.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d restantes`
    if (hours > 0) return `${hours}h restantes`
    return 'Expira em breve'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
            Recomendações Inteligentes
          </h3>
          <p className="text-gray-600 text-sm">
            Baseadas no seu perfil e progresso atual
          </p>
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          IA Otimizada
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => {
          const TypeIcon = getTypeIcon(recommendation.type)
          const isExpanded = expandedCard === recommendation.id
          const timeRemaining = getTimeRemaining(recommendation.validUntil)
          
          return (
            <div
              key={recommendation.id}
              className={`bg-white rounded-xl border-2 shadow-lg transition-all duration-300 overflow-hidden ${
                recommendation.urgency === 'high' 
                  ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50' 
                  : recommendation.urgency === 'medium'
                  ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50'
                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50'
              }`}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${
                      recommendation.urgency === 'high' ? 'bg-red-100' :
                      recommendation.urgency === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <TypeIcon className={`h-6 w-6 ${
                        recommendation.urgency === 'high' ? 'text-red-600' :
                        recommendation.urgency === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {recommendation.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(recommendation.urgency)}`}>
                          {getUrgencyLabel(recommendation.urgency)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDismiss(recommendation.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {recommendation.discountedPrice ? (
                      <>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(recommendation.discountedPrice)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(recommendation.originalPrice)}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          -{recommendation.discountPercentage}%
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(recommendation.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {timeRemaining && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Timer className="h-4 w-4 mr-1" />
                      {timeRemaining}
                    </div>
                  )}
                </div>

                {/* Why this offer */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">
                    Por que recomendamos para você:
                  </h5>
                  <ul className="space-y-1">
                    {recommendation.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onAccept(recommendation.id)}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                      recommendation.urgency === 'high' 
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                        : recommendation.urgency === 'medium'
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {recommendation.cta}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                  
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : recommendation.id)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isExpanded ? 'Menos' : 'Detalhes'}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Benefits */}
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">
                        ✨ O que está incluído:
                      </h5>
                      <ul className="space-y-2">
                        {recommendation.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Testimonial */}
                    {recommendation.testimonial && (
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-3">
                          💬 Depoimento de Cliente:
                        </h5>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 italic mb-3">
                            "{recommendation.testimonial.text}"
                          </p>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-blue-600">
                                {recommendation.testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {recommendation.testimonial.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Visto para {recommendation.testimonial.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons in expanded view */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onAccept(recommendation.id)}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                          recommendation.urgency === 'high' 
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                            : recommendation.urgency === 'medium'
                            ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        <Crown className="h-5 w-5 mr-2" />
                        {recommendation.cta} - {formatCurrency(recommendation.discountedPrice || recommendation.originalPrice)}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Trust signals */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1 text-green-500" />
            Garantia de 30 dias
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            4.9/5 satisfação
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
            +10k clientes aprovados
          </div>
        </div>
      </div>
    </div>
  )
}