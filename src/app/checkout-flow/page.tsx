'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ModernCheckoutFlow from '@/components/ModernCheckoutFlow'
import { Loader2 } from 'lucide-react'

// Dados dos produtos
const PRODUCTS = {
  'vaga-express-basic': {
    name: '🥉 Vaga Express Basic',
    price: 297,
    description: 'Monitoramento por 30 dias - Perfeito para 1 consulado',
    features: [
      '✅ Monitoramento por 30 dias',
      '📱 Notificações WhatsApp + Email',
      '🎯 1 país/consulado',
      '⏰ Vagas até 30 dias de antecedência',
      '🔔 Prioridade média (15min)',
      '📊 Relatório semanal'
    ],
    variant: 'default' as const
  },
  'vaga-express-premium': {
    name: '🥈 Vaga Express Premium',
    price: 497,
    description: 'Monitoramento por 60 dias - O mais popular com garantia!',
    features: [
      '✅ Monitoramento por 60 dias',
      '📱 Notificações multi-canal prioritárias',
      '🌍 Até 2 países/consulados',
      '⏰ Vagas até 60 dias de antecedência',
      '💰 Garantia de reembolso',
      '🔔 Prioridade alta (5min)',
      '📊 Relatório semanal detalhado',
      '🎯 Suporte prioritário'
    ],
    variant: 'premium' as const
  },
  'vaga-express-vip': {
    name: '🥇 Vaga Express VIP',
    price: 797,
    description: 'Monitoramento por 90 dias - Serviço completo com consultoria',
    features: [
      '✅ Monitoramento por 90 dias',
      '🚨 Notificação imediata (2 minutos)',
      '🌎 Países ilimitados',
      '👑 Prioridade máxima',
      '👨‍💼 Consultoria dedicada inclusa',
      '🎯 Suporte 24/7 dedicado',
      '📞 Ligação imediata para vagas urgentes',
      '🔔 Prioridade urgente (imediato)',
      '📋 Acompanhamento personalizado'
    ],
    variant: 'vip' as const
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'vaga-express-premium'
  
  const product = PRODUCTS[productId as keyof typeof PRODUCTS]
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto selecionado não existe ou foi descontinuado.</p>
          <a 
            href="/vaga-express" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Vaga Express
          </a>
        </div>
      </div>
    )
  }

  return (
    <ModernCheckoutFlow
      productId={productId}
      productName={product.name}
      price={product.price}
      description={product.description}
      features={product.features}
      variant={product.variant}
      onSuccess={() => {
        // Redirect para página de sucesso ou dashboard,        window.location.href = '/success?product=' + productId
      }}
    />
  )
}

export default function CheckoutFlowPage() {
  return (
    <>
      <title>Checkout - Vaga Express | Visa2Any</title>
      <meta name="description" content="Finalize sua compra do Vaga Express de forma segura e rápida. Monitoramento de vagas consulares em tempo real." />
      <meta name="robots" content="noindex, nofollow" />
      
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando checkout...</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  )
}