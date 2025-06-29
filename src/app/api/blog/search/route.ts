import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const suggest = searchParams.get('suggest') === 'true'
    
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        suggestions: []
      })
    }

    // Se for para sugestões, retornar resultados mais rápidos
    if (suggest) {
      const suggestions = await generateSuggestions(query)
      return NextResponse.json({
        suggestions
      })
    }

    // Busca completa com ranking de relevância
    const results = await performAdvancedSearch(query)
    
    return NextResponse.json({
      results,
      total: results.length
    })

  } catch (error) {
    console.error('❌ Erro na busca:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}

async function generateSuggestions(query: string) {
  const searchTerm = query.toLowerCase().trim()
  
  try {
    // Buscar títulos que contenham o termo
    const titleMatches = await prisma.blogPost.findMany({
      where: {
        published: true,
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      select: {
        title: true,
        category: true,
        country: true
      },
      take: 5
    })

    // Buscar países únicos que contenham o termo
    const countryMatches = await prisma.blogPost.findMany({
      where: {
        published: true,
        country: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      select: {
        country: true,
        flag: true
      },
      distinct: ['country'],
      take: 3
    })

    // Buscar categorias que contenham o termo
    const categoryMatches = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      select: {
        category: true
      },
      distinct: ['category'],
      take: 3
    })
    
    const suggestions = []

    // Adicionar sugestões de títulos
    titleMatches.forEach(post => {
      suggestions.push({
        type: 'post',
        text: post.title,
        category: post.category,
        icon: '📄'
      })
    })

    // Adicionar sugestões de países
    countryMatches.forEach(country => {
      if (country.country) {
        suggestions.push({
          type: 'country',
          text: `${country.flag || '🌍'} ${country.country}`,
          category: 'País',
          icon: country.flag || '🌍'
        })
      }
    })

    // Adicionar sugestões de categorias
    categoryMatches.forEach(cat => {
      suggestions.push({
        type: 'category',
        text: cat.category,
        category: 'Categoria',
        icon: '📂'
      })
    })
    
    return suggestions.slice(0, 8) // Limitar a 8 sugestões

  } catch (error) {
    console.error('Erro ao gerar sugestões:', error)
    return []
  }
}

async function performAdvancedSearch(query: string) {
  const searchWords = query.toLowerCase().split(' ').filter(word => word.length > 1)
  
  try {
    // Buscar posts com diferentes critérios de relevância
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          // Busca exata no título (maior relevância)
          { title: { contains: query, mode: 'insensitive' } },
          // Busca exata no resumo
          { excerpt: { contains: query, mode: 'insensitive' } },
          // Busca no conteúdo
          { content: { contains: query, mode: 'insensitive' } },
          // Busca no país
          { country: { contains: query, mode: 'insensitive' } },
          // Busca no autor
          { author: { contains: query, mode: 'insensitive' } },
          // Busca individual por palavras
          ...searchWords.flatMap(word => [
            { title: { contains: word, mode: 'insensitive' } },
            { excerpt: { contains: word, mode: 'insensitive' } },
            { country: { contains: word, mode: 'insensitive' } }
          ])
        ]
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        author: true,
        publishDate: true,
        readTime: true,
        views: true,
        likes: true,
        comments: true,
        difficulty: true,
        type: true,
        imageUrl: true,
        featured: true,
        trending: true,
        urgent: true,
        tags: true,
        country: true,
        flag: true
      }
    })

    // Calcular score de relevância para cada post
    const resultsWithScore = posts.map(post => {
      let score = 0
      const titleLower = post.title.toLowerCase()
      const excerptLower = post.excerpt.toLowerCase()
      const queryLower = query.toLowerCase()

      // Score por match exato no título (alta relevância)
      if (titleLower.includes(queryLower)) {
        score += 100
        if (titleLower.startsWith(queryLower)) score += 50
      }

      // Score por match no resumo
      if (excerptLower.includes(queryLower)) {
        score += 50
      }

      // Score por país
      if (post.country && post.country.toLowerCase().includes(queryLower)) {
        score += 30
      }

      // Score por palavras individuais
      searchWords.forEach(word => {
        if (titleLower.includes(word)) score += 20
        if (excerptLower.includes(word)) score += 10
        if (post.country && post.country.toLowerCase().includes(word)) score += 15
      })

      // Boost para posts especiais
      if (post.featured) score += 10
      if (post.trending) score += 15
      if (post.urgent) score += 20

      // Score por engagement
      score += Math.min(post.views / 100, 20) // Max 20 pontos por views
      score += Math.min(post.likes / 10, 10) // Max 10 pontos por likes

      return {
        ...post,
        score,
        tags: Array.isArray(post.tags) ? post.tags : [],
        relevance: score > 100 ? 'high' : score > 50 ? 'medium' : 'low'
      }
    })

    // Ordenar por score e remover duplicatas
    const uniqueResults = Array.from(
      new Map(resultsWithScore.map(post => [post.id, post])).values()
    ).sort((a, b) => b.score - a.score)
    
    return uniqueResults.slice(0, 50) // Limitar a 50 resultados

  } catch (error) {
    console.error('Erro na busca avançada:', error)
    return []
  }
}