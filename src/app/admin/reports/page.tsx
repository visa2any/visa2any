'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  Target, 
  Award, 
  Globe,
  Filter,
  RefreshCw,
  Share2,
  PieChart,
  LineChart,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface ReportData {
  period: string
  metrics: {
    totalClients: number
    newClients: number
    clientsGrowth: number
    consultations: number
    consultationsGrowth: number
    revenue: number
    revenueGrowth: number
    conversionRate: number
    avgTicket: number
    avgProcessingTime: number
  }
  conversionFunnel: {
    leads: number
    qualified: number
    inProcess: number
    approved: number
    completed: number
  }
  clientsByCountry: Array<{
    country: string
    count: number
    percentage: number
  }>
  revenueByPeriod: Array<{
    period: string
    revenue: number
    clients: number
  }>
  topConsultants: Array<{
    name: string
    consultations: number
    revenue: number
    rating: number
  }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [reportType, setReportType] = useState('overview')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [period, reportType])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      // Simulando dados de relatório
      const mockData: ReportData = {
        period: `Últimos ${period} dias`,
        metrics: {
          totalClients: 156,
          newClients: 23,
          clientsGrowth: 12.5,
          consultations: 89,
          consultationsGrowth: 8.3,
          revenue: 425000,
          revenueGrowth: 15.2,
          conversionRate: 28.5,
          avgTicket: 2850,
          avgProcessingTime: 45
        },
        conversionFunnel: {
          leads: 156,
          qualified: 89,
          inProcess: 67,
          approved: 45,
          completed: 34
        },
        clientsByCountry: [
          { country: 'Canadá', count: 45, percentage: 28.8 },
          { country: 'Estados Unidos', count: 38, percentage: 24.4 },
          { country: 'Austrália', count: 29, percentage: 18.6 },
          { country: 'Portugal', count: 22, percentage: 14.1 },
          { country: 'Alemanha', count: 15, percentage: 9.6 },
          { country: 'Outros', count: 7, percentage: 4.5 }
        ],
        revenueByPeriod: [
          { period: 'Jan', revenue: 85000, clients: 28 },
          { period: 'Fev', revenue: 92000, clients: 31 },
          { period: 'Mar', revenue: 78000, clients: 26 },
          { period: 'Abr', revenue: 105000, clients: 35 },
          { period: 'Mai', revenue: 98000, clients: 33 },
          { period: 'Jun', revenue: 112000, clients: 38 }
        ],
        topConsultants: [
          { name: 'Ana Silva', consultations: 45, revenue: 125000, rating: 4.9 },
          { name: 'Carlos Santos', consultations: 38, revenue: 98000, rating: 4.7 },
          { name: 'Maria Costa', consultations: 32, revenue: 87000, rating: 4.8 },
          { name: 'João Oliveira', consultations: 28, revenue: 76000, rating: 4.6 }
        ]
      }
      
      setReportData(mockData)
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simular geração de relatório
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const quickActions = [
    { icon: Download, label: 'Baixar PDF', color: 'btn-primary', onClick: generateReport },
    { icon: Share2, label: 'Compartilhar', color: 'btn-secondary', onClick: () => {} },
    { icon: RefreshCw, label: 'Atualizar', color: 'btn-secondary', onClick: fetchReportData },
    { icon: Calendar, label: 'Agendar Relatório', color: 'btn-secondary', onClick: () => {} }
  ]

  if (isLoading) {
    return (
      <div className="gradient-admin min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 loading-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded w-64 loading-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-elevated p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 loading-shimmer"></div>
                  <div className="h-8 bg-gray-100 rounded w-1/2 mb-2 loading-shimmer"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3 loading-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="gradient-admin min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="card-elevated p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-readable mb-2">Erro ao carregar relatório</h3>
            <p className="text-readable-muted mb-6">Não foi possível carregar os dados do relatório</p>
            <button onClick={fetchReportData} className="btn-primary hover-lift">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </button>
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
                Relatórios e Analytics
              </h1>
              <p className="text-readable-muted">
                Análises detalhadas de desempenho, métricas e insights estratégicos
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={isGenerating}
                  className={`${action.color} hover-lift flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGenerating && action.icon === Download ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <action.icon className="h-4 w-4" />
                  )}
                  {isGenerating && action.icon === Download ? 'Gerando...' : action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-slide-in card-elevated p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[160px]"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable min-w-[200px]"
            >
              <option value="overview">Visão Geral</option>
              <option value="sales">Vendas e Revenue</option>
              <option value="clients">Análise de Clientes</option>
              <option value="consultants">Performance Consultores</option>
              <option value="conversion">Funil de Conversão</option>
            </select>

            <div className="flex items-center gap-2 text-sm text-readable-muted">
              <Clock className="h-4 w-4" />
              <span>Atualizado: {new Date().toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Novos Clientes',
              value: reportData.metrics.newClients,
              growth: reportData.metrics.clientsGrowth,
              icon: Users,
              color: 'text-blue-600',
              subtitle: `Total: ${reportData.metrics.totalClients}`
            },
            {
              title: 'Consultorias',
              value: reportData.metrics.consultations,
              growth: reportData.metrics.consultationsGrowth,
              icon: Calendar,
              color: 'text-green-600',
              subtitle: 'realizadas no período'
            },
            {
              title: 'Receita',
              value: `R$ ${(reportData.metrics.revenue / 1000).toFixed(0)}k`,
              growth: reportData.metrics.revenueGrowth,
              icon: DollarSign,
              color: 'text-purple-600',
              subtitle: `Ticket médio: R$ ${reportData.metrics.avgTicket.toLocaleString('pt-BR')}`
            },
            {
              title: 'Taxa de Conversão',
              value: `${reportData.metrics.conversionRate}%`,
              growth: null,
              icon: Target,
              color: 'text-orange-600',
              subtitle: `Tempo médio: ${reportData.metrics.avgProcessingTime} dias`
            }
          ].map((metric, index) => (
            <div key={index} className="card-elevated p-6 hover-lift animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                {metric.growth !== null && (
                  <div className={`flex items-center text-sm font-semibold ${
                    metric.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${metric.growth < 0 ? 'rotate-180' : ''}`} />
                    {metric.growth >= 0 ? '+' : ''}{metric.growth}%
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-readable mb-1">{metric.value}</p>
                <p className="text-caption font-semibold text-readable mb-1">{metric.title}</p>
                <p className="text-sm text-readable-muted">{metric.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversion Funnel */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-readable">Funil de Conversão</h3>
              <Target className="h-5 w-5 text-admin-muted" />
            </div>
            
            <div className="space-y-4">
              {[
                { stage: 'Leads', value: reportData.conversionFunnel.leads, color: 'bg-gray-400' },
                { stage: 'Qualificados', value: reportData.conversionFunnel.qualified, color: 'bg-blue-500' },
                { stage: 'Em Processo', value: reportData.conversionFunnel.inProcess, color: 'bg-yellow-500' },
                { stage: 'Aprovados', value: reportData.conversionFunnel.approved, color: 'bg-green-500' },
                { stage: 'Concluídos', value: reportData.conversionFunnel.completed, color: 'bg-emerald-500' }
              ].map((stage, index) => {
                const percentage = Math.round((stage.value / reportData.conversionFunnel.leads) * 100)
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-readable">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-readable">{stage.value}</span>
                        <span className="text-xs text-readable-muted">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${stage.color} transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Countries Distribution */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-readable">Destinos Mais Procurados</h3>
              <Globe className="h-5 w-5 text-admin-muted" />
            </div>
            
            <div className="space-y-4">
              {reportData.clientsByCountry.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-readable">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-readable min-w-[40px] text-right">
                      {country.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-readable">Evolução da Receita</h3>
            <LineChart className="h-5 w-5 text-admin-muted" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {reportData.revenueByPeriod.map((period, index) => (
              <div key={index} className="text-center p-4 rounded-xl hover:bg-gray-50 transition-all group">
                <div className="mb-2">
                  <div className="text-sm font-medium text-readable-muted mb-1">{period.period}</div>
                  <div className="text-lg font-bold text-readable">
                    R$ {(period.revenue / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-readable-muted">{period.clients} clientes</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:opacity-80"
                    style={{ width: `${(period.revenue / Math.max(...reportData.revenueByPeriod.map(p => p.revenue))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Consultants */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-readable">Top Consultores</h3>
            <Award className="h-5 w-5 text-admin-muted" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.topConsultants.map((consultant, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {consultant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-readable">{consultant.name}</div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full ${
                            i < Math.floor(consultant.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                      <span className="text-xs text-readable-muted ml-1">{consultant.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-readable-muted">Consultorias</span>
                    <span className="font-semibold text-readable">{consultant.consultations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-readable-muted">Revenue</span>
                    <span className="font-semibold text-readable">R$ {(consultant.revenue / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}