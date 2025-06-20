import { NextRequest, NextResponse } from 'next/server'
import { readFile, getFile, deleteFile } from '@/lib/storage'
import { prisma } from '@/lib/prisma'

// GET /api/files/[...path] - Servir arquivo
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathArray = params.path
    
    if (!pathArray || pathArray.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Caminho do arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Extrair fileId e subfolder do path
    let fileId: string
    let subfolder: string | undefined

    if (pathArray.length === 1) {
      // Formato: /api/files/fileId
      fileId = pathArray[0]
    } else {
      // Formato: /api/files/subfolder/fileId ou /api/files/clients/clientId/fileId
      fileId = pathArray[pathArray.length - 1]
      subfolder = pathArray.slice(0, -1).join('/')
    }

    // Obter informações do arquivo
    const fileRecord = await getFile(fileId, subfolder)
    
    if (!fileRecord) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Ler conteúdo do arquivo
    const buffer = await readFile(fileId, subfolder)
    
    if (!buffer) {
      return NextResponse.json(
        { success: false, error: 'Erro ao ler arquivo' },
        { status: 500 }
      )
    }

    // Log do acesso
    try {
      await prisma.automationLog.create({
        data: {
          type: 'FILE_ACCESS',
          action: 'file_download',
          details: {
            fileId: fileId,
            fileName: fileRecord.originalName,
            fileSize: fileRecord.size,
            subfolder: subfolder,
            accessedAt: new Date()
          },
          success: true,
          clientId: subfolder?.includes('clients/') ? subfolder.split('/')[1] : null
        }
      })
    } catch (logError) {
      // Não falhar por erro de log
      console.error('Erro ao registrar acesso ao arquivo:', logError)
    }

    // Retornar arquivo com headers apropriados
    const response = new NextResponse(buffer)
    
    response.headers.set('Content-Type', fileRecord.mimetype)
    response.headers.set('Content-Length', fileRecord.size.toString())
    response.headers.set('Content-Disposition', `inline; filename="${fileRecord.originalName}"`)
    
    // Cache headers para arquivos estáticos
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    response.headers.set('ETag', fileRecord.hash)
    
    return response

  } catch (error) {
    console.error('Erro ao servir arquivo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/files/[...path] - Deletar arquivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathArray = params.path
    
    if (!pathArray || pathArray.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Caminho do arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Extrair fileId e subfolder do path
    let fileId: string
    let subfolder: string | undefined

    if (pathArray.length === 1) {
      fileId = pathArray[0]
    } else {
      fileId = pathArray[pathArray.length - 1]
      subfolder = pathArray.slice(0, -1).join('/')
    }

    // Verificar se arquivo existe
    const fileRecord = await getFile(fileId, subfolder)
    
    if (!fileRecord) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar documento associado no banco
    const document = await prisma.document.findFirst({
      where: { fileId: fileId }
    })

    // Deletar arquivo físico
    const deleted = await deleteFile(fileId, subfolder)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Erro ao deletar arquivo' },
        { status: 500 }
      )
    }

    // Remover documento do banco se existir
    if (document) {
      await prisma.document.delete({
        where: { id: document.id }
      })
    }

    // Log da deleção
    await prisma.automationLog.create({
      data: {
        type: 'FILE_DELETED',
        action: 'file_delete',
        details: {
          fileId: fileId,
          fileName: fileRecord.originalName,
          fileSize: fileRecord.size,
          subfolder: subfolder,
          documentId: document?.id,
          deletedAt: new Date()
        },
        success: true,
        clientId: subfolder?.includes('clients/') ? subfolder.split('/')[1] : null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}