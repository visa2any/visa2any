'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, Globe, Settings, Save, RefreshCw, AlertTriangle,
  Info, Check, X, Plus, Trash2, Edit3, ExternalLink
} from 'lucide-react'

interface ConsularFee {
  country: string
  visaFee: number
  serviceFee: number
  biometricFee?: number
  additionalFees?: number
  currency: string
  paymentMethods: string[]
  officialPaymentUrl?: string
  isActive: boolean
}

export default function HybridSettingsPage() {
  const [fees, setFees] = useState<ConsularFee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCountry, setEditingCountry] = useState<string | null>(null)
  const [showAddNew, setShowAddNew] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/hybrid-settings')
      if (response.ok) {
        const data = await response.json()
        setFees(data.fees || getDefaultFees())
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      setFees(getDefaultFees())
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/hybrid-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fees })
      })

      if (response.ok) {
        alert('Configurações salvas com sucesso!')
      } else {
        alert('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const updateFee = (country: string, field: string, value: any) => {
    setFees(prev => prev.map(fee => 
      fee.country === country 
        ? { ...fee, [field]: value }
        : fee
    ))
  }

  const addNewCountry = () => {
    const newCountry: ConsularFee = {
      country: 'NOVO_PAIS',
      visaFee: 0,
      serviceFee: 150,
      currency: 'BRL',
      paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
      isActive: true
    }
    setFees(prev => [...prev, newCountry])
    setEditingCountry('NOVO_PAIS')
    setShowAddNew(false)
  }

  const removeCountry = (country: string) => {
    if (confirm(`Remover configurações para ${country}?`)) {
      setFees(prev => prev.filter(fee => fee.country !== country))
    }
  }

  const getDefaultFees = (): ConsularFee[] => [
    {
      country: 'EUA',
      visaFee: 950,
      serviceFee: 150,
      currency: 'BRL',
      paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
      officialPaymentUrl: 'https://ais.usvisa-info.com/pt-br/niv/users/payment',
      isActive: true
    },
    {
      country: 'CANADA',
      visaFee: 380,
      serviceFee: 200,
      biometricFee: 320,
      additionalFees: 95,
      currency: 'BRL',
      paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
      officialPaymentUrl: 'https://visa.vfsglobal.com/bra/pt/can/pay-fees',
      isActive: true
    },
    {
      country: 'REINO_UNIDO',
      visaFee: 650,
      serviceFee: 180,
      biometricFee: 125,
      additionalFees: 120,
      currency: 'BRL',
      paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
      officialPaymentUrl: 'https://uk.tlscontact.com/br/sao/payment',
    isActive: true
    },
    {
      country: 'FRANCA',
      visaFee: 480,
      serviceFee: 160,
      biometricFee: 120,
      additionalFees: 100,
      currency: 'BRL',
      paymentMethods: ['PIX', 'CARTAO', 'BOLETO'],
      officialPaymentUrl: 'https://france-visas.gouv.fr/payment',
    isActive: true
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="text-gray-700 mt-4 font-medium">Carregando Configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <span>Configurações Híbridas</span>
              </h1>
              <p className="text-gray-600 mt-1">Gerencie taxas consulares e configurações de pagamento</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Recarregar</span>
              </button>
              
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Tudo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Como Funciona o Sistema Híbrido</h3>
              <div className="text-blue-800 text-sm space-y-1">
                <p>• <strong>Cliente paga:</strong> Taxa Consular + Nossa Taxa de Serviço</p>
                <p>• <strong>Consultor recebe alerta:</strong> Agendamento manual necessário</p>
                <p>• <strong>Multiplicadores por plano:</strong> Basic (1x), Premium (2.2x), VIP (3x)</p>
                <p>• <strong>Desconto PIX:</strong> 5% sobre taxa total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Adicionar País */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddNew(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Novo País</span>
          </button>
        </div>

        {/* Lista de Países */}
        <div className="space-y-6">
          {fees.map((fee, index) => (
            <CountryFeeCard
              key={fee.country}
              fee={fee}
              isEditing={editingCountry === fee.country}
              onEdit={() => setEditingCountry(fee.country)}
              onSave={() => setEditingCountry(null)}
              onCancel={() => {
                setEditingCountry(null)
                loadSettings() // Reload original values              }}
              onUpdate={(field: string, value: any) => updateFee(fee.country, field, value)}
              onRemove={() => removeCountry(fee.country)}
            />
          ))}
        </div>

        {/* Calculadora de Exemplos */}
        <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Calculadora de Valores</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['BASIC', 'PREMIUM', 'VIP'].map(plan => (
              <div key={plan} className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {plan === 'BASIC' ? '🥉' : plan === 'PREMIUM' ? '🥈' : '🥇'} {plan}
                </h4>
                
                <div className="space-y-2 text-sm">
                  {fees.filter(f => f.isActive).map(fee => {
                    const multiplier = plan === 'BASIC' ? 1 : plan === 'PREMIUM' ? 2.2 : 3
                    const serviceFee = Math.round(fee.serviceFee * multiplier)
                    const total = fee.visaFee + serviceFee + (fee.biometricFee || 0) + (fee.additionalFees || 0)
                    const pixTotal = Math.round(total * 0.95)
                    
                    return (
                      <div key={fee.country} className="border-b border-gray-100 pb-2">
                        <div className="font-medium text-gray-900">{fee.country}</div>
                        <div className="text-gray-600">
                          Normal: R$ {total} | PIX: R$ {pixTotal}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente Card de País
function CountryFeeCard({ fee, isEditing, onEdit, onSave, onCancel, onUpdate, onRemove }: any) {
  const [localFee, setLocalFee] = useState(fee)

  useEffect(() => {
    setLocalFee(fee)
  }, [fee])

  const handleSave = () => {
    // Update parent state
    Object.keys(localFee).forEach(key => {
      onUpdate(key, localFee[key])
    })
    onSave()
  }

  const total = localFee.visaFee + localFee.serviceFee + (localFee.biometricFee || 0) + (localFee.additionalFees || 0)
  const pixTotal = Math.round(total * 0.95)

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-blue-600" />
          {isEditing ? (
            <input
              type="text"
              value={localFee.country}
              onChange={(e) => setLocalFee({...localFee, country: e.target.value})}
              className="text-xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <h3 className="text-xl font-bold text-gray-900">{fee.country}</h3>
          )}
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${fee.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">{fee.isActive ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={onCancel}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={onRemove}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remover</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Formulário de Edição */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Taxa do Visto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taxa do Visto</label>
          {isEditing ? (
            <input
              type="number"
              value={localFee.visaFee}
              onChange={(e) => setLocalFee({...localFee, visaFee: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">R$ {fee.visaFee}</div>
          )}
        </div>

        {/* Taxa de Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Serviço (Base)</label>
          {isEditing ? (
            <input
              type="number"
              value={localFee.serviceFee}
              onChange={(e) => setLocalFee({...localFee, serviceFee: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">R$ {fee.serviceFee}</div>
          )}
        </div>

        {/* Taxa Biometria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Biometria (Opcional)</label>
          {isEditing ? (
            <input
              type="number"
              value={localFee.biometricFee || 0}
              onChange={(e) => setLocalFee({...localFee, biometricFee: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">R$ {fee.biometricFee || 0}</div>
          )}
        </div>

        {/* Taxas Extras */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taxas Extras</label>
          {isEditing ? (
            <input
              type="number"
              value={localFee.additionalFees || 0}
              onChange={(e) => setLocalFee({...localFee, additionalFees: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">R$ {fee.additionalFees || 0}</div>
          )}
        </div>
      </div>

      {/* URL de Pagamento Oficial */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">URL de Pagamento Oficial</label>
        {isEditing ? (
          <input
            type="url"
            value={localFee.officialPaymentUrl || ''}
            onChange={(e) => setLocalFee({...localFee, officialPaymentUrl: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="https://..."
          />
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">{fee.officialPaymentUrl || 'Não configurado'}</span>
            {fee.officialPaymentUrl && (
              <a
                href={fee.officialPaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Status Ativo/Inativo */}
      {isEditing && (
        <div className="mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localFee.isActive}
              onChange={(e) => setLocalFee({...localFee, isActive: e.target.checked})}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">País ativo para agendamentos</span>
          </label>
        </div>
      )}

      {/* Resumo de Cálculos */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Valores Finais por Plano:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { plan: 'BASIC', multiplier: 1, emoji: '🥉' },
            { plan: 'PREMIUM', multiplier: 2.2, emoji: '🥈' },
            { plan: 'VIP', multiplier: 3.0, emoji: '🥇' }
          ].map(({ plan, multiplier, emoji }) => {
            const serviceFee = Math.round(fee.serviceFee * multiplier)
            const planTotal = fee.visaFee + serviceFee + (fee.biometricFee || 0) + (fee.additionalFees || 0)
            const planPixTotal = Math.round(planTotal * 0.95)

            return (
              <div key={plan} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-2">{emoji} {plan}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Serviço: R$ {serviceFee}</div>
                  <div className="font-medium">Total: R$ {planTotal}</div>
                  <div className="text-green-600">PIX: R$ {planPixTotal}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}