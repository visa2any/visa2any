'use client'

import CheckoutModerno from '@/components/CheckoutModerno'

export default function TesteCheckoutPage() {
  const sampleProduct = {
    id: 'consultoria-express-teste',
    name: 'Consultoria Express - Teste',
    description: 'Teste do checkout inline com MercadoPago',
    originalPrice: 397,
    currentPrice: 297,
    features: [
      '60 minutos com especialista',
      'Análise completa do seu caso',
      'Plano de ação personalizado',
      'Suporte WhatsApp por 30 dias',
      'Relatório em PDF'
    ],
    variant: 'consultation' as const,
    category: 'teste',
    popular: true
  }

  return (
    <div>
      <CheckoutModerno
        title="Teste do Checkout Inline"
        subtitle="Teste para verificar o funcionamento do checkout inline"
        ctaText="Testar Checkout"
        products={[sampleProduct]}
        supportsQuantity={false}
        showGroupDiscount={false}
      />
    </div>
  )
}