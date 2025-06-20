'use client'

import React, { useState } from 'react'
import { Check, ChevronRight, Flag, Globe, Plane } from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface AustraliaFormData {
  personalInfo: {
    fullName: string
    birthDate: string
    nationality: string
    passportNumber: string
    passportExpiry: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  visaInfo: {
    visaType: string
    purposeOfVisit: string
    intendedStay: number
    travelDates: {
      arrival: string
      departure: string
    }
  }
  skillsInfo?: {
    occupation: string
    workExperience: number
    education: string
    englishProficiency: string
  }
}

interface AustraliaVisaFormProps {
  onSubmit?: (data: AustraliaFormData) => void
  initialData?: Partial<AustraliaFormData>
}

export function AustraliaVisaForm({ onSubmit, initialData }: AustraliaVisaFormProps) {
  const [formData, setFormData] = useState<AustraliaFormData>({
    personalInfo: {
      fullName: '',
      birthDate: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    visaInfo: {
      visaType: 'visitor',
      purposeOfVisit: '',
      intendedStay: 30,
      travelDates: {
        arrival: '',
        departure: ''
      }
    },
    skillsInfo: {
      occupation: '',
      workExperience: 0,
      education: '',
      englishProficiency: 'intermediate'
    },
    ...initialData
  })

  const { notifySuccess, notifyError } = useSystemNotifications()

  const visaTypes = [
    // VISTOS ONLINE SEM ENTREVISTA
    { value: 'eta', label: 'ETA (Electronic Travel Authority)', desc: 'Autorização eletrônica - 100% online para turismo/negócios até 90 dias' },
    { value: 'evisitor', label: 'eVisitor', desc: 'Visto online gratuito para cidadãos europeus - turismo/negócios até 90 dias' },
    // VISTOS TRADICIONAIS
    { value: 'visitor', label: 'Visitor Visa (Subclass 600)', desc: 'Visto de visitante para turismo ou negócios' },
    { value: 'student', label: 'Student Visa (Subclass 500)', desc: 'Visto de estudante' },
    { value: 'working-holiday', label: 'Working Holiday (Subclass 417)', desc: 'Trabalho e viagem para jovens (18-30 anos)' },
    { value: 'work-and-holiday', label: 'Work and Holiday (Subclass 462)', desc: 'Trabalho e viagem para países elegíveis' },
    // IMIGRAÇÃO E TRABALHO
    { value: 'skilled-independent', label: 'Skilled Independent (Subclass 189)', desc: 'Residência permanente independente baseada em pontos' },
    { value: 'skilled-nominated', label: 'Skilled Nominated (Subclass 190)', desc: 'Residência permanente com indicação estadual' },
    { value: 'skilled-work', label: 'Skilled Work Regional (Subclass 491)', desc: 'Visto temporário para áreas regionais' },
    { value: 'employer-sponsored', label: 'Employer Sponsored (Subclass 186)', desc: 'Residência permanente patrocinada pelo empregador' },
    { value: 'temporary-skill-shortage', label: 'Temporary Skill Shortage (Subclass 482)', desc: 'Visto temporário de trabalho especializado' },
    // NEGÓCIOS E INVESTIMENTO
    { value: 'business-innovation', label: 'Business Innovation (Subclass 188)', desc: 'Visto temporário para empresários e investidores' },
    { value: 'business-talent', label: 'Business Talent (Subclass 132)', desc: 'Residência permanente para empresários estabelecidos' },
    { value: 'investor', label: 'Investor (Subclass 891)', desc: 'Residência permanente para investidores' },
    // FAMÍLIA
    { value: 'partner', label: 'Partner Visa (Subclass 820/801)', desc: 'Visto para parceiros/cônjuges de residentes australianos' },
    { value: 'parent', label: 'Parent Visa', desc: 'Visto para pais de cidadãos/residentes australianos' },
    { value: 'child', label: 'Child Visa', desc: 'Visto para filhos de cidadãos/residentes australianos' }
  ]

  const updateFormData = (section: keyof AustraliaFormData, field: string, value: any) => {
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

  const isSkillsVisaType = ['skilled-independent', 'skilled-nominated', 'skilled-work', 'employer-sponsored', 'temporary-skill-shortage'].includes(formData.visaInfo.visaType)
  const isOnlineVisa = ['eta', 'evisitor'].includes(formData.visaInfo.visaType)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Flag className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formulário - Vistos Austrália</h1>
        </div>
        <p className="text-gray-600">
          Aplicação para vistos australianos, incluindo vistos online e imigração
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
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{visa.label}</h4>
                        {['eta', 'evisitor'].includes(visa.value) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Globe className="h-3 w-3 mr-1" />
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{visa.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Informação sobre Vistos Online */}
          {isOnlineVisa && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    {formData.visaInfo.visaType === 'eta' ? 'ETA - Processo 100% Online' : 'eVisitor - Visto Online Gratuito'}
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {formData.visaInfo.visaType === 'eta' ? (
                      <>
                        <p>• Taxa: AUD $20 | Processamento: Geralmente aprovado em minutos</p>
                        <p>• Válido por: 12 meses ou até expirar o passaporte</p>
                        <p>• Múltiplas entradas: Até 90 dias por visita</p>
                        <p>• Elegível: Cidadãos de países específicos (incluindo Brasil)</p>
                      </>
                    ) : (
                      <>
                        <p>• Taxa: GRATUITO | Processamento: Geralmente aprovado em minutos</p>
                        <p>• Válido por: 12 meses ou até expirar o passaporte</p>
                        <p>• Múltiplas entradas: Até 90 dias por visita</p>
                        <p>• Elegível: Apenas cidadãos da UE e alguns outros países europeus</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <option value="italiana">Italiana</option>
                <option value="espanhola">Espanhola</option>
                <option value="alemã">Alemã</option>
                <option value="francesa">Francesa</option>
                <option value="outro">Outro</option>
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Residencial *
              </label>
              <input
                type="text"
                value={formData.contactInfo.address}
                onChange={(e) => updateFormData('contactInfo', 'address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Endereço completo"
              />
            </div>
          </div>

          {/* Informações de Viagem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Chegada Pretendida
              </label>
              <input
                type="date"
                value={formData.visaInfo.travelDates.arrival}
                onChange={(e) => updateFormData('visaInfo', 'travelDates', { ...formData.visaInfo.travelDates, arrival: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="365"
              />
            </div>
          </div>

          {/* Propósito da Viagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Propósito da Viagem/Aplicação *
            </label>
            <textarea
              value={formData.visaInfo.purposeOfVisit}
              onChange={(e) => updateFormData('visaInfo', 'purposeOfVisit', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva o motivo da sua viagem/aplicação à Austrália"
            />
          </div>

          {/* Informações de Habilidades (para vistos skilled) */}
          {isSkillsVisaType && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-medium text-orange-900 mb-4">Informações Profissionais e de Habilidades</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-2">
                    Ocupação/Profissão
                  </label>
                  <input
                    type="text"
                    value={formData.skillsInfo?.occupation || ''}
                    onChange={(e) => updateFormData('skillsInfo', 'occupation', e.target.value)}
                    className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Software Developer, Nurse, Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-2">
                    Anos de Experiência
                  </label>
                  <input
                    type="number"
                    value={formData.skillsInfo?.workExperience || 0}
                    onChange={(e) => updateFormData('skillsInfo', 'workExperience', parseInt(e.target.value))}
                    className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-2">
                    Nível de Educação
                  </label>
                  <select
                    value={formData.skillsInfo?.education || ''}
                    onChange={(e) => updateFormData('skillsInfo', 'education', e.target.value)}
                    className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="secondary">Ensino Médio</option>
                    <option value="trade">Curso Técnico</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Graduação</option>
                    <option value="master">Mestrado</option>
                    <option value="doctorate">Doutorado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-2">
                    Proficiência em Inglês
                  </label>
                  <select
                    value={formData.skillsInfo?.englishProficiency || 'intermediate'}
                    onChange={(e) => updateFormData('skillsInfo', 'englishProficiency', e.target.value)}
                    className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="upper-intermediate">Intermediário Avançado</option>
                    <option value="advanced">Avançado</option>
                    <option value="fluent">Fluente</option>
                    <option value="native">Nativo</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-orange-700">
                <p>
                  <strong>Nota:</strong> Para vistos skilled, será necessário realizar avaliação de habilidades, 
                  teste de inglês (IELTS/PTE) e outros requisitos específicos. Nossa equipe fornecerá orientação completa.
                </p>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              Nossa equipe especializada analisará sua aplicação e fornecerá orientações específicas 
              para o tipo de visto selecionado, incluindo lista completa de documentos e próximos passos.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
        >
          <span>Enviar Formulário</span>
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}