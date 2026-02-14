import { Metadata } from 'next'
import { entities } from '@/data/entities'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CanonicalLock } from '@/components/blog/CanonicalLock'
import Markdown from 'react-markdown'

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const entity = entities[params.slug]
    if (!entity) return {}

    return {
        title: `${entity.title} | Visa2Any Entidades`,
        description: entity.description,
        openGraph: {
            title: entity.title,
            description: entity.description,
            type: 'article',
        }
    }
}

export default function EntityPage({ params }: Props) {
    const entity = entities[params.slug]

    if (!entity) {
        notFound()
    }

    return (
        <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <nav className="mb-8 text-sm text-slate-500">
                <Link href="/" className="hover:text-blue-600">Home</Link> &gt;
                <Link href="/glossario-visto-americano" className="mx-2 hover:text-blue-600">Glossário</Link> &gt;
                <span className="ml-2 font-medium text-slate-900">{entity.title}</span>
            </nav>

            <article className="prose prose-slate max-w-none prose-h1:text-3xl prose-h1:font-bold prose-h1:text-slate-900 prose-headings:font-bold prose-a:text-blue-600">
                <CanonicalLock />

                {/* We use specific markdown rendering or just text as content is simple */}
                <div className="whitespace-pre-wrap">
                    <Markdown>{entity.content}</Markdown>
                </div>

                {/* FAQ Section */}
                {entity.faq && entity.faq.length > 0 && (
                    <section className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
                        <dl className="space-y-6">
                            {entity.faq.map((item, index) => (
                                <div key={index}>
                                    <dt className="font-semibold text-slate-900 mb-2">{item.question}</dt>
                                    <dd className="text-slate-600 bg-slate-50 p-4 rounded-lg">{item.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </article>

            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Article",
                                "headline": entity.title,
                                "description": entity.description,
                                "author": { "@type": "Organization", "name": "Equipe Técnica Visa2Any" },
                                "mainEntityOfPage": { "@type": "WebPage", "@id": `https://visa2any.com/entidade/${entity.slug}` }
                            },
                            {
                                "@type": "FAQPage",
                                "mainEntity": entity.faq?.map(f => ({
                                    "@type": "Question",
                                    "name": f.question,
                                    "acceptedAnswer": { "@type": "Answer", "text": f.answer }
                                }))
                            }
                        ]
                    })
                }}
            />
        </main>
    )
}
