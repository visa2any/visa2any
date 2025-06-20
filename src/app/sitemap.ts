import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://visa2any.com'
  
  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultoria-ia`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/precos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Buscar posts do blog para URLs dinâmicas
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      select: {
        id: true,
        publishDate: true,
        updatedAt: true,
        featured: true,
        trending: true,
        urgent: true
      },
      orderBy: {
        publishDate: 'desc'
      }
    })

    // Gerar URLs dos posts
    const postUrls = posts.map(post => {
      let priority = 0.6
      
      // Aumentar prioridade para posts especiais
      if (post.urgent) priority = 0.9
      else if (post.trending) priority = 0.8
      else if (post.featured) priority = 0.7
      
      // Frequência de mudança baseada na idade do post
      const daysSincePublished = Math.floor(
        (new Date().getTime() - new Date(post.publishDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      
      let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'monthly'
      
      if (daysSincePublished <= 7) changeFrequency = 'daily'
      else if (daysSincePublished <= 30) changeFrequency = 'weekly'
      else changeFrequency = 'monthly'

      return {
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: post.updatedAt || post.publishDate,
        changeFrequency,
        priority,
      }
    })

    return [...staticUrls, ...postUrls]
    
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    // Retornar apenas URLs estáticas em caso de erro
    return staticUrls
  } finally {
    await prisma.$disconnect()
  }
}