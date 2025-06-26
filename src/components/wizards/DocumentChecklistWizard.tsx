'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, CheckCircle, AlertTriangle, Download, Upload, Eye,
  Calendar, Clock, Star, Award, Shield, Globe, User, Building,
  CreditCard, GraduationCap, Heart, Plane, Search, Filter,
  Check, X, Info, Lightbulb, Target, Zap, BookOpen
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface DocumentRequirement {
  id: string
  name: string
  description: string
  category: 'identity' | 'financial' | 'travel' | 'education' | 'health' | 'legal' | 'supporting'
  required: boolean
  priority: 'critical' | 'high' | 'medium' | 'optional'
  format: string[]
  maxSize?: string
  translations?: boolean
  apostille?: boolean
  validity?: string
  tips: string[]
  examples?: string[]
  aiChecks: string[]
  status?: 'pending' | 'uploaded' | 'reviewing' | 'approved' | 'rejected'
  feedback?: string
  aiScore?: number
}

interface CountryRequirements {
  country: string
  visaType: string
  documents: DocumentRequirement[]
  processingTime: string
  additionalNotes: string[]
  urgentProcessing?: {
    available: boolean
    extraFee: string
    timeReduction: string
  }
}

interface DocumentChecklistWizardProps {
  country: string
  visaType: string
  applicantProfile?: {
    nationality: string
    age: number
    maritalStatus: string
    hasChildren: boolean
    education: string
    workExperience: number
  }
}

export function DocumentChecklistWizard({ 
  country, 
  visaType, 
  applicantProfile 
}: DocumentChecklistWizardProps) {
  const [currentCategory, setCurrentCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [checkedDocuments, setCheckedDocuments] = useState<Set<string>>(new Set())
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: File}>({})
  const [requirements, setRequirements] = useState<CountryRequirements | null>(null)
  const [showAITips, setShowAITips] = useState(true)
  const [completionProgress, setCompletionProgress] = useState(0)

  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  // Document requirements by country and visa type,  const documentRequirements: { [key: string]: CountryRequirements } = {
    'USA-B1/B2': {
      country: 'USA',
      visaType: 'B1/B2',
      processingTime: '3-5 dias úteis',
      additionalNotes: [
        'Todos os documentos devem estar em inglês ou com tradução juramentada',
        'Fotos devem seguir padrões específicos do Departamento de Estado',
        'Comprovantes financeiros devem ser recentes (últimos 3 meses)'
      ],
      urgentProcessing: {
        available: true,
        extraFee: '$210',
        timeReduction: '1-3 dias úteis'
      },
      documents: [
        {
          id: 'passport',
          name: 'Passaporte',
          description: 'Passaporte válido por pelo menos 6 meses além da data da viagem',
          category: 'identity',
          required: true,
          priority: 'critical',
          format: ['PDF', 'JPG', 'PNG'],
          maxSize: '5MB',
          validity: '6 meses mínimo',
          tips: [
            'Verifique se o passaporte não está danificado',
            'Confirme se há pelo menos 2 páginas em branco',
            'Renove se estiver próximo do vencimento'
          ],
          examples: ['Passaporte brasileiro comum', 'Passaporte diplomático', 'Passaporte de emergência'],
          aiChecks: [
            'Verificação de validade automática',
            'Análise de qualidade da imagem',
            'Confirmação de páginas em branco'
          ]
        },
        {
          id: 'ds160',
          name: 'Formulário DS-160',
          description: 'Formulário de solicitação de visto preenchido online',
          category: 'travel',
          required: true,
          priority: 'critical',
          format: ['PDF'],
          tips: [
            'Preencha com informações precisas e consistentes',
            'Use a mesma foto do formulário para outros documentos',
            'Salve o número de confirmação'
          ],
          aiChecks: [
            'Verificação de consistência de dados',
            'Análise de completude do formulário',
            'Validação de foto anexada'
          ]
        },
        {
          id: 'photo',
          name: 'Foto 5x5cm',
          description: 'Foto recente seguindo padrões do Departamento de Estado',
          category: 'identity',
          required: true,
          priority: 'critical',
          format: ['JPG', 'PNG'],
          maxSize: '2MB',
          tips: [
            'Fundo branco ou off-white',
            'Expressão neutra, olhos abertos',
            'Sem óculos, chapéus ou acessórios',
            'Foto tirada nos últimos 6 meses'
          ],
          aiChecks: [
            'Verificação automática de fundo',
            'Análise de qualidade facial',
            'Conformidade com padrões oficiais'
          ]
        },
        {
          id: 'bank_statements',
          name: 'Extratos Bancários',
          description: 'Extratos dos últimos 3 meses demonstrando capacidade financeira',
          category: 'financial',
          required: true,
          priority: 'high',
          format: ['PDF', 'JPG'],
          maxSize: '10MB',
          tips: [
            'Extratos oficiais do banco (não print de tela)',
            'Demonstre movimentação regular',
            'Saldo compatível com duração da viagem',
            'Inclua conta corrente e poupança'
          ],
          aiChecks: [
            'Análise de padrão de movimentação',
            'Verificação de saldo adequado',
            'Detecção de regularidade bancária'
          ]
        },
        {
          id: 'employment_letter',
          name: 'Carta do Empregador',
          description: 'Carta em papel timbrado confirmando emprego e período de férias',
          category: 'supporting',
          required: false,
          priority: 'medium',
          format: ['PDF', 'JPG'],
          tips: [
            'Papel timbrado oficial da empresa',
            'Assinatura e carimbo do responsável',
            'Confirme cargo, salário e período de férias',
            'Inclua dados de contato da empresa'
          ],
          aiChecks: [
            'Verificação de autenticidade visual',
            'Análise de consistência de dados',
            'Validação de formato oficial'
          ]
        },
        {
          id: 'travel_itinerary',
          name: 'Roteiro de Viagem',
          description: 'Planejamento detalhado da viagem incluindo reservas',
          category: 'travel',
          required: false,
          priority: 'medium',
          format: ['PDF', 'DOC'],
          tips: [
            'Inclua reservas de hotel (mesmo que canceláveis)',
            'Passagens aéreas de ida e volta',
            'Roteiro dia a dia das atividades',
            'Comprovantes de tours ou eventos'
          ],
          aiChecks: [
            'Verificação de coerência do roteiro',
            'Análise de viabilidade temporal',
            'Confirmação de reservas'
          ]
        }
      ]
    },
    'CAN-EXPRESS': {
      country: 'Canada',
      visaType: 'Express Entry',
      processingTime: '6-8 meses',
      additionalNotes: [
        'Documentos em inglês ou francês, ou com tradução certificada',
        'Exames médicos são válidos por 12 meses',
        'Testes de idioma válidos por 2 anos'
      ],
      documents: [
        {
          id: 'passport',
          name: 'Passaporte',
          description: 'Passaporte válido de todos os membros da família',
          category: 'identity',
          required: true,
          priority: 'critical',
          format: ['PDF', 'JPG'],
          tips: ['Todas as páginas devem ser digitalizadas', 'Passaportes de cônjuge e filhos se aplicável'],
          aiChecks: ['Verificação de validade', 'Análise de qualidade da digitalização']
        },
        {
          id: 'language_test',
          name: 'Teste de Idioma',
          description: 'IELTS, CELPIP, TEF ou TCF válidos',
          category: 'education',
          required: true,
          priority: 'critical',
          format: ['PDF'],
          validity: '2 anos',
          tips: [
            'Resultados devem ser recentes (últimos 2 anos)',
            'Pontuação mínima CLB 7 para Express Entry',
            'Teste oficial de centro autorizado'
          ],
          aiChecks: [
            'Verificação de validade temporal',
            'Análise de pontuação adequada',
            'Validação de centro autorizado'
          ]
        },
        {
          id: 'eca_report',
          name: 'Avaliação de Credenciais (ECA)',
          description: 'Relatório de equivalência educacional canadense',
          category: 'education',
          required: true,
          priority: 'critical',
          format: ['PDF'],
          validity: '5 anos',
          tips: [
            'Use apenas organizações ECA designadas',
            'WES, IQAS, ICES são mais comuns',
            'Inclua todos os diplomas relevantes'
          ],
          aiChecks: [
            'Verificação de organismo autorizado',
            'Análise de validade temporal',
            'Confirmação de equivalência'
          ]
        }
      ]
    },
    'PRT-D7': {
      country: 'Portugal',
      visaType: 'D7',
      processingTime: '60-90 dias',
      additionalNotes: [
        'Documentos brasileiros precisam de apostila de Haia',
        'Comprovativo de rendimentos deve ser superior a €760/mês',
        'Seguro de saúde obrigatório para todo o período'
      ],
      documents: [
        {
          id: 'passport',
          name: 'Passaporte',
          description: 'Passaporte válido por pelo menos 3 meses além da estadia',
          category: 'identity',
          required: true,
          priority: 'critical',
          format: ['PDF', 'JPG'],
          apostille: false,
          tips: ['Cópia colorida de todas as páginas', 'Verificar validade mínima de 3 meses'],
          aiChecks: ['Verificação automática de validade', 'Análise de qualidade da digitalização']
        },
        {
          id: 'criminal_record',
          name: 'Certidão de Antecedentes Criminais',
          description: 'Certidão negativa de antecedentes criminais com apostila',
          category: 'legal',
          required: true,
          priority: 'critical',
          format: ['PDF'],
          apostille: true,
          validity: '3 meses',
          tips: [
            'Certidão da Polícia Federal brasileira',
            'Apostila de Haia obrigatória',
            'Validade de apenas 3 meses'
          ],
          aiChecks: [
            'Verificação de apostila válida',
            'Análise de autenticidade',
            'Confirmação de prazo de validade'
          ]
        },
        {
          id: 'income_proof',
          name: 'Comprovativo de Rendimentos',
          description: 'Documentos comprovando renda superior a €760/mês',
          category: 'financial',
          required: true,
          priority: 'critical',
          format: ['PDF', 'JPG'],
          tips: [
            'Declaração IR + recibos de entrega',
            'Extratos bancários dos últimos 3 meses',
            'Contrato de trabalho ou aposentadoria',
            'Renda deve superar €760/mês por pessoa'
          ],
          aiChecks: [
            'Cálculo automático de renda',
            'Verificação de consistência',
            'Análise de regularidade de rendimentos'
          ]
        }
      ]
    }
  }

  const categories = [
    { id: 'all', name: 'Todos', icon: FileText, color: 'gray' },
    { id: 'identity', name: 'Identidade', icon: User, color: 'blue' },
    { id: 'financial', name: 'Financeiro', icon: CreditCard, color: 'green' },
    { id: 'travel', name: 'Viagem', icon: Plane, color: 'purple' },
    { id: 'education', name: 'Educação', icon: GraduationCap, color: 'yellow' },
    { id: 'health', name: 'Saúde', icon: Heart, color: 'red' },
    { id: 'legal', name: 'Legal', icon: Shield, color: 'indigo' },
    { id: 'supporting', name: 'Apoio', icon: Building, color: 'pink' }
  ]

  useEffect(() => {
    const key = `${country}-${visaType}`
    const reqs = documentRequirements[key] || documentRequirements['USA-B1/B2']
    setRequirements(reqs)
  }, [country, visaType])

  useEffect(() => {
    if (requirements) {
      const totalDocs = requirements.documents.length
      const checkedCount = checkedDocuments.size
      setCompletionProgress(Math.round((checkedCount / totalDocs) * 100))
    }
  }, [checkedDocuments, requirements])

  const handleDocumentCheck = (docId: string) => {
    const newChecked = new Set(checkedDocuments)
    if (newChecked.has(docId)) {
      newChecked.delete(docId)
    } else {
      newChecked.add(docId)
    }
    setCheckedDocuments(newChecked)
  }

  const handleFileUpload = (docId: string, file: File) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [docId]: file
    }))
    
    // Auto-check when uploaded,    setCheckedDocuments(prev => new Set([...prev, docId]))
    
    notifySuccess('Upload realizado', `${file.name} foi carregado com sucesso`)
  }

  const getFilteredDocuments = () => {
    if (!requirements) return []
    
    let filtered = requirements.documents
    
    if (currentCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === currentCategory)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red'
      case 'high': return 'orange' 
      case 'medium': return 'yellow'
      case 'optional': return 'gray'
      default: return 'gray'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle
      case 'high': return Star
      case 'medium': return Info
      case 'optional': return CheckCircle
      default: return Info
    }
  }

  const generatePersonalizedTips = () => {
    if (!applicantProfile) return []
    
    const tips = []
    
    if (applicantProfile.age < 25) {
      tips.push("💡 Para jovens: Inclua carta dos pais ou responsáveis financeiros")
    }
    
    if (applicantProfile.maritalStatus === 'married') {
      tips.push("💍 Casados: Inclua certidão de casamento e documentos do cônjuge")
    }
    
    if (applicantProfile.hasChildren) {
      tips.push("👶 Com filhos: Adicione certidões de nascimento e autorizações se aplicável")
    }
    
    if (applicantProfile.education === 'higher') {
      tips.push("🎓 Ensino superior: Destaque diplomas e certificações relevantes")
    }
    
    return tips
  }

  if (!requirements) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando requisitos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Checklist de Documentos
        </h1>
        <p className="text-gray-600">
          {requirements.country} - {requirements.visaType}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Progresso Geral</h2>
            <p className="text-sm text-gray-600">
              {checkedDocuments.size} de {requirements.documents.length} documentos preparados
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionProgress}%</div>
            <div className="text-sm text-gray-500">Completo</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-lg font-bold text-red-600">
              {requirements.documents.filter(d => d.priority === 'critical').length}
            </div>
            <div className="text-xs text-red-600">Críticos</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">
              {requirements.documents.filter(d => d.priority === 'high').length}
            </div>
            <div className="text-xs text-orange-600">Alta Prioridade</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-600">
              {requirements.documents.filter(d => d.priority === 'medium').length}
            </div>
            <div className="text-xs text-yellow-600">Média Prioridade</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-600">
              {requirements.documents.filter(d => d.priority === 'optional').length}
            </div>
            <div className="text-xs text-gray-600">Opcionais</div>
          </div>
        </div>
      </div>

      {/* Personalized AI Tips */}
      {showAITips && generatePersonalizedTips().length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-purple-900 mb-2">Dicas Personalizadas IA</h3>
                <div className="space-y-1">
                  {generatePersonalizedTips().map((tip, index) => (
                    <p key={index} className="text-sm text-purple-700">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAITips(false)}
              className="text-purple-400 hover:text-purple-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-300`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Processing Time Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Tempo de Processamento</h4>
              <p className="text-sm text-blue-700 mb-2">{requirements.processingTime}</p>
              {requirements.urgentProcessing?.available && (
                <p className="text-xs text-blue-600">
                  ⚡ Processamento urgente disponível: {requirements.urgentProcessing.timeReduction} 
                  (taxa adicional: {requirements.urgentProcessing.extraFee})
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {getFilteredDocuments().map((document) => {
          const PriorityIcon = getPriorityIcon(document.priority)
          const isChecked = checkedDocuments.has(document.id)
          const isUploaded = uploadedDocuments[document.id]
          
          return (
            <div
              key={document.id}
              className={`bg-white rounded-lg shadow-sm border transition-all ${
                isChecked ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleDocumentCheck(document.id)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      document.priority === 'critical' ? 'bg-red-100' :
                      document.priority === 'high' ? 'bg-orange-100' :
                      document.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <PriorityIcon className={`h-4 w-4 ${
                        document.priority === 'critical' ? 'text-red-600' :
                        document.priority === 'high' ? 'text-orange-600' :
                        document.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {document.name}
                          {document.required && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Obrigatório
                            </span>
                          )}
                          {document.apostille && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              Apostila
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">{document.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isUploaded && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Enviado</span>
                          </div>
                        )}
                        
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          document.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          document.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          document.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {document.priority === 'critical' ? 'Crítico' :
                           document.priority === 'high' ? 'Alta' :
                           document.priority === 'medium' ? 'Média' : 'Opcional'}
                        </span>
                      </div>
                    </div>

                    {/* Document Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Formatos:</span>
                        <div className="font-medium">{document.format.join(', ')}</div>
                      </div>
                      {document.maxSize && (
                        <div>
                          <span className="text-gray-500">Tamanho máximo:</span>
                          <div className="font-medium">{document.maxSize}</div>
                        </div>
                      )}
                      {document.validity && (
                        <div>
                          <span className="text-gray-500">Validade:</span>
                          <div className="font-medium">{document.validity}</div>
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        Dicas Importantes
                      </h4>
                      <ul className="space-y-1">
                        {document.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Checks */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        Verificações IA Automáticas
                      </h4>
                      <ul className="space-y-1">
                        {document.aiChecks.map((check, index) => (
                          <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-1 text-purple-600" />
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Upload Section */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4" />
                        {isUploaded ? 'Substituir Arquivo' : 'Fazer Upload'}
                        <input
                          type="file"
                          className="hidden"
                          accept={document.format.map(f => `.${f.toLowerCase()}`).join(',')}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(document.id, file)
                          }}
                        />
                      </label>
                      
                      {isUploaded && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{uploadedDocuments[document.id].name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Notes */}
      {requirements.additionalNotes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Observações Importantes
          </h3>
          <ul className="space-y-2">
            {requirements.additionalNotes.map((note, index) => (
              <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4 inline mr-2" />
          Baixar Checklist PDF
        </button>
        
        <button 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          disabled={completionProgress < 100}
        >
          <CheckCircle className="h-4 w-4 inline mr-2" />
          {completionProgress === 100 ? 'Enviar Documentação' : `Faltam ${100 - completionProgress}%`}
        </button>
      </div>
    </div>
  )
}