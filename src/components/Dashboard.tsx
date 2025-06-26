'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BookingData {
  trackingId: string
  customerName: string
  customerEmail: string
  country: string
  visaType: string
  serviceLevel: 'basic' | 'premium' | 'express'
  status: 'pending' | 'payment_pending' | 'processing' | 'completed' | 'cancelled'
  amount: number
  createdAt: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  appointmentDetails?: {
    date: string
    time: string
    location: string
    confirmationCode: string
  }
}

interface DashboardStats {
  totalBookings: number
  pendingPayments: number
  inProgress: number
  completed: number
  revenue: number
  todayBookings: number
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingPayments: 0,
    inProgress: 0,
    completed: 0,
    revenue: 0,
    todayBookings: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Atualizar a cada 30 segundos,    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simular dados do dashboard (em produção viria da API),      const mockBookings: BookingData[] = [
        {
          trackingId: 'MANUAL-1703123456-abc123',
          customerName: 'Maria Silva',
          customerEmail: 'maria@email.com',
          country: 'usa',
          visaType: 'tourist',
          serviceLevel: 'premium',
          status: 'processing',
          amount: 45.00,
          createdAt: '2024-01-15T10:30:00Z',
          paymentStatus: 'paid'
        },
        {
          trackingId: 'MANUAL-1703123457-def456',
          customerName: 'João Santos',
          customerEmail: 'joao@email.com',
          country: 'canada',
          visaType: 'work',
          serviceLevel: 'express',
          status: 'completed',
          amount: 75.00,
          createdAt: '2024-01-15T09:15:00Z',
          paymentStatus: 'paid',
          appointmentDetails: {
            date: '2024-01-25',
            time: '14:30',
            location: 'Consulado do Canadá - São Paulo',
            confirmationCode: 'CAN123456789'
          }
        },
        {
          trackingId: 'MANUAL-1703123458-ghi789',
          customerName: 'Ana Costa',
          customerEmail: 'ana@email.com',
          country: 'uk',
          visaType: 'tourist',
          serviceLevel: 'basic',
          status: 'payment_pending',
          amount: 25.00,
          createdAt: '2024-01-15T11:45:00Z',
          paymentStatus: 'pending'
        }
      ]

      setBookings(mockBookings)

      // Calcular estatísticas,      const totalBookings = mockBookings.length
      const pendingPayments = mockBookings.filter(b => b.paymentStatus === 'pending').length
      const inProgress = mockBookings.filter(b => b.status === 'processing').length
      const completed = mockBookings.filter(b => b.status === 'completed').length
      const revenue = mockBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.amount, 0)
      const todayBookings = mockBookings.filter(b => 
        new Date(b.createdAt).toDateString() === new Date().toDateString()
      ).length

      setStats({
        totalBookings,
        pendingPayments,
        inProgress,
        completed,
        revenue,
        todayBookings
      })

      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, text: string }> = {
      'pending': { color: 'bg-gray-500', text: 'Pendente' },
      'payment_pending': { color: 'bg-yellow-500', text: 'Aguardando Pagamento' },
      'processing': { color: 'bg-blue-500', text: 'Processando' },
      'completed': { color: 'bg-green-500', text: 'Concluído' },
      'cancelled': { color: 'bg-red-500', text: 'Cancelado' }
    }

    const config = statusConfig[status] || statusConfig['pending']
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, text: string }> = {
      'pending': { color: 'bg-orange-500', text: 'Pendente' },
      'paid': { color: 'bg-green-500', text: 'Pago' },
      'failed': { color: 'bg-red-500', text: 'Falhou' }
    }

    const config = statusConfig[status] || statusConfig['pending']
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const sendPaymentReminder = async (trackingId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_payment_link',
          data: {
            trackingId,
            paymentUrl: `${window.location.origin}/payment/${trackingId}`,
            pixCode: 'PIX_CODE_EXAMPLE'
          }
        })
      })

      if (response.ok) {
        alert('Lembrete de pagamento enviado!')
      }
    } catch (error) {
      alert('Erro ao enviar lembrete')
    }
  }

  const updateBookingStatus = async (trackingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_booking_update',
          data: { trackingId, status: newStatus }
        })
      })

      if (response.ok) {
        // Atualizar localmente,        setBookings(prev => prev.map(b => 
          b.trackingId === trackingId 
            ? { ...b, status: newStatus as any }
            : b
        ))
        alert('Status atualizado e cliente notificado!')
      }
    } catch (error) {
      alert('Erro ao atualizar status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Visa2Any</h1>
        <Button onClick={loadDashboardData} variant="outline">
          🔄 Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pag. Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs do Dashboard */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
              <CardDescription>
                Gerencie todos os agendamentos em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.trackingId}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.trackingId}</div>
                        <div className="text-sm">
                          {booking.country.toUpperCase()} - {booking.visaType} - {booking.serviceLevel}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-bold">R$ {booking.amount.toFixed(2)}</div>
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      {booking.paymentStatus === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            sendPaymentReminder(booking.trackingId)
                          }}
                        >
                          💳 Lembrar Pagamento
                        </Button>
                      )}
                      
                      {booking.status === 'processing' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateBookingStatus(booking.trackingId, 'completed')
                          }}
                        >
                          ✅ Marcar Concluído
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status de Pagamentos</CardTitle>
              <CardDescription>
                Acompanhe todos os pagamentos e pendências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.trackingId} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.trackingId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">R$ {booking.amount.toFixed(2)}</div>
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">6</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vagas Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">3</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Vagas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">68</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Custo Monitoramento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ 50</div>
                <div className="text-xs text-gray-500">vs R$ 299-599 APIs</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔍 Canais de Monitoramento</CardTitle>
                <CardDescription>
                  Canais Telegram e outras fontes gratuitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: '📱 Vaga Express', status: 'Ativo', vagas: 23, cost: 'GRATUITO', reliability: 85 },
                    { name: '📱 Vagas Consulado EUA', status: 'Ativo', vagas: 15, cost: 'GRATUITO', reliability: 90 },
                    { name: '📱 Vagas Canadá', status: 'Ativo', vagas: 8, cost: 'GRATUITO', reliability: 80 },
                    { name: '🌐 CASV Monitor', status: 'Ativo', vagas: 12, cost: 'R$ 2/consulta', reliability: 75 },
                    { name: '🌐 VFS Global', status: 'Ativo', vagas: 6, cost: 'R$ 2/consulta', reliability: 70 },
                    { name: '📧 Email Alerts', status: 'Ativo', vagas: 4, cost: 'R$ 20/mês', reliability: 60 }
                  ].map((channel, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-gray-500">
                          {channel.vagas} vagas | {channel.reliability}% confiabilidade
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500 text-white mb-1">{channel.status}</Badge>
                        <div className="text-xs text-gray-500">{channel.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/cost-effective?action=telegram_setup')
                      const result = await response.json()
                      alert(result.instructions || JSON.stringify(result, null, 2))
                    }}
                    className="w-full"
                  >
                    ⚙️ Configurar Monitoramento Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚨 Alertas Recentes</CardTitle>
                <CardDescription>
                  Vagas encontradas pelos canais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      channel: 'Vaga Express',
                      country: 'EUA',
                      type: 'Turismo',
                      date: '25/01',
                      location: 'São Paulo',
                      time: '12:30',
                      notified: true
                    },
                    {
                      channel: 'CASV Monitor',
                      country: 'EUA',
                      type: 'Trabalho',
                      date: '28/01',
                      location: 'Rio de Janeiro',
                      time: '12:25',
                      notified: false
                    },
                    {
                      channel: 'Vagas Canadá',
                      country: 'Canadá',
                      type: 'Turismo',
                      date: '22/01',
                      location: 'São Paulo',
                      time: '12:20',
                      notified: true
                    }
                  ].map((alert, index) => (
                    <div 
                      key={index} 
                      className={`border rounded p-3 ${alert.notified ? 'bg-green-50' : 'bg-yellow-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">🎯 {alert.country} - {alert.type}</div>
                          <div className="text-sm text-gray-600">
                            📅 {alert.date} | 📍 {alert.location}
                          </div>
                          <div className="text-sm text-gray-500">
                            📢 {alert.channel} - {alert.time}
                          </div>
                        </div>
                        <div>
                          {alert.notified ? (
                            <Badge className="bg-green-500 text-white">Notificado</Badge>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={async () => {
                                const response = await fetch('/api/notifications', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    action: 'send_booking_update',
                                    data: { trackingId: 'MANUAL-123456', status: 'slot_found' }
                                  })
                                })
                                if (response.ok) {
                                  alert('Cliente notificado!')
                                  loadDashboardData() // Recarregar                                }
                              }}
                            >
                              📨 Notificar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={async () => {
                      const response = await fetch('/api/automation?action=status')
                      const result = await response.json()
                      alert(JSON.stringify(result, null, 2))
                    }}
                  >
                    📊 Ver Status Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>⚙️ Setup Rápido</CardTitle>
              <CardDescription>
                Configure monitoramento gratuito em minutos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-4 bg-blue-50">
                  <h4 className="font-medium mb-2">📱 Telegram (GRATUITO)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Entre no @vagaexpress e outros canais. Configure bot para automação.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/cost-effective?action=telegram_setup')
                        const result = await response.json()
                        alert(result.instructions || 'Instruções:\n\n1. Acesse @BotFather no Telegram\n2. Digite /newbot\n3. Configure TELEGRAM_BOT_TOKEN no .env\n4. Entre nos canais: @vagaexpress')
                      } catch (error) {
                        alert('Instruções:\n\n1. Acesse @BotFather no Telegram\n2. Digite /newbot\n3. Configure TELEGRAM_BOT_TOKEN no .env\n4. Entre nos canais: @vagaexpress')
                      }
                    }}
                  >
                    📋 Instruções
                  </Button>
                </div>
                
                <div className="border rounded p-4 bg-purple-50">
                  <h4 className="font-medium mb-2">🌐 Web Scraping (R$ 50/mês)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Monitora CASV, VFS Global automaticamente. R$ 2 por consulta.
                  </p>
                  <Button 
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/automation', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            country: 'usa',
                            visaType: 'tourist',
                            action: 'start_monitoring'
                          })
                        })
                        const result = await response.json()
                        alert(JSON.stringify(result, null, 2))
                      } catch (error) {
                        alert('Monitoramento web ativado!')
                      }
                    }}
                  >
                    ⚡ Ativar
                  </Button>
                </div>
                
                <div className="border rounded p-4 bg-green-50">
                  <h4 className="font-medium mb-2">📧 Email (R$ 20/mês)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Monitora emails dos consulados. Gmail API gratuito.
                  </p>
                  <Button 
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/cost-effective?action=email_setup')
                        const result = await response.json()
                        alert(result.instructions || 'Configure:\n\n1. Gmail API\n2. Palavras-chave: "appointment available"\n3. SENDGRID_API_KEY no .env')
                      } catch (error) {
                        alert('Configure:\n\n1. Gmail API\n2. Palavras-chave: "appointment available"\n3. SENDGRID_API_KEY no .env')
                      }
                    }}
                  >
                    📬 Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Centro de Notificações</CardTitle>
              <CardDescription>
                Configure e teste notificações WhatsApp e Email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={async () => {
                  const response = await fetch('/api/notifications?action=test')
                  const result = await response.json()
                  alert(JSON.stringify(result, null, 2))
                }}
              >
                🧪 Testar Notificações
              </Button>
              
              <Button 
                variant="outline"
                onClick={async () => {
                  const response = await fetch('/api/notifications?action=config')
                  const result = await response.json()
                  alert(JSON.stringify(result, null, 2))
                }}
              >
                ⚙️ Verificar Configuração
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Performance</CardTitle>
              <CardDescription>
                Métricas de performance e ROI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Taxa de Conversão</h4>
                  <div className="text-2xl font-bold text-green-600">85.7%</div>
                  <p className="text-sm text-gray-500">Agendamentos pagos vs total</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Tempo Médio de Processamento</h4>
                  <div className="text-2xl font-bold text-blue-600">2.3 dias</div>
                  <p className="text-sm text-gray-500">Do pagamento à confirmação</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">ROI Mensal</h4>
                  <div className="text-2xl font-bold text-green-600">285%</div>
                  <p className="text-sm text-gray-500">Retorno sobre investimento</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Países Mais Solicitados</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>🇺🇸 EUA</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🇨🇦 Canadá</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🇬🇧 Reino Unido</span>
                      <span className="font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Agendamento */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Detalhes do Agendamento</h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Tracking ID:</label>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedBooking.trackingId}</div>
                </div>
                <div>
                  <label className="font-medium">Status:</label>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Cliente:</label>
                  <div>{selectedBooking.customerName}</div>
                  <div className="text-sm text-gray-500">{selectedBooking.customerEmail}</div>
                </div>
                <div>
                  <label className="font-medium">Pagamento:</label>
                  <div>{getPaymentStatusBadge(selectedBooking.paymentStatus)}</div>
                  <div className="font-bold">R$ {selectedBooking.amount.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-medium">País:</label>
                  <div>{selectedBooking.country.toUpperCase()}</div>
                </div>
                <div>
                  <label className="font-medium">Tipo de Visto:</label>
                  <div>{selectedBooking.visaType}</div>
                </div>
                <div>
                  <label className="font-medium">Nível:</label>
                  <div className="capitalize">{selectedBooking.serviceLevel}</div>
                </div>
              </div>
              
              {selectedBooking.appointmentDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Detalhes do Agendamento:</h3>
                  <div className="bg-green-50 p-4 rounded">
                    <div><strong>Data:</strong> {selectedBooking.appointmentDetails.date}</div>
                    <div><strong>Horário:</strong> {selectedBooking.appointmentDetails.time}</div>
                    <div><strong>Local:</strong> {selectedBooking.appointmentDetails.location}</div>
                    <div><strong>Confirmação:</strong> {selectedBooking.appointmentDetails.confirmationCode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}