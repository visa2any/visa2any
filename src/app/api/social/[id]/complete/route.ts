import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, engagement } = body

    const socialPost = await prisma.socialPost.update({
      where: { id },
      data: {
        status: status === 'published' ? 'PUBLISHED' : status.toUpperCase(),
        publishedAt: status === 'published' ? new Date() : undefined,
        engagement: engagement || undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso',
      socialPost,
    })

  } catch (error) {
    console.error('[SOCIAL COMPLETE] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar status' },
      { status: 500 }
    ),
  },
}