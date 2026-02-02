
/** @jest-environment node */
import { POST as webhookPost } from '@/app/api/n8n/webhook/route'
import { prisma } from '@/lib/prisma'
import { notificationService } from '@/lib/notification-service'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
    prisma: {
        client: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        interaction: {
            create: jest.fn(),
        },
        automationLog: {
            create: jest.fn()
        },
        document: {
            update: jest.fn()
        },
        consultation: {
            create: jest.fn()
        }
    },
}))

// Mock NotificationService
jest.mock('@/lib/notification-service', () => ({
    notificationService: {
        sendVagaAlert: jest.fn().mockResolvedValue(true),
    },
}))

describe('Vaga Express Integration Flow', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should find matching clients and send WhatsApp notification when slot is found', async () => {
        // 1. Setup Mock Data
        const mockSlotData = {
            type: 'consular_slot',
            data: {
                country: 'US',
                consulate: 'Rio de Janeiro',
                city: 'Rio de Janeiro',
                availableSlots: 5,
                visaType: 'B1/B2',
                earliestDate: '2024-12-25'
            }
        }

        const mockClients = [
            { id: 'client-1', name: 'John Doe', email: 'john@example.com', phone: '5511999999999', targetCountry: 'US', visaType: 'B1/B2' },
            { id: 'client-2', name: 'Jane Doe', email: 'jane@example.com', phone: '5511888888888', targetCountry: 'US', visaType: 'B1/B2' }
        ]

            // 2. Mock Prisma Response
            ; (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients)

        // 3. Create Request
        const req = new NextRequest('http://localhost:3000/api/n8n/webhook', {
            method: 'POST',
            body: JSON.stringify(mockSlotData)
        })

        // 4. Invoke Webhook Handler
        const response = await webhookPost(req)

        // 5. Assertions
        expect(response.status).toBe(200)

        // Verify DB Query
        expect(prisma.client.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                targetCountry: 'US',
                visaType: { contains: 'B1/B2' }
            })
        }))

        // Verify Notification Dispatch
        expect(notificationService.sendVagaAlert).toHaveBeenCalledTimes(2)
        expect(notificationService.sendVagaAlert).toHaveBeenCalledWith('5511999999999', expect.stringContaining('Rio de Janeiro'))
        expect(notificationService.sendVagaAlert).toHaveBeenCalledWith('5511888888888', expect.stringContaining('2024-12-25'))

        // Verify Interaction Log
        expect(prisma.interaction.create).toHaveBeenCalledTimes(2)
        expect(prisma.interaction.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                type: 'AUTOMATED_WHATSAPP',
                response: 'SENT'
            })
        }))
    })
})
