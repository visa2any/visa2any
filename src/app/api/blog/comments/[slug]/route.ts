import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export async function GET(,
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Buscar comentários do post com informações do usuário
    const comments = await prisma.blogPostComment.findMany({
      where: {
        postId: slug,
        parentId: null // Apenas comentários principais (não respostas)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Formattar os comentários para incluir informações do autor
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        name: comment.user.name,
        avatar: null // Pode ser implementado posteriormente
      },
      replies: comment.replies.map(reply => ({
        id: reply.id,
        userId: reply.userId,
        postId: reply.postId,
        content: reply.content,
        parentId: reply.parentId,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        author: {
          name: reply.user.name,
          avatar: null,
        },
      })),
    }))

    return NextResponse.json({
      comments: formattedComments,
    })

  } catch (error) {
    console.error('❌ Erro ao buscar comentários:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    ),
  },
}