import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para mensagem do chat
const chatMessageSchema = z.object({
  message: z.string().min(1, 'Mensagem é obrigatória'),
  clientId: z.string().optional(),
  conversationId: z.string().optional(),
  context: z.object({
    targetCountry: z.string().optional(),
    visaType: z.string().optional(),
    currentStep: z.string().optional()
  }).optional()
})

// POST /api/ai/chat - Conversar com Sofia IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = chatMessageSchema.parse(body)

    // Obter contexto do cliente se disponível
    let clientContext = null
    if (validatedData.clientId) {
      clientContext = await prisma.client.findUnique({
        where: { id: validatedData.clientId },
        include: {
          consultations: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          documents: {
            select: { type: true, status: true }
          }
        }
      })
    }

    // Processar mensagem com Sofia IA
    const sofiaResponse = await processSofiaMessage(
      validatedData.message,
      clientContext,
      validatedData.context
    )

    // Salvar interação se tem cliente
    if (validatedData.clientId) {
      await prisma.interaction.create({
        data: {
          type: 'AUTOMATED_EMAIL',
          channel: 'chat',
          direction: 'inbound',
          content: validatedData.message,
          response: sofiaResponse.message,
          clientId: validatedData.clientId,
          completedAt: new Date()
        }
      })
    }

    // Log da conversa
    await prisma.automationLog.create({
      data: {
        type: 'AI_CHAT_INTERACTION',
        action: 'chat_with_sofia',
        clientId: validatedData.clientId || null,
        success: true,
        details: {
          message: validatedData.message,
          intent: sofiaResponse.intent,
          confidence: sofiaResponse.confidence
        }
      }
    })

    return NextResponse.json({
      data: {
        message: sofiaResponse.message,
        intent: sofiaResponse.intent,
        confidence: sofiaResponse.confidence,
        suggestions: sofiaResponse.suggestions,
        actions: sofiaResponse.actions,
        conversationId: sofiaResponse.conversationId
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro no chat com Sofia:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/ai/chat/intents - Listar intenções disponíveis
export async function GET(request: NextRequest) {
  try {
    const intents = getSofiaIntents()

    return NextResponse.json({
      data: { intents }
    })

  } catch (error) {
    console.error('Erro ao buscar intenções:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função principal da Sofia IA
async function processSofiaMessage(message: string, clientContext: any, context: any) {
  // Detectar intenção
  const intent = detectIntent(message)
  
  // Gerar resposta baseada na intenção e contexto
  const response = await generateSofiaResponse(intent, message, clientContext, context)
  
  return {
    message: response.message,
    intent: intent.name,
    confidence: intent.confidence,
    suggestions: response.suggestions,
    actions: response.actions,
    conversationId: generateConversationId()
  }
}

// Detectar intenção da mensagem
function detectIntent(message: string) {
  const lowercaseMessage = message.toLowerCase()
  const intents = getSofiaIntents()
  
  let bestMatch: { name: string; confidence: number; keywords: string[] } = { name: 'unknown', confidence: 0, keywords: [] }
  
  for (const [intentName, intentData] of Object.entries(intents)) {
    let score = 0
    const matchedKeywords: string[] = []
    
    // Verificar keywords
    for (const keyword of intentData.keywords) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        score += 1
        matchedKeywords.push(keyword)
      }
    }
    
    // Verificar patterns
    for (const pattern of intentData.patterns) {
      const regex = new RegExp(pattern, 'i')
      if (regex.test(lowercaseMessage)) {
        score += 2,
      }
    }
    
    // Calcular confiança
    const confidence = Math.min(score / Math.max(intentData.keywords.length, 1), 1)
    
    if (confidence > bestMatch.confidence) {
      bestMatch = {
        name: intentName,
        confidence,
        keywords: matchedKeywords
      }
    }
  }
  
  return bestMatch
}

// Gerar resposta da Sofia
async function generateSofiaResponse(intent: any, message: string, clientContext: any, context: any) {
  const intentName = intent.name
  const clientName = clientContext?.name?.split(' ')[0] || 'Cliente'
  
  switch (intentName) {
    case 'greeting':
      return {
        message: `Olá ${clientName}! 👋 Eu sou a Sofia, sua assistente virtual especializada em vistos e imigração. Como posso te ajudar hoje?`,
        suggestions: [
          'Quero analisar minha elegibilidade',
          'Quais documentos preciso?',
          'Quanto custa o processo?',
          'Quanto tempo demora?'
        ],
        actions: []
      }
    
    case 'eligibility_question':
      if (clientContext) {
        const targetCountry = clientContext.targetCountry || context?.targetCountry
        if (targetCountry) {
          return {
            message: `Perfeito ${clientName}! Vejo que você está interessado em ${targetCountry}. 

Baseado no seu perfil, aqui está uma análise preliminar:

📊 **Seu Status Atual:**
- País de destino: ${targetCountry}
- Score de elegibilidade: ${clientContext.score || 'Não calculado'}
- Status: ${getStatusLabel(clientContext.status)}

Gostaria de fazer uma análise mais detalhada? Posso te ajudar a:
1. Calcular sua elegibilidade completa
2. Mostrar os documentos necessários
3. Estimar timeline e custos`,
            suggestions: [
              'Fazer análise completa',
              'Ver documentos necessários',
              'Conhecer os custos',
              'Falar com especialista'
            ],
            actions: [{
              type: 'start_analysis',
              label: 'Iniciar Análise Completa',
              clientId: clientContext.id
            }],
          }
        }
      }
      return {
        message: `Claro! Para analisar sua elegibilidade, preciso conhecer melhor seu perfil. 

Vamos começar com algumas perguntas:

1. **Para qual país você quer imigrar?** 🌍
2. **Qual sua idade?** 👤
3. **Qual seu nível de educação?** 🎓
4. **Quantos anos de experiência profissional você tem?** 💼

Essas informações me ajudam a dar uma análise mais precisa!`,
        suggestions: [
          'Canadá',
          'Austrália', 
          'Portugal',
          'Estados Unidos'
        ],
        actions: []
      }
    
    case 'documents_question':
      const country = clientContext?.targetCountry || context?.targetCountry || extractCountryFromMessage(message)
      if (country) {
        return await getDocumentsResponse(country, clientName)
      }
      return {
        message: `Para te ajudar com os documentos, preciso saber para qual país você está aplicando. 

Os documentos variam significativamente entre países:

🇨🇦 **Canadá**: Foco em credenciais educacionais e experiência
🇦🇺 **Austrália**: Skills assessment é fundamental  
🇵🇹 **Portugal**: Ênfase em comprovação de renda
🇺🇸 **EUA**: Documentos variam por categoria de visto

Para qual país você está interessado?`,
        suggestions: ['Canadá', 'Austrália', 'Portugal', 'Estados Unidos'],
        actions: []
      }
    
    case 'cost_question':
      return {
        message: `Ótima pergunta ${clientName}! Os custos variam dependendo do país e tipo de serviço. 

💰 **Nossos Pacotes:**

📋 **Consulta Básica - R$ 299**
- Análise IA completa
- Consultoria de 30min
- Lista de documentos
- Suporte por email

⭐ **Consulta Premium - R$ 599** (Mais Popular)
- Tudo do Básico
- Consultoria de 60min  
- Preparação de documentos
- Acompanhamento 30 dias

👑 **Serviço VIP - R$ 1.299**
- Serviço completo hands-off
- Consultor dedicado
- Garantia de reembolso*
- Suporte 24/7

**Taxas governamentais à parte*

Qual pacote faz mais sentido para você?`
        suggestions: [
          'Consulta Básica - R$ 299',
          'Consulta Premium - R$ 599', 
          'Serviço VIP - R$ 1.299',
          'Preciso de mais detalhes'
        ],
        actions: [{
          type: 'show_pricing',
          label: 'Ver Detalhes dos Pacotes'
        }]
      }
    
    case 'timeline_question':
      return {
        message: `O tempo varia bastante por país ${clientName}! Aqui está um resumo:

⏱️ **Timeline por País:**

🇵🇹 **Portugal (D7)**: 2-4 meses
- Mais rápido para aposentados/renda passiva

🇨🇦 **Canadá (Express Entry)**: 6-8 meses  
- Pode acelerar com PNP (Provincial)

🇦🇺 **Austrália (Skilled)**: 8-12 meses
- Skills assessment adiciona tempo

🇺🇸 **EUA (EB-1)**: 12-24 meses
- Mais complexo, varia por categoria

**💡 Dica:** Com nosso serviço VIP, otimizamos cada etapa para acelerar seu processo!

Para qual país você está pensando?`,
        suggestions: [
          'Portugal - mais rápido',
          'Canadá - boa opção',
          'Austrália - quero detalhes',
          'Estados Unidos'
        ],
        actions: []
      }
    
    case 'contact_human':
      return {
        message: `Claro ${clientName}! Vou te conectar com um de nossos especialistas. 

👥 **Opções de Contato:**

📞 **Ligação Imediata**
- Especialista disponível agora
- Consultoria de 15min gratuita

📅 **Agendar Consultoria**  
- Escolha melhor horário
- Consultoria completa (30-60min)
- Análise detalhada do seu caso

📧 **Email/WhatsApp**
- Resposta em até 2h
- Ideal para dúvidas rápidas

Qual opção prefere?`
        suggestions: [
          'Ligar agora',
          'Agendar consultoria',
          'WhatsApp',
          'Email'
        ],
        actions: [{
          type: 'contact_specialist',
          label: 'Falar com Especialista Agora'
        }]
      }
    
    case 'complaint':
      return {
        message: `${clientName}, lamento muito pelo inconveniente! 😔

Sua satisfação é nossa prioridade. Vou escalar isso imediatamente:

🚨 **Ação Imediata:**
- Gerente de atendimento notificado
- Protocolo aberto: #${Date.now().toString().slice(-6)}
- Retorno garantido em 2h

📞 **Contato Direto:**
- WhatsApp: +55 11 99999-9999
- Email: urgente@visa2any.com

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
  
  // Buscar requisitos na base de conhecimento
  const requirements = await prisma.visaRequirement.findFirst({
    where: {
      country: { contains: country }
      isActive: true
    }
  })
  
  if (requirements) {
    const docs = requirements.requiredDocuments as any[]
    const docList = docs.map(doc => `- ${doc.name} (${doc.required ? 'Obrigatório' : 'Opcional'})`).join('\n')
    
    return {
      message: `Perfeito ${clientName}! Aqui estão os documentos para ${country}:

📄 **Documentos Necessários:**
${docList}

⏱️ **Tempo de Processamento:** ${requirements.processingTime}
💰 **Taxa Governamental:** ${(requirements.fees as any).government} ${(requirements.fees as any).currency}

💡 **Dica:** Nosso serviço inclui:
- ✅ Revisão de todos os documentos
- ✅ Checklist personalizado  
- ✅ Dicas para aumentar aprovação

Quer uma análise completa do seu perfil?`
      suggestions: [
        'Fazer análise completa',
        'Ver dicas de aprovação',
        'Agendar consultoria',
        'Outro país'
      ],
      actions: [{
        type: 'start_analysis',
        label: 'Iniciar Análise Completa'
      }],
    }
  }
  
  // Resposta genérica se não tem dados específicos
  const genericDocs = getGenericDocuments(countryLower)
  return {
    message: `${clientName}, aqui estão os documentos típicos para ${country}:

📄 **Documentos Comuns:**
${genericDocs}

⚠️ **Importante:** Os requisitos podem variar por tipo de visto e situação específica.

💡 **Recomendação:** Faça nossa análise IA gratuita para ter uma lista personalizada dos documentos exatos que você precisa!`,
    suggestions: [
      'Análise IA gratuita',
      'Falar com especialista',
      'Ver outros países',
      'Mais informações'
    ],
    actions: [{
      type: 'start_analysis',
      label: 'Análise Gratuita Agora'
    }],
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
    }
    
    eligibility_question: {
      keywords: ['elegibilidade', 'elegível', 'posso', 'consigo', 'chances', 'probabilidade', 'qualificado'],
      patterns: ['posso.*visto', 'consigo.*imigrar', 'tenho.*chances'],
    }
    
    documents_question: {
      keywords: ['documentos', 'papéis', 'preciso', 'necessário', 'documentação'],
      patterns: ['que documentos', 'preciso.*documento', 'documentos.*necessário'],
    }
    
    cost_question: {
      keywords: ['custa', 'preço', 'valor', 'quanto', 'custo', 'investimento', 'taxa'],
      patterns: ['quanto.*custa', 'qual.*preço', 'valor.*processo'],
    }
    
    timeline_question: {
      keywords: ['tempo', 'demora', 'duração', 'prazo', 'quanto tempo', 'timeline'],
      patterns: ['quanto.*tempo', 'tempo.*demora', 'prazo.*processo'],
    }
    
    contact_human: {
      keywords: ['humano', 'pessoa', 'especialista', 'consultor', 'atendente', 'falar'],
      patterns: ['falar.*humano', 'pessoa.*real', 'especialista.*humano'],
    }
    
    complaint: {
      keywords: ['problema', 'reclamação', 'erro', 'ruim', 'insatisfeito', 'demora', 'lento'],
      patterns: ['tenho.*problema', 'não.*funcionando', 'muito.*demora'],
    }
  }
}