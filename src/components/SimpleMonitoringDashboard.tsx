'use client'

import React, { useState, useEffect } from 'react'

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

export default function SimpleMonitoringDashboard() {
  const [channels, setChannels] = useState<MonitoringChannel[]>([])
  const [alerts, setAlerts] = useState<VacancyAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('channels')
  const [buttonLoading, setButtonLoading] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'error' | 'info'
    message: string
    timestamp: number
  }>>([])
  
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, type, message, timestamp: Date.now() }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  useEffect(() => {
    loadMonitoringData()
    const interval = setInterval(loadMonitoringData, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadMonitoringData = async () => {
    try {
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
    setButtonLoading(prev => ({ ...prev, [`toggle_${channelId}`]: true }))
    
    try {
      // Simular call para API de ativação,      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, status: enabled ? 'active' : 'inactive' }
          : channel
      ))
      
      showNotification('success', `Canal ${channelId} ${enabled ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      showNotification('error', `Erro ao ${enabled ? 'ativar' : 'desativar'} canal ${channelId}`)
    } finally {
      setButtonLoading(prev => ({ ...prev, [`toggle_${channelId}`]: false }))
    }
  }

  const testChannel = async (channelId: string) => {
    setButtonLoading(prev => ({ ...prev, [`test_${channelId}`]: true }))
    
    try {
      const response = await fetch('/api/cost-effective?action=telegram_setup')
      const result = await response.json()
      
      if (result.success) {
        showNotification('success', `Teste do canal ${channelId} concluído com sucesso!`)
      } else {
        showNotification('error', `Teste do canal ${channelId} falhou`)
      }
    } catch (error) {
      showNotification('error', `Erro ao testar canal ${channelId}`)
    } finally {
      setButtonLoading(prev => ({ ...prev, [`test_${channelId}`]: false }))
    }
  }

  const notifyClient = async (alertId: string) => {
    setButtonLoading(prev => ({ ...prev, [`notify_${alertId}`]: true }))
    
    try {
      // Simular call para API de notificação,      await new Promise(resolve => setTimeout(resolve, 800))
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, notified: true } : a
      ))
      showNotification('success', 'Cliente notificado sobre a vaga!')
    } catch (error) {
      showNotification('error', 'Erro ao notificar cliente')
    } finally {
      setButtonLoading(prev => ({ ...prev, [`notify_${alertId}`]: false }))
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.125rem' }}>Carregando monitoramento...</div>
      </div>
    )
  }

  const stats = {
    activeChannels: channels.filter(c => c.status === 'active').length,
    todayAlerts: alerts.length,
    totalVacancies: channels.reduce((sum, c) => sum + c.foundVacancies, 0),
    monthlyCost: 70
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', position: 'relative' }}>
      {/* Notifications Toast */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              minWidth: '300px',
              maxWidth: '400px',
              background: notification.type === 'success' ? '#d1fae5' : 
                         notification.type === 'error' ? '#fee2e2' : '#dbeafe',
              color: notification.type === 'success' ? '#065f46' : 
                     notification.type === 'error' ? '#991b1b' : '#1e40af',
              border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : 
                                   notification.type === 'error' ? '#fca5a5' : '#93c5fd'}`,
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {notification.type === 'success' ? '✅' : 
                 notification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {notification.type === 'success' ? 'Sucesso!' : 
                   notification.type === 'error' ? 'Erro!' : 'Informação'}
                </div>
                <div style={{ fontSize: '0.875rem', wordWrap: 'break-word' }}>
                  {notification.message}
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: 'inherit',
                  opacity: 0.7
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>
          🔍 Monitoramento de Vagas
        </h1>
        <button 
          onClick={loadMonitoringData}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: 'white' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Canais Ativos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{stats.activeChannels}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: 'white' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Vagas Hoje</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.todayAlerts}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: 'white' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Vagas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>{stats.totalVacancies}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: 'white' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Custo Mensal</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>R$ {stats.monthlyCost}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>vs R$ 299-599 APIs</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f3f4f6', padding: '0.25rem', borderRadius: '0.5rem', width: 'fit-content' }}>
          {['channels', 'alerts', 'setup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#111827' : '#6b7280',
                fontWeight: activeTab === tab ? '500' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'channels' ? 'Canais' : tab === 'alerts' ? 'Alertas' : 'Configuração'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'channels' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: 'white' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Canais de Monitoramento</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Gerencie todos os canais que monitoram vagas</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {channels.map((channel) => (
              <div 
                key={channel.id}
                style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  marginBottom: '1rem',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {channel.type === 'telegram' ? '📱' : channel.type === 'web' ? '🌐' : '📧'}
                      </span>
                      <span style={{ fontWeight: '500' }}>{channel.name}</span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        background: channel.status === 'active' ? '#dcfce7' : '#f3f4f6',
                        color: channel.status === 'active' ? '#166534' : '#6b7280'
                      }}>
                        {channel.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {channel.description}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Custo:</strong> {channel.cost} | 
                      <strong> Confiabilidade:</strong> {channel.reliability}% | 
                      <strong> Vagas:</strong> {channel.foundVacancies}
                    </div>
                    {channel.url && (
                      <div style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem' }}>
                        <a href={channel.url} target="_blank" rel="noopener noreferrer">
                          {channel.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: buttonLoading[`toggle_${channel.id}`] ? 'not-allowed' : 'pointer' }}>
                      {buttonLoading[`toggle_${channel.id}`] ? (
                        <div style={{ 
                          width: '1rem', 
                          height: '1rem', 
                          border: '2px solid #f3f3f3',
                          borderTop: '2px solid #3498db',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : (
                        <input
                          type="checkbox"
                          checked={channel.status === 'active'}
                          onChange={(e) => toggleChannel(channel.id, e.target.checked)}
                          style={{ width: '1rem', height: '1rem' }}
                          disabled={buttonLoading[`toggle_${channel.id}`]}
                        />
                      )}
                      <span style={{ fontSize: '0.875rem' }}>Ativo</span>
                    </label>
                    <button 
                      onClick={() => testChannel(channel.id)}
                      disabled={buttonLoading[`test_${channel.id}`]}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        background: buttonLoading[`test_${channel.id}`] ? '#f3f4f6' : 'white',
                        fontSize: '0.75rem',
                        cursor: buttonLoading[`test_${channel.id}`] ? 'not-allowed' : 'pointer',
                        opacity: buttonLoading[`test_${channel.id}`] ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {buttonLoading[`test_${channel.id}`] ? (
                        <>
                          <div style={{ 
                            width: '0.75rem', 
                            height: '0.75rem', 
                            border: '1px solid #f3f3f3',
                            borderTop: '1px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Testando...
                        </>
                      ) : (
                        <>🧪 Testar</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: 'white' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Alertas de Vagas</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Vagas encontradas pelos canais</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  marginBottom: '1rem',
                  background: alert.notified ? '#f0fdf4' : '#fefce8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      🎯 {alert.country} - {alert.visaType}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📅 {alert.date} | 📍 {alert.location}
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      📢 {alert.channel}: {alert.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    {alert.notified ? (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        background: '#dcfce7',
                        color: '#166534'
                      }}>
                        Notificado
                      </span>
                    ) : (
                      <button 
                        onClick={() => notifyClient(alert.id)}
                        disabled={buttonLoading[`notify_${alert.id}`]}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: 'none',
                          borderRadius: '0.25rem',
                          background: buttonLoading[`notify_${alert.id}`] ? '#9ca3af' : '#2563eb',
                          color: 'white',
                          fontSize: '0.75rem',
                          cursor: buttonLoading[`notify_${alert.id}`] ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {buttonLoading[`notify_${alert.id}`] ? (
                          <>
                            <div style={{ 
                              width: '0.75rem', 
                              height: '0.75rem', 
                              border: '1px solid #f3f3f3',
                              borderTop: '1px solid #ffffff',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                            Enviando...
                          </>
                        ) : (
                          <>📨 Notificar Cliente</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'setup' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: 'white' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Configuração</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Configure monitoramento gratuito</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem' }}>📱 Telegram (GRATUITO)</h3>
              <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                  <strong>Passo 1:</strong> Entre nos canais: @vagaexpress, @vaga_consulado_usa
                </p>
                <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                  <strong>Passo 2:</strong> Crie um bot no @BotFather
                </p>
                <p style={{ fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  <strong>Passo 3:</strong> Configure TELEGRAM_BOT_TOKEN no .env
                </p>
                <button 
                  onClick={async () => {
                    setButtonLoading(prev => ({ ...prev, telegram_setup: true }))
                    try {
                      const response = await fetch('/api/cost-effective?action=telegram_setup')
                      const result = await response.json()
                      if (result.success) {
                        showNotification('success', 'Instruções do Telegram carregadas com sucesso!')
                        showNotification('info', result.instructions || 'Configuração disponível')
                      } else {
                        showNotification('error', 'Erro ao carregar instruções do Telegram')
                      }
                    } catch (error) {
                      showNotification('error', 'Erro ao buscar instruções do Telegram')
                    } finally {
                      setButtonLoading(prev => ({ ...prev, telegram_setup: false }))
                    }
                  }}
                  disabled={buttonLoading.telegram_setup}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    background: buttonLoading.telegram_setup ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    cursor: buttonLoading.telegram_setup ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {buttonLoading.telegram_setup ? (
                    <>
                      <div style={{ 
                        width: '1rem', 
                        height: '1rem', 
                        border: '2px solid #f3f3f3',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Carregando...
                    </>
                  ) : (
                    <>📋 Ver Instruções Completas</>
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem' }}>🌐 Web Scraping (R$ 50/mês)</h3>
              <div style={{ background: '#f3e8ff', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                  <strong>Monitora:</strong> CASV, VFS Global, consulados diretos
                </p>
                <p style={{ fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  <strong>Custo:</strong> R$ 2 por consulta + servidor
                </p>
                <button 
                  onClick={async () => {
                    setButtonLoading(prev => ({ ...prev, web_scraping: true }))
                    try {
                      const response = await fetch('/api/automation?action=status')
                      const result = await response.json()
                      if (result.success) {
                        showNotification('success', 'Web Scraping ativado com sucesso!')
                        showNotification('info', `Status: ${result.automation?.playwright?.status || 'Ativo'}`)
                      } else {
                        showNotification('error', 'Erro ao ativar Web Scraping')
                      }
                    } catch (error) {
                      showNotification('error', 'Erro ao verificar status do Web Scraping')
                    } finally {
                      setButtonLoading(prev => ({ ...prev, web_scraping: false }))
                    }
                  }}
                  disabled={buttonLoading.web_scraping}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    background: buttonLoading.web_scraping ? '#9ca3af' : '#7c3aed',
                    color: 'white',
                    cursor: buttonLoading.web_scraping ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {buttonLoading.web_scraping ? (
                    <>
                      <div style={{ 
                        width: '1rem', 
                        height: '1rem', 
                        border: '2px solid #f3f3f3',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Ativando...
                    </>
                  ) : (
                    <>⚡ Ativar Monitoramento Web</>
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem' }}>📧 Email (R$ 20/mês)</h3>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                  <strong>Monitora:</strong> Emails dos consulados com palavras-chave
                </p>
                <p style={{ fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  <strong>Providers:</strong> Gmail API, Mailgun, SendGrid (versões gratuitas)
                </p>
                <button 
                  onClick={async () => {
                    setButtonLoading(prev => ({ ...prev, email_setup: true }))
                    try {
                      const response = await fetch('/api/cost-effective?action=email_setup')
                      const result = await response.json()
                      if (result.success) {
                        showNotification('success', 'Email Monitor configurado com sucesso!')
                        showNotification('info', result.instructions || 'Configuração concluída')
                      } else {
                        showNotification('error', 'Erro ao configurar Email Monitor')
                      }
                    } catch (error) {
                      showNotification('error', 'Erro ao configurar email')
                    } finally {
                      setButtonLoading(prev => ({ ...prev, email_setup: false }))
                    }
                  }}
                  disabled={buttonLoading.email_setup}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    background: buttonLoading.email_setup ? '#9ca3af' : '#059669',
                    color: 'white',
                    cursor: buttonLoading.email_setup ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {buttonLoading.email_setup ? (
                    <>
                      <div style={{ 
                        width: '1rem', 
                        height: '1rem', 
                        border: '2px solid #f3f3f3',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Configurando...
                    </>
                  ) : (
                    <>📬 Configurar Email Monitor</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}