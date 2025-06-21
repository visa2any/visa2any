'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Check, Lock, Loader2 } from 'lucide-react'

interface InlineCheckoutProps {
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

export default function InlineCheckout({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: InlineCheckoutProps) {
  const [loading, setLoading] = useState(true)
  const [mpInstance, setMpInstance] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const checkoutRef = useRef<HTMLDivElement>(null)
  const bricksRef = useRef<any>(null)

  useEffect(() => {
    loadMercadoPagoSDK()
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
    document.head.appendChild(script)
  }

  const initializeMercadoPago = async () => {
    try {
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })
      setMpInstance(mp)
      
      // Inicializar Checkout Bricks
      await initializeCheckoutBricks(mp)
      
    } catch (error) {
      console.error('Erro ao inicializar MercadoPago:', error)
      setError('Erro ao inicializar pagamento')
      setLoading(false)
    }
  }

  const initializeCheckoutBricks = async (mp: any) => {
    try {
      setLoading(true)
      
      const bricksBuilder = mp.bricks()
      
      // Configuração do Payment Brick
      const renderPaymentBrick = async () => {
        const settings = {
          initialization: {
            amount: amount,
            preferenceId: preferenceId,
            payer: {
              email: customerData.email,
            }
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              bankTransfer: 'all',
              atm: 'all',
              onboarding_credits: 'all'
            },
            visual: {
              style: {
                theme: 'default'
              }
            }
          },
          callbacks: {
            onReady: () => {
              console.log('Payment Brick carregado')
              setLoading(false)
            },
            onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
              try {
                console.log('Processando pagamento:', { selectedPaymentMethod, formData })
                
                // Processar pagamento
                const response = await fetch('/api/payments/process', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    formData,
                    selectedPaymentMethod,
                    preferenceId,
                    customerData
                  })
                })
                
                const result = await response.json()
                
                if (result.success) {
                  onSuccess?.(result)
                } else {
                  onError?.(result.error)
                }
                
              } catch (error) {
                console.error('Erro no processamento:', error)
                onError?.(error)
              }
            },
            onError: (error: any) => {
              console.error('Erro no Payment Brick:', error)
              onError?.(error)
            }
          }
        }
        
        bricksRef.current = await bricksBuilder.create('payment', 'payment-brick-container', settings)
      }
      
      await renderPaymentBrick()
      
    } catch (error) {
      console.error('Erro ao renderizar Payment Brick:', error)
      setError('Erro ao carregar formulário de pagamento')
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
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{customerData.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{customerData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
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
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Acompanhamento do processo
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
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Carregando formulário de pagamento...</span>
                </div>
              )}

              {/* Container para o MercadoPago Payment Brick */}
              <div id="payment-brick-container" ref={checkoutRef}></div>

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

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  )
}

function Phone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}