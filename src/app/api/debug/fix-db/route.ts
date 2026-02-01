import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const logs = []

    try {
        logs.push("Starting DB Repair...")

        // 1. Add password column
        logs.push("Adding 'password' column...")
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "password" TEXT;`)
        logs.push("Success: 'password' column added (or already existed).")

        // 2. Add phone column (just in case)
        logs.push("Adding 'phone' column...")
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "phone" TEXT;`)
        logs.push("Success: 'phone' column added.")

        // 3. Add score column
        logs.push("Adding 'score' column...")
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "score" INTEGER;`)
        logs.push("Success: 'score' column added.")

        return NextResponse.json({ status: 'FIXED', logs })
    } catch (error) {
        return NextResponse.json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error),
            logs
        }, { status: 500 })
    }
}
