'use client'

import { useState, useEffect } from 'react'
import { 
  Users, DollarSign, TrendingUp, Eye, Plus, Filter, Download, 
  Search, MoreHorizontal, Star, Award, Target, Zap, CheckCircle,
  AlertTriangle, Clock, ExternalLink, Edit, Trash2, User,
  Globe, Link, Activity, ArrowUpRight, ArrowDownRight,
  Calendar, Phone, Mail, Building, CreditCard, BarChart3
} from 'lucide-react'

interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  pendingAffiliates: number
  totalCommissions: number
  paidCommissions: number
  pendingCommissions: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
  topPerformers: Array<{
    id: string
    name: string
    earnings: number
    conversions: number
    tier: string
  }>
}

interface Affiliate {
  id: string
  name: string
  email: string
  company?: string
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED'
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  referralCode: string
  totalEarnings: number
  pendingEarnings: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
  commissionRate: number
  createdAt: string
  lastActivity?: string
}

export default function AffiliatesAdminPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Carregar dados mockados por enquanto,      setStats({
        totalAffiliates: 247,
        activeAffiliates: 189,
        pendingAffiliates: 12,
        totalCommissions: 156780.50,
        paidCommissions: 142340.25,
        pendingCommissions: 14440.25,
        totalClicks: 18560,
        totalConversions: 892,
        conversionRate: 4.8,
        topPerformers: [
          { id: '1', name: 'João Silva', earnings: 8540.50, conversions: 42, tier: 'GOLD' },
          { id: '2', name: 'Maria Santos', earnings: 7320.25, conversions: 38, tier: 'SILVER' },
          { id: '3', name: 'Carlos Lima', earnings: 6890.75, conversions: 35, tier: 'GOLD' }
        ]
      })

      setAffiliates([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          company: 'Silva Consultoria',
          status: 'ACTIVE',
          tier: 'GOLD',
          referralCode: 'JOAO2024',
          totalEarnings: 8540.50,
          pendingEarnings: 1240.25,
          totalClicks: 1250,
          totalConversions: 42,
          conversionRate: 3.36,
          commissionRate: 0.15,
          createdAt: '2024-01-15',
          lastActivity: '2024-06-16'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@consultoria.com',
          company: 'MS Immigration',
          status: 'ACTIVE',
          tier: 'SILVER',
          referralCode: 'MARIA2024',
          totalEarnings: 7320.25,
          pendingEarnings: 890.50,
          totalClicks: 980,
          totalConversions: 38,
          conversionRate: 3.88,
          commissionRate: 0.12,
          createdAt: '2024-02-01',
          lastActivity: '2024-06-15'
        },
        {
          id: '3',
          name: 'Carlos Lima',
          email: 'carlos@email.com',
          status: 'PENDING',
          tier: 'BRONZE',
          referralCode: 'CARLOS2024',
          totalEarnings: 0,
          pendingEarnings: 0,
          totalClicks: 0,
          totalConversions: 0,
          conversionRate: 0,
          commissionRate: 0.10,
          createdAt: '2024-06-10'
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'SUSPENDED': return 'text-red-600 bg-red-100'
      case 'REJECTED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter
    const matchesTier = tierFilter === 'all' || affiliate.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Sistema de Afiliados
          </h1>
          <p className="text-gray-600 mt-1">Gerencie sua rede de parceiros e comissões</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Afiliado
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Afiliados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAffiliates}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stats.activeAffiliates} ativos
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comissões Totais</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    R$ {stats.pendingCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pendentes
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cliques Totais</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString('pt-BR')}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {stats.totalConversions} conversões
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+0.8% este mês</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            Top Performers
          </h2>
          <div className="space-y-3">
            {stats.topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.conversions} conversões</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">R$ {performer.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(performer.tier)}`}>
                    {getTierIcon(performer.tier)} {performer.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar afiliados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PENDING">Pendente</option>
              <option value="SUSPENDED">Suspenso</option>
              <option value="REJECTED">Rejeitado</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Níveis</option>
              <option value="BRONZE">Bronze</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
              <option value="DIAMOND">Diamond</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredAffiliates.length} de {affiliates.length} afiliados
          </div>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Afiliado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ganhos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.email}</div>
                        {affiliate.company && (
                          <div className="text-xs text-gray-400">{affiliate.company}</div>
                        )}
                        <div className="text-xs text-blue-600 font-mono">{affiliate.referralCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(affiliate.status)}`}>
                      {affiliate.status === 'ACTIVE' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {affiliate.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                      {affiliate.status === 'SUSPENDED' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(affiliate.tier)}`}>
                      {getTierIcon(affiliate.tier)} {affiliate.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{affiliate.totalClicks} cliques</div>
                      <div>{affiliate.totalConversions} conversões</div>
                      <div className="text-xs text-gray-500">{affiliate.conversionRate}% taxa</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">R$ {affiliate.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      {affiliate.pendingEarnings > 0 && (
                        <div className="text-xs text-yellow-600">
                          R$ {affiliate.pendingEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pendente
                        </div>
                      )}
                      <div className="text-xs text-gray-500">{(affiliate.commissionRate * 100)}% comissão</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}