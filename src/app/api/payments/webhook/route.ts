import { NextRequest, NextResponse } from 'next/server'
import { processWebhook } from '@/lib/mercadopago'
import { notificationService } from '@/lib/notification-service'

// POST - Webhook do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log do webhook para debugging
    console.log('Webhook recebido:', body)
    
    // Processar webhook
    const result = processWebhook(body)
    
    if (result.success && result.type === 'payment') {
      // Pagamento aprovado - notificar cliente se necessário
      // notificationService.sendPaymentConfirmation(...)
      // notificationService.sendBookingUpdate(...)
    }
    
    return NextResponse.json({
      success: result.success,
      message: 'Webhook processado com sucesso'})
    
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )}

// GET - Verificar webhook (para testes)
export async function GET() {
  return NextResponse.json({
    webhook: 'Mercado Pago Webhook Endpoint',
    status: 'Online',
    url: '/api/payments/webhook',
    methods: ['POST'],
    description: 'Endpoint para receber notificações de pagamento do Mercado Pago'})}