'use client'

import { useState } from 'react'

export default function CheckoutTest() {
  const [showInline, setShowInline] = useState(false)
  
  const handleClick = () => {
    console.log('🧪 Teste: Botão clicado!')
    setShowInline(true)
  }
  
  if (showInline) {
    return (
      <div className="min-h-screen bg-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            ✅ CHECKOUT INLINE ATIVO!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            O checkout inline está funcionando. Aqui seria mostrado o formulário do MercadoPago.
          </p>
          <button 
            onClick={() => setShowInline(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            ← Voltar para o checkout
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
      <h2 className="text-xl font-bold mb-4">🧪 Teste do Checkout Inline</h2>
      <p className="text-gray-600 mb-4">
        Este é um teste para verificar se o checkout inline está funcionando.
      </p>
      <button 
        onClick={handleClick}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
      >
        🚀 TESTAR CHECKOUT INLINE
      </button>
    </div>
  )
}