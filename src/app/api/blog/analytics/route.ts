import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30'
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
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.aggregate({
        _sum: { views: true }}),
      prisma.blogPost.aggregate({
        _sum: { likes: true }}),
      prisma.blogPost.aggregate({
        _sum: { comments: true }}),
      prisma.blogPost.count({
        where: { published: true }}),
      prisma.blogPost.count({
        where: { featured: true }}),
      prisma.blogPost.count({
        where: { trending: true }}),
      prisma.blogPost.count({
        where: { urgent: true }})
    ])

    // Posts mais populares no período
    const popularPosts = await prisma.blogPost.findMany({
      where: {
        createdAt: { gte: dateFrom },
        published: true},
      orderBy: { views: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        comments: true,
        createdAt: true,
        category: true}})

    // Posts por categoria
    const postsByCategory = await prisma.blogPost.groupBy({
      by: ['category'],
      where: {
        createdAt: { gte: dateFrom },
        published: true},
      _count: {
        id: true},
      _sum: {
        views: true}})

    // Posts por país
    const postsByCountry = await prisma.blogPost.groupBy({
      by: ['country'],
      where: {
        createdAt: { gte: dateFrom },
        published: true},
      _count: {
        id: true},
      _sum: {
        views: true}})

    // Estatísticas por data (últimos 30 dias)
    const dailyStats = []
    for (let i = periodDays; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayStats = await prisma.blogPost.aggregate({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate},
          published: true},
        _count: {
          id: true},
        _sum: {
          views: true,
          likes: true,
          comments: true}})

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        posts: dayStats._count.id || 0,
        views: dayStats._sum.views || 0,
        likes: dayStats._sum.likes || 0,
        comments: dayStats._sum.comments || 0
    })
  }
}

    return NextResponse.json({
      data: {
        summary: {
          totalPosts,
          publishedPosts,
          totalViews: totalViews._sum.views || 0,
          totalLikes: totalLikes._sum.likes || 0,
          totalComments: totalComments._sum.comments || 0,
          featuredPosts,
          trendingPosts,
          urgentPosts,
          engagementRate: totalViews._sum.views ? 
            ((totalLikes._sum.likes || 0) + (totalComments._sum.comments || 0)) / totalViews._sum.views * 100 : 0},
        popularPosts,
        categoryStats: postsByCategory.map(cat => ({
          category: cat.category,
          posts: cat._count.id,
          views: cat._sum.views || 0})),
        countryStats: postsByCountry.map(country => ({
          country: country.country,
          posts: country._count.id,
          views: country._sum.views || 0})),
        dailyStats,
        period: `${periodDays} dias`}})

  } catch (error) {
    console.error('Erro ao buscar analytics do blog:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}