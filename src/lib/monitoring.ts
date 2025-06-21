import { NextRequest } from 'next/server'

export interface MonitoringData {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  metadata?: Record<string, any>
  endpoint?: string
  ip?: string
  userAgent?: string
  duration?: number
  statusCode?: number
}

class SimpleMonitoring {
  private logs: MonitoringData[] = []
  private maxLogs = 1000 // Manter apenas os últimos 1000 logs

  log(data: Omit<MonitoringData, 'timestamp'>) {
    const logEntry: MonitoringData = {
      ...data,
      timestamp: new Date().toISOString()
    }

    this.logs.push(logEntry)
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log no console para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry.metadata)
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log({ level: 'info', message, metadata })
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log({ level: 'warn', message, metadata })
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log({ level: 'error', message, metadata })
  }

  // Monitorar performance de endpoints
  trackEndpoint(request: NextRequest, statusCode: number, duration: number) {
    const endpoint = request.nextUrl.pathname
    const ip = this.getClientIP(request)
    
    this.log({
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${request.method} ${endpoint} - ${statusCode}`,
      endpoint,
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
      duration,
      statusCode,
      metadata: {
        method: request.method,
        url: request.url,
        search: request.nextUrl.search
      }
    })
  }

  // Monitorar erros de aplicação
  trackError(error: Error, context?: Record<string, any>) {
    this.error(`Application Error: ${error.message}`, {
      stack: error.stack,
      name: error.name,
      ...context
    })
  }

  // Monitorar eventos de negócio
  trackBusinessEvent(event: string, data: Record<string, any>) {
    this.info(`Business Event: ${event}`, data)
  }

  // Obter estatísticas dos logs
  getStats() {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    const oneDayAgo = now - (24 * 60 * 60 * 1000)

    const recentLogs = this.logs.filter(log => 
      new Date(log.timestamp).getTime() > oneHourAgo
    )

    const dailyLogs = this.logs.filter(log => 
      new Date(log.timestamp).getTime() > oneDayAgo
    )

    const errorCount = recentLogs.filter(log => log.level === 'error').length
    const warnCount = recentLogs.filter(log => log.level === 'warn').length

    const endpointStats = recentLogs
      .filter(log => log.endpoint)
      .reduce((acc, log) => {
        const key = `${log.metadata?.method || 'UNKNOWN'} ${log.endpoint}`
        if (!acc[key]) {
          acc[key] = { count: 0, avgDuration: 0, errors: 0 }
        }
        acc[key].count++
        if (log.duration) {
          acc[key].avgDuration = (acc[key].avgDuration + log.duration) / 2
        }
        if (log.statusCode && log.statusCode >= 400) {
          acc[key].errors++
        }
        return acc
      }, {} as Record<string, any>)

    return {
      totalLogs: this.logs.length,
      lastHour: {
        total: recentLogs.length,
        errors: errorCount,
        warnings: warnCount,
        info: recentLogs.length - errorCount - warnCount
      },
      lastDay: {
        total: dailyLogs.length,
        errors: dailyLogs.filter(log => log.level === 'error').length,
        warnings: dailyLogs.filter(log => log.level === 'warn').length
      },
      topEndpoints: Object.entries(endpointStats)
        .sort(([,a], [,b]) => (b as any).count - (a as any).count)
        .slice(0, 10),
      healthScore: this.calculateHealthScore(recentLogs)
    }
  }

  // Obter logs recentes
  getRecentLogs(limit = 100) {
    return this.logs.slice(-limit).reverse()
  }

  // Calcular score de saúde da aplicação
  private calculateHealthScore(logs: MonitoringData[]): number {
    if (logs.length === 0) return 100

    const errorRate = logs.filter(log => log.level === 'error').length / logs.length
    const warnRate = logs.filter(log => log.level === 'warn').length / logs.length
    
    // Score baseado em taxas de erro e warning
    let score = 100
    score -= errorRate * 80 // Cada erro reduz muito o score
    score -= warnRate * 20  // Warnings reduzem menos

    return Math.max(Math.round(score), 0)
  }

  private getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = request.headers.get('x-vercel-forwarded-for')
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim()
    }
    
    if (realIP) {
      return realIP.trim()
    }
    
    if (ip) {
      return ip.trim()
    }
    
    return 'unknown'
  }
}

// Instância singleton
export const monitoring = new SimpleMonitoring()

// Helper para medir tempo de execução
export function measureTime() {
  const start = Date.now()
  return () => Date.now() - start
}

// Middleware helper
export function createMonitoringMiddleware() {
  return async (request: NextRequest, handler: () => Promise<Response>) => {
    const startTime = measureTime()
    
    try {
      const response = await handler()
      const duration = startTime()
      
      monitoring.trackEndpoint(request, response.status, duration)
      
      return response
    } catch (error) {
      const duration = startTime()
      monitoring.trackEndpoint(request, 500, duration)
      monitoring.trackError(error as Error, {
        endpoint: request.nextUrl.pathname,
        method: request.method
      })
      throw error
    }
  }
}