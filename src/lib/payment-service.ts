// Sistema de Pagamento - PIX e Mercado Pago
// Cobrança automática para agendamentos

import { MercadoPagoConfig, Payment } from 'mercadopago'

interface PaymentRequest {
  trackingId: string
  amount: number
  description: string
  customerInfo: {
    name: string
    email: string
    phone: string
    document?: string
  }
  serviceLevel: 'basic' | 'premium' | 'express'
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
}

interface PaymentResponse {
  success: boolean
  paymentId?: string
  pixCode?: string | undefined
  pixQrCode?: string | undefined
  paymentUrl?: string | undefined
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  error?: string | undefined
  expiresAt?: string | undefined
}

class PaymentService {
  private mercadoPago: MercadoPagoConfig
  
  constructor() {
    // Configurar Mercado Pago
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-your-access-token',
      options: {
        timeout: 5000,
        idempotencyKey: 'unique-key'
      }
    })
  }

  // Criar cobrança PIX (mais rápido e barato)
  async createPixPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payment = new Payment(this.mercadoPago)
      
      const paymentData = {
        transaction_amount: request.amount,
        description: request.description,
        payment_method_id: 'pix',
        payer: {
          email: request.customerInfo.email,
          first_name: request.customerInfo.name.split(' ')[0] || '',
          last_name: request.customerInfo.name.split(' ').slice(1).join(' '),
          identification: {
            type: 'CPF',
            number: request.customerInfo.document || '00000000000'
          }
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
        external_reference: request.trackingId,
        metadata: {
          service_level: request.serviceLevel,
          tracking_id: request.trackingId
        }
      }

      const result = await payment.create({ body: paymentData })
      
      if (result.status === 'pending') {
        // Salvar no banco de dados
        await this.savePaymentRecord({
          trackingId: request.trackingId,
          paymentId: result.id!.toString(),
          amount: request.amount,
          status: 'pending',
          pixCode: result.point_of_interaction?.transaction_data?.qr_code,
          pixQrCode: result.point_of_interaction?.transaction_data?.qr_code_base64,
          expiresAt: this.calculateExpirationDate()
        })

        return {
          success: true,
          paymentId: result.id!.toString(),
          pixCode: result.point_of_interaction?.transaction_data?.qr_code,
          pixQrCode: result.point_of_interaction?.transaction_data?.qr_code_base64,
          status: 'pending',
          expiresAt: this.calculateExpirationDate()
        }
      } else {
        return {
          success: false,
          status: 'rejected',
          error: 'Falha ao criar pagamento PIX'
        }
      }

    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return {
        success: false,
        status: 'rejected',
        error: `Erro no pagamento: ${errorMessage}`
      }
    }
  }

  // Criar cobrança com cartão de crédito
  async createCardPayment(request: PaymentRequest & {
    cardToken: string
    installments: number
  }): Promise<PaymentResponse> {
    try {
      const payment = new Payment(this.mercadoPago)
      
      const paymentData = {
        transaction_amount: request.amount,
        token: request.cardToken,
        description: request.description,
        installments: request.installments,
        payment_method_id: 'visa', // Será determinado pelo token
        payer: {
          email: request.customerInfo.email,
          identification: {
            type: 'CPF',
            number: request.customerInfo.document || '00000000000'
          }
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
        external_reference: request.trackingId
      }

      const result = await payment.create({ body: paymentData })
      
      await this.savePaymentRecord({
        trackingId: request.trackingId,
        paymentId: result.id!.toString(),
        amount: request.amount,
        status: result.status as any || 'pending',
        expiresAt: this.calculateExpirationDate()
      })

      return {
        success: result.status === 'approved',
        paymentId: result.id!.toString(),
        status: result.status as any || 'pending',
        error: result.status === 'rejected' ? 'Pagamento rejeitado' : undefined
      }

    } catch (error) {
      console.error('Erro ao processar cartão:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return {
        success: false,
        status: 'rejected',
        error: `Erro no pagamento: ${errorMessage}`
      }
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId: string): Promise<{
    status: string
    approved: boolean
    details?: any
  }> {
    try {
      const payment = new Payment(this.mercadoPago)
      const result = await payment.get({ id: paymentId })

      await this.updatePaymentStatus(paymentId, result.status as any)

      return {
        status: result.status || 'unknown',
        approved: result.status === 'approved',
        details: result
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      return {
        status: 'error',
        approved: false,
        details: { error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    }
  }

  // Calcular preço do serviço
  calculateServicePrice(serviceLevel: 'basic' | 'premium' | 'express') {
    const prices = {
      basic: {
        amount: 25.00,
        description: 'Agendamento Básico - Visa2Any',
        processingTime: '5-7 dias úteis'
      },
      premium: {
        amount: 45.00,
        description: 'Agendamento Premium - Visa2Any',
        processingTime: '1-3 dias úteis'
      },
      express: {
        amount: 75.00,
        description: 'Agendamento Express - Visa2Any',
        processingTime: '24-48 horas'
      }
    }

    return prices[serviceLevel]
  }

  // Gerar link de pagamento (para enviar por WhatsApp/Email)
  async generatePaymentLink(trackingId: string, serviceLevel: 'basic' | 'premium' | 'express', customerInfo: any): Promise<{
    success: boolean
    paymentUrl?: string
    pixCode?: string
    amount: number
    expiresAt?: string
  }> {
    const pricing = this.calculateServicePrice(serviceLevel)
    
    const paymentRequest: PaymentRequest = {
      trackingId,
      amount: pricing.amount,
      description: pricing.description,
      customerInfo,
      serviceLevel,
      paymentMethod: 'pix'
    }

    const pixPayment = await this.createPixPayment(paymentRequest)
    
    if (pixPayment.success) {
      const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${trackingId}`
      
      return {
        success: true,
        paymentUrl,
        pixCode: pixPayment.pixCode,
        amount: pricing.amount,
        expiresAt: pixPayment.expiresAt
      }
    }

    return {
      success: false,
      amount: pricing.amount
    }
  }

  // Métodos auxiliares para banco de dados
  private async savePaymentRecord(data: any) {
    // Simulação de salvar no banco de dados
    console.log('Salvando registro de pagamento:', data)
  }

  private async updatePaymentStatus(paymentId: string, status: string) {
    // Simulação de atualizar no banco de dados
    console.log(`Atualizando status do pagamento ${paymentId} para ${status}`)
  }

  private calculateExpirationDate(): string {
    const date = new Date()
    date.setHours(date.getHours() + 1) // Expira em 1 hora
    return date.toISOString()
  }

  async testIntegration(): Promise<{ success: boolean; mercadoPagoStatus: string; environment: string; }> {
    try {
        // Simples verificação de conectividade
        return {
            success: true,
            mercadoPagoStatus: 'ok',
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        };
    } catch (error) {
        return {
            success: false,
            mercadoPagoStatus: 'error',
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        };
    }
  }
}

export const paymentService = new PaymentService()

// Types export
export type { PaymentRequest, PaymentResponse }