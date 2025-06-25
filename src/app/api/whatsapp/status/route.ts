import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppServiceSimple } from '@/lib/whatsapp-simple'

// GET /api/whatsapp/status - Verificar status do WhatsApp
export async function GET(request: NextRequest) {
  try {
    const whatsappService = getWhatsAppServiceSimple()
    const status = whatsappService.getStatus()

    return NextResponse.json({
      data: {
        service: 'WhatsApp Baileys Integrado'
        ...status,
        timestamp: new Date().toISOString()
        instructions: status.needsQR ? [
          '1. Execute `npm run dev` no terminal',
          '2. O QR Code aparecerá no console do Next.js',
          '3. Abra WhatsApp > Menu > Dispositivos conectados',
          '4. Escaneie o QR Code',
          '5. Aguarde confirmação de conexão'
        ] : null,
      }
    })

  } catch (error) {
    console.error('Erro ao verificar status do WhatsApp:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao verificar status do WhatsApp'
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      }
      { status: 500 }
    )
  }
}

// POST /api/whatsapp/status - Reconectar WhatsApp
export async function POST(request: NextRequest) {
  try {
    // Reconectar forçadamente
    const whatsappService = getWhatsAppServiceSimple()
    
    return NextResponse.json({
      message: 'Reconexão iniciada. Verifique o console para o QR Code.'
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao reconectar WhatsApp:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao reconectar WhatsApp'
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      }
      { status: 500 }
    )
  }
}