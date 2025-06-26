'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Calendar, Users, DollarSign,
  Target, Clock, MessageCircle, Phone, Mail, Globe, Award, Star, Zap, AlertTriangle,
  ChevronUp, ChevronDown, Filter, Download, RefreshCw, Eye, Settings, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Percent, Hash, Building, MapPin, FileText
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueGrowth: number
    totalClients: number
    clientGrowth: number
    conversionRate: number
    conversionGrowth: number
    averageTicket: number
    ticketGrowth: number
  }
  revenueByPeriod: Array<{
    period: string
    revenue: number
    clients: number
    conversion: number
  }>
  clientsByCountry: Array<{
    country: string
    clients: number
    revenue: number
    percentage: number
  }>
  visaTypePerformance: Array<{
    type: string
    applications: number
    approvals: number
    revenue: number
    approvalRate: number
  }>
  consultantPerformance: Array<{
    name: string
    clients: number
    revenue: number
    satisfaction: number
    responseTime: number
    conversionRate: number
  }>
  communicationMetrics: {
    totalMessages: number
    responseTime: number
    satisfactionScore: number
    channelDistribution: Array<{
      channel: string
      count: number
      percentage: number
    }>
  }
  seasonalTrends: Array<{
    month: string
    clients: number
    revenue: number
    inquiries: number
  }>
  predictiveInsights: {
    nextMonthRevenue: number
    nextMonthClients: number
    riskAlerts: Array<{
      type: string
      message: string
      severity: 'low' | 'medium' | 'high'
    }>
    opportunities: Array<{
      type: string
      message: string
      potentialRevenue: number
    }>
  }
}

interface AdvancedAnalyticsProps {
  period?: string
}

export function AdvancedAnalytics({ period = '30' }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'overview' | 'revenue' | 'clients' | 'performance' | 'predictions'>('overview')
  const [timeframe, setTimeframe] = useState(period)
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Mock analytics data - in production this would come from API,      const mockAnalytics: AnalyticsData = {
        overview: {
          totalRevenue: 485000,
          revenueGrowth: 18.5,
          totalClients: 342,
          clientGrowth: 12.3,
          conversionRate: 23.8,
          conversionGrowth: 4.2,
          averageTicket: 2890,
          ticketGrowth: 8.7
        },
        revenueByPeriod: [
          { period: 'Jan', revenue: 38000, clients: 28, conversion: 22.1 },
          { period: 'Fev', revenue: 42000, clients: 31, conversion: 23.8 },
          { period: 'Mar', revenue: 45000, clients: 35, conversion: 25.2 },
          { period: 'Abr', revenue: 41000, clients: 29, conversion: 21.7 },
          { period: 'Mai', revenue: 48000, clients: 38, conversion: 26.1 },
          { period: 'Jun', revenue: 52000, clients: 42, conversion: 28.3 }
        ],
        clientsByCountry: [
          { country: 'Estados Unidos', clients: 125, revenue: 187500, percentage: 36.5 },
          { country: 'Canadá', clients: 89, revenue: 142400, percentage: 26.0 },
          { country: 'Portugal', clients: 67, revenue: 100500, percentage: 19.6 },
          { country: 'Reino Unido', clients: 34, revenue: 51000, percentage: 9.9 },
          { country: 'Alemanha', clients: 27, revenue: 40500, percentage: 7.9 }
        ],
        visaTypePerformance: [
          { type: 'EB-1A', applications: 45, approvals: 38, revenue: 135000, approvalRate: 84.4 },
          { type: 'O-1', applications: 32, approvals: 28, revenue: 98000, approvalRate: 87.5 },
          { type: 'Express Entry', applications: 67, approvals: 58, revenue: 116000, approvalRate: 86.6 },
          { type: 'D7 Portugal', applications: 42, approvals: 39, revenue: 78000, approvalRate: 92.9 },
          { type: 'Skilled Worker UK', applications: 28, approvals: 24, revenue: 58000, approvalRate: 85.7 }
        ],
        consultantPerformance: [
          { name: 'Ana Silva', clients: 78, revenue: 145600, satisfaction: 4.8, responseTime: 2.1, conversionRate: 28.5 },
          { name: 'Carlos Santos', clients: 65, revenue: 123500, satisfaction: 4.7, responseTime: 2.3, conversionRate: 26.8 },
          { name: 'Lucia Costa', clients: 52, revenue: 98400, satisfaction: 4.9, responseTime: 1.8, conversionRate: 31.2 },
          { name: 'Pedro Oliveira', clients: 47, revenue: 89300, satisfaction: 4.6, responseTime: 2.5, conversionRate: 24.1 }
        ],
        communicationMetrics: {
          totalMessages: 1247,
          responseTime: 2.3,
          satisfactionScore: 4.7,
          channelDistribution: [
            { channel: 'WhatsApp', count: 623, percentage: 49.9 },
            { channel: 'Email', count: 387, percentage: 31.0 },
            { channel: 'Telefone', count: 156, percentage: 12.5 },
            { channel: 'Video', count: 81, percentage: 6.5 }
          ]
        },
        seasonalTrends: [
          { month: 'Jul', clients: 32, revenue: 48000, inquiries: 78 },
          { month: 'Ago', clients: 38, revenue: 57000, inquiries: 92 },
          { month: 'Set', clients: 45, revenue: 67500, inquiries: 105 },
          { month: 'Out', clients: 42, revenue: 63000, inquiries: 98 },
          { month: 'Nov', clients: 39, revenue: 58500, inquiries: 87 },
          { month: 'Dez', clients: 28, revenue: 42000, inquiries: 65 }
        ],
        predictiveInsights: {
          nextMonthRevenue: 58500,
          nextMonthClients: 41,
          riskAlerts: [
            {
              type: 'seasonal_decline',
              message: 'Possível queda sazonal em dezembro histórica de 15%',
              severity: 'medium'
            },
            {
              type: 'consultant_overload',
              message: 'Ana Silva com carga 23% acima da média',
              severity: 'high'
            }
          ],
          opportunities: [
            {
              type: 'market_expansion',
              message: 'Demanda crescente para vistos australianos (+34%)',
              potentialRevenue: 45000
            },
            {
              type: 'upsell_opportunity',
              message: '67 clientes elegíveis para serviços premium',
              potentialRevenue: 28000
            }
          ]
        }
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Analytics fetch error:', error)
      notifyError('Erro', 'Falha ao carregar analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
            <p className="text-gray-600">Análise detalhada da performance da plataforma</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
              <option value="365">1 ano</option>
            </select>
            
            <button
              onClick={fetchAnalytics}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'revenue', label: 'Receita', icon: DollarSign },
            { id: 'clients', label: 'Clientes', icon: Users },
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'predictions', label: 'Predições', icon: TrendingUp }
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

      {/* Overview */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  <p className={`text-sm font-medium ${analytics.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(analytics.overview.revenueGrowth)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalClients}</p>
                  <p className={`text-sm font-medium ${analytics.overview.clientGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(analytics.overview.clientGrowth)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.overview.conversionRate.toFixed(1)}%</p>
                  <p className={`text-sm font-medium ${analytics.overview.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(analytics.overview.conversionGrowth)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.overview.averageTicket)}</p>
                  <p className={`text-sm font-medium ${analytics.overview.ticketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(analytics.overview.ticketGrowth)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Country */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por País</h3>
              <div className="space-y-4">
                {analytics.clientsByCountry.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(country.revenue)}</p>
                      <p className="text-sm text-gray-500">{country.clients} clientes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visa Type Performance */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Tipo de Visto</h3>
              <div className="space-y-4">
                {analytics.visaTypePerformance.slice(0, 5).map((visa, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{visa.type}</p>
                      <p className="text-sm text-gray-500">{visa.applications} aplicações</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{visa.approvalRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">{formatCurrency(visa.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {selectedView === 'performance' && (
        <div className="space-y-6">
          {/* Consultant Performance */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance dos Consultores</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Consultor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Clientes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Receita</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfação</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Resp. Média</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.consultantPerformance.map((consultant, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {consultant.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{consultant.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{consultant.clients}</td>
                      <td className="py-3 px-4 text-gray-900">{formatCurrency(consultant.revenue)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-900">{consultant.satisfaction}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{consultant.responseTime}h</td>
                      <td className="py-3 px-4 text-gray-900">{consultant.conversionRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Communication Metrics */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas de Comunicação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analytics.communicationMetrics.totalMessages}</p>
                <p className="text-sm text-gray-600">Total Mensagens</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analytics.communicationMetrics.responseTime}h</p>
                <p className="text-sm text-gray-600">Tempo Resposta</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analytics.communicationMetrics.satisfactionScore}</p>
                <p className="text-sm text-gray-600">Satisfação</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-sm text-gray-600">Taxa Resposta</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Distribuição por Canal</h4>
              <div className="space-y-3">
                {analytics.communicationMetrics.channelDistribution.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{channel.channel}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${channel.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {channel.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {selectedView === 'predictions' && (
        <div className="space-y-6">
          {/* Predictions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Predições Próximo Mês</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-700">Receita Estimada</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(analytics.predictiveInsights.nextMonthRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Novos Clientes</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {analytics.predictiveInsights.nextMonthClients}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Oportunidades</span>
              </h3>
              <div className="space-y-3">
                {analytics.predictiveInsights.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <p className="font-medium text-green-900 text-sm">{opportunity.message}</p>
                    <p className="text-sm text-green-700">
                      Potencial: {formatCurrency(opportunity.potentialRevenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas de Risco</span>
            </h3>
            <div className="space-y-3">
              {analytics.predictiveInsights.riskAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-medium text-sm ${
                      alert.severity === 'high' ? 'text-red-900' :
                      alert.severity === 'medium' ? 'text-yellow-900' :
                      'text-blue-900'
                    }`}>
                      {alert.message}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {(selectedView === 'revenue' || selectedView === 'clients') && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-12">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-500">Gráficos detalhados serão implementados em breve</p>
          </div>
        </div>
      )}
    </div>
  )
}