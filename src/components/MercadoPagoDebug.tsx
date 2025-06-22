'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'

interface MercadoPagoDebugProps {
  preferenceId: string
  publicKey: string
  onBack?: () => void
  amount: number
  customerData: {
    name: string
    email: string
    phone: string
  }
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoDebug({
  preferenceId,
  publicKey,
  onBack,
  amount,
  customerData
}: MercadoPagoDebugProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const addDebug = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addDebug('🔄 Iniciando componente')
    loadMercadoPago()
  }, [])

  const loadMercadoPago = async () => {
    try {
      addDebug('📝 Verificando SDK existente...')
      
      // Verificar se SDK já existe
      if (window.MercadoPago) {
        addDebug('✅ SDK já carregado, inicializando...')
        await initializeMercadoPago()
        return
      }

      addDebug('🔄 Carregando SDK do MercadoPago...')
      
      const script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true
      
      script.onload = async () => {
        addDebug('✅ SDK carregado com sucesso')
        await initializeMercadoPago()
      }
      
      script.onerror = (error) => {
        addDebug(`❌ Erro ao carregar SDK: ${error}`)
        setError('Falha ao carregar SDK')
        setLoading(false)
      }

      document.head.appendChild(script)

    } catch (error) {
      addDebug(`❌ Erro geral: ${error}`)
      setError('Erro na inicialização')
      setLoading(false)
    }
  }

  const initializeMercadoPago = async () => {
    try {
      addDebug('🔧 Inicializando MercadoPago...')
      
      if (!window.MercadoPago) {
        throw new Error('MercadoPago SDK não disponível')
      }

      addDebug(`🔑 Usando chave pública: ${publicKey}`)
      
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      })

      addDebug('🧱 Criando bricks builder...')
      const bricksBuilder = mp.bricks()

      const container = containerRef.current
      if (!container) {
        throw new Error('Container não encontrado')
      }

      addDebug('🗑️ Limpando container...')
      container.innerHTML = ''

      addDebug('🎯 Configurando payment brick...')
      
      const config = {
        initialization: {
          amount: amount,
          preferenceId: preferenceId,
          payer: {
            firstName: customerData.name.split(' ')[0] || 'Teste',
            lastName: customerData.name.split(' ').slice(1).join(' ') || 'Visa2Any',
            email: customerData.email,
            entityType: 'individual'
          }
        },
        customization: {
          visual: {
            style: {
              theme: 'default'
            }
          }
        },
        callbacks: {
          onReady: () => {
            addDebug('✅ Payment Brick está pronto!')
            setLoading(false)
          },
          onSubmit: async (data: any) => {
            addDebug(`💳 Submissão recebida: ${JSON.stringify(data)}`)
            // Simular sucesso por enquanto
            addDebug('✅ Pagamento processado (simulado)')
          },
          onError: (error: any) => {
            addDebug(`❌ Erro do brick: ${JSON.stringify(error)}`)
            setError(`Erro: ${error.message || error}`)
          }
        }
      }

      addDebug(`📋 Configuração: ${JSON.stringify(config, null, 2)}`)

      addDebug('🏗️ Criando payment brick...')
      await bricksBuilder.create('payment', 'debug-container', config)
      
      addDebug('🎉 Payment brick criado com sucesso!')

    } catch (error) {
      addDebug(`❌ Erro na inicialização: ${error}`)
      setError(`Erro: ${error}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🧪 MercadoPago Debug
            </h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Dados do Teste:</h3>
              <ul className="text-sm text-blue-800">
                <li>Valor: R$ {amount.toFixed(2)}</li>
                <li>Preference ID: {preferenceId}</li>
                <li>Cliente: {customerData.name}</li>
                <li>Email: {customerData.email}</li>
              </ul>
            </div>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando MercadoPago...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-semibold">❌ Erro:</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Recarregar
                </button>
              </div>
            )}
            
            <div
              id="debug-container"
              ref={containerRef}
              className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4"
              style={{
                background: 'white'
              }}
            />
          </div>

          {/* Debug Log */}
          <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm">
            <h3 className="text-white font-bold mb-4">🔍 Debug Log:</h3>
            <div className="max-h-96 overflow-y-auto space-y-1">
              {debugInfo.map((info, index) => (
                <div key={index} className="break-words">
                  {info}
                </div>
              ))}
              {debugInfo.length === 0 && (
                <div className="text-gray-500">Aguardando logs...</div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-white font-semibold mb-2">Variáveis Globais:</h4>
              <div className="text-xs">
                <div>window.MercadoPago: {window.MercadoPago ? '✅ Carregado' : '❌ Não encontrado'}</div>
                <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
                <div>Domínio: {window.location.hostname}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}