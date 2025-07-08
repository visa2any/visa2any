'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard, Shield, Check, Lock, Copy, CheckCircle2, Clock } from 'lucide-react'

// Controle global para evitar duplicatas
let isCreatingBrick = false
let brickCount = 0
const CONTAINER_ID = 'mercadopago-checkout-unique'

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
    __mercadoPagoInitialized: boolean
    __mercadoPagoBrick: any
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
  const [retryCount, setRetryCount] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const [brickInstance, setBrickInstance] = useState<any>(null)
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [showPixCode, setShowPixCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const checkoutRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const initializationRef = useRef<boolean>(false)

    useEffect(() => {
      const initialize = () => {
        // VERIFICAÇÃO CRÍTICA: Se já estamos criando um brick
        if (isCreatingBrick) {
          console.log('MercadoPago: Brick creation already in progress')
          setLoading(false)
          return
        }
      
        // Verificar se já existe brick no DOM
        const container = document.getElementById(CONTAINER_ID)
        if (container && container.children.length > 0) {
          console.log('MercadoPago: Reusing existing brick in DOM')
          setLoading(false)
          return
        }
      
        // Verificar contador global
        if (brickCount > 0) {
          console.log('MercadoPago: Brick already exists')
          setLoading(false)
          return
        }
      
        console.log('MercadoPago: Initializing payment brick')
        isCreatingBrick = true
        brickCount++
        initializationRef.current = true
        setInitialized(true)
        loadMercadoPagoSDK()
      }

      initialize()

    return () => {
      console.log('🧹 Desmontando componente');
      initializationRef.current = false;
      // NÃO resetar isCreatingBrick nem brickCount
    };
  }, [preferenceId]);

  const loadMercadoPagoSDK = () => {
    // Verificar se o SDK já está carregado
    if (window.MercadoPago) {
      initializeMercadoPago()
      return
    }

    // Timeout de segurança para carregamento do SDK (30 segundos)

    const timeout = setTimeout(() => {
      setError('Timeout ao carregar SDK do MercadoPago. Verifique sua conexão.')
      setLoading(false)
    }, 30000)

    // Carregar SDK do MercadoPago

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => {
      clearTimeout(timeout)
      initializeMercadoPago()
    }
    script.onerror = () => {
      clearTimeout(timeout)
      setError('Erro ao carregar SDK do MercadoPago. Tente novamente.')
      setLoading(false)
    }
    scriptRef.current = script
    document.head.appendChild(script)
  }

  const initializeMercadoPago = async () => {
    try {
      console.log('MercadoPago: Starting brick creation')
      
      // VERIFICAÇÃO FINAL: Se não estamos criando
      if (!isCreatingBrick) {
        console.log('MercadoPago: Brick creation aborted - not in creation state')
        return
      }
      
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })
      
      console.log('✅ MercadoPago instância criada')
      
      // Timeout de segurança para loading
      
      const loadingTimeout = setTimeout(() => {
        console.warn('⚠️ Timeout do loading do MercadoPago')
        setLoading(false)
        setError('Timeout ao carregar formulário. Tente novamente.')
        isCreatingBrick = false
      }, 20000)
      
      // Garantir que container existe com ID único
      
      let container = document.getElementById(CONTAINER_ID)
      if (!container) {
        console.log('❌ Container não encontrado com ID único')
        setError('Erro no container de pagamento')
        isCreatingBrick = false
        return
      }
      
      console.log('MercadoPago: Creating payment brick')
      
      const bricks = mp.bricks()
      
      // LIMPAR CONTAINER COMPLETAMENTE
      
      container.innerHTML = ''
      
      const settings = {
        initialization: {
          amount: amount,
          payer: {
            email: customerData.email,
            first_name: customerData.name.split(' ')[0] || customerData.name,
            last_name: customerData.name.split(' ').slice(1).join(' ') || ''
          }
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all'
          },
          visual: {
            style: {
              theme: 'default',
              customVariables: {
                borderRadius: '8px',
                fontSizeXS: '12px',
                fontSizeSM: '14px',
                baseColor: '#3b82f6',
                textPrimaryColor: '#1f2937',
                textSecondaryColor: '#6b7280',
                inputBackgroundColor: '#f9fafb',
                formBackgroundColor: '#ffffff'
              }
            },
            hideFormTitle: false,
            hideRedirectionPanel: true
          }
        },
        callbacks: {
          onReady: () => {
            console.log('✅ BRICK ÚNICO CARREGADO COM SUCESSO')
            clearTimeout(loadingTimeout)
            setLoading(false)
            isCreatingBrick = false // Marcar como finalizado,            
            // Aplicar estilos personalizados após carregamento
            setTimeout(() => {
              applyCustomStyles()
            }, 500)
          },
          onSubmit: ({ selectedPaymentMethod, formData }: any) => {
            console.log('📝 Pagamento submetido:', { selectedPaymentMethod, formData })
            
            return new Promise((resolve, reject) => {
              fetch('/api/payments/process-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  selectedPaymentMethod,
                  formData: {
                    ...formData,
                    transaction_amount: amount,
                    payer: {
                      email: customerData.email,
                      first_name: customerData.name.split(' ')[0] || customerData.name,
                      last_name: customerData.name.split(' ').slice(1).join(' ') || '',
                      identification: {
                        type: 'CPF',
                        number: formData.payer?.identification?.number || ''
                      }
                    }
                  },
                  preferenceId
                })
              })
              .then(response => response.json())
              .then(result => {
                console.log('🎯 Resultado completo do pagamento:', result)
                if (result.success) {
                  // Se for PIX
                  // mostrar QR code na tela e enviar email
                  if ((selectedPaymentMethod === 'pix' || selectedPaymentMethod === 'bank_transfer') && result.qr_code_base64) {
                    setPaymentResult(result)
                    setShowPixCode(true)
                    setLoading(false)
                    
                    // Enviar email com QR code do PIX
                    
                    fetch('/api/communications/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'email',
                        clientId: result.payment_id,
                        subject: '📱 PIX Gerado - Finalize seu Pagamento',
                        content: `
                          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #059669;">📱 PIX Gerado com Sucesso!</h1>
                            
                            <p>Olá <strong>${customerData.name}</strong>,</p>
                            
                            <p>Seu PIX foi gerado! Complete o pagamento escaneando o QR Code ou copiando o código abaixo:</p>
                            
                            <div style="text-align: center; margin: 20px 0;">
                              <img src="data:image/png;base64,${result.qr_code_base64}" alt="QR Code PIX" style="max-width: 250px;" />
                            </div>
                            
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                              <h3>💰 Detalhes do Pagamento:</h3>
                              <ul>
                                <li><strong>Valor:</strong> R$ ${amount.toFixed(2).replace('.', ',')}</li>
                                <li><strong>ID:</strong> ${result.payment_id}</li>
                                <li><strong>Expira em:</strong> 30 minutos</li>
                              </ul>
                            </div>
                            
                            <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                              ${result.qr_code}
                            </div>
                            
                            <p style="margin-top: 20px;">Após o pagamento, você receberá a confirmação automaticamente.</p>
                            
                            <p>Atenciosamente,<br><strong>Equipe Visa2Any</strong></p>
                          </div>
                        `,
                        template: true,
                        priority: 'high'
                      })
                    }).catch(error => console.log('Erro ao enviar email PIX:', error))
                  } else if (result.ticket_url) {
                    // Boleto - mostrar link
                    setPaymentResult(result)
                    setLoading(false)
                  } else {
                    // Outros pagamentos - sucesso direto
                    if (onSuccess) onSuccess(result)
                  }
                  resolve(result)
                } else {
                  reject(result.error || 'Erro no pagamento')
                }
              })
              .catch(error => {
                console.error('Erro no processamento:', error)
                reject(error)
              })
            })
          },
          onError: (error: any) => {
            console.error('❌ Erro no Payment Brick:', error)
            setError('Erro no formulário de pagamento. Tente usar a alternativa abaixo.')
            isCreatingBrick = false
            if (onError) onError(error)
          }
        }
      }

      console.log('🎯 CRIANDO BRICK ÚNICO NO CONTAINER:', CONTAINER_ID)
      const brick = await bricks.create('payment', CONTAINER_ID, settings)
      setBrickInstance(brick)
      
      console.log('MercadoPago: Payment brick created successfully')
      
    } catch (error) {
      console.error('MercadoPago: Error initializing payment brick:', error)
      setError('Error loading payment form. Please try again or use the alternative option below.')
      setLoading(false)
      isCreatingBrick = false
      if (onError) onError(error)
    }
  }

  const applyCustomStyles = () => {
    console.log('🎨 Aplicando estilos customizados ao MercadoPago')
    
    const container = document.getElementById(CONTAINER_ID)
    if (!container) return

    // Aplicar estilos por força bruta com JavaScript

    const applyGridLayout = () => {
      // Encontrar qualquer container que contenha métodos de pagamento
      const methodContainers = container.querySelectorAll('div')
      methodContainers.forEach((divElement) => {
        const div = divElement as HTMLElement
        const children = div.children
        if (children.length >= 3 && children.length <= 6) {
          // Provavelmente é o container dos métodos
          console.log('🎯 Aplicando grid ao container:', div)
          div.style.setProperty('display', 'grid', 'important')
          div.style.setProperty('grid-template-columns', 'repeat(auto-fit, minmax(160px, 1fr))', 'important')
          div.style.setProperty('gap', '12px', 'important')
          div.style.setProperty('margin-bottom', '24px', 'important')
          div.classList.add('payment-methods-grid')
        }
      })

      // Estilizar métodos individuais com visual premium

      const paymentMethods = container.querySelectorAll('div[role="button"], div[tabindex], button, [onclick], .mp-payment-method, .cho-payment-method')
      paymentMethods.forEach((methodElement, index) => {
        const method = methodElement as HTMLElement
        const text = method.textContent?.toLowerCase() || ''
        
        // Identificar tipo de pagamento e personalizar
        
        let icon = '💳'
        let subtitle = ''
        let isPaymentMethod = false
        
        if (text.includes('pix') || text.includes('banco')) {
          icon = '📱'
          subtitle = 'Instantâneo'
          isPaymentMethod = true
        } else if (text.includes('cartão') && text.includes('crédito')) {
          icon = '💳'
          subtitle = 'Parcelado'
          isPaymentMethod = true
        } else if (text.includes('débito')) {
          icon = '💰'
          subtitle = 'À vista'
          isPaymentMethod = true
        } else if (text.includes('boleto')) {
          icon = '🎫'
          subtitle = '3 dias úteis'
          isPaymentMethod = true
        }
        
        if (isPaymentMethod) {
          console.log('🎨 Aplicando visual premium ao método:', text)
          method.classList.add('payment-method-enhanced')
          
          // Aplicar estilos diretamente
          
          const styles = {
            'background': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            'border': '2px solid transparent',
            'border-radius': '20px',
            'padding': '24px 16px',
            'cursor': 'pointer',
            'transition': 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            'min-height': '120px',
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
            'text-align': 'center',
            'position': 'relative',
            'overflow': 'hidden',
            'box-shadow': '0 4px 20px rgba(0, 0, 0, 0.08)'
          }
          
          Object.entries(styles).forEach(([prop, value]) => {
            method.style.setProperty(prop, value, 'important')
          })
          
          // Adicionar ícone e subtítulo
          
          if (!method.querySelector('.payment-icon')) {
            const originalContent = method.innerHTML
            method.innerHTML = `
              <div class="payment-icon" style="font-size: 32px; margin-bottom: 8px;">${icon}</div>
              <div class="payment-title" style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">${method.textContent}</div>
              <div class="payment-subtitle" style="font-size: 12px; color: #64748b; font-weight: 500;">${subtitle}</div>
            `
          }
          
          // Event listeners para interação premium
          
          method.addEventListener('mouseenter', () => {
            method.style.setProperty('background', 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)', 'important')
            method.style.setProperty('border', '2px solid #3b82f6', 'important')
            method.style.setProperty('transform', 'translateY(-8px) scale(1.02)', 'important')
            method.style.setProperty('box-shadow', '0 20px 40px rgba(59, 130, 246, 0.2)', 'important')
          })
          
          method.addEventListener('mouseleave', () => {
            if (!method.classList.contains('selected') && !method.getAttribute('aria-checked')) {
              method.style.setProperty('background', 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 'important')
              method.style.setProperty('border', '2px solid transparent', 'important')
              method.style.setProperty('transform', 'translateY(0) scale(1)', 'important')
              method.style.setProperty('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.08)', 'important')
            }
          })
          
          // Observer para seleção
          
          const observer = new MutationObserver(() => {
            if (method.classList.contains('selected') || method.getAttribute('aria-checked') === 'true') {
              method.style.setProperty('background', 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)', 'important')
              method.style.setProperty('border', '2px solid #3b82f6', 'important')
              method.style.setProperty('transform', 'translateY(-4px)', 'important')
              method.style.setProperty('box-shadow', '0 12px 30px rgba(59, 130, 246, 0.3)', 'important')
              
              // Adicionar checkmark
              
              if (!method.querySelector('.checkmark')) {
                const checkmark = document.createElement('div')
                checkmark.className = 'checkmark'
                checkmark.innerHTML = '✓'
                checkmark.style.cssText = `
                  position: absolute !important;
                  top: 12px !important;
                  right: 12px !important;
                  background: #3b82f6 !important;
                  color: white !important;
                  border-radius: 50% !important;
                  width: 24px !important;
                  height: 24px !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  font-size: 12px !important;
                  font-weight: bold !important;
                `
                method.appendChild(checkmark)
              }
            } else {
              // Remover checkmark se desmarcado
              const checkmark = method.querySelector('.checkmark')
              if (checkmark) checkmark.remove()
            }
          })
          
          observer.observe(method, { attributes: true })
        }
      })
    }

    // Aplicar agora e depois de mudanças no DOM

    applyGridLayout()
    setTimeout(applyGridLayout, 1000)
    setTimeout(applyGridLayout, 2000)

    // Observer para mudanças no DOM

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              // Re-aplicar estilos para novos elementos
              const newMethods = element.querySelectorAll('[data-cy="payment-method-option"], .mp-payment-method-item, .cho-payment-method')
              newMethods.forEach((method) => {
                method.classList.add('payment-method-enhanced')
              })
            }
          })
        }
      })
    })

    observer.observe(container, {
      childList: true,
      subtree: true
    })

    // Cleanup do observer quando componente for desmontado

    setTimeout(() => observer.disconnect(), 30000) // 30 segundos
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

  // Se PIX foi gerado
  // mostrar tela de QR code
  if (showPixCode && paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos detalhes
            </button>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                PIX Gerado com Sucesso!
              </h1>
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code ou copie o código PIX para finalizar o pagamento
              </p>
              <div className="text-sm text-orange-600 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1" />
                Expira em 30 minutos
              </div>
            </div>
          </div>

          {/* QR Code e Código PIX */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Escaneie o QR Code com seu banco
              </h2>
              
              {/* QR Code */}
              {paymentResult.qr_code_base64 && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={`data:image/png;base64,${paymentResult.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="w-64 h-64"
                    />
                  </div>
                </div>
              )}
              
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-3">
                  Ou copie e cole o código PIX:
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-800 break-all font-mono">
                      {paymentResult.qr_code}
                    </code>
                    <button
                      onClick={copyPixCode}
                      className={`ml-3 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Pagamento */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <div className="font-semibold">R$ {amount.toFixed(2).replace('.', ',')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className="font-semibold text-orange-600">Aguardando Pagamento</div>
                </div>
                <div>
                  <span className="text-gray-500">ID Pagamento:</span>
                  <div className="font-mono text-xs">{paymentResult.payment_id}</div>
                </div>
                <div>
                  <span className="text-gray-500">Método:</span>
                  <div className="font-semibold">PIX</div>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Como pagar:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o app do seu banco</li>
                <li>2. Escaneie o QR Code ou cole o código PIX</li>
                <li>3. Confirme o pagamento</li>
                <li>4. Você receberá a confirmação por email</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
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
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-orange-800 text-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">⚠️</span>
                      <span>{error}</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (retryCount < 3) {
                            setError('')
                            setLoading(true)
                            setRetryCount(prev => prev + 1)
                            
                            // Destruir instância anterior antes de recarregar
                            
                            if (brickInstance) {
                              try {
                                brickInstance.unmount()
                                setBrickInstance(null)
                              } catch (error) {
                                console.log('Erro ao destruir brick no retry:', error)
                              }
                            }
                            
                            // Resetar controles globais
                            
                            isCreatingBrick = false
                            brickCount = 0
                            
                            // Limpar container completamente
                            
                            const container = document.getElementById(CONTAINER_ID)
                            if (container) {
                              container.innerHTML = ''
                            }
                            
                            // Aguardar um momento antes de recarregar
                            
                            setTimeout(() => {
                              initializationRef.current = false
                              loadMercadoPagoSDK()
                            }, 500)
                          } else {
                            setError('Muitas tentativas. Use o botão "Ir para MercadoPago" ou recarregue a página.')
                          }
                        }}
                        disabled={retryCount >= 3}
                        className="px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {retryCount >= 3 ? 'Limite excedido' : `Tentar Novamente (${retryCount + 1}/3)`}
                      </button>
                      
                      <button
                        onClick={() => {
                          // Criar URL do MercadoPago diretamente
                          const mpUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`
                          window.open(mpUrl, '_blank')
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        🚀 Ir para MercadoPago
                      </button>
                    </div>
                    
                    <div className="mt-2 text-xs text-orange-600">
                      💡 O botão "Ir para MercadoPago" abre uma nova aba com o pagamento
                    </div>
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
              <div id={CONTAINER_ID} ref={checkoutRef} className="mercadopago-enhanced"></div>
              
              {/* CSS Moderno e Visual Premium */}
              <style jsx global>{`
                /* Reset e container base */
                .mercadopago-enhanced {
                  min-height: 400px;
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
                  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                  border-radius: 16px;
                  padding: 24px;
                  position: relative;
                  overflow: hidden;
                }

                .mercadopago-enhanced::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
                  pointer-events: none;
                }

                /* Header do formulário com ícone */
                .mercadopago-enhanced > div:first-child {
                  position: relative;
                  z-index: 2;
                }

                .mercadopago-enhanced::after {
                  content: '💳';
                  position: absolute;
                  top: 20px;
                  left: 20px;
                  font-size: 24px;
                  z-index: 1;
                }

                /* Container dos métodos - DESIGN PREMIUM */
                .mercadopago-enhanced [data-cy="payment-method-list"],
                .mercadopago-enhanced .mp-payment-methods-list,
                .mercadopago-enhanced .cho-payment-methods-list,
                .mercadopago-enhanced .payment-methods-grid,
                .mercadopago-enhanced div[class*="payment-method"]:has(> div:nth-child(3)) {
                  display: grid !important;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                  gap: 16px !important;
                  margin: 32px 0 !important;
                  padding: 0 !important;
                }

                /* Cards dos métodos - VISUAL IMPRESSIONANTE */
                .mercadopago-enhanced [data-cy="payment-method-option"],
                .mercadopago-enhanced .mp-payment-method-item,
                .mercadopago-enhanced .cho-payment-method,
                .mercadopago-enhanced .payment-method-enhanced {
                  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%) !important;
                  border: 2px solid transparent !important;
                  border-radius: 20px !important;
                  padding: 24px 16px !important;
                  cursor: pointer !important;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                  min-height: 120px !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  justify-content: center !important;
                  text-align: center !important;
                  position: relative !important;
                  overflow: hidden !important;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
                }

                /* Efeito shimmer nos cards */
                .mercadopago-enhanced .payment-method-enhanced::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
                  transition: left 0.5s ease;
                }

                /* Hover effects INCRÍVEIS */
                .mercadopago-enhanced [data-cy="payment-method-option"]:hover,
                .mercadopago-enhanced .mp-payment-method-item:hover,
                .mercadopago-enhanced .cho-payment-method:hover,
                .mercadopago-enhanced .payment-method-enhanced:hover {
                  background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%) !important;
                  border: 2px solid #3b82f6 !important;
                  transform: translateY(-8px) scale(1.02) !important;
                  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2) !important;
                }

                .mercadopago-enhanced .payment-method-enhanced:hover::before {
                  left: 100%;
                }

                /* Estado selecionado PREMIUM */
                .mercadopago-enhanced [data-cy="payment-method-option"].selected,
                .mercadopago-enhanced .mp-payment-method-item.selected,
                .mercadopago-enhanced .cho-payment-method.selected,
                .mercadopago-enhanced [data-cy="payment-method-option"][aria-checked="true"],
                .mercadopago-enhanced .mp-payment-method-item[aria-checked="true"],
                .mercadopago-enhanced .payment-method-enhanced.selected {
                  background: linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%) !important;
                  border: 2px solid #3b82f6 !important;
                  transform: translateY(-4px) !important;
                  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.3) !important;
                }

                .mercadopago-enhanced .payment-method-enhanced.selected::after {
                  content: '✓';
                  position: absolute;
                  top: 12px;
                  right: 12px;
                  background: #3b82f6;
                  color: white;
                  border-radius: 50%;
                  width: 24px;
                  height: 24px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: bold;
                }

                /* Ícones melhorados */
                .mercadopago-enhanced .mp-payment-method-icon,
                .mercadopago-enhanced .cho-payment-method-icon {
                  width: 48px !important;
                  height: 48px !important;
                  margin-bottom: 12px !important;
                  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1)) !important;
                }

                /* Textos melhorados */
                .mercadopago-enhanced .mp-payment-method-title,
                .mercadopago-enhanced .cho-payment-method-title {
                  font-size: 15px !important;
                  font-weight: 700 !important;
                  color: #1e293b !important;
                  margin: 0 0 4px 0 !important;
                  letter-spacing: 0.5px !important;
                }

                /* Subtítulos para métodos */
                .mercadopago-enhanced .payment-method-enhanced .subtitle {
                  font-size: 12px !important;
                  color: #64748b !important;
                  font-weight: 500 !important;
                }

                /* Formulário moderno */
                .mercadopago-enhanced .mp-form-row {
                  display: grid !important;
                  grid-template-columns: 1fr 1fr !important;
                  gap: 20px !important;
                  margin-bottom: 20px !important;
                }

                /* Inputs redesenhados */
                .mercadopago-enhanced input,
                .mercadopago-enhanced select {
                  background: #ffffff !important;
                  border: 2px solid #e2e8f0 !important;
                  border-radius: 16px !important;
                  padding: 16px 20px !important;
                  font-size: 15px !important;
                  font-weight: 500 !important;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
                }

                .mercadopago-enhanced input:focus,
                .mercadopago-enhanced select:focus {
                  border-color: #3b82f6 !important;
                  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.1) !important;
                  outline: none !important;
                  transform: translateY(-2px) !important;
                }

                /* Botão de pagamento ESPETACULAR */
                .mercadopago-enhanced button[type="submit"],
                .mercadopago-enhanced .mp-button,
                .mercadopago-enhanced .cho-button {
                  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%) !important;
                  border: none !important;
                  border-radius: 20px !important;
                  padding: 20px 40px !important;
                  color: white !important;
                  font-weight: 700 !important;
                  font-size: 17px !important;
                  cursor: pointer !important;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                  width: 100% !important;
                  margin-top: 32px !important;
                  position: relative !important;
                  overflow: hidden !important;
                  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3) !important;
                  letter-spacing: 1px !important;
                  text-transform: uppercase !important;
                }

                .mercadopago-enhanced button[type="submit"]:hover,
                .mercadopago-enhanced .mp-button:hover,
                .mercadopago-enhanced .cho-button:hover {
                  transform: translateY(-3px) scale(1.02) !important;
                  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4) !important;
                  background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #0891b2 100%) !important;
                }

                /* Loading aprimorado */
                .mercadopago-enhanced .mp-spinner,
                .mercadopago-enhanced .loading {
                  border: 3px solid #e2e8f0 !important;
                  border-top: 3px solid #3b82f6 !important;
                  border-radius: 50% !important;
                  width: 28px !important;
                  height: 28px !important;
                  animation: premium-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
                  margin: 0 auto !important;
                }

                @keyframes premium-spin {
                  0% { transform: rotate(0deg) scale(1); }
                  50% { transform: rotate(180deg) scale(1.1); }
                  100% { transform: rotate(360deg) scale(1); }
                }

                /* Responsivo aprimorado */
                @media (max-width: 768px) {
                  .mercadopago-enhanced [data-cy="payment-method-list"],
                  .mercadopago-enhanced .mp-payment-methods-list,
                  .mercadopago-enhanced .cho-payment-methods-list {
                    grid-template-columns: 1fr 1fr !important;
                    gap: 12px !important;
                  }

                  .mercadopago-enhanced .mp-form-row {
                    grid-template-columns: 1fr !important;
                    gap: 16px !important;
                  }

                  .mercadopago-enhanced .payment-method-enhanced {
                    min-height: 100px !important;
                    padding: 20px 12px !important;
                  }
                }

                /* Micro-interações */
                .mercadopago-enhanced * {
                  backface-visibility: hidden !important;
                  -webkit-font-smoothing: antialiased !important;
                }
              `}</style>

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
