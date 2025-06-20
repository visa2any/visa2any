'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, FileText, Calendar, CreditCard, CheckCircle, AlertTriangle,
  Info, ChevronRight, ChevronLeft, Globe, User, Plane, Building,
  Clock, Shield, Eye, Download, Upload, Star, Award, Target
} from 'lucide-react'
import { USAVisaForm } from '@/components/forms/USAVisaForm'
import { CanadaVisaForm } from '@/components/forms/CanadaVisaForm'
import { PortugalVisaForm } from '@/components/forms/PortugalVisaForm'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface WizardStep {
  id: string
  title: string
  description: string
  icon: any
  component?: React.ComponentType<any>
  completed: boolean
  estimated_time: string
  requirements: string[]
}

interface VisaApplicationWizardProps {
  country?: string
  visaType?: string
  onComplete?: (data: any) => void
}

export function VisaApplicationWizard({ country, visaType, onComplete }: VisaApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState(country || '')
  const [selectedVisaType, setSelectedVisaType] = useState(visaType || '')
  const [applicationData, setApplicationData] = useState<any>({})
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  
  const { notifySuccess, notifyError, notifyInfo } = useSystemNotifications()

  const countries = [
    {
      code: 'USA',
      name: 'Estados Unidos',
      flag: '🇺🇸',
      description: 'Terra das oportunidades',
      processing_time: '2-8 semanas',
      success_rate: '85%',
      popular_visas: ['B1/B2', 'F1', 'H1B', 'EB-1', 'EB-5']
    },
    {
      code: 'CAN',
      name: 'Canadá',
      flag: '🇨🇦',
      description: 'Qualidade de vida excepcional',
      processing_time: '6-12 meses',
      success_rate: '78%',
      popular_visas: ['Express Entry', 'PNP', 'Study Permit', 'Work Permit']
    },
    {
      code: 'PRT',
      name: 'Portugal',
      flag: '🇵🇹',
      description: 'Portal para a Europa',
      processing_time: '3-6 meses',
      success_rate: '92%',
      popular_visas: ['D7', 'Golden Visa', 'Student Visa', 'Work Visa']
    },
    {
      code: 'AUS',
      name: 'Austrália',
      flag: '🇦🇺',
      description: 'Estilo de vida único',
      processing_time: '4-8 meses',
      success_rate: '81%',
      popular_visas: ['Skilled Migration', 'Business Innovation', 'Student Visa']
    }
  ]

  const getWizardSteps = (country: string, visaType: string): WizardStep[] => {
    const baseSteps: WizardStep[] = [
      {
        id: 'country_selection',
        title: 'Seleção do País',
        description: 'Escolha o país de destino para sua aplicação',
        icon: Globe,
        completed: false,
        estimated_time: '5 min',
        requirements: ['Definir objetivo de viagem', 'Pesquisar requisitos básicos']
      },
      {
        id: 'visa_type',
        title: 'Tipo de Visto',
        description: 'Selecione o tipo de visto mais adequado',
        icon: FileText,
        completed: false,
        estimated_time: '10 min',
        requirements: ['Conhecer propósito da viagem', 'Entender diferentes categorias']
      },
      {
        id: 'eligibility_check',
        title: 'Verificação de Elegibilidade',
        description: 'Analise se você atende aos requisitos',
        icon: CheckCircle,
        completed: false,
        estimated_time: '15 min',
        requirements: ['Informações pessoais', 'Histórico educacional', 'Experiência profissional']
      },
      {
        id: 'document_preparation',
        title: 'Preparação de Documentos',
        description: 'Reúna todos os documentos necessários',
        icon: FileText,
        completed: false,
        estimated_time: '2-4 semanas',
        requirements: ['Passaporte válido', 'Documentos específicos', 'Traduções certificadas']
      },
      {
        id: 'application_form',
        title: 'Preenchimento do Formulário',
        description: 'Complete o formulário oficial de aplicação',
        icon: User,
        completed: false,
        estimated_time: '1-2 horas',
        requirements: ['Todos os documentos prontos', 'Informações precisas', 'Fotos adequadas']
      },
      {
        id: 'review_submit',
        title: 'Revisão e Envio',
        description: 'Revise tudo antes do envio final',
        icon: Eye,
        completed: false,
        estimated_time: '30 min',
        requirements: ['Formulário completo', 'Documentos anexados', 'Taxa de aplicação']
      },
      {
        id: 'interview_prep',
        title: 'Preparação para Entrevista',
        description: 'Prepare-se para a entrevista consular',
        icon: Building,
        completed: false,
        estimated_time: '1-2 semanas',
        requirements: ['Agendamento feito', 'Documentos organizados', 'Prática de perguntas']
      },
      {
        id: 'tracking',
        title: 'Acompanhamento',
        description: 'Monitore o status da sua aplicação',
        icon: Clock,
        completed: false,
        estimated_time: 'Contínuo',
        requirements: ['Número de protocolo', 'Acesso ao portal', 'Verificações regulares']
      }
    ]

    // Customize steps based on country and visa type
    if (country === 'USA') {
      baseSteps[4].component = USAVisaForm
    } else if (country === 'CAN') {
      baseSteps[4].component = CanadaVisaForm
    } else if (country === 'PRT') {
      baseSteps[4].component = PortugalVisaForm
    }

    return baseSteps
  }

  const [wizardSteps, setWizardSteps] = useState<WizardStep[]>([])

  useEffect(() => {
    if (selectedCountry && selectedVisaType) {
      const steps = getWizardSteps(selectedCountry, selectedVisaType)
      setWizardSteps(steps)
    }
  }, [selectedCountry, selectedVisaType])

  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    setWizardSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    )
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setCurrentStep(1)
    completeStep('country_selection')
  }

  const handleVisaTypeSelect = (visa: string) => {
    setSelectedVisaType(visa)
    setCurrentStep(2)
    completeStep('visa_type')
  }

  const renderCountrySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha Seu Destino</h2>
        <p className="text-gray-600">
          Selecione o país onde você deseja solicitar o visto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {countries.map((country) => (
          <div
            key={country.code}
            onClick={() => handleCountrySelect(country.code)}
            className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{country.flag}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {country.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{country.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Processamento:</span>
                    <span className="font-medium">{country.processing_time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxa de Sucesso:</span>
                    <span className="font-medium text-green-600">{country.success_rate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Vistos Populares:</p>
                  <div className="flex flex-wrap gap-1">
                    {country.popular_visas.slice(0, 3).map((visa) => (
                      <span key={visa} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {visa}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderVisaTypeSelection = () => {
    const selectedCountryData = countries.find(c => c.code === selectedCountry)
    
    const visaTypes = {
      USA: [
        { code: 'B1B2', name: 'B-1/B-2 (Turismo/Negócios)', desc: 'Viagem temporária', difficulty: 'Médio', time: '2-4 semanas' },
        { code: 'F1', name: 'F-1 (Estudante)', desc: 'Estudo acadêmico', difficulty: 'Médio', time: '4-8 semanas' },
        { code: 'H1B', name: 'H-1B (Trabalho)', desc: 'Ocupação especializada', difficulty: 'Alto', time: '2-6 meses' },
        { code: 'EB1', name: 'EB-1 (Green Card)', desc: 'Habilidade extraordinária', difficulty: 'Muito Alto', time: '8-12 meses' },
        { code: 'EB5', name: 'EB-5 (Investidor)', desc: 'Investimento $800k+', difficulty: 'Alto', time: '12-24 meses' }
      ],
      CAN: [
        { code: 'EXPRESS', name: 'Express Entry', desc: 'Imigração federal', difficulty: 'Alto', time: '6-8 meses' },
        { code: 'PNP', name: 'Provincial Nominee', desc: 'Programa provincial', difficulty: 'Médio', time: '8-12 meses' },
        { code: 'STUDY', name: 'Study Permit', desc: 'Permissão de estudo', difficulty: 'Médio', time: '4-8 semanas' },
        { code: 'WORK', name: 'Work Permit', desc: 'Permissão de trabalho', difficulty: 'Médio', time: '2-4 meses' }
      ],
      PRT: [
        { code: 'D7', name: 'Visto D7', desc: 'Rendimento próprio', difficulty: 'Baixo', time: '2-4 meses' },
        { code: 'GOLDEN', name: 'Golden Visa', desc: 'Investimento €280k+', difficulty: 'Médio', time: '6-12 meses' },
        { code: 'STUDENT', name: 'Visto de Estudante', desc: 'Estudos superiores', difficulty: 'Baixo', time: '1-2 meses' },
        { code: 'WORK', name: 'Visto de Trabalho', desc: 'Contrato de trabalho', difficulty: 'Médio', time: '2-3 meses' }
      ]
    }

    const currentVisas = visaTypes[selectedCountry as keyof typeof visaTypes] || []

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">{selectedCountryData?.flag}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tipos de Visto - {selectedCountryData?.name}
          </h2>
          <p className="text-gray-600">
            Escolha o tipo de visto que melhor se adequa ao seu objetivo
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentVisas.map((visa) => (
            <div
              key={visa.code}
              onClick={() => handleVisaTypeSelect(visa.code)}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {visa.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{visa.desc}</p>
                  
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Dificuldade:</span>
                      <span className={`font-medium ${
                        visa.difficulty === 'Baixo' ? 'text-green-600' :
                        visa.difficulty === 'Médio' ? 'text-yellow-600' :
                        visa.difficulty === 'Alto' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {visa.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Tempo:</span>
                      <span className="font-medium">{visa.time}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderEligibilityCheck = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação de Elegibilidade</h2>
        <p className="text-gray-600">
          Vamos verificar se você atende aos requisitos básicos
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Análise Inteligente de Elegibilidade
            </h3>
            <p className="text-blue-700 text-sm">
              Nossa IA irá analisar suas informações e calcular suas chances de sucesso, 
              identificando pontos fortes e áreas que precisam de atenção.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-6 border border-gray-200 rounded-lg">
          <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Perfil Pessoal</h4>
          <p className="text-sm text-gray-600">
            Idade, estado civil, histórico pessoal
          </p>
        </div>

        <div className="text-center p-6 border border-gray-200 rounded-lg">
          <Award className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Qualificações</h4>
          <p className="text-sm text-gray-600">
            Educação, experiência, habilidades
          </p>
        </div>

        <div className="text-center p-6 border border-gray-200 rounded-lg">
          <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Situação Legal</h4>
          <p className="text-sm text-gray-600">
            Histórico de viagens, situação legal
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            completeStep('eligibility_check')
            nextStep()
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Iniciar Análise de Elegibilidade
        </button>
      </div>
    </div>
  )

  const renderFormStep = () => {
    const currentStepData = wizardSteps[currentStep]
    const FormComponent = currentStepData?.component

    if (!FormComponent) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Formulário Específico
          </h3>
          <p className="text-gray-600 mb-6">
            Complete o formulário oficial para {selectedCountry}
          </p>
          <button
            onClick={() => {
              completeStep(currentStepData.id)
              nextStep()
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Continuar
          </button>
        </div>
      )
    }

    return (
      <FormComponent
        onSubmit={(data: any) => {
          setApplicationData({ ...applicationData, formData: data })
          completeStep(currentStepData.id)
          nextStep()
        }}
      />
    )
  }

  const renderGenericStep = () => {
    const currentStepData = wizardSteps[currentStep]

    return (
      <div className="space-y-6">
        <div className="text-center">
          <currentStepData.icon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Requisitos desta etapa:</h3>
          <ul className="space-y-2">
            {currentStepData.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              completeStep(currentStepData.id)
              nextStep()
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Marcar como Concluído
          </button>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    if (wizardSteps.length === 0) {
      if (currentStep === 0) return renderCountrySelection()
      if (currentStep === 1) return renderVisaTypeSelection()
      return null
    }

    const currentStepData = wizardSteps[currentStep]

    switch (currentStepData.id) {
      case 'eligibility_check':
        return renderEligibilityCheck()
      case 'application_form':
        return renderFormStep()
      default:
        return renderGenericStep()
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Assistente de Aplicação de Visto
        </h1>
        <p className="text-gray-600">
          Processo guiado passo a passo para sua aplicação de visto
        </p>
      </div>

      {/* Progress Bar */}
      {wizardSteps.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Progresso: {currentStep + 1} de {wizardSteps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / wizardSteps.length) * 100)}% concluído
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Navigation */}
      {wizardSteps.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {wizardSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center min-w-0 flex-1 ${
                  index === currentStep ? 'text-blue-600' : 
                  step.completed ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  index === currentStep ? 'border-blue-600 bg-blue-50' :
                  step.completed ? 'border-green-600 bg-green-50' : 'border-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs text-center font-medium">{step.title}</span>
                <span className="text-xs text-gray-500">{step.estimated_time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {wizardSteps.length > 0 && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          {currentStep === wizardSteps.length - 1 ? (
            <button
              onClick={() => {
                completeStep(wizardSteps[currentStep].id)
                onComplete?.(applicationData)
                notifySuccess('Sucesso!', 'Aplicação de visto concluída com sucesso!')
              }}
              className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Finalizar Aplicação</span>
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
      )}
    </div>
  )
}