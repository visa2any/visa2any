'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield } from 'lucide-react'

interface MercadoPagoCleanProps {
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

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoClean({
  preferenceId,
  publicKey,
  onBack,
  amount,
  customerData
}: MercadoPagoCleanProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)

  useEffect(() => {
    // Garantir que só executa uma vez
    if (initializationAttempted) return
    
    setInitializationAttempted(true)
    initializePayment()
  }, [])

  const initializePayment = async () => {
    try {
      // Limpar completamente o container primeiro
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      // Carregar SDK se não existe

      if (!window.MercadoPago) {
        console.log('🔄 Carregando SDK...')
        await loadSDK()
      }

      // Configurar MercadoPago

      console.log('🔧 Configurando MercadoPago...')
      console.log(`📋 Dados da configuração:`, {
        publicKey,
        preferenceId,
        amount,
        customerData
      })
      
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      // Criar brick

      console.log('🧱 Criando Payment Brick...')
      const bricksBuilder = mp.bricks()
      
      const config = {
        initialization: {
          amount: amount,
          preferenceId: preferenceId,
          payer: {
            firstName: customerData.name.split(' ')[0] || 'Cliente',
            lastName: customerData.name.split(' ').slice(1).join(' ') || 'Visa2Any',
            email: customerData.email,
            entityType: 'individual'
          }
        },
        customization: {
          visual: {
            style: {
              theme: 'default'
            }
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            mercadoPago: 'all'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Brick pronto!')
            setLoading(false)
            setSdkLoaded(true)
          },
          onSubmit: async (data: any) => {
            console.log('💳 Dados do pagamento:', data)
            
            try {
              const response = await fetch('/api/payments/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  selectedPaymentMethod: data.selectedPaymentMethod,
                  formData: data.formData,
                  preferenceId: preferenceId
                })
              })

              const result = await response.json()
              console.log('📊 Resultado:', result)
              
              if (result.success) {
                alert(`Pagamento processado! ID: ${result.payment_id}`)
              } else {
                alert(`Erro: ${result.error}`)
              }
            } catch (error) {
              console.error('❌ Erro:', error)
              alert('Erro de comunicação')
            }
          },
          onError: (error: any) => {
            console.error('❌ Erro do brick detalhado:', error)
            console.error('❌ Tipo do erro:', typeof error)
            console.error('❌ Stack do erro:', error.stack)
            setError(`Erro na inicialização: ${error.message || error.cause || JSON.stringify(error)}`)
          }
        }
      }
      
      console.log('🎯 Configuração final do brick:', JSON.stringify(config, null, 2))
      
      // Configuração com tipos de pagamento especificados
      
      await bricksBuilder.create('payment', 'payment-container-clean', config)

    } catch (error) {
      console.error('❌ Erro geral:', error)
      setError(`Erro na inicialização: ${error}`)
      setLoading(false)
    }
  }

  const loadSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Verificar se já existe script
      const existingScript = document.querySelector('script[src*="mercadopago"]')
      if (existingScript) {
        if (window.MercadoPago) {
          resolve()
        } else {
          // Script existe mas SDK não carregou
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () => reject(new Error('Falha no script existente')))
        }
        return
      }

      // Criar novo script

      const script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true
      
      script.onload = () => {
        if (window.MercadoPago) {
          resolve()
        } else {
          reject(new Error('SDK não disponível após carregamento'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Falha ao carregar SDK'))
      }

      document.head.appendChild(script)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pagamento</h1>
              <p className="text-gray-600">R$ {amount.toFixed(2)} - {customerData.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
          
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Carregando opções de pagamento...</p>
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
            id="payment-container-clean"
            ref={containerRef}
            className="min-h-[400px]"
          />
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-1" />
            Pagamento seguro processado pelo MercadoPago
          </div>
        </div>
      </div>
    </div>
  )
}
