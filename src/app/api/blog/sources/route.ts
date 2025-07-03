import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todas as fontes de notícias
export async function GET() {
  try {
    const sources = await prisma.newsSource.findMany({
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 5}},
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]})
    
    return NextResponse.json({
      success: true,
      sources,
      total: sources.length,
      active: sources.filter(s => s.isActive).length})

  } catch (error) {
    console.error('[SOURCES] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fontes' },
      { status: 500 }
    )
  }
}

// POST - Adicionar nova fonte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      url,
      type,
      category,
      country,
      flag,
      keywords,
      priority,
      checkInterval} = body

    // Validação
    if (!name || !url || !type || !category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, url, type, category' },
        { status: 400 }
      )}

    // Verificar se URL já existe
    const existingSource = await prisma.newsSource.findUnique({
      where: { url }})
    
    if (existingSource) {
      return NextResponse.json(
        { error: 'Fonte com esta URL já existe' },
        { status: 409 }
      )}
    
    const newSource = await prisma.newsSource.create({
      data: {
        name,
        url,
        type,
        category,
        country: country || 'Global',
        flag: flag || '🌍',
        keywords: keywords || [],
        priority: priority || 1,
        checkInterval: checkInterval || 60}})
    
    return NextResponse.json({
      success: true,
      source: newSource,
      message: 'Fonte adicionada com sucesso'})

  } catch (error) {
    console.error('[SOURCES] Erro ao criar:', error)
    return NextResponse.json(
      { error: 'Erro ao criar fonte' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar fonte existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da fonte é obrigatório' },
        { status: 400 }
      )}
    
    const updatedSource = await prisma.newsSource.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()}})
    
    return NextResponse.json({
      success: true,
      source: updatedSource,
      message: 'Fonte atualizada com sucesso'})

  } catch (error) {
    console.error('[SOURCES] Erro ao atualizar:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar fonte' },
      { status: 500 }
    )
  }
}

// DELETE - Remover fonte
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da fonte é obrigatório' },
        { status: 400 }
      )}

    // Primeiro deletar logs relacionados
    await prisma.autoNewsLog.deleteMany({
      where: { sourceId: id }})

    // Depois deletar a fonte
    await prisma.newsSource.delete({
      where: { id }})
    
    return NextResponse.json({
      success: true,
      message: 'Fonte removida com sucesso'})

  } catch (error) {
    console.error('[SOURCES] Erro ao deletar:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar fonte' },
      { status: 500 }
    )
  }
}