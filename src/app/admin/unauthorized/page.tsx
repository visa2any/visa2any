'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Acesso Negado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Você não tem permissão para acessar esta área do sistema.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Entre em contato com o administrador se acredita que deveria ter acesso.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para Home
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Permissões necessárias: Administrador ou Gerente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}