'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Flag, Plane, MapPin, Users } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface NewZealandFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
    passportNumber: string
    passportExpiry: string
    gender: 'M' | 'F'
    maritalStatus: string
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
    hasVisitedBefore: boolean
    hasBeenDenied: boolean
  }
  healthInfo: {
    hasHealthConditions: boolean
    takingMedication: boolean
    pregnant: boolean
  }
  backgroundInfo: {
    currentOccupation: string
    employer: string
    monthlyIncome: number
    education: string
  }
}

interface NewZealandVisaFormProps {
  onSubmit?: (data: NewZealandFormData) => void
  initialData?: Partial<NewZealandFormData>
}

export function NewZealandVisaForm({ onSubmit, initialData }: NewZealandVisaFormProps) {
  const [formData, setFormData] = useState<NewZealandFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'M',
      maritalStatus: 'single'
    },
    contactInfo: {
      email: '',
      phone: '',
      homeAddress: '',
      city: '',
      country: ''
    },
    visaInfo: {
      visaType: 'visitor',
      purposeOfVisit: '',
      intendedArrival: '',
      intendedStay: 30,
      hasVisitedBefore: false,
      hasBeenDenied: false
    },
    healthInfo: {
      hasHealthConditions: false,
      takingMedication: false,
      pregnant: false
    },
    backgroundInfo: {
      currentOccupation: '',
      employer: '',
      monthlyIncome: 0,
      education: ''
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const visaTypes = [
    {
      value: 'visitor',
      label: 'Visitor Visa',
      desc: 'Para turismo, visita familiar ou negócios de curta duração',
      duration: 'Até 9 meses',
      processing: '15-25 dias úteis'
    },
    {
      value: 'transit',
      label: 'Transit Visa',
      desc: 'Para trânsito através da Nova Zelândia',
      duration: 'Até 24 horas',
      processing: '5-10 dias úteis'
    },
    {
      value: 'student',
      label: 'Student Visa',
      desc: 'Para estudos em instituições neozelandesas',
      duration: 'Duração do curso',
      processing: '20-35 dias úteis'
    },
    {
      value: 'work',
      label: 'Work Visa',
      desc: 'Para trabalho temporário na Nova Zelândia',
      duration: 'Varia',
      processing: '15-50 dias úteis'
    },
    {
      value: 'working-holiday',
      label: 'Working Holiday Visa',
      desc: 'Para jovens de 18-30 anos (alguns países até 35)',
      duration: '12 meses',
      processing: '10-20 dias úteis'
    },
    {
      value: 'resident',
      label: 'Resident Visa',
      desc: 'Para residência permanente na Nova Zelândia',
      duration: 'Permanente',
      processing: '6-12 meses'
    }
  ]

  const updateFormData = (section: keyof NewZealandFormData, field: string, value: any) => {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Flag className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Visto Nova Zelândia</h1>
        </div>
        <p className="text-gray-600">
          Aplicação para vistos neozelandeses
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
                      ? 'border-blue-500 bg-blue-50'
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
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.visaInfo.visaType === visa.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{visa.label}</h4>
                      <p className="text-sm text-gray-600 mb-1">{visa.desc}</p>
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
                  Nacionalidade *
                </label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="brasileira">🇧🇷 Brasileira</option>
                  <option value="portuguesa">🇵🇹 Portuguesa</option>
                  <option value="argentina">🇦🇷 Argentina</option>
                  <option value="chilena">🇨🇱 Chilena</option>
                  <option value="uruguaia">🇺🇾 Uruguaia</option>
                  <option value="outro">🌍 Outro</option>
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
                  <option value="de_facto">De facto relationship</option>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Residencial *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.homeAddress}
                  onChange={(e) => updateFormData('contactInfo', 'homeAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva o motivo da sua viagem à Nova Zelândia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Chegada Pretendida
                </label>
                <input
                  type="date"
                  value={formData.visaInfo.intendedArrival}
                  onChange={(e) => updateFormData('visaInfo', 'intendedArrival', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visaInfo.hasVisitedBefore}
                    onChange={(e) => updateFormData('visaInfo', 'hasVisitedBefore', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já visitei a Nova Zelândia anteriormente
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visaInfo.hasBeenDenied}
                    onChange={(e) => updateFormData('visaInfo', 'hasBeenDenied', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já tive visto negado para a Nova Zelândia
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Saúde */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Saúde</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-700 text-sm">
                A Nova Zelândia tem requisitos rigorosos de saúde. Seja honesto nas respostas.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.healthInfo.hasHealthConditions}
                  onChange={(e) => updateFormData('healthInfo', 'hasHealthConditions', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Tenho alguma condição médica significativa
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.healthInfo.takingMedication}
                  onChange={(e) => updateFormData('healthInfo', 'takingMedication', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Estou tomando medicamentos regularmente
                </label>
              </div>

              {formData.personalInfo.gender === 'F' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.healthInfo.pregnant}
                    onChange={(e) => updateFormData('healthInfo', 'pregnant', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Estou grávida
                  </label>
                </div>
              )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renda Mensal (NZD)
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
                  <option value="secondary">Ensino Médio</option>
                  <option value="diploma">Diploma/Técnico</option>
                  <option value="bachelor">Graduação</option>
                  <option value="master">Mestrado</option>
                  <option value="doctorate">Doutorado</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              Nossa equipe especializada analisará sua aplicação e fornecerá orientações específicas 
              para o visto neozelandês, incluindo documentos necessários e próximos passos.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <span>Enviar Formulário</span>
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}