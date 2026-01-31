import { NextResponse } from 'next/server'
import { MercadoPagoConfig, MerchantOrder } from 'mercadopago'

// This endpoint helps verify if credentials are production or sandbox
export async function GET() {
    try {
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
        const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY

        if (!accessToken || !publicKey) {
            return NextResponse.json({
                status: 'error',
                message: 'Missing credentials',
                publicKeyConfigured: !!publicKey,
                accessTokenConfigured: !!accessToken
            }, { status: 400 })
        }

        // Extract parts of the keys for comparison (safely)
        const publicKeyPrefix = publicKey.substring(0, 20)
        const accessTokenPrefix = accessToken.substring(0, 20)

        // Check if both keys appear to be from the same app
        // Production keys have specific characteristics
        const publicKeyInfo = {
            prefix: publicKeyPrefix + '...',
            length: publicKey.length,
            looksValid: publicKey.startsWith('APP_USR-') || publicKey.startsWith('TEST-')
        }

        const accessTokenInfo = {
            prefix: accessTokenPrefix + '...',
            length: accessToken.length,
            looksValid: accessToken.startsWith('APP_USR-') || accessToken.startsWith('TEST-')
        }

        // Test the credentials by making a simple API call
        let credentialsWork = false
        let apiTestError = null
        let userData = null

        try {
            const client = new MercadoPagoConfig({ accessToken })

            // Try to get user info - this will fail with invalid credentials
            const response = await fetch('https://api.mercadopago.com/users/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (response.ok) {
                userData = await response.json()
                credentialsWork = true
            } else {
                const errorData = await response.json()
                apiTestError = errorData
            }
        } catch (error) {
            apiTestError = error instanceof Error ? error.message : String(error)
        }

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            credentials: {
                publicKey: publicKeyInfo,
                accessToken: accessTokenInfo
            },
            apiTest: {
                credentialsWork,
                error: apiTestError,
                userData: userData ? {
                    id: userData.id,
                    nickname: userData.nickname,
                    site_id: userData.site_id,
                    country_id: userData.country_id
                } : null
            },
            recommendation: !credentialsWork
                ? 'Access token appears to be invalid or expired. Please verify in Vercel.'
                : 'Credentials appear to be working.'
        })

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
