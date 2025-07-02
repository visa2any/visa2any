import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password, type } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )}

    let result
    if (type === 'admin') {
      // Login para admin/staff
      if (!password) {
        return NextResponse.json(
          { error: 'Senha é obrigatória para admin' },
          { status: 400 }
        )}
      result = await loginAdmin(email, password)} else {
      // Login para cliente (pode não ter senha na primeira vez)
      result = await loginCustomer(email, password)}

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Credenciais inválidas' },
        { status: result.error === 'NEEDS_PASSWORD_SETUP' ? 202 : 401 }
      )}

    // Criar cookie de autenticação
    const response = NextResponse.json({
      user: result.user,
      token: result.token})

    // Configurar cookie httpOnly
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'})

    return response

  } catch (error) {
    console.error('Erro no login unificado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )}

// Função para login de admin
async function loginAdmin(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true}})

    if (!user || !user.isActive) {
      return { success: false, error: 'Credenciais inválidas' }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return { success: false, error: 'Credenciais inválidas' }

    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret) {
      throw new Error('JWT secret não configurado')}

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'admin'},
      jwtSecret,
      { expiresIn: '24h' }
    )

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: 'admin'},
      token}} catch (error) {
    console.error('Erro no login admin:', error)
    return { success: false, error: 'Erro interno' }}

// Função para login de cliente
async function loginCustomer(email: string, password?: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        status: true}})

    if (!client) {
      return { success: false, error: 'Cliente não encontrado' }

    /*
    // Se cliente não tem senha definida, precisa configurar
    if (!client.password && !password) {
      return { success: false, error: 'NEEDS_PASSWORD_SETUP' }

    // Se tem senha, verificar
    if (client.password && password) {
      const isPasswordValid = await bcrypt.compare(password, client.password)
      if (!isPasswordValid) {
        return { success: false, error: 'Credenciais inválidas' }}
    */

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

    return {
      success: true,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        type: 'client'},
      token}} catch (error) {
    console.error('Erro no login cliente:', error)
    return { success: false, error: 'Erro interno' }}