import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { calculateEligibility } from '@/lib/consultation-engine'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { profile, answers, messages } = body

        // 🛡️ SERVER-SIDE CALCULATION: Ignore client-side result
        const analysisResult = calculateEligibility(profile)

        if (!profile?.email || !profile?.name) {
            return NextResponse.json(
                { error: 'Nome e Email são obrigatórios.' },
                { status: 400 }
            )
        }

        // 1. Find or Create User
        let client = await prisma.client.findUnique({
            where: { email: profile.email }
        })

        if (!client) {
            // Create a temporary password for the user to access the portal later
            const tempPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(tempPassword, 10)

            client = await prisma.client.create({
                data: {
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    password: hashedPassword,
                    country: 'Brasil', // Default based on context
                    nationality: profile.nationality,
                    age: parseInt(profile.age) || null,
                    education: profile.education,
                    targetCountry: profile.country, // Destination from profile
                    visaType: profile.visaType,
                    source: 'AI_CONSULTATION_LANDING',
                    status: 'LEAD'
                }
            })

            // Enviar email de boas-vindas com senha
            try {
                const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
                await fetch(`${baseUrl}/api/notifications/email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: client.email,
                        template: 'welcome_lead',
                        clientId: client.id,
                        variables: {
                            client_email: client.email,
                            temp_password: tempPassword,
                            login_url: `${baseUrl}/cliente/login`
                        }
                    })
                })
                console.log(`📧 Email de boas-vindas enviado para ${client.email}`)
            } catch (emailError) {
                console.error('❌ Falha ao enviar email de boas-vindas:', emailError)
            }
        } else {
            // Update existing lead with new profiling data
            client = await prisma.client.update({
                where: { id: client.id },
                data: {
                    name: profile.name,
                    phone: profile.phone || client.phone,
                    targetCountry: profile.country || client.targetCountry,
                    visaType: profile.visaType || client.visaType,
                    education: profile.education || client.education,
                    updatedAt: new Date()
                }
            })
        }

        // 2. Create the Consultation Record (Locked)
        const consultation = await prisma.consultation.create({
            data: {
                clientId: client.id,
                type: 'AI_ANALYSIS',
                status: 'SCHEDULED', // Indicates waiting for payment/action
                score: analysisResult.eligibilityScore,
                result: {
                    raw_profile: profile,
                    messages: messages,
                    generated_analysis: analysisResult as any // JSON compatible
                },
                recommendation: analysisResult.recommendation,
                timeline: analysisResult.timeline,
                notes: 'Pré-análise gerada via Chat IA. Aguardando pagamento para desbloqueio completo.'
            }
        })

        // 3. Notificar Admin sobre novo Lead (Assíncrono)
        import('@/lib/notification-service').then(({ notificationService }) => {
            notificationService.sendLeadAlert({
                name: client.name,
                email: client.email,
                score: analysisResult.eligibilityScore,
                country: client.targetCountry || 'Não informado'
            }).catch(err => console.error('Erro notification lead:', err))
        })

        return NextResponse.json({
            success: true,
            clientId: client.id,
            consultationId: consultation.id,
            score: analysisResult.eligibilityScore,
            recommendation: analysisResult.recommendation,
            redirectUrl: `/checkout-moderno?product=pre-analise&clientId=${client.id}&consultationId=${consultation.id}`
        })

    } catch (error) {
        console.error('❌ Erro no onboarding IA:', error)
        return NextResponse.json(
            { error: 'Erro ao processar dados.' },
            { status: 500 }
        )
    }
}
