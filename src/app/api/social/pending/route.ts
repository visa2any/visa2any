import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Buscar posts pendentes para publicação,
export async function GET() {,  try {
    const now =  
const pendingPosts = await prisma.socialPost.findMany({,      where: {,        status: 'SCHEDULED',        scheduledAt: {,          lte: now // Posts agendados para agora ou no passado
        }
      },      orderBy: { scheduledAt: 'asc' },      take: 50
    }),
    return NextResponse.json({,      success: true,      count: pendingPosts.length,      posts: pendingPosts
    })

  } catch (error) {,    console.error('[SOCIAL PENDING] Erro:', error),    return NextResponse.json(,      { error: 'Erro ao buscar posts pendentes' },      { status: 500 }
    )
  }
}