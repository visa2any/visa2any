'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Search, Filter, Eye, Edit, Trash2, Mail, Phone, MessageCircle, Calendar,
  Star, MapPin, Briefcase, User, Clock, CheckCircle, AlertTriangle, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, TrendingUp, Target, Zap, FileText, Download,
  ChevronDown, ChevronUp, Grid, List, SlidersHorizontal, RefreshCw, Plus,
  Building, Globe, Heart, Flag, Award, Activity, Video, Send
} from 'lucide-react'
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

interface Filters {
  status: string
  priority: string
  consultant: string
  country: string
}

interface ClientUnifiedViewProps {
  clients: Client[]
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClientSelect: (client: Client) => void
  onCommunicationSelect?: (client: Client, mode: 'email' | 'whatsapp' | 'phone' | 'general') => void
}

export function ClientUnifiedView({ clients, filters, onFiltersChange, onClientSelect, onCommunicationSelect }: ClientUnifiedViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status' | 'score' | 'lastContact'>('lastContact')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  const statusOptions = [
    { value: 'ALL', label: 'Todos os Status' },
    { value: 'LEAD', label: 'Leads' },
    { value: 'QUALIFIED', label: 'Qualificados' },
    { value: 'CONSULTATION_SCHEDULED', label: 'Consulta Agendada' },
    { value: 'IN_PROCESS', label: 'Em Processo' },
    { value: 'DOCUMENTS_PENDING', label: 'Docs Pendentes' },
    { value: 'SUBMITTED', label: 'Submetido' },
    { value: 'APPROVED', label: 'Aprovado' },
    { value: 'COMPLETED', label: 'Concluído' }
  ]

  const priorityOptions = [
    { value: 'ALL', label: 'Todas as Prioridades' },
    { value: 'high', label: 'Alta Prioridade' },
    { value: 'medium', label: 'Média Prioridade' },
    { value: 'low', label: 'Baixa Prioridade' }
  ]

  const countryOptions = [
    { value: 'ALL', label: 'Todos os Países' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'Alemanha', label: 'Alemanha' },
    { value: 'França', label: 'França' },
    { value: 'Espanha', label: 'Espanha' },
    { value: 'Austrália', label: 'Austrália' }
  ]

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'Hoje'
    if (diffDays <= 7) return `${diffDays} dias atrás`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const handleBulkAction = async (action: string) => {
    if (selectedClients.length === 0) {
      notifyError('Erro', 'Selecione pelo menos um cliente')
      return
    }

    setIsLoading(true)
    try {
      // Implementar ações em lote
      notifyInfo('Processando', `Executando ${action} para ${selectedClients.length} clientes`)
      
      // Simular processamento
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      notifySuccess('Sucesso', `${action} executado para ${selectedClients.length} clientes`)
      setSelectedClients([])
    } catch (error) {
      notifyError('Erro', 'Falha ao executar ação em lote')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const selectAllClients = () => {
    setSelectedClients(clients.map(c => c.id))
  }

  const clearSelection = () => {
    setSelectedClients([])
  }

  // Funções para navegar para Central de Comunicação

  const handleEmailClient = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCommunicationSelect) {
      onCommunicationSelect(client, 'email')
    } else {
      // Fallback: open default email client
      const subject = encodeURIComponent(`Visa2Any - Acompanhamento do seu processo`)
      const body = encodeURIComponent(`Olá ${client.name},\n\nEspero que esteja bem!\n\nGostaria de saber como está o andamento do seu processo de visto.\n\nAtenciosamente,\nEquipe Visa2Any`)
      window.open(`mailto:${client.email}?subject=${subject}&body=${body}`)
    }
  }

  const handleWhatsAppClient = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (!client.phone) {
        notifyError('Erro', 'Cliente não possui número de telefone')
        return
      }
      
      if (onCommunicationSelect) {
        onCommunicationSelect(client, 'whatsapp')
        notifySuccess('WhatsApp', `Abrindo Central de Comunicação para ${client.name}`)
      } else {
        notifyError('Erro', 'Central de Comunicação não disponível')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao abrir Central de Comunicação')
    }
  }

  const handleCallClient = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (!client.phone) {
        notifyError('Erro', 'Cliente não possui número de telefone')
        return
      }
      
      if (onCommunicationSelect) {
        onCommunicationSelect(client, 'phone')
        notifySuccess('Telefone', `Abrindo Central de Comunicação para ${client.name}`)
      } else {
        notifyError('Erro', 'Central de Comunicação não disponível')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao abrir Central de Comunicação')
    }
  }

  const handleMoreActions = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (onCommunicationSelect) {
        onCommunicationSelect(client, 'general')
        notifyInfo('Ações', `Abrindo Central de Comunicação para ${client.name}`)
      } else {
        notifyError('Erro', 'Central de Comunicação não disponível')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao abrir Central de Comunicação')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Ações */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Clientes 360°</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {clients.length} clientes
            </span>
            {selectedClients.length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {selectedClients.length} selecionados
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Botões de View Mode */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Ações */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Plus className="h-4 w-4" />
              <span>Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={filters.priority}
                  onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País Destino</label>
                <select
                  value={filters.country}
                  onChange={(e) => onFiltersChange({ ...filters, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="lastContact">Último Contato</option>
                    <option value="createdAt">Data Criação</option>
                    <option value="name">Nome</option>
                    <option value="status">Status</option>
                    <option value="score">Score</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortOrder === 'asc' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações em Lote */}
        {selectedClients.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedClients.length} clientes selecionados
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpar seleção
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('Enviar Email')}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleBulkAction('Atualizar Status')}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Status</span>
                </button>
                <button
                  onClick={() => handleBulkAction('Exportar')}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Clientes */}
      {viewMode === 'list' && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.length === clients.length && clients.length > 0}
                      onChange={selectedClients.length === clients.length ? clearSelection : selectAllClients}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Cliente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Prioridade</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">País Destino</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Score</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Último Contato</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onClientSelect(client)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => toggleClientSelection(client.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                          {client.phone && (
                            <p className="text-xs text-gray-400">{client.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span>{getPriorityIcon(client.priority)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(client.priority)}`}>
                          {client.priority}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{client.targetCountry || '-'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {client.score ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all"
                              style={{ width: `${client.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{client.score}/100</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {client.lastContactAt ? formatDate(client.lastContactAt) : formatDate(client.updatedAt)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => handleEmailClient(client, e)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Enviar Email"
                        >
                          <Mail className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                        </button>
                        <button 
                          onClick={(e) => handleWhatsAppClient(client, e)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4 text-green-600 hover:text-green-700" />
                        </button>
                        <button 
                          onClick={(e) => handleCallClient(client, e)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Ligar"
                        >
                          <Phone className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                        </button>
                        <button 
                          onClick={(e) => handleMoreActions(client, e)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Mais Ações"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600 hover:text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
            <div 
              key={client.id}
              onClick={() => onClientSelect(client)}
              className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleClientSelection(client.id)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(client.priority)}`}>
                    {getPriorityIcon(client.priority)} {client.priority}
                  </span>
                </div>

                {client.targetCountry && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{client.targetCountry}</span>
                  </div>
                )}

                {client.score && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score</span>
                      <span className="font-medium">{client.score}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all"
                        style={{ width: `${client.score}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {client.lastContactAt ? formatDate(client.lastContactAt) : formatDate(client.updatedAt)}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={(e) => handleEmailClient(client, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Enviar Email"
                    >
                      <Mail className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                    </button>
                    <button 
                      onClick={(e) => handleWhatsAppClient(client, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600 hover:text-green-700" />
                    </button>
                    <button 
                      onClick={(e) => handleCallClient(client, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Ligar"
                    >
                      <Phone className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <KanbanView clients={clients} onClientSelect={onClientSelect} />
      )}
    </div>
  )
}

// Componente Kanban View
function KanbanView({ clients, onClientSelect }: { clients: Client[], onClientSelect: (client: Client) => void }) {
  const statusColumns = [
    { id: 'LEAD', title: 'Leads', color: 'gray' },
    { id: 'QUALIFIED', title: 'Qualificados', color: 'blue' },
    { id: 'CONSULTATION_SCHEDULED', title: 'Consulta Agendada', color: 'yellow' },
    { id: 'IN_PROCESS', title: 'Em Processo', color: 'orange' },
    { id: 'DOCUMENTS_PENDING', title: 'Docs Pendentes', color: 'purple' },
    { id: 'SUBMITTED', title: 'Submetido', color: 'indigo' },
    { id: 'APPROVED', title: 'Aprovado', color: 'green' },
    { id: 'COMPLETED', title: 'Concluído', color: 'emerald' }
  ]

  const getColumnClients = (status: string) => {
    return clients.filter(client => client.status === status)
  }

  const handleEmailClient = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    const subject = encodeURIComponent(`Visa2Any - Acompanhamento do seu processo`)
    const body = encodeURIComponent(`Olá ${client.name},\n\nEspero que esteja bem!\n\nGostaria de saber como está o andamento do seu processo de visto.\n\nAtenciosamente,\nEquipe Visa2Any`)
    window.open(`mailto:${client.email}?subject=${subject}&body=${body}`)
  }

  const handleWhatsAppClient = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!client.phone) {
      alert('Cliente não possui número de telefone')
      return
    }
    const message = encodeURIComponent(`Olá ${client.name}! Gostaria de saber como está o andamento do seu processo de visto.`)
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${message}`)
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-6 min-w-max pb-6">
        {statusColumns.map(column => {
          const columnClients = getColumnClients(column.id)
          
          return (
            <div key={column.id} className="w-80 flex-shrink-0">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden">
                {/* Column Header */}
                <div className={`p-4 bg-${column.color}-50 border-b border-${column.color}-100`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-${column.color}-900`}>{column.title}</h3>
                    <span className={`px-2 py-1 bg-${column.color}-100 text-${column.color}-700 rounded-full text-xs font-medium`}>
                      {columnClients.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {columnClients.map(client => (
                    <div 
                      key={client.id}
                      onClick={() => onClientSelect(client)}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                              {client.name}
                            </h4>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(client.priority)}`}>
                          {getPriorityIcon(client.priority)}
                        </span>
                      </div>

                      {client.targetCountry && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{client.targetCountry}</span>
                        </div>
                      )}

                      {client.score && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Score</span>
                            <span className="font-medium">{client.score}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full">
                            <div 
                              className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all"
                              style={{ width: `${client.score}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {formatDate(client.lastContactAt || client.updatedAt)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => handleEmailClient(client, e)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Enviar Email"
                          >
                            <Mail className="h-3 w-3 text-gray-600 hover:text-blue-600" />
                          </button>
                          <button 
                            onClick={(e) => handleWhatsAppClient(client, e)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-3 w-3 text-green-600 hover:text-green-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnClients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhum cliente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    'high': 'text-red-600 bg-red-50 border-red-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'low': 'text-green-600 bg-green-50 border-green-200'
  }
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 1) return 'Hoje'
  if (diffDays <= 7) return `${diffDays} dias atrás`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`
  return date.toLocaleDateString('pt-BR')
}