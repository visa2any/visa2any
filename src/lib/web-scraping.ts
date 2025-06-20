import puppeteer from 'puppeteer'

interface VisaSlot {
  date: string
  location: string
  country: string
  visaType: string
  source: string
  available: boolean
}

export class WebScrapingService {
  private browser: any = null

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  // Monitorar CASV (EUA)
  async checkCASV(): Promise<VisaSlot[]> {
    const slots: VisaSlot[] = []
    
    try {
      await this.init()
      const page = await this.browser.newPage()
      
      // Headers para simular usuário real
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      
      // Acessa CASV
      await page.goto('https://ais.usvisa-info.com/', { waitUntil: 'networkidle2' })
      
      // Simular verificação de slots (implementação específica)
      const availableSlots = await page.evaluate(() => {
        // Código para extrair slots disponíveis
        const elements = document.querySelectorAll('.appointment-slot')
        return Array.from(elements).map(el => ({
          date: el.textContent?.trim() || '',
          available: !el.classList.contains('disabled')
        }))
      })

      // Converter para nosso formato
      availableSlots.forEach((slot: any) => {
        if (slot.available) {
          slots.push({
            date: slot.date,
            location: 'São Paulo',
            country: 'EUA',
            visaType: 'B1/B2',
            source: 'CASV',
            available: true
          })
        }
      })

      await page.close()
    } catch (error) {
      console.error('Erro ao verificar CASV:', error)
    }

    return slots
  }

  // Monitorar VFS Global (Canadá/Reino Unido)
  async checkVFS(): Promise<VisaSlot[]> {
    const slots: VisaSlot[] = []
    
    try {
      await this.init()
      const page = await this.browser.newPage()
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      await page.goto('https://visa.vfsglobal.com/bra/en/can/', { waitUntil: 'networkidle2' })
      
      // Verificar slots VFS
      const vfsSlots = await page.evaluate(() => {
        const calendar = document.querySelector('.calendar')
        if (!calendar) return []
        
        const availableDates = calendar.querySelectorAll('.available')
        return Array.from(availableDates).map(date => ({
          date: date.textContent?.trim() || '',
          available: true
        }))
      })

      vfsSlots.forEach((slot: any) => {
        slots.push({
          date: slot.date,
          location: 'São Paulo',
          country: 'Canadá',
          visaType: 'Visitor',
          source: 'VFS Global',
          available: true
        })
      })

      await page.close()
    } catch (error) {
      console.error('Erro ao verificar VFS:', error)
    }

    return slots
  }

  // Verificar múltiplos sites
  async checkAllSites(): Promise<VisaSlot[]> {
    const allSlots: VisaSlot[] = []
    
    try {
      const [casvSlots, vfsSlots] = await Promise.all([
        this.checkCASV(),
        this.checkVFS()
      ])
      
      allSlots.push(...casvSlots, ...vfsSlots)
    } catch (error) {
      console.error('Erro geral no web scraping:', error)
    }
    
    return allSlots
  }

  // Notificar via Telegram quando encontrar slots
  async notifySlots(slots: VisaSlot[]) {
    if (slots.length === 0) return

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
      console.error('Token ou Chat ID não configurados')
      return
    }

    for (const slot of slots) {
      const message = `🚨 NOVA VAGA DETECTADA!

🇺🇸 País: ${slot.country}
📅 Data: ${slot.date}  
📍 Local: ${slot.location}
🎯 Tipo: ${slot.visaType}
🔍 Fonte: ${slot.source}

⏰ Verificado: ${new Date().toLocaleString('pt-BR')}

💰 Agendar por R$ 45 no sistema!`

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        })
      } catch (error) {
        console.error('Erro ao enviar notificação:', error)
      }
    }
  }
}

export const webScrapingService = new WebScrapingService()