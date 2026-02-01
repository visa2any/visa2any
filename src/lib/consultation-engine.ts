
// Logic moved from frontend to backend for IP protection

interface UserProfile {
    name: string
    email: string
    phone: string
    country: string
    nationality?: string
    visaType: string
    timeline: string
    budget: string
    education: string
    experience: string
    language: string
    french?: string
    family: string
    assets: string
    age: number
    sector?: string
}

interface ConsultationResult {
    eligibilityScore: number
    recommendation: string
    timeline: string
    estimatedCost: string
    requiredDocuments: string[]
    nextSteps: string[]
    needsHumanConsultant: boolean
    complexityLevel: 'simple' | 'moderate' | 'complex'
    warningFlags: string[]
}

export function calculateEligibility(profile: any): ConsultationResult {
    // Basic normalization of profile data
    const safeProfile = {
        education: profile.education || '',
        experience: profile.experience || '',
        language: profile.language || '',
        country: profile.country || '',
        nationality: profile.nationality || '',
        visaType: profile.visaType || '',
        french: profile.french || '',
        age: parseInt(String(profile.age)) || 25,
        budget: profile.budget || '',
        timeline: profile.timeline || '',
        family: profile.family || '',
        occupation: profile.profession || '',
        assets: profile.assets || ''
    };

    let score = 50 // Base score
    let complexityLevel: 'simple' | 'moderate' | 'complex' = 'simple'
    let needsHuman = false
    const warnings: string[] = []

    // --- SCORING FACTORS ---

    // 1. Education (Weighted by Visa Type)
    const educationScores: Record<string, number> = {
        'Doutorado': 25, 'Mestrado': 20, 'Pós-graduação': 15,
        'Superior completo': 10, 'Superior incompleto': 5,
        'Ensino médio': 2, 'Ensino fundamental': 0
    }
    const eduScore = educationScores[safeProfile.education] || 0;

    // Boost education for Student/Work visas
    if (safeProfile.visaType.includes('Estudo') || safeProfile.visaType.includes('Trabalho')) {
        score += eduScore;
    } else {
        score += eduScore / 2; // Less critical for tourism/investment
    }

    // 2. Experience (Critical for Work/Skilled Visas)
    const expScores: Record<string, number> = {
        'Mais de 10 anos': 20, '5-10 anos': 15, '3-5 anos': 10,
        '1-3 anos': 5, 'Menos de 1 ano': 0
    }
    const expScore = expScores[safeProfile.experience] || 0;

    if (safeProfile.visaType.includes('Trabalho') || safeProfile.visaType.includes('Carreira')) {
        score += expScore;
    } else {
        score += expScore / 2;
    }

    // 3. Language (Critical for Canada/Australia/UK)
    const langScores: Record<string, number> = {
        'Nativo': 20, 'Fluente': 15, 'Avançado': 10,
        'Intermediário': 5, 'Básico': 0
    }
    let langScore = langScores[safeProfile.language] || 0;

    // Country Logic: Anglophone vs Lusophone
    if (safeProfile.country === 'Portugal' && safeProfile.nationality === 'Brasileira') {
        score += 20; // Language barrier nonexistent
        langScore = 20;
    } else if (['Estados Unidos', 'Canadá', 'Reino Unido', 'Austrália'].includes(safeProfile.country)) {
        score += langScore;
        // Canada French Bonus
        if (safeProfile.country === 'Canadá' && ['Fluente', 'Avançado'].includes(safeProfile.french)) {
            score += 15; // French proficiency is huge for Canada
        }
    }

    // 4. Age (Curved)
    // Canada/Australia punish age > 30 heavily. Portugal/US less so.
    if (safeProfile.visaType.includes('Trabalho') && ['Canadá', 'Austrália'].includes(safeProfile.country)) {
        if (safeProfile.age >= 20 && safeProfile.age <= 29) score += 15;
        else if (safeProfile.age >= 30 && safeProfile.age <= 34) score += 10;
        else if (safeProfile.age >= 35 && safeProfile.age <= 39) score += 5;
        else if (safeProfile.age >= 40) score -= 5; // Penalty
    } else {
        // Standard curve
        if (safeProfile.age >= 21 && safeProfile.age <= 45) score += 10;
        else if (safeProfile.age > 45 && safeProfile.visaType.includes('Aposentadoria')) score += 15;
    }

    // 5. Budget / Assets (Critical for Investment/Study)
    const isHighBudget = ['Acima de R$ 500.000', 'R$ 300.000 - R$ 500.000'].includes(safeProfile.budget);

    if (safeProfile.visaType.includes('Investimento')) {
        if (isHighBudget) {
            score += 25;
        } else {
            score -= 20; // Critical fail for investment without funds
            warnings.push('Orçamento abaixo do recomendado para Vistos de Investidor');
        }
    } else if (safeProfile.visaType.includes('Estudo')) {
        if (isHighBudget) score += 15;
        else if (safeProfile.budget === 'Até R$ 50.000') {
            score -= 10;
            warnings.push('Orçamento apertado para taxas internacionais de ensino');
        }
    }

    // 6. High Demand Sectors (Bonus)
    const prioritySectors = ['saúde', 'ti', 'tecnologia', 'engenharia', 'enfermagem', 'médico', 'dev', 'dados', 'construção'];
    const occupationLower = safeProfile.occupation.toLowerCase();
    if (prioritySectors.some(s => occupationLower.includes(s))) {
        score += 10; // STEM/Healthcare bonus
    }

    // --- COMPLEXITY CHECKS ---
    if (safeProfile.visaType === 'Refugio/Asilo' || safeProfile.visaType === 'Outro') {
        complexityLevel = 'complex';
        needsHuman = true;
        warnings.push('Caso de alta complexidade jurídica');
    }

    // US EB-2 NIW Check (Advanced Degree + Experience)
    if (safeProfile.country === 'Estados Unidos' && safeProfile.visaType.includes('Trabalho')) {
        if (['Mestrado', 'Doutorado'].includes(safeProfile.education) && ['Mais de 10 anos', '5-10 anos'].includes(safeProfile.experience)) {
            score += 10; // Strong NIW candidate
        }
    }

    // --- GENERATE OUTPUT ---
    let recommendation = ''
    let timeline = ''
    let cost = ''
    let documents: string[] = []
    let nextSteps: string[] = []

    const finalScore = Math.min(Math.max(score, 10), 99); // Clamp betwen 10 and 99

    // Dynamic Recommendations
    if (finalScore >= 80) {
        recommendation = `Perfil de Elite. Suas chances de aprovação para ${safeProfile.country} são altíssimas.`
        timeline = 'Processo Acelerado (6-9 meses)'
        cost = 'Investimento Médio'
        nextSteps = ['Análise detalhada de documentação', 'Aplicação prioritária', 'Preparação para entrevista consular']
    } else if (finalScore >= 60) {
        recommendation = `Perfil Competitivo. Você tem os requisitos básicos, mas a estratégia jurídica fará a diferença.`
        timeline = 'Processo Padrão (12-18 meses)'
        cost = 'Investimento Padrão'
        nextSteps = ['Correção de lacunas no perfil', 'Tradução juramentada de documentos', 'Estratégia de aplicação']
    } else {
        recommendation = `Perfil em Desenvolvimento. Recomendamos um plano de fortalecimento antes da aplicação.`
        timeline = 'Longo Prazo (18-24 meses)'
        cost = 'Investimento Flexível'
        nextSteps = ['Plano de qualificação profissional', 'Melhoria do nível de idioma', 'Acúmulo de patrimônio/experiência']
        needsHuman = true;
    }

    // Specific Document Logic
    documents = ['Passaporte Válido', 'Comprovante de Renda'];
    if (safeProfile.visaType.includes('Estudo')) documents.push('Histórico Escolar', 'Carta de Aceite (LOA)');
    if (safeProfile.visaType.includes('Trabalho')) documents.push('Cartas de Referência', 'Currículo Vitae/Resume', 'Diploma de Maior Grau');
    if (safeProfile.visaType.includes('Investimento')) documents.push('Declaração de Imposto de Renda', 'Prova de Origem dos Fundos');

    return {
        eligibilityScore: finalScore,
        recommendation,
        timeline,
        estimatedCost: cost,
        requiredDocuments: documents,
        nextSteps,
        needsHumanConsultant: needsHuman,
        complexityLevel,
        warningFlags: warnings
    }
}
