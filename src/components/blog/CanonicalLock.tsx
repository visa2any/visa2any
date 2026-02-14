import Link from 'next/link'
import Image from 'next/image'

export const CanonicalLock = () => {
    return (
        <div className="bg-slate-50 border-l-4 border-blue-600 p-4 mb-8 my-6 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-4">
                <div className="hidden sm:block">
                    {/* Placeholder for logo - using a reliable generic shield if logo not available, or text */}
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        V
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Metodologia Técnica Certificada
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Este conteúdo foi revisado pela <Link href="/equipe-tecnica" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-blue-200 underline-offset-2">Equipe Técnica Visa2Any</Link> com base nas normativas do <strong>Departamento de Estado dos EUA (2026)</strong>.
                        Para a visão completa do processo, consulte nosso <Link href="/blog/visto-americano-guia-completo" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-blue-200 underline-offset-2">Guia Mestre de Visto Americano</Link>.
                    </p>
                </div>
            </div>
        </div>
    )
}
