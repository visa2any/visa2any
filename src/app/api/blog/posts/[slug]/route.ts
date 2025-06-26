import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(,  request: NextRequest,  { params }: { params: { slug: string } }
) {,  try {,    const { slug } = params

    // Buscar post por ID (slug),    const post = await prisma.blogPost.findFirst({,      where: {,        id: slug,        published: true
      }
    }),
    if (!post) {,      return NextResponse.json(,        {
          error: 'Post não encontrado'
        },        { status: 404 }
      )
    }

    // Incrementar views,    await prisma.blogPost.update({,      where: { id: slug },      data: {,        views: {,          increment: 1
        }
      }
    })

    // Buscar posts relacionados (mesma categoria, exceto o atual),    const relatedPosts = await prisma.blogPost.findMany({,      where: {,        category: post.category,        id: { not: post.id },        published: true
      },      take: 4,      orderBy: {,        publishDate: 'desc'
      }
    }),
    return NextResponse.json({,      post: {
        ...post,        tags: Array.isArray(post.tags) ? post.tags : [],        views: post.views + 1 // Mostrar a view incrementada      },      relatedPosts: relatedPosts.map(p => ({
        ...p,        tags: Array.isArray(p.tags) ? p.tags : []
      }))
    })

  } catch (error) {,    console.error('❌ Erro ao buscar post:', error),    console.error('Slug solicitado:', slug),    return NextResponse.json(,      {
        error: 'Erro interno do servidor'
      },      { status: 500 }
    )
  }
},

export async function PUT(,  request: NextRequest,  { params }: { params: { slug: string } }
) {,  try {,    const { slug } = params,    const body = await request.json()

    // Verificar se o post existe,    const existingPost = await prisma.blogPost.findFirst({,      where: { id: slug }
    }),
    if (!existingPost) {,      return NextResponse.json(,        {
          error: 'Post não encontrado'
        },        { status: 404 }
      )
    }

    // Atualizar post,    const updatedPost = await prisma.blogPost.update({,      where: { id: slug },      data: {
        ...body,        updatedAt: new Date()
      }
    }),
    return NextResponse.json({,      post: {
        ...updatedPost,        tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : []
      }
    })

  } catch (error) {,    console.error('❌ Erro ao atualizar post:', error),    return NextResponse.json(,      {
        error: 'Erro interno do servidor'
      },      { status: 500 }
    )
  }
},

export async function DELETE(,  request: NextRequest,  { params }: { params: { slug: string } }
) {,  try {,    const { slug } = params

    // Verificar se o post existe,    const existingPost = await prisma.blogPost.findFirst({,      where: { id: slug }
    }),
    if (!existingPost) {,      return NextResponse.json(,        {
          error: 'Post não encontrado'
        },        { status: 404 }
      )
    }

    // Soft delete - marcar como não publicado,    await prisma.blogPost.update({,      where: { id: slug },      data: {,        published: false,        updatedAt: new Date()
      }
    }),
    return NextResponse.json({,      message: 'Post removido com sucesso'
    })

  } catch (error) {,    console.error('❌ Erro ao remover post:', error),    return NextResponse.json(,      {
        error: 'Erro interno do servidor'
      },      { status: 500 }
    )
  }
}