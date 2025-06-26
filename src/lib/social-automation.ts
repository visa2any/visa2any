import { BlogPost } from '@/types/blog'

interface SocialPost {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'
  content: string
  imageUrl?: string
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
    template: `🚨 {emoji} {title}

{excerpt}

📋 Principais pontos:
{highlights}

👉 Leia o artigo completo: {url}

#Visa2Any {hashtags}`,
    maxLength: 2000,
    hashtags: ['#Imigração', '#Visto', '#Brasil', '#Consultoria']
  },
  {
    platform: 'instagram',
    template: `{emoji} {title}

{excerpt}

📱 Swipe para ver mais detalhes
👆 Link no perfil para artigo completo

{hashtags}`,
    maxLength: 2200,
    hashtags: ['#visa2any', '#imigração', '#visto', '#brasil', '#consultoria', '#internacional', '#mudança']
  },
  {
    platform: 'linkedin',
    template: `{title}

{excerpt}

Como especialistas em imigração, observamos que:
{highlights}

💡 Nossa experiência mostra que clientes preparados têm 91.2% de taxa de aprovação.

🔗 Artigo completo: {url}

{hashtags}`,
    maxLength: 3000,
    hashtags: ['#Imigração', '#VistoAmericano', '#ExpressEntry', '#Consultoria', '#Visa2Any']
  },
  {
    platform: 'twitter',
    template: `{emoji} {title}

{excerpt}

🔗 {url}

{hashtags}`,
    maxLength: 280,
    hashtags: ['#Visa2Any', '#Imigração', '#Visto']
  },
  {
    platform: 'tiktok',
    template: `{emoji} {title}

{excerpt}

🎯 DICA IMPORTANTE para quem quer {country_action}!

📱 Siga @visa2any para mais dicas
🔗 Link na bio para artigo completo

{hashtags}`,
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
  
  // Se não encontrou highlights suficientes
 usar pontos genéricos
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
  
  // Se é urgente
 agenda para os próximos minutos respeitando intervalo mínimo
  if (isUrgent) {
    const urgentDelay = Math.max(config.minInterval / 4, 15 * 60 * 1000) // Mín 15 min
    return new Date(now.getTime() + urgentDelay)
  }
  
  // Buscar próximo horário ótimo
  const currentHour = now.getHours()
  const optimalTimes = config.optimalTimes
  
  // Encontrar próximo horário ótimo hoje
  const nextOptimalToday = optimalTimes.find(hour => hour > currentHour)
  
  if (nextOptimalToday) {
    const nextTime = new Date(now)
    nextTime.setHours(nextOptimalToday, 0, 0, 0)
    return nextTime
  }
  
  // Se não há mais horários hoje
 usar primeiro horário de amanhã
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(optimalTimes[0], 0, 0, 0)
  
  return tomorrow
}

// Função para verificar se pode postar (anti-spam)
async function canSchedulePost(platform: string): Promise<boolean> {
  try {
    // Simular consulta ao banco para verificar último post
    // Em implementação real
 consultar tabela SocialPost
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

// Função principal para gerar posts nas redes sociais
export function generateSocialPosts(blogPost: BlogPost, baseUrl: string = 'https://visa2any.com'): SocialPost[] {
  const posts: SocialPost[] = []
  const url = `${baseUrl}/blog/${blogPost.slug || blogPost.id}`
  const emoji = getCategoryEmoji(blogPost.category)
  const highlights = extractHighlights(blogPost.content)
  
  for (const template of SOCIAL_TEMPLATES) {
    // Truncar título se necessário
    let title = blogPost.title
    if (template.platform === 'twitter' && title.length > 100) {
      title = title.substring(0, 97) + '...'
    }
    
    // Truncar excerpt se necessário
    let excerpt = blogPost.excerpt
    const baseLength = template.template.length + title.length + url.length + 100 // margem
    const availableLength = template.maxLength - baseLength
    
    if (excerpt.length > availableLength) {
      excerpt = excerpt.substring(0, availableLength - 3) + '...'
    }
    
    // Substituir variáveis no template
    let content = template.template
      .replace('{emoji}', emoji)
      .replace('{title}', title)
      .replace('{excerpt}', excerpt)
      .replace('{highlights}', highlights.join('\n'))
      .replace('{url}', url)
      .replace('{country_action}', getCountryAction(blogPost.country || ''))
      .replace('{hashtags}', template.hashtags.join(' '))
    
    // Adicionar hashtags específicas do post
    const postHashtags = [...template.hashtags]
    if (blogPost.country) {
      postHashtags.push(`#${blogPost.country.replace(' ', '')}`)
    }
    if (blogPost.tags) {
      blogPost.tags.forEach(tag => {
        postHashtags.push(`#${tag.replace(' ', '').replace('/', '')}`)
      })
    }
    
    // Calcular horário otimizado baseado na plataforma
    const scheduledAt = calculateOptimalPostTime(template.platform, blogPost.urgent)
    
    posts.push({
      platform: template.platform,
      content: content.substring(0, template.maxLength),
      imageUrl: blogPost.imageUrl,
      hashtags: [...new Set(postHashtags)], // Remove duplicatas
      scheduledAt
    })
  }
  
  return posts
}

// Função para agendar posts automaticamente com controle de frequência
export async function scheduleAutomaticPosts(blogPost: BlogPost) {
  try {
    const socialPosts = generateSocialPosts(blogPost)
    
    for (const post of socialPosts) {
      // Verificar se pode agendar post (anti-spam)
      const canSchedule = await canSchedulePost(post.platform)
      
      if (!canSchedule) {
        console.log(`⏭️ Pulando ${post.platform}: limite de frequência atingido`)
        continue
      }
      
      // Salvar no banco de dados para processamento posterior
      await fetch('/api/social/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogPostId: blogPost.id,
          platform: post.platform,
          content: post.content,
          imageUrl: post.imageUrl,
          hashtags: post.hashtags,
          scheduledAt: post.scheduledAt,
          status: 'scheduled'
        })
      })
      
      console.log(`📅 ${post.platform}: agendado para ${post.scheduledAt?.toLocaleString('pt-BR')}`)
    }
    
    console.log(`📱 Posts agendados para ${socialPosts.length} redes sociais`)
    
  } catch (error) {
    console.error('Erro ao agendar posts automáticos:', error)
  }
}

// Função para publicar imediatamente nas redes sociais
export async function publishToSocialMedia(socialPost: SocialPost) {
  try {
    switch (socialPost.platform) {
      case 'facebook':
        return await publishToFacebook(socialPost)
      case 'instagram':
        return await publishToInstagram(socialPost)
      case 'linkedin':
        return await publishToLinkedIn(socialPost)
      case 'twitter':
        return await publishToTwitter(socialPost)
      case 'tiktok':
        return await publishToTikTok(socialPost)
      default:
        throw new Error(`Plataforma não suportada: ${socialPost.platform}`)
    }
  } catch (error) {
    console.error(`Erro ao publicar no ${socialPost.platform}:`, error)
    throw error
  }
}

// Implementações específicas para cada plataforma
async function publishToFacebook(post: SocialPost) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID
  
  const response = await fetch(`https://graph.facebook.com/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: post.content,
      url: post.imageUrl,
      access_token: accessToken
    })
  })
  
  return response.json()
}

async function publishToInstagram(post: SocialPost) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID
  
  // Instagram requer processo em 2 etapas: criar container
 depois publicar
  const containerResponse = await fetch(`https://graph.facebook.com/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: post.imageUrl,
      caption: post.content,
      access_token: accessToken
    })
  })
  
  const container = await containerResponse.json()
  
  // Publicar o container
  const publishResponse = await fetch(`https://graph.facebook.com/${accountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: container.id,
      access_token: accessToken
    })
  })
  
  return publishResponse.json()
}

async function publishToLinkedIn(post: SocialPost) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  const authorId = process.env.LINKEDIN_AUTHOR_ID
  
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author: `urn:li:person:${authorId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post.content
          },
          shareMediaCategory: 'IMAGE',
          media: [{
            status: 'READY',
            media: post.imageUrl
          }]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  })
  
  return response.json()
}

async function publishToTwitter(post: SocialPost) {
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET
  
  // Para Twitter
 você precisaria usar a biblioteca twitter-api-v2 ou similar
  // Aqui está um exemplo conceitual
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: post.content,
      media: post.imageUrl ? { media_ids: [post.imageUrl] } : undefined
    })
  })
  
  return response.json()
}

async function publishToTikTok(post: SocialPost) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN
  
  // TikTok Business API para upload de vídeo
  const response = await fetch('https://open-api.tiktok.com/share/video/upload/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      video_url: post.videoUrl || post.imageUrl, // URL do vídeo ou imagem para conversão
      text: post.content,
      privacy_level: 'PUBLIC_TO_EVERYONE',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      brand_content_toggle: false
    })
  })
  
  return response.json()
}

// Função para processar posts agendados (seria chamada por um cron job)
export async function processScheduledPosts() {
  try {
    const response = await fetch('/api/social/pending')
    const pendingPosts = await response.json()
    
    for (const scheduledPost of pendingPosts) {
      if (new Date(scheduledPost.scheduledAt) <= new Date()) {
        try {
          await publishToSocialMedia(scheduledPost)
          
          // Marcar como publicado
          await fetch(`/api/social/${scheduledPost.id}/complete`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'published' })
          })
          
        } catch (error) {
          // Marcar como erro
          await fetch(`/api/social/${scheduledPost.id}/error`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: 'error', 
              error: error.message 
            })
          })
        }
      }
    }
    
  } catch (error) {
    console.error('Erro ao processar posts agendados:', error)
  }
}