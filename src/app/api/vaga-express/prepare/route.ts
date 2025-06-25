import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['clientId', 'clientName', 'clientEmail', 'plan', 'amount']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          error: `Missing required field: ${field}`,
        }, { status: 400 }),
      }
    }

    // Salvar dados temporariamente (poderia ser Redis, DB, etc.)
    // Por agora, apenas logar para debug
    console.log('🥇 Vaga Express preparado:', {
      purchaseId: body.purchaseId,
      plan: body.plan,
      client: body.clientName,
      amount: body.amount,
      country: body.country,
    })

    // Em produção, aqui salvaria no banco de dados temporário
    // ou enviaria para fila de processamento

    return NextResponse.json({
      message: 'Vaga Express prepared successfully',
      purchaseId: body.purchaseId,
    })

  } catch (error) {
    console.error('Erro ao preparar Vaga Express:', error)
    return NextResponse.json({
      error: 'Internal server error',
    }, { status: 500 }),
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Vaga Express API - Use POST to prepare subscription',
  })
}