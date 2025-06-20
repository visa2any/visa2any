'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar automaticamente para o dashboard unificado
    router.replace('/admin/dashboard-unified')
  }, [router])

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
        </div>
        <p className="text-gray-700 mt-4 font-medium">Redirecionando para o Dashboard Unificado...</p>
        <p className="text-gray-500 text-sm mt-2">Você será redirecionado automaticamente...</p>
      </div>
    </div>
  )
}