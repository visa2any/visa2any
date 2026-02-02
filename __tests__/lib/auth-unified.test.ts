/**
 * @jest-environment node
 */

import { UnifiedUser } from '@/lib/auth-unified'
import jwt from 'jsonwebtoken'

// Mock prisma first
jest.mock('@/lib/prisma', () => ({
    prisma: {
        client: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
        payment: {
            create: jest.fn(),
        },
    },
}))

describe('auth-unified', () => {
    // Store original env value
    const originalSecret = process.env.NEXTAUTH_SECRET

    beforeAll(() => {
        // Ensure secret is set for all tests
        process.env.NEXTAUTH_SECRET = 'test-secret-for-all-tests'
    })

    afterAll(() => {
        // Restore original
        if (originalSecret) {
            process.env.NEXTAUTH_SECRET = originalSecret
        }
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetModules() // Reset modules to get fresh import
    })

    describe('getJwtSecret', () => {
        it('should return secret when configured', async () => {
            process.env.NEXTAUTH_SECRET = 'my-test-secret'
            // Re-import to get fresh module with new env value
            const { getJwtSecret } = await import('@/lib/auth-unified')

            const secret = getJwtSecret()

            expect(secret).toBe('my-test-secret')
        })

        it('should throw when NEXTAUTH_SECRET is not set', async () => {
            // Clear the secret
            const backup = process.env.NEXTAUTH_SECRET
            delete process.env.NEXTAUTH_SECRET

            // Re-import to get fresh module with cleared env
            const { getJwtSecret } = await import('@/lib/auth-unified')

            expect(() => getJwtSecret()).toThrow('CRITICAL: NEXTAUTH_SECRET environment variable is not configured')

            // Restore
            process.env.NEXTAUTH_SECRET = backup
        })
    })

    describe('generateToken', () => {
        beforeEach(() => {
            process.env.NEXTAUTH_SECRET = 'test-secret-for-token-generation'
        })

        it('should generate valid JWT token', async () => {
            const { generateToken } = await import('@/lib/auth-unified')

            const user: UnifiedUser = {
                id: 'user-123',
                email: 'test@example.com',
                name: 'Test User',
                type: 'CUSTOMER',
                isActive: true,
            }

            const token = generateToken(user)

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
        })

        it('should include user type and role in token payload', async () => {
            const { generateToken } = await import('@/lib/auth-unified')

            const user: UnifiedUser = {
                id: 'admin-123',
                email: 'admin@example.com',
                name: 'Admin User',
                type: 'ADMIN',
                role: 'MANAGER',
                isActive: true,
            }

            const token = generateToken(user)
            const decoded = jwt.decode(token) as any

            expect(decoded.userId).toBe('admin-123')
            expect(decoded.email).toBe('admin@example.com')
            expect(decoded.type).toBe('ADMIN')
            expect(decoded.role).toBe('MANAGER')
        })
    })

    describe('user type helpers', () => {
        it('isAdminUser should return true for ADMIN with ADMIN role', async () => {
            const { isAdminUser } = await import('@/lib/auth-unified')

            const user: UnifiedUser = {
                id: 'admin-1',
                email: 'admin@test.com',
                name: 'Admin',
                type: 'ADMIN',
                role: 'ADMIN',
                isActive: true,
            }

            expect(isAdminUser(user)).toBe(true)
        })

        it('isCustomer should return true for CUSTOMER type', async () => {
            const { isCustomer } = await import('@/lib/auth-unified')

            const user: UnifiedUser = {
                id: 'customer-1',
                email: 'customer@test.com',
                name: 'Customer',
                type: 'CUSTOMER',
                isActive: true,
            }

            expect(isCustomer(user)).toBe(true)
        })

        it('isConsultant should return true for CONSULTANT type', async () => {
            const { isConsultant } = await import('@/lib/auth-unified')

            const user: UnifiedUser = {
                id: 'consultant-1',
                email: 'consultant@test.com',
                name: 'Consultant',
                type: 'CONSULTANT',
                isActive: true,
            }

            expect(isConsultant(user)).toBe(true)
        })
    })
})
