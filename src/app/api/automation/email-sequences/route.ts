import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Templates de email por sequência
const EMAIL_TEMPLATES = {
  hot_lead_immediate: [
    {
      delay: 0, // Imediato
      subject: '🔥 {name}, seu perfil é EXCELENTE! Vamos conversar?',
      template: `Olá {name}

Acabei de analisar sua qualificação e tenho ÓTIMAS notícias! 🎉

Seu perfil para {destinationCountry} é EXCELENTE - score {score}/100!

Como especialista em imigração, posso garantir que você tem grandes chances de sucesso.

Quero falar com você HOJE para:
✅ Mostrar sua estratégia personalizada
✅ Explicar os próximos passos
✅ Garantir que você não perca nenhuma oportunidade

Tenho apenas 2 vagas hoje para consultoria VIP gratuita.

Clique aqui para agendar: {schedulingLink}

Ou me chame no WhatsApp: {whatsappLink}

Att,
Ana Silva
Consultora Sênior Visa2Any
📱 +55 11 5197-1375`},
    {
      delay: 60, // 1 hora depois se não respondeu
      subject: '⏰ {name}, restam apenas algumas horas...',
      template: `{name}

Notei que você ainda não agendou sua consultoria VIP.

Seu perfil é TÃO BOM que não quero que você perca essa oportunidade.

Para {destinationCountry}, você está entre os 10% melhores candidatos que já analisei.

Vou guardar uma vaga até às 18h de hoje.

Agende agora: {schedulingLink}

Ana Silva
Visa2Any`}
  ],

  warm_lead_nurturing: [
    {
      delay: 0,
      subject: '✨ {name}, sua análise está pronta!',
      template: `Olá {name}!

Sua qualificação para {destinationCountry} foi analisada!

📊 Seu Score: {score}/100 - Bom potencial!

Com nossa estratégia personalizada, suas chances aumentam significativamente.

Preparei uma análise GRATUITA de 30 minutos com nossa IA especializada:

🤖 Análise detalhada do seu caso
📋 Lista completa de documentos
🎯 Estratégia personalizada
⏱️ Timeline realista

Clique aqui para começar: {aiAnalysisLink}

É 100% gratuito e você recebe o resultado na hora!

Att,
Equipe Visa2Any`},
    {
      delay: 1440, // 24 horas
      subject: '📚 {name}, baixe nossos guias exclusivos',
      template: `Oi {name}!

Vi que você tem interesse em {destinationCountry}.

Separei nossos 3 materiais mais valiosos para você:

📖 E-book: 50 Erros que Reprovam Vistos
📋 Checklist: Documentos por País  
💰 Planilha: Comprovação Financeira

Mais de 50.000 pessoas já baixaram!

Pegue os seus aqui: {leadMagnetsLink}

PS: Tudo 100% gratuito, sem pegadinha!

Equipe Visa2Any`},
    {
      delay: 4320, // 3 dias
      subject: '🎯 {name}, vamos criar sua estratégia?',
      template: `{name}

Espero que os materiais tenham sido úteis!

Para quem tem perfil como o seu ({score}/100), costumo recomendar nossa Consultoria Express.

Em 60 minutos você sai com:
✅ Estratégia 100% personalizada
✅ Timeline detalhado 
✅ Lista completa de documentos
✅ Suporte WhatsApp por 30 dias

Apenas R$ 297 (parcelamos em 12x)

Quero agendar sua consultoria: {consultationLink}

Ana Silva
Consultora Sênior`}
  ],

  cold_lead_education: [
    {
      delay: 0,
      subject: '📚 {name}, comece sua jornada com conhecimento',
      template: `Olá {name}!

Obrigado por seu interesse em {destinationCountry}!

Sei que o processo pode parecer complexo no início, mas com as informações certas, fica muito mais simples.

Preparei uma série de conteúdos gratuitos para você:

📖 Guia Completo: Como Imigrar para {destinationCountry}
📝 Checklist: Primeiros Passos
🎥 Vídeos: Erros Mais Comuns

Baixe tudo aqui: {educationalContentLink}

Nos próximos dias vou te enviar mais dicas valiosas!

Att,
Equipe Visa2Any`},
    {
      delay: 2880, // 2 dias
      subject: '💡 {name}, dica #1: Por onde começar',
      template: `Oi {name}!

Primeira dica importante: NUNCA comece juntando documentos aleatoriamente.

Primeiro você precisa:
1️⃣ Definir o tipo de visto ideal
2️⃣ Calcular suas chances reais
3️⃣ Criar uma estratégia específica

Nossa IA Sofia pode fazer essa análise em 15 minutos:
{aiAnalysisLink}

É gratuito e você vai economizar meses de trabalho!

Próxima dica chegará em 2 dias.

Equipe Visa2Any`},
    {
      delay: 7200, // 5 dias
      subject: '🔍 {name}, dica #2: Evite estes erros fatais',
      template: `{name}

Os 3 erros que mais reprovam vistos:

❌ Documentos mal traduzidos
❌ Comprovação financeira inadequada  
❌ Inconsistências na aplicação

No nosso e-book gratuito, explico TODOS os 50 erros mais comuns.

Baixe aqui: {ebookLink}

Mais de 10.000 pessoas já evitaram reprovações com esse material!

Dica #3 chega em breve...

Equipe Visa2Any`}
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sequence, clientId, email, name, category, responses, destinationCountry, urgency, budget } = body

    if (!sequence || !email || !name) {
      return NextResponse.json({
        error: 'Dados obrigatórios faltando'
      }, { status: 400 })
    }

    const templates = EMAIL_TEMPLATES[sequence as keyof typeof EMAIL_TEMPLATES]

    if (!templates) {
      return NextResponse.json({
        error: 'Sequência de email não encontrada'
      }, { status: 404 })
    }

    // Calcular score se não fornecido
    const score = responses ? calculateScoreFromResponses(responses) : 70

    // Criar jobs de email para cada template da sequência
    for (const template of templates) {
      const sendAt = new Date()
      sendAt.setMinutes(sendAt.getMinutes() + template.delay)

      // Processar template com variáveis
      const processedSubject = processTemplate(template.subject, {
        name,
        destinationCountry,
        score,
        urgency,
        budget
      })

      const processedBody = processTemplate(template.template, {
        name,
        destinationCountry,
        score,
        urgency,
        budget,
        schedulingLink: 'https://visa2any.com/agendar',
        whatsappLink: 'https://wa.me/5511999999999',
        aiAnalysisLink: 'https://visa2any.com/consultoria-ia',
        leadMagnetsLink: 'https://visa2any.com/lead-magnets',
        consultationLink: 'https://visa2any.com/precos',
        educationalContentLink: 'https://visa2any.com/lead-magnets',
        ebookLink: 'https://visa2any.com/lead-magnets'
      })

      // Agendar email (implementar com serviço de queue posteriormente)
      await scheduleEmail({
        to: email,
        subject: processedSubject,
        body: processedBody,
        sendAt,
        sequence,
        clientId,
        templateIndex: templates.indexOf(template)
      })
    }

    return NextResponse.json({
      message: `Sequência ${sequence} ativada para ${email}`,
      emailsScheduled: templates.length
    })

  } catch (error) {
    console.error('Erro ao processar sequência de emails:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\{${key}\}`, 'g')
    processed = processed.replace(regex, String(value))
  })
  return processed
}

function calculateScoreFromResponses(responses: any): number {
  // Lógica simplificada de cálculo de score
  let score = 50
  if (responses.education) {
    const educationScores: Record<string, number> = {
      'Doutorado': 20,
      'Mestrado': 18,
      'Pós-graduação': 15,
      'Superior completo': 12,
      'Superior incompleto': 8,
      'Ensino médio': 5
    }
    score += educationScores[responses.education] || 5
  }
  if (responses.budget) {
    const budgetScores: Record<string, number> = {
      'Acima de R$ 500.000': 15,
      'R$ 300.000 - R$ 500.000': 12,
      'R$ 100.000 - R$ 300.000': 8,
      'R$ 50.000 - R$ 100.000': 5
    }
    score += budgetScores[responses.budget] || 2
  }
  if (responses.urgency) {
    const urgencyScores: Record<string, number> = {
      'Extremamente urgente (preciso sair já)': 10,
      'Muito urgente (próximos 3 meses)': 8,
      'Urgente (próximos 6 meses)': 6
    }
    score += urgencyScores[responses.urgency] || 3
  }
  return Math.min(score, 100)
}

async function scheduleEmail(emailData: {
  to: string,
  subject: string,
  body: string,
  sendAt: Date,
  sequence: string
  clientId?: string,
  templateIndex: number
}) {
  try {
    // Em produção usar serviço de queue como Bull/Redis
    // Por enquanto simular agendamento
    console.log(`Email agendado:`, {
      to: emailData.to,
      subject: emailData.subject,
      sendAt: emailData.sendAt,
      sequence: emailData.sequence,
      templateIndex: emailData.templateIndex
    })
    // Se o delay for 0 (imediato) enviar agora
    if (emailData.sendAt <= new Date()) {
      await sendEmailNow(emailData)
    }
    // Salvar na base para controle
    if (emailData.clientId) {
      await prisma.interaction.create({
        data: {
          clientId: emailData.clientId,
          type: 'AUTOMATED_EMAIL',
          channel: 'email',
          direction: 'outbound',
          subject: emailData.subject,
          content: `Email agendado: ${emailData.subject}`,
          completedAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('Erro ao agendar email:', error)
  }
}

async function sendEmailNow(emailData: {
  to: string,
  subject: string,
  body: string,
  sequence: string
  clientId?: string
}) {
  try {
    // Usar serviço de email (Resend, SendGrid, etc.)
    console.log(`Enviando email imediato para ${emailData.to}`)
    // Simular envio por enquanto
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.body.replace(/\n/g, '<br>'),
        template: 'automation',
        variables: {
          content: emailData.body
        }
      })
    })
    if (emailData.clientId) {
      await prisma.interaction.create({
        data: {
          clientId: emailData.clientId,
          type: 'EMAIL',
          channel: 'email',
          direction: 'outbound',
          subject: emailData.subject,
          content: `Email enviado: ${emailData.subject}`,
          completedAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}