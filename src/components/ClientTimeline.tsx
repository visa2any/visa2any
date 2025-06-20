'use client'

import { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Star, FileText, Clock, CheckCircle, AlertTriangle,
  Edit, Trash2, Send, Video, MessageCircle, Download, ExternalLink, Plus, Filter, Search,
  Briefcase, Building, Globe, Heart, Flag, Award, Activity, Zap, Bell, Eye, EyeOff,
  ArrowRight, ArrowLeft, ChevronDown, ChevronUp, MoreHorizontal, X, Tag, Hash,
  DollarSign, Target, TrendingUp, Users, Calendar as CalendarIcon, CreditCard,
  Paperclip, Image, Mic, Smile, Copy, Share, Archive, Pin, Reply, Forward
} from 'lucide-react'
import { SlideOver } from '@/components/ui/SlideOver'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

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

interface TimelineEvent {
  id: string
  type: 'status_change' | 'document_upload' | 'communication' | 'consultation' | 'payment' | 'note' | 'system' | 'task'
  title: string
  description: string
  timestamp: string
  author?: string
  metadata?: {
    oldValue?: string
    newValue?: string
    amount?: number
    documentType?: string
    communicationType?: 'whatsapp' | 'email' | 'call' | 'sms'
    paymentMethod?: string
    priority?: 'high' | 'medium' | 'low'
    status?: string
    attachment?: {
      name: string
      type: string
      url: string
      size: number
    }
  }
}

interface ClientTimelineProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ClientTimeline({ client, isOpen, onClose, onUpdate }: ClientTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'timeline' | 'documents' | 'communications' | 'payments' | 'tasks'>('overview')
  const [newNote, setNewNote] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'status_change' | 'communication' | 'document' | 'payment'>('all')
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    if (isOpen && client) {
      fetchTimeline()
    }
  }, [isOpen, client])

  const fetchTimeline = async () => {
    try {
      const response = await fetch(`/api/clients/${client.id}/timeline`)
      const data = await response.json()
      
      if (data.success) {
        setTimeline(data.timeline || [])
      }
    } catch (error) {
      console.error('Erro ao buscar timeline:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateClientField = async (field: string, value: string) => {
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        notifySuccess('Atualizado', `${field} foi atualizado com sucesso`)
        setEditingField(null)
        setEditValue('')
        onUpdate()
        fetchTimeline()
      } else {
        throw new Error('Erro ao atualizar')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao atualizar campo')
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const response = await fetch(`/api/clients/${client.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      })

      if (response.ok) {
        notifySuccess('Nota adicionada', 'Nota foi salva com sucesso')
        setNewNote('')
        setShowNoteForm(false)
        fetchTimeline()
      } else {
        throw new Error('Erro ao salvar nota')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao salvar nota')
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <ArrowRight className="h-4 w-4 text-blue-600" />
      case 'document_upload': return <FileText className="h-4 w-4 text-green-600" />
      case 'communication': return <MessageCircle className="h-4 w-4 text-purple-600" />
      case 'consultation': return <Video className="h-4 w-4 text-orange-600" />
      case 'payment': return <CreditCard className="h-4 w-4 text-green-600" />
      case 'note': return <Edit className="h-4 w-4 text-gray-600" />
      case 'system': return <Zap className="h-4 w-4 text-indigo-600" />
      case 'task': return <CheckCircle className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'status_change': return 'border-blue-200 bg-blue-50'
      case 'document_upload': return 'border-green-200 bg-green-50'
      case 'communication': return 'border-purple-200 bg-purple-50'
      case 'consultation': return 'border-orange-200 bg-orange-50'
      case 'payment': return 'border-green-200 bg-green-50'
      case 'note': return 'border-gray-200 bg-gray-50'
      case 'system': return 'border-indigo-200 bg-indigo-50'
      case 'task': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'LEAD': 'bg-gray-100 text-gray-700',
      'QUALIFIED': 'bg-blue-100 text-blue-700',
      'CONSULTATION_SCHEDULED': 'bg-yellow-100 text-yellow-700',
      'IN_PROCESS': 'bg-orange-100 text-orange-700',
      'DOCUMENTS_PENDING': 'bg-purple-100 text-purple-700',
      'SUBMITTED': 'bg-indigo-100 text-indigo-700',
      'APPROVED': 'bg-green-100 text-green-700',
      'COMPLETED': 'bg-emerald-100 text-emerald-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const filteredTimeline = timeline.filter(event => {
    if (filterType === 'all') return true
    if (filterType === 'document' && event.type === 'document_upload') return true
    if (filterType === 'communication' && event.type === 'communication') return true
    if (filterType === 'payment' && event.type === 'payment') return true
    if (filterType === 'status_change' && event.type === 'status_change') return true
    return false
  })

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'communications', label: 'Comunicações', icon: MessageCircle },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'tasks', label: 'Tarefas', icon: CheckCircle }
  ]

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Perfil Completo do Cliente"
      subtitle={client.email}
      size="xl"
    >
      <div className="h-full flex flex-col">
        {/* Client Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                <p className="text-gray-600">{client.email}</p>
                {client.phone && <p className="text-gray-500 text-sm">{client.phone}</p>}
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(client.priority)}`}>
                    {client.priority}
                  </span>
                  {client.score && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      Score: {client.score}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                <Mail className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                <Phone className="h-5 w-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                <Video className="h-5 w-5 text-purple-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b bg-white">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedTab === tab.id 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Cliente há</p>
                      <p className="text-lg font-bold text-blue-600">
                        {Math.ceil((new Date().getTime() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Comunicações</p>
                      <p className="text-lg font-bold text-green-600">
                        {timeline.filter(e => e.type === 'communication').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Documentos</p>
                      <p className="text-lg font-bold text-purple-600">
                        {timeline.filter(e => e.type === 'document_upload').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Score</p>
                      <p className="text-lg font-bold text-orange-600">{client.score || 0}/100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Nome</label>
                      {editingField === 'name' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => updateClientField('name', editValue)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{client.name}</span>
                          <button
                            onClick={() => {
                              setEditingField('name')
                              setEditValue(client.name)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <span className="text-sm text-gray-900">{client.email}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      {editingField === 'phone' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => updateClientField('phone', editValue)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{client.phone || '-'}</span>
                          <button
                            onClick={() => {
                              setEditingField('phone')
                              setEditValue(client.phone || '')
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">País de Origem</label>
                      <span className="text-sm text-gray-900">{client.country || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Profissão</label>
                      <span className="text-sm text-gray-900">{client.profession || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Processo de Visto</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">País Destino</label>
                      <span className="text-sm text-gray-900">{client.targetCountry || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Tipo de Visto</label>
                      <span className="text-sm text-gray-900">{client.visaType || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Status Atual</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Prioridade</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(client.priority)}`}>
                        {client.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Score de Elegibilidade</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                            style={{ width: `${client.score || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.score || 0}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notas</h3>
                  <button
                    onClick={() => setShowNoteForm(!showNoteForm)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Nota</span>
                  </button>
                </div>

                {showNoteForm && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Digite sua nota..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Salvar Nota
                      </button>
                      <button
                        onClick={() => {
                          setShowNoteForm(false)
                          setNewNote('')
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {timeline.filter(e => e.type === 'note').map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{note.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">por {note.author || 'Sistema'}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatDate(note.timestamp)}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {timeline.filter(e => e.type === 'note').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Edit className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p>Nenhuma nota adicionada ainda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {selectedTab === 'timeline' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Timeline da Jornada</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">Todos os eventos</option>
                    <option value="status_change">Mudanças de status</option>
                    <option value="communication">Comunicações</option>
                    <option value="document">Documentos</option>
                    <option value="payment">Pagamentos</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {filteredTimeline.map((event, index) => (
                    <div key={event.id} className="relative flex items-start space-x-4">
                      {/* Timeline Dot */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white ${getEventColor(event.type)}`}>
                        {getEventIcon(event.type)}
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`p-4 rounded-lg border ${getEventColor(event.type)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              
                              {/* Event Metadata */}
                              {event.metadata && (
                                <div className="mt-3 space-y-2">
                                  {event.metadata.oldValue && event.metadata.newValue && (
                                    <div className="text-xs text-gray-500">
                                      <span className="line-through">{event.metadata.oldValue}</span>
                                      <ArrowRight className="h-3 w-3 inline mx-2" />
                                      <span className="font-medium">{event.metadata.newValue}</span>
                                    </div>
                                  )}
                                  
                                  {event.metadata.amount && (
                                    <div className="text-xs text-green-600 font-medium">
                                      Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.metadata.amount)}
                                    </div>
                                  )}
                                  
                                  {event.metadata.attachment && (
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <Paperclip className="h-3 w-3" />
                                      <span>{event.metadata.attachment.name}</span>
                                      <button className="text-blue-600 hover:text-blue-800">
                                        <Download className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{formatDate(event.timestamp)}</span>
                              {event.author && (
                                <>
                                  <span>•</span>
                                  <span>{event.author}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTimeline.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum evento encontrado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would go here */}
          {selectedTab !== 'overview' && selectedTab !== 'timeline' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Em desenvolvimento</p>
                <p className="text-sm text-gray-400 mt-2">Esta seção será implementada em breve</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  )
}