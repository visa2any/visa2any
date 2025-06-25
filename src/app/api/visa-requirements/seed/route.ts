import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/visa-requirements/seed - Popular base de conhecimento
export async function POST(request: NextRequest) {
  try {
    // Limpar dados existentes
    await prisma.visaRequirement.deleteMany({})

    // Dados de exemplo para popular a base
    const visaRequirements = [
      // CANADÁ
      {
        country: 'Canadá',
        visaType: 'Express Entry',
        visaSubtype: 'Federal Skilled Worker',
        requiredDocuments: [
          {
            type: 'PASSPORT',
            name: 'Passaporte válido',
            required: true,
            description: 'Passaporte com validade mínima de 6 meses',
            validityMonths: 6,
          },
          {
            type: 'DIPLOMA',
            name: 'Diploma universitário',
            required: true,
            description: 'Diploma reconhecido de ensino superior',
            validityMonths: null,
          },
          {
            type: 'TRANSCRIPT',
            name: 'Histórico escolar',
            required: true,
            description: 'Histórico completo com notas',
            validityMonths: null,
          },
          {
            type: 'WORK_CERTIFICATE',
            name: 'Comprovante de experiência',
            required: true,
            description: 'Mínimo 1 ano de experiência qualificada',
            validityMonths: null,
          },
          {
            type: 'BANK_STATEMENT',
            name: 'Comprovante financeiro',
            required: true,
            description: 'CAD $13,310 para pessoa solteira',
            validityMonths: 3,
          },
          {
            type: 'MEDICAL_EXAM',
            name: 'Exame médico',
            required: true,
            description: 'Exame em clínica aprovada',
            validityMonths: 12,
          },
          {
            type: 'POLICE_CLEARANCE',
            name: 'Antecedentes criminais',
            required: true,
            description: 'De todos os países onde viveu',
            validityMonths: 12
          }
        ],
        processingTime: '6-8 meses',
        fees: {
          government: 1365,
          service: 2500,
          currency: 'CAD',
        },
        eligibilityCriteria: [
          {
            criterion: 'Idade',
            description: 'Idade entre 18-45 anos (pontuação máxima aos 20-29)',
            required: true,
          },
          {
            criterion: 'Educação',
            description: 'Mínimo ensino médio completo',
            required: true,
          },
          {
            criterion: 'Experiência',
            description: 'Mínimo 1 ano de experiência qualificada',
            required: true,
          },
          {
            criterion: 'Idioma',
            description: 'CLB 7 em inglês ou francês',
            required: true,
          },
          {
            criterion: 'Recursos financeiros',
            description: 'Comprovação de fundos suficientes',
            required: true
          }
        ],
        commonPitfalls: [
          'Não validar credenciais educacionais (ECA)',
          'Teste de idioma insuficiente',
          'Documentos de experiência incompletos',
          'Não comprovar fundos suficientes',
          'Exame médico expirado'
        ],
        successTips: [
          'Faça o ECA o quanto antes',
          'Alcance CLB 9+ em inglês para máxima pontuação',
          'Organize documentos de experiência detalhadamente',
          'Mantenha fundos em conta por pelo menos 6 meses',
          'Considere Provincial Nominee Program (PNP)'
        ],
        governmentLinks: [
          {
            name: 'Site oficial do Express Entry',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html'
          },
          {
            name: 'Calculadora CRS',
            url: 'https://www.cic.gc.ca/english/immigrate/skilled/crs-tool.asp'
          }
        ],
      },

      // AUSTRÁLIA
      {
        country: 'Austrália',
        visaType: 'Skilled Independent',
        visaSubtype: 'Subclass 189',
        requiredDocuments: [
          {
            type: 'PASSPORT',
            name: 'Passaporte válido',
            required: true,
            description: 'Passaporte com validade mínima de 6 meses',
            validityMonths: 6,
          },
          {
            type: 'DIPLOMA',
            name: 'Qualificações educacionais',
            required: true,
            description: 'Diploma reconhecido pelo governo australiano',
            validityMonths: null,
          },
          {
            type: 'WORK_CERTIFICATE',
            name: 'Evidência de experiência',
            required: true,
            description: 'Mínimo 3 anos em ocupação qualificada',
            validityMonths: null,
          },
          {
            type: 'MEDICAL_EXAM',
            name: 'Exame médico',
            required: true,
            description: 'Health examination by panel physician',
            validityMonths: 12,
          },
          {
            type: 'POLICE_CLEARANCE',
            name: 'Character assessment',
            required: true,
            description: 'Police certificates from all countries',
            validityMonths: 12
          }
        ],
        processingTime: '8-12 meses',
        fees: {
          government: 4640,
          service: 3000,
          currency: 'AUD',
        },
        eligibilityCriteria: [
          {
            criterion: 'Idade',
            description: 'Menos de 45 anos',
            required: true,
          },
          {
            criterion: 'Inglês',
            description: 'IELTS 6.0 cada banda (mínimo)',
            required: true,
          },
          {
            criterion: 'Skills Assessment',
            description: 'Avaliação positiva da profissão',
            required: true,
          },
          {
            criterion: 'EOI Points',
            description: 'Mínimo 65 pontos no SkillSelect',
            required: true
          }
        ],
        commonPitfalls: [
          'Skills assessment rejeitado',
          'Pontuação insuficiente no SkillSelect',
          'IELTS abaixo dos 7.0 em todas as bandas',
          'Documentos de experiência inadequados',
          'Não estar na lista SOL/CSOL'
        ],
        successTips: [
          'Alcance IELTS 8.0+ para máxima pontuação',
          'Complete Professional Year se possível',
          'Considere estudar na Austrália primeiro',
          'Verifique demanda da sua ocupação',
          'Mantenha-se atualizado com mudanças na policy'
        ],
        governmentLinks: [
          {
            name: 'Department of Home Affairs',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189'
          },
          {
            name: 'SkillSelect',
            url: 'https://www.skillselect.gov.au/'
          }
        ],
      },

      // PORTUGAL
      {
        country: 'Portugal',
        visaType: 'D7 Visa',
        visaSubtype: 'Rendimento Próprio',
        requiredDocuments: [
          {
            type: 'PASSPORT',
            name: 'Passaporte',
            required: true,
            description: 'Passaporte válido por mais de 3 meses',
            validityMonths: 3,
          },
          {
            type: 'BANK_STATEMENT',
            name: 'Comprovativo de rendimentos',
            required: true,
            description: 'Rendimento mínimo de €760/mês',
            validityMonths: 3,
          },
          {
            type: 'POLICE_CLEARANCE',
            name: 'Registo criminal',
            required: true,
            description: 'Certidão de antecedentes do país de origem',
            validityMonths: 12,
          },
          {
            type: 'MEDICAL_EXAM',
            name: 'Atestado médico',
            required: true,
            description: 'Declaração médica de sanidade física e mental',
            validityMonths: 6,
          },
          {
            type: 'OTHER',
            name: 'Comprovativo de alojamento',
            required: true,
            description: 'Contrato de arrendamento ou propriedade',
            validityMonths: null
          }
        ],
        processingTime: '2-4 meses',
        fees: {
          government: 320,
          service: 1500,
          currency: 'EUR',
        },
        eligibilityCriteria: [
          {
            criterion: 'Rendimento',
            description: 'Rendimento mínimo de €760 mensais',
            required: true,
          },
          {
            criterion: 'Alojamento',
            description: 'Comprovativo de habitação em Portugal',
            required: true,
          },
          {
            criterion: 'Seguro',
            description: 'Seguro de saúde válido',
            required: true
          }
        ],
        commonPitfalls: [
          'Rendimento insuficiente comprovado',
          'Documentos não apostilados',
          'Falta de comprovativo de alojamento',
          'Seguro de saúde inadequado',
          'Tradução certificada em falta'
        ],
        successTips: [
          'Comprove rendimento estável por 6+ meses',
          'Apostile todos os documentos',
          'Contrate seguro com cobertura ampla',
          'Organize alojamento antes da aplicação',
          'Considere consultoria especializada'
        ],
        governmentLinks: [
          {
            name: 'SEF - Serviço de Estrangeiros e Fronteiras',
            url: 'https://www.sef.pt/pt/pages/homepage.aspx'
          },
          {
            name: 'Portal do Cidadão',
            url: 'https://www.portaldocidadao.pt/'
          }
        ],
      },

      // ESTADOS UNIDOS
      {
        country: 'Estados Unidos',
        visaType: 'EB-1A',
        visaSubtype: 'Extraordinary Ability',
        requiredDocuments: [
          {
            type: 'PASSPORT',
            name: 'Passport',
            required: true,
            description: 'Valid passport for 6+ months',
            validityMonths: 6,
          },
          {
            type: 'WORK_CERTIFICATE',
            name: 'Evidence of extraordinary ability',
            required: true,
            description: 'Awards, publications, media coverage',
            validityMonths: null,
          },
          {
            type: 'OTHER',
            name: 'Form I-140',
            required: true,
            description: 'Petition for immigrant worker',
            validityMonths: null
          }
        ],
        processingTime: '12-18 meses',
        fees: {
          government: 1435,
          service: 8000,
          currency: 'USD',
        },
        eligibilityCriteria: [
          {
            criterion: 'Extraordinary ability',
            description: '3 of 10 criteria must be met',
            required: true,
          },
          {
            criterion: 'Field expertise',
            description: 'National or international acclaim',
            required: true
          }
        ],
        commonPitfalls: [
          'Insufficient evidence of extraordinary ability',
          'Poor documentation organization',
          'Missing expert opinion letters',
          'Inadequate proof of acclaim'
        ],
        successTips: [
          'Collect extensive evidence portfolio',
          'Get expert opinion letters',
          'Document media coverage thoroughly',
          'Organize evidence by criteria',
          'Consider premium processing'
        ],
        governmentLinks: [
          {
            name: 'USCIS Official Page',
            url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1'
          }
        ]
      }
    ]

    // Inserir todos os requisitos
    const created = await Promise.all(
      visaRequirements.map(requirement => 
        prisma.visaRequirement.create({
          data: {
            ...requirement,
            lastUpdated: new Date(),
            isActive: true,
          },
        })
      )
    )

    // Log da população
    await prisma.automationLog.create({
      data: {
        type: 'VISA_REQUIREMENTS_SEEDED',
        action: 'seed_visa_requirements',
        success: true,
        details: {
          timestamp: new Date().toISOString(),
          action: 'automated_action',
        },
      },
    })

    return NextResponse.json({
      data: {
        created: created.length,
        requirements: created,
      },
      message: `${created.length} requisitos de visto criados com sucesso`,
    })

  } catch (error) {
    console.error('Erro ao popular base de conhecimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    ),
  }
}