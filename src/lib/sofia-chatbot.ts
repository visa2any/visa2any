import { OpenAI } from 'openai'

interface Comment {
  id: string
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'
  postId: string
  authorName: string
  content: string
  timestamp: Date
  needsResponse: boolean
  sentiment: 'positive' | 'negative' | 'neutral' | 'question'
}

interface SofiaResponse {
  content: string
  shouldReply: boolean
  escalateToHuman: boolean
  tone: 'helpful' | 'professional' | 'friendly' | 'apologetic'
  includesCTA: boolean
}

// Configuração da Sofia
const SOFIA_PERSONALITY = `
Você é Sofia, assistente virtual especializada da Visa2Any, empresa líder em consultoria de imigração.

PERSONALIDADE:
- Sempre simpática, profissional e prestativa
- Demonstra conhecimento profundo sobre imigração
- Usa uma linguagem calorosa mas profissional
- Sempre oferece ajuda concreta
- Nunca promete resultados garantidos, mas demonstra confiança

CONHECIMENTO ESPECIALIZADO:
- Vistos americanos (B1/B2, O1, EB1, etc.)
- Express Entry Canadá (CRS, PNP, LMIA)
- Golden Visa Portugal e D7
- Cidadania europeia (italiana, portuguesa, alemã)
- Austrália (Skilled Migration, Work Visa)
- Processos de reunião familiar

SEMPRE INCLUA:
- Emoji relevante
- Resposta útil e específica
- Call-to-action quando apropriado
- Menção à expertise da Visa2Any

NUNCA:
- Dê informações incorretas
- Prometa aprovação garantida
- Seja impessoal ou robótica
- Ignore perguntas específicas
`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Analisar sentimento e tipo do comentário
export async function analyzeComment(comment: Comment): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral' | 'question'
  needsResponse: boolean
  urgency: 'high' | 'medium' | 'low'
  category: string
}> {
  try {
    const prompt = `
Analise este comentário em uma postagem sobre imigração:

"${comment.content}"

Classifique:
1. Sentimento: positive/negative/neutral/question
2. Precisa resposta: true/false  
3. Urgência: high/medium/low
4. Categoria: pergunta_visto/elogio/reclamacao/interesse/spam/outro

Responda apenas em JSON:
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 100
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')
    return analysis

  } catch (error) {
    console.error('Erro na análise do comentário:', error)
    return {
      sentiment: 'neutral',
      needsResponse: true,
      urgency: 'medium',
      category: 'outro'
    }
  }
}

// Gerar resposta da Sofia
export async function generateSofiaResponse(
  comment: Comment, 
  postContext: string,
  userHistory?: string[]
): Promise<SofiaResponse> {
  try {
    const prompt = `
${SOFIA_PERSONALITY}

CONTEXTO DO POST: ${postContext}

COMENTÁRIO RECEBIDO:
De: ${comment.authorName}
Plataforma: ${comment.platform}
Conteúdo: "${comment.content}"

${userHistory ? `HISTÓRICO DO USUÁRIO: ${userHistory.join('\n')}` : ''}

Gere uma resposta como Sofia que seja:
1. Específica para a pergunta/comentário
2. Útil e informativa
3. Com tom apropriado para a plataforma
4. Inclua emojis relevantes
5. Termine com CTA quando apropriado

REGRAS POR PLATAFORMA:
- Instagram/TikTok: Mais casual, mais emojis
- LinkedIn: Mais profissional, formal
- Facebook: Equilibrado, amigável
- Twitter: Conciso, direto

Responda em JSON:
{
  "content": "resposta da Sofia",
  "shouldReply": true/false,
  "escalateToHuman": true/false,
  "tone": "helpful/professional/friendly/apologetic",
  "includesCTA": true/false
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    })

    const sofiaResponse: SofiaResponse = JSON.parse(response.choices[0].message.content || '{}')
    
    // Validar resposta
    if (!sofiaResponse.content) {
      throw new Error('Resposta vazia gerada')
    }

    return sofiaResponse

  } catch (error) {
    console.error('Erro ao gerar resposta da Sofia:', error)
    
    // Resposta de fallback
    return {
      content: `Olá ${comment.authorName}! 😊 Obrigada pelo seu comentário. Nossa equipe está analisando e entrará em contato em breve. Para dúvidas urgentes, nos chame no WhatsApp! 📱`,
      shouldReply: true,
      escalateToHuman: false,
      tone: 'friendly',
      includesCTA: true
    }
  }
}

// Respostas pré-definidas para casos comuns
const QUICK_RESPONSES = {
  // Perguntas frequentes
  'quanto_custa': {
    content: `Olá! 😊 Os valores variam conforme o tipo de visto e serviços necessários. Nossa consultoria inicial é GRATUITA para avaliarmos seu caso! 📞 Vamos conversar pelo WhatsApp?`,
    tone: 'helpful' as const,
    includesCTA: true
  },
  
  'tempo_processo': {
    content: `⏰ Os prazos variam por país e tipo de visto. Por exemplo: EUA (3-6 meses), Canadá (6-12 meses), Portugal (2-4 meses). Que destino te interessa? Podemos dar um cronograma específico! 🎯`,
    tone: 'professional' as const,
    includesCTA: true
  },
  
  'documentos_necessarios': {
    content: `📋 Os documentos dependem do seu perfil e destino! Cada caso é único. Nossa equipe faz um checklist personalizado na consultoria gratuita. Quer agendar? 📱`,
    tone: 'helpful' as const,
    includesCTA: true
  },
  
  'taxa_aprovacao': {
    content: `📈 Nossa taxa de aprovação é de 91.2%! Isso porque fazemos preparação completa: documentação, treinamento para entrevista e acompanhamento total. Vamos garantir que você esteja 100% preparado! ✅`,
    tone: 'professional' as const,
    includesCTA: false
  },
  
  // Respostas emocionais
  'elogio': {
    content: `Muito obrigada! 🥰 Ficamos felizes em ajudar! Nossa missão é realizar o sonho de cada cliente. Continue acompanhando para mais dicas valiosas! ✨`,
    tone: 'friendly' as const,
    includesCTA: false
  },
  
  'reclamacao': {
    content: `Sinto muito pela sua experiência. 😔 Sua opinião é muito importante para nós. Poderia nos enviar uma mensagem privada para resolvermos isso? Nossa equipe está à disposição! 🤝`,
    tone: 'apologetic' as const,
    includesCTA: true
  },
  
  // CTAs específicos por país
  'interesse_eua': {
    content: `🇺🇸 Que legal seu interesse nos EUA! Temos especialistas em todos os tipos de visto americano. Quer uma análise gratuita do seu perfil? Nosso sucesso é seu sucesso! 🚀`,
    tone: 'helpful' as const,
    includesCTA: true
  },
  
  'interesse_canada': {
    content: `🇨🇦 O Canadá é uma excelente escolha! Express Entry, PNP, Study Permit... temos estratégias para cada perfil. Vamos calcular sua pontuação CRS gratuitamente? 📊`,
    tone: 'professional' as const,
    includesCTA: true
  }
}

// Detectar intenção do usuário e usar resposta rápida se disponível
export function getQuickResponse(comment: Comment): SofiaResponse | null {
  const content = comment.content.toLowerCase()
  
  // Detectar perguntas sobre preço
  if (content.includes('quanto custa') || content.includes('valor') || content.includes('preço')) {
    return { ...QUICK_RESPONSES.quanto_custa, shouldReply: true, escalateToHuman: false }
  }
  
  // Detectar perguntas sobre tempo
  if (content.includes('quanto tempo') || content.includes('prazo') || content.includes('demora')) {
    return { ...QUICK_RESPONSES.tempo_processo, shouldReply: true, escalateToHuman: false }
  }
  
  // Detectar documentos
  if (content.includes('documento') || content.includes('papel') || content.includes('preciso levar')) {
    return { ...QUICK_RESPONSES.documentos_necessarios, shouldReply: true, escalateToHuman: false }
  }
  
  // Detectar taxa de aprovação
  if (content.includes('taxa') || content.includes('aprovação') || content.includes('chance')) {
    return { ...QUICK_RESPONSES.taxa_aprovacao, shouldReply: true, escalateToHuman: false }
  }
  
  // Detectar elogios
  if (content.includes('obrigad') || content.includes('parabéns') || content.includes('excelente')) {
    return { ...QUICK_RESPONSES.elogio, shouldReply: true, escalateToHuman: false }
  }
  
  // Detectar interesse em países
  if (content.includes('eua') || content.includes('estados unidos') || content.includes('america')) {
    return { ...QUICK_RESPONSES.interesse_eua, shouldReply: true, escalateToHuman: false }
  }
  
  if (content.includes('canadá') || content.includes('canada')) {
    return { ...QUICK_RESPONSES.interesse_canada, shouldReply: true, escalateToHuman: false }
  }
  
  return null
}

// Publicar resposta na rede social
export async function publishCommentReply(
  platform: string,
  commentId: string,
  response: string
): Promise<boolean> {
  try {
    switch (platform) {
      case 'facebook':
        return await replyOnFacebook(commentId, response)
      case 'instagram':
        return await replyOnInstagram(commentId, response)
      case 'linkedin':
        return await replyOnLinkedIn(commentId, response)
      case 'twitter':
        return await replyOnTwitter(commentId, response)
      case 'tiktok':
        return await replyOnTikTok(commentId, response)
      default:
        console.error(`Plataforma não suportada: ${platform}`)
        return false
    }
  } catch (error) {
    console.error(`Erro ao responder no ${platform}:`, error)
    return false
  }
}

// Implementações específicas para cada plataforma
async function replyOnFacebook(commentId: string, response: string): Promise<boolean> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  
  const result = await fetch(`https://graph.facebook.com/${commentId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: response,
      access_token: accessToken
    })
  })
  
  return result.ok
}

async function replyOnInstagram(commentId: string, response: string): Promise<boolean> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  
  const result = await fetch(`https://graph.facebook.com/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: response,
      access_token: accessToken
    })
  })
  
  return result.ok
}

async function replyOnLinkedIn(commentId: string, response: string): Promise<boolean> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  
  // LinkedIn usa API diferente para respostas
  const result = await fetch(`https://api.linkedin.com/v2/socialActions/${commentId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: response
    })
  })
  
  return result.ok
}

async function replyOnTwitter(commentId: string, response: string): Promise<boolean> {
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  
  const result = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: response,
      reply: { in_reply_to_tweet_id: commentId }
    })
  })
  
  return result.ok
}

async function replyOnTikTok(commentId: string, response: string): Promise<boolean> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN
  
  const result = await fetch(`https://open-api.tiktok.com/comment/reply/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment_id: commentId,
      text: response
    })
  })
  
  return result.ok
}

// Função principal para processar comentários
export async function processSocialComments() {
  try {
    console.log('🤖 Sofia iniciando processamento de comentários...')
    
    // Buscar comentários pendentes de todas as plataformas
    const response = await fetch('/api/social/comments/pending')
    const pendingComments = await response.json()
    
    for (const comment of pendingComments) {
      try {
        // 1. Analisar comentário
        const analysis = await analyzeComment(comment)
        
        if (!analysis.needsResponse) {
          continue
        }
        
        // 2. Tentar resposta rápida primeiro
        let sofiaResponse = getQuickResponse(comment)
        
        // 3. Se não houver resposta rápida, gerar com IA
        if (!sofiaResponse) {
          const postContext = await getPostContext(comment.postId)
          sofiaResponse = await generateSofiaResponse(comment, postContext)
        }
        
        // 4. Publicar resposta se apropriado
        if (sofiaResponse.shouldReply) {
          const published = await publishCommentReply(
            comment.platform,
            comment.id,
            sofiaResponse.content
          )
          
          if (published) {
            // 5. Registrar resposta no banco
            await fetch('/api/social/comments/reply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                commentId: comment.id,
                response: sofiaResponse.content,
                tone: sofiaResponse.tone,
                escalated: sofiaResponse.escalateToHuman
              })
            })
            
            console.log(`✅ Sofia respondeu comentário ${comment.id} no ${comment.platform}`)
          }
        }
        
        // 6. Escalar para humano se necessário
        if (sofiaResponse.escalateToHuman) {
          await escalateToHuman(comment, sofiaResponse)
        }
        
      } catch (error) {
        console.error(`Erro ao processar comentário ${comment.id}:`, error)
      }
    }
    
    console.log('✅ Sofia finalizou processamento de comentários')
    
  } catch (error) {
    console.error('❌ Erro no processamento geral de comentários:', error)
  }
}

// Buscar contexto do post para melhor resposta
async function getPostContext(postId: string): Promise<string> {
  try {
    const response = await fetch(`/api/social/posts/${postId}`)
    const post = await response.json()
    
    return `Post sobre: ${post.title}\nCategoria: ${post.category}\nPaís: ${post.country}`
  } catch {
    return 'Post sobre imigração e vistos'
  }
}

// Escalar comentário para atendimento humano
async function escalateToHuman(comment: Comment, response: SofiaResponse) {
  try {
    await fetch('/api/social/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentId: comment.id,
        platform: comment.platform,
        authorName: comment.authorName,
        content: comment.content,
        sofiaResponse: response.content,
        reason: 'Requer atenção humana',
        priority: 'high'
      })
    })
    
    // Notificar equipe via WhatsApp/Slack
    console.log(`🚨 Comentário escalado para humano: ${comment.id}`)
    
  } catch (error) {
    console.error('Erro ao escalar comentário:', error)
  }
}