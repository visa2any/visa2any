import { BlogPost } from '@/types/blog'

interface SocialPost {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'
  content: string
  imageUrl?: string | undefined
  videoUrl?: string
  hashtags: string[]
  scheduledAt?: Date
}

interface SocialTemplate {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'
  template: string
  maxLength: number
  hashtags: string[]
  videoRequired?: boolean
}

// Configurações de frequência por plataforma
const PLATFORM_CONFIG = {
  facebook: { 
    dailyLimit: 2, 
    minInterval: 6 * 60 * 60 * 1000, // 6 horas
    optimalTimes: [9, 13, 15] // 9h, 13h, 15h
  },
  instagram: { 
    dailyLimit: 2, 
    minInterval: 8 * 60 * 60 * 1000, // 8 horas
    optimalTimes: [11, 14, 17] // 11h, 14h, 17h
  },
  linkedin: { 
    dailyLimit: 1, 
    minInterval: 24 * 60 * 60 * 1000, // 24 horas
    optimalTimes: [8, 12, 17] // 8h, 12h, 17h
  },
  twitter: { 
    dailyLimit: 4, 
    minInterval: 3 * 60 * 60 * 1000, // 3 horas
    optimalTimes: [9, 12, 15, 18] // 9h, 12h, 15h, 18h
  },
  tiktok: { 
    dailyLimit: 1, 
    minInterval: 24 * 60 * 60 * 1000, // 24 horas
    optimalTimes: [18, 19, 20] // 18h, 19h, 20h
  }
}

// Templates para cada rede social
const SOCIAL_TEMPLATES: SocialTemplate[] = [
  {
    platform: 'facebook',
    template: `🚨 {emoji} {title}\n\n{excerpt}\n\n📋 Principais pontos:\n{highlights}\n\n👉 Leia o artigo completo: {url}\n\n#Visa2Any {hashtags}`,
    maxLength: 2000,
    hashtags: ['#Imigração', '#Visto', '#Brasil', '#Consultoria']
  },
  {
    platform: 'instagram',
    template: `{emoji} {title}\n\n{excerpt}\n\n📱 Swipe para ver mais detalhes\n👆 Link no perfil para artigo completo\n\n{hashtags}`,
    maxLength: 2200,
    hashtags: ['#visa2any', '#imigração', '#visto', '#brasil', '#consultoria', '#internacional', '#mudança']
  },
  {
    platform: 'linkedin',
    template: `{title}\n\n{excerpt}\n\nComo especialistas em imigração, observamos que:\n{highlights}\n\n💡 Nossa experiência mostra que clientes preparados têm 91.2% de taxa de aprovação.\n\n🔗 Artigo completo: {url}\n\n{hashtags}`,
    maxLength: 3000,
    hashtags: ['#Imigração', '#VistoAmericano', '#ExpressEntry', '#Consultoria', '#Visa2Any']
  },
  {
    platform: 'twitter',
    template: `{emoji} {title}\n\n{excerpt}\n\n🔗 {url}\n\n{hashtags}`,
    maxLength: 280,
    hashtags: ['#Visa2Any', '#Imigração', '#Visto']
  },
  {
    platform: 'tiktok',
    template: `{emoji} {title}\n\n{excerpt}\n\n🎯 DICA IMPORTANTE para quem quer {country_action}!\n\n📱 Siga @visa2any para mais dicas\n🔗 Link na bio para artigo completo\n\n{hashtags}`,
    maxLength: 2200,
    hashtags: ['#visa2any', '#imigração', '#visto', '#mudança', '#internacional', '#dicas', '#brasil'],
    videoRequired: true
  }
]

// Função para extrair highlights do conteúdo do post
function extractHighlights(content: string): string[] {
  const highlights = []
  
  // Extrair pontos importantes baseados em marcadores comuns
  const strongRegex = /<strong>(.*?)<\/strong>/g
  let match
  while ((match = strongRegex.exec(content)) !== null && highlights.length < 3) {
    highlights.push(`• ${match[1]}`)
  }
  
  // Se não encontrou highlights suficientes, usar pontos genéricos
  if (highlights.length === 0) {
    highlights.push('• Informações atualizadas e verificadas')
    highlights.push('• Orientação especializada')
    highlights.push('• Estratégias comprovadas')
  }
  
  return highlights
}

// Função para gerar emoji baseado na categoria
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Notícias Urgentes': '🚨',
    'Trending': '🔥',
    'Guias Completos': '📚',
    'Imigração': '✈️',
    'Vistos Europa': '🇪🇺',
    'Profissionais Saúde': '👩‍⚕️',
    'Estudos': '🎓',
    'Família': '👨‍👩‍👧‍👦',
    'Aposentados': '🏖️'
  }
  return emojiMap[category] || '📰'
}

// Função para gerar ação do país para TikTok
function getCountryAction(country: string): string {
  const actionMap: Record<string, string> = {
    'Estados Unidos': 'viver nos EUA',
    'Canadá': 'imigrar para o Canadá',
    'Portugal': 'morar em Portugal',
    'Alemanha': 'estudar na Alemanha',
    'Austrália': 'trabalhar na Austrália',
    'França': 'viver na França',
    'Espanha': 'morar na Espanha',
    'Itália': 'viver na Itália'
  }
  return actionMap[country] || 'imigrar'
}

// Função para gerar vídeo conceitual para TikTok
function generateTikTokVideoScript(blogPost: BlogPost): string {
  const scenes = [
    `🎬 CENA 1: Texto "ATENÇÃO!" com zoom dramático`,
    `🎬 CENA 2: Bandeira do ${blogPost.country} tremulando`,
    `🎬 CENA 3: Texto principal: "${blogPost.title.substring(0, 50)}..."`,
    `🎬 CENA 4: 3 pontos principais em bullets`,
    `🎬 CENA 5: "Siga @visa2any para mais dicas!"`,
    `🎬 CENA 6: Logo da Visa2Any com link na bio`
  ]
  
  return scenes.join('\n')
}

// Função para calcular próximo horário ótimo para postar
function calculateOptimalPostTime(platform: string, isUrgent: boolean = false): Date {
  const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
  const now = new Date()
  
  // Se é urgente, agenda para os próximos minutos respeitando intervalo mínimo
  if (isUrgent) {
    const urgentDelay = Math.max(config.minInterval / 4, 15 * 60 * 1000) // Mín 15 min
    return new Date(now.getTime() + urgentDelay)
  }
  
  // Buscar próximo horário ótimo
  const currentHour = now.getHours()
  const optimalTimes = config.optimalTimes || []
  
  // Encontrar próximo horário ótimo hoje
  const nextOptimalToday = optimalTimes.find(hour => hour > currentHour)
  
  if (nextOptimalToday) {
    const nextTime = new Date(now)
    nextTime.setHours(nextOptimalToday, 0, 0, 0)
    return nextTime
  }
  
  // Se não há mais horários hoje, usar primeiro horário de amanhã
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(optimalTimes[0] || 9, 0, 0, 0) // Fallback to 9 AM if empty
  
  return tomorrow
}

// Função para verificar se pode postar (anti-spam)
async function canSchedulePost(platform: string): Promise<boolean> {
  try {
    // Simular consulta ao banco para verificar último post
    // Em implementação real, consultar tabela SocialPost
    const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
    
    // Verificar posts do dia
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Aqui deveria consultar: SELECT COUNT(*) FROM SocialPost WHERE platform = ? AND scheduledAt >= ?
    const postsToday = 0 // Placeholder
    
    if (postsToday >= config.dailyLimit) {
      console.log(`❌ Limite diário atingido para ${platform}: ${postsToday}/${config.dailyLimit}`)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`Erro ao verificar limite de posts para ${platform}:`, error)
    return false
  }
}

// Função principal para gerar os posts
export function generateSocialPosts(blogPost: BlogPost, baseUrl: string = 'https://visa2any.com'): SocialPost[] {
  const socialPosts: SocialPost[] = []
  
  SOCIAL_TEMPLATES.forEach(template => {
    // Adicionar lógica para pular se não puder agendar
    
    const highlights = extractHighlights(blogPost.content).join('\n')
    const url = `${baseUrl}/blog/${blogPost.slug}`
    const categoryEmoji = getCategoryEmoji(blogPost.category)
    const countryAction = getCountryAction(blogPost.country || 'outro')

    let content = template.template
      .replace('{emoji}', categoryEmoji)
      .replace('{title}', blogPost.title)
      .replace('{excerpt}', blogPost.excerpt)
      .replace('{highlights}', highlights)
      .replace('{url}', url)
      .replace('{country_action}', countryAction)
      .replace('{hashtags}', template.hashtags.join(' '))

    // Truncar para o tamanho máximo
    if (content.length > template.maxLength) {
        content = content.substring(0, template.maxLength - 3) + '...'
    }

    const post: SocialPost = {
      platform: template.platform,
      content,
      imageUrl: blogPost.imageUrl,
      hashtags: template.hashtags,
      scheduledAt: calculateOptimalPostTime(template.platform, blogPost.urgent || false)
    }

    if (template.videoRequired) {
      post.videoUrl = generateTikTokVideoScript(blogPost) // Placeholder
    }

    socialPosts.push(post)
  })

  return socialPosts
}

// Agendar posts automaticamente
export async function scheduleAutomaticPosts(blogPost: BlogPost) {
  const posts = generateSocialPosts(blogPost)

  for (const post of posts) {
    if (await canSchedulePost(post.platform)) {
      // Salvar no banco para o CRON processar
      // await saveSocialPostToDB(post)
      console.log(`✅ Post para ${post.platform} agendado para ${post.scheduledAt}`)
    } else {
      console.warn(`⚠️ Post para ${post.platform} não agendado por limite de frequência.`)
    }
  }
}

// Publicar em uma rede social específica
export async function publishToSocialMedia(socialPost: SocialPost) {
  console.log(`🚀 Publicando no ${socialPost.platform}...`)
  
  try {
    switch(socialPost.platform) {
      case 'facebook':
        await publishToFacebook(socialPost)
        break
      case 'instagram':
        await publishToInstagram(socialPost)
        break
      case 'linkedin':
        await publishToLinkedIn(socialPost)
        break
      case 'twitter':
        await publishToTwitter(socialPost)
        break
      case 'tiktok':
        await publishToTikTok(socialPost)
        break
    }
    console.log(`✅ Publicado no ${socialPost.platform} com sucesso!`)
    
    // Marcar como publicado no banco
    // await updateSocialPostStatus(socialPost.id, 'published')
  } catch (error) {
    console.error(`❌ Erro ao publicar no ${socialPost.platform}:`, error)
    // await updateSocialPostStatus(socialPost.id, 'failed')
  }
}

async function publishToFacebook(post: SocialPost) {
  // Simulação de chamada de API
  console.log('Publicando no Facebook:', post.content)
  
  // const facebookApi = new FacebookApi(process.env.FB_ACCESS_TOKEN)
  // await facebookApi.publishPost(post.content, post.imageUrl)
}

async function publishToInstagram(post: SocialPost) {
  // Instagram é mais complexo, pode precisar de API de parceiro
  console.log('Preparando para publicar no Instagram:', post.content)
  
  if (post.videoUrl) {
    console.log('Publicando Reel:', post.videoUrl)
    // const instagramApi = new InstagramApi(...)
    // await instagramApi.publishReel(post.videoUrl, post.content)
  } else if (post.imageUrl) {
    console.log('Publicando imagem:', post.imageUrl)
    // const instagramApi = new InstagramApi(...)
    // await instagramApi.publishImage(post.imageUrl, post.content)
  }
}

async function publishToLinkedIn(post: SocialPost) {
  // Simulação de chamada de API
  console.log('Publicando no LinkedIn:', post.content)

  // const linkedInApi = new LinkedInApi(...)
  // await linkedInApi.publishPost({
  //   text: post.content,
  //   link: post.imageUrl // LinkedIn pode usar imagem como link
  // })
}

async function publishToTwitter(post: SocialPost) {
  // Simulação de chamada de API
  console.log('Publicando no Twitter:', post.content)

  // const twitterApi = new TwitterApi(...)
  // await twitterApi.tweet(post.content)
}

async function publishToTikTok(post: SocialPost) {
  // TikTok requer um vídeo
  if (!post.videoUrl) {
    throw new Error('Publicação no TikTok requer um vídeo.')
  }
  
  console.log('Publicando no TikTok (roteiro):', post.videoUrl)

  // A API do TikTok para postagem direta é restrita.
  // Isso geralmente envolve um fluxo manual ou uma plataforma parceira.
  // Ex: `await tikTokPartnerApi.uploadVideo(post.videoUrl, post.content)`
}

// Função CRON para processar posts agendados
export async function processScheduledPosts() {
  console.log('CRON: Verificando posts para publicar...')
  const now = new Date()

  // Buscar posts no banco com scheduledAt <= now e status = 'scheduled'
  // const postsToPublish = await getPostsFromDB()
  const postsToPublish: SocialPost[] = [] // Placeholder

  for (const post of postsToPublish) {
    await publishToSocialMedia(post)
  }
  
  console.log(`CRON: Processamento finalizado. ${postsToPublish.length} posts publicados.`)
}