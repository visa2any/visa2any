// Sistema de Banco de Dados de Exames Médicos
// Clínicas aprovadas e agendamento de exames por país

interface MedicalClinic {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  website: string
  approvedFor: string[] // países que aprovam esta clínica,  services: string[] // tipos de exames oferecidos
  languages: string[]
  rating: number
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }
  availableSlots: string[]
  estimatedCost: {
    basic: number
    complete: number
    rush: number
  }
  requirements: string[]
  processingTime: string
  notes: string
}

interface MedicalExam {
  id: string
  name: string
  description: string
  requiredFor: string[] // países que exigem este exame,  ageRestrictions?: {
    min?: number
    max?: number
  }
  validity: number // validade em meses,  components: string[] // componentes do exame
  preparation: string[] // preparação necessária,  cost: number
  duration: string // tempo de duração do exame
}

interface ExamBooking {
  bookingId: string
  applicantId: string
  clinicId: string
  examTypes: string[]
  appointmentDate: string
  appointmentTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  totalCost: number
  notes?: string
  results?: {
    available: boolean
    resultDate?: string
    certificateNumber?: string
    validUntil?: string
  }
}

class MedicalExamService {
  private readonly approvedClinics: MedicalClinic[] = [
    // BRASIL - Clínicas para EUA,    {
      id: 'usa-brazil-hcor',
      name: 'Hospital do Coração (HCor)',
      address: 'Rua Desembargador Eliseu Guilherme, 147',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      phone: '+55 11 3053-6611',
      email: 'exames.internacionais@hcor.com.br',
      website: 'https://www.hcor.com.br',
    approvedFor: ['usa'],
      services: ['medical_exam_usa', 'vaccination', 'chest_xray', 'blood_tests'],
      languages: ['portuguese', 'english'],
      rating: 4.8,
      operatingHours: {
        monday: { open: '07:00', close: '17:00' },
        tuesday: { open: '07:00', close: '17:00' },
        wednesday: { open: '07:00', close: '17:00' },
        thursday: { open: '07:00', close: '17:00' },
        friday: { open: '07:00', close: '17:00' },
        saturday: { open: '08:00', close: '12:00' },
        sunday: { closed: true }
      },
      availableSlots: [],
      estimatedCost: {
        basic: 450,
        complete: 650,
        rush: 850
      },
      requirements: [
        'Documento de identidade com foto',
        'Passaporte',
        'Histórico de vacinação',
        'Exames médicos anteriores (se houver)'
      ],
      processingTime: '2-3 dias úteis',
      notes: 'Clínica credenciada pelo Consulado Americano. Agendamento obrigatório.'
    },
    {
      id: 'usa-brazil-fleury',
      name: 'Grupo Fleury',
      address: 'Av. General Waldomiro de Lima, 508',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      phone: '+55 11 5014-7700',
      email: 'atendimento@fleury.com.br',
      website: 'https://www.fleury.com.br',
    approvedFor: ['usa'],
      services: ['medical_exam_usa', 'vaccination', 'chest_xray', 'blood_tests'],
      languages: ['portuguese', 'english'],
      rating: 4.7,
      operatingHours: {
        monday: { open: '06:00', close: '18:00' },
        tuesday: { open: '06:00', close: '18:00' },
        wednesday: { open: '06:00', close: '18:00' },
        thursday: { open: '06:00', close: '18:00' },
        friday: { open: '06:00', close: '18:00' },
        saturday: { open: '07:00', close: '14:00' },
        sunday: { closed: true }
      },
      availableSlots: [],
      estimatedCost: {
        basic: 420,
        complete: 620,
        rush: 820
      },
      requirements: [
        'RG e CPF',
        'Passaporte',
        'Carteira de vacinação',
        'Exames médicos recentes'
      ],
      processingTime: '2-4 dias úteis',
      notes: 'Várias unidades em SP. Aceita diversos planos de saúde para parte dos exames.'
    },
    
    // BRASIL - Clínicas para Canadá,    {
      id: 'canada-brazil-dasa',
      name: 'DASA (Diagnósticos da América)',
      address: 'Av. Brigadeiro Luís Antônio, 4315',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      phone: '+55 11 4020-6464',
      email: 'central.atendimento@dasa.com.br',
      website: 'https://www.dasa.com.br',
    approvedFor: ['canada'],
      services: ['medical_exam_canada', 'chest_xray', 'blood_tests', 'urine_tests'],
      languages: ['portuguese', 'english', 'french'],
      rating: 4.6,
      operatingHours: {
        monday: { open: '06:30', close: '17:30' },
        tuesday: { open: '06:30', close: '17:30' },
        wednesday: { open: '06:30', close: '17:30' },
        thursday: { open: '06:30', close: '17:30' },
        friday: { open: '06:30', close: '17:30' },
        saturday: { open: '07:00', close: '12:00' },
        sunday: { closed: true }
      },
      availableSlots: [],
      estimatedCost: {
        basic: 380,
        complete: 580,
        rush: 750
      },
      requirements: [
        'Documento com foto',
        'Histórico médico',
        'Resultados de exames anteriores'
      ],
      processingTime: '3-5 dias úteis',
      notes: 'Médico credenciado pelo governo canadense. Envio direto dos resultados para IRCC.'
    },

    // CLÍNICAS INTERNACIONAIS,    {
      id: 'usa-global-iom',
      name: 'International Organization for Migration (IOM)',
      address: 'Varies by location',
      city: 'Global',
      state: 'Multiple',
      country: 'Global',
      phone: '+1-202-862-1826',
      email: 'health@iom.int',
      website: 'https://www.iom.int/health-assessments',
    approvedFor: ['usa', 'canada', 'australia', 'uk'],
      services: ['refugee_medical', 'immigration_medical', 'vaccination', 'mental_health'],
      languages: ['english', 'spanish', 'french', 'arabic', 'portuguese'],
      rating: 4.9,
      operatingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { closed: true },
        sunday: { closed: true }
      },
      availableSlots: [],
      estimatedCost: {
        basic: 300,
        complete: 500,
        rush: 700
      },
      requirements: [
        'Valid passport',
        'Visa application documentation',
        'Previous medical records'
      ],
      processingTime: '5-10 business days',
      notes: 'Official IOM health assessments for immigration. Available worldwide.'
    }
  ]

  private readonly examTypes: MedicalExam[] = [
    {
      id: 'usa_medical_exam',
      name: 'Exame Médico para Visto Americano',
      description: 'Exame médico completo exigido para vistos de imigração dos EUA',
      requiredFor: ['usa'],
      ageRestrictions: { min: 0 },
      validity: 12,
      components: [
        'Exame físico completo',
        'Histórico médico',
        'Vacinação obrigatória',
        'Exames de sangue',
        'Raio-X do tórax',
        'Teste de tuberculose',
        'Teste de sífilis'
      ],
      preparation: [
        'Jejum de 8 horas para exames de sangue',
        'Trazer carteira de vacinação',
        'Trazer exames médicos anteriores',
        'Não usar joias durante raio-X'
      ],
      cost: 650,
      duration: '2-3 horas'
    },
    {
      id: 'canada_medical_exam',
      name: 'Exame Médico para Imigração Canadense',
      description: 'Exame médico para aplicações de imigração e visto do Canadá',
      requiredFor: ['canada'],
      ageRestrictions: { min: 0 },
      validity: 12,
      components: [
        'Exame físico',
        'Histórico médico e familiar',
        'Raio-X do tórax',
        'Exames de sangue',
        'Exames de urina',
        'Avaliação mental (se necessário)'
      ],
      preparation: [
        'Jejum de 8-12 horas',
        'Trazer identificação válida',
        'Histórico de vacinação',
        'Lista de medicamentos atuais'
      ],
      cost: 580,
      duration: '2-4 horas'
    },
    {
      id: 'australia_medical_exam',
      name: 'Health Examination for Australian Visa',
      description: 'Medical examination required for Australian visa applications',
      requiredFor: ['australia'],
      ageRestrictions: { min: 0 },
      validity: 12,
      components: [
        'Physical examination',
        'Chest X-ray',
        'HIV test',
        'Hepatitis B and C tests',
        'TB screening'
      ],
      preparation: [
        'Fast for 8 hours before blood tests',
        'Bring valid passport',
        'Bring previous medical records',
        'Remove metal objects for X-ray'
      ],
      cost: 450,
      duration: '1.5-2 hours'
    },
    {
      id: 'uk_tb_test',
      name: 'UK Tuberculosis Test',
      description: 'TB screening required for UK visa applications from certain countries',
      requiredFor: ['uk'],
      ageRestrictions: { min: 11 },
      validity: 6,
      components: [
        'Chest X-ray',
        'Sputum test (if required)',
        'Medical questionnaire'
      ],
      preparation: [
        'Bring passport',
        'Wear clothing easy to remove for X-ray',
        'Avoid pregnancy if possible'
      ],
      cost: 180,
      duration: '30-60 minutes'
    }
  ]

  // Buscar clínicas por país e cidade

  async getApprovedClinics(country: string, city?: string, state?: string): Promise<MedicalClinic[]> {
    let clinics = this.approvedClinics.filter(clinic => 
      clinic.approvedFor.includes(country.toLowerCase())
    )

    if (city) {
      clinics = clinics.filter(clinic => 
        clinic.city.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (state) {
      clinics = clinics.filter(clinic => 
        clinic.state.toLowerCase().includes(state.toLowerCase())
      )
    }

    // Simular disponibilidade de horários

    for (const clinic of clinics) {
      clinic.availableSlots = await this.generateAvailableSlots(clinic.id)
    }

    return clinics.sort((a, b) => b.rating - a.rating)
  }

  // Buscar tipos de exame por país

  getRequiredExams(country: string): MedicalExam[] {
    return this.examTypes.filter(exam => 
      exam.requiredFor.includes(country.toLowerCase())
    )
  }

  // Agendar exame médico

  async bookMedicalExam(booking: Omit<ExamBooking, 'bookingId' | 'status'>): Promise<{
    success: boolean
    bookingId?: string
    confirmationCode?: string
    instructions?: string
    error?: string
  }> {
    try {
      const clinic = this.approvedClinics.find(c => c.id === booking.clinicId)
      if (!clinic) {
      }

      // Verificar se a data está disponível

      const isAvailable = await this.checkSlotAvailability(
        booking.clinicId, 
        booking.appointmentDate, 
        booking.appointmentTime
      )

      if (!isAvailable) {
      }

      // Gerar ID do agendamento

      const bookingId = `MED-${Date.now()}-${booking.applicantId}`
      const confirmationCode = this.generateConfirmationCode()

      // Simular agendamento

      await this.delay(1000)

      const instructions = this.generateBookingInstructions(clinic, booking.examTypes)

      return {
        bookingId,
        confirmationCode,
        instructions
      }

    } catch (error) {
      console.error('Erro ao agendar exame:', error)
    }
  }

  // Verificar status do exame

  async getExamStatus(bookingId: string): Promise<{
    success: boolean
    booking?: ExamBooking
    error?: string
  }> {
    try {
      // Simular busca no banco
      await this.delay(500)

      // Mock data

      const mockBooking: ExamBooking = {
        bookingId,
        applicantId: 'user123',
        clinicId: 'usa-brazil-hcor',
        examTypes: ['usa_medical_exam'],
        appointmentDate: '2024-02-15',
        appointmentTime: '09:00',
        status: 'completed',
        totalCost: 650,
        results: {
          available: true,
          resultDate: '2024-02-17',
          certificateNumber: 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          validUntil: '2025-02-17'
        }
      }


    } catch (error) {
    }
  }

  // Cancelar exame

  async cancelExam(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.delay(800)
      return { 
        message: 'Exame cancelado com sucesso. Reembolso será processado em 5-7 dias úteis.' 
      }
    } catch (error) {
    }
  }

  // Reagendar exame

  async rescheduleExam(
    bookingId: string, 
    newDate: string, 
    newTime: string
  ): Promise<{ success: boolean; confirmationCode?: string; message: string }> {
    try {
      await this.delay(1000)
      const newConfirmationCode = this.generateConfirmationCode()
      
      return { 
        confirmationCode: newConfirmationCode,
        message: 'Exame reagendado com sucesso'
      }
    } catch (error) {
    }
  }

  // Métodos privados

  private async generateAvailableSlots(clinicId: string): Promise<string[]> {
    const slots: string[] = []
    const today = new Date()
    
    // Gerar slots para os próximos 30 dias
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Pular fins de semana para a maioria das clínicas
      
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      const dateStr = date.toISOString().split('T')[0]
      const times = ['08:00', '09:30', '11:00', '14:00', '15:30']
      
      times.forEach(time => {
        // Simular 70% de disponibilidade
        if (Math.random() > 0.3) {
          slots.push(`${dateStr}T${time}`)
        }
      })
    }
    
    return slots.slice(0, 20) // Retornar até 20 slots  }

  private async checkSlotAvailability(
    clinicId: string, 
    date: string, 
    time: string
  ): Promise<boolean> {
    await this.delay(300)
    return Math.random() > 0.2 // 80% de chance de estar disponível  }

  private generateConfirmationCode(): string {
    return 'MED' + Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  private generateBookingInstructions(clinic: MedicalClinic, examTypes: string[]): string {
    const exams = examTypes.map(type => this.examTypes.find(e => e.id === type)).filter(Boolean)
    
    return `
INSTRUÇÕES PARA EXAME MÉDICO

Local: ${clinic.name}
Endereço: ${clinic.address}, ${clinic.city}, ${clinic.state}
Telefone: ${clinic.phone}

PREPARAÇÃO:
${exams.flatMap(exam => exam!.preparation).map(prep => `• ${prep}`).join('\n')}

DOCUMENTOS NECESSÁRIOS:
${clinic.requirements.map(req => `• ${req}`).join('\n')}

OBSERVAÇÕES:
• Chegue 30 minutos antes do horário agendado
• Traga documento de identidade válido
• ${clinic.notes}

Tempo estimado: ${exams[0]?.duration || '2-3 horas'}
Custo total: R$ ${clinic.estimatedCost.complete}
    `.trim()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const medicalExamService = new MedicalExamService()

// Types export
export type { MedicalClinic, MedicalExam, ExamBooking }