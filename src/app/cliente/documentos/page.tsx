'use client'

import { useState, useEffect } from 'react'
import ClientHeader from '@/components/ClientHeader'
import DocumentUpload from '@/components/DocumentUpload'
import { 
  FileText, Upload, Eye, Download, Trash2, RefreshCw, 
  Brain, CheckCircle, AlertTriangle, Clock, Sparkles
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  status: 'uploading' | 'analyzing' | 'valid' | 'invalid' | 'needs_review'
  aiScore?: number
  feedback?: string
  size: number
  uploadDate: Date | string
  url?: string
}

interface CustomerData {
  id: string
  name: string
  email: string
  eligibilityScore: number
  automationInsights?: {
    engagementScore: number
  }
}

export default function DocumentosPage() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      // Load customer data,      const storedCustomer = localStorage.getItem('customer')
      if (storedCustomer) {
        setCustomerData(JSON.parse(storedCustomer))
      } else {
        setCustomerData({
          id: 'cliente-padrao',
          name: 'João Silva Santos',
          email: 'demo@visa2any.com',
          eligibilityScore: 87,
          automationInsights: {
            engagementScore: 87
          }
        })
      }

      // Load documents,      const storedDocs = localStorage.getItem('customer-documents')
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs))
      } else {
        // Default documents,        setDocuments([
          {
            id: '1',
            name: 'Passaporte_JoaoSilva.pdf',
            type: 'passport',
            status: 'valid',
            aiScore: 98,
            feedback: 'Passaporte em excelente condição, todas as informações legíveis',
            size: 2048000,
            uploadDate: '2024-01-15',
            url: '#'
          },
          {
            id: '2',
            name: 'Comprovante_Financeiro.pdf',
            type: 'bank_statement',
            status: 'needs_review',
            aiScore: 85,
            feedback: 'Extrato válido, considere incluir período mais recente',
            size: 1024000,
            uploadDate: '2024-01-20',
            url: '#'
          },
          {
            id: '3',
            name: 'Carta_Empregador.pdf',
            type: 'work_cert',
            status: 'valid',
            aiScore: 92,
            feedback: 'Documento aprovado pela análise IA',
            size: 512000,
            uploadDate: '2024-01-22',
            url: '#'
          }
        ])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentsChange = (newDocuments: Document[]) => {
    setDocuments(newDocuments)
    localStorage.setItem('customer-documents', JSON.stringify(newDocuments))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-100'
      case 'invalid': return 'text-red-600 bg-red-100'
      case 'needs_review': return 'text-yellow-600 bg-yellow-100'
      case 'analyzing': return 'text-blue-600 bg-blue-100'
      case 'uploading': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4" />
      case 'invalid': return <AlertTriangle className="h-4 w-4" />
      case 'needs_review': return <Clock className="h-4 w-4" />
      case 'analyzing': return <Brain className="h-4 w-4 animate-pulse" />
      case 'uploading': return <Upload className="h-4 w-4 animate-bounce" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const documentTypes = {
    passport: 'Passaporte',
    id: 'Documento de Identidade',
    bank_statement: 'Extrato Bancário',
    work_cert: 'Certificado de Trabalho',
    birth_cert: 'Certidão de Nascimento',
    photos: 'Fotos 3x4/5x5',
    form: 'Formulários Consulares',
    other: 'Outros Documentos'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Carregando documentos...</p>
        </div>
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader 
        customerData={customerData} 
        onSofiaChat={() => {}} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Meus Documentos
            </h1>
            <p className="text-gray-600 mt-1">
              {documents.length} documento{documents.length !== 1 ? 's' : ''} • 
              IA analisando automaticamente
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Documentos
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'valid').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Revisão</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'needs_review').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analisando</p>
                <p className="text-2xl font-bold text-blue-600">
                  {documents.filter(d => d.status === 'analyzing').length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Médio IA</p>
                <p className="text-2xl font-bold text-purple-600">
                  {documents.length > 0 
                    ? Math.round(documents.filter(d => d.aiScore).reduce((acc, d) => acc + (d.aiScore || 0), 0) / documents.filter(d => d.aiScore).length)
                    : 0}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lista de Documentos</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento enviado</h3>
                <p className="text-gray-600 mb-4">Comece fazendo upload dos seus documentos</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Fazer Upload
                </button>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                            {getStatusIcon(doc.status)}
                            {doc.status === 'valid' ? 'Aprovado' :
                             doc.status === 'invalid' ? 'Rejeitado' :
                             doc.status === 'needs_review' ? 'Revisão' :
                             doc.status === 'analyzing' ? 'Analisando' : 'Enviando'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-2">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>{documentTypes[doc.type as keyof typeof documentTypes] || doc.type}</span>
                          <span>{typeof doc.uploadDate === 'string' ? new Date(doc.uploadDate).toLocaleDateString() : doc.uploadDate.toLocaleDateString()}</span>
                        </div>

                        {doc.aiScore && (
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-600">
                                IA Score: {doc.aiScore}/100
                              </span>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  doc.aiScore >= 90 ? 'bg-green-500' :
                                  doc.aiScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${doc.aiScore}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {doc.feedback && (
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                            <strong>💬 Feedback da IA:</strong> {doc.feedback}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.url && (
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      {doc.status !== 'uploading' && doc.status !== 'analyzing' && (
                        <button
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Reanalisar com IA"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/* Document Upload Modal */}
      <DocumentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDocumentsChange={handleDocumentsChange}
        existingDocuments={documents}
      />
    </div>
  )
}