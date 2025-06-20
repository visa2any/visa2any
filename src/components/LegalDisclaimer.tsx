'use client'

import { AlertTriangle, Shield } from 'lucide-react'

interface LegalDisclaimerProps {
  type?: 'full' | 'short'
  className?: string
}

export default function LegalDisclaimer({ type = 'short', className = '' }: LegalDisclaimerProps) {
  if (type === 'full') {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <h4 className="font-semibold mb-2">Importante - Leia com Atenção</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>A aprovação de visto é decisão exclusiva das autoridades governamentais</li>
              <li>Resultados passados não garantem resultados futuros</li>
              <li>Estatísticas baseadas em clientes que seguiram integralmente nossas orientações</li>
              <li>Fatores externos podem afetar o resultado independente da qualidade da assessoria</li>
              <li>Garantimos apenas a qualidade do serviço prestado, não o resultado final</li>
              <li>Mudanças nas leis de imigração podem afetar processos em andamento</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <Shield className="h-4 w-4 text-gray-500 mr-2" />
        <p className="text-xs text-gray-600">
          *Aprovação de visto é decisão exclusiva das autoridades governamentais. 
          Estatísticas baseadas em clientes que seguiram nossas orientações.
        </p>
      </div>
    </div>
  )
}