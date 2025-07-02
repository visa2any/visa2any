import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock data for communications

    const mockMessages = [
      {
        id: '1',
        clientId: '1',
        client: { name: 'João Silva', email: 'joao@email.com', phone: '+55119999999' },
        type: 'whatsapp',
        direction: 'inbound',
        content: 'Olá, gostaria de saber sobre o visto americano',
        subject: null,
        status: 'read',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Ana Silva',
        tags: ['visto-americano', 'primeira-conversa'],
        priority: 'medium',
        attachments: [],
        metadata: {
          responseTime: 120,
          sentiment: 'positive'}},
      {
        id: '2',
        clientId: '1',
        client: { name: 'João Silva', email: 'joao@email.com', phone: '+55119999999' },
        type: 'whatsapp',
        direction: 'outbound',
        content: 'Olá João! Ficamos felizes em ajudá-lo. O visto americano tem várias modalidades. Podemos agendar uma consulta para entender melhor seu perfil?',
        subject: null,
        status: 'read',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Ana Silva',
        tags: ['visto-americano', 'resposta'],
        priority: 'medium',
        attachments: [],
        metadata: {
          templateUsed: 'boas-vindas',
          responseTime: 15}},
      {
        id: '3',
        clientId: '2',
        client: { name: 'Maria Santos', email: 'maria@email.com', phone: '+55119888888' },
        type: 'email',
        direction: 'outbound',
        content: 'Prezada Maria, segue em anexo a lista de documentos necessários para seu processo de visto canadense.',
        subject: 'Documentos necessários - Visto Canadense',
        status: 'delivered',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Carlos Santos',
        tags: ['visto-canadense', 'documentos'],
        priority: 'high',
        attachments: [
          {
            id: 'att1',
            name: 'documentos-visto-canadense.pdf',
            type: 'application/pdf',
            size: 245678,
            url: '/files/documentos-visto-canadense.pdf'}
        ],
        metadata: {
          templateUsed: 'documentos-pendentes'}},
      {
        id: '4',
        clientId: '3',
        client: { name: 'Pedro Costa', email: 'pedro@email.com', phone: '+55119777777' },
        type: 'call',
        direction: 'outbound',
        content: 'Ligação realizada - Discussão sobre status da aplicação e próximos passos',
        subject: 'Chamada de acompanhamento',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Lucia Costa',
        tags: ['acompanhamento', 'visto-portugal'],
        priority: 'medium',
        attachments: [],
        metadata: {
          duration: 1800,
          callType: 'follow-up'}},
      {
        id: '5',
        clientId: '2',
        client: { name: 'Maria Santos', email: 'maria@email.com', phone: '+55119888888' },
        type: 'whatsapp',
        direction: 'inbound',
        content: 'Recebi o email com os documentos. Tenho algumas dúvidas sobre o formulário IMM 5406.',
        subject: null,
        status: 'unread',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        assignedTo: 'Carlos Santos',
        tags: ['visto-canadense', 'duvidas', 'formulario'],
        priority: 'high',
        attachments: [],
        metadata: {
          sentiment: 'neutral',
          requiresResponse: true}
    ]

    let filteredMessages = mockMessages

    // Apply filters

    if (clientId) {
      filteredMessages = filteredMessages.filter(msg => msg.clientId === clientId)}
    
    if (type && type !== 'all') {
      filteredMessages = filteredMessages.filter(msg => msg.type === type)}

    // Limit results

    filteredMessages = filteredMessages.slice(0, limit)

    return NextResponse.json({
      messages: filteredMessages,
      total: filteredMessages.length})

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, clientId, subject, attachments } = body

    // Here you would integrate with actual communication providers
    // For now, we'll simulate message sending

    const newMessage = {
      id: Date.now().toString(),
      clientId,
      client: { name: 'Client Name', email: 'client@email.com' },
      type,
      direction: 'outbound',
      content,
      subject,
      status: 'sent',
      timestamp: new Date().toISOString(),
      assignedTo: 'Current User',
      tags: [],
      priority: 'medium',
      attachments: attachments || [],
      metadata: {
        sentAt: new Date().toISOString()}

    // Simulate sending delay

    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      message: newMessage,
      messageId: newMessage.id})

  } catch (error) {
    console.error('Message send error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )}