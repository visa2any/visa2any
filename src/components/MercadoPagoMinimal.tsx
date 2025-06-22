'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard } from 'lucide-react'

interface MercadoPagoMinimalProps {
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

export default function MercadoPagoMinimal({
  preferenceId,
  publicKey,
  onBack,
  amount,
  customerData
}: MercadoPagoMinimalProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Log inicial
    console.log('🚀 Iniciando MercadoPago Minimal')
    console.log('📝 Dados recebidos:', { preferenceId, publicKey, amount, customerData })
    
    loadAndInit()
  }, [])

  const loadAndInit = async () => {
    try {
      console.log('1️⃣ Verificando SDK...')
      
      // Carregar SDK se necessário
      if (!window.MercadoPago) {
        console.log('2️⃣ Carregando SDK...')
        await loadScript()
      } else {
        console.log('2️⃣ SDK já carregado')
      }

      console.log('3️⃣ Inicializando MercadoPago...')
      
      // Aguardar container estar pronto
      if (!containerRef.current) {
        console.log('❌ Container não encontrado')
        setError('Container não encontrado')
        return
      }

      // Limpar container
      containerRef.current.innerHTML = ''

      // Inicializar MP
      const mp = new window.MercadoPago(publicKey)
      console.log('4️⃣ MercadoPago inicializado')

      // Criar bricks
      const bricks = mp.bricks()
      console.log('5️⃣ Bricks criado')

      // Configuração ULTRA BÁSICA
      const settings = {
        initialization: {
          amount: amount,
          preferenceId: preferenceId
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Brick ready!')
            setLoading(false)
          },
          onSubmit: (data: any) => {
            console.log('💰 Payment submitted:', data)
            alert('Pagamento recebido! (simulado)')
          },
          onError: (error: any) => {
            console.error('❌ Brick error:', error)
            setError(`Erro: ${error.message || JSON.stringify(error)}`)
          }
        }
      }

      console.log('6️⃣ Configuração:', settings)
      console.log('7️⃣ Criando payment brick...')

      // Criar o brick
      await bricks.create('payment', 'minimal-mp-container', settings)
      
      console.log('🎉 Payment brick criado com sucesso!')

    } catch (error) {
      console.error('❌ Erro geral:', error)
      setError(`Erro: ${error}`)
      setLoading(false)
    }
  }

  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Remover scripts existentes
      const existingScripts = document.querySelectorAll('script[src*="mercadopago"]')
      existingScripts.forEach(script => script.remove())

      const script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true
      
      script.onload = () => {
        console.log('📦 SDK carregado')
        resolve()
      }
      
      script.onerror = () => {
        console.error('❌ Erro ao carregar SDK')
        reject(new Error('Falha no SDK'))
      }

      document.head.appendChild(script)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold">Pagamento Teste</h1>
              <p className="text-gray-600">R$ {amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Carregando MercadoPago...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Recarregar
              </button>
            </div>
          )}
          
          <div
            id="minimal-mp-container"
            ref={containerRef}
            className="min-h-[300px] border border-gray-200 rounded p-4"
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🧪 Versão Minimal para Debug</p>
          <p>Preference: {preferenceId}</p>
          <p>Public Key: {publicKey?.slice(0, 20)}...</p>
        </div>
      </div>
    </div>
  )
}