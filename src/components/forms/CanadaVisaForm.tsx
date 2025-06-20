'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Flag } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface CanadaFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
  }
  contactInfo: {
    email: string
    phone: string
  }
  visaInfo: {
    visaType: string
    purposeOfVisit: string
  }
}

interface CanadaVisaFormProps {
  onSubmit?: (data: CanadaFormData) => void
  initialData?: Partial<CanadaFormData>
}

export function CanadaVisaForm({ onSubmit, initialData }: CanadaVisaFormProps) {
  const [formData, setFormData] = useState<CanadaFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: ''
    },
    contactInfo: {
      email: '',
      phone: ''
    },
    visaInfo: {
      visaType: 'express-entry',
      purposeOfVisit: ''
    },
    ...initialData
  })

  const visaTypes = [
    { value: 'express-entry', label: 'Express Entry', desc: 'Sistema de imigração econômica' },
    { value: 'pnp', label: 'Provincial Nominee Program (PNP)', desc: 'Indicação provincial' },
    { value: 'study-permit', label: 'Study Permit', desc: 'Permissão de estudo' },
    { value: 'work-permit', label: 'Work Permit', desc: 'Permissão de trabalho' },
    { value: 'visitor', label: 'Visitor Visa', desc: 'Visto de visitante' },
    { value: 'family-class', label: 'Family Class', desc: 'Reunificação familiar' },
    // VISTOS DE TRÂNSITO CRÍTICOS
    { value: 'transit', label: 'Transit Visa', desc: 'Trânsito no Canadá (escalas até 48h)' },
    { value: 'transit-without-visa', label: 'Transit Without Visa (TWOV)', desc: 'Trânsito sem visto para cidadãos elegíveis' },
    // VISTOS ONLINE SEM ENTREVISTA
    { value: 'eta', label: 'eTA (Electronic Travel Authorization)', desc: 'Autorização eletrônica de viagem' }
  ]

  const { notifySuccess, notifyError } = useSystemNotifications()

  const updateFormData = (section: keyof CanadaFormData, field: string, value: any) => {
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
          <Flag className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Imigração Canadá</h1>
        </div>
        <p className="text-gray-600">
          Avaliação para programas de imigração canadenses
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
              </select>
            </div>

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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Aplicação *
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
                    <div>
                      <h4 className="font-medium text-gray-900">{visa.label}</h4>
                      <p className="text-sm text-gray-600">{visa.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propósito da Visita/Aplicação
            </label>
            <textarea
              value={formData.visaInfo.purposeOfVisit}
              onChange={(e) => updateFormData('visaInfo', 'purposeOfVisit', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva o motivo da sua aplicação ao Canadá"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              Para avaliação completa do Express Entry com CRS Score e outros programas, 
              nossa equipe especializada entrará em contato com você.
            </p>
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