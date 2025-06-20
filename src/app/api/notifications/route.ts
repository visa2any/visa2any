import { NextRequest, NextResponse } from 'next/server'
import { notificationService, NotificationData } from '@/lib/notification-service'

// POST - Enviar notificações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'send_booking_created':
        // Notificar criação de agendamento
        if (!data.trackingId || !data.customerName || !data.customerEmail) {
          return NextResponse.json(
            { error: 'Campos trackingId, customerName e customerEmail são obrigatórios' },
            { status: 400 }
          )
        }

        const bookingResult = await notificationService.sendBookingCreated(data)
        
        return NextResponse.json({
          success: bookingResult.whatsappSent || bookingResult.emailSent,
          notifications: {
            whatsapp: bookingResult.whatsappSent ? 'Enviado' : 'Falhou',
            email: bookingResult.emailSent ? 'Enviado' : 'Falhou'
          },
          errors: bookingResult.errors,
          message: 'Notificações de agendamento enviadas'
        })

      case 'send_payment_link':
        // Enviar link de pagamento
        const { trackingId, paymentUrl, pixCode } = data
        
        if (!trackingId || !paymentUrl) {
          return NextResponse.json(
            { error: 'Campos trackingId e paymentUrl são obrigatórios' },
            { status: 400 }
          )
        }

        const paymentSent = await notificationService.sendPaymentLink(trackingId, paymentUrl, pixCode)
        
        return NextResponse.json({
          success: paymentSent,
          notification: paymentSent ? 'Link de pagamento enviado via WhatsApp' : 'Falha ao enviar',
          sharing: {
            whatsapp: `https://wa.me/?text=💳 Link de pagamento: ${paymentUrl}`,
            telegram: `https://t.me/share/url?url=${paymentUrl}`,
            email: `mailto:?subject=Link de Pagamento&body=Pague seu agendamento: ${paymentUrl}`
          }
        })

      case 'send_payment_confirmation':
        // Confirmar pagamento
        const confirmationSent = await notificationService.sendPaymentConfirmation(data.trackingId)
        
        return NextResponse.json({
          success: confirmationSent,
          message: confirmationSent ? 
            'Confirmação de pagamento enviada' : 
            'Falha ao enviar confirmação'
        })

      case 'send_booking_update':
        // Atualização de status
        const { trackingId: updateTrackingId, status } = data
        
        if (!updateTrackingId || !status) {
          return NextResponse.json(
            { error: 'Campos trackingId e status são obrigatórios' },
            { status: 400 }
          )
        }

        const updateSent = await notificationService.sendBookingUpdate(updateTrackingId, status)
        
        return NextResponse.json({
          success: updateSent,
          message: updateSent ? 
            `Atualização '${status}' enviada` : 
            'Falha ao enviar atualização'
        })

      case 'send_booking_completed':
        // Agendamento concluído
        const { trackingId: completedTrackingId, appointmentDetails } = data
        
        if (!completedTrackingId || !appointmentDetails) {
          return NextResponse.json(
            { error: 'Campos trackingId e appointmentDetails são obrigatórios' },
            { status: 400 }
          )
        }

        const completedSent = await notificationService.sendBookingCompleted(
          completedTrackingId, 
          appointmentDetails
        )
        
        return NextResponse.json({
          success: completedSent,
          message: completedSent ? 
            'Confirmação de agendamento enviada' : 
            'Falha ao enviar confirmação final',
          celebration: '🎉 Agendamento concluído com sucesso!'
        })

      default:
        return NextResponse.json(
          { error: 'Action deve ser: send_booking_created, send_payment_link, send_payment_confirmation, send_booking_update, ou send_booking_completed' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro na API de notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Verificar configuração e enviar testes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'config'

    switch (action) {
      case 'config':
        // Verificar configuração
        const config = await notificationService.testConfiguration()
        
        return NextResponse.json({
          success: true,
          configuration: {
            whatsapp: {
              status: config.whatsapp.status,
              configured: config.whatsapp.configured,
              provider: 'WhatsApp Business API'
            },
            email: {
              status: config.email.status,
              configured: config.email.configured,
              provider: config.email.provider
            }
          },
          setup: {
            whatsapp: {
              required: ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
              documentation: 'https://developers.facebook.com/docs/whatsapp'
            },
            email: {
              required: ['SENDGRID_API_KEY ou RESEND_API_KEY', 'FROM_EMAIL'],
              providers: ['SendGrid', 'Resend']
            }
          }
        })

      case 'test':
        // Enviar notificação de teste
        const testData: NotificationData = {
          trackingId: `TEST-${Date.now()}`,
          customerName: 'Cliente Teste',
          customerEmail: 'teste@email.com',
          customerPhone: '+5511999999999',
          serviceLevel: 'premium',
          country: 'usa',
          visaType: 'tourist',
          amount: 45.00
        }

        const testResult = await notificationService.sendBookingCreated(testData)
        
        return NextResponse.json({
          success: testResult.whatsappSent || testResult.emailSent,
          test: {
            whatsapp: testResult.whatsappSent ? 'Enviado' : 'Falhou',
            email: testResult.emailSent ? 'Enviado' : 'Falhou',
            errors: testResult.errors
          },
          message: 'Teste de notificação executado'
        })

      case 'templates':
        // Listar templates disponíveis
        return NextResponse.json({
          success: true,
          templates: {
            whatsapp: [
              {
                name: 'booking_created',
                description: 'Agendamento criado',
                variables: ['customerName', 'trackingId', 'country', 'serviceLevel']
              },
              {
                name: 'payment_link',
                description: 'Link de pagamento',
                variables: ['paymentUrl', 'amount', 'pixCode']
              },
              {
                name: 'payment_confirmed',
                description: 'Pagamento confirmado',
                variables: ['trackingId', 'amount']
              },
              {
                name: 'booking_completed',
                description: 'Agendamento concluído',
                variables: ['appointmentDetails', 'confirmationCode']
              }
            ],
            email: [
              {
                name: 'booking_created_email',
                description: 'Email de agendamento criado',
                type: 'HTML template'
              },
              {
                name: 'payment_confirmed_email',
                description: 'Email de pagamento confirmado',
                type: 'HTML template'
              },
              {
                name: 'booking_completed_email',
                description: 'Email de agendamento concluído',
                type: 'HTML template'
              }
            ]
          },
          customization: 'Templates podem ser personalizados no código'
        })

      case 'stats':
        // Estatísticas de notificações (simulado)
        return NextResponse.json({
          success: true,
          statistics: {
            today: {
              whatsapp: { sent: 12, failed: 1, rate: '92.3%' },
              email: { sent: 15, failed: 0, rate: '100%' }
            },
            thisWeek: {
              whatsapp: { sent: 89, failed: 8, rate: '91.8%' },
              email: { sent: 95, failed: 2, rate: '97.9%' }
            },
            thisMonth: {
              whatsapp: { sent: 324, failed: 28, rate: '92.0%' },
              email: { sent: 341, failed: 9, rate: '97.4%' }
            }
          },
          performance: {
            averageDeliveryTime: '2.3 segundos',
            peakHours: '09:00-11:00 e 14:00-17:00',
            bestPerformingChannel: 'Email'
          }
        })

      default:
        return NextResponse.json(
          { error: 'Action deve ser: config, test, templates, ou stats' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro na consulta de notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}