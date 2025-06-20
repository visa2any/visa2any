'use client'

import { Shield, Star, Users, Award, CheckCircle, Clock } from 'lucide-react'

interface TrustSignalsProps {
  variant?: 'compact' | 'full' | 'badges'
  className?: string
}

export default function TrustSignals({ variant = 'full', className = '' }: TrustSignalsProps) {
  
  const renderCompact = () => (
    <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center">
        <Shield className="h-4 w-4 text-green-500 mr-1" />
        <span>SSL Seguro</span>
      </div>
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-500 mr-1" />
        <span>4.9/5 Avaliação</span>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 text-blue-500 mr-1" />
        <span>8.400+ Aprovados</span>
      </div>
    </div>
  )

  const renderBadges = () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Google Reviews Badge */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm">
        <div className="bg-blue-500 w-8 h-8 rounded flex items-center justify-center mr-3">
          <span className="text-white text-xs font-bold">G</span>
        </div>
        <div>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
            ))}
          </div>
          <div className="text-xs text-gray-600">4.9 • 1.247 avaliações</div>
        </div>
      </div>

      {/* Trustpilot Badge */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm">
        <div className="bg-green-500 w-8 h-8 rounded flex items-center justify-center mr-3">
          <span className="text-white text-xs font-bold">TP</span>
        </div>
        <div>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3 w-3 text-green-400 fill-current" />
            ))}
          </div>
          <div className="text-xs text-gray-600">Excelente • Trustpilot</div>
        </div>
      </div>

      {/* Certificação Badge */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm">
        <Award className="h-6 w-6 text-purple-500 mr-2" />
        <div className="text-xs text-gray-600">
          <div className="font-semibold">Certificado</div>
          <div>ICCRC Brasil</div>
        </div>
      </div>
    </div>
  )

  const renderFull = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Por que 10.000+ brasileiros confiam na Visa2Any?
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Aprovações */}
        <div className="text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">8.420+</div>
          <div className="text-sm text-gray-600">Vistos aprovados nos últimos 3 anos</div>
        </div>

        {/* Satisfação */}
        <div className="text-center">
          <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">4.9/5</div>
          <div className="text-sm text-gray-600">Média de satisfação dos clientes</div>
        </div>

        {/* Tempo */}
        <div className="text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">15 anos</div>
          <div className="text-sm text-gray-600">De experiência em imigração</div>
        </div>
      </div>

      {/* Badges Row */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Shield className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-xs text-gray-600">SSL Criptografado</span>
          </div>
          
          <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Award className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-xs text-gray-600">LGPD Compliant</span>
          </div>
          
          <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Users className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-xs text-gray-600">Suporte 24/7</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
          <span className="text-sm text-green-700">
            <strong>Maria S.</strong> acabou de contratar consultoria há 12 minutos
          </span>
        </div>
      </div>
    </div>
  )

  const variants = {
    compact: renderCompact(),
    badges: renderBadges(),
    full: renderFull()
  }

  return (
    <div className={className}>
      {variants[variant]}
    </div>
  )
}