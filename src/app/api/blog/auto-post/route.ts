import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      category,
      author,
      tags,
      country,
      flag,
      difficulty,
      type,
      sourceUrl,
      urgent,
      trending} = body

    // Validação básica
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, excerpt, content, category' },
        { status: 400 }
      )}

    // Verificar se já existe um post com o mesmo título
    const existingPost = await prisma.blogPost.findFirst({
      where: { title }})

    if (existingPost) {
      return NextResponse.json(
        { error: 'Post com este título já existe' },
        { status: 409 }
      )}

    // Criar novo post no banco
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        category,
        author: author || 'Visa2Any Auto',
        tags: tags || [],
        country: country || 'Global',
        flag: flag || '🌍',
        difficulty: difficulty || 'Intermediário',
        type: type || 'Notícia',
        sourceUrl,
        urgent: urgent || false,
        trending: trending || false,
        published: true,
        publishDate: new Date(),
        readTime: calculateReadTime(content).toString(),
        views: 0,
        likes: 0,
        comments: 0,
        featured: urgent || trending || false}})

    // Log da criação automática
    await prisma.automationLog.create({
      data: {
        type: 'BLOG_AUTO_POST',
        action: 'create_post',
        success: true,
        details: {
          postId: newPost.id,
          title: newPost.title,
          category: newPost.category,
          urgent: newPost.urgent,
          trending: newPost.trending,
          autoCreatedAt: new Date().toISOString()}}})

    // Se for urgente ou trending, criar notificação
    if (urgent || trending) {
      await createPostNotification(newPost)}

    return NextResponse.json({
      data: {
        id: newPost.id,
        title: newPost.title,
        published: newPost.published,
        urgent: newPost.urgent,
        trending: newPost.trending,
        readTime: newPost.readTime},
      message: 'Post criado automaticamente com sucesso!'})

  } catch (error) {
    console.error('Erro ao criar post automático:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para calcular tempo de leitura
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Função para criar notificação de post
async function createPostNotification(post: any) {
  try {
    const notificationType = post.urgent ? 'URGENT_POST' : 'TRENDING_POST'
    const message = post.urgent 
      ? `🚨 POST URGENTE: ${post.title}`
      : `🔥 POST EM ALTA: ${post.title}`

    // Simular notificação (implementar com serviço real)
    console.log(`Notificação criada: ${message}`)

    // Em produção, enviar para:
    // - WhatsApp Business API
    // - Email para assinantes
    // - Push notifications
    // - Slack/Discord webhooks

  } catch (error) {
    console.error('Erro ao criar notificação:', error)
  }
}

// GET - Listar posts automáticos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await prisma.blogPost.findMany({
      where: {
        author: 'Visa2Any Auto'},
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        country: true,
        flag: true,
        urgent: true,
        trending: true,
        published: true,
        views: true,
        createdAt: true,
        publishDate: true}})

    const total = await prisma.blogPost.count({
      where: {
        author: 'Visa2Any Auto'}})

    return NextResponse.json({
      data: {
        posts,
        total,
        limit,
        offset,
        hasMore: offset + limit < total}})

  } catch (error) {
    console.error('Erro ao listar posts automáticos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}