import React from 'react'
import { User, Award, ExternalLink } from 'lucide-react'

interface AuthorBioProps {
    authorName: string
    authorRole?: string
    authorImage?: string
    authorBio?: string
}

export default function AuthorBio({
    authorName,
    authorRole = "Especialista em Imigração",
    authorImage,
    authorBio = "Especialista com vasta experiência em processos migratórios e vistos internacionais. Comprometido em fornecer informações precisas e estratégias eficazes para sua jornada global."
}: AuthorBioProps) {
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-100 overflow-hidden flex-shrink-0">
                {authorImage ? (
                    <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-10 h-10 text-gray-400" />
                )}
            </div>

            <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{authorName}</h3>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span className="text-blue-600 font-medium text-sm flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {authorRole}
                    </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {authorBio}
                </p>
                <div className="flex justify-center md:justify-start">
                    <a href="/sobre" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center group">
                        Ver perfil completo
                        <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    )
}
