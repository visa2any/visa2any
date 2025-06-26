'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Database, 
  Key, 
  Palette, 
  Monitor,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit,
  Lock,
  Unlock,
  Server,
  Zap,
  MessageSquare,
  CreditCard,
  FileText,
  Search
} from 'lucide-react'

interface SystemConfig {
  general: {
    siteName: string
    siteUrl: string
    timezone: string
    language: string
    maintenanceMode: boolean
  }
  email: {
    provider: string
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    enabled: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    webhooks: boolean
    slackIntegration: boolean
  }
  security: {
    twoFactorAuth: boolean
    passwordExpiry: number
    maxLoginAttempts: number
    sessionTimeout: number
    ipWhitelist: string[]
  }
  integrations: {
    whatsapp: {
      enabled: boolean
      apiToken: string
      phoneId: string
    }
    stripe: {
      enabled: boolean
      publicKey: string
      secretKey: string
      webhookSecret: string
    }
    aws: {
      enabled: boolean
      accessKey: string
      secretKey: string
      bucket: string
      region: string
    }
  }
  appearance: {
    theme: string
    primaryColor: string
    logo: string
    favicon: string
  }
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      // Simulando dados de configuração,      const mockConfig: SystemConfig = {
        general: {
          siteName: 'Visa2Any Admin',
          siteUrl: 'https://visa2any.com',
          timezone: 'America/Sao_Paulo',
          language: 'pt-BR',
          maintenanceMode: false
        },
        email: {
          provider: 'smtp',
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'admin@visa2any.com',
          smtpPassword: '••••••••',
          fromEmail: 'noreply@visa2any.com',
          fromName: 'Visa2Any',
          enabled: true
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          webhooks: false,
          slackIntegration: false
        },
        security: {
          twoFactorAuth: true,
          passwordExpiry: 90,
          maxLoginAttempts: 5,
          sessionTimeout: 1440,
          ipWhitelist: ['192.168.1.1', '10.0.0.1']
        },
        integrations: {
          whatsapp: {
            enabled: false,
            apiToken: '',
            phoneId: ''
          },
          stripe: {
            enabled: true,
            publicKey: 'pk_test_••••••••',
            secretKey: 'sk_test_••••••••',
            webhookSecret: 'whsec_••••••••'
          },
          aws: {
            enabled: true,
            accessKey: 'AKIA••••••••',
            secretKey: '••••••••',
            bucket: 'visa2any-documents',
            region: 'us-east-1'
          }
        },
        appearance: {
          theme: 'light',
          primaryColor: '#3b82f6',
          logo: '/logo.png',
          favicon: '/favicon.ico'
        }
      }
      
      setConfig(mockConfig)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento,      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'integrations', label: 'Integrações', icon: Zap },
    { id: 'appearance', label: 'Aparência', icon: Palette }
  ]

  if (isLoading || !config) {
    return (
      <div className="gradient-admin min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 loading-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded w-64 loading-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg loading-shimmer"></div>
                ))}
              </div>
              <div className="lg:col-span-3">
                <div className="card-elevated p-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 loading-shimmer"></div>
                        <div className="h-10 bg-gray-100 rounded loading-shimmer"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-admin min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-heading text-3xl text-readable mb-2">
                Configurações do Sistema
              </h1>
              <p className="text-readable-muted">
                Gerencie todas as configurações e integrações da plataforma
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Salvo com sucesso</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Erro ao salvar</span>
                </div>
              )}
              <button
                onClick={saveConfig}
                disabled={isSaving}
                className="btn-primary hover-lift flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="animate-slide-in">
            <div className="card-elevated p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-readable hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 animate-fade-in">
            <div className="card-elevated p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-readable mb-4">Configurações Gerais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Nome do Site
                        </label>
                        <input
                          type="text"
                          value={config.general.siteName}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            general: { ...prev.general, siteName: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          URL do Site
                        </label>
                        <input
                          type="url"
                          value={config.general.siteUrl}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            general: { ...prev.general, siteUrl: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Fuso Horário
                        </label>
                        <select
                          value={config.general.timezone}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            general: { ...prev.general, timezone: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        >
                          <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
                          <option value="America/New_York">Nova York (UTC-5)</option>
                          <option value="Europe/London">Londres (UTC+0)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Idioma
                        </label>
                        <select
                          value={config.general.language}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            general: { ...prev.general, language: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.general.maintenanceMode}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            general: { ...prev.general, maintenanceMode: e.target.checked }
                          } : null)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-readable">Modo de Manutenção</span>
                          <p className="text-xs text-readable-muted">Ativa uma página de manutenção para todos os usuários</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-readable mb-4">Configurações de Email</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Servidor SMTP
                        </label>
                        <input
                          type="text"
                          value={config.email.smtpHost}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, smtpHost: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Porta SMTP
                        </label>
                        <input
                          type="number"
                          value={config.email.smtpPort}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Usuário SMTP
                        </label>
                        <input
                          type="email"
                          value={config.email.smtpUser}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, smtpUser: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Senha SMTP
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.smtp ? 'text' : 'password'}
                            value={config.email.smtpPassword}
                            onChange={(e) => setConfig(prev => prev ? {
                              ...prev,
                              email: { ...prev.email, smtpPassword: e.target.value }
                            } : null)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('smtp')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.smtp ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Email Remetente
                        </label>
                        <input
                          type="email"
                          value={config.email.fromEmail}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, fromEmail: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Nome Remetente
                        </label>
                        <input
                          type="text"
                          value={config.email.fromName}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, fromName: e.target.value }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.email.enabled}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            email: { ...prev.email, enabled: e.target.checked }
                          } : null)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-readable">Habilitar Envio de Emails</span>
                          <p className="text-xs text-readable-muted">Permite o envio de emails automáticos pelo sistema</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-readable mb-4">Configurações de Notificações</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          key: 'emailNotifications', 
                          label: 'Notificações por Email', 
                          description: 'Enviar notificações importantes por email',
                          icon: Mail
                        },
                        { 
                          key: 'smsNotifications', 
                          label: 'Notificações por SMS', 
                          description: 'Enviar notificações urgentes por SMS',
                          icon: MessageSquare
                        },
                        { 
                          key: 'pushNotifications', 
                          label: 'Notificações Push', 
                          description: 'Notificações push no navegador',
                          icon: Bell
                        },
                        { 
                          key: 'webhooks', 
                          label: 'Webhooks', 
                          description: 'Enviar eventos para URLs externas',
                          icon: Globe
                        },
                        { 
                          key: 'slackIntegration', 
                          label: 'Integração Slack', 
                          description: 'Notificações no Slack',
                          icon: Zap
                        }
                      ].map((notification) => {
                        const Icon = notification.icon
                        return (
                          <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <Icon className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-readable">{notification.label}</div>
                                <div className="text-sm text-readable-muted">{notification.description}</div>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.notifications[notification.key as keyof typeof config.notifications]}
                                onChange={(e) => setConfig(prev => prev ? {
                                  ...prev,
                                  notifications: { 
                                    ...prev.notifications, 
                                    [notification.key]: e.target.checked 
                                  }
                                } : null)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-readable mb-4">Configurações de Segurança</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Expiração de Senha (dias)
                        </label>
                        <input
                          type="number"
                          value={config.security.passwordExpiry}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Máx. Tentativas de Login
                        </label>
                        <input
                          type="number"
                          value={config.security.maxLoginAttempts}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-readable mb-2">
                          Timeout de Sessão (min)
                        </label>
                        <input
                          type="number"
                          value={config.security.sessionTimeout}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                          } : null)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus-ring text-readable"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.security.twoFactorAuth}
                          onChange={(e) => setConfig(prev => prev ? {
                            ...prev,
                            security: { ...prev.security, twoFactorAuth: e.target.checked }
                          } : null)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-readable">Autenticação de Dois Fatores</span>
                          <p className="text-xs text-readable-muted">Exigir 2FA para todos os usuários admin</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Add similar sections for other tabs... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}