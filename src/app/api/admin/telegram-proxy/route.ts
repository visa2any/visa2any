import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { token, action, chatId, message } = await request.json()

        if (!token) {
            return NextResponse.json({ ok: false, description: 'Token required' }, { status: 400 })
        }

        let url = ''
        let body: any = {}

        if (action === 'getUpdates') {
            url = `https://api.telegram.org/bot${token}/getUpdates`
            const response = await fetch(url)
            const data = await response.json()
            return NextResponse.json(data)
        }
        else if (action === 'sendMessage') {
            url = `https://api.telegram.org/bot${token}/sendMessage`
            body = {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            return NextResponse.json(data)
        }

        return NextResponse.json({ ok: false, description: 'Invalid action' }, { status: 400 })

    } catch (error) {
        return NextResponse.json({ ok: false, description: String(error) }, { status: 500 })
    }
}
