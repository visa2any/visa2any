'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Briefcase, 
  GraduationCap, Heart, Plane, DollarSign, FileText, Globe,
  Check, AlertTriangle, Info, ChevronRight, Flag, Users,
  Calculator, Award, Languages, Target, Euro, Home
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface PortugalFormData {
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
    nif?: string
  }
  
  contactInfo: {
    homeAddress: string
    city: string
    district: string
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
    previousPortugalVisits: boolean
    lastVisitDate?: string
    hasPortugueseFamily: boolean
    familyRelation?: string
  }
  
  educationInfo: {
    highestEducation: string
    institutionName: string
    studyField: string
    graduationYear: string
    hasRecognition: boolean
    recognitionBody?: string
    languageSkills: {
      portuguese: string
      english: string
      spanish: string
      french: string
    }
  }
  
  workInfo: {
    currentOccupation: string
    employer: string
    employerAddress: string
    monthlyIncome: number
    workExperience: number
    hasJobOfferPortugal: boolean
    portugueseEmployer?: string
    contractType?: string
    startDate?: string
  }
  
  financialInfo: {
    bankBalance: number
    monthlyIncome: number
    otherIncome: number
    properties: number
    investments: number
    proofOfFunds: number
    healthInsurance: boolean
    insuranceProvider?: string
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
    hasCriminalRecord: boolean
    criminalDetails?: string
    hasBeenDeported: boolean
    deportationDetails?: string
    purposeDetails: string
    returnToCountry: boolean
    otherInfo: string
  }
}

interface PortugalVisaFormProps {
  onSubmit?: (data: PortugalFormData) => void
  initialData?: Partial<PortugalFormData>
}

export function PortugalVisaForm({ onSubmit, initialData }: PortugalVisaFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PortugalFormData>({
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
      district: '',
      postalCode: '',
      country: '',
      phone: '',
      email: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    visaInfo: {
      visaType: 'D7',
      purpose: '',
      intendedDuration: 12,
      intendedArrival: '',
      accommodationType: 'rental',
      previousPortugalVisits: false,
      hasPortugueseFamily: false
    },
    educationInfo: {
      highestEducation: '',
      institutionName: '',
      studyField: '',
      graduationYear: '',
      hasRecognition: false,
      languageSkills: {
        portuguese: 'basic',
        english: 'intermediate',
        spanish: 'basic',
        french: 'basic'
      }
    },
    workInfo: {
      currentOccupation: '',
      employer: '',
      employerAddress: '',
      monthlyIncome: 0,
      workExperience: 0,
      hasJobOfferPortugal: false
    },
    financialInfo: {
      bankBalance: 0,
      monthlyIncome: 0,
      otherIncome: 0,
      properties: 0,
      investments: 0,
      proofOfFunds: 0,
      healthInsurance: false
    },
    healthInfo: {
      hasHealthIssues: false,
      hasInsurance: false,
      insuranceType: 'private',
      covidVaccinated: true,
      emergencyContact: ''
    },
    additionalInfo: {
      hasCriminalRecord: false,
      hasBeenDeported: false,
      purposeDetails: '',
      returnToCountry: true,
      otherInfo: ''
    },
    ...initialData
  })

  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  const visaTypes = [
    { value: 'D7', label: 'Visto D7 (Rendimento Próprio)', desc: 'Para aposentados, nômades digitais e pessoas com rendimentos próprios', requirements: '€760/mês' },
    { value: 'GOLDEN', label: 'Golden Visa', desc: 'Visto por investimento em Portugal', requirements: '€280.000+' },
    { value: 'D2', label: 'Visto D2 (Empreendedor)', desc: 'Para empreendedores e investidores', requirements: 'Plano de negócios' },
    { value: 'D1', label: 'Visto D1 (Trabalho)', desc: 'Para trabalho subordinado', requirements: 'Contrato de trabalho' },
    { value: 'D4', label: 'Visto D4 (Estudos)', desc: 'Para estudos superiores', requirements: 'Aceitação em universidade' },
    { value: 'D3', label: 'Visto D3 (Profissional Qualificado)', desc: 'Para profissionais altamente qualificados', requirements: 'Qualificações reconhecidas' },
    { value: 'FAMILY', label: 'Reagrupamento Familiar', desc: 'Para família de residentes portugueses/UE', requirements: 'Comprovação de vínculo' }
  ]

  const districts = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
    'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
    'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu',
    'Açores', 'Madeira'
  ]

  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: User },
    { id: 2, title: 'Contato & Endereço', icon: MapPin },
    { id: 3, title: 'Tipo de Visto', icon: Flag },
    { id: 4, title: 'Educação & Idiomas', icon: GraduationCap },
    { id: 5, title: 'Informações Profissionais', icon: Briefcase },
    { id: 6, title: 'Situação Financeira', icon: Euro },
    { id: 7, title: 'Saúde & Seguro', icon: Heart },
    { id: 8, title: 'Informações Adicionais', icon: Info }
  ]

  const updateFormData = (section: keyof PortugalFormData, field: string, value: any) => {
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

  const calculateMinimumIncome = () => {
    const baseAmount = 760 // Valor mínimo para D7 em 2024
    const spouseAmount = formData.personalInfo.maritalStatus === 'married' ? 380 : 0
    const childrenAmount = formData.personalInfo.children * 228
    return baseAmount + spouseAmount + childrenAmount
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        formData.personalInfo.fullName,
        formData.personalInfo.birthDate,
        formData.personalInfo.nationality,
        formData.contactInfo.email,
        formData.visaInfo.purpose
      ]

      if (requiredFields.some(field => !field)) {
        notifyError('Erro', 'Por favor, preencha todos os campos obrigatórios')
        return
      }

      // Validate minimum income for D7
      if (formData.visaInfo.visaType === 'D7') {
        const minIncome = calculateMinimumIncome()
        if (formData.financialInfo.monthlyIncome < minIncome) {
          notifyError('Atenção', `Para o visto D7, a renda mínima deve ser €${minIncome}/mês`)
          return
        }
      }

      if (onSubmit) {
        await onSubmit(formData)
      }

      notifySuccess('Sucesso', 'Formulário enviado com sucesso! Nossa equipe entrará em contato em breve.')
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar formulário. Tente novamente.')
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Cidade, Estado, País"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidade *
                </label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">Brasileira</option>
                  <option value="portuguesa">Portuguesa</option>
                  <option value="americana">Americana</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Civil
                </label>
                <select
                  value={formData.personalInfo.maritalStatus}
                  onChange={(e) => updateFormData('personalInfo', 'maritalStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                  <option value="union">União de Facto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Filhos Dependentes
                </label>
                <input
                  type="number"
                  value={formData.personalInfo.children}
                  onChange={(e) => updateFormData('personalInfo', 'children', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>

              {formData.personalInfo.maritalStatus === 'married' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cônjuge
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.spouseName || ''}
                    onChange={(e) => updateFormData('personalInfo', 'spouseName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Passaporte
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.passportNumber}
                  onChange={(e) => updateFormData('personalInfo', 'passportNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Residencial *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress}
                  onChange={(e) => updateFormData('contactInfo', 'homeAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.city}
                  onChange={(e) => updateFormData('contactInfo', 'city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => updateFormData('contactInfo', 'email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => updateFormData('contactInfo', 'phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Visto *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {visaTypes.map((visa) => (
                  <label
                    key={visa.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.visaInfo.visaType === visa.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visaType"
                      value={visa.value}
                      checked={formData.visaInfo.visaType === visa.value}
                      onChange={(e) => updateFormData('visaInfo', 'visaType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        formData.visaInfo.visaType === visa.value
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.visaInfo.visaType === visa.value && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{visa.label}</h4>
                        <p className="text-sm text-gray-600 mb-1">{visa.desc}</p>
                        <div className="text-xs text-green-600 font-medium">
                          Requisito: {visa.requirements}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propósito da Viagem *
                </label>
                <textarea
                  value={formData.visaInfo.purpose}
                  onChange={(e) => updateFormData('visaInfo', 'purpose', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva detalhadamente o motivo da sua vinda para Portugal"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Acomodação
                </label>
                <select
                  value={formData.visaInfo.accommodationType}
                  onChange={(e) => updateFormData('visaInfo', 'accommodationType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="rental">Arrendamento</option>
                  <option value="purchase">Compra</option>
                  <option value="family">Casa de Familiares</option>
                  <option value="hotel">Hotel/Temporário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração Pretendida (meses)
                </label>
                <input
                  type="number"
                  value={formData.visaInfo.intendedDuration}
                  onChange={(e) => updateFormData('visaInfo', 'intendedDuration', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.previousPortugalVisits}
                  onChange={(e) => updateFormData('visaInfo', 'previousPortugalVisits', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label className="text-sm text-gray-700">
                  Já visitei Portugal anteriormente
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.visaInfo.hasPortugueseFamily}
                  onChange={(e) => updateFormData('visaInfo', 'hasPortugueseFamily', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho familiares portugueses ou residentes em Portugal
                </label>
              </div>
            </div>

            {/* Calculadora de renda mínima para D7 */}
            {formData.visaInfo.visaType === 'D7' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Calculator className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Calculadora Visto D7</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Renda mínima necessária: €{calculateMinimumIncome()}/mês
                    </p>
                    <div className="text-xs text-green-600 mt-2">
                      • Requerente principal: €760
                      {formData.personalInfo.maritalStatus === 'married' && <><br/>• Cônjuge: €380</>}
                      {formData.personalInfo.children > 0 && <><br/>• {formData.personalInfo.children} filho(s): €{formData.personalInfo.children * 228}</>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Euro className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Comprovação Financeira</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Portugal exige comprovação de meios de subsistência adequados
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renda Mensal (EUR) *
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.monthlyIncome}
                  onChange={(e) => updateFormData('financialInfo', 'monthlyIncome', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 1500"
                />
                {formData.visaInfo.visaType === 'D7' && formData.financialInfo.monthlyIncome > 0 && (
                  <p className={`text-xs mt-1 ${
                    formData.financialInfo.monthlyIncome >= calculateMinimumIncome() 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.financialInfo.monthlyIncome >= calculateMinimumIncome() 
                      ? '✓ Atende ao requisito mínimo' 
                      : `✗ Abaixo do mínimo (€${calculateMinimumIncome()})`}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo Bancário (EUR)
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.bankBalance}
                  onChange={(e) => updateFormData('financialInfo', 'bankBalance', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outras Rendas (EUR)
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.otherIncome}
                  onChange={(e) => updateFormData('financialInfo', 'otherIncome', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Aluguéis, dividendos, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor de Propriedades (EUR)
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.properties}
                  onChange={(e) => updateFormData('financialInfo', 'properties', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investimentos (EUR)
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.investments}
                  onChange={(e) => updateFormData('financialInfo', 'investments', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprovativo de Meios (EUR)
                </label>
                <input
                  type="number"
                  value={formData.financialInfo.proofOfFunds}
                  onChange={(e) => updateFormData('financialInfo', 'proofOfFunds', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Valor total a comprovar"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.financialInfo.healthInsurance}
                  onChange={(e) => updateFormData('financialInfo', 'healthInsurance', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label className="text-sm text-gray-700">
                  Possuo seguro de saúde válido para Portugal
                </label>
              </div>

              {formData.financialInfo.healthInsurance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seguradora
                  </label>
                  <input
                    type="text"
                    value={formData.financialInfo.insuranceProvider || ''}
                    onChange={(e) => updateFormData('financialInfo', 'insuranceProvider', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Cálculo automático da situação financeira */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Resumo Financeiro</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Renda Total Mensal:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    €{(formData.financialInfo.monthlyIncome + formData.financialInfo.otherIncome).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Patrimônio Total:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    €{(formData.financialInfo.bankBalance + formData.financialInfo.properties + formData.financialInfo.investments).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Informações sobre educação e idiomas para Portugal.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Informações profissionais para avaliação do visto português.
              </p>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Informações de saúde e seguro para Portugal.
              </p>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Informações adicionais para complementar a aplicação.
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
          <Flag className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto Portugal</h1>
        </div>
        <p className="text-gray-600">
          Preencha todas as informações para sua aplicação de visto português
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep >= step.id 
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs mt-2 text-center max-w-20 ${
                currentStep >= step.id ? 'text-green-600 font-medium' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-green-600" })}
            <span>{steps[currentStep - 1].title}</span>
          </h2>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
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
            className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            <span>Enviar Formulário</span>
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}