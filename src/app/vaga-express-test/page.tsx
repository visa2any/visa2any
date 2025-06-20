'use client'

import Link from 'next/link'

export default function VagaExpressTestPage() {
  const handleClick = (productId: string) => {
    const checkoutUrl = `/checkout-moderno?product=${encodeURIComponent(productId)}`
    window.location.href = checkoutUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste Vaga Express - SEM MODAL</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-2">🥉 Vaga Express Basic</h2>
            <div className="text-2xl font-bold text-blue-600 mb-4">R$ 297</div>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✅ Monitoramento por 30 dias</li>
              <li>📱 WhatsApp + Email</li>
              <li>🎯 1 país/consulado</li>
            </ul>
            <button
              onClick={() => handleClick('vaga-express-basic')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Escolher Basic
            </button>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-orange-500">
            <div className="text-center mb-2">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                MAIS POPULAR
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">🥈 Vaga Express Premium</h2>
            <div className="text-2xl font-bold text-blue-600 mb-4">R$ 497</div>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✅ Monitoramento por 60 dias</li>
              <li>📱 Multi-canal prioritário</li>
              <li>🌍 2 países/consulados</li>
              <li>💰 Garantia reembolso</li>
            </ul>
            <button
              onClick={() => handleClick('vaga-express-premium')}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
            >
              Escolher Premium
            </button>
          </div>

          {/* VIP */}
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center mb-2">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                👑 VIP
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">🥇 Vaga Express VIP</h2>
            <div className="text-2xl font-bold text-blue-600 mb-4">R$ 797</div>
            <ul className="space-y-2 mb-6 text-sm">
              <li>✅ Monitoramento por 90 dias</li>
              <li>🚨 Notificação 2 minutos</li>
              <li>🌎 Países ilimitados</li>
              <li>👨‍💼 Consultoria inclusa</li>
              <li>🎯 Suporte 24/7</li>
            </ul>
            <button
              onClick={() => handleClick('vaga-express-vip')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              Escolher VIP
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/vaga-express" className="text-blue-600 hover:underline">
            ← Voltar para página original
          </Link>
        </div>
      </div>
    </div>
  )
}