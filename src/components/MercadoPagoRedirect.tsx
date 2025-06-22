'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, CreditCard, Shield, CheckCircle } from 'lucide-react'

interface MercadoPagoRedirectProps {
  preferenceId: string
  publicKey: string
  onBack?: () => void
  amount: number
  customerData: {
    name: string
    email: string
    phone: string
  }
}

export default function MercadoPagoRedirect({
  preferenceId,
  publicKey,
  onBack,
  amount,
  customerData
}: MercadoPagoRedirectProps) {
  const [loading, setLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    // Buscar URL de redirect da preferência
    fetchRedirectUrl()
  }, [preferenceId])

  const fetchRedirectUrl = async () => {
    try {
      setLoading(true)
      
      // Determinar URL baseada no ambiente
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://www.mercadopago.com.br/checkout/v1/redirect'
        : 'https://sandbox.mercadopago.com.br/checkout/v1/redirect'
      
      const url = `${baseUrl}?pref_id=${preferenceId}`
      setRedirectUrl(url)
      
      console.log('🔗 URL de redirect gerada:', url)
      
    } catch (error) {
      console.error('❌ Erro ao gerar URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (redirectUrl) {
      console.log('🚀 Redirecionando para:', redirectUrl)
      window.location.href = redirectUrl
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar aos detalhes
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Finalizar Pagamento
            </h1>
            
            <p className="text-gray-600 mb-8">
              Você será redirecionado para o MercadoPago para completar o pagamento
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{customerData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customerData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Produto:</span>
                  <span className="font-medium">Consultoria Express</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !redirectUrl}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Preparando pagamento...
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Ir para o Pagamento
                </>
              )}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center text-sm text-green-600">
                <Shield className="h-4 w-4 mr-2" />
                Pagamento 100% seguro
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                <div className="flex flex-col items-center">
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span>Cartão</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">📱</span>
                  <span>PIX</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">🧾</span>
                  <span>Boleto</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Como funciona:</h4>
              <div className="space-y-2 text-sm text-gray-600 text-left">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span>Clique em "Ir para o Pagamento"</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span>Escolha sua forma de pagamento no MercadoPago</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span>Complete o pagamento de forma segura</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">4.</span>
                  <span>Você será redirecionado de volta para confirmação</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔐 Processado pelo MercadoPago - Líder em pagamentos online</p>
          <p className="mt-1">Preference ID: {preferenceId}</p>
        </div>
      </div>
    </div>
  )
}