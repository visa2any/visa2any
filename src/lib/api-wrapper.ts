import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

type ApiHandler = (req: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorAlert(handler: ApiHandler, contextName: string) {
    return async (req: NextRequest, context?: any) => {
        try {
            return await handler(req, context)
        } catch (error) {
            console.error(`💥 API ERROR [${contextName}]:`, error)

            // Send critical alert to Admin Telegram
            await notificationService.sendErrorAlert(
                `API Route: ${contextName}`,
                error
            )

            return NextResponse.json(
                {
                    success: false,
                    error: 'Internal System Error',
                    message: 'An unexpected error occurred. The admin team has been notified.'
                },
                { status: 500 }
            )
        }
    }
}
