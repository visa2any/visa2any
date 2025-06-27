// Utilitários para o sistema de afiliados

export interface AffiliateLink {
  originalUrl: string
  affiliateUrl: string
  referralCode: string
  campaign?: string
  source?: string
}

export interface TrackingParams {
  ref: string          // Código de referência do afiliado,  campaign?: string    // Nome da campanha
  source?: string      // Origem do tráfego (instagram, facebook, email, etc)
  medium?: string      // Meio (social, email, paid, etc)
  content?: string     // Conteúdo específico
}

/**
 * Gera um link de afiliado com tracking
 */
export function generateAffiliateLink(
  baseUrl: string,
  targetPath: string,
  params: TrackingParams
): AffiliateLink {
  const trackingUrl = new URL('/api/affiliates/track', baseUrl)
  
  // Adicionar parâmetros de tracking
  
  trackingUrl.searchParams.set('ref', params.ref)
  trackingUrl.searchParams.set('url', targetPath)
  
  if (params.campaign) {
    trackingUrl.searchParams.set('campaign', params.campaign)
  }
  
  if (params.source) {
    trackingUrl.searchParams.set('source', params.source)
  }
  
  if (params.medium) {
    trackingUrl.searchParams.set('medium', params.medium)
  }
  
  if (params.content) {
    trackingUrl.searchParams.set('content', params.content)
  }

  return {
    originalUrl: new URL(targetPath, baseUrl).toString(),
    affiliateUrl: trackingUrl.toString(),
    referralCode: params.ref,
    campaign: params.campaign,
    source: params.source
  }
}

/**
 * Gera links pré-definidos para um afiliado
 */
export function generateAffiliateLinks(
  baseUrl: string,
  referralCode: string,
  source?: string
): Record<string, AffiliateLink> {
  const links: Record<string, AffiliateLink> = {}

  // Links principais

  const mainPages = [
    { key: 'home', path: '/', name: 'Página Inicial' },
    { key: 'consulta', path: '/consulta', name: 'Consultoria' },
    { key: 'precos', path: '/precos', name: 'Preços' },
    { key: 'sobre', path: '/sobre', name: 'Sobre Nós' },
    { key: 'contato', path: '/contato', name: 'Contato' }
  ]

  // Links de serviços específicos

  const services = [
    { key: 'eua', path: '/consulta?country=usa', name: 'Visto EUA', campaign: 'visto-eua' },
    { key: 'canada', path: '/consulta?country=canada', name: 'Visto Canadá', campaign: 'visto-canada' },
    { key: 'portugal', path: '/consulta?country=portugal', name: 'Visto Portugal', campaign: 'visto-portugal' },
    { key: 'australia', path: '/consulta?country=australia', name: 'Visto Austrália', campaign: 'visto-australia' }
  ]

  // Gerar links principais

  mainPages.forEach(page => {
    links[page.key] = generateAffiliateLink(baseUrl, page.path, {
      ref: referralCode,
      source,
      campaign: page.key
    })
  })

  // Gerar links de serviços

  services.forEach(service => {
    links[service.key] = generateAffiliateLink(baseUrl, service.path, {
      ref: referralCode,
      source,
      campaign: service.campaign
    })
  })

  return links
}

/**
 * Gera links para redes sociais específicas
 */
export function generateSocialMediaLinks(
  baseUrl: string,
  referralCode: string
): Record<string, Record<string, AffiliateLink>> {
  const platforms = ['instagram', 'facebook', 'linkedin', 'youtube', 'tiktok', 'whatsapp']
  const socialLinks: Record<string, Record<string, AffiliateLink>> = {}

  platforms.forEach(platform => {
    socialLinks[platform] = generateAffiliateLinks(baseUrl, referralCode, platform)
  })

  return socialLinks
}

/**
 * Registra uma conversão de afiliado
 */
export async function trackConversion(
  clientId: string,
  conversionType: 'CONSULTATION' | 'VISA_PROCESS' | 'COURSE' | 'VIP_SERVICE' | 'SUBSCRIPTION',
  conversionValue: number,
  referralCode?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/affiliates/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId,
        conversionType,
        conversionValue,
        referralCode
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao registrar conversão:', error)
  }
}

/**
 * Calcula comissão baseada no tier do afiliado
 */
export function calculateCommission(
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND',
  conversionType: 'CONSULTATION' | 'VISA_PROCESS' | 'COURSE' | 'VIP_SERVICE' | 'SUBSCRIPTION',
  conversionValue: number
): number {
  const commissionRates = {
    CONSULTATION: {
      BRONZE: 0.15,
      SILVER: 0.20,
      GOLD: 0.25,
      PLATINUM: 0.30,
      DIAMOND: 0.35
    },
    VISA_PROCESS: {
      BRONZE: 0.08,
      SILVER: 0.12,
      GOLD: 0.15,
      PLATINUM: 0.18,
      DIAMOND: 0.20
    },
    COURSE: {
      BRONZE: 0.30,
      SILVER: 0.40,
      GOLD: 0.50,
      PLATINUM: 0.60,
      DIAMOND: 0.70
    },
    VIP_SERVICE: {
      BRONZE: 0.10,
      SILVER: 0.15,
      GOLD: 0.20,
      PLATINUM: 0.25,
      DIAMOND: 0.30
    },
    SUBSCRIPTION: {
      BRONZE: 0.20,
      SILVER: 0.25,
      GOLD: 0.30,
      PLATINUM: 0.35,
      DIAMOND: 0.40
    }
  }

  const rate = commissionRates[conversionType][tier] || 0.10
  return conversionValue * rate
}

/**
 * Valida código de referência
 */
export function validateReferralCode(code: string): boolean {
  // Código deve ter entre 4 e 12 caracteres
  apenas letras e números
  const regex = /^[A-Z0-9]{4,12}$/
  return regex.test(code)
}

/**
 * Gera texto promocional para diferentes contextos
 */
export function generatePromotionalText(
  context: 'instagram' | 'facebook' | 'email' | 'whatsapp' | 'blog',
  referralCode: string,
  affiliateLink: string
): string {
  const templates = {
    instagram: `🌍 Quer realizar seu sonho de morar no exterior? 
    
A Visa2Any é especialista em imigração com mais de 12 mil casos de sucesso! 

✅ Consultoria personalizada
✅ Acompanhamento completo
✅ 95% de aprovação
✅ Suporte 24/7

Clique no link na bio e use o código ${referralCode} para desconto especial! 

#vivernoexterior #imigração #visa2any #intercambio #morarfora`,

    facebook: `Você sonha em viver no exterior? 🌍

A Visa2Any tem mais de 12 anos de experiência ajudando pessoas a realizarem esse sonho!

🔹 Mais de 12.000 clientes atendidos
🔹 Especialistas em 50+ países
🔹 95% de taxa de aprovação
🔹 Suporte completo do início ao fim

Acesse: ${affiliateLink}
Código: ${referralCode}

Sua jornada internacional começa aqui! ✈️`,

    email: `Olá!

Você já pensou em viver no exterior? Que tal transformar esse sonho em realidade?

A Visa2Any é a empresa líder em consultoria de imigração no Brasil, com mais de 12 anos de experiência e mais de 12.000 casos de sucesso.

Por que escolher a Visa2Any:
• Consultoria personalizada para seu perfil
• Acompanhamento completo do processo
• 95% de taxa de aprovação
• Suporte especializado 24/7

Acesse o link abaixo e agende sua consultoria:
${affiliateLink}

Use o código ${referralCode} e ganhe condições especiais!

Sua nova vida te espera! 🌍✈️`,

    whatsapp: `🌍 *VIVER NO EXTERIOR* 🌍

Você sabia que mais de 12.000 pessoas já realizaram o sonho de morar fora do Brasil com a ajuda da Visa2Any?

✅ 12+ anos de experiência
✅ 50+ países atendidos  
✅ 95% de aprovação
✅ Suporte completo

*Acesse:* ${affiliateLink}
*Código:* ${referralCode}

Sua jornada internacional começa agora! ✈️`,

    blog: `Se você está considerando viver no exterior, precisa conhecer a Visa2Any - a empresa líder em consultoria de imigração no Brasil.

Com mais de 12 anos de experiência e mais de 12.000 casos de sucesso, a Visa2Any oferece consultoria especializada para quem deseja emigrar para países como Estados Unidos, Canadá, Portugal, Austrália e muitos outros.

Por que a Visa2Any se destaca:
- Consultoria 100% personalizada
- Acompanhamento completo do processo
- 95% de taxa de aprovação
- Suporte especializado 24/7
- Experiência com 50+ países

Para saber mais e agendar sua consultoria, acesse: ${affiliateLink}

Use o código ${referralCode} e garante condições especiais!`
  }

  return templates[context] || templates.blog
}

export default {
  generateAffiliateLink,
  generateAffiliateLinks,
  generateSocialMediaLinks,
  trackConversion,
  calculateCommission,
  validateReferralCode,
  generatePromotionalText
}