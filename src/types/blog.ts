export interface BlogPost {
  id: string
  slug?: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  authorImage?: string
  publishDate: string
  readTime: string
  featured: boolean
  trending?: boolean
  urgent?: boolean
  tags: string[]
  country?: string
  flag?: string
  views: number
  likes: number
  comments: number
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  type: 'Guia' | 'Notícia' | 'Atualização' | 'Dica' | 'Análise'
  imageUrl?: string
  videoUrl?: string
  sponsored?: boolean
}