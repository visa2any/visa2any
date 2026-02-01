'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CheckoutModerno from '@/components/CheckoutModerno'
import { Loader2, Sparkles } from 'lucide-react'

// Dados dos produtos expandidos
const PRODUCTS: Record<string, any> = {
  // Vaga Express
  'vaga-express-basic': {
    name: '🥉 Vaga Express Basic',
    price: 297,
    description: 'Monitoramento inteligente por 30 dias - Perfeito para 1 consulado',
    features: [
      'Monitoramento automatizado por 30 dias',
      'Notificações WhatsApp, Email e SMS',
      '1 país/consulado de sua escolha',
      'Vagas disponíveis até 30 dias de antecedência',
      'Prioridade média (notificação em 15 minutos)',
      'Relatório semanal de atividade'
    ],
    variant: 'default' as const,
    supportsQuantity: true
  },
  'vaga-express-premium': {
    name: '🥈 Vaga Express Premium',
    price: 497,
    description: 'Monitoramento avançado por 60 dias - O mais popular com garantia de reembolso!',
    features: [
      'Monitoramento avançado por 60 dias',
      'Notificações multi-canal com prioridade alta',
      'Até 2 países/consulados simultaneamente',
      'Vagas disponíveis até 60 dias de antecedência',
      'Garantia de reembolso total',
      'Prioridade alta (notificação em 5 minutos)',
      'Relatório detalhado semanal com análises',
      'Suporte prioritário via WhatsApp'
    ],
    variant: 'premium' as const,
    supportsQuantity: true
  },
  'vaga-express-vip': {
    name: '🥇 Vaga Express VIP',
    price: 797,
    description: 'Serviço completo por 90 dias - Inclui consultoria dedicada e suporte 24/7',
    features: [
      'Monitoramento premium por 90 dias',
      'Notificação instantânea (dentro de 2 minutos)',
      'Países e consulados ilimitados',
      'Prioridade máxima absoluta',
      'Consultoria dedicada de 30 minutos inclusa',
      'Suporte VIP 24/7 via WhatsApp direto',
      'Ligação telefônica imediata para vagas críticas',
      'Sistema de alerta multi-canal premium'
    ],
    variant: 'vip' as const,
    supportsQuantity: true
  },

  // Produtos da Página Principal
  'pre-analise': {
    name: '🤖 Pré-Análise IA',
    price: 29.90,
    description: 'Análise Profissional com IA',
    features: [
      'Análise IA em 15 minutos',
      'Score de elegibilidade',
      '3 recomendações principais',
      'Relatório PDF desbloqueado'
    ],
    variant: 'default' as const,
    supportsQuantity: false
  },
  'relatorio-premium': {
    name: '📄 Relatório Premium',
    price: 97,
    description: 'Análise completa e detalhada',
    features: [
      'Tudo do pacote anterior',
      'Análise de 15+ fatores',
      'Cronograma detalhado',
      'Lista de documentos necessários',
      'Dicas específicas para seu perfil'
    ],
    variant: 'premium' as const,
    supportsQuantity: false
  },
  'consultoria-express': {
    name: '👨‍💼 Consultoria 1:1',
    price: 297,
    description: 'Orientação especializada humana',
    features: [
      'Tudo do pacote anterior',
      '60min com especialista humano',
      'Análise ao vivo do seu caso',
      'Plano de ação personalizado',
      'Suporte WhatsApp 30 dias'
    ],
    variant: 'default' as const,
    supportsQuantity: false
  },

  // Produtos de Países (padrão base)
  'usa-free': {
    name: '🇺🇸 EUA - Análise Gratuita',
    price: 0,
    description: 'Análise inicial gratuita para EUA',
    features: [
      'Análise IA especializada em EUA',
      'Score de elegibilidade',
      'Recomendações básicas',
      'Resumo por email'
    ],
    variant: 'default' as const,
    supportsQuantity: false
  },
  'usa-report': {
    name: '🇺🇸 EUA - Relatório Detalhado',
    price: 197,
    description: 'Relatório completo para vistos americanos',
    features: [
      'Análise detalhada de documentos',
      'Estratégia personalizada',
      'Cronograma otimizado',
      'Lista de documentos completa'
    ],
    variant: 'premium' as const,
    supportsQuantity: false
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product') || 'vaga-express-premium'
  const adults = parseInt(searchParams.get('adults') || '1')
  const children = parseInt(searchParams.get('children') || '0')
  const totalFromUrl = parseInt(searchParams.get('total') || '0')
  const successUrl = searchParams.get('redirect') || ''

  let product = PRODUCTS[productId as keyof typeof PRODUCTS]

  // Fallback para produtos dinâmicos (países/vistos)

  if (!product) {
    // Tentar encontrar produto baseado em padrões
    if (productId.includes('-free')) {
      const country = productId.split('-')[0] || 'Geral'
      product = {
        name: `${country.toUpperCase()} - Análise Gratuita`,
        price: 0,
        description: 'Análise inicial gratuita',
        features: [
          'Análise IA especializada',
          'Score de elegibilidade',
          'Recomendações básicas',
          'Resumo por email'
        ],
        variant: 'default' as const,
        supportsQuantity: false
      }
    } else if (productId.includes('-report')) {
      const country = productId.split('-')[0] || 'Geral'
      product = {
        name: `${country.toUpperCase()} - Relatório Premium`,
        price: 197,
        description: 'Relatório detalhado especializado',
        features: [
          'Análise detalhada de documentos',
          'Estratégia personalizada',
          'Cronograma otimizado',
          'Lista de documentos completa'
        ],
        variant: 'premium' as const,
        supportsQuantity: false
      }
    } else {
      // Produto genérico
      product = {
        name: 'Serviço Personalizado',
        price: 97,
        description: 'Serviço especializado para seu caso',
        features: [
          'Análise personalizada',
          'Orientação especializada',
          'Suporte dedicado',
          'Resultado garantido'
        ],
        variant: 'default' as const,
        supportsQuantity: false
      }
    }
  }

  // Para produtos que não suportam quantidade
  // usar valores padrão
  const finalAdults = product.supportsQuantity ? adults : 1
  const finalChildren = product.supportsQuantity ? children : 0
  const finalPrice = (product.supportsQuantity && totalFromUrl > 0) ? totalFromUrl : product.price
  const originalPrice = product.supportsQuantity ? product.price : undefined

  return (
    <CheckoutModerno
      productId={productId}
      productName={product.name}
      price={finalPrice}
      originalPrice={originalPrice}
      adults={finalAdults}
      children={finalChildren}
      description={product.description}
      features={product.features}
      variant={product.variant}
      title="Finalizar Pedido"
      subtitle="Complete seus dados para ativar o monitoramento"
      ctaText="Contratar Agora"
      supportsQuantity={product.supportsQuantity}
      showGroupDiscount={product.supportsQuantity}
      successUrl={successUrl}
    />
  )
}

export default function CheckoutModernoPage() {
  return (
    <>
      <title>Checkout Moderno - Vaga Express | Visa2Any</title>
      <meta name="description" content="Checkout moderno e sem modais para Vaga Express. Experiência de compra otimizada e sem fricção." />
      <meta name="robots" content="noindex, nofollow" />

      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">Carregando checkout moderno...</p>
            <div className="mt-4 text-sm text-gray-500">
              Sem modais, sem fricção ✨
            </div>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  )
}