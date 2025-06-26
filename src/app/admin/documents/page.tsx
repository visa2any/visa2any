'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar,
  File,
  Image,
  FileCheck,
  AlertCircle,
  Plus,
  Scan,
  Share2,
  Archive,
  MoreHorizontal,
  X,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react'
import { FormField, FormSelect, FormTextarea } from '@/components/ui/FormField'
import { formatters, validators, combineValidators } from '@/lib/formatters'

interface Document {
  id: string
  name: string
  type: string
  fileName: string
  fileSize?: number
  status: string
  isValid?: boolean
  clientId: string
  client?: {
    name: string
    email: string
  }
  uploadedById?: string
  uploadedBy?: {
    name: string
  }
  uploadedAt: string
  validatedAt?: string
  validationNotes?: string
  ocrText?: string
  analysis?: any
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showViewSlider, setShowViewSlider] = useState(false)
  const [showEditSlider, setShowEditSlider] = useState(false)
  const [showUploadSlider, setShowUploadSlider] = useState(false)
  const [showShareSlider, setShowShareSlider] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      // Como não temos a API ainda, vamos simular dados,      const mockDocuments = [
        {
          id: '1',
          name: 'Passaporte - Maria Silva',
          type: 'PASSPORT',
          fileName: 'passport_maria_silva.pdf',
          fileSize: 2048000,
          status: 'VALID',
          isValid: true,
          clientId: '1',
          client: { name: 'Maria Silva', email: 'maria@email.com' },
          uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          validatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          id: '2',
          name: 'Diploma - João Santos',
          type: 'DIPLOMA',
          fileName: 'diploma_joao.pdf',
          fileSize: 1024000,
          status: 'PENDING',
          clientId: '2',
          client: { name: 'João Santos', email: 'joao@email.com' },
          uploadedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: '3',
          name: 'Certidão de Nascimento - Ana Costa',
          type: 'BIRTH_CERTIFICATE',
          fileName: 'certidao_ana.pdf',
          fileSize: 512000,
          status: 'NEEDS_REVIEW',
          clientId: '3',
          client: { name: 'Ana Costa', email: 'ana@email.com' },
          uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          validationNotes: 'Documento com qualidade baixa, necessita nova versão'
        }
      ]
      setDocuments(Array.isArray(mockDocuments) ? mockDocuments : [])
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    'PASSPORT': 'Passaporte',
    'ID_DOCUMENT': 'Documento de ID',
    'BIRTH_CERTIFICATE': 'Certidão de Nascimento',
    'MARRIAGE_CERTIFICATE': 'Certidão de Casamento',
    'DIPLOMA': 'Diploma',
    'TRANSCRIPT': 'Histórico Escolar',
    'WORK_CERTIFICATE': 'Certificado de Trabalho',
    'BANK_STATEMENT': 'Extrato Bancário',
    'TAX_RETURN': 'Declaração de IR',
    'MEDICAL_EXAM': 'Exame Médico',
    'POLICE_CLEARANCE': 'Antecedentes Criminais',
    'PHOTOS': 'Fotos',
    'FORM': 'Formulário',
    'OTHER': 'Outros'
  }

  const typeIcons: Record<string, any> = {
    'PASSPORT': User,
    'ID_DOCUMENT': User,
    'BIRTH_CERTIFICATE': FileText,
    'MARRIAGE_CERTIFICATE': FileText,
    'DIPLOMA': FileCheck,
    'TRANSCRIPT': FileText,
    'WORK_CERTIFICATE': FileCheck,
    'BANK_STATEMENT': FileText,
    'TAX_RETURN': FileText,
    'MEDICAL_EXAM': FileCheck,
    'POLICE_CLEARANCE': FileCheck,
    'PHOTOS': Image,
    'FORM': File,
    'OTHER': FileText
  }

  const statusLabels: Record<string, string> = {
    'PENDING': 'Pendente',
    'ANALYZING': 'Analisando',
    'VALID': 'Válido',
    'INVALID': 'Inválido',
    'NEEDS_REVIEW': 'Precisa Revisão',
    'EXPIRED': 'Expirado'
  }

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'ANALYZING': 'bg-blue-100 text-blue-700',
    'VALID': 'bg-green-100 text-green-700',
    'INVALID': 'bg-red-100 text-red-700',
    'NEEDS_REVIEW': 'bg-orange-100 text-orange-700',
    'EXPIRED': 'bg-gray-100 text-gray-700'
  }

  const safeDocuments = Array.isArray(documents) ? documents : []
  const filteredDocuments = safeDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter
    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setShowViewSlider(true)
  }

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setShowEditSlider(true)
  }

  const handleDownloadDocument = (doc: Document) => {
    // Simulate document download,    const link = window.document.createElement('a')
    link.href = `#`
    link.download = doc.fileName
    link.click()
    alert(`Download iniciado: ${doc.fileName}`)
  }

  const handleShareDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setShowShareSlider(true)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      // Simulate API call,      alert('Documento excluído com sucesso!')
      fetchDocuments()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir documento')
    }
  }

  const handleBulkDownload = async () => {
    try {
      alert('Iniciando download em lote...')
    } catch (error) {
      console.error('Erro no download em lote:', error)
      alert('Erro ao fazer download em lote')
    }
  }

  const handleUploadDocument = () => {
    setShowUploadSlider(true)
  }

  const quickActions = [
    { icon: Upload, label: 'Upload Documento', color: 'btn-primary', onClick: handleUploadDocument },
    { icon: Scan, label: 'Digitalizar', color: 'btn-secondary', onClick: () => alert('Função de digitalização em desenvolvimento') },
    { icon: Download, label: 'Download em Lote', color: 'btn-secondary', onClick: handleBulkDownload },
    { icon: Archive, label: 'Arquivar', color: 'btn-secondary', onClick: () => alert('Função de arquivamento em desenvolvimento') }
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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
                Gestão de Documentos
              </h1>
              <p className="text-readable-muted">
                Gerencie uploads, validações e análises de documentos dos clientes
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
              label: 'Total de Documentos', 
              value: safeDocuments.length, 
              icon: FileText, 
              color: 'text-blue-600' 
            },
            { 
              label: 'Pendentes', 
              value: safeDocuments.filter(d => d.status === 'PENDING').length, 
              icon: Clock, 
              color: 'text-yellow-600' 
            },
            { 
              label: 'Válidos', 
              value: safeDocuments.filter(d => d.status === 'VALID').length, 
              icon: CheckCircle, 
              color: 'text-green-600' 
            },
            { 
              label: 'Precisam Revisão', 
              value: safeDocuments.filter(d => d.status === 'NEEDS_REVIEW').length, 
              icon: AlertTriangle, 
              color: 'text-orange-600' 
            }
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

        {/* Filters & Search */}
        <div className="animate-slide-in card-elevated p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-muted" />
              <input
                type="text"
                placeholder="Buscar por nome, cliente ou arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
              />
            </div>
            
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
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[180px]"
            >
              <option value="ALL">Todos os Tipos</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
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
              >
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents List/Grid */}
        <div className="animate-fade-in">
          {filteredDocuments.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-readable mb-2">
                {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                  ? 'Nenhum documento encontrado' 
                  : 'Nenhum documento enviado'
                }
              </h3>
              <p className="text-readable-muted mb-6">
                {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece fazendo upload dos primeiros documentos'
                }
              </p>
              <button className="btn-primary hover-lift">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documento
              </button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {filteredDocuments.map((document) => {
                const TypeIcon = typeIcons[document.type] || FileText
                return (
                  <div key={document.id} className="card-elevated hover-lift group">
                    {viewMode === 'grid' ? (
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                              <TypeIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-readable text-sm">{document.name}</h3>
                              <p className="text-xs text-readable-muted">{typeLabels[document.type]}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
                            {statusLabels[document.status]}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-readable-muted">
                            <User className="h-4 w-4 mr-2" />
                            {document.client?.name}
                          </div>
                          <div className="flex items-center text-sm text-readable-muted">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                          </div>
                          {document.fileSize && (
                            <div className="flex items-center text-sm text-readable-muted">
                              <File className="h-4 w-4 mr-2" />
                              {formatFileSize(document.fileSize)}
                            </div>
                          )}
                        </div>
                        
                        {document.validationNotes && (
                          <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-xs text-orange-700">{document.validationNotes}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-xs text-readable-muted truncate">
                            {document.fileName}
                          </span>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleViewDocument(document)}
                              className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors" 
                              title="Visualizar documento"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDownloadDocument(document)}
                              className="p-2 hover:bg-green-100 hover:text-green-600 rounded-lg transition-colors" 
                              title="Download documento"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleShareDocument(document)}
                              className="p-2 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition-colors" 
                              title="Compartilhar documento"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                              <TypeIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="font-semibold text-readable">{document.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
                                  {statusLabels[document.status]}
                                </span>
                              </div>
                              <div className="flex items-center space-x-6 text-sm text-readable-muted">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {document.client?.name}
                                </span>
                                <span>{typeLabels[document.type]}</span>
                                {document.fileSize && (
                                  <span>{formatFileSize(document.fileSize)}</span>
                                )}
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleViewDocument(document)}
                                className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors" 
                                title="Visualizar documento"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditDocument(document)}
                                className="p-2 hover:bg-green-100 hover:text-green-600 rounded-lg transition-colors" 
                                title="Editar documento"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDownloadDocument(document)}
                                className="p-2 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition-colors" 
                                title="Download documento"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleShareDocument(document)}
                                className="p-2 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors" 
                                title="Compartilhar documento"
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDocument(document.id)}
                                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors" 
                                title="Excluir documento"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {document.validationNotes && (
                          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-700">{document.validationNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Slide-overs de Documentos */}
      <UploadDocumentSlider 
        isOpen={showUploadSlider} 
        onClose={() => setShowUploadSlider(false)} 
        onSuccess={fetchDocuments} 
      />
      
      <ViewDocumentSlider 
        isOpen={showViewSlider}
        document={selectedDocument} 
        onClose={() => setShowViewSlider(false)} 
      />
      
      <EditDocumentSlider 
        isOpen={showEditSlider}
        document={selectedDocument} 
        onClose={() => setShowEditSlider(false)} 
        onSuccess={fetchDocuments} 
      />
      
      <ShareDocumentSlider 
        isOpen={showShareSlider}
        document={selectedDocument} 
        onClose={() => setShowShareSlider(false)} 
      />
    </div>
  )
}

// Slide-over de Upload Documento
function UploadDocumentSlider({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    clientId: '',
    notes: ''
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, name: file.name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo')
      return
    }

    setIsLoading(true)
    try {
      // Criar FormData conforme esperado pela API,      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('metadata', JSON.stringify({
        name: formData.name,
        type: formData.type,
        clientId: formData.clientId,
        notes: formData.notes
      }))

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const result = await response.json()
        alert('Documento enviado com sucesso!')
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao enviar documento')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar documento')
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
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload de Documento</h2>
                <p className="text-sm text-gray-600 mt-1">Adicione um novo documento</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-80 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-xs font-medium text-gray-700">Arquivo *</label>
              <div className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-600 rounded-full text-xs cursor-help hover:bg-gray-200 transition-colors" title="Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamanho máximo: 10MB">
                ?
              </div>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 file:rounded-md hover:file:bg-blue-100"
              required
            />
            {selectedFile && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          <FormField
            label="Nome do Documento"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Passaporte - João Silva"
            required
            formatValue={formatters.titleCase}
            validation={combineValidators(validators.required, validators.minLength(3))}
            tooltip="Nome descritivo para identificar o documento no sistema"
            leftIcon={<FileText className="h-4 w-4" />}
          />

          <FormSelect
            label="Tipo de Documento"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            required
            placeholder="Selecione o tipo..."
            tooltip="Categoria do documento para melhor organização"
            options={[
              { value: "PASSPORT", label: "📘 Passaporte" },
              { value: "ID_DOCUMENT", label: "🆔 Documento de ID" },
              { value: "BIRTH_CERTIFICATE", label: "📄 Certidão de Nascimento" },
              { value: "MARRIAGE_CERTIFICATE", label: "💒 Certidão de Casamento" },
              { value: "DIPLOMA", label: "🎓 Diploma" },
              { value: "TRANSCRIPT", label: "📊 Histórico Escolar" },
              { value: "WORK_CERTIFICATE", label: "💼 Certificado de Trabalho" },
              { value: "BANK_STATEMENT", label: "🏦 Extrato Bancário" },
              { value: "TAX_RETURN", label: "📋 Declaração de IR" },
              { value: "MEDICAL_EXAM", label: "🏥 Exame Médico" },
              { value: "POLICE_CLEARANCE", label: "👮 Antecedentes Criminais" },
              { value: "PHOTOS", label: "📸 Fotos" },
              { value: "OTHER", label: "📎 Outros" }
            ]}
          />

          <FormSelect
            label="Cliente"
            value={formData.clientId}
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            placeholder="Selecione um cliente..."
            tooltip="Cliente ao qual este documento pertence (opcional)"
            options={[
              { value: "1", label: "Maria Silva" },
              { value: "2", label: "João Santos" },
              { value: "3", label: "Ana Costa" }
            ]}
            helpText="Deixe em branco se for um documento geral"
          />

          <FormTextarea
            label="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Observações sobre o documento, validade, status..."
            rows={2}
            maxLength={200}
            showCharCount
            tooltip="Informações adicionais sobre o documento"
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
                  disabled={isLoading || !selectedFile}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Documento
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

// Slide-over de Visualizar Documento
function ViewDocumentSlider({ isOpen, document, onClose }: { isOpen: boolean, document: Document | null, onClose: () => void }) {
  if (!isOpen || !document) return null
  const typeIcons: Record<string, any> = {
    'PASSPORT': User,
    'ID_DOCUMENT': User,
    'BIRTH_CERTIFICATE': FileText,
    'MARRIAGE_CERTIFICATE': FileText,
    'DIPLOMA': FileCheck,
    'TRANSCRIPT': FileText,
    'WORK_CERTIFICATE': FileCheck,
    'BANK_STATEMENT': FileText,
    'TAX_RETURN': FileText,
    'MEDICAL_EXAM': FileCheck,
    'POLICE_CLEARANCE': FileCheck,
    'PHOTOS': Image,
    'FORM': File,
    'OTHER': FileText
  }

  const typeLabels: Record<string, string> = {
    'PASSPORT': 'Passaporte',
    'ID_DOCUMENT': 'Documento de ID',
    'BIRTH_CERTIFICATE': 'Certidão de Nascimento',
    'MARRIAGE_CERTIFICATE': 'Certidão de Casamento',
    'DIPLOMA': 'Diploma',
    'TRANSCRIPT': 'Histórico Escolar',
    'WORK_CERTIFICATE': 'Certificado de Trabalho',
    'BANK_STATEMENT': 'Extrato Bancário',
    'TAX_RETURN': 'Declaração de IR',
    'MEDICAL_EXAM': 'Exame Médico',
    'POLICE_CLEARANCE': 'Antecedentes Criminais',
    'PHOTOS': 'Fotos',
    'FORM': 'Formulário',
    'OTHER': 'Outros'
  }

  const statusLabels: Record<string, string> = {
    'PENDING': 'Pendente',
    'ANALYZING': 'Analisando',
    'VALID': 'Válido',
    'INVALID': 'Inválido',
    'NEEDS_REVIEW': 'Precisa Revisão',
    'EXPIRED': 'Expirado'
  }

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'ANALYZING': 'bg-blue-100 text-blue-700',
    'VALID': 'bg-green-100 text-green-700',
    'INVALID': 'bg-red-100 text-red-700',
    'NEEDS_REVIEW': 'bg-orange-100 text-orange-700',
    'EXPIRED': 'bg-gray-100 text-gray-700'
  }

  const TypeIcon = typeIcons[document.type] || FileText
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Detalhes do Documento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Header do Documento */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
              <TypeIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{document.name}</h3>
              <p className="text-gray-600">{typeLabels[document.type]}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[document.status]}`}>
                {statusLabels[document.status]}
              </span>
            </div>
          </div>

          {/* Informações do Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <File className="h-4 w-4 mr-2" />
                Informações do Arquivo
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nome do arquivo:</span>
                  <span className="text-sm font-medium">{document.fileName}</span>
                </div>
                {document.fileSize && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tamanho:</span>
                    <span className="text-sm font-medium">{formatFileSize(document.fileSize)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Upload em:</span>
                  <span className="text-sm font-medium">{new Date(document.uploadedAt).toLocaleString('pt-BR')}</span>
                </div>
                {document.validatedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Validado em:</span>
                    <span className="text-sm font-medium">{new Date(document.validatedAt).toLocaleString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Cliente
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nome:</span>
                  <span className="text-sm font-medium">{document.client?.name || 'Não atribuído'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{document.client?.email || 'N/A'}</span>
                </div>
                {document.uploadedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Enviado por:</span>
                    <span className="text-sm font-medium">{document.uploadedBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Observações de Validação */}
          {document.validationNotes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Observações de Validação
              </h4>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">{document.validationNotes}</p>
              </div>
            </div>
          )}

          {/* Preview do Documento */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview do Documento
            </h4>
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Preview não disponível</p>
              <button className="btn-secondary flex items-center mx-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Documento
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// Slide-over de Editar Documento
function EditDocumentSlider({ isOpen, document, onClose, onSuccess }: { isOpen: boolean, document: Document | null, onClose: () => void, onSuccess: () => void }) {
  if (!isOpen || !document) return null
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: document.name,
    type: document.type,
    status: document.status,
    validationNotes: document.validationNotes || ''
  })

  const typeLabels: Record<string, string> = {
    'PASSPORT': 'Passaporte',
    'ID_DOCUMENT': 'Documento de ID',
    'BIRTH_CERTIFICATE': 'Certidão de Nascimento',
    'MARRIAGE_CERTIFICATE': 'Certidão de Casamento',
    'DIPLOMA': 'Diploma',
    'TRANSCRIPT': 'Histórico Escolar',
    'WORK_CERTIFICATE': 'Certificado de Trabalho',
    'BANK_STATEMENT': 'Extrato Bancário',
    'TAX_RETURN': 'Declaração de IR',
    'MEDICAL_EXAM': 'Exame Médico',
    'POLICE_CLEARANCE': 'Antecedentes Criminais',
    'PHOTOS': 'Fotos',
    'FORM': 'Formulário',
    'OTHER': 'Outros'
  }

  const statusLabels: Record<string, string> = {
    'PENDING': 'Pendente',
    'ANALYZING': 'Analisando',
    'VALID': 'Válido',
    'INVALID': 'Inválido',
    'NEEDS_REVIEW': 'Precisa Revisão',
    'EXPIRED': 'Expirado'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call,      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Documento atualizado com sucesso!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar documento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Editar Documento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Documento *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Observações de Validação</label>
            <textarea
              value={formData.validationNotes}
              onChange={(e) => setFormData({...formData, validationNotes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Observações sobre validação ou problemas encontrados..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Slide-over de Compartilhar Documento
function ShareDocumentSlider({ isOpen, document, onClose }: { isOpen: boolean, document: Document | null, onClose: () => void }) {
  if (!isOpen || !document) return null
  const [isLoading, setIsLoading] = useState(false)
  const [shareMethod, setShareMethod] = useState<'email' | 'link'>('email')
  const [formData, setFormData] = useState({
    email: '',
    message: `Compartilhando documento: ${document.name}`,
    expiresIn: '7'
  })

  const typeLabels: Record<string, string> = {
    'PASSPORT': 'Passaporte',
    'ID_DOCUMENT': 'Documento de ID',
    'BIRTH_CERTIFICATE': 'Certidão de Nascimento',
    'MARRIAGE_CERTIFICATE': 'Certidão de Casamento',
    'DIPLOMA': 'Diploma',
    'TRANSCRIPT': 'Histórico Escolar',
    'WORK_CERTIFICATE': 'Certificado de Trabalho',
    'BANK_STATEMENT': 'Extrato Bancário',
    'TAX_RETURN': 'Declaração de IR',
    'MEDICAL_EXAM': 'Exame Médico',
    'POLICE_CLEARANCE': 'Antecedentes Criminais',
    'PHOTOS': 'Fotos',
    'FORM': 'Formulário',
    'OTHER': 'Outros'
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (shareMethod === 'email') {
        // Simulate email sharing,        await new Promise(resolve => setTimeout(resolve, 1000))
        alert(`Documento compartilhado por email para: ${formData.email}`)
      } else {
        // Simulate link generation,        await new Promise(resolve => setTimeout(resolve, 500))
        const shareLink = `https://visa2any.com/share/${document.id}?token=abc123`
        navigator.clipboard.writeText(shareLink)
        alert('Link de compartilhamento copiado para a área de transferência!')
      }
      onClose()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao compartilhar documento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Compartilhar Documento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{document.name}</p>
              <p className="text-sm text-gray-600">{typeLabels[document.type]}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Método de Compartilhamento</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShareMethod('email')}
              className={`p-3 border-2 rounded-lg transition-all ${
                shareMethod === 'email'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="h-5 w-5 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">Por Email</span>
            </button>
            <button
              type="button"
              onClick={() => setShareMethod('link')}
              className={`p-3 border-2 rounded-lg transition-all ${
                shareMethod === 'link'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ExternalLink className="h-5 w-5 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">Link Público</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleShare} className="space-y-4">
          {shareMethod === 'email' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Email do Destinatário *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="destinatario@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Expiração do Acesso</label>
            <select
              value={formData.expiresIn}
              onChange={(e) => setFormData({...formData, expiresIn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 dia</option>
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="0">Sem expiração</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Compartilhando...' : shareMethod === 'email' ? 'Enviar Email' : 'Gerar Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}