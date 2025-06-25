import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




export async function GET(,
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    ),
    }

    // Mock timeline data for the client
    const mockTimeline = [
      {
        id: '1',
        type: 'status_change',
        title: 'Status alterado para Qualificado',
        description: 'Cliente passou pela qualificação inicial e foi aprovado para próximas etapas',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Ana Silva',
        metadata: {
          oldValue: 'LEAD',
          newValue: 'QUALIFIED',
        },
      },
      {
        id: '2',
        type: 'communication',
        title: 'Mensagem WhatsApp recebida',
        description: 'Cliente enviou dúvidas sobre documentação necessária',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Sistema',
        metadata: {
          communicationType: 'whatsapp',
          content: 'Olá, quais documentos preciso enviar para o visto americano?',
        },
      },
      {
        id: '3',
        type: 'document_upload',
        title: 'Documento enviado',
        description: 'Cliente enviou cópia do passaporte',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Cliente',
        metadata: {
          documentType: 'Passaporte',
          attachment: {
            name: 'passaporte-joao-silva.pdf',
            type: 'application/pdf',
            url: '/documents/passaporte-joao-silva.pdf',
            size: 1024576,
          },
        },
      },
      {
        id: '4',
        type: 'consultation',
        title: 'Consulta realizada',
        description: 'Primeira consulta para análise do perfil e estratégia',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Carlos Santos',
        metadata: {
          duration: 60,
          consultationType: 'inicial',
          notes: 'Cliente tem bom perfil para visto EB-1A. Precisa reunir mais evidências de reconhecimento.',
        },
      },
      {
        id: '5',
        type: 'payment',
        title: 'Pagamento realizado',
        description: 'Pagamento da consulta inicial processado com sucesso',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        author: 'Sistema',
        metadata: {
          amount: 250,
          paymentMethod: 'cartao_credito',
          transactionId: 'TXN_12345',
        },
      },
      {
        id: '6',
        type: 'note',
        title: 'Nota adicionada',
        description: 'Cliente tem experiência internacional relevante. Sugerir visto O-1 como alternativa.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Carlos Santos',
        metadata: {},
      },
      {
        id: '7',
        type: 'task',
        title: 'Tarefa criada',
        description: 'Revisar documentos acadêmicos e preparar lista complementar',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Ana Silva',
        metadata: {
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
      },
      {
        id: '8',
        type: 'communication',
        title: 'Email enviado',
        description: 'Lista de documentos complementares enviada por email',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Ana Silva',
        metadata: {
          communicationType: 'email',
          subject: 'Documentos complementares necessários',
          attachment: {
            name: 'lista-documentos-complementares.pdf',
            type: 'application/pdf',
            url: '/documents/lista-documentos-complementares.pdf',
            size: 512000,
          },
        },
      },
      {
        id: '9',
        type: 'system',
        title: 'Score atualizado',
        description: 'Score de elegibilidade recalculado após análise de documentos',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        author: 'Sistema',
        metadata: {
          oldValue: '75',
          newValue: '87',
          reason: 'Documentos acadêmicos aprovados',
        },
      },
      {
        id: '10',
        type: 'status_change',
        title: 'Status alterado para Em Processo',
        description: 'Documentação completa, iniciando preparação da aplicação',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        author: 'Carlos Santos',
        metadata: {
          oldValue: 'DOCUMENTS_PENDING',
          newValue: 'IN_PROCESS',
        },
      }
    ]

    // Sort timeline by timestamp (newest first)
    const sortedTimeline = mockTimeline.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      timeline: sortedTimeline,
      total: sortedTimeline.length,
    })

  } catch (error) {
    console.error('Timeline fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  },
}