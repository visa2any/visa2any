'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Target, 
  Globe, 
  Clock,
  Award,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'

interface QualificationStep {
  id: string
  title: string
  description: string
  questions: Array<{
    id: string
    text: string
    type: 'select' | 'range' | 'multiselect' | 'text'
    options?: string[]
    min?: number
    max?: number
    required: boolean
    weight: number
  }>
}

interface LeadData {
  email: string
  name: string
  phone?: string
  responses: Record<string, any>
  score: number
  category: 'hot' | 'warm' | 'cold'
  priority: 'high' | 'medium' | 'low'
  nextAction: string
}

const QUALIFICATION_STEPS: QualificationStep[] = [
  {
    id: 'basic-info',
    title: 'Informações Básicas',
    description: 'Vamos conhecer você melhor',
    questions: [
      {
        id: 'name',
        text: 'Qual seu nome completo?',
        type: 'text',
        required: true,
        weight: 1
      },
      {
        id: 'email',
        text: 'Qual seu melhor email?',
        type: 'text',
        required: true,
        weight: 1
      },
      {
        id: 'phone',
        text: 'WhatsApp para contato',
        type: 'text',
        required: false,
        weight: 2
      },
      {
        id: 'age',
        text: 'Qual sua idade?',
        type: 'range',
        min: 18,
        max: 65,
        required: true,
        weight: 3
      }
    ]
  },
  {
    id: 'destination',
    title: 'Destino e Objetivo',
    description: 'Para onde você quer ir?',
    questions: [
      {
        id: 'country',
        text: 'Qual país é seu destino principal?',
        type: 'select',
        options: [
          'Estados Unidos', 'Canadá', 'Austrália', 'Portugal', 'Alemanha', 
          'Reino Unido', 'França', 'Holanda', 'Irlanda', 'Suécia', 
          'Nova Zelândia', 'Chile', 'Uruguai', 'Outro'
        ],
        required: true,
        weight: 5
      },
      {
        id: 'visa-type',
        text: 'Qual tipo de visto você busca?',
        type: 'select',
        options: [
          'Trabalho', 'Estudo', 'Investimento', 'Reunificação familiar',
          'Cidadania por descendência', 'Refugio/Asilo', 'Turismo', 'Outro'
        ],
        required: true,
        weight: 5
      },
      {
        id: 'timeline',
        text: 'Em quanto tempo você precisa estar no destino?',
        type: 'select',
        options: [
          'Até 6 meses', '6 meses a 1 ano', '1 a 2 anos', 
          '2 a 5 anos', 'Sem pressa específica'
        ],
        required: true,
        weight: 4
      },
      {
        id: 'motivation',
        text: 'Qual sua principal motivação?',
        type: 'multiselect',
        options: [
          'Melhores oportunidades de trabalho',
          'Qualidade de vida',
          'Educação para filhos',
          'Segurança',
          'Estabilidade econômica',
          'Aventura/experiência',
          'Reunir com família',
          'Fugir da situação atual'
        ],
        required: true,
        weight: 3
      }
    ]
  },
  {
    id: 'profile',
    title: 'Seu Perfil',
    description: 'Vamos avaliar suas qualificações',
    questions: [
      {
        id: 'education',
        text: 'Qual sua escolaridade máxima?',
        type: 'select',
        options: [
          'Ensino fundamental', 'Ensino médio', 'Superior incompleto',
          'Superior completo', 'Pós-graduação', 'Mestrado', 'Doutorado'
        ],
        required: true,
        weight: 4
      },
      {
        id: 'experience',
        text: 'Quantos anos de experiência profissional você tem?',
        type: 'select',
        options: [
          'Menos de 1 ano', '1-3 anos', '3-5 anos', 
          '5-10 anos', 'Mais de 10 anos'
        ],
        required: true,
        weight: 4
      },
      {
        id: 'language',
        text: 'Qual seu nível no idioma do país de destino?',
        type: 'select',
        options: ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'],
        required: true,
        weight: 5
      },
      {
        id: 'profession',
        text: 'Qual sua área profissional?',
        type: 'select',
        options: [
          'Tecnologia/TI', 'Saúde', 'Educação', 'Engenharia',
          'Administração/Gestão', 'Direito', 'Finanças',
          'Marketing/Vendas', 'Construção/Trades', 'Outros'
        ],
        required: true,
        weight: 3
      }
    ]
  },
  {
    id: 'financial',
    title: 'Situação Financeira',
    description: 'Vamos entender sua capacidade de investimento',
    questions: [
      {
        id: 'budget',
        text: 'Qual seu orçamento total para o processo?',
        type: 'select',
        options: [
          'Até R$ 10.000', 'R$ 10.000 - R$ 50.000',
          'R$ 50.000 - R$ 100.000', 'R$ 100.000 - R$ 300.000',
          'R$ 300.000 - R$ 500.000', 'Acima de R$ 500.000'
        ],
        required: true,
        weight: 5
      },
      {
        id: 'savings',
        text: 'Você tem comprovação de renda/patrimônio?',
        type: 'select',
        options: [
          'Sim, completa e organizada',
          'Sim, mas precisa organizar',
          'Parcialmente',
          'Não tenho certeza',
          'Não possuo'
        ],
        required: true,
        weight: 4
      },
      {
        id: 'urgency',
        text: 'Qual seu nível de urgência para começar?',
        type: 'select',
        options: [
          'Extremamente urgente (preciso sair já)',
          'Muito urgente (próximos 3 meses)',
          'Urgente (próximos 6 meses)',
          'Moderado (próximo ano)',
          'Estou apenas pesquisando'
        ],
        required: true,
        weight: 5
      }
    ]
  },
  {
    id: 'commitment',
    title: 'Nível de Comprometimento',
    description: 'Vamos verificar sua seriedade',
    questions: [
      {
        id: 'research',
        text: 'Quanto você já pesquisou sobre imigração?',
        type: 'select',
        options: [
          'Muito - conheço bem o processo',
          'Moderado - sei o básico',
          'Pouco - estou começando a pesquisar',
          'Nada - é minha primeira pesquisa'
        ],
        required: true,
        weight: 3
      },
      {
        id: 'obstacles',
        text: 'Qual o maior obstáculo que você vê?',
        type: 'select',
        options: [
          'Dinheiro/orçamento',
          'Documentação complexa',
          'Idioma',
          'Não sei por onde começar',
          'Tempo/prazo',
          'Medo de rejeição',
          'Família/dependentes'
        ],
        required: true,
        weight: 3
      },
      {
        id: 'help-level',
        text: 'Que tipo de ajuda você precisa?',
        type: 'multiselect',
        options: [
          'Análise completa do meu caso',
          'Lista de documentos necessários',
          'Estratégia personalizada',
          'Acompanhamento passo-a-passo',
          'Apenas orientações básicas',
          'Preciso fazer tudo sozinho'
        ],
        required: true,
        weight: 4
      }
    ]
  }
]

interface LeadQualificationProps {
  onComplete?: (leadData: LeadData) => void
  className?: string
}

export default function LeadQualification({ onComplete, className = '' }: LeadQualificationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [leadScore, setLeadScore] = useState(0)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepData = QUALIFICATION_STEPS[currentStep]
  const progress = ((currentStep + 1) / QUALIFICATION_STEPS.length) * 100

  const handleAnswer = (questionId: string, answer: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = (allResponses: Record<string, any>) => {
    let totalScore = 0
    let maxPossibleScore = 0

    QUALIFICATION_STEPS.forEach(step => {
      step.questions.forEach(question => {
        maxPossibleScore += question.weight * 10 // Peso máximo 10

        const response = allResponses[question.id]
        if (!response) return

        let questionScore = 0

        // Pontuação baseada nas respostas específicas
        switch (question.id) {
          case 'age':
            if (response >= 25 && response <= 35) questionScore = 10
            else if (response >= 18 && response <= 45) questionScore = 8
            else questionScore = 5
            break

          case 'country':
            const highValueCountries = ['Canadá', 'Austrália', 'Portugal', 'Alemanha']
            questionScore = highValueCountries.includes(response) ? 10 : 7
            break

          case 'visa-type':
            const easyVisaTypes = ['Trabalho', 'Estudo', 'Cidadania por descendência']
            questionScore = easyVisaTypes.includes(response) ? 10 : 6
            break

          case 'timeline':
            const timelineScores: Record<string, number> = {
              'Até 6 meses': 10,
              '6 meses a 1 ano': 9,
              '1 a 2 anos': 8,
              '2 a 5 anos': 6,
              'Sem pressa específica': 4
            }
            questionScore = timelineScores[response] || 5
            break

          case 'education':
            const educationScores: Record<string, number> = {
              'Doutorado': 10,
              'Mestrado': 9,
              'Pós-graduação': 8,
              'Superior completo': 7,
              'Superior incompleto': 5,
              'Ensino médio': 3,
              'Ensino fundamental': 1
            }
            questionScore = educationScores[response] || 3
            break

          case 'experience':
            const expScores: Record<string, number> = {
              'Mais de 10 anos': 10,
              '5-10 anos': 9,
              '3-5 anos': 7,
              '1-3 anos': 5,
              'Menos de 1 ano': 3
            }
            questionScore = expScores[response] || 3
            break

          case 'language':
            const langScores: Record<string, number> = {
              'Nativo': 10,
              'Fluente': 9,
              'Avançado': 8,
              'Intermediário': 6,
              'Básico': 3
            }
            questionScore = langScores[response] || 3
            break

          case 'budget':
            const budgetScores: Record<string, number> = {
              'Acima de R$ 500.000': 10,
              'R$ 300.000 - R$ 500.000': 9,
              'R$ 100.000 - R$ 300.000': 8,
              'R$ 50.000 - R$ 100.000': 6,
              'R$ 10.000 - R$ 50.000': 4,
              'Até R$ 10.000': 2
            }
            questionScore = budgetScores[response] || 2
            break

          case 'urgency':
            const urgencyScores: Record<string, number> = {
              'Extremamente urgente (preciso sair já)': 10,
              'Muito urgente (próximos 3 meses)': 9,
              'Urgente (próximos 6 meses)': 8,
              'Moderado (próximo ano)': 6,
              'Estou apenas pesquisando': 2
            }
            questionScore = urgencyScores[response] || 3
            break

          default:
            questionScore = 7 // Score padrão
        }

        totalScore += questionScore * question.weight
      })
    })

    return Math.round((totalScore / maxPossibleScore) * 100)
  }

  const categorizeAndPrioritize = (score: number, responses: Record<string, any>) => {
    let category: 'hot' | 'warm' | 'cold' = 'cold'
    let priority: 'high' | 'medium' | 'low' = 'low'
    let nextAction = ''

    const hasHighBudget = ['R$ 300.000 - R$ 500.000', 'Acima de R$ 500.000'].includes(responses.budget)
    const isUrgent = ['Extremamente urgente (preciso sair já)', 'Muito urgente (próximos 3 meses)'].includes(responses.urgency)
    const hasGoodProfile = ['Superior completo', 'Pós-graduação', 'Mestrado', 'Doutorado'].includes(responses.education)

    if (score >= 75 || (score >= 60 && (hasHighBudget || isUrgent))) {
      category = 'hot'
      priority = 'high'
      nextAction = 'Ligar imediatamente - Agendar consultoria premium'
    } else if (score >= 50 || (score >= 40 && hasGoodProfile)) {
      category = 'warm'
      priority = 'medium'
      nextAction = 'Email personalizado + Oferecer análise IA gratuita'
    } else {
      category = 'cold'
      priority = 'low'
      nextAction = 'Nutrir com conteúdo educativo + Lead magnets'
    }

    return { category, priority, nextAction }
  }

  const canProceed = () => {
    const requiredQuestions = currentStepData.questions.filter(q => q.required)
    return requiredQuestions.every(q => responses[q.id])
  }

  const handleNext = () => {
    if (currentStep < QUALIFICATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      const score = calculateScore(responses)
      const { category, priority, nextAction } = categorizeAndPrioritize(score, responses)

      const finalLeadData: LeadData = {
        email: responses.email,
        name: responses.name,
        phone: responses.phone,
        responses,
        score,
        category,
        priority,
        nextAction
      }

      setLeadScore(score)
      setLeadData(finalLeadData)
      setIsCompleted(true)

      // Salvar lead qualificado na base de dados
      await fetch('/api/leads/qualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalLeadData),
      })

      // Trigger automação de follow-up
      await fetch('/api/automation/lead-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: responses.email,
          category,
          priority,
          action: nextAction
        }),
      })

      if (onComplete) {
        onComplete(finalLeadData)
      }

    } catch (error) {
      console.error('Erro ao processar qualificação:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted && leadData) {
    return (
      <div className={`bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Análise Concluída! 🎉
          </h2>
          <p className="text-gray-600 text-lg">
            Obrigado, {leadData.name}! Analisamos seu perfil e temos ótimas notícias.
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seu Score de Elegibilidade</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2">{leadScore}/100</div>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
              leadData.category === 'hot' ? 'bg-red-100 text-red-800' :
              leadData.category === 'warm' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {leadData.category === 'hot' ? '🔥 Perfil Excelente' :
               leadData.category === 'warm' ? '⚡ Bom Potencial' :
               '💙 Potencial a Desenvolver'}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4 mb-8">
          {leadData.category === 'hot' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">🚀 Recomendação Especial</h4>
              <p className="text-red-700 text-sm">
                Seu perfil é EXCELENTE! Você tem grandes chances de sucesso. 
                Nossa equipe vai entrar em contato nas próximas 2 horas para 
                agendar uma consultoria premium gratuita.
              </p>
            </div>
          )}

          {leadData.category === 'warm' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚡ Ótimo Potencial</h4>
              <p className="text-yellow-700 text-sm">
                Você tem um bom perfil! Com nossa estratégia personalizada, 
                suas chances aumentam significativamente. Vamos te enviar 
                uma análise detalhada por email.
              </p>
            </div>
          )}

          {leadData.category === 'cold' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💙 Vamos te Preparar</h4>
              <p className="text-blue-700 text-sm">
                Seu perfil tem potencial! Vamos te ajudar a melhorar suas 
                chances com nossos materiais gratuitos e estratégias 
                personalizadas.
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Próximos Passos:</h3>
          
          {leadData.category === 'hot' && (
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = '/precos'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Agendar Consultoria VIP
              </Button>
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => window.location.href = '/lead-magnets'}
              >
                <FileText className="h-4 w-4 mr-2" />
                Receber Análise Detalhada
              </Button>
            </div>
          )}

          {leadData.category === 'warm' && (
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => window.location.href = '/consultoria-ia'}
              >
                <Target className="h-4 w-4 mr-2" />
                Análise IA Gratuita
              </Button>
              <Button 
                variant="outline"
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                onClick={() => window.location.href = '/lead-magnets'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Materiais Gratuitos
              </Button>
            </div>
          )}

          {leadData.category === 'cold' && (
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/lead-magnets'}
              >
                <FileText className="h-4 w-4 mr-2" />
                Guias Gratuitos
              </Button>
              <Button 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/blog'}
              >
                <Star className="h-4 w-4 mr-2" />
                Conteúdo Educativo
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          ✅ Seus dados estão seguros • 📧 Não fazemos spam • 🎯 Conteúdo personalizado
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Qualificação Inteligente
          </h2>
          <div className="text-sm text-gray-500">
            Etapa {currentStep + 1} de {QUALIFICATION_STEPS.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600">{currentStepData.description}</p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {currentStepData.questions.map((question) => (
          <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {question.type === 'select' && (
              <div className="grid gap-3">
                {question.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`p-4 text-left border-2 rounded-lg transition-all ${
                      responses[question.id] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'multiselect' && (
              <div className="grid gap-3">
                {question.options?.map((option) => {
                  const currentValues = responses[question.id] || []
                  const isSelected = currentValues.includes(option)
                  
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        const newValues = isSelected
                          ? currentValues.filter((v: string) => v !== option)
                          : [...currentValues, option]
                        handleAnswer(question.id, newValues)
                      }}
                      className={`p-4 text-left border-2 rounded-lg transition-all flex items-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      {option}
                    </button>
                  )
                })}
              </div>
            )}

            {question.type === 'text' && (
              <input
                type={question.id === 'email' ? 'email' : question.id === 'phone' ? 'tel' : 'text'}
                value={responses[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder={`Digite ${question.text.toLowerCase()}`}
              />
            )}

            {question.type === 'range' && (
              <div className="space-y-4">
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={responses[question.id] || question.min}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{question.min}</span>
                  <span className="font-semibold text-blue-600">
                    {responses[question.id] || question.min} anos
                  </span>
                  <span>{question.max}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3"
        >
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processando...
            </div>
          ) : currentStep === QUALIFICATION_STEPS.length - 1 ? (
            <>
              Finalizar Análise
              <CheckCircle className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Próximo
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}