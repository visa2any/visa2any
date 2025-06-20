import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/storage'
import { verifyAuth, createAuthError } from '@/lib/auth'
import { z } from 'zod'

// Schema para atualizar documento
const updateDocumentSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['PENDING', 'ANALYZING', 'VALID', 'INVALID', 'NEEDS_REVIEW', 'EXPIRED']).optional(),
  validationNotes: z.string().optional(),
  isValid: z.boolean().optional()
})

// GET /api/documents/[id] - Buscar documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            phone: true,
            targetCountry: true,
            visaType: true,
            status: true
          }
        },
        uploadedBy: {
          select: { id: true, name: true, email: true, role: true }
        },
        consultation: {
          select: { 
            id: true, 
            type: true, 
            status: true,
            scheduledAt: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/[id] - Atualizar documento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const body = await request.json()
    const validatedData = updateDocumentSchema.parse(body)

    // Verificar se documento existe
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id },
      include: { client: true }
    })

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar documento
    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        validatedAt: validatedData.status ? new Date() : existingDocument.validatedAt
      },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true 
          }
        },
        uploadedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Log da atualização
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_UPDATED',
        action: 'update_document',
        details: {
          documentId: params.id,
          changes: validatedData,
          previousStatus: existingDocument.status
        },
        success: true,
        clientId: existingDocument.clientId
      }
    })

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Documento atualizado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar documento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Excluir documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    // Buscar documento
    const document = await prisma.document.findUnique({
      where: { id: params.id }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Excluir arquivo físico usando storage lib
    if (document.fileId) {
      try {
        const subfolder = `clients/${document.clientId}/documents`
        await deleteFile(document.fileId, subfolder)
      } catch (fileError) {
        console.warn('Erro ao excluir arquivo físico:', fileError)
        // Continua mesmo se não conseguir excluir o arquivo
      }
    }

    // Excluir do banco
    await prisma.document.delete({
      where: { id: params.id }
    })

    // Log da exclusão
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_DELETED',
        action: 'delete_document',
        details: {
          documentId: params.id,
          fileName: document.fileName,
          type: document.type
        },
        success: true,
        clientId: document.clientId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Documento excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir documento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/documents/[id]/analyze - Re-analisar documento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: { client: true }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Marcar como analisando
    await prisma.document.update({
      where: { id: params.id },
      data: { status: 'ANALYZING' }
    })

    // Simular re-análise (em produção seria uma chamada para serviço de OCR)
    setTimeout(async () => {
      try {
        let isValid = Math.random() > 0.15 // 85% de chance de ser válido
        let validationNotes = ''
        let analysis: any = {}

        switch (document.type) {
          case 'PASSPORT':
            analysis = {
              expiryDate: '2030-12-31',
              issueDate: '2020-01-01',
              country: 'BR',
              hasPhoto: true,
              quality: 'HIGH',
              reanalyzed: true
            }
            if (!isValid) {
              validationNotes = 'Documento com problemas de autenticidade detectados na re-análise'
            }
            break

          default:
            analysis = {
              quality: 'HIGH',
              reanalyzed: true,
              confidence: 0.95
            }
        }

        await prisma.document.update({
          where: { id: params.id },
          data: {
            status: isValid ? 'VALID' : 'NEEDS_REVIEW',
            isValid,
            analysis,
            validationNotes: isValid ? null : validationNotes,
            validatedAt: new Date()
          }
        })

        // Log da re-análise
        await prisma.automationLog.create({
          data: {
            type: 'DOCUMENT_REANALYZED',
            action: 'reanalyze_document',
            details: {
              documentId: params.id,
              isValid,
              newAnalysis: analysis
            },
            success: true,
            clientId: document.clientId
          }
        })

      } catch (error) {
        console.error('Erro na re-análise:', error)
        
        await prisma.document.update({
          where: { id: params.id },
          data: { status: 'NEEDS_REVIEW' }
        })
      }
    }, 2000)

    return NextResponse.json({
      success: true,
      message: 'Re-análise iniciada. O resultado estará disponível em breve.'
    })

  } catch (error) {
    console.error('Erro ao re-analisar documento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}