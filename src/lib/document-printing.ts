// Sistema de Impressão Automática de Documentos
// Gera pasta física organizada para consulados

import jsPDF from 'jspdf'

interface DocumentItem {
  id: string
  name: string
  type: 'passport' | 'photo' | 'bank_statement' | 'employment_letter' | 'birth_certificate' | 'marriage_certificate' | 'education_diploma' | 'medical_exam' | 'police_clearance' | 'other'
  category: string
  required: boolean
  priority: number
  filePath?: string
  notes?: string
  pageCount?: number
}

interface PrintPackage {
  applicantName: string
  consulate: string
  visaType: string
  appointmentDate: string
  confirmationCode: string
  documents: DocumentItem[]
  instructions: string[]
}

interface PrintOptions {
  includeCovers: boolean
  includeTabs: boolean
  includeChecklist: boolean
  includeInstructions: boolean
  bindingType: 'spiral' | 'folder' | 'clips'
  paperSize: 'A4' | 'Letter'
  printQuality: 'draft' | 'normal' | 'high'
}

class DocumentPrintingService {
  private readonly consulateRequirements = {
    usa: {
      categories: [
        { name: 'Documentos Pessoais', priority: 1, color: '#1e40af' },
        { name: 'Documentos Financeiros', priority: 2, color: '#059669' },
        { name: 'Documentos Profissionais', priority: 3, color: '#d97706' },
        { name: 'Documentos de Apoio', priority: 4, color: '#7c3aed' }
      ],
      specificOrder: [
        'passport', 'photo', 'birth_certificate', 'marriage_certificate',
        'bank_statement', 'employment_letter', 'education_diploma',
        'police_clearance', 'medical_exam', 'other'
      ]
    },
    canada: {
      categories: [
        { name: 'Identity Documents', priority: 1, color: '#dc2626' },
        { name: 'Financial Documents', priority: 2, color: '#059669' },
        { name: 'Supporting Documents', priority: 3, color: '#0891b2' }
      ]
    },
    europe: {
      categories: [
        { name: 'Documentos Obrigatórios', priority: 1, color: '#1d4ed8' },
        { name: 'Documentos Financeiros', priority: 2, color: '#059669' },
        { name: 'Documentos Complementares', priority: 3, color: '#7c3aed' }
      ]
    },
    australia: {
      categories: [
        { name: 'Personal Documents', priority: 1, color: '#059669' },
        { name: 'Financial Evidence', priority: 2, color: '#0891b2' },
        { name: 'Supporting Documents', priority: 3, color: '#7c3aed' }
      ]
    }
  }

  // Gerar pacote completo de documentos para impressão
  async generatePrintPackage(printPackage: PrintPackage, options: PrintOptions): Promise<{
    success: boolean
    packageId: string
    files: {
      coverPage: string
      checklist: string
      instructions: string
      tabLabels: string
      documents: string[]
    }
    printInstructions: string
    estimatedPages: number
    estimatedCost: number
  }> {
    try {
      console.log(`Gerando pacote de impressão para ${printPackage.applicantName}...`)

      // 1. Organizar documentos por categoria
      const organizedDocs = this.organizeDocumentsByCategory(printPackage)

      // 2. Gerar páginas especiais
      const coverPage = await this.generateCoverPage(printPackage, options)
      const checklist = await this.generateChecklist(organizedDocs, options)
      const instructions = await this.generateInstructions(printPackage, options)
      const tabLabels = await this.generateTabLabels(organizedDocs, options)

      // 3. Preparar documentos para impressão
      const documentFiles = await this.prepareDocumentsForPrint(organizedDocs, options)

      // 4. Calcular estimativas
      const estimatedPages = this.calculateTotalPages(organizedDocs, options)
      const estimatedCost = this.calculatePrintingCost(estimatedPages, options)

      // 5. Gerar instruções de impressão
      const printInstructions = this.generatePrintInstructions(printPackage, options)

      const packageId = `PRINT-${Date.now()}-${printPackage.applicantName.replace(/\s+/g, '-')}`

      return {
        success: true,
        packageId,
        files: {
          coverPage,
          checklist,
          instructions,
          tabLabels,
          documents: documentFiles
        },
        printInstructions,
        estimatedPages,
        estimatedCost
      }

    } catch (error) {
      console.error('Erro ao gerar pacote de impressão:', error)
      return {
        success: false,
        packageId: '',
        files: { coverPage: '', checklist: '', instructions: '', tabLabels: '', documents: [] },
        printInstructions: '',
        estimatedPages: 0,
        estimatedCost: 0
      }
    }
  }

  // Gerar página de capa profissional
  private async generateCoverPage(printPackage: PrintPackage, options: PrintOptions): Promise<string> {
    const doc = new jsPDF(options.paperSize === 'A4' ? 'a4' : 'letter')
    
    // Header com logo
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('VISA2ANY', 105, 30, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text('Documentos para Aplicação de Visto', 105, 45, { align: 'center' })

    // Linha separadora
    doc.setLineWidth(0.5)
    doc.line(20, 55, 190, 55)

    // Informações do requerente
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMAÇÕES DO REQUERENTE', 20, 75)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(`Nome: ${printPackage.applicantName}`, 20, 90)
    doc.text(`Destino: ${this.getCountryName(printPackage.consulate)}`, 20, 105)
    doc.text(`Tipo de Visto: ${printPackage.visaType}`, 20, 120)
    doc.text(`Data do Agendamento: ${this.formatDate(printPackage.appointmentDate)}`, 20, 135)
    doc.text(`Código de Confirmação: ${printPackage.confirmationCode}`, 20, 150)

    // Status dos documentos
    doc.setFont('helvetica', 'bold')
    doc.text('STATUS DOS DOCUMENTOS', 20, 175)
    
    const totalDocs = printPackage.documents.length
    const requiredDocs = printPackage.documents.filter(d => d.required).length
    const completeDocs = printPackage.documents.filter(d => d.filePath).length
    
    doc.setFont('helvetica', 'normal')
    doc.text(`Total de Documentos: ${totalDocs}`, 20, 190)
    doc.text(`Documentos Obrigatórios: ${requiredDocs}`, 20, 205)
    doc.text(`Documentos Incluídos: ${completeDocs}`, 20, 220)

    // Instruções importantes
    doc.setFillColor(255, 243, 224) // Cor de fundo laranja clara
    doc.rect(20, 240, 170, 40, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('INSTRUÇÕES IMPORTANTES:', 25, 250)
    doc.setFont('helvetica', 'normal')
    doc.text('• Confira se todos os documentos estão incluídos antes da entrevista', 25, 260)
    doc.text('• Leve os documentos originais para verificação', 25, 270)

    // Rodapé
    doc.setFontSize(8)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 290)
    doc.text('www.visa2any.com | suporte@visa2any.com', 105, 290, { align: 'center' })

    return doc.output('datauristring')
  }

  // Gerar checklist detalhado
  private async generateChecklist(organizedDocs: any, options: PrintOptions): Promise<string> {
    const doc = new jsPDF(options.paperSize === 'A4' ? 'a4' : 'letter')
    
    // Cabeçalho
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('CHECKLIST DE DOCUMENTOS', 105, 30, { align: 'center' })

    let yPos = 50

    // Gerar checklist por categoria
    for (const category of organizedDocs.categories) {
      // Título da categoria
      doc.setFillColor(category.color)
      doc.rect(20, yPos - 5, 170, 10, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(category.name, 25, yPos)
      
      yPos += 15
      doc.setTextColor(0, 0, 0)

      // Documentos da categoria
      for (const doc_item of category.documents) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        
        // Checkbox
        doc.rect(25, yPos - 3, 3, 3)
        if (doc_item.filePath) {
          doc.text('✓', 26, yPos)
        }

        // Nome do documento
        doc.text(doc_item.name, 35, yPos)
        
        // Status
        const status = doc_item.filePath ? 'INCLUÍDO' : (doc_item.required ? 'OBRIGATÓRIO' : 'OPCIONAL')
        const statusColor = doc_item.filePath ? [0, 128, 0] : (doc_item.required ? [255, 0, 0] : [128, 128, 128])
        
        doc.setTextColor(...statusColor)
        doc.text(status, 150, yPos)
        doc.setTextColor(0, 0, 0)

        yPos += 12

        // Nova página se necessário
        if (yPos > 270) {
          doc.addPage()
          yPos = 30
        }
      }

      yPos += 10
    }

    return doc.output('datauristring')
  }

  // Gerar instruções específicas do consulado
  private async generateInstructions(printPackage: PrintPackage, options: PrintOptions): Promise<string> {
    const doc = new jsPDF(options.paperSize === 'A4' ? 'a4' : 'letter')
    
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('INSTRUÇÕES PARA O CONSULADO', 105, 30, { align: 'center' })

    let yPos = 50

    // Instruções gerais
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INSTRUÇÕES GERAIS', 20, yPos)
    yPos += 15

    const generalInstructions = [
      'Chegue 30 minutos antes do horário agendado',
      'Traga todos os documentos originais para verificação',
      'Organize os documentos conforme as abas fornecidas',
      'Não use telefone celular dentro do consulado',
      'Seja honesto e direto nas respostas durante a entrevista'
    ]

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    for (let i = 0; i < generalInstructions.length; i++) {
      doc.text(`${i + 1}. ${generalInstructions[i]}`, 20, yPos)
      yPos += 12
    }

    yPos += 10

    // Instruções específicas por consulado
    const specificInstructions = this.getConsulateSpecificInstructions(printPackage.consulate)
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`INSTRUÇÕES ESPECÍFICAS - ${this.getCountryName(printPackage.consulate).toUpperCase()}`, 20, yPos)
    yPos += 15

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    for (let i = 0; i < specificInstructions.length; i++) {
      doc.text(`• ${specificInstructions[i]}`, 20, yPos)
      yPos += 12
      
      if (yPos > 270) {
        doc.addPage()
        yPos = 30
      }
    }

    return doc.output('datauristring')
  }

  // Gerar etiquetas para abas separadoras
  private async generateTabLabels(organizedDocs: any, options: PrintOptions): Promise<string> {
    const doc = new jsPDF('landscape', 'mm', options.paperSize === 'A4' ? 'a4' : 'letter')
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('ETIQUETAS PARA SEPARADORES', 148, 20, { align: 'center' })

    let xPos = 20
    let yPos = 40

    for (const category of organizedDocs.categories) {
      // Fundo colorido
      doc.setFillColor(category.color)
      doc.rect(xPos, yPos, 60, 20, 'F')
      
      // Texto da categoria
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(category.name, xPos + 30, yPos + 12, { align: 'center' })
      
      // Número de documentos
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`${category.documents.length} docs`, xPos + 30, yPos + 17, { align: 'center' })

      xPos += 70
      if (xPos > 200) {
        xPos = 20
        yPos += 30
      }
    }

    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Instruções: Recorte as etiquetas e cole nos separadores plásticos', 20, yPos + 40)

    return doc.output('datauristring')
  }

  // Organizar documentos por categoria
  private organizeDocumentsByCategory(printPackage: PrintPackage): any {
    const requirements = this.consulateRequirements[printPackage.consulate as keyof typeof this.consulateRequirements] 
                        || this.consulateRequirements.usa

    const categories = requirements.categories.map(cat => ({
      ...cat,
      documents: [] as DocumentItem[]
    }))

    // Distribuir documentos por categoria
    for (const doc of printPackage.documents) {
      const categoryIndex = this.getCategoryForDocument(doc.type, printPackage.consulate)
      if (categoryIndex < categories.length) {
        categories[categoryIndex].documents.push(doc)
      }
    }

    // Ordenar documentos dentro de cada categoria
    categories.forEach(cat => {
      cat.documents.sort((a, b) => {
        // Primeiro por prioridade (obrigatórios primeiro)
        if (a.required !== b.required) {
          return a.required ? -1 : 1
        }
        // Depois por ordem específica do consulado
        const orderA = requirements.specificOrder?.indexOf(a.type) ?? 999
        const orderB = requirements.specificOrder?.indexOf(b.type) ?? 999
        return orderA - orderB
      })
    })

    return { categories }
  }

  // Preparar documentos para impressão
  private async prepareDocumentsForPrint(organizedDocs: any, options: PrintOptions): Promise<string[]> {
    const files: string[] = []
    
    for (const category of organizedDocs.categories) {
      for (const doc of category.documents) {
        if (doc.filePath) {
          // Aqui seria implementada a conversão/otimização do arquivo para impressão
          // Por enquanto, retorna o path original
          files.push(doc.filePath)
        }
      }
    }

    return files
  }

  // Calcular total de páginas
  private calculateTotalPages(organizedDocs: any, options: PrintOptions): number {
    let pages = 0
    
    // Páginas especiais
    pages += options.includeCovers ? 1 : 0
    pages += options.includeChecklist ? 2 : 0
    pages += options.includeInstructions ? 2 : 0
    pages += options.includeTabs ? 1 : 0

    // Páginas dos documentos
    for (const category of organizedDocs.categories) {
      for (const doc of category.documents) {
        if (doc.filePath) {
          pages += doc.pageCount || 1
        }
      }
    }

    return pages
  }

  // Calcular custo de impressão
  private calculatePrintingCost(pages: number, options: PrintOptions): number {
    const baseCostPerPage = 0.15 // R$ 0,15 por página
    const qualityMultiplier = {
      draft: 1.0,
      normal: 1.2,
      high: 1.5
    }[options.printQuality]

    const bindingCost = {
      spiral: 5.00,
      folder: 3.00,
      clips: 1.00
    }[options.bindingType]

    return (pages * baseCostPerPage * qualityMultiplier) + bindingCost
  }

  // Gerar instruções de impressão
  private generatePrintInstructions(printPackage: PrintPackage, options: PrintOptions): string {
    return `
INSTRUÇÕES DE IMPRESSÃO PARA ${printPackage.applicantName}

1. CONFIGURAÇÕES DE IMPRESSÃO:
   - Papel: ${options.paperSize}
   - Qualidade: ${options.printQuality}
   - Frente e verso: Não (consulados preferem uma face)
   - Orientação: Retrato (exceto etiquetas)

2. ORDEM DE IMPRESSÃO:
   ${options.includeCovers ? '- Página de capa (1 página)' : ''}
   ${options.includeChecklist ? '- Checklist de documentos (2 páginas)' : ''}
   ${options.includeInstructions ? '- Instruções do consulado (2 páginas)' : ''}
   - Documentos organizados por categoria
   ${options.includeTabs ? '- Etiquetas para separadores (paisagem)' : ''}

3. ORGANIZAÇÃO FÍSICA:
   - Usar pasta ${options.bindingType === 'folder' ? 'catálogo' : 'com espiral'}
   - Inserir separadores plásticos entre categorias
   - Colar etiquetas nos separadores
   - Manter documentos originais em envelope separado

4. VERIFICAÇÃO FINAL:
   - Conferir se todos os documentos estão presentes
   - Verificar qualidade da impressão
   - Organizar conforme checklist fornecido

Data limite para impressão: ${this.getBusinessDaysBeforeAppointment(printPackage.appointmentDate, 2)}
    `.trim()
  }

  // Métodos auxiliares
  private getCategoryForDocument(type: string, consulate: string): number {
    const categoryMaps = {
      usa: {
        passport: 0, photo: 0, birth_certificate: 0, marriage_certificate: 0,
        bank_statement: 1, employment_letter: 2, education_diploma: 2,
        police_clearance: 3, medical_exam: 3, other: 3
      },
      canada: {
        passport: 0, photo: 0, birth_certificate: 0,
        bank_statement: 1, employment_letter: 1,
        other: 2
      }
    }

    const map = categoryMaps[consulate as keyof typeof categoryMaps] || categoryMaps.usa
    return map[type as keyof typeof map] || 0
  }

  private getCountryName(consulate: string): string {
    const names: Record<string, string> = {
      usa: 'Estados Unidos',
      canada: 'Canadá',
      uk: 'Reino Unido',
      germany: 'Alemanha',
      france: 'França',
      europe: 'Europa'
    }
    return names[consulate] || consulate
  }

  private getConsulateSpecificInstructions(consulate: string): string[] {
    const instructions: Record<string, string[]> = {
      usa: [
        'Não é permitido levar bolsas ou mochilas',
        'Aparelhos eletrônicos devem ser deixados na recepção',
        'A entrevista será conduzida em inglês',
        'Tenha em mãos o comprovante de pagamento da taxa SEVIS (se aplicável)',
        'Apresente-se com trajes formais'
      ],
      canada: [
        'Biometria pode ser coletada no mesmo dia',
        'Traga comprovante de exames médicos se solicitado',
        'A entrevista pode ser em inglês ou francês',
        'Documentos em português devem ter tradução juramentada'
      ],
      europe: [
        'Traga comprovante de seguro viagem',
        'Tenha reservas de hotel confirmadas',
        'Comprovante de renda dos últimos 3 meses é obrigatório',
        'Fotos devem seguir padrão biométrico europeu'
      ]
    }

    return instructions[consulate] || instructions.usa
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  private getBusinessDaysBeforeAppointment(appointmentDate: string, days: number): string {
    const appointment = new Date(appointmentDate)
    const deadline = new Date(appointment)
    
    let businessDays = 0
    while (businessDays < days) {
      deadline.setDate(deadline.getDate() - 1)
      if (deadline.getDay() !== 0 && deadline.getDay() !== 6) { // Não é fim de semana
        businessDays++
      }
    }
    
    return deadline.toLocaleDateString('pt-BR')
  }
}

// Export singleton instance
export const documentPrintingService = new DocumentPrintingService()

// Types export
export type { DocumentItem, PrintPackage, PrintOptions }