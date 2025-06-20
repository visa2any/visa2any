'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Download, Calculator, Star, Trophy, Target, X } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  type: 'select' | 'range' | 'radio' | 'checkbox'
  options?: string[]
  required: boolean
  weight: number
}

interface QuizResult {
  score: number
  level: 'excellent' | 'good' | 'moderate' | 'challenging'
  recommendations: string[]
  nextSteps: string[]
}

export default function EligibilityCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' })

  const questions: QuizQuestion[] = [
    {
      id: 'destination',
      question: 'Para qual país você deseja viajar?',
      type: 'select',
      options: ['Estados Unidos', 'Canadá', 'Austrália', 'Portugal', 'Alemanha', 'Reino Unido', 'França', 'Holanda', 'Irlanda', 'Suécia', 'Nova Zelândia', 'Chile', 'Uruguai', 'Outros'],
      required: true,
      weight: 15
    },
    {
      id: 'visa-type',
      question: 'Qual tipo de visto você precisa?',
      type: 'select',
      options: ['Turismo', 'Trabalho', 'Estudo', 'Investimento', 'Reunificação familiar'],
      required: true,
      weight: 20
    },
    {
      id: 'age',
      question: 'Qual sua idade?',
      type: 'range',
      required: true,
      weight: 10
    },
    {
      id: 'education',
      question: 'Qual seu nível de escolaridade?',
      type: 'select',
      options: ['Ensino fundamental', 'Ensino médio', 'Ensino superior', 'Pós-graduação', 'Mestrado/Doutorado'],
      required: true,
      weight: 15
    },
    {
      id: 'english-level',
      question: 'Qual seu nível de inglês?',
      type: 'select',
      options: ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'],
      required: true,
      weight: 12
    },
    {
      id: 'french-level',
      question: 'Qual seu nível de francês?',
      type: 'select',
      options: ['Nenhum', 'Básico', 'Intermediário', 'Avançado', 'Fluente'],
      required: false,
      weight: 10
    },
    {
      id: 'financial-situation',
      question: 'Qual sua situação financeira?',
      type: 'select',
      options: ['Até R$ 50k em conta', 'R$ 50k - R$ 100k', 'R$ 100k - R$ 500k', 'Acima de R$ 500k'],
      required: true,
      weight: 18
    },
    {
      id: 'job-situation',
      question: 'Qual sua situação profissional?',
      type: 'select',
      options: ['Desempregado', 'Empregado CLT', 'Funcionário público', 'Empresário', 'Freelancer/Autônomo'],
      required: true,
      weight: 10
    }
  ]

  const calculateScore = async () => {
    let totalScore = 0
    let maxScore = 0

    questions.forEach(question => {
      maxScore += question.weight
      const answer = answers[question.id]
      
      if (!answer) return

      let questionScore = 0

      switch (question.id) {
        case 'destination':
          const countryScores: Record<string, number> = {
            'Estados Unidos': 8, 'Canadá': 7, 'Austrália': 9, 'Portugal': 9,
            'Alemanha': 9, 'Reino Unido': 7, 'França': 7, 'Holanda': 8,
            'Irlanda': 8, 'Suécia': 8, 'Nova Zelândia': 9, 'Chile': 7,
            'Uruguai': 8, 'Outros': 6
          }
          questionScore = (countryScores[answer] || 6) / 10 * question.weight
          break

        case 'visa-type':
          const visaScores: Record<string, number> = {
            'Turismo': 9, 'Trabalho': 7, 'Estudo': 8, 
            'Investimento': 6, 'Reunificação familiar': 8
          }
          questionScore = (visaScores[answer] || 7) / 10 * question.weight
          break

        case 'age':
          if (answer >= 25 && answer <= 35) questionScore = question.weight
          else if (answer >= 18 && answer <= 45) questionScore = question.weight * 0.8
          else questionScore = question.weight * 0.6
          break

        case 'education':
          const eduScores: Record<string, number> = {
            'Ensino fundamental': 4, 'Ensino médio': 6, 'Ensino superior': 8,
            'Pós-graduação': 9, 'Mestrado/Doutorado': 10
          }
          questionScore = (eduScores[answer] || 6) / 10 * question.weight
          break

        case 'english-level':
          const engScores: Record<string, number> = {
            'Básico': 5, 'Intermediário': 7, 'Avançado': 9, 
            'Fluente': 10, 'Nativo': 10
          }
          questionScore = (engScores[answer] || 5) / 10 * question.weight
          break

        case 'financial-situation':
          const finScores: Record<string, number> = {
            'Até R$ 50k em conta': 6, 'R$ 50k - R$ 100k': 7,
            'R$ 100k - R$ 500k': 9, 'Acima de R$ 500k': 10
          }
          questionScore = (finScores[answer] || 6) / 10 * question.weight
          break

        case 'job-situation':
          const jobScores: Record<string, number> = {
            'Desempregado': 4, 'Empregado CLT': 8, 'Funcionário público': 9,
            'Empresário': 9, 'Freelancer/Autônomo': 7
          }
          questionScore = (jobScores[answer] || 6) / 10 * question.weight
          break

        case 'french-level':
          const frenchScores: Record<string, number> = {
            'Nenhum': 5, 'Básico': 6, 'Intermediário': 8,
            'Avançado': 9, 'Fluente': 10
          }
          // Bonificação extra para francês se destino for Canadá
          let frenchMultiplier = 1
          if (answers['destination'] === 'Canadá' && answer !== 'Nenhum') {
            frenchMultiplier = 1.5 // 50% bonus para Canadá
          }
          questionScore = (frenchScores[answer] || 5) / 10 * question.weight * frenchMultiplier
          break
      }

      totalScore += questionScore
    })

    const percentage = (totalScore / maxScore) * 100
    
    let level: QuizResult['level']
    let recommendations: string[] = []
    let nextSteps: string[] = []

    if (percentage >= 85) {
      level = 'excellent'
      recommendations = [
        '🎉 Excelente! Seu perfil é muito forte',
        '✅ Nossa metodologia maximiza suas chances',
        '⚡ Processo acelerado disponível',
        '🏆 Candidato prioritário'
      ]
      nextSteps = [
        'Agende consultoria VIP gratuita',
        'Preparação de documentos expressa',
        'Submissão em 7 dias úteis'
      ]
    } else if (percentage >= 70) {
      level = 'good'
      recommendations = [
        '✅ Bom perfil! Estratégia personalizada recomendada',
        '📈 Nossa experiência aumenta suas chances significativamente',
        '📋 Alguns documentos adicionais podem ser necessários',
        '⏰ Tempo estimado: 15-20 dias'
      ]
      nextSteps = [
        'Consultoria gratuita personalizada',
        'Plano de fortalecimento do perfil',
        'Preparação estratégica de documentos'
      ]
    } else if (percentage >= 50) {
      level = 'moderate'
      recommendations = [
        '⚠️ Perfil moderado - estratégia especializada recomendada',
        '📊 Nossa metodologia comprovada pode fazer a diferença',
        '🔧 Melhorias necessárias no perfil',
        '📚 Preparação mais detalhada recomendada'
      ]
      nextSteps = [
        'Consultoria especializada obrigatória',
        'Plano de melhoria do perfil (3-6 meses)',
        'Documentação estratégica personalizada'
      ]
    } else {
      level = 'challenging'
      recommendations = [
        '🔍 Perfil desafiador - nossa experiência é fundamental',
        '⚡ Estratégia intensiva pode transformar seu caso',
        '📈 Fortalecimento significativo do perfil recomendado',
        '🎯 Foco em melhorias específicas'
      ]
      nextSteps = [
        'Consultoria intensiva com especialista senior',
        'Plano de fortalecimento de 6-12 meses',
        'Estratégia alternativa de vistos'
      ]
    }

    // Salvar no backend e criar conta automaticamente se usuário forneceu dados
    if (userInfo.name && userInfo.email) {
      try {
        // Criar conta do cliente automaticamente
        const accountData = {
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          targetCountry: answers['destination'],
          visaType: answers['visa-type'],
          source: 'eligibility_calculator',
          product: 'Análise de Elegibilidade Gratuita',
          amount: 0
        }

        const accountResponse = await fetch('/api/auth/unified/auto-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountData)
        })

        if (accountResponse.ok) {
          const accountResult = await accountResponse.json()
          
          // Salvar resultado da análise
          const analysisData = {
            clientId: accountResult.user.id,
            score: Math.round(percentage),
            level: level,
            answers: answers,
            recommendations: recommendations,
            nextSteps: nextSteps
          }

          const analysisResponse = await fetch('/api/analysis/save-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analysisData)
          })

          if (analysisResponse.ok) {
            console.log('✅ Análise salva com sucesso e conta criada automaticamente')
          }
        }
      } catch (error) {
        console.error('Erro ao salvar no backend:', error)
      }
    }

    setResult({
      score: Math.round(percentage),
      level,
      recommendations,
      nextSteps
    })
    setShowResult(true)
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await calculateScore()
    }
  }

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
    setResult(null)
    setUserInfo({ name: '', email: '', phone: '' })
  }

  const openQuiz = () => {
    setIsOpen(true)
    // Esconder ChatBot durante análise
    window.dispatchEvent(new CustomEvent('hideChatBot'))
  }

  const closeQuiz = () => {
    setIsOpen(false)
    // Mostrar ChatBot novamente
    window.dispatchEvent(new CustomEvent('showChatBot'))
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <Trophy className="h-8 w-8 text-green-600" />
      case 'good': return <Star className="h-8 w-8 text-blue-600" />
      case 'moderate': return <Target className="h-8 w-8 text-yellow-600" />
      default: return <AlertCircle className="h-8 w-8 text-red-600" />
    }
  }

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
        <div className="text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Calculadora de Elegibilidade
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Descubra suas chances de aprovação em <strong>2 minutos</strong>
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Análise Instantânea</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Relatório Personalizado</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Download className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium">PDF Gratuito</div>
            </div>
          </div>
          <Button 
            onClick={openQuiz}
            className="btn-gradient text-lg px-8 py-4"
          >
            Começar Análise Gratuita
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            ✅ 100% gratuito • ⚡ Resultado instantâneo • 🔒 Dados protegidos
          </p>
        </div>
      </div>
    )
  }

  if (showResult && result) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {getScoreIcon(result.level)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sua Análise de Elegibilidade
          </h2>
          <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-4`}>
            {result.score}%
          </div>
          <p className="text-xl text-gray-600">
            Score de elegibilidade para seu visto
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recommendations */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Análise do Seu Perfil
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              Próximos Passos
            </h3>
            <ul className="space-y-3">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Info Collection */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white mb-6">
          <h3 className="text-xl font-semibold mb-4">
            📄 Receba seu Relatório Detalhado GRATUITO
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              className="p-3 rounded-lg text-gray-900"
            />
            <input
              type="email"
              placeholder="Seu melhor email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              className="p-3 rounded-lg text-gray-900"
            />
            <input
              type="tel"
              placeholder="WhatsApp"
              value={userInfo.phone}
              onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="p-3 rounded-lg text-gray-900"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 flex-1"
              disabled={!userInfo.name || !userInfo.email}
              onClick={async () => {
                // Reprocessar para salvar no backend
                await calculateResult()
                // Depois de salvar, mostrar opção de acessar portal
                setTimeout(() => {
                  const portalBtn = document.getElementById('portal-access-btn')
                  if (portalBtn) portalBtn.style.display = 'block'
                }, 1000)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Relatório + Criar Conta
            </Button>
            
            <Button
              id="portal-access-btn"
              onClick={() => {
                // Mostrar ChatBot novamente antes de redirecionar
                window.dispatchEvent(new CustomEvent('showChatBot'))
                window.location.href = '/cliente'
              }}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
              style={{ display: 'none' }}
            >
              👤 Acessar Meu Portal
            </Button>
          </div>
          
          {userInfo.name && userInfo.email && (
            <div className="mt-4 p-3 bg-white/20 rounded-lg">
              <div className="text-center text-sm">
                ✅ <strong>Conta será criada automaticamente</strong><br/>
                📧 Acesso enviado para {userInfo.email}<br/>
                🔐 Login automático após confirmação
              </div>
            </div>
          )}
        </div>

        {/* Pricing Plans Post-Analysis */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            🚀 Acelere seu processo com nossos pacotes
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Pacote Premium */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
              <div className="text-center mb-3">
                <h4 className="font-bold text-blue-600">📄 Relatório Premium</h4>
                <div className="text-2xl font-bold text-blue-600">R$ 97</div>
                <div className="text-sm text-gray-600">Análise completa</div>
              </div>
              <ul className="text-xs space-y-1 mb-3">
                <li>✅ Relatório PDF 15+ páginas</li>
                <li>✅ Lista completa documentos</li>
                <li>✅ Timeline personalizado</li>
                <li>✅ Custos estimados</li>
              </ul>
              <button 
                onClick={() => {
                  window.location.href = '/precos'
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Adquirir Agora
              </button>
            </div>

            {/* Pacote Consultoria */}
            <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
              <div className="text-center mb-3">
                <h4 className="font-bold text-green-600">👨‍💼 Consultoria 1:1</h4>
                <div className="text-2xl font-bold text-green-600">R$ 297</div>
                <div className="text-sm text-gray-600">Orientação humana</div>
              </div>
              <ul className="text-xs space-y-1 mb-3">
                <li>✅ Tudo do pacote anterior</li>
                <li>✅ 60min com especialista</li>
                <li>✅ Análise ao vivo</li>
                <li>✅ Plano de ação</li>
                <li>✅ Suporte WhatsApp 30 dias</li>
              </ul>
              <button 
                onClick={() => {
                  window.location.href = '/precos'
                }}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Adquirir Agora
              </button>
            </div>

            {/* Pacote VIP */}
            <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  👑 VIP
                </div>
              </div>
              <div className="text-center mb-3 mt-2">
                <h4 className="font-bold text-purple-600">👑 Serviço VIP</h4>
                <div className="text-2xl font-bold text-purple-600">R$ 2.497</div>
                <div className="text-sm text-gray-600">Fazemos tudo para você</div>
              </div>
              <ul className="text-xs space-y-1 mb-3">
                <li>✅ Tudo dos pacotes anteriores</li>
                <li>✅ Preparação completa docs</li>
                <li>✅ Submissão da aplicação</li>
                <li>✅ Acompanhamento total</li>
                <li>✅ Suporte ilimitado</li>
                <li>🛡️ Garantia retrabalho</li>
              </ul>
              <button 
                onClick={() => {
                  window.location.href = '/precos'
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700"
              >
                Adquirir Agora
              </button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">
              💡 Preços podem variar por país e complexidade. <a href="/precos" className="text-blue-600 underline">Ver preços específicos</a>
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={resetQuiz} variant="outline">
            Refazer Análise
          </Button>
          <Button 
            onClick={() => {
              // Mostrar ChatBot novamente e fechar quiz
              resetQuiz()
              // Pequeno delay para garantir que ChatBot apareça
              setTimeout(() => {
                // Trigger abertura do ChatBot se necessário
                const chatButton = document.querySelector('[class*="MessageCircle"]')?.parentElement as HTMLElement
                if (chatButton) chatButton.click()
              }, 100)
            }}
            className="btn-gradient"
          >
            Falar com Especialista Agora
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-8">
        {/* Close button */}
        <button
          onClick={closeQuiz}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar calculadora"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Progress Bar */}
        <div className="mb-8 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Pergunta {currentStep + 1} de {questions.length}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% completo</span>
          </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === 'select' && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  answers[currentQuestion.id] === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'range' && (
          <div className="space-y-4">
            <input
              type="range"
              min="18"
              max="65"
              value={answers[currentQuestion.id] || 25}
              onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">
                {answers[currentQuestion.id] || 25} anos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          onClick={prevQuestion}
          variant="outline"
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button 
          onClick={nextQuestion}
          className="btn-gradient"
          disabled={!answers[currentQuestion.id]}
        >
          {currentStep === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
        </Button>
      </div>
      </div>
    </div>
  )
}