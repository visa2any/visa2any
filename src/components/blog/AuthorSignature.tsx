import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AuthorSignature() {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mt-12 mb-8">
            <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-gray-900 font-bold text-lg mb-1 flex items-center gap-2">
                        Equipe Técnica Visa2Any
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Verificado</span>
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        Este conteúdo foi elaborado e revisado por nossa equipe multidisciplinar de especialistas em imigração, advogados e analistas de dados, seguindo nossa rigorosa
                        <Link href="/equipe-tecnica" className="text-blue-600 hover:underline mx-1 font-medium">
                            Metodologia de Análise Técnica
                        </Link>
                        para garantir precisão e conformidade com as leis vigentes.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Revisado por Jurídico
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Fact-Checking IA
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
