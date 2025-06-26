'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  RefreshCw,
  CheckCircle,
  X,
  Save
} from 'lucide-react'
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
  'Notícias Urgentes', 'Trending', 'Guias Completos', 
  'Imigração', 'Vistos Europa', 'Vistos Trabalho', 'Cidadania', 
  'Investimento', 'Tech & TI', 'Profissionais Saúde', 'Estudos', 
  'Família', 'Aposentados', 'Casos Especiais'
]

const difficulties = ['Iniciante', 'Intermediário', 'Avançado']
const postTypes = ['Guia', 'Notícia', 'Atualização', 'Dica', 'Análise']

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('Todos')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [total, setTotal] = useState(0)

  // Estados do formulário,  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: categories[0],
    author: '',
    readTime: '5 min',
    featured: false,
    trending: false,
    urgent: false,
    tags: [] as string[],
    country: '',
    flag: '',
    difficulty: 'Intermediário' as 'Iniciante' | 'Intermediário' | 'Avançado',
    type: 'Notícia' as 'Guia' | 'Notícia' | 'Atualização' | 'Dica' | 'Análise',
    imageUrl: '',
    videoUrl: '',
    sponsored: false,
    published: true
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [searchTerm, filterCategory])

  const loadPosts = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        search: searchTerm,
        category: filterCategory === 'Todos' ? '' : filterCategory,
        limit: '100'
      })
      
      const response = await fetch(`/api/blog/posts?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.posts)
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

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: categories[0],
      author: '',
      readTime: '5 min',
      featured: false,
      trending: false,
      urgent: false,
      tags: [],
      country: '',
      flag: '',
      difficulty: 'Intermediário',
      type: 'Notícia',
      imageUrl: '',
      videoUrl: '',
      sponsored: false,
      published: true
    })
    setTagInput('')
    setEditingPost(null)
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      readTime: post.readTime,
      featured: post.featured,
      trending: post.trending || false,
      urgent: post.urgent || false,
      tags: post.tags,
      country: post.country || '',
      flag: post.flag || '',
      difficulty: post.difficulty,
      type: post.type,
      imageUrl: post.imageUrl || '',
      videoUrl: post.videoUrl || '',
      sponsored: post.sponsored || false,
      published: post.published !== false
    })
    setEditingPost(post)
    setShowCreateModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      alert('Título, resumo e conteúdo são obrigatórios')
      return
    }

    try {
      setSaving(true)
      
      const url = editingPost 
        ? `/api/blog/posts/${editingPost.id}` 
        : '/api/blog/posts'
      
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setShowCreateModal(false)
        resetForm()
        loadPosts()
        alert(editingPost ? 'Post atualizado!' : 'Post criado!')
      } else {
        alert(data.error || 'Erro ao salvar post')
      }
    } catch (err) {
      console.error('Erro ao salvar:', err)
      alert('Erro ao conectar com o servidor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja remover este post?')) return

    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        loadPosts()
        alert('Post removido!')
      } else {
        alert(data.error || 'Erro ao remover post')
      }
    } catch (err) {
      console.error('Erro ao remover:', err)
      alert('Erro ao conectar com o servidor')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'Todos' || post.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog CMS</h1>
              <p className="text-gray-600 mt-1">Gerencie os posts do blog</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {total} posts
              </span>
              <Button
                onClick={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Button
              onClick={loadPosts}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">❌ {error}</div>
            <Button onClick={loadPosts} variant="outline">
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Métricas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {post.title}
                              </h3>
                              {post.urgent && (
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                  🚨
                                </span>
                              )}
                              {post.trending && (
                                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                                  🔥
                                </span>
                              )}
                              {post.featured && (
                                <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                                  ⭐
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                              <span>•</span>
                              <span>{post.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blog/${post.id}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
                <p className="text-gray-500">
                  {searchTerm || filterCategory !== 'Todos' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro post.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de criar/editar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Editar Post' : 'Novo Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o título do post..."
                  required
                />
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumo *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Resumo do post..."
                  required
                />
              </div>

              {/* Configurações em grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
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
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {postTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do autor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tempo de Leitura</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ex: 5 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ex: Estados Unidos"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flag (Emoji)</label>
                  <input
                    type="text"
                    value={formData.flag}
                    onChange={(e) => setFormData({...formData, flag: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="🇺🇸"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Switches */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'featured', label: 'Destaque' },
                  { key: 'trending', label: 'Trending' },
                  { key: 'urgent', label: 'Urgente' },
                  { key: 'published', label: 'Publicado' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo (HTML) *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={12}
                  placeholder="Conteúdo HTML do post..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use HTML para formatação. Classes do Tailwind CSS estão disponíveis.
                </p>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingPost ? 'Atualizar' : 'Criar'} Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}