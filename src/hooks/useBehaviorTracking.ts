'use client'

import { useEffect, useRef, useState } from 'react'

interface BehaviorEvent {
  type: 'page_view' | 'scroll' | 'time_spent' | 'exit_intent' | 'form_abandonment' | 'pricing_view' | 'report_download'
  data: any
  timestamp: number
}

interface AutomationTrigger {
  id: string
  name: string
  condition: (events: BehaviorEvent[], userData: any) => boolean
  action: (userData: any) => void
  cooldown: number // minutes
  priority: number
  lastTriggered?: number
}

export const useBehaviorTracking = (userId?: string) => {
  const [events, setEvents] = useState<BehaviorEvent[]>([])
  const [activeTriggers, setActiveTriggers] = useState<string[]>([])
  const pageStartTime = useRef(Date.now())
  const scrollDepth = useRef(0)
  const exitIntentShown = useRef(false)

  // Predefined automation triggers

  const triggers: AutomationTrigger[] = [
    {
      id: 'exit_intent_offer',
      name: 'Oferta de Saída',
      condition: (events) => {
        const exitIntent = events.find(e => e.type === 'exit_intent')
        const timeSpent = Date.now() - pageStartTime.current
        return !!exitIntent && timeSpent > 30000 && !exitIntentShown.current
      },
      action: () => {
        showExitIntentModal()
        exitIntentShown.current = true
      },
      cooldown: 60,
      priority: 1
    },

    {
      id: 'pricing_hesitation',
      name: 'Hesitação em Preços',
      condition: (events) => {
        const pricingViews = events.filter(e => e.type === 'pricing_view').length
        const timeOnPricing = events
          .filter(e => e.type === 'time_spent' && e.data.page === 'pricing')
          .reduce((total, e) => total + e.data.duration, 0)

        return pricingViews >= 3 || timeOnPricing > 120000 // 2 minutes
      },
      action: () => {
        showPricingAssistant()
      },
      cooldown: 30,
      priority: 2
    },

    {
      id: 'engagement_boost',
      name: 'Boost de Engajamento',
      condition: (events) => {
        const timeSpent = Date.now() - pageStartTime.current
        const scrollEvents = events.filter(e => e.type === 'scroll').length
        return timeSpent > 60000 && scrollEvents < 3 // Low engagement
      },
      action: () => {
        showEngagementBooster()
      },
      cooldown: 45,
      priority: 3
    },

    {
      id: 'form_abandonment_recovery',
      name: 'Recuperação de Abandono',
      condition: (events) => {
        const abandonments = events.filter(e => e.type === 'form_abandonment')
        return abandonments.length >= 2
      },
      action: () => {
        showFormAssistant()
      },
      cooldown: 20,
      priority: 2
    },

    {
      id: 'success_celebration',
      name: 'Celebração de Sucesso',
      condition: (events) => {
        const reportDownload = events.find(e => e.type === 'report_download')
        return !!reportDownload
      },
      action: () => {
        showSuccessCelebration()
      },
      cooldown: 1440, // 24 hours
      priority: 1
    }
  ]

  // Track behavior events

  const trackEvent = (type: BehaviorEvent['type'], data: any = {}) => {
    const event: BehaviorEvent = {
      type,
      data,
      timestamp: Date.now()
    }

    setEvents(prev => [...prev.slice(-50), event]) // Keep last 50 events

    // Send to backend for persistent tracking
    if (userId) {
      fetch('/api/automation/behavioral-triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, event })
      }).catch(console.error)
    }
  }

  // Check and execute triggers

  const checkTriggers = () => {
    const now = Date.now()

    triggers
      .filter(trigger => {
        // Check cooldown
        if (trigger.lastTriggered && (now - trigger.lastTriggered) < trigger.cooldown * 60 * 1000) {
          return false
        }

        // Check if already active

        if (activeTriggers.includes(trigger.id)) {
          return false
        }

        return trigger.condition(events, { userId })
      })
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 1) // Execute only highest priority
      .forEach(trigger => {
        trigger.lastTriggered = now
        setActiveTriggers(prev => [...prev, trigger.id])
        trigger.action({ userId })

        console.log(`🤖 Automação executada: ${trigger.name}`)

        // Disparar evento customizado para integrar com upsells

        window.dispatchEvent(new CustomEvent('behaviorTrigger', {
          detail: { triggerId: trigger.id, triggerName: trigger.name, userId }
        }))
      })
  }

  // Setup automatic tracking

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer
    })

    // Track scroll depth

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > scrollDepth.current + 25) {
        scrollDepth.current = scrollPercent
        trackEvent('scroll', { depth: scrollPercent })
      }
    }

    // Track exit intent

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown.current) {
        trackEvent('exit_intent', { timeSpent: Date.now() - pageStartTime.current })
      }
    }

    // Track time spent

    const timeTracker = setInterval(() => {
      trackEvent('time_spent', {
        page: window.location.pathname,
        duration: Date.now() - pageStartTime.current
      })
    }, 30000) // Every 30 seconds

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(timeTracker)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Check triggers periodically

  useEffect(() => {
    const triggerChecker = setInterval(checkTriggers, 5000) // Every 5 seconds
    return () => clearInterval(triggerChecker)
  }, [events])

  return {
    trackEvent,
    events,
    activeTriggers
  }
}

// Automation actions
const showExitIntentModal = () => {
  // Create and show exit intent modal
  const modal = document.createElement('div')
  modal.id = 'exit-intent-modal'
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="text-6xl mb-4">✋</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Espere! Não vá embora!</h3>
        <p class="text-gray-600 mb-6">
          Comece sua pré-análise agora e descubra suas chances de aprovação em apenas 15 minutos.
        </p>
        <div class="space-y-3">
          <button onclick="window.open('/consultoria-ia', '_blank'); document.getElementById('exit-intent-modal').remove()" 
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700">
            🚀 Começar Pré-Análise
          </button>
          <button onclick="document.getElementById('exit-intent-modal').remove()" 
                  class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  // Auto remove after 10 seconds

  setTimeout(() => {
    const existingModal = document.getElementById('exit-intent-modal')
    if (existingModal) existingModal.remove()
  }, 10000)
}

const showPricingAssistant = () => {
  // Show pricing assistance
  const assistant = document.createElement('div')
  assistant.id = 'pricing-assistant'
  assistant.innerHTML = `
    <div class="fixed bottom-20 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-xl max-w-sm z-40">
      <div class="flex items-start space-x-3">
        <div class="bg-white rounded-full p-2">
          <span class="text-2xl">💰</span>
        </div>
        <div class="flex-1">
          <h4 class="font-bold mb-2">Precisa de ajuda com preços?</h4>
          <p class="text-sm mb-3">Nossa IA pode calcular o preço exato para seu caso!</p>
          <button onclick="window.open('/precos', '_blank'); document.getElementById('pricing-assistant').remove()" 
                  class="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            🧮 Calcular Meu Preço
          </button>
        </div>
        <button onclick="document.getElementById('pricing-assistant').remove()" 
                class="text-white hover:text-gray-200 text-xl">&times;</button>
      </div>
    </div>
  `
  document.body.appendChild(assistant)

  setTimeout(() => {
    const existing = document.getElementById('pricing-assistant')
    if (existing) existing.remove()
  }, 15000)
}

const showEngagementBooster = () => {
  // Show engagement booster
  const booster = document.createElement('div')
  booster.id = 'engagement-booster'
  booster.innerHTML = `
    <div class="fixed top-20 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl shadow-xl max-w-sm z-40 animate-bounce">
      <div class="flex items-start space-x-3">
        <div class="text-3xl">🎯</div>
        <div class="flex-1">
          <h4 class="font-bold mb-2">Descubra suas chances!</h4>
          <p class="text-sm mb-3">2 minutos para saber se você pode conseguir seu visto</p>
          <button onclick="document.querySelector('.btn-gradient')?.click(); document.getElementById('engagement-booster').remove()" 
                  class="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            ⚡ Análise Rápida
          </button>
        </div>
        <button onclick="document.getElementById('engagement-booster').remove()" 
                class="text-white hover:text-gray-200 text-xl">&times;</button>
      </div>
    </div>
  `
  document.body.appendChild(booster)

  setTimeout(() => {
    const existing = document.getElementById('engagement-booster')
    if (existing) existing.remove()
  }, 12000)
}

const showFormAssistant = () => {
  // Show form completion assistant
  const assistant = document.createElement('div')
  assistant.id = 'form-assistant'
  assistant.innerHTML = `
    <div class="fixed bottom-20 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-xl max-w-sm z-40">
      <div class="flex items-start space-x-3">
        <div class="text-3xl">🤝</div>
        <div class="flex-1">
          <h4 class="font-bold mb-2">Precisa de ajuda?</h4>
          <p class="text-sm mb-3">Nossa IA Sofia pode te guiar pelo processo!</p>
          <button onclick="document.querySelector('[class*=\"MessageCircle\"]')?.parentElement?.click(); document.getElementById('form-assistant').remove()" 
                  class="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            💬 Falar com Sofia
          </button>
        </div>
        <button onclick="document.getElementById('form-assistant').remove()" 
                class="text-white hover:text-gray-200 text-xl">&times;</button>
      </div>
    </div>
  `
  document.body.appendChild(assistant)

  setTimeout(() => {
    const existing = document.getElementById('form-assistant')
    if (existing) existing.remove()
  }, 10000)
}

const showSuccessCelebration = () => {
  // Show success celebration
  const celebration = document.createElement('div')
  celebration.id = 'success-celebration'
  celebration.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Parabéns!</h3>
        <p class="text-gray-600 mb-6">
          Você deu o primeiro passo para seu sonho internacional! Que tal acelerar o processo?
        </p>
        <div class="space-y-3">
          <button onclick="window.open('/precos', '_blank'); document.getElementById('success-celebration').remove()" 
                  class="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700">
            🚀 Ver Pacotes Premium
          </button>
          <button onclick="document.getElementById('success-celebration').remove()" 
                  class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
            Continuar Explorando
          </button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(celebration)

  setTimeout(() => {
    const existing = document.getElementById('success-celebration')
    if (existing) existing.remove()
  }, 8000)
}
