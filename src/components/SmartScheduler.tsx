'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, MapPin, Phone, Video, Star, CheckCircle, ArrowRight } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
  specialist?: string
  type: 'premium' | 'standard'
}

interface Specialist {
  id: string
  name: string
  specialty: string
  rating: number
  experience: string
  photo: string
  languages: string[]
  nextAvailable: string
}

interface AppointmentData {
  date: string
  time: string
  specialist: string
  type: 'video' | 'phone' | 'presencial'
  service: string
  clientInfo: {
    name: string
    email: string
    phone: string
    country: string
    visaType: string
  }
  clientId?: string // ID do cliente se já tiver conta
}

export default function SmartScheduler() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSpecialist, setSelectedSpecialist] = useState('')
  const [appointmentType, setAppointmentType] = useState<'video' | 'phone' | 'presencial'>('video')
  const [appointmentData, setAppointmentData] = useState<Partial<AppointmentData>>({})
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const specialists: Specialist[] = [
    {
      id: 'ana-silva',
      name: 'Ana Silva',
      specialty: 'Especialista em Vistos EUA/Canadá',
      rating: 4.9,
      experience: '8 anos',
      photo: '👩‍💼',
      languages: ['Português', 'Inglês'],
      nextAvailable: 'Hoje às 14:30'
    },
    {
      id: 'carlos-mendes',
      name: 'Carlos Mendes',
      specialty: 'Imigração Europa/Austrália',
      rating: 4.8,
      experience: '12 anos',
      photo: '👨‍💼',
      languages: ['Português', 'Inglês', 'Francês'],
      nextAvailable: 'Amanhã às 09:00'
    },
    {
      id: 'lucia-santos',
      name: 'Lúcia Santos',
      specialty: 'Vistos de Investimento',
      rating: 5.0,
      experience: '15 anos',
      photo: '👩‍💼',
      languages: ['Português', 'Inglês', 'Espanhol'],
      nextAvailable: 'Hoje às 16:00'
    }
  ]

  const services = [
    'Pré-Análise IA Gratuita (15min) - Imediata',
    'Relatório Premium (R$ 97) - Imediato',
    'Consultoria Express (R$ 297) - 60min',
    'Assessoria VIP (R$ 1.997+) - Completa',
    'Preparação de Documentos',
    'Acompanhamento de Processo'
  ]

  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isPremium = hour >= 14 && hour <= 16
        const isAvailable = Math.random() > 0.3 // 70% chance of being available,        
        slots.push({
          time,
          available: isAvailable,
          specialist: isAvailable ? specialists[Math.floor(Math.random() * specialists.length)].name : undefined,
          type: isPremium ? 'premium' : 'standard'
        })
      }
    }
    
    return slots
  }

  const getNext7Days = () => {
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' })
      const dayNumber = date.getDate()
      const month = date.toLocaleDateString('pt-BR', { month: 'short' })
      const fullDate = date.toISOString().split('T')[0]
      
      days.push({
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber,
        month,
        fullDate,
        isToday: i === 0,
        isTomorrow: i === 1
      })
    }
    
    return days
  }

  useEffect(() => {
    if (selectedDate) {
      setLoading(true)
      setTimeout(() => {
        setAvailableSlots(generateTimeSlots(selectedDate))
        setLoading(false)
      }, 500)
    }
  }, [selectedDate])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    setAppointmentData(prev => ({ ...prev, date }))
  }

  const handleTimeSelect = (time: string, specialist: string) => {
    setSelectedTime(time)
    setSelectedSpecialist(specialist)
    setAppointmentData(prev => ({ ...prev, time, specialist }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleConfirmAppointment = async () => {
    if (!appointmentData.clientInfo?.name || !appointmentData.clientInfo?.email) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    
    try {
      // 1. Criar conta do cliente automaticamente (integração unificada)
      const accountData = {
        name: appointmentData.clientInfo.name,
        email: appointmentData.clientInfo.email,
        phone: appointmentData.clientInfo.phone,
        country: appointmentData.clientInfo.country,
        targetCountry: appointmentData.clientInfo.country,
        nationality: 'Brasileira', // Padrão - pode ser modificado depois,        source: 'smart_scheduler',
        product: `Agendamento: ${appointmentData.service}`,
        amount: 0
      }

      const accountResponse = await fetch('/api/auth/unified/auto-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      })

      const accountResult = await accountResponse.json()

      if (!accountResult.success) {
        throw new Error(accountResult.error || 'Erro ao criar conta do cliente')
      }

      const clientData = { id: accountResult.user.id }

      // 2. Criar agendamento

      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
      
      const consultationResponse = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientData.id,
          type: 'HUMAN_CONSULTATION',
          scheduledAt: scheduledDateTime.toISOString(),
          notes: `Agendado via Smart Scheduler
Serviço: ${appointmentData.service}
Tipo: ${appointmentType}
Especialista: ${selectedSpecialist}`
        })
      })

      if (!consultationResponse.ok) {
        throw new Error('Erro ao criar agendamento')
      }

      const consultationResult = await consultationResponse.json()

      // 3. Mostrar confirmação com opção de acessar portal

      const confirmationMessage = `✅ Agendamento confirmado!

📅 Data: ${formatDate(selectedDate)}
🕐 Horário: ${selectedTime}
👨‍💼 Especialista: ${selectedSpecialist}
📧 Confirmação enviada para: ${appointmentData.clientInfo.email}

🎉 CONTA CRIADA AUTOMATICAMENTE!
👤 Você pode acompanhar tudo no seu portal pessoal.`

      if (confirm(`${confirmationMessage}

Deseja acessar seu portal agora?`)) {
        window.location.href = '/cliente'
      } else {
        alert('📧 Você receberá um email com todos os detalhes e o link da reunião.')
      }

      // 4. Reset form

      setCurrentStep(1)
      setSelectedDate('')
      setSelectedTime('')
      setSelectedSpecialist('')
      setAppointmentData({})

    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error)
      alert('❌ Erro ao confirmar agendamento. Tente novamente ou entre em contato conosco.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  // Step 1: Service Selection

  if (currentStep === 1) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Que tipo de consultoria você precisa?
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o serviço mais adequado para sua situação
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {services.map((service, index) => (
            <button
              key={service}
              onClick={() => {
                setAppointmentData(prev => ({ ...prev, service }))
                nextStep()
              }}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{service}</h3>
                  {(index === 0 || index === 1) && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      GRATUITA
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {index === 0 && '🤖 IA Sofia analisa seu perfil em 30min e gera relatório completo'}
                {index === 1 && '👨‍💼 Consultoria com especialista humano para casos complexos'}
                {index === 2 && '📊 Análise detalhada de elegibilidade com score personalizado'}
                {index === 3 && '📄 Preparação profissional de documentos'}
                {index === 4 && '✅ Revisão detalhada antes do envio'}
                {index === 5 && '📱 Acompanhamento até a aprovação'}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Step 2: Specialist Selection

  if (currentStep === 2) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu Especialista
          </h2>
          <p className="text-xl text-gray-600">
            Nossa equipe de especialistas está pronta para te atender
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedSpecialist === specialist.name
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedSpecialist(specialist.name)
                setAppointmentData(prev => ({ ...prev, specialist: specialist.name }))
              }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{specialist.photo}</div>
                <h3 className="font-semibold text-gray-900">{specialist.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{specialist.specialty}</p>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{specialist.rating}</span>
                  <span className="ml-1 text-xs text-gray-500">({specialist.experience})</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  🗣️ {specialist.languages.join(', ')}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  📅 {specialist.nextAvailable}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={prevStep} variant="outline">
            Voltar
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!selectedSpecialist}
            className="btn-gradient"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Date & Time Selection

  if (currentStep === 3) {
    const availableDays = getNext7Days()

    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quando você prefere?
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o melhor horário para sua consultoria
          </p>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escolha o dia:</h3>
          <div className="grid grid-cols-7 gap-3">
            {availableDays.map((day) => (
              <button
                key={day.fullDate}
                onClick={() => handleDateSelect(day.fullDate)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDate === day.fullDate
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
                  <div className="text-lg font-bold text-gray-900">{day.dayNumber}</div>
                  <div className="text-xs text-gray-500">{day.month}</div>
                  {day.isToday && (
                    <div className="text-xs text-blue-600 font-medium mt-1">Hoje</div>
                  )}
                  {day.isTomorrow && (
                    <div className="text-xs text-green-600 font-medium mt-1">Amanhã</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Horários disponíveis para {formatDate(selectedDate)}:
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Carregando horários...</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time, slot.specialist!)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTime === slot.time
                        ? 'border-blue-600 bg-blue-50'
                        : slot.available
                        ? 'border-gray-200 hover:border-gray-300 bg-white'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-sm font-medium">{slot.time}</div>
                    {slot.available && slot.type === 'premium' && (
                      <div className="text-xs text-yellow-600">⭐ Premium</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meeting Type */}
        {selectedTime && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Como prefere a reunião?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { type: 'video' as const, icon: Video, title: 'Videochamada', desc: 'Google Meet ou Zoom' },
                { type: 'phone' as const, icon: Phone, title: 'Telefone', desc: 'Ligação tradicional' }
              ].map(({ type, icon: Icon, title, desc }) => (
                <button
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    appointmentType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-gray-900">{title}</div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button onClick={prevStep} variant="outline">
            Voltar
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!selectedTime}
            className="btn-gradient"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Step 4: Client Information & Confirmation

  if (currentStep === 4) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quase pronto! Confirme seus dados
          </h2>
          <p className="text-xl text-gray-600">
            Vamos finalizar seu agendamento
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus dados:</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAppointmentData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo!, name: e.target.value }
                }))}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAppointmentData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo!, email: e.target.value }
                }))}
              />
              <input
                type="tel"
                placeholder="WhatsApp / Telefone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAppointmentData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo!, phone: e.target.value }
                }))}
              />
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAppointmentData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo!, country: e.target.value }
                }))}
              >
                <option value="">País de interesse</option>
                <option value="usa">Estados Unidos</option>
                <option value="canada">Canadá</option>
                <option value="australia">Austrália</option>
                <option value="uk">Reino Unido</option>
                <option value="europe">Europa</option>
                <option value="other">Outro</option>
              </select>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAppointmentData(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo!, visaType: e.target.value }
                }))}
              >
                <option value="">Tipo de visto</option>
                <option value="tourism">Turismo</option>
                <option value="work">Trabalho</option>
                <option value="study">Estudo</option>
                <option value="investment">Investimento</option>
                <option value="family">Reunificação familiar</option>
              </select>
            </div>
          </div>

          {/* Appointment Summary */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do agendamento:</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">{formatDate(selectedDate)}</div>
                  <div className="text-sm text-gray-600">às {selectedTime}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">{selectedSpecialist}</div>
                  <div className="text-sm text-gray-600">Especialista</div>
                </div>
              </div>

              <div className="flex items-center">
                {appointmentType === 'video' && <Video className="w-5 h-5 text-blue-600 mr-3" />}
                {appointmentType === 'phone' && <Phone className="w-5 h-5 text-blue-600 mr-3" />}
                {appointmentType === 'presencial' && <MapPin className="w-5 h-5 text-blue-600 mr-3" />}
                <div>
                  <div className="font-medium">
                    {appointmentType === 'video' && 'Videochamada'}
                    {appointmentType === 'phone' && 'Ligação'}
                    {appointmentType === 'presencial' && 'Presencial'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointmentType === 'video' && 'Link será enviado por email'}
                    {appointmentType === 'phone' && 'Ligaremos para você'}
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 mt-4">
                <div className="text-lg font-bold text-green-600">
                  CONSULTORIA GRATUITA
                </div>
                <div className="text-sm text-gray-600">
                  Análise completa sem custo
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline">
            Voltar
          </Button>
          <Button 
            className="btn-gradient"
            onClick={handleConfirmAppointment}
            disabled={!appointmentData.clientInfo?.name || !appointmentData.clientInfo?.email || loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return null
}