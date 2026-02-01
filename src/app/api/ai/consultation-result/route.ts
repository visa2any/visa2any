
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const consultationId = searchParams.get('id')
        const clientId = searchParams.get('clientId')

        if (!consultationId || !clientId) {
            return NextResponse.json(
                { error: 'Parâmetros inválidos' },
                { status: 400 }
            )
        }

        const consultation = await prisma.consultation.findUnique({
            where: {
                id: consultationId,
                clientId: clientId
            },
            select: {
                id: true,
                status: true,
                score: true,
                result: true,
                recommendation: true,
                timeline: true
            }
        })

        if (!consultation) {
            return NextResponse.json(
                { error: 'Consultoria não encontrada' },
                { status: 404 }
            )
        }

        // 🔒 SECURITY CHECK: Only return full results if PAID/COMPLETED
        if (consultation.status !== 'COMPLETED') {
            return NextResponse.json({
                isLocked: true,
                score: consultation.score, // Safe to show score preview
                // Do NOT return detailed result/documents/steps
            })
        }

        // ✅ PAID: Return full analysis
        return NextResponse.json({
            isLocked: false,
            score: consultation.score,
            result: consultation.result,
            recommendation: consultation.recommendation,
            timeline: consultation.timeline
        })

    } catch (error) {
        console.error('❌ Erro ao buscar resultado:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
