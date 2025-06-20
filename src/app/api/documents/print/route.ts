import { NextRequest, NextResponse } from 'next/server'
import { documentPrintingService, PrintPackage, PrintOptions } from '@/lib/document-printing'

// POST - Gerar pacote de impressão
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { printPackage, options }: { printPackage: PrintPackage; options: PrintOptions } = body

    // Validação dos dados obrigatórios
    if (!printPackage.applicantName || !printPackage.consulate || !printPackage.visaType) {
      return NextResponse.json(
        { error: 'Campos applicantName, consulate e visaType são obrigatórios' },
        { status: 400 }
      )
    }

    if (!printPackage.documents || printPackage.documents.length === 0) {
      return NextResponse.json(
        { error: 'Lista de documentos não pode estar vazia' },
        { status: 400 }
      )
    }

    // Configurações padrão se não fornecidas
    const defaultOptions: PrintOptions = {
      includeCovers: true,
      includeTabs: true,
      includeChecklist: true,
      includeInstructions: true,
      bindingType: 'folder',
      paperSize: 'A4',
      printQuality: 'normal',
      ...options
    }

    // Gerar pacote de impressão
    const result = await documentPrintingService.generatePrintPackage(printPackage, defaultOptions)

    if (result.success) {
      // TODO: Salvar pacote no banco de dados para rastreamento
      
      return NextResponse.json({
        success: true,
        packageId: result.packageId,
        files: result.files,
        printInstructions: result.printInstructions,
        estimatedPages: result.estimatedPages,
        estimatedCost: result.estimatedCost,
        message: `Pacote de impressão gerado com sucesso! ${result.estimatedPages} páginas estimadas.`
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao gerar pacote de impressão',
          details: 'Verifique se todos os documentos estão acessíveis'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro na API de impressão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Buscar pacotes de impressão existentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const packageId = searchParams.get('packageId')

    if (!applicantId && !packageId) {
      return NextResponse.json(
        { error: 'Parâmetro applicantId ou packageId é obrigatório' },
        { status: 400 }
      )
    }

    // TODO: Implementar busca no banco de dados
    // Por enquanto, retorna dados mock
    const mockPackages = [
      {
        packageId: 'PRINT-123456-João-Silva',
        applicantName: 'João Silva',
        consulate: 'usa',
        visaType: 'B1/B2',
        status: 'ready',
        createdAt: '2024-01-15T10:00:00Z',
        estimatedPages: 25,
        estimatedCost: 12.50
      }
    ]

    return NextResponse.json({
      success: true,
      packages: mockPackages,
      total: mockPackages.length
    })

  } catch (error) {
    console.error('Erro ao buscar pacotes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}