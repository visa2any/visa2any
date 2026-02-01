import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
    const steps = []

    try {
        // Step 1: Check Environment
        steps.push({ step: '1. Check Env', status: 'Running' })
        const dbUrl = process.env.DATABASE_URL
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not defined')
        }
        steps.push({ step: '1. Check Env', status: 'Success', detail: `Defined (starts with ${dbUrl.substring(0, 10)}...)` })

        // Step 2: Connection
        steps.push({ step: '2. Connect DB', status: 'Running' })
        await prisma.$connect()
        steps.push({ step: '2. Connect DB', status: 'Success' })

        // Step 3: Check Read (Count)
        steps.push({ step: '3. Read Test (Count)', status: 'Running' })
        const count = await prisma.client.count()
        steps.push({ step: '3. Read Test (Count)', status: 'Success', count })

        // Step 4: Test Bcrypt (Hashing)
        steps.push({ step: '4. Bcrypt Hash Test', status: 'Running' })
        const startHash = Date.now()
        await bcrypt.hash('testpassword', 10) // Use cost 10
        const hashTime = Date.now() - startHash
        steps.push({ step: '4. Bcrypt Hash Test', status: 'Success', duration: `${hashTime}ms` })

        // Step 5: Write Test (Create/Delete)
        steps.push({ step: '5. Write Test (Create)', status: 'Running' })
        const testEmail = `debug-${Date.now()}@test.com`
        const newClient = await prisma.client.create({
            data: {
                name: 'Debug User',
                email: testEmail,
                status: 'LEAD',
                score: 0
            }
        })
        steps.push({ step: '5. Write Test (Create)', status: 'Success', id: newClient.id })

        // Clean up
        await prisma.client.delete({ where: { id: newClient.id } })
        steps.push({ step: '6. Cleanup (Delete)', status: 'Success' })

        return NextResponse.json({ status: 'OK', steps })
    } catch (error) {
        return NextResponse.json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            steps
        }, { status: 500 })
    }
}
