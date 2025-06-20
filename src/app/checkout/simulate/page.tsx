'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react'

function SimulatePaymentPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const amount = searchParams.get('amount')
  const title = searchParams.get('title')
  const [isProcessing, setIsProcessing] = useState(false)

  const simulatePayment = async (status: 'approved' | 'rejected') => {
    setIsProcessing(true)
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (status === 'approved') {
        // Redirecionar para success
        window.location.href = `/success?payment_id=simulated-${orderId}&status=approved&external_reference=${orderId}`
      } else {
        // Redirecionar para falha
        window.location.href = `/cliente?payment=failed&order=${orderId}`
      }
    } catch (error) {
      console.error('Erro na simulação:', error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="h-10 w-10 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          💳 Simulador de Pagamento
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Detalhes do Pedido:</h3>
          <div className="space-y-2 text-left">
            <div><strong>Pedido:</strong> {orderId}</div>
            <div><strong>Produto:</strong> {decodeURIComponent(title || '')}</div>
            <div><strong>Valor:</strong> R$ {amount}</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center text-yellow-700">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">
              🚀 MODO DESENVOLVIMENTO - Escolha o resultado do pagamento
            </span>
          </div>
        </div>

        {!isProcessing ? (
          <div className="space-y-4">
            <Button
              onClick={() => simulatePayment('approved')}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              ✅ Simular Pagamento APROVADO
            </Button>
            
            <Button
              onClick={() => simulatePayment('rejected')}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50 text-lg py-4"
            >
              <XCircle className="mr-2 h-5 w-5" />
              ❌ Simular Pagamento REJEITADO
            </Button>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                📝 Esta página só aparece em desenvolvimento.<br/>
                Em produção, você seria redirecionado para o Mercado Pago.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-600 font-medium">Processando pagamento...</span>
            </div>
            <p className="text-gray-600">Aguarde alguns segundos...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <SimulatePaymentPageContent />
    </Suspense>
  )
}