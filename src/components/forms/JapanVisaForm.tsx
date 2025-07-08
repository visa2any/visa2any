'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Flag, MapPin, Briefcase } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface JapanFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
    passportNumber: string
    passportExpiry: string
    gender: 'M' | 'F'
    maritalStatus: string
    birthPlace: string
  }
  contactInfo: {
    email: string
    phone: string
    homeAddress: string
    city: string
    country: string
  }
  visaInfo: {
    visaType: string
    purposeOfVisit: string
    intendedArrival: string
    intendedStay: number
    portOfEntry: string
    hasVisitedBefore: boolean
    hasBeenDenied: boolean
    previousVisitReason?: string
  }
  backgroundInfo: {
    currentOccupation: string
    employer: string
    employerAddress: string
    monthlyIncome: number
    education: string
    previousCountries: string
  }
  japanInfo: {
    hasJapaneseAcquaintances: boolean
    hasJapaneseRelatives: boolean
    hasInvitation: boolean
    hasSponsorship: boolean
    previousVisitReason?: string
    knownJapanese: boolean
  }
}

interface JapanVisaFormProps {
  onSubmit?: (data: JapanFormData) => void
  initialData?: Partial<JapanFormData>
}

export function JapanVisaForm({ onSubmit, initialData }: JapanVisaFormProps) {
  const [formData, setFormData] = useState<JapanFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'M',
      maritalStatus: 'single',
      birthPlace: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      homeAddress: '',
      city: '',
      country: ''
    },
    visaInfo: {
      visaType: 'tourist',
      purposeOfVisit: '',
      intendedArrival: '',
      intendedStay: 15,
      portOfEntry: 'narita',
      hasVisitedBefore: false,
      hasBeenDenied: false
    },
    backgroundInfo: {
      currentOccupation: '',
      employer: '',
      employerAddress: '',
      monthlyIncome: 0,
      education: '',
      previousCountries: ''
    },
    japanInfo: {
      hasJapaneseAcquaintances: false,
      hasJapaneseRelatives: false,
      hasInvitation: false,
      hasSponsorship: false,
      knownJapanese: false
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const visaTypes = [
    {
      value: 'tourist',
      label: 'Visto de Turismo',
      desc: 'Para viagem de turismo, visita familiar ou amigos',
      duration: 'Até 90 dias',
      processing: '5-7 dias úteis',
      multipleEntry: false
    },
    {
      value: 'business',
      label: 'Visto de Negócios',
      desc: 'Para atividades comerciais, conferências, reuniões',
      duration: 'Até 90 dias',
      processing: '5-7 dias úteis',
      multipleEntry: true
    },
    {
      value: 'transit',
      label: 'Visto de Trânsito',
      desc: 'Para trânsito através do Japão para outro país',
      duration: 'Até 15 dias',
      processing: '3-5 dias úteis',
      multipleEntry: false
    },
    {
      value: 'cultural',
      label: 'Atividades Culturais',
      desc: 'Para participação em atividades culturais, esportivas ou religiosas',
      duration: 'Até 90 dias',
      processing: '7-10 dias úteis',
      multipleEntry: false
    },
    {
      value: 'student',
      label: 'Visto de Estudante',
      desc: 'Para estudos em instituições japonesas',
      duration: 'Duração do curso',
      processing: '1-3 meses',
      multipleEntry: false
    },
    {
      value: 'work',
      label: 'Visto de Trabalho',
      desc: 'Para trabalho no Japão (várias categorias)',
      duration: '1-5 anos',
      processing: '1-3 meses',
      multipleEntry: true
    },
    {
      value: 'spouse',
      label: 'Cônjuge de Japonês',
      desc: 'Para cônjuges de cidadãos japoneses',
      duration: '1-3 anos',
      processing: '1-2 meses',
      multipleEntry: true
    }
  ]

  const portsOfEntry = [
    { value: 'narita', label: 'Aeroporto de Narita (Tokyo)' },
    { value: 'haneda', label: 'Aeroporto de Haneda (Tokyo)' },
    { value: 'kansai', label: 'Aeroporto de Kansai (Osaka)' },
    { value: 'chubu', label: 'Aeroporto de Chubu (Nagoya)' },
    { value: 'fukuoka', label: 'Aeroporto de Fukuoka' },
    { value: 'sapporo', label: 'Aeroporto de Sapporo' },
    { value: 'naha', label: 'Aeroporto de Naha (Okinawa)' },
    { value: 'other', label: 'Outro porto de entrada' }
  ]

  const updateFormData = (section: keyof JapanFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      const requiredFields = [
        formData.personalInfo.fullName,
        formData.personalInfo.birthDate,
        formData.personalInfo.nationality,
        formData.contactInfo.email,
        formData.visaInfo.purposeOfVisit
      ]

      if (requiredFields.some(field => !field)) {
        notifyError('Erro', 'Por favor, preencha todos os campos obrigatórios')
        return
      }

      if (onSubmit) {
        await onSubmit(formData)
      }

      notifySuccess('Sucesso', 'Formulário enviado com sucesso!')
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar formulário.')
    }
  }

  const selectedVisaType = visaTypes.find(visa => visa.value === formData.visaInfo.visaType)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Flag className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto Japão</h1>
        </div>
        <p className="text-gray-600">
          🇯🇵 Aplicação para vistos japoneses
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-6">
          {/* Seleção de Tipo de Visto */}
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
                      ? 'border-red-500 bg-red-50'
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
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.visaInfo.visaType === visa.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{visa.label}</h4>
                        {visa.multipleEntry && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Múltiplas entradas
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{visa.desc}</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>Duração: {visa.duration}</span>
                        <span>Processamento: {visa.processing}</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Informações sobre visto selecionado */}
          {selectedVisaType && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Flag className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-red-900">Informações sobre {selectedVisaType.label}</h4>
              </div>
              <p className="text-sm text-red-700">
                <strong>Dica:</strong> O Japão tem processo de aplicação rigoroso. Documentos devem estar completos e precisos. 
                {selectedVisaType.value === 'tourist' && ' Para turismo, comprove vínculos com o Brasil e capacidade financeira.'}
                {selectedVisaType.value === 'business' && ' Para negócios, carta convite da empresa japonesa é essencial.'}
                {selectedVisaType.value === 'student' && ' Para estudos, Certificate of Eligibility da instituição é obrigatório.'}
              </p>
            </div>
          )}

          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
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
                  placeholder="Exatamente como no passaporte"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">🇧🇷 Brasileira</option>
                  <option value="portuguesa">🇵🇹 Portuguesa</option>
                  <option value="argentina">🇦🇷 Argentina</option>
                  <option value="chilena">🇨🇱 Chilena</option>
                  <option value="colombiana">🇨🇴 Colombiana</option>
                  <option value="peruana">🇵🇪 Peruana</option>
                  <option value="outro">🌍 Outro</option>
                </select>
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
                  placeholder="Ex: AB1234567"
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
                  Gênero
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => updateFormData('contactInfo', 'email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Residencial *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress}
                  onChange={(e) => updateFormData('contactInfo', 'homeAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Endereço completo"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Informações de Viagem */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Viagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propósito da Viagem *
                </label>
                <textarea
                  value={formData.visaInfo.purposeOfVisit}
                  onChange={(e) => updateFormData('visaInfo', 'purposeOfVisit', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva detalhadamente o motivo da sua viagem ao Japão"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porto de Entrada no Japão
                </label>
                <select
                  value={formData.visaInfo.portOfEntry}
                  onChange={(e) => updateFormData('visaInfo', 'portOfEntry', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {portsOfEntry.map((port) => (
                    <option key={port.value} value={port.value}>
                      {port.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Chegada Pretendida
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
                  Duração da Estadia (dias)
                </label>
                <input
                  type="number"
                  value={formData.visaInfo.intendedStay}
                  onChange={(e) => updateFormData('visaInfo', 'intendedStay', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="1"
                  max="365"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visaInfo.hasVisitedBefore}
                    onChange={(e) => updateFormData('visaInfo', 'hasVisitedBefore', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já visitei o Japão anteriormente
                  </label>
                </div>

                {formData.visaInfo.hasVisitedBefore && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo da visita anterior
                    </label>
                    <input
                      type="text"
                      value={formData.visaInfo.previousVisitReason || ''}
                      onChange={(e) => updateFormData('visaInfo', 'previousVisitReason', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ex: Turismo, negócios, estudos"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visaInfo.hasBeenDenied}
                    onChange={(e) => updateFormData('visaInfo', 'hasBeenDenied', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já tive visto negado para o Japão
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocupação Atual
                </label>
                <input
                  type="text"
                  value={formData.backgroundInfo.currentOccupation}
                  onChange={(e) => updateFormData('backgroundInfo', 'currentOccupation', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Endereço completo da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renda Mensal (JPY)
                </label>
                <input
                  type="number"
                  value={formData.backgroundInfo.monthlyIncome}
                  onChange={(e) => updateFormData('backgroundInfo', 'monthlyIncome', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: 300000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Educação
                </label>
                <select
                  value={formData.backgroundInfo.education}
                  onChange={(e) => updateFormData('backgroundInfo', 'education', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="high_school">Ensino Médio</option>
                  <option value="vocational">Curso Técnico</option>
                  <option value="bachelor">Graduação</option>
                  <option value="master">Mestrado</option>
                  <option value="doctorate">Doutorado</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Países Visitados Recentemente
                </label>
                <input
                  type="text"
                  value={formData.backgroundInfo.previousCountries}
                  onChange={(e) => updateFormData('backgroundInfo', 'previousCountries', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: EUA (2023), França (2022), Argentina (2021)"
                />
              </div>
            </div>
          </div>

          {/* Conexões com o Japão */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conexões com o Japão</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.japanInfo.hasJapaneseAcquaintances}
                  onChange={(e) => updateFormData('japanInfo', 'hasJapaneseAcquaintances', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho conhecidos ou amigos no Japão
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.japanInfo.hasJapaneseRelatives}
                  onChange={(e) => updateFormData('japanInfo', 'hasJapaneseRelatives', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho familiares no Japão
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.japanInfo.hasInvitation}
                  onChange={(e) => updateFormData('japanInfo', 'hasInvitation', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho carta convite de pessoa/empresa no Japão
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.japanInfo.hasSponsorship}
                  onChange={(e) => updateFormData('japanInfo', 'hasSponsorship', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho patrocinador/garantidor no Japão
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.japanInfo.knownJapanese}
                  onChange={(e) => updateFormData('japanInfo', 'knownJapanese', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm text-gray-700">
                  Falo japonês (básico ou avançado)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
                <Flag className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-900">Informações Importantes</h4>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• O Japão possui processo rigoroso de verificação de documentos</li>
              <li>• Entrevista no consulado pode ser necessária</li>
              <li>• Comprove vínculos empregatícios e financeiros no Brasil</li>
              <li>• Para negócios: carta convite detalhada da empresa japonesa</li>
              <li>• Para turismo: roteiro detalhado e reservas confirmadas</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          <span>Enviar Formulário</span>
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
