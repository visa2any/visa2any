import { Metadata } from 'next'
import { Shield, BookOpen, UserCheck, Scale, Award, Database, FileCheck, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Equipe Técnica e Metodologia | Visa2Any Institucional',
    description: 'Conheça nossa Metodologia de Análise de Vistos, Processos de Revisão Técnica e o Compromisso da Equipe Visa2Any com a precisão e responsabilidade na imigração.',
    openGraph: {
        title: 'Equipe Técnica e Metodologia | Visa2Any',
        description: 'Transparência, rigor técnico e compromisso institucional na análise de processos imigratórios.',
        type: 'website',
    }
}

export default function EquipeTecnicaPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'mainEntity': {
            '@type': 'Organization',
            'name': 'Visa2Any - Equipe Técnica',
            'description': 'Equipe multidisciplinar especializada em análise de vistos e imigração.',
            'member': [
                {
                    '@type': 'OrganizationRole',
                    'roleName': 'Departamento Jurídico',
                    'description': 'Análise de elegibilidade e conformidade legal'
                },
                {
                    '@type': 'OrganizationRole',
                    'roleName': 'Departamento de Documentação',
                    'description': 'Verificação e validação documental'
                }
            ]
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section Institucional */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
                        <Shield className="w-4 h-4" />
                        <span>Transparência Institucional & Compliance</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Nossa Equipe Técnica & <br />
                        <span className="text-blue-600">Metodologia de Análise</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        A Visa2Any não é apenas uma plataforma tecnológica. Por trás de nossos algoritmos, existe uma estrutura rigorosa de validação técnica, jurídica e processual.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

                {/* Missão Editorial */}
                <section className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Missão Editorial e Técnica</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Nosso compromisso é democratizar o acesso à mobilidade global através da informação precisa.
                                Em um cenário onde regras de imigração mudam constantemente, a **Equipe Técnica Visa2Any** atua como um filtro de confiabilidade,
                                transformando "carvão bruto" de leis complexas em "diamantes" de informação acionável e segura.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Quem Somos - Institucional */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Estrutura Multidisciplinar</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <Scale className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Supervisão Jurídica</h3>
                            <p className="text-gray-600 text-sm">
                                Advogados registrados (OAB) monitoram atualizações legislativas em tempo real para garantir que nossos guias e ferramentas reflitam a lei vigente.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <Database className="w-8 h-8 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Inteligência de Dados</h3>
                            <p className="text-gray-600 text-sm">
                                Analistas de dados processam estatísticas consulares oficiais para alimentar nossa Calculadora de Elegibilidade com probabilidades reais.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <UserCheck className="w-8 h-8 text-purple-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Especialistas em Vistos</h3>
                            <p className="text-gray-600 text-sm">
                                Ex-agentes consulares e consultores seniores revisam cada etapa dos nossos fluxos automatizados para evitar erros comuns.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <FileCheck className="w-8 h-8 text-orange-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Revisão de Conteúdo</h3>
                            <p className="text-gray-600 text-sm">
                                Todo artigo passa por um processo de "Fact-Checking" rigoroso antes da publicação, garantindo conformidade com YMYL (Your Money Your Life).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Metodologia de Análise */}
                <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

                    <h2 className="text-3xl font-bold mb-8 relative z-10">Nosso Processo de Qualidade</h2>
                    <div className="space-y-6 relative z-10">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Coleta de Fontes Oficiais</h3>
                                <p className="text-gray-300 text-sm">Monitoramos diariamente USCIS, IRCC, SEF e outros órgãos governamentais.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Análise Técnica</h3>
                                <p className="text-gray-300 text-sm">Nossa equipe desmonta a "burocracia" e a traduz em passos lógicos e acessíveis.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Validação Cruzada (Peer Review)</h3>
                                <p className="text-gray-300 text-sm">Nenhum conteúdo crítico é publicado sem a aprovação de pelo menos dois especialistas seniores.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Diferenciação */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Como nos Diferenciamos</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold">
                                <tr>
                                    <th className="p-4">Característica</th>
                                    <th className="p-4 text-blue-700 bg-blue-50">Visa2Any</th>
                                    <th className="p-4 text-gray-500">Despachantes Comuns</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-4 font-medium text-gray-900">Base Tecnológica</td>
                                    <td className="p-4 text-blue-700 bg-blue-50">IA + Verificação Humana</td>
                                    <td className="p-4 text-gray-500">Processos Manuais</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-gray-900">Atualização</td>
                                    <td className="p-4 text-blue-700 bg-blue-50">Tempo Real (API)</td>
                                    <td className="p-4 text-gray-500">Reativa / Atrasada</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-gray-900">Transparência</td>
                                    <td className="p-4 text-blue-700 bg-blue-50">Estatísticas Reais de Aprovação</td>
                                    <td className="p-4 text-gray-500">Promessas de "Garantia" (Irreais)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Compliance Footer */}
                <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p className="mb-4">
                        A Visa2Any é uma empresa privada de tecnologia e consultoria, não afiliada a nenhum governo.
                    </p>
                    <div className="flex justify-center gap-6">
                        <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> LGPD Compliant</span>
                        <span className="flex items-center gap-1"><Award className="w-4 h-4" /> Excelência Técnica</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
