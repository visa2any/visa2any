
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:Tagualife4%2F%2F@db.acbxhcxyrphlhsxuvxum.supabase.co:5432/postgres"
        }
    }
})

// Artifacts Directory (Change this if needed, using the absolute path provided in context)
const ARTIFACTS_DIR = 'C:\\Users\\Power\\.gemini\\antigravity\\brain\\97e12229-01e7-4de5-b5be-c8b3f585ceea'

const posts = [
    {
        file: 'visto_americano_guia_2026.md',
        slug: 'visto-americano-guia-completo',
        title: 'Visto Americano: Guia Completo Atualizado 2026',
        excerpt: 'O guia definitivo sobre o Visto Americano B1/B2 em 2026. Taxas, formulário DS-160, entrevista e dicas para evitar a negativa 214(b).',
        category: 'Visto Americano',
        type: 'Guia',
        difficulty: 'Avançado',
        tags: ['Visto Americano', 'B1/B2', 'DS-160', 'Guia']
    },
    {
        file: 'article_01_ds160.md',
        slug: 'ds-160-guia-completo',
        title: 'Como Preencher o DS-160 Corretamente em 2026',
        excerpt: 'Passo a passo para preencher o formulário DS-160 sem erros. Evite inconsistências que levam à negativa do visto.',
        category: 'Visto Americano',
        type: 'Tutorial',
        difficulty: 'Intermediário',
        tags: ['DS-160', 'Formulário', 'Visto Americano']
    },
    {
        file: 'article_02_visto_negado.md',
        slug: 'visto-americano-negado-o-que-fazer',
        title: 'Visto Negado (214b): O Que Fazer e Quando Tentar de Novo',
        excerpt: 'Entenda os motivos da negativa baseada na seção 214(b) e a estratégia correta para reverter a decisão em uma nova tentativa.',
        category: 'Visto Americano',
        type: 'Análise',
        difficulty: 'Avançado',
        tags: ['Visto Negado', '214b', 'Recurso']
    },
    {
        file: 'article_03_renovacao.md',
        slug: 'renovacao-visto-americano',
        title: 'Renovação de Visto Americano: Guia 2026',
        excerpt: 'Quem tem direito à isenção de entrevista na renovação? Prazos, taxas e regras para renovar seu visto B1/B2.',
        category: 'Visto Americano',
        type: 'Guia',
        difficulty: 'Iniciante',
        tags: ['Renovação', 'Isenção', 'CASV']
    },
    {
        file: 'article_04_tempo.md',
        slug: 'tempo-espera-visto-americano',
        title: 'Tempo de Espera para Visto Americano em 2026',
        excerpt: 'Qual consulado está mais rápido? Monitoramento das filas em São Paulo, Rio, Brasília, Recife e Porto Alegre.',
        category: 'Visto Americano',
        type: 'Notícia',
        difficulty: 'Iniciante',
        tags: ['Fila', 'Agendamento', 'Prazos']
    },
    {
        file: 'article_05_entrevista.md',
        slug: 'entrevista-visto-americano',
        title: 'A Entrevista Consular: Perguntas e Respostas',
        excerpt: 'O que o oficial consular pergunta? Como se vestir e se comportar na entrevista do visto americano.',
        category: 'Visto Americano',
        type: 'Dica',
        difficulty: 'Intermediário',
        tags: ['Entrevista', 'Consulado', 'Dicas']
    },
    {
        file: 'article_06_documentos.md',
        slug: 'documentos-visto-americano',
        title: 'Checklist de Documentos para o Visto Americano',
        excerpt: 'Quais documentos levar na entrevista? Lista completa de documentos obrigatórios e recomendados para provar vínculos.',
        category: 'Visto Americano',
        type: 'Checklist',
        difficulty: 'Iniciante',
        tags: ['Documentos', 'Checklist', 'Organização']
    },
    {
        file: 'article_07_renda.md',
        slug: 'renda-minima-visto-americano',
        title: 'Existe Renda Mínima para Tirar Visto Americano?',
        excerpt: 'Mitos e verdades sobre salário e comprovação de renda. Veja como autônomos e estudantes podem comprovar capacidade financeira.',
        category: 'Visto Americano',
        type: 'Análise',
        difficulty: 'Intermediário',
        tags: ['Financeiro', 'Renda', 'Mitos']
    },
    {
        file: 'article_08_isencao.md',
        slug: 'isencao-entrevista-visto',
        title: 'Quem está Isento de Entrevista para o Visto?',
        excerpt: 'Regras de isenção para menores de 14 anos, maiores de 79 anos e renovação. Saiba se você precisa ir ao consulado.',
        category: 'Visto Americano',
        type: 'Regra',
        difficulty: 'Iniciante',
        tags: ['Isenção', 'Menores', 'Idosos']
    },
    {
        file: 'article_09_trabalho.md',
        slug: 'trabalhar-visto-turismo',
        title: 'Posso Trabalhar nos EUA com Visto de Turismo?',
        excerpt: 'Entenda os limites do visto B1/B2. O que é permitido e o que é proibido? Diferença entre negócios e trabalho.',
        category: 'Visto Americano',
        type: 'Legal',
        difficulty: 'Avançado',
        tags: ['Trabalho', 'Legalidade', 'Riscos']
    },
    {
        file: 'article_10_permanencia.md',
        slug: 'tempo-permanencia-visto-turismo',
        title: 'Quanto Tempo Posso Ficar nos EUA? (Regra I-94)',
        excerpt: 'Visto de 10 anos não permite ficar 10 anos. Entenda o formulário I-94 e as regras de permanência para turistas.',
        category: 'Visto Americano',
        type: 'Legal',
        difficulty: 'Intermediário',
        tags: ['I-94', 'Permanência', 'Overstay']
    }
]

async function main() {
    console.log('Starting SEO Content Seeding...')

    for (const post of posts) {
        const filePath = path.join(ARTIFACTS_DIR, post.file)

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8')

                console.log(`Processing: ${post.title}...`)

                await prisma.blogPost.upsert({
                    where: { id: post.slug }, // Assuming ID is used as slug based on current DB usage
                    update: {
                        title: post.title,
                        content: content,
                        excerpt: post.excerpt,
                        updatedAt: new Date()
                    },
                    create: {
                        id: post.slug,
                        title: post.title,
                        content: content,
                        excerpt: post.excerpt,
                        category: post.category,
                        author: 'Equipe Técnica Visa2Any',
                        publishDate: new Date(),
                        readTime: '5 min', // Estimated
                        difficulty: post.difficulty,
                        type: post.type,
                        imageUrl: 'https://placehold.co/600x400/0052cc/ffffff?text=Visa2Any', // Placeholder
                        tags: post.tags,
                        published: true,
                        featured: post.slug === 'visto-americano-guia-completo' // Feature the Pillar Page
                    }
                })

                console.log(`✅ Upserted: ${post.slug}`)
            } else {
                console.warn(`⚠️ File not found: ${filePath}`)
            }
        } catch (e) {
            console.error(`❌ Error processing ${post.slug}:`, e)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
