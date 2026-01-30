'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react'
import Link from 'next/link'

function FailureContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const paymentId = searchParams.get('payment_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ❌ Pagamento Não Aprovado
        </h1>

        <p className="text-gray-600 mb-6">
          Ops! Seu pagamento não pôde ser processado. Isso pode acontecer por diversos motivos.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Possíveis causas:</h3>
          <ul className="text-sm text-red-700 text-left space-y-1">
            <li>• Saldo insuficiente</li>
            <li>• Dados do cartão incorretos</li>
            <li>• Cartão bloqueado</li>
            <li>• Limite excedido</li>
            <li>• Problema temporário</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/checkout-moderno?product=consultoria-express"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Tentar Novamente
          </Link>

          <a
            href="https://wa.me/5511519447117?text=Olá! Tive problema no pagamento e gostaria de ajuda"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar no WhatsApp
          </a>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p><strong>💡 Dica:</strong> Experimente usar PIX para pagamento instantâneo!</p>
          <div className="mt-3">
            <p>📱 WhatsApp: (11) 5194-4717</p>
            <p>📧 Email: visa2any@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    }>
      <title>Pagamento Não Aprovado - Visa2Any</title>
      <meta name="robots" content="noindex, nofollow" />
      <FailureContent />
    </Suspense>
  )
}