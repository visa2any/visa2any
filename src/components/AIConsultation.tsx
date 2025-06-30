'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, User, Clock, CheckCircle, ArrowRight, Star, Globe, AlertTriangle, Phone, Video, FileText, Download } from 'lucide-react'

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
  const [timeRemaining, setTimeRemaining] = useState(10 * 60) // 10 minutos,  const [consultationResult, setConsultationResult] = useState<ConsultationResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const consultationQuestions = [
    {
      id: 'intro',
      question: "Olá! Sou a Sofia, sua assistente de imigração. Em 10 minutos, vou analisar seu perfil e dar recomendações precisas. Qual seu nome?",
      field: 'name',
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
      question: "Qual sua nacionalidade, {name}?",
      field: 'nationality',
      type: 'select',
      options: ['Brasileira', 'Portuguesa', 'Italiana', 'Espanhola', 'Americana', 'Argentina', 'Outra']
    },
    {
      id: 'destination',
      question: "Para onde você quer se mudar, {name}?",
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

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive, timeRemaining])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const startConsultation = () => {
    setIsActive(true)
    addAIMessage(consultationQuestions[0].question)
  }

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
    const currentQuestion = consultationQuestions[currentStep]
    addUserMessage(answer.toString())
    
    setUserProfile(prev => ({
      ...prev,
      [currentQuestion.field]: answer
    }))

    // Encontrar próxima pergunta válida

    let nextStep = currentStep + 1
    while (nextStep < consultationQuestions.length) {
      const nextQuestion = consultationQuestions[nextStep]
      
      // Verificar se a pergunta deve ser mostrada
      
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
        addAIMessage(consultationQuestions[nextStep].question)
      }, 1000)
    } else {
      // Finalizar consultoria e gerar análise
      setTimeout(() => {
        generateConsultationResult()
      }, 1000)
    }
  }

  const generateConsultationResult = () => {
    const profile = userProfile as UserProfile
    
    // Algoritmo de análise (simplificado)
    
    let score = 50 // Base score
    let complexityLevel: 'simple' | 'moderate' | 'complex' = 'simple'
    let needsHuman = false
    const warnings: string[] = []

    // Análise de educação

    const educationScores: Record<string, number> = {
      'Doutorado': 20, 'Mestrado': 18, 'Pós-graduação': 15,
      'Superior completo': 12, 'Superior incompleto': 8,
      'Ensino médio': 5, 'Ensino fundamental': 2
    }
    score += educationScores[profile.education] || 0

    // Análise de experiência

    const expScores: Record<string, number> = {
      'Mais de 10 anos': 15, '5-10 anos': 12, '3-5 anos': 8,
      '1-3 anos': 5, 'Menos de 1 ano': 2
    }
    score += expScores[profile.experience] || 0

    // Análise de idioma

    const langScores: Record<string, number> = {
      'Nativo': 15, 'Fluente': 12, 'Avançado': 8,
      'Intermediário': 5, 'Básico': 2
    }
    score += langScores[profile.language] || 0

    // Bonificações por país e perfil baseadas na nacionalidade

    if (profile.country === 'Portugal') {
      if (profile.nationality === 'Brasileira') {
        score += 20 // Facilidades CPLP para brasileiros
        if (profile.visaType === 'Cidadania por descendência') score += 15
      } else if (['Angolana', 'Cabo-verdiana', 'Guineense', 'Moçambicana', 'São-tomense', 'Timorense'].includes(profile.nationality)) {
        score += 25 // Outros países CPLP têm ainda mais facilidades
      } else {
        score += 5 // Outros têm menos facilidades
      }
    }
    
    if (profile.country === 'Canadá') {
      // Redução por restrições 2024/2025
      score -= 5
      // Bonificação por francês
      if (profile.french === 'Fluente') score += 20
      else if (profile.french === 'Avançado') score += 15
      else if (profile.french === 'Intermediário') score += 10
      
      // Setores prioritários
      
      if (profile.sector && ['Saúde (médico, enfermeiro, etc)', 'Trades (eletricitista, encanador, etc)'].includes(profile.sector)) {
        score += 15
      }
    }
    
    if (profile.country === 'Alemanha') {
      score += 10 // Chancenkarte facilitando entrada
      if (profile.sector === 'Tecnologia (TI, engenharia)') score += 15
    }
    
    if (profile.country === 'Estados Unidos') {
      // Diferenciações por nacionalidade
      if (profile.nationality === 'Brasileira') {
        score += 5 // Brasil tem boas relações com EUA
        if (profile.education === 'Mestrado' || profile.education === 'Doutorado') {
          score += 15 // EB-2 NIW facilitado para brasileiros qualificados
        }
      } else if (['Mexicana', 'Centro-americana'].includes(profile.nationality)) {
        score -= 10 // Processos mais rigorosos
        warnings.push('Nacionalidade requer análise mais cuidadosa')
      }
      warnings.push('Processos mais rigorosos em 2025 - varia por nacionalidade')
    }
    
    // Análise de idade
    
    if (profile.age >= 25 && profile.age <= 35) score += 10
    else if (profile.age >= 18 && profile.age <= 45) score += 5
    else warnings.push('Idade pode ser um fator limitante para alguns programas')

    // Análise de orçamento

    const budgetScores: Record<string, number> = {
      'Acima de R$ 500.000': 15,
      'R$ 300.000 - R$ 500.000': 12,
      'R$ 100.000 - R$ 300.000': 8,
      'R$ 50.000 - R$ 100.000': 5,
      'Até R$ 50.000': 2
    }
    score += budgetScores[profile.budget] || 0

    // Determinar complexidade e necessidade de consultor humano

    if (profile.visaType === 'Refugio/Asilo' || profile.visaType === 'Outro') {
      complexityLevel = 'complex'
      needsHuman = true
      warnings.push('Caso complexo requer análise especializada')
    } else if (profile.timeline === 'Até 6 meses' || profile.family === 'Família extensa') {
      complexityLevel = 'moderate'
      if (score < 60) needsHuman = true
    }

    if (score < 40) {
      needsHuman = true
      warnings.push('Perfil requer estratégia personalizada')
    }

    // Gerar recomendações

    let recommendation = ''
    let timeline = ''
    let cost = ''
    let documents: string[] = []
    let nextSteps: string[] = []

    if (score >= 80) {
      recommendation = `Excelente! Seu perfil é muito forte para ${profile.country}. Nossa metodologia maximiza suas chances de aprovação.`
      timeline = 'Processo pode ser concluído em 6-12 meses'
      cost = 'R$ 15.000 - R$ 30.000'
      documents = ['Diploma apostilado', 'Comprovante de experiência', 'Teste de idioma', 'Exames médicos']
      nextSteps = ['Teste de proficiência no idioma', 'Validação de diplomas', 'Submissão de EOI/Aplicação']
    } else if (score >= 60) {
      recommendation = `Bom perfil! Com nossa estratégia personalizada, suas chances aumentam significativamente.`
      timeline = 'Preparação de 6-12 meses + processo de 12-18 meses'
      cost = 'R$ 20.000 - R$ 40.000'
      documents = ['Documentos acadêmicos', 'Certificações profissionais', 'Teste de idioma', 'Comprovantes financeiros']
      nextSteps = ['Melhorar proficiência no idioma', 'Obter certificações na área', 'Plano de fortalecimento do perfil']
    } else {
      recommendation = `Perfil desafiador, mas nossa experiência pode fazer a diferença. Estratégia especializada recomendada.`
      timeline = 'Preparação de 12-24 meses + processo'
      cost = 'R$ 25.000 - R$ 50.000'
      documents = ['Documentação completa', 'Certificações adicionais', 'Cursos de qualificação']
      nextSteps = ['Plano de melhoria do perfil', 'Educação adicional', 'Experiência internacional']
      needsHuman = true
    }

    const result: ConsultationResult = {
      eligibilityScore: Math.min(score, 100),
      recommendation,
      timeline,
      estimatedCost: cost,
      requiredDocuments: documents,
      nextSteps,
      needsHumanConsultant: needsHuman,
      complexityLevel,
      warningFlags: warnings
    }

    setConsultationResult(result)
    
    // Apresentar resultado
    
    addAIMessage(
      `✅ Análise concluída, ${profile.name}! Seu score para ${profile.country} é ${Math.min(score, 100)}%. ${recommendation}`
    )

    setTimeout(() => {
      addAIMessage(
        `📋 Esta foi sua pré-análise gratuita. Para um relatório completo com documentos e estratégia detalhada, veja as opções abaixo dos resultados.`
      )
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = consultationQuestions[currentStep]

  if (!isActive) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl max-w-2xl mx-auto">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            🤖 Análise IA Gratuita
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            <strong>10 minutos</strong> de análise inteligente do seu perfil de imigração
          </p>
          
          <div className="bg-white p-4 rounded-xl mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">✨ O que você receberá:</h4>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Score personalizado de elegibilidade</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Timeline e investimento estimado</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Próximos passos recomendados</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Pontos de atenção importantes</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={startConsultation}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full"
          >
            <Bot className="mr-2 h-5 w-5" />
            Começar Análise Gratuita
          </Button>
          
          <p className="text-xs text-gray-500 mt-3">
            ✅ 100% gratuito • ⚡ Resultado em 10min • 🛡️ Dados seguros
          </p>
        </div>
      </div>
    )
  }

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
            <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-blue-100">tempo restante</div>
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
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl ${
                message.isAI
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
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-2">
              Pergunta {currentStep + 1} de {consultationQuestions.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / consultationQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          
          {currentQuestion.type === 'select' && (
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
          
          {currentQuestion.type === 'text' && (
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
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-green-600 mb-2">{consultationResult.eligibilityScore}%</div>
              <h3 className="text-xl font-bold text-gray-900">Score de Elegibilidade</h3>
              <p className="text-gray-600 mt-2">{consultationResult.recommendation}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Timeline</h4>
                <p className="text-sm text-gray-600">{consultationResult.timeline}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">💰 Investimento</h4>
                <p className="text-sm text-gray-600">{consultationResult.estimatedCost}</p>
              </div>
            </div>

            {consultationResult.warningFlags.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Pontos importantes:</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {consultationResult.warningFlags.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center space-y-4">
              <h4 className="text-lg font-bold text-gray-900">🚀 Próximos passos:</h4>
              
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={() => window.open('/checkout?product=relatorio-premium', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
                >
                  <div className="text-lg font-bold mb-1">📊 Relatório Completo</div>
                  <div className="text-sm opacity-90">R$ 97 - PDF detalhado</div>
                </button>
                
                <button
                  onClick={() => window.open('/checkout?product=consultoria-express', '_blank')}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors"
                >
                  <div className="text-lg font-bold mb-1">👨‍💼 Consultoria 1:1</div>
                  <div className="text-sm opacity-90">R$ 297 - 60min especialista</div>
                </button>
              </div>
              
              <button
                onClick={() => setIsActive(false)}
                className="text-gray-600 hover:text-gray-800 underline text-sm mt-4"
              >
                Fazer nova análise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
