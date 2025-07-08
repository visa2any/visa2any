'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  Upload, X, FileText, Camera, Scan, Check, AlertCircle,
  Eye, Download, Trash2, RefreshCw, Brain, Sparkles
} from 'lucide-react'

export type DocumentStatus = 'uploading' | 'analyzing' | 'valid' | 'invalid' | 'needs_review'

interface BaseDocument {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  url: string
  status: DocumentStatus
  aiScore?: number
  feedback?: string
}

export type Document = BaseDocument

function isProcessedDocument(doc: Document): boolean {
  return (doc.status === 'valid' || doc.status === 'invalid' || doc.status === 'needs_review') &&
         typeof doc.aiScore === 'number' && 
         typeof doc.feedback === 'string';
}

interface DocumentUploadProps {
  isOpen: boolean
  onClose: () => void
  onDocumentsChange: (documents: Document[]) => void
  existingDocuments?: Document[]
  maxFiles?: number
}

const documentTypes = [
  { value: 'passport', label: '🛂 Passaporte', required: true },
  { value: 'id', label: '🆔 Documento de Identidade', required: true },
  { value: 'birth_cert', label: '📄 Certidão de Nascimento', required: false },
  { value: 'marriage_cert', label: '💍 Certidão de Casamento', required: false },
  { value: 'diploma', label: '🎓 Diploma/Certificado', required: false },
  { value: 'transcript', label: '📚 Histórico Escolar', required: false },
  { value: 'work_cert', label: '💼 Certificado de Trabalho', required: false },
  { value: 'bank_statement', label: '🏦 Extrato Bancário', required: true },
  { value: 'tax_return', label: '📊 Declaração de IR', required: false },
  { value: 'photos', label: '📸 Fotos 3x4/5x5', required: true },
  { value: 'form', label: '📋 Formulários Consulares', required: true },
  { value: 'other', label: '📎 Outros Documentos', required: false }
]

export default function DocumentUpload({ 
  isOpen, 
  onClose, 
  onDocumentsChange,
  existingDocuments = [],
  maxFiles = 20
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(existingDocuments.map(doc => {
    const baseDoc = {
      ...doc,
      url: doc.url ?? '#'
    };
    
    if (doc.status === 'valid' || doc.status === 'invalid' || doc.status === 'needs_review') {
              return {
                ...baseDoc,
                aiScore: doc.aiScore ?? 0,
                feedback: doc.feedback ?? ''
              };
            }
            if (doc.status === 'analyzing') {
              return baseDoc;
            }
            return baseDoc;
  }));
  const [isDragging, setIsDragging] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (files: FileList, type?: string) => {
    const newDocuments: Document[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Check if file exists
      if (!file) continue
      
      // Validate file size (max 10MB)
      
      if (file.size > 10 * 1024 * 1024) {
        window.alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
        continue
      }

      // Validate file type

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        window.alert(`Tipo de arquivo não suportado: ${file.name}`)
        continue
      }

      const document: Document = {
        id: `doc_${Date.now()}_${i}`,
        name: file.name,
        type: type || selectedType || 'other',
        size: file.size,
        status: 'uploading',
        uploadDate: new Date(),
        url: '#'
      }

      newDocuments.push(document)
    }

    setDocuments(prev => [...prev, ...newDocuments])

    // Simulate upload and AI analysis

    for (const doc of newDocuments) {
      try {
        // Simulate upload progress
        await new Promise(resolve => setTimeout(resolve, 1000))
        
          setDocuments(prev => prev.map(d => {
            if (d.id === doc.id) {
              const { aiScore, feedback, ...rest } = d;
              return {
                ...rest,
                status: 'analyzing',
                url: files[0] ? URL.createObjectURL(files[0]) : '#'
              }
            }
            return d
          }))

        // Simulate AI analysis

        setIsAnalyzing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Generate AI analysis results
        
        const aiScore = Math.floor(Math.random() * 30) + 70 // 70-100
        const feedback = generateAIFeedback(doc.type, aiScore)
        const status = aiScore >= 90 ? 'valid' : aiScore >= 75 ? 'needs_review' : 'invalid'

          setDocuments(prev => prev.map(d => {
            if (d.id === doc.id) {
              return {
                id: d.id,
                name: d.name,
                type: d.type,
                size: d.size,
                status,
                uploadDate: d.uploadDate,
                url: files[0] ? URL.createObjectURL(files[0]) : '#',
                aiScore,
                feedback
              }
            }
            return d
          }))
        
      } catch (error) {
          setDocuments(prev => prev.map(d => {
            if (d.id === doc.id) {
              return {
                id: d.id,
                name: d.name,
                type: d.type,
                size: d.size,
                status: 'invalid',
                uploadDate: new Date(),
                url: d.url,
                aiScore: 0,
                feedback: 'Erro no upload'
              };
            }
            return d;
          }))
      }
    }
    
    setIsAnalyzing(false)
    onDocumentsChange([...documents, ...newDocuments])
  }, [selectedType, documents, onDocumentsChange])

  const generateAIFeedback = (type: string, score: number): string => {
    const feedbacks = {
      passport: score >= 90 ? 'Passaporte em excelente condição, todas as informações legíveis' :
                score >= 75 ? 'Passaporte válido, mas recomendamos nova foto por qualidade' :
                'Documento ilegível ou com problemas de validade',
      bank_statement: score >= 90 ? 'Extrato completo e atual, fundos suficientes demonstrados' :
                     score >= 75 ? 'Extrato válido, considere incluir período mais recente' :
                     'Extrato muito antigo ou valores insuficientes',
      photos: score >= 90 ? 'Fotos atendem perfeitamente aos padrões consulares' :
              score >= 75 ? 'Fotos aceitáveis, mas atenção ao fundo e posicionamento' :
              'Fotos não atendem aos padrões, refazer necessário'
    }
    
    return feedbacks[type as keyof typeof feedbacks] || 
           (score >= 90 ? 'Documento aprovado pela análise IA' :
            score >= 75 ? 'Documento válido com pequenas observações' :
            'Documento precisa ser revisado ou refeito')
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeDocument = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id)
    setDocuments(updatedDocs)
    onDocumentsChange(updatedDocs)
  }

    const reanalyzeDocument = async (id: string) => {
      setDocuments(prev => prev.map(d => {
        if (d.id === id) {
          return {
            id: d.id,
            name: d.name,
            type: d.type,
            size: d.size,
            status: 'analyzing',
            uploadDate: new Date(),
            url: d.url
          };
        }
        return d;
      }));

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const doc = documents.find(d => d.id === id);
      if (!doc) return;
      
      const docType = doc.type || 'other';
      const newScore = Math.floor(Math.random() * 30) + 70;
      const newFeedback = generateAIFeedback(docType, newScore);
      const newStatus = newScore >= 90 ? 'valid' : newScore >= 75 ? 'needs_review' : 'invalid';

      setDocuments(prev => prev.map(d => {
        if (d.id === id) {
          return {
            id: d.id,
            name: d.name,
            type: d.type,
            size: d.size,
            status: newStatus,
            uploadDate: new Date(),
            url: d.url,
            aiScore: newScore,
            feedback: newFeedback
          };
        }
        return d;
      }));
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
      case 'valid': return <Check className="h-4 w-4" />
      case 'invalid': return <X className="h-4 w-4" />
      case 'needs_review': return <AlertCircle className="h-4 w-4" />
      case 'analyzing': return <Brain className="h-4 w-4 animate-pulse" />
      case 'uploading': return <Upload className="h-4 w-4 animate-bounce" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const requiredDocs = documentTypes.filter(type => type.required)
  const uploadedTypes = documents.map(doc => doc.type)
  const missingRequired = requiredDocs.filter(type => !uploadedTypes.includes(type.value))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Upload de Documentos</h2>
                <p className="text-blue-100 text-sm">
                  {documents.length}/{maxFiles} arquivos • IA analysando automaticamente
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Upload Area */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione o tipo</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} {type.required && '(Obrigatório)'}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Arraste arquivos aqui ou clique para selecionar
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Suporta: PDF, JPG, PNG, DOC, DOCX • Máximo: 10MB por arquivo
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Selecionar Arquivos
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    Câmera/Scanner
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files)
                    }
                  }}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files)
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          {missingRequired.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                📋 Documentos Obrigatórios Pendentes:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {missingRequired.map(doc => (
                  <li key={doc.value}>• {doc.label}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents List */}
          {documents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Documentos Enviados ({documents.length})
                </h3>
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Brain className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">IA analisando...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              {doc.status === 'valid' ? 'Aprovado' :
                               doc.status === 'invalid' ? 'Rejeitado' :
                               doc.status === 'needs_review' ? 'Revisão' :
                               doc.status === 'analyzing' ? 'Analisando' : 'Enviando'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>{formatFileSize(doc.size)}</span>
                            <span>{documentTypes.find(t => t.value === doc.type)?.label || doc.type}</span>
                            <span>{doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Data não disponível'}</span>
                          </div>

          {isProcessedDocument(doc) && doc.aiScore !== undefined && doc.feedback !== undefined && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-600">
                  IA Score: {doc.aiScore}/100
                </span>
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

              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                <strong>💬 Feedback da IA:</strong> {doc.feedback}
              </div>
            </>
          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {doc.url && (
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        
                        {doc.status !== 'uploading' && doc.status !== 'analyzing' && (
                          <button
                            onClick={() => reanalyzeDocument(doc.id)}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Reanalisar com IA"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>
                IA analisa automaticamente qualidade, validade e conformidade
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
              
              <button
                onClick={() => {
                  onDocumentsChange(documents)
                  onClose()
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                Salvar Documentos ({documents.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
