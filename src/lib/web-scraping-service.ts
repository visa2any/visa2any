// Sistema de Web Scraping Controlado para Consulados
// ⚠️ ATENÇÃO: Use com cuidado - pode violar ToS

import puppeteer from 'puppeteer'

interface ScrapingTarget {
  id: string
  name: string
  url: string
  country: string
  selectors: {
    availability: string
    dates: string
    times: string
    bookingButton: string
    confirmationCode: string
  }
  rateLimit: number // requests per minute,  lastAccess: number
  enabled: boolean
  reliability: number
}

interface ScrapedSlot {
  date: string
  time: string
  available: boolean
  location: string
  slotId?: string
}

interface ScrapingResult {
  success: boolean
  slots: ScrapedSlot[]
  error?: string
  lastUpdated: string
  source: string
}

class WebScrapingService {
  private browser: any = null
  private readonly targets: ScrapingTarget[] = [
    {
      id: 'casv_brazil',
      name: 'CASV Brasil (CGI Federal)',
      url: 'https://cgifederal.secure.force.com',
    country: 'usa',
      selectors: {
        availability: '.calendar-day.available',
        dates: '.calendar-date',
        times: '.time-slot.available',
        bookingButton: '#confirmBooking',
        confirmationCode: '.confirmation-number'
      },
      rateLimit: 10, // 10 requests per minute,      lastAccess: 0,
      enabled: false, // Disabled by default - requires legal approval,      reliability: 0.75
    },
    {
      id: 'vfs_sao_paulo',
      name: 'VFS Global São Paulo',
      url: 'https://visa.vfsglobal.com/bra/en/gbr',
    country: 'uk',
      selectors: {
        availability: '.calendar-available',
        dates: '.available-date',
        times: '.time-available',
        bookingButton: '.book-appointment',
        confirmationCode: '.booking-reference'
      },
      rateLimit: 8,
      lastAccess: 0,
      enabled: false,
      reliability: 0.80
    },
    {
      id: 'consulado_alemao',
      name: 'Consulado Alemão São Paulo',
      url: 'https://service2.diplo.de/rktermin/extern/choose_realmList.do',
    country: 'germany',
      selectors: {
        availability: '.buchbar',
        dates: '.nat_calendar_day',
        times: '.nat_calendar_time',
        bookingButton: '.submit',
        confirmationCode: '.termin_nummer'
      },
      rateLimit: 5,
      lastAccess: 0,
      enabled: false,
      reliability: 0.65
    },
    {
      id: 'consulado_frances',
      name: 'TLS Contact França',
      url: 'https://appointment.tlscontact.com/br2fr',
    country: 'france',
      selectors: {
        availability: '.calendar-day-available',
        dates: '.calendar-date-available',
        times: '.time-slot-available',
        bookingButton: '.appointment-submit',
        confirmationCode: '.reference-number'
      },
      rateLimit: 6,
      lastAccess: 0,
      enabled: false,
      reliability: 0.70
    },
    {
      id: 'consulado_canadense',
      name: 'VFS Global Canadá',
      url: 'https://visa.vfsglobal.com/bra/en/can',
    country: 'canada',
      selectors: {
        availability: '.available-slot',
        dates: '.calendar-available-date',
        times: '.available-time-slot',
        bookingButton: '.book-slot',
        confirmationCode: '.appointment-reference'
      },
      rateLimit: 8,
      lastAccess: 0,
      enabled: false,
      reliability: 0.78
    }
  ]

  private readonly browserConfig = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }

  // Inicializar browser,  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.browserConfig)
    }
  }

  // Buscar vagas disponíveis via scraping,  async scrapeAvailableSlots(targetId: string): Promise<ScrapingResult> {
    const target = this.targets.find(t => t.id === targetId)
    
    if (!target) {
      return {
        slots: [],
        error: 'Target não encontrado',
        lastUpdated: new Date().toISOString(),
        source: 'unknown'
      }
    }

    if (!target.enabled) {
      return {
        slots: [],
        error: 'Scraping desabilitado para este target (questões legais)',
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }

    // Verificar rate limiting,    const now = Date.now()
    const timeSinceLastAccess = now - target.lastAccess
    const minInterval = (60 * 1000) / target.rateLimit // ms between requests

    if (timeSinceLastAccess < minInterval) {
      return {
        slots: [],
        error: `Rate limit: aguarde ${Math.ceil((minInterval - timeSinceLastAccess) / 1000)}s`,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }

    try {
      await this.initBrowser()
      const page = await this.browser.newPage()

      // Configurar user agent e headers para evitar detecção,      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
      })

      // Implementação específica por target,      let slots: ScrapedSlot[] = []
      
      switch (target.id) {
        case 'casv_brazil':
          slots = await this.scrapeCASV(page, target)
          break
        case 'vfs_sao_paulo':
        case 'consulado_canadense':
          slots = await this.scrapeVFS(page, target)
          break
        case 'consulado_alemao':
          slots = await this.scrapeGermanConsulate(page, target)
          break
        case 'consulado_frances':
          slots = await this.scrapeTLSContact(page, target)
          break
        default:
          slots = await this.genericScrape(page, target)
      }

      await page.close()
      target.lastAccess = now

      return {
        slots,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }

    } catch (error) {
      console.error(`Erro no scraping de ${target.name}:`, error)
      return {
        slots: [],
        error: `Erro técnico: ${error}`,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }
  }

  // Scraping específico para CASV (EUA),  private async scrapeCASV(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0', timeout: 30000 })

      // ⚠️ IMPORTANTE: Este é um exemplo simplificado,      // O site real da CASV tem proteções anti-bot complexas
      
      // Simular login (seria necessário credenciais válidas),      // await page.type('#username', 'user')
      // await page.type('#password', 'pass'),      // await page.click('#login')

      // Aguardar carregamento do calendário,      await page.waitForSelector(target.selectors.availability, { timeout: 10000 })

      // Extrair datas disponíveis,      const availableDates = await page.$$eval(target.selectors.availability, (elements: any[]) => 
        elements.map(el => el.textContent?.trim())
      )

      // Extrair horários (simplificado),      const slots: ScrapedSlot[] = []
      for (const date of availableDates.slice(0, 10)) { // Limitar a 10 slots,        if (date) {
          slots.push({
            date: this.parseDate(date),
            time: '09:00', // Horário fixo para exemplo,            available: true,
            location: 'Consulado Americano - São Paulo'
          })
        }
      }

      return slots

    } catch (error) {
      console.error('Erro no scraping CASV:', error)
      return []
    }
  }

  // Scraping específico para VFS Global,  private async scrapeVFS(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })

      // Navegar para página de agendamento,      await page.click('.appointment-link')
      await page.waitForSelector(target.selectors.dates, { timeout: 10000 })

      // Extrair slots disponíveis,      const slots = await page.evaluate((selectors: any) => {
        const dateElements = document.querySelectorAll(selectors.dates)
        const timeElements = document.querySelectorAll(selectors.times)
        
        const availableSlots: ScrapedSlot[] = []
        
        dateElements.forEach((dateEl: any, index: number) => {
          if (index < timeElements.length) {
            availableSlots.push({
              date: dateEl.textContent?.trim() || '',
              time: timeElements[index].textContent?.trim() || '',
              available: true,
              location: 'VFS Global São Paulo'
            })
          }
        })
        
        return availableSlots
      }, target.selectors)

      return slots

    } catch (error) {
      console.error('Erro no scraping VFS:', error)
      return []
    }
  }

  // Scraping específico para Consulado Alemão,  private async scrapeGermanConsulate(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })

      // Sistema alemão específico,      await page.select('#calendar_select', 'visa_appointment')
      await page.waitForSelector(target.selectors.availability, { timeout: 10000 })

      const slots = await page.$$eval(target.selectors.availability, (elements: any[]) => 
        elements.map((el: any) => ({
          date: el.getAttribute('data-date') || '',
          time: el.getAttribute('data-time') || '10:00',
          available: true,
          location: 'Consulado Alemão São Paulo'
        }))
      )

      return slots

    } catch (error) {
      console.error('Erro no scraping Consulado Alemão:', error)
      return []
    }
  }

  // Scraping específico para TLS Contact (França),  private async scrapeTLSContact(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })

      // Navegar para calendário,      await page.click('#appointment-calendar')
      await page.waitForSelector(target.selectors.availability, { timeout: 10000 })

      const slots = await page.evaluate(() => {
        const availableElements = document.querySelectorAll('.calendar-day-available')
        const slots: ScrapedSlot[] = []
        
        availableElements.forEach((el: any) => {
          const date = el.getAttribute('data-date')
          const times = el.querySelectorAll('.time-available')
          
          times.forEach((timeEl: any) => {
            slots.push({
              date: date || '',
              time: timeEl.textContent?.trim() || '',
              available: true,
              location: 'TLS Contact São Paulo'
            })
          })
        })
        
        return slots
      })

      return slots

    } catch (error) {
      console.error('Erro no scraping TLS Contact:', error)
      return []
    }
  }

  // Scraping genérico para outros sites,  private async genericScrape(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })
      await page.waitForSelector(target.selectors.availability, { timeout: 10000 })

      const slots = await page.$$eval(target.selectors.availability, (elements: any[]) => 
        elements.map((el: any, index: number) => ({
          date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '09:00',
          available: true,
          location: 'Consulado'
        }))
      )

      return slots.slice(0, 5) // Limitar resultados

    } catch (error) {
      console.error('Erro no scraping genérico:', error)
      return []
    }
  }

  // Tentar fazer agendamento via scraping (MUITO ARRISCADO),  async attemptBooking(targetId: string, slotDetails: {
    date: string
    time: string
    applicantInfo: any
  }): Promise<{
    success: boolean
    confirmationCode?: string
    error?: string
  }> {
    // ⚠️ EXTREMAMENTE ARRISCADO - pode violar ToS e causar problemas legais,    return {
      error: 'Agendamento via scraping desabilitado por questões legais e éticas'
    }
  }

  // Monitoramento contínuo de vagas,  async startMonitoring(targetIds: string[], intervalMinutes: number = 30): Promise<void> {
    console.log(`Iniciando monitoramento de ${targetIds.length} targets a cada ${intervalMinutes} minutos`)

    const monitor = async () => {
      for (const targetId of targetIds) {
        try {
          const result = await this.scrapeAvailableSlots(targetId)
          if (result.success && result.slots.length > 0) {
            console.log(`[${targetId}] ${result.slots.length} vagas encontradas`)
            // Aqui poderia notificar clientes interessados          }
        } catch (error) {
          console.error(`Erro no monitoramento de ${targetId}:`, error)
        }
        
        // Aguardar entre targets para evitar sobrecarga,        await this.delay(5000)
      }
    }

    // Executar imediatamente e depois em intervalos,    await monitor()
    setInterval(monitor, intervalMinutes * 60 * 1000)
  }

  // Fechar browser,  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  // Listar targets disponíveis,  getAvailableTargets(): Array<{
    id: string
    name: string
    country: string
    enabled: boolean
    reliability: number
    lastAccess: string
  }> {
    return this.targets.map(target => ({
      id: target.id,
      name: target.name,
      country: target.country,
      enabled: target.enabled,
      reliability: target.reliability,
      lastAccess: target.lastAccess ? new Date(target.lastAccess).toISOString() : 'Never'
    }))
  }

  // Habilitar/Desabilitar target (com confirmação de responsabilidade legal),  setTargetEnabled(targetId: string, enabled: boolean, legalConfirmation: boolean = false): boolean {
    if (enabled && !legalConfirmation) {
      console.warn('Web scraping pode violar ToS dos sites. Use com responsabilidade legal.')
      return false
    }

    const target = this.targets.find(t => t.id === targetId)
    if (target) {
      target.enabled = enabled
      return true
    }
    return false
  }

  // Métodos auxiliares,  private parseDate(dateString: string): string {
    // Converter diferentes formatos de data para ISO,    try {
      return new Date(dateString).toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const webScrapingService = new WebScrapingService()

// Types export
export type { ScrapingTarget, ScrapedSlot, ScrapingResult }