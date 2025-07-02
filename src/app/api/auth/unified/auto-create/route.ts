import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, phone, country, nationality, targetCountry, source, product, amount } = data

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )}

    // Verificar se cliente já existe
    const existingClient = await prisma.client.findUnique({
      where: { email }})

    if (existingClient) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )}

    // Criar cliente
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        country,
        nationality,
        targetCountry,
        source: source || 'direct',
        status: 'LEAD'}})

    // Gerar token JWT
    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      throw new Error('JWT secret não configurado')}

    const token = jwt.sign(
      {
        userId: client.id,
        email: client.email,
        type: 'client'},
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Criar cookie de autenticação automática
    const response = NextResponse.json({
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        type: 'client'},
      token,
      message: 'Conta criada e login automático realizado'})

    // Configurar cookie httpOnly
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'})

    return response

  } catch (error) {
    console.error('Erro na criação automática de conta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}