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
  approvedFor: string[] // países que aprovam esta clínica
  services: string[] // tipos de exames oferecidos
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
  requiredFor: string[] // países que exigem este exame
  ageRestrictions?: {
    min?: number
    max?: number
  }
  validity: number // validade em meses
  components: string[] // componentes do exame
  preparation: string[] // preparação necessária
  cost: number
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
    // BRASIL - Clínicas para EUA
    {
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
        sunday: { open: '', close: '', closed: true }
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
        sunday: { open: '', close: '', closed: true }
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
    
    // BRASIL - Clínicas para Canadá
    {
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
        sunday: { open: '', close: '', closed: true }
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

    // CLÍNICAS INTERNACIONAIS
    {
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
        saturday: { open: '', close: '', closed: true },
        sunday: { open: '', close: '', closed: true }
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
      ageRestrictions: { min: 6 },
      validity: 12,
      components: [
        'Exame físico',
        'Histórico médico',
        'Raio-X do tórax (acima de 11 anos)',
        'Exames de sangue (HIV, sífilis)',
        'Exame de urina'
      ],
      preparation: [
        'Trazer passaporte e formulário IMM1017E',
        'Informar sobre condições médicas preexistentes'
      ],
      cost: 580,
      duration: '1-2 horas'
    },
    {
      id: 'australia_medical_exam',
      name: 'Exame Médico para Visto Australiano',
      description: 'Exame médico exigido para vários tipos de visto australiano',
      requiredFor: ['australia'],
      ageRestrictions: { min: 2 },
      validity: 12,
      components: [
        'Exame físico (501)',
        'Raio-X do tórax (502)',
        'Teste de HIV (707)',
        'Teste de Hepatite B/C (708)'
      ],
      preparation: [
        'Trazer passaporte',
        'Trazer HAP ID',
        'Não precisa de jejum'
      ],
      cost: 750,
      duration: '1.5 horas'
    }
  ]
  
  // MÉTODOS PÚBLICOS
  
  public getRequiredExamsForCountry(country: string): MedicalExam[] {
    return this.examTypes.filter(exam => exam.requiredFor.includes(country.toLowerCase()));
  }

  public findClinics(country: string, city?: string): MedicalClinic[] {
    let clinics = this.approvedClinics.filter(clinic => 
      clinic.country.toLowerCase() === country.toLowerCase()
    );

    if (city) {
      clinics = clinics.filter(clinic => clinic.city.toLowerCase() === city.toLowerCase());
    }
    
    return clinics;
  }

  public getClinicById(clinicId: string): MedicalClinic | undefined {
    return this.approvedClinics.find(c => c.id === clinicId);
  }

  public getExamById(examId: string): MedicalExam | undefined {
    return this.examTypes.find(e => e.id === examId);
  }

  public async bookExam(
    applicantId: string,
    clinicId: string,
    examIds: string[],
    preferredDate: string
  ): Promise<{ success: boolean; booking?: ExamBooking; error?: string }> {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) {
      return { success: false, error: 'Clínica não encontrada' };
    }
    
    // Simula busca por horários disponíveis
    const availableSlots = this.getAvailableSlotsForClinic(clinicId, preferredDate);
    if (availableSlots.length === 0) {
      return { success: false, error: 'Nenhum horário disponível na data solicitada' };
    }
    
    const appointmentTime = availableSlots[0]; // Pega o primeiro horário
    if (!appointmentTime) {
      return { success: false, error: 'Nenhum horário disponível na data solicitada' };
    }
    
    const totalCost = examIds.reduce((sum, currentId) => {
      const exam = this.getExamById(currentId);
      return sum + (exam?.cost || 0);
    }, 0);
    
    const newBooking: ExamBooking = {
      bookingId: `BKG-${Date.now()}`,
      applicantId,
      clinicId,
      examTypes: examIds,
      appointmentDate: preferredDate,
      appointmentTime,
      status: 'scheduled',
      totalCost,
      notes: 'Agendamento inicial',
      results: { available: false }
    };

    // Simulação de salvar no DB
    console.log('Salvando agendamento:', newBooking);
    
    return { success: true, booking: newBooking };
  }

  public getAvailableSlotsForClinic(clinicId: string, date: string): string[] {
    // Simulação de horários
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  }

  public async getExamStatus(bookingId: string): Promise<{ success: boolean; booking?: ExamBooking; error?: string }> {
    // Simulação: busca fictícia de agendamento
    // Em produção, buscaria no banco de dados
    if (!bookingId) {
      return { success: false, error: 'ID do agendamento não fornecido' };
    }
    // Exemplo de booking simulado
    const booking: ExamBooking = {
      bookingId,
      applicantId: 'applicant-123',
      clinicId: 'usa-brazil-hcor',
      examTypes: ['usa_medical_exam'],
      appointmentDate: '2024-07-01',
      appointmentTime: '10:00',
      status: 'scheduled',
      totalCost: 650,
      notes: 'Agendamento simulado',
      results: { available: false }
    };
    return { success: true, booking };
  }

  public async rescheduleExam(bookingId: string, newDate: string, newTime: string): Promise<{ success: boolean; confirmationCode?: string; message?: string; error?: string }> {
    // Simulação: reagendamento fictício
    if (!bookingId || !newDate || !newTime) {
      return { success: false, error: 'Dados insuficientes para reagendar' };
    }
    // Exemplo de confirmação
    return {
      success: true,
      confirmationCode: `CONFIRM-${bookingId}-${newDate.replace(/-/g, '')}${newTime.replace(':', '')}`,
      message: 'Exame reagendado com sucesso'
    };
  }

  public async cancelExam(bookingId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    // Simulação: cancelamento fictício
    if (!bookingId) {
      return { success: false, error: 'ID do agendamento não fornecido' };
    }
    return {
      success: true,
      message: 'Exame cancelado com sucesso'
    };
  }

  public async getApprovedClinics(country: string, city?: string, state?: string): Promise<MedicalClinic[]> {
    // Simulação: filtra clínicas aprovadas pelo país, cidade e estado
    let clinics = this.approvedClinics.filter(clinic => 
      clinic.country.toLowerCase() === country.toLowerCase()
    );
    if (city) {
      clinics = clinics.filter(clinic => clinic.city.toLowerCase() === city.toLowerCase());
    }
    if (state) {
      clinics = clinics.filter(clinic => clinic.state.toLowerCase() === state.toLowerCase());
    }
    return clinics;
  }

  public getRequiredExams(country: string): MedicalExam[] {
    return this.getRequiredExamsForCountry(country);
  }

  public async bookMedicalExam({
    applicantId,
    clinicId,
    examTypes,
    appointmentDate,
    appointmentTime,
    totalCost,
    notes
  }: {
    applicantId: string,
    clinicId: string,
    examTypes: string[],
    appointmentDate: string,
    appointmentTime: string,
    totalCost?: number,
    notes?: string
  }): Promise<{ success: boolean; bookingId?: string; confirmationCode?: string; instructions?: string; error?: string }> {
    // Simulação: agendamento fictício
    if (!applicantId || !clinicId || !examTypes || !appointmentDate || !appointmentTime) {
      return { success: false, error: 'Dados insuficientes para agendar' };
    }
    const bookingId = `BKG-${Date.now()}`;
    const confirmationCode = `CONFIRM-${bookingId}`;
    const instructions = 'Compareça à clínica com 15 minutos de antecedência e traga seus documentos.';
    return {
      success: true,
      bookingId,
      confirmationCode,
      instructions
    };
  }
}

export const medicalExamService = new MedicalExamService();

// Types export
export type { MedicalClinic, MedicalExam, ExamBooking }
