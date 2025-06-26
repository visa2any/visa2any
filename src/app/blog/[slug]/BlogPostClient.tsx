'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SocialAuth from '@/components/SocialAuth'
import AffiliateBanner from '@/components/AffiliateBanner'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  CheckCircle,
  ThumbsUp,
  ExternalLink,
  ChevronRight,
  Tag,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react'
// import { scheduleAutomaticPosts } from '@/lib/social-automation'

interface BlogPost {
  id: string
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
  published?: boolean
  createdAt?: string
  updatedAt?: string
}

interface Comment {
  id: string
  userId: string
  postId: string
  content: string
  parentId?: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  replies?: Comment[]
}

// Componente para renderização apenas no cliente
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) {
    return <div className="animate-pulse bg-gray-200 rounded h-4 w-20"></div>
  }
  
  return <>{children}</>
}

interface Props {
  slug: string
}

export default function BlogPostClient({ slug }: Props) {
  // Estados,  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Estados para comentários,  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  
  // Estados para interações,  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [localLikes, setLocalLikes] = useState(0)
  
  // Estados para compartilhamento,  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  
  // Estado de autenticação,  const [user, setUser] = useState<any>(null)

  // Carregar dados do post,  useEffect(() => {
    if (slug) {
      loadPost()
      loadComments()
      checkUserAuth()
    }
  }, [slug])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  const loadPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/posts/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setPost(data.post)
        setRelatedPosts(data.relatedPosts || [])
        setLocalLikes(data.post.likes)
        
        // Agendar posts automáticos se for um post novo,        // if (data.post.featured) {
        //   await scheduleAutomaticPosts(data.post),        // }
      } else {
        setError(data.error || 'Post não encontrado')
      }
    } catch (err) {
      console.error('Erro ao carregar post:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/blog/comments/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.comments)
      }
    } catch (err) {
      console.error('Erro ao carregar comentários:', err)
    }
  }

  const checkUserAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err)
    }
  }

  const handleLike = async () => {
    if (!user) {
      alert('Faça login para curtir posts')
      return
    }

    try {
      const response = await fetch('/api/blog/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: slug,
          userId: user.id
        }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setIsLiked(!isLiked)
        setLocalLikes(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (err) {
      console.error('Erro ao curtir:', err)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      alert('Faça login para salvar posts')
      return
    }

    try {
      const response = await fetch('/api/blog/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: slug,
          userId: user.id
        }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Faça login para comentar')
      return
    }

    if (!newComment.trim()) return

    try {
      const response = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: slug,
          userId: user.id,
          content: newComment.trim()
        }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setNewComment('')
        loadComments() // Recarregar comentários      }
    } catch (err) {
      console.error('Erro ao comentar:', err)
    }
  }

  const handleReply = async (commentId: string) => {
    if (!user) {
      alert('Faça login para responder')
      return
    }

    if (!replyContent.trim()) return

    try {
      const response = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: slug,
          userId: user.id,
          content: replyContent.trim(),
          parentId: commentId
        }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setReplyContent('')
        setReplyingTo(null)
        loadComments() // Recarregar comentários      }
    } catch (err) {
      console.error('Erro ao responder:', err)
    }
  }

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl)
    const title = encodeURIComponent(post?.title || '')
    
    let shareUrlFinal = ''
    
    switch (platform) {
      case 'whatsapp':
        shareUrlFinal = `https://wa.me/?text=${title} ${url}`
        break
      case 'instagram':
        // Instagram não permite compartilhamento direto via URL, então copiamos o link
        navigator.clipboard.writeText(shareUrl)
        alert('Link copiado! Cole no Instagram Stories.')
        return
      case 'facebook':
        shareUrlFinal = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrlFinal = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
        break
      case 'linkedin':
        shareUrlFinal = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        alert('Link copiado!')
        return
    }
    
    if (shareUrlFinal) {
      window.open(shareUrlFinal, '_blank', 'width=600,height=400')
    }
    
    setShowShareMenu(false)
  }

  // Loading state,  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state,  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link href="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`pt-20 pb-16 relative overflow-hidden ${
        post.urgent ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800' :
        post.trending ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600' :
        'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800'
      }`}>
        {/* Imagem principal do post como background */}
        {post.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          </div>
        )}
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{post.category}</span>
          </nav>
          
          {/* Tags e categoria */}
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-white/20 backdrop-blur text-white text-sm px-4 py-2 rounded-full font-medium border border-white/30">
              {post.category}
            </span>
            {post.urgent && (
              <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg animate-pulse">
                🚨 URGENTE
              </span>
            )}
            {post.trending && (
              <span className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                🔥 TRENDING
              </span>
            )}
            {post.featured && (
              <span className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                ⭐ DESTAQUE
              </span>
            )}
            <span className={`text-sm px-4 py-2 rounded-full font-medium ${
              post.difficulty === 'Iniciante' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
              post.difficulty === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
              'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {post.difficulty}
            </span>
          </div>
          
          {/* País */}
          {post.country && (
            <div className="flex items-center gap-3 mb-6">
              <div className="text-5xl">{post.flag}</div>
              <div>
                <div className="text-white/80 text-sm font-medium">Sobre</div>
                <div className="text-white text-xl font-bold">{post.country}</div>
              </div>
            </div>
          )}
          
          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-4xl">
            {post.excerpt}
          </p>
          
          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-6 text-white/80 mb-8">
            <div className="flex items-center bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(post.publishDate).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              <Eye className="h-4 w-4 mr-2" />
              <ClientOnly>
                <span>{post.views.toLocaleString()} visualizações</span>
              </ClientOnly>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all backdrop-blur border ${
                  isLiked 
                    ? 'bg-red-500/20 text-white border-red-400/50 shadow-lg' 
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{localLikes}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all backdrop-blur border ${
                  isBookmarked 
                    ? 'bg-blue-500/20 text-white border-blue-400/50 shadow-lg' 
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="font-medium">Salvar</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur border border-white/30"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Compartilhar</span>
                </button>
                
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-100 z-50">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Compartilhar artigo</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <div className="w-5 h-5">
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                              <path d="M12.011 2C6.5 2 2.01 6.49 2.01 12.01c0 1.92.54 3.73 1.47 5.27L2 22l4.69-1.23c1.5.82 3.2 1.26 4.98 1.26 5.51 0 9.99-4.49 9.99-10.01C21.66 6.48 17.52 2 12.011 2zM12 19c-1.66 0-3.22-.51-4.5-1.38l-.32-.19-3.31.87.88-3.21-.21-.33C3.25 13.5 2.75 12 2.75 12.01 2.75 7.33 6.34 3.75 12 3.75s9.25 3.58 9.25 8.26c0 4.67-3.58 8.24-9.25 8.24z"/>
                            </svg>
                          </div>
                          <span className="text-sm">WhatsApp</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare('instagram')}
                          className="flex items-center gap-2 p-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                        >
                          <div className="w-5 h-5">
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <span className="text-sm">Instagram</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Facebook className="w-5 h-5" />
                          <span className="text-sm">Facebook</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                          <span className="text-sm">Twitter</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                          <span className="text-sm">LinkedIn</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Copy className="w-5 h-5" />
                          <span className="text-sm">Copiar Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Link href="/blog">
              <Button className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur px-6 py-3 rounded-xl transition-all">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Voltar ao Blog</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Conteúdo do post */}
      <section className="py-12">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl shadow-lg p-8 mb-12">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Tags */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>

          {/* Seção de comentários */}
          <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comentários ({comments.length})
            </h3>
            
            {/* Formulário de novo comentário */}
            {user ? (
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Deixe seu comentário..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button type="submit" disabled={!newComment.trim()}>
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
                <p className="text-gray-600 mb-4">Faça login para comentar</p>
                <SocialAuth />
              </div>
            )}
            
            {/* Lista de comentários */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {comment.author.avatar ? (
                          <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full rounded-full" />
                        ) : (
                          comment.author.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.author.name}</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        
                        {user && (
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Responder
                          </button>
                        )}
                        
                        {/* Formulário de resposta */}
                        {replyingTo === comment.id && user && (
                          <div className="mt-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                                ) : (
                                  user.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder={`Respondendo para ${comment.author.name}...`}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                  rows={2}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent('')
                                    }}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                                  >
                                    Cancelar
                                  </button>
                                  <Button
                                    onClick={() => handleReply(comment.id)}
                                    disabled={!replyContent.trim()}
                                    size="sm"
                                  >
                                    Responder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Respostas */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                  {reply.author.avatar ? (
                                    <img src={reply.author.avatar} alt={reply.author.name} className="w-full h-full rounded-full" />
                                  ) : (
                                    reply.author.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{reply.author.name}</span>
                                    <span className="text-gray-500 text-xs">
                                      {new Date(reply.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Seja o primeiro a comentar!</p>
                </div>
              )}
            </div>
          </section>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Autor Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre o Autor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.author}</div>
                    <div className="text-gray-500 text-sm">Especialista em Imigração</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Especialista com mais de 5 anos de experiência em processos de imigração e consultoria internacional.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Seguir
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Contato
                  </button>
                </div>
              </div>

              {/* Stats do Post */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-gray-700 text-sm">Visualizações</span>
                    </div>
                    <span className="font-bold text-gray-900">{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-600 mr-3" />
                      <span className="text-gray-700 text-sm">Curtidas</span>
                    </div>
                    <span className="font-bold text-gray-900">{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-700 text-sm">Comentários</span>
                    </div>
                    <span className="font-bold text-gray-900">{post.comments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-gray-700 text-sm">Compartilhamentos</span>
                    </div>
                    <span className="font-bold text-gray-900">{Math.floor(post.views * 0.05)}</span>
                  </div>
                </div>
              </div>

              {/* Newsletter Sidebar */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="text-lg font-bold">Newsletter WhatsApp</h3>
                  <p className="text-green-100 text-sm">Receba atualizações sobre {post.country || 'imigração'}</p>
                </div>
                
                <Link href="/blog">
                  <button className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Cadastrar WhatsApp
                  </button>
                </Link>
              </div>

              {/* CTA Consultoria */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="text-lg font-bold">Consultoria Especializada</h3>
                  <p className="text-blue-100 text-sm">Transforme seu sonho em realidade</p>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Análise personalizada do seu perfil</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Estratégia otimizada para aprovação</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Acompanhamento completo</span>
                  </div>
                </div>
                
                <Link href="/consultoria-ia">
                  <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Iniciar Consultoria
                  </button>
                </Link>
              </div>

              {/* Posts Relacionados */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Artigos Relacionados</h3>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 5).map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={relatedPost.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=60&fit=crop'} 
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                              {relatedPost.title}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{relatedPost.views.toLocaleString()}</span>
                              <span className="mx-2">•</span>
                              <span>{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Afiliados em Posts Individuais */}
      <section className="py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">💡 Informação que Gera Valor</h3>
            <p className="text-gray-600">Se este conteúdo te ajudou, que tal ganhar dinheiro compartilhando com outros?</p>
          </div>
          <AffiliateBanner variant="compact" />
        </div>
      </section>

      <Footer />
    </div>
  )
}