'use client'

import React, { useState } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Briefcase, 
  GraduationCap, Heart, Plane, DollarSign, FileText, Globe,
  Check, AlertTriangle, Info, ChevronRight, Flag, Users,
  Calculator, Award, Languages, Target, Euro, Home, Sun
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface SpainFormData {
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
    nie?: string // Número de Identificación de Extranjero  }
  
  contactInfo: {
    homeAddress: string
    city: string
    province: string
    postalCode: string
    country: string
    phone: string
    email: string
    emergencyContact: string
    emergencyPhone: string
    spainAddress?: string
  }
  
  visaInfo: {
    visaType: string
    purpose: string
    intendedDuration: number
    intendedArrival: string
    accommodationType: string
    accommodationAddress?: string
    previousSpainVisits: boolean
    lastVisitDate?: string
    hasSpanishFamily: boolean
    familyRelation?: string
    sponsorInfo?: string
  }
  
  educationInfo: {
    highestEducation: string
    institutionName: string
    studyField: string
    graduationYear: string
    spanishRecognition: boolean
    recognitionBody?: string
    languageSkills: {
      spanish: string
      english: string
      catalan?: string
      deleLevel?: string
      sielLevel?: string
    }
  }
  
  workInfo: {
    currentOccupation: string
    employer: string
    employerAddress: string
    monthlyIncome: number
    workExperience: number
    hasJobOfferSpain: boolean
    spanishEmployer?: string
    contractType?: string
    startDate?: string
    autonomoActivity?: boolean
  }
  
  financialInfo: {
    bankBalance: number
    monthlyIncome: number
    otherIncome: number
    properties: number
    investments: number
    pensionFunds: number
    healthInsurance: boolean
    insuranceProvider?: string
    socialSecurityNumber?: string
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

interface SpainVisaFormProps {
  onSubmit?: (data: SpainFormData) => void
  initialData?: Partial<SpainFormData>
}

export function SpainVisaForm({ onSubmit, initialData }: SpainVisaFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<SpainFormData>({
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
      province: '',
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
      previousSpainVisits: false,
      hasSpanishFamily: false
    },
    educationInfo: {
      highestEducation: '',
      institutionName: '',
      studyField: '',
      graduationYear: '',
      spanishRecognition: false,
      languageSkills: {
        spanish: '',
        english: ''
      }
    },
    workInfo: {
      currentOccupation: '',
      employer: '',
      employerAddress: '',
      monthlyIncome: 0,
      workExperience: 0,
      hasJobOfferSpain: false
    },
    financialInfo: {
      bankBalance: 0,
      monthlyIncome: 0,
      otherIncome: 0,
      properties: 0,
      investments: 0,
      pensionFunds: 0,
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

  const updateFormData = (section: keyof SpainFormData, field: string, value: any) => {
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
      notifySuccess('Sucesso', 'Formulário de visto espanhol enviado com sucesso!')
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar formulário.')
    }
  }

  // Calculadora para visto não-lucrativo

  const calculateNonLucrativeRequirements = () => {
    const minMonthlyIncome = 2400 // IPREM 2024 x 4,    const additionalFamilyMember = 600 // IPREM por familiar adicional
    
    const requiredIncome = minMonthlyIncome + (formData.personalInfo.children * additionalFamilyMember)
    const meetsRequirement = formData.financialInfo.monthlyIncome >= requiredIncome
    
    return {
      required: requiredIncome,
      current: formData.financialInfo.monthlyIncome,
      meets: meetsRequirement,
      familySize: 1 + formData.personalInfo.children
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidade *
                </label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">Brasileira</option>
                  <option value="portuguesa">Portuguesa</option>
                  <option value="argentina">Argentina</option>
                  <option value="chilena">Chilena</option>
                  <option value="colombiana">Colombiana</option>
                  <option value="mexicana">Mexicana</option>
                  <option value="venezuelana">Venezuelana</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value as 'M' | 'F')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                  <option value="partner">Pareja de Hecho</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Informações específicas da Espanha */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sun className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Informações Importantes - Espanha
                  </h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Visto não-lucrativo muito popular para aposentados</li>
                    <li>• Golden Visa com investimento de €500.000</li>
                    <li>• Conhecimento de espanhol valorizado</li>
                    <li>• Sistema de saúde público de qualidade</li>
                    <li>• Reagrupamento familiar facilitado</li>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione o tipo de visto...</option>
                  <option value="non-lucrative">Visto Não-Lucrativo (Aposentados)</option>
                  <option value="golden-visa">Golden Visa (Investidor)</option>
                  <option value="student">Visto de Estudante</option>
                  <option value="work">Visto de Trabalho</option>
                  <option value="family-reunion">Reagrupamento Familiar</option>
                  <option value="entrepreneur">Visto de Empreendedor</option>
                  <option value="tourist">Visto de Turista</option>
                  <option value="digital-nomad">Nômade Digital</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: Aposentadoria, trabalho, estudos..."
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Acomodação
                </label>
                <select
                  value={formData.visaInfo.accommodationType}
                  onChange={(e) => updateFormData('visaInfo', 'accommodationType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="purchase">Compra de imóvel</option>
                  <option value="rental">Aluguel</option>
                  <option value="friend">Casa de amigo/familiar</option>
                  <option value="hotel">Hotel/Pensão</option>
                  <option value="own">Propriedade própria</option>
                  <option value="student-residence">Residência estudantil</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.previousSpainVisits}
                  onChange={(e) => updateFormData('visaInfo', 'previousSpainVisits', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label className="text-sm text-gray-700">
                  Já visitei a Espanha anteriormente
                </label>
              </div>

              {formData.visaInfo.previousSpainVisits && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Última Visita
                  </label>
                  <input
                    type="date"
                    value={formData.visaInfo.lastVisitDate || ''}
                    onChange={(e) => updateFormData('visaInfo', 'lastVisitDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.hasSpanishFamily}
                  onChange={(e) => updateFormData('visaInfo', 'hasSpanishFamily', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho familiares ou cônjuge espanhol/na Espanha
                </label>
              </div>

              {formData.visaInfo.hasSpanishFamily && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relação Familiar
                  </label>
                  <input
                    type="text"
                    value={formData.visaInfo.familyRelation || ''}
                    onChange={(e) => updateFormData('visaInfo', 'familyRelation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ex: cônjuge, filho, irmão..."
                  />
                </div>
              )}
            </div>

            {/* Calculadora para visto não-lucrativo */}
            {formData.visaInfo.visaType === 'non-lucrative' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calculator className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">
                      Requisitos Financeiros - Visto Não-Lucrativo
                    </h3>
                    {(() => {
                      const requirements = calculateNonLucrativeRequirements()
                      return (
                        <div className="text-green-700 text-sm space-y-2">
                          <p className={`font-bold ${requirements.meets ? 'text-green-600' : 'text-red-600'}`}>
                            Renda: {requirements.meets ? 'Atende' : 'Insuficiente'}
                          </p>
                          <div className="space-y-1">
                            <p>• Renda mínima necessária: €{requirements.required.toLocaleString()}/mês</p>
                            <p>• Renda informada: €{requirements.current.toLocaleString()}/mês</p>
                            <p>• Composição familiar: {requirements.familySize} pessoa(s)</p>
                            <p>• Base: 4x IPREM (€600) + familiares</p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Informações sobre Golden Visa */}
            {formData.visaInfo.visaType === 'golden-visa' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Opções de Investimento - Golden Visa
                    </h3>
                    <div className="text-yellow-700 text-sm space-y-1">
                      <p>• Imóvel: €500.000 (sem hipoteca)</p>
                      <p>• Empresa espanhola: €1.000.000</p>
                      <p>• Títulos públicos: €2.000.000</p>
                      <p>• Banco espanhol: €1.000.000</p>
                      <p>• Projeto empresarial: €500.000</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 4: // Educação - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                Informações educacionais para Espanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 5: // Trabalho - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                Informações profissionais para Espanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 6: // Finanças - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                Informações financeiras para Espanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 7: // Saúde - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                Informações de saúde para Espanha - seção em desenvolvimento.
              </p>
            </div>
          </div>
        )

      case 8: // Informações Adicionais - placeholder simples,        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                Informações adicionais para Espanha - seção em desenvolvimento.
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
          <Flag className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto Espanha</h1>
        </div>
        <p className="text-gray-600">
          Preencha todas as informações para sua aplicação de visto espanhol
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep >= step.id 
                  ? 'bg-yellow-600 border-yellow-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  React.createElement(step.icon, { className: "h-5 w-5" })
                )}
              </div>
              <span className={`text-xs mt-2 text-center max-w-20 ${
                currentStep >= step.id ? 'text-yellow-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-yellow-600" })}
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
            className="flex items-center space-x-2 px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
          >
            <span>Enviar Formulário</span>
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}