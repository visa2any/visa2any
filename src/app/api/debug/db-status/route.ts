import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const steps = []

    try {
        // Step 1: Check Environment
        steps.push({ step: 'Check Env', status: 'Running' })
        const dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not defined')
        }
        steps.push({ step: 'Check Env', status: 'Success', detail: `Defined (starts with ${dbUrl.substring(0, 10)}...)` })

        // Step 2: Connection
        steps.push({ step: 'Connect DB', status: 'Running' })
        await prisma.$connect()
        steps.push({ step: 'Connect DB', status: 'Success' })

        // Step 3: Check Client Table
        steps.push({ step: 'Count Clients', status: 'Running' })
        const count = await prisma.client.count()
        steps.push({ step: 'Count Clients', status: 'Success', count })

        return NextResponse.json({ status: 'OK', steps })
    } catch (error) {
        return NextResponse.json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error),
            steps
        }, { status: 500 })
    }
}
