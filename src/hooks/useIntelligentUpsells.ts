'use client'

import { useState, useEffect } from 'react'

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
  score?: number
}

interface CustomerProfile {
  currentPlan: string
  destinationCountry: string
  visaType: string
  eligibilityScore: number
  progress: number
  timeInProcess: number
  engagementLevel: 'low' | 'medium' | 'high'
  previousPurchases: string[]
  behaviorSignals: {
    documentsUploaded: number
    consultationRequests: number
    reportDownloads: number
    timeSpentInPortal: number
    lastActivityDays: number
  }
}

export const useIntelligentUpsells = (customerProfile: CustomerProfile) => {
  const [recommendations, setRecommendations] = useState<UpsellRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dismissedOffers, setDismissedOffers] = useState<string[]>([])

  const calculateUpsellScore = (recommendation: UpsellRecommendation): number => {
    let score = 0

    if (customerProfile.progress < 30 && recommendation.type === 'priority_processing') {
      score += 40
    }
    
    if (customerProfile.progress > 70 && recommendation.type === 'additional_service') {
      score += 35
    }

    if (customerProfile.eligibilityScore < 70 && recommendation.type === 'consultation_upgrade') {
      score += 30
    }

    if (customerProfile.engagementLevel === 'high') {
      score += 20
    } else if (customerProfile.engagementLevel === 'medium') {
      score += 10
    }

    const signals = customerProfile.behaviorSignals
    if (signals.consultationRequests > 2) score += 15
    if (signals.reportDownloads > 1) score += 10
    if (signals.timeSpentInPortal > 3600) score += 10
    if (signals.lastActivityDays < 2) score += 5

    if (dismissedOffers.includes(recommendation.id)) {
      score -= 50
    }

    return Math.max(0, Math.min(100, score))
  }

  const generateRecommendations = (): UpsellRecommendation[] => {
    const baseRecommendations: UpsellRecommendation[] = []

    if (customerProfile.currentPlan !== 'vip' && 
        ['Estados Unidos', 'Canadá', 'Austrália'].includes(customerProfile.destinationCountry) &&
        customerProfile.eligibilityScore > 60) {
      baseRecommendations.push({
        id: 'vip-upgrade',
        type: 'service_upgrade',
        title: '👑 Upgrade para VIP - Garantia de Aprovação',
        description: 'Aumente suas chances para 99% com nosso serviço premium exclusivo',
        originalPrice: 4997,
        discountedPrice: 3497,
        discountPercentage: 30,
        urgency: 'high',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reasons: [
          'Seu score de elegibilidade é excelente',
          'Destino de alta complexidade detectado',
          'Clientes VIP têm 99% de aprovação'
        ],
        cta: 'Fazer Upgrade Agora',
        benefits: [
          '✅ Preparação completa de documentos',
          '✅ Submissão e acompanhamento personalizado',
          '✅ Garantia de retrabalho em caso de negativa',
          '✅ Suporte prioritário 24/7',
          '✅ Especialista dedicado exclusivo'
        ],
        testimonial: {
          name: 'Marina Silva',
          text: 'O upgrade VIP foi a melhor decisão! Aprovada em 15 dias.',
          country: 'Estados Unidos'
        }
      })
    }

    if (customerProfile.progress < 40 && 
        customerProfile.behaviorSignals.consultationRequests > 1) {
      baseRecommendations.push({
        id: 'priority-processing',
        type: 'priority_processing',
        title: '⚡ Processamento Prioritário - 50% Mais Rápido',
        description: 'Acelere seu processo e tenha prioridade em todas as etapas',
        originalPrice: 997,
        discountedPrice: 697,
        discountPercentage: 30,
        urgency: 'medium',
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        reasons: [
          'Identificamos interesse em agilizar o processo',
          'Fila prioritária disponível apenas hoje',
          'Economia de 4-6 semanas no timeline'
        ],
        cta: 'Ativar Prioridade',
        benefits: [
          '⚡ Análise em 24h ao invés de 5 dias',
          '🎯 Fila prioritária em todos os processos',
          '📞 Contato direto com especialista',
          '📋 Revisão expressa de documentos'
        ]
      })
    }

    if (customerProfile.eligibilityScore < 70) {
      baseRecommendations.push({
        id: 'consultation-boost',
        type: 'consultation_upgrade',
        title: '🎯 Consultoria Estratégica - Aumente seu Score',
        description: 'Sessão especializada para fortalecer seu perfil e aumentar aprovação',
        originalPrice: 797,
        discountedPrice: 397,
        discountPercentage: 50,
        urgency: 'high',
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        reasons: [
          'Score abaixo da média para seu destino',
          'Identificamos pontos de melhoria específicos',
          'Estratégias personalizadas disponíveis'
        ],
        cta: 'Agendar Consultoria',
        benefits: [
          '📈 Estratégias para aumentar elegibilidade',
          '📋 Plano personalizado de fortalecimento',
          '🎯 Foco nos pontos mais críticos',
          '📞 1h de consultoria individual'
        ],
        testimonial: {
          name: 'Roberto Santos',
          text: 'Aumentei meu score de 65 para 89 após a consultoria!',
          country: 'Canadá'
        }
      })
    }

    if (customerProfile.progress > 60 && customerProfile.currentPlan === 'premium') {
      baseRecommendations.push({
        id: 'followup-service',
        type: 'additional_service',
        title: '🛡️ Seguro de Aprovação + Acompanhamento',
        description: 'Proteção completa até a aprovação final do seu visto',
        originalPrice: 1497,
        discountedPrice: 997,
        discountPercentage: 33,
        urgency: 'low',
        reasons: [
          'Você está na fase crítica do processo',
          'Proteção adicional recomendada',
          'Acompanhamento até a aprovação'
        ],
        cta: 'Contratar Seguro',
        benefits: [
          '🛡️ Garantia de retrabalho em caso de negativa',
          '📞 Acompanhamento semanal do status',
          '⚖️ Suporte jurídico em caso de problemas',
          '🔄 Resubmissão gratuita se necessário'
        ]
      })
    }

    if (['Estados Unidos', 'Reino Unido'].includes(customerProfile.destinationCountry) &&
        customerProfile.progress > 50) {
      baseRecommendations.push({
        id: 'interview-prep',
        type: 'additional_service',
        title: '🎭 Preparação para Entrevista Consular',
        description: 'Treinamento especializado para garantir sucesso na entrevista',
        originalPrice: 697,
        discountedPrice: 497,
        discountPercentage: 29,
        urgency: 'medium',
        reasons: [
          'Entrevista consular obrigatória detectada',
          'Preparação aumenta aprovação em 40%',
          'Especialistas em entrevistas disponíveis'
        ],
        cta: 'Agendar Preparação',
        benefits: [
          '🎭 Simulação de entrevista real',
          '📝 Roteiro personalizado de respostas',
          '💡 Dicas de postura e comunicação',
          '📊 Análise de pontos fortes/fracos'
        ],
        testimonial: {
          name: 'Ana Costa',
          text: 'A preparação foi fundamental! Passei na entrevista de primeira.',
          country: 'Estados Unidos'
        }
      })
    }

    return baseRecommendations
      .map(rec => ({ ...rec, score: calculateUpsellScore(rec) }))
      .filter(rec => rec.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }

  useEffect(() => {
    setIsLoading(true)
    const recs = generateRecommendations()
    setRecommendations(recs)
    setIsLoading(false)
  }, [customerProfile, dismissedOffers])

  const dismissOffer = (offerId: string) => {
    setDismissedOffers(prev => [...prev, offerId])
    setRecommendations(prev => prev.filter(rec => rec.id !== offerId))
    
    const dismissed = JSON.parse(localStorage.getItem('dismissed-offers') || '[]')
    localStorage.setItem('dismissed-offers', JSON.stringify([...dismissed, offerId]))
  }

  const acceptOffer = (offerId: string) => {
    const offer = recommendations.find(rec => rec.id === offerId)
    if (!offer) return

    const checkoutUrl = `/upsell-checkout?offer=${offerId}&price=${offer.discountedPrice || offer.originalPrice}`
    window.open(checkoutUrl, '_blank')
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'upsell_accepted', {
        offer_id: offerId,
        offer_type: offer.type,
        value: offer.discountedPrice || offer.originalPrice
      })
    }
  }

  useEffect(() => {
    const dismissed = JSON.parse(localStorage.getItem('dismissed-offers') || '[]')
    setDismissedOffers(dismissed)
  }, [])

  return {
    recommendations,
    isLoading,
    dismissOffer,
    acceptOffer
  }
}
