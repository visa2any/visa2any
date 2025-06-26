'use client'

import React, { useState } from 'react'
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Briefcase, 
  GraduationCap, Heart, Plane, DollarSign, FileText, Globe,
  Check, AlertTriangle, Info, ChevronRight, Flag, Users
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface USAFormData {
  // Personal Information,  personalInfo: {
    fullName: string
    birthDate: string
    birthPlace: string
    nationality: string
    currentCountry: string
    passportNumber: string
    passportExpiry: string
    gender: 'M' | 'F'
    maritalStatus: string
  }
  
  // Contact Information,  contactInfo: {
    homeAddress: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    email: string
  }
  
  // Travel Information,  travelInfo: {
    visaType: string
    purposeOfTrip: string
    intendedArrival: string
    intendedStay: number
    previousUSVisits: boolean
    hasUSVisa: boolean
    visaRefused: boolean
    refusalReason?: string
  }
  
  // Employment/Education,  backgroundInfo: {
    currentOccupation: string
    employer: string
    employerAddress: string
    monthlyIncome: number
    education: string
    languageProficiency: string
  }
  
  // Security Questions,  securityInfo: {
    criminalHistory: boolean
    drugViolations: boolean
    terrorism: boolean
    deportation: boolean
    mentalDisorder: boolean
    communicableDisease: boolean
  }
  
  // Supporting Documents,  documents: {
    passport: boolean
    photo: boolean
    bankStatements: boolean
    employmentLetter: boolean
    itinerary: boolean
    invitation?: boolean
    additionalDocs: string[]
  }
}

interface USAVisaFormProps {
  onSubmit?: (data: USAFormData) => void
  initialData?: Partial<USAFormData>
}

export function USAVisaForm({ onSubmit, initialData }: USAVisaFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<USAFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      birthPlace: '',
      nationality: '',
      currentCountry: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'M',
      maritalStatus: 'single'
    },
    contactInfo: {
      homeAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: ''
    },
    travelInfo: {
      visaType: 'B1/B2',
      purposeOfTrip: '',
      intendedArrival: '',
      intendedStay: 15,
      previousUSVisits: false,
      hasUSVisa: false,
      visaRefused: false
    },
    backgroundInfo: {
      currentOccupation: '',
      employer: '',
      employerAddress: '',
      monthlyIncome: 0,
      education: '',
      languageProficiency: 'intermediate'
    },
    securityInfo: {
      criminalHistory: false,
      drugViolations: false,
      terrorism: false,
      deportation: false,
      mentalDisorder: false,
      communicableDisease: false
    },
    documents: {
      passport: false,
      photo: false,
      bankStatements: false,
      employmentLetter: false,
      itinerary: false,
      additionalDocs: []
    },
    ...initialData
  })

  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  const visaTypes = [
    { value: 'B1/B2', label: 'B-1/B-2 (Turismo/Negócios)', desc: 'Viagem temporária para turismo ou negócios' },
    { value: 'F1', label: 'F-1 (Estudante)', desc: 'Estudo em instituição acadêmica' },
    { value: 'H1B', label: 'H-1B (Trabalho Especializado)', desc: 'Trabalho temporário em ocupação especializada' },
    { value: 'L1', label: 'L-1 (Transferência)', desc: 'Transferência intracompanhia' },
    { value: 'O1', label: 'O-1 (Habilidade Extraordinária)', desc: 'Indivíduos com habilidade extraordinária' },
    { value: 'EB1', label: 'EB-1 (Green Card Prioritário)', desc: 'Residência permanente para pessoas com habilidades extraordinárias' },
    { value: 'EB5', label: 'EB-5 (Investidor)', desc: 'Green Card por investimento de $800k+' },
    // VISTOS DE TRÂNSITO CRÍTICOS,    { value: 'C1', label: 'C-1 (Trânsito)', desc: 'Trânsito em território americano para outros países' },
    { value: 'C1/D', label: 'C-1/D (Trânsito/Tripulação)', desc: 'Trânsito e trabalho como tripulante de embarcação/aeronave' },
    // VISTOS ESPECIALIZADOS  ,    { value: 'A1', label: 'A-1 (Diplomático)', desc: 'Diplomatas e funcionários governamentais' },
    { value: 'A2', label: 'A-2 (Oficial Governamental)', desc: 'Outros funcionários governamentais e militares' },
    { value: 'D1', label: 'D-1 (Tripulação Marítima)', desc: 'Tripulantes de embarcações marítimas' },
    { value: 'D2', label: 'D-2 (Tripulação Aérea)', desc: 'Tripulantes de aeronaves' },
    { value: 'I', label: 'I (Mídia/Jornalista)', desc: 'Representantes de mídia estrangeira' },
    { value: 'R1', label: 'R-1 (Religioso)', desc: 'Trabalhadores religiosos temporários' },
    { value: 'T', label: 'T (Vítimas de Tráfico)', desc: 'Vítimas de tráfico humano' },
    { value: 'U', label: 'U (Vítimas de Crime)', desc: 'Vítimas de certos crimes' }
  ]

  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: User },
    { id: 2, title: 'Contato & Endereço', icon: MapPin },
    { id: 3, title: 'Informações de Viagem', icon: Plane },
    { id: 4, title: 'Emprego & Educação', icon: Briefcase },
    { id: 5, title: 'Questões de Segurança', icon: AlertTriangle },
    { id: 6, title: 'Documentos', icon: FileText }
  ]

  const updateFormData = (section: keyof USAFormData, field: string, value: any) => {
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
      // Validate required fields,      const requiredFields = [
        formData.personalInfo.fullName,
        formData.personalInfo.birthDate,
        formData.personalInfo.nationality,
        formData.contactInfo.email,
        formData.travelInfo.purposeOfTrip
      ]

      if (requiredFields.some(field => !field)) {
        notifyError('Erro', 'Por favor, preencha todos os campos obrigatórios')
        return
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">Brasileira</option>
                  <option value="portuguesa">Portuguesa</option>
                  <option value="argentina">Argentina</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Passaporte
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.passportNumber}
                  onChange={(e) => updateFormData('personalInfo', 'passportNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: AB1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade do Passaporte
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.passportExpiry}
                  onChange={(e) => updateFormData('personalInfo', 'passportExpiry', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Civil
                </label>
                <select
                  value={formData.personalInfo.maritalStatus}
                  onChange={(e) => updateFormData('personalInfo', 'maritalStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                </select>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua, número, bairro"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado/Província
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.state}
                  onChange={(e) => updateFormData('contactInfo', 'state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.zipCode}
                  onChange={(e) => updateFormData('contactInfo', 'zipCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.country}
                  onChange={(e) => updateFormData('contactInfo', 'country', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+55 11 99999-9999"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      formData.travelInfo.visaType === visa.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visaType"
                      value={visa.value}
                      checked={formData.travelInfo.visaType === visa.value}
                      onChange={(e) => updateFormData('travelInfo', 'visaType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        formData.travelInfo.visaType === visa.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.travelInfo.visaType === visa.value && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{visa.label}</h4>
                        <p className="text-sm text-gray-600">{visa.desc}</p>
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
                  value={formData.travelInfo.purposeOfTrip}
                  onChange={(e) => updateFormData('travelInfo', 'purposeOfTrip', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva o motivo da sua viagem aos EUA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Pretendida de Chegada
                </label>
                <input
                  type="date"
                  value={formData.travelInfo.intendedArrival}
                  onChange={(e) => updateFormData('travelInfo', 'intendedArrival', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração da Estadia (dias)
                </label>
                <input
                  type="number"
                  value={formData.travelInfo.intendedStay}
                  onChange={(e) => updateFormData('travelInfo', 'intendedStay', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.travelInfo.previousUSVisits}
                  onChange={(e) => updateFormData('travelInfo', 'previousUSVisits', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Já visitei os Estados Unidos anteriormente
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.travelInfo.hasUSVisa}
                  onChange={(e) => updateFormData('travelInfo', 'hasUSVisa', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Possuo visto americano válido
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.travelInfo.visaRefused}
                  onChange={(e) => updateFormData('travelInfo', 'visaRefused', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Já tive visto americano negado
                </label>
              </div>

              {formData.travelInfo.visaRefused && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da Recusa
                  </label>
                  <textarea
                    value={formData.travelInfo.refusalReason || ''}
                    onChange={(e) => updateFormData('travelInfo', 'refusalReason', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Explique o motivo da recusa anterior"
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocupação Atual *
                </label>
                <input
                  type="text"
                  value={formData.backgroundInfo.currentOccupation}
                  onChange={(e) => updateFormData('backgroundInfo', 'currentOccupation', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Engenheiro de Software"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empregador
                </label>
                <input
                  type="text"
                  value={formData.backgroundInfo.employer}
                  onChange={(e) => updateFormData('backgroundInfo', 'employer', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço do Empregador
                </label>
                <input
                  type="text"
                  value={formData.backgroundInfo.employerAddress}
                  onChange={(e) => updateFormData('backgroundInfo', 'employerAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Endereço completo da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renda Mensal (USD)
                </label>
                <input
                  type="number"
                  value={formData.backgroundInfo.monthlyIncome}
                  onChange={(e) => updateFormData('backgroundInfo', 'monthlyIncome', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Educação
                </label>
                <select
                  value={formData.backgroundInfo.education}
                  onChange={(e) => updateFormData('backgroundInfo', 'education', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="high_school">Ensino Médio</option>
                  <option value="bachelor">Graduação</option>
                  <option value="master">Mestrado</option>
                  <option value="doctorate">Doutorado</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiência em Inglês
                </label>
                <select
                  value={formData.backgroundInfo.languageProficiency}
                  onChange={(e) => updateFormData('backgroundInfo', 'languageProficiency', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                  <option value="fluent">Fluente</option>
                  <option value="native">Nativo</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Questões de Segurança</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Estas são questões obrigatórias do formulário DS-160. Responda com honestidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'criminalHistory', label: 'Você tem histórico criminal?' },
                { key: 'drugViolations', label: 'Já foi preso por violações relacionadas a drogas?' },
                { key: 'terrorism', label: 'Já esteve envolvido em atividades terroristas?' },
                { key: 'deportation', label: 'Já foi deportado de algum país?' },
                { key: 'mentalDisorder', label: 'Tem algum transtorno mental que possa representar risco?' },
                { key: 'communicableDisease', label: 'Tem alguma doença contagiosa?' }
              ].map((question) => (
                <div key={question.key} className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    {question.label}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question.key}
                        checked={!formData.securityInfo[question.key as keyof typeof formData.securityInfo]}
                        onChange={() => updateFormData('securityInfo', question.key, false)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Não</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question.key}
                        checked={formData.securityInfo[question.key as keyof typeof formData.securityInfo]}
                        onChange={() => updateFormData('securityInfo', question.key, true)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Sim</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Documentos Necessários</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Marque os documentos que você possui. Nossa equipe verificará e solicitará os que faltam.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'passport', label: 'Passaporte válido', required: true },
                { key: 'photo', label: 'Foto 5x5cm (fundo branco)', required: true },
                { key: 'bankStatements', label: 'Extratos bancários (últimos 3 meses)', required: true },
                { key: 'employmentLetter', label: 'Carta do empregador', required: false },
                { key: 'itinerary', label: 'Roteiro de viagem', required: false },
                { key: 'invitation', label: 'Carta convite (se aplicável)', required: false }
              ].map((doc) => (
                <div key={doc.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.documents[doc.key as keyof typeof formData.documents] as boolean}
                      onChange={(e) => updateFormData('documents', doc.key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-900">
                      {doc.label}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos Adicionais
              </label>
              <textarea
                value={formData.documents.additionalDocs.join('\n')}
                onChange={(e) => updateFormData('documents', 'additionalDocs', e.target.value.split('\n').filter(Boolean))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Liste outros documentos que você possui (um por linha)"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Flag className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto EUA</h1>
        </div>
        <p className="text-gray-600">
          Preencha todas as informações necessárias para sua aplicação de visto americano
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs mt-2 text-center ${
                currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-full h-0.5 mt-5 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-blue-600" })}
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
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <span>Enviar Formulário</span>
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}