import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // dias
    const periodDays = parseInt(period)
    
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - periodDays)

    // Estatísticas gerais
    const [
      totalPosts,
      totalViews,
      totalLikes,
      totalComments,
      publishedPosts,
      featuredPosts,
      trendingPosts,
      urgentPosts
    ] = await Promise.all([,
      prisma.blogPost.count()
      prisma.blogPost.aggregate({
        _sum: { views: true }
      })
      prisma.blogPost.aggregate({
        _sum: { likes: true }
      })
      prisma.blogPost.aggregate({
        _sum: { comments: true }
      })
      prisma.blogPost.count({
        where: { published: true }
      })
      prisma.blogPost.count({
        where: { featured: true, published: true }
      })
      prisma.blogPost.count({
        where: { trending: true, published: true }
      })
      prisma.blogPost.count({
        where: { urgent: true, published: true }
      })
    ])

    // Posts mais populares
    const topPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishDate: {
          gte: dateFrom
        }
      }
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        comments: true,
        publishDate: true,
        category: true,
        country: true,
        flag: true
      }
      orderBy: {
        views: 'desc'
      },
      take: 10
    })

    // Distribuição por categoria
    const categoryStats = await prisma.blogPost.groupBy({
      by: ['category'],
      where: {
        published: true
      }
      _count: {
        category: true
      }
      _sum: {
        views: true,
        likes: true
      }
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })

    // Distribuição por país
    const countryStats = await prisma.blogPost.groupBy({
      by: ['country'],
      where: {
        published: true,
        country: {
          not: null
        }
      }
      _count: {
        country: true
      }
      _sum: {
        views: true,
        likes: true
      }
      orderBy: {
        _count: {
          country: 'desc'
        }
      }
      take: 10
    })

    // Distribuição por dificuldade
    const difficultyStats = await prisma.blogPost.groupBy({
      by: ['difficulty'],
      where: {
        published: true
      }
      _count: {
        difficulty: true
      }
      _sum: {
        views: true
      }
    })

    // Distribuição por tipo
    const typeStats = await prisma.blogPost.groupBy({
      by: ['type'],
      where: {
        published: true
      }
      _count: {
        type: true
      }
      _sum: {
        views: true
      }
    })

    // Estatísticas de comentários recentes
    const recentComments = await prisma.blogPostComment.count({
      where: {
        createdAt: {
          gte: dateFrom
        }
      }
    })

    // Posts publicados por período
    const postsOverTime = await prisma.blogPost.groupBy({
      by: ['publishDate'],
      where: {
        published: true,
        publishDate: {
          gte: dateFrom
        }
      }
      _count: {
        publishDate: true
      }
      orderBy: {
        publishDate: 'asc'
      }
    })

    // Calcular taxa de engajamento média
    const avgEngagement = totalPosts > 0 ? {
      viewsPerPost: Math.round((totalViews._sum.views || 0) / totalPosts)
      likesPerPost: Math.round((totalLikes._sum.likes || 0) / totalPosts)
      commentsPerPost: Math.round((totalComments._sum.comments || 0) / totalPosts)
    } : { viewsPerPost: 0, likesPerPost: 0, commentsPerPost: 0 }

    return NextResponse.json({
      analytics: {
        overview: {
          totalPosts
          publishedPosts,
          totalViews: totalViews._sum.views || 0,
          totalLikes: totalLikes._sum.likes || 0,
          totalComments: totalComments._sum.comments || 0,
          recentComments,
          featuredPosts,
          trendingPosts,
          urgentPosts,
          avgEngagement,
        }
        topPosts: topPosts.map(post => ({
          ...post,
          engagementRate: post.views > 0 ? ((post.likes + post.comments) / post.views * 100).toFixed(2) : '0.00'
        }))
        distribution: {
          categories: categoryStats.map(stat => ({
            category: stat.category,
            posts: stat._count.category,
            views: stat._sum.views || 0,
            likes: stat._sum.likes || 0,
            avgViewsPerPost: stat._count.category > 0 ? Math.round((stat._sum.views || 0) / stat._count.category) : 0
          }))
          countries: countryStats.map(stat => ({
            country: stat.country,
            posts: stat._count.country,
            views: stat._sum.views || 0,
            likes: stat._sum.likes || 0
          }))
          difficulties: difficultyStats.map(stat => ({
            difficulty: stat.difficulty,
            posts: stat._count.difficulty,
            views: stat._sum.views || 0,
            percentage: totalPosts > 0 ? ((stat._count.difficulty / totalPosts) * 100).toFixed(1) : '0.0'
          }))
          types: typeStats.map(stat => ({
            type: stat.type,
            posts: stat._count.type,
            views: stat._sum.views || 0,
            percentage: totalPosts > 0 ? ((stat._count.type / totalPosts) * 100).toFixed(1) : '0.0'
          }))
        }
        timeline: {
          posts: postsOverTime.map(item => ({
            date: item.publishDate,
            count: item._count.publishDate
          }))
        }
        period: {
          days: periodDays,
          from: dateFrom.toISOString()
          to: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar analytics:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor'
      }
      { status: 500 }
    )
  }
}