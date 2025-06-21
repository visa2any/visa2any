'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Briefcase, Users, Calendar, TrendingUp, BarChart3, MessageCircle } from 'lucide-react'

// Code splitting dos componentes pesados
const ClientsOverview = dynamic(() => import('./ClientsOverview'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
})

const PerformanceMetrics = dynamic(() => import('./PerformanceMetrics'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
})

const TaskManager = dynamic(() => import('./TaskManager'), {
  loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
})

const CommunicationHub = dynamic(() => import('./CommunicationHub'), {
  loading: () => <div className="h-72 bg-gray-100 animate-pulse rounded-lg"></div>
})

const ReportsAnalytics = dynamic(() => import('./ReportsAnalytics'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
})

export default function ConsultantWorkspace() {
  const [activeTab, setActiveTab] = useState('clients')

  const tabs = [
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'tasks', label: 'Tarefas', icon: Calendar },
    { id: 'communication', label: 'Comunicação', icon: MessageCircle },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Workspace do Consultor</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render only active tab component */}
        {activeTab === 'clients' && <ClientsOverview />}
        {activeTab === 'performance' && <PerformanceMetrics />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'communication' && <CommunicationHub />}
        {activeTab === 'reports' && <ReportsAnalytics />}
      </div>
    </div>
  )
}