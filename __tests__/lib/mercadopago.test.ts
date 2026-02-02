/**
 * @jest-environment node
 */

import {
    createMercadoPagoClient,
    createPreference,
    mapPaymentStatus,
    processWebhook,
    PaymentData,
    PreferenceData,
} from '@/lib/mercadopago'

// Mock mercadopago module
jest.mock('mercadopago', () => ({
    MercadoPagoConfig: jest.fn().mockImplementation((config) => ({
        accessToken: config.accessToken,
        options: config.options,
    })),
    Payment: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        get: jest.fn(),
    })),
    Preference: jest.fn().mockImplementation(() => ({
        create: jest.fn().mockResolvedValue({
            id: 'pref-123',
            init_point: 'https://mercadopago.com/checkout/123',
            sandbox_init_point: 'https://sandbox.mercadopago.com/checkout/123',
        }),
    })),
}))

describe('MercadoPago Integration', () => {
    describe('createMercadoPagoClient', () => {
        it('should create client with generated idempotency key', () => {
            const client1 = createMercadoPagoClient()
            const client2 = createMercadoPagoClient()

            // Each client should have unique idempotency key
            expect(client1).toBeDefined()
            expect(client2).toBeDefined()
        })

        it('should create client with custom idempotency key', () => {
            const customKey = 'custom-key-123'
            const client = createMercadoPagoClient(customKey)

            expect(client).toBeDefined()
            expect(client.options?.idempotencyKey).toBe(customKey)
        })

        it('should generate key with correct format', () => {
            const client = createMercadoPagoClient()
            const key = client.options?.idempotencyKey

            expect(key).toMatch(/^mp_\d+_[a-z0-9]+$/)
        })
    })

    describe('mapPaymentStatus', () => {
        it('should map approved to COMPLETED', () => {
            expect(mapPaymentStatus('approved')).toBe('COMPLETED')
        })

        it('should map pending to PENDING', () => {
            expect(mapPaymentStatus('pending')).toBe('PENDING')
        })

        it('should map rejected to FAILED', () => {
            expect(mapPaymentStatus('rejected')).toBe('FAILED')
        })

        it('should map cancelled to CANCELLED', () => {
            expect(mapPaymentStatus('cancelled')).toBe('CANCELLED')
        })

        it('should map refunded to REFUNDED', () => {
            expect(mapPaymentStatus('refunded')).toBe('REFUNDED')
        })

        it('should map charged_back to REFUNDED', () => {
            expect(mapPaymentStatus('charged_back')).toBe('REFUNDED')
        })

        it('should map in_process to PROCESSING', () => {
            expect(mapPaymentStatus('in_process')).toBe('PROCESSING')
        })

        it('should map authorized to PROCESSING', () => {
            expect(mapPaymentStatus('authorized')).toBe('PROCESSING')
        })

        it('should map in_mediation to PROCESSING', () => {
            expect(mapPaymentStatus('in_mediation')).toBe('PROCESSING')
        })

        it('should return PENDING for unknown status', () => {
            expect(mapPaymentStatus('unknown_status')).toBe('PENDING')
            expect(mapPaymentStatus('')).toBe('PENDING')
        })
    })

    describe('processWebhook', () => {
        it('should process payment webhook correctly', () => {
            const webhookBody = {
                type: 'payment',
                data: { id: 'payment-123' },
            }

            const result = processWebhook(webhookBody)

            expect(result.success).toBe(true)
            expect(result.type).toBe('payment')
            expect(result.payment_id).toBe('payment-123')
        })

        it('should handle other webhook types', () => {
            const webhookBody = {
                type: 'subscription',
                data: { id: 'sub-123' },
            }

            const result = processWebhook(webhookBody)

            expect(result.success).toBe(true)
            expect(result.type).toBe('subscription')
            expect(result.data).toEqual({ id: 'sub-123' })
        })

        it('should handle invalid webhook data', () => {
            const webhookBody = null

            const result = processWebhook(webhookBody)

            expect(result.success).toBe(false)
            expect(result.error).toBeDefined()
        })
    })

    describe('createPreference', () => {
        beforeEach(() => {
            process.env.NEXTAUTH_URL = 'https://visa2any.com'
        })

        it('should create preference with valid data', async () => {
            const preferenceData: PreferenceData = {
                items: [
                    {
                        id: 'product-1',
                        title: 'Vaga Express Premium',
                        quantity: 1,
                        unit_price: 149.90,
                        currency_id: 'BRL',
                    },
                ],
                external_reference: 'order-123',
            }

            const result = await createPreference(preferenceData)

            expect(result.success).toBe(true)
            expect(result.preference_id).toBe('pref-123')
            expect(result.init_point).toBeDefined()
        })

        it('should handle missing payer data', async () => {
            const preferenceData: PreferenceData = {
                items: [
                    {
                        id: 'product-1',
                        title: 'Test Product',
                        quantity: 1,
                        unit_price: 99.90,
                        currency_id: 'BRL',
                    },
                ],
            }

            const result = await createPreference(preferenceData)

            expect(result.success).toBe(true)
        })

        it('should include payer data when provided', async () => {
            const preferenceData: PreferenceData = {
                items: [
                    {
                        id: 'product-1',
                        title: 'Test Product',
                        quantity: 1,
                        unit_price: 99.90,
                        currency_id: 'BRL',
                    },
                ],
                payer: {
                    name: 'John',
                    surname: 'Doe',
                    email: 'john@example.com',
                },
            }

            const result = await createPreference(preferenceData)

            expect(result.success).toBe(true)
        })
    })
})
