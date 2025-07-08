'use client'

import { useState, useEffect } from 'react'
import { 
  Mic, MicOff, Play, Pause, RotateCcw, CheckCircle, AlertTriangle,
  User, Globe, Calendar, Clock, Target, Award, Brain, Video,
  BookOpen, MessageSquare, Lightbulb, Star, TrendingUp, FileText,
  Headphones, Volume2, VolumeX, Timer, Zap, Eye, Heart
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface InterviewQuestion {
  id: string
  question: string
  category: 'personal' | 'travel' | 'financial' | 'background' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  tips: string[]
  goodAnswerExample: string
  commonMistakes: string[]
  timeLimit: number
}

interface MockInterview {
  id: string
  country: string
  visaType: string
  questions: InterviewQuestion[]
  duration: number
  difficulty: string
}

interface InterviewSession {
  id: string
  mockInterviewId: string
  startTime: Date
  endTime?: Date
  answers: Array<{
    questionId: string
    answer: string
    duration: number
    confidence: number
    aiScore?: number
    feedback?: string | undefined
  }>
  overallScore?: number
  aiAnalysis?: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    confidence: number
    preparedness: number
  }
}

interface InterviewPrepProps {
  country?: string
  visaType?: string
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
}

export function InterviewPrep({ country = 'USA', visaType = 'B1/B2', userLevel = 'beginner' }: InterviewPrepProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'practice' | 'mock' | 'analysis'>('overview')
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [sessionHistory, setSessionHistory] = useState<InterviewSession[]>([])
  const [selectedMockInterview, setSelectedMockInterview] = useState<MockInterview | null>(null)
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  // Mock interview templates

  const mockInterviews: MockInterview[] = [
    {
      id: 'usa-tourist',
      country: 'USA',
      visaType: 'B1/B2',
      duration: 15,
      difficulty: 'medium',
      questions: [
        {
          id: '1',
          question: "What is the purpose of your trip to the United States?",
          category: 'travel',
          difficulty: 'easy',
          timeLimit: 60,
          tips: [
            "Be specific and clear about your purpose",
            "Mention specific places you plan to visit",
            "Show you have a planned itinerary"
          ],
          goodAnswerExample: "I'm planning a 10-day vacation to visit New York City and Washington DC. I want to see the Statue of Liberty, Times Square, and the Smithsonian museums.",
          commonMistakes: [
            "Being too vague about plans",
            "Mentioning work-related activities for tourist visa",
            "Not having a clear itinerary"
          ]
        },
        {
          id: '2',
          question: "How long do you plan to stay in the United States?",
          category: 'travel',
          difficulty: 'easy',
          timeLimit: 30,
          tips: [
            "Give specific dates",
            "Ensure your stay is reasonable for tourism",
            "Have return ticket booked"
          ],
          goodAnswerExample: "I plan to stay for 10 days, from March 15th to March 25th. I already have my return ticket booked.",
          commonMistakes: [
            "Saying 'as long as possible'",
            "Not having specific dates",
            "Planning stays that are too long for purpose"
          ]
        },
        {
          id: '3',
          question: "Do you have family or friends in the United States?",
          category: 'personal',
          difficulty: 'medium',
          timeLimit: 45,
          tips: [
            "Be honest about any connections",
            "If yes, explain the relationship clearly",
            "Show these connections won't influence you to overstay"
          ],
          goodAnswerExample: "Yes, I have a cousin who lives in New York. We plan to meet for dinner, but I'm staying in a hotel and have my own itinerary planned.",
          commonMistakes: [
            "Lying about family connections",
            "Not explaining the nature of relationships",
            "Making it seem like you'll depend on them"
          ]
        }
      ]
    },
    {
      id: 'canada-express',
      country: 'Canada',
      visaType: 'Express Entry',
      duration: 20,
      difficulty: 'hard',
      questions: [
        {
          id: '1',
          question: "Why do you want to immigrate to Canada specifically?",
          category: 'personal',
          difficulty: 'medium',
          timeLimit: 90,
          tips: [
            "Research Canadian values and culture",
            "Mention specific aspects that attract you",
            "Show genuine interest in contributing"
          ],
          goodAnswerExample: "Canada's multicultural society and strong healthcare system align with my values. I want to contribute my skills as a software engineer while raising my family in a safe, diverse environment.",
          commonMistakes: [
            "Generic answers about 'better life'",
            "Not researching Canadian specifics",
            "Only mentioning economic benefits"
          ]
        }
      ]
    }
  ]

  const questionCategories = [
    { id: 'personal', name: 'Pessoais', icon: User, color: 'blue' },
    { id: 'travel', name: 'Viagem', icon: Globe, color: 'green' },
    { id: 'financial', name: 'Financeiras', icon: Award, color: 'yellow' },
    { id: 'background', name: 'Histórico', icon: FileText, color: 'purple' },
    { id: 'situational', name: 'Situacionais', icon: Brain, color: 'red' }
  ]

  useEffect(() => {
    if (sessionActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (sessionActive && timeRemaining === 0) {
      handleTimeUp()
    }
    return () => {}
  }, [sessionActive, timeRemaining])

  useEffect(() => {
    // Load appropriate mock interview based on country and visa type
    const interview = mockInterviews.find(
      m => m.country === country && m.visaType === visaType
    ) || mockInterviews[0]
    if (interview) {
      setSelectedMockInterview(interview)
    }
  }, [country, visaType, mockInterviews])

  const startMockInterview = () => {
    if (!selectedMockInterview) return

    const newSession: InterviewSession = {
      id: Date.now().toString(),
      mockInterviewId: selectedMockInterview.id,
      startTime: new Date(),
      answers: []
    }

    setCurrentSession(newSession)
    setCurrentQuestion(0)
    setSessionActive(true)
    setTimeRemaining(selectedMockInterview.questions[0]?.timeLimit || 60)
    setUserAnswer('')
    
    notifyInfo('Entrevista Iniciada', 'Boa sorte! Responda com calma e confiança.')
  }

  const handleAnswer = () => {
    if (!currentSession || !selectedMockInterview) return

    const question = selectedMockInterview.questions[currentQuestion]
    if (!question) return

    const answerDuration = question.timeLimit - timeRemaining

    // Simulate AI analysis
    const aiScore = Math.floor(Math.random() * 30) + 70 // 70-100
    const confidence = userAnswer.length > 50 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 50

    const newAnswer = {
      questionId: question.id,
      answer: userAnswer,
      duration: answerDuration,
      confidence,
      aiScore,
      feedback: question ? generateAIFeedback(userAnswer, question) : undefined
    } as const

    const updatedSession = {
      ...currentSession,
      answers: [...currentSession.answers, newAnswer]
    }

    setCurrentSession(updatedSession)

    // Move to next question or finish

    if (selectedMockInterview?.questions && currentQuestion < selectedMockInterview.questions.length - 1) {
      const nextQuestion = selectedMockInterview.questions[currentQuestion + 1]
      setCurrentQuestion(currentQuestion + 1)
      setTimeRemaining(nextQuestion?.timeLimit || 60)
      setUserAnswer('')
    } else {
      finishInterview(updatedSession)
    }
  }

  const finishInterview = (session: InterviewSession) => {
    const overallScore = session.answers.reduce((acc, answer) => acc + (answer.aiScore || 0), 0) / session.answers.length
    const avgConfidence = session.answers.reduce((acc, answer) => acc + answer.confidence, 0) / session.answers.length

    const finalSession = {
      ...session,
      endTime: new Date(),
      overallScore,
      aiAnalysis: generateOverallAnalysis(session.answers, avgConfidence)
    }

    setCurrentSession(finalSession)
    setSessionHistory(prev => [...prev, finalSession])
    setSessionActive(false)
    setSelectedTab('analysis')
    
    notifySuccess('Entrevista Concluída', `Score: ${Math.round(overallScore)}%. Veja sua análise detalhada!`)
  }

  const generateAIFeedback = (answer: string, question: InterviewQuestion): string => {
    if (answer.length < 20) return "Resposta muito curta. Tente fornecer mais detalhes."
    if (answer.length > 200) return "Resposta muito longa. Seja mais conciso e direto."
    return "Boa resposta! Considere adicionar exemplos específicos para fortalecer sua argumentação."
  }

  const generateOverallAnalysis = (answers: any[], avgConfidence: number) => {
    return {
      strengths: [
        "Demonstrou conhecimento específico sobre o destino",
        "Manteve consistência nas respostas",
        "Boa articulação verbal"
      ],
      weaknesses: [
        "Pode ser mais específico em algumas respostas",
        "Trabalhe a confiança na apresentação",
        "Pratique mais perguntas sobre motivações"
      ],
      recommendations: [
        "Pratique mais perguntas situacionais",
        "Prepare exemplos específicos para suas respostas",
        "Trabalhe a postura e contato visual"
      ],
      confidence: avgConfidence,
      preparedness: Math.floor(Math.random() * 20) + 75
    }
  }

  const handleTimeUp = () => {
    // Store references to avoid potential state changes during execution
    const session = currentSession;
    const interview = selectedMockInterview;
    
    // Early return if required objects are missing
    if (!interview || !session) {
      setSessionActive(false);
      notifyError('Erro', 'Sessão ou entrevista não encontrada');
      return;
    }

    // If user has provided an answer, submit it
    if (userAnswer.trim()) {
      handleAnswer();
      return;
    }

    notifyError('Tempo Esgotado', 'Tente responder mais rapidamente na próxima pergunta.');
    
    // Skip to next question if available
    if (currentQuestion < interview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(interview.questions[currentQuestion + 1]?.timeLimit || 60);
      setUserAnswer('');
      return;
    }

    // Finalize interview if we're on the last question
    try {
      // Comprehensive type guard with runtime checks
      const isValidSession = (
        session !== null &&
        typeof session === 'object' &&
        typeof session.id === 'string' &&
        typeof session.mockInterviewId === 'string' &&
        session.startTime instanceof Date &&
        Array.isArray(session.answers)
      );

      if (!isValidSession) {
        throw new Error('Invalid session object');
      }
      
      // Create validated session object with all required fields
      const validatedSession: InterviewSession = {
        id: session.id,
        mockInterviewId: session.mockInterviewId,
        startTime: session.startTime,
        answers: [...session.answers],
        endTime: new Date()
      };

      // Additional runtime validation
      if (
        !validatedSession.id || 
        !validatedSession.mockInterviewId || 
        !validatedSession.startTime ||
        !(validatedSession.startTime instanceof Date)
      ) {
        throw new Error('Missing or invalid required session fields');
      }

      if (!Array.isArray(validatedSession.answers)) {
        throw new Error('Invalid answers array');
      }

      // Ensure finishInterview exists and is callable
      if (typeof finishInterview !== 'function') {
        throw new Error('finishInterview is not available');
      }

      // Final validation - TypeScript now understands validatedSession is valid
      if (isValidSession) {
        finishInterview({
          id: session.id,
          mockInterviewId: session.mockInterviewId,
          startTime: session.startTime,
          answers: [...session.answers],
          endTime: new Date()
        });
      } else {
        throw new Error('Failed to validate session');
      }
    } catch (error) {
      console.error('Error finalizing interview:', error);
      setSessionActive(false);
      notifyError('Erro', 'Falha ao finalizar entrevista');
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Preparação para Entrevista</h2>
            <p className="text-gray-600">Sistema IA para treino de entrevistas consulares</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Simulações Reais</h3>
            <p className="text-sm text-gray-600">Perguntas baseadas em entrevistas reais</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Análise IA</h3>
            <p className="text-sm text-gray-600">Feedback inteligente e personalizado</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Progresso</h3>
            <p className="text-sm text-gray-600">Acompanhe sua evolução</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Categorias de Perguntas
          </h3>
          <div className="space-y-3">
            {questionCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 bg-${category.color}-100 rounded-full flex items-center justify-center`}>
                  <category.icon className={`h-4 w-4 text-${category.color}-600`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-600">Perguntas sobre {category.name.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Seu Progresso
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Sessões Completas</span>
                <span className="font-medium">{sessionHistory.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(sessionHistory.length * 10, 100)}%` }}
                />
              </div>
            </div>
            
            {sessionHistory.length > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Score Médio</span>
                  <span className="font-medium">
                    {Math.round(sessionHistory.reduce((acc, s) => acc + (s.overallScore || 0), 0) / sessionHistory.length)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${sessionHistory.reduce((acc, s) => acc + (s.overallScore || 0), 0) / sessionHistory.length}%` 
                    }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <button
                onClick={() => setSelectedTab('mock')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Nova Simulação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMockInterview = () => (
    <div className="space-y-6">
      {!sessionActive ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurar Simulação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="USA">Estados Unidos</option>
                  <option value="Canada">Canadá</option>
                  <option value="Portugal">Portugal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Visto</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="B1/B2">B1/B2 (Turismo)</option>
                  <option value="F1">F1 (Estudante)</option>
                  <option value="H1B">H1B (Trabalho)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Dicas para uma boa simulação:</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Encontre um local silencioso</li>
                    <li>• Use fones de ouvido se possível</li>
                    <li>• Mantenha contato visual com a tela</li>
                    <li>• Responda de forma clara e objetiva</li>
                    <li>• Não se preocupe com erros, é apenas treino</li>
                  </ul>
                </div>
              </div>
            </div>

            {selectedMockInterview && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Simulação Selecionada</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">País:</span>
                    <div className="font-medium">{selectedMockInterview.country}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Visto:</span>
                    <div className="font-medium">{selectedMockInterview.visaType}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Duração:</span>
                    <div className="font-medium">{selectedMockInterview.duration} min</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Perguntas:</span>
                    <div className="font-medium">{selectedMockInterview.questions.length}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={startMockInterview}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Iniciar Simulação
              </button>
              
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Prévia
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Active Interview Session */
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-gray-900">Entrevista em Andamento</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>Pergunta {currentQuestion + 1} de {selectedMockInterview?.questions.length}</span>
              </div>
              
              <div className={`flex items-center gap-2 text-sm font-medium ${
                timeRemaining <= 10 ? 'text-red-600' : 'text-gray-900'
              }`}>
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {selectedMockInterview && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  {selectedMockInterview.questions[currentQuestion]?.question}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Categoria: {selectedMockInterview.questions[currentQuestion]?.category}</span>
                  <span>Dificuldade: {selectedMockInterview.questions[currentQuestion]?.difficulty}</span>
                  <span>Tempo limite: {selectedMockInterview.questions[currentQuestion]?.timeLimit}s</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isRecording 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                  
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                  >
                    {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                  
                  <div className="flex-1">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Digite sua resposta aqui ou use o microfone..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setSessionActive(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Pausar
                  </button>
                  
                  <button
                    onClick={handleAnswer}
                    disabled={!userAnswer.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Próxima Pergunta
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-900 mb-2">💡 Dicas rápidas:</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {selectedMockInterview.questions[currentQuestion]?.tips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderAnalysis = () => (
    <div className="space-y-6">
      {currentSession?.aiAnalysis ? (
        <>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Análise da Entrevista</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.round(currentSession.overallScore || 0)}%</div>
                <div className="text-sm text-gray-600">Score Geral</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {currentSession.aiAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Áreas para Melhorar
                </h4>
                <ul className="space-y-2">
                  {currentSession.aiAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {currentSession.aiAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                    <Zap className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-medium text-gray-900 mb-4">Respostas Individuais</h4>
            <div className="space-y-4">
              {currentSession.answers.map((answer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Pergunta {index + 1}</h5>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Score: {answer.aiScore}%</span>
                      <span className="text-gray-600">Confiança: {answer.confidence}%</span>
                      <span className="text-gray-600">Tempo: {answer.duration}s</span>
                    </div>
                  </div>
                  {answer.feedback && (
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                      <strong>Feedback IA:</strong> {answer.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma análise disponível</h3>
          <p className="text-gray-600 mb-4">Complete uma simulação de entrevista para ver sua análise detalhada.</p>
          <button
            onClick={() => setSelectedTab('mock')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Iniciar Simulação
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Preparação para Entrevista Consular
        </h1>
        <p className="text-gray-600">
          Treine com IA e aumente suas chances de aprovação
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Visão Geral', icon: Eye },
              { id: 'practice', name: 'Prática', icon: BookOpen },
              { id: 'mock', name: 'Simulação', icon: Video },
              { id: 'analysis', name: 'Análise', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'practice' && renderOverview()} {/* For now, same as overview */}
      {selectedTab === 'mock' && renderMockInterview()}
      {selectedTab === 'analysis' && renderAnalysis()}
    </div>
  )
}
