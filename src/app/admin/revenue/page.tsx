'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  LineChart,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react'

interface RevenueData {
  totalRevenue: number
  monthlyGrowth: number
  totalClients: number
  conversionRate: number
  averageTicket: number
  mrr: number
  churnRate: number
  ltv: number
  metrics: {
    leads: number
    qualified: number
    consultations: number
    sales: number
    revenue: number
  }
  topProducts: Array<{
    name: string
    revenue: number
    quantity: number
    growth: number
  }>
  revenueByCountry: Array<{
    country: string
    revenue: number
    clients: number
    avgTicket: number
  }>
  conversionFunnel: Array<{
    stage: string
    count: number
    rate: number
  }>
  monthlyData: Array<{
    month: string
    revenue: number
    clients: number
    mrr: number
  }>
}

export default function RevenueOperationsPage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchRevenueData()
  }, [timeRange])

  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      // Simulated data - in production this would come from API
      const mockData: RevenueData = {
        totalRevenue: 542800,
        monthlyGrowth: 23.5,
        totalClients: 1247,
        conversionRate: 18.2,
        averageTicket: 435,
        mrr: 48300,
        churnRate: 3.2,
        ltv: 2850,
        metrics: {
          leads: 2145,
          qualified: 856,
          consultations: 423,
          sales: 187,
          revenue: 542800
        },
        topProducts: [
          { name: "Consultoria VIP", revenue: 234500, quantity: 94, growth: 34.2 },
          { name: "Relatório Premium", revenue: 156200, quantity: 1610, growth: 18.7 },
          { name: "Consultoria Express", revenue: 98400, quantity: 331, growth: 12.3 },
          { name: "Análise Gratuita", revenue: 53700, quantity: 537, growth: 45.1 }
        ],
        revenueByCountry: [
          { country: "Estados Unidos", revenue: 187650, clients: 234, avgTicket: 802 },
          { country: "Canadá", revenue: 143200, clients: 312, avgTicket: 459 },
          { country: "Portugal", revenue: 98750, clients: 287, avgTicket: 344 },
          { country: "Austrália", revenue: 67800, clients: 156, avgTicket: 435 },
          { country: "Alemanha", revenue: 45400, clients: 189, avgTicket: 240 }
        ],
        conversionFunnel: [
          { stage: "Visitantes", count: 12450, rate: 100 },
          { stage: "Leads", count: 2145, rate: 17.2 },
          { stage: "Qualificados", count: 856, rate: 39.9 },
          { stage: "Consultorias", count: 423, rate: 49.4 },
          { stage: "Vendas", count: 187, rate: 44.2 }
        ],
        monthlyData: [
          { month: "Out", revenue: 45200, clients: 89, mrr: 38400 },
          { month: "Nov", revenue: 52300, clients: 105, mrr: 42100 },
          { month: "Dez", revenue: 61800, clients: 127, mrr: 48300 }
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Erro ao buscar dados de revenue:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados de revenue...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erro ao carregar dados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Operations</h1>
            <p className="text-gray-600 mt-1">Dashboard completo de receita e operações</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
              <option value="1y">1 ano</option>
            </select>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            
            <button 
              onClick={fetchRevenueData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+{formatPercentage(data.monthlyGrowth)}</span>
                <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.mrr)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+15.2%</span>
                <span className="text-sm text-gray-500 ml-1">crescimento</span>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalClients)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+8.4%</span>
                <span className="text-sm text-gray-500 ml-1">novos clientes</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversão</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.conversionRate)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">+2.1%</span>
                <span className="text-sm text-gray-500 ml-1">melhoria</span>
              </div>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'funnel', label: 'Funil', icon: BarChart3 },
              { id: 'products', label: 'Produtos', icon: PieChart },
              { id: 'geography', label: 'Geografia', icon: LineChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Additional KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(data.averageTicket)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">LTV</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(data.ltv)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                  <p className="text-xl font-bold text-gray-900">{formatPercentage(data.churnRate)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">CAC Payback</p>
                  <p className="text-xl font-bold text-gray-900">2.3 meses</p>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências Mensais</h3>
                <div className="space-y-4">
                  {data.monthlyData.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{month.month} 2024</p>
                          <p className="text-sm text-gray-500">{month.clients} novos clientes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(month.revenue)}</p>
                        <p className="text-sm text-gray-500">MRR: {formatCurrency(month.mrr)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Funil de Conversão</h3>
              <div className="space-y-4">
                {data.conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-gray-100' :
                          index === 1 ? 'bg-blue-100' :
                          index === 2 ? 'bg-green-100' :
                          index === 3 ? 'bg-orange-100' : 'bg-purple-100'
                        }`}>
                          {index === 0 ? <Eye className="h-6 w-6 text-gray-600" /> :
                           index === 1 ? <Users className="h-6 w-6 text-blue-600" /> :
                           index === 2 ? <CheckCircle className="h-6 w-6 text-green-600" /> :
                           index === 3 ? <Clock className="h-6 w-6 text-orange-600" /> :
                           <DollarSign className="h-6 w-6 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{stage.stage}</p>
                          <p className="text-sm text-gray-500">Taxa de conversão: {formatPercentage(stage.rate)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(stage.count)}</p>
                        <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${stage.rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance por Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.topProducts.map((product, index) => (
                  <div key={product.name} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.growth > 20 ? 'bg-green-100 text-green-800' :
                        product.growth > 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.growth > 0 ? '+' : ''}{formatPercentage(product.growth)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Receita</span>
                        <span className="font-medium">{formatCurrency(product.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantidade</span>
                        <span className="font-medium">{formatNumber(product.quantity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ticket Médio</span>
                        <span className="font-medium">{formatCurrency(product.revenue / product.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'geography' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Geográfica</h3>
              <div className="space-y-4">
                {data.revenueByCountry.map((country, index) => (
                  <div key={country.country} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-green-100' :
                          index === 1 ? 'bg-blue-100' :
                          index === 2 ? 'bg-purple-100' :
                          index === 3 ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{country.country}</p>
                          <p className="text-sm text-gray-500">{country.clients} clientes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(country.revenue)}</p>
                        <p className="text-sm text-gray-500">Ticket: {formatCurrency(country.avgTicket)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}