import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      blogPostId,
      platform,
      content,
      imageUrl,
      hashtags,
      scheduledAt
    } = body

    // Validar dados obrigatórios
    if (!blogPostId || !platform || !content) {
      return NextResponse.json(
        { error: 'blogPostId, platform e content são obrigatórios' },
        { status: 400 }
      )
    }

    // Converter platform string para enum
    const platformEnum = platform.toUpperCase()
    if (!['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TWITTER'].includes(platformEnum)) {
      return NextResponse.json(
        { error: 'Plataforma inválida' },
        { status: 400 }
      )
    }

    // Criar post agendado
    const socialPost = await prisma.socialPost.create({
      data: {
        blogPostId,
        platform: platformEnum as any,
        content,
        imageUrl,
        hashtags: hashtags || [],
        scheduledAt: new Date(scheduledAt || Date.now()),
        status: 'SCHEDULED'
      }
    })
    return NextResponse.json({      success: true,      message: 'Post agendado com sucesso',      socialPost: {        id: socialPost.id,        platform: socialPost.platform,        scheduledAt: socialPost.scheduledAt,        status: socialPost.status
      }
    })

  } catch (error) {    console.error('[SOCIAL SCHEDULE] Erro:', error),    return NextResponse.json(,      { error: 'Erro interno do servidor' },      { status: 500 }
    )
  }
}

// GET - Listar posts agendados

export async function GET(request: NextRequest) {  try {    const { searchParams } = new URL(request.url)
    const status =  
const platform = searchParams.get('platform')

    const where: any = {},    if (status) where.status = status.toUpperCase(),    if (platform) where.platform = platform.toUpperCase(),
    const socialPosts = await prisma.socialPost.findMany({      where,      orderBy: { scheduledAt: 'asc' },      take: 100
    }),
    const stats = {      total: socialPosts.length,      byStatus: socialPosts.reduce((acc, post) => {        acc[post.status] = (acc[post.status] || 0) + 1,        return acc
      }, {} as Record<string, number>),      byPlatform: socialPosts.reduce((acc, post) => {        acc[post.platform] = (acc[post.platform] || 0) + 1,        return acc
      }, {} as Record<string, number>)
    },
    return NextResponse.json({      success: true,      stats,      socialPosts: socialPosts.map(post => ({        id: post.id,        blogPostId: post.blogPostId,        platform: post.platform,        content: post.content.substring(0, 200) + '...',        scheduledAt: post.scheduledAt,        publishedAt: post.publishedAt,        status: post.status,        createdAt: post.createdAt
      }))
    })

  } catch (error) {    console.error('[SOCIAL SCHEDULE] Erro ao listar:', error),    return NextResponse.json(,      { error: 'Erro ao listar posts agendados' },      { status: 500 }
    )
  }
}