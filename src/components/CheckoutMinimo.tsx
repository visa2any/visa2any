'use client'

import { useState } from 'react'
import { ArrowRight, Shield, Star, WhatsApp, CreditCard, Zap } from 'lucide-react'

export default function CheckoutMinimo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    terms: false
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.terms) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setIsProcessing(true)

    try {
      // Criar pagamento MercadoPago
      const response = await fetch('/api/payments/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.whatsapp
          },
          items: [{
            id: 'consultoria-express',
            title: 'Consultoria Express - Visa2Any',
            description: 'Análise completa do seu perfil para imigração',
            unit_price: 297,
            quantity: 1
          }]
        })
      })

      const data = await response.json()
      
      if (data.success && data.init_point) {
        // Salvar dados no localStorage (opcional)
        localStorage.setItem('cliente-dados', JSON.stringify(formData))
        
        // Redirecionar para MercadoPago
        
        window.location.href = data.init_point
      } else {
        alert('Erro ao processar pagamento. Tente novamente.')
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
            🚀 OFERTA LIMITADA
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Consultoria Express
          </h1>
          <p className="text-gray-600 mb-4">
            Análise completa em 48h
          </p>
          
          {/* Preço */}
          <div className="text-center">
            <div className="text-sm text-gray-500 line-through">R$ 497</div>
            <div className="text-4xl font-bold text-blue-600">R$ 297</div>
            <div className="text-sm text-green-600 font-medium">💰 Economize R$ 200</div>
          </div>
        </div>

        {/* Formulário Ultra-Simples */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="📝 Seu nome completo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="📧 Seu melhor email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="📱 WhatsApp (11) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              required
            />
          </div>

          {/* Checkbox simples */}
          <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
              className="mt-1 w-5 h-5 text-blue-600"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Aceito os <span className="text-blue-600">termos de serviço</span> e autorizo o contato via WhatsApp
            </label>
          </div>

          {/* Botão Principais */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="mr-2 h-5 w-5" />
                GARANTIR VAGA - R$ 297
              </div>
            )}
          </button>
        </form>

        {/* Trust Signals */}
        <div className="mt-6 space-y-3 text-center">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500 mr-2" />
            Pagamento 100% seguro
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            +2.000 clientes aprovados
          </div>
          <div className="text-xs text-gray-500">
            💳 PIX, Cartão ou Boleto • Parcelamento em até 12x
          </div>
        </div>

        {/* WhatsApp Alternativo */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Prefere falar direto?</p>
          <a
            href="https://wa.me/5511519447117?text=Olá! Quero contratar a Consultoria Express"
            target="_blank"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <WhatsApp className="mr-2 h-5 w-5" />
            WhatsApp Direto
          </a>
        </div>
      </div>
    </div>
  )
}