'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  TrendingUp
} from 'lucide-react'

interface SocialPost {
  id: string
  blogPostId: string
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'TWITTER'
  content: string
  scheduledAt: string
  publishedAt?: string
  status: 'SCHEDULED' | 'PUBLISHED' | 'ERROR' | 'CANCELLED'
  error?: string
  createdAt: string
}

interface SocialStats {
  total: number
  byStatus: Record<string, number>
  byPlatform: Record<string, number>
}

export default function SocialPostsAdmin() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [stats, setStats] = useState<SocialStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: '',
    platform: '',
    search: ''
  })

  const loadPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.status) params.append('status', filter.status)
      if (filter.platform) params.append('platform', filter.platform)

      const response = await fetch(`/api/social/schedule?${params}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.socialPosts)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const retryPost = async (postId: string) => {
    try {
      await fetch(`/api/social/${postId}/retry`, { method: 'POST' })
      loadPosts()
    } catch (error) {
      console.error('Erro ao retentar post:', error)
    }
  }

  const cancelPost = async (postId: string) => {
    try {
      await fetch(`/api/social/${postId}/cancel`, { method: 'PATCH' })
      loadPosts()
    } catch (error) {
      console.error('Erro ao cancelar post:', error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [filter.status, filter.platform])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'PUBLISHED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'CANCELLED': return <Trash2 className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800'
      case 'PUBLISHED': return 'bg-green-100 text-green-800'
      case 'ERROR': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'FACEBOOK': return '📘'
      case 'INSTAGRAM': return '📷'
      case 'LINKEDIN': return '💼'
      case 'TWITTER': return '🐦'
      default: return '📱'
    }
  }

  const filteredPosts = posts.filter(post => {
    if (filter.search && !post.content.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    return true
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📱 Gerenciar Posts das Redes Sociais</h1>
          <p className="text-gray-600 mt-2">Automação e agendamento de posts para Facebook, Instagram, LinkedIn e Twitter</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadPosts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendados</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.SCHEDULED || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publicados</p>
                <p className="text-3xl font-bold text-green-600">{stats.byStatus.PUBLISHED || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Erros</p>
                <p className="text-3xl font-bold text-red-600">{stats.byStatus.ERROR || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Status</option>
              <option value="SCHEDULED">Agendados</option>
              <option value="PUBLISHED">Publicados</option>
              <option value="ERROR">Com Erro</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
            <select
              value={filter.platform}
              onChange={(e) => setFilter(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Plataformas</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="TWITTER">Twitter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar no conteúdo..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => setFilter({ status: '', platform: '', search: '' })}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataforma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agendado Para
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.content.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500">ID: {post.blogPostId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getPlatformIcon(post.platform)}</span>
                      <span className="text-sm text-gray-900">{post.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(post.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    {post.error && (
                      <p className="text-xs text-red-600 mt-1">{post.error}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{new Date(post.scheduledAt).toLocaleDateString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.scheduledAt).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      {post.status === 'ERROR' && (
                        <button 
                          onClick={() => retryPost(post.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      {post.status === 'SCHEDULED' && (
                        <button 
                          onClick={() => cancelPost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum post encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}