const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const newBlogPosts = [
  {
    id: 'reino-unido-novo-sistema-pontos-2024',
    title: '🇬🇧 Reino Unido Lança Novo Sistema de Pontos para Trabalhadores Qualificados',
    excerpt: 'O governo britânico anunciou mudanças significativas no sistema de pontos para trabalhadores qualificados, oferecendo novas oportunidades para profissionais de tecnologia e saúde.',
    content: `
      <h2>Principais Mudanças no Sistema de Pontos</h2>
      <p>O Reino Unido implementou um novo sistema de pontos que beneficia especialmente profissionais das áreas de tecnologia, saúde e engenharia. As mudanças entram em vigor em março de 2024.</p>
      
      <h3>Profissões em Alta Demanda</h3>
      <ul>
        <li><strong>Desenvolvedores de Software:</strong> 70 pontos automáticos</li>
        <li><strong>Enfermeiros:</strong> 60 pontos + bônus de £2,000</li>
        <li><strong>Engenheiros:</strong> 65 pontos</li>
        <li><strong>Professores:</strong> 55 pontos</li>
      </ul>
      
      <h3>Requisitos Mínimos</h3>
      <p>Para se qualificar, candidatos precisam de:</p>
      <ul>
        <li>Mínimo de 70 pontos</li>
        <li>Oferta de trabalho confirmada</li>
        <li>Inglês nível B2</li>
        <li>Salário mínimo de £26,200/ano</li>
      </ul>
      
      <blockquote>
        <p>"Esta é uma oportunidade histórica para profissionais brasileiros se estabelecerem no Reino Unido com condições favoráveis." - Sarah Johnson, Consultor de Imigração</p>
      </blockquote>
      
      <h3>Como Aplicar</h3>
      <ol>
        <li>Obtenha uma oferta de trabalho qualificada</li>
        <li>Comprove proficiência em inglês</li>
        <li>Submeta aplicação online</li>
        <li>Aguarde processamento (6-8 semanas)</li>
      </ol>
    `,
    category: 'Vistos Europa',
    author: 'Ana British',
    authorImage: null,
    publishDate: new Date('2024-01-15').toISOString(),
    readTime: '7 min',
    featured: true,
    trending: true,
    urgent: false,
    tags: ['Reino Unido', 'Sistema de Pontos', 'Trabalhadores Qualificados', 'Tecnologia', 'Saúde'],
    country: 'Reino Unido',
    flag: '🇬🇧',
    views: 8500,
    likes: 320,
    comments: 45,
    difficulty: 'Intermediário',
    type: 'Notícia',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop'

    videoUrl: null,
    sponsored: false,
    published: true
  },
  {
    id: 'australia-working-holiday-visa-2024',
    title: '🇦🇺 Austrália Expande Programa Working Holiday Visa para Brasileiros',
    excerpt: 'O governo australiano anunciou a expansão do programa Working Holiday Visa, aumentando o limite de idade e oferecendo mais oportunidades de trabalho para jovens brasileiros.',
    content: `
      <h2>Expansão do Working Holiday Visa</h2>
      <p>A Austrália expandiu significativamente seu programa Working Holiday Visa (subclasse 417), oferecendo mais oportunidades para brasileiros entre 18 e 35 anos.</p>
      
      <h3>Principais Mudanças</h3>
      <ul>
        <li><strong>Limite de idade:</strong> Aumentado de 30 para 35 anos</li>
        <li><strong>Duração:</strong> Até 3 anos (com extensões)</li>
        <li><strong>Trabalho:</strong> Sem restrição de empregador após 6 meses</li>
        <li><strong>Estudo:</strong> Até 4 meses de curso</li>
      </ul>
      
      <h3>Setores com Demanda</h3>
      <table>
        <tr><th>Setor</th><th>Salário Médio/hora</th><th>Demanda</th></tr>
        <tr><td>Agricultura</td><td>AUD $25</td><td>Alta</td></tr>
        <tr><td>Hospitalidade</td><td>AUD $23</td><td>Muito Alta</td></tr>
        <tr><td>Construção</td><td>AUD $30</td><td>Alta</td></tr>
        <tr><td>Cuidados</td><td>AUD $28</td><td>Média</td></tr>
      </table>
      
      <h3>Processo de Aplicação</h3>
      <p>O processo foi simplificado e agora pode ser feito 100% online:</p>
      <ol>
        <li>Aplicação online (AUD $485)</li>
        <li>Exames médicos (se necessário)</li>
        <li>Comprovação financeira (AUD $5,000)</li>
        <li>Processamento: 15-30 dias</li>
      </ol>
      
      <div class="alert alert-success">
        <strong>Dica:</strong> Aplique entre março e maio para melhores oportunidades de trabalho durante o inverno australiano.
      </div>
    `,
    category: 'Vistos Trabalho',
    author: 'Carlos Aussie',
    publishDate: new Date('2024-01-12').toISOString(),
    readTime: '6 min',
    featured: false,
    trending: true,
    urgent: false,
    tags: ['Austrália', 'Working Holiday', 'Jovens', 'Trabalho', 'Intercâmbio'],
    country: 'Austrália',
    flag: '🇦🇺',
    views: 6200,
    likes: 280,
    comments: 35,
    difficulty: 'Iniciante',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&h=600&fit=crop'

    published: true
  },
  {
    id: 'alemanha-visa-azul-tecnologia-2024',
    title: '🇩🇪 Alemanha Facilita Visto Azul para Profissionais de Tecnologia',
    excerpt: 'Nova regulamentação alemã reduz requisitos salariais e acelera o processo para profissionais de TI, oferecendo caminho rápido para residência permanente.',
    content: `
      <h2>Visto Azul Alemão: Novas Facilidades</h2>
      <p>A Alemanha revolucionou seu sistema de Visto Azul (EU Blue Card) para atrair mais profissionais de tecnologia, com requisitos reduzidos e processo acelerado.</p>
      
      <h3>Requisitos Reduzidos para TI</h3>
      <ul>
        <li><strong>Salário mínimo:</strong> €43,800/ano (antes €56,800)</li>
        <li><strong>Experiência:</strong> 2 anos (antes 5 anos)</li>
        <li><strong>Alemão:</strong> Não obrigatório inicialmente</li>
        <li><strong>Reconhecimento:</strong> Diploma brasileiro aceito</li>
      </ul>
      
      <h3>Profissões Priorizadas</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4>Desenvolvimento</h4>
          <ul>
            <li>Full Stack Developer</li>
            <li>DevOps Engineer</li>
            <li>Mobile Developer</li>
            <li>Frontend/Backend</li>
          </ul>
        </div>
        <div>
          <h4>Dados & IA</h4>
          <ul>
            <li>Data Scientist</li>
            <li>Machine Learning</li>
            <li>Cloud Architect</li>
            <li>Cybersecurity</li>
          </ul>
        </div>
      </div>
      
      <h3>Timeline para Residência</h3>
      <ul>
        <li><strong>21 meses:</strong> Residência permanente (com alemão B1)</li>
        <li><strong>33 meses:</strong> Residência permanente (sem alemão)</li>
        <li><strong>5 anos:</strong> Cidadania alemã (nova lei)</li>
      </ul>
      
      <h3>Benefícios Inclusos</h3>
      <ul>
        <li>Sistema de saúde público</li>
        <li>Educação gratuita para filhos</li>
        <li>Licença maternidade/paternidade</li>
        <li>30 dias de férias anuais</li>
      </ul>
    `,
    category: 'Vistos Europa',
    author: 'Hans Mueller',
    publishDate: new Date('2024-01-10').toISOString(),
    readTime: '8 min',
    featured: true,
    trending: false,
    urgent: true,
    tags: ['Alemanha', 'Visto Azul', 'Tecnologia', 'TI', 'Residência Permanente'],
    country: 'Alemanha',
    flag: '🇩🇪',
    views: 9800,
    likes: 450,
    comments: 67,
    difficulty: 'Avançado',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=600&fit=crop'

    published: true
  },
  {
    id: 'portugal-d7-visa-nomades-digitais',
    title: '🇵🇹 Portugal Lança Visto D7 Especial para Nômades Digitais',
    excerpt: 'O novo visto D7 de Portugal foi redesenhado especificamente para atrair nômades digitais e freelancers, com requisitos financeiros reduzidos.',
    content: `
      <h2>Visto D7: A Nova Era dos Nômades Digitais</h2>
      <p>Portugal lançou uma versão especial do visto D7, especificamente desenhada para nômades digitais, freelancers e empreendedores remotos.</p>
      
      <h3>Requisitos Simplificados</h3>
      <ul>
        <li><strong>Renda mínima:</strong> €760/mês (1 salário mínimo)</li>
        <li><strong>Comprovação:</strong> Últimos 6 meses</li>
        <li><strong>Reserva:</strong> €5,000 em conta bancária</li>
        <li><strong>Seguro saúde:</strong> Obrigatório</li>
      </ul>
      
      <h3>Tipos de Trabalho Aceitos</h3>
      <table class="w-full">
        <tr><th>Categoria</th><th>Exemplos</th><th>Documentação</th></tr>
        <tr><td>Freelancer</td><td>Design, Programação, Marketing</td><td>Contratos/Faturas</td></tr>
        <tr><td>Remoto</td><td>Funcionário de empresa estrangeira</td><td>Carta do empregador</td></tr>
        <tr><td>Empreendedor</td><td>E-commerce, SaaS, Consultoria</td><td>Registro da empresa</td></tr>
      </table>
      
      <h3>Vantagens do D7</h3>
      <ul>
        <li>🏠 <strong>Habitação:</strong> Preços acessíveis fora de Lisboa/Porto</li>
        <li>💰 <strong>Impostos:</strong> NHR (0-20% por 10 anos)</li>
        <li>🌍 <strong>Schengen:</strong> Livre circulação na Europa</li>
        <li>🏥 <strong>Saúde:</strong> SNS (sistema público)</li>
        <li>🎓 <strong>Educação:</strong> Escolas públicas gratuitas</li>
      </ul>
      
      <h3>Cidades Recomendadas</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <h4>🏖️ Lifestyle</h4>
          <ul>
            <li>Lagos (Algarve)</li>
            <li>Cascais</li>
            <li>Óbidos</li>
          </ul>
        </div>
        <div>
          <h4>🏢 Negócios</h4>
          <ul>
            <li>Lisboa</li>
            <li>Porto</li>
            <li>Braga</li>
          </ul>
        </div>
        <div>
          <h4>💰 Custo-Benefício</h4>
          <ul>
            <li>Coimbra</li>
            <li>Aveiro</li>
            <li>Viseu</li>
          </ul>
        </div>
      </div>
      
      <h3>Processo de Aplicação</h3>
      <ol>
        <li><strong>Documentação:</strong> Reúna todos os documentos (2-3 semanas)</li>
        <li><strong>Agendamento:</strong> Consulado português no Brasil</li>
        <li><strong>Entrevista:</strong> Apresentação do caso (30 min)</li>
        <li><strong>Processamento:</strong> 60-90 dias</li>
        <li><strong>Viagem:</strong> Entrada em Portugal em até 6 meses</li>
      </ol>
    `,
    category: 'Vistos Europa',
    author: 'Maria Portuguese',
    publishDate: new Date('2024-01-08').toISOString(),
    readTime: '9 min',
    featured: false,
    trending: true,
    urgent: false,
    tags: ['Portugal', 'D7', 'Nômades Digitais', 'Freelancer', 'Remoto'],
    country: 'Portugal',
    flag: '🇵🇹',
    views: 12400,
    likes: 520,
    comments: 89,
    difficulty: 'Intermediário',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=600&fit=crop'

    published: true
  },
  {
    id: 'franca-talent-passport-desenvolvedores',
    title: '🇫🇷 França Cria "Talent Passport" Especial para Desenvolvedores',
    excerpt: 'O governo francês lançou um visto especial para desenvolvedores e profissionais de tecnologia, oferecendo processo acelerado e benefícios exclusivos.',
    content: `
      <h2>Talent Passport: O Visto dos Sonhos para Devs</h2>
      <p>A França criou o "Talent Passport", um visto especial que oferece um caminho simplificado para desenvolvedores e profissionais de tecnologia se estabelecerem no país.</p>
      
      <h3>Modalidades do Talent Passport</h3>
      <ul>
        <li><strong>Empresa Inovadora:</strong> Para funcionários de startups</li>
        <li><strong>Profissão Qualificada:</strong> Para especialistas em TI</li>
        <li><strong>Projeto Econômico:</strong> Para empreendedores tech</li>
        <li><strong>Investidor:</strong> Para investimento em tecnologia</li>
      </ul>
      
      <h3>Requisitos para Desenvolvedores</h3>
      <table>
        <tr><th>Critério</th><th>Requisito</th><th>Comprovação</th></tr>
        <tr><td>Experiência</td><td>3+ anos</td><td>LinkedIn + Portfolio</td></tr>
        <tr><td>Salário</td><td>€53,836/ano</td><td>Oferta de trabalho</td></tr>
        <tr><td>Formação</td><td>Superior ou equivalente</td><td>Diploma + certificações</td></tr>
        <tr><td>Francês</td><td>Não obrigatório</td><td>-</td></tr>
      </table>
      
      <h3>Tecnologias em Alta Demanda</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4>🔥 Mais Procuradas</h4>
          <ul>
            <li>React/Vue.js - €60k-80k</li>
            <li>Python/Django - €55k-75k</li>
            <li>Java/Spring - €58k-78k</li>
            <li>Node.js - €55k-70k</li>
          </ul>
        </div>
        <div>
          <h4>🚀 Emergentes</h4>
          <ul>
            <li>AI/Machine Learning - €70k-100k</li>
            <li>Blockchain - €65k-85k</li>
            <li>DevOps/Cloud - €60k-80k</li>
            <li>Cybersecurity - €65k-90k</li>
          </ul>
        </div>
      </div>
      
      <h3>Benefícios Exclusivos</h3>
      <ul>
        <li>🚀 <strong>Processo rápido:</strong> 8 semanas vs. 6 meses</li>
        <li>👨‍👩‍👧‍👦 <strong>Família incluída:</strong> Cônjuge e filhos automaticamente</li>
        <li>🏃‍♂️ <strong>Mobilidade:</strong> Trabalhar em qualquer empresa</li>
        <li>🎯 <strong>Renovação simples:</strong> Online, sem burocracia</li>
        <li>🇫🇷 <strong>Residência:</strong> Caminho direto em 5 anos</li>
      </ul>
      
      <h3>Melhores Cidades para Tech</h3>
      <ol>
        <li><strong>Paris:</strong> Hub principal, salários altos, custo elevado</li>
        <li><strong>Lyon:</strong> Crescimento rápido, custo médio</li>
        <li><strong>Toulouse:</strong> Aeroespacial + tech, qualidade de vida</li>
        <li><strong>Nantes:</strong> Startup scene vibrante, custo baixo</li>
        <li><strong>Nice:</strong> Clima mediterrâneo, empresas americanas</li>
      </ol>
      
      <div class="alert alert-info">
        <strong>Dica da Expert:</strong> A França oferece 35h semanais, 5 semanas de férias e excelente work-life balance. Ideal para quem busca qualidade de vida!
      </div>
    `,
    category: 'Vistos Europa',
    author: 'Pierre Developer',
    publishDate: new Date('2024-01-05').toISOString(),
    readTime: '10 min',
    featured: true,
    trending: false,
    urgent: false,
    tags: ['França', 'Talent Passport', 'Desenvolvedores', 'Tecnologia', 'Startups'],
    country: 'França',
    flag: '🇫🇷',
    views: 7300,
    likes: 380,
    comments: 52,
    difficulty: 'Avançado',
    type: 'Análise',
    imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop'

    published: true
  },
  {
    id: 'italia-decreto-flussi-2024-oportunidades',
    title: '🇮🇹 Itália Abre 450.000 Vagas no Decreto Flussi 2024',
    excerpt: 'O Decreto Flussi 2024 da Itália oferece oportunidades históricas para trabalhadores brasileiros, com foco em setores como turismo, agricultura e cuidados.',
    content: `
      <h2>Decreto Flussi 2024: Oportunidade Histórica</h2>
      <p>A Itália anunciou o Decreto Flussi 2024, abrindo 450.000 vagas para trabalhadores estrangeiros em diversos setores da economia italiana.</p>
      
      <h3>Distribuição de Vagas por Setor</h3>
      <table class="w-full">
        <tr><th>Setor</th><th>Vagas</th><th>Tipo</th><th>Salário Médio</th></tr>
        <tr><td>Turismo/Hotelaria</td><td>150.000</td><td>Sazonal</td><td>€1.200-1.800</td></tr>
        <tr><td>Agricultura</td><td>110.000</td><td>Sazonal</td><td>€1.100-1.500</td></tr>
        <tr><td>Cuidados (Colf/Badanti)</td><td>90.000</td><td>Anual</td><td>€1.000-1.400</td></tr>
        <tr><td>Construção</td><td>60.000</td><td>Anual</td><td>€1.300-1.900</td></tr>
        <tr><td>Transporte</td><td>40.000</td><td>Anual</td><td>€1.400-2.000</td></tr>
      </table>
      
      <h3>Requisitos Gerais</h3>
      <ul>
        <li><strong>Idade:</strong> 18-65 anos</li>
        <li><strong>Educação:</strong> Ensino fundamental completo</li>
        <li><strong>Saúde:</strong> Atestado médico</li>
        <li><strong>Antecedentes:</strong> Certidão criminal limpa</li>
        <li><strong>Italiano:</strong> Básico (A2) preferencial</li>
      </ul>
      
      <h3>Documentos Necessários</h3>
      <ol>
        <li>Passaporte válido (mín. 6 meses)</li>
        <li>Certidão de nascimento apostilada</li>
        <li>Certidão criminal brasileira e italiana</li>
        <li>Comprovante de escolaridade</li>
        <li>Experiência profissional (se aplicável)</li>
        <li>Certificado de italiano (se houver)</li>
      </ol>
      
      <h3>Timeline do Processo</h3>
      <ul>
        <li><strong>Fevereiro 2024:</strong> Abertura das inscrições online</li>
        <li><strong>Março-Abril:</strong> Seleção e matching com empregadores</li>
        <li><strong>Maio-Junho:</strong> Emissão de vistos</li>
        <li><strong>Junho-Julho:</strong> Chegada e início do trabalho</li>
      </ul>
      
      <h3>Regiões com Mais Oportunidades</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <h4>🏖️ Sul (Turismo)</h4>
          <ul>
            <li>Sicília</li>
            <li>Campania</li>
            <li>Puglia</li>
            <li>Calabria</li>
          </ul>
        </div>
        <div>
          <h4>🏭 Norte (Indústria)</h4>
          <ul>
            <li>Lombardia</li>
            <li>Veneto</li>
            <li>Emilia-Romagna</li>
            <li>Piemonte</li>
          </ul>
        </div>
        <div>
          <h4>🌾 Centro (Agricultura)</h4>
          <ul>
            <li>Toscana</li>
            <li>Lazio</li>
            <li>Marche</li>
            <li>Abruzzo</li>
          </ul>
        </div>
      </div>
      
      <h3>Benefícios do Programa</h3>
      <ul>
        <li>🏠 Alojamento fornecido pelo empregador</li>
        <li>🍝 Refeições incluídas</li>
        <li>🚌 Transporte local</li>
        <li>📄 Permesso di Soggiorno garantido</li>
        <li>🇪🇺 Possibilidade de visto familiar</li>
      </ul>
      
      <div class="alert alert-warning">
        <strong>Atenção:</strong> As inscrições abrem por poucas horas e se esgotam rapidamente. Tenha todos os documentos prontos!
      </div>
    `,
    category: 'Vistos Europa',
    author: 'Giuseppe Italian',
    publishDate: new Date('2024-01-03').toISOString(),
    readTime: '8 min',
    featured: false,
    trending: true,
    urgent: true,
    tags: ['Itália', 'Decreto Flussi', 'Trabalho Sazonal', 'Agricultura', 'Turismo'],
    country: 'Itália',
    flag: '🇮🇹',
    views: 15600,
    likes: 680,
    comments: 134,
    difficulty: 'Intermediário',
    type: 'Notícia',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=600&fit=crop'

    published: true
  },
  {
    id: 'espanha-programa-arraigo-social-facilitado',
    title: '🇪🇸 Espanha Facilita Arraigo Social para Brasileiros em 2024',
    excerpt: 'Nova regulamentação espanhola simplifica o processo de Arraigo Social, reduzindo tempo de residência e facilitando comprovação de vínculos sociais.',
    content: `
      <h2>Arraigo Social: Novas Facilidades</h2>
      <p>A Espanha implementou mudanças significativas no processo de Arraigo Social, tornando mais acessível para brasileiros que já residem no país.</p>
      
      <h3>Mudanças Principais</h3>
      <ul>
        <li><strong>Tempo de residência:</strong> Reduzido de 3 para 2 anos</li>
        <li><strong>Comprovação:</strong> Padrón aceito como prova principal</li>
        <li><strong>Vínculos sociais:</strong> Critérios flexibilizados</li>
        <li><strong>Processamento:</strong> Prazo reduzido para 6 meses</li>
      </ul>
      
      <h3>Requisitos Atualizados</h3>
      <table>
        <tr><th>Critério</th><th>Antigo</th><th>Novo</th></tr>
        <tr><td>Tempo no país</td><td>3 anos</td><td>2 anos</td></tr>
        <tr><td>Vínculos sociais</td><td>2 relatórios</td><td>1 relatório</td></tr>
        <tr><td>Contrato trabalho</td><td>1 ano</td><td>6 meses</td></tr>
        <tr><td>Antecedentes</td><td>UE + Brasil</td><td>Apenas Espanha</td></tr>
      </table>
      
      <h3>Documentação Necessária</h3>
      <ol>
        <li><strong>Padrón histórico:</strong> Comprovando 2 anos de residência</li>
        <li><strong>Relatório de arraigo:</strong> De ONG ou administração pública</li>
        <li><strong>Pré-contrato:</strong> Mínimo 6 meses, 30h semanais</li>
        <li><strong>Antecedentes criminais:</strong> Espanha e países de residência</li>
        <li><strong>Seguro médico:</strong> Público ou privado</li>
      </ol>
      
      <h3>Como Conseguir Vínculos Sociais</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4>📋 Organizações que emitem relatórios</h4>
          <ul>
            <li>Cruz Roja</li>
            <li>Cáritas</li>
            <li>ACCEM</li>
            <li>Ayuntamientos</li>
            <li>ONGs locais</li>
          </ul>
        </div>
        <div>
          <h4>🤝 Atividades que ajudam</h4>
          <ul>
            <li>Voluntariado</li>
            <li>Cursos de espanhol</li>
            <li>Participação comunitária</li>
            <li>Atividades esportivas</li>
            <li>Grupos religiosos</li>
          </ul>
        </div>
      </div>
      
      <h3>Setores com Demanda de Trabalho</h3>
      <ul>
        <li>🍽️ <strong>Hostelería:</strong> Garçons, cozinheiros, limpeza (€1.200-1.600)</li>
        <li>🏗️ <strong>Construção:</strong> Pedreiros, pintores, eletricistas (€1.400-1.800)</li>
        <li>👶 <strong>Cuidados:</strong> Cuidadores, limpeza doméstica (€1.000-1.300)</li>
        <li>🚚 <strong>Logística:</strong> Motoristas, operadores (€1.300-1.700)</li>
        <li>🛒 <strong>Comércio:</strong> Vendedores, repositores (€1.200-1.500)</li>
      </ul>
      
      <h3>Processo Passo a Passo</h3>
      <ol>
        <li><strong>Preparação (2-3 meses):</strong> Reunir documentos e conseguir relatório</li>
        <li><strong>Pré-contrato:</strong> Negociar com empregador interessado</li>
        <li><strong>Solicitação:</strong> Apresentar na Oficina de Extranjería</li>
        <li><strong>Aguardar:</strong> Resolução em até 6 meses</li>
        <li><strong>Aprovação:</strong> Retirar tarjeta de residencia</li>
      </ol>
      
      <h3>Dicas para Sucesso</h3>
      <ul>
        <li>📝 Mantenha Padrón sempre atualizado</li>
        <li>🤝 Construa vínculos sociais desde a chegada</li>
        <li>💼 Network profissional ativo</li>
        <li>📚 Aprenda espanhol formalmente</li>
        <li>📄 Guarde todos os comprovantes</li>
      </ul>
      
      <div class="alert alert-success">
        <strong>Boa notícia:</strong> Com Arraigo Social aprovado, você pode solicitar residência para familiares diretos após 1 ano!
      </div>
    `,
    category: 'Vistos Europa',
    author: 'Carmen Spanish',
    publishDate: new Date('2024-01-01').toISOString(),
    readTime: '9 min',
    featured: false,
    trending: false,
    urgent: false,
    tags: ['Espanha', 'Arraigo Social', 'Residência', 'Legalização', 'Vínculos Sociais'],
    country: 'Espanha',
    flag: '🇪🇸',
    views: 11200,
    likes: 490,
    comments: 78,
    difficulty: 'Avançado',
    type: 'Guia',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop'

    published: true
  }
]

async function addNewPosts() {
  console.log('🚀 Adicionando novos posts ao blog...')
  
  try {
    for (const post of newBlogPosts) {
      // Verificar se o post já existe
      const existingPost = await prisma.blogPost.findFirst({
        where: { id: post.id }
      })
      
      if (existingPost) {
        console.log(`⚠️  Post já existe: ${post.title}`)
        continue
      }
      
      // Criar novo post
      await prisma.blogPost.create({
        data: post
      })
      
      console.log(`✅ Post adicionado: ${post.title}`)
    }
    
    console.log('🎉 Todos os novos posts foram adicionados com sucesso!')
    
    // Mostrar estatísticas
    const totalPosts = await prisma.blogPost.count()
    const publishedPosts = await prisma.blogPost.count({ where: { published: true } })
    
    console.log(`📊 Estatísticas atuais:`)
    console.log(`   - Total de posts: ${totalPosts}`)
    console.log(`   - Posts publicados: ${publishedPosts}`)
    
  } catch (error) {
    console.error('❌ Erro ao adicionar posts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addNewPosts()