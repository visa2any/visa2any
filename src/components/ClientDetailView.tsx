'use client'

import { useState } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Star, FileText,
  Clock, CheckCircle, AlertTriangle, Edit, Trash2, Send,
  Video, MessageCircle, Download, ExternalLink
} from 'lucide-react'
import { SlideOver } from '@/components/ui/SlideOver'
import { InlineEdit, InlineSelect } from '@/components/ui/InlineEdit'
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
}

interface ClientDetailViewProps {
  client: Client | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ClientDetailView({ client, isOpen, onClose, onUpdate }: ClientDetailViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { notifySuccess, notifyError } = useSystemNotifications()

  if (!client) return null

  const statusOptions = [
    { value: 'LEAD', label: 'Lead' },
    { value: 'QUALIFIED', label: 'Qualificado' },
    { value: 'CONSULTATION_SCHEDULED', label: 'Consulta Agendada' },
    { value: 'IN_PROCESS', label: 'Em Processo' },
    { value: 'DOCUMENTS_PENDING', label: 'Docs Pendentes' },
    { value: 'SUBMITTED', label: 'Submetido' },
    { value: 'APPROVED', label: 'Aprovado' },
    { value: 'COMPLETED', label: 'Concluído' },
    { value: 'REJECTED', label: 'Rejeitado' },
    { value: 'INACTIVE', label: 'Inativo' }
  ]

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

  const updateField = async (field: string, value: string | number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        notifySuccess('Campo atualizado', `${field} foi atualizado com sucesso`)
        onUpdate()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar')
      }
    } catch (error) {
      notifyError('Erro ao atualizar', error instanceof Error ? error.message : 'Erro desconhecido')
      throw error
    } finally {
      setIsLoading(false)
    }
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
      'COMPLETED': 'bg-emerald-100 text-emerald-700',
      'REJECTED': 'bg-red-100 text-red-700',
      'INACTIVE': 'bg-gray-100 text-gray-500'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={client.name}
      subtitle={client.email}
      size="lg"
    >
      <div className="p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Mail className="h-4 w-4" />
            Enviar Email
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Video className="h-4 w-4" />
            Agendar Consulta
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="h-4 w-4" />
            Exportar Dados
          </button>
        </div>

        {/* Status & Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <InlineSelect
                value={client.status}
                options={statusOptions}
                onSave={(value) => updateField('status', value)}
                displayClassName={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(client.status)}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Score de Elegibilidade</label>
              <div className="flex items-center gap-2">
                <InlineEdit
                  value={client.score?.toString() || '0'}
                  onSave={(value) => updateField('score', parseInt(value) || 0)}
                  type="number"
                  placeholder="0-100"
                  displayClassName="font-medium"
                />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <InlineEdit
                value={client.name}
                onSave={(value) => updateField('name', value)}
                placeholder="Nome completo"
                validation={(value) => value.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <InlineEdit
                value={client.email}
                onSave={(value) => updateField('email', value)}
                type="email"
                placeholder="email@exemplo.com"
                validation={(value) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  return emailRegex.test(value) ? null : 'Email inválido'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <InlineEdit
                value={client.phone || ''}
                onSave={(value) => updateField('phone', value)}
                type="tel"
                placeholder="+55 11 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
              <InlineEdit
                value={client.age?.toString() || ''}
                onSave={(value) => updateField('age', parseInt(value) || 0)}
                type="number"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
              <InlineEdit
                value={client.profession || ''}
                onSave={(value) => updateField('profession', value)}
                placeholder="Profissão"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Educação</label>
              <InlineEdit
                value={client.education || ''}
                onSave={(value) => updateField('education', value)}
                placeholder="Nível de educação"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização & Destino
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País atual</label>
              <InlineEdit
                value={client.country || ''}
                onSave={(value) => updateField('country', value)}
                placeholder="País atual"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidade</label>
              <InlineEdit
                value={client.nationality || ''}
                onSave={(value) => updateField('nationality', value)}
                placeholder="Nacionalidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País de destino</label>
              <InlineSelect
                value={client.targetCountry || ''}
                options={countryOptions}
                onSave={(value) => updateField('targetCountry', value)}
                placeholder="Selecionar país"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de visto</label>
              <InlineEdit
                value={client.visaType || ''}
                onSave={(value) => updateField('visaType', value)}
                placeholder="Tipo de visto"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observações
          </h3>
          <InlineEdit
            value={client.notes || ''}
            onSave={(value) => updateField('notes', value)}
            placeholder="Adicionar observações sobre o cliente..."
            multiline={true}
            editClassName="w-full min-h-20"
          />
        </div>

        {/* Metadata */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Fonte</label>
              <InlineEdit
                value={client.source || ''}
                onSave={(value) => updateField('source', value)}
                placeholder="Como chegou até nós"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Criado em</label>
              <span className="text-gray-600">{formatDate(client.createdAt)}</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Atualizado em</label>
              <span className="text-gray-600">{formatDate(client.updatedAt)}</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">ID do Cliente</label>
              <span className="text-gray-600 font-mono text-xs">{client.id}</span>
            </div>
          </div>
        </div>

        {/* Related Data */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Dados Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <div className="font-medium">Consultorias</div>
              <div className="text-sm text-gray-600">2 realizadas</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-green-500" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <div className="font-medium">Documentos</div>
              <div className="text-sm text-gray-600">5 enviados</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center justify-between mb-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <div className="font-medium">Interações</div>
              <div className="text-sm text-gray-600">12 registros</div>
            </button>
          </div>
        </div>
      </div>
    </SlideOver>
  )
}