'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UltraCheckout from '@/components/UltraCheckout'
import { Loader2, Sparkles } from 'lucide-react'

// Dados dos produtos expandidos para UltraCheckout
const PRODUCTS = {
  'vaga-express-basic': {
    name: '🥉 Vaga Express Basic',
    price: 297,
    description: 'Monitoramento inteligente por 30 dias - Perfeito para 1 consulado',
    features: [
      '✅ Monitoramento automatizado por 30 dias',
      '📱 Notificações WhatsApp, Email e SMS',
      '🎯 1 país/consulado de sua escolha',
      '⏰ Vagas disponíveis até 30 dias de antecedência',
      '🔔 Prioridade média (notificação em 15 minutos)',
      '📊 Relatório semanal de atividade',
      '🌐 Acesso ao dashboard online',
      '📞 Suporte via chat durante horário comercial'
    ],
    variant: 'default' as const
  },
  'vaga-express-premium': {
    name: '🥈 Vaga Express Premium',
    price: 497,
    description: 'Monitoramento avançado por 60 dias - O mais popular com garantia de reembolso!',
    features: [
      '✅ Monitoramento avançado por 60 dias',
      '📱 Notificações multi-canal com prioridade alta',
      '🌍 Até 2 países/consulados simultaneamente',
      '⏰ Vagas disponíveis até 60 dias de antecedência',
      '💰 Garantia de reembolso total',
      '🔔 Prioridade alta (notificação em 5 minutos)',
      '📊 Relatório detalhado semanal com análises',
      '🎯 Suporte prioritário via WhatsApp',
      '📈 Estatísticas avançadas de disponibilidade',
      '🔄 Reagendamento automático quando disponível'
    ],
    variant: 'premium' as const
  },
  'vaga-express-vip': {
    name: '🥇 Vaga Express VIP',
    price: 797,
    description: 'Serviço completo por 90 dias - Inclui consultoria dedicada e suporte 24/7',
    features: [
      '✅ Monitoramento premium por 90 dias',
      '🚨 Notificação instantânea (dentro de 2 minutos)',
      '🌎 Países e consulados ilimitados',
      '👑 Prioridade máxima absoluta',
      '👨‍💼 Consultoria dedicada de 30 minutos inclusa',
      '🎯 Suporte VIP 24/7 via WhatsApp direto',
      '📞 Ligação telefônica imediata para vagas críticas',
      '🔔 Sistema de alerta multi-canal premium',
      '📋 Acompanhamento personalizado do seu caso',
      '🎓 Orientação completa sobre documentação',
      '⚡ Processamento prioritário em todas as etapas',
      '🏆 Garantia de satisfação ou reembolso integral'
    ],
    variant: 'vip' as const
  }
}

function UltraCheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'vaga-express-premium'
  
  const product = PRODUCTS[productId as keyof typeof PRODUCTS]
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto selecionado não existe ou foi descontinuado.</p>
          <a 
            href="/vaga-express" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Voltar para Vaga Express
          </a>
        </div>
      </div>
    )
  }

  return (
    <UltraCheckout
      productId={productId}
      productName={product.name}
      price={product.price}
      description={product.description}
      features={product.features}
      variant={product.variant}
      onSuccess={() => {
        // Redirect para página de sucesso personalizada,        window.location.href = `/success?product=${productId}&checkout=ultra`
      }}
    />
  )
}

export default function UltraCheckoutPage() {
  return (
    <>
      <title>Ultra Checkout - Vaga Express | Visa2Any</title>
      <meta name="description" content="Checkout ultramoderno para Vaga Express. Experiência premium de compra com recursos avançados e usabilidade superior." />
      <meta name="robots" content="noindex, nofollow" />
      
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">Carregando checkout ultramoderno...</p>
            <div className="mt-4 text-sm text-gray-500">
              Preparando a melhor experiência de compra para você ✨
            </div>
          </div>
        </div>
      }>
        <UltraCheckoutContent />
      </Suspense>
    </>
  )
}