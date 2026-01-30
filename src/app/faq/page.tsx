'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, Phone, Zap, Search, BookOpen, Users, Clock, Award, Shield, Globe, Star, ThumbsUp, Calendar, FileText, DollarSign, MapPin, CheckCircle, HelpCircle, AlertCircle, Info } from 'lucide-react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showStats, setShowStats] = useState(true)

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const stats = [
    { icon: Users, label: "Clientes Atendidos", value: "15.000+", color: "bg-blue-500" },
    { icon: Globe, label: "Países Cobertos", value: "195", color: "bg-green-500" },
    { icon: Award, label: "Taxa de Sucesso", value: "91.2%", color: "bg-yellow-500" },
    { icon: Clock, label: "Anos de Experiência", value: "12+", color: "bg-purple-500" },
    { icon: Star, label: "Avaliação Média", value: "4.9/5", color: "bg-red-500" },
    { icon: Shield, label: "Garantia", value: "100%", color: "bg-indigo-500" }
  ]

  const quickLinks = [
    { title: "Consultoria IA Gratuita", url: "/consultoria-ia", icon: Zap, description: "Análise em 15 minutos" },
    { title: "Preços Transparentes", url: "/precos", icon: DollarSign, description: "Sem custos ocultos" },
    { title: "Nossos Serviços", url: "/servicos", icon: FileText, description: "Todos os tipos de visto" },
    { title: "Contato Direto", url: "/contato", icon: MessageCircle, description: "Suporte especializado" }
  ]

  const faqData = [
    {
      category: "Vistos e Consultoria",
      icon: "🌟",
      questions: [
        {
          id: "q1",
          question: "Quanto tempo demora para conseguir um visto?",
          answer: "O tempo varia conforme o país e tipo de visto. Estados Unidos (B1/B2): 2-8 semanas após entrevista. Canadá (Express Entry): 6-12 meses para todo o processo. Portugal (D7): 3-6 meses. Austrália (Work/Study): 4-12 semanas. Reino Unido (Visitor): 3-6 semanas."
        },
        {
          id: "q2",
          question: "Vocês garantem a aprovação do visto?",
          answer: "Sim! Oferecemos garantia de aprovação em nossos pacotes premium. Taxa de sucesso: 91.2% (muito acima da média do mercado). Garantia de reembolso: 100% se negado por falha em nossos serviços."
        },
        {
          id: "q3",
          question: "Qual a diferença entre a IA Consultoria e consultoria tradicional?",
          answer: "IA Consultoria (Gratuita): Análise automatizada em 15 minutos, algoritmos avançados identificam melhores opções. Consultoria Tradicional (Paga): Análise humana especializada e detalhada, estratégia personalizada completa, acompanhamento durante todo o processo."
        },
        {
          id: "q4",
          question: "Que tipos de visto vocês ajudam a conseguir?",
          answer: "Atendemos todos os tipos: Turismo (B1/B2, Schengen), Trabalho (H1B, Working Holiday), Estudo (F1, Student), Investidor (E2, Golden Visa), Família (K1, Family Reunion), Residência Permanente (Green Card, Express Entry). Cobertura global: 195 países atendidos."
        },
        {
          id: "q5",
          question: "Como funciona a entrevista consular?",
          answer: "Preparação completa incluída: Mock interview com especialistas, simulação das perguntas mais comuns, revisão de documentos, estratégias específicas por consulado, coaching comportamental. Taxa de aprovação pós-preparação: 94%."
        },
        {
          id: "q6",
          question: "Posso viajar enquanto meu visto está sendo processado?",
          answer: "Depende do tipo de visto: Turismo/Negócios: Pode viajar normalmente. Trabalho/Estudo: Recomendamos evitar viagens até decisão. Imigração: Consulte sempre antes de viajar. Oferecemos consultoria específica para cada caso."
        }
      ]
    },
    {
      category: "Cidadania e Imigração",
      icon: "🏛️",
      questions: [
        {
          id: "q7",
          question: "Como funciona o processo de cidadania italiana?",
          answer: "Processo completo de cidadania italiana por descendência. Etapas principais: 1. Pesquisa genealógica (2-4 meses), 2. Busca de documentos na Itália (3-6 meses), 3. Tradução e apostilamento (1-2 meses), 4. Agendamento no consulado (6-24 meses de fila). Custo total: R$ 8.500 - R$ 15.000. Taxa de sucesso: 89%."
        },
        {
          id: "q8",
          question: "Qual a diferença entre Green Card e cidadania americana?",
          answer: "Green Card (Residência Permanente): Morar e trabalhar permanentemente nos EUA, mas não pode votar, pode ser revogado, precisa renovar a cada 10 anos. Cidadania Americana: Todos os direitos do Green Card + direito ao voto, passaporte americano, proteção contra deportação."
        },
        {
          id: "q9",
          question: "Como conseguir cidadania portuguesa?",
          answer: "Principais vias: 1. Descendência (avós/bisavós portugueses), 2. Casamento (3 anos), 3. Residência legal (5 anos), 4. Sefarditas (descendentes judeus), 5. Investimento (Golden Visa). Documentos necessários: certidões, comprovação de vínculos, teste de português. Tempo: 6-24 meses."
        },
        {
          id: "q10",
          question: "Cidadania alemã por descendência é possível?",
          answer: "Sim, mas com critérios específicos: Descendentes de alemães que emigraram após 1904, perderam cidadania por perseguição nazista, ou mulheres que perderam nacionalidade por casamento. Documentos rigorosos necessários. Taxa de sucesso: 73%. Processo: 12-36 meses."
        },
        {
          id: "q11",
          question: "Quanto custa um processo de imigração completo?",
          answer: "Varia por país/programa: Canadá Express Entry: R$ 15.000-25.000, Estados Unidos EB-5: R$ 80.000-150.000, Portugal D7: R$ 8.000-15.000, Austrália Skilled: R$ 12.000-20.000. Inclui: consultoria, documentação, taxas oficiais, acompanhamento."
        }
      ]
    },
    {
      category: "Documentação e Tradução",
      icon: "📋",
      questions: [
        {
          id: "q12",
          question: "A tradução juramentada é aceita em todos os países?",
          answer: "Sim, mas com especificidades importantes. Países que aceitam traduções brasileiras: Estados Unidos, Canadá, União Europeia, Austrália, Reino Unido. Requisitos específicos: Tradução juramentada por tradutor público registrado, apostilamento Haia Convention."
        },
        {
          id: "q13",
          question: "Quanto tempo demora para apostilar documentos?",
          answer: "Premium (24-48h): R$ 200-350 - PDF no mesmo dia, via física em 48h. Express (2-4 dias): R$ 120-200 - PDF em 24h, físico em 2-4 dias. Standard (5-7 dias): R$ 80-150 - PDF em 48h, físico em 5-7 dias. E-Apostil (mesmo dia): R$ 50-80 - Apostilamento digital oficial."
        },
        {
          id: "q14",
          question: "Quais documentos precisam de apostilamento?",
          answer: "Obrigatório para países signatários da Convenção da Haia: Certidões de nascimento, casamento, óbito, diplomas, históricos escolares, atestados médicos, procurações, documentos empresariais. Exceções: países que não assinaram a convenção (consulte nossos especialistas)."
        },
        {
          id: "q15",
          question: "Como conseguir documentos antigos ou de parentes falecidos?",
          answer: "Serviço especializado de busca documental: Cartórios brasileiros (qualquer estado), arquivos públicos, registros eclesiásticos, documentos no exterior. Sucesso: 87% dos casos. Tempo: 15-60 dias. Inclui certidões em inteiro teor."
        },
        {
          id: "q16",
          question: "Posso usar cópias autenticadas ou precisa ser original?",
          answer: "Varia por país e órgão: Consulados brasileiros: Aceita cópias autenticadas, Embaixadas estrangeiras: Geralmente exigem originais apostilados, Universidades: Maioria aceita cópias, Imigração: Sempre originais. Consultamos caso a caso."
        }
      ]
    },
    {
      category: "Preços e Pagamento",
      icon: "💰",
      questions: [
        {
          id: "q17",
          question: "Quais são as formas de pagamento aceitas?",
          answer: "Cartão de crédito: Visa, Mastercard, Elo, parcelamento até 12x. Transferências: PIX (instantâneo), TED/DOC, boleto. Pagamentos internacionais: PayPal, Wise, transferência bancária internacional. Transparência total: Sem taxas ocultas, impostos já inclusos."
        },
        {
          id: "q18",
          question: "Há custos ocultos ou taxas adicionais?",
          answer: "NÃO! Total transparência em todos os custos. Incluído no preço: Consultoria especializada, documentação, tradução juramentada, apostilamento, suporte durante todo o processo. Custos extras (informados claramente): Taxas consulares pagas diretamente ao governo, exames médicos."
        },
        {
          id: "q19",
          question: "Oferecem planos de pagamento ou parcelamento?",
          answer: "Sim! Várias opções flexíveis: Cartão: até 12x sem juros, Entrada + parcelas: 30% entrada + 6x no cartão, Plano estudante: Desconto 15% + 10x, Plano família: Desconto progressivo por pessoa. Consulte condições especiais para seu caso."
        },
        {
          id: "q20",
          question: "Como funciona a política de reembolso?",
          answer: "Garantia de satisfação: 7 dias para cancelamento sem custo, Reembolso por falha nossa: 100% se visto negado por erro em documentação/processo, Reembolso parcial: 50% se desistir após início do processo, Sem reembolso: negativa por informações falsas do cliente."
        }
      ]
    },
    {
      category: "Processo e Acompanhamento",
      icon: "⚡",
      questions: [
        {
          id: "q21",
          question: "Como acompanho o andamento do meu processo?",
          answer: "Portal exclusivo do cliente: Dashboard personalizado, atualizações em tempo real, histórico completo de documentos, calendário de prazos, chat direto com consultores. Notificações: WhatsApp, email, SMS. Transparência total no processo."
        },
        {
          id: "q22",
          question: "Posso falar com o mesmo consultor durante todo o processo?",
          answer: "Sim! Cada cliente tem um consultor principal designado: Especialista no seu tipo de caso, contato direto via WhatsApp/email, reuniões por vídeo quando necessário, backup por outro especialista (para continuidade), disponibilidade em horário comercial estendido."
        },
        {
          id: "q23",
          question: "E se meu visto for negado?",
          answer: "Suporte completo pós-negativa: Análise detalhada dos motivos, estratégia para nova aplicação, apoio psicológico/orientação, reembolso se erro foi nosso, desconto para reaplica��ão. Nossa taxa de sucesso na segunda tentativa: 96%."
        },
        {
          id: "q24",
          question: "Vocês ajudam com mudança e acomodação?",
          answer: "Sim! Pacote completo de relocação: Busca de moradia (casas/apartamentos), abertura de conta bancária, número fiscal/social, matrícula escolar para filhos, plano de saúde, networking profissional. Parcerias locais em 15+ países."
        }
      ]
    },
    {
      category: "Países Específicos",
      icon: "🌍",
      questions: [
        {
          id: "q25",
          question: "Como imigrar para o Canadá? Qual o melhor programa?",
          answer: "Programas principais: Express Entry (Federal), Provincial Nominee (PNP), Quebec Immigration, Start-up Visa, Self-employed. Mais popular: Express Entry. Pontuação mínima: 470-480 pts. Fatores: idade, educação, idioma, experiência. Tempo: 6-12 meses."
        },
        {
          id: "q26",
          question: "Portugal é uma boa opção para aposentados?",
          answer: "Excelente! Visto D7 ideal para aposentados: Renda mínima €760/mês, clima agradável, baixo custo de vida, sistema de saúde excelente, comunidade brasileira grande, fácil acesso à Europa. Impostos: Pode ser isento por 10 anos (regime NHR)."
        },
        {
          id: "q27",
          question: "Como conseguir visto americano depois de uma negativa?",
          answer: "Estratégia específica para reaplica��ão: Aguardar 6+ meses, fortalecer vínculos com Brasil, melhorar situação financeira, preparação intensiva para entrevista, nova narrativa/argumentação, documentação adicional. Taxa de sucesso pós-consultoria: 78%."
        },
        {
          id: "q28",
          question: "Austrália aceita profissionais da minha área?",
          answer: "Verificamos na lista oficial de ocupações (MLTSSL/STSOL): +400 profissões qualificadas, TI/Engenharia/Saúde em alta demanda, processo de reconhecimento por área, teste de inglês obrigatório, avaliação de skills. Consulta gratuita para verificação."
        }
      ]
    },
    {
      category: "Família e Dependentes",
      icon: "👨‍👩‍👧‍👦",
      questions: [
        {
          id: "q29",
          question: "Posso incluir minha família no processo de visto?",
          answer: "Sim! Políticas por país: Canadá: cônjuge + filhos menores inclusos no Express Entry, Estados Unidos: processo separado para família, Portugal: reunião familiar após 1 ano, Austrália: dependentes inclusos na aplicação. Custos adicionais aplicáveis."
        },
        {
          id: "q30",
          question: "Como funciona visto de reunião familiar?",
          answer: "Requisitos gerais: Comprovação de relacionamento, estabilidade financeira do residente, seguro saúde, acomodação adequada. Documentos: certidões, fotos, conversas, declarações. Processo: 6-18 meses. Taxa de aprovação: 91% com nossa consultoria."
        },
        {
          id: "q31",
          question: "Filhos maiores de idade podem ser incluídos?",
          answer: "Varia por país: Canadá: até 22 anos solteiros ou dependentes por deficiência, Estados Unidos: apenas menores ou casos especiais, Portugal: até 26 anos se estudantes, Austrália: até 23 anos dependentes. Documentação específica exigida."
        }
      ]
    },
    {
      category: "Negócios e Investimentos",
      icon: "💼",
      questions: [
        {
          id: "q32",
          question: "Como funciona o visto de investidor nos EUA (EB-5)?",
          answer: "EB-5 Investor Visa: Investimento mínimo US$ 800k-1M, criação de 10 empregos diretos/indiretos, residência permanente para família toda, caminho para cidadania em 5 anos. Áreas rurais: US$ 800k. Processo: 24-36 meses. ROI esperado: 2-6% ao ano."
        },
        {
          id: "q33",
          question: "Portugal Golden Visa ainda existe?",
          answer: "Sim, mas com mudanças (2023): Não aceita mais imóveis em Lisboa/Porto, foco em interior/ilhas, investimento mínimo €280k (imóveis) ou €500k (fundos), residência mínima 7 dias/ano, cidadania em 5 anos. Alternativas: D2 visa para empreendedores."
        },
        {
          id: "q34",
          question: "Posso abrir empresa no exterior sem visto?",
          answer: "Depende do país: Estados Unidos: Sim (LLC/Corporation), mas não pode trabalhar nela, Canadá: Sim, mas precisa de permissão para trabalhar, Portugal: Sim, mas visto D2 para ser sócio-gerente, Reino Unido: Sim, com restrições. Consultoria jurídica incluída."
        }
      ]
    },
    {
      category: "Suporte e Atendimento",
      icon: "🎧",
      questions: [
        {
          id: "q35",
          question: "Qual o horário de atendimento?",
          answer: "Atendimento estendido: Segunda a sexta: 8h às 20h, Sábados: 9h às 16h, Domingos: apenas emergências, Feriados: plantão reduzido. WhatsApp 24/7 para clientes ativos. Suporte internacional: adequado ao fuso horário do país de destino."
        },
        {
          id: "q36",
          question: "Oferecem atendimento em outros idiomas?",
          answer: "Sim! Idiomas disponíveis: Português (nativo), Inglês (fluente), Espanhol (fluente), Italiano (intermediário), Francês (básico). Parceiros nativos para: Alemão, mandarim, árabe. Tradução simultânea quando necessário."
        },
        {
          id: "q37",
          question: "Como é o suporte pós-aprovação do visto?",
          answer: "Suporte completo por 1 ano: Orientação para chegada ao país, checklist de primeiros passos, conexões locais (médicos, escolas, etc.), renovação de vistos/documentos, suporte para integração cultural. Comunidade exclusiva de clientes no exterior."
        }
      ]
    },
    {
      category: "Estudos no Exterior",
      icon: "🎓",
      questions: [
        {
          id: "q76",
          question: "Como conseguir visto de estudante para os Estados Unidos?",
          answer: "Visto F-1: Admissão em instituição aprovada pelo SEVIS, comprovação financeira (US$60-80k/ano), exame TOEFL/IELTS, entrevista consular. Documentos: I-20 da universidade, histórico escolar, carta de intenção. Processo: 2-6 meses."
        },
        {
          id: "q77",
          question: "Posso trabalhar durante os estudos no Canadá?",
          answer: "Sim! Study Permit permite: 20h/semana durante aulas, tempo integral nas férias, estágio co-op se no currículo, trabalho no campus sem restrições. Cônjuge pode trabalhar tempo integral. PGWP após graduação (1-3 anos)."
        },
        {
          id: "q78",
          question: "Austrália oferece bolsas de estudo para brasileiros?",
          answer: "Sim! Opções: Australia Awards (governo), universidades específicas (até 50% desconto), Research Training Program (pós-graduação), Endeavour Scholarships. Critérios: mérito acadêmico, necessidade financeira, área de estudo."
        },
        {
          id: "q79",
          question: "Como validar diploma brasileiro na Europa?",
          answer: "Processo varia: Portugal (reconhecimento automático), Alemanha (anabin database), França (ENIC-NARIC), Reino Unido (UK NARIC). Documentos: diploma apostilado, histórico, tradução juramentada, documentação adicional específica."
        },
        {
          id: "q80",
          question: "Quanto custa estudar medicina no exterior?",
          answer: "Custos anuais: Estados Unidos (US$50-70k), Canadá (CAD$40-60k), Austrália (AUD$60-80k), Portugal (€7-15k), Argentina (€3-8k). Inclui: mensalidade, moradia, alimentação, seguro, material. Financiamento disponível."
        }
      ]
    },
    {
      category: "Emergências e Situações Especiais",
      icon: "🚨",
      questions: [
        {
          id: "q81",
          question: "O que fazer se for detido na imigração?",
          answer: "Instruções: Mantenha calma, solicite tradutor se necessário, não assine nada sem entender, peça para contactar advogado/consulado brasileiro, coopere mas não forneça informações falsas. Temos plantão 24/7 para emergências."
        },
        {
          id: "q82",
          question: "Perdi meu passaporte no exterior, e agora?",
          answer: "Procedimentos: Registre BO na polícia local, vá ao consulado brasileiro com BO e documentos, solicite passaporte de emergência ou novo, atualize visto se necessário. Prazo: 3-10 dias úteis. Mantenha cópias digitais sempre."
        },
        {
          id: "q83",
          question: "Visto negado na véspera da viagem, tem solução?",
          answer: "Opções emergenciais: Recurso expedito (se aplicável), nova aplicação com documentação robustecida, reagendamento urgente, análise de erros na aplicação original. Suporte 24/7 para casos críticos. Taxa de reversão: 45%."
        },
        {
          id: "q84",
          question: "Como lidar com discriminação consular?",
          answer: "Procedimentos: Documente tudo, solicite supervisor, registre reclamação formal, contacte ombudsman consular, busque assistência legal. Protegemos direitos dos clientes. Canais: ouvidoria, advogados especializados."
        }
      ]
    },
    {
      category: "Aposentadoria e Golden Age",
      icon: "🏖️",
      questions: [
        {
          id: "q85",
          question: "Melhores países para aposentados brasileiros?",
          answer: "Top destinos: Portugal (D7, NHR), Espanha (qualidade vida), França (sistema saúde), Uruguai (proximidade), Panamá (Pensionado visa), Tailândia (custo baixo). Critérios: clima, custo vida, sistema saúde, comunidade brasileira."
        },
        {
          id: "q86",
          question: "Como transferir aposentadoria do INSS para o exterior?",
          answer: "Processo: Comunicar mudança ao INSS, manter CPF ativo, comprovar vida anualmente, usar conta no Brasil ou transferência internacional. Não perde benefício. Imposto de renda: varia por país/acordo bilateral."
        },
        {
          id: "q87",
          question: "Seguro saúde para idosos no exterior?",
          answer: "Opções: Seguro internacional premium, sistema público local (Portugal/França), planos binacionais, Medicare suplementar (EUA). Cobertura: emergências, consultas, medicamentos, internações. Idade limite varia por seguradora."
        },
        {
          id: "q88",
          question: "Portugal oferece benefícios fiscais para aposentados?",
          answer: "Regime NHR (Non-Habitual Resident): Isenção IR sobre aposentadorias estrangeiras por 10 anos, taxa fixa 20% sobre rendimentos portugueses, sem imposto sobre heranças/doações. Requisitos: residência fiscal em Portugal."
        }
      ]
    },
    {
      category: "Tecnologia e Profissionais de TI",
      icon: "💻",
      questions: [
        {
          id: "q89",
          question: "Alemanha Blue Card para profissionais de TI?",
          answer: "Blue Card EU: Salário mínimo €56.400 (TI: €43.992), diploma reconhecido, oferta de emprego, alemão básico (A1). Vantagens: residência permanente em 21 meses, família incluída, mobilidade UE. Processo: 2-4 meses."
        },
        {
          id: "q90",
          question: "Como conseguir visto H-1B para os EUA?",
          answer: "H-1B lottery: Empresa patrocinadora, diploma superior + experiência, salário prevalente, specialty occupation. Loteria anual (abril), 85k vistos/ano. Alternativas: L-1, O-1, EB-1. Preparação inicia 1 ano antes."
        },
        {
          id: "q91",
          question: "Canadá Express Entry para TI - como pontuar alto?",
          answer: "Estratégias: Melhorar inglês/francês (CLB 9+), mestrado/PhD, experiência gerencial, oferta de emprego (LMIA), estudo no Canadá, província nomination. Score competitivo: 470+ pontos. Consultoria personalizada incluída."
        },
        {
          id: "q92",
          question: "Austrália aceita desenvolvedores/programadores?",
          answer: "Sim! Lista MLTSSL: Software Engineer, Developer Programmer, ICT Analyst. Skills Assessment obrigatória (ACS). Requisitos: inglês proficiente, experiência relevante, educação reconhecida. Pathway: 189/190/491 visas."
        }
      ]
    },
    {
      category: "Saúde e Profissionais Médicos",
      icon: "⚕️",
      questions: [
        {
          id: "q93",
          question: "Como validar diploma médico no Canadá?",
          answer: "Processo rigoroso: Medical Council of Canada (MCC) exams, residência médica canadense, certificação provincial. Etapas: MCCEE → MCCQE → NAC-OSCE → residência → licença. Tempo: 3-7 anos. Consultoria especializada essencial."
        },
        {
          id: "q94",
          question: "Estados Unidos aceita médicos brasileiros?",
          answer: "Sim, via ECFMG: USMLE Steps 1, 2 e 3, residência médica americana (Match), licença estadual. Competitivo: apenas 50% dos médicos estrangeiros conseguem residência. Preparação: 2-4 anos de estudo."
        },
        {
          id: "q95",
          question: "Enfermeiros têm demanda internacional?",
          answer: "Alta demanda: Canadá, Austrália, Reino Unido, Alemanha, Irlanda. Requisitos: inglês fluente, exame de competência (NCLEX/OET), experiência mínima. Pathway facilitado, shortage occupation lists. Salários atrativos."
        },
        {
          id: "q96",
          question: "Como trabalhar como dentista na Europa?",
          answer: "União Europeia: Reconhecimento mútuo (Diretiva 2005/36), adaptação curricular se necessário, exame de idioma. Portugal facilita reconhecimento. Alemanha, França: período de adaptação. Reino Unido: GDC registration."
        }
      ]
    },
    {
      category: "Casos Complexos e Especiais",
      icon: "🔍",
      questions: [
        {
          id: "q97",
          question: "Tenho antecedentes criminais, posso imigrar?",
          answer: "Depende do país e crime: Crimes menores (multas): geralmente não impedem, crimes graves: análise caso a caso, reabilitação criminal disponível (alguns países), tempo desde o crime importa. Consultoria jurídica especializada obrigatória."
        },
        {
          id: "q98",
          question: "Como imigrar sendo portador de deficiência?",
          answer: "Direitos protegidos: Não pode haver discriminação, acomodações razoáveis obrigatórias, sistemas de suporte disponíveis. Países mais inclusivos: Canadá, Austrália, Reino Unido. Documentação médica detalhada necessária."
        },
        {
          id: "q99",
          question: "Sou menor de idade, posso imigrar sozinho?",
          answer: "Restrições significativas: Necessário guardian legal no país destino, autorização dos pais/justiça, acompanhamento de órgãos competentes. Exceções: estudos (com guardian), reunião familiar, refugiados. Processo jurídico complexo."
        },
        {
          id: "q100",
          question: "Como funciona imigração para pessoas LGBTQ+?",
          answer: "Considerações especiais: Países com proteção legal (Canadá, UE, Austrália), possibilidade de asilo em casos de perseguição, reconhecimento de relacionamentos same-sex, comunidades de apoio disponíveis. Consultoria sensível ao tema."
        }
      ]
    }
  ]

  // Função de busca e filtro

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      (selectedCategory === 'all' || category.category === selectedCategory) &&
      (searchTerm === '' ||
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })).filter(category => category.questions.length > 0)

  const totalQuestions = faqData.reduce((acc, cat) => acc + cat.questions.length, 0)
  const categoriesList = ['all', ...faqData.map(cat => cat.category)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      <div className="page-content py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Central de Ajuda
              <span className="block text-blue-600">FAQ Completo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Mais de {totalQuestions} respostas detalhadas sobre imigração, vistos, cidadania e todos nossos serviços especializados.
              Encontre tudo que precisa saber para sua jornada internacional.
            </p>

            {/* Stats Pills */}
            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar perguntas, respostas ou categorias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-80">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-4 px-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="all">📚 Todas as Categorias</option>
                  {faqData.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.icon} {cat.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800">
                      {filteredFAQ.reduce((acc, cat) => acc + cat.questions.length, 0)} resultado(s) encontrado(s)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={index}
                  href={link.url}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 group-hover:bg-blue-600 p-3 rounded-lg transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{link.title}</h3>
                      <p className="text-sm text-gray-600">{link.description}</p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="flex-1">
                      <div>{category.category}</div>
                      <div className="text-blue-200 text-sm mt-1">
                        {category.questions.length} pergunta{category.questions.length !== 1 ? 's' : ''} disponível{category.questions.length !== 1 ? 'is' : ''}
                      </div>
                    </div>
                    <span className="bg-white/20 px-3 py-2 rounded-lg text-sm">
                      {category.questions.length}
                    </span>
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq) => {
                    const isOpen = openItems[faq.id] || false

                    return (
                      <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full text-left flex items-start justify-between group"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`mt-1 p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'}`}>
                              <HelpCircle className={`h-4 w-4 transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                            </div>
                            <h3 className={`text-lg font-semibold pr-4 transition-colors leading-relaxed ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                              {faq.question}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            {isOpen ? (
                              <ChevronUp className="h-6 w-6 text-blue-600" />
                            ) : (
                              <ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-6 ml-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                              <p className="text-gray-800 leading-relaxed text-lg">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQ.length === 0 && (
            <div className="text-center py-16">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
              <p className="text-gray-600 mb-6">Tente usar outros termos de busca ou entre em contato conosco.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ainda tem dúvidas?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Nossa equipe de especialistas está disponível 24/7 para esclarecer todas suas questões.
                Mais de 15.000 clientes satisfeitos confiam em nossos serviços.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="https://wa.me/551151971375"
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  WhatsApp Direto
                </a>

                <a
                  href="/consultoria-ia"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Zap className="h-6 w-6" />
                  IA Consultoria Grátis
                </a>

                <a
                  href="tel:+551151971375"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Phone className="h-6 w-6" />
                  Ligar Agora
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Resposta em minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>5 estrelas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}