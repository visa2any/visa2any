import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

// Configuração do MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

const payment = new Payment(client)
const preference = new Preference(client)

export interface PaymentData {
  id: string
  title: string
  quantity: number
  unit_price: number
  currency_id: string
  description?: string
  category_id?: string
  picture_url?: string
}

export interface PayerData {
  name?: string
  surname?: string
  email?: string
  phone?: {
    area_code: string
    number: string
  }
  identification?: {
    type: string
    number: string
  }
  address?: {
    street_name: string
    street_number: string
    zip_code: string
  }
}

export interface PreferenceData {
  items: PaymentData[]
  payer?: PayerData
  back_urls?: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
  notification_url?: string
  external_reference?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

// Criar preferência de pagamento
export async function createPreference(data: PreferenceData) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const payerData = data.payer || {
      name: '',
      surname: '',
      email: ''
    };
    
    const preferenceData = {
      payer: {
        ...payerData,
        name: payerData.name || '',
        surname: payerData.surname || '',
        email: payerData.email || ''
      },
      back_urls: {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`,
        ...data.back_urls
      },
      auto_return: 'approved' as const,
      payment_methods: {
        installments: 12,
        ...data.payment_methods
      },
      notification_url: `${baseUrl}/api/payments/webhook/mercadopago`,
      external_reference: data.external_reference || '',
      expires: false,
      ...data,
      items: data.items
    }

    const response = await preference.create({ body: preferenceData })
    
    if (!response.id) {
      throw new Error('Failed to create payment preference')
    }

    return {
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      checkout_url: response.init_point // For backward compatibility
    }
  } catch (error: unknown) {
    console.error('Erro ao criar preferência MercadoPago:', error)
    const err = error as {response?: {data?: unknown}}
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      error_details: err.response?.data || null
    }
  }
}

// Buscar informações de pagamento
export async function getPayment(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId })
    return {
      success: true,
      payment: response
    }
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Processar webhook do MercadoPago
export function processWebhook(body: any) {
  try {
    const { type, data } = body

    if (type === 'payment') {
      return {
        success: true,
        type: 'payment',
        payment_id: data.id
      }
    }

    return {
      success: true,
      type: type,
      data: data
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Mapear status do MercadoPago para nosso sistema
export function mapPaymentStatus(mpStatus: string) {
  const statusMap: Record<string, string> = {
    'pending': 'PENDING',
    'approved': 'COMPLETED',
    'authorized': 'PROCESSING',
    'in_process': 'PROCESSING',
    'in_mediation': 'PROCESSING',
    'rejected': 'FAILED',
    'cancelled': 'CANCELLED',
    'refunded': 'REFUNDED',
    'charged_back': 'REFUNDED'
  }

  return statusMap[mpStatus] || 'PENDING'
}

// Gerar código PIX (simulado para desenvolvimento)
export async function generatePixCode(amount: number, description: string) {
  try {
    // In production, use real MercadoPago PIX API
    if (process.env.NODE_ENV === 'production') {
      const response = await payment.create({
        body: {
          transaction_amount: amount,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: 'client@example.com' // Should be replaced with actual client email
          }
        }
      })
      
      if (!response.point_of_interaction?.transaction_data) {
        throw new Error('Invalid PIX response from MercadoPago')
      }
      
      const transactionData = response.point_of_interaction.transaction_data
      return {
        success: true,
        qr_code: transactionData.qr_code,
        qr_code_base64: transactionData.qr_code_base64 || '',
        ticket_url: transactionData.ticket_url || '',
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Default expiration if not provided
        amount: amount,
        description: description,
        payment_id: response.id
      }
    }

    // Development mock
    const pixCode = `00020101021243650016COM.MERCADOLIVRE02013063204398735204000053039865802BR5925Visa2Any Assessoria Inter6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    return {
      success: true,
      qr_code: pixCode,
      qr_code_base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      amount: amount,
      description: description
    }
  } catch (error) {
    console.error('Erro ao gerar código PIX:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export { client, payment, preference }
