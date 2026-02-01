import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const logs = []

    try {
        logs.push("Starting DB Repair Phase 2...")

        // 1. Password
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "password" TEXT;`)
        logs.push("'password' check done.")

        // 2. Phone
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "phone" TEXT;`)
        logs.push("'phone' check done.")

        // 3. Score
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "score" INTEGER;`)
        logs.push("'score' check done.")

        // 4. Status (Text is safer for repair than Enum creation via raw SQL without checking type existence)
        logs.push("Adding 'status' column...")
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'LEAD';`)
        logs.push("'status' check done.")

        // 5. Timestamps
        logs.push("Adding timestamps...")
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`)
        logs.push("Timestamps check done.")

        // 6. Name/Email (Core)
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "name" TEXT;`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "email" TEXT;`)
        logs.push("Core columns check done.")

        return NextResponse.json({ status: 'FIXED_PHASE_2', logs })
    } catch (error) {
        return NextResponse.json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error),
            logs
        }, { status: 500 })
    }
}
