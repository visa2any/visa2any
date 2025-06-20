'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, Users, DollarSign, Target, Star, Clock, 
  CheckCircle, AlertTriangle, Activity, Calendar
} from 'lucide-react'

interface VagaExpressStats {
  totalOrders: number
  totalRevenue: number
  activeCustomers: number
  planDistribution: {
    basic: number
    premium: number
    vip: number
  }
}

interface VagaExpressOrder {
  orderId: string
  customerName: string
  customerEmail: string
  productId: string
  totalPaid: number
  targetCountry: string
  adults: number
  children: number
  priority: string
  createdAt: string
  duration: number
}

export function VagaExpressStats() {
  const [stats, setStats] = useState<VagaExpressStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    planDistribution: { basic: 0, premium: 0, vip: 0 }
  })
  const [recentOrders, setRecentOrders] = useState<VagaExpressOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVagaExpressData()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadVagaExpressData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadVagaExpressData = async () => {
    try {
      // Carregar estatísticas
      const statsResponse = await fetch('/api/vaga-express?type=statistics')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.statistics)
        }
      }

      // Carregar pedidos recentes
      const ordersResponse = await fetch('/api/vaga-express?type=orders')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setRecentOrders(ordersData.orders || [])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados Vaga Express:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateVagaForCustomer = async (orderId: string) => {
    try {
      const response = await fetch('/api/vaga-express', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_vaga',
          data: {
            orderId,
            vagaDetails: {
              country: 'EUA',
              type: 'Turismo',
              location: 'São Paulo'
            }
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('✅ Vaga simulada! Cliente será notificado.')
      } else {
        alert('❌ Erro ao simular vaga.')
      }
    } catch (error) {
      console.error('Erro ao simular vaga:', error)
      alert('❌ Erro ao simular vaga.')
    }
  }

  const getPlanBadge = (productId: string) => {
    if (productId.includes('basic')) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🥉 Basic</span>
    }
    if (productId.includes('premium')) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">🥈 Premium</span>
    }
    if (productId.includes('vip')) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">🥇 VIP</span>
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Outros</span>
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'USA': '🇺🇸',
      'CAN': '🇨🇦',
      'AUS': '🇦🇺',
      'POR': '🇵🇹',
      'ESP': '🇪🇸',
      'UK': '🇬🇧',
      'GER': '🇩🇪'
    }
    return flags[country] || '🌍'
  }

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <div className="text-center text-gray-500 py-8">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          Carregando dados do Vaga Express...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pedidos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Ativos</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeCustomers}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-orange-600">
                R$ {stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('pt-BR') : '0'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição dos Planos */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📊 Distribuição dos Planos</h3>
            <Star className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥉</span>
                <span className="font-medium">Basic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">{stats.planDistribution.basic}</span>
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats.totalOrders > 0 ? (stats.planDistribution.basic / stats.totalOrders) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥈</span>
                <span className="font-medium">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">{stats.planDistribution.premium}</span>
                <div className="w-20 bg-orange-100 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats.totalOrders > 0 ? (stats.planDistribution.premium / stats.totalOrders) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥇</span>
                <span className="font-medium">VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-purple-600">{stats.planDistribution.vip}</span>
                <div className="w-20 bg-purple-100 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats.totalOrders > 0 ? (stats.planDistribution.vip / stats.totalOrders) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📋 Pedidos Recentes</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum pedido ainda</p>
                <p className="text-sm">Os pedidos aparecerão aqui</p>
              </div>
            ) : (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order.orderId} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{order.customerName}</span>
                      {getPlanBadge(order.productId)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{getCountryFlag(order.targetCountry)} {order.targetCountry}</span>
                      <span>👥 {order.adults + order.children}</span>
                      <span className="font-medium text-green-600">R$ {order.totalPaid}</span>
                    </div>
                    
                    <button
                      onClick={() => simulateVagaForCustomer(order.orderId)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      🎯 Simular Vaga
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Ações Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('http://localhost:3000/vaga-express', '_blank')}
            className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-blue-600 mb-2">🚀</div>
            <h4 className="font-medium text-gray-900">Ver Página de Vendas</h4>
            <p className="text-sm text-gray-600">Acessar página do Vaga Express</p>
          </button>

          <button
            onClick={loadVagaExpressData}
            className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <div className="text-green-600 mb-2">🔄</div>
            <h4 className="font-medium text-gray-900">Atualizar Dados</h4>
            <p className="text-sm text-gray-600">Recarregar estatísticas</p>
          </button>

          <button
            onClick={() => alert('Em desenvolvimento: Sistema de relatórios detalhados')}
            className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="text-purple-600 mb-2">📊</div>
            <h4 className="font-medium text-gray-900">Relatórios</h4>
            <p className="text-sm text-gray-600">Gerar relatórios detalhados</p>
          </button>
        </div>
      </div>
    </div>
  )
}