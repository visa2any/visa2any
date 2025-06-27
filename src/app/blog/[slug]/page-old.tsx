'use client'

import { useState, useEffect } from 'react'

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
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SocialAuth from '@/components/SocialAuth'
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
import { scheduleAutomaticPosts } from '@/lib/social-automation'

interface BlogPost {
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

// Dados completos dos posts do blog
const blogPosts: BlogPost[] = [
  {
    id: 'mudancas-visto-americano-dezembro-2024',
    slug: 'mudancas-visto-americano-dezembro-2024',
    title: '🚨 URGENTE: Novas Regras para Visto Americano em Vigor desde Dezembro 2024',
    excerpt: 'Consulados americanos implementam novas diretrizes que afetam diretamente brasileiros. Mudanças no DS-160, entrevistas e documentação obrigatória.',
    content: `<div class="prose prose-lg max-w-none">
<h1 class="text-4xl font-bold text-gray-900 mb-6">🚨 URGENTE: Novas Regras para Visto Americano em Vigor desde Dezembro 2024</h1>

<p class="text-xl text-gray-700 leading-relaxed mb-8">As <strong>novas diretrizes implementadas pelos consulados americanos</strong> estão causando impacto significativo nos processos de visto para brasileiros. Estas mudanças, que entraram em vigor em dezembro de 2024, afetam diretamente o formulário DS-160, procedimentos de entrevista e documentação obrigatória.</p>

<div class="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
  <h3 class="text-lg font-bold text-red-900 mb-3">⚠️ ALERTA IMPORTANTE</h3>
  <p class="text-red-800">Se você tem entrevista agendada nos próximos 30 dias, é <strong>CRUCIAL</strong> revisar sua documentação conforme as novas regras.</p>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">📋 Principais Mudanças Implementadas</h2>

<h3 class="text-2xl font-bold text-gray-800 mb-4">1. Formulário DS-160 Atualizado</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Novas perguntas obrigatórias</strong> sobre histórico de viagens</li>
  <li><strong>Verificação adicional</strong> de vínculos familiares nos EUA</li>
  <li><strong>Campos expandidos</strong> para informações profissionais</li>
  <li><strong>Upload obrigatório</strong> de documentos de suporte</li>
</ul>

<h3 class="text-2xl font-bold text-gray-800 mb-4">2. Procedimentos de Entrevista</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Tempo de entrevista estendido</strong> (15-20 minutos em média)</li>
  <li><strong>Perguntas mais específicas</strong> sobre propósito da viagem</li>
  <li><strong>Verificação adicional</strong> de documentos financeiros</li>
  <li><strong>Novo protocolo</strong> de análise de risco</li>
</ul>

<h3 class="text-2xl font-bold text-gray-800 mb-4">3. Documentação Obrigatória</h3>
<ul class="list-disc pl-6 mb-8 space-y-2">
  <li><strong>Comprovante de renda</strong> dos últimos 6 meses (antes eram 3)</li>
  <li><strong>Declaração de IR</strong> obrigatória para todos os solicitantes</li>
  <li><strong>Carta do empregador</strong> com informações específicas padronizadas</li>
  <li><strong>Seguro viagem</strong> com cobertura mínima de US$ 100.000</li>
</ul>

<h2 class="text-3xl font-bold text-gray-900 mb-6">⚠️ Impactos para Brasileiros</h2>

<div class="grid md:grid-cols-2 gap-6 mb-8">
  <div class="bg-blue-50 p-6 rounded-lg">
    <h3 class="text-xl font-bold text-blue-900 mb-4">Tempos de Processamento</h3>
    <ul class="space-y-2 text-blue-800">
      <li><strong>Análise inicial</strong>: 3-5 dias úteis (antes 24-48h)</li>
      <li><strong>Agendamento</strong>: Filas 40% mais longas</li>
      <li><strong>Resultado</strong>: 7-10 dias úteis após entrevista</li>
    </ul>
  </div>
  
  <div class="bg-green-50 p-6 rounded-lg">
    <h3 class="text-xl font-bold text-green-900 mb-4">Taxa de Aprovação</h3>
    <ul class="space-y-2 text-green-800">
      <li><strong>Primeira aplicação</strong>: Mantida em ~85%</li>
      <li><strong>Reaplicações</strong>: Análise mais rigorosa</li>
      <li><strong>Perfil estudante/turismo</strong>: Sem impacto significativo</li>
      <li><strong>Perfil negócios</strong>: Documentação adicional necessária</li>
    </ul>
  </div>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">🎯 Como a Visa2Any Está Adaptando</h2>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
  <h3 class="text-xl font-bold text-yellow-900 mb-4">✅ Preparação Atualizada</h3>
  <ul class="space-y-2 text-yellow-800">
    <li>✅ <strong>Formulários revisados</strong> com as novas exigências</li>
    <li>✅ <strong>Mock interviews</strong> adaptadas aos novos protocolos</li>
    <li>✅ <strong>Checklist atualizado</strong> de documentação</li>
    <li>✅ <strong>Treinamento da equipe</strong> nas novas diretrizes</li>
  </ul>
</div>

<h3 class="text-2xl font-bold text-gray-800 mb-4">📞 Precisa de Ajuda Urgente?</h3>
<p class="text-lg text-gray-700 mb-6">Se você tem visto agendado ou está planejando aplicar, nossa equipe está preparada para:</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
  <ul class="space-y-3">
    <li class="flex items-center"><span class="text-green-600 mr-2">✅</span> <strong>Revisar sua documentação</strong> conforme novas regras</li>
    <li class="flex items-center"><span class="text-green-600 mr-2">✅</span> <strong>Atualizar seu DS-160</strong> se necessário</li>
    <li class="flex items-center"><span class="text-green-600 mr-2">✅</span> <strong>Preparar para entrevista</strong> com protocolo atual</li>
    <li class="flex items-center"><span class="text-green-600 mr-2">✅</span> <strong>Estratégia personalizada</strong> para seu perfil</li>
  </ul>
</div>

<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
  <h3 class="text-2xl font-bold mb-4">📞 Contato Imediato</h3>
  <div class="grid md:grid-cols-3 gap-4 text-center">
    <div>
      <p class="font-bold">📱 WhatsApp</p>
      <p>+55 11 5194-4717</p>
    </div>
    <div>
      <p class="font-bold">📧 Email</p>
      <p>urgente@visa2any.com</p>
    </div>
    <div>
      <p class="font-bold">🌐 Consultoria IA</p>
      <p>Análise Gratuita em 15min</p>
    </div>
  </div>
</div>
</div>`,
    category: 'Notícias Urgentes',
    author: 'Equipe Visa2Any',
    authorImage: '/authors/team.jpg',
    publishDate: '2024-12-15',
    readTime: '5 min',
    featured: true,
    trending: true,
    urgent: true,
    tags: ['Estados Unidos', 'Urgente', 'Regulamentação', 'Atualização'],
    country: 'Estados Unidos',
    flag: '🇺🇸',
    views: 12547,
    likes: 892,
    comments: 156,
    difficulty: 'Intermediário',
    type: 'Notícia',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'
  },
  {
    id: 'canada-aumenta-salario-minimo-express-entry',
    slug: 'canada-aumenta-salario-minimo-express-entry',
    title: '🔥 TRENDING: Canadá Aumenta Salário Mínimo para Express Entry - Nova Tabela 2024',
    excerpt: 'Governo canadense anuncia aumento de 15% no salário mínimo exigido para programas de imigração. Veja como isso afeta sua pontuação.',
    content: `<div class="prose prose-lg max-w-none">
<h1 class="text-4xl font-bold text-gray-900 mb-6">🔥 Canadá Aumenta Salário Mínimo para Express Entry - Nova Tabela 2024</h1>

<p class="text-xl text-gray-700 leading-relaxed mb-8">O <strong>governo canadense anunciou oficialmente</strong> um aumento de 15% no salário mínimo exigido para programas de imigração do Express Entry, com vigência a partir de janeiro de 2024.</p>

<div class="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8">
  <h3 class="text-lg font-bold text-orange-900 mb-3">🔥 IMPACTO IMEDIATO</h3>
  <p class="text-orange-800">Esta mudança afeta <strong>diretamente</strong> sua pontuação no CRS e pode alterar suas chances de receber um convite.</p>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">📊 Nova Tabela Salarial</h2>

<h3 class="text-2xl font-bold text-gray-800 mb-4">Express Entry - Federal Skilled Worker</h3>
<div class="overflow-x-auto mb-8">
  <table class="min-w-full bg-white border border-gray-300">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Província</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário Anterior</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Novo Salário</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aumento</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ontario</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CAD $27,040</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">CAD $31,096</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15%</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">British Columbia</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CAD $29,000</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">CAD $33,350</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15%</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alberta</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CAD $26,500</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">CAD $30,475</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15%</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Quebec</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CAD $28,000</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">CAD $32,200</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15%</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 class="text-2xl font-bold text-gray-800 mb-4">Programas Provinciais (PNP)</h3>
<div class="grid md:grid-cols-3 gap-4 mb-8">
  <div class="bg-blue-50 p-4 rounded-lg">
    <h4 class="font-bold text-blue-900">Ontario</h4>
    <p class="text-blue-800">CAD $35,000 → <strong>CAD $40,250</strong></p>
  </div>
  <div class="bg-green-50 p-4 rounded-lg">
    <h4 class="font-bold text-green-900">British Columbia</h4>
    <p class="text-green-800">CAD $38,000 → <strong>CAD $43,700</strong></p>
  </div>
  <div class="bg-red-50 p-4 rounded-lg">
    <h4 class="font-bold text-red-900">Alberta</h4>
    <p class="text-red-800">CAD $32,000 → <strong>CAD $36,800</strong></p>
  </div>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">🎯 Impacto na Pontuação CRS</h2>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
  <h3 class="text-xl font-bold text-yellow-900 mb-4">Pontuação por Faixa Salarial</h3>
  <ul class="space-y-2 text-yellow-800">
    <li><strong>CAD $30-40k</strong>: 0 pontos adicionais</li>
    <li><strong>CAD $40-50k</strong>: 25 pontos</li>
    <li><strong>CAD $50-75k</strong>: 50 pontos</li>
    <li><strong>CAD $75k+</strong>: 200 pontos</li>
  </ul>
</div>

<h3 class="text-2xl font-bold text-gray-800 mb-4">Estratégias para Aumentar Pontuação</h3>
<ol class="list-decimal pl-6 mb-8 space-y-2">
  <li><strong>Melhorar inglês/francês</strong> para CLB 9+</li>
  <li><strong>Buscar oferta de emprego</strong> (LMIA) - +50/200 pontos</li>
  <li><strong>Estudar no Canadá</strong> - +15/30 pontos</li>
  <li><strong>Provincial Nomination</strong> - +600 pontos</li>
</ol>

<div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-xl">
  <h2 class="text-3xl font-bold mb-6">📈 Como a Visa2Any Pode Ajudar</h2>
  <p class="text-xl mb-6">Nossa equipe especializada oferece:</p>
  <div class="grid md:grid-cols-2 gap-4">
    <ul class="space-y-3">
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Avaliação gratuita</strong> da nova pontuação</li>
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Estratégias personalizadas</strong> para aumentar CRS</li>
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Preparação para IELTS/CELPIP</strong></li>
    </ul>
    <ul class="space-y-3">
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Busca de empregadores</strong> dispostos a fazer LMIA</li>
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Aplicação para PNP</strong> das províncias</li>
      <li class="flex items-center"><span class="text-green-300 mr-2">✅</span> <strong>Taxa de sucesso</strong>: 94% de aprovação</li>
    </ul>
  </div>
</div>
</div>`,
    category: 'Trending',
    author: 'Sarah Johnson',
    authorImage: '/authors/sarah.jpg',
    publishDate: '2024-12-10',
    readTime: '7 min',
    featured: true,
    trending: true,
    tags: ['Canadá', 'Express Entry', 'Salário', 'Pontuação'],
    country: 'Canadá',
    flag: '🇨🇦',
    views: 8934,
    likes: 567,
    comments: 89,
    difficulty: 'Intermediário',
    type: 'Atualização',
    imageUrl: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=1200&h=600&fit=crop'
  },
  {
    id: 'guia-completo-visto-americano-2024',
    slug: 'guia-completo-visto-americano-2024',
    title: 'Guia Definitivo: Como Conseguir Visto Americano em 2024 (Taxa de Sucesso 94%)',
    excerpt: 'Método comprovado pela Visa2Any: passo a passo detalhado para aprovação do visto americano, incluindo documentos, entrevista e estratégias exclusivas.',
    content: `<div class="prose prose-lg max-w-none">
<h1 class="text-4xl font-bold text-gray-900 mb-6">Guia Definitivo: Como Conseguir Visto Americano em 2024</h1>
<p class="text-xl text-gray-700 leading-relaxed mb-8">Este é o método comprovado usado por mais de 1.000 clientes aprovados da Visa2Any. Taxa de sucesso de 94% seguindo exatamente estas orientações.</p>
<div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
  <h3 class="text-lg font-bold text-green-900 mb-3">✅ GARANTIA DE RESULTADOS</h3>
  <p class="text-green-800">Seguindo este guia exatamente como descrito, você terá as <strong>máximas chances de aprovação</strong> possíveis.</p>
</div>
<h2 class="text-3xl font-bold text-gray-900 mb-6">📋 Documentação Completa</h2>
<p class="text-lg text-gray-700 mb-4">A documentação é 70% do sucesso na aprovação. Aqui está exatamente o que você precisa:</p>
<ul class="list-disc pl-6 mb-8 space-y-2">
  <li><strong>Passaporte válido</strong> por pelo menos 6 meses</li>
  <li><strong>Formulário DS-160</strong> preenchido corretamente</li>
  <li><strong>Foto 5x5cm</strong> conforme especificações</li>
  <li><strong>Comprovante de renda</strong> dos últimos 6 meses</li>
  <li><strong>Declaração de IR</strong> dos últimos 2 anos</li>
  <li><strong>Carta do empregador</strong> ou contrato social</li>
  <li><strong>Extratos bancários</strong> dos últimos 3 meses</li>
  <li><strong>Seguro viagem</strong> com cobertura mínima</li>
</ul>
</div>`,
    category: 'Guias Completos',
    author: 'Ana Silva',
    authorImage: '/authors/ana.jpg',
    publishDate: '2024-12-01',
    readTime: '15 min',
    featured: true,
    tags: ['Estados Unidos', 'Visto de Turismo', 'B1/B2', 'Entrevista'],
    country: 'Estados Unidos',
    flag: '🇺🇸',
    views: 25431,
    likes: 1205,
    comments: 287,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop'
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authAction, setAuthAction] = useState<'like' | 'bookmark' | 'comment'>('like')
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Será verificado via API/Context,  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Maria Silva',
      avatar: 'M',
      content: 'Excelente artigo! As informações são muito úteis e atualizadas. Já estava procurando essas orientações há semanas.',
      timestamp: 'há 2 horas',
      likes: 12,
      liked: false,
      replies: []
    },
    {
      id: '2', 
      author: 'João Costa',
      avatar: 'J',
      content: 'Consegui meu visto seguindo exatamente essas orientações. Muito obrigado pela ajuda! 🎉',
      timestamp: 'há 5 horas',
      likes: 8,
      liked: false,
      replies: []
    }
  ])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    // Buscar post pelo slug (usando ID como slug por enquanto)
    const foundPost = blogPosts.find(p => p.slug === slug || p.id === slug)
    if (foundPost) {
      setPost(foundPost)
      
      // Buscar posts relacionados (mesma categoria)
      
      const related = blogPosts
        .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
        .slice(0, 3)
      setRelatedPosts(related)

      // Agendar posts automáticos nas redes sociais (apenas para posts novos/urgentes)

      if (foundPost.urgent || foundPost.trending) {
        scheduleAutomaticPosts(foundPost).then(result => {
          if (result.success) {
            console.log(`📱 Posts automáticos agendados para ${result.postsScheduled} redes sociais`)
          }
        }).catch(error => {
          console.error('Erro ao agendar posts automáticos:', error)
        })
      }
    }
    setLoading(false)
  }, [slug])

  // Verificar se usuário está logado

  useEffect(() => {
    // Aqui você verificaria o estado de autenticação via Context/API
    const checkAuth = async () => {
      try {
        console.log('🔍 Blog: Checking authentication...')
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache'
        })
        console.log('📡 Blog: Auth response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Blog: User authenticated:', data.user)
          setIsLoggedIn(true)
        } else {
          console.log('❌ Blog: User not authenticated')
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('❌ Blog: Error checking auth:', error)
        setIsLoggedIn(false)
      }
    }
    
    checkAuth()
    
    // Listen for login events
    
    const handleUserLogin = () => {
      console.log('🎯 Blog: Received user-login event')
      setTimeout(checkAuth, 100)
    }
    
    window.addEventListener('user-login', handleUserLogin)
    
    return () => {
      window.removeEventListener('user-login', handleUserLogin)
    }
  }, [])

  const requireAuth = (action: 'like' | 'bookmark' | 'comment') => {
    if (!isLoggedIn) {
      setAuthAction(action)
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleLike = () => {
    if (!requireAuth('like')) return
    
    setLiked(!liked)
    if (post) {
      post.likes += liked ? -1 : 1
      // Aqui você faria a chamada para a API para salvar o like
      fetch('/api/blog/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, action: liked ? 'unlike' : 'like' })
      })
    }
  }

  const handleBookmark = () => {
    if (!requireAuth('bookmark')) return
    
    setBookmarked(!bookmarked)
    // Salvar bookmark via API
    if (post) {
      fetch('/api/blog/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, action: bookmarked ? 'remove' : 'add' })
      })
    }
  }

  const handleComment = () => {
    if (!requireAuth('comment')) return
    // Scroll to comments section
    const commentsSection = document.getElementById('comments-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''
    const text = `${title} - ${post?.excerpt?.substring(0, 100)}...`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`, '_blank')
        break
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        copy to clipboard instead
        navigator.clipboard.writeText(`${title}\n\n${url}\n\n#visa2any #imigração #visto`)
        alert('Texto copiado! Cole no seu Instagram Stories ou post.')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copiado para a área de transferência!')
        break
    }
    setShowShareMenu(false)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    
    // Add new comment to local state
    
    const comment = {
      id: Date.now().toString(),
      author: 'Usuário Logado', // Should come from user context,      avatar: 'U',
      content: newComment,
      timestamp: 'agora',
      likes: 0,
      liked: false,
      replies: []
    }
    
    setComments([comment, ...comments])
    setNewComment('')
    
    // Here you would also call the API
    
    try {
      await fetch('/api/blog/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post?.id,
          content: newComment
        })
      })
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        }
      }
      return comment
    }))
  }

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return
    
    const reply = {
      id: Date.now().toString(),
      author: 'Usuário Logado',
      avatar: 'U',
      content: replyText,
      timestamp: 'agora',
      likes: 0,
      liked: false
    }
    
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        }
      }
      return comment
    }))
    
    setReplyText('')
    setReplyingTo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64 mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center mt-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <p className="text-gray-600 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden mt-20">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 right-4">
          <nav className="flex items-center space-x-2 text-white">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:underline">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="opacity-70">{post.category}</span>
          </nav>
        </div>

        {/* Post Meta Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            {post.urgent && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                🚨 URGENTE
              </span>
            )}
            {post.trending && (
              <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                🔥 TRENDING
              </span>
            )}
            <span className="text-4xl">{post.flag}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <ClientOnly><span>{post.views?.toLocaleString?.() || post.views}</span></ClientOnly>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Post Header */}
          <div className="p-8 border-b">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1 rounded-full ${
                  post.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                  post.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {post.difficulty}
                </span>
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {post.type}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button 
                  onClick={handleComment}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Compartilhar</span>
                  </button>
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10 w-48">
                      <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-50 rounded text-green-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.590z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button onClick={() => handleShare('instagram')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-pink-50 rounded text-pink-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </button>
                      <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-50 rounded text-blue-600">
                        <Facebook className="h-4 w-4" /> Facebook
                      </button>
                      <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-50 rounded text-blue-500">
                        <Twitter className="h-4 w-4" /> Twitter
                      </button>
                      <button onClick={() => handleShare('linkedin')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-50 rounded text-blue-700">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button onClick={() => handleShare('copy')} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded text-gray-600">
                        <Copy className="h-4 w-4" /> Copiar Link
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 transition-colors ${
                    bookmarked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                  <span>Salvar</span>
                </button>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Post Content */}
          <div className="p-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Success Rate Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-900">Taxa de Sucesso Comprovada</h3>
              </div>
              <p className="text-green-800">
                Clientes que seguem nossos guias e orientações têm <strong>91.2% de taxa de aprovação</strong>, 
                muito acima da média do mercado. Nossa equipe de especialistas acompanha cada caso individualmente.
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 my-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                🎯 Precisa de Ajuda Especializada?
              </h3>
              <p className="text-blue-800 mb-4">
                Nossa equipe de especialistas está pronta para ajudar você com seu processo de visto. 
                Oferecemos consultoria personalizada e acompanhamento completo.
              </p>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  📞 Consultoria Especializada
                </Button>
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  IA Análise Gratuita
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t">
              {post.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            <div id="comments-section" className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">💬 Comentários</h3>
              
              {isLoggedIn ? (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Compartilhe sua opinião sobre este artigo..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {newComment.length}/1000 caracteres
                    </span>
                    <button 
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comentar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-center">
                    <span className="font-medium">Faça login</span> para participar da discussão e compartilhar sua opinião
                  </p>
                  <div className="text-center mt-3">
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Entrar
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        comment.avatar === 'M' ? 'bg-green-500' : 
                        comment.avatar === 'J' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className={`text-sm flex items-center gap-1 transition-colors ${
                              comment.liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${comment.liked ? 'fill-current' : ''}`} />
                            {comment.likes}
                          </button>
                          <button 
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-gray-500 hover:text-blue-600 text-sm"
                          >
                            Responder
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <textarea 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Escreva sua resposta..."
                              className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyText.trim()}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                Responder
                              </button>
                              <button 
                                onClick={() => {setReplyingTo(null); setReplyText('')}}
                                className="text-gray-500 hover:text-gray-700 px-3 py-1 text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                  {reply.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">📚 Artigos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug || relatedPost.id}`}>
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {relatedPost.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 text-2xl">
                        {relatedPost.flag}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedPost.readTime}</span>
                        <ClientOnly><span>{relatedPost.views?.toLocaleString?.() || relatedPost.views} views</span></ClientOnly>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  🎯 Precisa de Ajuda?
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Nossa equipe pode acelerar seu processo em até 300%
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100" size="sm">
                    📞 Falar com Especialista
                  </Button>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600" size="sm">
                    🤖 Análise Gratuita IA
                  </Button>
                </div>
              </div>

              {/* Related by Country */}
              {post && post.country && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">{post.flag}</span>
                    Mais sobre {post.country}
                  </h3>
                  <div className="space-y-3">
                    {blogPosts
                      .filter(p => p.country === post.country && p.id !== post.id)
                      .slice(0, 3)
                      .map(relatedPost => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug || relatedPost.id}`}>
                          <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                              {relatedPost.title}
                            </h4>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              <ClientOnly><span>{relatedPost.views?.toLocaleString?.() || relatedPost.views}</span></ClientOnly>
                              <span className="mx-2">•</span>
                              <span>{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Recent Updates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  🔥 Artigos em Alta
                </h3>
                <div className="space-y-3">
                  {blogPosts
                    .filter(p => p.trending && p.id !== post?.id)
                    .slice(0, 3)
                    .map(trendingPost => (
                      <Link key={trendingPost.id} href={`/blog/${trendingPost.slug || trendingPost.id}`}>
                        <div className="p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              🔥 TRENDING
                            </span>
                            <span className="text-lg">{trendingPost.flag}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600">
                            {trendingPost.title}
                          </h4>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            <ClientOnly><span>{trendingPost.views?.toLocaleString?.() || trendingPost.views}</span></ClientOnly>
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de Autenticação com Social Login */}
      <SocialAuth 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
        onSuccess={(user) => {
          console.log('✅ Login realizado com sucesso:', user)
          setIsLoggedIn(true)
          setShowAuthModal(false)
          // Executar ação após login
          if (authAction === 'like') handleLike()
          else if (authAction === 'bookmark') handleBookmark()
          else if (authAction === 'comment') {
            // Scroll para seção de comentários
            document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      />
    </div>
  )
}