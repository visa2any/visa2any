/**
 * @jest-environment node
 */

import { validateCriticalEnvVars, requireEnv, optionalEnv } from '@/lib/env-validator'

describe('Environment Validator', () => {
    const originalEnv = { ...process.env }

    beforeEach(() => {
        jest.clearAllMocks()
        // Restore original env
        process.env = { ...originalEnv }
    })

    afterAll(() => {
        process.env = originalEnv
    })

    describe('validateCriticalEnvVars', () => {
        it('should return valid when all critical vars are set', () => {
            process.env.NEXTAUTH_SECRET = 'test-secret'
            process.env.DATABASE_URL = 'postgresql://localhost:5432/test'

            const result = validateCriticalEnvVars()

            expect(result.valid).toBe(true)
            expect(result.missing).toHaveLength(0)
        })

        it('should return invalid when NEXTAUTH_SECRET is missing', () => {
            delete process.env.NEXTAUTH_SECRET
            process.env.DATABASE_URL = 'postgresql://localhost:5432/test'

            const result = validateCriticalEnvVars()

            expect(result.valid).toBe(false)
            expect(result.missing).toContain('NEXTAUTH_SECRET')
        })

        it('should return invalid when DATABASE_URL is missing', () => {
            process.env.NEXTAUTH_SECRET = 'test-secret'
            delete process.env.DATABASE_URL

            const result = validateCriticalEnvVars()

            expect(result.valid).toBe(false)
            expect(result.missing).toContain('DATABASE_URL')
        })

        it('should include warnings for recommended vars', () => {
            process.env.NEXTAUTH_SECRET = 'test-secret'
            process.env.DATABASE_URL = 'postgresql://localhost:5432/test'
            delete process.env.MERCADOPAGO_ACCESS_TOKEN
            delete process.env.SENDGRID_API_KEY

            const result = validateCriticalEnvVars()

            expect(result.valid).toBe(true)
            expect(result.warnings.length).toBeGreaterThan(0)
        })

        it('should throw in production when critical vars missing', () => {
            const originalNodeEnv = process.env.NODE_ENV

            Object.defineProperty(process.env, 'NODE_ENV', {
                value: 'production',
                writable: true
            })

            delete process.env.NEXTAUTH_SECRET

            expect(() => validateCriticalEnvVars()).toThrow()

            Object.defineProperty(process.env, 'NODE_ENV', {
                value: originalNodeEnv,
                writable: true
            })
        })
    })

    describe('requireEnv', () => {
        it('should return value when env var exists', () => {
            process.env.TEST_VAR = 'test-value'

            const value = requireEnv('TEST_VAR')

            expect(value).toBe('test-value')
        })

        it('should throw when env var does not exist', () => {
            delete process.env.NONEXISTENT_VAR

            expect(() => requireEnv('NONEXISTENT_VAR')).toThrow(
                'Required environment variable NONEXISTENT_VAR is not configured'
            )
        })
    })

    describe('optionalEnv', () => {
        it('should return value when env var exists', () => {
            process.env.OPTIONAL_VAR = 'optional-value'

            const value = optionalEnv('OPTIONAL_VAR')

            expect(value).toBe('optional-value')
        })

        it('should return default value when env var does not exist', () => {
            delete process.env.NONEXISTENT_OPTIONAL

            const value = optionalEnv('NONEXISTENT_OPTIONAL', 'default-value')

            expect(value).toBe('default-value')
        })

        it('should return empty string when no default provided', () => {
            delete process.env.NONEXISTENT_OPTIONAL

            const value = optionalEnv('NONEXISTENT_OPTIONAL')

            expect(value).toBe('')
        })
    })
})
