const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestClient() {
  console.log('🧪 Criando cliente de teste...')

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    // Criar cliente de teste
    const testClient = await prisma.client.upsert({
      where: { email: 'cliente@teste.com' },
      update: {
        password: hashedPassword,
        name: 'Cliente Teste',
        phone: '(11) 99999-9999',
        status: 'QUALIFIED',
        isActive: true
      },
      create: {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        password: hashedPassword,
        phone: '(11) 99999-9999',
        status: 'QUALIFIED',
        isActive: true,
        eligibilityScore: 85,
        destinationCountry: 'Estados Unidos',
        visaType: 'Turismo'
      }
    })

    console.log('✅ Cliente de teste criado com sucesso!')
    console.log('\n📋 Credenciais de acesso:')
    console.log('Email: cliente@teste.com')
    console.log('Senha: 123456')
    console.log('\n🌐 Acesse: http://localhost:3000/cliente/login')

    // Criar outro cliente de exemplo
    const hashedPassword2 = await bcrypt.hash('senha123', 12)
    
    const client2 = await prisma.client.upsert({
      where: { email: 'maria@exemplo.com' },
      update: {
        password: hashedPassword2
      },
      create: {
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        password: hashedPassword2,
        phone: '(11) 98888-8888',
        status: 'IN_PROCESS',
        isActive: true,
        eligibilityScore: 92,
        destinationCountry: 'Canadá',
        visaType: 'Trabalho'
      }
    })

    console.log('\n✅ Cliente adicional criado:')
    console.log('Email: maria@exemplo.com')
    console.log('Senha: senha123')

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestClient()