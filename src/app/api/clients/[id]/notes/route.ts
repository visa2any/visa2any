import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const body = await request.json()
    const { content } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
    )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
    )
    }

    // Create note record
    const noteId = `note_${Date.now()}`
    const newNote = {
      id: noteId,
      clientId,
      content: content.trim(),
      author: 'Current User', // In a real app, get from session
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Here you would save the note to the database
    // For now, we'll simulate the save operation
    await new Promise(resolve => setTimeout(resolve, 200))

    // Create timeline entry for the note
    const timelineEntry = {
      id: `timeline_${Date.now()}`,
      type: 'note',
      title: 'Nota adicionada',
      description: content.trim(),
      timestamp: new Date().toISOString(),
      author: 'Current User',
      metadata: {
        noteId: noteId
      }
    }

    return NextResponse.json({
      message: 'Note added successfully',
      data: {
        note: newNote,
        timelineEntry: timelineEntry
      }
    })

  } catch (error) {
    console.error('Add note error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
    )
    }

    // Mock notes data
    const mockNotes = [
      {
        id: 'note_1',
        clientId,
        content: 'Cliente tem experiência internacional relevante. Sugerir visto O-1 como alternativa.',
        author: 'Carlos Santos',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'note_2',
        clientId,
        content: 'Documentação acadêmica está completa. Próximo passo é reunir cartas de recomendação.',
        author: 'Ana Silva',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({
      notes: mockNotes
      total: mockNotes.length
    })

  } catch (error) {
    console.error('Get notes error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}