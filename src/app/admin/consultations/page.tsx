'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Video, 
  Phone, 
  MessageSquare, 
  FileText, 
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Download,
  X,
  ArrowUp,
  ArrowDown,
  Mail
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { FormField, FormSelect, FormTextarea } from '@/components/ui/FormField'
import { formatters, validators, combineValidators } from '@/lib/formatters'
import { InlineEdit, InlineSelect } from '@/components/ui/InlineEdit'
import { RowActions } from '@/components/ui/HoverActions'
import { ConsultationDetailView } from '@/components/ConsultationDetailView'

interface Consultation {
  id: string
  type: string
  status: string
  scheduledAt?: string
  completedAt?: string
  duration?: number
  clientId: string
  client?: {
    name: string
    email: string
  }
  consultantId?: string
  consultant?: {
    name: string
  }
  notes?: string
  score?: number
  createdAt: string
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<'scheduledAt' | 'createdAt' | 'status' | 'type'>('scheduledAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid'>('list')
  const [showNewConsultationSlider, setShowNewConsultationSlider] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // System notifications
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchConsultations()
    
    // Verificar se deve abrir slider de nova consultoria
    if (searchParams.get('action') === 'new') {
      setShowNewConsultationSlider(true)
    }
  }, [])

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      if (response.ok) {
        const data = await response.json()
        setConsultations(Array.isArray(data.data) ? data.data : [])
      } else {
        setConsultations([])
      }
    } catch (error) {
      console.error('Erro ao buscar consultorias:', error)
      setConsultations([])
    } finally {
      setIsLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    'AI_ANALYSIS': 'Análise IA',
    'HUMAN_CONSULTATION': 'Consultoria Humana',
    'FOLLOW_UP': 'Follow-up',
    'DOCUMENT_REVIEW': 'Revisão de Docs',
    'INTERVIEW_PREP': 'Prep. Entrevista',
    'VIP_SERVICE': 'Serviço VIP'
  }

  const typeIcons: Record<string, any> = {
    'AI_ANALYSIS': Star,
    'HUMAN_CONSULTATION': User,
    'FOLLOW_UP': MessageSquare,
    'DOCUMENT_REVIEW': FileText,
    'INTERVIEW_PREP': Video,
    'VIP_SERVICE': CheckCircle
  }

  const statusLabels: Record<string, string> = {
    'SCHEDULED': 'Agendada',
    'IN_PROGRESS': 'Em Andamento',
    'COMPLETED': 'Concluída',
    'CANCELLED': 'Cancelada',
    'RESCHEDULED': 'Reagendada'
  }

  const statusColors: Record<string, string> = {
    'SCHEDULED': 'bg-blue-100 text-blue-700',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
    'COMPLETED': 'bg-green-100 text-green-700',
    'CANCELLED': 'bg-red-100 text-red-700',
    'RESCHEDULED': 'bg-purple-100 text-purple-700'
  }

  const safeConsultations = Array.isArray(consultations) ? consultations : []
  
  // Enhanced filtering and sorting logic
  const filteredAndSortedConsultations = safeConsultations
    .filter(consultation => {
      // Enhanced search across multiple fields
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' || 
        (consultation.client?.name || '').toLowerCase().includes(searchLower) ||
        (consultation.client?.email || '').toLowerCase().includes(searchLower) ||
        (consultation.consultant?.name || '').toLowerCase().includes(searchLower) ||
        (consultation.notes || '').toLowerCase().includes(searchLower) ||
        (typeLabels[consultation.type] || '').toLowerCase().includes(searchLower)
      
      const matchesStatus = statusFilter === 'ALL' || consultation.status === statusFilter
      const matchesType = typeFilter === 'ALL' || consultation.type === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'scheduledAt':
          aValue = a.scheduledAt ? new Date(a.scheduledAt) : new Date(0)
          bValue = b.scheduledAt ? new Date(b.scheduledAt) : new Date(0)
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'type':
          aValue = typeLabels[a.type] || a.type
          bValue = typeLabels[b.type] || b.type
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  
  // For backwards compatibility
  const filteredConsultations = filteredAndSortedConsultations

  const handleNewConsultation = () => {
    setShowNewConsultationSlider(true)
  }

  const handleCalendarView = () => {
    setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')
  }

  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/dashboard/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'consultations',
          filters: { searchTerm, statusFilter, typeFilter }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `consultorias-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        notifySuccess('Export realizado', 'Lista de consultorias exportada com sucesso')
      } else {
        throw new Error('Erro no export')
      }
    } catch (error) {
      notifyError('Erro no export', 'Não foi possível exportar a lista')
    }
  }

  const handleNotifications = () => {
    notifyInfo('Notificações enviadas', 'Notificações para consultorias agendadas foram enviadas')
  }

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowDetailView(true)
  }

  const handleEmailConsultation = (consultation: Consultation) => {
    if (consultation.client?.email) {
      const subject = `Consultoria ${typeLabels[consultation.type]} - Visa2Any`
      const body = `Olá ${consultation.client.name},\n\nSua consultoria ${typeLabels[consultation.type]} está agendada para ${consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleDateString('pt-BR') : 'data a definir'}.\n\nAtenciosamente,\nEquipe Visa2Any`
      window.open(`mailto:${consultation.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }
  }

  const handleWhatsAppConsultation = (consultation: Consultation) => {
    if (consultation.client) {
      const message = `Olá ${consultation.client.name}, em relação à sua consultoria ${typeLabels[consultation.type]} agendada para ${consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleDateString('pt-BR') : 'data a definir'}.`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleVideoCall = (consultation: Consultation) => {
    // Generate meeting link and start video call
    const meetingId = Math.random().toString(36).substring(2, 15)
    const meetingUrl = `https://meet.visa2any.com/room/${meetingId}`
    window.open(meetingUrl, '_blank')
    notifyInfo('Videochamada iniciada', 'Link da reunião foi aberto em nova aba')
  }

  const handleSendMessage = (consultation: Consultation) => {
    if (consultation.client) {
      const message = `Olá ${consultation.client.name}, em relação à sua consultoria ${typeLabels[consultation.type]} agendada para ${consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleDateString('pt-BR') : 'data a definir'}.`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const updateConsultationField = async (consultationId: string, field: string, value: string | number) => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        notifySuccess('Campo atualizado', `${field} foi atualizado com sucesso`)
        fetchConsultations()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar')
      }
    } catch (error) {
      notifyError('Erro ao atualizar', error instanceof Error ? error.message : 'Erro desconhecido')
      throw error
    }
  }

  const handleDeleteConsultation = async (consultationId: string) => {
    const consultation = consultations.find(c => c.id === consultationId)
    if (!confirm('Tem certeza que deseja excluir esta consultoria?')) return

    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        notifySuccess(
          'Consultoria excluída',
          `Consultoria ${typeLabels[consultation?.type || ''] || 'consultoria'} foi excluída com sucesso`
        )
        fetchConsultations()
      } else {
        const errorData = await response.json()
        notifyError(
          'Erro ao excluir',
          errorData.error || 'Erro ao excluir consultoria'
        )
      }
    } catch (error) {
      console.error('Erro:', error)
      notifyError(
        'Erro de conexão',
        'Erro ao excluir consultoria. Verifique sua conexão.'
      )
    }
  }

  const quickActions = [
    { icon: Plus, label: 'Nova Consultoria', color: 'btn-primary', onClick: handleNewConsultation },
    { icon: Calendar, label: 'Agenda Completa', color: 'btn-secondary', onClick: handleCalendarView },
    { icon: Download, label: 'Relatório', color: 'btn-secondary', onClick: handleDownloadReport },
    { icon: Send, label: 'Notificações', color: 'btn-secondary', onClick: handleNotifications }
  ]

  const todayConsultations = safeConsultations.filter(c => {
    if (!c.scheduledAt) return false
    const today = new Date()
    const scheduleDate = new Date(c.scheduledAt)
    return scheduleDate.toDateString() === today.toDateString()
  }).length

  const thisWeekConsultations = safeConsultations.filter(c => {
    if (!c.scheduledAt) return false
    const today = new Date()
    const scheduleDate = new Date(c.scheduledAt)
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return scheduleDate >= weekStart && scheduleDate <= weekEnd
  }).length

  if (isLoading) {
    return (
      <div className="gradient-admin min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 loading-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded w-64 loading-shimmer"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card-elevated p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl loading-shimmer"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 loading-shimmer"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2 loading-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-admin min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-heading text-3xl text-readable mb-2">
                Gestão de Consultorias
              </h1>
              <p className="text-readable-muted">
                Agende, acompanhe e gerencie todas as consultorias e atendimentos
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`${action.color} hover-lift flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all`}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Hoje', 
              value: todayConsultations, 
              icon: Calendar, 
              color: 'text-blue-600',
              subtitle: 'consultorias agendadas'
            },
            { 
              label: 'Esta Semana', 
              value: thisWeekConsultations, 
              icon: Clock, 
              color: 'text-green-600',
              subtitle: 'consultorias na agenda'
            },
            { 
              label: 'Concluídas', 
              value: safeConsultations.filter(c => c.status === 'COMPLETED').length, 
              icon: CheckCircle, 
              color: 'text-emerald-600',
              subtitle: 'este mês'
            },
            { 
              label: 'Em Andamento', 
              value: safeConsultations.filter(c => c.status === 'IN_PROGRESS').length, 
              icon: AlertCircle, 
              color: 'text-orange-600',
              subtitle: 'requer atenção'
            }
          ].map((stat, index) => (
            <div key={index} className="card-elevated p-6 hover-lift animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold text-readable">{stat.value}</span>
              </div>
              <div>
                <p className="text-caption font-semibold text-readable mb-1">{stat.label}</p>
                <p className="text-sm text-readable-muted">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="animate-slide-in card-elevated p-6">
          <div className="flex flex-col gap-4">
            {/* Search Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-muted" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, consultor, tipo, observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                />
              </div>
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title="Limpar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[160px]"
              >
                <option value="ALL">Todos os Status</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[160px]"
              >
                <option value="ALL">Todos os Tipos</option>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[150px]"
                >
                  <option value="scheduledAt">Data Agendada</option>
                  <option value="createdAt">Data de Criação</option>
                  <option value="status">Status</option>
                  <option value="type">Tipo</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable hover:bg-gray-50 transition-colors"
                  title={`Ordenar ${sortOrder === 'asc' ? 'Decrescente' : 'Crescente'}`}
                >
                  {sortOrder === 'asc' ? (
                    <ArrowUp className="h-5 w-5" />
                  ) : (
                    <ArrowDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Busca: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {statusFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Status: {statusLabels[statusFilter]}
                    <button onClick={() => setStatusFilter('ALL')} className="hover:text-green-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {typeFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Tipo: {typeLabels[typeFilter]}
                    <button onClick={() => setTypeFilter('ALL')} className="hover:text-purple-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setTypeFilter('ALL')
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-medium">{filteredConsultations.length}</span> de <span className="font-medium">{safeConsultations.length}</span> consultorias
                {filteredConsultations.length !== safeConsultations.length && (
                  <span className="text-blue-600 ml-1">(filtradas)</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Visualização em Lista"
                >
                  <Filter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Visualização em Grid"
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations List/Grid */}
        <div className="animate-fade-in">
          {filteredConsultations.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-readable mb-2">
                {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                  ? 'Nenhuma consultoria encontrada' 
                  : 'Nenhuma consultoria agendada'
                }
              </h3>
              <p className="text-readable-muted mb-6">
                {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece agendando uma nova consultoria'
                }
              </p>
              <button 
                onClick={handleNewConsultation}
                className="btn-primary hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consultoria
              </button>
            </div>
          ) : (
            viewMode === 'list' ? (
              // Modern Table View with Inline Editing,              <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consultoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agendada</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredConsultations.map((consultation) => {
                        const TypeIcon = typeIcons[consultation.type] || MessageSquare
                        return (
                          <RowActions
                            key={consultation.id}
                            actions={[
                              {
                                icon: Eye,
                                label: 'Ver detalhes',
                                onClick: () => handleViewConsultation(consultation),
                                variant: 'primary'
                              },
                              {
                                icon: Mail,
                                label: 'Enviar email',
                                onClick: () => handleEmailConsultation(consultation),
                                disabled: !consultation.client?.email
                              },
                              {
                                icon: MessageSquare,
                                label: 'WhatsApp',
                                onClick: () => handleWhatsAppConsultation(consultation),
                                disabled: !consultation.client
                              },
                              {
                                icon: Video,
                                label: 'Videochamada',
                                onClick: () => handleVideoCall(consultation)
                              },
                              {
                                icon: Trash2,
                                label: 'Excluir',
                                onClick: () => handleDeleteConsultation(consultation.id),
                                variant: 'danger'
                              }
                            ]}
                          >
                            <tr className="cursor-pointer" onClick={() => handleViewConsultation(consultation)}>
                              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-3">
                                    <TypeIcon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <InlineSelect
                                      value={consultation.type}
                                      options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))}
                                      onSave={(value) => updateConsultationField(consultation.id, 'type', value)}
                                      displayClassName="font-medium text-gray-900"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="font-medium text-gray-900">{consultation.client?.name || 'Não atribuído'}</div>
                                  <div className="text-sm text-gray-500">{consultation.client?.email || ''}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <InlineSelect
                                  value={consultation.status}
                                  options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                                  onSave={(value) => updateConsultationField(consultation.id, 'status', value)}
                                  displayClassName={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[consultation.status]}`}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <InlineEdit
                                  value={consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().slice(0, 16) : ''}
                                  onSave={(value) => updateConsultationField(consultation.id, 'scheduledAt', value ? new Date(value).toISOString() : '')}
                                  type="datetime-local"
                                  placeholder="Agendar"
                                  displayValue={consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleDateString('pt-BR', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Não agendada'}
                                  displayClassName="text-sm text-gray-900"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <InlineEdit
                                  value={consultation.duration?.toString() || '60'}
                                  onSave={(value) => updateConsultationField(consultation.id, 'duration', parseInt(value) || 60)}
                                  type="number"
                                  placeholder="60"
                                  displayValue={consultation.duration ? `${consultation.duration} min` : '60 min'}
                                  displayClassName="text-sm text-gray-900"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center">
                                  <InlineEdit
                                    value={consultation.score?.toString() || '0'}
                                    onSave={(value) => updateConsultationField(consultation.id, 'score', parseInt(value) || 0)}
                                    type="number"
                                    placeholder="0-100"
                                    displayClassName="text-sm font-medium text-gray-900"
                                  />
                                  <Star className="h-4 w-4 text-yellow-400 ml-1" />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {/* Actions will be shown on hover by RowActions */}
                              </td>
                            </tr>
                          </RowActions>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Grid View (simplified cards)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations.map((consultation) => {
                  const TypeIcon = typeIcons[consultation.type] || MessageSquare
                  return (
                    <RowActions
                      key={consultation.id}
                      actions={[
                        {
                          icon: Eye,
                          label: 'Ver detalhes',
                          onClick: () => handleViewConsultation(consultation),
                          variant: 'primary'
                        },
                        {
                          icon: Mail,
                          label: 'Enviar email',
                          onClick: () => handleEmailConsultation(consultation),
                          disabled: !consultation.client?.email
                        },
                        {
                          icon: MessageSquare,
                          label: 'WhatsApp',
                          onClick: () => handleWhatsAppConsultation(consultation),
                          disabled: !consultation.client
                        },
                        {
                          icon: Video,
                          label: 'Videochamada',
                          onClick: () => handleVideoCall(consultation)
                        },
                        {
                          icon: Trash2,
                          label: 'Excluir',
                          onClick: () => handleDeleteConsultation(consultation.id),
                          variant: 'danger'
                        }
                      ]}
                    >
                      <div className="card-elevated p-6 cursor-pointer" onClick={() => handleViewConsultation(consultation)}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[consultation.status]}`}>
                            {statusLabels[consultation.status]}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{typeLabels[consultation.type]}</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-2" />
                            {consultation.client?.name || 'Não atribuído'}
                          </div>
                          {consultation.scheduledAt && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              {new Date(consultation.scheduledAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                          {consultation.duration && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              {consultation.duration} minutos
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-xs text-gray-500">
                            {new Date(consultation.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          {consultation.score && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{consultation.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </RowActions>
                  )
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* Slide-over Detail View */}
      <ConsultationDetailView
        consultation={selectedConsultation}
        isOpen={showDetailView}
        onClose={() => setShowDetailView(false)}
        onUpdate={fetchConsultations}
      />

      {/* Slide-over de Nova Consultoria */}
      <NewConsultationSlider 
        isOpen={showNewConsultationSlider}
        onClose={() => setShowNewConsultationSlider(false)} 
        onSuccess={fetchConsultations}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
      />
    </div>
  )
}

// Slide-over moderno para nova consultoria
function NewConsultationSlider({ 
  isOpen,
  onClose, 
  onSuccess, 
  notifySuccess, 
  notifyError 
}: { 
  isOpen: boolean,
  onClose: () => void, 
  onSuccess: () => void,
  notifySuccess: (title: string, message: string) => void,
  notifyError: (title: string, message: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  
  const typeLabels: Record<string, string> = {
    'AI_ANALYSIS': 'Análise IA',
    'HUMAN_CONSULTATION': 'Consultoria Humana',
    'FOLLOW_UP': 'Follow-up',
    'DOCUMENT_REVIEW': 'Revisão de Docs',
    'INTERVIEW_PREP': 'Prep. Entrevista',
    'VIP_SERVICE': 'Serviço VIP'
  }
  
  const [formData, setFormData] = useState({
    clientId: '',
    type: '',
    scheduledAt: '',
    duration: '60',
    notes: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchClients()
      // Set default scheduled time to next hour
      const nextHour = new Date()
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
      setFormData(prev => ({
        ...prev,
        scheduledAt: nextHour.toISOString().slice(0, 16)
      }))
    }
  }, [isOpen])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.data?.clients || [])
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const consultationData = {
        ...formData,
        duration: parseInt(formData.duration),
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined
      }
      
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(consultationData)
      })

      if (response.ok) {
        const result = await response.json()
        
        notifySuccess(
          'Consultoria agendada',
          `Consultoria ${typeLabels[formData.type] || formData.type} foi agendada com sucesso`
        )
        
        // Reset form
        setFormData({
          clientId: '',
          type: '',
          scheduledAt: '',
          duration: '60',
          notes: ''
        })
        
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        notifyError(
          'Erro ao agendar consultoria',
          errorData.error || `Erro ao agendar consultoria (${response.status})`
        )
      }
    } catch (error) {
      notifyError(
        'Erro de conexão',
        'Erro de conexão. Verifique sua internet.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col max-h-screen">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Nova Consultoria</h2>
                <p className="text-sm text-gray-600 mt-1">Agende rapidamente uma consultoria</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-80 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-3">
              
              {/* Cliente */}
              <FormSelect
                label="Cliente"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                required
                placeholder="Selecione um cliente..."
                tooltip="Cliente para quem a consultoria será agendada"
                options={clients.map(client => ({
                  value: client.id,
                  label: `${client.name} - ${client.email}`
                }))}
                helpText={clients.length === 0 ? "Nenhum cliente encontrado. Crie um cliente primeiro." : undefined}
              />

              {/* Tipo de Consultoria */}
              <FormSelect
                label="Tipo de Consultoria"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
                placeholder="Selecione o tipo..."
                tooltip="Tipo de serviço que será prestado na consultoria"
                options={[
                  { value: "AI_ANALYSIS", label: "🤖 Análise IA" },
                  { value: "HUMAN_CONSULTATION", label: "👨‍💼 Consultoria Humana" },
                  { value: "FOLLOW_UP", label: "📞 Follow-up" },
                  { value: "DOCUMENT_REVIEW", label: "📋 Revisão de Documentos" },
                  { value: "INTERVIEW_PREP", label: "🎭 Preparação para Entrevista" },
                  { value: "VIP_SERVICE", label: "⭐ Serviço VIP" }
                ]}
              />

              {/* Data e Hora */}
              <FormField
                label="Data e Hora do Agendamento"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                min={new Date().toISOString().slice(0, 16)}
                tooltip="Quando a consultoria será realizada"
                helpText="Se não especificado, será agendado para depois"
                leftIcon={<Calendar className="h-4 w-4" />}
              />

              {/* Duração */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-xs font-medium text-gray-700">Duração</label>
                  <div className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-600 rounded-full text-xs cursor-help hover:bg-gray-200 transition-colors" title="Selecione a duração estimada da consultoria">
                    ?
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '30', label: '30 min', desc: 'Consulta rápida' },
                    { value: '60', label: '1 hora', desc: 'Padrão' },
                    { value: '90', label: '1h 30min', desc: 'Detalhada' },
                    { value: '120', label: '2 horas', desc: 'Completa' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, duration: option.value})}
                      className={`p-2 border-2 rounded-lg transition-all text-left hover:shadow-sm ${
                        formData.duration === option.value
                          ? 'border-blue-600 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-xs">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <FormTextarea
                label="Observações"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Tópicos a discutir, preparação necessária..."
                rows={2}
                maxLength={300}
                showCharCount
                tooltip="Informações importantes sobre a consultoria, agenda ou preparação"
              />
            </div>

            {/* Footer Actions - sempre visível */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.clientId || !formData.type}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      Agendar Consultoria
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

