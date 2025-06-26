'use client'

import { Button } from '@/components/ui/button'
import { TrendingUp, Users, DollarSign, Gift, ArrowRight, Star } from 'lucide-react'

interface AffiliateBannerProps {
  variant?: 'full' | 'compact' | 'sidebar'
  className?: string
}

export default function AffiliateBanner({ variant = 'full', className = '' }: AffiliateBannerProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 text-white shadow-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">💰 Ganhe com Indicações</h3>
            <p className="text-sm text-yellow-100">Até 30% de comissão</p>
          </div>
          <Button 
            onClick={() => window.open('/afiliados', '_blank')}
            className="bg-orange-600 text-white hover:bg-orange-700 font-bold"
          >
            Participar
          </Button>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-b from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">🤝 Programa de Afiliados</h3>
          <p className="text-gray-600 text-sm mb-4">
            Indique a Visa2Any e ganhe até <strong>30% de comissão</strong> em cada venda
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span>Material promocional grátis</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span>Dashboard completo</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Users className="h-4 w-4 text-blue-500 mr-2" />
              <span>Suporte dedicado</span>
            </div>
          </div>
          
          <Button 
            onClick={() => window.open('/afiliados', '_blank')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Quero Participar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Variant 'full',  return (
    <div className={`bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">Programa de Parceria</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              💰 Ganhe Dinheiro Indicando a Visa2Any
            </h2>
            
            <p className="text-xl text-yellow-100 mb-6">
              Transforme sua rede em renda! Ganhe até <strong>30% de comissão</strong> 
              em cada cliente que você indicar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.open('/afiliados', '_blank')}
                className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                COMEÇAR A GANHAR
              </Button>
              <Button 
                onClick={() => window.open('/afiliados/portal', '_blank')}
                className="border-2 border-white text-white hover:bg-orange-600 hover:text-white hover:border-orange-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                Já sou Afiliado
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-center">🎯 Vantagens do Programa</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Até 30% de Comissão</div>
                  <div className="text-sm text-yellow-100">R$ 50 a R$ 500+ por indicação</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Material Promocional</div>
                  <div className="text-sm text-yellow-100">Banners, vídeos e textos prontos</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Dashboard Completo</div>
                  <div className="text-sm text-yellow-100">Acompanhe ganhos em tempo real</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}