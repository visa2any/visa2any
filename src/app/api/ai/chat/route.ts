import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// POST /api/ai/chat - Chat com Sofia IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, clientId, conversationId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar contexto do cliente
    let clientContext = null
    if (clientId) {
      clientContext = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          targetCountry: true,
          visaType: true,
          score: true
        }
      })
    }

    // Processar mensagem com Sofia IA
    const response = await processSofiaMessage(message, clientContext, {
      conversationId: conversationId || generateConversationId(),
      timestamp: new Date().toISOString()
    })

    // Salvar interação se houver cliente
    if (clientId) {
      await prisma.interaction.create({
        data: {
          clientId,
          type: 'AUTOMATED_WHATSAPP',
          channel: 'ai_chat',
          direction: 'outbound',
          content: response.message,
          response: message,
          createdAt: new Date()
        }
      })
    }

    return NextResponse.json({
      response,
      conversationId: response.conversationId
    })

  } catch (error) {
    console.error('Erro no chat AI:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/ai/chat - Buscar histórico de conversa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const clientId = searchParams.get('clientId')

    if (!conversationId && !clientId) {
      return NextResponse.json(
        { error: 'conversationId ou clientId é obrigatório' },
        { status: 400 }
      )
    }

    const where: any = {}
    if (conversationId) where.conversationId = conversationId
    if (clientId) where.clientId = clientId

    const interactions = await prisma.interaction.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 50
    })

    return NextResponse.json({
      interactions,
      conversationId
    })

  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Processar mensagem com Sofia IA
async function processSofiaMessage(message: string, clientContext: any, context: any) {
  const clientName = clientContext?.name || 'Cliente'

  // Detectar intenção da mensagem
  const intent = detectIntent(message)

  // Gerar resposta baseada na intenção
  const response = await generateSofiaResponse(intent, message, clientContext, context)

  return {
    ...response,
    conversationId: context.conversationId,
    intent: intent.type,
    confidence: intent.confidence
  }
}

// Detectar intenção da mensagem
function detectIntent(message: string) {
  const messageLower = message.toLowerCase()
  const intents = getSofiaIntents()

  let bestMatch = { type: 'unknown', confidence: 0 }

  for (const [type, intent] of Object.entries(intents)) {
    // Verificar keywords
    const keywordMatches = intent.keywords.filter(keyword =>
      messageLower.includes(keyword)
    ).length

    // Verificar patterns
    const patternMatches = intent.patterns.filter(pattern => {
      const regex = new RegExp(pattern, 'i')
      return regex.test(message)
    }).length

    const confidence = (keywordMatches * 0.3) + (patternMatches * 0.7)

    if (confidence > bestMatch.confidence) {
      bestMatch = { type, confidence }
    }
  }

  return bestMatch
}

// Gerar resposta da Sofia IA
async function generateSofiaResponse(intent: any, message: string, clientContext: any, context: any) {
  const clientName = clientContext?.name || 'Cliente'
  const country = extractCountryFromMessage(message)

  switch (intent.type) {
    case 'greeting':
      return {
        message: `Olá ${clientName}! 👋 Sou a Sofia, sua assistente virtual especializada em processos de imigração.

🎯 **Como posso te ajudar hoje?**
- 📋 Análise de elegibilidade para vistos
- 📄 Documentos necessários por país
- 💰 Custos e timeline de processos
- 📅 Agendamento de consultorias
- 🤝 Conectar com especialistas humanos

Me conte o que você precisa!`,
        suggestions: [
          'Analisar minha elegibilidade',
          'Ver documentos necessários',
          'Consultar custos',
          'Agendar consultoria',
          'Falar com especialista'
        ],
        actions: []
      }

    case 'eligibility_question':
      if (country) {
        return await getEligibilityResponse(country, clientName, clientContext)
      }
      return {
        message: `Ótima pergunta, ${clientName}! Para analisar sua elegibilidade, preciso de algumas informações:

🌍 **Para qual país você quer imigrar?**
- Canadá
- Austrália
- Portugal
- Estados Unidos
- Reino Unido

📋 **Qual tipo de visto você está considerando?**
- Trabalho qualificado
- Estudo
- Reunião familiar
- Investimento
- Outros

Me conte mais sobre seu objetivo e eu farei uma análise personalizada!`,
        suggestions: [
          'Quero ir para o Canadá',
          'Interessado na Austrália',
          'Portugal para trabalho',
          'Estados Unidos',
          'Falar com consultor'
        ],
        actions: []
      }

    case 'documents_question':
      if (country) {
        return await getDocumentsResponse(country, clientName)
      }
      return {
        message: `Claro, ${clientName}! Para te ajudar com os documentos, preciso saber:

🌍 **Para qual país você está se preparando?**
- Canadá
- Austrália
- Portugal
- Estados Unidos
- Reino Unido

📋 **Qual tipo de visto?**
- Trabalho qualificado
- Estudo
- Reunião familiar
- Investimento

Assim posso te dar a lista exata dos documentos necessários!`,
        suggestions: [
          'Documentos para Canadá',
          'Documentos para Austrália',
          'Documentos para Portugal',
          'Falar com consultor'
        ],
        actions: []
      }

    case 'cost_question':
      return {
        message: `Entendo sua preocupação com os custos, ${clientName}! 💰

Os custos variam muito dependendo do país e tipo de visto:

🇨🇦 **Canadá:**
- Taxa consular: R$ 380
- Serviços: R$ 200-600
- Total: R$ 580-980

🇦🇺 **Austrália:**
- Taxa consular: R$ 650
- Serviços: R$ 200-600
- Total: R$ 850-1.250

🇵🇹 **Portugal:**
- Taxa consular: R$ 480
- Serviços: R$ 150-400
- Total: R$ 630-880

💡 **Dica:** Agende uma consultoria gratuita para um orçamento personalizado baseado no seu perfil!`,
        suggestions: [
          'Agendar consultoria gratuita',
          'Ver mais detalhes dos custos',
          'Falar com consultor',
          'Ver opções de pagamento'
        ],
        actions: [{
          type: 'schedule_consultation',
          label: 'Agendar Consultoria Gratuita'
        }]
      }

    case 'timeline_question':
      return {
        message: `Ótima pergunta sobre prazos, ${clientName}! ⏰

Os prazos variam por país e tipo de visto:

🇨🇦 **Canadá:**
- Express Entry: 6-8 meses
- Provincial: 12-18 meses
- Estudo: 2-4 meses

🇦🇺 **Austrália:**
- Skilled Migration: 8-12 meses
- Student Visa: 2-3 meses
- Partner Visa: 12-18 meses

🇵🇹 **Portugal:**
- D7 (Rendimentos): 6-8 meses
- D2 (Trabalho): 4-6 meses
- Golden Visa: 12-18 meses

📅 **Quer que eu verifique as vagas disponíveis para agendamento?**`,
        suggestions: [
          'Ver vagas disponíveis',
          'Agendar consultoria',
          'Falar com consultor',
          'Ver mais detalhes'
        ],
        actions: [{
          type: 'check_availability',
          label: 'Ver Vagas Disponíveis'
        }]
      }

    case 'contact_human':
      return {
        message: `Perfeito, ${clientName}! 🤝 Entendo que você quer falar com um especialista humano.

📞 **Opções de contato:**
- **WhatsApp:** +55 11 5197-1375
- **Telefone:** +55 11 5197-1375
- **Email:** visa2any@gmail.com

⏰ **Horário de atendimento:**
- Segunda a Sexta: 9h às 18h
- Sábado: 9h às 14h

💡 **Dica:** Se for urgente, posso escalar para um consultor agora mesmo!`,
        suggestions: [
          'Falar agora mesmo',
          'Agendar horário',
          'Enviar WhatsApp',
          'Enviar email'
        ],
        actions: [{
          type: 'escalate_to_human',
          label: 'Falar Agora Mesmo'
        }]
      }

    case 'complaint':
      return {
        message: `Sinto muito pelo problema, ${clientName}! 😔 

Vou escalar isso imediatamente para nossa equipe de suporte.

🚨 **Escalado para:**
- Gerente de Atendimento
- Equipe Técnica (se aplicável)
- Consultor Sênior

📞 **Contato direto:**
- WhatsApp: +55 11 5197-1375
- Email: visa2any@gmail.com

💡 **Enquanto isso:**
Pode me dar mais detalhes sobre o problema? Assim posso já adiantar a solução.`,
        suggestions: [
          'Problema com documento',
          'Demora no atendimento',
          'Cobrança indevida',
          'Falar com gerente'
        ],
        actions: [{
          type: 'escalate_complaint',
          label: 'Falar com Gerente Agora'
        }]
      }

    default:
      return {
        message: `Entendi ${clientName}! Embora eu não tenha certeza total sobre isso, posso te ajudar com:

🎯 **Especialidades da Sofia:**
- ✅ Análise de elegibilidade para vistos
- ✅ Documentos necessários por país  
- ✅ Custos e timeline de processos
- ✅ Agendamento de consultorias
- ✅ Conectar com especialistas humanos

📝 **Sua pergunta:** "${message}"

Posso reformular isso para uma dessas áreas? Ou prefere falar diretamente com um especialista humano?`,
        suggestions: [
          'Analisar elegibilidade',
          'Ver documentos necessários',
          'Consultar custos',
          'Falar com especialista'
        ],
        actions: []
      }
  }
}

// Obter resposta sobre documentos por país
async function getDocumentsResponse(country: string, clientName: string) {
  const countryLower = country.toLowerCase()

  const requirements = await prisma.visaRequirement.findFirst({
    where: {
      country: { contains: countryLower },
      isActive: true
    }
  })

  if (requirements && requirements.requiredDocuments) {
    const docs = requirements.requiredDocuments as any[];
    const docList = docs.map(doc => `- ${doc.name} (${doc.required ? 'Obrigatório' : 'Opcional'})`).join('\n');

    return {
      message: `Olá ${clientName}! Para o visto de ${country}, os documentos essenciais são:\n\n${docList}\n\nLembre-se que esta é uma lista geral. Dependendo do seu perfil, outros documentos podem ser necessários.\n\nQuer que eu verifique se você já enviou algum desses?`,
      suggestions: [
        'Verificar meus documentos',
        'O que é uma "prova de fundos"?',
        'Preciso de tradução juramentada?',
        'Falar com um consultor'
      ],
      actions: [{
        type: 'check_my_documents',
        label: 'Verificar Meus Documentos'
      }]
    }
  }

  const genericDocs = getGenericDocuments(country)
  return {
    message: `Olá ${clientName}! Não encontrei uma lista de documentos específica para ${country} no momento.\n\nNo entanto, aqui estão os documentos geralmente necessários para processos de visto:\n\n${genericDocs}\n\nRecomendo fortemente falar com um de nossos consultores para obter a lista exata para o seu caso.`,
    suggestions: [
      'Agendar com consultor',
      'Quais são os custos?',
      'Quanto tempo demora?'
    ],
    actions: [{
      type: 'schedule_consultation',
      label: 'Agendar com Consultor'
    }]
  }
}

// Obter resposta sobre elegibilidade
async function getEligibilityResponse(country: string, clientName: string, clientContext: any) {
  const score = clientContext?.score || 0

  let message = `Olá ${clientName}! Vou analisar sua elegibilidade para ${country}.\n\n`

  if (score >= 70) {
    message += `🎉 **Excelente!** Sua pontuação atual é ${score}/100\n\nVocê tem grandes chances de aprovação! Recomendo iniciar o processo o quanto antes.`
  } else if (score >= 50) {
    message += `👍 **Boa!** Sua pontuação atual é ${score}/100\n\nVocê tem chances, mas podemos melhorar seu perfil com algumas estratégias.`
  } else {
    message += `⚠️ **Atenção!** Sua pontuação atual é ${score}/100\n\nPrecisamos trabalhar para melhorar seu perfil. Mas não desanime, temos estratégias específicas!`
  }

  message += `\n\n💡 **Próximos passos:**\n- Agendar consultoria personalizada\n- Analisar pontos de melhoria\n- Criar estratégia de aplicação`

  return {
    message,
    suggestions: [
      'Agendar consultoria',
      'Ver pontos de melhoria',
      'Falar com especialista',
      'Ver custos'
    ],
    actions: [{
      type: 'schedule_consultation',
      label: 'Agendar Consultoria'
    }]
  }
}

// Documentos genéricos por país
function getGenericDocuments(country: string): string {
  const genericDocs: { [key: string]: string } = {
    'canadá': `- Passaporte válido
- Diploma universitário + histórico
- Comprovante de experiência profissional
- Teste de inglês (IELTS/CELPIP)
- Exame médico
- Antecedentes criminais
- Comprovante financeiro`,

    'austrália': `- Passaporte válido
- Skills Assessment da sua profissão
- Teste de inglês (IELTS)
- Qualificações educacionais
- Experiência profissional
- Exame médico
- Antecedentes criminais`,

    'portugal': `- Passaporte válido
- Comprovativo de rendimentos
- Atestado médico
- Registo criminal
- Comprovativo de alojamento
- Seguro de saúde`,

    'estados unidos': `- Passaporte válido
- Formulários específicos (I-140, etc)
- Evidências de habilidade extraordinária
- Cartas de recomendação
- Histórico profissional detalhado`
  }

  return genericDocs[country] || `- Passaporte válido
- Documentos educacionais
- Experiência profissional
- Antecedentes criminais
- Comprovante financeiro`
}

// Extrair país da mensagem
function extractCountryFromMessage(message: string): string | null {
  const countries = ['canadá', 'canada', 'austrália', 'australia', 'portugal', 'estados unidos', 'eua', 'usa']
  const messageLower = message.toLowerCase()

  for (const country of countries) {
    if (messageLower.includes(country)) {
      return country === 'canada' ? 'canadá' :
        country === 'australia' ? 'austrália' :
          country === 'eua' || country === 'usa' ? 'estados unidos' :
            country
    }
  }

  return null
}

// Mapear status para label
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'LEAD': 'Interessado',
    'QUALIFIED': 'Qualificado',
    'CONSULTATION_SCHEDULED': 'Consulta Agendada',
    'IN_PROCESS': 'Em Processo',
    'DOCUMENTS_PENDING': 'Docs Pendentes',
    'SUBMITTED': 'Submetido',
    'APPROVED': 'Aprovado',
    'COMPLETED': 'Concluído'
  }

  return labels[status] || status
}

// Gerar ID de conversa
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Intenções da Sofia IA
function getSofiaIntents() {
  return {
    greeting: {
      keywords: ['olá', 'oi', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'],
      patterns: ['^(olá|oi|hello|hi)']
    },

    eligibility_question: {
      keywords: ['elegibilidade', 'elegível', 'posso', 'consigo', 'chances', 'probabilidade', 'qualificado'],
      patterns: ['posso.*visto', 'consigo.*imigrar', 'tenho.*chances']
    },

    documents_question: {
      keywords: ['documentos', 'papéis', 'preciso', 'necessário', 'documentação'],
      patterns: ['que documentos', 'preciso.*documento', 'documentos.*necessário']
    },

    cost_question: {
      keywords: ['custa', 'preço', 'valor', 'quanto', 'custo', 'investimento', 'taxa'],
      patterns: ['quanto.*custa', 'qual.*preço', 'valor.*processo']
    },

    timeline_question: {
      keywords: ['tempo', 'demora', 'duração', 'prazo', 'quanto tempo', 'timeline'],
      patterns: ['quanto.*tempo', 'tempo.*demora', 'prazo.*processo']
    },

    contact_human: {
      keywords: ['humano', 'pessoa', 'especialista', 'consultor', 'atendente', 'falar'],
      patterns: ['falar.*humano', 'pessoa.*real', 'especialista.*humano']
    },

    complaint: {
      keywords: ['problema', 'reclamação', 'erro', 'ruim', 'insatisfeito', 'demora', 'lento'],
      patterns: ['tenho.*problema', 'não.*funcionando', 'muito.*demora']
    }
  }
} 