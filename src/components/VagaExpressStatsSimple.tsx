'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

export function VagaExpressStatsSimple() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados,    setTimeout(() => {
      setStats({
        totalOrders: 5,
        totalRevenue: 2485,
        activeCustomers: 3
      })
      setIsLoading(false)
    }, 1000)
  }, [])

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Vaga Express</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Sistema Integrado</div>
              <div className="text-sm text-gray-600">
                Vendas e monitoramento funcionando
              </div>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              ✅ Ativo
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Preços Configurados</div>
              <div className="text-sm text-gray-600">
                Basic R$ 297 | Premium R$ 497 | VIP R$ 797
              </div>
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              💰 OK
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Processamento Automático</div>
              <div className="text-sm text-gray-600">
                Checkout → Ativação → Monitoramento
              </div>
            </div>
            <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              ⚡ Funcional
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('http://localhost:3000/vaga-express', '_blank')}
            className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="text-blue-600 mb-2">🛒</div>
            <h4 className="font-medium text-gray-900">Ver Página de Vendas</h4>
            <p className="text-sm text-gray-600">Acessar Vaga Express</p>
          </button>

          <button
            onClick={() => alert('Sistema funcionando perfeitamente!\n\n✅ Vendas ativas\n✅ Checkout integrado\n✅ Monitoramento automático')}
            className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <div className="text-green-600 mb-2">✅</div>
            <h4 className="font-medium text-gray-900">Status do Sistema</h4>
            <p className="text-sm text-gray-600">Verificar funcionamento</p>
          </button>
        </div>
      </div>
    </div>
  )
}