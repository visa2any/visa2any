'use client'

import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react'

export default function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
              <p className="text-3xl font-bold text-green-600">94%</p>
              <p className="text-sm text-gray-500">+2% vs mês anterior</p>
            </div>
            <Target className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-3xl font-bold text-blue-600">18d</p>
              <p className="text-sm text-gray-500">-3 dias vs mês anterior</p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfação</p>
              <p className="text-3xl font-bold text-purple-600">4.8</p>
              <p className="text-sm text-gray-500">Baseado em 127 avaliações</p>
            </div>
            <Award className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Aprovações por Mês</h3>
          </div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Aprovações</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Países Mais Procurados</h3>
          </div>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Países</p>
          </div>
        </div>
      </div>
    </div>
  )
}