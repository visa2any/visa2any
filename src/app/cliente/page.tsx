'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ClientHeader from '@/components/ClientHeader'
import SofiaIA from '@/components/SofiaIA'
import ProfileEditor from '@/components/ProfileEditor'
import DocumentUpload from '@/components/DocumentUpload'
import { VisaApplicationWizard } from '@/components/wizards/VisaApplicationWizard'
import { DocumentChecklistWizard } from '@/components/wizards/DocumentChecklistWizard'
import { InterviewPrep } from '@/components/InterviewPrep'
import { CountryComparison } from '@/components/CountryComparison'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { NotificationProvider } from '@/components/NotificationSystem'
import { 
  User, FileText, Clock, CheckCircle, AlertTriangle, MessageCircle,
  TrendingUp, Award, Bell, Calendar, Download, Eye, Star, Target,
  Zap, Brain, BarChart3, Sparkles, Globe, CreditCard, Trophy,
  BookOpen, Headphones, Shield, Gift, Edit3, Upload as UploadIcon, X
} from 'lucide-react'

interface CustomerData {
  id: string
  name: string
  email: string
  phone?: string
  destinationCountry: string
  visaType: string
  status: string
  eligibilityScore: number
  progress: number
  documents: any[]
  consultations: any[]
  notifications: any[]
  scoreBreakdown?: {
    age: number
    education: number
    experience: number
    language: number
    funds: number
  }
  nextMilestone?: {
    title: string
    dueDate: string
    requirements: string[]
    progress: number
  }
  automationInsights?: {
    emailsSent: number
    actionsCompleted: number
    nextAction: string
    engagementScore: number
  }
}


function CustomerDashboardContent() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSofiaChat, setShowSofiaChat] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [showVisaWizard, setShowVisaWizard] = useState(false)
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showInterviewPrep, setShowInterviewPrep] = useState(false)
  const [showCountryComparison, setShowCountryComparison] = useState(false)
  const router = useRouter()
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const handleProfileSave = (newProfileData: any) => {
    setCustomerData(prev => prev ? { 
      ...prev, 
      name: newProfileData.name,
      email: newProfileData.email,
      phone: newProfileData.phone,
      profilePhoto: newProfileData.profilePhoto
    } : null)
    
    // Save to localStorage,    localStorage.setItem('customer-profile', JSON.stringify(newProfileData))
    
    // Force reload from localStorage to get updated customer data,    setTimeout(() => {
      fetchCustomerData()
    }, 100)
  }

  const handleDocumentsChange = (documents: any[]) => {
    setCustomerData(prev => prev ? { ...prev, documents } : null)
    // Save to localStorage,    localStorage.setItem('customer-documents', JSON.stringify(documents))
  }

  const fetchCustomerData = async () => {
    try {
      let customerData = null
      
      if (typeof window !== 'undefined') {
        const storedCustomer = localStorage.getItem('customer')
        if (storedCustomer) {
          customerData = JSON.parse(storedCustomer)
        }
        
        // Also load profile data including photo,        const storedProfile = localStorage.getItem('customer-profile')
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile)
          if (customerData) {
            customerData.profilePhoto = profileData.profilePhoto
            customerData.name = profileData.name || customerData.name
            customerData.email = profileData.email || customerData.email
            customerData.phone = profileData.phone || customerData.phone
          }
        }
      }
      
      if (!customerData) {
        customerData = {
          id: 'cliente-padrao',
          name: 'João Silva Santos',
          email: 'demo@visa2any.com',
          phone: '(11) 99999-9999',
          destinationCountry: 'Estados Unidos',
          visaType: 'Turismo B1/B2',
          status: 'IN_PROCESS',
          eligibilityScore: 87
        }
      }
      
      const fullCustomerData = {
        ...customerData,
        progress: 72,
        scoreBreakdown: {
          age: 85,
          education: 95,
          experience: 80,
          language: 90,
          funds: 75
        },
        nextMilestone: {
          title: 'Agendamento da Entrevista Consular',
          dueDate: '15/02/2024',
          requirements: [
            'Completar formulário DS-160',
            'Agendar horário no consulado',
            'Preparar documentação para entrevista'
          ],
          progress: 33
        },
        automationInsights: {
          emailsSent: 12,
          actionsCompleted: 8,
          nextAction: 'Preparação para entrevista via IA',
          engagementScore: 87
        },
        documents: [
          { id: '1', name: 'Passaporte', status: 'approved', aiScore: 98, feedback: 'Documento perfeito' },
          { id: '2', name: 'DS-160', status: 'pending', aiScore: 0, feedback: 'Aguardando preenchimento' },
          { id: '3', name: 'Comprov. Financeiro', status: 'review', aiScore: 85, feedback: 'Recomendamos extrato mais recente' },
          { id: '4', name: 'Carta Empregador', status: 'approved', aiScore: 92, feedback: 'Excelente' }
        ],
        vagaExpressSubscription: {
          plan: 'PREMIUM',
          status: 'ACTIVE',
          expiryDate: '2024-08-15',
          slotsFound: 3,
          notificationsSent: 12,
          monitoringCountries: ['EUA'],
          lastSlotDetected: '2024-01-23',
          nextCheck: '2024-01-24 10:32'
        },
        consultations: [
          { id: '1', type: 'AI_ANALYSIS', date: '10/01', status: 'completed', result: 'Score: 87/100 - Perfil forte', duration: '15 min' },
          { id: '2', type: 'HUMAN_CONSULTATION', date: '25/01', status: 'scheduled', consultant: 'João Silva', topic: 'Preparação entrevista' },
          { id: '3', type: 'DOCUMENT_REVIEW', date: '28/01', status: 'scheduled', consultant: 'IA Sofia', topic: 'Revisão final' }
        ],
        notifications: [
          { id: '1', title: 'IA Sofia: Nova Recomendação', message: 'Recomendo focar na preparação para entrevista', type: 'ai', date: '24/01', read: false },
          { id: '2', title: 'Documento Analisado', message: 'Comprovante financeiro - Score: 85/100', type: 'success', date: '22/01', read: false },
          { id: '3', title: 'Marco Atingido!', message: 'Você completou 70% do processo', type: 'success', date: '20/01', read: false }
        ]
      }
      
      setCustomerData(fullCustomerData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!customerData) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader 
        customerData={customerData} 
        onSofiaChat={() => setShowSofiaChat(true)}
        onProfileEdit={() => setShowProfileEditor(true)}
      />
      
      {/* Barra de Progresso Global */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">Progresso do Processo</h2>
            <span className="text-sm font-semibold text-blue-600">{customerData.progress}% completo</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 relative" 
              style={{ width: `${customerData.progress}%` }}
            >
              <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-sm transform translate-x-1"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Início</span>
            <span>Documentação</span>
            <span>Análise</span>
            <span>Entrevista</span>
            <span>Aprovação</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Cards Principais Compactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-blue-500">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Visto Destino</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{customerData.destinationCountry}</p>
                <p className="text-xs text-blue-600">{customerData.visaType}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-orange-500">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Próximo Marco</p>
                <p className="text-sm font-semibold text-gray-900 truncate">Entrevista Consular</p>
                <p className="text-xs text-orange-600">{customerData.nextMilestone?.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-green-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Score IA</p>
                <p className="text-sm font-semibold text-gray-900">{customerData.eligibilityScore}/100</p>
                <p className="text-xs text-green-600">+12 pontos/mês</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-purple-500">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Automação</p>
                <p className="text-sm font-semibold text-gray-900">{customerData.automationInsights?.actionsCompleted} ações</p>
                <p className="text-xs text-purple-600">IA ativa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown Compacto */}
        {customerData.scoreBreakdown && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Análise do Perfil
              </h3>
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">IA Sofia</div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(customerData.scoreBreakdown).map(([key, value]) => {
                const labels = { age: 'Idade', education: 'Educação', experience: 'Exp.', language: 'Idiomas', funds: 'Recursos' }
                const colors = { age: 'blue', education: 'green', experience: 'purple', language: 'orange', funds: 'red' }
                return (
                  <div key={key} className="text-center">
                    <div className="relative w-10 h-10 mx-auto mb-1">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path className={`text-${colors[key as keyof typeof colors]}-500`} stroke="currentColor" strokeWidth="3" strokeDasharray={`${value}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-900">{value}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-700">{labels[key as keyof typeof labels]}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => setShowDocumentUpload(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <UploadIcon className="h-4 w-4" />
            Upload Documentos
          </button>
          
          <button
            onClick={() => setShowVisaWizard(true)}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            <Zap className="h-4 w-4" />
            Wizard Aplicação
          </button>
          
          <button
            onClick={() => setShowInterviewPrep(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <User className="h-4 w-4" />
            Treinar Entrevista
          </button>
          
          <button
            onClick={() => setShowCountryComparison(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            <Globe className="h-4 w-4" />
            Comparar Países
          </button>
        </div>

        {/* Vaga Express Status - SE ATIVO */}
        {customerData.vagaExpressSubscription && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm p-4 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-600" />
                Vaga Express ({customerData.vagaExpressSubscription.plan})
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                customerData.vagaExpressSubscription.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {customerData.vagaExpressSubscription.status === 'ACTIVE' ? '🟢 ATIVO' : '⏸️ INATIVO'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{customerData.vagaExpressSubscription.slotsFound}</div>
                <div className="text-xs text-gray-600">Vagas Detectadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{customerData.vagaExpressSubscription.notificationsSent}</div>
                <div className="text-xs text-gray-600">Notificações Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{customerData.vagaExpressSubscription.monitoringCountries.length}</div>
                <div className="text-xs text-gray-600">Países Monitorados</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">2min</div>
                <div className="text-xs text-gray-600">Próxima Verificação</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">🎯 Monitorando:</span>
                <span className="font-medium text-gray-900">{customerData.vagaExpressSubscription.monitoringCountries.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">📅 Último slot:</span>
                <span className="font-medium text-gray-900">{customerData.vagaExpressSubscription.lastSlotDetected}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">⏰ Expira em:</span>
                <span className="font-medium text-gray-900">{customerData.vagaExpressSubscription.expiryDate}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-xs hover:bg-orange-700 transition-colors">
                📊 Ver Relatório Completo
              </button>
              <button className="bg-white border border-orange-600 text-orange-600 px-3 py-2 rounded text-xs hover:bg-orange-50 transition-colors">
                ⚙️ Configurar
              </button>
            </div>
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Documentos */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <FileText className="h-4 w-4 text-blue-600" />
                Documentos ({customerData.documents.length})
              </h3>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {customerData.documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border border-gray-200 rounded text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      doc.status === 'approved' ? 'bg-green-100' :
                      doc.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <FileText className={`h-3 w-3 ${
                        doc.status === 'approved' ? 'text-green-600' :
                        doc.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                      {doc.aiScore > 0 && (
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-purple-500" />
                          <span className="text-purple-600 font-medium">{doc.aiScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                    doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {doc.status === 'approved' ? '✓' : doc.status === 'pending' ? '⏳' : '🔄'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultorias */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
              <User className="h-4 w-4 text-green-600" />
              Consultorias ({customerData.consultations.length})
            </h3>
            <div className="space-y-2">
              {customerData.consultations.slice(0, 3).map((consultation) => (
                <div key={consultation.id} className="p-2 border border-gray-200 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-xs">
                      {consultation.type === 'AI_ANALYSIS' ? '🤖 IA Sofia' : 
                       consultation.type === 'HUMAN_CONSULTATION' ? '👨‍💼 Humana' : '📋 Revisão'}
                    </p>
                    <div className={`px-2 py-1 rounded text-xs ${
                      consultation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {consultation.status === 'completed' ? '✅' : '📅'}
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs">📅 {consultation.date}</p>
                  {consultation.result && (
                    <p className="text-green-700 text-xs mt-1">📊 {consultation.result}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
              <Bell className="h-4 w-4 text-orange-600" />
              Notificações ({customerData.notifications.length})
            </h3>
            <div className="space-y-2">
              {customerData.notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className={`p-2 border rounded text-xs ${
                  !notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'info' ? 'bg-blue-100' :
                      notification.type === 'ai' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      {notification.type === 'success' ? '✅' :
                       notification.type === 'info' ? '💡' :
                       notification.type === 'ai' ? '🤖' : '⚠️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs truncate">{notification.title}</p>
                      <p className="text-gray-600 text-xs">{notification.message}</p>
                      <p className="text-gray-400 text-xs">{notification.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Upsell */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <Gift className="h-4 w-4 text-purple-600" />
              Acelere Seu Processo
            </h3>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">Oferta Especial</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Vaga Express - SE NÃO TIVER ASSINATURA */}
            {!customerData.vagaExpressSubscription && (
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-3 border-2 border-orange-300 relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  NOVO!
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <h4 className="text-xs font-semibold text-gray-900">Vaga Express</h4>
                </div>
                <p className="text-xs text-gray-600 mb-2">Monitore cancelamentos e adiante sua entrevista automaticamente</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-600">R$ 497</span>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600">
                    Ativar
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <h4 className="text-xs font-semibold text-gray-900">Consultoria VIP</h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">Atendimento prioritário + preparação intensiva para entrevista</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-green-600">R$ 497</span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                  Contratar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <h4 className="text-xs font-semibold text-gray-900">Curso Preparatório</h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">Módulos específicos para seu país destino + simulações</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-green-600">R$ 197</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">
                  Comprar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <h4 className="text-xs font-semibold text-gray-900">Seguro Rejeição</h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">Garantia de reembolso + nova tentativa em caso de negativa</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-green-600">R$ 297</span>
                <button className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600">
                  Proteger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modais */}
      <SofiaIA
        isOpen={showSofiaChat}
        onClose={() => setShowSofiaChat(false)}
        customerData={{
          ...customerData,
          package: 'PREMIUM' // Definir baseado no plano real do cliente        }}
      />

      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        profileData={{
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone || '',
          country: 'Brasil',
          nationality: 'Brasileira',
          age: 35,
          profession: 'Engenheiro de Software',
          education: 'Superior',
          targetCountry: customerData.destinationCountry,
          visaType: customerData.visaType,
          profilePhoto: ''
        }}
        onSave={handleProfileSave}
      />

      <DocumentUpload
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        onDocumentsChange={handleDocumentsChange}
        existingDocuments={customerData.documents}
      />

      {/* Novo: Modal do Wizard de Aplicação */}
      {showVisaWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Wizard de Aplicação de Visto</h2>
              <button
                onClick={() => setShowVisaWizard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <VisaApplicationWizard
                country={customerData.destinationCountry === 'Estados Unidos' ? 'USA' : 
                        customerData.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customerData.visaType}
                onComplete={() => {
                  setShowVisaWizard(false)
                  notifySuccess('Sucesso!', 'Wizard de aplicação concluído com sucesso!')
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Novo: Modal de Checklist de Documentos */}
      {showDocumentChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Checklist de Documentos</h2>
              <button
                onClick={() => setShowDocumentChecklist(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <DocumentChecklistWizard
                country={customerData.destinationCountry === 'Estados Unidos' ? 'USA' : 
                        customerData.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customerData.visaType}
                applicantProfile={{
                  nationality: 'brasileira',
                  age: 35,
                  maritalStatus: 'married',
                  hasChildren: true,
                  education: 'higher',
                  workExperience: 10
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Novo: Modal de Preparação para Entrevista */}
      {showInterviewPrep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Preparação para Entrevista</h2>
              <button
                onClick={() => setShowInterviewPrep(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <InterviewPrep
                country={customerData.destinationCountry === 'Estados Unidos' ? 'USA' : 
                        customerData.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customerData.visaType}
                userLevel="intermediate"
              />
            </div>
          </div>
        </div>
      )}

      {/* Novo: Modal de Comparação de Países */}
      {showCountryComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Comparação de Países</h2>
              <button
                onClick={() => setShowCountryComparison(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <CountryComparison />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CustomerDashboard() {
  return (
    <NotificationProvider>
      <CustomerDashboardContent />
    </NotificationProvider>
  )
}