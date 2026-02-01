import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { context, message, stack } = body

        await notificationService.sendErrorAlert(
            context || 'Client-Side Error',
            { message, stack }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
