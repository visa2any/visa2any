'use client'

import { useState } from 'react'

interface PaymentData {
  token: string
  deviceId: string
  amount: number
  installments: number
  customer: {
    email: string
    name: string
    phone?: string
    cpf?: string
    address?: {
      street: string
      number: string
      zipcode: string
      city: string
      state: string
    }
  }
  items: Array<{
    id: string
    title: string
    description: string
    category_id: string
    unit_price: number
    quantity: number
  }>
  external_reference?: string
}

interface PaymentResponse {
  success: boolean
  payment?: any
  error?: string
  details?: any
}

export function useProcessPayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      // Preparar dados do pagamento com todos os campos obrigatórios
      const paymentRequest = {
        token: paymentData.token,
        transaction_amount: paymentData.amount,
        installments: paymentData.installments,
        payment_method_id: 'credit_card', // Será determinado pelo token,        issuer_id: null, // Será determinado pelo token
        
        // Device ID para prevenção de fraudes
        
        device_id: paymentData.deviceId,
        
        // Dados completos do pagador
        
        payer: {
          email: paymentData.customer.email,
          first_name: paymentData.customer.name.split(' ')[0] || '',
          last_name: paymentData.customer.name.split(' ').slice(1).join(' ') || '',
          identification: paymentData.customer.cpf ? {
            type: 'CPF',
            number: paymentData.customer.cpf.replace(/\D/g, '')
          } : undefined,
          phone: paymentData.customer.phone ? {
            area_code: paymentData.customer.phone.replace(/\D/g, '').substring(0, 2),
            number: paymentData.customer.phone.replace(/\D/g, '').substring(2)
          } : undefined,
          address: paymentData.customer.address ? {
            street_name: paymentData.customer.address.street,
            street_number: paymentData.customer.address.number,
            zip_code: paymentData.customer.address.zipcode.replace(/\D/g, ''),
            city: paymentData.customer.address.city,
            federal_unit: paymentData.customer.address.state
          } : undefined
        },

        // Dados dos items

        additional_info: {
          items: paymentData.items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category_id: item.category_id,
            quantity: item.quantity,
            unit_price: item.unit_price
          })),
          shipments: {
            receiver_address: paymentData.customer.address ? {
              street_name: paymentData.customer.address.street,
              street_number: paymentData.customer.address.number,
              zip_code: paymentData.customer.address.zipcode.replace(/\D/g, ''),
              city_name: paymentData.customer.address.city,
              state_name: paymentData.customer.address.state
            } : undefined
          }
        },

        // Referência externa para correlação

        external_reference: paymentData.external_reference || `visa2any-${Date.now()}`,
        
        // URL de notificação webhook
        
        notification_url: `${window.location.origin}/api/payments/webhook/mercadopago`,
        
        // Descrição na fatura do cartão
        
        statement_descriptor: 'VISA2ANY',
        
        // Captura automática
        
        capture: true,
        
        // Modo binário para aprovação imediata
        
        binary_mode: true,

        // Dados de segurança

        metadata: {
          platform: 'visa2any',
          version: '1.0',
          device_id: paymentData.deviceId,
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          ip_address: '', // Será preenchido no backend,          session_id: paymentData.external_reference
        }
      }

      // Enviar para API de pagamento

      const response = await fetch('/api/payments/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar pagamento')
      }

      setIsLoading(false)
      return {
        success: true,
        payment: result.payment
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setIsLoading(false)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  return {
    processPayment,
    isLoading,
    error
  }
}