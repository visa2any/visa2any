'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, Users, Calendar, Target, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Star, Award, Activity, BarChart3, FileText, MessageCircle, Phone, Mail, Video,
  Plus, Filter, Eye, Edit, Send, Download, RefreshCw, Search, MoreHorizontal,
  User, Building, Globe, Heart, Flag, Zap, Bell, Settings, ChevronRight,
  ArrowUpRight, ArrowDownRight, DollarSign, Percent, Hash, MapPin, BookOpen,
  Package, Truck, ClipboardCheck, ExternalLink, AlertCircle, Info, HelpCircle,
  Grid3X3, List, X, Save, MessageSquare, PlayCircle, PauseCircle, RotateCcw
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
  score?: number
  priority: 'high' | 'medium' | 'low'
  assignedConsultant?: string
  lastContactAt?: string
  createdAt: string
  tags: string[]
}

interface ConsultantStats {
  totalClients: number
  activeClients: number
  completedThisMonth: number
  revenue: number
  averageScore: number
  responseTime: number
  satisfaction: number
  tasksCompleted: number
  tasksOverdue: number
  consultationsScheduled: number
}

interface Task {
  id: string
  title: string
  description: string
  client: { id: string; name: string; email: string }
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  type: 'consultation' | 'document_review' | 'follow_up' | 'application' | 'other'
  estimatedDuration: number
}

interface ServiceOrder {
  id: string
  orderNumber: string
  serviceType: string
  serviceName: string
  client: { id: string; name: string; email: string; phone?: string }
  status: 'new' | 'in_progress' | 'waiting_documents' | 'processing' | 'quality_check' | 'delivered' | 'completed'
  priority: 'high' | 'medium' | 'low'
  amount: number
  createdAt: string
  dueDate?: string
  assignedConsultant?: string
  progress: {
    currentStep: number
    totalSteps: number
    stepName: string
  }
  requirements: {
    id: string
    name: string
    status: 'pending' | 'received' | 'approved' | 'rejected'
    notes?: string
  }[]
  deliveryInfo?: {
    method: 'pdf' | 'physical' | 'both'
    address?: string
    trackingCode?: string
  }
  notes: string[]
  procedureProgress?: {
    procedureId: string
    currentStepId: number
    completedChecklistItems: { [stepId: number]: string[] }
    qualityChecklistCompleted: string[]
  }
}

interface ServiceProcedure {
  id: string
  serviceType: string
  serviceName: string
  category: string
  description: string
  estimatedDuration: string
  steps: {
    id: number
    title: string
    description: string
    requiredDocuments: string[]
    tips: string[]
    checklistItems: string[]
  }[]
  commonIssues: {
    issue: string
    solution: string
  }[]
  qualityChecklist: string[]
}

interface ConsultantWorkspaceProps {
  stats: any
  clients: Client[]
}

export function ConsultantWorkspace({ stats, clients }: ConsultantWorkspaceProps) {
  const [consultantStats, setConsultantStats] = useState<ConsultantStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [procedures, setProcedures] = useState<ServiceProcedure[]>([])
  const [selectedView, setSelectedView] = useState<'overview' | 'clients' | 'tasks' | 'orders' | 'knowledge' | 'calendar' | 'analytics'>('overview')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<ServiceProcedure | null>(null)
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'overdue'>('all')
  const [orderFilterStatus, setOrderFilterStatus] = useState<'all' | 'new' | 'in_progress' | 'waiting_documents' | 'processing' | 'delivered'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderViewMode, setOrderViewMode] = useState<'grid' | 'list'>('grid')
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState<string | null>(null)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchConsultantData()
    fetchTasks()
    fetchOrders()
    fetchProcedures()
  }, [])

  const fetchConsultantData = async () => {
    try {
      // Simular dados do consultor atual
      const mockStats: ConsultantStats = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status !== 'COMPLETED' && c.status !== 'INACTIVE').length,
        completedThisMonth: 8,
        revenue: 45000,
        averageScore: 87,
        responseTime: 2.3,
        satisfaction: 4.8,
        tasksCompleted: 23,
        tasksOverdue: 3,
        consultationsScheduled: 12
      }
      setConsultantStats(mockStats)
    } catch (error) {
      console.error('Erro ao buscar dados do consultor:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      // Simular tarefas do consultor
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Revisão de Documentos - João Silva',
          description: 'Revisar documentos para aplicação de visto americano',
          client: { id: '1', name: 'João Silva', email: 'joao@email.com' },
          dueDate: '2024-12-20T10:00:00Z',
          priority: 'high',
          status: 'pending',
          type: 'document_review',
          estimatedDuration: 60
        },
        {
          id: '2',
          title: 'Consulta Inicial - Maria Santos',
          description: 'Primeira consulta para visto canadense',
          client: { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
          dueDate: '2024-12-21T14:00:00Z',
          priority: 'medium',
          status: 'pending',
          type: 'consultation',
          estimatedDuration: 90
        },
        {
          id: '3',
          title: 'Follow-up - Pedro Costa',
          description: 'Acompanhar status da aplicação',
          client: { id: '3', name: 'Pedro Costa', email: 'pedro@email.com' },
          dueDate: '2024-12-19T16:00:00Z',
          priority: 'high',
          status: 'overdue',
          type: 'follow_up',
          estimatedDuration: 30
        }
      ]
      setTasks(mockTasks)
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      // Simular pedidos de serviços
      const mockOrders: ServiceOrder[] = [
        {
          id: 'ORD-001',
          orderNumber: '#2024-001',
          serviceType: 'certidoes',
          serviceName: 'Segunda Via Certidão de Nascimento',
          client: { id: '1', name: 'Ana Silva', email: 'ana@email.com', phone: '(11) 99999-9999' },
          status: 'in_progress',
          priority: 'high',
          amount: 89.00,
          createdAt: '2024-12-18T09:00:00Z',
          dueDate: '2024-12-21T17:00:00Z',
          assignedConsultant: 'current_consultant',
          progress: {
            currentStep: 2,
            totalSteps: 5,
            stepName: 'Localização nos Cartórios'
          },
          requirements: [
            { id: 'req1', name: 'CPF do Requerente', status: 'received', notes: 'Documento válido' },
            { id: 'req2', name: 'Dados Pessoais Completos', status: 'received' },
            { id: 'req3', name: 'Comprovante de Pagamento', status: 'approved' }
          ],
          deliveryInfo: {
            method: 'both',
            address: 'Rua das Flores, 123 - São Paulo, SP'
          },
          notes: ['Cliente solicitou urgência para processo de visto', 'Dados confirmados por telefone'],
          procedureProgress: {
            procedureId: 'proc-001',
            currentStepId: 2,
            completedChecklistItems: {
              1: ['Nome completo conferido', 'Data de nascimento confirmada', 'Nomes dos pais verificados']
            },
            qualityChecklistCompleted: []
          }
        },
        {
          id: 'ORD-002',
          orderNumber: '#2024-002',
          serviceType: 'traducao',
          serviceName: 'Tradução Juramentada de Diploma',
          client: { id: '2', name: 'Carlos Santos', email: 'carlos@email.com', phone: '(21) 88888-8888' },
          status: 'waiting_documents',
          priority: 'medium',
          amount: 180.00,
          createdAt: '2024-12-17T14:30:00Z',
          dueDate: '2024-12-24T17:00:00Z',
          assignedConsultant: 'current_consultant',
          progress: {
            currentStep: 1,
            totalSteps: 4,
            stepName: 'Aguardando Documentos'
          },
          requirements: [
            { id: 'req1', name: 'Diploma Original (scan)', status: 'pending', notes: 'Aguardando envio' },
            { id: 'req2', name: 'RG/CNH (cópia)', status: 'received' },
            { id: 'req3', name: 'Comprovante de Residência', status: 'pending' }
          ],
          deliveryInfo: {
            method: 'pdf'
          },
          notes: ['Cliente informou que enviará diploma até amanhã'],
          procedureProgress: {
            procedureId: 'proc-004',
            currentStepId: 1,
            completedChecklistItems: {
              1: ['Idioma identificado', 'Tipo de documento classificado']
            },
            qualityChecklistCompleted: []
          }
        },
        {
          id: 'ORD-003',
          orderNumber: '#2024-003',
          serviceType: 'apostilamento',
          serviceName: 'Apostilamento de Haia - Certidão de Casamento',
          client: { id: '3', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(31) 77777-7777' },
          status: 'quality_check',
          priority: 'high',
          amount: 120.00,
          createdAt: '2024-12-16T11:15:00Z',
          dueDate: '2024-12-20T17:00:00Z',
          assignedConsultant: 'current_consultant',
          progress: {
            currentStep: 4,
            totalSteps: 5,
            stepName: 'Controle de Qualidade'
          },
          requirements: [
            { id: 'req1', name: 'Certidão de Casamento Original', status: 'approved' },
            { id: 'req2', name: 'Formulário de Solicitação', status: 'approved' },
            { id: 'req3', name: 'Comprovante de Pagamento', status: 'approved' }
          ],
          deliveryInfo: {
            method: 'physical',
            address: 'Av. Paulista, 1000 - São Paulo, SP',
            trackingCode: 'BR123456789'
          },
          notes: ['Apostila concluída, verificando qualidade antes da entrega'],
          procedureProgress: {
            procedureId: 'proc-005',
            currentStepId: 5,
            completedChecklistItems: {
              1: ['País é signatário da Convenção confirmado', 'Tipo de documento aceito verificado'],
              2: ['Documento original verificado', 'Autenticação confirmada (se cópia)'],
              3: ['Solicitação enviada', 'Taxa paga', 'Protocolo recebido'],
              4: ['Status verificado', 'Cliente informado', 'Documento retirado/recebido']
            },
            qualityChecklistCompleted: ['Apostila aplicada corretamente', 'Carimbo da autoridade competente legível']
          }
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    }
  }

  const fetchProcedures = async () => {
    try {
      // Base de conhecimento com procedimentos expandida
      const mockProcedures: ServiceProcedure[] = [
        {
          id: 'proc-001',
          serviceType: 'certidoes',
          serviceName: 'Segunda Via Certidão de Nascimento',
          category: 'Documentos Civis',
          description: 'Procedimento para obter segunda via de certidão de nascimento através dos cartórios oficiais ou sistemas online',
          estimatedDuration: '1-5 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Coleta de Dados do Cliente',
              description: 'Reunir todas as informações necessárias para localizar a certidão',
              requiredDocuments: ['CPF do requerente', 'Nome completo dos pais', 'Data de nascimento', 'Local de nascimento (cidade/estado)', 'RG ou CNH'],
              tips: ['Sempre confirmar a grafia exata dos nomes', 'Verificar se há nomes compostos ou apelidos', 'Confirmar cidade atual se houve mudança de nome'],
              checklistItems: ['Nome completo conferido', 'Data de nascimento confirmada', 'Nomes dos pais verificados', 'Cidade de nascimento confirmada', 'CPF válido confirmado']
            },
            {
              id: 2,
              title: 'Verificação de Sistemas Online',
              description: 'Verificar se a certidão pode ser obtida online antes de ir aos cartórios',
              requiredDocuments: ['Dados pessoais completos', 'CPF', 'Cartão de crédito para pagamento'],
              tips: [
                'Portal Nacional Oficial: www.registrocivil.org.br (PRINCIPAL)',
                'ARPEN-SP: www.arpensp.org.br (São Paulo)',
                'ARPEN-RJ: www.arpenrj.org.br (Rio de Janeiro)',
                'Registro Civil Minas: www.registrocivilminas.org.br (Minas Gerais)',
                'Portal MG.GOV.BR para solicitação via app',
                'Serviços privados: cartorio24horas.com.br, centraldascertidoes.com.br',
                'SEMPRE verificar se é site oficial (.org.br ou .gov.br)'
              ],
              checklistItems: ['Sistema online verificado', 'Disponibilidade confirmada', 'Taxa verificada', 'Forma de pagamento disponível']
            },
            {
              id: 3,
              title: 'Solicitação Online (se disponível)',
              description: 'Realizar solicitação através dos portais online oficiais',
              requiredDocuments: ['Dados pessoais', 'CPF', 'Comprovante de pagamento'],
              tips: [
                'PORTAL OFICIAL: www.registrocivil.org.br (PRIORIDADE)',
                'Processo: Cidade → Estado → Cartório → Dados pessoais',
                'Informações necessárias: Nome completo, CPF, data nascimento, nomes dos pais',
                'Dados do documento: Livro, Folha, Termo (se disponível)',
                'Opções: Certificado eletrônico (email) ou físico (correios/retirada)',
                'Prazo oficial: 1-2 dias úteis para emissão',
                'Pagamento: PIX, boleto ou cartão de crédito',
                'Primeira via é GRATUITA por lei (Lei 9.534/97)'
              ],
              checklistItems: ['Solicitação online realizada', 'Pagamento confirmado', 'Protocolo salvo', 'Prazo anotado']
            },
            {
              id: 4,
              title: 'Busca nos Cartórios (alternativa)',
              description: 'Localizar o cartório responsável caso não seja possível online',
              requiredDocuments: ['Dados coletados na etapa 1'],
              tips: ['Verificar se a cidade mudou de nome', 'Confirmar horário de funcionamento', 'Verificar taxas atuais'],
              checklistItems: ['Cartório localizado', 'Solicitação enviada', 'Prazo de entrega confirmado', 'Taxa paga']
            },
            {
              id: 5,
              title: 'Acompanhamento',
              description: 'Monitorar o andamento da solicitação',
              requiredDocuments: ['Protocolo de solicitação'],
              tips: ['Verificar email para atualizações', 'Entrar em contato se houver atraso', 'Acompanhar status online'],
              checklistItems: ['Status verificado diariamente', 'Cliente informado sobre andamento', 'Prazos monitorados']
            },
            {
              id: 6,
              title: 'Controle de Qualidade',
              description: 'Verificar se a certidão está correta antes da entrega',
              requiredDocuments: ['Certidão recebida'],
              tips: ['Conferir todos os dados', 'Verificar assinatura e carimbo digital', 'Confirmar validade jurídica'],
              checklistItems: ['Dados conferidos', 'Assinatura/carimbo verificado', 'Validade confirmada', 'QR Code testado (se aplicável)']
            },
            {
              id: 7,
              title: 'Entrega ao Cliente',
              description: 'Enviar a certidão para o cliente',
              requiredDocuments: ['Certidão aprovada no controle de qualidade'],
              tips: ['Enviar por email seguro', 'Explicar sobre validade', 'Orientar sobre uso'],
              checklistItems: ['PDF enviado por email', 'Cliente orientado sobre uso', 'Confirmação de recebimento', 'Processo finalizado']
            }
          ],
          commonIssues: [
            {
              issue: 'Cliente não lembra o cartório de nascimento',
              solution: 'Usar Sistema Nacional de Busca do Portal registrocivil.org.br ou consultar ARPEN do estado'
            },
            {
              issue: 'Certidão não encontrada no portal nacional',
              solution: 'Verificar ARPEN estadual específico (SP, RJ, MG) ou tentar variações do nome dos pais'
            },
            {
              issue: 'Sistema online indisponível',
              solution: 'Tentar portal estadual (ARPEN-SP, ARPEN-RJ) ou serviços privados como backup'
            },
            {
              issue: 'Dados divergentes ou grafia incorreta',
              solution: 'Usar exatamente como consta no documento original, solicitar retificação se necessário'
            },
            {
              issue: 'Cliente não tem dados do documento (Livro/Folha/Termo)',
              solution: 'Busca é possível apenas com dados pessoais no portal nacional'
            },
            {
              issue: 'Nascimento muito antigo (antes da informatização)',
              solution: 'Contatar cartório do local de nascimento diretamente por telefone'
            }
          ],
          qualityChecklist: [
            'Nome completo está correto e sem abreviações',
            'Data de nascimento confere exatamente',
            'Nomes dos pais estão corretos e completos',
            'Local de nascimento está preciso',
            'Assinatura digital ou física está presente',
            'Carimbo/selo oficial está legível',
            'Data de emissão é recente (menos de 90 dias)',
            'QR Code funciona (se aplicável)',
            'Não há rasuras ou correções',
            'Papel com marca d\'água (via física)'
          ]
        },
        {
          id: 'proc-002',
          serviceType: 'certidoes',
          serviceName: 'Certidão de Casamento - Segunda Via',
          category: 'Documentos Civis',
          description: 'Procedimento para obter segunda via de certidão de casamento',
          estimatedDuration: '1-3 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Coleta de Dados dos Cônjuges',
              description: 'Reunir informações completas do casal',
              requiredDocuments: ['CPF dos cônjuges', 'Nomes completos', 'Data do casamento', 'Local do casamento'],
              tips: ['Confirmar nomes de solteiro', 'Verificar se houve mudança de sobrenome', 'Data exata do casamento'],
              checklistItems: ['Dados dos cônjuges conferidos', 'Data do casamento confirmada', 'Local do casamento verificado']
            },
            {
              id: 2,
              title: 'Busca Online - Portal de Certidões',
              description: 'Verificar disponibilidade online',
              requiredDocuments: ['Dados coletados', 'CPF', 'Cartão para pagamento'],
              tips: ['www.cartorio24horas.com.br', 'Portal do estado específico', 'Verificar se o cartório está no sistema'],
              checklistItems: ['Cartório encontrado online', 'Dados conferidos', 'Pagamento realizado']
            },
            {
              id: 3,
              title: 'Controle de Qualidade',
              description: 'Verificar dados da certidão emitida',
              requiredDocuments: ['Certidão recebida'],
              tips: ['Conferir nomes dos cônjuges', 'Verificar data', 'Confirmar regime de bens'],
              checklistItems: ['Nomes corretos', 'Data confere', 'Regime de bens correto', 'Assinatura presente']
            }
          ],
          commonIssues: [
            {
              issue: 'Cartório não encontrado online',
              solution: 'Contatar cartório diretamente ou verificar mudanças administrativas'
            },
            {
              issue: 'Dados divergentes após mudança de nome',
              solution: 'Usar nome de solteiro para busca inicial'
            }
          ],
          qualityChecklist: [
            'Nomes dos cônjuges corretos',
            'Data do casamento correta',
            'Regime de bens especificado',
            'Local do casamento correto',
            'Assinatura oficial presente'
          ]
        },
        {
          id: 'proc-003',
          serviceType: 'certidoes',
          serviceName: 'Certidão de Óbito - Segunda Via',
          category: 'Documentos Civis',
          description: 'Procedimento para obter segunda via de certidão de óbito',
          estimatedDuration: '1-3 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Coleta de Dados do Falecido',
              description: 'Reunir informações necessárias',
              requiredDocuments: ['Nome completo do falecido', 'Data do óbito', 'Local do óbito', 'CPF (se disponível)'],
              tips: ['Confirmar grafia exata do nome', 'Data precisa do óbito', 'Hospital ou local específico'],
              checklistItems: ['Nome completo conferido', 'Data do óbito confirmada', 'Local do óbito verificado']
            },
            {
              id: 2,
              title: 'Verificação de Legitimidade',
              description: 'Confirmar quem pode solicitar',
              requiredDocuments: ['Parentesco comprovado', 'RG do solicitante', 'Procuração (se aplicável)'],
              tips: ['Cônjuge, filhos, pais podem solicitar', 'Outros parentes precisam de procuração', 'Advogados com procuração específica'],
              checklistItems: ['Legitimidade confirmada', 'Documentos do solicitante verificados']
            }
          ],
          commonIssues: [
            {
              issue: 'Óbito muito antigo não encontrado online',
              solution: 'Contatar cartório do local do óbito diretamente'
            }
          ],
          qualityChecklist: [
            'Nome do falecido correto',
            'Data do óbito correta',
            'Local do óbito correto',
            'Causa do óbito (se requerida)'
          ]
        },
        {
          id: 'proc-004',
          serviceType: 'traducao',
          serviceName: 'Tradução Juramentada',
          category: 'Traduções Oficiais',
          description: 'Procedimento para tradução juramentada de documentos para uso oficial',
          estimatedDuration: '3-7 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Análise do Documento',
              description: 'Avaliar o documento e definir tipo de tradução necessária',
              requiredDocuments: ['Documento original (scan em alta qualidade)', 'Finalidade da tradução'],
              tips: ['Verificar idioma de origem', 'Identificar tipo de documento', 'Confirmar país de destino'],
              checklistItems: ['Idioma identificado', 'Tipo de documento classificado', 'Finalidade confirmada', 'Tradutor juramentado selecionado']
            },
            {
              id: 2,
              title: 'Orçamento e Aprovação',
              description: 'Calcular custos e obter aprovação do cliente',
              requiredDocuments: ['Documento analisado', 'Tabela de preços atualizada'],
              tips: ['Contar páginas/laudas', 'Verificar complexidade técnica', 'Considerar urgência'],
              checklistItems: ['Orçamento calculado', 'Cliente aprovou', 'Prazo acordado', 'Forma de pagamento definida']
            },
            {
              id: 3,
              title: 'Tradução',
              description: 'Realizar a tradução juramentada do documento',
              requiredDocuments: ['Documento original', 'Dados do cliente', 'Aprovação do orçamento'],
              tips: ['Manter fidelidade absoluta ao original', 'Usar terminologia jurídica adequada', 'Incluir TODAS as informações'],
              checklistItems: ['Tradução concluída', 'Terminologia verificada', 'Formatação adequada', 'Revisão feita']
            },
            {
              id: 4,
              title: 'Revisão e Validação',
              description: 'Revisar a tradução e validar com o original',
              requiredDocuments: ['Tradução finalizada', 'Documento original'],
              tips: ['Conferir todos os dados', 'Verificar numeração de páginas', 'Confirmar assinatura do tradutor'],
              checklistItems: ['Dados conferidos palavra por palavra', 'Páginas numeradas', 'Carimbo aplicado', 'Assinatura do tradutor']
            },
            {
              id: 5,
              title: 'Entrega',
              description: 'Entregar tradução ao cliente',
              requiredDocuments: ['Tradução aprovada na revisão'],
              tips: ['Enviar via segura', 'Explicar validade internacional', 'Fornecer instruções de uso'],
              checklistItems: ['Documento enviado', 'Cliente orientado sobre uso', 'Comprovante de entrega', 'Feedback coletado']
            }
          ],
          commonIssues: [
            {
              issue: 'Documento ilegível ou com má qualidade',
              solution: 'Solicitar nova digitalização em alta resolução (mínimo 300 DPI) ou documento físico original'
            },
            {
              issue: 'Documento em idioma raro ou técnico',
              solution: 'Buscar tradutor especializado na área específica ou idioma'
            },
            {
              issue: 'Prazo muito curto',
              solution: 'Verificar disponibilidade para trabalho urgente com taxa adicional'
            },
            {
              issue: 'Cliente questiona tradução',
              solution: 'Explicar fidelidade obrigatória ao original e mostrar correspondência termo a termo'
            }
          ],
          qualityChecklist: [
            'Tradução 100% fiel ao documento original',
            'Terminologia jurídica adequada ao país de destino',
            'Assinatura do tradutor juramentado presente',
            'Carimbo oficial legível e correto',
            'Páginas numeradas sequencialmente',
            'Dados do cliente corretos no cabeçalho',
            'Data da tradução presente',
            'Nenhuma informação omitida',
            'Formatação profissional',
            'Papel timbrado (se requerido)'
          ]
        },
        {
          id: 'proc-005',
          serviceType: 'apostilamento',
          serviceName: 'Apostilamento de Haia',
          category: 'Legalização Internacional',
          description: 'Procedimento para apostilar documentos para uso em países signatários da Convenção de Haia',
          estimatedDuration: '2-5 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Verificação do País de Destino',
              description: 'Confirmar se o país aceita apostilamento',
              requiredDocuments: ['Documento a ser apostilado', 'País de destino'],
              tips: ['Verificar lista de países signatários da Convenção de Haia', 'Alguns países ainda exigem consulado'],
              checklistItems: ['País é signatário da Convenção confirmado', 'Tipo de documento aceito verificado']
            },
            {
              id: 2,
              title: 'Preparação do Documento',
              description: 'Verificar se o documento está apto para apostilamento',
              requiredDocuments: ['Documento original', 'Tradução (se necessária)'],
              tips: ['Documento deve ser original ou cópia autenticada', 'Verificar se precisa de tradução primeiro'],
              checklistItems: ['Documento original verificado', 'Autenticação confirmada (se cópia)', 'Tradução feita (se necessária)']
            },
            {
              id: 3,
              title: 'Solicitação de Apostila',
              description: 'Enviar documento para apostilamento',
              requiredDocuments: ['Documento preparado', 'Formulário de solicitação', 'Comprovante de pagamento'],
              tips: ['Usar apenas órgãos oficiais autorizados', 'No Brasil: CNJ, TJ, ou órgãos estaduais'],
              checklistItems: ['Solicitação enviada', 'Taxa paga', 'Protocolo recebido', 'Prazo anotado']
            },
            {
              id: 4,
              title: 'Acompanhamento',
              description: 'Monitorar o processo de apostilamento',
              requiredDocuments: ['Protocolo de solicitação'],
              tips: ['Verificar status online', 'Entrar em contato se houver atraso'],
              checklistItems: ['Status verificado', 'Cliente informado', 'Documento retirado/recebido']
            },
            {
              id: 5,
              title: 'Controle de Qualidade',
              description: 'Verificar a apostila aplicada',
              requiredDocuments: ['Documento apostilado'],
              tips: ['Verificar se a apostila está legível', 'Confirmar dados da apostila', 'Testar QR Code se houver'],
              checklistItems: ['Apostila legível', 'Dados corretos', 'QR Code funcionando', 'Carimbo oficial presente']
            }
          ],
          commonIssues: [
            {
              issue: 'País não é signatário da Convenção',
              solution: 'Orientar cliente sobre legalização consular como alternativa'
            },
            {
              issue: 'Documento rejeitado para apostilamento',
              solution: 'Verificar se documento precisa ser autenticado ou emitido por órgão competente'
            }
          ],
          qualityChecklist: [
            'Apostila aplicada corretamente',
            'Carimbo da autoridade competente legível',
            'Dados do documento corretos na apostila',
            'Data de apostilamento presente',
            'Assinatura da autoridade presente',
            'QR Code funcionando (se aplicável)'
          ]
        },
        {
          id: 'proc-006',
          serviceType: 'visto',
          serviceName: 'Visto Americano de Turismo (B1/B2)',
          category: 'Vistos Internacionais',
          description: 'Procedimento completo para solicitação de visto americano de turismo',
          estimatedDuration: '15-30 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Preparação de Documentos',
              description: 'Reunir toda documentação necessária',
              requiredDocuments: ['Passaporte válido', 'Foto recente', 'Comprovante financeiro', 'Vínculo empregatício'],
              tips: ['Passaporte com 6+ meses de validade', 'Foto seguindo padrões específicos', 'Extratos bancários dos últimos 3 meses'],
              checklistItems: ['Passaporte válido', 'Foto padrão americano', 'Comprovantes financeiros organizados', 'Documentos de vínculo reunidos']
            },
            {
              id: 2,
              title: 'Preenchimento do DS-160',
              description: 'Completar formulário online',
              requiredDocuments: ['Todos os documentos preparados', 'Foto digital'],
              tips: ['Preencher com máxima veracidade', 'Salvar frequentemente', 'Ter todos os dados em mãos'],
              checklistItems: ['DS-160 preenchido', 'Revisão completa feita', 'Confirmação impressa', 'Código de confirmação salvo']
            },
            {
              id: 3,
              title: 'Agendamento da Entrevista',
              description: 'Agendar entrevista no consulado',
              requiredDocuments: ['DS-160 confirmado', 'Comprovante de pagamento da taxa'],
              tips: ['Pagar taxa SEVIS primeiro', 'Agendar o mais cedo possível', 'Verificar documentos necessários'],
              checklistItems: ['Taxa paga', 'Entrevista agendada', 'Confirmação impressa', 'Data anotada']
            },
            {
              id: 4,
              title: 'Preparação para Entrevista',
              description: 'Preparar cliente para a entrevista',
              requiredDocuments: ['Todos os documentos organizados'],
              tips: ['Treinar respostas', 'Organizar documentos por categoria', 'Chegar com antecedência'],
              checklistItems: ['Cliente treinado', 'Documentos organizados', 'Roteiro preparado', 'Cliente orientado']
            },
            {
              id: 5,
              title: 'Acompanhamento Pós-Entrevista',
              description: 'Acompanhar resultado da entrevista',
              requiredDocuments: ['Protocolo da entrevista'],
              tips: ['Verificar status online', 'Orientar sobre próximos passos'],
              checklistItems: ['Status verificado', 'Cliente informado do resultado', 'Passaporte devolvido (se aprovado)']
            }
          ],
          commonIssues: [
            {
              issue: 'Visto negado por vínculos insuficientes',
              solution: 'Fortalecer documentação de vínculos no Brasil e reaplicar após 6 meses'
            },
            {
              issue: 'Documentos financeiros insuficientes',
              solution: 'Apresentar extratos mais robustos, declaração de IR, ou sponsor letter'
            }
          ],
          qualityChecklist: [
            'DS-160 preenchido corretamente',
            'Taxa paga confirmada',
            'Entrevista agendada',
            'Documentos organizados',
            'Cliente preparado para entrevista'
          ]
        },
        {
          id: 'proc-007',
          serviceType: 'certidoes',
          serviceName: 'CPF - Inscrição e Segunda Via',
          category: 'Documentos Federais',
          description: 'Procedimento para inscrição no CPF ou obtenção de segunda via',
          estimatedDuration: 'Imediato a 3 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Verificação Online - Receita Federal',
              description: 'Verificar situação do CPF e possibilidade de emissão online',
              requiredDocuments: ['Documento de identidade', 'Data de nascimento'],
              tips: [
                'Portal oficial: www.receita.fazenda.gov.br',
                'Serviço: "Emitir Comprovante de Inscrição no CPF"',
                'CPF pode ser emitido gratuitamente online',
                'Para primeira inscrição, ir presencialmente aos Correios ou Caixa'
              ],
              checklistItems: ['Situação do CPF verificada', 'Portal acessado', 'Documento de identidade conferido']
            },
            {
              id: 2,
              title: 'Emissão Online (Segunda Via)',
              description: 'Emitir comprovante de inscrição no CPF via internet',
              requiredDocuments: ['CPF', 'Data de nascimento', 'Nome completo'],
              tips: [
                'Serviço gratuito da Receita Federal',
                'Disponível 24h por dia',
                'Download imediato em PDF',
                'Documento tem validade oficial'
              ],
              checklistItems: ['Dados inseridos corretamente', 'Comprovante gerado', 'PDF salvo', 'Documento verificado']
            }
          ],
          commonIssues: [
            {
              issue: 'CPF suspenso ou cancelado',
              solution: 'Regularizar situação na Receita Federal presencialmente com documentos'
            },
            {
              issue: 'Dados divergentes no sistema',
              solution: 'Atualizar dados cadastrais na Receita Federal'
            }
          ],
          qualityChecklist: [
            'CPF com 11 dígitos corretos',
            'Nome completo sem abreviações',
            'Situação regular na Receita Federal',
            'Data de nascimento correta'
          ]
        },
        {
          id: 'proc-008',
          serviceType: 'documentos',
          serviceName: 'RG - Carteira de Identidade',
          category: 'Documentos Estaduais',
          description: 'Procedimento para primeira via ou renovação da carteira de identidade',
          estimatedDuration: '7-15 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Verificação do Órgão Competente',
              description: 'Identificar órgão emissor no estado',
              requiredDocuments: ['Certidão de nascimento', 'CPF'],
              tips: [
                'Cada estado tem seu órgão: Detran, Polícia Civil, etc.',
                'Verificar postos de atendimento disponíveis',
                'Alguns estados permitem agendamento online',
                'Conferir documentos necessários no site oficial'
              ],
              checklistItems: ['Órgão emissor identificado', 'Documentos necessários listados', 'Local de atendimento definido']
            },
            {
              id: 2,
              title: 'Agendamento (se necessário)',
              description: 'Agendar atendimento no órgão competente',
              requiredDocuments: ['Dados pessoais'],
              tips: [
                'Verificar disponibilidade online',
                'Agendar com antecedência',
                'Confirmar documentos necessários',
                'Verificar taxas a serem pagas'
              ],
              checklistItems: ['Agendamento realizado', 'Data e hora confirmadas', 'Documentos organizados']
            },
            {
              id: 3,
              title: 'Atendimento Presencial',
              description: 'Comparecer ao posto para coleta de dados',
              requiredDocuments: ['Certidão de nascimento original', 'CPF', 'Comprovante de residência'],
              tips: [
                'Chegar com antecedência',
                'Levar documentos originais',
                'Foto será tirada no local',
                'Conferir dados antes de assinar'
              ],
              checklistItems: ['Documentos apresentados', 'Foto coletada', 'Dados conferidos', 'Taxa paga', 'Protocolo recebido']
            }
          ],
          commonIssues: [
            {
              issue: 'Documentos com grafia divergente',
              solution: 'Retificar certidão de nascimento primeiro ou apresentar documentos comprobatórios'
            },
            {
              issue: 'Comprovante de residência em nome de terceiros',
              solution: 'Declaração de residência com firma reconhecida'
            }
          ],
          qualityChecklist: [
            'Foto nítida e atual',
            'Dados pessoais corretos',
            'Assinatura legível',
            'Número do RG único'
          ]
        },
        {
          id: 'proc-009',
          serviceType: 'documentos',
          serviceName: 'Passaporte Brasileiro',
          category: 'Documentos Federais',
          description: 'Procedimento para emissão de passaporte brasileiro',
          estimatedDuration: '6-20 dias úteis',
          steps: [
            {
              id: 1,
              title: 'Pré-requisitos e Agendamento',
              description: 'Verificar documentos e agendar na Polícia Federal',
              requiredDocuments: ['RG', 'CPF', 'Certidão de nascimento', 'Foto 5x7 recente'],
              tips: [
                'Agendamento obrigatório: www.pf.gov.br',
                'Foto deve seguir padrões específicos ICAO',
                'Verificar endereços da Polícia Federal',
                'Taxa atual: consultar site oficial'
              ],
              checklistItems: ['Agendamento realizado na PF', 'Documentos organizados', 'Foto padrão ICAO', 'Taxa verificada']
            },
            {
              id: 2,
              title: 'Atendimento na Polícia Federal',
              description: 'Comparecer ao atendimento agendado',
              requiredDocuments: ['Todos os documentos originais', 'Comprovante de agendamento', 'Taxa paga'],
              tips: [
                'Chegar 30 minutos antes',
                'Documentos originais obrigatórios',
                'Coleta de digitais no local',
                'Conferir dados antes de confirmar'
              ],
              checklistItems: ['Documentos apresentados', 'Taxa paga', 'Digitais coletadas', 'Dados conferidos', 'Protocolo recebido']
            },
            {
              id: 3,
              title: 'Acompanhamento e Retirada',
              description: 'Acompanhar produção e retirar passaporte',
              requiredDocuments: ['Protocolo de solicitação'],
              tips: [
                'Acompanhar status pelo site da PF',
                'Prazo normal: 6 dias úteis',
                'Retirada presencial obrigatória',
                'Levar documento de identidade para retirada'
              ],
              checklistItems: ['Status acompanhado', 'Passaporte retirado', 'Dados conferidos', 'Funcionamento verificado']
            }
          ],
          commonIssues: [
            {
              issue: 'Agendamento indisponível',
              solution: 'Verificar outras unidades da PF ou aguardar abertura de novas datas'
            },
            {
              issue: 'Foto rejeitada',
              solution: 'Refazer foto seguindo exatamente padrões ICAO especificados'
            }
          ],
          qualityChecklist: [
            'Passaporte com chip funcionando',
            'Dados pessoais corretos',
            'Foto conforme padrão internacional',
            'Assinatura legível',
            'Validade de 10 anos'
          ]
        }
      ]
      setProcedures(mockProcedures)
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error)
    }
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      // Simular atualização da tarefa
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: status as any } : task
      ))
      notifySuccess('Tarefa atualizada', 'Status da tarefa foi alterado com sucesso')
    } catch (error) {
      notifyError('Erro', 'Falha ao atualizar tarefa')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const statusSteps: Record<string, number> = {
        'new': 1,
        'in_progress': 2,
        'waiting_documents': 2,
        'processing': 3,
        'quality_check': 4,
        'delivered': 5,
        'completed': 5
      }
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: status as any,
          progress: {
            ...order.progress,
            currentStep: statusSteps[status] || order.progress.currentStep,
            stepName: getStepNameByStatus(status)
          }
        } : order
      ))
      notifySuccess('Pedido atualizado', `Status alterado para: ${getStepNameByStatus(status)}`)
    } catch (error) {
      notifyError('Erro', 'Falha ao atualizar pedido')
    }
  }

  const addOrderNote = async (orderId: string, note: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          notes: [...order.notes, `${new Date().toLocaleString('pt-BR')}: ${note}`]
        } : order
      ))
      notifySuccess('Nota adicionada', 'Anotação salva com sucesso')
    } catch (error) {
      notifyError('Erro', 'Falha ao adicionar nota')
    }
  }

  const toggleChecklistItem = async (orderId: string, stepId: number, item: string, isQualityChecklist: boolean = false) => {
    try {
      setOrders(prev => prev.map(order => {
        if (order.id !== orderId || !order.procedureProgress) return order
        
        if (isQualityChecklist) {
          const currentItems = order.procedureProgress.qualityChecklistCompleted || []
          const newItems = currentItems.includes(item) 
            ? currentItems.filter(i => i !== item)
            : [...currentItems, item]
          
          return {
            ...order,
            procedureProgress: {
              ...order.procedureProgress,
              qualityChecklistCompleted: newItems
            }
          }
        } else {
          const stepItems = order.procedureProgress.completedChecklistItems[stepId] || []
          const newStepItems = stepItems.includes(item)
            ? stepItems.filter(i => i !== item)
            : [...stepItems, item]
          
          return {
            ...order,
            procedureProgress: {
              ...order.procedureProgress,
              completedChecklistItems: {
                ...order.procedureProgress.completedChecklistItems,
                [stepId]: newStepItems
              }
            }
          }
        }
      }))
      notifySuccess('Checklist atualizado', 'Item marcado com sucesso')
    } catch (error) {
      notifyError('Erro', 'Falha ao atualizar checklist')
    }
  }

  const findProcedureForOrder = (order: ServiceOrder): ServiceProcedure | null => {
    if (!order.procedureProgress) return null
    return procedures.find(p => p.id === order.procedureProgress?.procedureId) || null
  }

  const getStepNameByStatus = (status: string) => {
    const statusSteps: Record<string, string> = {
      'new': 'Pedido Recebido',
      'in_progress': 'Em Processamento',
      'waiting_documents': 'Aguardando Documentos',
      'processing': 'Processando',
      'quality_check': 'Controle de Qualidade',
      'delivered': 'Entregue',
      'completed': 'Concluído'
    }
    return statusSteps[status] || status
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Video className="h-4 w-4 text-blue-600" />
      case 'document_review': return <FileText className="h-4 w-4 text-green-600" />
      case 'follow_up': return <Phone className="h-4 w-4 text-orange-600" />
      case 'application': return <Send className="h-4 w-4 text-purple-600" />
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200'
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'in_progress': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'waiting_documents': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'processing': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'quality_check': return 'text-indigo-600 bg-indigo-50 border-indigo-200'
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200'
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'certidoes': return <FileText className="h-4 w-4 text-blue-600" />
      case 'traducao': return <Globe className="h-4 w-4 text-green-600" />
      case 'apostilamento': return <Award className="h-4 w-4 text-purple-600" />
      case 'visto': return <Flag className="h-4 w-4 text-orange-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'Hoje'
    if (diffDays <= 7) return `${diffDays} dias`
    return date.toLocaleDateString('pt-BR')
  }

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesPriority && matchesStatus && matchesSearch
  })

  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderFilterStatus === 'all' || order.status === orderFilterStatus
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority
    const matchesSearch = searchTerm === '' || 
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const myClients = clients.filter(client => client.assignedConsultant === 'current_consultant')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Carregando workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do Workspace */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Workspace do Consultor</h2>
            <p className="text-gray-600">Gerencie seus clientes, tarefas e performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Agendar Consulta</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'orders', label: 'Pedidos', icon: FileText },
            { id: 'tasks', label: 'Tarefas', icon: CheckCircle },
            { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen },
            { id: 'clients', label: 'Meus Clientes', icon: Users },
            { id: 'calendar', label: 'Agenda', icon: Calendar },
            { id: 'analytics', label: 'Performance', icon: TrendingUp }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedView === view.id 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <view.icon className="h-4 w-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && consultantStats && (
        <div className="space-y-6">
          {/* Performance Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-blue-600">{consultantStats.activeClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{consultantStats.completedThisMonth}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(consultantStats.revenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-yellow-600">{consultantStats.satisfaction}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resp. Média</p>
                  <p className="text-2xl font-bold text-orange-600">{consultantStats.responseTime}h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tarefas Urgentes */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tarefas Urgentes</h3>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              
              <div className="space-y-3">
                {filteredTasks.filter(task => task.priority === 'high' || task.status === 'overdue').slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTaskIcon(task.type)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.client.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clientes Recentes */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Clientes Recentes</h3>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="space-y-3">
                {myClients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(client.priority)}`}>
                        {client.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {selectedView === 'tasks' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Todas Prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Todos Status</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="overdue">Atrasada</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{filteredTasks.length} tarefas</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTaskIcon(task.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Cliente: {task.client.name}</span>
                          <span className="text-sm text-gray-500">Duração: {task.estimatedDuration}min</span>
                          <span className="text-sm text-gray-500">Prazo: {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma tarefa encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {selectedView === 'orders' && (
        <div className="space-y-6">
          {/* Filters and View Controls */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Todos Status</option>
                  <option value="new">Novo</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="waiting_documents">Aguardando Docs</option>
                  <option value="processing">Processando</option>
                  <option value="quality_check">Controle Qualidade</option>
                  <option value="delivered">Entregue</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Todas Prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{filteredOrders.length} pedidos</span>
                
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setOrderViewMode('grid')}
                    className={`p-2 rounded-l-lg ${orderViewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    title="Visualização em grade"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOrderViewMode('list')}
                    className={`p-2 rounded-r-lg border-l border-gray-300 ${orderViewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    title="Visualização em lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  onClick={fetchOrders}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Atualizar"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Orders Display */}
          {orderViewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-all">
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getServiceIcon(order.serviceType)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">{order.serviceName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getOrderStatusColor(order.status)}`}>
                          {getStepNameByStatus(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {order.client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.client.name}</p>
                        <p className="text-xs text-gray-500">{order.client.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progresso</span>
                      <span className="text-sm text-gray-500">{order.progress.currentStep}/{order.progress.totalSteps}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(order.progress.currentStep / order.progress.totalSteps) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{order.progress.stepName}</p>
                  </div>

                  {/* Order Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Prazo:</span>
                      <span className="font-medium text-gray-900">{order.dueDate ? formatDate(order.dueDate) : 'Sem prazo'}</span>
                    </div>
                    {order.deliveryInfo?.trackingCode && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rastreamento:</span>
                        <span className="font-medium text-blue-600">{order.deliveryInfo.trackingCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetail(true)
                        }}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_progress')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Marcar como em andamento"
                        >
                          <PlayCircle className="h-4 w-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Marcar como concluído"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          onClick={() => setShowAddNote(order.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Adicionar nota"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getServiceIcon(order.serviceType)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(order.priority)}`}>
                              {order.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getOrderStatusColor(order.status)}`}>
                              {getStepNameByStatus(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{order.serviceName}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>Cliente: {order.client.name}</span>
                            <span>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}</span>
                            <span>Prazo: {order.dueDate ? formatDate(order.dueDate) : 'Sem prazo'}</span>
                            <span>Progresso: {order.progress.currentStep}/{order.progress.totalSteps}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDetail(true)
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_progress')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Marcar como em andamento"
                        >
                          <PlayCircle className="h-4 w-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Marcar como concluído"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          onClick={() => setShowAddNote(order.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Adicionar nota"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {filteredOrders.length === 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-12">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500">Os pedidos atribuídos a você aparecerão aqui</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Knowledge Base Tab */}
      {selectedView === 'knowledge' && (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Base de Conhecimento</h3>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar procedimentos..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {procedures.map((procedure) => (
                <div key={procedure.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                     onClick={() => setSelectedProcedure(procedure)}>
                  <div className="flex items-start space-x-3">
                    {getServiceIcon(procedure.serviceType)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{procedure.serviceName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{procedure.category}</p>
                      <p className="text-xs text-gray-500 mt-2">{procedure.description}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{procedure.estimatedDuration}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{procedure.steps.length} etapas</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Procedure Detail Modal */}
          {selectedProcedure && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(selectedProcedure.serviceType)}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedProcedure.serviceName}</h2>
                        <p className="text-gray-600">{selectedProcedure.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProcedure(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-600">{selectedProcedure.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">⏱️ Tempo estimado: {selectedProcedure.estimatedDuration}</span>
                      <span className="text-sm text-gray-500">📋 {selectedProcedure.steps.length} etapas</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Passo a Passo</h3>
                    <div className="space-y-4">
                      {selectedProcedure.steps.map((step) => (
                        <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {step.id}. {step.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          
                          {step.requiredDocuments.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">📄 Documentos Necessários:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.requiredDocuments.map((doc, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.tips.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">💡 Dicas:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.checklistItems.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">✅ Checklist:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.checklistItems.map((item, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Issues */}
                  {selectedProcedure.commonIssues.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">❗ Problemas Comuns e Soluções</h3>
                      <div className="space-y-3">
                        {selectedProcedure.commonIssues.map((issue, idx) => (
                          <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-900 mb-2">Problema:</h4>
                            <p className="text-red-700 mb-2">{issue.issue}</p>
                            <h4 className="font-medium text-red-900 mb-2">Solução:</h4>
                            <p className="text-red-700">{issue.solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quality Checklist */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">🔍 Checklist de Qualidade</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedProcedure.qualityChecklist.map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-green-700">
                            <input type="checkbox" className="rounded border-green-300" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other tabs content */}
      {!['overview', 'tasks', 'orders', 'knowledge'].includes(selectedView) && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-12">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-500">Esta seção será implementada em breve</p>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getServiceIcon(selectedOrder.serviceType)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                    <p className="text-gray-600">{selectedOrder.serviceName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowOrderDetail(false)
                    setSelectedOrder(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Status do Pedido</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status Atual:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getOrderStatusColor(selectedOrder.status)}`}>
                        {getStepNameByStatus(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prioridade:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedOrder.priority)}`}>
                        {selectedOrder.priority}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progresso:</span>
                        <span className="text-sm text-gray-500">{selectedOrder.progress.currentStep}/{selectedOrder.progress.totalSteps}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedOrder.progress.currentStep / selectedOrder.progress.totalSteps) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{selectedOrder.progress.stepName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {selectedOrder.client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedOrder.client.name}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.client.email}</p>
                        {selectedOrder.client.phone && (
                          <p className="text-sm text-gray-500">{selectedOrder.client.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Pedido</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-medium text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data do Pedido:</span>
                    <span className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prazo:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.dueDate ? formatDate(selectedOrder.dueDate) : 'Sem prazo'}</span>
                  </div>
                  {selectedOrder.deliveryInfo?.trackingCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código de Rastreamento:</span>
                      <span className="font-medium text-blue-600">{selectedOrder.deliveryInfo.trackingCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documentos e Requisitos</h3>
                <div className="space-y-2">
                  {selectedOrder.requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          req.status === 'approved' ? 'bg-green-500' :
                          req.status === 'received' ? 'bg-blue-500' :
                          req.status === 'rejected' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`} />
                        <span className="font-medium text-gray-900">{req.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          req.status === 'approved' ? 'bg-green-100 text-green-700' :
                          req.status === 'received' ? 'bg-blue-100 text-blue-700' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {req.status}
                        </span>
                        {req.notes && <p className="text-xs text-gray-500 mt-1">{req.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Anotações</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure Progress */}
              {selectedOrder.procedureProgress && findProcedureForOrder(selectedOrder) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🔄 Progresso do Procedimento</h3>
                  {(() => {
                    const procedure = findProcedureForOrder(selectedOrder)!
                    const progress = selectedOrder.procedureProgress!
                    
                    return (
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">{procedure.serviceName}</h4>
                          <p className="text-sm text-blue-700 mb-3">{procedure.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-600">
                            <span>⏱️ {procedure.estimatedDuration}</span>
                            <span>📋 {procedure.steps.length} etapas</span>
                            <span>✅ Etapa atual: {progress.currentStepId}/{procedure.steps.length}</span>
                          </div>
                        </div>

                        {/* Steps Progress */}
                        <div className="space-y-3">
                          {procedure.steps.map((step) => {
                            const isCurrentStep = step.id === progress.currentStepId
                            const isCompleted = step.id < progress.currentStepId
                            const completedItems = progress.completedChecklistItems[step.id] || []
                            const totalItems = step.checklistItems.length
                            const stepProgress = totalItems > 0 ? (completedItems.length / totalItems) * 100 : 0

                            return (
                              <div key={step.id} className={`border rounded-lg p-4 ${
                                isCurrentStep ? 'border-blue-500 bg-blue-50' : 
                                isCompleted ? 'border-green-500 bg-green-50' : 
                                'border-gray-200 bg-gray-50'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className={`font-medium ${
                                    isCurrentStep ? 'text-blue-900' : 
                                    isCompleted ? 'text-green-900' : 
                                    'text-gray-700'
                                  }`}>
                                    {step.id}. {step.title}
                                    {isCurrentStep && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">ATUAL</span>}
                                    {isCompleted && <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">CONCLUÍDO</span>}
                                  </h5>
                                  {totalItems > 0 && (
                                    <span className="text-xs text-gray-600">
                                      {completedItems.length}/{totalItems} itens
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                                {/* Progress Bar */}
                                {totalItems > 0 && (
                                  <div className="mb-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                          isCompleted ? 'bg-green-500' : 
                                          isCurrentStep ? 'bg-blue-500' : 
                                          'bg-gray-400'
                                        }`}
                                        style={{ width: `${stepProgress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Documents Required */}
                                {step.requiredDocuments.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-gray-700 mb-1">📄 Documentos Necessários:</h6>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      {step.requiredDocuments.map((doc, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                          <span>{doc}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tips */}
                                {step.tips.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-gray-700 mb-1">💡 Dicas:</h6>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      {step.tips.map((tip, idx) => (
                                        <div key={idx} className="flex items-start space-x-2">
                                          <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                                          <span>{tip}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Interactive Checklist */}
                                {step.checklistItems.length > 0 && (isCurrentStep || isCompleted) && (
                                  <div>
                                    <h6 className="text-xs font-medium text-gray-700 mb-2">✅ Checklist Interativo:</h6>
                                    <div className="space-y-1">
                                      {step.checklistItems.map((item, idx) => {
                                        const isItemCompleted = completedItems.includes(item)
                                        return (
                                          <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                            <input 
                                              type="checkbox" 
                                              checked={isItemCompleted}
                                              onChange={() => toggleChecklistItem(selectedOrder.id, step.id, item)}
                                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className={`text-xs ${isItemCompleted ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                              {item}
                                            </span>
                                          </label>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Quality Checklist */}
                        {procedure.qualityChecklist.length > 0 && (
                          <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                            <h5 className="font-medium text-green-900 mb-3">🔍 Checklist de Qualidade Final</h5>
                            <div className="space-y-2">
                              {procedure.qualityChecklist.map((item, idx) => {
                                const isCompleted = progress.qualityChecklistCompleted.includes(item)
                                return (
                                  <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={isCompleted}
                                      onChange={() => toggleChecklistItem(selectedOrder.id, 0, item, true)}
                                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className={`text-sm ${isCompleted ? 'text-green-800 line-through' : 'text-green-700'}`}>
                                      {item}
                                    </span>
                                  </label>
                                )
                              })}
                            </div>
                            <div className="mt-3 text-xs text-green-600">
                              ✅ {progress.qualityChecklistCompleted.length}/{procedure.qualityChecklist.length} itens concluídos
                            </div>
                          </div>
                        )}

                        {/* Common Issues */}
                        {procedure.commonIssues.length > 0 && (
                          <div className="border border-orange-300 rounded-lg p-4 bg-orange-50">
                            <h5 className="font-medium text-orange-900 mb-3">❗ Problemas Comuns e Soluções</h5>
                            <div className="space-y-3">
                              {procedure.commonIssues.map((issue, idx) => (
                                <div key={idx} className="text-sm">
                                  <div className="font-medium text-orange-800 mb-1">
                                    🔴 {issue.issue}
                                  </div>
                                  <div className="text-orange-700 pl-4">
                                    💡 {issue.solution}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ações Rápidas:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'in_progress')}
                    className="flex items-center space-x-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Iniciar</span>
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Concluir</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNote(selectedOrder.id)
                      setShowOrderDetail(false)
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Adicionar Nota</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Adicionar Nota</h3>
                <button
                  onClick={() => {
                    setShowAddNote(null)
                    setNewNote('')
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nota:
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Digite sua anotação..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddNote(null)
                      setNewNote('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (newNote.trim() && showAddNote) {
                        addOrderNote(showAddNote, newNote.trim())
                        setShowAddNote(null)
                        setNewNote('')
                      }
                    }}
                    disabled={!newNote.trim()}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nova Tarefa</h3>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Tarefa:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Revisar documentos do cliente..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Selecione um cliente...</option>
                    {myClients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Tarefa:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="consultation">Consulta</option>
                    <option value="document_review">Revisão de Documentos</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="application">Aplicação</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Vencimento:
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      notifySuccess('Tarefa criada', 'Nova tarefa adicionada com sucesso')
                      setShowNewTaskModal(false)
                    }}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar Tarefa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Consultation Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agendar Consulta</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Selecione um cliente...</option>
                    {myClients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Consulta:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="initial">Consulta Inicial</option>
                    <option value="followup">Follow-up</option>
                    <option value="document_review">Revisão de Documentos</option>
                    <option value="interview_prep">Preparação para Entrevista</option>
                    <option value="strategy">Consulta de Estratégia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data e Hora:
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="30">30 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="90">1h 30min</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidade:
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="online">Online (Google Meet/Zoom)</option>
                    <option value="phone">Telefone</option>
                    <option value="inperson">Presencial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações:
                  </label>
                  <textarea
                    placeholder="Tópicos a discutir, documentos necessários..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      notifySuccess('Consulta agendada', 'Consulta agendada com sucesso')
                      setShowScheduleModal(false)
                    }}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Agendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}