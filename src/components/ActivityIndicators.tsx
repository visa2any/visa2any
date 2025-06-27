'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Clock, Zap, Eye, CheckCircle } from 'lucide-react'

interface ActivityIndicatorsProps {
  style?: 'subtle' | 'floating' | 'inline' | 'sidebar' | 'ticker'
  className?: string
}

export default function ActivityIndicators({ style = 'subtle', className = '' }: ActivityIndicatorsProps) {
  const [metrics, setMetrics] = useState({
    recentViews: 23,
    activeUsers: 8,
    consultationsToday: 15,
    slotsLeft: 7
  })

  useEffect(() => {
    // Simular atividade em tempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        recentViews: prev.recentViews + Math.floor(Math.random() * 3),
        activeUsers: Math.max(1, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1)),
        consultationsToday: prev.consultationsToday + (Math.random() > 0.8 ? 1 : 0),
        slotsLeft: Math.max(1, prev.slotsLeft - (Math.random() > 0.95 ? 1 : 0))
      }))
    }, 15000) // A cada 15 segundos

    return () => clearInterval(interval)
  }, [])

  // 1. Estilo Sutil - Indicadores discretos e elegantes

  if (style === 'subtle') {
    return (
      <div className={`flex flex-wrap gap-6 text-sm justify-center items-center ${className}`}>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 font-medium">{metrics.activeUsers} pessoas online agora</span>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
          <Eye className="h-4 w-4 text-blue-500" />
          <span className="text-blue-700 font-medium">{metrics.recentViews} visualizações hoje</span>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-full border border-purple-200">
          <CheckCircle className="h-4 w-4 text-purple-500" />
          <span className="text-purple-700 font-medium">{metrics.consultationsToday} consultorias realizadas</span>
        </div>
      </div>
    )
  }

  // 2. Estilo Flutuante - Pequeno widget no canto

  if (style === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 max-w-xs z-40 ${className}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              Online agora
            </span>
            <span className="font-semibold">{metrics.activeUsers}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Clock className="h-3 w-3 text-blue-500 mr-2" />
              Vagas restantes
            </span>
            <span className="font-semibold text-orange-600">{metrics.slotsLeft}</span>
          </div>
        </div>
      </div>
    )
  }

  // 3. Estilo Inline - Integrado ao conteúdo

  if (style === 'inline') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">{metrics.activeUsers}</div>
            <div className="text-gray-600">Online agora</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-blue-600">{metrics.recentViews}</div>
            <div className="text-gray-600">Visualizações</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-600">{metrics.consultationsToday}</div>
            <div className="text-gray-600">Consultorias</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-orange-600">{metrics.slotsLeft}</div>
            <div className="text-gray-600">Vagas restantes</div>
          </div>
        </div>
      </div>
    )
  }

  // 4. Estilo Sidebar - Barra lateral discreta

  if (style === 'sidebar') {
    return (
      <div className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-r-lg shadow-lg p-2 z-40 ${className}`}>
        <div className="space-y-3 text-xs">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
            <div className="font-bold">{metrics.activeUsers}</div>
            <div className="text-gray-500">online</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1" />
            <div className="font-bold">{metrics.slotsLeft}</div>
            <div className="text-gray-500">vagas</div>
          </div>
        </div>
      </div>
    )
  }

  // 5. Estilo Ticker - Texto rolante (menos intrusivo)

  if (style === 'ticker') {
    return (
      <div className={`bg-blue-600 text-white py-2 overflow-hidden ${className}`}>
        <div className="animate-marquee whitespace-nowrap text-sm">
          <span className="mx-8">🔥 {metrics.activeUsers} pessoas online agora</span>
          <span className="mx-8">⚡ {metrics.slotsLeft} vagas disponíveis esta semana</span>
          <span className="mx-8">✅ {metrics.consultationsToday} consultorias realizadas hoje</span>
          <span className="mx-8">👀 {metrics.recentViews} pessoas visualizaram nas últimas horas</span>
        </div>
      </div>
    )
  }

  return null
}