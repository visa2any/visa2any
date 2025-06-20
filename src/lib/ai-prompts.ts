'use client'

/**
 * Biblioteca Estruturada de Prompts de IA - Visa2Any
 * Sistema completo de templates para automação total de consultoria de vistos
 */

export interface CountryProfile {
  code: string
  name: string
  languages: string[]
  currency: string
  processingTimeRange: string
  difficulty: 'low' | 'medium' | 'high' | 'very_high'
  successRate: number
}

export interface ClientProfile {
  age: number
  nationality: string
  education: 'high_school' | 'bachelor' | 'master' | 'phd'
  workExperience: number
  languageSkills: Record<string, 'basic' | 'intermediate' | 'advanced' | 'native'>
  income: number
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  hasChildren: boolean
  targetCountry: string
  visaType: string
}

export interface PromptContext {
  client: ClientProfile
  country: CountryProfile
  documents?: string[]
  previousApplications?: any[]
  currentDate: string
}

/**
 * PROMPTS PARA ANÁLISE DE ELEGIBILIDADE
 */
export const ELIGIBILITY_PROMPTS = {
  canada: {
    expressEntry: (context: PromptContext) => `
Você é um especialista em imigração canadense certificado. Analise o perfil do cliente para Express Entry:

PERFIL DO CLIENTE:
- Idade: ${context.client.age} anos
- Educação: ${context.client.education}
- Experiência: ${context.client.workExperience} anos
- Idiomas: ${JSON.stringify(context.client.languageSkills)}
- Estado civil: ${context.client.maritalStatus}
- Filhos: ${context.client.hasChildren ? 'Sim' : 'Não'}
- Nacionalidade: ${context.client.nationality}

TAREFAS:
1. Calcule o CRS Score detalhadamente (máximo 1200 pontos)
2. Identifique pontos fortes e fracos
3. Sugira melhorias específicas para aumentar a pontuação
4. Estime probabilidade de sucesso (%)
5. Recomende timing ideal para aplicação
6. Identifique programas alternativos (PNP, RNIP, etc.)

FORMATO DE RESPOSTA:
{
  "crsScore": número,
  "breakdown": {
    "coreFactors": número,
    "spouseFactors": número,
    "skillTransferability": número,
    "additionalFactors": número
  },
  "strengths": ["força1", "força2"],
  "weaknesses": ["fraqueza1", "fraqueza2"],
  "improvements": [{"ação": "descrição", "impacto": "+X pontos"}],
  "successProbability": número,
  "recommendedTiming": "descrição",
  "alternatives": ["programa1", "programa2"],
  "nextSteps": ["passo1", "passo2"]
}

IMPORTANTE: Base-se nos critérios oficiais do IRCC e seja preciso nos cálculos.
`,

    pnp: (context: PromptContext) => `
Analise elegibilidade para Provincial Nominee Program (PNP) canadense:

PERFIL: ${JSON.stringify(context.client, null, 2)}

Avalie compatibilidade com:
1. British Columbia PNP
2. Alberta AINP  
3. Ontario OINP
4. Quebec (não PNP, mas relevante)
5. Saskatchewan SINP
6. Manitoba MPNP
7. Atlantic Immigration Program

Para cada província elegível, forneça:
- Categoria específica recomendada
- Requisitos não atendidos
- Probabilidade de nomeação
- Estratégia de aplicação

Formato JSON estruturado com análise detalhada.
`
  },

  usa: {
    eb1a: (context: PromptContext) => `
Especialista em EB-1A (Extraordinary Ability) - analise o perfil:

CLIENTE: ${JSON.stringify(context.client)}

Avalie os 10 critérios do EB-1A:
1. Prêmios nacionais/internacionais
2. Memberships em associações de elite
3. Mídia publicada sobre o candidato
4. Participação como juiz
5. Contribuições originais significativas
6. Artigos/trabalhos acadêmicos
7. Exposições artísticas
8. Organizações de reputação distinta
9. Salário/remuneração alta
10. Sucesso comercial em artes

TAREFAS:
- Identifique evidências necessárias para cada critério
- Sugira estratégia para fortalecer pontos fracos
- Estime timeline para preparação
- Avalie chances de aprovação

Seja rigoroso - EB-1A tem critérios muito altos.
`,

    b1b2: (context: PromptContext) => `
Analise elegibilidade para visto B-1/B-2 (turismo/negócios):

PERFIL: ${JSON.stringify(context.client)}

Fatores críticos para aprovação:
1. Laços fortes com país de origem
2. Situação financeira estável
3. Histórico de viagens
4. Propósito claro da viagem
5. Intenção de retorno

Identifique red flags e sugira mitigações.
Forneça checklist de documentos e preparação para entrevista.
`
  },

  portugal: {
    d7: (context: PromptContext) => `
Especialista em Visto D7 Portugal - analise elegibilidade:

CLIENTE: ${JSON.stringify(context.client)}

ANÁLISE OBRIGATÓRIA:
1. Renda Passiva Mínima:
   - Requerente principal: €670/mês (100% do IAS)
   - Cônjuge: €335/mês (50% do IAS)  
   - Filho menor: €201/mês (30% do IAS)
   - Verifique se renda é recorrente e comprovável

2. Acomodação:
   - Contrato de arrendamento ou escritura
   - Condições de habitabilidade
   - Localização e custo

3. Seguro de Saúde:
   - Cobertura mínima €30.000
   - Válido em Portugal
   - Sem franquias

4. Documentação:
   - Certificado criminal apostilado
   - Comprovantes de renda
   - Documentos traduzidos

CALCULE:
- Renda mínima exigida para composição familiar
- Probabilidade de aprovação
- Timeline do processo
- Custos totais envolvidos

Forneça análise detalhada e plano de ação.
`,

    goldenVisa: (context: PromptContext) => `
Analise elegibilidade para Golden Visa Portugal:

OPÇÕES DE INVESTIMENTO (2024):
1. Fundo de investimento: €500.000
2. Capital de risco: €350.000  
3. Investigação científica: €350.000
4. Patrimônio cultural: €250.000
5. Criação de empresas: 10 empregos

Avalie capacidade financeira e recomende melhor opção.
Inclua análise fiscal e sucessória.
`
  },

  australia: {
    skilled189: (context: PromptContext) => `
Analise elegibilidade para Skilled Independent visa (189):

SISTEMA DE PONTOS:
- Idade (máximo 30 pontos)
- Inglês (máximo 20 pontos)  
- Educação (máximo 20 pontos)
- Experiência Austrália (máximo 20 pontos)
- Experiência exterior (máximo 15 pontos)
- Qualificação cônjuge (máximo 10 pontos)
- Estudo na Austrália (máximo 5 pontos)

Calcule pontuação total e compare com convites recentes.
Verifique se ocupação está na lista MLTSSL.
`
  }
}

/**
 * PROMPTS PARA ANÁLISE DE DOCUMENTOS
 */
export const DOCUMENT_ANALYSIS_PROMPTS = {
  validation: (documentType: string, country: string, context: PromptContext) => `
Você é um especialista em documentação para imigração. Analise este documento:

DOCUMENTO: ${documentType}
PAÍS DESTINO: ${country}
CONTEXTO: ${JSON.stringify(context.client)}

VERIFICAÇÕES OBRIGATÓRIAS:
1. Autenticidade e integridade
2. Validade e expiração
3. Conformidade com requisitos do país
4. Qualidade da tradução (se aplicável)
5. Apostila/legalização necessária
6. Formatação e padrões exigidos

FORNEÇA:
- Status: APROVADO/REJEITADO/PENDENTE
- Lista detalhada de problemas encontrados
- Ações corretivas específicas
- Impacto na aplicação de visto
- Alternativas documentais se disponíveis

Seja rigoroso - documentos incorretos causam negativas.
`,

  extraction: (documentType: string) => `
Extraia informações estruturadas deste ${documentType}:

CAMPOS OBRIGATÓRIOS:
- Dados pessoais completos
- Datas relevantes
- Números de identificação
- Informações específicas do documento
- Status/validade

Retorne JSON estruturado com todos os campos identificados.
Sinalize inconsistências ou campos em branco.
`,

  recommendations: (documentType: string, issues: string[]) => `
Problemas identificados em ${documentType}:
${issues.join('\n')}

Forneça recomendações específicas para correção:
1. Passos detalhados para resolver cada problema
2. Documentos alternativos se aplicável
3. Custos estimados e timeline
4. Riscos de manter problemas não resolvidos
5. Priorização das correções

Seja prático e acionável nas recomendações.
`
}

/**
 * PROMPTS PARA PREPARAÇÃO DE ENTREVISTA
 */
export const INTERVIEW_PROMPTS = {
  preparation: (country: string, visaType: string, context: PromptContext) => `
Prepare o cliente para entrevista consular:

PAÍS: ${country}
VISTO: ${visaType}
PERFIL: ${JSON.stringify(context.client)}

GERE:
1. 20 perguntas mais prováveis com respostas modelo
2. Red flags específicos a evitar
3. Documentos para levar organizados
4. Linguagem corporal e postura
5. Estratégias para perguntas difíceis
6. Simulação de cenários adversos

FORMATO:
- Perguntas em português e inglês
- Respostas concisas e convincentes
- Justificativas para cada resposta
- Dicas específicas do consulado

Foque em construir confiança e credibilidade.
`,

  mockInterview: (questions: string[], context: PromptContext) => `
Conduza entrevista simulada rigorosa:

PERGUNTAS: ${questions.join('\n')}
CONTEXTO: ${JSON.stringify(context.client)}

AVALIE:
1. Consistência das respostas
2. Confiança e clareza
3. Linguagem corporal virtual
4. Tempo de resposta
5. Credibilidade geral

FORNEÇA:
- Score de 0-100 para cada resposta
- Feedback detalhado
- Áreas de melhoria
- Exercícios específicos
- Novas perguntas baseadas em fraquezas

Seja como um consul real - rigoroso mas justo.
`
}

/**
 * PROMPTS PARA COMUNICAÇÃO COM CLIENTE
 */
export const CLIENT_COMMUNICATION_PROMPTS = {
  onboarding: (context: PromptContext) => `
Crie mensagem de boas-vindas personalizada:

CLIENTE: ${context.client.nationality}, ${context.client.age} anos
OBJETIVO: ${context.client.targetCountry} - ${context.client.visaType}

TOM: Profissional, acolhedor, confiante
INCLUA:
- Próximos passos claros
- Timeline realista
- Expectativas bem definidas
- Canais de comunicação
- Informações sobre o processo

Máximo 200 palavras, foque em tranquilizar e motivar.
`,

  statusUpdate: (stage: string, context: PromptContext) => `
Atualize cliente sobre progresso:

ETAPA ATUAL: ${stage}
CONTEXTO: ${JSON.stringify(context)}

COMUNIQUE:
- Progresso desde última atualização
- Próximos marcos importantes
- Ações necessárias do cliente
- Possíveis atrasos ou desafios
- Conquistas celebráveis

Tom positivo e transparente.
`,

  rejection: (reason: string, context: PromptContext) => `
Comunicar negativa com estratégia de recuperação:

MOTIVO: ${reason}
PERFIL: ${JSON.stringify(context.client)}

ESTRUTURA:
1. Explicação clara da negativa
2. Análise das causas
3. Opções de recurso disponíveis
4. Estratégias alternativas
5. Timeline para nova tentativa
6. Suporte emocional apropriado

Mantenha esperança e ofereça soluções concretas.
`
}

/**
 * PROMPTS PARA ANÁLISE PREDITIVA
 */
export const PREDICTIVE_PROMPTS = {
  successProbability: (context: PromptContext) => `
Calcule probabilidade de sucesso da aplicação:

DADOS: ${JSON.stringify(context)}

FATORES A CONSIDERAR:
1. Histórico de aprovações para perfil similar
2. Política atual do país
3. Situação econômica/política
4. Sazonalidade
5. Qualidade da documentação
6. Preparo do cliente
7. Representação legal

FORNEÇA:
- Probabilidade principal (%)
- Cenário otimista (%)
- Cenário pessimista (%)
- Principais fatores de risco
- Ações para aumentar chances
- Comparação com casos similares

Base-se em dados históricos reais quando possível.
`,

  timelinePrediction: (context: PromptContext) => `
Estime timeline do processo:

APLICAÇÃO: ${context.client.targetCountry} - ${context.client.visaType}
CONTEXTO: ${JSON.stringify(context)}

CONSIDERE:
1. Tempos de processamento oficiais
2. Variações sazonais
3. Complexidade do caso
4. Volume de aplicações atual
5. Eficiência do consulado/escritório
6. Possíveis atrasos documentais

FORNEÇA:
- Timeline base (melhor cenário)
- Timeline realista (cenário provável)
- Timeline conservador (pior cenário)
- Marcos principais com datas
- Fatores que podem acelerar/atrasar
- Estratégias de contingência

Seja realista e prepare o cliente adequadamente.
`
}

/**
 * PROMPTS PARA ANÁLISE DE RISCO
 */
export const RISK_ANALYSIS_PROMPTS = {
  comprehensive: (context: PromptContext) => `
Análise completa de riscos da aplicação:

CONTEXTO: ${JSON.stringify(context)}

CATEGORIAS DE RISCO:
1. DOCUMENTAL
   - Documentos faltantes/incorretos
   - Traduções inadequadas
   - Validade/autenticidade

2. FINANCEIRO
   - Comprovação de renda insuficiente
   - Fonte de recursos questionável
   - Capacidade de sustento

3. PESSOAL
   - Histórico criminal
   - Negativas anteriores
   - Inconsistências no perfil

4. TEMPORAL
   - Urgência inadequada
   - Timing político/econômico
   - Validade de documentos

5. ESTRATÉGICO
   - Escolha incorreta de visto
   - Sequência de aplicações
   - Representação inadequada

Para cada categoria, forneça:
- Nível de risco (Alto/Médio/Baixo)
- Impacto potencial
- Probabilidade de ocorrência
- Estratégias de mitigação
- Planos de contingência

FORMATO JSON estruturado para análise detalhada.
`,

  mitigation: (risks: string[], context: PromptContext) => `
Desenvolva estratégias de mitigação para riscos identificados:

RISCOS: ${risks.join('\n')}
CONTEXTO: ${JSON.stringify(context)}

Para cada risco, forneça:
1. Análise da causa raiz
2. Estratégias de prevenção
3. Ações corretivas se materializado
4. Custos e timeline para mitigação
5. Impacto na aplicação se não mitigado
6. Alternativas e planos B

Priorize ações por impacto e facilidade de implementação.
`
}

/**
 * FUNÇÕES UTILITÁRIAS
 */
export const PromptUtils = {
  /**
   * Constrói contexto completo para prompts
   */
  buildContext: (client: ClientProfile, country: CountryProfile, additional?: any): PromptContext => ({
    client,
    country,
    currentDate: new Date().toISOString().split('T')[0],
    ...additional
  }),

  /**
   * Valida se prompt está completo
   */
  validatePrompt: (prompt: string): boolean => {
    return prompt.length > 100 && 
           prompt.includes('CONTEXTO') && 
           prompt.includes('FORNEÇA')
  },

  /**
   * Formata resposta estruturada
   */
  formatResponse: (response: any, type: string): string => {
    const timestamp = new Date().toLocaleString('pt-BR')
    return `
=== ANÁLISE ${type.toUpperCase()} ===
Data: ${timestamp}

${JSON.stringify(response, null, 2)}

=== FIM DA ANÁLISE ===
    `
  }
}

/**
 * CONFIGURAÇÕES POR PAÍS
 */
export const COUNTRY_CONFIGS = {
  canada: {
    code: 'CA',
    name: 'Canadá',
    languages: ['en', 'fr'],
    currency: 'CAD',
    processingTimeRange: '6-18 meses',
    difficulty: 'high' as const,
    successRate: 0.78,
    specialConsiderations: [
      'Sistema de pontos CRS muito competitivo',
      'Exigência alta de proficiência linguística',
      'Necessidade de equivalência educacional',
      'Experiência de trabalho deve ser NOC 0, A ou B'
    ]
  },
  usa: {
    code: 'US', 
    name: 'Estados Unidos',
    languages: ['en'],
    currency: 'USD',
    processingTimeRange: '2-24 meses',
    difficulty: 'very_high' as const,
    successRate: 0.65,
    specialConsiderations: [
      'Entrevista consular obrigatória para maioria dos vistos',
      'Demonstração de laços fortes com país de origem',
      'Documentação financeira rigorosa',
      'Background checks extensivos'
    ]
  },
  portugal: {
    code: 'PT',
    name: 'Portugal', 
    languages: ['pt'],
    currency: 'EUR',
    processingTimeRange: '2-6 meses',
    difficulty: 'low' as const,
    successRate: 0.92,
    specialConsiderations: [
      'Processo relativamente simples',
      'Renda passiva bem documentada',
      'Seguro de saúde obrigatório',
      'Conhecimento básico de português valorizado'
    ]
  }
}

export default {
  ELIGIBILITY_PROMPTS,
  DOCUMENT_ANALYSIS_PROMPTS,
  INTERVIEW_PROMPTS,
  CLIENT_COMMUNICATION_PROMPTS,
  PREDICTIVE_PROMPTS,
  RISK_ANALYSIS_PROMPTS,
  PromptUtils,
  COUNTRY_CONFIGS
}