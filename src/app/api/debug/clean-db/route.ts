import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Delete all clients
        const deleteResult = await prisma.client.deleteMany({})

        return NextResponse.json({
            status: 'CLEANED',
            deletedCount: deleteResult.count,
            message: 'All clients have been removed from the database.'
        })
    } catch (error) {
        return NextResponse.json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
