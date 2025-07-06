'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, Mail, Phone, Video, Send, Search, Filter, Plus, MoreHorizontal,
  User, Clock, CheckCircle, AlertTriangle, Star, Pin, Archive, Trash2, Forward,
  Paperclip, Mic, Smile, Image, File, Download, Edit, Reply, Eye, EyeOff,
  Tag, Hash, Calendar, MapPin, Globe, Building, Users, Zap, Bell, Volume2,
  VolumeX, RefreshCw, Settings, ChevronDown, ChevronRight, X, Check
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  targetCountry?: string
  status: string
  priority: 'high' | 'medium' | 'low'
  lastContactAt?: string
}

interface Message {
  id: string
  clientId: string
  client: { name: string; email: string; phone?: string }
  type: 'whatsapp' | 'email' | 'sms' | 'call' | 'note' | 'system'
  direction: 'inbound' | 'outbound'
  content: string
  subject?: string
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending'
  timestamp: string
  assignedTo?: string
  tags: string[]
  priority: 'high' | 'medium' | 'low'
  attachments?: Array<{
    id: string
    name: string
    type: string
    size: number
    url: string
  }>
  metadata?: {
    templateUsed?: string
    automationTriggered?: boolean
    responseTime?: number
    sentiment?: 'positive' | 'neutral' | 'negative'
  }
}

interface CommunicationStats {
  whatsappToday: number
  emailsToday: number
  callsToday: number
  responseTime: number
  pendingMessages?: number
  unreadMessages?: number
}

interface CommunicationCenterProps {
  clients: Client[]
  stats?: CommunicationStats | undefined
  selectedClient?: Client | null
  selectedMode?: 'email' | 'whatsapp' | 'phone' | 'general'
  onClientChange?: (client: Client | null) => void
}

export function CommunicationCenter({ 
  clients, 
  stats, 
  selectedClient = null, 
  selectedMode = 'general', 
  onClientChange 
}: CommunicationCenterProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'whatsapp' | 'email' | 'call' | 'note'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'pending' | 'priority'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchMessages()
    
    if (autoRefresh) {
      const interval = setInterval(fetchMessages, 10000) // Refresh a cada 10 segundos
      return () => clearInterval(interval)
    }
    return undefined
  }, [autoRefresh])

  // Remove auto-scroll automático - apenas quando necessário

  useEffect(() => {
    // Apenas rolar ao mudar de conversa
    // não a cada atualização de mensagem
    if (selectedConversation) {
      scrollToBottom(true)
    }
  }, [selectedConversation])

  // Auto-selecionar cliente quando passado como prop

  useEffect(() => {
    if (selectedClient && selectedClient.id && selectedClient.id !== selectedConversation) {
      setSelectedConversation(selectedClient.id)
      notifyInfo('Cliente Selecionado', `Conversa aberta para ${selectedClient.name}`)
    }
  }, [selectedClient?.id, selectedConversation, notifyInfo])

  // Auto-definir tipo de filtro baseado no modo selecionado

  useEffect(() => {
    if (selectedMode && selectedMode !== 'general') {
      if (selectedMode === 'whatsapp') {
        setFilterType('whatsapp')
      } else if (selectedMode === 'email') {
        setFilterType('email')
      } else if (selectedMode === 'phone') {
        setFilterType('call')
      }
    }
  }, [selectedMode])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/communications/messages')
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = (force = false) => {
    if (force) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const sendMessage = async (type: 'whatsapp' | 'email' | 'sms', content: string, clientId: string, template?: string) => {
    if (!content.trim()) return

    try {
      const response = await fetch('/api/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          clientId,
          template
        })
      })

      if (response.ok) {
        notifySuccess('Enviado', `Mensagem ${type} enviada com sucesso`)
        setNewMessage('')
        fetchMessages()
        // Scroll to bottom after sending
        setTimeout(() => scrollToBottom(true), 200)
      } else {
        throw new Error('Falha ao enviar mensagem')
      }
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar mensagem')
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/communications/messages/${messageId}/read`, {
        method: 'PATCH'
      })
      fetchMessages()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-green-600" />
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />
      case 'sms': return <MessageCircle className="h-4 w-4 text-purple-600" />
      case 'call': return <Phone className="h-4 w-4 text-orange-600" />
      case 'note': return <Edit className="h-4 w-4 text-gray-600" />
      case 'system': return <Zap className="h-4 w-4 text-indigo-600" />
      default: return <MessageCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600'
      case 'delivered': return 'text-green-600'
      case 'read': return 'text-green-700'
      case 'failed': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getDefaultMessageType = (): 'whatsapp' | 'email' | 'sms' => {
    if (selectedMode === 'whatsapp') return 'whatsapp'
    if (selectedMode === 'email') return 'email'
    if (selectedMode === 'phone') return 'sms'
    return 'whatsapp' // default
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
  }

  // Filtrar e agrupar mensagens por cliente

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || message.type === filterType
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'unread' && message.status !== 'read') ||
      (filterStatus === 'pending' && message.status === 'pending') ||
      (filterStatus === 'priority' && message.priority === 'high')
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Agrupar mensagens por cliente

  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const clientId = message.clientId
    if (!groups[clientId]) {
      groups[clientId] = []
    }
    groups[clientId].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  // Obter mensagens da conversa selecionada

  const selectedMessages = selectedConversation ? (groupedMessages[selectedConversation] || []) : []

  const templates = [
    { id: '1', name: 'Boas-vindas', content: 'Olá {nome}! Bem-vindo(a) à Visa2Any. Como posso ajudá-lo(a) hoje?', type: 'whatsapp' },
    { id: '2', name: 'Documentos Pendentes', content: 'Olá {nome}, notamos que ainda faltam alguns documentos para prosseguir com seu processo. Poderia nos enviar os documentos solicitados?', type: 'whatsapp' },
    { id: '3', name: 'Consulta Agendada', content: 'Sua consulta foi agendada para {data} às {hora}. Confirme sua presença respondendo esta mensagem.', type: 'whatsapp' },
    { id: '4', name: 'Follow-up Email', content: 'Olá {nome}, como está andamento do seu processo? Há algo em que possamos ajudar?', type: 'email' },
    { id: '5', name: 'Processo Aprovado', content: '🎉 Parabéns {nome}! Seu processo foi aprovado. Em breve entraremos em contato com os próximos passos.', type: 'whatsapp' }
  ]

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Header com Stats - Equilibrado */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Central de Comunicação</h2>
              {selectedClient && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm mt-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{selectedClient.name}</span>
                  {selectedMode && selectedMode !== 'general' && (
                    <>
                      <span className="text-blue-500">•</span>
                      <span className="capitalize">{selectedMode === 'whatsapp' ? 'WhatsApp' : selectedMode === 'email' ? 'Email' : 'Tel'}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg border transition-all ${autoRefresh ? 'bg-green-100 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-all ${soundEnabled ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setShowNewMessage(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Nova</span>
            </button>
          </div>
        </div>

        {/* Communication Stats - Equilibrado */}
        {stats && (
          <div className="grid grid-cols-6 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-900">WhatsApp</p>
                  <p className="text-sm font-bold text-green-600">{stats.whatsappToday}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900">Emails</p>
                  <p className="text-sm font-bold text-blue-600">{stats.emailsToday}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-orange-900">Chamadas</p>
                  <p className="text-sm font-bold text-orange-600">{stats.callsToday}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">Tempo</p>
                  <p className="text-sm font-bold text-purple-600">{stats.responseTime}min</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs font-medium text-yellow-900">Pendentes</p>
                  <p className="text-sm font-bold text-yellow-600">{stats.pendingMessages || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs font-medium text-red-900">Não Lidas</p>
                  <p className="text-sm font-bold text-red-600">{stats.unreadMessages || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Communication Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 flex flex-col">
          {/* Search and Filters - Equilibrado */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="all">Todos</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="call">Chamadas</option>
                  <option value="note">Notas</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="all">Todos</option>
                  <option value="unread">Não lidas</option>
                  <option value="pending">Pendentes</option>
                  <option value="priority">Prioridade</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conversations - Equilibrado */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedMessages).map(([clientId, clientMessages]) => {
              const lastMessage = clientMessages[clientMessages.length - 1]
              const unreadCount = clientMessages.filter(m => m.status !== 'read' && m.direction === 'inbound').length
              const client = clients.find(c => c.id === clientId) || lastMessage?.client
              
              if (!lastMessage) return null
              
              return (
                <div
                  key={clientId}
                  onClick={() => setSelectedConversation(clientId)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${
                    selectedConversation === clientId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="h-9 w-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {client?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 truncate text-sm">{client?.name || 'Cliente não identificado'}</h4>
                          {getMessageIcon(lastMessage?.type || 'general')}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{lastMessage?.content || 'Sem conteúdo'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">{formatTimestamp(lastMessage?.timestamp || new Date().toISOString())}</span>
                          {lastMessage?.priority === 'high' && (
                            <Star className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                          {unreadCount}
                        </span>
                      )}
                      <span className={`text-xs ${getStatusColor(lastMessage?.status || 'sent')}`}>
                        {lastMessage?.status === 'read' ? <Check className="h-3 w-3" /> : 
                         lastMessage?.status === 'delivered' ? <CheckCircle className="h-3 w-3" /> :
                         lastMessage?.status === 'failed' ? <X className="h-3 w-3" /> : 
                         <Clock className="h-3 w-3" />}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {Object.keys(groupedMessages).length === 0 && (
              <div className="text-center py-10">
                <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Nenhuma conversa encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 flex flex-col h-full">
          {selectedConversation ? (
            <>
              {/* Chat Header - Equilibrado */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedMessages[0]?.client?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{selectedMessages[0]?.client?.name || 'Cliente não identificado'}</h3>
                      <p className="text-xs text-gray-500">{selectedMessages[0]?.client?.email || 'Email não disponível'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Video className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container - Equilibrado */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 relative">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.direction === 'outbound' 
                        ? 'bg-blue-600 text-white' 
                        : `bg-white border ${getPriorityColor(message.priority)}`
                    } rounded-lg p-3 shadow-sm`}>
                      {message.direction === 'inbound' && (
                        <div className="flex items-center space-x-2 mb-2">
                          {getMessageIcon(message.type)}
                          <span className="text-xs font-medium text-gray-600">
                            {message.type.toUpperCase()}
                          </span>
                          {message.priority === 'high' && (
                            <Star className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      )}
                      
                      {message.subject && (
                        <p className="font-medium text-sm mb-1">{message.subject}</p>
                      )}
                      
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                              <Paperclip className="h-3 w-3" />
                              <span>{attachment.name}</span>
                              <button>
                                <Download className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.direction === 'outbound' && (
                          <span className={`text-xs ${getStatusColor(message.status)}`}>
                            {message.status === 'read' ? <Check className="h-3 w-3" /> : 
                             message.status === 'delivered' ? <CheckCircle className="h-3 w-3" /> :
                             message.status === 'failed' ? <X className="h-3 w-3" /> : 
                             <Clock className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* Botão para rolar para baixo */}
                <button
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-75 hover:opacity-100"
                  title="Ir para o final da conversa"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Message Input - Equilibrado */}
              <div className="border-t border-gray-200 bg-white flex-shrink-0">
                {/* Templates Section - Melhorado */}
                {showTemplates && (
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Templates Rápidos</h4>
                      <button
                        onClick={() => setShowTemplates(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            setNewMessage(template.content)
                            setShowTemplates(false)
                          }}
                          className="text-left p-2 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center space-x-2">
                            {getMessageIcon(template.type)}
                            <span className="font-medium truncate">{template.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        showTemplates ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Templates
                    </button>
                    <span className="text-sm text-gray-400">|</span>
                    <button className="text-sm text-gray-600 hover:text-gray-800 p-1">
                      <Paperclip className="h-3.5 w-3.5" />
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800 p-1">
                      <Image className="h-3.5 w-3.5" />
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800 p-1">
                      <Mic className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Digite sua mensagem${selectedMode && selectedMode !== 'general' ? ` via ${selectedMode === 'whatsapp' ? 'WhatsApp' : selectedMode === 'email' ? 'Email' : 'SMS'}` : ''}...`}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          if (selectedConversation) {
                            sendMessage(getDefaultMessageType(), newMessage, selectedConversation)
                            setNewMessage('')
                          }
                        }
                      }}
                    />
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => selectedConversation && sendMessage('whatsapp', newMessage, selectedConversation)}
                        disabled={!newMessage.trim()}
                        className={`p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                          selectedMode === 'whatsapp' 
                            ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-300' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => selectedConversation && sendMessage('email', newMessage, selectedConversation)}
                        disabled={!newMessage.trim()}
                        className={`p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                          selectedMode === 'email' 
                            ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-300' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        title="Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => selectedConversation && sendMessage('sms', newMessage, selectedConversation)}
                        disabled={!newMessage.trim()}
                        className={`p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                          selectedMode === 'phone' 
                            ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-300' 
                            : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                        title="SMS"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                <p className="text-gray-500">Escolha uma conversa para começar a visualizar e responder mensagens</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}