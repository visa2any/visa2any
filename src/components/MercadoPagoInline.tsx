'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Check, Lock } from 'lucide-react'

interface MercadoPagoInlineProps {
  preferenceId: string
  publicKey: string
  onSuccess?: (payment: any) => void
  onError?: (error: any) => void
  onBack?: () => void
  amount: number
  customerData: {
    name: string
    email: string
    phone: string
  }
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoInline({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: MercadoPagoInlineProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const checkoutRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    loadMercadoPagoSDK()
    
    // Cleanup ao desmontar
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current)
      }
    }
  }, [])

  const loadMercadoPagoSDK = () => {
    // Verificar se o SDK já está carregado
    if (window.MercadoPago) {
      initializeMercadoPago()
      return
    }

    // Carregar SDK do MercadoPago
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => {
      initializeMercadoPago()
    }
    script.onerror = () => {
      setError('Erro ao carregar SDK do MercadoPago')
      setLoading(false)
    }
    scriptRef.current = script
    document.head.appendChild(script)
  }

  const initializeMercadoPago = async () => {
    try {
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })
      
      // Configurar checkout preference
      await mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '#mercadopago-checkout',
          label: 'Finalizar Compra'
        },
        theme: {
          elementsColor: '#3b82f6',
          headerColor: '#1e40af'
        }
      })
      
      setLoading(false)
      
    } catch (error) {
      console.error('Erro ao inicializar MercadoPago:', error)
      setError('Erro ao inicializar pagamento')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar aos detalhes
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Finalizar Pagamento
                </h1>
                <p className="text-gray-600">
                  Complete os dados do pagamento para contratar o serviço
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Total a pagar</div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {amount.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="h-4 w-4 text-gray-400 mr-2">👤</div>
                  <span className="text-gray-600">{customerData.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-4 w-4 text-gray-400 mr-2">📧</div>
                  <span className="text-gray-600">{customerData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-4 w-4 text-gray-400 mr-2">📱</div>
                  <span className="text-gray-600">{customerData.phone}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">R$ {amount.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Benefícios */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Incluído no seu pedido:</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Consultoria especializada
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Suporte personalizado
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Documentação completa
                  </div>
                </div>
              </div>

              {/* Segurança */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Dados protegidos com SSL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados do Pagamento
                </h3>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800 text-sm">
                    {error}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">Carregando formulário de pagamento...</span>
                </div>
              )}

              {/* Container para o MercadoPago Checkout */}
              <div id="mercadopago-checkout" ref={checkoutRef}></div>

              {/* Métodos de Pagamento Aceitos */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Métodos de pagamento aceitos:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded text-sm">
                    💳 Cartão de Crédito
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded text-sm">
                    💳 Cartão de Débito
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded text-sm">
                    📱 PIX
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded text-sm">
                    🎫 Boleto
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}