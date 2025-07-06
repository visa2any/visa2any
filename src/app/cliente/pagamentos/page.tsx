'use client'

import { useState, useEffect } from 'react'
import ClientHeader from '@/components/ClientHeader'
import { 
  CreditCard, DollarSign, Calendar, CheckCircle, Clock, 
  AlertTriangle, Download, Receipt, Shield, Zap, Crown
} from 'lucide-react'

interface Payment {
  id: string
  description: string
  amount: number
  currency: string
  date: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  method: string
  invoice_url?: string
  service_type: 'consultation' | 'document_review' | 'premium_plan' | 'government_fee'
}

interface Package {
  id: string
  package: string
  price: number
  billing_cycle: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  next_billing: string
  features: string[]
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

export default function PagamentosPage() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [packageDataData, setPackageData] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'payments' | 'subscription' | 'plans'>('payments')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      // Load customer data
      const storedCustomer = localStorage.getItem('customer')
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

      // Load payments

      setPayments([
        {
          id: '1',
          description: 'Plano Premium - Janeiro 2024',
          amount: 599,
          currency: 'BRL',
          date: '2024-01-15',
          status: 'paid',
          method: 'Cartão de Crédito **** 1234',
          invoice_url: '#',
          service_type: 'premium_plan'
        },
        {
          id: '2',
          description: 'Consultoria Especializada - Preparação Entrevista',
          amount: 299,
          currency: 'BRL',
          date: '2024-01-10',
          status: 'paid',
          method: 'PIX',
          invoice_url: '#',
          service_type: 'consultation'
        },
        {
          id: '3',
          description: 'Taxa Consular - Visto Americano',
          amount: 185,
          currency: 'USD',
          date: '2024-01-08',
          status: 'pending',
          method: 'Cartão de Crédito **** 1234',
          service_type: 'government_fee'
        },
        {
          id: '4',
          description: 'Revisão de Documentos IA',
          amount: 149,
          currency: 'BRL',
          date: '2024-01-05',
          status: 'paid',
          method: 'Boleto Bancário',
          invoice_url: '#',
          service_type: 'document_review'
        }
      ])

      // Load packageData

      setPackageData({
        id: 'sub_1',
        package: 'Premium',
        price: 599,
        billing_cycle: 'monthly',
        status: 'active',
        next_billing: '2024-02-15',
        features: [
          'Consultoria 60min/mês',
          'Revisão ilimitada de documentos',
          'Acompanhamento personalizado',
          'Suporte prioritário',
          'Análise IA avançada'
        ]
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      case 'refunded': return <Receipt className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)} USD`
    }
    return `R$ ${amount.toFixed(2)}`
  }

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.currency === 'USD' ? p.amount * 5.2 : p.amount), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm">Carregando pagamentos...</p>
        </div>
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-red-500 mx-auto mb-3" />
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Pagamentos e Pacotes
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus pagamentos, faturas e assinatura
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalPaid.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plano Atual</p>
                <p className="text-2xl font-bold text-blue-600">Premium</p>
              </div>
              <Crown className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximo Pagamento</p>
                <p className="text-2xl font-bold text-purple-600">25 dias</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('payments')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Histórico de Pagamentos
              </button>
              <button
                onClick={() => setSelectedTab('subscription')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'subscription'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Minha Assinatura
              </button>
              <button
                onClick={() => setSelectedTab('plans')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  selectedTab === 'plans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pacotes Disponíveis
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Histórico de Transações</h3>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                    <Download className="h-4 w-4" />
                    Exportar Relatório
                  </button>
                </div>

                {payments.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{payment.description}</h4>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              {payment.status === 'paid' ? 'Pago' :
                               payment.status === 'pending' ? 'Pendente' :
                               payment.status === 'failed' ? 'Falhou' : 'Reembolsado'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-2">
                            <span>{formatCurrency(payment.amount, payment.currency)}</span>
                            <span>{payment.method}</span>
                            <span>{new Date(payment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {payment.invoice_url && payment.status === 'paid' && (
                          <button
                            onClick={() => window.open(payment.invoice_url, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Download Comprovante"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        
                        {payment.status === 'pending' && (
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            Pagar Agora
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'subscription' && packageDataData && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Plano {packageDataData.package}</h3>
                        <p className="text-blue-600">
                          {formatCurrency(packageDataData.price, 'BRL')} / {packageDataData.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      packageDataData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {packageDataData.status === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recursos Incluídos:</h4>
                      <ul className="space-y-2">
                        {packageDataData.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Informações da Assinatura:</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Próximo pagamento:</span>
                          <span className="font-medium">{new Date(packageDataData.next_billing).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ciclo de cobrança:</span>
                          <span className="font-medium">{packageDataData.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Método de pagamento:</span>
                          <span className="font-medium">Cartão **** 1234</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Alterar Pacote
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancelar Assinatura
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Atualizar Pagamento
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'plans' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Escolha o Pacote Ideal</h3>
                  <p className="text-gray-600">Upgrade ou downgrade a qualquer momento</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pacote Básico */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Básico</h4>
                      <div className="text-3xl font-bold text-gray-900 mb-1">R$ 299</div>
                      <p className="text-gray-600 text-sm">por mês</p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Análise IA básica
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Consultoria 30min/mês
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Lista de documentos
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Suporte por email
                      </li>
                    </ul>
                    
                    <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      Pacote Atual
                    </button>
                  </div>

                  {/* Pacote Premium */}
                  <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Mais Popular
                      </span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Premium</h4>
                      <div className="text-3xl font-bold text-blue-600 mb-1">R$ 599</div>
                      <p className="text-gray-600 text-sm">por mês</p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Análise IA avançada
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Consultoria 60min/mês
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Revisão ilimitada documentos
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Acompanhamento personalizado
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Suporte prioritário
                      </li>
                    </ul>
                    
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Pacote Ativo
                    </button>
                  </div>

                  {/* Pacote VIP */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">VIP</h4>
                      <div className="text-3xl font-bold text-purple-600 mb-1">R$ 1.299</div>
                      <p className="text-gray-600 text-sm">por mês</p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Consultor dedicado
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Consultoria ilimitada
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Preenchimento formulários
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Garantia de reembolso
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Suporte 24/7
                      </li>
                    </ul>
                    
                    <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}