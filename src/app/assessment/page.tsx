'use client'

import type { Metadata } from 'next'
import { useState } from 'react'

export const metadata: Metadata = {
  title: 'Avaliação de Elegibilidade para Visto | Visa2Any',
  description: 'Descubra suas chances de aprovação de visto com nossa avaliação personalizada. Análise gratuita em 5 minutos.',
  keywords: ['avaliação visto', 'elegibilidade visto', 'chances aprovação visto', 'teste visto online'],
  openGraph: {
    title: 'Avaliação de Elegibilidade para Visto',
    description: 'Descubra suas chances de aprovação com nossa IA especializada em vistos'
  }
}
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/Breadcrumb'
import { ArrowRight, ArrowLeft, CheckCircle, Globe, User, GraduationCap, Briefcase, DollarSign, Calendar, Heart, Zap } from 'lucide-react'

interface AssessmentData {
  // Dados pessoais
  name: string
  email: string
  age: number
  nationality: string
  currentCountry: string
  
  // Destino
  targetCountry: string
  visaType: string
  timeframe: string
  
  // Educação
  education: string
  fieldOfStudy: string
  
  // Experiência
  workExperience: number
  currentJob: string
  industry: string
  
  // Financeiro
  savings: string
  monthlyIncome: string
  
  // Família
  maritalStatus: string
  dependents: number
  
  // Idiomas
  englishLevel: string
  otherLanguages: string[]
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const [data, setData] = useState<AssessmentData>({
    name: '',
    email: '',
    age: 0,
    nationality: 'Brazil',
    currentCountry: 'Brazil',
    targetCountry: '',
    visaType: '',
    timeframe: '',
    education: '',
    fieldOfStudy: '',
    workExperience: 0,
    currentJob: '',
    industry: '',
    savings: '',
    monthlyIncome: '',
    maritalStatus: '',
    dependents: 0,
    englishLevel: '',
    otherLanguages: []
  })

  const totalSteps = 6

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    
    try {
      // Chamar API de análise
      const response = await fetch('/api/visa-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: data,
          targetCountry: data.targetCountry,
          visaType: data.visaType
        })
      })
      
      const analysisResult = await response.json()
      
      if (analysisResult.success) {
        setResult(analysisResult.data)
        setIsComplete(true)
      }
    } catch (error) {
      console.error('Erro na análise:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Análise Completa! 🎉
                </h1>
                <p className="text-gray-600">
                  Olá {data.name}! Aqui está sua análise personalizada para {data.targetCountry}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    📊 Score de Elegibilidade
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {result.eligibilityScore}/100
                  </div>
                  <div className="text-sm text-blue-700">
                    {result.eligibilityScore >= 70 ? 'Excelentes chances!' : 
                     result.eligibilityScore >= 50 ? 'Boas perspectivas' : 
                     'Precisa melhorar alguns pontos'}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">
                    🎯 Visto Recomendado
                  </h3>
                  <div className="text-lg font-semibold text-green-600 mb-2">
                    {result.recommendedVisa}
                  </div>
                  <div className="text-sm text-green-700">
                    Melhor opção para seu perfil
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ✅ Pontos Fortes do Seu Perfil
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.strengths?.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📋 Próximos Passos Recomendados
                </h3>
                <div className="space-y-3">
                  {result.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
                <h3 className="text-xl font-semibold mb-4">
                  🚀 Quer acelerar seu processo?
                </h3>
                <p className="mb-6">
                  Esta foi apenas uma prévia! Nosso relatório completo tem 15+ páginas com análise detalhada, 
                  documentos necessários, timeline e estratégias específicas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    📄 Relatório Completo - R$ 97
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    👨‍💼 Consultoria 1:1 - R$ 297
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  📧 Um resumo desta análise foi enviado para: <strong>{data.email}</strong>
                </p>
                <Button 
                  onClick={() => window.location.href = '/precos'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Todos os Planos e Preços
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-2">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb />
        </div>
      </div>
      
      <div className="pt-4 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Etapa {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round((currentStep / totalSteps) * 100)}% concluído
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🌎 Análise Gratuita de Elegibilidade
              </h1>
              <p className="text-gray-600">
                Descubra suas chances reais de aprovação em apenas 2 minutos
              </p>
            </div>

            {/* Step 1: Dados Pessoais */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idade *
                    </label>
                    <input
                      type="number"
                      value={data.age || ''}
                      onChange={(e) => updateData('age', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25"
                      min="18"
                      max="70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País atual
                    </label>
                    <select
                      value={data.currentCountry}
                      onChange={(e) => updateData('currentCountry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Brazil">Brasil</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Other">Outro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Destino */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Globe className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Destino dos Sonhos</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Para qual país quer imigrar? *
                    </label>
                    <select
                      value={data.targetCountry}
                      onChange={(e) => updateData('targetCountry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione um país</option>
                      <option value="Canada">🇨🇦 Canadá</option>
                      <option value="Australia">🇦🇺 Austrália</option>
                      <option value="Portugal">🇵🇹 Portugal</option>
                      <option value="United States">🇺🇸 Estados Unidos</option>
                      <option value="Germany">🇩🇪 Alemanha</option>
                      <option value="New Zealand">🇳🇿 Nova Zelândia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de visto pretendido
                    </label>
                    <select
                      value={data.visaType}
                      onChange={(e) => updateData('visaType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Não tenho certeza</option>
                      <option value="WORK">Trabalho</option>
                      <option value="STUDENT">Estudo</option>
                      <option value="INVESTMENT">Investimento</option>
                      <option value="FAMILY">Reunificação Familiar</option>
                      <option value="SKILLED">Skilled Worker</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quando pretende realizar a mudança?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['6 meses', '1 ano', '2 anos', '3+ anos'].map((time) => (
                        <button
                          key={time}
                          onClick={() => updateData('timeframe', time)}
                          className={`p-3 rounded-lg border transition-colors ${
                            data.timeframe === time
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Educação */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <GraduationCap className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Formação Acadêmica</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de escolaridade *
                    </label>
                    <select
                      value={data.education}
                      onChange={(e) => updateData('education', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="HIGH_SCHOOL">Ensino Médio</option>
                      <option value="TECHNICAL">Técnico</option>
                      <option value="BACHELOR">Superior Completo</option>
                      <option value="MASTER">Mestrado</option>
                      <option value="DOCTORATE">Doutorado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área de formação
                    </label>
                    <input
                      type="text"
                      value={data.fieldOfStudy}
                      onChange={(e) => updateData('fieldOfStudy', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Engenharia, Medicina, TI..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Experiência */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Experiência Profissional</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anos de experiência profissional *
                    </label>
                    <select
                      value={data.workExperience}
                      onChange={(e) => updateData('workExperience', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Menos de 1 ano</option>
                      <option value={1}>1-2 anos</option>
                      <option value={3}>3-5 anos</option>
                      <option value={6}>6-10 anos</option>
                      <option value={10}>Mais de 10 anos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo atual
                    </label>
                    <input
                      type="text"
                      value={data.currentJob}
                      onChange={(e) => updateData('currentJob', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Analista de Sistemas, Médico..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Setor de atuação
                    </label>
                    <select
                      value={data.industry}
                      onChange={(e) => updateData('industry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="TECHNOLOGY">Tecnologia</option>
                      <option value="HEALTHCARE">Saúde</option>
                      <option value="ENGINEERING">Engenharia</option>
                      <option value="FINANCE">Finanças</option>
                      <option value="EDUCATION">Educação</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Situação Financeira */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Situação Financeira</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renda mensal aproximada *
                    </label>
                    <select
                      value={data.monthlyIncome}
                      onChange={(e) => updateData('monthlyIncome', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="0-3000">Até R$ 3.000</option>
                      <option value="3000-6000">R$ 3.000 - R$ 6.000</option>
                      <option value="6000-10000">R$ 6.000 - R$ 10.000</option>
                      <option value="10000-20000">R$ 10.000 - R$ 20.000</option>
                      <option value="20000+">Acima de R$ 20.000</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reserva financeira aproximada
                    </label>
                    <select
                      value={data.savings}
                      onChange={(e) => updateData('savings', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="0-10000">Até R$ 10.000</option>
                      <option value="10000-50000">R$ 10.000 - R$ 50.000</option>
                      <option value="50000-100000">R$ 50.000 - R$ 100.000</option>
                      <option value="100000-500000">R$ 100.000 - R$ 500.000</option>
                      <option value="500000+">Acima de R$ 500.000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Idiomas e Família */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Heart className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Idiomas e Situação Familiar</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de inglês *
                    </label>
                    <select
                      value={data.englishLevel}
                      onChange={(e) => updateData('englishLevel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="BEGINNER">Básico</option>
                      <option value="INTERMEDIATE">Intermediário</option>
                      <option value="ADVANCED">Avançado</option>
                      <option value="NATIVE">Nativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado civil
                    </label>
                    <select
                      value={data.maritalStatus}
                      onChange={(e) => updateData('maritalStatus', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione</option>
                      <option value="SINGLE">Solteiro(a)</option>
                      <option value="MARRIED">Casado(a)</option>
                      <option value="DIVORCED">Divorciado(a)</option>
                      <option value="WIDOWED">Viúvo(a)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de dependentes
                    </label>
                    <select
                      value={data.dependents}
                      onChange={(e) => updateData('dependents', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Nenhum</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4 ou mais</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="ml-auto bg-blue-600 hover:bg-blue-700"
                  disabled={
                    (currentStep === 1 && (!data.name || !data.email || !data.age)) ||
                    (currentStep === 2 && !data.targetCountry) ||
                    (currentStep === 3 && !data.education) ||
                    (currentStep === 5 && !data.monthlyIncome) ||
                    (currentStep === 6 && !data.englishLevel)
                  }
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={submitAssessment}
                  disabled={isSubmitting}
                  className="ml-auto bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Gerar Análise Gratuita
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">MR</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Maria Rodrigues</div>
                <div className="text-sm text-gray-500">Aprovada no Canadá</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "A análise gratuita me deu uma visão clara das minhas chances. Foi fundamental para eu me preparar melhor antes de iniciar o processo oficial!"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}