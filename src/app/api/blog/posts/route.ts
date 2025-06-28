import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de busca e filtros
    const searchTerm = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'Todos'
    const difficulty = searchParams.get('difficulty') || 'Todos'
    const type = searchParams.get('type') || 'Todos'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const featured = searchParams.get('featured') === 'true'
    const trending = searchParams.get('trending') === 'true'
    const urgent = searchParams.get('urgent') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir filtros do Prisma
    const where: any = {
      published: true
    }

    // Filtro de busca por texto melhorado
    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2)
      
      if (searchWords.length > 0) {
        where.OR = [
          // Busca no título (maior relevância)
          { title: { contains: searchTerm, mode: 'insensitive' } },
          // Busca no resumo
          { excerpt: { contains: searchTerm, mode: 'insensitive' } },
          // Busca no conteúdo (menor relevância)
          { content: { contains: searchTerm, mode: 'insensitive' } },
          // Busca no país
          { country: { contains: searchTerm, mode: 'insensitive' } },
          // Busca no autor
          { author: { contains: searchTerm, mode: 'insensitive' } }
        ]
        
        // Adicionar busca individual por palavra para melhor matching
        for (const word of searchWords) {
          where.OR.push(
            { title: { contains: word, mode: 'insensitive' } },
            { excerpt: { contains: word, mode: 'insensitive' } },
            { country: { contains: word, mode: 'insensitive' } }
          )
        }
      }
    }

    // Filtros específicos
    if (category !== 'Todos') {
      where.category = category
    }
    if (difficulty !== 'Todos') {
      where.difficulty = difficulty
    }
    if (type !== 'Todos') {
      where.type = type
    }
    if (featured) {
      where.featured = true
    }
    if (trending) {
      where.trending = true
    }
    if (urgent) {
      where.urgent = true
    }

    // Ordenação
    let orderBy: any = { publishDate: 'desc' }
    
    switch (sortBy) {
      case 'newest':
        orderBy = { publishDate: 'desc' }
        break
      case 'oldest':
        orderBy = { publishDate: 'asc' }
        break
      case 'popular':
        orderBy = { views: 'desc' }
        break
      case 'liked':
        orderBy = { likes: 'desc' }
        break
    }

    // Buscar posts
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset
    })

    // Buscar total para paginação
    const total = await prisma.blogPost.count({ where })

    // Converter tags JSON para array
    const postsWithTags = posts.map(post => ({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags : []
    }))
    
    return NextResponse.json({
      posts: postsWithTags,
      total,
      hasMore: offset + posts.length < total,
      pagination: {
        current: Math.floor(offset / limit) + 1,
        total: Math.ceil(total / limit),
        limit,
        offset
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error)
    
    // Retornar dados de fallback em caso de erro de banco
    return NextResponse.json({
      posts: [],
      total: 0,
      hasMore: false,
      pagination: {
        current: 1,
        total: 0,
        limit: 50,
        offset: 0
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    const { title, excerpt, content, category, author, readTime, tags, difficulty, type } = body
    
    if (!title || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios: title, excerpt, content, category, author'
        },
        { status: 400 }
      )
    }

    // Criar post
    const post = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        category,
        author,
        authorImage: body.authorImage,
        readTime: readTime || '5 min',
        featured: body.featured || false,
        trending: body.trending || false,
        urgent: body.urgent || false,
        tags: tags || [],
        country: body.country,
        flag: body.flag,
        difficulty: difficulty || 'Intermediário',
        type: type || 'Notícia',
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        sourceUrl: body.sourceUrl,
        sponsored: body.sponsored || false,
        published: body.published !== false // default true
      }
    })
    
    return NextResponse.json({
      post: {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : []
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar post:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}