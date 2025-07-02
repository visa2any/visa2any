import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para iniciar sequência de nurturing
const nurturingSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  sequenceType: z.enum([
    'welcome_lead',
    'assessment_follow_up',
    'cart_abandonment',
    'post_purchase',
    'consultation_prep',
    'document_submission',
    'visa_application',
    'success_celebration',
    'referral_request'
  ]),
  triggerData: z.record(z.any()).optional(),
  customSchedule: z.array(z.object({
    day: z.number(),
    hour: z.number().optional(),
    template: z.string()})).optional()})

// POST /api/automation/nurturing - Iniciar sequência de nurturing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = nurturingSchema.parse(body)

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 5}}})

    if (!client) {
      return NextResponse.json({
        error: 'Cliente não encontrado'}, { status: 404 })}

    // Determinar sequência baseada no tipo
    const sequence = getSequenceByType(validatedData.sequenceType)
    
    if (!sequence) {
      return NextResponse.json({
        error: 'Tipo de sequência não suportado'}, { status: 400 })}

    // Iniciar sequência de nurturing
    const result = await startNurturingSequence({
      client,
      sequenceType: validatedData.sequenceType,
      sequence,
      triggerData: validatedData.triggerData,
      customSchedule: validatedData.customSchedule})

    return NextResponse.json({
      message: `Sequência ${validatedData.sequenceType} iniciada para ${client.name}`,
      sequenceId: result.sequenceId,
      emailsScheduled: result.emailsScheduled})

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: error.errors}, { status: 400 })}

    console.error('Erro ao iniciar nurturing:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'}, { status: 500 })}

// Função para obter sequência por tipo
function getSequenceByType(type: string) {
  const sequences: Record<string, any[]> = {
    welcome_lead: [
      {
        delay: 0,
        subject: '👋 Bem-vindo(a) à Visa2Any, {name}!',
        template: 'welcome_template'},
      {
        delay: 1440, // 24h
        subject: '📚 {name}, seus materiais gratuitos estão prontos',
        template: 'materials_template'}
    ],
    assessment_follow_up: [
      {
        delay: 60, // 1h
        subject: '⏰ {name}, complete sua análise',
        template: 'assessment_reminder'}
    ],
    cart_abandonment: [
      {
        delay: 30, // 30min
        subject: '🛒 {name}, você esqueceu algo...',
        template: 'cart_recovery_1'},
      {
        delay: 1440, // 24h
        subject: '💔 Ainda interessado, {name}?',
        template: 'cart_recovery_2'}
    ]}

  return sequences[type] || null}

// Função principal para iniciar sequência
async function startNurturingSequence(params: {
  client: any,
  sequenceType: string,
  sequence: any[]
  triggerData?: any
  customSchedule?: any[] | undefined}) {
  const { client, sequenceType, sequence, triggerData, customSchedule } = params

  // Usar schedule customizado se fornecido
  const finalSequence = customSchedule || sequence

  let emailsScheduled = 0

  for (const template of finalSequence) {
    try {
      // Calcular quando enviar
      const sendAt = new Date()
      sendAt.setMinutes(sendAt.getMinutes() + (template.delay || 0))

      // Criar variáveis para template
      const variables = {
        name: client.name,
        email: client.email,
        targetCountry: client.targetCountry,
        ...triggerData}

      // Processar template
      const processedSubject = processTemplate(template.subject, variables)
      const processedBody = getTemplateContent(template.template, variables)

      // Agendar envio
      await scheduleNurturingEmail({
        clientId: client.id,
        to: client.email,
        subject: processedSubject,
        body: processedBody,
        sendAt,
        sequenceType,
        templateName: template.template || 'custom'})

      emailsScheduled++} catch (error) {
      console.error('Erro ao agendar email da sequência:', error)}

  // Log da ativação da sequência
  await prisma.automationLog.create({
    data: {
      type: 'NURTURING_SEQUENCE',
      action: `start_${sequenceType}`,
      clientId: client.id,
      success: true,
      details: {
        sequenceType,
        emailsScheduled,
        triggerData,
        startedAt: new Date().toISOString()}}})

  return {
    sequenceId: `nurturing_${sequenceType}_${Date.now()}`,
    emailsScheduled}

// Função para processar templates
function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    processed = processed.replace(regex, String(value || ''))})
  
  return processed}

// Função para obter conteúdo do template
function getTemplateContent(templateName: string, variables: Record<string, any>): string {
  const templates: Record<string, string> = {
    welcome_template: `Olá {name}!

Seja muito bem-vindo(a) à Visa2Any! 🎉

Estamos aqui para tornar seu sonho de imigrar para {targetCountry} uma realidade.

Nos próximos dias, você receberá:
✅ Guias práticos
✅ Dicas exclusivas
✅ Análises personalizadas

Vamos começar essa jornada juntos!

Equipe Visa2Any`,

    materials_template: `Oi {name}!

Seus materiais gratuitos estão prontos para download:

📖 Guia Completo de Imigração
📋 Checklist de Documentos
💰 Planilha de Comprovação Financeira

Baixe agora: https://visa2any.com/materiais

Att,
Equipe Visa2Any`,

    assessment_reminder: `{name}, você estava fazendo sua análise...

Continue de onde parou e descubra suas chances reais de aprovação!

Clique aqui para continuar: https://visa2any.com/assessment

Equipe Visa2Any`,

    cart_recovery_1: `Oi {name}!

Notei que você estava interessado em nossos serviços mas não finalizou.

Tem alguma dúvida? Posso ajudar!

WhatsApp: https://wa.me/5511999999999

Ana Silva
Consultora Visa2Any`,

    cart_recovery_2: `{name}, ainda está interessado?

Sei que decidir sobre imigração é algo importante e que merece reflexão.

Se tiver qualquer dúvida, estou aqui para ajudar.

Ou se mudou de ideia, sem problemas! 

Att,
Equipe Visa2Any`}

  const template = templates[templateName] || `Olá {name}!

Obrigado pelo seu interesse na Visa2Any.

Em breve entraremos em contato.

Att,
Equipe Visa2Any`

  return processTemplate(template, variables)}

// Função para agendar email de nurturing
async function scheduleNurturingEmail(emailData: {
  clientId: string,
  to: string,
  subject: string,
  body: string,
  sendAt: Date,
  sequenceType: string,
  templateName: string}) {
  try {
    // Log da programação
    console.log(`Email nurturing agendado:`, {
      to: emailData.to,
      subject: emailData.subject,
      sendAt: emailData.sendAt,
      sequenceType: emailData.sequenceType})

    // Se for para envio imediato
    if (emailData.sendAt <= new Date()) {
      await sendNurturingEmailNow(emailData)}

    // Registrar interação
    await prisma.interaction.create({
      data: {
        clientId: emailData.clientId,
        type: 'AUTOMATED_EMAIL',
        channel: 'email',
        direction: 'outbound',
        subject: emailData.subject,
        content: `Nurturing email agendado: ${emailData.sequenceType}`,
        completedAt: new Date()}})

  } catch (error) {
    console.error('Erro ao agendar email nurturing:', error)}

// Função para envio imediato
async function sendNurturingEmailNow(emailData: {
  to: string,
  subject: string,
  body: string,
  sequenceType: string,
  clientId: string}) {
  try {
    // Simular envio de email
    console.log(`Enviando email nurturing para ${emailData.to}`)
    
    // Em produção, usar serviço real de email
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.body.replace(/\n/g, '<br>'),
        template: 'nurturing'})})

    // Atualizar interação
    await prisma.interaction.create({
      data: {
        clientId: emailData.clientId,
        type: 'EMAIL',
        channel: 'email',
        direction: 'outbound',
        subject: emailData.subject,
        content: `Nurturing email enviado: ${emailData.sequenceType}`,
        completedAt: new Date()}})

  } catch (error) {
    console.error('Erro ao enviar email nurturing:', error)}