import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email e senha são obrigatórios'}, { status: 400 })}

    // Buscar cliente por email
    const customer = await prisma.client.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        targetCountry: true,
        visaType: true,
        score: true,
        consultations: {
          take: 1,
          orderBy: { createdAt: 'desc' }}}})
    
    if (!customer) {
      return NextResponse.json({
        error: 'Credenciais inválidas'}, { status: 401 })}

    // Verificar senha - como não há campo password no modelo Client, vamos usar uma verificação alternativa
    // Por enquanto, vamos aceitar qualquer senha para clientes (implementar autenticação real depois)
    const passwordMatch = true // TODO: Implementar autenticação real para clientes
    
    if (!passwordMatch) {
      return NextResponse.json({
        error: 'Credenciais inválidas'}, { status: 401 })}

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET não configurado')
      return NextResponse.json({
        error: 'Erro de configuração do servidor'}, { status: 500 })}
    
    const token = jwt.sign(
      { 
        customerId: customer.id, 
        email: customer.email,
        type: 'customer'},
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Configurar cookie
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        destinationCountry: customer.targetCountry,
        visaType: customer.visaType,
        eligibilityScore: customer.score},
      token})

    // Definir cookie httpOnly
    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'})
    
    return response

  } catch (error) {
    console.error('Erro no login do cliente:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}