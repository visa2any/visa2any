import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
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
}

const blogPosts: BlogPost[] = [
  // URGENT BREAKING NEWS,  {
    id: 'mudancas-visto-americano-dezembro-2024',
    title: '🚨 URGENTE: Novas Regras para Visto Americano em Vigor desde Dezembro 2024',
    excerpt: 'Consulados americanos implementam novas diretrizes que afetam diretamente brasileiros. Mudanças no DS-160, entrevistas e documentação obrigatória.',
    content: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
  },
  {
    id: 'canada-aumenta-salario-minimo-express-entry',
    title: '🔥 TRENDING: Canadá Aumenta Salário Mínimo para Express Entry - Nova Tabela 2024',
    excerpt: 'Governo canadense anuncia aumento de 15% no salário mínimo exigido para programas de imigração. Veja como isso afeta sua pontuação.',
    content: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=800&h=400&fit=crop'
  },
  
  // FEATURED GUIDES,  {
    id: 'guia-completo-visto-americano-2024',
    title: 'Guia Definitivo: Como Conseguir Visto Americano em 2024 (Taxa de Sucesso 94%)',
    excerpt: 'Método comprovado pela Visa2Any: passo a passo detalhado para aprovação do visto americano, incluindo documentos, entrevista e estratégias exclusivas.',
    content: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=400&fit=crop',
    videoUrl: 'https://youtube.com/watch?v=usa-visa'
  },
  {
    id: 'express-entry-canada-estrategias-2024',
    title: 'Express Entry Canadá: 7 Estratégias Secretas para Pontuar 480+ Pontos',
    excerpt: 'Estratégias exclusivas utilizadas por nossos clientes aprovados: como maximizar sua pontuação no Express Entry e garantir o convite.',
    content: '',
    category: 'Imigração',
    author: 'Carlos Mendes',
    authorImage: '/authors/carlos.jpg',
    publishDate: '2024-11-28',
    readTime: '12 min',
    featured: true,
    tags: ['Canadá', 'Express Entry', 'CRS Points', 'Estratégia'],
    country: 'Canadá',
    flag: '🇨🇦',
    views: 18765,
    likes: 923,
    comments: 198,
    difficulty: 'Avançado',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=400&fit=crop'
  },
  {
    id: 'portugal-d7-guia-completo-2024',
    title: 'Visto D7 Portugal: Guia Completo para Aposentados e Remote Workers',
    excerpt: 'Tudo sobre o visto D7: requisitos atualizados, renda mínima, documentação, NHR e como nossa equipe pode acelerar seu processo.',
    content: '',
    category: 'Vistos Europa',
    author: 'Isabel Costa',
    authorImage: '/authors/isabel.jpg',
    publishDate: '2024-11-25',
    readTime: '18 min',
    featured: true,
    tags: ['Portugal', 'Visto D7', 'NHR', 'Remote Work'],
    country: 'Portugal',
    flag: '🇵🇹',
    views: 16234,
    likes: 784,
    comments: 145,
    difficulty: 'Iniciante',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=400&fit=crop'
  },

  // TRENDING POSTS,  {
    id: 'australia-skilled-visa-2024-lista',
    title: 'Austrália Skilled Visa: Lista DEFINITIVA de Profissões em Demanda 2024-2025',
    excerpt: 'Lista oficial atualizada: 250+ profissões em alta demanda na Austrália, salários médios e qual pathway é ideal para seu perfil.',
    content: '',
    category: 'Vistos Trabalho',
    author: 'Michael Thompson',
    authorImage: '/authors/michael.jpg',
    publishDate: '2024-11-22',
    readTime: '10 min',
    trending: true,
    tags: ['Austrália', 'Skilled Visa', 'Profissões', 'MLTSSL'],
    country: 'Austrália',
    flag: '🇦🇺',
    views: 14567,
    likes: 692,
    comments: 123,
    difficulty: 'Intermediário',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
  },
  {
    id: 'cidadania-italiana-2024-novos-requisitos',
    title: 'Cidadania Italiana 2024: Novos Requisitos e Mudanças nos Consulados',
    excerpt: 'Consulados italianos mudam requisitos: novas exigências para documentos, apostilamento e agendamento. Veja o que mudou.',
    content: '',
    category: 'Cidadania',
    author: 'Marco Romano',
    authorImage: '/authors/marco.jpg',
    publishDate: '2024-11-20',
    readTime: '13 min',
    trending: true,
    tags: ['Itália', 'Cidadania', 'Jure Sanguinis', 'Consulado'],
    country: 'Itália',
    flag: '🇮🇹',
    views: 11234,
    likes: 543,
    comments: 98,
    difficulty: 'Avançado',
    type: 'Atualização',
    imageUrl: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&h=400&fit=crop'
  },

  // INVESTMENT & GOLDEN VISA,  {
    id: 'golden-visa-europa-2024-comparativo',
    title: 'Golden Visa Europa 2024: Comparativo COMPLETO dos 8 Melhores Programas',
    excerpt: 'Análise detalhada: Portugal, Espanha, Grécia, Malta e outros. Investimentos, benefícios, tempo de processamento e ROI esperado.',
    content: '',
    category: 'Investimento',
    author: 'Ricardo Silva',
    authorImage: '/authors/ricardo.jpg',
    publishDate: '2024-11-18',
    readTime: '20 min',
    featured: true,
    tags: ['Golden Visa', 'Europa', 'Investimento', 'Residência'],
    country: 'Europa',
    flag: '🇪🇺',
    views: 9876,
    likes: 421,
    comments: 76,
    difficulty: 'Avançado',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop'
  },
  {
    id: 'eb5-visa-eua-2024',
    title: 'EB-5 Visa EUA: Investimento de US$ 800k Ainda Vale a Pena em 2024?',
    excerpt: 'Análise completa do EB-5: mudanças na legislação, projetos disponíveis, riscos e retornos. ROI médio de 3-5% ao ano.',
    content: '',
    category: 'Investimento',
    author: 'Jennifer Lee',
    authorImage: '/authors/jennifer.jpg',
    publishDate: '2024-11-15',
    readTime: '16 min',
    tags: ['Estados Unidos', 'EB-5', 'Investimento', 'Green Card'],
    country: 'Estados Unidos',
    flag: '🇺🇸',
    views: 7654,
    likes: 312,
    comments: 54,
    difficulty: 'Avançado',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'
  },

  // TECH PROFESSIONALS,  {
    id: 'alemanha-blue-card-ti-2024',
    title: 'Alemanha Blue Card para TI: Guia Prático + Template de CV Alemão',
    excerpt: 'Como conseguir a Blue Card alemã sendo desenvolvedor: salários, empresas que patrocinam, processo completo e template de CV.',
    content: '',
    category: 'Tech & TI',
    author: 'Klaus Weber',
    authorImage: '/authors/klaus.jpg',
    publishDate: '2024-11-12',
    readTime: '14 min',
    trending: true,
    tags: ['Alemanha', 'Blue Card', 'TI', 'Tecnologia'],
    country: 'Alemanha',
    flag: '🇩🇪',
    views: 13245,
    likes: 634,
    comments: 117,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=400&fit=crop'
  },
  {
    id: 'h1b-visa-2024-lottery',
    title: 'H-1B Visa 2024: Como Aumentar suas Chances na Loteria (85% de Sucesso)',
    excerpt: 'Estratégias comprovadas para H-1B: empresas que mais patrocinam, timing ideal, preparação de documentos e alternativas.',
    content: '',
    category: 'Tech & TI',
    author: 'David Park',
    authorImage: '/authors/david.jpg',
    publishDate: '2024-11-10',
    readTime: '11 min',
    tags: ['Estados Unidos', 'H-1B', 'TI', 'Lottery'],
    country: 'Estados Unidos',
    flag: '🇺🇸',
    views: 15678,
    likes: 789,
    comments: 156,
    difficulty: 'Avançado',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop'
  },

  // HEALTHCARE PROFESSIONALS  ,  {
    id: 'medicos-canada-como-validar-diploma',
    title: 'Médicos no Canadá: Processo COMPLETO para Validar Diploma e Atuar',
    excerpt: 'Passo a passo para médicos: MCC exams, residência, licença provincial. Tempo médio: 4-6 anos. Custos e dicas práticas.',
    content: '',
    category: 'Profissionais Saúde',
    author: 'Dr. Patricia Santos',
    authorImage: '/authors/patricia.jpg',
    publishDate: '2024-11-08',
    readTime: '17 min',
    tags: ['Canadá', 'Medicina', 'Validação', 'Residência'],
    country: 'Canadá',
    flag: '🇨🇦',
    views: 8943,
    likes: 445,
    comments: 87,
    difficulty: 'Avançado',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
  },
  {
    id: 'enfermeiros-australia-demanda',
    title: 'Enfermeiros na Austrália: Demanda Recorde e Pathway Facilitado 2024',
    excerpt: 'Shortage crítico de enfermeiros: salários de AUD $80k+, pathway acelerado, sponsorship garantido e processo simplificado.',
    content: '',
    category: 'Profissionais Saúde',
    author: 'Emma Wilson',
    authorImage: '/authors/emma.jpg',
    publishDate: '2024-11-05',
    readTime: '9 min',
    trending: true,
    tags: ['Austrália', 'Enfermagem', 'Shortage', 'Sponsorship'],
    country: 'Austrália',
    flag: '🇦🇺',
    views: 10567,
    likes: 523,
    comments: 94,
    difficulty: 'Intermediário',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop'
  },

  // STUDENTS,  {
    id: 'estudar-alemanha-gratuito-2024',
    title: 'Como Estudar de GRAÇA na Alemanha: Universidades, Bolsas e Custo de Vida',
    excerpt: 'Guia completo: universidades públicas gratuitas, bolsas DAAD, custo de vida real e como trabalhar durante os estudos.',
    content: '',
    category: 'Estudos',
    author: 'Hans Mueller',
    authorImage: '/authors/hans.jpg',
    publishDate: '2024-11-03',
    readTime: '12 min',
    tags: ['Alemanha', 'Estudos', 'Universidade', 'Bolsas'],
    country: 'Alemanha',
    flag: '🇩🇪',
    views: 12345,
    likes: 678,
    comments: 134,
    difficulty: 'Iniciante',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'
  },
  {
    id: 'canadá-pos-graduacao-pgwp',
    title: 'Pós-Graduação no Canadá: Como Conseguir PGWP de 3 Anos',
    excerpt: 'Estratégia completa: melhores colleges, programs elegíveis para PGWP, custos reais e pathway para residência permanente.',
    content: '',
    category: 'Estudos',
    author: 'Sophie Tremblay',
    authorImage: '/authors/sophie.jpg',
    publishDate: '2024-11-01',
    readTime: '13 min',
    tags: ['Canadá', 'PGWP', 'Pós-graduação', 'Study Permit'],
    country: 'Canadá',
    flag: '🇨🇦',
    views: 9876,
    likes: 456,
    comments: 78,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop'
  },

  // FAMILY & DEPENDENTS,  {
    id: 'reuniao-familiar-portugal',
    title: 'Reunião Familiar em Portugal: Guia Prático e Documentos Necessários',
    excerpt: 'Como trazer família para Portugal: cônjuge, filhos, pais. Documentos, renda mínima, prazos e dicas para aprovação rápida.',
    content: '',
    category: 'Família',
    author: 'Carmen Rodriguez',
    authorImage: '/authors/carmen.jpg',
    publishDate: '2024-10-28',
    readTime: '10 min',
    tags: ['Portugal', 'Reunião Familiar', 'Família', 'Documentos'],
    country: 'Portugal',
    flag: '🇵🇹',
    views: 7234,
    likes: 334,
    comments: 56,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop'
  },

  // RETIREES,  {
    id: 'aposentados-panama-pensionado-visa',
    title: 'Panamá para Aposentados: Pensionado Visa e Vantagens Exclusivas',
    excerpt: 'Paraíso para aposentados: Pensionado Visa, benefícios fiscais, custo de vida baixo, sistema de saúde e comunidade brasileira.',
    content: '',
    category: 'Aposentados',
    author: 'Carlos Mendoza',
    authorImage: '/authors/mendoza.jpg',
    publishDate: '2024-10-25',
    readTime: '11 min',
    tags: ['Panamá', 'Aposentados', 'Pensionado Visa', 'Benefícios'],
    country: 'Panamá',
    flag: '🇵🇦',
    views: 5678,
    likes: 267,
    comments: 45,
    difficulty: 'Iniciante',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
  },

  // SPECIAL CASES,  {
    id: 'antecedentes-criminais-imigracao',
    title: 'Antecedentes Criminais e Imigração: O Que Você Precisa Saber',
    excerpt: 'Análise jurídica: como antecedentes afetam vistos, países mais/menos rigorosos, processos de reabilitação e waiver.',
    content: '',
    category: 'Casos Especiais',
    author: 'Dr. Roberto Lima',
    authorImage: '/authors/roberto.jpg',
    publishDate: '2024-10-22',
    readTime: '15 min',
    tags: ['Antecedentes', 'Criminal Record', 'Waiver', 'Jurídico'],
    country: 'Global',
    flag: '🌍',
    views: 6543,
    likes: 298,
    comments: 67,
    difficulty: 'Avançado',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop'
  }
]

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
    countries: '',
    terms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')


  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!whatsappForm.terms) {
      setSubmitMessage('❌ Você deve aceitar os termos para continuar')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/newsletter/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: whatsappForm.name,
          phone: whatsappForm.phone,
          countries: whatsappForm.countries ? [whatsappForm.countries] : ['Global'],
          terms: whatsappForm.terms
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('✅ ' + data.message)
        setWhatsappForm({ name: '', phone: '', countries: '', terms: false })
        
        // Fechar modal após 3 segundos,        setTimeout(() => {
          setShowWhatsAppForm(false)
          setSubmitMessage('')
        }, 3000)
      } else {
        setSubmitMessage('❌ ' + data.error)
      }
    } catch (error) {
      setSubmitMessage('❌ Erro ao processar cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter and sort posts,  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'Todos' || post.difficulty === selectedDifficulty
    const matchesType = selectedType === 'Todos' || post.type === selectedType
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      case 'oldest': return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
      case 'popular': return b.views - a.views
      case 'liked': return b.likes - a.likes
      default: return 0
    }
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const urgentPosts = blogPosts.filter(post => post.urgent)
  const trendingPosts = blogPosts.filter(post => post.trending)

  const stats = [
    { label: 'Artigos Publicados', value: blogPosts.length, icon: BookOpen },
    { label: 'Visualizações Totais', value: '247K+', icon: Eye },
    { label: 'Países Cobertos', value: '25+', icon: Globe },
    { label: 'Especialistas', value: '12', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Blog <span className="text-yellow-400">Visa2Any</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
              Mantenha-se atualizado com as últimas notícias, guias especializados e análises detalhadas 
              sobre imigração mundial. Conteúdo atualizado diariamente por nossos especialistas.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <Icon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                )
              })}
            </div>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por país, tipo de visto, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 text-lg border-0 rounded-2xl focus:ring-4 focus:ring-blue-300 shadow-2xl"
                />
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      {showFilters && (
        <section className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Urgent News */}
      {urgentPosts.length > 0 && (
        <section className="bg-red-50 border-l-4 border-red-500 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <span>{post.publishDate}</span>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Posts */}
      {trendingPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">🔥 Em Alta</h2>
              </div>
              <Link href="/blog/trending" className="text-blue-600 hover:text-blue-800 flex items-center">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {trendingPosts.slice(0, 3).map(post => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article className="group cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="h-40 relative overflow-hidden">
                      <img 
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          🔥 TRENDING
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 text-3xl drop-shadow-lg">
                        {post.flag}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {post.type}
                        </span>
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {post.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <ClientOnly><span>{post.views?.toLocaleString?.() || post.views}</span></ClientOnly>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Button variant="outline" className="w-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        Ler Artigo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              📚 Todos os Artigos
              <span className="text-sm font-normal text-gray-500 ml-3">
                ({filteredPosts.length} encontrados)
              </span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-3">
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
                        <span>{post.publishDate}</span>
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
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      Ler Artigo Completo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                      </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Strategic Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Newsletter Quick */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Alertas Imediatos
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Receba notificações sobre mudanças importantes em leis de imigração
                  </p>
                  <Button 
                    onClick={() => setShowWhatsAppForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Grátis
                  </Button>
                </div>

                {/* Popular Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                    Mais Lidos
                  </h3>
                  <div className="space-y-4">
                    {blogPosts
                      .slice()
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((post, index) => (
                        <Link key={post.id} href={`/blog/${post.id}`}>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-800">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                                {post.title}
                              </h4>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span className="mr-2">{post.flag}</span>
                                <Eye className="h-3 w-3 mr-1" />
                                <ClientOnly><span>{post.views?.toLocaleString?.() || post.views}</span></ClientOnly>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-purple-600" />
                    Categorias
                  </h3>
                  <div className="space-y-2">
                    {categories.filter(cat => cat !== 'Todos').map(category => {
                      const categoryCount = blogPosts.filter(post => post.category === category).length
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{category}</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {categoryCount}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Countries */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-green-600" />
                    Por País
                  </h3>
                  <div className="space-y-2">
                    {Array.from(new Set(blogPosts.map(post => post.country).filter(Boolean)))
                      .sort()
                      .map(country => {
                        const countryPosts = blogPosts.filter(post => post.country === country)
                        const flag = countryPosts[0]?.flag
                        return (
                          <Link key={country} href={`/blog?country=${encodeURIComponent(country!)}`}>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{flag}</span>
                                <span className="text-sm text-gray-700">{country}</span>
                              </div>
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {countryPosts.length}
                              </span>
                            </div>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>

                {/* Visa2Any Services */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    Serviços Premium
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Consultoria 1-on-1 Especializada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Análise de Perfil com IA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Preparação para Entrevistas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>94% Taxa de Aprovação</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Começar Agora
                  </Button>
                </div>

                {/* Recent Updates */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
                    Atualizações Recentes
                  </h3>
                  <div className="space-y-3">
                    {blogPosts
                      .filter(post => post.urgent || post.trending)
                      .slice(0, 3)
                      .map(post => (
                        <Link key={post.id} href={`/blog/${post.id}`}>
                          <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-2 mb-2">
                              {post.urgent && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  🚨 URGENTE
                                </span>
                              )}
                              {post.trending && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  🔥 TRENDING
                                </span>
                              )}
                              <span className="text-sm">{post.flag}</span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                            </p>
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
      </section>

      {/* Newsletter & RSS */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            📧 Fique por Dentro das Novidades
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Receba notificações automáticas de novos artigos, alertas de mudanças em leis de imigração 
            e conteúdo exclusivo diretamente no seu email.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-6">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 text-lg"
            />
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg font-bold rounded-xl">
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
            <Button 
              onClick={() => setShowWhatsAppForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-bold rounded-xl"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-blue-200">
            <div className="flex items-center">
              <Rss className="h-5 w-5 mr-2" />
              <span>RSS Feed</span>
            </div>
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              <span>Alertas Automáticos</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              <span>Conteúdo Premium</span>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />


      {/* Modal Newsletter WhatsApp */}
      {showWhatsAppForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                📱 Newsletter via WhatsApp
              </h3>
              <p className="text-gray-600">
                Receba notificações instantâneas sobre mudanças em leis de imigração e novos artigos diretamente no seu WhatsApp.
              </p>
            </div>
            
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={whatsappForm.name}
                  onChange={(e) => setWhatsappForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp (com código do país) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+55 11 99999-9999"
                  value={whatsappForm.phone}
                  onChange={(e) => setWhatsappForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Maior Interesse
                </label>
                <select 
                  value={whatsappForm.countries}
                  onChange={(e) => setWhatsappForm(prev => ({ ...prev, countries: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione seu país de interesse</option>
                  <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                  <option value="Canadá">🇨🇦 Canadá</option>
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Austrália">🇦🇺 Austrália</option>
                  <option value="Alemanha">🇩🇪 Alemanha</option>
                  <option value="Itália">🇮🇹 Itália</option>
                  <option value="Espanha">🇪🇸 Espanha</option>
                  <option value="França">🇫🇷 França</option>
                  <option value="Reino Unido">🇬🇧 Reino Unido</option>
                  <option value="Global">🌍 Todos os países</option>
                </select>
              </div>
              
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  required
                  checked={whatsappForm.terms}
                  onChange={(e) => setWhatsappForm(prev => ({ ...prev, terms: e.target.checked }))}
                  className="mt-1" 
                />
                <p className="text-sm text-gray-600">
                  Concordo em receber mensagens via WhatsApp sobre imigração e aceito a{' '}
                  <a href="/privacidade" className="text-green-600 hover:underline">
                    Política de Privacidade
                  </a> *
                </p>
              </div>

              {submitMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  submitMessage.includes('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Assinar WhatsApp
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Benefícios exclusivos:</span>
              </div>
              <ul className="text-green-700 text-sm mt-2 space-y-1">
                <li>• 📱 Notificações instantâneas de mudanças</li>
                <li>• 🚨 Alertas de urgência em tempo real</li>
                <li>• 📊 Resumos semanais personalizados</li>
                <li>• 💬 Acesso direto aos especialistas</li>
                <li>• 🎁 Conteúdo exclusivo para assinantes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}