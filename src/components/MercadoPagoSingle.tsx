'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Copy, CheckCircle2, Clock, Smartphone } from 'lucide-react'

// CONTROLE GLOBAL ÚNICO para evitar duplicação
let globalMPInstance: any = null
let isInitializing = false
let initializationPromise: Promise<any> | null = null
const CONTAINER_ID = 'mp-single-container'

interface MercadoPagoSingleProps {
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

interface PaymentBrickCallbackParams {
  selectedPaymentMethod: string
  formData: Record<string, any>
}

interface PaymentBrickError {
  message: string
  [key: string]: any
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoSingle({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: MercadoPagoSingleProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [showPixCode, setShowPixCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const paymentCheckInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    console.log('🎯 MercadoPago Single - Iniciando')
    console.log('🔍 Verificando estado global...')
    console.log('🔑 Public Key recebida:', publicKey?.substring(0, 10) + '...')

    // Verificar se já existe instância global
    if (globalMPInstance) {
      console.log('⚠️ Instância global já existe - reutilizando')
      setLoading(false)
      return
    }

    // Verificar se já está inicializando
    if (isInitializing) {
      console.log('⚠️ Já está inicializando - aguardando...')
      if (initializationPromise) {
        initializationPromise.then(() => setLoading(false))
      }
      return
    }

    // Aguardar próximo tick para garantir que DOM está renderizado
    const timer = setTimeout(() => {
      console.log('🚀 Criando nova instância única (após DOM ready)')
      initializationPromise = initializeSingleInstance()
    }, 100)

    return () => {
      console.log('🧹 Cleanup component (mantendo instância global)')
      clearTimeout(timer)
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current)
      }
    }
  }, [])

  const initializeSingleInstance = async () => {
    try {
      isInitializing = true
      console.log('1️⃣ Carregando SDK...')

      // Carregar SDK se necessário
      if (!window.MercadoPago) {
        await loadSDK()
      }

      console.log('2️⃣ Verificando container...')

      // Container agora sempre existe no DOM
      const container = document.getElementById(CONTAINER_ID)
      if (!container) {
        throw new Error(`Container ${CONTAINER_ID} não encontrado`)
      }

      // Limpar container
      container.innerHTML = ''
      console.log('3️⃣ Container limpo e pronto')

      console.log('4️⃣ Criando instância MercadoPago...')

      // Criar instância global única
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      console.log('5️⃣ Criando Checkout Bricks...')

      const bricks = mp.bricks()

      console.log('6️⃣ Configurando Payment Brick...')

      let brickInstance: any = null

      brickInstance = await bricks.create('payment', CONTAINER_ID, {
        initialization: {
          preferenceId: preferenceId,
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
            bankTransfer: 'all'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Payment Brick pronto!')
            console.log('🎯 Estado: loading será definido como false')
            globalMPInstance = brickInstance
            setLoading(false)
            isInitializing = false
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: PaymentBrickCallbackParams) => {
            console.log('💳 Pagamento enviado:', { selectedPaymentMethod, formData })

            try {
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
                  sendPixEmail(result.qr_code)

                  // Iniciar verificação automática de pagamento
                  startPaymentVerification(result.payment_id)
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
          onError: (error: PaymentBrickError) => {
            console.error('❌ Erro do Payment Brick:', error)
            setError(`Erro: ${error.message || 'Erro na inicialização'}`)
            isInitializing = false
          }
        }
      })

      console.log('🎉 Instância única criada com sucesso!')

    } catch (error) {
      console.error('❌ Erro geral:', error)
      setError(`Erro: ${error}`)
      setLoading(false)
      isInitializing = false
    }
  }


  const loadSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Verificar se script já existe
      const existingScript = document.querySelector('script[src*="mercadopago"]')
      if (existingScript) {
        if (window.MercadoPago) {
          resolve()
        } else {
          existingScript.addEventListener('load', () => resolve())
        }
        return
      }

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

  const startPaymentVerification = (paymentId: string) => {
    console.log('🔄 Iniciando verificação automática de pagamento:', paymentId)
    setCheckingPayment(true)

    // Verificar a cada 5 segundos
    paymentCheckInterval.current = setInterval(async () => {
      try {
        console.log('🔍 Verificando status do pagamento...')

        const response = await fetch(`/api/payments/check-status?payment_id=${paymentId}`)
        const result = await response.json()

        if (result.success) {
          if (result.status === 'approved') {
            console.log('✅ Pagamento aprovado!')

            // Parar verificação
            if (paymentCheckInterval.current) {
              clearInterval(paymentCheckInterval.current)
            }

            // Chamar callback de sucesso
            onSuccess?.(result)

            // Ou redirecionar diretamente
            // window.location.href = '/success?payment=approved'

          } else if (result.status === 'cancelled' || result.status === 'rejected') {
            console.log('❌ Pagamento cancelado/rejeitado')

            // Parar verificação
            if (paymentCheckInterval.current) {
              clearInterval(paymentCheckInterval.current)
            }

            setCheckingPayment(false)
            setError('Pagamento cancelado ou rejeitado')
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error)
      }
    }, 5000) // Verifica a cada 5 segundos

    // Parar verificação após 15 minutos
    setTimeout(() => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current)
        setCheckingPayment(false)
        console.log('⏰ Verificação automática encerrada após 15 minutos')
      }
    }, 15 * 60 * 1000)
  }

  const stopPaymentVerification = () => {
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current)
      paymentCheckInterval.current = null
    }
    setCheckingPayment(false)
    console.log('🛑 Verificação de pagamento interrompida')
  }

  const exitPixScreen = () => {
    console.log('🚪 Saindo da tela PIX - resetando formulário')

    stopPaymentVerification()
    setShowPixCode(false)
    setPaymentResult(null)
    setError('')

    // CRÍTICO: Resetar estado global para forçar re-criação do formulário
    globalMPInstance = null
    isInitializing = false
    initializationPromise = null

    // Limpar container completamente
    const container = document.getElementById(CONTAINER_ID)
    if (container) {
      container.innerHTML = ''
    }

    // Resetar estado para forçar re-render completo
    setLoading(true)

    // Re-inicializar imediatamente (sem delay para melhor UX)
    console.log('🔄 Re-inicializando MercadoPago após sair do PIX')
    setTimeout(() => {
      initializationPromise = initializeSingleInstance()
    }, 100)
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
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={exitPixScreen}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao checkout
            </button>

            {checkingPayment && (
              <div className="flex items-center text-green-600 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
                Verificando pagamento...
              </div>
            )}
          </div>

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
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${copied
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  📧 Código enviado para: <strong>{customerData.email}</strong>
                </p>

                {checkingPayment ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-center text-green-700 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
                      <span className="font-medium">Aguardando pagamento</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Assim que você efetuar o pagamento, será redirecionado automaticamente para a página de confirmação.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>💡 Dica:</strong> Após efetuar o pagamento, aguarde alguns segundos.
                      O sistema detectará automaticamente e você será redirecionado.
                    </p>
                  </div>
                )}

                <button
                  onClick={exitPixScreen}
                  className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
                >
                  Cancelar e escolher outro método de pagamento
                </button>
              </div>
            </div>
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
              <p className="text-gray-600">Carregando checkout seguro...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => {
                    // Reset global state
                    globalMPInstance = null
                    isInitializing = false
                    initializationPromise = null
                    window.location.reload()
                  }}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Escolha sua forma de pagamento
            </h2>
            <div
              id={CONTAINER_ID}
              ref={containerRef}
              className="min-h-[400px]"
              style={{
                display: 'block',
                opacity: (!loading && !error) ? 1 : 0.3,
                visibility: (!loading && !error) ? 'visible' : 'visible'
              }}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center">
            <Shield className="h-4 w-4 mr-1" />
            Pagamento seguro - MercadoPago
          </div>
          {globalMPInstance && (
            <p className="text-xs text-green-600 mt-1">✅ Instância única ativa</p>
          )}
        </div>
      </div>
    </div>
  )
}
