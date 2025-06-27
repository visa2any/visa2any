'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, DollarSign, User, MapPin, Phone, Mail, 
  CheckCircle, AlertTriangle, XCircle, RefreshCw, Eye,
  Filter, Download, Search, ChevronRight, ExternalLink,
  CreditCard, Zap, Target, Award
} from 'lucide-react'

interface HybridBooking {
  id: string
  paymentId: string
  client: {
    id: string
    name: string
    email: string
    phone: string
  }
  country: string
  consulate: string
  availableDates: string[]
  plan: 'BASIC' | 'PREMIUM' | 'VIP'
  urgency: 'NORMAL' | 'URGENT' | 'EMERGENCY'
  status: 'CONSULTANT_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  assignedAt: string
  deadline: string
  completedAt?: string
  appointmentDetails?: {
    date: string
    time: string
    confirmationNumber: string
  }
  createdAt: string
  payment: {
    status: string
    paidAmount: number
    paymentMethod: string
  }
}

export default function HybridBookingsPage() {
  const [bookings, setBookings] = useState<HybridBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'ALL',
    urgency: 'ALL',
    plan: 'ALL',
    country: 'ALL'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<HybridBooking | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchBookings()
    
    // Auto-refresh a cada 30 segundos
    
    const interval = setInterval(fetchBookings, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/hybrid-bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string, appointmentDetails?: any) => {
    try {
      const response = await fetch('/api/admin/hybrid-bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          status,
          appointmentDetails
        })
      })

      if (response.ok) {
        fetchBookings() // Recarregar lista      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'CONSULTANT_ASSIGNED': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
      'COMPLETED': 'bg-green-100 text-green-700 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-700 border-red-200',
      'EXPIRED': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'NORMAL': 'text-green-600 bg-green-50',
      'URGENT': 'text-yellow-600 bg-yellow-50',
      'EMERGENCY': 'text-red-600 bg-red-50'
    }
    return colors[urgency as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const getPlanEmoji = (plan: string) => {
    const emojis = {
      'BASIC': '🥉',
      'PREMIUM': '🥈', 
      'VIP': '🥇'
    }
    return emojis[plan as keyof typeof emojis] || '📋'
  }

  const getTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expirado'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.consulate.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'ALL' || booking.status === filters.status
    const matchesUrgency = filters.urgency === 'ALL' || booking.urgency === filters.urgency
    const matchesPlan = filters.plan === 'ALL' || booking.plan === filters.plan
    const matchesCountry = filters.country === 'ALL' || booking.country === filters.country
    
    return matchesSearch && matchesStatus && matchesUrgency && matchesPlan && matchesCountry
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-700 mt-4 font-medium">Carregando Agendamentos Híbridos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span>Agendamentos Híbridos</span>
              </h1>
              <p className="text-gray-600 mt-1">Gerencie agendamentos manuais após pagamento confirmado</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBookings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todos os Status</option>
              <option value="CONSULTANT_ASSIGNED">Aguardando</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="EXPIRED">Expirado</option>
            </select>

            {/* Urgência */}
            <select
              value={filters.urgency}
              onChange={(e) => setFilters({...filters, urgency: e.target.value})}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todas Urgências</option>
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgente</option>
              <option value="EMERGENCY">Emergência</option>
            </select>

            {/* Plano */}
            <select
              value={filters.plan}
              onChange={(e) => setFilters({...filters, plan: e.target.value})}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todos os Planos</option>
              <option value="BASIC">🥉 Basic</option>
              <option value="PREMIUM">🥈 Premium</option>
              <option value="VIP">🥇 VIP</option>
            </select>

            {/* País */}
            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todos os Países</option>
              <option value="EUA">🇺🇸 EUA</option>
              <option value="CANADA">🇨🇦 Canadá</option>
              <option value="REINO_UNIDO">🇬🇧 Reino Unido</option>
              <option value="FRANCA">🇫🇷 França</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Aguardando"
            value={filteredBookings.filter(b => b.status === 'CONSULTANT_ASSIGNED').length}
            icon={Clock}
            color="from-yellow-500 to-orange-500"
            bgColor="from-yellow-50 to-orange-50"
          />
          <StatsCard
            title="Em Progresso"
            value={filteredBookings.filter(b => b.status === 'IN_PROGRESS').length}
            icon={Zap}
            color="from-blue-500 to-indigo-500"
            bgColor="from-blue-50 to-indigo-50"
          />
          <StatsCard
            title="Concluídos"
            value={filteredBookings.filter(b => b.status === 'COMPLETED').length}
            icon={CheckCircle}
            color="from-green-500 to-emerald-500"
            bgColor="from-green-50 to-emerald-50"
          />
          <StatsCard
            title="Emergências"
            value={filteredBookings.filter(b => b.urgency === 'EMERGENCY').length}
            icon={AlertTriangle}
            color="from-red-500 to-pink-500"
            bgColor="from-red-50 to-pink-50"
          />
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Agendamentos ({filteredBookings.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Atualizado há:</span>
                <span className="text-sm font-medium text-gray-700">30s</span>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
                <p className="text-gray-400 text-sm">Ajuste os filtros ou aguarde novos pagamentos confirmados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdateStatus={updateBookingStatus}
                    onViewDetails={(booking: HybridBooking) => {
                      setSelectedBooking(booking)
                      setShowDetails(true)
                    }}
                    getStatusColor={getStatusColor}
                    getUrgencyColor={getUrgencyColor}
                    getPlanEmoji={getPlanEmoji}
                    getTimeRemaining={getTimeRemaining}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={updateBookingStatus}
        />
      )}
    </div>
  )
}

// Componente Card de Stats
function StatsCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-xl p-6 border border-white/50`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

// Componente Card de Agendamento
function BookingCard({ booking, onUpdateStatus, onViewDetails, getStatusColor, getUrgencyColor, getPlanEmoji, getTimeRemaining }: any) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onUpdateStatus(booking.id, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const timeRemaining = getTimeRemaining(booking.deadline)
  const isExpired = timeRemaining === 'Expirado'
  const isUrgent = booking.urgency === 'EMERGENCY' || timeRemaining.includes('m') && !timeRemaining.includes('h')

  return (
    <div className={`p-6 rounded-xl border transition-all hover:shadow-md ${
      isUrgent && booking.status === 'CONSULTANT_ASSIGNED' 
        ? 'bg-red-50 border-red-200 shadow-md' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">{getPlanEmoji(booking.plan)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{booking.client.name}</h3>
              <p className="text-sm text-gray-600">{booking.client.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(booking.urgency)}`}>
                {booking.urgency}
              </span>
            </div>
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{booking.consulate} - {booking.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">R$ {booking.payment.paidAmount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-700'}`}>
                {timeRemaining}
              </span>
            </div>
          </div>

          {/* Datas Disponíveis */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">DATAS DISPONÍVEIS:</p>
            <div className="flex flex-wrap gap-2">
              {booking.availableDates.slice(0, 3).map((date: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {new Date(date).toLocaleDateString('pt-BR')}
                </span>
              ))}
              {booking.availableDates.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{booking.availableDates.length - 3} mais
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onViewDetails(booking)}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-3 w-3" />
            <span>Detalhes</span>
          </button>

          {booking.status === 'CONSULTANT_ASSIGNED' && (
            <button
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Zap className="h-3 w-3" />
              <span>Iniciar</span>
            </button>
          )}

          {booking.status === 'IN_PROGRESS' && (
            <button
              onClick={() => handleStatusUpdate('COMPLETED')}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Concluir</span>
            </button>
          )}

          <a
            href={`/consultor-guia`}
            target="_blank"
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Guia</span>
          </a>
        </div>
      </div>
    </div>
  )
}

// Modal de Detalhes
function BookingDetailsModal({ booking, onClose, onUpdateStatus }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Detalhes do Agendamento</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Conteúdo detalhado aqui */}
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{booking.client.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{booking.client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{booking.client.phone}</span>
                </div>
              </div>
            </div>

            {/* Informações do Agendamento */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Agendamento</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">País:</span>
                    <p className="font-medium">{booking.country}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Consulado:</span>
                    <p className="font-medium">{booking.consulate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Plano:</span>
                    <p className="font-medium">{booking.plan}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Urgência:</span>
                    <p className="font-medium">{booking.urgency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex space-x-4">
              <button
                onClick={() => onUpdateStatus(booking.id, 'IN_PROGRESS')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Marcar como Em Progresso
              </button>
              <button
                onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Marcar como Concluído
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}