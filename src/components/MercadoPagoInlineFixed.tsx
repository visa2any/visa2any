'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Copy, CheckCircle2, Clock, Smartphone } from 'lucide-react'

interface MercadoPagoInlineFixedProps {
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

export default function MercadoPagoInlineFixed({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: MercadoPagoInlineFixedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [showPixCode, setShowPixCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('🚀 Iniciando MercadoPago Inline Fixed')
    initializeCheckout()
    
    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  const initializeCheckout = async () => {
    try {
      console.log('1️⃣ Carregando SDK...')
      
      // Carregar SDK se necessário
      
      if (!window.MercadoPago) {
        await loadSDK()
      }

      console.log('2️⃣ Inicializando MercadoPago...')
      
      // Aguardar DOM estar pronto
      
      if (!containerRef.current) {
        throw new Error('Container não encontrado')
      }

      // Limpar container

      containerRef.current.innerHTML = ''

      // Criar instância do MercadoPago

      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      console.log('3️⃣ Criando Checkout Bricks...')

      // Usar Checkout Bricks (não Payment Bricks)

      const bricks = mp.bricks()

      // CORREÇÃO: Usar preferenceId diretamente no lugar de amount

      const settings = {
        initialization: {
          preferenceId: preferenceId
        },
        customization: {
          visual: {
            style: {
              theme: 'default'
            }
          }
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Checkout pronto!')
            setLoading(false)
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            console.log('💳 Pagamento enviado:', { selectedPaymentMethod, formData })
            
            try {
              // Processar pagamento via nossa API
              const response = await fetch('/api/payments/process-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  selectedPaymentMethod,
                  formData,
                  preferenceId
                })
              })

              const result = await response.json()
              console.log('📊 Resultado:', result)

              if (result.success) {
                if (selectedPaymentMethod === 'pix' || selectedPaymentMethod === 'bank_transfer') {
                  setPaymentResult(result)
                  setShowPixCode(true)
                  
                  // Enviar email PIX
                  
                  sendPixEmail(result.qr_code)
                } else {
                  onSuccess?.(result)
                }
              } else {
                setError(result.error || 'Erro ao processar pagamento')
              }
            } catch (error) {
              console.error('❌ Erro:', error)
              setError('Erro de comunicação')
            }
          },
          onError: (error: any) => {
            console.error('❌ Erro do checkout:', error)
            setError(`Erro: ${error.message || 'Erro desconhecido'}`)
          }
        }
      }

      console.log('4️⃣ Configuração:', settings)
      console.log('5️⃣ Criando wallet brick...')

      // CORREÇÃO: Usar 'wallet' em vez de 'payment'

      await bricks.create('wallet', 'checkout-container', settings)
      
      console.log('🎉 Checkout criado com sucesso!')

    } catch (error) {
      console.error('❌ Erro geral:', error)
      setError(`Erro na inicialização: ${error}`)
      setLoading(false)
    }
  }

  const loadSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Remover scripts existentes para evitar conflitos
      document.querySelectorAll('script[src*="mercadopago"]').forEach(script => {
        script.remove()
      })

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

  const sendPixEmail = async (pixCode: string) => {
    try {
      await fetch('/api/communications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'email',
          clientId: 'payment-' + Date.now(),
          subject: 'Código PIX - Visa2Any',
          content: `
            <h2>🎯 Código PIX Gerado</h2>
            <p>Olá ${customerData.name},</p>
            <p>Seu código PIX:</p>
            <code>${pixCode}</code>
            <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
          `,
          template: true
        })
      })
    } catch (error) {
      console.error('Erro ao enviar email:', error)
    }
  }

  const copyPixCode = async () => {
    if (paymentResult?.qr_code) {
      try {
        await navigator.clipboard.writeText(paymentResult.qr_code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Erro ao copiar:', error)
      }
    }
  }

  // Tela PIX

  if (showPixCode && paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              PIX Gerado com Sucesso!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Escaneie o QR Code ou copie o código PIX
            </p>

            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg mb-6 flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Expira em 30 minutos
            </div>

            {paymentResult.qr_code_base64 && (
              <div className="mb-6">
                <img 
                  src={`data:image/png;base64,${paymentResult.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg"
                />
              </div>
            )}
            
            <div className="bg-gray-50 border rounded-lg p-4 mb-4">
              <code className="text-sm break-all">
                {paymentResult.qr_code}
              </code>
            </div>
            
            <button
              onClick={copyPixCode}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2 inline" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mr-2 inline" />
                  Copiar Código PIX
                </>
              )}
            </button>

            <p className="text-sm text-gray-600 mt-4">
              📧 Código enviado para: {customerData.email}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar aos detalhes
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
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
        </div>

        {/* Checkout Container */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando checkout...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Escolha sua forma de pagamento
              </h2>
              <div
                id="checkout-container"
                ref={containerRef}
                className="min-h-[400px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}