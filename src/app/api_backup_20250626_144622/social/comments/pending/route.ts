import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Buscar comentários pendentes de resposta
export async function GET() {
  try {
    // Buscar comentários que precisam de resposta
    const pendingComments = await prisma.socialComment.findMany({
      where: {
        needsResponse: true,
        responded: false,
        escalated: false
      }
      orderBy: { createdAt: 'asc' },
      take: 50
    })

    return NextResponse.json({
      success: true
      count: pendingComments.length,
      comments: pendingComments
    })

  } catch (error) {
    console.error('[COMMENTS PENDING] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar comentários pendentes' }
      { status: 500 }
    )
  }
}