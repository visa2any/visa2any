'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Plus, ArrowRight, Star, Clock, Shield } from 'lucide-react'

interface CheckoutUpsellsProps {
  currentProductId: string
  currentPrice: number
  onAddUpsell: (productId: string, price: number) => void
  className?: string
}

// Matriz de upsells baseada no produto atual
const UPSELL_MATRIX = {
  'pre-analise': [
    {
      id: 'relatorio-premium',
      name: '📄 Upgrade para Relatório Premium',
      price: 97,
      originalPrice: 97,
      description: 'Relatório PDF completo de 15+ páginas',
      benefit: 'Economize tempo e tenha análise detalhada',
      urgency: 'Apenas hoje: upgrade por R$ 97',
      features: ['Relatório PDF completo', 'Lista de documentos', 'Timeline personalizado']
    },
    {
      id: 'consultoria-express',
      name: '👨‍💼 Adicionar Consultoria 1:1',
      price: 297,
      originalPrice: 397,
      description: '60min com especialista humano',
      benefit: 'Tire todas suas dúvidas ao vivo',
      urgency: 'Desconto de R$ 100 se adicionar agora',
      features: ['60min de consultoria', 'Análise personalizada', 'Suporte WhatsApp 30 dias']
    }
  ],
  'relatorio-premium': [
    {
      id: 'consultoria-express-upgrade',
      name: '👨‍💼 Adicionar Consultoria Especializada',
      price: 200,
      originalPrice: 297,
      description: '60min com especialista + revisão do relatório',
      benefit: 'Orientação humana personalizada',
      urgency: 'Desconto de R$ 97 por já ter o relatório',
      features: ['Revisão do seu relatório', 'Estratégia personalizada', 'Suporte prioritário']
    },
    {
      id: 'kit-documentacao-premium',
      name: '📋 Kit Documentação Premium',
      price: 67,
      originalPrice: 147,
      description: 'Templates e checklists personalizados',
      benefit: 'Organize seus documentos perfeitamente',
      urgency: 'Só R$ 67 (55% OFF) para clientes do relatório',
      features: ['Templates em Word/PDF', 'Checklists interativos', 'Alertas automáticos']
    }
  ],
  'consultoria-express': [
    {
      id: 'segunda-sessao',
      name: '🔄 Segunda Sessão de Consultoria',
      price: 147,
      originalPrice: 297,
      description: 'Sessão de follow-up em 30 dias',
      benefit: 'Acompanhamento do seu progresso',
      urgency: '50% OFF se reservar agora',
      features: ['Follow-up em 30 dias', 'Revisão de progresso', 'Ajustes na estratégia']
    },
    {
      id: 'preparacao-entrevista',
      name: '🎯 Preparação para Entrevista',
      price: 197,
      originalPrice: 397,
      description: 'Simulação + coaching para entrevista consular',
      benefit: 'Chegue confiante na entrevista',
      urgency: 'R$ 200 de desconto exclusivo',
      features: ['Simulação realista', 'Feedback detalhado', 'Dicas dos especialistas']
    }
  ],
  'assessoria-vip': [
    {
      id: 'segunda-sessao-vip',
      name: '🔄 Segunda Sessão VIP',
      price: 297,
      originalPrice: 597,
      description: 'Sessão de acompanhamento exclusiva',
      benefit: 'Suporte contínuo para seu processo',
      urgency: '50% OFF exclusivo para clientes VIP',
      features: ['Follow-up personalizado', 'Revisão de estratégia', 'Suporte prioritário']
    },
    {
      id: 'fast-track-processing',
      name: '⚡ Processamento Prioritário',
      price: 397,
      originalPrice: 697,
      description: 'Análise e processamento em 24h',
      benefit: 'Resultados mais rápidos',
      urgency: 'Desconto de R$ 300 para clientes VIP',
      features: ['Processamento em 24h', 'Prioridade máxima', 'Suporte dedicado']
    }
  ]
}

export default function CheckoutUpsells({ currentProductId, currentPrice, onAddUpsell, className = '' }: CheckoutUpsellsProps) {
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set())
  
  // Determinar base do produto para buscar upsells
  const getProductBase = (productId: string) => {
    if (productId.includes('pre-analise')) return 'pre-analise'
    if (productId.includes('relatorio') || productId.includes('premium')) return 'relatorio-premium'
    if (productId.includes('consultoria') || productId.includes('express')) return 'consultoria-express'
    if (productId.includes('vip') || productId.includes('assessoria')) return 'assessoria-vip'
    return 'relatorio-premium' // fallback
  }
  
  const productBase = getProductBase(currentProductId)
  const availableUpsells = UPSELL_MATRIX[productBase as keyof typeof UPSELL_MATRIX] || []
  
  if (availableUpsells.length === 0) {
    return null
  }
  
  const handleToggleUpsell = (upsellId: string, price: number) => {
    const newSelected = new Set(selectedUpsells)
    if (newSelected.has(upsellId)) {
      newSelected.delete(upsellId)
    } else {
      newSelected.add(upsellId)
    }
    setSelectedUpsells(newSelected)
    onAddUpsell(upsellId, selectedUpsells.has(upsellId) ? -price : price)
  }
  
  const getTotalUpsellValue = () => {
    return availableUpsells
      .filter(upsell => selectedUpsells.has(upsell.id))
      .reduce((total, upsell) => total + upsell.price, 0)
  }
  
  const getTotalSavings = () => {
    return availableUpsells
      .filter(upsell => selectedUpsells.has(upsell.id))
      .reduce((total, upsell) => total + (upsell.originalPrice - upsell.price), 0)
  }

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Turbine Seu Plano - Ofertas Exclusivas!
        </h3>
        <p className="text-gray-600">
          Aproveite descontos especiais disponíveis apenas nesta etapa
        </p>
        <div className="mt-2 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
          ⏰ Ofertas válidas apenas durante o checkout
        </div>
      </div>
      
      <div className="space-y-4">
        {availableUpsells.map((upsell) => {
          const isSelected = selectedUpsells.has(upsell.id)
          const savings = upsell.originalPrice - upsell.price
          
          return (
            <div
              key={upsell.id}
              className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-orange-400 hover:shadow-md'
              }`}
              onClick={() => handleToggleUpsell(upsell.id, upsell.price)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      isSelected 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{upsell.name}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-3 ml-9">{upsell.description}</p>
                  
                  <div className="ml-9 space-y-2">
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <Star className="h-4 w-4 mr-2" />
                      {upsell.benefit}
                    </div>
                    
                    <div className="flex items-center text-red-600 text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {upsell.urgency}
                    </div>
                    
                    <div className="space-y-1">
                      {upsell.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-3 w-3 mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="space-y-1">
                    {savings > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        R$ {upsell.originalPrice.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-orange-600">
                      R$ {upsell.price.toFixed(2).replace('.', ',')}
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Economize R$ {savings.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    className={`mt-3 ${
                      isSelected
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                    size="sm"
                  >
                    {isSelected ? 'Adicionado' : 'Adicionar'}
                    {!isSelected && <Plus className="ml-1 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {selectedUpsells.size > 0 && (
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800">Total dos extras selecionados:</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {getTotalUpsellValue().toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          {getTotalSavings() > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Economia total nos extras:</span>
              <span className="font-bold text-green-700">
                R$ {getTotalSavings().toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
          
          <div className="mt-3 flex items-center text-sm text-green-700">
            <Shield className="h-4 w-4 mr-2" />
            <span>Todos os extras são protegidos pela mesma garantia</span>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          💡 <strong>Dica:</strong> Estes preços especiais só estão disponíveis durante o checkout. 
          Depois será mais caro comprar separadamente!
        </p>
      </div>
    </div>
  )
}