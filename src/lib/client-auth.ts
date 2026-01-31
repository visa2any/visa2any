import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export interface AuthClient {
    id: string
    email: string
    name: string
    status: string
}

// Verify client authentication
export async function verifyClientAuth(request: NextRequest): Promise<AuthClient | null> {
    try {
        const authHeader = request.headers.get('authorization')
        const cookieToken = request.cookies.get('client-token')?.value

        const token = authHeader?.replace('Bearer ', '') || cookieToken

        if (!token) {
            return null
        }

        const jwtSecret = process.env.NEXTAUTH_SECRET
        if (!jwtSecret) {
            console.error('❌ NEXTAUTH_SECRET não está configurado!')
            return null
        }

        const decoded = jwt.verify(token, jwtSecret) as any

        // Ensure it's a client token
        if (decoded.role !== 'CLIENT') {
            return null
        }

        const client = await prisma.client.findUnique({
            where: { id: decoded.clientId },
            select: {
                id: true,
                name: true,
                email: true,
                status: true
            }
        })

        if (!client) {
            return null
        }

        return client

    } catch (error) {
        return null
    }
}
