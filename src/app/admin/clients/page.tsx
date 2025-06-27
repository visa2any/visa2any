'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  UserPlus,
  Send,
  FileText,
  X,
  User,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Star
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'
import { InlineEdit, InlineSelect } from '@/components/ui/InlineEdit'
import { RowActions } from '@/components/ui/HoverActions'
import { ClientDetailView } from '@/components/ClientDetailView'
import { FormField, FormSelect, FormTextarea } from '@/components/ui/FormField'
import { formatters, validators, combineValidators } from '@/lib/formatters'

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
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [countryFilter, setCountryFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status' | 'score'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showNewClientSlider, setShowNewClientSlider] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // System notifications,  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchClients()
    
    // Verificar se deve abrir slider de novo cliente
    if (searchParams.get('action') === 'new') {
      setShowNewClientSlider(true)
    }
  }, [])

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
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    'LEAD': 'Lead',
    'QUALIFIED': 'Qualificado',
    'CONSULTATION_SCHEDULED': 'Consulta Agendada',
    'IN_PROCESS': 'Em Processo',
    'DOCUMENTS_PENDING': 'Docs Pendentes',
    'SUBMITTED': 'Submetido',
    'APPROVED': 'Aprovado',
    'COMPLETED': 'Concluído',
    'REJECTED': 'Rejeitado',
    'INACTIVE': 'Inativo'
  }

  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
  
  const countryOptions = [
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'Alemanha', label: 'Alemanha' },
    { value: 'França', label: 'França' },
    { value: 'Espanha', label: 'Espanha' },
    { value: 'Itália', label: 'Itália' },
    { value: 'Austrália', label: 'Austrália' },
    { value: 'Nova Zelândia', label: 'Nova Zelândia' }
  ]

  const statusColors: Record<string, string> = {
    'LEAD': 'bg-gray-100 text-gray-700',
    'QUALIFIED': 'bg-blue-100 text-blue-700',
    'CONSULTATION_SCHEDULED': 'bg-yellow-100 text-yellow-700',
    'IN_PROCESS': 'bg-orange-100 text-orange-700',
    'DOCUMENTS_PENDING': 'bg-purple-100 text-purple-700',
    'SUBMITTED': 'bg-indigo-100 text-indigo-700',
    'APPROVED': 'bg-green-100 text-green-700',
    'COMPLETED': 'bg-emerald-100 text-emerald-700',
    'REJECTED': 'bg-red-100 text-red-700',
    'INACTIVE': 'bg-gray-100 text-gray-500'
  }

  const safeClients = Array.isArray(clients) ? clients : []
  
  // Enhanced filtering logic,  const filteredAndSortedClients = safeClients
    .filter(client => {
      // Enhanced search across multiple fields,      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        (client.profession || '').toLowerCase().includes(searchLower) ||
        (client.phone || '').toLowerCase().includes(searchLower) ||
        (client.country || '').toLowerCase().includes(searchLower) ||
        (client.nationality || '').toLowerCase().includes(searchLower) ||
        (client.targetCountry || '').toLowerCase().includes(searchLower) ||
        (client.visaType || '').toLowerCase().includes(searchLower) ||
        (client.notes || '').toLowerCase().includes(searchLower)
      
      const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter
      const matchesCountry = countryFilter === 'ALL' || client.targetCountry === countryFilter
      
      return matchesSearch && matchesStatus && matchesCountry
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'score':
          aValue = a.score || 0
          bValue = b.score || 0
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  
  // For backwards compatibility,  const filteredClients = filteredAndSortedClients

  const handleNewClient = () => {
    setShowNewClientSlider(true)
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/dashboard/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'clients',
          filters: { searchTerm, statusFilter, countryFilter }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        notifySuccess('Export realizado', 'Lista de clientes exportada com sucesso')
      } else {
        throw new Error('Erro no export')
      }
    } catch (error) {
      notifyError('Erro no export', 'Não foi possível exportar a lista')
    }
  }

  const handleBulkEmail = () => {
    if (selectedClients.length === 0) {
      notifyInfo('Selecione clientes', 'Selecione pelo menos um cliente para enviar emails')
      return
    }
    router.push(`/admin/communications/email?clients=${selectedClients.join(',')}`)
  }

  const handleGenerateReport = () => {
    router.push('/admin/reports?type=clients')
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setShowDetailView(true)
  }

  const handleEmailClient = (client: Client) => {
    // Quick email action,    window.open(`mailto:${client.email}?subject=Visa2Any - Contato`)
  }

  const handleWhatsAppClient = (client: Client) => {
    if (client.phone) {
      const message = encodeURIComponent(`Olá ${client.name}, tudo bem? Aqui é da Visa2Any...`)
      window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${message}`)
    }
  }

  const updateClientField = async (clientId: string, field: string, value: string | number) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        notifySuccess('Campo atualizado', `${field} foi atualizado com sucesso`)
        fetchClients()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar')
      }
    } catch (error) {
      notifyError('Erro ao atualizar', error instanceof Error ? error.message : 'Erro desconhecido')
      throw error
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        notifySuccess(
          'Cliente excluído',
          `Cliente ${client?.name || 'cliente'} foi excluído com sucesso`
        )
        fetchClients()
      } else {
        const errorData = await response.json()
        notifyError(
          'Erro ao excluir',
          errorData.error || 'Erro ao excluir cliente'
        )
      }
    } catch (error) {
      console.error('Erro:', error)
      notifyError(
        'Erro de conexão',
        'Erro ao excluir cliente. Verifique sua conexão.'
      )
    }
  }

  const handleToggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const quickActions = [
    { icon: Plus, label: 'Novo Cliente', color: 'btn-primary', onClick: handleNewClient },
    { icon: Download, label: 'Exportar', color: 'btn-secondary', onClick: handleExport },
    { icon: Send, label: 'Email em Massa', color: 'btn-secondary', onClick: handleBulkEmail },
    { icon: FileText, label: 'Relatório', color: 'btn-secondary', onClick: handleGenerateReport }
  ]

  if (isLoading) {
    return (
      <div className="gradient-admin min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 loading-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded w-64 loading-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-elevated p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 loading-shimmer"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4 loading-shimmer"></div>
                  <div className="h-6 bg-gray-100 rounded w-20 loading-shimmer"></div>
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
                Gestão de Clientes
              </h1>
              <p className="text-readable-muted">
                Gerencie leads, qualificações e acompanhe o pipeline de clientes
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

        {/* Filters & Search */}
        <div className="animate-slide-in card-elevated p-6">
          <div className="flex flex-col gap-4">
            {/* Search Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-muted" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email, profissão, país, visto, notas..."
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
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[200px]"
              >
                <option value="ALL">Todos os Status</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[200px]"
              >
                <option value="ALL">Todos os Países</option>
                {Array.from(new Set(safeClients.map(c => c.targetCountry).filter(Boolean))).sort().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[150px]"
                >
                  <option value="createdAt">Data de Criação</option>
                  <option value="name">Nome</option>
                  <option value="status">Status</option>
                  <option value="score">Score</option>
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
            {(searchTerm || statusFilter !== 'ALL' || countryFilter !== 'ALL') && (
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
                
                {countryFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    País: {countryFilter}
                    <button onClick={() => setCountryFilter('ALL')} className="hover:text-purple-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setCountryFilter('ALL')
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
                Mostrando <span className="font-medium">{filteredClients.length}</span> de <span className="font-medium">{safeClients.length}</span> clientes
                {filteredClients.length !== safeClients.length && (
                  <span className="text-blue-600 ml-1">(filtrados)</span>
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
                  <Users className="h-5 w-5" />
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
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total de Clientes', value: safeClients.length, icon: Users, color: 'text-blue-600' },
            { label: 'Qualificados', value: safeClients.filter(c => c.status === 'QUALIFIED').length, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Em Processo', value: safeClients.filter(c => c.status === 'IN_PROCESS').length, icon: Clock, color: 'text-orange-600' },
            { label: 'Concluídos', value: safeClients.filter(c => c.status === 'COMPLETED').length, icon: CheckCircle, color: 'text-emerald-600' }
          ].map((stat, index) => (
            <div key={index} className="card-elevated p-6 hover-lift animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-readable-muted mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-readable">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clients List/Grid */}
        <div className="animate-fade-in">
          {filteredClients.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-readable mb-2">
                {searchTerm || statusFilter !== 'ALL' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-readable-muted mb-6">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando seu primeiro cliente ao sistema'
                }
              </p>
              <button className="btn-primary hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </button>
            </div>
          ) : (
            viewMode === 'list' ? (
              // Modern Table View with Inline Editing,              <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedClients(filteredClients.map(c => c.id))
                              } else {
                                setSelectedClients([])
                              }
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País Destino</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredClients.map((client) => (
                        <RowActions
                          key={client.id}
                          actions={[
                            {
                              icon: Eye,
                              label: 'Ver detalhes',
                              onClick: () => handleViewClient(client),
                              variant: 'primary'
                            },
                            {
                              icon: Mail,
                              label: 'Enviar email',
                              onClick: () => handleEmailClient(client)
                            },
                            {
                              icon: MessageCircle,
                              label: 'WhatsApp',
                              onClick: () => handleWhatsAppClient(client),
                              disabled: !client.phone
                            },
                            {
                              icon: Trash2,
                              label: 'Excluir',
                              onClick: () => handleDeleteClient(client.id),
                              variant: 'danger'
                            }
                          ]}
                        >
                          <tr className="cursor-pointer" onClick={() => handleViewClient(client)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedClients.includes(client.id)}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleToggleClientSelection(client.id)
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-3">
                                  {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <InlineEdit
                                    value={client.name}
                                    onSave={(value) => updateClientField(client.id, 'name', value)}
                                    displayClassName="font-medium text-gray-900"
                                    validation={(value) => value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null}
                                  />
                                  <InlineEdit
                                    value={client.email}
                                    onSave={(value) => updateClientField(client.id, 'email', value)}
                                    type="email"
                                    displayClassName="text-sm text-gray-500"
                                    validation={(value) => {
                                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                      return emailRegex.test(value) ? null : 'Email inválido'
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <InlineSelect
                                value={client.status}
                                options={statusOptions}
                                onSave={(value) => updateClientField(client.id, 'status', value)}
                                displayClassName={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <InlineSelect
                                value={client.targetCountry || ''}
                                options={countryOptions}
                                onSave={(value) => updateClientField(client.id, 'targetCountry', value)}
                                placeholder="Selecionar país"
                                displayClassName="text-sm text-gray-900"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center">
                                <InlineEdit
                                  value={client.score?.toString() || '0'}
                                  onSave={(value) => updateClientField(client.id, 'score', parseInt(value) || 0)}
                                  type="number"
                                  displayClassName="text-sm font-medium text-gray-900"
                                />
                                <Star className="h-4 w-4 text-yellow-400 ml-1" />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {/* Actions will be shown on hover by RowActions */}
                            </td>
                          </tr>
                        </RowActions>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Grid View (simplified cards),              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <RowActions
                    key={client.id}
                    actions={[
                      {
                        icon: Eye,
                        label: 'Ver detalhes',
                        onClick: () => handleViewClient(client),
                        variant: 'primary'
                      },
                      {
                        icon: Mail,
                        label: 'Enviar email',
                        onClick: () => handleEmailClient(client)
                      },
                      {
                        icon: MessageCircle,
                        label: 'WhatsApp',
                        onClick: () => handleWhatsAppClient(client),
                        disabled: !client.phone
                      },
                      {
                        icon: Trash2,
                        label: 'Excluir',
                        onClick: () => handleDeleteClient(client.id),
                        variant: 'danger'
                      }
                    ]}
                  >
                    <div className="card-elevated p-6 cursor-pointer" onClick={() => handleViewClient(client)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                          {statusLabels[client.status]}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2" />
                            {client.phone}
                          </div>
                        )}
                        {client.targetCountry && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {client.targetCountry}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xs text-gray-500">
                          {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {client.score && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{client.score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </RowActions>
                ))}
              </div>
            )
          )}
        </div>

        {/* Slide-over Detail View */}
        <ClientDetailView
          client={selectedClient}
          isOpen={showDetailView}
          onClose={() => setShowDetailView(false)}
          onUpdate={fetchClients}
        />

        {/* Slide-over de Novo Cliente */}
        <NewClientSlider 
          isOpen={showNewClientSlider}
          onClose={() => setShowNewClientSlider(false)} 
          onSuccess={fetchClients} 
          notifySuccess={notifySuccess} 
          notifyError={notifyError} 
        />
      </div>
    </div>
  )
}

// Slide-over moderno para criação rápida
function NewClientSlider({ 
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    nationality: '',
    age: '',
    targetCountry: '',
    profession: '',
    education: '',
    visaType: '',
    source: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const clientData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      }
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })

      if (response.ok) {
        const result = await response.json()
        
        notifySuccess(
          'Cliente criado',
          `Cliente ${formData.name} foi criado com sucesso`
        )
        
        // Reset form,        setFormData({
          name: '',
          email: '',
          phone: '',
          country: '',
          nationality: '',
          age: '',
          targetCountry: '',
          profession: '',
          education: '',
          visaType: '',
          source: '',
          notes: ''
        })
        
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        notifyError(
          'Erro ao criar cliente',
          errorData.error || 'Erro ao criar cliente'
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
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Novo Cliente</h2>
                <p className="text-sm text-gray-600 mt-1">Adicione rapidamente um novo cliente</p>
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
              {/* Campos essenciais com validação e formatação */}
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  label="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Maria Silva Santos"
                  required
                  autoFocus
                  formatValue={formatters.titleCase}
                  validation={combineValidators(validators.required, validators.minLength(2))}
                  tooltip="Nome completo do cliente como aparece nos documentos oficiais"
                  leftIcon={<User className="h-4 w-4" />}
                />
                
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="maria@email.com"
                  required
                  formatValue={formatters.email}
                  validation={combineValidators(validators.required, validators.email)}
                  tooltip="Email principal para comunicação"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    label="Telefone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+55 11 99999-9999"
                    formatValue={formatters.phone}
                    validation={validators.phone}
                    tooltip="Telefone com código do país (ex: +55 para Brasil)"
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                  
                  <FormField
                    label="Idade"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="28"
                    min="16"
                    max="120"
                    validation={validators.age}
                    tooltip="Idade atual do cliente"
                  />
                </div>
                
                <FormSelect
                  label="País de destino"
                  value={formData.targetCountry}
                  onChange={(e) => setFormData({...formData, targetCountry: e.target.value})}
                  placeholder="Selecionar país..."
                  tooltip="País onde o cliente deseja imigrar"
                  options={[
                    { value: "Estados Unidos", label: "🇺🇸 Estados Unidos" },
                    { value: "Canadá", label: "🇨🇦 Canadá" },
                    { value: "Portugal", label: "🇵🇹 Portugal" },
                    { value: "Reino Unido", label: "🇬🇧 Reino Unido" },
                    { value: "Alemanha", label: "🇩🇪 Alemanha" },
                    { value: "França", label: "🇫🇷 França" },
                    { value: "Austrália", label: "🇦🇺 Austrália" },
                    { value: "Nova Zelândia", label: "🇳🇿 Nova Zelândia" },
                    { value: "Espanha", label: "🇪🇸 Espanha" },
                    { value: "Itália", label: "🇮🇹 Itália" }
                  ]}
                />

                <FormField
                  label="Profissão"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder="Ex: Engenheiro de Software"
                  formatValue={formatters.titleCase}
                  tooltip="Profissão atual ou área de atuação"
                />

                <FormTextarea
                  label="Observações"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Informações adicionais sobre o cliente..."
                  rows={2}
                  maxLength={500}
                  showCharCount
                  tooltip="Notas importantes sobre o cliente, objetivos ou situação especial"
                />
              </div>
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
                  disabled={isLoading || !formData.name || !formData.email}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Criar Cliente
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