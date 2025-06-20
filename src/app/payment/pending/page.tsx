'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, ArrowLeft, MessageCircle, Copy } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

function PendingContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const [copied, setCopied] = useState(false)

  const copyPixCode = () => {
    // Em uma implementação real, este código PIX viria da API
    const pixCode = '00020126580014br.gov.bcb.pix013636401234-1234-1234-1234-123456789abc5204000053039865802BR5913VISA2ANY LTDA6009SAO PAULO62070503***6304ABCD'
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ⏳ Pagamento Pendente
        </h1>
        
        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. Isso é normal para alguns métodos de pagamento.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">O que fazer agora:</h3>
          <ul className="text-sm text-yellow-700 text-left space-y-2">
            <li>🔸 <strong>PIX:</strong> Escaneie o QR Code ou copie o código PIX</li>
            <li>🔸 <strong>Boleto:</strong> Pague até a data de vencimento</li>
            <li>🔸 <strong>Cartão:</strong> Aguarde a aprovação (até 48h)</li>
          </ul>
        </div>

        {/* Simulação de código PIX - em produção viria da API */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-white p-2 rounded border flex-1 truncate">
              00020126580014br.gov.bcb.pix...
            </code>
            <button
              onClick={copyPixCode}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
              title="Copiar código PIX"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-xs mt-1">✅ Código copiado!</p>
          )}
        </div>

        <div className="space-y-3">
          <a
            href="https://wa.me/5511519447117?text=Olá! Fiz um pagamento que está pendente e gostaria de verificar o status"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Verificar Status no WhatsApp
          </a>
          
          <Link
            href="/cliente"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors block"
          >
            Acessar Área do Cliente
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p><strong>📱 Acompanhe pelo WhatsApp:</strong></p>
          <p>Enviaremos atualizações sobre seu pagamento</p>
          <div className="mt-2">
            <p>📱 WhatsApp: (11) 5194-4717</p>
            <p>📧 Email: info@visa2any.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p>Carregando status...</p>
        </div>
      </div>
    }>
      <title>Pagamento Pendente - Visa2Any</title>
      <meta name="robots" content="noindex, nofollow" />
      <PendingContent />
    </Suspense>
  )
}