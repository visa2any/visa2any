'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, MessageCircle, Mail } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Pagamento Aprovado!
        </h1>

        <p className="text-gray-600 mb-6">
          Seu pagamento foi processado com sucesso! Você receberá a confirmação por email em alguns minutos.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID do Pagamento:</p>
            <p className="font-mono text-sm">{paymentId}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center text-green-600 bg-green-50 rounded-lg p-3">
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm">Email de confirmação enviado</span>
          </div>

          <div className="flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg p-3">
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">WhatsApp de boas-vindas enviado</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/cliente"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Acessar Área do Cliente
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors block"
          >
            Voltar ao Início
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Dúvidas? Entre em contato:</p>
          <p>📱 WhatsApp: 11-5194-4717</p>
          <p>📧 Email: visa2any@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Processando confirmação...</p>
        </div>
      </div>
    }>
      <title>Pagamento Aprovado - Visa2Any</title>
      <meta name="robots" content="noindex, nofollow" />
      <SuccessContent />
    </Suspense>
  )
}