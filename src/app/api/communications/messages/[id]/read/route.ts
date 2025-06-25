import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id

    if (!messageId) {
      return NextResponse.json(
      { error: 'Dados inválidos' }
      { status: 400 }
    )
    }

    // Here you would update the message status in the database
    // For now, we'll simulate the update
    const updatedMessage = {
      id: messageId,
      status: 'read',
      readAt: new Date().toISOString()
    }

    // Simulate database update delay
    await new Promise(resolve => setTimeout(resolve, 200))

    return NextResponse.json({
      message: 'Message marked as read'
      data: updatedMessage
    })

  } catch (error) {
    console.error('Mark message as read error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}