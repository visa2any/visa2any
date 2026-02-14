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
        publishedTime: post.publishDate.toISOString(),
        authors: ['Equipe Técnica Visa2Any'],
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
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://visa2any.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': 'https://visa2any.com/blog'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': post.title,
              'item': `https://visa2any.com/blog/${slug}`
            }
          ]
        },
        {
          '@type': 'BlogPosting',
          '@id': `https://visa2any.com/blog/${slug}#article`,
          'headline': post.title,
          'alternativeHeadline': post.excerpt,
          'description': post.excerpt,
          'image': post.imageUrl ? [post.imageUrl] : [],
          'author': {
            '@type': 'Person',
            'name': post.author
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Visa2Any',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://visa2any.com/logo.png'
            }
          },
          'datePublished': post.publishDate,
          'dateModified': post.updatedAt || post.publishDate,
          'keywords': Array.isArray(post.tags) ? post.tags : [],
          'articleSection': post.category,
          'inLanguage': 'pt-BR',
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://visa2any.com/blog/${slug}`
          }
        }
      ]
    }
  } catch (error) {
    console.error('Erro ao gerar dados estruturados:', error)
    return null
  }
}

// Função para buscar dados do post
async function getPost(slug: string) {
  const prisma = new PrismaClient()
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        id: slug,
        published: true
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        author: true,
        // authorImage: true, // Adicionar se existir no schema
        publishDate: true,
        readTime: true,
        featured: true,
        trending: true,
        urgent: true,
        tags: true,
        country: true,
        flag: true,
        views: true,
        likes: true,
        comments: true,
        difficulty: true,
        type: true,
        imageUrl: true,
        videoUrl: true,
        sponsored: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return post
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}

// Função para buscar comentários
async function getComments(slug: string) {
  // Simulando busca de comentários ou implementando via Prisma se a tabela existir
  // Por enquanto retornando array vazio para manter compatibilidade
  return []
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  const comments = await getComments(params.slug)
  const structuredData = await generateStructuredData(params.slug)

  if (!post) {
    return <BlogPostClient slug={params.slug} initialPost={null} initialComments={[]} initialRelatedPosts={[]} />
  }

  // Serializar datas para passar do Server Component para Client Component
  const serializedPost = {
    ...post,
    publishDate: post.publishDate.toISOString(),
    createdAt: post.createdAt ? post.createdAt.toISOString() : undefined,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    // Garantir compatibilidade de tipos literais
    difficulty: post.difficulty as 'Iniciante' | 'Intermediário' | 'Avançado',
    type: post.type as 'Guia' | 'Notícia' | 'Atualização' | 'Dica' | 'Análise',
    tags: Array.isArray(post.tags) ? post.tags as string[] : [],
    country: post.country || undefined,
    flag: post.flag || undefined,
    imageUrl: post.imageUrl || undefined,
    videoUrl: post.videoUrl || undefined,
    sponsored: post.sponsored || undefined,
    // Ensure exactOptionalPropertyTypes compliance
    urgent: post.urgent ?? false,
    trending: post.trending ?? false,
    featured: post.featured || false
  }

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

      {/* Preload da imagem principal para LCP Otimizado */}
      {post.imageUrl && (
        <link rel="preload" as="image" href={post.imageUrl} />
      )}

      {/* Componente cliente com dados hidratados */}
      <BlogPostClient
        slug={params.slug}
        initialPost={serializedPost}
        initialComments={comments}
        initialRelatedPosts={[]}
      />
    </>
  )
}
