'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, DollarSign, Eye, Users, TrendingUp, Calendar,
  Download, Share2, Copy, ExternalLink, CheckCircle, Clock,
  AlertTriangle, Star, Award, Target, Link, Activity, Mail,
  Phone, Globe, Instagram, Youtube, Facebook, Linkedin,
  MessageCircle, FileText, Image, Video, RefreshCw, Zap
} from 'lucide-react'

interface DashboardData {
  affiliate: {
    id: string
    name: string
    email: string
    status: string
    tier: string
    referralCode: string
    totalEarnings: number
    pendingEarnings: number
    paidEarnings: number
    totalClicks: number
    totalConversions: number
    conversionRate: number
    commissionRate: number
  }
  stats: {
    thisMonth: {
      clicks: number
      conversions: number
      earnings: number
      growth: number
    }
    lastMonth: {
      clicks: number
      conversions: number
      earnings: number
    }
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    amount?: number
    date: string
  }>
  topLinks: Array<{
    url: string
    clicks: number
    conversions: number
    conversionRate: number
  }>
}

export default function AffiliateDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Dados mockados para demonstração
      setData({
        affiliate: {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          status: 'ACTIVE',
          tier: 'GOLD',
          referralCode: 'JOAO2024',
          totalEarnings: 8540.50,
          pendingEarnings: 1240.25,
          paidEarnings: 7300.25,
          totalClicks: 1250,
          totalConversions: 42,
          conversionRate: 3.36,
          commissionRate: 0.15
        },
        stats: {
          thisMonth: {
            clicks: 180,
            conversions: 8,
            earnings: 1240.25,
            growth: 15.2
          },
          lastMonth: {
            clicks: 156,
            conversions: 6,
            earnings: 890.50
          }
        },
        recentActivity: [
          {
            id: '1',
            type: 'conversion',
            description: 'Nova conversão - Consultoria EUA',
            amount: 89.55,
            date: '2024-06-16'
          },
          {
            id: '2',
            type: 'payment',
            description: 'Pagamento processado',
            amount: 1450.75,
            date: '2024-06-15'
          },
          {
            id: '3',
            type: 'click',
            description: '25 novos cliques hoje',
            date: '2024-06-16'
          }
        ],
        topLinks: [
          {
            url: 'Consultoria EUA',
            clicks: 450,
            conversions: 18,
            conversionRate: 4.0
          },
          {
            url: 'Página Inicial',
            clicks: 380,
            conversions: 12,
            conversionRate: 3.16
          },
          {
            url: 'Visto Canadá',
            clicks: 220,
            conversions: 8,
            conversionRate: 3.64
          }
        ]
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const affiliateLinks = {
    home: `https://visa2any.com/api/affiliates/track?ref=JOAO2024&url=/`,
    consultation: `https://visa2any.com/api/affiliates/track?ref=JOAO2024&url=/consulta`,
    usa: `https://visa2any.com/api/affiliates/track?ref=JOAO2024&url=/consulta?country=usa&campaign=visto-eua`,
    canada: `https://visa2any.com/api/affiliates/track?ref=JOAO2024&url=/consulta?country=canada&campaign=visto-canada`

    pricing: `https://visa2any.com/api/affiliates/track?ref=JOAO2024&url=/precos`
  }

  const copyToClipboard = (text: string, linkName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLink(linkName)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'text-amber-700 bg-amber-100'
      case 'SILVER': return 'text-gray-700 bg-gray-100'
      case 'GOLD': return 'text-yellow-700 bg-yellow-100'
      case 'PLATINUM': return 'text-purple-700 bg-purple-100'
      case 'DIAMOND': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return '🥉'
      case 'SILVER': return '🥈'
      case 'GOLD': return '🥇'
      case 'PLATINUM': return '💎'
      case 'DIAMOND': return '💍'
      default: return '⭐'
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Afiliado</h1>
              <p className="text-gray-600">Bem-vindo de volta, {data.affiliate.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(data.affiliate.tier)}`}>
                {getTierIcon(data.affiliate.tier)} {data.affiliate.tier}
              </span>
              <button
                onClick={loadDashboardData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-1 mb-6">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { key: 'links', label: 'Meus Links', icon: Link },
              { key: 'materials', label: 'Material Promocional', icon: Image },
              { key: 'payments', label: 'Pagamentos', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ganhos Totais</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {data.affiliate.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">+{data.stats.thisMonth.growth}% este mês</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cliques Este Mês</p>
                    <p className="text-2xl font-bold text-gray-900">{data.stats.thisMonth.clicks}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-blue-600">
                        {data.stats.thisMonth.clicks - data.stats.lastMonth.clicks > 0 ? '+' : ''}
                        {data.stats.thisMonth.clicks - data.stats.lastMonth.clicks} vs mês anterior
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversões</p>
                    <p className="text-2xl font-bold text-gray-900">{data.affiliate.totalConversions}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-purple-600">
                        {data.affiliate.conversionRate}% taxa de conversão
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {data.affiliate.pendingEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-3 w-3 text-yellow-600 mr-1" />
                      <span className="text-xs text-yellow-600">Próximo pagamento: 15/07</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Links */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Links Mais Clicados</h3>
                <div className="space-y-3">
                  {data.topLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{link.url}</div>
                        <div className="text-sm text-gray-600">{link.clicks} cliques • {link.conversions} conversões</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{link.conversionRate}%</div>
                        <div className="text-xs text-gray-500">conversão</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'conversion' ? 'bg-green-100' :
                        activity.type === 'payment' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'conversion' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'click' && <Eye className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-bold text-green-600">
                          +R$ {activity.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Seus Links de Afiliado</h2>
                  <p className="text-gray-600">Use estes links para promover nossos serviços</p>
                </div>
                <div className="text-sm font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                  Código: {data.affiliate.referralCode}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(affiliateLinks).map(([key, url]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 capitalize">
                        {key === 'home' ? 'Página Inicial' :
                         key === 'consultation' ? 'Consultoria' :
                         key === 'usa' ? 'Visto EUA' :
                         key === 'canada' ? 'Visto Canadá' :
                         key === 'pricing' ? 'Preços' : key}
                      </div>
                      <div className="text-sm text-gray-600 font-mono truncate max-w-md">{url}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(url, key)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedLink === key ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(url, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Templates */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates para Redes Sociais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { platform: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-100' },
                  { platform: 'Facebook', icon: Facebook, color: 'text-blue-600 bg-blue-100' },
                  { platform: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 bg-blue-100' },
                  { platform: 'WhatsApp', icon: MessageCircle, color: 'text-green-600 bg-green-100' }
                ].map(({ platform, icon: Icon, color }) => (
                  <button
                    key={platform}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Template {platform}</div>
                      <div className="text-sm text-gray-600">Texto otimizado para {platform}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Material Promocional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { type: 'Banners', icon: Image, count: 15, description: 'Banners para sites e redes sociais' },
                { type: 'Vídeos', icon: Video, count: 8, description: 'Vídeos promocionais e depoimentos' },
                { type: 'E-books', icon: FileText, count: 5, description: 'Guias completos sobre imigração' },
                { type: 'Posts', icon: Share2, count: 20, description: 'Posts prontos para redes sociais' },
                { type: 'Templates Email', icon: Mail, count: 12, description: 'Templates para email marketing' },
                { type: 'Apresentações', icon: BarChart3, count: 6, description: 'Slides para apresentações' }
              ].map((material) => {
                const Icon = material.icon
                return (
                  <div key={material.type} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">{material.count} itens</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{material.type}</h3>
                    <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Ver Material
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  R$ {data.affiliate.paidEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Total Recebido</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  R$ {data.affiliate.pendingEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Aguardando Pagamento</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">15/07</div>
                <div className="text-sm text-gray-600">Próximo Pagamento</div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Método</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">15/06/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">R$ 1.450,75</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Pago
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">PIX</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">15/05/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">R$ 2.180,30</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Pago
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">PIX</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">15/07/2024</td>
                      <td className="px-4 py-3 text-sm font-medium text-yellow-600">R$ 1.240,25</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">PIX</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}