const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando setup do banco de dados...')

  try {
    // Criar usuário admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@visa2any.com' },
      update: {},
      create: {
        name: 'Administrator',
        email: 'admin@visa2any.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('✅ Usuário admin criado:', adminUser.email)

    // Criar alguns usuários de exemplo
    const consultorPassword = await bcrypt.hash('consultor123', 12)
    
    const consultor = await prisma.user.upsert({
      where: { email: 'consultor@visa2any.com' },
      update: {},
      create: {
        name: 'João Silva',
        email: 'consultor@visa2any.com',
        password: consultorPassword,
        role: 'CONSULTANT',
        isActive: true
      }
    })

    console.log('✅ Consultor criado:', consultor.email)

    // Criar configurações do sistema
    await prisma.systemConfig.upsert({
      where: { key: 'email_notifications' },
      update: { value: { enabled: true, smtp_configured: false } },
      create: {
        key: 'email_notifications',
        value: { enabled: true, smtp_configured: false }
      }
    })

    await prisma.systemConfig.upsert({
      where: { key: 'whatsapp_integration' },
      update: { value: { enabled: false, api_configured: false } },
      create: {
        key: 'whatsapp_integration',
        value: { enabled: false, api_configured: false }
      }
    })

    console.log('✅ Configurações do sistema criadas')

    // Criar alguns requisitos de visto de exemplo
    const visaRequirements = [
      {
        country: 'Estados Unidos',
        visaType: 'turismo',
        visaSubtype: 'B1/B2',
        requiredDocuments: [
          'Passaporte válido',
          'Formulário DS-160',
          'Foto 5x5cm',
          'Comprovante financeiro',
          'Carta do empregador'
        ],
        processingTime: '3-5 semanas',
        fees: { consular: 185, sevis: 0 },
        eligibilityCriteria: [
          'Passaporte válido por pelo menos 6 meses',
          'Comprovação de vínculos com o Brasil',
          'Recursos financeiros suficientes'
        ],
        commonPitfalls: [
          'Documentação financeira insuficiente',
          'Falta de vínculos com o país de origem',
          'Histórico de viagens inadequado'
        ],
        successTips: [
          'Prepare documentação completa',
          'Demonstre vínculos fortes com o Brasil',
          'Seja honesto na entrevista'
        ],
        governmentLinks: [
          'https://travel.state.gov/',
          'https://ceac.state.gov/genniv/'
        ]
      },
      {
        country: 'Canadá',
        visaType: 'turismo',
        visaSubtype: 'Visitor Visa',
        requiredDocuments: [
          'Passaporte válido',
          'Formulário IMM 5257',
          'Fotos biométricas',
          'Comprovante financeiro',
          'Carta convite (se aplicável)'
        ],
        processingTime: '2-4 semanas',
        fees: { visa: 100, biometrics: 85 },
        eligibilityCriteria: [
          'Passaporte válido',
          'Recursos financeiros adequados',
          'Sem antecedentes criminais'
        ],
        commonPitfalls: [
          'Formulário preenchido incorretamente',
          'Documentação financeira inadequada',
          'Falta de propósito claro da viagem'
        ],
        successTips: [
          'Complete todos os formulários cuidadosamente',
          'Forneça documentação financeira robusta',
          'Explique claramente o propósito da viagem'
        ],
        governmentLinks: [
          'https://www.canada.ca/en/immigration-refugees-citizenship.html'
        ]
      }
    ]

    for (const requirement of visaRequirements) {
      await prisma.visaRequirement.upsert({
        where: {
          country_visaType_visaSubtype: {
            country: requirement.country,
            visaType: requirement.visaType,
            visaSubtype: requirement.visaSubtype
          }
        },
        update: requirement,
        create: requirement
      })
    }

    console.log('✅ Requisitos de visto criados')

    console.log('\n🎉 Setup concluído com sucesso!')
    console.log('\n📋 Credenciais de acesso:')
    console.log('Admin: admin@visa2any.com / admin123')
    console.log('Consultor: consultor@visa2any.com / consultor123')
    console.log('\n🌐 Acesse: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Erro durante o setup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })