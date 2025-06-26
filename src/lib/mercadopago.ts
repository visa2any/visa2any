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
    street_number: number
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
    
    const preferenceData = {
      items: data.items,
      payer: data.payer,
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
      external_reference: data.external_reference,
      expires: false,
      ...data
    }

    const response = await preference.create({ body: preferenceData })
    
    return {
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    }
  } catch (error) {
    console.error('Erro ao criar preferência MercadoPago:', error)
    return {
      error: error.message
    }
  }
}

// Buscar informações de pagamento
export async function getPayment(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId })
    return {
      payment: response
    }
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return {
      error: error.message
    }
  }
}

// Processar webhook do MercadoPago
export function processWebhook(body: any) {
  try {
    const { type, data } = body

    if (type === 'payment') {
      return {
        type: 'payment',
        payment_id: data.id
      }
    }

    return {
      type: type,
      data: data
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      error: error.message
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
export function generatePixCode(amount: number, description: string) {
  // Em produção
 usar a API real do MercadoPago para PIX
  const pixCode = `00020101021243650016COM.MERCADOLIVRE02013063204398735204000053039865802BR5925Visa2Any Assessoria Inter6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  
  return {
    qr_code: pixCode,
    qr_code_base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`, // Placeholder
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    amount: amount,
    description: description
  }
}

export { client, payment, preference }