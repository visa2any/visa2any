import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const commentSchema = z.object({
  postId: z.string().min(1, 'Post ID é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(1000, 'Máximo 1000 caracteres'),
  parentId: z.string().optional() // For replies
})

// POST /api/blog/comment - Add comment to blog post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de autenticação é obrigatório' },
        { status: 401 }
      )
    }

    // Verify token
    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    let userId: string
    let userEmail: string
    try {
      const decoded = jwt.verify(authToken, jwtSecret) as any
      userId = decoded.userId
      userEmail = decoded.email
    } catch {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = commentSchema.parse(body)

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await prisma.blogPostComment.create({
      data: {
        userId,
        postId: validatedData.postId,
        content: validatedData.content,
        parentId: validatedData.parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      comment,
      message: 'Comentário adicionado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        }
        { status: 400 }
      )
    }

    console.error('Error adding blog comment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}

// GET /api/blog/comment - Get comments for a blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const comments = await prisma.blogPostComment.findMany({
      where: {
        postId,
        parentId: null // Only root comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      comments
    })

  } catch (error) {
    console.error('Error fetching blog comments:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}