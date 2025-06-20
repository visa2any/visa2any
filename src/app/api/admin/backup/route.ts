import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, isAdmin } from '@/lib/auth'
import { backupSystem } from '@/lib/backup-system'
import { z } from 'zod'

// Schema para ações de backup
const backupActionSchema = z.object({
  action: z.enum(['create', 'list', 'restore', 'export']),
  backupPath: z.string().optional()
})

// GET /api/admin/backup - Listar backups disponíveis
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissão
    const user = await verifyAuth(request)
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const backups = backupSystem.getAvailableBackups()

    return NextResponse.json({
      success: true,
      data: {
        backups,
        total: backups.length,
        totalSize: backups.reduce((sum, backup) => sum + backup.size, 0)
      }
    })

  } catch (error) {
    console.error('Erro ao listar backups:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/backup - Executar ações de backup
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação e permissão
    const user = await verifyAuth(request)
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, backupPath } = backupActionSchema.parse(body)

    let result

    switch (action) {
      case 'create':
        result = await backupSystem.createDatabaseBackup()
        break

      case 'export':
        result = await backupSystem.createDataExport()
        break

      case 'restore':
        if (!backupPath) {
          return NextResponse.json(
            { success: false, error: 'backupPath é obrigatório para restore' },
            { status: 400 }
          )
        }
        result = await backupSystem.restoreBackup(backupPath)
        break

      case 'list':
        const backups = backupSystem.getAvailableBackups()
        return NextResponse.json({
          success: true,
          data: { backups }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Ação inválida' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result,
        message: `${action} realizado com sucesso`
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

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

    console.error('Erro na API de backup:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}