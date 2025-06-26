'use client'

import { useState } from 'react'
import { 
  Calendar, User, Clock, Star, FileText, MessageSquare,
  Video, AlertTriangle, CheckCircle, Send, Download,
  ExternalLink, Phone, Mail, Edit, Copy
} from 'lucide-react'
import { SlideOver } from '@/components/ui/SlideOver'
import { InlineEdit, InlineSelect } from '@/components/ui/InlineEdit'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

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

interface ConsultationDetailViewProps {
  consultation: Consultation | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ConsultationDetailView({ consultation, isOpen, onClose, onUpdate }: ConsultationDetailViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const { notifySuccess, notifyError } = useSystemNotifications()

  if (!consultation) return null

  const typeLabels: Record<string, string> = {
    'AI_ANALYSIS': 'Análise IA',
    'HUMAN_CONSULTATION': 'Consultoria Humana',
    'FOLLOW_UP': 'Follow-up',
    'DOCUMENT_REVIEW': 'Revisão de Docs',
    'INTERVIEW_PREP': 'Prep. Entrevista',
    'VIP_SERVICE': 'Serviço VIP'
  }

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Agendada' },
    { value: 'IN_PROGRESS', label: 'Em Andamento' },
    { value: 'COMPLETED', label: 'Concluída' },
    { value: 'CANCELLED', label: 'Cancelada' },
    { value: 'RESCHEDULED', label: 'Reagendada' }
  ]

  const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({ value, label }))

  const updateField = async (field: string, value: string | number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/consultations/${consultation.id}`, {
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
      'SCHEDULED': 'bg-blue-100 text-blue-700',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'RESCHEDULED': 'bg-purple-100 text-purple-700'
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

  const generateMeetingLink = () => {
    setIsGeneratingLink(true)
    setTimeout(() => {
      const meetingId = Math.random().toString(36).substring(2, 15)
      setMeetingUrl(`https://meet.visa2any.com/room/${meetingId}`)
      setIsGeneratingLink(false)
      notifySuccess('Link gerado', 'Link da reunião criado com sucesso')
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingUrl)
    notifySuccess('Link copiado', 'Link copiado para a área de transferência')
  }

  const sendLinkToClient = () => {
    if (!consultation.client || !meetingUrl) return

    const message = `Olá ${consultation.client.name}! Sua consultoria está pronta para começar. \n\n🔗 Link: ${meetingUrl}\n\nAguardamos você!`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    notifySuccess('Mensagem enviada', 'Link enviado via WhatsApp')
  }

  const handleEmailClient = () => {
    if (consultation.client?.email) {
      const subject = `Consultoria ${typeLabels[consultation.type]} - Visa2Any`
      const body = `Olá ${consultation.client.name},\n\nSua consultoria ${typeLabels[consultation.type]} está agendada para ${consultation.scheduledAt ? formatDate(consultation.scheduledAt) : 'data a definir'}.\n\nAtenciosamente,\nEquipe Visa2Any`
      window.open(`mailto:${consultation.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }
  }

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={typeLabels[consultation.type] || consultation.type}
      subtitle={consultation.client?.name || 'Cliente não definido'}
      size="lg"
    >
      <div className="p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleEmailClient}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Enviar Email
          </button>
          <button 
            onClick={() => consultation.client && window.open(`https://wa.me/?text=${encodeURIComponent(`Olá ${consultation.client.name}
 em relação à sua consultoria...`)}`, '_blank')}
            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </button>
          <button 
            onClick={generateMeetingLink}
            disabled={isGeneratingLink}
            className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            <Video className="h-4 w-4" />
            {isGeneratingLink ? 'Gerando...' : 'Videochamada'}
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
                value={consultation.status}
                options={statusOptions}
                onSave={(value) => updateField('status', value)}
                displayClassName={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Score de Qualidade</label>
              <div className="flex items-center gap-2">
                <InlineEdit
                  value={consultation.score?.toString() || '0'}
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

        {/* Consultation Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações da Consultoria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <InlineSelect
                value={consultation.type}
                options={typeOptions}
                onSave={(value) => updateField('type', value)}
                displayClassName="font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <InlineEdit
                value={consultation.duration?.toString() || ''}
                onSave={(value) => updateField('duration', parseInt(value) || 60)}
                type="number"
                placeholder="60"
                displayClassName="font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora Agendada</label>
              <InlineEdit
                value={consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().slice(0, 16) : ''}
                onSave={(value) => updateField('scheduledAt', value ? new Date(value).toISOString() : '')}
                type="datetime-local"
                placeholder="Selecionar data/hora"
                displayValue={consultation.scheduledAt ? formatDate(consultation.scheduledAt) : 'Não agendada'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora Conclusão</label>
              <span className="text-sm text-gray-600">
                {consultation.completedAt ? formatDate(consultation.completedAt) : 'Não concluída'}
              </span>
            </div>
          </div>
        </div>

        {/* Participant Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Participantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <div className="space-y-1">
                <div className="font-medium">{consultation.client?.name || 'Não definido'}</div>
                <div className="text-sm text-gray-600">{consultation.client?.email || 'Email não disponível'}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultor</label>
              <div className="font-medium">{consultation.consultant?.name || 'Não atribuído'}</div>
            </div>
          </div>
        </div>

        {/* Meeting Link Section */}
        {meetingUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Video className="h-5 w-5" />
              Link da Reunião
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={meetingUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Copiar link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(meetingUrl, '_blank')}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Entrar na Reunião
                </button>
                <button
                  onClick={sendLinkToClient}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Enviar ao Cliente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observações
          </h3>
          <InlineEdit
            value={consultation.notes || ''}
            onSave={(value) => updateField('notes', value)}
            placeholder="Adicionar observações sobre a consultoria..."
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
              <label className="block font-medium text-gray-700 mb-1">Criada em</label>
              <span className="text-gray-600">{formatDate(consultation.createdAt)}</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">ID da Consultoria</label>
              <span className="text-gray-600 font-mono text-xs">{consultation.id}</span>
            </div>
          </div>
        </div>

        {/* Related Data */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Dados Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center justify-between mb-2">
                <User className="h-5 w-5 text-blue-500" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <div className="font-medium">Perfil do Cliente</div>
              <div className="text-sm text-gray-600">Ver detalhes completos</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-green-500" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <div className="font-medium">Documentos</div>
              <div className="text-sm text-gray-600">Arquivos relacionados</div>
            </button>
          </div>
        </div>
      </div>
    </SlideOver>
  )
}