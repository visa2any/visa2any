import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  const health = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'healthy',
    services: {} as any,
    configuration: {} as any,
    database: {} as any}
  try {
    // Verificar banco de dados
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    health.database = {
      status: 'connected',
      responseTime: Date.now() - dbStart,
      url: process.env.DATABASE_URL ? 'configured' : 'missing'}} catch (error) {
    health.database = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'}
    health.status = 'unhealthy'}

  // Verificar Telegram

  if (process.env.TELEGRAM_BOT_TOKEN) {
  try {
  const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`, {
        signal: AbortSignal.timeout(5000)})
      
      health.services.telegram = {
        status: telegramResponse.ok ? 'active' : 'error',
        configured: true,
        chatId: process.env.TELEGRAM_CHAT_ID ? 'configured' : 'missing'}} catch (error) {
      health.services.telegram = {
        status: 'error',
        configured: true,
        error: 'Connection failed'}}} else {
    health.services.telegram = {
      status: 'not_configured',
      configured: false}

  // Verificar WhatsApp Business API

  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID) {
  try {
  const whatsappResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}`, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`},
        signal: AbortSignal.timeout(5000)})
      
      health.services.whatsapp = {
        status: whatsappResponse.ok ? 'active' : 'error',
        configured: true,
        phoneId: 'configured'}} catch (error) {
      health.services.whatsapp = {
        status: 'error',
        configured: true,
        error: 'Connection failed'}}} else {
    health.services.whatsapp = {
      status: 'not_configured',
      configured: false,
      missing: !process.env.WHATSAPP_TOKEN ? 'WHATSAPP_TOKEN' : 'WHATSAPP_PHONE_ID'}

  // Verificar Email (Resend)

  if (process.env.RESEND_API_KEY) {
  try {
  const emailResponse = await fetch('https://api.resend.com/domains', {
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`},
        signal: AbortSignal.timeout(5000)})
      
      health.services.email = {
        status: emailResponse.ok ? 'active' : 'error',
        configured: true,
        provider: 'resend'}} catch (error) {
      health.services.email = {
        status: 'error',
        configured: true,
        provider: 'resend',
        error: 'Connection failed'}}} else if (process.env.SMTP_HOST) {
    health.services.email = {
      status: 'configured',
      configured: true,
      provider: 'smtp',
      host: process.env.SMTP_HOST}} else {
    health.services.email = {
      status: 'not_configured',
      configured: false,
      missing: 'RESEND_API_KEY or SMTP_HOST'}

  // Verificar MercadoPago

  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  try {
  const mpResponse = await fetch('https://api.mercadopago.com/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},
        signal: AbortSignal.timeout(5000)})
      
      health.services.payment = {
        status: mpResponse.ok ? 'active' : 'error',
        configured: true,
        provider: 'mercadopago'}} catch (error) {
      health.services.payment = {
        status: 'error',
        configured: true,
        provider: 'mercadopago',
        error: 'Connection failed'}}} else if (process.env.STRIPE_SECRET_KEY) {
    health.services.payment = {
      status: 'configured',
      configured: true,
      provider: 'stripe'}} else {
    health.services.payment = {
      status: 'not_configured',
      configured: false,
      missing: 'MERCADOPAGO_ACCESS_TOKEN or STRIPE_SECRET_KEY'}

  // Verificar configurações gerais

  health.configuration = {
    nextauth: {
      url: !!process.env.NEXTAUTH_URL,
      secret: !!process.env.NEXTAUTH_SECRET},
    features: {
      realMonitoring: process.env.ENABLE_REAL_MONITORING === 'true',
      paymentProcessing: process.env.ENABLE_PAYMENT_PROCESSING !== 'false',
      hybridBooking: process.env.ENABLE_HYBRID_BOOKING !== 'false'},
    storage: {
      cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
      aws: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)}

  // Determinar status geral

  const criticalServices = ['database', 'payment']
  const hasCriticalErrors = criticalServices.some(service => {
    if (service === 'database') return health.database.status === 'error'
    if (service === 'payment') return health.services.payment?.status === 'error'
    return false})
  if (hasCriticalErrors) {
    health.status = 'unhealthy'} else {
    const configuredServices = Object.values(health.services).filter((s: any) => s.configured).length
    const activeServices = Object.values(health.services).filter((s: any) => s.status === 'active').length
    
    if (configuredServices === 0) {
      health.status = 'minimal' // Apenas básico funcionando
    } else if (activeServices === configuredServices) {
      health.status = 'healthy' // Tudo que está configurado está funcionando
    } else {
      health.status = 'degraded' // Alguns serviços com problema
    }

  // Retornar status HTTP baseado na saúde

  const statusCode = health.status === 'healthy' ? 200 :
                     health.status === 'degraded' ? 200 :
                     health.status === 'minimal' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })}