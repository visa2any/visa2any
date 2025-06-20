import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, listFiles } from '@/lib/storage'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para upload
const uploadSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  documentType: z.string().min(1, 'Tipo de documento é obrigatório'),
  filename: z.string().optional(),
  generateThumbnail: z.boolean().default(false)
})

// POST /api/files - Upload de arquivo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    const documentType = formData.get('documentType') as string
    const generateThumbnail = formData.get('generateThumbnail') === 'true'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar dados
    const validatedData = uploadSchema.parse({
      clientId,
      documentType,
      filename: file.name,
      generateThumbnail
    })

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload do arquivo
    const uploadResult = await uploadFile(buffer, file.name, {
      subfolder: `clients/${validatedData.clientId}`,
      generateThumbnail: validatedData.generateThumbnail
    })

    // Salvar no banco de dados
    const document = await prisma.document.create({
      data: {
        fileName: uploadResult.originalName,
        filePath: uploadResult.path,
        fileSize: uploadResult.size,
        fileType: uploadResult.mimetype,
        type: validatedData.documentType as any,
        status: 'PENDING',
        fileId: uploadResult.id,
        fileUrl: uploadResult.url,
        clientId: validatedData.clientId
      }
    })

    // Log do upload
    await prisma.automationLog.create({
      data: {
        type: 'DOCUMENT_UPLOADED',
        action: 'file_upload',
        details: {
          documentId: document.id,
          fileId: uploadResult.id,
          fileName: uploadResult.originalName,
          fileSize: uploadResult.size,
          documentType: validatedData.documentType
        },
        success: true,
        clientId: validatedData.clientId
      }
    })

    // Trigger análise automática se configurado
    if (process.env.AUTO_ANALYZE_DOCUMENTS === 'true') {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/ai/document-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: document.id
          })
        })
      } catch (analysisError) {
        console.error('Erro ao iniciar análise automática:', analysisError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          fileName: document.fileName,
          fileSize: document.fileSize,
          fileType: document.fileType,
          type: document.type,
          status: document.status,
          url: uploadResult.url,
          uploadedAt: document.createdAt
        },
        file: {
          id: uploadResult.id,
          url: uploadResult.url,
          size: uploadResult.size,
          hash: uploadResult.hash
        }
      },
      message: 'Arquivo enviado com sucesso'
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

    console.error('Erro no upload de arquivo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/files - Listar arquivos (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const subfolder = searchParams.get('subfolder')

    if (clientId) {
      // Listar arquivos de um cliente específico
      const files = await listFiles(`clients/${clientId}`)
      
      // Buscar dados dos documentos no banco
      const documents = await prisma.document.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' }
      })

      const filesWithDocuments = files.map(file => {
        const document = documents.find(doc => doc.fileId === file.id)
        return {
          ...file,
          document: document ? {
            id: document.id,
            type: document.type,
            status: document.status,
            isValid: document.isValid,
            validatedAt: document.validatedAt,
            validationNotes: document.validationNotes
          } : null
        }
      })

      return NextResponse.json({
        success: true,
        data: filesWithDocuments
      })
    }

    // Listar todos os arquivos (admin)
    const files = await listFiles(subfolder || undefined)
    
    return NextResponse.json({
      success: true,
      data: files
    })

  } catch (error) {
    console.error('Erro ao listar arquivos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}