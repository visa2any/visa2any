'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import AffiliateBanner from '@/components/AffiliateBanner'
import { Calendar, User, Clock, ArrowRight, Search, Filter, Tag, TrendingUp, Eye, Share2, BookOpen, Globe, Bell, Star, Zap, Heart, MessageCircle, ChevronRight, ChevronDown, Rss, Mail, Play, ExternalLink, Bookmark, ThumbsUp, Users, RefreshCw, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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

const categories = [
  'Todos', 'Notícias Urgentes', 'Trending', 'Guias Completos', 
  'Imigração', 'Vistos Europa', 'Vistos Trabalho', 'Cidadania', 
  'Investimento', 'Tech & TI', 'Profissionais Saúde', 'Estudos', 
  'Família', 'Aposentados', 'Casos Especiais'
]

const difficulties = ['Todos', 'Iniciante', 'Intermediário', 'Avançado']
const postTypes = ['Todos', 'Guia', 'Notícia', 'Atualização', 'Dica', 'Análise']

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

export default function BlogPage() {
  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos')
  const [selectedType, setSelectedType] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false)
  const [whatsappForm, setWhatsappForm] = useState({
    name: '',
    phone: '',
    countries: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Estados para dados do banco
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  // Carregar posts do banco de dados
  useEffect(() => {
    loadPosts()
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType, sortBy])

  const loadPosts = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        type: selectedType,
        sortBy: sortBy,
        limit: '50'
      })
      
      const response = await fetch(`/api/blog/posts?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setBlogPosts(data.posts)
        setTotal(data.total)
      } else {
        setError(data.error || 'Erro ao carregar posts')
      }
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blog/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: whatsappForm.name,
          phone: whatsappForm.phone,
          countries: whatsappForm.countries.length > 0 ? whatsappForm.countries : ['Global']
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitMessage(`✅ ${data.message}`)
        setWhatsappForm({ name: '', phone: '', countries: [] })
        setTimeout(() => {
          setShowWhatsAppForm(false)
          setSubmitMessage('')
        }, 3000)
      } else {
        setSubmitMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao cadastrar newsletter:', error)
      setSubmitMessage('❌ Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Posts filtrados já vem da API
  const filteredPosts = blogPosts

  const featuredPosts = blogPosts.filter(post => post.featured)
  const urgentPosts = blogPosts.filter(post => post.urgent)
  const trendingPosts = blogPosts.filter(post => post.trending)

  const stats = [
    { label: 'Artigos Publicados', value: total.toString(), icon: BookOpen },
    { label: 'Visualizações Totais', value: '247K+', icon: Eye },
    { label: 'Países Cobertos', value: '25+', icon: Globe },
    { label: 'Especialistas', value: '12', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 pt-20 pb-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur rounded-full mb-6 border border-white/20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Blog <span className="text-yellow-400">Visa2Any</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Mantenha-se atualizado com as últimas notícias, guias especializados e análises detalhadas 
              sobre imigração mundial. Conteúdo atualizado diariamente por nossos especialistas.
            </p>
            
            {/* Estatísticas em tempo real */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto">
              <div className="relative">
                <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por país, tipo de visto, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-20 pr-8 py-6 text-xl border-0 rounded-2xl focus:ring-4 focus:ring-blue-300 shadow-2xl backdrop-blur"
                />
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Filter className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Quick Access Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button onClick={() => setSelectedCategory('Notícias Urgentes')} className="bg-red-500/20 text-white px-6 py-3 rounded-full border border-red-400/30 hover:bg-red-500/30 transition-colors backdrop-blur">
                🚨 Urgentes
              </button>
              <button onClick={() => setSelectedCategory('Trending')} className="bg-orange-500/20 text-white px-6 py-3 rounded-full border border-orange-400/30 hover:bg-orange-500/30 transition-colors backdrop-blur">
                🔥 Trending
              </button>
              <button onClick={() => setSelectedCategory('Guias Completos')} className="bg-green-500/20 text-white px-6 py-3 rounded-full border border-green-400/30 hover:bg-green-500/30 transition-colors backdrop-blur">
                📚 Guias
              </button>
              <button onClick={() => setSelectedCategory('Imigração')} className="bg-purple-500/20 text-white px-6 py-3 rounded-full border border-purple-400/30 hover:bg-purple-500/30 transition-colors backdrop-blur">
                ✈️ Imigração
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      {showFilters && (
        <section className="bg-white shadow-lg border-b">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {postTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mais Recente</option>
                  <option value="oldest">Mais Antigo</option>
                  <option value="popular">Mais Visualizado</option>
                  <option value="liked">Mais Curtido</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="bg-red-50 border-l-4 border-red-500 py-6">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">❌</div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Erro ao carregar posts</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={loadPosts}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Urgent News */}
      {urgentPosts.length > 0 && (
        <section className="bg-red-50 border-l-4 border-red-500 py-8">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-bold text-red-800">Notícias Urgentes</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {urgentPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">
                      🚨 URGENTE
                    </span>
                    <span className="text-2xl">{post.flag}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 hover:text-red-600 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.readTime}</span>
                    <span>{new Date(post.publishDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Todos os Artigos 
                  <span className="text-gray-500 text-lg ml-2">
                    ({total} encontrados)
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={loadPosts}
                    disabled={loading}
                    className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {/* Success message for filters */}
                  {filteredPosts.length > 0 && (searchTerm || selectedCategory !== 'Todos' || selectedDifficulty !== 'Todos' || selectedType !== 'Todos') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 text-sm">
                          Filtros aplicados: {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* No posts found */}
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📰</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                      <p className="text-gray-600 mb-4">Tente ajustar os filtros ou termo de busca</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('Todos')
                          setSelectedDifficulty('Todos')
                          setSelectedType('Todos')
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                  {filteredPosts.map(post => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <article className="group cursor-pointer">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="h-48 relative overflow-hidden">
                          <img 
                            src={post.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                          {post.category}
                        </span>
                        {post.urgent && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                            🚨
                          </span>
                        )}
                        {post.trending && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                            🔥
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4 text-4xl drop-shadow-lg">
                        {post.flag}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-white text-sm font-medium drop-shadow-lg">
                          {post.country}
                        </div>
                      </div>
                      {post.videoUrl && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-white/20 backdrop-blur p-3 rounded-full border border-white/30">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                          post.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {post.difficulty}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {post.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <div className="flex items-center mr-4">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(post.publishDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <ClientOnly><span>{post.views?.toLocaleString?.() || post.views}</span></ClientOnly>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">+{post.tags.length - 3}</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                    </div>
                      </article>
                    </Link>
                  ))}
                  </div>
                </>
              )}
              
              {/* Load More */}
              {filteredPosts.length > 0 && (
                <div className="text-center mt-12">
                  <Button 
                    onClick={loadPosts}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        Carregar Mais Artigos
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Estatísticas</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <stat.icon className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700 text-sm">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter WhatsApp */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="text-lg font-bold">Newsletter WhatsApp</h3>
                  <p className="text-green-100 text-sm">Receba atualizações instantâneas</p>
                </div>
                
                <button 
                  onClick={() => setShowWhatsAppForm(true)}
                  className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cadastrar WhatsApp
                </button>
              </div>

              {/* Modal Newsletter WhatsApp */}
              {showWhatsAppForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📱</div>
                          <div>
                            <h3 className="text-lg font-bold">Newsletter WhatsApp</h3>
                            <p className="text-green-100 text-sm">Cadastre-se para receber atualizações</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowWhatsAppForm(false)}
                          className="text-white/80 hover:text-white text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nome completo
                            </label>
                            <input
                              type="text"
                              placeholder="Seu nome"
                              value={whatsappForm.name}
                              onChange={(e) => setWhatsappForm({...whatsappForm, name: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              WhatsApp
                            </label>
                            <input
                              type="tel"
                              placeholder="(11) 99999-9999"
                              value={whatsappForm.phone}
                              onChange={(e) => setWhatsappForm({...whatsappForm, phone: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Países de interesse (opcional)
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {['Estados Unidos', 'Canadá', 'Portugal', 'Alemanha', 'França', 'Espanha', 'Itália', 'Austrália'].map(country => (
                              <label key={country} className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={whatsappForm.countries.includes(country)}
                                  onChange={(e) => {
                                    const countries = e.target.checked 
                                      ? [...whatsappForm.countries, country]
                                      : whatsappForm.countries.filter(c => c !== country)
                                    setWhatsappForm({...whatsappForm, countries})
                                  }}
                                  className="mr-2 rounded text-green-600"
                                />
                                {country}
                              </label>
                            ))}
                          </div>
                        </div>

                        {submitMessage && (
                          <div className={`p-3 rounded-lg text-sm ${
                            submitMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {submitMessage}
                          </div>
                        )}

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowWhatsAppForm(false)}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? 'Enviando...' : 'Cadastrar'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Consultoria IA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🤖</div>
                  <h3 className="text-lg font-bold">Consultoria com IA</h3>
                  <p className="text-blue-100 text-sm">Análise inteligente em segundos</p>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Análise gratuita do perfil</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Relatório detalhado instantâneo</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                    <span>Recomendações personalizadas</span>
                  </div>
                </div>
                
                <Link href="/consultoria-ia">
                  <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Iniciar Análise Grátis
                  </button>
                </Link>
              </div>

              {/* Kit Emigração */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📦</div>
                  <h3 className="text-lg font-bold">Kit Emigração</h3>
                  <p className="text-purple-100 text-sm">Tudo que você precisa</p>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-300" />
                    <span>Guias completos de países</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-300" />
                    <span>Templates de documentos</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-300" />
                    <span>Checklist personalizada</span>
                  </div>
                </div>
                
                <Link href="/kit-emigracao">
                  <button className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Baixar Kit Completo
                  </button>
                </Link>
              </div>

              {/* Trending Posts */}
              {trendingPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                    Em Alta
                  </h3>
                  <div className="space-y-4">
                    {trendingPosts.slice(0, 5).map((post, index) => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                              {post.title}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{post.views.toLocaleString()}</span>
                              <span className="mx-2">•</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Vaga Express */}
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white mb-8">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-lg font-bold">Vaga Express</h3>
                  <p className="text-orange-100 text-sm">Vagas internacionais selecionadas</p>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">250+</div>
                  <div className="text-orange-100 text-sm">Vagas disponíveis</div>
                </div>
                
                <Link href="/vaga-express">
                  <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg">
                    Ver Vagas Disponíveis
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Afiliados no Blog */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📝 Gostou do Conteúdo?</h2>
            <p className="text-lg text-gray-600">Compartilhe nosso conhecimento e ganhe dinheiro com isso!</p>
          </div>
          <AffiliateBanner variant="full" />
        </div>
      </section>

      <Footer />
    </div>
  )
}