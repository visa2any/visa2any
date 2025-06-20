'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Globe, Clock, CreditCard, Shield, FileText } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface OnlineVisaFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
    passportNumber: string
    passportExpiry: string
    passportIssuingCountry: string
  }
  contactInfo: {
    email: string
    phone: string
    homeAddress: string
    city: string
    country: string
  }
  travelInfo: {
    visaType: string
    purposeOfTravel: string
    intendedArrival: string
    intendedStay: number
    hasVisitedBefore: boolean
    hasBeenDenied: boolean
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface OnlineVisaFormProps {
  onSubmit?: (data: OnlineVisaFormData) => void
  initialData?: Partial<OnlineVisaFormData>
}

export function OnlineVisaForm({ onSubmit, initialData }: OnlineVisaFormProps) {
  const [formData, setFormData] = useState<OnlineVisaFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      passportIssuingCountry: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      homeAddress: '',
      city: '',
      country: ''
    },
    travelInfo: {
      visaType: 'esta',
      purposeOfTravel: 'tourism',
      intendedArrival: '',
      intendedStay: 90,
      hasVisitedBefore: false,
      hasBeenDenied: false
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const onlineVisaTypes = [
    {
      value: 'esta',
      name: 'ESTA - EUA',
      fullName: 'Electronic System for Travel Authorization',
      flag: '🇺🇸',
      description: 'Autorização eletrônica para viagem aos EUA sem visto',
      validity: '2 anos ou até expirar o passaporte',
      maxStay: '90 dias por entrada',
      cost: 'USD $21',
      processingTime: 'Geralmente aprovado em minutos, máximo 72 horas',
      eligibility: 'Cidadãos de países do Programa de Isenção de Visto',
      features: [
        '100% online - sem entrevista',
        'Múltiplas entradas',
        'Válido para turismo e negócios',
        'Aplicação simples de 10-15 minutos'
      ],
      requirements: [
        'Passaporte biométrico válido',
        'Cartão de crédito para pagamento',
        'Endereço nos EUA (hotel)',
        'Sem histórico criminal'
      ]
    },
    {
      value: 'eta_canada',
      name: 'eTA - Canadá',
      fullName: 'Electronic Travel Authorization',
      flag: '🇨🇦',
      description: 'Autorização eletrônica para viagem ao Canadá',
      validity: '5 anos ou até expirar o passaporte',
      maxStay: '6 meses por entrada',
      cost: 'CAD $7',
      processingTime: 'Geralmente aprovado em minutos',
      eligibility: 'Cidadãos de países isentos de visto',
      features: [
        'Processo 100% online',
        'Válido para múltiplas viagens',
        'Renovação automática com novo passaporte',
        'Custo muito baixo'
      ],
      requirements: [
        'Passaporte válido',
        'Cartão de crédito/débito',
        'Endereço de email válido',
        'Sem inadmissibilidade'
      ]
    },
    {
      value: 'etias',
      name: 'ETIAS - Europa',
      fullName: 'European Travel Information and Authorization System',
      flag: '🇪🇺',
      description: 'Sistema de autorização para entrada na área Schengen (implementação 2024)',
      validity: '3 anos ou até expirar o passaporte',
      maxStay: '90 dias dentro de 180 dias',
      cost: '€7 (gratuito para menores de 18 e maiores de 70)',
      processingTime: 'Poucos minutos, máximo 4 dias',
      eligibility: 'Cidadãos de países atualmente isentos de visto Schengen',
      features: [
        'Acesso a 26 países Schengen',
        'Aplicação online obrigatória',
        'Sistema de pré-triagem de segurança',
        'Processo rápido e eficiente'
      ],
      requirements: [
        'Passaporte válido',
        'Cartão de crédito para pagamento',
        'Endereço de email',
        'Informações sobre viagem'
      ]
    },
    {
      value: 'eta_australia',
      name: 'ETA - Austrália',
      fullName: 'Electronic Travel Authority',
      flag: '🇦🇺',
      description: 'Autorização eletrônica para entrada na Austrália',
      validity: '12 meses ou até expirar o passaporte',
      maxStay: '90 dias por entrada',
      cost: 'AUD $20',
      processingTime: 'Geralmente aprovado instantaneamente',
      eligibility: 'Cidadãos de países específicos (incluindo Brasil)',
      features: [
        'Aprovação instantânea na maioria dos casos',
        'Múltiplas entradas',
        'Para turismo e negócios',
        'Ligado eletronicamente ao passaporte'
      ],
      requirements: [
        'Passaporte válido',
        'Cartão de crédito',
        'Sem histórico criminal',
        'Boa saúde'
      ]
    },
    {
      value: 'evisitor_australia',
      name: 'eVisitor - Austrália',
      fullName: 'Electronic Visitor Visa',
      flag: '🇦🇺',
      description: 'Visto eletrônico gratuito para cidadãos europeus',
      validity: '12 meses ou até expirar o passaporte',
      maxStay: '90 dias por entrada',
      cost: 'Gratuito',
      processingTime: 'Geralmente aprovado instantaneamente',
      eligibility: 'Cidadãos da UE, Noruega, Suíça e outros países europeus',
      features: [
        'Completamente gratuito',
        'Processo 100% online',
        'Múltiplas entradas',
        'Para turismo e negócios'
      ],
      requirements: [
        'Passaporte europeu válido',
        'Endereço de email',
        'Sem condenações criminais',
        'Boa saúde'
      ]
    },
    {
      value: 'k_eta_korea',
      name: 'K-ETA - Coreia do Sul',
      fullName: 'Korea Electronic Travel Authorization',
      flag: '🇰🇷',
      description: 'Autorização eletrônica para entrada na Coreia do Sul',
      validity: '2 anos',
      maxStay: '90 dias por entrada',
      cost: 'KRW 10.000 (aprox. USD $8)',
      processingTime: '24-72 horas',
      eligibility: 'Cidadãos de países com isenção de visto',
      features: [
        'Aplicação online simples',
        'Múltiplas entradas',
        'Processo digitalizado',
        'Válido por 2 anos'
      ],
      requirements: [
        'Passaporte válido',
        'Foto recente',
        'Cartão de crédito',
        'Informações da viagem'
      ]
    }
  ]

  const updateFormData = (section: keyof OnlineVisaFormData, field: string, value: any) => {
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
        formData.personalInfo.passportNumber,
        formData.contactInfo.email
      ]

      if (requiredFields.some(field => !field)) {
        notifyError('Erro', 'Por favor, preencha todos os campos obrigatórios')
        return
      }

      if (onSubmit) {
        await onSubmit(formData)
      }

      notifySuccess('Sucesso', 'Aplicação de visto online enviada com sucesso!')
    } catch (error) {
      notifyError('Erro', 'Falha ao enviar aplicação.')
    }
  }

  const selectedVisaType = onlineVisaTypes.find(visa => visa.value === formData.travelInfo.visaType)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Vistos Online Sem Entrevista</h1>
        </div>
        <p className="text-gray-600">
          Aplicações 100% online para ESTA, eTA, ETIAS e outros vistos eletrônicos
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-6">
          {/* Seleção de Tipo de Visto Online */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Visto Online *
            </label>
            <div className="grid grid-cols-1 gap-4">
              {onlineVisaTypes.map((visa) => (
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
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{visa.flag}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{visa.name}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Globe className="h-3 w-3 mr-1" />
                          Online
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{visa.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>{visa.processingTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-3 w-3 text-green-500" />
                          <span>{visa.cost}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-purple-500" />
                          <span>{visa.validity}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3 text-orange-500" />
                          <span>{visa.maxStay}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Detalhes do Visto Selecionado */}
          {selectedVisaType && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">{selectedVisaType.flag}</span>
                <span>{selectedVisaType.fullName}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Características:</h4>
                  <ul className="space-y-1">
                    {selectedVisaType.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Requisitos:</h4>
                  <ul className="space-y-1">
                    {selectedVisaType.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                        <Check className="h-4 w-4 text-blue-500" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Elegibilidade:</strong> {selectedVisaType.eligibility}
                </p>
              </div>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <option value="brazilian">🇧🇷 Brasileira</option>
                  <option value="portuguese">🇵🇹 Portuguesa</option>
                  <option value="italian">🇮🇹 Italiana</option>
                  <option value="spanish">🇪🇸 Espanhola</option>
                  <option value="french">🇫🇷 Francesa</option>
                  <option value="german">🇩🇪 Alemã</option>
                  <option value="other">🌍 Outro</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País Emissor do Passaporte *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.passportIssuingCountry}
                  onChange={(e) => updateFormData('personalInfo', 'passportIssuingCountry', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Brasil"
                />
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
                  Propósito da Viagem
                </label>
                <select
                  value={formData.travelInfo.purposeOfTravel}
                  onChange={(e) => updateFormData('travelInfo', 'purposeOfTravel', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tourism">Turismo</option>
                  <option value="business">Negócios</option>
                  <option value="transit">Trânsito</option>
                  <option value="visit_family">Visita familiar</option>
                  <option value="medical">Tratamento médico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Chegada Pretendida
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
                  max="365"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.travelInfo.hasVisitedBefore}
                    onChange={(e) => updateFormData('travelInfo', 'hasVisitedBefore', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já visitei este país anteriormente
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.travelInfo.hasBeenDenied}
                    onChange={(e) => updateFormData('travelInfo', 'hasBeenDenied', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Já tive visto negado para este país
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contato de Emergência */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato de Emergência</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => updateFormData('emergencyContact', 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => updateFormData('emergencyContact', 'phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parentesco
                </label>
                <select
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => updateFormData('emergencyContact', 'relationship', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="spouse">Cônjuge</option>
                  <option value="parent">Pai/Mãe</option>
                  <option value="child">Filho(a)</option>
                  <option value="sibling">Irmão/Irmã</option>
                  <option value="friend">Amigo(a)</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              <strong>Próximos passos:</strong> Após enviar este formulário, nossa equipe revisará suas informações 
              e enviará o link oficial para completar sua aplicação online. O processo geralmente leva alguns 
              minutos para ser concluído.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <span>Enviar Aplicação</span>
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}