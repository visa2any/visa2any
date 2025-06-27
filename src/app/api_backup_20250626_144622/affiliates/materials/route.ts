import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'




// Materiais promocionais pré-definidos
const defaultMaterials = [
  // Banners,  {
    type: 'BANNER',
    title: 'Banner Principal - Visa2Any',
    description: 'Banner principal com logo e call-to-action',
    category: 'banners',
    tags: ['principal', 'logo', 'cta'],
    content: `
      <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px; border-radius: 12px; text-align: center; color: white; font-family: Arial, sans-serif;">
        <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 16px;">🌍 Realize seu sonho de viver no exterior!</h1>
        <p style="font-size: 18px; margin-bottom: 24px;">Consultoria especializada em imigração com 12+ anos de experiência</p>
        <div style="background: white; color: #3B82F6; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">
          ✅ 95% de aprovação • 12.000+ clientes • 50+ países
        </div>
        <p style="margin-top: 20px; font-size: 14px;">Use o código: {{REFERRAL_CODE}}</p>
      </div>
    `,
    imageUrl: '/images/banners/banner-principal.jpg',
    previewUrl: '/materials/preview/banner-principal',
    isActive: true
  },
  {
    type: 'BANNER',
    title: 'Banner Visto EUA',
    description: 'Banner específico para promoção de visto americano',
    category: 'banners',
    tags: ['eua', 'visto', 'america'],
    content: `
      <div style="background: linear-gradient(135deg, #1E40AF 0%, #DC2626 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; font-family: Arial, sans-serif;">
        <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 12px;">🇺🇸 VISTO AMERICANO</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">Transforme seu sonho americano em realidade!</p>
        <ul style="text-align: left; display: inline-block; margin-bottom: 20px;">
          <li>✅ Análise gratuita do seu perfil</li>
          <li>✅ Preparação completa para entrevista</li>
          <li>✅ Acompanhamento até a aprovação</li>
          <li>✅ 95% de taxa de sucesso</li>
        </ul>
        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 16px;">
          <strong>Código: {{REFERRAL_CODE}}</strong>
        </div>
      </div>
    `,
    imageUrl: '/images/banners/banner-eua.jpg',
    previewUrl: '/materials/preview/banner-eua',
    isActive: true
  },

  // Posts para Redes Sociais,  {
    type: 'SOCIAL_POST',
    title: 'Post Instagram - Consultoria',
    description: 'Post otimizado para Instagram sobre consultoria',
    category: 'instagram',
    tags: ['instagram', 'consultoria', 'stories'],
    content: `🌍 QUER MORAR NO EXTERIOR? 

A @visa2any é especialista em realizar esse sonho! 

✨ O que oferecemos:
✅ Consultoria 100% personalizada
✅ Análise gratuita do seu perfil
✅ 95% de taxa de aprovação
✅ Suporte completo 24/7
✅ 12+ anos de experiência

🎯 Países atendidos:
🇺🇸 Estados Unidos
🇨🇦 Canadá  
🇵🇹 Portugal
🇦🇺 Austrália
🇩🇪 Alemanha
E muito mais!

📞 Link na bio para consultoria gratuita
🎁 Use o código: {{REFERRAL_CODE}}

#morarfora #intercambio #imigração #visa2any #vivernoexterior #visto #consultoria #sonhoamericano`,
    imageUrl: '/images/posts/instagram-consultoria.jpg',
    isActive: true
  },
  {
    type: 'SOCIAL_POST',
    title: 'Post Facebook - Depoimento',
    description: 'Post para Facebook com foco em depoimentos',
    category: 'facebook',
    tags: ['facebook', 'depoimento', 'sucesso'],
    content: `🌟 MAIS UM SONHO REALIZADO! 🌟

"Graças à Visa2Any, consegui meu visto para o Canadá! O atendimento foi excepcional e me senti segura durante todo o processo. Recomendo muito!" 

- Ana Silva, aprovada para o Canadá 🇨🇦

📊 NOSSOS RESULTADOS:
✅ 12.000+ pessoas atendidas
✅ 95% de taxa de aprovação
✅ 50+ países atendidos
✅ 12+ anos de experiência

🎯 Especialistas em:
• Vistos de turismo
• Vistos de trabalho  
• Vistos de estudo
• Vistos de investidor
• Residência permanente

🔗 Agende sua consultoria gratuita: {{AFFILIATE_LINK}}
💝 Código especial: {{REFERRAL_CODE}}

Sua nova vida te espera! 🌍✈️

#Visa2Any #Imigração #Canadá #ViverNoExterior #Sucesso`,
    imageUrl: '/images/posts/facebook-depoimento.jpg',
    isActive: true
  },

  // Templates de Email,  {
    type: 'EMAIL_TEMPLATE',
    title: 'Email - Bem-vindo Lead',
    description: 'Template de email para novos leads',
    category: 'email',
    tags: ['email', 'lead', 'boas-vindas'],
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bem-vindo à Visa2Any</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; border-radius: 12px;">
      <h1>🌍 Bem-vindo à Visa2Any!</h1>
      <p>Sua jornada internacional começa aqui</p>
    </div>
    
    <div style="padding: 30px 0;">
      <h2>Olá!</h2>
      <p>Muito obrigado pelo seu interesse em nossos serviços de consultoria em imigração!</p>
      
      <p>A Visa2Any é líder no mercado brasileiro de consultoria em imigração, com:</p>
      <ul>
        <li>✅ Mais de 12 anos de experiência</li>
        <li>✅ 12.000+ clientes atendidos com sucesso</li>
        <li>✅ 95% de taxa de aprovação</li>
        <li>✅ Especialistas em 50+ países</li>
      </ul>
      
      <p><strong>Próximos passos:</strong></p>
      <ol>
        <li>Agende sua consultoria gratuita</li>
        <li>Receba análise personalizada do seu perfil</li>
        <li>Conheça suas opções de visto</li>
        <li>Inicie sua jornada para o exterior!</li>
      </ol>
      
      <div style="text-align: center; padding: 20px;">
        <a href="{{AFFILIATE_LINK}}" style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Agendar Consultoria Gratuita
        </a>
      </div>
      
      <p style="background: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center;">
        <strong>Código especial: {{REFERRAL_CODE}}</strong><br>
        Use este código e ganhe condições exclusivas!
      </p>
    </div>
    
    <div style="text-align: center; padding: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">
      <p>Visa2Any - Especialistas em Imigração</p>
      <p>Transformando sonhos em realidade há mais de 12 anos</p>
    </div>
  </div>
</body>
</html>
    `,
    isActive: true
  },

  // Vídeos,  {
    type: 'VIDEO',
    title: 'Vídeo Depoimento - Cliente Aprovado',
    description: 'Vídeo com depoimento de cliente aprovado',
    category: 'depoimentos',
    tags: ['video', 'depoimento', 'aprovação'],
    content: `
Script para vídeo de depoimento:

"Oi, eu sou a Maria e quero contar como a Visa2Any mudou a minha vida!

Sempre sonhei em morar no Canadá, mas não sabia por onde começar. Foi quando conheci a Visa2Any através de {{AFFILIATE_NAME}}.

Desde o primeiro contato, me senti acolhida. A equipe fez uma análise completa do meu perfil e me mostrou exatamente qual era o melhor caminho.

O processo foi transparente, com acompanhamento constante. Recebi preparação completa para a entrevista e todos os documentos foram organizados perfeitamente.

Resultado: APROVADA! 🎉

Hoje estou vivendo meu sonho em Toronto, e devo tudo isso à expertise da Visa2Any.

Se você também tem o sonho de viver no exterior, não perca tempo. Entre em contato com a Visa2Any e use o código {{REFERRAL_CODE}} para condições especiais.

Sua nova vida te espera!"

[Incluir na tela: Logo da Visa2Any, código {{REFERRAL_CODE}}, link {{AFFILIATE_LINK}}]
    `,
    imageUrl: '/images/videos/depoimento-maria.jpg',
    previewUrl: '/materials/preview/video-depoimento',
    isActive: true
  },

  // Guias/E-books,  {
    type: 'GUIDE',
    title: 'E-book - Guia Completo Visto EUA',
    description: 'Guia completo sobre como conseguir visto americano',
    category: 'guias',
    tags: ['ebook', 'guia', 'eua', 'visto'],
    content: `
GUIA COMPLETO: COMO CONSEGUIR SEU VISTO AMERICANO

CAPÍTULO 1: TIPOS DE VISTO
- Visto B1/B2 (Turismo e Negócios)
- Visto F1 (Estudante)
- Visto H1B (Trabalho)
- Visto O1 (Pessoas com habilidades extraordinárias)

CAPÍTULO 2: DOCUMENTAÇÃO NECESSÁRIA
✅ Passaporte válido
✅ Formulário DS-160
✅ Foto 5x5cm
✅ Comprovantes financeiros
✅ Carta do empregador
✅ Comprovante de vínculos com o Brasil

CAPÍTULO 3: PREPARAÇÃO PARA ENTREVISTA
• Como se vestir
• Principais perguntas
• Documentos para levar
• Dicas de postura

CAPÍTULO 4: ERROS MAIS COMUNS
❌ Documentação incompleta
❌ Inconsistências nas informações
❌ Nervosismo excessivo
❌ Falta de preparação

CAPÍTULO 5: APÓS A APROVAÇÃO
• Retirada do passaporte
• Planejamento da viagem
• Cuidados na entrada nos EUA

BÔNUS: CHECKLIST COMPLETA

Quer ajuda especializada? A Visa2Any tem 95% de aprovação em vistos americanos!

Consultoria gratuita: {{AFFILIATE_LINK}}
Código especial: {{REFERRAL_CODE}}

© Visa2Any - Todos os direitos reservados
    `,
    downloadUrl: '/downloads/guia-visto-eua.pdf',
    imageUrl: '/images/guides/ebook-visto-eua.jpg',
    isActive: true
  }
]

// GET - Listar materiais promocionais
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const category = url.searchParams.get('category')
    const affiliateId = url.searchParams.get('affiliateId')

    // Construir filtros

    const where: any = { isActive: true }
    
    if (type) {
      where.type = type
    }
    
    if (category) {
      where.category = category
    }

    // Se affiliateId for fornecido

    incluir materiais específicos do afiliado
    if (affiliateId) {
      where.OR = [
        { affiliateId: null }, // Materiais públicos,        { affiliateId } // Materiais específicos do afiliado
      ]
    } else {
      where.affiliateId = null // Apenas materiais públicos    }

    // Buscar materiais do banco

    const materials = await prisma.affiliateMaterial.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Se não houver materiais no banco

    retornar materiais padrão
    if (materials.length === 0 && !affiliateId) {
      const filteredDefaults = defaultMaterials.filter(material => {
        if (type && material.type !== type) return false
        if (category && material.category !== category) return false
        return true
      })

      return NextResponse.json({
        data: filteredDefaults.map((material, index) => ({
          id: `default_${index}`,
          ...material,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: Math.floor(Math.random() * 1000),
          downloads: Math.floor(Math.random() * 500)
        }))
      })
    }

    return NextResponse.json({
      data: materials
    })

  } catch (error) {
    console.error('Erro ao buscar materiais:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Criar novo material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      title,
      description,
      content,
      category,
      tags = [],
      imageUrl,
      downloadUrl,
      previewUrl,
      affiliateId,
      language = 'pt'
    } = body

    // Validações básicas

    if (!type || !title || !description) {
      return NextResponse.json({
        error: 'Tipo, título e descrição são obrigatórios'
      }, { status: 400 })
    }

    const material = await prisma.affiliateMaterial.create({
      data: {
        type,
        title,
        description,
        content,
        category,
        tags,
        imageUrl,
        downloadUrl,
        previewUrl,
        affiliateId,
        language
      }
    })

    return NextResponse.json({
      data: material
    })

  } catch (error) {
    console.error('Erro ao criar material:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Atualizar material
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({
        error: 'ID do material é obrigatório'
      }, { status: 400 })
    }

    const material = await prisma.affiliateMaterial.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      data: material
    })

  } catch (error) {
    console.error('Erro ao atualizar material:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}