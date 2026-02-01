import { Suspense } from 'react'
import AIConsultation from '@/components/AIConsultation'
import Breadcrumb from '@/components/Breadcrumb'
import FloatingAffiliateBanner from '@/components/FloatingAffiliateBanner'
import { generateSEOMetadata } from '@/components/SEOOptimizer'

export const metadata = generateSEOMetadata({
  title: 'Pré-Análise com IA - Análise de Elegibilidade para Imigração | Visa2Any',
  description: 'Pré-análise profissional com nossa IA especializada. Receba análise completa de elegibilidade, documentos necessários e estratégia personalizada para sua imigração.',
  keywords: ['consultoria IA', 'elegibilidade imigração', 'pré-análise', 'inteligência artificial visto', 'consultoria online'],
  openGraph: {
    title: 'Pré-Análise com IA - Análise Especializada e Rápida',
    description: 'Nossa IA Sofia analisa seu perfil e fornece relatório completo sobre suas chances de imigração. Apenas R$ 29,90 e instantâneo.',
    type: 'website'
  }
})

export default function ConsultoriaIAPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Pré-Análise</span> com IA
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              15 minutos de análise inicial com nossa IA Sofia.
              Receba uma visão geral das suas chances de imigração.
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-2">IA Especializada</h3>
                <p className="text-sm text-gray-600">Algoritmo treinado com 10,000+ casos</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">⏱️</div>
                <h3 className="font-semibold text-gray-900 mb-2">15 Minutos</h3>
                <p className="text-sm text-gray-600">Pré-análise rápida e eficiente</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Score Preciso</h3>
                <p className="text-sm text-gray-600">95% de precisão em predições</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-semibold text-gray-900 mb-2">Relatório PDF</h3>
                <p className="text-sm text-gray-600">Análise completa para download</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Consultation Area */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando assistente IA...</p>
          </div>}>
            <AIConsultation />
          </Suspense>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que nossa IA é diferente?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sofia foi treinada especificamente para casos de imigração brasileira,
              com dados reais e atualizações constantes das leis internacionais.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inteligência Especializada</h3>
              <p className="text-gray-600">
                Treinada com casos reais de imigração brasileira para 50+ países,
                com atualizações constantes das mudanças nas leis.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Análise Instantânea</h3>
              <p className="text-gray-600">
                Processamento em tempo real de mais de 50 variáveis do seu perfil,
                fornecendo resultados precisos em minutos.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recomendações Práticas</h3>
              <p className="text-gray-600">
                Não apenas análise, mas um plano de ação detalhado com próximos passos
                e estratégias personalizadas para seu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Escalation to Human */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Caso Complexo?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Se nossa IA identificar que seu caso precisa de atenção especializada,
            você será automaticamente direcionado para consultoria com nossos especialistas humanos.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">🤖 IA Recomenda</h3>
              <p className="text-orange-100 text-sm">
                Casos simples e moderados recebem plano completo da IA
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">👨‍💼 Humano Necessário</h3>
              <p className="text-orange-100 text-sm">
                Casos complexos são escalados para especialistas sênior
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dados que Comprovam nossa Eficácia
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Precisão da IA</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Casos Analisados</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Países Cobertos</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Flutuante de Afiliados */}
      <FloatingAffiliateBanner />
    </div>
  )
}