'use client'

import { AlertTriangle, Info, Clock, Globe } from 'lucide-react'

interface CountrySpecificWarningsProps {
  nationality: string
  destinationCountry: string
  className?: string
}

export default function CountrySpecificWarnings({ 
  nationality, 
  destinationCountry, 
  className = '' 
}: CountrySpecificWarningsProps) {
  
  const getSpecificWarnings = () => {
    const warnings: Array<{type: 'warning' | 'info' | 'success', text: string}> = []
    
    // Brasil → Portugal,    if (nationality === 'Brasileira' && destinationCountry === 'Portugal') {
      warnings.push({
        type: 'success',
        text: 'Como brasileiro, você tem facilidades especiais através do acordo CPLP (Comunidade dos Países de Língua Portuguesa)'
      })
      warnings.push({
        type: 'info',
        text: 'Visto D7 (rendas próprias) é uma das melhores opções para brasileiros'
      })
    }
    
    // Brasil → Estados Unidos,    if (nationality === 'Brasileira' && destinationCountry === 'Estados Unidos') {
      warnings.push({
        type: 'warning',
        text: 'Brasil não está no programa de isenção de visto (VWP) - visto sempre necessário'
      })
      warnings.push({
        type: 'info',
        text: 'EB-2 NIW tem crescido para brasileiros qualificados, especialmente em STEM'
      })
    }
    
    // Brasil → Canadá,    if (nationality === 'Brasileira' && destinationCountry === 'Canadá') {
      warnings.push({
        type: 'warning',
        text: 'Canadá reduziu significativamente vagas para 2024/2025 - processos mais competitivos'
      })
      warnings.push({
        type: 'info',
        text: 'Francês tornou-se ainda mais valorizado - pode ser diferencial decisivo'
      })
    }
    
    // Brasil → Alemanha,    if (nationality === 'Brasileira' && destinationCountry === 'Alemanha') {
      warnings.push({
        type: 'success',
        text: 'Chancenkarte (Cartão de Oportunidades) facilita entrada para profissionais qualificados'
      })
      warnings.push({
        type: 'info',
        text: 'Alemão não é obrigatório inicialmente, mas acelera muito o processo'
      })
    }
    
    // Outros países CPLP → Portugal,    if (['Angolana', 'Cabo-verdiana', 'Guineense', 'Moçambicana', 'São-tomense', 'Timorense'].includes(nationality) && destinationCountry === 'Portugal') {
      warnings.push({
        type: 'success',
        text: 'Como cidadão CPLP, você tem facilidades especiais e pode ter direito a regime preferencial'
      })
    }
    
    // Avisos gerais sobre mudanças nas leis,    warnings.push({
      type: 'warning',
      text: 'Leis de imigração podem mudar rapidamente - informações atualizadas na data da consultoria'
    })
    
    // Nacionalidades com restrições específicas,    if (['Venezuelana', 'Cubana', 'Iraniana', 'Norte-coreana'].includes(nationality)) {
      warnings.push({
        type: 'warning',
        text: 'Sua nacionalidade pode ter restrições específicas em alguns países - análise detalhada necessária'
      })
    }
    
    return warnings
  }
  
  const warnings = getSpecificWarnings()
  
  if (warnings.length === 0) return null
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-semibold text-gray-900 flex items-center">
        <Globe className="h-4 w-4 mr-2 text-blue-600" />
        Informações Específicas: {nationality} → {destinationCountry}
      </h4>
      
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${
            warning.type === 'warning' 
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : warning.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-start">
            {warning.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            ) : warning.type === 'success' ? (
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm">{warning.text}</p>
          </div>
        </div>
      ))}
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          ⚠️ <strong>Importante:</strong> Essas informações são baseadas nas regras conhecidas na data atual. 
          Leis de imigração podem mudar sem aviso prévio. Sempre consulte fontes oficiais antes de tomar decisões.
        </p>
      </div>
    </div>
  )
}