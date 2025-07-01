const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Posts hard-coded que estão no arquivo blog/page.tsx
const blogPosts = [
  {
    id: 'mudancas-visto-americano-dezembro-2024',
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

<h3 class="text-2xl font-bold text-gray-800 mb-4">2. Entrevistas Mais Rigorosas</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Tempo médio aumentado</strong> de 5 para 15 minutos</li>
  <li><strong>Perguntas específicas</strong> sobre planos de viagem detalhados</li>
  <li><strong>Verificação cruzada</strong> de informações em tempo real</li>
  <li><strong>Documentação adicional</strong> pode ser solicitada na hora</li>
</ul>

<h3 class="text-2xl font-bold text-gray-800 mb-4">3. Documentação Obrigatória Expandida</h3>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li><strong>Comprovante de renda</strong> dos últimos 6 meses (antes eram 3)</li>
  <li><strong>Histórico de viagens</strong> detalhado dos últimos 10 anos</li>
  <li><strong>Declaração de imposto de renda</strong> dos últimos 2 anos</li>
  <li><strong>Comprovante de vínculos</strong> familiares e profissionais no Brasil</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
  <h3 class="text-lg font-bold text-blue-900 mb-3">💡 DICA IMPORTANTE</h3>
  <p class="text-blue-800">A Visa2Any oferece <strong>análise gratuita</strong> para verificar se sua documentação está adequada às novas regras. <a href="/consultoria-ia" class="text-blue-600 underline">Clique aqui para fazer sua análise em 15 minutos</a>.</p>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">📊 Impacto nas Aprovações</h2>

<p class="text-lg text-gray-700 mb-6">Dados preliminares dos consulados americanos no Brasil mostram:</p>

<div class="grid md:grid-cols-2 gap-6 mb-8">
  <div class="bg-red-50 p-6 rounded-lg">
    <h4 class="text-xl font-bold text-red-800 mb-2">Taxa de Negação</h4>
    <p class="text-3xl font-bold text-red-600">+23%</p>
    <p class="text-sm text-red-700">Comparado com novembro 2024</p>
  </div>
  <div class="bg-yellow-50 p-6 rounded-lg">
    <h4 class="text-xl font-bold text-yellow-800 mb-2">Tempo de Processamento</h4>
    <p class="text-3xl font-bold text-yellow-600">+40%</p>
    <p class="text-sm text-yellow-700">Devido às verificações adicionais</p>
  </div>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">✅ Como se Preparar</h2>

<h3 class="text-2xl font-bold text-gray-800 mb-4">Passo 1: Revise sua Documentação</h3>
<div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
  <ul class="space-y-3">
    <li class="flex items-start">
      <span class="text-green-600 mr-2">✓</span>
      <span>Verifique se todos os documentos estão atualizados conforme as novas exigências</span>
    </li>
    <li class="flex items-start">
      <span class="text-green-600 mr-2">✓</span>
      <span>Prepare comprovantes de renda dos últimos 6 meses</span>
    </li>
    <li class="flex items-start">
      <span class="text-green-600 mr-2">✓</span>
      <span>Organize seu histórico de viagens dos últimos 10 anos</span>
    </li>
    <li class="flex items-start">
      <span class="text-green-600 mr-2">✓</span>
      <span>Reúna declarações de imposto de renda dos últimos 2 anos</span>
    </li>
  </ul>
</div>

<h3 class="text-2xl font-bold text-gray-800 mb-4">Passo 2: Prepare-se para a Entrevista</h3>
<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
  <ul class="space-y-3">
    <li class="flex items-start">
      <span class="text-blue-600 mr-2">✓</span>
      <span>Estude seu itinerário de viagem detalhadamente</span>
    </li>
    <li class="flex items-start">
      <span class="text-blue-600 mr-2">✓</span>
      <span>Pratique respostas sobre seus vínculos no Brasil</span>
    </li>
    <li class="flex items-start">
      <span class="text-blue-600 mr-2">✓</span>
      <span>Tenha documentos extras organizados</span>
    </li>
    <li class="flex items-start">
      <span class="text-blue-600 mr-2">✓</span>
      <span>Chegue com pelo menos 30 minutos de antecedência</span>
    </li>
  </ul>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">🎯 Suporte Especializado Visa2Any</h2>

<p class="text-lg text-gray-700 mb-6">Nossa equipe de especialistas está monitorando todas as mudanças e oferecendo suporte personalizado:</p>

<div class="grid md:grid-cols-3 gap-6 mb-8">
  <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
    <div class="text-4xl mb-4">🤖</div>
    <h4 class="text-lg font-bold mb-2">Análise IA Gratuita</h4>
    <p class="text-sm text-gray-600 mb-4">Verificação automática em 15 minutos</p>
    <a href="/consultoria-ia" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Iniciar Análise</a>
  </div>
  <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
    <div class="text-4xl mb-4">📋</div>
    <h4 class="text-lg font-bold mb-2">Relatório Premium</h4>
    <p class="text-sm text-gray-600 mb-4">PDF completo com timeline</p>
    <a href="/precos" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Ver Preços</a>
  </div>
  <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
    <div class="text-4xl mb-4">👨‍💼</div>
    <h4 class="text-lg font-bold mb-2">Consultoria Express</h4>
    <p class="text-sm text-gray-600 mb-4">60 min com especialista</p>
    <a href="/precos" class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">Agendar</a>
  </div>
</div>

<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
  <h3 class="text-2xl font-bold mb-4">⚡ Oferta Especial - Dezembro 2024</h3>
  <p class="text-lg mb-4">Devido às mudanças urgentes, oferecemos <strong>50% de desconto</strong> na primeira consultoria para clientes com entrevista agendada até 31/01/2025.</p>
  <a href="/contato" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">Falar com Especialista</a>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">📞 Suporte Urgente</h2>

<p class="text-lg text-gray-700 mb-6">Se você tem entrevista agendada nos próximos dias, entre em contato imediatamente:</p>

<div class="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
  <div class="flex items-center mb-4">
    <span class="text-2xl mr-3">📱</span>
    <div>
      <h4 class="font-bold text-red-900">WhatsApp Urgente</h4>
      <p class="text-red-800">+55 11 99999-9999</p>
    </div>
  </div>
  <div class="flex items-center">
    <span class="text-2xl mr-3">📧</span>
    <div>
      <h4 class="font-bold text-red-900">Email Prioritário</h4>
      <p class="text-red-800">urgente@visa2any.com</p>
    </div>
  </div>
</div>

<h2 class="text-3xl font-bold text-gray-900 mb-6">🔔 Mantenha-se Atualizado</h2>

<p class="text-lg text-gray-700 mb-6">As regras estão mudando rapidamente. Cadastre-se para receber atualizações instantâneas:</p>

<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
  <h4 class="text-xl font-bold mb-4">Newsletter WhatsApp Visa2Any</h4>
  <p class="text-gray-700 mb-4">Receba notificações em tempo real sobre mudanças em vistos e imigração.</p>
  <div class="flex gap-4">
    <input type="text" placeholder="Seu WhatsApp" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
    <button class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">Cadastrar</button>
  </div>
</div>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
  <h3 class="text-lg font-bold text-yellow-900 mb-3">⚠️ AVISO LEGAL</h3>
  <p class="text-yellow-800 text-sm">As informações contidas neste artigo são baseadas em diretrizes oficiais disponíveis até a data de publicação. Regulamentações podem sofrer alterações sem aviso prévio. Consulte sempre fontes oficiais e busque orientação profissional.</p>
</div>

<p class="text-center text-gray-600 italic">Artigo atualizado em: 15 de dezembro de 2024</p>
</div>`,
    category: 'Notícias Urgentes',
    author: 'Equipe Visa2Any',
    authorImage: '/authors/team.jpg',
    publishDate: new Date('2024-12-15'),
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
    content: '<div class="prose prose-lg max-w-none"><h1>Conteúdo completo do post sobre Canadá...</h1><p>Artigo detalhado sobre as mudanças no Express Entry.</p></div>',
    category: 'Trending',
    author: 'Sarah Johnson',
    authorImage: '/authors/sarah.jpg',
    publishDate: new Date('2024-12-10'),
    readTime: '7 min',
    featured: true,
    trending: true,
    urgent: false,
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
  {
    id: 'guia-completo-visto-americano-2024',
    title: 'Guia Definitivo: Como Conseguir Visto Americano em 2024 (Taxa de Sucesso 94%)',
    excerpt: 'Método comprovado pela Visa2Any: passo a passo detalhado para aprovação do visto americano, incluindo documentos, entrevista e estratégias exclusivas.',
    content: '<div class="prose prose-lg max-w-none"><h1>Guia Completo para Visto Americano</h1><p>Conteúdo completo do guia...</p></div>',
    category: 'Guias Completos',
    author: 'Ana Silva',
    authorImage: '/authors/ana.jpg',
    publishDate: new Date('2024-12-01'),
    readTime: '15 min',
    featured: true,
    trending: false,
    urgent: false,
    tags: ['Estados Unidos', 'Visto de Turismo', 'B1/B2', 'Entrevista'],
    country: 'Estados Unidos',
    flag: '🇺🇸',
    views: 15672,
    likes: 1234,
    comments: 287,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop'
  }
  // Adicionar mais posts conforme necessário...
]

async function migratePosts() {
  try {
    console.log('🚀 Iniciando migração dos posts do blog...')
    
    // Limpar posts existentes (opcional)
    // await prisma.blogPost.deleteMany()
    
    let migratedCount = 0
    let skippedCount = 0
    
    for (const post of blogPosts) {
      try {
        // Verificar se o post já existe
        const existingPost = await prisma.blogPost.findFirst({
          where: { id: post.id }
        })
        
        if (existingPost) {
          console.log(`⚠️  Post já existe: ${post.title}`)
          skippedCount++
          continue
        }
        
        // Criar o post
        await prisma.blogPost.create({
          data: {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            author: post.author,
            authorImage: post.authorImage,
            publishDate: post.publishDate,
            readTime: post.readTime,
            featured: post.featured,
            trending: post.trending,
            urgent: post.urgent,
            tags: post.tags,
            country: post.country,
            flag: post.flag,
            views: post.views,
            likes: post.likes,
            comments: post.comments,
            difficulty: post.difficulty,
            type: post.type,
            imageUrl: post.imageUrl,
            sponsored: post.sponsored || false,
            published: true
          }
        })
        
        console.log(`✅ Post migrado: ${post.title}`)
        migratedCount++
        
      } catch (error) {
        console.error(`❌ Erro ao migrar post ${post.title}:`, error)
      }
    }
    
    console.log(`\n🎉 Migração concluída!`)
    console.log(`✅ Posts migrados: ${migratedCount}`)
    console.log(`⚠️  Posts ignorados: ${skippedCount}`)
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a migração
migratePosts()