import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: { slug: string }
}

// Gerar metadata dinâmica para SEO (simplificada para reduzir tamanho)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Usar busca direta no banco ao invés de API para SSG
    const prisma = new PrismaClient()
    const post = await prisma.blogPost.findFirst({
      where: {
        id: params.slug,
        published: true
      },
      select: {
        title: true,
        excerpt: true,
        publishDate: true,
        updatedAt: true,
        author: true,
        category: true,
        tags: true,
        imageUrl: true,
        readTime: true,
        difficulty: true,
        type: true,
        country: true,
        flag: true
      }
    })
    
    if (!post) {
      return {
        title: 'Post não encontrado | Visa2Any Blog',
        description: 'O post solicitado não foi encontrado.'
      }
    }
    
    return {
      title: `${post.title} | Visa2Any Blog`,
      description: post.excerpt,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishDate,
        authors: [post.author],
        images: post.imageUrl ? [{
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }] : [],
        siteName: 'Visa2Any Blog'
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.imageUrl ? [post.imageUrl] : []
      }
    }
  } catch (error) {
    console.error('Erro ao gerar metadata:', error)
    return {
      title: 'Visa2Any Blog',
      description: 'Blog sobre imigração e vistos internacionais'
    }
  }
}

// Gerar dados estruturados (JSON-LD) simplificados
async function generateStructuredData(slug: string) {
  try {
    const prisma = new PrismaClient()
    const post = await prisma.blogPost.findFirst({
      where: {
        id: slug,
        published: true
      },
      select: {
        title: true,
        excerpt: true,
        publishDate: true,
        updatedAt: true,
        author: true,
        category: true,
        tags: true,
        imageUrl: true,
        readTime: true,
        country: true
      }
    })
    
    if (!post) return null
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.imageUrl ? [post.imageUrl] : [],
      author: {
        '@type': 'Person',
        name: post.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Visa2Any'
      },
      datePublished: post.publishDate,
      dateModified: post.updatedAt || post.publishDate,
      keywords: Array.isArray(post.tags) ? post.tags : [],
      articleSection: post.category,
      inLanguage: 'pt-BR'
    }
  } catch (error) {
    console.error('Erro ao gerar dados estruturados:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const structuredData = await generateStructuredData(params.slug)
  
  return (
    <>
      {/* Dados estruturados para SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Componente cliente */}
      <BlogPostClient slug={params.slug} />
    </>
  )
}
