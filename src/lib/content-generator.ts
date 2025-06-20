import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ContentIdea {
  id: string
  title: string
  description: string
  platform: 'tiktok' | 'instagram' | 'linkedin' | 'facebook'
  country: string
  category: 'cultural' | 'practical' | 'visa' | 'lifestyle' | 'success_story'
  persona: 'professional_it' | 'healthcare' | 'family' | 'student' | 'retiree'
  hook: string
  cta: string
  hashtags: string[]
  estimatedEngagement: 'high' | 'medium' | 'low'
}

interface CulturalContent {
  country: string
  topics: {
    shockCultural: string[]
    dailyLife: string[]
    practicalTips: string[]
    costOfLiving: string[]
    workCulture: string[]
    socialIntegration: string[]
  }
}

// Base de conhecimento cultural por país
const CULTURAL_DATABASE: Record<string, CulturalContent> = {
  'eua': {
    country: 'Estados Unidos',
    topics: {
      shockCultural: [
        'Gorjeta é obrigatória em restaurantes (18-22%)',
        'Sapatos dentro de casa é normal',
        'Small talk com estranhos é esperado',
        'Ar condicionado no máximo o ano todo',
        'Médico marca consulta com 3 meses de antecedência'
      ],
      dailyLife: [
        'Supermercados abertos 24h',
        'Drive-thru para tudo (banco, farmácia, café)',
        'Suburbs: vida de carro obrigatório',
        'HOA (associação de moradores) cobra taxas mensais',
        'Thanksgiving é maior que Natal para americanos'
      ],
      practicalTips: [
        'SSN é mais importante que passaporte para viver lá',
        'Credit score começa do zero, precisa construir',
        'Conta bancária: evite fees mensais',
        'Health insurance: prioridade absoluta',
        'Driver license necessária até para comprar cerveja'
      ],
      costOfLiving: [
        'Aluguel: 30% do salário líquido é o recomendado',
        'Carro: insurance + gas + manutenção = R$ 2.000/mês',
        'Comida: $300-500/mês por pessoa',
        'Utilities: $150-300/mês (eletricidade cara)',
        'Saúde: $400-800/mês só de insurance'
      ],
      workCulture: [
        'Work-life balance: depende 100% da empresa',
        '2 semanas de férias por ano é normal',
        'Sick days limitados (3-5 por ano)',
        'Happy hour é networking, não diversão',
        'Email depois das 18h é esperado'
      ],
      socialIntegration: [
        'Meetup.com para fazer amigos',
        'Volunteer work abre portas sociais',
        'Sports leagues: softball, bowling',
        'Neighborhood events nos suburbs',
        'Church communities (mesmo não sendo religioso)'
      ]
    }
  },
  'canada': {
    country: 'Canadá',
    topics: {
      shockCultural: [
        'Sorry! é dito 20 vezes por dia',
        '-40°C é temperatura normal no inverno',
        'Everything closes at 6pm except Toronto',
        'Tipping culture igual EUA mas menos agressivo',
        'Multiculturalismo é levado muito a sério'
      ],
      dailyLife: [
        'Tim Hortons é religião nacional',
        'Hockey Night in Canada é sagrado',
        'Cottage weekends no verão',
        'LCBO: governo controla venda de álcool',
        'Victoria Day: feriado que ninguém entende'
      ],
      practicalTips: [
        'SIN number: primeiro documento para trabalhar',
        'Healthcare gratuito mas demora MUITO',
        'Banking: Big 5 (RBC, TD, Scotia, BMO, CIBC)',
        'Winter tires obrigatórios em Quebec',
        'Hydro bill: conta de luz pode ser $300/mês'
      ],
      costOfLiving: [
        'Toronto/Vancouver: 50% do salário vai para moradia',
        'Groceries: $150/semana para casal',
        'Transporte público: $150/mês',
        'Internet: $80-120/mês (oligopólio)',
        'Cell phone: $70-100/mês (mais caro que EUA)'
      ],
      workCulture: [
        '3 semanas de férias é padrão',
        'Sick days unlimited (culturalmente)',
        'Work from home aceito pós-COVID',
        'Email depois 17h é mal visto',
        'Diversity and inclusion é prioridade'
      ],
      socialIntegration: [
        'Community centers em toda cidade',
        'French classes gratuitos',
        'Skiing/skating: esportes de inverno sociais',
        'Potluck dinners são comuns',
        'Volunteer é valorizado no currículo'
      ]
    }
  },
  'portugal': {
    country: 'Portugal',
    topics: {
      shockCultural: [
        'Tudo fecha das 13h às 15h (siesta)',
        'Jantar às 20h é cedo',
        'Café é expresso pequeno sempre',
        'Brasileiro é visto como primo rico',
        'Falar alto é considerado rude'
      ],
      dailyLife: [
        'Pastel de nata não é pastel de Belém',
        'Praia é programa nacional no verão',
        'Festival season: junho-setembro',
        'Mercado municipal: fresh food culture',
        'Pharmacy green cross system'
      ],
      practicalTips: [
        'NIF: número fiscal obrigatório para tudo',
        'SEF: appointment system é caótico',
        'Multibanco: sistema bancário nacional',
        'CTT: correios portuguesa eficiente',
        'SNS: saúde pública funciona bem'
      ],
      costOfLiving: [
        'Lisboa: €800-1200 por quarto',
        'Porto: 30% mais barato que Lisboa',
        'Interior: 50% mais barato',
        'Restaurante: €8-15 prato principal',
        'Transporte: €40/mês passe nacional'
      ],
      workCulture: [
        '22 dias de férias obrigatórios',
        'Subsídio de Natal: 13º salário',
        'Horário: 9h às 18h com pausa longa',
        'Hierarquia respeitada',
        'Networking: almoços longos'
      ],
      socialIntegration: [
        'Cafés: centro social português',
        'Futebol: conversa universal',
        'Festas populares: integração garantida',
        'Language exchange: Lisboa/Porto',
        'Expat groups muito ativos'
      ]
    }
  }
}

// Hooks virais por categoria
const VIRAL_HOOKS = {
  cultural: [
    "Coisas que NINGUÉM te conta sobre {country}",
    "Choque cultural que você vai ter em {country}",
    "Por que brasileiros SOFREM em {country}",
    "Realidade vs expectativa: {country}",
    "3 coisas que me chocaram em {country}"
  ],
  practical: [
    "Primeiro dia em {country}: faça ISSO",
    "Documento mais importante que passaporte",
    "Como economizar R$ 50.000 em {country}",
    "Erro que 90% dos brasileiros comete",
    "Apps que você PRECISA baixar em {country}"
  ],
  visa: [
    "Visto negado: 3 motivos principais",
    "Como aumentar chances em 300%",
    "Mudança na lei: você tem até...",
    "Documentos que garantem aprovação",
    "Entrevista: pergunta que derruba 70%"
  ],
  lifestyle: [
    "Custo de vida REAL em {country}",
    "Salário vs gastos: a matemática",
    "Onde morar em {country} com pouco dinheiro",
    "Trabalhos que pagam bem para brasileiros",
    "Como fazer amigos em {country}"
  ],
  success_story: [
    "De desempregado a aprovado em 60 dias",
    "Como consegui visto depois de 3 negativas",
    "Família toda aprovada: nossa estratégia",
    "Zero inglês para aprovado: minha jornada",
    "Mudança de vida que não acreditava"
  ]
}

// CTAs específicos por persona
const CTA_BY_PERSONA = {
  professional_it: [
    "Consultoria gratuita para TI: link na bio",
    "Análise do seu perfil tech grátis",
    "Vaga tech + visto: nosso método",
    "Salário em dólar? Vamos conversar"
  ],
  healthcare: [
    "Revalidação médica: consultoria grátis",
    "Processo para enfermeiros: link bio",
    "Saúde no exterior: nossa especialidade",
    "Shortage de profissionais: sua chance"
  ],
  family: [
    "Família toda junta: nosso planejamento",
    "Educação dos filhos: vamos planejar",
    "Segurança familiar: consultoria grátis",
    "Futuro das crianças: link na bio"
  ],
  student: [
    "Study permit: consultoria gratuita",
    "Universidade dos sonhos: vamos?",
    "Trabalho + estudo: nosso método",
    "Jovem no exterior: link bio"
  ],
  retiree: [
    "Aposentadoria tranquila: vamos planejar",
    "Qualidade de vida: consultoria grátis",
    "Visto para aposentados: link bio",
    "Segurança na terceira idade"
  ]
}

// Gerar ideias de conteúdo automaticamente
export async function generateContentIdeas(
  platform: string,
  country: string,
  count: number = 10
): Promise<ContentIdea[]> {
  try {
    const prompt = `
Gere ${count} ideias de conteúdo sobre imigração para ${country} na plataforma ${platform}.

Base de conhecimento cultural de ${country}:
${JSON.stringify(CULTURAL_DATABASE[country.toLowerCase()] || {}, null, 2)}

Para cada ideia, inclua:
1. Título chamativo
2. Descrição do conteúdo
3. Hook viral
4. CTA específico
5. Hashtags relevantes
6. Categoria (cultural/practical/visa/lifestyle/success_story)
7. Persona alvo
8. Estimativa de engajamento

Foque em:
- Informações práticas e valiosas
- Curiosidades culturais
- Dicas que só quem mora sabe
- Erros comuns de brasileiros
- Histórias emocionais

Responda em JSON array.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 2000
    })

    const ideas = JSON.parse(response.choices[0].message.content || '[]')
    
    return ideas.map((idea: any, index: number) => ({
      id: `${platform}-${country}-${Date.now()}-${index}`,
      platform,
      country,
      ...idea,
      estimatedEngagement: calculateEngagement(idea, platform)
    }))

  } catch (error) {
    console.error('Erro ao gerar ideias de conteúdo:', error)
    return []
  }
}

// Calcular estimativa de engajamento
function calculateEngagement(idea: any, platform: string): 'high' | 'medium' | 'low' {
  let score = 0
  
  // Fatores que aumentam engajamento
  if (idea.hook?.includes('NINGUÉM')) score += 2
  if (idea.hook?.includes('CHOQUE')) score += 2
  if (idea.hook?.includes('SEGREDO')) score += 2
  if (idea.title?.includes('90%')) score += 1
  if (idea.category === 'cultural') score += 1
  if (platform === 'tiktok' && idea.category === 'lifestyle') score += 2
  if (platform === 'instagram' && idea.category === 'success_story') score += 1
  
  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

// Gerar script completo para TikTok/Reels
export async function generateVideoScript(idea: ContentIdea): Promise<string> {
  try {
    const prompt = `
Crie um script detalhado para vídeo de ${idea.platform} sobre: "${idea.title}"

Estrutura:
- Hook (primeiros 3 segundos)
- 3-5 pontos principais
- CTA final
- Duração: 30-60 segundos
- Tom: educativo mas envolvente
- Visual: descreva o que mostrar em cada cena

O vídeo é sobre ${idea.country} e foca em ${idea.category}.
Público-alvo: ${idea.persona}

Inclua:
🎬 CENA X: [descrição visual]
🎙️ ÁUDIO: [o que falar]
📱 TEXTO NA TELA: [texto overlay]

Seja específico, prático e viral.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    })

    return response.choices[0].message.content || ''

  } catch (error) {
    console.error('Erro ao gerar script:', error)
    return 'Script não pôde ser gerado.'
  }
}

// Gerar cronograma de conteúdo mensal
export async function generateMonthlyCalendar(
  countries: string[],
  platforms: string[]
): Promise<any> {
  const calendar = {}
  const daysInMonth = 30
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = day % 7
    const weekOfMonth = Math.ceil(day / 7)
    
    // Lógica do calendário temático
    let theme = 'general'
    if (weekOfMonth === 1) theme = 'education'
    else if (weekOfMonth === 2) theme = 'visa_process'
    else if (weekOfMonth === 3) theme = 'practical_life'
    else if (weekOfMonth === 4) theme = 'advanced_strategies'
    
    // Distribuir países e plataformas
    const country = countries[day % countries.length]
    const platform = platforms[day % platforms.length]
    
    const ideas = await generateContentIdeas(platform, country, 1)
    
    calendar[day] = {
      date: day,
      dayOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dayOfWeek],
      theme,
      country,
      platform,
      content: ideas[0] || null
    }
  }
  
  return calendar
}

// Analisar performance e otimizar conteúdo
export async function analyzeAndOptimize(
  pastContent: any[],
  metrics: any[]
): Promise<string[]> {
  try {
    const prompt = `
Analise a performance deste conteúdo e sugira otimizações:

Conteúdo publicado:
${JSON.stringify(pastContent.slice(0, 10), null, 2)}

Métricas:
${JSON.stringify(metrics.slice(0, 10), null, 2)}

Identifique:
1. Padrões de conteúdo que performam melhor
2. Horários de maior engajamento
3. Tipos de hook mais efetivos
4. Países/temas com mais interesse
5. Plataformas com melhor ROI

Sugira 10 otimizações específicas para melhorar performance.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })

    const optimizations = response.choices[0].message.content?.split('\n').filter(line => line.trim()) || []
    return optimizations

  } catch (error) {
    console.error('Erro na análise:', error)
    return ['Análise não disponível no momento.']
  }
}

// Exportar funções principais
export {
  CULTURAL_DATABASE,
  VIRAL_HOOKS,
  CTA_BY_PERSONA
}