'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Check, Lock, Copy, CheckCircle2, Clock, Smartphone, Receipt, Zap } from 'lucide-react'

// Controle global para evitar duplicatas
let isCreatingBrick = false
let brickCount = 0
const CONTAINER_ID = 'mercadopago-checkout-premium'

interface MercadoPagoVisualUpgradeProps {
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

interface PaymentMethodData {
  id: string
  type: string
  name: string
}

interface FormData {
  [key: string]: any
}

declare global {
  interface Window {
    MercadoPago: any
    __mercadoPagoInitialized: boolean
    __mercadoPagoBrick: any
  }
}

export default function MercadoPagoVisualUpgrade({
  preferenceId,
  publicKey,
  onSuccess,
  onError,
  onBack,
  amount,
  customerData
}: MercadoPagoVisualUpgradeProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [showPixCode, setShowPixCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const checkoutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCreatingBrick) {
      setLoading(false)
      return
    }
    
    const container = document.getElementById(CONTAINER_ID)
    if (container && container.children.length > 0) {
      setLoading(false)
      return
    }
    
    if (brickCount > 0) {
      setLoading(false)
      return
    }
    
    isCreatingBrick = true
    brickCount++
    loadMercadoPagoSDK()
    
    return () => {
      // Não resetar flags globais
    }
  }, [preferenceId])

  const loadMercadoPagoSDK = () => {
    if (window.MercadoPago) {
      initializeMercadoPago()
      return
    }

    const timeout = setTimeout(() => {
      setError('Timeout ao carregar SDK do MercadoPago')
      setLoading(false)
      isCreatingBrick = false
    }, 30000)

    if (document.querySelector('script[src*="mercadopago"]')) {
      clearTimeout(timeout)
      initializeMercadoPago()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true

    script.onload = () => {
      clearTimeout(timeout)
      if (window.MercadoPago) {
        initializeMercadoPago()
      }
    }

    script.onerror = () => {
      clearTimeout(timeout)
      setError('Erro ao carregar SDK do MercadoPago')
      setLoading(false)
      isCreatingBrick = false
    }

    document.head.appendChild(script)
  }

  const initializeMercadoPago = async () => {
    try {
      if (!window.MercadoPago) {
        throw new Error('MercadoPago SDK não carregado')
      }

      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      const bricksBuilder = mp.bricks()

      // Limpar container se necessário

      const container = document.getElementById(CONTAINER_ID)
      if (container) {
        container.innerHTML = ''
      }

      const brick = await bricksBuilder.create('payment', CONTAINER_ID, {
        initialization: {
          amount: amount,
          preferenceId: preferenceId,
          payer: {
            firstName: customerData.name.split(' ')[0] || 'Cliente',
            lastName: customerData.name.split(' ').slice(1).join(' ') || 'Visa2Any',
            email: customerData.email,
            phone: {
              areaCode: '',
              number: ''
            },
            identification: {
              type: '',
              number: ''
            },
            address: {
              zipCode: '',
              streetName: '',
              streetNumber: '',
              neighborhood: '',
              city: '',
              federalUnit: ''
            },
            entityType: 'individual'
          }
        },
        customization: {
          visual: {
            style: {
              theme: 'default',
              customVariables: {
                fontSizeBase: '16px',
                fontFamily: 'Arial, sans-serif',
                baseColor: '#3b82f6',
                baseColorFirstVariant: '#1e40af',
                baseColorSecondVariant: '#1d4ed8',
                errorColor: '#ef4444',
                successColor: '#10b981',
                outlinePrimaryColor: '#3b82f6',
                outlineSecondaryColor: '#6b7280',
                buttonTextColor: '#ffffff',
                fontWeightNormal: '400',
                fontWeightSemiBold: '600',
                borderRadiusBase: '12px',
                formBackgroundColor: '#ffffff'
              }
            }
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            mercadoPago: 'all',
            atm: 'all'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('🎯 MercadoPago Brick carregado com sucesso!')
            setLoading(false)
            isCreatingBrick = false
            
            // Aplicar estilos premium em múltiplas tentativas para garantir sucesso
            
            setTimeout(() => applyPremiumStyles(), 500)
            setTimeout(() => applyPremiumStyles(), 1500)
            setTimeout(() => applyPremiumStyles(), 3000)
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: { selectedPaymentMethod: PaymentMethodData, formData: FormData }) => {
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

              if (result.success) {
                if (selectedPaymentMethod.type === 'pix' || selectedPaymentMethod.type === 'bank_transfer') {
                  setPaymentResult(result)
                  setShowPixCode(true)
                  
                  // Enviar email automático com PIX
                  
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
                          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #3b82f6;">🎯 Código PIX Gerado</h2>
                            <p>Olá ${customerData.name},</p>
                            <p>Seu código PIX foi gerado com sucesso:</p>
                            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
                              <code style="word-break: break-all;">${result.qr_code}</code>
                            </div>
                            <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
                            <p><strong>Validade:</strong> 30 minutos</p>
                            <p>Obrigado por escolher a Visa2Any!</p>
                          </div>
                        `,
                        template: true
                      })
                    })
                  } catch (emailError) {
                    console.error('Erro ao enviar email:', emailError)
                  }
                } else {
                  onSuccess?.(result)
                }
              } else {
                setError(result.error || 'Erro ao processar pagamento')
              }
            } catch (error) {
              console.error('Erro no pagamento:', error)
              setError('Erro de comunicação. Tente novamente.')
            }
          },
          onError: (error: any) => {
            console.error('Erro no MercadoPago:', error)
            setError('Erro no processamento. Tente novamente.')
            onError?.(error)
          }
        }
      })

    } catch (error) {
      console.error('Erro ao inicializar MercadoPago:', error)
      setError('Erro ao inicializar pagamento')
      setLoading(false)
      isCreatingBrick = false
    }
  }

  const applyPremiumStyles = () => {
    const container = document.getElementById(CONTAINER_ID)
    if (!container) {
      // Tentar novamente em 500ms se container não existe
      setTimeout(applyPremiumStyles, 500)
      return
    }

    // Verificar se já aplicou estilos para evitar duplicação

    if (container.getAttribute('data-styled') === 'true') {
      return
    }
    container.setAttribute('data-styled', 'true')

    // Aplicar estilos container principal sem sobrescrever conteúdo

    const existingStyles = container.style.cssText
    container.style.cssText = existingStyles + `
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
      border-radius: 20px !important;
      padding: 32px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid rgba(59, 130, 246, 0.1) !important;
      position: relative !important;
    `

    // Adicionar borda superior colorida se não existe

    if (!container.querySelector('.premium-top-border')) {
      const topBorder = document.createElement('div')
      topBorder.className = 'premium-top-border'
      topBorder.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 4px !important;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #10b981) !important;
        border-radius: 20px 20px 0 0 !important;
        z-index: 1 !important;
      `
      container.insertBefore(topBorder, container.firstChild)
    }

    // Função para aplicar estilos aos métodos de pagamento - mais robusta

    const stylePaymentMethods = () => {
      // Selecionar métodos de pagamento com múltiplos seletores
      const selectors = [
        '[data-cy="payment-method-option"]',
        '.mp-payment-method-item',
        '.cho-payment-method', 
        '[class*="payment-method"]',
        '[class*="ChoPaymentMethod"]',
        '.payment-method',
        'button[role="option"]',
        '[data-testid*="payment"]'
      ]
      
      let methods: Element[] = []
      selectors.forEach(selector => {
        const found = container.querySelectorAll(selector)
        found.forEach(el => {
          if (!methods.includes(el)) methods.push(el)
        })
      })

      if (methods.length === 0) {
        // Se não encontrou
        // tentar novamente em 1 segundo
        setTimeout(stylePaymentMethods, 1000)
        return
      }

      console.log(`🎨 Aplicando estilos a ${methods.length} métodos de pagamento`)
      
      methods.forEach((method, index) => {
        const element = method as HTMLElement
        
        // Pular se já foi estilizado
        
        if (element.getAttribute('data-premium-styled') === 'true') {
          return
        }
        element.setAttribute('data-premium-styled', 'true')

        // Preservar conteúdo original

        const originalContent = element.innerHTML
        const originalText = element.textContent?.trim() || ''
        
        // Determinar tipo de pagamento
        
        let icon = '💳'
        let color = '#3b82f6'
        let subtitle = 'Pagamento seguro'
        
        const lowerText = originalText.toLowerCase()
        if (lowerText.includes('pix')) {
          icon = '📱'
          color = '#10b981'
          subtitle = 'Instantâneo e seguro'
        } else if (lowerText.includes('boleto')) {
          icon = '🧾'
          color = '#f59e0b'
          subtitle = 'Vencimento em 3 dias'
        } else if (lowerText.includes('débito')) {
          icon = '💰'
          color = '#8b5cf6'
          subtitle = 'Débito em conta'
        } else if (lowerText.includes('crédito') || lowerText.includes('credit')) {
          icon = '💳'
          color = '#3b82f6'
          subtitle = 'Parcelamento disponível'
        }

        // Aplicar estilos sem quebrar funcionalidade

        const currentStyle = element.style.cssText
        element.style.cssText = currentStyle + `
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%) !important;
          border: 2px solid rgba(59, 130, 246, 0.1) !important;
          border-radius: 16px !important;
          padding: 20px !important;
          margin: 8px !important;
          position: relative !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
          min-height: 120px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          animation: slideInUp ${0.3 + (index * 0.1)}s ease-out forwards !important;
        `

        // Adicionar overlay visual sem substituir conteúdo

        if (!element.querySelector('.premium-overlay')) {
          const overlay = document.createElement('div')
          overlay.className = 'premium-overlay'
          overlay.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 16px !important;
            z-index: 2 !important;
            pointer-events: none !important;
          `
          
          overlay.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 8px; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));">${icon}</div>
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px; font-size: 14px;">${originalText}</div>
            <div style="font-size: 12px; color: #64748b; font-weight: 500;">${subtitle}</div>
          `
          
          element.appendChild(overlay)
        }

        // Event listeners para hover sem interferir na funcionalidade

        const handleMouseEnter = () => {
          element.style.setProperty('border-color', color, 'important')
          element.style.setProperty('transform', 'translateY(-4px) scale(1.02)', 'important')
          element.style.setProperty('box-shadow', `0 12px 30px ${color}40`, 'important')
        }

        const handleMouseLeave = () => {
          if (!element.classList.contains('selected') && !element.getAttribute('aria-checked')) {
            element.style.setProperty('border-color', 'rgba(59, 130, 246, 0.1)', 'important')
            element.style.setProperty('transform', 'translateY(0) scale(1)', 'important')
            element.style.setProperty('box-shadow', '0 8px 32px rgba(0, 0, 0, 0.08)', 'important')
          }
        }

        element.addEventListener('mouseenter', handleMouseEnter, { passive: true })
        element.addEventListener('mouseleave', handleMouseLeave, { passive: true })
      })

      // Adicionar CSS global se não existe

      if (!document.getElementById('premium-payment-styles')) {
        const style = document.createElement('style')
        style.id = 'premium-payment-styles'
        style.textContent = `
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          #${CONTAINER_ID} .mp-form,
          #${CONTAINER_ID} form {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 16px !important;
            margin: 20px 0 !important;
            padding: 0 !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    // Aplicar estilos após delay para garantir que DOM esteja pronto

    setTimeout(stylePaymentMethods, 1000)
    
    // Observar mudanças no DOM para reagir a atualizações
    
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.querySelector('[data-cy="payment-method-option"], .mp-payment-method-item, .cho-payment-method')) {
                shouldReapply = true
              }
            }
          })
        }
      })
      
      if (shouldReapply) {
        setTimeout(stylePaymentMethods, 500)
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: false
    })

    // Limpar observer após 30 segundos para evitar vazamentos

    setTimeout(() => observer.disconnect(), 30000)
  }

  const copyPixCode = async () => {
    if (paymentResult?.qr_code) {
      try {
        await navigator.clipboard.writeText(paymentResult.qr_code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Erro ao copiar código PIX:', error)
      }
    }
  }

  // Tela PIX

  if (showPixCode && paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-all duration-300 font-medium group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Voltar aos detalhes
          </button>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                PIX Gerado com Sucesso!
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Escaneie o QR Code ou copie o código PIX para finalizar o pagamento
              </p>
              <div className="flex items-center justify-center text-orange-600 bg-orange-50 rounded-lg px-4 py-2 inline-flex">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Expira em 30 minutos</span>
              </div>
            </div>

            <div className="px-8 pb-8">
              {paymentResult.qr_code_base64 && (
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-white border-4 border-gray-100 rounded-2xl shadow-inner">
                    <img 
                      src={`data:image/png;base64,${paymentResult.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="w-64 h-64 rounded-lg"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Código PIX Copia e Cola
                </h3>
                
                <div className="bg-white border border-gray-300 rounded-xl p-4 mb-4 shadow-inner">
                  <code className="text-sm text-gray-800 break-all font-mono leading-relaxed">
                    {paymentResult.qr_code}
                  </code>
                </div>
                
                <button
                  onClick={copyPixCode}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg ${
                    copied 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>💌 Código PIX enviado por email para <strong>{customerData.email}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Premium */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-all duration-300 font-medium group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Voltar aos detalhes
          </button>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Finalizar Pagamento
                  </h1>
                  <p className="text-gray-600 text-lg mt-1">
                    Escolha sua forma de pagamento preferida
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Consultoria Express
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Para: <span className="font-medium text-gray-800">{customerData.name}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      R$ {amount.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <Shield className="h-4 w-4 mr-1" />
                      Pagamento 100% seguro
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Container Premium */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            {loading && (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carregando opções de pagamento</h3>
                <p className="text-gray-600">Preparando a melhor experiência para você...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-16">
                <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
                  <div className="text-red-600 text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Ops! Algo deu errado</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}
            
            {!loading && !error && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Métodos de Pagamento</h2>
                  <p className="text-gray-600">Todas as opções são seguras e processadas instantaneamente</p>
                </div>
                
                <div
                  id={CONTAINER_ID}
                  ref={checkoutRef}
                  className="mercadopago-premium-container"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
