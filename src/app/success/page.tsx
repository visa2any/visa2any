'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Download, MessageCircle, Calendar, Zap } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const product = searchParams.get('product') || ''
  const paymentId = searchParams.get('payment_id') || ''
  const orderId = searchParams.get('order_id') || ''

  const isVagaExpress = product.includes('vaga-express')
  const isVip = product.includes('vip')
  const isPremium = product.includes('premium')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto">

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">

          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Pagamento Confirmado!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Parabéns! Sua compra foi processada com sucesso e você já tem acesso aos seus benefícios.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">📋 Detalhes da Compra</h3>
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID do Pagamento:</span>
                  <span className="font-mono">{paymentId}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Data da Compra:</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">✅ Confirmado</span>
              </div>
            </div>
          </div>

          {/* Next Steps for Vaga Express */}
          {isVagaExpress && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                🚀 Próximos Passos - Vaga Express
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-blue-900">Ativação do Monitoramento</div>
                    <div className="text-sm text-blue-700">Seu serviço será ativado em até 30 minutos</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-blue-900">Configuração de Notificações</div>
                    <div className="text-sm text-blue-700">Você receberá um WhatsApp para confirmar preferências</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-blue-900">Monitoramento 24/7</div>
                    <div className="text-sm text-blue-700">
                      {isVip ? 'Notificação em até 2 minutos' : isPremium ? 'Notificação em até 5 minutos' : 'Notificação em até 15 minutos'}
                    </div>
                  </div>
                </div>
                {isVip && (
                  <div className="flex items-start">
                    <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">👑</div>
                    <div>
                      <div className="font-medium text-purple-900">Consultoria VIP Inclusa</div>
                      <div className="text-sm text-purple-700">Nossa equipe entrará em contato em 24h</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">

            {/* Primary Action */}
            <Link href="/cliente">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Acessar Minha Conta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" />
                Salvar Comprovante
              </Button>

              <Link href="https://wa.me/551151971375?text=Olá! Acabei de comprar o Vaga Express e tenho uma dúvida">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Suporte WhatsApp
                </Button>
              </Link>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <h4 className="font-medium text-yellow-800 mb-2">📧 Informações Importantes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Você receberá um email de confirmação em instantes</li>
              <li>• Seus dados de acesso foram enviados para o email cadastrado</li>
              <li>• Para dúvidas urgentes, use nosso WhatsApp de suporte</li>
              {isVagaExpress && (
                <li>• O monitoramento iniciará automaticamente em até 30 minutos</li>
              )}
            </ul>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Pagamento Seguro
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Dados Protegidos
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Suporte 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <title>Compra Confirmada | Visa2Any</title>
      <meta name="description" content="Sua compra foi confirmada com sucesso. Acesse agora seus benefícios." />
      <meta name="robots" content="noindex, nofollow" />

      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </>
  )
}
