import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Glossário de Termos de Visto Americano | Visa2Any',
    description: 'Glossário técnico completo com definições sobre vistos americanos, siglas (DS-160, SEVIS, MRV) e termos jurídicos (INA 214b, 221g).',
}

const definitions = [
    {
        term: "Administrative Processing (Processo Administrativo)",
        def: "Verificação adicional de segurança ou dados (Seção 221g) que ocorre quando o oficial consular não pode decidir imediatamente sobre a emissão do visto.",
        link: "/entidade/processo-administrativo"
    },
    {
        term: "CASV",
        def: "Centro de Atendimento ao Solicitante de Visto. Local onde são coletados os dados biométricos (foto e impressões digitais) antes da entrevista consular.",
        link: null
    },
    {
        term: "CBP (Customs and Border Protection)",
        def: "Agência federal responsável pelo controle de fronteiras. É o oficial do CBP quem autoriza a entrada e define o tempo de permanência nos EUA.",
        link: "/entidade/cbp"
    },
    {
        term: "DS-160",
        def: "Formulário eletrônico obrigatório para solicitação de vistos de não-imigrante. Contém todos os dados biográficos e é a base da análise consular.",
        link: "/entidade/ds-160"
    },
    {
        term: "INA 214(b)",
        def: "Seção da Lei de Imigração que presume a intenção de imigrar de todo solicitante, exigindo prova de vínculos fortes com o país de origem para superá-la.",
        link: "/entidade/ina-214b"
    },
    {
        term: "MRV (Machine Readable Visa) Fee",
        def: "Taxa de solicitação de visto paga ao governo americano para processamento do pedido. Não é reembolsável.",
        link: null
    },
    {
        term: "SEVIS",
        def: "Student and Exchange Visitor Information System. Sistema de informação para rastreamento de estudantes (F/M) e intercambistas (J) nos EUA.",
        link: "/entidade/sevis"
    },
    {
        term: "Sponsor (Patrocinador)",
        def: "Pessoa física ou jurídica que assume a responsabilidade financeira pelos custos da viagem do solicitante principal.",
        link: null
    }
]

export default function GlossaryPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                    Glossário Técnico de Visto Americano
                </h1>
                <p className="text-xl text-slate-600 mb-12">
                    Terminologia oficial utilizada em processos de imigração e vistos.
                </p>

                <div className="grid gap-8">
                    {definitions.map((item, idx) => (
                        <div key={idx} className="border-b border-slate-100 pb-8 last:border-0">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{item.term}</h2>
                            <p className="text-slate-600 mb-3">{item.def}</p>
                            {item.link && (
                                <Link href={item.link} className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                                    Saiba mais sobre {item.term.split(' ')[0]}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ/DefinedTerm Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "DefinedTermSet",
                                "name": "Glossário Técnico de Vistos",
                                "dataFeedElement": definitions.map(d => ({
                                    "@type": "DefinedTerm",
                                    "name": d.term.split('(')[0].trim(),
                                    "description": d.def
                                }))
                            }
                        ]
                    })
                }}
            />
        </main>
    )
}
