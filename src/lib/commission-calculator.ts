import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CommissionRule {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  conversionType: 'CONSULTATION' | 'VISA_PROCESS' | 'COURSE' | 'VIP_SERVICE' | 'SUBSCRIPTION'
  rate: number
  minimumValue?: number
  maximumValue?: number
  bonus?: number // Bônus fixo adicional
}

export interface TierRequirement {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  minimumMonthlyEarnings: number
  minimumConversions: number
  minimumConversionRate: number
  benefits: string[]
}

// Regras de comissão por tier e tipo de conversão
export const commissionRules: CommissionRule[] = [
  // CONSULTATION
  { tier: 'BRONZE', conversionType: 'CONSULTATION', rate: 0.15 },
  { tier: 'SILVER', conversionType: 'CONSULTATION', rate: 0.20 },
  { tier: 'GOLD', conversionType: 'CONSULTATION', rate: 0.25 },
  { tier: 'PLATINUM', conversionType: 'CONSULTATION', rate: 0.30 },
  { tier: 'DIAMOND', conversionType: 'CONSULTATION', rate: 0.35 },

  // VISA_PROCESS
  { tier: 'BRONZE', conversionType: 'VISA_PROCESS', rate: 0.08 },
  { tier: 'SILVER', conversionType: 'VISA_PROCESS', rate: 0.12 },
  { tier: 'GOLD', conversionType: 'VISA_PROCESS', rate: 0.15 },
  { tier: 'PLATINUM', conversionType: 'VISA_PROCESS', rate: 0.18 },
  { tier: 'DIAMOND', conversionType: 'VISA_PROCESS', rate: 0.20 },

  // COURSE
  { tier: 'BRONZE', conversionType: 'COURSE', rate: 0.30 },
  { tier: 'SILVER', conversionType: 'COURSE', rate: 0.40 },
  { tier: 'GOLD', conversionType: 'COURSE', rate: 0.50 },
  { tier: 'PLATINUM', conversionType: 'COURSE', rate: 0.60 },
  { tier: 'DIAMOND', conversionType: 'COURSE', rate: 0.70 },

  // VIP_SERVICE
  { tier: 'BRONZE', conversionType: 'VIP_SERVICE', rate: 0.10 },
  { tier: 'SILVER', conversionType: 'VIP_SERVICE', rate: 0.15 },
  { tier: 'GOLD', conversionType: 'VIP_SERVICE', rate: 0.20 },
  { tier: 'PLATINUM', conversionType: 'VIP_SERVICE', rate: 0.25 },
  { tier: 'DIAMOND', conversionType: 'VIP_SERVICE', rate: 0.30 },

  // SUBSCRIPTION
  { tier: 'BRONZE', conversionType: 'SUBSCRIPTION', rate: 0.20 },
  { tier: 'SILVER', conversionType: 'SUBSCRIPTION', rate: 0.25 },
  { tier: 'GOLD', conversionType: 'SUBSCRIPTION', rate: 0.30 },
  { tier: 'PLATINUM', conversionType: 'SUBSCRIPTION', rate: 0.35 },
  { tier: 'DIAMOND', conversionType: 'SUBSCRIPTION', rate: 0.40 }
]

// Requisitos para cada tier
export const tierRequirements: TierRequirement[] = [
  {
    tier: 'BRONZE',
    minimumMonthlyEarnings: 0,
    minimumConversions: 0,
    minimumConversionRate: 0,
    benefits: ['Comissões base', 'Material promocional básico', 'Suporte por email']
  },
  {
    tier: 'SILVER',
    minimumMonthlyEarnings: 1000,
    minimumConversions: 5,
    minimumConversionRate: 2.0,
    benefits: ['Comissões aumentadas', 'Material promocional premium', 'Suporte prioritário', 'Relatórios avançados']
  },
  {
    tier: 'GOLD',
    minimumMonthlyEarnings: 3000,
    minimumConversions: 15,
    minimumConversionRate: 3.0,
    benefits: ['Comissões altas', 'Material exclusivo', 'Gerente de conta dedicado', 'Webinars exclusivos']
  },
  {
    tier: 'PLATINUM',
    minimumMonthlyEarnings: 7000,
    minimumConversions: 30,
    minimumConversionRate: 4.0,
    benefits: ['Comissões premium', 'Landing pages personalizadas', 'Suporte telefônico', 'Eventos VIP']
  },
  {
    tier: 'DIAMOND',
    minimumMonthlyEarnings: 15000,
    minimumConversions: 50,
    minimumConversionRate: 5.0,
    benefits: ['Comissões máximas', 'Campanhas personalizadas', 'Conta executiva', 'Participação nos lucros']
  }
]

/**
 * Calcula a comissão para uma conversão específica
 */
export function calculateCommission(
  tier: string,
  conversionType: string,
  conversionValue: number
): { rate: number; amount: number; bonus?: number } {
  const rule = commissionRules.find(r => 
    r.tier === tier && r.conversionType === conversionType
  )

  if (!rule) {
    // Taxa padrão para casos não mapeados
    const defaultRate = 0.10
    return {
      rate: defaultRate,
      amount: conversionValue * defaultRate
    }
  }

  let amount = conversionValue * rule.rate

  // Aplicar limites se definidos
  if (rule.minimumValue && amount < rule.minimumValue) {
    amount = rule.minimumValue
  }
  if (rule.maximumValue && amount > rule.maximumValue) {
    amount = rule.maximumValue
  }

  // Adicionar bônus se aplicável
  if (rule.bonus) {
    amount += rule.bonus
  }

  return {
    rate: rule.rate,
    amount,
    bonus: rule.bonus
  }
}

/**
 * Avalia se um afiliado deve ser promovido de tier
 */
export async function evaluateTierPromotion(affiliateId: string): Promise<{
  currentTier: string
  recommendedTier: string
  shouldPromote: boolean
  requirements?: TierRequirement
}> {
  try {
    // Buscar dados do afiliado
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId }
    })

    if (!affiliate) {
      throw new Error('Afiliado não encontrado')
    }

    // Calcular métricas dos últimos 3 meses
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const recentCommissions = await prisma.affiliateCommission.aggregate({
      where: {
        affiliateId,
        createdAt: { gte: threeMonthsAgo },
        status: { in: ['APPROVED', 'PAID'] }
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    const monthlyEarnings = (recentCommissions._sum.amount || 0) / 3
    const monthlyConversions = (recentCommissions._count.id || 0) / 3

    // Buscar tier mais alto para o qual o afiliado se qualifica
    let recommendedTier = affiliate.tier
    
    for (const requirement of tierRequirements.reverse()) {
      if (
        monthlyEarnings >= requirement.minimumMonthlyEarnings &&
        monthlyConversions >= requirement.minimumConversions &&
        affiliate.conversionRate >= requirement.minimumConversionRate
      ) {
        recommendedTier = requirement.tier
        break
      }
    }

    const shouldPromote = recommendedTier !== affiliate.tier
    const requirements = tierRequirements.find(r => r.tier === recommendedTier)

    return {
      currentTier: affiliate.tier,
      recommendedTier,
      shouldPromote,
      requirements
    }

  } catch (error) {
    console.error('Erro ao avaliar promoção de tier:', error)
    throw error
  }
}

/**
 * Promove um afiliado para um novo tier
 */
export async function promoteTier(
  affiliateId: string, 
  newTier: string,
  reason?: string
): Promise<void> {
  try {
    await prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        tier: newTier as any,
        updatedAt: new Date()
      }
    })

    // Registrar log da promoção
    console.log(`Afiliado ${affiliateId} promovido para ${newTier}. Motivo: ${reason || 'Automático'}`)

    // TODO: Enviar notificação para o afiliado
    // await sendTierPromotionNotification(affiliateId, newTier)

  } catch (error) {
    console.error('Erro ao promover tier:', error)
    throw error
  }
}

/**
 * Executa avaliação automática de tier para todos os afiliados ativos
 */
export async function runTierEvaluation(): Promise<{
  evaluated: number
  promoted: number
  promotions: Array<{ affiliateId: string; from: string; to: string }>
}> {
  try {
    const activeAffiliates = await prisma.affiliate.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, email: true, tier: true }
    })

    let promoted = 0
    const promotions: Array<{ affiliateId: string; from: string; to: string }> = []

    for (const affiliate of activeAffiliates) {
      try {
        const evaluation = await evaluateTierPromotion(affiliate.id)
        
        if (evaluation.shouldPromote) {
          await promoteTier(
            affiliate.id, 
            evaluation.recommendedTier,
            'Avaliação automática baseada em performance'
          )
          
          promoted++
          promotions.push({
            affiliateId: affiliate.id,
            from: evaluation.currentTier,
            to: evaluation.recommendedTier
          })

          console.log(`Afiliado ${affiliate.name} promovido de ${evaluation.currentTier} para ${evaluation.recommendedTier}`)
        }
      } catch (error) {
        console.error(`Erro ao avaliar afiliado ${affiliate.id}:`, error)
      }
    }

    return {
      evaluated: activeAffiliates.length,
      promoted,
      promotions
    }

  } catch (error) {
    console.error('Erro na avaliação de tiers:', error)
    throw error
  }
}

/**
 * Calcula bônus de performance mensal
 */
export async function calculateMonthlyBonus(
  affiliateId: string,
  month: number,
  year: number
): Promise<{ eligible: boolean; bonusAmount: number; reason?: string }> {
  try {
    // Período do mês específico
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Buscar performance do mês
    const monthlyStats = await prisma.affiliateCommission.aggregate({
      where: {
        affiliateId,
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['APPROVED', 'PAID'] }
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    const monthlyEarnings = monthlyStats._sum.amount || 0
    const monthlyConversions = monthlyStats._count.id || 0

    // Buscar tier atual do afiliado
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: { tier: true }
    })

    if (!affiliate) {
      return { eligible: false, bonusAmount: 0, reason: 'Afiliado não encontrado' }
    }

    // Critérios para bônus baseados no tier
    const bonusCriteria = {
      BRONZE: { minEarnings: 500, minConversions: 3, bonusRate: 0.05 },
      SILVER: { minEarnings: 1500, minConversions: 8, bonusRate: 0.08 },
      GOLD: { minEarnings: 3500, minConversions: 20, bonusRate: 0.10 },
      PLATINUM: { minEarnings: 8000, minConversions: 35, bonusRate: 0.12 },
      DIAMOND: { minEarnings: 18000, minConversions: 60, bonusRate: 0.15 }
    }

    const criteria = bonusCriteria[affiliate.tier as keyof typeof bonusCriteria]

    if (!criteria) {
      return { eligible: false, bonusAmount: 0, reason: 'Tier inválido' }
    }

    // Verificar elegibilidade
    if (monthlyEarnings >= criteria.minEarnings && monthlyConversions >= criteria.minConversions) {
      const bonusAmount = monthlyEarnings * criteria.bonusRate
      return {
        eligible: true,
        bonusAmount,
        reason: `Bônus de ${criteria.bonusRate * 100}% por superar metas mensais`
      }
    }

    return {
      eligible: false,
      bonusAmount: 0,
      reason: `Meta não atingida (${monthlyEarnings.toFixed(2)}/${criteria.minEarnings} earnings, ${monthlyConversions}/${criteria.minConversions} conversions)`
    }

  } catch (error) {
    console.error('Erro ao calcular bônus mensal:', error)
    return { eligible: false, bonusAmount: 0, reason: 'Erro no cálculo' }
  }
}

/**
 * Processa bônus mensais para todos os afiliados elegíveis
 */
export async function processMonthlyBonuses(month: number, year: number): Promise<{
  processed: number
  totalBonus: number
  bonuses: Array<{ affiliateId: string; amount: number }>
}> {
  try {
    const activeAffiliates = await prisma.affiliate.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true }
    })

    let processed = 0
    let totalBonus = 0
    const bonuses: Array<{ affiliateId: string; amount: number }> = []

    for (const affiliate of activeAffiliates) {
      try {
        const bonus = await calculateMonthlyBonus(affiliate.id, month, year)
        
        if (bonus.eligible && bonus.bonusAmount > 0) {
          // Criar comissão de bônus
          await prisma.affiliateCommission.create({
            data: {
              affiliateId: affiliate.id,
              referralId: '', // Usar ID especial para bônus
              amount: bonus.bonusAmount,
              status: 'APPROVED',
              type: 'SUBSCRIPTION', // Tipo genérico para bônus
              description: `Bônus mensal - ${month}/${year}: ${bonus.reason}`,
              dueDate: new Date(year, month, 15) // Pagamento no 15º do mês seguinte
            }
          })

          // Atualizar saldos do afiliado
          await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: {
              totalEarnings: { increment: bonus.bonusAmount },
              pendingEarnings: { increment: bonus.bonusAmount }
            }
          })

          processed++
          totalBonus += bonus.bonusAmount
          bonuses.push({ affiliateId: affiliate.id, amount: bonus.bonusAmount })

          console.log(`Bônus de R$ ${bonus.bonusAmount.toFixed(2)} aplicado para ${affiliate.name}`)
        }
      } catch (error) {
        console.error(`Erro ao processar bônus para afiliado ${affiliate.id}:`, error)
      }
    }

    return { processed, totalBonus, bonuses }

  } catch (error) {
    console.error('Erro ao processar bônus mensais:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export default {
  calculateCommission,
  evaluateTierPromotion,
  promoteTier,
  runTierEvaluation,
  calculateMonthlyBonus,
  processMonthlyBonuses,
  commissionRules,
  tierRequirements
}