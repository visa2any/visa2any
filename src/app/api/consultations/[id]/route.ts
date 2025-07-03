import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthError } from '@/lib/auth'
import { z } from 'zod'

// Schema para atualizar consultoria
const updateConsultationSchema = z.object({
  type: z.enum(['AI_ANALYSIS', 'HUMAN_CONSULTATION', 'FOLLOW_UP', 'DOCUMENT_REVIEW', 'INTERVIEW_PREP', 'VIP_SERVICE']).optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  scheduledAt: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  duration: z.number().optional(),
  result: z.any().optional(),
  score: z.number().min(0).max(100).optional(),
  recommendation: z.string().optional(),
  timeline: z.string().optional(),
  nextSteps: z.string().optional(),
  notes: z.string().optional(),
  consultantId: z.string().optional()})

// GET /api/consultations/[id] - Buscar consultoria específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    
    const { id } = params
    
    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            documents: {
              orderBy: { uploadedAt: 'desc' }
            }
          }
        },
        consultant: {
          select: { id: true, name: true, email: true, role: true }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultoria não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      data: consultation
    })

  } catch (error) {
    console.error('Erro ao buscar consultoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/consultations/[id] - Atualizar campo específico (inline edit)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    
    const { id } = params
    const body = await request.json()

    // Validar dados
    const validatedData = updateConsultationSchema.parse(body)

    // Verificar se consultoria existe
    const existingConsultation = await prisma.consultation.findUnique({
      where: { id }})
    
    if (!existingConsultation) {
      return NextResponse.json(
        { error: 'Consultoria não encontrada' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = { ...validatedData }
    
    if (validatedData.scheduledAt) {
      // Handle both ISO string and datetime-local format
      if (validatedData.scheduledAt.includes('T')) {
        updateData.scheduledAt = new Date(validatedData.scheduledAt)} else {
        updateData.scheduledAt = new Date(validatedData.scheduledAt + 'T00:00:00.000Z')}

    // Se está marcando como completa, definir completedAt automaticamente
    if (validatedData.status === 'COMPLETED' && !updateData.completedAt) {
      updateData.completedAt = new Date()}

    // Atualizar consultoria
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: { id: true, name: true, email: true }},
        consultant: {
          select: { id: true, name: true, email: true }}}})

    // Log da atualização
    await prisma.automationLog.create({
      data: {
        type: 'CONSULTATION_UPDATED',
        action: 'inline_edit',
        clientId: existingConsultation.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action'},
        success: true}})
    
    return NextResponse.json({
      data: updatedConsultation})

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors},
        { status: 400 }
      )}
    
    console.error('Erro ao atualizar consultoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/consultations/[id] - Atualizar consultoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    
    const { id } = params
    const body = await request.json()

    // Validar dados
    const validatedData = updateConsultationSchema.parse(body)

    // Verificar se consultoria existe
    const existingConsultation = await prisma.consultation.findUnique({
      where: { id },
      include: { client: true }})
    
    if (!existingConsultation) {
      return NextResponse.json(
        { error: 'Consultoria não encontrada' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = { ...validatedData }
    
    if (validatedData.scheduledAt) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt)}
    
    if (validatedData.completedAt) {
      updateData.completedAt = new Date(validatedData.completedAt)}

    // Se está marcando como completa, definir completedAt automaticamente
    if (validatedData.status === 'COMPLETED' && !updateData.completedAt) {
      updateData.completedAt = new Date()}

    // Atualizar consultoria
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            status: true }},
        consultant: {
          select: { id: true, name: true, email: true }}}})

    // Atualizar status do cliente baseado no resultado da consultoria
    if (validatedData.status === 'COMPLETED') {
      let newClientStatus = existingConsultation.client.status

      // Lógica para determinar próximo status do cliente
      if (validatedData.score && validatedData.score >= 70) {
        newClientStatus = 'IN_PROCESS'} else if (validatedData.score && validatedData.score < 40) {
        newClientStatus = 'QUALIFIED' // Precisa de mais trabalho
      } else {
        newClientStatus = 'DOCUMENTS_PENDING'}
      
      await prisma.client.update({
        where: { id: existingConsultation.clientId },
        data: { 
          status: newClientStatus,
          score: validatedData.score || existingConsultation.client.score}})}

    // Log da atualização
    await prisma.automationLog.create({
      data: {
        type: 'CONSULTATION_UPDATED',
        action: 'update_consultation',
        clientId: existingConsultation.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action'},
        success: true}})
    
    return NextResponse.json({
      data: updatedConsultation})

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors},
        { status: 400 }
      )}
    
    console.error('Erro ao atualizar consultoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/consultations/[id] - Deletar consultoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(request)
    if (!user) {
      return createAuthError('Acesso não autorizado')
    }
    
    const { id } = params

    // Verificar se consultoria existe
    const existingConsultation = await prisma.consultation.findUnique({
      where: { id }})
    
    if (!existingConsultation) {
      return NextResponse.json(
        { error: 'Consultoria não encontrada' },
        { status: 404 }
      )
    }

    // Deletar consultoria
    await prisma.consultation.delete({
      where: { id }})

    // Log da deleção
    await prisma.automationLog.create({
      data: {
        type: 'CONSULTATION_DELETED',
        action: 'delete_consultation',
        clientId: existingConsultation.clientId,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action'},
        success: true}})
    
    return NextResponse.json({
      message: 'Consultoria deletada com sucesso'})

  } catch (error) {
    console.error('Erro ao deletar consultoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}