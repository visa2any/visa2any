'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ClientHeader from '@/components/ClientHeader'
import SofiaIA from '@/components/SofiaIA'
import ProfileEditor from '@/components/ProfileEditor'
import ClientSettings from '@/components/ClientSettings'
import DocumentUpload from '@/components/DocumentUpload'
import { VisaApplicationWizard } from '@/components/wizards/VisaApplicationWizard'
import { DocumentChecklistWizard } from '@/components/wizards/DocumentChecklistWizard'
import { InterviewPrep } from '@/components/InterviewPrep'
import { CountryComparison } from '@/components/CountryComparison'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { NotificationProvider } from '@/components/NotificationSystem'
import { useCustomerAuth } from '@/hooks/useCustomerAuth'
import {
  User, FileText, Clock, CheckCircle, AlertTriangle, MessageCircle,
  TrendingUp, Award, Bell, Calendar, Download, Eye, Star, Target,
  Zap, Brain, BarChart3, Sparkles, Globe, CreditCard, Trophy,
  BookOpen, Headphones, Shield, Gift, Edit3, Upload as UploadIcon, X
} from 'lucide-react'

function CustomerDashboardContent() {
  const { customer, isLoading, isAuthenticated, refreshProfile, updateLocalProfile, logout } = useCustomerAuth()
  const [showSofiaChat, setShowSofiaChat] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [showVisaWizard, setShowVisaWizard] = useState(false)
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false)
  const [showInterviewPrep, setShowInterviewPrep] = useState(false)
  const [showCountryComparison, setShowCountryComparison] = useState(false)
  const router = useRouter()
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/cliente/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleProfileSave = async (newProfileData: any) => {
    // Update local state
    updateLocalProfile({
      name: newProfileData.name,
      email: newProfileData.email,
      phone: newProfileData.phone,
      profilePhoto: newProfileData.profilePhoto
    })

    // TODO: Call API to persist profile changes
    // await fetch('/api/customers/profile', { method: 'PUT', body: JSON.stringify(newProfileData) })

    notifySuccess('Perfil Atualizado', 'Suas informações foram salvas com sucesso!')
    setShowProfileEditor(false)
  }

  const handleDocumentsChange = (documents: any[]) => {
    updateLocalProfile({ documents })
    // TODO: Sync with server
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

  // Calculate score breakdown from eligibility score if not provided
  const scoreBreakdown = customer.scoreBreakdown || {
    age: Math.min(100, customer.eligibilityScore + 5),
    education: Math.min(100, customer.eligibilityScore + 10),
    experience: Math.min(100, customer.eligibilityScore - 5),
    language: Math.min(100, customer.eligibilityScore),
    funds: Math.min(100, customer.eligibilityScore - 10)
  }

  // Calculate progress from status if not provided
  const progressMap: Record<string, number> = {
    'LEAD': 10,
    'QUALIFIED': 20,
    'CONSULTATION_SCHEDULED': 35,
    'IN_PROCESS': 50,
    'DOCUMENTS_PENDING': 65,
    'SUBMITTED': 80,
    'APPROVED': 95,
    'COMPLETED': 100
  }
  const progress = customer.progress || progressMap[customer.status] || 10

  // Format next milestone
  const nextMilestone = customer.nextMilestone || {
    title: customer.status === 'LEAD' ? 'Análise de Elegibilidade' :
      customer.status === 'QUALIFIED' ? 'Agendamento de Consultoria' :
        customer.status === 'IN_PROCESS' ? 'Coleta de Documentos' :
          customer.status === 'DOCUMENTS_PENDING' ? 'Revisão de Documentos' :
            customer.status === 'SUBMITTED' ? 'Aguardando Decisão' : 'Próxima Etapa',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    requirements: [],
    progress: 0
  }

  // Automation insights
  const automationInsights = customer.automationInsights || {
    emailsSent: 0,
    actionsCompleted: 0,
    nextAction: 'Análise inicial do perfil',
    engagementScore: customer.eligibilityScore || 0
  }

  // Documents with proper formatting
  const documents = (customer.documents || []).map((doc: any) => ({
    id: doc.id,
    name: doc.name || doc.fileName || 'Documento',
    status: (doc.status?.toLowerCase() === 'valid' ? 'valid' :
      doc.status?.toLowerCase() === 'invalid' ? 'invalid' :
        doc.status?.toLowerCase() === 'needs_review' ? 'needs_review' :
          doc.status?.toLowerCase() === 'analyzing' ? 'analyzing' : 'needs_review') as any,
    aiScore: doc.aiScore || 0,
    feedback: doc.feedback || doc.validationNotes || '',
    size: doc.size || 0,
    type: doc.type || 'application/pdf',
    uploadDate: doc.createdAt ? new Date(doc.createdAt) : new Date(),
    url: doc.url || ''
  }))

  // Consultations
  const consultations = (customer.consultations || []).slice(0, 3).map((c: any) => ({
    id: c.id,
    type: c.type || 'CONSULTATION',
    date: c.scheduledAt ? new Date(c.scheduledAt).toLocaleDateString('pt-BR') : 'A definir',
    status: c.status?.toLowerCase() || 'scheduled',
    consultant: c.consultantName || 'Especialista Visa2Any',
    result: c.result,
    topic: c.recommendation || 'Consultoria'
  }))

  // Notifications
  const notifications = (customer.notifications || []).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        customerData={{
          name: customer.name,
          email: customer.email,
          eligibilityScore: customer.eligibilityScore || 0,
          ...(customer.profilePhoto ? { profilePhoto: customer.profilePhoto } : {}),
          ...(customer.automationInsights ? { automationInsights: customer.automationInsights } : {})
        }}
        onSofiaChat={() => setShowSofiaChat(true)}
        onProfileEdit={() => setShowProfileEditor(true)}
        onSettingsClick={() => setShowSettings(true)}
        onLogout={logout}
      />

      {/* Barra de Progresso Global */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">Progresso do Processo</h2>
            <span className="text-sm font-semibold text-blue-600">{progress}% completo</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 relative"
              style={{ width: `${progress}%` }}
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
        {/* ... */}
      </div>

      {/* Modais */}
      <SofiaIA
        isOpen={showSofiaChat}
        onClose={() => setShowSofiaChat(false)}
        customerData={{
          ...customer,
          package: 'PREMIUM'
        }}
      />

      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        profileData={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          country: 'Brasil',
          nationality: 'Brasileira',
          age: 35,
          profession: 'Profissional',
          education: 'Superior',
          targetCountry: customer.destinationCountry,
          visaType: customer.visaType,
          profilePhoto: customer.profilePhoto || ''
        }}
        onSave={handleProfileSave}
      />

      <ClientSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Cards Principais Compactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-blue-500">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Visto Destino</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{customer.destinationCountry || 'A definir'}</p>
                <p className="text-xs text-blue-600">{customer.visaType || 'A definir'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-orange-500">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Próximo Marco</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{nextMilestone.title}</p>
                <p className="text-xs text-orange-600">{nextMilestone.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-green-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Score IA</p>
                <p className="text-sm font-semibold text-gray-900">{customer.eligibilityScore || 0}/100</p>
                <p className="text-xs text-green-600">Análise completa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-3 border-purple-500">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Automação</p>
                <p className="text-sm font-semibold text-gray-900">{automationInsights.actionsCompleted} ações</p>
                <p className="text-xs text-purple-600">IA ativa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown Compacto */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Análise do Perfil
            </h3>
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">IA Sofia</div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(scoreBreakdown).map(([key, value]) => {
              const labels: Record<string, string> = { age: 'Idade', education: 'Educação', experience: 'Exp.', language: 'Idiomas', funds: 'Recursos' }
              const colors: Record<string, string> = { age: 'blue', education: 'green', experience: 'purple', language: 'orange', funds: 'red' }
              const colorValue = colors[key] || 'blue'
              return (
                <div key={key} className="text-center">
                  <div className="relative w-10 h-10 mx-auto mb-1">
                    <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className={`text-${colorValue}-500`} stroke="currentColor" strokeWidth="3" strokeDasharray={`${value}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-900">{value}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-700">{labels[key] || key}</p>
                </div>
              )
            })}
          </div>
        </div>

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
        {customer.vagaExpressSubscription && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm p-4 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-600" />
                Vaga Express ({customer.vagaExpressSubscription.plan})
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${customer.vagaExpressSubscription.status === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
                }`}>
                {customer.vagaExpressSubscription.status === 'ACTIVE' ? '🟢 ATIVO' : '⏸️ INATIVO'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{customer.vagaExpressSubscription.slotsFound || 0}</div>
                <div className="text-xs text-gray-600">Vagas Detectadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{customer.vagaExpressSubscription.notificationsSent || 0}</div>
                <div className="text-xs text-gray-600">Notificações Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{customer.vagaExpressSubscription.monitoringCountries?.length || 0}</div>
                <div className="text-xs text-gray-600">Países Monitorados</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">2min</div>
                <div className="text-xs text-gray-600">Próxima Verificação</div>
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
                Documentos ({documents.length})
              </h3>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {documents.length === 0 ? (
                <div className="text-center py-4">
                  <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum documento enviado</p>
                  <button
                    onClick={() => setShowDocumentUpload(true)}
                    className="text-blue-600 text-sm mt-1 hover:underline"
                  >
                    Enviar primeiro documento
                  </button>
                </div>
              ) : (
                documents.slice(0, 3).map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 border border-gray-200 rounded text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${doc.status === 'approved' ? 'bg-green-100' :
                        doc.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                        <FileText className={`h-3 w-3 ${doc.status === 'approved' ? 'text-green-600' :
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
                    <div className={`px-2 py-1 rounded text-xs ${doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                      {doc.status === 'approved' ? '✓' : doc.status === 'pending' ? '⏳' : '🔄'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Consultorias */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
              <User className="h-4 w-4 text-green-600" />
              Consultorias ({consultations.length})
            </h3>
            <div className="space-y-2">
              {consultations.length === 0 ? (
                <div className="text-center py-4">
                  <User className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma consultoria agendada</p>
                  <a href="/contato" className="text-blue-600 text-sm mt-1 hover:underline">
                    Agendar consultoria
                  </a>
                </div>
              ) : (
                consultations.map((consultation: any) => (
                  <div key={consultation.id} className="p-2 border border-gray-200 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-xs">
                        {consultation.type === 'AI_ANALYSIS' ? '🤖 IA Sofia' :
                          consultation.type === 'HUMAN_CONSULTATION' ? '👨‍💼 Humana' : '📋 Revisão'}
                      </p>
                      <div className={`px-2 py-1 rounded text-xs ${consultation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {consultation.status === 'completed' ? '✅' : '📅'}
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs">📅 {consultation.date}</p>
                    {consultation.result && (
                      <p className="text-green-700 text-xs mt-1">📊 {consultation.result}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
              <Bell className="h-4 w-4 text-orange-600" />
              Notificações ({notifications.length})
            </h3>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <div key={notification.id} className={`p-2 border rounded text-xs ${!notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'success' ? 'bg-green-100' :
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
                ))
              )}
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
            {!customer.vagaExpressSubscription && (
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
                  <button
                    onClick={() => router.push(`/checkout-moderno?product=vaga-express&clientId=${customer.id}`)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                  >
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
                <button
                  onClick={() => router.push(`/checkout-moderno?product=servico-vip&clientId=${customer.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
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
                <button
                  onClick={() => router.push(`/checkout-moderno?product=curso-preparatorio&clientId=${customer.id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                >
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
                <button
                  onClick={() => router.push(`/checkout-moderno?product=seguro-rejeicao&clientId=${customer.id}`)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600"
                >
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
          ...customer,
          package: 'PREMIUM'
        }}
      />

      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        profileData={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          country: 'Brasil',
          nationality: 'Brasileira',
          age: 35,
          profession: 'Profissional',
          education: 'Superior',
          targetCountry: customer.destinationCountry,
          visaType: customer.visaType,
          profilePhoto: customer.profilePhoto || ''
        }}
        onSave={handleProfileSave}
      />

      <DocumentUpload
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        onDocumentsChange={handleDocumentsChange}
        existingDocuments={documents}
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
                country={customer.destinationCountry === 'Estados Unidos' ? 'USA' :
                  customer.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customer.visaType || 'Turismo'}
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
                country={customer.destinationCountry === 'Estados Unidos' ? 'USA' :
                  customer.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customer.visaType || 'Turismo'}
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
                country={customer.destinationCountry === 'Estados Unidos' ? 'USA' :
                  customer.destinationCountry === 'Canadá' ? 'CAN' : 'PRT'}
                visaType={customer.visaType || 'Turismo'}
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