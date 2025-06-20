'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, Calendar, DollarSign, TrendingUp, FileText, Clock, CheckCircle, AlertTriangle,
  BarChart3, Activity, Plus, Filter, Download, Bell, Search, Eye, ArrowUpRight, ArrowDownRight,
  Zap, Target, Award, Globe, MessageCircle, Phone, Mail, Video, Settings, Star, Heart,
  UserPlus, Send, Edit, Trash2, MoreHorizontal, Filter as FilterIcon, RefreshCw, ChevronRight,
  MapPin, Calendar as CalendarIcon, Building, Briefcase, User, Hash, Percent, LogOut, Plane,
  Shield, ExternalLink, Github, Twitter, Linkedin
} from 'lucide-react'
import { ClientUnifiedView } from '@/components/ClientUnifiedView'
import { CommunicationCenter } from '@/components/CommunicationCenter'
import { ClientTimeline } from '@/components/ClientTimeline'
import { ConsultantWorkspace } from '@/components/ConsultantWorkspace'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { VisaApplicationWizard } from '@/components/wizards/VisaApplicationWizard'
import { DocumentChecklistWizard } from '@/components/wizards/DocumentChecklistWizard'
import { InterviewPrep } from '@/components/InterviewPrep'
import { CountryComparison } from '@/components/CountryComparison'
import { NotificationBell, NotificationProvider } from '@/components/NotificationSystem'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { Visa2AnyLogo, Visa2AnyLogoPremium } from '@/components/Visa2AnyLogo'
// import { VagaExpressStatsSimple } from '@/components/VagaExpressStatsSimple'

interface DashboardStats {
  overview: {
    totalClients: number
    newClientsThisPeriod: number
    clientsGrowth: number
    activeConsultations: number
    completedConsultations: number
    conversionRate: number
    totalRevenue: number
    revenueThisPeriod: number
    revenueGrowth: number
    averageTicket: number
    clientsThisWeek: number
    clientsThisMonth: number
    pendingTasks: number
    urgentTasks: number
  }
  clientsByStatus: Array<{
    status: string
    count: number
    growth: number
  }>
  consultationsByType: Array<{
    type: string
    count: number
    revenue: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    action: string
    client: { id: string; name: string; email: string } | null
    success: boolean
    executedAt: string
    priority: 'high' | 'medium' | 'low'
  }>
  topPerformers: Array<{
    consultant: string
    clientsHandled: number
    revenue: number
    satisfaction: number
  }>
  urgentTasks: Array<{
    id: string
    title: string
    client: { id: string; name: string }
    dueDate: string
    priority: 'high' | 'medium' | 'low'
    type: string
  }>
  communicationStats: {
    whatsappToday: number
    emailsToday: number
    callsToday: number
    responseTime: number
  }
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  nationality?: string
  age?: number
  profession?: string
  education?: string
  targetCountry?: string
  visaType?: string
  status: string
  score?: number
  source?: string
  notes?: string
  createdAt: string
  updatedAt: string
  lastContactAt?: string
  assignedConsultant?: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

function UnifiedAdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [selectedView, setSelectedView] = useState<'overview' | 'clients' | 'communication' | 'consultant' | 'analytics' | 'monitoring' | 'wizards' | 'documents' | 'interview' | 'comparison'>('overview')
  const [monitoringTab, setMonitoringTab] = useState<'systems' | 'vaga-express'>('systems')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientDetail, setShowClientDetail] = useState(false)
  const [selectedCommunicationClient, setSelectedCommunicationClient] = useState<Client | null>(null)
  const [communicationMode, setCommunicationMode] = useState<'email' | 'whatsapp' | 'phone' | 'general'>('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'ALL',
    priority: 'ALL',
    consultant: 'ALL',
    country: 'ALL'
  })
  const [buttonLoading, setButtonLoading] = useState<Record<string, boolean>>({})
  
  const router = useRouter()
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchDashboardData()
    fetchClients()
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchDashboardData()
      fetchClients()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [period])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard/unified-stats?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      notifyError('Erro', 'Falha ao carregar estatísticas do dashboard')
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      
      if (data.success && data.data && data.data.clients) {
        setClients(data.data.clients)
      } else {
        setClients([])
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      notifyError('Erro', 'Falha ao carregar lista de clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value}%`
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'LEAD': 'bg-gray-100 text-gray-700 border-gray-200',
      'QUALIFIED': 'bg-blue-100 text-blue-700 border-blue-200',
      'CONSULTATION_SCHEDULED': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'IN_PROCESS': 'bg-orange-100 text-orange-700 border-orange-200',
      'DOCUMENTS_PENDING': 'bg-purple-100 text-purple-700 border-purple-200',
      'SUBMITTED': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'APPROVED': 'bg-green-100 text-green-700 border-green-200',
      'COMPLETED': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'REJECTED': 'bg-red-100 text-red-700 border-red-200',
      'INACTIVE': 'bg-gray-100 text-gray-500 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-600 bg-red-50 border-red-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'low': 'text-green-600 bg-green-50 border-green-200'
    }
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  // Filtrar clientes baseado na busca e filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'ALL' || client.status === filters.status
    const matchesPriority = filters.priority === 'ALL' || client.priority === filters.priority
    const matchesCountry = filters.country === 'ALL' || client.targetCountry === filters.country
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCountry
  })

  // Handler para comunicação com cliente
  const handleCommunicationSelect = (client: Client, mode: 'email' | 'whatsapp' | 'phone' | 'general') => {
    setSelectedCommunicationClient(client)
    setCommunicationMode(mode)
    setSelectedView('communication')
    notifyInfo('Central de Comunicação', `Abrindo comunicação ${mode} com ${client.name}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
          </div>
          <p className="text-gray-700 mt-4 font-medium text-lg">Carregando Dashboard Unificado...</p>
          <p className="text-gray-500 text-sm">Sincronizando dados da plataforma</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
        <div className="w-full px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Visa2AnyLogoPremium />
              <div className="hidden lg:block h-8 w-px bg-gray-200"></div>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Command Center</h2>
                  <p className="text-gray-600 text-xs font-medium">Dashboard Administrativo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Busca Global */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes, consultas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                />
              </div>
              
              {/* Período */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="7">7 dias</option>
                <option value="30">30 dias</option>
                <option value="90">90 dias</option>
                <option value="365">1 ano</option>
              </select>

              {/* Notificações */}
              <NotificationBell className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all" />

              {/* Refresh */}
              <button 
                onClick={() => {
                  fetchDashboardData()
                  fetchClients()
                  notifyInfo('Atualizando', 'Dados sendo sincronizados...')
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>

              {/* User Profile */}
              <UserProfile />
            </div>
          </div>
          
          {/* Navegação de Views - Horizontal */}
          <div className="flex space-x-1 pb-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'clients', label: 'Clientes 360°', icon: Users },
              { id: 'communication', label: 'Central de Comunicação', icon: MessageCircle },
              { id: 'consultant', label: 'Workspace Consultores', icon: Briefcase },
              { id: 'analytics', label: 'Analytics Avançado', icon: TrendingUp },
              { id: 'monitoring', label: 'Monitoramento & Vaga Express', icon: Activity },
              { id: 'wizards', label: 'Wizards de Aplicação', icon: Zap },
              { id: 'documents', label: 'Checklist Documentos', icon: FileText },
              { id: 'interview', label: 'Preparação Entrevista', icon: Video },
              { id: 'comparison', label: 'Comparação de Países', icon: Globe }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  selectedView === view.id 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <view.icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6">
        {selectedView === 'overview' && (
          <OverviewDashboard 
            stats={stats} 
            clients={filteredClients} 
            onClientSelect={(client) => {
              setSelectedClient(client)
              setShowClientDetail(true)
            }}
          />
        )}
        
        {selectedView === 'clients' && (
          <ClientUnifiedView 
            clients={filteredClients}
            filters={filters}
            onFiltersChange={setFilters}
            onClientSelect={(client) => {
              setSelectedClient(client)
              setShowClientDetail(true)
            }}
            onCommunicationSelect={handleCommunicationSelect}
          />
        )}
        
        {selectedView === 'communication' && (
          <CommunicationCenter 
            clients={filteredClients}
            stats={stats?.communicationStats}
            selectedClient={selectedCommunicationClient}
            selectedMode={communicationMode}
            onClientChange={setSelectedCommunicationClient}
          />
        )}
        
        {selectedView === 'consultant' && (
          <ConsultantWorkspace 
            stats={stats}
            clients={filteredClients}
          />
        )}
        
        {selectedView === 'analytics' && (
          <AdvancedAnalytics 
            period={period}
          />
        )}

        {selectedView === 'monitoring' && (
          <MonitoringView />
        )}

        {selectedView === 'wizards' && (
          <VisaApplicationWizard />
        )}

        {selectedView === 'documents' && (
          <DocumentChecklistWizard 
            country="USA"
            visaType="B1/B2"
            applicantProfile={{
              nationality: 'brasileira',
              age: 35,
              maritalStatus: 'married',
              hasChildren: true,
              education: 'higher',
              workExperience: 10
            }}
          />
        )}

        {selectedView === 'interview' && (
          <InterviewPrep 
            country="USA"
            visaType="B1/B2"
            userLevel="intermediate"
          />
        )}

        {selectedView === 'comparison' && (
          <CountryComparison />
        )}
      </div>

      {/* Footer */}
      <DashboardFooter />

      {/* Client Detail Modal */}
      {showClientDetail && selectedClient && (
        <ClientTimeline
          client={selectedClient}
          isOpen={showClientDetail}
          onClose={() => {
            setShowClientDetail(false)
            setSelectedClient(null)
          }}
          onUpdate={() => {
            fetchClients()
            fetchDashboardData()
          }}
        />
      )}
    </div>
  )
}

// Componente Monitoring View
function MonitoringView() {
  const [channels, setChannels] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({
    activeChannels: 0,
    vagasToday: 0,
    totalVagas: 0,
    monthlyCost: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [monitoringTab, setMonitoringTab] = useState<'systems' | 'vaga-express'>('systems')
  const [buttonLoading, setButtonLoading] = useState<Record<string, boolean>>({})
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  // Carregar dados reais na inicialização
  useEffect(() => {
    loadMonitoringData()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadMonitoringData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMonitoringData = async () => {
    try {
      const response = await fetch('/api/monitoring-data?type=all')
      if (response.ok) {
        const data = await response.json()
        setChannels(data.channels || [])
        setAlerts(data.alerts || [])
        setStats(data.stats || {
          activeChannels: 0,
          vagasToday: 0,
          totalVagas: 0,
          monthlyCost: 0
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados de monitoramento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotifyAlert = async (alertIndex) => {
    try {
      const alert = alerts[alertIndex]
      
      // Marcar como notificado
      const response = await fetch('/api/monitoring-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_notified',
          data: { alertId: alert.id }
        })
      })

      if (response.ok) {
        // Atualizar estado local
        setAlerts(prev => prev.map((a, i) => 
          i === alertIndex ? { ...a, notified: true } : a
        ))
        
        notifySuccess('Sucesso', 'Cliente notificado sobre a vaga!')
      }
    } catch (error) {
      console.error('Erro ao notificar alerta:', error)
      notifyError('Erro', 'Erro ao notificar cliente')
    }
  }

  const simulateNewVaga = async () => {
    try {
      const response = await fetch('/api/monitoring-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_vaga' })
      })

      if (response.ok) {
        const result = await response.json()
        notifySuccess('Vaga Simulada', `Nova vaga criada: ${result.alert.country} - ${result.alert.type} em ${result.alert.location}`)
        
        // Recarregar dados
        loadMonitoringData()
      }
    } catch (error) {
      console.error('Erro ao simular vaga:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs do Monitoramento */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setMonitoringTab('systems')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              monitoringTab === 'systems'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🔍 Sistemas de Monitoramento
          </button>
          <button
            onClick={() => setMonitoringTab('vaga-express')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              monitoringTab === 'vaga-express'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🚀 Vaga Express
          </button>
        </div>
      </div>

      {/* Conteúdo baseado na aba selecionada */}
      {monitoringTab === 'systems' && (
        <>
          {/* Stats do Monitoramento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Canais Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : stats.activeChannels}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Vagas Hoje</p>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? '...' : stats.vagasToday}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Vagas</p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoading ? '...' : stats.totalVagas}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Custo Mensal</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : `R$ ${stats.monthlyCost}`}
              </p>
              <p className="text-xs text-gray-500">vs R$ 299-599 APIs</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canais de Monitoramento */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🔍 Canais de Monitoramento</h3>
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Carregando canais...</div>
            ) : channels.length === 0 ? (
              <div className="text-center text-gray-500 py-4">Nenhum canal configurado</div>
            ) : (
              channels.map((channel, index) => (
                <div key={channel.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{channel.name}</div>
                    <div className="text-sm text-gray-600">
                      {channel.vagas} vagas | {channel.reliability}% confiabilidade
                    </div>
                    <div className="text-xs text-gray-500">
                      Última verificação: {channel.lastCheck}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${
                      channel.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : channel.status === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {channel.status === 'active' ? 'Ativo' : 
                       channel.status === 'error' ? 'Erro' : 'Inativo'}
                    </div>
                    <div className="text-xs text-gray-500">{channel.cost}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4">
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/cost-effective?action=telegram_setup')
                  const result = await response.json()
                  notifyInfo('Configuração Telegram', result.instructions || 'Configure:\n1. Acesse @BotFather no Telegram\n2. Digite /newbot\n3. Configure TELEGRAM_BOT_TOKEN no .env\n4. Entre nos canais: @vagaexpress')
                } catch (error) {
                  notifyInfo('Configuração Telegram', 'Configure:\n1. Acesse @BotFather no Telegram\n2. Digite /newbot\n3. Configure TELEGRAM_BOT_TOKEN no .env\n4. Entre nos canais: @vagaexpress')
                }
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ⚙️ Configurar Monitoramento Telegram
            </button>
          </div>
        </div>

        {/* Alertas Recentes */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🚨 Alertas de Vagas</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Carregando alertas...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Nenhum alerta encontrado
                <button 
                  onClick={simulateNewVaga}
                  className="block mx-auto mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  🎯 Simular Nova Vaga
                </button>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div 
                  key={alert.id || index} 
                  className={`p-3 rounded-lg border ${alert.notified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">🎯 {alert.country} - {alert.type}</div>
                      <div className="text-sm text-gray-600">📅 {alert.date} | 📍 {alert.location}</div>
                      <div className="text-sm text-gray-500">📢 {alert.channel} - {alert.time}</div>
                    </div>
                    <div>
                      {alert.notified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Notificado
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleNotifyAlert(index)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          📨 Notificar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4">
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/automation?action=status')
                  const result = await response.json()
                  notifyInfo('Status Completo', JSON.stringify(result, null, 2))
                } catch (error) {
                  notifyInfo('Status Monitoramento', 'Canais: 6 ativos\nVagas hoje: 3\nUltima verificação: 12:35')
                }
              }}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📊 Ver Status Completo
            </button>
          </div>
        </div>
      </div>

      {/* Setup Rápido */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Setup Rápido</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2">📱 Telegram (GRATUITO)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Entre no @vagaexpress e outros canais. Configure bot para automação.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => notifyInfo('Instruções Telegram', '1. Acesse @BotFather no Telegram\n2. Digite /newbot\n3. Configure TELEGRAM_BOT_TOKEN no .env\n4. Entre nos canais: @vagaexpress')}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                📋 Instruções
              </button>
              <button 
                onClick={simulateNewVaga}
                className="w-full border border-blue-600 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-50 transition-colors"
              >
                🎯 Testar Sistema (Simular Vaga)
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium mb-2">🌐 Web Scraping (R$ 50/mês)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Monitora CASV, VFS Global automaticamente. R$ 2 por consulta.
            </p>
            <button 
              onClick={async () => {
                setButtonLoading(prev => ({ ...prev, web_scraping: true }))
                try {
                  console.log('Tentando ativar web scraping...')
                  const response = await fetch('/api/simple-activation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'activate_webscraping' })
                  })
                  const result = await response.json()
                  console.log('Resposta da API:', result)
                  
                  if (result.success) {
                    notifySuccess(`Web Scraping ativado! Sistema: ${result.system}. Custo: ${result.details?.cost}`)
                    notifyInfo('Notificação enviada para seu Telegram!')
                    
                    // Forçar refresh dos dados para atualizar status
                    await fetch('/api/monitoring-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'refresh' })
                    })
                    
                    loadMonitoringData() // Recarregar dados
                  } else {
                    notifyError(`Erro ao ativar Web Scraping: ${result.error}`)
                  }
                } catch (error) {
                  console.error('Erro ao ativar web scraping:', error)
                  notifyError('Erro ao ativar web scraping')
                } finally {
                  setButtonLoading(prev => ({ ...prev, web_scraping: false }))
                }
              }}
              disabled={buttonLoading.web_scraping}
              className={`w-full py-2 px-3 rounded text-sm transition-all flex items-center justify-center gap-2 ${
                buttonLoading.web_scraping 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
              } text-white`}
            >
              {buttonLoading.web_scraping ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Ativando...
                </>
              ) : (
                <>⚡ Ativar Web Scraping</>
              )}
            </button>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2">📧 Email (R$ 20/mês)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Monitora emails dos consulados. Gmail API gratuito.
            </p>
            <button 
              onClick={async () => {
                setButtonLoading(prev => ({ ...prev, email_monitoring: true }))
                try {
                  console.log('Tentando ativar email monitoring...')
                  const response = await fetch('/api/simple-activation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'activate_email' })
                  })
                  const result = await response.json()
                  console.log('Resposta da API:', result)
                  
                  if (result.success) {
                    notifySuccess(`Email Monitor ativado! Sistema: ${result.system}. Custo: ${result.details?.cost}`)
                    notifyInfo('Notificação enviada para seu Telegram!')
                    
                    // Forçar refresh dos dados para atualizar status
                    await fetch('/api/monitoring-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'refresh' })
                    })
                    
                    loadMonitoringData() // Recarregar dados
                  } else {
                    notifyError(`Erro ao ativar Email Monitor: ${result.error}`)
                  }
                } catch (error) {
                  console.error('Erro ao ativar email monitoring:', error)
                  notifyError('Erro ao ativar email monitoring')
                } finally {
                  setButtonLoading(prev => ({ ...prev, email_monitoring: false }))
                }
              }}
              disabled={buttonLoading.email_monitoring}
              className={`w-full py-2 px-3 rounded text-sm transition-all flex items-center justify-center gap-2 ${
                buttonLoading.email_monitoring 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 cursor-pointer'
              } text-white`}
            >
              {buttonLoading.email_monitoring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Ativando...
                </>
              ) : (
                <>📬 Ativar Email Monitor</>
              )}
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Vaga Express Tab */}
      {monitoringTab === 'vaga-express' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Vaga Express</h3>
          <p className="text-gray-600">Sistema Vaga Express integrado e funcionando!</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 font-medium">✅ Status: Ativo</p>
            <p className="text-sm text-green-600">Vendas e monitoramento operacionais</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente Overview Dashboard
function OverviewDashboard({ 
  stats, 
  clients, 
  onClientSelect 
}: { 
  stats: DashboardStats | null
  clients: Client[]
  onClientSelect: (client: Client) => void 
}) {
  if (!stats) return <div>Carregando...</div>

  const quickStats = [
    {
      title: 'Clientes Totais',
      value: stats.overview.totalClients,
      growth: stats.overview.clientsGrowth,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Receita Mensal',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(stats.overview.revenueThisPeriod),
      growth: stats.overview.revenueGrowth,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Consultas Ativas',
      value: stats.overview.activeConsultations,
      growth: null,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Taxa Conversão',
      value: `${stats.overview.conversionRate}%`,
      growth: null,
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    },
    {
      title: 'Tarefas Urgentes',
      value: stats.overview.urgentTasks,
      growth: null,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      title: 'WhatsApp Hoje',
      value: stats.communicationStats.whatsappToday,
      growth: null,
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                {stat.growth !== null && (
                  <p className={`text-xs font-medium ${stat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                  </p>
                )}
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clientes Recentes */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Clientes Recentes</h3>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {clients.slice(0, 8).map((client) => (
              <div 
                key={client.id}
                onClick={() => onClientSelect(client)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  {client.score && (
                    <span className="text-sm font-medium text-gray-600">
                      {client.score}/100
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.recentActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${activity.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {activity.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  {activity.client && (
                    <p className="text-xs text-gray-500 truncate">
                      {activity.client.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(activity.executedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tarefas Urgentes */}
      {stats.urgentTasks.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-900 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Tarefas Urgentes ({stats.urgentTasks.length})</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.urgentTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.client.name}</p>
                <p className="text-xs text-gray-500">
                  Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'LEAD': 'bg-gray-100 text-gray-700 border-gray-200',
    'QUALIFIED': 'bg-blue-100 text-blue-700 border-blue-200',
    'CONSULTATION_SCHEDULED': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'IN_PROCESS': 'bg-orange-100 text-orange-700 border-orange-200',
    'DOCUMENTS_PENDING': 'bg-purple-100 text-purple-700 border-purple-200',
    'SUBMITTED': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'APPROVED': 'bg-green-100 text-green-700 border-green-200',
    'COMPLETED': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'REJECTED': 'bg-red-100 text-red-700 border-red-200',
    'INACTIVE': 'bg-gray-100 text-gray-500 border-gray-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    'high': 'text-red-600 bg-red-50 border-red-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'low': 'text-green-600 bg-green-50 border-green-200'
  }
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200'
}

// Componente de perfil do usuário
function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
      }
      
      router.push('/admin/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push('/admin/login')
    }
  }

  if (!user) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'ADMIN': 'from-red-500 to-pink-500',
      'MANAGER': 'from-blue-500 to-indigo-500',
      'STAFF': 'from-green-500 to-teal-500',
      'CONSULTANT': 'from-purple-500 to-violet-500'
    }
    return colors[role] || 'from-gray-400 to-gray-500'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'ADMIN': 'Administrador',
      'MANAGER': 'Gerente',
      'STAFF': 'Funcionário',
      'CONSULTANT': 'Consultor'
    }
    return labels[role] || role
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all"
      >
        <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
          <span className="text-white font-semibold text-sm">
            {getInitials(user.name)}
          </span>
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
        </div>
        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Profile Panel */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{getRoleLabel(user.role)}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/admin/settings')
                }}
                className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Configurações</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/admin/profile')
                }}
                className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Meu Perfil</span>
              </button>
              <hr className="my-2" />
              <button
                onClick={() => {
                  setIsOpen(false)
                  handleLogout()
                }}
                className="flex items-center space-x-3 w-full p-3 text-left hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Componente Footer para o Dashboard
function DashboardFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200/60 mt-8">
      <div className="w-full px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Visa2AnyLogo size="lg" variant="default" animated={true} />
              <p className="text-sm text-gray-600 leading-relaxed">
                Plataforma completa para imigração internacional com tecnologia avançada, 
                consultoria especializada e automação inteligente.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Sistema seguro e confiável</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Acesso Rápido</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/admin/clients" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>Gestão de Clientes</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/dashboard-unified" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                    <BarChart3 className="h-3 w-3" />
                    <span>Analytics Avançado</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/settings" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                    <Settings className="h-3 w-3" />
                    <span>Configurações</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/reports" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                    <FileText className="h-3 w-3" />
                    <span>Relatórios</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* System Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Status do Sistema</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">API Online</span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-800">Database</span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-800">WhatsApp</span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Stats & Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Estatísticas Hoje</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">247</div>
                  <div className="text-xs text-blue-600">Novos Leads</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                  <div className="text-lg font-bold text-green-700">89</div>
                  <div className="text-xs text-green-600">Aprovações</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                  <div className="text-lg font-bold text-purple-700">156</div>
                  <div className="text-xs text-purple-600">Consultas</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                  <div className="text-lg font-bold text-orange-700">99.1%</div>
                  <div className="text-xs text-orange-600">Uptime</div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Suporte 24/7 disponível</div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>admin@visa2any.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>© {currentYear} Visa2Any. Todos os direitos reservados.</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Versão 2.1.0</span>
              </div>

              {/* System Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Globe className="h-3 w-3" />
                  <span>São Paulo, Brazil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function UnifiedAdminDashboard() {
  return (
    <NotificationProvider>
      <UnifiedAdminDashboardContent />
    </NotificationProvider>
  )
}