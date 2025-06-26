'use client'

import { useState, useEffect } from 'react'
import ClientHeader from '@/components/ClientHeader'
import { 
  User, Calendar, Clock, CheckCircle, Video, Phone, 
  MessageCircle, Brain, Star, Award, Zap, Crown
} from 'lucide-react'

interface Consultation {
  id: string
  type: 'AI_ANALYSIS' | 'HUMAN_CONSULTATION' | 'DOCUMENT_REVIEW' | 'INTERVIEW_PREP'
  title: string
  date: string
  time?: string
  status: 'completed' | 'scheduled' | 'available' | 'in_progress'
  consultant?: string
  duration: string
  description: string
  result?: string
  score?: number
  price?: number
  meeting_link?: string
}

interface CustomerData {
  id: string
  name: string
  email: string
  eligibilityScore: number
  automationInsights?: {
    engagementScore: number
  }
}

export default function ConsultoriasPage() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'scheduled' | 'completed' | 'available'>('scheduled')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      // Load customer data,      const storedCustomer = localStorage.getItem('customer')
      if (storedCustomer) {
        setCustomerData(JSON.parse(storedCustomer))
      } else {
        setCustomerData({
          id: 'cliente-padrao',
          name: 'João Silva Santos',
          email: 'demo@visa2any.com',
          eligibilityScore: 87,
          automationInsights: {
            engagementScore: 87
          }
        })
      }

      // Load consultations,      setConsultations([
        {
          id: '1',
          type: 'AI_ANALYSIS',
          title: 'Análise IA Completa',
          date: '2024-01-10',
          status: 'completed',
          consultant: 'Sofia IA',
          duration: '15 min',
          description: 'Análise completa do perfil com score detalhado',
          result: 'Score: 87/100 - Perfil forte para visto americano',
          score: 87
        },
        {
          id: '2',
          type: 'HUMAN_CONSULTATION',
          title: 'Consultoria Premium - Preparação Entrevista',
          date: '2024-01-25',
          time: '14:00',
          status: 'scheduled',
          consultant: 'Dr. João Silva',
          duration: '60 min',
          description: 'Preparação completa para entrevista consular',
          price: 299,
          meeting_link: 'https://meet.visa2any.com/abc123'
        },
        {
          id: '3',
          type: 'DOCUMENT_REVIEW',
          title: 'Revisão Final de Documentos',
          date: '2024-01-28',
          time: '10:00',
          status: 'scheduled',
          consultant: 'Sofia IA + Especialista',
          duration: '30 min',
          description: 'Revisão final antes do envio',
          price: 149
        },
        {
          id: '4',
          type: 'INTERVIEW_PREP',
          title: 'Simulação de Entrevista VIP',
          date: 'Disponível',
          status: 'available',
          consultant: 'Especialista Sênior',
          duration: '90 min',
          description: 'Simulação completa com feedback personalizado',
          price: 599
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
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

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader 
        customerData={customerData} 
        onSofiaChat={() => {}} 
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
                  {consultations.filter(c => c.status === 'available').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próxima em</p>
                <p className="text-2xl font-bold text-orange-600">3 dias</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('scheduled')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'scheduled'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Agendadas ({consultations.filter(c => c.status === 'scheduled').length})
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Concluídas ({consultations.filter(c => c.status === 'completed').length})
              </button>
              <button
                onClick={() => setSelectedTab('available')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Disponíveis ({consultations.filter(c => c.status === 'available').length})
              </button>
            </nav>
          </div>

          {/* Consultations List */}
          <div className="divide-y divide-gray-200">
            {filteredConsultations.length === 0 ? (
              <div className="p-12 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedTab === 'scheduled' && 'Nenhuma consultoria agendada'}
                  {selectedTab === 'completed' && 'Nenhuma consultoria concluída'}
                  {selectedTab === 'available' && 'Nenhuma consultoria disponível'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTab === 'available' 
                    ? 'Agende uma consultoria para acelerar seu processo'
                    : 'Suas consultorias aparecerão aqui'
                  }
                </p>
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

                        {consultation.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">R$ {consultation.price}</span>
                            {consultation.status === 'available' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Oferta especial
                              </span>
                            )}
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
                      
                      {consultation.status === 'available' && (
                        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          <Calendar className="h-4 w-4" />
                          Agendar
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