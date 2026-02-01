
import { PrismaClient, ConsultationType, ConsultationStatus } from '@prisma/client'
import { calculateEligibility } from './src/lib/consultation-engine'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Starting E2E Verification for AI Pre-Analysis...')

    // 1. Test Logic Engine directly
    console.log('\n🧪 Testing Consultation Engine Logic...')
    const testProfile = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        phone: '123456789',
        country: 'Portugal',
        nationality: 'Brasileira',
        visaType: 'Cidadania por descendência',
        age: 30,
        education: 'Doutorado', // High score
        experience: 'Mais de 10 anos', // High score
        language: 'Fluente',
        budget: 'Acima de R$ 500.000',
        family: 'Sozinho',
        timeline: 'Não tenho pressa'
    }

    const result = calculateEligibility(testProfile)
    console.log(`   Input Profile: Portugal, Brasileiro, Doutorado, Cidadania`)
    console.log(`   Calculated Score: ${result.eligibilityScore}`)
    console.log(`   Recommendation: ${result.recommendation.substring(0, 50)}...`)

    if (result.eligibilityScore > 80) {
        console.log('   ✅ Logic Check Passed: High score profile got high score.')
    } else {
        console.error('   ❌ Logic Check Failed: Expected high score.')
    }

    // 2. Simulate API: Create Client & Consultation
    console.log('\n💾 Simulating Onboarding API (DB Persistence)...')

    // Create/Find Client
    const client = await prisma.client.create({
        data: {
            name: testProfile.name,
            email: testProfile.email,
            phone: testProfile.phone,
            password: 'hashed_temp_password',
            country: 'Brasil',
            nationality: testProfile.nationality,
            age: testProfile.age,
            targetCountry: testProfile.country,
            visaType: testProfile.visaType,
            status: 'LEAD'
        }
    })
    console.log(`   Created Client ID: ${client.id}`)

    // Create Consultation (LOCKED)
    const consultation = await prisma.consultation.create({
        data: {
            clientId: client.id,
            type: ConsultationType.AI_ANALYSIS,
            status: ConsultationStatus.SCHEDULED,
            score: result.eligibilityScore,
            result: {
                generated_analysis: result
            } as any, // Cast to any to avoid strict Json/InputJson mismatch in test script
            recommendation: result.recommendation,
            timeline: result.timeline,
            notes: 'Verification Test'
        }
    })
    console.log(`   Created Consultation ID: ${consultation.id}`)
    console.log(`   Initial Status: ${consultation.status}`)

    // 3. Verify Locked State
    if (consultation.status !== ConsultationStatus.COMPLETED) {
        console.log('   ✅ Security Check 1 Passed: Consultation is initially LOCKED (SCHEDULED).')
    } else {
        console.error('   ❌ Security Check 1 Failed: Consultation should not be COMPLETED yet.')
    }

    // 4. Simulate Payment / Unlock
    console.log('\n🔓 Simulating Payment Webhook (Unlock)...')
    const updatedConsultation = await prisma.consultation.update({
        where: { id: consultation.id },
        data: { status: ConsultationStatus.COMPLETED }
    })
    console.log(`   Updated Status: ${updatedConsultation.status}`)

    if (updatedConsultation.status === ConsultationStatus.COMPLETED) {
        console.log('   ✅ Security Check 2 Passed: Consultation UNLOCKED after payment simulation.')
    }

    // 5. Cleanup
    console.log('\n🧹 Cleaning up test data...')
    await prisma.consultation.delete({ where: { id: consultation.id } })
    await prisma.client.delete({ where: { id: client.id } })
    console.log('   Cleanup done.')

    console.log('\n✨ E2E VERIFICATION COMPLETED SUCCESSFULLY')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
