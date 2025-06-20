const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔧 Criando usuário administrador...')

    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Usuário administrador já existe:', existingAdmin.email)
      return
    }

    // Criar senha hash
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@visa2any.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('✅ Usuário administrador criado com sucesso!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Senha:', password)
    console.log('👤 Role:', admin.role)

    // Log da criação
    await prisma.automationLog.create({
      data: {
        type: 'ADMIN_CREATED',
        action: 'create_admin_user',
        details: {
          userId: admin.id,
          email: admin.email,
          createdBy: 'seed-script'
        },
        success: true
      }
    })

    console.log('\n⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdmin()
}

module.exports = { createAdmin }