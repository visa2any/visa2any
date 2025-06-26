import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'
import { ArrowRight, CheckCircle, Globe, FileText, Clock, Shield, Users, Award } from 'lucide-react'

export const metadata = {
  title: 'Assessoria de Vistos - Visa2Any',
  description: 'Serviços especializados em assessoria de vistos para turismo, trabalho, estudo e investimento. Taxa de aprovação de 98%.'
}

export default function VistosPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Assessoria de <span className="text-blue-600">Vistos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Orientação especializada para obtenção de vistos de turismo, trabalho, estudo e investimento. 
              Nossa expertise garante 98% de taxa de aprovação.
            </p>
            <Button className="btn-gradient text-lg px-8 py-4">
              Solicitar Consultoria Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tipos de Vistos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tipos de Vistos que Atendemos
            </h2>
            <p className="text-xl text-gray-600">
              Cobertura completa para todos os tipos de vistos internacionais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visto de Turismo</h3>
              <p className="text-sm text-gray-600">Para viagens de lazer e turismo</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visto de Trabalho</h3>
              <p className="text-sm text-gray-600">Para oportunidades profissionais</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visto de Estudo</h3>
              <p className="text-sm text-gray-600">Para educação internacional</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visto de Investimento</h3>
              <p className="text-sm text-gray-600">Para empreendedores e investidores</p>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nosso Processo Simplificado
            </h2>
            <p className="text-xl text-gray-600">
              Um processo otimizado que economiza seu tempo e aumenta suas chances de aprovação
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise Inicial</h3>
              <p className="text-sm text-gray-600">
                Avaliamos seu perfil e elegibilidade para o visto desejado
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparação</h3>
              <p className="text-sm text-gray-600">
                Orientamos na coleta e preparação de todos os documentos necessários
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aplicação</h3>
              <p className="text-sm text-gray-600">
                Submetemos sua aplicação com otimização máxima para aprovação
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acompanhamento</h3>
              <p className="text-sm text-gray-600">
                Monitoramos o status e fornecemos suporte até a aprovação
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que escolher nossa assessoria de vistos?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nossa experiência e tecnologia avançada garantem o melhor resultado para seu visto.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">98% de Taxa de Aprovação</h3>
                    <p className="text-gray-600">Nossa expertise garante altas chances de sucesso</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Processo Acelerado</h3>
                    <p className="text-gray-600">Reduzimos significativamente o tempo de processamento</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-purple-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Segurança Total</h3>
                    <p className="text-gray-600">Seus documentos protegidos com máxima segurança</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Suporte Especializado</h3>
                    <p className="text-gray-600">Equipe dedicada disponível 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Países Mais Solicitados</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇺🇸</div>
                  <div className="font-semibold">Estados Unidos</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇨🇦</div>
                  <div className="font-semibold">Canadá</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇦🇺</div>
                  <div className="font-semibold">Austrália</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center border-2 border-green-300">
                  <div className="text-2xl mb-2">🇵🇹</div>
                  <div className="font-semibold">Portugal</div>
                  <div className="text-xs text-green-600 font-medium">NOVO: Visto CPLP</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇩🇪</div>
                  <div className="font-semibold">Alemanha</div>
                  <div className="text-xs text-blue-600">Chancenkarte</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇮🇪</div>
                  <div className="font-semibold">Irlanda</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para solicitar seu visto?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Agende uma consultoria gratuita e descubra como podemos facilitar sua aprovação.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4">
            Consultoria Gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <ContactForm />
      
    </div>
  )
}