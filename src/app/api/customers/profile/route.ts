import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

async function getCustomerFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('customer-token')?.value
    
    if (!token) {
      return null
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET não configurado')
      return null
    }

    const payload = jwt.verify(token, jwtSecret) as any
    
    if (payload.type !== 'customer') {
      return null
    }

    return await prisma.client.findUnique({
      where: { id: payload.customerId },
      include: {
        consultations: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const customer = await getCustomerFromToken(request)

    if (!customer) {
      return NextResponse.json({
        error: 'Cliente não encontrado ou não autenticado'
      }, { status: 401 })
    }

    // Calcular progresso baseado no status
    const progressMap: Record<string, number> = {
      'LEAD': 10,
      'QUALIFIED': 20,
      'CONSULTATION_SCHEDULED': 30,
      'IN_PROCESS': 50,
      'DOCUMENTS_PENDING': 60,
      'SUBMITTED': 80,
      'APPROVED': 95,
      'COMPLETED': 100
    }

    const progress = progressMap[customer.status] || 10

    // Simular dados do consultor (posteriormente buscar da base)
    const consultant = {
      name: 'Ana Silva',
      email: 'ana.silva@visa2any.com',
      phone: '+55 11 99999-9999',
      avatar: null
    }

    // Simular próximo milestone
    const nextMilestone = {
      title: customer.status === 'LEAD' ? 'Análise de Elegibilidade' :
             customer.status === 'QUALIFIED' ? 'Agendamento de Consultoria' :
             customer.status === 'CONSULTATION_SCHEDULED' ? 'Consultoria Inicial' :
             customer.status === 'IN_PROCESS' ? 'Coleta de Documentos' :
             customer.status === 'DOCUMENTS_PENDING' ? 'Revisão de Documentos' :
             customer.status === 'SUBMITTED' ? 'Acompanhamento da Aplicação' :
             customer.status === 'APPROVED' ? 'Preparação para Viagem' : 'Processo Concluído',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      description: 'Próxima etapa do seu processo de imigração'
    }

    // Simular timeline
    const timeline = [
      {
        id: '1',
        title: 'Cadastro Inicial',
        description: 'Conta criada e perfil inicial preenchido',
        date: customer.createdAt.toLocaleDateString('pt-BR'),
        status: 'completed'
      },
      {
        id: '2',
        title: 'Análise de Elegibilidade',
        description: 'Avaliação inicial do seu perfil',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: customer.status === 'LEAD' ? 'current' : 'completed'
      },
      {
        id: '3',
        title: 'Consultoria Especializada',
        description: 'Reunião com consultor para estratégia personalizada',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: ['CONSULTATION_SCHEDULED', 'IN_PROCESS', 'DOCUMENTS_PENDING', 'SUBMITTED', 'APPROVED', 'COMPLETED'].includes(customer.status) ? 'completed' :
                ['QUALIFIED'].includes(customer.status) ? 'current' : 'upcoming'
      },
      {
        id: '4',
        title: 'Coleta de Documentos',
        description: 'Preparação de toda documentação necessária',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: ['IN_PROCESS', 'DOCUMENTS_PENDING', 'SUBMITTED', 'APPROVED', 'COMPLETED'].includes(customer.status) ? 'completed' :
                customer.status === 'CONSULTATION_SCHEDULED' ? 'current' : 'upcoming'
      },
      {
        id: '5',
        title: 'Submissão da Aplicação',
        description: 'Envio oficial da aplicação para as autoridades',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: ['SUBMITTED', 'APPROVED', 'COMPLETED'].includes(customer.status) ? 'completed' :
                ['DOCUMENTS_PENDING'].includes(customer.status) ? 'current' : 'upcoming'
      },
      {
        id: '6',
        title: 'Aprovação',
        description: 'Recebimento da aprovação oficial',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: ['APPROVED', 'COMPLETED'].includes(customer.status) ? 'completed' :
                customer.status === 'SUBMITTED' ? 'current' : 'upcoming'
      }
    ]

    // Simular documentos
    const documents = customer.documents.map(doc => ({
      id: doc.id,
      name: doc.fileName || 'Documento',
      status: doc.status?.toLowerCase() || 'pending',
      uploadDate: doc.uploadedAt.toLocaleDateString('pt-BR'),
      comments: doc.notes
    }))

    // Adicionar documentos simulados se não houver nenhum
    if (documents.length === 0) {
      documents.push(
        {
          id: 'doc1',
          name: 'Passaporte',
          status: 'pending',
          uploadDate: 'Aguardando envio',
          comments: null
        },
        {
          id: 'doc2',
          name: 'Diploma Universitário',
          status: 'pending',
          uploadDate: 'Aguardando envio',
          comments: null
        }
      )
    }

    // Simular pagamentos
    const payments = customer.payments.map(payment => ({
      id: payment.id,
      description: payment.description || 'Pagamento de serviço',
      amount: payment.amount,
      status: payment.status.toLowerCase(),
      dueDate: payment.dueDate ? payment.dueDate.toLocaleDateString('pt-BR') : 'A definir',
      paidDate: payment.paidAt ? payment.paidAt.toLocaleDateString('pt-BR') : undefined
    }))

    // Adicionar pagamentos simulados se não houver nenhum
    if (payments.length === 0) {
      payments.push({
        id: 'pay1',
        description: 'Taxa de Consultoria',
        amount: 297,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        paidDate: undefined
      })
    }

    // Simular notificações
    const notifications = [
      {
        id: 'notif1',
        title: 'Bem-vindo ao Portal!',
        message: 'Sua conta foi criada com sucesso. Comece explorando seu painel.',
        type: 'success',
        date: customer.createdAt.toLocaleDateString('pt-BR'),
        read: false
      },
      {
        id: 'notif2',
        title: 'Próximos Passos',
        message: 'Complete seu perfil para uma análise mais precisa.',
        type: 'info',
        date: new Date().toLocaleDateString('pt-BR'),
        read: false
      }
    ]

    const customerData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      destinationCountry: customer.destinationCountry || 'A definir',
      visaType: customer.visaType || 'A definir',
      status: customer.status,
      eligibilityScore: customer.eligibilityScore || 0,
      currentStage: customer.status,
      progress,
      consultant,
      nextMilestone,
      documents,
      timeline,
      payments,
      notifications
    }

    return NextResponse.json({
      customer: customerData
    })

  } catch (error) {
    console.error('Erro ao buscar perfil do cliente:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}