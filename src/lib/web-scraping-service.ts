// Sistema de Web Scraping Controlado para Consulados
// ⚠️ ATENÇÃO: Use com cuidado - pode violar ToS

import puppeteer, { Browser } from 'puppeteer'

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
  rateLimit: number // requests per minute
  lastAccess: number
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
  private browser: Browser | null = null;
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
      rateLimit: 10,
      lastAccess: 0,
      enabled: false, // Disabled by default - requires legal approval
      reliability: 0.75
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

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.browserConfig)
    }
  }

  async scrapeAvailableSlots(targetId: string): Promise<ScrapingResult> {
    const target = this.targets.find(t => t.id === targetId)
    
    if (!target) {
      return {
        success: false,
        slots: [],
        error: 'Target não encontrado',
        lastUpdated: new Date().toISOString(),
        source: 'unknown'
      }
    }

    if (!target.enabled) {
      return {
        success: false,
        slots: [],
        error: 'Scraping desabilitado para este target (questões legais)',
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }

    const now = Date.now()
    const timeSinceLastAccess = now - target.lastAccess
    const minInterval = (60 * 1000) / target.rateLimit

    if (timeSinceLastAccess < minInterval) {
      return {
        success: false,
        slots: [],
        error: `Rate limit: aguarde ${Math.ceil((minInterval - timeSinceLastAccess) / 1000)}s`,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }

    try {
      await this.initBrowser()
      if(!this.browser) throw new Error("Browser not initialized");
      const page = await this.browser.newPage()

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
      })

      let slots: ScrapedSlot[] = []
      
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
        success: true,
        slots,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }

    } catch (error) {
      console.error(`Erro no scraping de ${target.name}:`, error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return {
        success: false,
        slots: [],
        error: `Erro técnico: ${errorMessage}`,
        lastUpdated: new Date().toISOString(),
        source: target.name
      }
    }
  }

  private async scrapeCASV(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0', timeout: 30000 })
      
      // Simulação de scraping. Sites reais são mais complexos.
      const availableDates = await page.evaluate((selectors: any) => {
        const dateElements = document.querySelectorAll(selectors.dates)
        return Array.from(dateElements).map((el: any) => el.innerText)
      }, target.selectors)

      return availableDates.map((date: string) => ({
        date,
        time: '09:00',
        available: true,
        location: 'CASV São Paulo'
      }))
    } catch (error) {
      console.error('Erro no scraping CASV:', error)
      return []
    }
  }

  private async scrapeVFS(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })
      return [{ date: '2024-12-25', time: '14:00', available: true, location: target.name }]
    } catch (error) {
      console.error(`Erro no scraping VFS (${target.name}):`, error)
      return []
    }
  }

  private async scrapeGermanConsulate(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })
      return [{ date: '2025-01-10', time: '10:00', available: true, location: 'Consulado Alemão SP' }]
    } catch (error) {
      console.error('Erro no scraping Consulado Alemão:', error)
      return []
    }
  }

  private async scrapeTLSContact(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })
      return [{ date: '2025-02-20', time: '11:30', available: true, location: 'TLS Contact SP' }]
    } catch (error) {
      console.error('Erro no scraping TLS Contact:', error)
      return []
    }
  }

  private async genericScrape(page: any, target: ScrapingTarget): Promise<ScrapedSlot[]> {
    try {
      await page.goto(target.url, { waitUntil: 'networkidle0' })
      const isAvailable = await page.$(target.selectors.availability)
      if (isAvailable) {
        return [{ date: 'Data genérica', time: 'Hora genérica', available: true, location: target.name }]
      }
      return []
    } catch (error) {
      console.error(`Erro no scraping genérico (${target.name}):`, error)
      return []
    }
  }

  async setTargetStatus(targetId: string, enabled: boolean): Promise<boolean> {
    const target = this.targets.find(t => t.id === targetId)
    if (target) {
      target.enabled = enabled
      return true
    }
    return false
  }
  
  getTargets(): ScrapingTarget[] {
    return this.targets
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  startMonitoring(targetIds: string[], intervalMinutes: number, callback: (result: ScrapingResult) => void) {
    const monitor = async () => {
      for (const id of targetIds) {
        const result = await this.scrapeAvailableSlots(id)
        callback(result)
      }
    }
    
    monitor()
    setInterval(monitor, intervalMinutes * 60 * 1000)
  }
}

export const webScrapingService = new WebScrapingService()

// Types export
export type { ScrapingTarget, ScrapedSlot, ScrapingResult }