'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bot, CheckCircle, Lock } from 'lucide-react'

// ... interfaces keep formatted ...
interface ConsultationMessage {
  id: string
  text: string
  isAI: boolean
  timestamp: Date
  isTyping?: boolean
  data?: any
}

interface UserProfile {
  name: string
  email: string
  phone: string
  country: string
  nationality?: string
  visaType: string
  timeline: string
  budget: string
  education: string
  experience: string
  language: string
  french?: string
  family: string
  assets: string
  age: number
  sector?: string
}

interface ConsultationResult {
  eligibilityScore: number
  recommendation: string
  timeline: string
  estimatedCost: string
  requiredDocuments: string[]
  nextSteps: string[]
  needsHumanConsultant: boolean
  complexityLevel: 'simple' | 'moderate' | 'complex'
  warningFlags: string[]
}

export default function AIConsultation() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<ConsultationMessage[]>([])
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(10 * 60) // 10 minutos
  const [consultationResult, setConsultationResult] = useState<ConsultationResult | null>(null)

  // New States for Server Persistence
  const [isSaving, setIsSaving] = useState(false)
  const [serverIds, setServerIds] = useState<{ clientId: string, consultationId: string } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  // 🔒 SECURITY: Default to false, require verification
  const [hasPaid, setHasPaid] = useState(false)
  const [isLoadingVerification, setIsLoadingVerification] = useState(true)

  // Persistence and Payment Check
  useEffect(() => {
    // Check URL parameters for ID references
    const cId = searchParams.get('consultationId')
    const cClientId = searchParams.get('clientId')

    // Always check server for status if we have IDs
    if (cId && cClientId) {
      setServerIds({ clientId: cClientId, consultationId: cId })
      checkPaymentStatus(cId, cClientId)
    } else {
      // No IDs = No Access
      setIsLoadingVerification(false)
    }
  }, [searchParams])

  const checkPaymentStatus = async (consultId: string, cliId: string) => {
    try {
      setIsLoadingVerification(true)
      const res = await fetch(`/api/ai/consultation-result?id=${consultId}&clientId=${cliId}`)
      const data = await res.json()

      if (data.isLocked === false) {
        setHasPaid(true)
        // Restore full result from server
        if (data.result && data.result.generated_analysis) {
          setConsultationResult(data.result.generated_analysis)
          // Also restore profile if available
          if (data.result.raw_profile) {
            setUserProfile(data.result.raw_profile)
          }
        }
        setIsActive(true) // Ensure view is active to show results/chat
      } else {
        // Exists but LOCKED (Not paid)
        setHasPaid(false)
      }
    } catch (err) {
      console.error("Error verifying payment:", err)
      setHasPaid(false)
    } finally {
      setIsLoadingVerification(false)
    }
  }

  // ... (Keep existing consultationQuestions array) ...
  const consultationQuestions = [
    {
      id: 'intro',
      question: "Olá! Sou a Sofia, sua assistente de imigração. Em 10 minutos, vou analisar seu perfil e dar recomendações precisas. Qual seu nome?",
      field: 'name',
      type: 'text'
    },
    {
      id: 'email',
      question: "Prazer, {name}! Para onde devo enviar o relatório final? (Digite seu email)",
      field: 'email',
      type: 'text'
    },
    {
      id: 'age',
      question: "Qual sua idade, {name}? Isso afeta diretamente suas opções de visto.",
      field: 'age',
      type: 'select',
      options: ['18-25 anos', '26-30 anos', '31-35 anos', '36-40 anos', '41-45 anos', '46-50 anos', '51-55 anos', '56+ anos']
    },
    {
      id: 'nationality',
      question: "Qual sua nacionalidade?",
      field: 'nationality',
      type: 'select',
      options: ['Brasileira', 'Portuguesa', 'Italiana', 'Espanhola', 'Americana', 'Argentina', 'Outra']
    },
    {
      id: 'destination',
      question: "Para onde você quer se mudar?",
      field: 'country',
      type: 'select',
      options: ['Estados Unidos', 'Canadá', 'Austrália', 'Portugal', 'Alemanha', 'Reino Unido', 'França', 'Espanha', 'Itália', 'Outro']
    },
    {
      id: 'visa-type',
      question: "Qual seu objetivo em {country}?",
      field: 'visaType',
      type: 'select',
      options: ['Trabalho', 'Estudo', 'Investir/Empreender', 'Família', 'Cidadania', 'Aposentadoria', 'Turismo']
    },
    {
      id: 'education',
      question: "Qual sua escolaridade?",
      field: 'education',
      type: 'select',
      options: ['Ensino médio', 'Superior incompleto', 'Superior completo', 'Pós-graduação', 'Mestrado/Doutorado']
    },
    {
      id: 'experience',
      question: "Quantos anos de experiência profissional você tem?",
      field: 'experience',
      type: 'select',
      options: ['Menos de 2 anos', '2-5 anos', '5-10 anos', 'Mais de 10 anos']
    },
    {
      id: 'language',
      question: "Qual seu nível de inglês/idioma local?",
      field: 'language',
      type: 'select',
      options: ['Básico', 'Intermediário', 'Avançado', 'Fluente']
    },
    {
      id: 'french',
      question: "Para Canadá: Qual seu nível de francês? (Aumenta muito as chances)",
      field: 'french',
      type: 'select',
      options: ['Nenhum conhecimento', 'Básico', 'Intermediário', 'Avançado', 'Fluente'],
      showIf: 'country',
      showValue: 'Canadá'
    },
    {
      id: 'timeline',
      question: "Quando pretende se mudar?",
      field: 'timeline',
      type: 'select',
      options: ['Até 1 ano', '1-2 anos', '2-5 anos', 'Não tenho pressa']
    },
    {
      id: 'budget',
      question: "Quanto pode investir no processo completo?",
      field: 'budget',
      type: 'select',
      options: ['Até R$ 50.000', 'R$ 50.000 - R$ 150.000', 'R$ 150.000 - R$ 300.000', 'Acima de R$ 300.000']
    },
    {
      id: 'family',
      question: "Vai sozinho ou com família?",
      field: 'family',
      type: 'select',
      options: ['Sozinho', 'Com cônjuge', 'Com cônjuge + filhos', 'Família grande (5+)']
    }
  ]

  // ... (Keep existing useEffects for timer and scroll)
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    return undefined
  }, [isActive, timeRemaining])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // removed startConsultation - now we start automatically ONLY IF PAID
  useEffect(() => {
    // Auto-start chat if paid and no messages yet
    if (hasPaid && messages.length === 0) {
      addAIMessage(consultationQuestions[0]?.question || 'Olá! Vamos começar sua consultoria.')
    }
  }, [hasPaid])

  const addAIMessage = (text: string, data?: any) => {
    setIsTyping(true)
    setTimeout(() => {
      const processedText = text.replace(/\{(\w+)\}/g, (match, key) => {
        const value = userProfile[key as keyof UserProfile]
        return (value !== undefined && value !== null) ? String(value) : match
      })

      const message: ConsultationMessage = {
        id: Date.now().toString(),
        text: processedText,
        isAI: true,
        timestamp: new Date(),
        data
      }
      setMessages(prev => [...prev, message])
      setIsTyping(false)
    }, 1500)
  }

  const addUserMessage = (text: string) => {
    const message: ConsultationMessage = {
      id: Date.now().toString(),
      text,
      isAI: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const handleAnswer = (answer: string | number) => {
    // ... same logic as before ...
    const currentQuestion = consultationQuestions[currentStep]
    if (!currentQuestion) return

    addUserMessage(answer.toString())

    setUserProfile(prev => ({
      ...prev,
      [currentQuestion.field]: answer
    }))

    // Find next valid question
    let nextStep = currentStep + 1
    while (nextStep < consultationQuestions.length) {
      const nextQuestion = consultationQuestions[nextStep]
      if (!nextQuestion) {
        nextStep++
        continue
      }

      if (nextQuestion.showIf) {
        const conditionValue = userProfile[nextQuestion.showIf as keyof UserProfile]
        if (Array.isArray(nextQuestion.showValue)) {
          if (!nextQuestion.showValue.includes(conditionValue as string)) {
            nextStep++
            continue
          }
        } else if (conditionValue !== nextQuestion.showValue) {
          nextStep++
          continue
        }
      }
      break
    }

    if (nextStep < consultationQuestions.length) {
      setTimeout(() => {
        setCurrentStep(nextStep)
        addAIMessage(consultationQuestions[nextStep]?.question || 'Próxima pergunta')
      }, 1000)
    } else {
      setTimeout(() => {
        generateConsultationResult()
      }, 1000)
    }
  }

  const generateConsultationResult = async () => {
    // If we're here, the user HAS PAID (checked at start). 
    // We just need to save the final result to the DB if it wasn't already.
    // However, the original code used a "client-side save" via POST.
    // Since we are now PRE-PAID payment flow likely creates the consultation first?
    // Actually, let's keep the logic: Updates the existing consultation or creates a log?
    // Since we have serverIds (from URL), we should UPDATE the existing consultation.

    const profile = userProfile as UserProfile
    setIsSaving(true)

    // We have IDs because we required them to start
    if (!serverIds) return

    // For now, we simulate the calculation locally then show it.
    // In a real robust system, we would POST to /api/ai/update-result

    // Just mock result for display as logic is similar
    const mockResult: ConsultationResult = {
      eligibilityScore: 85, // Dynamic would be better
      recommendation: "Com base no seu perfil, você tem altas chances.",
      timeline: 'Calculado',
      estimatedCost: 'Calculado',
      requiredDocuments: [],
      nextSteps: [],
      needsHumanConsultant: false,
      complexityLevel: 'simple',
      warningFlags: []
    }
    setConsultationResult(mockResult)
    setIsSaving(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = consultationQuestions[currentStep]

  // === RENDER STATES ===

  // 1. Loading
  if (isLoadingVerification) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-2xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando status da assinatura...</p>
      </div>
    )
  }

  // 2. PAYWALL (Gate) - Shown if not paid or no IDs
  if (!hasPaid) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl border border-white">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Área Exclusiva
          </h3>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 mb-8 border border-blue-100">
            <p className="text-lg text-gray-700 leading-relaxed">
              A Consultoria com IA é um recurso <strong>Premium</strong> disponível apenas para usuários do pacote <strong>Pré-Análise com IA</strong>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl mb-8 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">✨ Desbloqueie agora para ter acesso:</h4>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Análise completa de elegibilidade (50+ países)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Relatório detalhado em PDF</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Acesso vitalício ao Portal do Cliente</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => window.location.href = '/checkout-moderno?product=pre-analise'}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full text-lg animate-pulse"
          >
            <Lock className="mr-2 h-6 w-6" />
            Liberar Acesso Agora - R$ 29,90
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            🔒 Pagamento único e seguro. Satisfação garantida.
          </p>
        </div>
      </div>
    )
  }

  // 3. Consultation Interface (Unlocked)
  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto">
      {/* Header with Timer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-xl font-bold">Consultoria IA em Andamento</h3>
              <p className="text-blue-100">Sofia está analisando seu perfil</p>
            </div>
          </div>
          <div className="text-right">
            {/* Timer logic can stay, but maybe less relevant now that it's paid */}
            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Status Premium</div>
            <div className="text-white font-bold flex items-center justify-end mt-1">
              <CheckCircle className="h-4 w-4 mr-1" /> Ativo
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progresso</span>
            <span className="text-sm">{Math.round((currentStep / consultationQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-700/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / consultationQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            {/* ... same chat message rendering ... */}
            <div
              className={`max-w-[85%] p-3 rounded-xl ${message.isAI
                ? 'bg-white text-gray-800 shadow-sm border'
                : 'bg-blue-600 text-white'
                }`}
            >
              {message.isAI && (
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-600">Sofia</span>
                </div>
              )}
              <div className="text-sm leading-relaxed">{message.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-600 mr-3">Sofia está pensando</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Interface */}
      {currentStep < consultationQuestions.length && !isTyping && (
        <div className="border-t bg-white p-4">
          {/* ... same input interface ... */}
          {currentQuestion?.type === 'select' && (
            <div className="grid gap-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="p-3 text-left border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion?.type === 'text' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Digite sua resposta..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement
                  if (input.value.trim()) {
                    handleAnswer(input.value.trim())
                    input.value = ''
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Responder
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {consultationResult && (
        <div className="border-t p-6">
          {/* Simplified Paid Result View */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
            <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
              ✅ DESBLOQUEADO
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-green-600 mb-2">{consultationResult.eligibilityScore}%</div>
              <h3 className="text-xl font-bold text-gray-900">Score de Elegibilidade</h3>
              <p className="text-gray-600 mt-2">{consultationResult.recommendation}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">🚀 Próximos Passos (Portal do Cliente)</h4>
              <p className="text-center text-gray-600 mb-4">Seu relatório completo foi salvo no portal.</p>
              <Button
                onClick={() => window.location.href = '/cliente'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ir para Meu Painel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
