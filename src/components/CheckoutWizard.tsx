'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Shield, Star, CreditCard, Check, User, FileText, Zap, Clock, Users, CheckCircle } from 'lucide-react'

interface FormData {
  // Etapa 1
  name: string
  email: string
  whatsapp: string
  
  // Etapa 2
  cpf: string
  terms: boolean
  contract: boolean
  installments: number
}

const steps = [
  {
    id: 1,
    title: 'Seus Dados',
    description: 'Informações básicas',
    icon: User
  },
  {
    id: 2,
    title: 'Finalizar',
    description: 'CPF e termos',
    icon: FileText
  }
]

export default function CheckoutWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    cpf: '',
    terms: false,
    contract: false,
    installments: 1
  })

  const updateFormData = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const calculateInstallmentPrice = (installments: number) => {
    const basePrice = 297
    if (installments <= 3) {
      return basePrice / installments
    } else {
      // Taxa de 2.5% por mês a partir da 4ª parcela
      const monthlyRate = 0.025
      const totalWithInterest = basePrice * (1 + (monthlyRate * (installments - 3)))
      return totalWithInterest / installments
    }
  }

  const getTotalPrice = (installments: number) => {
    const basePrice = 297
    if (installments <= 3) {
      return basePrice
    } else {
      const monthlyRate = 0.025
      return basePrice * (1 + (monthlyRate * (installments - 3)))
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.whatsapp
      case 2:
        return formData.cpf.replace(/\D/g, '').length === 11 && formData.terms && formData.contract
      default:
        return false
    }
  }

  const nextStep = () => {
    if (isStepValid() && currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isStepValid()) return

    setIsProcessing(true)

    try {
      const totalPrice = getTotalPrice(formData.installments)
      const response = await fetch('/api/payments/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.whatsapp,
            cpf: formData.cpf.replace(/\D/g, '')
          },
          items: [{
            id: 'consultoria-express',
            title: 'Consultoria Express - Visa2Any',
            description: `Consultoria personalizada - ${formData.installments}x de R$ ${calculateInstallmentPrice(formData.installments).toFixed(2)}`,
            unit_price: totalPrice,
            quantity: 1
          }],
          installments: formData.installments,
          external_reference: `consultoria-${Date.now()}`
        })
      })

      const data = await response.json()

      if (data.success && data.init_point) {
        // Salvar dados para após pagamento
        localStorage.setItem('checkout-data', JSON.stringify(formData))
        window.location.href = data.init_point
      } else {
        alert(`Erro: ${data.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header com barra de progresso */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V2A</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Checkout Visa2Any
              </h1>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Etapa {currentStep} de {steps.length}
            </div>
          </div>
          
          {/* Barra de progresso horizontal */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Indicadores de etapas */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.id <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-sm font-semibold ${
                    step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layout principal com sidebar à direita */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Formulário principal - lado esquerdo */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              
              {/* Conteúdo das etapas */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Seus Dados Pessoais</h2>
                    <p className="text-gray-600">Preencha suas informações básicas para continuarmos</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.whatsapp}
                        onChange={(e) => updateFormData('whatsapp', formatPhone(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Pedido</h2>
                    <p className="text-gray-600">CPF para contrato e aceite dos termos de serviço</p>
                  </div>

                  <div className="space-y-6">
                    {/* CPF */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => updateFormData('cpf', formatCPF(e.target.value))}
                        maxLength={14}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        Usado apenas para contrato e nota fiscal
                      </p>
                    </div>

                    {/* Resumo compacto */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Nome:</span>
                          <div className="font-medium text-gray-900 truncate">{formData.name || 'Não informado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <div className="font-medium text-gray-900 truncate">{formData.email || 'Não informado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">WhatsApp:</span>
                          <div className="font-medium text-gray-900">{formData.whatsapp || 'Não informado'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Serviço:</span>
                          <div className="font-medium text-gray-900">Consultoria Express</div>
                        </div>
                      </div>
                    </div>

                    {/* Termos */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) => updateFormData('terms', e.target.checked)}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <span className="text-gray-800 font-medium">
                              Li e aceito os{' '}
                              <span className="text-blue-600 underline font-semibold">termos de serviço</span>
                              {' '}e autorizo contato via WhatsApp e email
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.contract}
                            onChange={(e) => updateFormData('contract', e.target.checked)}
                            className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <div className="text-sm">
                            <span className="text-gray-800 font-medium">
                              Aceito o{' '}
                              <span className="text-green-600 underline font-semibold">contrato de prestação de serviços</span>
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              CPF: {formData.cpf || 'Não informado'}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        FINALIZAR COMPRA
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Resumo do pedido - lado direito */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6 lg:sticky lg:top-32 lg:h-fit">
            
            {/* Card do produto */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Consultoria Express</h3>
                <p className="text-gray-600 text-sm mt-1">Processo de visto personalizado</p>
              </div>
              
              {/* Preço com parcelamento */}
              <div className="border-t pt-4 space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    R$ {getTotalPrice(formData.installments).toFixed(2)}
                  </div>
                  {formData.installments > 1 && (
                    <div className="text-sm text-gray-600">
                      {formData.installments}x de R$ {calculateInstallmentPrice(formData.installments).toFixed(2)}
                      {formData.installments > 3 && (
                        <span className="text-orange-600 font-medium"> (com juros)</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Seletor de parcelas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parcelas:
                  </label>
                  <select
                    value={formData.installments}
                    onChange={(e) => updateFormData('installments', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value={1}>1x de R$ 297,00 (à vista)</option>
                    <option value={2}>2x de R$ 148,50 (sem juros)</option>
                    <option value={3}>3x de R$ 99,00 (sem juros)</option>
                    <option value={4}>4x de R$ 76,31 (com juros)</option>
                    <option value={5}>5x de R$ 62,23 (com juros)</option>
                    <option value={6}>6x de R$ 52,71 (com juros)</option>
                    <option value={12}>12x de R$ 28,34 (com juros)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Garantias</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">100% Seguro</div>
                    <div className="text-xs text-gray-500">SSL e criptografia</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">4.9/5 estrelas</div>
                    <div className="text-xs text-gray-500">+2.847 avaliações</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">8.420+ clientes</div>
                    <div className="text-xs text-gray-500">Vistos aprovados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}