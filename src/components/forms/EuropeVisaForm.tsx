'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Flag } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface EuropeFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
    passportNumber: string
  }
  contactInfo: {
    email: string
    phone: string
  }
  visaInfo: {
    visaType: string
    targetCountry: string
    purposeOfVisit: string
    travelDates: {
      arrival: string
      departure: string
    }
  }
}

interface EuropeVisaFormProps {
  onSubmit?: (data: EuropeFormData) => void
  initialData?: Partial<EuropeFormData>
}

export function EuropeVisaForm({ onSubmit, initialData }: EuropeVisaFormProps) {
  const [formData, setFormData] = useState<EuropeFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: '',
      passportNumber: ''
    },
    contactInfo: {
      email: '',
      phone: ''
    },
    visaInfo: {
      visaType: 'tourist',
      targetCountry: 'france',
      purposeOfVisit: '',
      travelDates: {
        arrival: '',
        departure: ''
      }
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const visaTypes = [
    { value: 'tourist', label: 'Turismo Schengen', desc: 'Visto de turismo para área Schengen' },
    { value: 'business', label: 'Negócios Schengen', desc: 'Visto de negócios para área Schengen' },
    { value: 'family', label: 'Visita Familiar', desc: 'Visita a familiares na Europa' },
    { value: 'study', label: 'Estudos', desc: 'Visto de estudante' },
    { value: 'work', label: 'Trabalho', desc: 'Visto de trabalho' },
    // VISTOS DE TRÂNSITO CRÍTICOS EUROPA
    { value: 'airport-transit', label: 'Airport Transit Visa (ATV)', desc: 'Trânsito em aeroportos da área Schengen' },
    { value: 'transit', label: 'Transit Visa', desc: 'Trânsito terrestre pela área Schengen' },
    // VISTOS ONLINE SEM ENTREVISTA
    { value: 'etias', label: 'ETIAS (2024+)', desc: 'Sistema Europeu de Informação e Autorização de Viagem' }
  ]

  const europeanCountries = [
    { value: 'france', label: 'França', flag: '🇫🇷' },
    { value: 'germany', label: 'Alemanha', flag: '🇩🇪' },
    { value: 'italy', label: 'Itália', flag: '🇮🇹' },
    { value: 'spain', label: 'Espanha', flag: '🇪🇸' },
    { value: 'netherlands', label: 'Holanda', flag: '🇳🇱' },
    { value: 'switzerland', label: 'Suíça', flag: '🇨🇭' },
    { value: 'austria', label: 'Áustria', flag: '🇦🇹' },
    { value: 'belgium', label: 'Bélgica', flag: '🇧🇪' },
    { value: 'norway', label: 'Noruega', flag: '🇳🇴' },
    { value: 'sweden', label: 'Suécia', flag: '🇸🇪' },
    { value: 'denmark', label: 'Dinamarca', flag: '🇩🇰' },
    { value: 'finland', label: 'Finlândia', flag: '🇫🇮' }
  ]

  const updateFormData = (section: keyof EuropeFormData, field: string, value: any) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Vistos Europa</h1>
        </div>
        <p className="text-gray-600">
          Aplicação para vistos europeus e área Schengen
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
                    <div>
                      <h4 className="font-medium text-gray-900">{visa.label}</h4>
                      <p className="text-sm text-gray-600">{visa.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* País de Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País de Destino Principal *
            </label>
            <select
              value={formData.visaInfo.targetCountry}
              onChange={(e) => updateFormData('visaInfo', 'targetCountry', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {europeanCountries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.flag} {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* Informações Pessoais */}
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
          </div>

          {/* Datas de Viagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Chegada Pretendida
              </label>
              <input
                type="date"
                value={formData.visaInfo.travelDates.arrival}
                onChange={(e) => updateFormData('visaInfo', 'travelDates', { ...formData.visaInfo.travelDates, arrival: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Saída Pretendida
              </label>
              <input
                type="date"
                value={formData.visaInfo.travelDates.departure}
                onChange={(e) => updateFormData('visaInfo', 'travelDates', { ...formData.visaInfo.travelDates, departure: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Propósito da Viagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propósito da Viagem *
            </label>
            <textarea
              value={formData.visaInfo.purposeOfVisit}
              onChange={(e) => updateFormData('visaInfo', 'purposeOfVisit', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva o motivo da sua viagem à Europa"
            />
          </div>

          {/* Informações sobre Trânsito */}
          {(formData.visaInfo.visaType === 'airport-transit' || formData.visaInfo.visaType === 'transit') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Informações sobre Trânsito</h4>
              <p className="text-sm text-yellow-700 mb-3">
                {formData.visaInfo.visaType === 'airport-transit' 
                  ? 'Visto de trânsito aeroportuário permite conexões em aeroportos da área Schengen sem sair da área internacional.'
                  : 'Visto de trânsito permite atravessar território Schengen por até 5 dias.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-2">
                    Aeroporto/Local de Trânsito
                  </label>
                  <input
                    type="text"
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ex: Charles de Gaulle (CDG)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-900 mb-2">
                    Destino Final
                  </label>
                  <input
                    type="text"
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="País/cidade de destino final"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Informação sobre ETIAS */}
          {formData.visaInfo.visaType === 'etias' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">ETIAS - Autorização Eletrônica (2024+)</h4>
              <p className="text-sm text-green-700">
                O ETIAS será obrigatório a partir de 2024 para cidadãos de países isentos de visto. 
                É um processo 100% online, semelhante ao ESTA americano, com validade de 3 anos.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              Nossa equipe especializada analisará sua aplicação e fornecerá orientações específicas 
              baseadas nas regulamentações atuais do país de destino.
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