import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'next/server'

export async function PATCH(,  request: NextRequest,  { params }: { params: { id: string } }
) {  try {    const { id } = params,    const body = await request.json()
const { status, error } = body

    const socialPost = await prisma.socialPost.update({      where: { id },      data: {        status: 'ERROR',        error: error || 'Erro desconhecido',        updatedAt: new Date()
      }
    }),
    return NextResponse.json({      success: true,      message: 'Erro registrado com sucesso',      socialPost
    })

  } catch (dbError) {    console.error('[SOCIAL ERROR] Erro:', dbError),    return NextResponse.json(,      { error: 'Erro ao registrar falha' },      { status: 500 }
    )
  }
}