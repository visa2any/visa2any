'use client'

import { useState } from 'react'
import {
    X, Lock, Bell, Globe, Moon, Shield, Save,
    Smartphone, Mail, MessageCircle, AlertTriangle
} from 'lucide-react'
import { useSystemNotifications } from '@/hooks/useSystemNotifications'

interface ClientSettingsProps {
    isOpen: boolean
    onClose: () => void
}

type SettingsTab = 'security' | 'notifications' | 'preferences'

export default function ClientSettings({ isOpen, onClose }: ClientSettingsProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('security')
    const [isLoading, setIsLoading] = useState(false)
    const { notifySuccess } = useSystemNotifications()

    // Mock State
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        whatsapp: true,
        marketing: false
    })

    // Mock Password State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    })

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        notifySuccess('Configurações Salvas', 'Suas preferências foram atualizadas com sucesso.')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Configurações</h2>
                        <p className="text-xs text-gray-500 mt-1">Gerencie sua conta</p>
                    </div>
                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Lock className="h-4 w-4" />
                            Segurança
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Bell className="h-4 w-4" />
                            Notificações
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Globe className="h-4 w-4" />
                            Preferências
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {activeTab === 'security' && 'Segurança e Senha'}
                            {activeTab === 'notifications' && 'Preferências de Notificação'}
                            {activeTab === 'preferences' && 'Configurações Gerais'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white">

                        {/* --- SECURITY TAB --- */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 max-w-lg">
                                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                                    <Shield className="h-5 w-5 flex-shrink-0" />
                                    <p>Sua conta está protegida com criptografia de ponta a ponta.</p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Alterar Senha</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Senha Atual</label>
                                        <input
                                            type="password"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="••••••••"
                                            value={passwords.current}
                                            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Nova Senha</label>
                                        <input
                                            type="password"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="••••••••"
                                            value={passwords.new}
                                            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                                        <input
                                            type="password"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="••••••••"
                                            value={passwords.confirm}
                                            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- NOTIFICATIONS TAB --- */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 border-b pb-2">Canais de Comunicação</h4>

                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Notificações por Email</p>
                                                <p className="text-xs text-gray-500">Receba atualizações do seu processo.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                <MessageCircle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Notificações por WhatsApp</p>
                                                <p className="text-xs text-gray-500">Alertas urgentes e agendamentos.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.whatsapp} onChange={() => setNotifications({ ...notifications, whatsapp: !notifications.whatsapp })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                                <Smartphone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Notificações por SMS</p>
                                                <p className="text-xs text-gray-500">Códigos de segurança e avisos.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- PREFERENCES TAB --- */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6 max-w-lg">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Região e Idioma</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Idioma</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option>Português (Brasil)</option>
                                            <option>English (US)</option>
                                            <option>Español</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Moeda</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option>Real (BRL)</option>
                                            <option>Dólar Americano (USD)</option>
                                            <option>Euro (EUR)</option>
                                        </select>
                                    </div>

                                    <div className="pt-6 border-t mt-6">
                                        <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            Zona de Perigo
                                        </h4>
                                        <p className="text-xs text-gray-600 mb-3">
                                            A exclusão da sua conta é permanente e removerá todos os seus dados e progresso.
                                        </p>
                                        <button className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Excluir Conta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            {!isLoading && <Save className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
