import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Metodologia Técnica e Estrutura Institucional | Visa2Any',
    description: 'Conheça a metodologia de trabalho e a estrutura técnica da Visa2Any, referência em consultoria de vistos americanos.',
    openGraph: {
        title: 'Metodologia Técnica e Estrutura Institucional | Visa2Any',
        description: 'Conheça a metodologia de trabalho e a estrutura técnica da Visa2Any, referência em consultoria de vistos americanos.',
        type: 'website',
    }
}

export default function MethodologyPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">
                    Estrutura Técnica e Metodologia Visa2Any
                </h1>

                <p className="lead text-xl text-slate-600 mb-8">
                    A <strong>Visa2Any</strong> é uma consultoria privada de tecnologia e inteligência em processos migratórios. Nossa missão é democratizar o acesso à informação técnica de qualidade.
                </p>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Nossa Metodologia (Compliance YMYL)</h2>
                    <p className="text-slate-600 mb-6">
                        Adotamos um rigoroso padrão de qualidade alinhado às diretrizes <strong>YMYL (Your Money Your Life)</strong> do Google e às normativas do U.S. Department of State.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-700 mb-3">1. Base Normativa Oficial</h3>
                            <p className="text-slate-600">Todo nosso conteúdo é fundamentado em:</p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-600 mt-2">
                                <li>INA (Immigration and Nationality Act)</li>
                                <li>FAM (Foreign Affairs Manual)</li>
                                <li>Comunicados do U.S. Department of State</li>
                                <li>Diretrizes do USCIS</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-blue-700 mb-3">2. Revisão Técnica em Camadas</h3>
                            <p className="text-slate-600">Fluxo de validação obrigatório:</p>
                            <ol className="list-decimal pl-5 space-y-2 text-slate-600 mt-2">
                                <li><strong>Pesquisa:</strong> Coleta de dados nas fontes .gov</li>
                                <li><strong>Redação Técnica:</strong> Especialistas em imigração</li>
                                <li><strong>Fact-Checking:</strong> Verificação de taxas e prazos</li>
                                <li><strong>Revisão Final:</strong> Coordenação Técnica</li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Quem Somos: A Entidade Visa2Any</h2>
                    <p className="text-slate-600 mb-6">
                        Diferente de despachantes autônomos, a Visa2Any é uma <strong>Organização</strong> estruturada com processos auditáveis. Não dependemos da "opinião" de um único indivíduo, mas sim do consenso técnico de uma equipe multidisciplinar.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 mt-8">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-bold text-slate-900 mb-2">Transparência</h4>
                            <p className="text-sm text-slate-600">Informamos claramente que a aprovação é prerrogativa exclusiva do governo americano.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-bold text-slate-900 mb-2">Tecnologia</h4>
                            <p className="text-sm text-slate-600">Utilizamos IA para pré-análise de riscos e organização documental.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-bold text-slate-900 mb-2">Educação</h4>
                            <p className="text-sm text-slate-600">Focamos em explicar o "porquê" das regras, empoderando o solicitante.</p>
                        </div>
                    </div>
                </section>

                <div className="border-t border-slate-200 pt-8 mt-12">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Isenção de Responsabilidade (Disclaimer)</h3>
                    <p className="text-sm text-slate-500">
                        A Visa2Any Consultoria e Tecnologia Ltda é uma empresa privada e não possui qualquer afiliação com o Governo dos Estados Unidos. O pagamento de nossos honorários refere-se exclusivamente aos serviços de assessoria, não incluindo as taxas consulares (MRV/SEVIS).
                    </p>
                </div>
            </div>

            {/* Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Organization",
                                "@id": "https://visa2any.com/#organization",
                                "name": "Visa2Any",
                                "legalName": "Visa2Any Consultoria e Tecnologia Ltda",
                                "url": "https://visa2any.com",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://visa2any.com/logo-full.png",
                                    "width": 600,
                                    "height": 60
                                },
                                "sameAs": [
                                    "https://www.instagram.com/visa2any",
                                    "https://www.linkedin.com/company/visa2any",
                                    "https://www.facebook.com/visa2any"
                                ]
                            },
                            {
                                "@type": "WebPage",
                                "@id": "https://visa2any.com/metodologia-tecnica",
                                "url": "https://visa2any.com/metodologia-tecnica",
                                "name": "Metodologia Técnica e Estrutura Institucional Visa2Any",
                                "isPartOf": { "@id": "https://visa2any.com/#website" },
                                "about": { "@id": "https://visa2any.com/#organization" }
                            }
                        ]
                    })
                }}
            />
        </main>
    )
}
