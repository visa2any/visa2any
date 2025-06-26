import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// POST /api/blog/bookmark - Toggle bookmark on blog post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autorizado' }
        { status: 401 }
      )
    }

    // Verify token
    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'Erro interno do servidor' }
        { status: 500 }
      )
    }

    let userId: string
    try {
      const decoded = jwt.verify(authToken, jwtSecret) as any
      userId = decoded.userId
    } catch {
      return NextResponse.json(
        { error: 'Token inválido' }
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId, action } = body

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Dados inválidos' }
        { status: 400 }
      )
    }

    if (action === 'add') {
      // Check if already bookmarked
      const existingBookmark = await prisma.blogPostBookmark.findUnique({
        where: {
          userId_postId: {
            userId
            postId
          }
        }
      })

      if (!existingBookmark) {
        await prisma.blogPostBookmark.create({
          data: {
            userId
            postId
          }
        })
      }
    } else if (action === 'remove') {
      await prisma.blogPostBookmark.deleteMany({
        where: {
          userId
          postId
        }
      })
    }

    return NextResponse.json({
      success: true
      action
    })

  } catch (error) {
    console.error('Error handling blog bookmark:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }
      { status: 500 }
    )
  }
}