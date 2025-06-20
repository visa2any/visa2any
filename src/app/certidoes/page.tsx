/* Updated: 1749940800000 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { CheckCircle, Clock, FileText, Shield, Star, ArrowRight, Download, Zap } from 'lucide-react'

export default function CertidoesPage() {
  const [selectedPackage, setSelectedPackage] = useState('individual')

  const packages = {
    individual: {
      name: 'Certidão Individual',
      price: 'R$ 89',
      originalPrice: 'R$ 149',
      description: 'Uma certidão por vez',
      delivery: 'PDF: 1-3 dias | Física: +3-5 dias',
      features: [
        'Nascimento, Casamento ou Óbito',
        'Válida em todo território nacional',
        'PDF enviado por email',
        'Via física por correios (opcional)',
        'Suporte especializado',
        'Garantia de autenticidade'
      ],
      highlight: false
    },
    familiar: {
      name: 'Kit Familiar',
      price: 'R$ 249',
      originalPrice: 'R$ 399',
      description: 'Até 3 certidões diferentes',
      delivery: 'PDF: 2-4 dias | SEDEX: +2-3 dias',
      features: [
        'Nascimento + Casamento + Óbito',
        'Para toda a família',
        'Desconto de 30%',
        'Entrega simultânea em PDF',
        'SEDEX incluído para via física',
        'Prioridade no atendimento',
        'Validação prévia gratuita'
      ],
      highlight: true
    },
    completo: {
      name: 'Pacote Completo',
      price: 'R$ 449',
      originalPrice: 'R$ 699',
      description: 'Certidões ilimitadas + extras',
      delivery: 'PDF: 24-48h | Motoboy: +24h',
      features: [
        'Todas as certidões necessárias',
        'Validação jurídica incluída',
        'PDF prioritário em 24-48h',
        'Entrega expressa por motoboy',
        'Suporte prioritário 24/7',
        'Garantia estendida 6 meses',
        'Consultoria documental gratuita'
      ],
      highlight: false
    }
  }

  const testimonials = [
    {
      name: 'Maria Silva',
      text: 'Precisava de certidões urgentes para meu visto americano. Visa2Any entregou tudo em 2 dias!',
      rating: 5,
      country: '🇺🇸'
    },
    {
      name: 'João Santos',
      text: 'Excelente! Consegui todas as certidões da família sem sair de casa.',
      rating: 5,
      country: '🇨🇦'
    },
    {
      name: 'Ana Costa',
      text: 'Serviço impecável. Certidões autênticas e entrega super rápida.',
      rating: 5,
      country: '🇵🇹'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Certidões Oficiais Online</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              📜 Certidões Completas
              <br />
              <span className="text-green-200">Rápido e Seguro</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Nascimento, Casamento e Óbito. Válidas em todo Brasil e exterior.
              <br />
              <strong>Entrega garantida em 1-3 dias úteis.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-green-600 text-white hover:bg-green-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                SOLICITAR AGORA
              </Button>
              <Button 
                className="border-2 border-white text-white hover:bg-green-600 hover:text-white hover:border-green-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                <Download className="mr-2 h-5 w-5" />
                Ver Amostras
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-bold text-lg mb-2">1. Solicite Online</h3>
              <p className="text-gray-600">Preencha o formulário com seus dados básicos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">2. Localizamos</h3>
              <p className="text-gray-600">Buscamos suas certidões nos cartórios oficiais</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3. Validamos</h3>
              <p className="text-gray-600">Verificamos autenticidade e validade jurídica</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-bold text-lg mb-2">4. Entregamos</h3>
              <p className="text-gray-600">Enviamos por email em formato oficial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="packages" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha Seu Pacote</h2>
            <p className="text-lg text-gray-600">Preços promocionais por tempo limitado</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-green-600">{pkg.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-400 line-through">{pkg.originalPrice}</div>
                      <div className="text-sm text-green-600 font-semibold">Economize até 40%</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg px-3 py-2 inline-block mb-4">
                    <span className="text-green-700 font-semibold text-sm">
                      📱 {pkg.delivery}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open(`/checkout?product=certidao-nascimento-${key}`, '_blank')}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    📜 Certidão de Nascimento
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=certidao-casamento-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    💒 Certidão de Casamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=certidao-obito-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-slate-700 hover:bg-slate-800 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    ⚱️ Certidão de Óbito
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vantagens */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Escolher a Visa2Any?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rapidez Garantida</h3>
              <p className="text-gray-600">
                Entrega em 1-3 dias úteis. Urgente em 24h com taxa expressa.
                Mais rápido que cartórios tradicionais.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Seguro</h3>
              <p className="text-gray-600">
                Certidões oficiais com validade jurídica completa.
                Parceria com cartórios registrados no CNJ.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Suporte Premium</h3>
              <p className="text-gray-600">
                Equipe especializada para esclarecer dúvidas e acompanhar
                seu pedido em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Nossos Clientes Dizem</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-2xl">{testimonial.country}</span>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não Perca Mais Tempo com Burocracia
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Milhares de brasileiros já confiam na Visa2Any para seus documentos.
            <br />
            <strong>Seja o próximo a realizar seu sonho!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-600 text-white hover:bg-green-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              SOLICITAR CERTIDÕES AGORA
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/5511519447117?text=Olá! Gostaria de falar com um consultor sobre certidões.', '_blank')}
              className="border-2 border-white text-white hover:bg-green-600 hover:text-white hover:border-green-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              Falar com Consultor
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-green-200">
            ✅ Garantia de autenticidade • ⚡ Entrega expressa • 🔒 Dados seguros
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}