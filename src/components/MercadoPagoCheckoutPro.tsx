'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield } from 'lucide-react'

interface MercadoPagoCheckoutProProps {
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

export default function MercadoPagoCheckoutPro({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: MercadoPagoCheckoutProProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('🚀 Iniciando Checkout Pro')
    console.log('📝 Preference ID:', preferenceId)
    console.log('🔑 Public Key:', publicKey)
    
    initializeCheckoutPro()
  }, [])

  const initializeCheckoutPro = async () => {
    try {
      // Carregar SDK se necessário
      if (!window.MercadoPago) {
        console.log('📦 Carregando SDK...')
        await loadSDK()
      }

      console.log('🔧 Inicializando Checkout Pro...')
      
      if (!containerRef.current) {
        throw new Error('Container não encontrado')
      }

      // Limpar container

      containerRef.current.innerHTML = ''

      // Criar instância do MercadoPago

      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      // Usar Checkout Pro (modo mais simples e confiável)

      const checkout = mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '#checkout-pro-container',
          label: 'Pagar'
        }
      })

      console.log('✅ Checkout Pro criado!')
      setLoading(false)

    } catch (error) {
      console.error('❌ Erro:', error)
      setError(`Erro: ${error}`)
      setLoading(false)
    }
  }

  const loadSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true
      
      script.onload = () => {
        console.log('📦 SDK carregado')
        resolve()
      }
      
      script.onerror = () => {
        console.error('❌ Erro ao carregar SDK')
        reject(new Error('Falha no SDK'))
      }

      document.head.appendChild(script)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar aos detalhes
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Finalizar Pagamento
              </h1>
              <p className="text-gray-600">
                Para: {customerData.name}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Consultoria Express
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  R$ {amount.toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="h-4 w-4 mr-1" />
                  Pagamento seguro
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Escolha sua forma de pagamento
          </h2>
          
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando checkout...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tentar Novamente
              </button>
            </div>
          )}
          
          <div
            id="checkout-pro-container"
            ref={containerRef}
            className="min-h-[400px]"
          />
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-1" />
            Pagamento seguro processado pelo MercadoPago
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Preference: {preferenceId}
          </p>
        </div>
      </div>
    </div>
  )
}