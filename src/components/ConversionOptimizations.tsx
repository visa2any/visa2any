'use client'

import { useState, useEffect } from 'react'
import { Bell, Clock, Users, Eye, TrendingUp, CheckCircle, Star, Zap } from 'lucide-react'

// Componente de Social Proof Dinâmico
export function LiveSocialProof() {
  const [currentProof, setCurrentProof] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const proofs = [
    {
      action: "acabou de baixar",
      item: "E-book: 50 Erros que Reprovam Vistos",
      name: "Maria S.",
      location: "São Paulo, SP",
      time: "2 min atrás"
    },
    {
      action: "conseguiu aprovação para",
      item: "Canadá - Express Entry",
      name: "João R.",
      location: "Rio de Janeiro, RJ", 
      time: "15 min atrás"
    },
    {
      action: "comprou",
      item: "Consultoria Premium",
      name: "Ana C.",
      location: "Belo Horizonte, MG",
      time: "32 min atrás"
    },
    {
      action: "completou análise para",
      item: "Portugal - D7",
      name: "Carlos M.",
      location: "Brasília, DF",
      time: "1h atrás"
    },
    {
      action: "agendou consultoria para",
      item: "Austrália - Skilled Visa",
      name: "Juliana L.", 
      location: "Porto Alegre, RS",
      time: "2h atrás"
    }
  ]

  useEffect(() => {
    // Mostrar primeira notificação após 3 segundos,    const showTimer = setTimeout(() => setIsVisible(true), 3000)
    
    // Rotacionar proofs a cada 8 segundos,    const interval = setInterval(() => {
      setCurrentProof((prev) => (prev + 1) % proofs.length)
    }, 8000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(interval)
    }
  }, [])

  if (!isVisible) return null

  const proof = proofs[currentProof]

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-40 animate-slide-in-left">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            <span className="font-semibold">{proof.name}</span> {proof.action}
          </p>
          <p className="text-sm text-blue-600 font-medium truncate">
            {proof.item}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">{proof.location}</p>
            <p className="text-xs text-gray-400">{proof.time}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Componente de Escassez/Urgência
export function ScarcityTimer({ endDate }: { endDate?: Date }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [spots, setSpots] = useState(7) // Simular vagas restantes

  useEffect(() => {
    const targetDate = endDate || new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h default,    
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('00:00:00')
      }
    }, 1000)

    // Simular redução de vagas,    const spotInterval = setInterval(() => {
      setSpots(prev => prev > 3 ? prev - 1 : prev)
    }, 120000) // A cada 2 minutos

    return () => {
      clearInterval(interval)
      clearInterval(spotInterval)
    }
  }, [endDate])

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center mb-3">
        <Clock className="h-5 w-5 text-red-600 mr-2" />
        <span className="text-red-800 font-semibold">OFERTA LIMITADA</span>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600 mb-2 font-mono">
          {timeLeft}
        </div>
        <p className="text-sm text-red-700 mb-3">
          ⏰ Restam apenas <strong>{spots} vagas</strong> para consultorias este mês
        </p>
        <p className="text-xs text-red-600">
          🔥 Depois de amanhã o preço volta ao normal (+40%)
        </p>
      </div>
    </div>
  )
}

// Componente de Autoridade/Credibilidade  
export function AuthorityBadges() {
  const badges = [
    {
      icon: Users,
      number: "12,847",
      label: "Vistos Aprovados",
      color: "blue"
    },
    {
      icon: TrendingUp, 
      number: "94%",
      label: "Taxa de Sucesso",
      color: "green"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Avaliação Média",
      color: "yellow"
    },
    {
      icon: Eye,
      number: "50+",
      label: "Países Atendidos", 
      color: "purple"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {badges.map((badge, index) => (
        <div key={index} className="text-center bg-white rounded-lg p-4 shadow-sm border">
          <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-${badge.color}-100 flex items-center justify-center`}>
            <badge.icon className={`h-6 w-6 text-${badge.color}-600`} />
          </div>
          <div className={`text-2xl font-bold text-${badge.color}-600 mb-1`}>
            {badge.number}
          </div>
          <div className="text-sm text-gray-600">
            {badge.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente de Risk Reversal (Garantias)
export function RiskReversal() {
  const guarantees = [
    {
      icon: CheckCircle,
      title: "Garantia de Qualidade",
      description: "Se encontrarmos erro em nossa análise, refazemos gratuitamente"
    },
    {
      icon: Zap,
      title: "Entrega Garantida",
      description: "Relatório em até 24h ou seu dinheiro de volta"
    },
    {
      icon: Users,
      title: "Suporte Dedicado", 
      description: "Acesso direto aos consultores por 30 dias"
    }
  ]

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
      <h3 className="text-lg font-bold text-green-800 text-center mb-4">
        🛡️ Suas Garantias
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
              <guarantee.icon className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-green-800 mb-2 text-sm">
              {guarantee.title}
            </h4>
            <p className="text-xs text-green-700">
              {guarantee.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de Exit Intent (para modal)
export function ExitIntentOffer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            🚨 Espere! Não vá embora ainda...
          </h3>
          
          <p className="text-gray-600 mb-4">
            Como você chegou até aqui, temos uma oferta especial:
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-lg font-bold text-yellow-800 mb-2">
              🎁 DESCONTO EXCLUSIVO: 30% OFF
            </p>
            <p className="text-sm text-yellow-700">
              Válido apenas pelos próximos 15 minutos
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Não, obrigado
            </button>
            <button 
              onClick={() => window.location.href = '/precos?discount=30'}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Aproveitar 30% OFF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para detectar exit intent
export function useExitIntent() {
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        timeoutId = setTimeout(() => {
          setShowExitIntent(true)
          setHasShown(true)
        }, 500)
      }
    }

    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [hasShown])

  return { showExitIntent, setShowExitIntent }
}

// Componente de Progress Bar para Assessment
export function AssessmentProgress({ currentStep, totalSteps, completionRate }: {
  currentStep: number
  totalSteps: number
  completionRate: number
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {completionRate}% das pessoas que chegam aqui conseguem aprovação
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Você está indo muito bem! 🎯</span>
        <span>Quase lá...</span>
      </div>
    </div>
  )
}

// Gamificação para Assessment
export function GamificationRewards({ score, achievements }: {
  score: number
  achievements: string[]
}) {
  const badges = [
    { name: 'Iniciante', threshold: 10, icon: '🌟', color: 'blue' },
    { name: 'Dedicado', threshold: 30, icon: '⭐', color: 'purple' },
    { name: 'Expert', threshold: 60, icon: '🏆', color: 'yellow' },
    { name: 'Campeão', threshold: 90, icon: '👑', color: 'gold' }
  ]

  const currentBadge = badges.reverse().find(badge => score >= badge.threshold)

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Seu Progresso
          </h4>
          <p className="text-sm text-gray-600">
            {score} pontos • Badge: {currentBadge?.name} {currentBadge?.icon}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {score}
          </div>
          <div className="text-xs text-gray-500">
            pontos
          </div>
        </div>
      </div>
      
      {achievements.length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-200">
          <p className="text-xs text-purple-700 mb-2">🎉 Conquistas desbloqueadas:</p>
          <div className="flex flex-wrap gap-1">
            {achievements.map((achievement, index) => (
              <span key={index} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}