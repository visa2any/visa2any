export interface EntityData {
    slug: string
    title: string
    description: string
    content: string
    faq: { question: string; answer: string }[]
}

export const entities: Record<string, EntityData> = {
    'ds-160': {
        slug: 'ds-160',
        title: 'O Que é o Formulário DS-160?',
        description: 'Definição técnica do formulário DS-160, base do processo de visto americano.',
        content: `
  # Definição Técnica
  O **DS-160 (Online Nonimmigrant Visa Application)** é o formulário eletrônico obrigatório do Departamento de Estado dos EUA para solicitantes de vistos de não-imigrante (como turismo, negócios e estudos). Ele coleta dados biográficos, criminais e de segurança, servindo como a base primária para a decisão consular.
  
  ### Detalhes Técnicos
  *   **Emissor:** U.S. Department of State (Consular Affairs).
  *   **Plataforma:** CEAC (Consular Electronic Application Center).
  *   **Idioma Oficial:** Inglês (perguntas podem ter tradução auxiliar).
  *   **Validade:** A página de confirmação é válida enquanto os dados forem precisos.
  
  ### Relação com o Visto Americano
  O DS-160 é a "coluna vertebral" do pedido. A entrevista consular é, na prática, uma verificação da veracidade e consistência das informações inseridas neste formulário. Erros aqui são fatais e geram negativas imediatas.
      `,
        faq: [
            { question: "O DS-160 pode ser editado?", answer: "Não após o envio (submit). É necessário criar um novo formulário se houver erros." },
            { question: "Preciso imprimir tudo?", answer: "Não, apenas a página de confirmação com o código de barras." }
        ]
    },
    'ina-214b': {
        slug: 'ina-214b',
        title: 'O Que é a Seção 214(b) da Lei de Imigração (INA)?',
        description: 'Explicação técnica sobre a lei INA 214(b), principal motivo de negativa de vistos.',
        content: `
  # Definição Técnica
  A **Seção 214(b) da Lei de Imigração e Nacionalidade (INA)** é a norma jurídica dos EUA que estabelece a presunção de intenção de imigrar. Ela determina que todo solicitante de visto de não-imigrante é, por padrão, um potencial imigrante ilegal, a menos que prove satisfatoriamente possuir vínculos fortes com seu país de origem.
  
  ### Detalhes Técnicos
  *   **Natureza:** Presunção legal refutável.
  *   **Aplicação:** Vistos de turista (B), estudante (F) e intercâmbio (J).
  *   **Consequência:** Negativa do visto sem direito a recurso judicial imediato.
  
  ### Relação com o Visto Americano
  É a causa número 1 de recusas no Brasil. Não se trata de uma penalidade permanente, mas de uma avaliação de momento sobre o perfil socioeconômico do solicitante.
      `,
        faq: [
            { question: "A negativa 214(b) é para sempre?", answer: "Não. Você pode solicitar o visto novamente se sua situação mudar." },
            { question: "O consulado explica o motivo?", answer: "Raramente. A carta entregue é um modelo padrão citando a lei." }
        ]
    },
    'sevis': {
        slug: 'sevis',
        title: 'O Que é o Sistema SEVIS?',
        description: 'Entenda o SEVIS, sistema obrigatório para vistos de estudante e intercâmbio nos EUA.',
        content: `
  # Definição Técnica
  O **SEVIS (Student and Exchange Visitor Information System)** é o banco de dados do Departamento de Segurança Interna (DHS) usado para monitorar estudantes (F/M) e intercambistas (J) nos Estados Unidos. Ele conecta as instituições de ensino e programas ao governo para garantir o status legal.
  
  ### Detalhes Técnicos
  *   **Taxa I-901:** Taxa obrigatória paga ao DHS antes da entrevista.
  *   **Documento Vinculado:** I-20 (estudantes) ou DS-2019 (intercambistas).
  *   **Status:** Deve estar "Active" para entrada nos EUA.
      `,
        faq: [
            { question: "Quanto custa a taxa SEVIS?", answer: "Varia conforme a categoria (geralmente US$ 350 para F1)." },
            { question: "Tem validade?", answer: "Sim, vale por 12 meses a partir do pagamento se o visto não for concedido." }
        ]
    },
    'cbp': {
        slug: 'cbp',
        title: 'O Que é o CBP (Customs and Border Protection)?',
        description: 'Saiba o papel do CBP na imigração americana e sua autoridade nos aeroportos.',
        content: `
  # Definição Técnica
  A **U.S. Customs and Border Protection (CBP)** é a agência federal responsável pelo controle das fronteiras. Enquanto o Departamento de Estado emite o visto, é o CBP que decide, no aeroporto, se o viajante pode entrar (Admissão) e por quanto tempo (Permanência).
  
  ### Detalhes Técnicos
  *   **Função:** Inspeção de imigração, alfândega e agricultura.
  *   **Poder:** Pode cancelar vistos e deportar viajantes na fronteira.
  *   **Instrumento:** Formulário I-94 (Registro de Chegada/Partida).
       `,
        faq: [
            { question: "O oficial pode negar entrada com visto válido?", answer: "Sim, se houver suspeita de fraude ou intenção imigratória." },
            { question: "Podem revistar celular?", answer: "Sim, na fronteira a privacidade é reduzida." }
        ]
    },
    'visto-b1-b2': {
        slug: 'visto-b1-b2',
        title: 'O Que é o Visto B1/B2?',
        description: 'Definição do visto B1/B2 para turismo e negócios nos EUA.',
        content: `
  # Definição Técnica
  O **Visto B1/B2** é uma categoria combinada de não-imigrante para visitantes temporários a negócios (B1) ou turismo/prazer (B2). É o tipo mais comum emitido para brasileiros, geralmente com validade de 10 anos.
  
  ### Detalhes Técnicos
  *   **B1 (Negócios):** Reuniões, consultorias, conferências.
  *   **B2 (Turismo):** Férias, visitas a parentes, tratamento médico.
  *   **Proibido:** Trabalho remunerado (fonte EUA) e estudo acadêmico.
       `,
        faq: [
            { question: "Posso estudar inglês com visto de turista?", answer: "Apenas cursos curtos e recreativos (menos de 18h semanais)." },
            { question: "Posso procurar emprego?", answer: "Pode ir a entrevistas, mas não pode começar a trabalhar." }
        ]
    },
    'processo-administrativo': {
        slug: 'processo-administrativo',
        title: 'O Que é Processo Administrativo (221g)?',
        description: 'Entenda o Administrative Processing no pedido de visto americano.',
        content: `
  # Definição Técnica
  O **Processo Administrativo (Seção 221g)** ocorre quando o oficial consular precisa de mais informações para decidir sobre o visto. O pedido fica "pendente" para verificação de segurança adicional ou validação de documentos.
  
  ### Detalhes Técnicos
  *   **Duração:** Indeterminada (média de 60 dias).
  *   **Ação:** Aguardar ou enviar documentos solicitados.
       `,
        faq: [
            { question: "Posso acelerar o processo?", answer: "Não existe taxa de urgência para verificações de segurança." }
        ]
    }
}
