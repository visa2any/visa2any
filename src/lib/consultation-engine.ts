
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
        family: profile.family || ''
    };

    let score = 50 // Base score
    let complexityLevel: 'simple' | 'moderate' | 'complex' = 'simple'
    let needsHuman = false
    const warnings: string[] = []

    // Education
    const educationScores: Record<string, number> = {
        'Doutorado': 20, 'Mestrado': 18, 'Pós-graduação': 15,
        'Superior completo': 12, 'Superior incompleto': 8,
        'Ensino médio': 5, 'Ensino fundamental': 2
    }
    score += educationScores[safeProfile.education] || 0

    // Experience
    const expScores: Record<string, number> = {
        'Mais de 10 anos': 15, '5-10 anos': 12, '3-5 anos': 8,
        '1-3 anos': 5, 'Menos de 1 ano': 2
    }
    score += expScores[safeProfile.experience] || 0

    // Language
    const langScores: Record<string, number> = {
        'Nativo': 15, 'Fluente': 12, 'Avançado': 8,
        'Intermediário': 5, 'Básico': 2
    }
    score += langScores[safeProfile.language] || 0

    // Country/Nationality Bonues
    if (safeProfile.country === 'Portugal') {
        if (safeProfile.nationality === 'Brasileira') {
            score += 20
            if (safeProfile.visaType === 'Cidadania por descendência') score += 15
        } else {
            score += 5
        }
    }

    if (safeProfile.country === 'Canadá') {
        score -= 5
        if (safeProfile.french === 'Fluente') score += 20
        else if (safeProfile.french === 'Avançado') score += 15
        else if (safeProfile.french === 'Intermediário') score += 10
    }

    if (safeProfile.country === 'Estados Unidos') {
        if (safeProfile.nationality === 'Brasileira') {
            score += 5
            if (safeProfile.education === 'Mestrado' || safeProfile.education === 'Doutorado') {
                score += 15
            }
        }
    }

    // Age
    if (safeProfile.age >= 25 && safeProfile.age <= 35) score += 10
    else if (safeProfile.age >= 18 && safeProfile.age <= 45) score += 5
    else warnings.push('Idade pode ser um fator limitante para alguns programas')

    // Budget
    const budgetScores: Record<string, number> = {
        'Acima de R$ 500.000': 15, 'R$ 300.000 - R$ 500.000': 12,
        'R$ 100.000 - R$ 300.000': 8, 'R$ 50.000 - R$ 100.000': 5,
        'Até R$ 50.000': 2
    }
    score += budgetScores[safeProfile.budget] || 0

    // Complexity
    if (safeProfile.visaType === 'Refugio/Asilo' || safeProfile.visaType === 'Outro') {
        complexityLevel = 'complex'; needsHuman = true; warnings.push('Caso complexo requer análise especializada')
    } else if (safeProfile.timeline === 'Até 6 meses' || safeProfile.family === 'Família extensa') {
        complexityLevel = 'moderate'; if (score < 60) needsHuman = true
    }
    if (score < 40) { needsHuman = true; warnings.push('Perfil requer estratégia personalizada') }

    // Recommendations text
    let recommendation = ''
    let timeline = ''
    let cost = ''
    let documents: string[] = []
    let nextSteps: string[] = []

    if (score >= 80) {
        recommendation = `Excelente! Seu perfil é muito forte para ${safeProfile.country}. Nossa metodologia maximiza suas chances de aprovação.`
        timeline = 'Processo pode ser concluído em 6-12 meses'
        cost = 'R$ 15.000 - R$ 30.000'
        documents = ['Diploma apostilado', 'Comprovante de experiência', 'Teste de idioma', 'Exames médicos']
        nextSteps = ['Teste de proficiência no idioma', 'Validação de diplomas', 'Submissão de EOI/Aplicação']
    } else if (score >= 60) {
        recommendation = `Bom perfil! Com nossa estratégia personalizada, suas chances aumentam significativamente.`
        timeline = 'Preparação de 6-12 meses + processo de 12-18 meses'
        cost = 'R$ 20.000 - R$ 40.000'
        documents = ['Documentos acadêmicos', 'Certificações profissionais', 'Teste de idioma', 'Comprovantes financeiros']
        nextSteps = ['Melhorar proficiência no idioma', 'Obter certificações na área', 'Plano de fortalecimento do perfil']
    } else {
        recommendation = `Perfil desafiador, mas nossa experiência pode fazer a diferença. Estratégia especializada recomendada.`
        timeline = 'Preparação de 12-24 meses + processo'
        cost = 'R$ 25.000 - R$ 50.000'
        documents = ['Documentação completa', 'Certificações adicionais', 'Cursos de qualificação']
        nextSteps = ['Plano de melhoria do perfil', 'Educação adicional', 'Experiência internacional']
        needsHuman = true
    }

    return {
        eligibilityScore: Math.min(score, 100),
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
