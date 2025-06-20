// Versão simplificada do Sofia Chatbot para deploy no Vercel
// OpenAI temporariamente desabilitado

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

// Analisar sentimento e tipo do comentário (versão simplificada)
export async function analyzeComment(comment: Comment): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral' | 'question'
  needsResponse: boolean
  urgency: 'high' | 'medium' | 'low'
  category: string
}> {
  // Análise básica baseada em palavras-chave
  const content = comment.content.toLowerCase()
  
  let sentiment: 'positive' | 'negative' | 'neutral' | 'question' = 'neutral'
  let category = 'outro'
  
  if (content.includes('?') || content.includes('como') || content.includes('quando')) {
    sentiment = 'question'
    category = 'pergunta_visto'
  } else if (content.includes('obrigad') || content.includes('parabens') || content.includes('excelente')) {
    sentiment = 'positive'
    category = 'elogio'
  } else if (content.includes('problema') || content.includes('ruim') || content.includes('negado')) {
    sentiment = 'negative'
    category = 'reclamacao'
  }
  
  return {
    sentiment,
    needsResponse: sentiment === 'question' || sentiment === 'negative',
    urgency: sentiment === 'negative' ? 'high' : 'medium',
    category
  }
}

// Gerar resposta da Sofia (versão simplificada)
export async function generateSofiaResponse(
  comment: Comment, 
  postContext: string,
  analysisResult: any
): Promise<SofiaResponse> {
  
  // Respostas pré-definidas baseadas no tipo de comentário
  const responses = {
    question: "Olá! 👋 Obrigada pelo seu interesse! Para uma resposta mais detalhada sobre seu caso específico, recomendo agendar nossa consultoria gratuita. Nossa equipe pode te orientar melhor! 🌟 Link: visa2any.com",
    positive: "Muito obrigada pelo carinho! 💙 Ficamos felizes em poder ajudar em sua jornada de imigração. Conte sempre conosco! ✈️",
    negative: "Olá! Lamentamos qualquer dificuldade. Nossa equipe está aqui para te ajudar a resolver qualquer questão. Entre em contato conosco diretamente! 💪",
    neutral: "Olá! 👋 Obrigada pelo comentário! Se tiver alguma dúvida sobre imigração, estamos aqui para ajudar. Acesse nossos materiais gratuitos! 📚"
  }
  
  const content = responses[analysisResult.sentiment] || responses.neutral
  
  return {
    content,
    shouldReply: analysisResult.needsResponse,
    escalateToHuman: analysisResult.urgency === 'high',
    tone: 'friendly',
    includesCTA: true
  }
}

// Sistema de comentários automatizados (versão simplificada)
export async function processComments(comments: Comment[]): Promise<{
  responses: { commentId: string; response: SofiaResponse }[]
  analytics: {
    totalComments: number
    questionsCount: number
    positiveCount: number
    needsResponseCount: number
  }
}> {
  
  const responses = []
  let questionsCount = 0
  let positiveCount = 0
  let needsResponseCount = 0
  
  for (const comment of comments) {
    const analysis = await analyzeComment(comment)
    
    if (analysis.sentiment === 'question') questionsCount++
    if (analysis.sentiment === 'positive') positiveCount++
    if (analysis.needsResponse) needsResponseCount++
    
    if (analysis.needsResponse) {
      const response = await generateSofiaResponse(comment, '', analysis)
      responses.push({ commentId: comment.id, response })
    }
  }
  
  return {
    responses,
    analytics: {
      totalComments: comments.length,
      questionsCount,
      positiveCount,
      needsResponseCount
    }
  }
}

// Sistema de postagens automáticas (versão simplificada)
export async function generateBlogPost(topic: string): Promise<{
  title: string
  content: string
  tags: string[]
  cta: string
}> {
  
  // Templates pré-definidos
  const templates = {
    'visto-americano': {
      title: '🇺🇸 Guia Completo: Como Conseguir Visto Americano em 2024',
      content: 'Conseguir um visto americano pode parecer complexo, mas com a preparação correta, suas chances aumentam significativamente...',
      tags: ['visto-americano', 'turismo', 'B1-B2'],
      cta: 'Quer aumentar suas chances? Faça nossa análise gratuita!'
    },
    'express-entry': {
      title: '🇨🇦 Express Entry 2024: Seu Caminho para o Canadá',
      content: 'O Express Entry é o principal programa de imigração do Canadá. Descubra como funciona e como você pode se qualificar...',
      tags: ['canada', 'express-entry', 'residencia-permanente'],
      cta: 'Calcule sua pontuação CRS gratuitamente!'
    }
  }
  
  return templates[topic] || templates['visto-americano']
}

// Função alias para compatibilidade com código existente
export const processSocialComments = processComments

console.log('🤖 Sofia Chatbot (Versão Simplificada) carregado com sucesso!')