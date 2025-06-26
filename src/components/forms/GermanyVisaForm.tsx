'use client'

import React, { useState } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Briefcase, 
  GraduationCap, Heart, Plane, DollarSign, FileText, Globe,
  Check, AlertTriangle, Info, ChevronRight, Flag, Users,
  Calculator, Award, Languages, Target, Euro, Home
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface GermanyFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    birthPlace: string
    nationality: string
    currentCountry: string
    passportNumber: string
    passportExpiry: string
    gender: 'M' | 'F'
    maritalStatus: string
    spouseName?: string
    children: number
  }
  
  contactInfo: {
    homeAddress: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    email: string
    emergencyContact: string
    emergencyPhone: string
  }
  
  visaInfo: {
    visaType: string
    purpose: string
    intendedDuration: number
    intendedArrival: string
    accommodationType: string
    accommodationAddress?: string
    previousGermanyVisits: boolean
    lastVisitDate?: string
    hasGermanFamily: boolean
    familyRelation?: string
    sponsorInfo?: string
  }
  
  educationInfo: {
    highestEducation: string
    institutionName: string
    studyField: string
    graduationYear: string
    germanRecognition: boolean
    recognitionBody?: string
    languageSkills: {
      german: string
      english: string
      goetheLevel?: string
      testDafScore?: number
      ieltsScore?: number
    }
  }
  
  workInfo: {
    currentOccupation: string
    employer: string
    employerAddress: string
    monthlyIncome: number
    workExperience: number
    hasJobOfferGermany: boolean
    germanEmployer?: string
    contractType?: string
    startDate?: string
    blueCardEligible?: boolean
  }
  
  financialInfo: {
    bankBalance: number
    monthlyIncome: number
    otherIncome: number
    properties: number
    investments: number
    blockedAccount: number // Sperrkonto para estudantes,    healthInsurance: boolean
    insuranceProvider?: string
    pensionContributions?: number
  }
  
  healthInfo: {
    hasHealthIssues: boolean
    healthIssuesDetails?: string
    hasInsurance: boolean
    insuranceType: string
    covidVaccinated: boolean
    emergencyContact: string
  }
  
  additionalInfo: {
    criminalHistory: boolean
    criminalDetails?: string
    militaryService: boolean
    politicalActivities: boolean
    previousApplications: boolean
    applicationDetails?: string
    biometricData: boolean
    additionalDocuments: string[]
    specialCircumstances?: string
  }
}

interface GermanyVisaFormProps {
  onSubmit?: (data: GermanyFormData) => void
  initialData?: Partial<GermanyFormData>
}

export function GermanyVisaForm({ onSubmit, initialData }: GermanyVisaFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<GermanyFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      birthPlace: '',
      nationality: '',
      currentCountry: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'M',
      maritalStatus: 'single',
      children: 0
    },
    contactInfo: {
      homeAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      email: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    visaInfo: {
      visaType: '',
      purpose: '',
      intendedDuration: 0,
      intendedArrival: '',
      accommodationType: '',
      previousGermanyVisits: false,
      hasGermanFamily: false
    },
    educationInfo: {
      highestEducation: '',
      institutionName: '',
      studyField: '',
      graduationYear: '',
      germanRecognition: false,
      languageSkills: {
        german: '',
        english: ''
      }
    },
    workInfo: {
      currentOccupation: '',
      employer: '',
      employerAddress: '',
      monthlyIncome: 0,
      workExperience: 0,
      hasJobOfferGermany: false
    },
    financialInfo: {
      bankBalance: 0,
      monthlyIncome: 0,
      otherIncome: 0,
      properties: 0,
      investments: 0,
      blockedAccount: 0,
      healthInsurance: false
    },
    healthInfo: {
      hasHealthIssues: false,
      hasInsurance: false,
      insuranceType: '',
      covidVaccinated: false,
      emergencyContact: ''
    },
    additionalInfo: {
      criminalHistory: false,
      militaryService: false,
      politicalActivities: false,
      previousApplications: false,
      biometricData: false,
      additionalDocuments: []
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: User, description: 'Dados básicos e identidade' },
    { id: 2, title: 'Contato', icon: Phone, description: 'Endereço e comunicação' },
    { id: 3, title: 'Detalhes do Visto', icon: FileText, description: 'Tipo e propósito da aplicação' },
    { id: 4, title: 'Educação', icon: GraduationCap, description: 'Histórico educacional e idiomas' },
    { id: 5, title: 'Trabalho', icon: Briefcase, description: 'Experiência profissional' },
    { id: 6, title: 'Finanças', icon: Euro, description: 'Situação financeira' },
    { id: 7, title: 'Saúde', icon: Heart, description: 'Informações médicas' },
    { id: 8, title: 'Informações Adicionais', icon: FileText, description: 'Histórico e documentos extras' }
  ]

  const updateFormData = (section: keyof GermanyFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      notifySuccess('Sucesso', 'Formulário de visto alemão enviado com sucesso!')
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar formulário.')
    }
  }

  // Calculadora de elegibilidade para EU Blue Card,  const calculateBlueCardEligibility = () => {
    const minSalary = 58400 // 2024 minimum salary for EU Blue Card,    const shortageOccupationSalary = 45552 // For shortage occupations
    
    const hasHigherEducation = ['bachelor', 'master', 'phd'].includes(formData.educationInfo.highestEducation)
    const meetsSalaryRequirement = formData.workInfo.monthlyIncome * 12 >= minSalary
    const hasJobOffer = formData.workInfo.hasJobOfferGermany
    
    return {
      eligible: hasHigherEducation && meetsSalaryRequirement && hasJobOffer,
      factors: {
        education: hasHigherEducation,
        salary: meetsSalaryRequirement,
        jobOffer: hasJobOffer
      },
      minSalary,
      currentSalary: formData.workInfo.monthlyIncome * 12
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => updateFormData('personalInfo', 'fullName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Como no passaporte"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => updateFormData('personalInfo', 'birthDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local de Nascimento *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.birthPlace}
                  onChange={(e) => updateFormData('personalInfo', 'birthPlace', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidade *
                </label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">Brasileira</option>
                  <option value="portuguesa">Portuguesa</option>
                  <option value="argentina">Argentina</option>
                  <option value="chilena">Chilena</option>
                  <option value="colombiana">Colombiana</option>
                  <option value="mexicana">Mexicana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Residência Atual *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.currentCountry}
                  onChange={(e) => updateFormData('personalInfo', 'currentCountry', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Passaporte *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.passportNumber}
                  onChange={(e) => updateFormData('personalInfo', 'passportNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade do Passaporte *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.passportExpiry}
                  onChange={(e) => updateFormData('personalInfo', 'passportExpiry', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value as 'M' | 'F')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Civil *
                </label>
                <select
                  value={formData.personalInfo.maritalStatus}
                  onChange={(e) => updateFormData('personalInfo', 'maritalStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                  <option value="partner">União Estável</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Filhos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.personalInfo.children}
                  onChange={(e) => updateFormData('personalInfo', 'children', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Informações específicas da Alemanha */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Informações Importantes - Alemanha
                  </h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• EU Blue Card para profissionais altamente qualificados</li>
                    <li>• Conhecimento de alemão vantajoso para maioria dos vistos</li>
                    <li>• Seguro de saúde obrigatório</li>
                    <li>• Reconhecimento de diplomas pode ser necessário</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3: // Detalhes do Visto,        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Visto *
                </label>
                <select
                  value={formData.visaInfo.visaType}
                  onChange={(e) => updateFormData('visaInfo', 'visaType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione o tipo de visto...</option>
                  <option value="eu-blue-card">EU Blue Card (Profissionais Qualificados)</option>
                  <option value="student">Visto de Estudante</option>
                  <option value="tourist">Visto de Turista/Negócios</option>
                  <option value="family-reunion">Reunificação Familiar</option>
                  <option value="job-seeker">Job Seeker Visa (Busca de Emprego)</option>
                  <option value="self-employment">Visto de Trabalho Autônomo</option>
                  <option value="investment">Visto de Investidor</option>
                  <option value="au-pair">Au Pair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propósito da Viagem *
                </label>
                <input
                  type="text"
                  value={formData.visaInfo.purpose}
                  onChange={(e) => updateFormData('visaInfo', 'purpose', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Trabalho, estudos, turismo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração Pretendida (meses)
                </label>
                <input
                  type="number"
                  value={formData.visaInfo.intendedDuration}
                  onChange={(e) => updateFormData('visaInfo', 'intendedDuration', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Pretendida de Chegada
                </label>
                <input
                  type="date"
                  value={formData.visaInfo.intendedArrival}
                  onChange={(e) => updateFormData('visaInfo', 'intendedArrival', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Acomodação
                </label>
                <select
                  value={formData.visaInfo.accommodationType}
                  onChange={(e) => updateFormData('visaInfo', 'accommodationType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="hotel">Hotel</option>
                  <option value="friend">Casa de amigo/familiar</option>
                  <option value="rental">Aluguel</option>
                  <option value="own">Propriedade própria</option>
                  <option value="employer">Fornecido pelo empregador</option>
                  <option value="student-housing">Moradia estudantil</option>
                  <option value="wg">WG (Apartamento compartilhado)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.previousGermanyVisits}
                  onChange={(e) => updateFormData('visaInfo', 'previousGermanyVisits', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Já visitei a Alemanha anteriormente
                </label>
              </div>

              {formData.visaInfo.previousGermanyVisits && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Última Visita
                  </label>
                  <input
                    type="date"
                    value={formData.visaInfo.lastVisitDate || ''}
                    onChange={(e) => updateFormData('visaInfo', 'lastVisitDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.hasGermanFamily}
                  onChange={(e) => updateFormData('visaInfo', 'hasGermanFamily', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho familiares ou cônjuge alemão/na Alemanha
                </label>
              </div>

              {formData.visaInfo.hasGermanFamily && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relação Familiar
                  </label>
                  <input
                    type="text"
                    value={formData.visaInfo.familyRelation || ''}
                    onChange={(e) => updateFormData('visaInfo', 'familyRelation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: cônjuge, filho, irmão..."
                  />
                </div>
              )}
            </div>

            {/* Calculadora de elegibilidade para EU Blue Card */}
            {formData.visaInfo.visaType === 'eu-blue-card' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Verificação de Elegibilidade - EU Blue Card
                    </h3>
                    {(() => {
                      const eligibility = calculateBlueCardEligibility()
                      return (
                        <div className="text-blue-700 text-sm space-y-2">
                          <p className={`font-bold ${eligibility.eligible ? 'text-green-600' : 'text-red-600'}`}>
                            Status: {eligibility.eligible ? 'Elegível' : 'Não Elegível'}
                          </p>
                          <div className="space-y-1">
                            <p>• Educação superior: {eligibility.factors.education ? '✅' : '❌'}</p>
                            <p>• Salário mínimo (€58.400): {eligibility.factors.salary ? '✅' : '❌'}</p>
                            <p>• Oferta de emprego: {eligibility.factors.jobOffer ? '✅' : '❌'}</p>
                            <p>• Salário atual: €{eligibility.currentSalary.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 4: // Educação - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Informações educacionais para Alemanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 5: // Trabalho - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Informações profissionais para Alemanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 6: // Finanças - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Informações financeiras para Alemanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 7: // Saúde - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Informações de saúde para Alemanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 8: // Informações Adicionais - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Informações adicionais para Alemanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      default:
        return <div>Seção em desenvolvimento...</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Flag className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto Alemanha</h1>
        </div>
        <p className="text-gray-600">
          Preencha todas as informações para sua aplicação de visto alemão
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep >= step.id 
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  React.createElement(step.icon, { className: "h-5 w-5" })
                )}
              </div>
              <span className={`text-xs mt-2 text-center max-w-20 ${
                currentStep >= step.id ? 'text-red-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-red-600" })}
            <span>{steps[currentStep - 1].title}</span>
          </h2>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Anterior</span>
        </button>

        {currentStep === steps.length ? (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <span>Enviar Formulário</span>
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}