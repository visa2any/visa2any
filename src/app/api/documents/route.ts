import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/storage'
import { verifyAuth, createAuthError } from '@/lib/auth'
import { z } from 'zod'

// Schema para upload de documento
const uploadDocumentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum([
    'PASSPORT', 'ID_DOCUMENT', 'BIRTH_CERTIFICATE', 'MARRIAGE_CERTIFICATE',
    'DIPLOMA', 'TRANSCRIPT', 'WORK_CERTIFICATE', 'BANK_STATEMENT',
    'TAX_RETURN', 'MEDICAL_EXAM', 'POLICE_CLEARANCE', 'PHOTOS', 'FORM', 'OTHER'
  ]),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  consultationId: z.string().optional()
})

// GET /api/documents - Listar documentos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (type && type !== 'ALL') {
      where.type = type
    }

    // Buscar documentos
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
        include: {
          client: {
            select: { 
              id: true, 
              name: true, 
              email: true,
              status: true
            }
          },
          uploadedBy: {
            select: { id: true, name: true, email: true }
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
      }),
      prisma.document.count({ where })
    ])

    // Estatísticas
    const stats = await prisma.document.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where: clientId ? { clientId } : {}
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        documents,
        stats: stats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status
          return acc
        }, {} as Record<string, number>),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Upload de documento
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    const formData = await request.formData()
    const file = formData.get('file') as File
    const metadata = formData.get('metadata') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Arquivo é obrigatório' },
        { status: 400 }
      )
    }

    if (!metadata) {
      return NextResponse.json(
        { success: false, error: 'Metadados são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar metadados
    const validatedMetadata = uploadDocumentSchema.parse(JSON.parse(metadata))

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedMetadata.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Validar arquivo
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo 10MB.' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      )
    }

    // Upload usando storage library
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadResult = await uploadFile(buffer, file.name, {
      subfolder: `clients/${validatedMetadata.clientId}/documents`,
      filename: `${Date.now()}_${file.name}`
    })

    // Criar documento no banco
    const document = await prisma.document.create({
      data: {
        name: validatedMetadata.name,
        type: validatedMetadata.type,
        fileName: uploadResult.originalName,
        filePath: uploadResult.url,
        fileSize: uploadResult.size,
        mimeType: uploadResult.mimetype,
        fileId: uploadResult.id,
        status: 'PENDING',
        clientId: validatedMetadata.clientId,
        consultationId: validatedMetadata.consultationId,
        uploadedAt: new Date()
      },
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true 
          }
        }
      }
    })

    // Log da ação
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_UPLOADED',
        action: 'upload_document',
        details: {
          documentId: document.id,
          clientId: validatedMetadata.clientId,
          fileName: file.name,
          fileSize: file.size,
          type: validatedMetadata.type
        },
        success: true,
        clientId: validatedMetadata.clientId
      }
    })

    // Analisar documento automaticamente (simulated)
    setTimeout(async () => {
      try {
        await analyzeDocument(document.id)
      } catch (error) {
        console.error('Erro na análise automática:', error)
      }
    }, 1000)

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Documento enviado com sucesso'
    }, { status: 201 })

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

    console.error('Erro no upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para análise automática de documento
async function analyzeDocument(documentId: string) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { client: true }
    })

    if (!document) return

    // Simular análise OCR e validação
    let isValid = true
    let validationNotes = ''
    let ocrText = ''
    let analysis: any = {}

    // Simulação baseada no tipo de documento
    switch (document.type) {
      case 'PASSPORT':
        ocrText = `PASSPORT\nName: ${document.client.name}\nExpiry: 2030-12-31\nCountry: BR`
        isValid = Math.random() > 0.1 // 90% válido
        analysis = {
          expiryDate: '2030-12-31',
          issueDate: '2020-01-01',
          country: 'BR',
          hasPhoto: true,
          quality: 'HIGH'
        }
        if (!isValid) {
          validationNotes = 'Documento próximo do vencimento ou qualidade da imagem baixa'
        }
        break

      case 'BANK_STATEMENT':
        ocrText = `BANK STATEMENT\nBalance: $25,000\nPeriod: Last 3 months`
        isValid = Math.random() > 0.2 // 80% válido
        analysis = {
          balance: 25000,
          currency: 'USD',
          period: '3 months',
          transactions: 45
        }
        if (!isValid) {
          validationNotes = 'Saldo insuficiente ou período muito curto'
        }
        break

      default:
        ocrText = `Document content extracted: ${document.fileName}`
        isValid = Math.random() > 0.15 // 85% válido
        analysis = {
          pages: 1,
          quality: 'MEDIUM',
          language: 'pt'
        }
    }

    // Atualizar documento com análise
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: isValid ? 'VALID' : 'NEEDS_REVIEW',
        isValid,
        ocrText,
        analysis,
        validationNotes: isValid ? null : validationNotes,
        validatedAt: new Date()
      }
    })

    // Log da análise
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_ANALYZED',
        action: 'analyze_document',
        details: {
          documentId,
          isValid,
          analysisResult: analysis
        },
        success: true,
        clientId: document.clientId
      }
    })

  } catch (error) {
    console.error('Erro na análise do documento:', error)
    
    // Log do erro
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_ANALYSIS_ERROR',
        action: 'analyze_document',
        details: {
          documentId,
          error: error.message
        },
        success: false
      }
    })
  }
}