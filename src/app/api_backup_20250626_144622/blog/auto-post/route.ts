import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      author,
      tags,
      country,
      flag,
      difficulty,
      type,
      sourceUrl,
      urgent,
      trending
    } = body

    // Validação básica

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, excerpt, content, category' },
        { status: 400 }
      )
    }

    // Verificar se já existe um post com o mesmo título

    const existingPost = await prisma.blogPost.findFirst({
      where: { title }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Post com este título já existe' },
        { status: 409 }
      )
    }

    // Criar novo post no banco

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        category,
        author: author || 'Visa2Any Auto',
        tags: tags || [],
        country: country || 'Global',
        flag: flag || '🌍',
        difficulty: difficulty || 'Intermediário',
        type: type || 'Notícia',
        sourceUrl,
        urgent: urgent || false,
        trending: trending || false,
        publishDate: new Date(),
        readTime: calculateReadTime(content),
        views: 0,
        likes: 0,
        comments: 0,
        featured: urgent || trending || false
      }
    })

    // Log da atividade

    console.log(`[AUTO-POST] Novo artigo criado: ${title}`)

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Artigo criado automaticamente com sucesso'
    })

  } catch (error) {
    console.error('[AUTO-POST] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para verificar status do sistema
export async function GET() {
  try {
    const recentPosts = await prisma.blogPost.findMany({
      orderBy: { publishDate: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        publishDate: true,
        author: true,
        urgent: true,
        trending: true
      }
    })

    return NextResponse.json({
      status: 'active',
      message: 'Sistema de auto-posting funcionando',
      recentPosts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[AUTO-POST] Erro na verificação:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    )
  }
}

// Função auxiliar para calcular tempo de leitura
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(' ').length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

// Endpoint para atualizar posts existentes
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do post é obrigatório' },
        { status: 400 }
      )
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Post atualizado com sucesso'
    })

  } catch (error) {
    console.error('[AUTO-POST] Erro na atualização:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar post' },
      { status: 500 }
    )
  }
}