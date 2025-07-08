/* Updated: 1749920015365 */
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Star, Users, Globe, Clock, TrendingUp } from 'lucide-react'

interface Notification {
  id: string
  type: 'approval' | 'consultation' | 'signup'
  message: string
  time: string
  country: string
  flag: string
}

interface Stats {
  approvals: number
  consultations: number
  onlineUsers: number
  successRate: number
}

export default function SocialProof() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentNotification, setCurrentNotification] = useState(0)
  const [stats, setStats] = useState<Stats>({
    approvals: 8420,
    consultations: 89,
    onlineUsers: 247,
    successRate: 85.2
  })
  const [showNotification, setShowNotification] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Previne hidratação diferente no primeiro render

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados de notificações

  const sampleNotifications: Notification[] = [
    {
      id: '1',
      type: 'approval',
      message: 'Maria S. acabou de ter seu visto para o Canadá aprovado! 🎉',
      time: '2 min atrás',
      country: 'Canadá',
      flag: '🇨🇦'
    },
    {
      id: '2',
      type: 'consultation',
      message: 'João P. agendou consultoria para visto de trabalho nos EUA',
      time: '5 min atrás',
      country: 'Estados Unidos',
      flag: '🇺🇸'
    },
    {
      id: '3',
      type: 'approval',
      message: 'Ana L. recebeu aprovação para estudar na Austrália! ✅',
      time: '8 min atrás',
      country: 'Austrália',
      flag: '🇦🇺'
    },
    {
      id: '4',
      type: 'signup',
      message: 'Pedro R. se cadastrou para consultoria de imigração',
      time: '12 min atrás',
      country: 'Reino Unido',
      flag: '🇬🇧'
    },
    {
      id: '5',
      type: 'approval',
      message: 'Carla M. teve seu visto de turismo para França aprovado! 🥳',
      time: '15 min atrás',
      country: 'França',
      flag: '🇫🇷'
    },
    {
      id: '6',
      type: 'consultation',
      message: 'Roberto K. marcou reunião para visto de investimento',
      time: '18 min atrás',
      country: 'Portugal',
      flag: '🇵🇹'
    }
  ]

  useEffect(() => {
    if (!mounted) return

    // Simula atualizações em tempo real

    const updateStats = () => {
      setStats(prev => ({
        approvals: prev.approvals + Math.floor(Math.random() * 3),
        consultations: prev.consultations + Math.floor(Math.random() * 2),
        onlineUsers: 200 + Math.floor(Math.random() * 100),
        successRate: 84.5 + Math.random() * 1.5
      }))
    }

    // Adiciona nova notificação

    const addNotification = () => {
      const names = ['Carlos', 'Mariana', 'Felipe', 'Juliana', 'Ricardo', 'Fernanda', 'Lucas', 'Beatriz']
      const countries = ['Estados Unidos', 'Canadá', 'Austrália', 'Reino Unido', 'França', 'Alemanha']
      const flags = ['🇺🇸', '🇨🇦', '🇦🇺', '🇬🇧', '🇫🇷', '🇩🇪']
      const types: ('approval' | 'consultation' | 'signup')[] = ['approval', 'consultation', 'signup']
      
      const randomName = names[Math.floor(Math.random() * names.length)] || 'Cliente'
      const randomCountry = countries[Math.floor(Math.random() * countries.length)] || 'País'
      const randomFlag = flags[Math.floor(Math.random() * flags.length)] || '🌎'
      const randomType = types[Math.floor(Math.random() * types.length)] || 'approval'
      
      let message = ''
      switch (randomType) {
        case 'approval':
          message = `${randomName} ${randomName?.slice(-1) ?? ''}. acabou de ter seu visto aprovado! 🎉`
          break
        case 'consultation':
          message = `${randomName} ${randomName?.slice(-1) ?? ''}. agendou consultoria gratuita`
          break
        case 'signup':
          message = `${randomName} ${randomName?.slice(-1) ?? ''}. se cadastrou na plataforma`
          break
      }

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: randomType,
        message,
        time: 'agora',
        country: randomCountry,
        flag: randomFlag
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
    }

    const statsInterval = setInterval(updateStats, 30000) // 30 segundos
    const notificationIntervalRef = setInterval(addNotification, 15000) // 15 segundos

    // Inicializa com notificações de exemplo

    setNotifications(sampleNotifications)

    return () => {
      clearInterval(statsInterval)
      if (notificationIntervalRef) {
        clearInterval(notificationIntervalRef)
      }
    }
  }, [mounted])

  // Controla exibição das notificações popup

  useEffect(() => {
    if (notifications.length > 0) {
      setShowNotification(true)
      const timer = setTimeout(() => {
        setShowNotification(false)
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
      }, 5000)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [notifications, currentNotification])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'consultation': return <Users className="h-5 w-5 text-blue-500" />
      case 'signup': return <TrendingUp className="h-5 w-5 text-purple-500" />
      default: return <Globe className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <>
      {/* Widget discreto no canto - opcional, pode comentar para remover */}
      {/* 
      <div className="fixed bottom-6 right-6 z-40 max-w-xs">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Live</span>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
              <span className="text-xs text-green-600">{stats.onlineUsers}</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {stats.approvals.toLocaleString('pt-BR')} vistos aprovados
          </div>
        </div>
      </div>
      */}

      {/* Notificações removidas para não incomodar - ficam apenas na seção de aprovações */}

      {/* Credibilidade e Confiança - OTIMIZADO */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 page-content">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🏆 Referência em Assessoria Internacional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <strong>8.420+ brasileiros</strong> já conseguiram seus vistos com nossa tecnologia em 2024
            </p>
          </div>

          {/* Métricas de autoridade */}
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.approvals.toLocaleString('pt-BR')}+
                </div>
                <div className="text-sm font-medium text-gray-700">Vistos Aprovados</div>
                <div className="text-xs text-green-600 mt-1">✅ Só em 2024</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-gray-700">Taxa de Sucesso</div>
                <div className="text-xs text-blue-600 mt-1">🎯 Acima da média</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
                <div className="text-sm font-medium text-gray-700">Anos Experiência</div>
                <div className="text-xs text-purple-600 mt-1">⭐ Desde 2009</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-sm font-medium text-gray-700">Países Atendidos</div>
                <div className="text-xs text-orange-600 mt-1">🌍 Cobertura global</div>
              </div>
            </div>
          </div>

          {/* Logos de autoridade */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Reconhecidos por:</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">🏛️ Consulados Oficiais</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">⚖️ OAB Registrada</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">🔒 LGPD Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner removido para design mais limpo */}

      {/* Seção duplicada removida para evitar repetição */}

      {/* Avaliações simplificadas */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">4.9/5</span>
              <span className="text-gray-600">• {stats.approvals}+ avaliações</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              "A Visa2Any transformou nossos sonhos em realidade. Processo transparente, 
              equipe especializada e resultados que superam expectativas."
            </p>
            <div className="text-sm text-gray-500 mt-2">
              ⭐ Avaliação média dos nossos clientes
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
