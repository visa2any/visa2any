const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultSources = [
  // Fontes Oficiais Estados Unidos
  {
    name: 'USCIS News',
    url: 'https://www.uscis.gov/news',
    type: 'rss',
    category: 'Notícias Urgentes',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    priority: 5,
    checkInterval: 30,
    keywords: [
      'H-1B', 'Green Card', 'visa', 'immigration', 'citizenship',
      'policy change', 'new rule', 'processing time', 'fee'
    ]
  },
  {
    name: 'US State Department Visa News',
    url: 'https://travel.state.gov/content/travel/en/News.html',
    type: 'scraping',
    category: 'Vistos Trabalho',
    country: 'Estados Unidos', 
    flag: '🇺🇸',
    priority: 4,
    checkInterval: 60,
    keywords: [
      'visa bulletin', 'interview', 'processing', 'embassy', 'consulate'
    ]
  },

  // Fontes Oficiais Canadá
  {
    name: 'IRCC News',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news.html',
    type: 'scraping',
    category: 'Imigração',
    country: 'Canadá',
    flag: '🇨🇦',
    priority: 5,
    checkInterval: 30,
    keywords: [
      'Express Entry', 'PNP', 'CRS', 'immigration', 'citizenship',
      'study permit', 'work permit', 'visitor visa'
    ]
  },
  {
    name: 'Canada Immigration Newsletter',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices.html',
    type: 'scraping',
    category: 'Imigração',
    country: 'Canadá',
    flag: '🇨🇦',
    priority: 4,
    checkInterval: 60,
    keywords: [
      'draw', 'invitation', 'score', 'program', 'pathway'
    ]
  },

  // Fontes Oficiais Austrália
  {
    name: 'Australian Department of Home Affairs',
    url: 'https://www.homeaffairs.gov.au/news-media/current-alerts',
    type: 'scraping',
    category: 'Vistos Trabalho',
    country: 'Austrália',
    flag: '🇦🇺',
    priority: 4,
    checkInterval: 60,
    keywords: [
      'skilled visa', 'migration', 'subclass', 'points test',
      'EOI', 'nomination', 'sponsorship'
    ]
  },

  // Fontes Europa
  {
    name: 'Portugal Immigration News',
    url: 'https://www.sef.pt/pt/pages/homepage.aspx',
    type: 'scraping',
    category: 'Vistos Europa',
    country: 'Portugal',
    flag: '🇵🇹',
    priority: 3,
    checkInterval: 120,
    keywords: [
      'D7', 'Golden Visa', 'residence permit', 'citizenship',
      'nationality', 'autorização'
    ]
  },
  {
    name: 'Germany Immigration Updates',
    url: 'https://www.make-it-in-germany.com/en/visa-residence',
    type: 'scraping',
    category: 'Tech & TI',
    country: 'Alemanha',
    flag: '🇩🇪',
    priority: 3,
    checkInterval: 120,
    keywords: [
      'Blue Card', 'skilled worker', 'residence permit',
      'work visa', 'EU Blue Card'
    ]
  },

  // Fontes Especializadas
  {
    name: 'Visa Guide World',
    url: 'https://visaguide.world/news/',
    type: 'rss',
    category: 'Notícias Gerais',
    country: 'Global',
    flag: '🌍',
    priority: 2,
    checkInterval: 180,
    keywords: [
      'visa', 'immigration', 'travel', 'requirements',
      'policy', 'update', 'news'
    ]
  },
  {
    name: 'SchengenVisaInfo',
    url: 'https://www.schengenvisainfo.com/news/',
    type: 'rss',
    category: 'Vistos Europa',
    country: 'Europa',
    flag: '🇪🇺',
    priority: 3,
    checkInterval: 120,
    keywords: [
      'Schengen', 'visa', 'Europe', 'travel', 'requirements'
    ]
  },

  // Fontes de TI/Tech
  {
    name: 'H1B Info News',
    url: 'https://www.h1binfo.net/news/',
    type: 'scraping',
    category: 'Tech & TI',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    priority: 4,
    checkInterval: 60,
    keywords: [
      'H-1B', 'lottery', 'tech visa', 'software engineer',
      'L-1', 'O-1', 'STEM'
    ]
  },

  // Fontes de Investimento
  {
    name: 'Investment Migration Insider',
    url: 'https://www.imidaily.com/category/news/',
    type: 'rss',
    category: 'Investimento',
    country: 'Global',
    flag: '🌍',
    priority: 2,
    checkInterval: 240,
    keywords: [
      'Golden Visa', 'investment visa', 'EB-5', 'citizenship by investment',
      'residency', 'investor'
    ]
  }
]

async function setupNewsSources() {
  try {
    console.log('🚀 Configurando fontes de notícias...')

    // Limpar fontes existentes
    await prisma.autoNewsLog.deleteMany({})
    await prisma.newsSource.deleteMany({})

    // Inserir novas fontes
    for (const source of defaultSources) {
      const created = await prisma.newsSource.create({
        data: source
      })
      console.log(`✅ Fonte criada: ${created.name} (${created.country})`)
    }

    // Criar algumas entradas de log de exemplo
    const sources = await prisma.newsSource.findMany()
    for (const source of sources.slice(0, 3)) {
      await prisma.autoNewsLog.create({
        data: {
          sourceId: source.id,
          action: 'setup',
          details: {
            message: 'Fonte configurada durante setup inicial',
            timestamp: new Date().toISOString()
          },
          success: true
        }
      })
    }

    console.log(`\n📊 Resumo:`)
    console.log(`- ${defaultSources.length} fontes configuradas`)
    console.log(`- ${defaultSources.filter(s => s.priority >= 4).length} fontes de alta prioridade`)
    console.log(`- ${defaultSources.filter(s => s.priority <= 2).length} fontes de baixa prioridade`)
    console.log(`- Países cobertos: ${[...new Set(defaultSources.map(s => s.country))].join(', ')}`)

    console.log('\n🎯 Próximos passos:')
    console.log('1. Configure o N8N workflow "Blog Auto Monitoring"')
    console.log('2. Teste o endpoint: GET /api/blog/sources')
    console.log('3. Execute o primeiro monitoramento manual')
    console.log('4. Monitore logs em: /api/blog/auto-post')

  } catch (error) {
    console.error('❌ Erro ao configurar fontes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupNewsSources()
}

module.exports = { setupNewsSources, defaultSources }