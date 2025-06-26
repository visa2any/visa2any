'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface MercadoPagoFormProps {
  onToken: (token: string, deviceId: string) => void
  publicKey: string
  amount: number
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoForm({ onToken, publicKey, amount }: MercadoPagoFormProps) {
  const [mp, setMp] = useState<any>(null)
  const [cardForm, setCardForm] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined' && window.MercadoPago && publicKey) {
      initializeMercadoPago()
    }
  }, [publicKey])

  const initializeMercadoPago = async () => {
    try {
      // Inicializar MercadoPago.js V2
      const mercadopago = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      setMp(mercadopago)

      // Obter Device ID
      const deviceIdGenerated = await mercadopago.getIdentificationTypes()
      const finalDeviceId = mercadopago.deviceProfile.id || `device_${Date.now()}`
      setDeviceId(finalDeviceId)

      // Configurar Secure Fields
      const cardFormInstance = mercadopago.cardForm({
        amount: amount.toString(),
        iframe: true,
        form: {
          id: 'form-checkout',
          cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: 'Número do cartão'
          },
          expirationDate: {
            id: 'form-checkout__expirationDate',
            placeholder: 'MM/YY'
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'CVV'
          },
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Nome do titular'
          },
          issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Banco emissor'
          },
          installments: {
            id: 'form-checkout__installments',
            placeholder: 'Parcelas'
          },
          identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Tipo de documento'
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Número do documento'
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'E-mail'
          }
        },
        callbacks: {
          onFormMounted: (error: any) => {
            if (error) {
              console.error('Erro ao montar formulário:', error)
              setErrors({ form: 'Erro ao carregar formulário de pagamento' })
            }
          },
          onSubmit: (event: any) => {
            event.preventDefault()
            handleSubmit()
          },
          onFetching: (resource: string) => {
            console.log('Buscando:', resource)
            setIsLoading(true)
          },
          onCardTokenReceived: (error: any, token: string) => {
            if (error) {
              console.error('Erro ao gerar token:', error)
              setErrors({ token: 'Erro ao processar cartão' })
              setIsLoading(false)
            } else {
              console.log('Token recebido:', token)
              onToken(token, deviceId)
              setIsLoading(false)
            }
          }
        }
      })

      setCardForm(cardFormInstance)

    } catch (error) {
      console.error('Erro ao inicializar MercadoPago:', error)
      setErrors({ initialization: 'Erro ao carregar MercadoPago' })
    }
  }

  const handleSubmit = async () => {
    if (!cardForm) return

    setIsLoading(true)
    setErrors({})

    try {
      await cardForm.createCardToken()
    } catch (error) {
      console.error('Erro ao criar token:', error)
      setErrors({ submit: 'Erro ao processar pagamento' })
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => {
          if (publicKey) {
            initializeMercadoPago()
          }
        }}
        strategy="lazyOnload"
      />
      
      <div className="mercadopago-form">
        <form id="form-checkout" className="space-y-4">
          {errors.initialization && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.initialization}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do cartão
              </label>
              <div id="form-checkout__cardNumber" className="border border-gray-300 rounded-md p-3 h-12"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimento
                </label>
                <div id="form-checkout__expirationDate" className="border border-gray-300 rounded-md p-3 h-12"></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div id="form-checkout__securityCode" className="border border-gray-300 rounded-md p-3 h-12"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do titular
              </label>
              <div id="form-checkout__cardholderName" className="border border-gray-300 rounded-md p-3 h-12"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div id="form-checkout__cardholderEmail" className="border border-gray-300 rounded-md p-3 h-12"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de documento
                </label>
                <div id="form-checkout__identificationType" className="border border-gray-300 rounded-md p-3 h-12"></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do documento
                </label>
                <div id="form-checkout__identificationNumber" className="border border-gray-300 rounded-md p-3 h-12"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco emissor
              </label>
              <div id="form-checkout__issuer" className="border border-gray-300 rounded-md p-3 h-12"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcelas
              </label>
              <div id="form-checkout__installments" className="border border-gray-300 rounded-md p-3 h-12"></div>
            </div>
          </div>

          {errors.token && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.token}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !cardForm}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              isLoading || !cardForm
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
          </button>
        </form>

        {deviceId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              Device ID: {deviceId}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center space-x-4">
          <img 
            src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" 
            alt="Mercado Pago"
            className="h-8"
          />
          <div className="flex space-x-2">
            <img src="/payment-icons/visa.svg" alt="Visa" className="h-6" />
            <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/payment-icons/elo.svg" alt="Elo" className="h-6" />
          </div>
        </div>
      </div>
    </>
  )
}