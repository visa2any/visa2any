'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ClientHeader from '@/components/ClientHeader'
import { useCustomerAuth } from '@/hooks/useCustomerAuth'
import {
  User, Calendar, Clock, CheckCircle, Video, Phone,
  MessageCircle, Brain, Star, Award, Zap, Crown, AlertTriangle
} from 'lucide-react'

interface Consultation {
  id: string
  type: 'AI_ANALYSIS' | 'HUMAN_CONSULTATION' | 'DOCUMENT_REVIEW' | 'INTERVIEW_PREP' | 'FOLLOW_UP' | 'VIP_SERVICE'
  title: string
  date: string
  time?: string
  status: 'completed' | 'scheduled' | 'available' | 'in_progress' | 'cancelled'
  consultant?: string
  duration: string
  description: string
  result?: string
  score?: number
  price?: number
  meeting_link?: string
}

export default function ConsultoriasPage() {
  const { customer, isLoading, isAuthenticated } = useCustomerAuth()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedTab, setSelectedTab] = useState<'scheduled' | 'completed' | 'available'>('scheduled')
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/cliente/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Load consultations from customer data
  useEffect(() => {
    if (customer?.consultations) {
      const formattedConsultations: Consultation[] = customer.consultations.map((c: any) => {
        const consultation: any = {
          id: c.id,
          type: c.type || 'HUMAN_CONSULTATION',
          title: getConsultationTitle(c.type),
          date: c.scheduledAt ? new Date(c.scheduledAt).toLocaleDateString('pt-BR') :
            c.completedAt ? new Date(c.completedAt).toLocaleDateString('pt-BR') : 'A definir',
          status: mapConsultationStatus(c.status),
          consultant: c.consultantName || 'Especialista Visa2Any',
          duration: c.duration ? `${c.duration} min` : '30 min',
          description: c.recommendation || c.notes || getDefaultDescription(c.type),
          score: c.score,
          meeting_link: c.meetingLink
        }

        if (c.scheduledAt) {
          consultation.time = new Date(c.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }

        if (c.result) {
          consultation.result = typeof c.result === 'string' ? c.result : JSON.stringify(c.result)
        }

        return consultation as Consultation
      })
      setConsultations(formattedConsultations)
    } else {
      // No consultations yet - empty state
      setConsultations([])
    }
  }, [customer])

  const getConsultationTitle = (type: string): string => {
    const titles: Record<string, string> = {
      'AI_ANALYSIS': 'Análise IA Completa',
      'HUMAN_CONSULTATION': 'Consultoria com Especialista',
      'DOCUMENT_REVIEW': 'Revisão de Documentos',
      'INTERVIEW_PREP': 'Preparação para Entrevista',
      'FOLLOW_UP': 'Acompanhamento',
      'VIP_SERVICE': 'Serviço VIP Premium'
    }
    return titles[type] || 'Consultoria'
  }

  const getDefaultDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'AI_ANALYSIS': 'Análise completa do perfil com score detalhado',
      'HUMAN_CONSULTATION': 'Atendimento personalizado com consultor especializado',
      'DOCUMENT_REVIEW': 'Revisão detalhada de toda documentação',
      'INTERVIEW_PREP': 'Simulação e preparação para entrevista consular',
      'FOLLOW_UP': 'Acompanhamento do progresso do processo',
      'VIP_SERVICE': 'Atendimento exclusivo com consultor dedicado'
    }
    return descriptions[type] || 'Consultoria especializada'
  }

  const mapConsultationStatus = (status: string): 'completed' | 'scheduled' | 'available' | 'in_progress' | 'cancelled' => {
    const statusMap: Record<string, 'completed' | 'scheduled' | 'available' | 'in_progress' | 'cancelled'> = {
      'COMPLETED': 'completed',
      'SCHEDULED': 'scheduled',
      'IN_PROGRESS': 'in_progress',
      'CANCELLED': 'cancelled',
      'RESCHEDULED': 'scheduled'
    }
    return statusMap[status?.toUpperCase()] || 'scheduled'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'available': return 'text-purple-600 bg-purple-100'
      case 'in_progress': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'available': return <Star className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AI_ANALYSIS': return <Brain className="h-5 w-5 text-purple-500" />
      case 'HUMAN_CONSULTATION': return <User className="h-5 w-5 text-blue-500" />
      case 'DOCUMENT_REVIEW': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'INTERVIEW_PREP': return <Video className="h-5 w-5 text-orange-500" />
      default: return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredConsultations = consultations.filter(c => {
    if (selectedTab === 'scheduled') return c.status === 'scheduled' || c.status === 'in_progress'
    if (selectedTab === 'completed') return c.status === 'completed'
    if (selectedTab === 'available') return c.status === 'available'
    return false
  })

  // Available services that can be purchased
  const availableServices: Consultation[] = [
    {
      id: 'avail_1',
      type: 'INTERVIEW_PREP',
      title: 'Simulação de Entrevista VIP',
      date: 'Disponível',
      status: 'available',
      consultant: 'Especialista Sênior',
      duration: '90 min',
      description: 'Simulação completa com feedback personalizado',
      price: 599
    },
    {
      id: 'avail_2',
      type: 'DOCUMENT_REVIEW',
      title: 'Revisão Completa de Documentos',
      date: 'Disponível',
      status: 'available',
      consultant: 'Sofia IA + Especialista',
      duration: '45 min',
      description: 'Análise detalhada com recomendações',
      price: 299
    },
    {
      id: 'avail_3',
      type: 'VIP_SERVICE',
      title: 'Pacote Consultoria VIP',
      date: 'Disponível',
      status: 'available',
      consultant: 'Consultor Dedicado',
      duration: 'Ilimitado',
      description: 'Acompanhamento completo até aprovação',
      price: 1299
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Carregando consultorias...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <button
            onClick={() => router.push('/cliente/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Fazer Login Novamente
          </button>
        </div>
      </div>
    )
  }

  const customerForHeader = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    eligibilityScore: customer.eligibilityScore || 0,
    ...(customer.automationInsights ? { automationInsights: customer.automationInsights } : {})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        customerData={customerForHeader}
        onSofiaChat={() => { }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Minhas Consultorias
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe suas consultorias e agende novos atendimentos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendadas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {consultations.filter(c => c.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {consultations.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-purple-600">
                  {availableServices.length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Atual</p>
                <p className="text-2xl font-bold text-orange-600">{customer.eligibilityScore || 0}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('scheduled')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${selectedTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Agendadas ({consultations.filter(c => c.status === 'scheduled').length})
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${selectedTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Concluídas ({consultations.filter(c => c.status === 'completed').length})
              </button>
              <button
                onClick={() => setSelectedTab('available')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${selectedTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Disponíveis ({availableServices.length})
              </button>
            </nav>
          </div>

          {/* Consultations List */}
          <div className="divide-y divide-gray-200">
            {selectedTab === 'available' ? (
              // Show available services
              availableServices.map((consultation) => (
                <div key={consultation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(consultation.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{consultation.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            Disponível
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{consultation.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{consultation.duration}</span>
                          </div>
                          {consultation.consultant && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{consultation.consultant}</span>
                            </div>
                          )}
                        </div>

                        {consultation.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">R$ {consultation.price}</span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Oferta especial
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <Calendar className="h-4 w-4" />
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredConsultations.length === 0 ? (
              <div className="p-12 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedTab === 'scheduled' && 'Nenhuma consultoria agendada'}
                  {selectedTab === 'completed' && 'Nenhuma consultoria concluída'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTab === 'scheduled'
                    ? 'Agende uma consultoria para acelerar seu processo'
                    : 'Suas consultorias concluídas aparecerão aqui'
                  }
                </p>
                {selectedTab === 'scheduled' && (
                  <button
                    onClick={() => setSelectedTab('available')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Ver Consultorias Disponíveis
                  </button>
                )}
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(consultation.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{consultation.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            {consultation.status === 'completed' ? 'Concluída' :
                              consultation.status === 'scheduled' ? 'Agendada' :
                                consultation.status === 'available' ? 'Disponível' : 'Em andamento'}
                          </div>
                          {consultation.type === 'AI_ANALYSIS' && (
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4 text-purple-500" />
                              <span className="text-xs text-purple-600 font-medium">IA</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{consultation.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{consultation.date}</span>
                            {consultation.time && <span>às {consultation.time}</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{consultation.duration}</span>
                          </div>
                          {consultation.consultant && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{consultation.consultant}</span>
                            </div>
                          )}
                        </div>

                        {consultation.result && (
                          <div className="bg-green-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Resultado:</span>
                            </div>
                            <p className="text-sm text-green-700">{consultation.result}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {consultation.status === 'scheduled' && consultation.meeting_link && (
                        <button
                          onClick={() => window.open(consultation.meeting_link, '_blank')}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Video className="h-4 w-4" />
                          Entrar
                        </button>
                      )}

                      {consultation.status === 'scheduled' && (
                        <>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Reagendar">
                            <Calendar className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Contato">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Serviços Premium
            </h3>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Oferta Especial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h4 className="font-semibold text-gray-900">Consultoria VIP</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Atendimento 1:1 com especialista dedicado + garantia de resultado
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">R$ 1.299</span>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                  Contratar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Aceleração IA</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Análise contínua com Sofia IA + otimizações automáticas
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">R$ 399</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  Ativar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}