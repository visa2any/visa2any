'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, TrendingUp, TrendingDown, Clock, DollarSign, Users, GraduationCap,
  Heart, Shield, Plane, Building, Star, Target, Award, Zap, Calculator,
  BarChart3, Check, X, AlertTriangle, Info, ChevronRight, Filter, Plus,
  MapPin, Calendar, FileText, Eye, Lightbulb, Sparkles, ArrowRight
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface CountryData {
  code: string
  name: string
  flag: string
  capital: string
  language: string[]
  currency: string
  timezone: string
  
  immigration: {
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'very_hard'
    processTime: string
    successRate: number
    minInvestment?: number
    pointsSystem: boolean
  }
  
  economy: {
    gdpPerCapita: number
    unemploymentRate: number
    inflation: number
    costOfLivingIndex: number
    averageSalary: number
    taxRate: number
  }
  
  quality: {
    qualityOfLifeIndex: number
    safetyIndex: number
    healthcareIndex: number
    educationIndex: number
    climateScore: number
    englishProficiency: number
  }
  
  visaTypes: Array<{
    type: string
    name: string
    description: string
    requirements: string[]
    processTime: string
    cost: number
    renewalPeriod: string
    leadsToPermanency: boolean
  }>
  
  pros: string[]
  cons: string[]
  bestFor: string[]
  
  recent_updates: Array<{
    date: string
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
  }>
}

interface ComparisonCriteria {
  immigration: number // weight 0-10
  economy: number
  quality: number
  personalPreference: number
}

export function CountryComparison() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['USA', 'CAN'])
  const [comparisonCriteria, setComparisonCriteria] = useState<ComparisonCriteria>({
    immigration: 8,
    economy: 7,
    quality: 9,
    personalPreference: 6
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [userProfile, setUserProfile] = useState({
    age: 35,
    education: 'bachelor',
    experience: 10,
    language: 'intermediate',
    budget: 50000,
    hasFamily: true,
    priority: 'quality_life' as 'quality_life' | 'career' | 'investment' | 'education'
  })

  const { notifySuccess, notifyInfo } = useSystemNotifications()

  // Mock country data

  const countries: { [key: string]: CountryData } = {
    USA: {
      code: 'USA',
      name: 'Estados Unidos',
      flag: '🇺🇸',
      capital: 'Washington D.C.',
      language: ['Inglês'],
      currency: 'USD',
      timezone: 'UTC-5 a UTC-10',
      
      immigration: {
        difficultyLevel: 'hard',
        processTime: '6-24 meses',
        successRate: 45,
        pointsSystem: false
      },
      
      economy: {
        gdpPerCapita: 63543,
        unemploymentRate: 3.7,
        inflation: 3.2,
        costOfLivingIndex: 100,
        averageSalary: 54132,
        taxRate: 24
      },
      
      quality: {
        qualityOfLifeIndex: 92,
        safetyIndex: 73,
        healthcareIndex: 68,
        educationIndex: 91,
        climateScore: 75,
        englishProficiency: 100
      },
      
      visaTypes: [
        {
          type: 'B1/B2',
          name: 'Turismo/Negócios',
          description: 'Viagem temporária',
          requirements: ['Passaporte', 'DS-160', 'Entrevista'],
          processTime: '3-5 dias',
          cost: 160,
          renewalPeriod: '10 anos',
          leadsToPermanency: false
        },
        {
          type: 'EB-5',
          name: 'Investidor',
          description: 'Green Card por investimento',
          requirements: ['Investimento $800k+', 'Due diligence', 'I-526'],
          processTime: '18-36 meses',
          cost: 800000,
          renewalPeriod: 'Permanente',
          leadsToPermanency: true
        }
      ],
      
      pros: [
        'Maior economia do mundo',
        'Universidades de elite',
        'Oportunidades de carreira',
        'Diversidade cultural',
        'Inovação tecnológica'
      ],
      
      cons: [
        'Sistema de saúde caro',
        'Visto difícil de obter',
        'Custo de vida alto',
        'Questões de segurança',
        'Sistema educacional caro'
      ],
      
      bestFor: [
        'Empreendedores',
        'Profissionais de tecnologia',
        'Investidores',
        'Estudantes ambiciosos'
      ],
      
      recent_updates: [
        {
          date: '2024-01-15',
          title: 'Novas regras EB-5',
          description: 'Valor mínimo de investimento mantido em $800k',
          impact: 'neutral'
        }
      ]
    },
    
    CAN: {
      code: 'CAN',
      name: 'Canadá',
      flag: '🇨🇦',
      capital: 'Ottawa',
      language: ['Inglês', 'Francês'],
      currency: 'CAD',
      timezone: 'UTC-3.5 a UTC-8',
      
      immigration: {
        difficultyLevel: 'medium',
        processTime: '6-12 meses',
        successRate: 78,
        pointsSystem: true
      },
      
      economy: {
        gdpPerCapita: 46262,
        unemploymentRate: 5.2,
        inflation: 2.8,
        costOfLivingIndex: 85,
        averageSalary: 50000,
        taxRate: 26
      },
      
      quality: {
        qualityOfLifeIndex: 95,
        safetyIndex: 88,
        healthcareIndex: 90,
        educationIndex: 89,
        climateScore: 65,
        englishProficiency: 97
      },
      
      visaTypes: [
        {
          type: 'Express Entry',
          name: 'Imigração Federal',
          description: 'Sistema de pontos',
          requirements: ['IELTS', 'ECA', 'Experiência'],
          processTime: '6-8 meses',
          cost: 1325,
          renewalPeriod: 'Permanente',
          leadsToPermanency: true
        }
      ],
      
      pros: [
        'Sistema de saúde universal',
        'Alta qualidade de vida',
        'Sociedade multicultural',
        'Educação de qualidade',
        'Processo transparente'
      ],
      
      cons: [
        'Inverno rigoroso',
        'Impostos altos',
        'Economia menor que EUA',
        'Distância do Brasil',
        'Competição alta'
      ],
      
      bestFor: [
        'Famílias',
        'Profissionais qualificados',
        'Estudantes',
        'Quem busca qualidade de vida'
      ],
      
      recent_updates: [
        {
          date: '2024-01-20',
          title: 'Aumenta convites Express Entry',
          description: 'Meta de 485.000 novos residentes em 2024',
          impact: 'positive'
        }
      ]
    },
    
    PRT: {
      code: 'PRT',
      name: 'Portugal',
      flag: '🇵🇹',
      capital: 'Lisboa',
      language: ['Português'],
      currency: 'EUR',
      timezone: 'UTC+0',
      
      immigration: {
        difficultyLevel: 'easy',
        processTime: '3-6 meses',
        successRate: 92,
        minInvestment: 280000,
        pointsSystem: false
      },
      
      economy: {
        gdpPerCapita: 24568,
        unemploymentRate: 6.5,
        inflation: 1.9,
        costOfLivingIndex: 65,
        averageSalary: 14000,
        taxRate: 28
      },
      
      quality: {
        qualityOfLifeIndex: 88,
        safetyIndex: 95,
        healthcareIndex: 85,
        educationIndex: 80,
        climateScore: 90,
        englishProficiency: 60
      },
      
      visaTypes: [
        {
          type: 'D7',
          name: 'Rendimento Próprio',
          description: 'Para aposentados e nômades',
          requirements: ['Renda €760/mês', 'Comprovantes', 'Seguro'],
          processTime: '2-4 meses',
          cost: 83,
          renewalPeriod: '2 anos',
          leadsToPermanency: true
        },
        {
          type: 'Golden Visa',
          name: 'Visto Dourado',
          description: 'Investimento imobiliário',
          requirements: ['Investimento €280k+', 'Due diligence'],
          processTime: '6-12 meses',
          cost: 280000,
          renewalPeriod: '5 anos',
          leadsToPermanency: true
        }
      ],
      
      pros: [
        'Custo de vida baixo',
        'Clima agradável',
        'Segurança alta',
        'Acesso à Europa',
        'Processo simples'
      ],
      
      cons: [
        'Salários baixos',
        'Economia em crescimento lento',
        'Burocracia',
        'Barreira do idioma',
        'Mercado de trabalho limitado'
      ],
      
      bestFor: [
        'Aposentados',
        'Nômades digitais',
        'Investidores imobiliários',
        'Famílias em busca de segurança'
      ],
      
      recent_updates: [
        {
          date: '2024-01-10',
          title: 'Golden Visa alterado',
          description: 'Foco em investimentos no interior',
          impact: 'neutral'
        }
      ]
    }
  }

  const availableCountries = Object.keys(countries)

  const calculateCountryScore = (countryCode: string): number => {
    const country = countries[countryCode]
    if (!country) return 0

    const immigrationScore = (country.immigration?.successRate || 0) * (country.immigration?.difficultyLevel === 'easy' ? 1.2 : country.immigration?.difficultyLevel === 'medium' ? 1.0 : 0.8)
    const economyScore = ((country.economy?.gdpPerCapita || 0) / 1000) * 0.5 + (100 - (country.economy?.costOfLivingIndex || 0)) * 0.3 + (100 - ((country.economy?.unemploymentRate || 0) * 10)) * 0.2
    const qualityScore = ((country.quality?.qualityOfLifeIndex || 0) + (country.quality?.safetyIndex || 0) + (country.quality?.healthcareIndex || 0) + (country.quality?.educationIndex || 0)) / 4

    const weightedScore = (
      immigrationScore * (comparisonCriteria.immigration / 10) * 0.3 +
      economyScore * (comparisonCriteria.economy / 10) * 0.3 +
      qualityScore * (comparisonCriteria.quality / 10) * 0.4
    )

    return Math.min(Math.max(weightedScore, 0), 100)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'green'
      case 'medium': return 'yellow'
      case 'hard': return 'orange'
      case 'very_hard': return 'red'
      default: return 'gray'
    }
  }

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Médio'
      case 'hard': return 'Difícil'
      case 'very_hard': return 'Muito Difícil'
      default: return 'N/A'
    }
  }

  const addCountryToComparison = (countryCode: string) => {
    if (!selectedCountries.includes(countryCode) && selectedCountries.length < 4) {
      setSelectedCountries([...selectedCountries, countryCode])
      const country = countries[countryCode]
      if (country) {
        notifySuccess('País adicionado', `${country.name} foi adicionado à comparação`)
      }
    }
  }

  const removeCountryFromComparison = (countryCode: string) => {
    if (selectedCountries.length > 2) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode))
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comparação de Países</h1>
        <p className="text-gray-600">
          Compare países de destino e encontre a melhor opção para seu perfil
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Países Selecionados</h2>
          <div className="text-sm text-gray-500">
            {selectedCountries.length}/4 países
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {selectedCountries.map((code) => (
            <div key={code} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <span className="text-2xl">{countries[code]?.flag || '🏳️'}</span>
              <span className="font-medium text-gray-900">{countries[code]?.name || 'País desconhecido'}</span>
              {selectedCountries.length > 2 && (
                <button
                  onClick={() => removeCountryFromComparison(code)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {availableCountries
            .filter(code => !selectedCountries.includes(code))
            .map((code) => (
              <button
                key={code}
                onClick={() => addCountryToComparison(code)}
                disabled={selectedCountries.length >= 4}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xl">{countries[code]?.flag || '🏳️'}</span>
                <span>{countries[code]?.name || 'País desconhecido'}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Comparison Criteria */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Critérios de Comparação</h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {showAdvanced ? 'Ocultar' : 'Mostrar'} Avançado
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(comparisonCriteria).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key === 'immigration' ? 'Imigração' :
                 key === 'economy' ? 'Economia' :
                 key === 'quality' ? 'Qualidade de Vida' : 'Preferência Pessoal'}
                <span className="ml-2 text-blue-600 font-bold">{value}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => setComparisonCriteria(prev => ({
                  ...prev,
                  [key]: parseInt(e.target.value)
                }))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Critério
                </th>
                {selectedCountries.map((code) => (
                  <th key={code} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{countries[code]?.flag || '🏳️'}</span>
                      <span>{countries[code]?.name || 'País desconhecido'}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Score Geral */}
              <tr className="bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Score Geral IA
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(calculateCountryScore(code))}
                    </div>
                    <div className="text-xs text-gray-500">pontos</div>
                  </td>
                ))}
              </tr>

              {/* Dificuldade de Imigração */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    Dificuldade de Imigração
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getDifficultyColor(countries[code]?.immigration?.difficultyLevel || 'medium')}-100 text-${getDifficultyColor(countries[code]?.immigration?.difficultyLevel || 'medium')}-800`}>
                      {getDifficultyText(countries[code]?.immigration?.difficultyLevel || 'medium')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Taxa de Sucesso */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Taxa de Sucesso
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {countries[code]?.immigration?.successRate || 0}%
                    </div>
                  </td>
                ))}
              </tr>

              {/* Tempo de Processo */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Tempo de Processo
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {countries[code]?.immigration?.processTime || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* PIB per Capita */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    PIB per Capita
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    ${countries[code]?.economy?.gdpPerCapita?.toLocaleString() || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Índice de Custo de Vida */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-500" />
                    Custo de Vida
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {countries[code]?.economy?.costOfLivingIndex || 0}
                    </div>
                    <div className="text-xs text-gray-500">índice</div>
                  </td>
                ))}
              </tr>

              {/* Qualidade de Vida */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Qualidade de Vida
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {countries[code]?.quality?.qualityOfLifeIndex || 0}/100
                    </div>
                  </td>
                ))}
              </tr>

              {/* Segurança */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Índice de Segurança
                  </div>
                </td>
                {selectedCountries.map((code) => (
                  <td key={code} className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-blue-600">
                    {countries[code]?.quality?.safetyIndex || 0}/100
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {selectedCountries.map((code) => {
          const country = countries[code]
          const score = calculateCountryScore(code)
          
          if (!country) return null
          
          return (
            <div key={code} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{country.name}</h3>
                    <p className="text-sm text-gray-500">{country.capital}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(score)}</div>
                  <div className="text-xs text-gray-500">Score IA</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">{country.immigration.successRate}%</div>
                  <div className="text-xs text-gray-600">Taxa de Sucesso</div>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">{country.immigration.processTime}</div>
                  <div className="text-xs text-gray-600">Tempo Processo</div>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Vantagens
                </h4>
                <ul className="space-y-1">
                  {country.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-900 mb-2 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Desvantagens
                </h4>
                <ul className="space-y-1">
                  {country.cons.slice(0, 3).map((con, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-red-500 mt-0.5">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Ideal Para
                </h4>
                <div className="flex flex-wrap gap-1">
                  {country.bestFor.slice(0, 3).map((item, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              {country.recent_updates.length > 0 && (
                <div className="border-t pt-3">
                  <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Atualizações Recentes
                  </h4>
                  <div className="text-xs text-gray-600">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      country.recent_updates?.[0]?.impact === 'positive' ? 'bg-green-500' :
                      country.recent_updates?.[0]?.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                    {country.recent_updates?.[0]?.title || 'Nenhuma atualização disponível'}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t">
                <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1">
                  Ver Detalhes Completos
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-2">
              Recomendação IA Personalizada
            </h3>
            <p className="text-purple-700 mb-3">
              Baseado no seu perfil e critérios, recomendamos <strong>{selectedCountries[0] ? countries[selectedCountries[0]]?.name || 'um dos países selecionados' : 'um dos países selecionados'}</strong> como primeira opção.
            </p>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Próximos Passos Sugeridos:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Pesquisar mais sobre vistos disponíveis</li>
                <li>Consultar um especialista em imigração</li>
                <li>Preparar documentação inicial</li>
                <li>Considerar visita exploratória</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}