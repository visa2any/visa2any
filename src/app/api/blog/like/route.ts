import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// POST /api/blog/like - Toggle like on blog post

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = request.cookies.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Token de acesso requerido' },
        { status: 401 }
      )}

    // Verify token
    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )}
    
    let userId: string
    try {
      const decoded = jwt.verify(authToken, jwtSecret) as any
      userId = decoded.userId} catch {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )}
    
    const body = await request.json()
    const { postId, action } = body
    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )}
    
    if (action === 'like') {
      // Check if already liked
      const existingLike = await prisma.blogPostLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId}}})
      if (!existingLike) {
        await prisma.blogPostLike.create({
          data: {
            userId,
            postId}})}} else if (action === 'unlike') {
      await prisma.blogPostLike.deleteMany({
        where: {
          userId,
          postId}})}

    // Get updated like count
    const likeCount = await prisma.blogPostLike.count({
      where: { postId }})
    
    return NextResponse.json({
      success: true,
      likeCount,
      action})

  } catch (error) {
    console.error('Error handling blog like:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}