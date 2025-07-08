'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

interface MonitoringChannel {
  id: string
  name: string
  type: 'telegram' | 'email' | 'web' | 'whatsapp'
  url?: string
  status: 'active' | 'inactive' | 'error'
  lastUpdate: string
  foundVacancies: number
  description: string
  cost: string
  reliability: number
}

interface VacancyAlert {
  id: string
  channel: string
  country: string
  visaType: string
  date: string
  location: string
  message: string
  timestamp: string
  notified: boolean
}

export default function MonitoringDashboard() {
  const [channels, setChannels] = useState<MonitoringChannel[]>([])
  const [alerts, setAlerts] = useState<VacancyAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMonitoringData()
    const interval = setInterval(loadMonitoringData, 60000) // Atualizar a cada minuto,    return () => clearInterval(interval)
  }, [])

  const loadMonitoringData = async () => {
    try {
      // Dados simulados dos canais de monitoramento
      const mockChannels: MonitoringChannel[] = [
        {
          id: 'vaga_express',
          name: 'Vaga Express',
          type: 'telegram',
          url: 'https://t.me/vagaexpress',
    status: 'active',
          lastUpdate: '2024-01-15T12:30:00Z',
          foundVacancies: 23,
          description: 'Canal principal de vagas de consulados',
          cost: 'GRATUITO',
          reliability: 85
        },
        {
          id: 'vaga_consulado_usa',
          name: 'Vagas Consulado EUA',
          type: 'telegram',
          url: 'https://t.me/vaga_consulado_usa',
    status: 'active',
          lastUpdate: '2024-01-15T12:25:00Z',
          foundVacancies: 15,
          description: 'Especializado em vagas para EUA',
          cost: 'GRATUITO',
          reliability: 90
        },
        {
          id: 'vagas_visto_canada',
          name: 'Vagas Visto Canadá',
          type: 'telegram',
          url: 'https://t.me/vagas_visto_canada',
    status: 'active',
          lastUpdate: '2024-01-15T12:20:00Z',
          foundVacancies: 8,
          description: 'Monitoramento VFS Global Canadá',
          cost: 'GRATUITO',
          reliability: 80
        },
        {
          id: 'casv_monitor',
          name: 'CASV Monitor',
          type: 'web',
          url: 'https://cgifederal.secure.force.com',
    status: 'active',
          lastUpdate: '2024-01-15T12:35:00Z',
          foundVacancies: 12,
          description: 'Monitoramento direto CASV',
          cost: 'R$ 2/consulta',
          reliability: 75
        },
        {
          id: 'vfs_global_monitor',
          name: 'VFS Global Monitor',
          type: 'web',
          url: 'https://visa.vfsglobal.com',
    status: 'active',
          lastUpdate: '2024-01-15T12:32:00Z',
          foundVacancies: 6,
          description: 'Monitoramento VFS Global',
          cost: 'R$ 2/consulta',
          reliability: 70
        },
        {
          id: 'email_alerts',
          name: 'Email Alerts',
          type: 'email',
          status: 'active',
          lastUpdate: '2024-01-15T12:28:00Z',
          foundVacancies: 4,
          description: 'Monitoramento via email dos consulados',
          cost: 'R$ 20/mês',
          reliability: 60
        }
      ]

      const mockAlerts: VacancyAlert[] = [
        {
          id: '1',
          channel: 'Vaga Express',
          country: 'EUA',
          visaType: 'Turismo',
          date: '2024-01-25',
          location: 'São Paulo',
          message: '🚨 VAGA DISPONÍVEL! Consulado EUA SP - 25/01 às 14:30',
          timestamp: '2024-01-15T12:30:00Z',
          notified: true
        },
        {
          id: '2',
          channel: 'CASV Monitor',
          country: 'EUA',
          visaType: 'Trabalho',
          date: '2024-01-28',
          location: 'Rio de Janeiro',
          message: 'Nova vaga H1B encontrada para 28/01',
          timestamp: '2024-01-15T12:25:00Z',
          notified: false
        },
        {
          id: '3',
          channel: 'Vagas Visto Canadá',
          country: 'Canadá',
          visaType: 'Turismo',
          date: '2024-01-22',
          location: 'São Paulo',
          message: 'VFS Canadá - vaga liberada para visitante',
          timestamp: '2024-01-15T12:20:00Z',
          notified: true
        }
      ]

      setChannels(mockChannels)
      setAlerts(mockAlerts)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados de monitoramento:', error)
      setLoading(false)
    }
  }

  const toggleChannel = async (channelId: string, enabled: boolean) => {
    try {
      // Simular API call para ativar/desativar canal
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, status: enabled ? 'active' : 'inactive' }
          : channel
      ))

      if (enabled) {
        window.alert(`Canal ${channelId} ativado! Monitoramento iniciado.`)
      } else {
        window.alert(`Canal ${channelId} desativado.`)
      }
    } catch (error) {
      window.alert('Erro ao alterar status do canal')
    }
  }

  const testChannel = async (channelId: string) => {
    try {
      const response = await fetch('/api/cost-effective?action=telegram_setup')
      const result = await response.json()
      window.alert(`Teste do canal ${channelId}:\n${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      window.alert('Erro ao testar canal')
    }
  }

  const notifyClient = async (alertId: string) => {
    try {
      const foundAlert = alerts.find(a => a.id === alertId)
      if (!foundAlert) return

      // Simular notificação ao cliente

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_booking_update',
          data: {
            trackingId: 'MANUAL-123456',
            status: 'slot_found'
          }
        })
      })

      if (response.ok) {
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, notified: true } : a
        ))
        window.alert('Cliente notificado sobre a vaga!')
      }
    } catch (error) {
      window.alert('Erro ao notificar cliente')
    }
  }

  const getStatusBadge = (status: 'active' | 'inactive' | 'error') => {
    const config = {
      'active': { color: 'bg-green-500', text: 'Ativo' },
      'inactive': { color: 'bg-gray-500', text: 'Inativo' },
      'error': { color: 'bg-red-500', text: 'Erro' }
    } as const

    const statusConfig = config[status] || config.inactive
    return <Badge className={`${statusConfig.color} text-white`}>{statusConfig.text}</Badge>
  }

  const getChannelIcon = (type: string) => {
    const icons: Record<string, string> = {
      'telegram': '📱',
      'email': '📧',
      'web': '🌐',
      'whatsapp': '💬'
    }
    return icons[type] || '📡'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando monitoramento...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔍 Monitoramento de Vagas</h1>
        <Button onClick={loadMonitoringData} variant="outline">
          🔄 Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {channels.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vagas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {alerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {channels.reduce((sum, c) => sum + c.foundVacancies, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 70</div>
            <div className="text-xs text-gray-500">vs R$ 299-599 APIs</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="setup">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Monitoramento</CardTitle>
              <CardDescription>
                Gerencie todos os canais que monitoram vagas de consulados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div 
                    key={channel.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getChannelIcon(channel.type)}</span>
                          <div className="font-medium">{channel.name}</div>
                          {getStatusBadge(channel.status)}
                        </div>
                        <div className="text-sm text-gray-600">{channel.description}</div>
                        <div className="text-sm">
                          <span className="font-medium">Custo:</span> {channel.cost} | 
                          <span className="font-medium"> Confiabilidade:</span> {channel.reliability}% | 
                          <span className="font-medium"> Vagas encontradas:</span> {channel.foundVacancies}
                        </div>
                        {channel.url && (
                          <div className="text-sm text-blue-600">
                            <a href={channel.url} target="_blank" rel="noopener noreferrer">
                              {channel.url}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Switch
                          checked={channel.status === 'active'}
                          onCheckedChange={(checked) => toggleChannel(channel.id, checked)}
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => testChannel(channel.id)}
                        >
                          🧪 Testar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Vagas</CardTitle>
              <CardDescription>
                Vagas encontradas pelos canais de monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`border rounded-lg p-4 ${alert.notified ? 'bg-green-50' : 'bg-yellow-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">
                          🎯 {alert.country} - {alert.visaType}
                        </div>
                        <div className="text-sm text-gray-600">
                          📅 {alert.date} | 📍 {alert.location}
                        </div>
                        <div className="text-sm">
                          📢 {alert.channel}: {alert.message}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {alert.notified ? (
                          <Badge className="bg-green-500 text-white">Notificado</Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => notifyClient(alert.id)}
                          >
                            📨 Notificar Cliente
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Monitoramento</CardTitle>
              <CardDescription>
                Configure seus canais de monitoramento gratuitos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">📱 Telegram (GRATUITO)</h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Passo 1:</strong> Entre nos canais: @vagaexpress, @vaga_consulado_usa, @vagas_visto_canada
                  </p>
                  <p className="text-sm">
                    <strong>Passo 2:</strong> Crie um bot no @BotFather
                  </p>
                  <p className="text-sm">
                    <strong>Passo 3:</strong> Configure TELEGRAM_BOT_TOKEN no .env
                  </p>
                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/cost-effective?action=telegram_setup')
      const result = await response.json()
      window.alert(JSON.stringify(result.instructions, null, 2))
                    }}
                  >
                    📋 Ver Instruções Completas
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">🌐 Web Scraping (R$ 50/mês)</h3>
                <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Monitora:</strong> CASV, VFS Global, consulados diretos
                  </p>
                  <p className="text-sm">
                    <strong>Custo:</strong> R$ 2 por consulta + servidor
                  </p>
                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/automation?action=status')
      const result = await response.json()
      window.alert(JSON.stringify(result, null, 2))
                    }}
                  >
                    ⚡ Ativar Monitoramento Web
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">📧 Email (R$ 20/mês)</h3>
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Monitora:</strong> Emails dos consulados com palavras-chave
                  </p>
                  <p className="text-sm">
                    <strong>Providers:</strong> Gmail API, Mailgun, SendGrid (versões gratuitas)
                  </p>
                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/cost-effective?action=email_setup')
      const result = await response.json()
      window.alert(JSON.stringify(result.instructions, null, 2))
                    }}
                  >
                    📬 Configurar Email Monitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
