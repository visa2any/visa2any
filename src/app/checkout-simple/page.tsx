'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react'
import Link from 'next/link'

export default function SimpleCheckoutPage() {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    terms: false
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  const isFormValid = customerData.name && customerData.email && customerData.phone && customerData.terms
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) return
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/payments/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone
          },
          items: [{
            id: 'vaga-express-vip',
            title: '🥇 Vaga Express VIP',
            description: 'Monitoramento premium por 90 dias com consultoria dedicada',
            unit_price: 797,
            quantity: 1
          }],
          payer: {
            name: customerData.name,
            email: customerData.email,
            phone: { number: customerData.phone }
          },
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          external_reference: `simple-vip-${Date.now()}`
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.init_point) {
        window.location.href = data.init_point
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/vaga-express" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para Vaga Express
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Checkout Simples
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={customerData.terms}
                      onChange={(e) => setCustomerData({...customerData, terms: e.target.checked})}
                      className="mt-1 mr-3"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      Eu concordo com os Termos de Serviço e Política de Privacidade
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    isFormValid && !isProcessing
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Finalizar Compra - R$ 797
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>🥇 Vaga Express VIP</span>
                  <span>R$ 797</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ 797</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Pagamento 100% seguro
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Ativação em 30 minutos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}