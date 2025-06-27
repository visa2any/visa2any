'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Rss,
  Plus,
  Settings,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Eye,
  MessageSquare,
  Heart,
  ExternalLink,
  Calendar,
  Users
} from 'lucide-react'

interface NewsSource {
  id: string
  name: string
  url: string
  type: string
  category: string
  country: string
  flag: string
  isActive: boolean
  lastChecked: string | null
  checkInterval: number
  priority: number
  keywords: string[]
  logs: AutoNewsLog[]
}

interface AutoNewsLog {
  id: string
  action: string
  details: any
  success: boolean
  error: string | null
  createdAt: string
}

interface BlogPost {
  id: string
  title: string
  category: string
  country: string
  flag: string
  urgent: boolean
  trending: boolean
  publishDate: string
  views: number
  likes: number
  comments: number
  sourceUrl: string | null
}

export default function BlogAutomationPage() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [logs, setLogs] = useState<AutoNewsLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(true)

  const [stats, setStats] = useState({
    totalSources: 0,
    activeSources: 0,
    totalPosts: 0,
    urgentPosts: 0,
    postsToday: 0,
    lastCheck: null as string | null
  })

  useEffect(() => {
    loadData()
    // Refresh data every 30 seconds,    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      // Load sources,      const sourcesRes = await fetch('/api/blog/sources')
      const sourcesData = await sourcesRes.json()
      if (sourcesData.success) {
        setSources(sourcesData.sources)
      }

      // Load recent posts,      const postsRes = await fetch('/api/blog/posts?limit=20&automated=true')
      const postsData = await postsRes.json()
      if (postsData.success) {
        setRecentPosts(postsData.posts)
      }

      // Calculate stats,      const totalSources = sourcesData.sources?.length || 0
      const activeSources = sourcesData.sources?.filter((s: NewsSource) => s.isActive).length || 0
      const totalPosts = postsData.posts?.length || 0
      const urgentPosts = postsData.posts?.filter((p: BlogPost) => p.urgent).length || 0
      
      const today = new Date().toDateString()
      const postsToday = postsData.posts?.filter((p: BlogPost) => 
        new Date(p.publishDate).toDateString() === today
      ).length || 0

      setStats({
        totalSources,
        activeSources,
        totalPosts,
        urgentPosts,
        postsToday,
        lastCheck: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSource = async (sourceId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/blog/sources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sourceId, isActive: !isActive })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error toggling source:', error)
    }
  }

  const triggerManualCheck = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog/manual-check', {
        method: 'POST'
      })

      if (response.ok) {
        setTimeout(loadData, 5000) // Reload after 5 seconds
      }
    } catch (error) {
      console.error('Error triggering manual check:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 Automação do Blog
          </h1>
          <p className="text-gray-600">
            Monitoramento automático de notícias e publicação de artigos relevantes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fontes Ativas</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeSources}/{stats.totalSources}
              </div>
              <p className="text-xs text-muted-foreground">
                fontes monitoradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.postsToday}</div>
              <p className="text-xs text-muted-foreground">
                artigos publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgentPosts}</div>
              <p className="text-xs text-muted-foreground">
                notícias urgentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                artigos automáticos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Painel de Controle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isMonitoring ? "default" : "secondary"}>
                  {isMonitoring ? "Ativo" : "Pausado"}
                </Badge>
                <span className="text-sm text-gray-600">
                  Status do monitoramento
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  variant={isMonitoring ? "destructive" : "default"}
                  size="sm"
                >
                  {isMonitoring ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
                
                <Button onClick={triggerManualCheck} variant="outline" size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Verificar Agora
                </Button>
                
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Fonte
                </Button>
              </div>
            </div>
            
            {stats.lastCheck && (
              <p className="text-xs text-gray-500 mt-2">
                Última verificação: {new Date(stats.lastCheck).toLocaleString('pt-BR')}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* News Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss className="h-5 w-5" />
                Fontes de Notícias
              </CardTitle>
              <CardDescription>
                {sources.length} fontes configuradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{source.flag}</span>
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-gray-500">{source.country} • {source.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {source.type}
                          </Badge>
                          <Badge variant={source.priority >= 4 ? "default" : "secondary"} className="text-xs">
                            P{source.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {source.lastChecked && (
                        <span className="text-xs text-gray-500">
                          {new Date(source.lastChecked).toLocaleTimeString('pt-BR')}
                        </span>
                      )}
                      <Button
                        onClick={() => toggleSource(source.id, source.isActive)}
                        variant={source.isActive ? "default" : "outline"}
                        size="sm"
                      >
                        {source.isActive ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Posts Recentes
              </CardTitle>
              <CardDescription>
                Artigos publicados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{post.flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              🚨 URGENTE
                            </Badge>
                          )}
                          {post.trending && (
                            <Badge variant="default" className="text-xs">
                              🔥 TRENDING
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-sm line-clamp-2 mb-2">
                          {post.title}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        
                        {post.sourceUrl && (
                          <a 
                            href={post.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Fonte
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Log de Atividades
            </CardTitle>
            <CardDescription>
              Últimas atividades do sistema de automação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-2 text-sm border-b">
                  {log.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="flex-1">{log.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}