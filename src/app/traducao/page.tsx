/* Updated: 1749940800000 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { CheckCircle, Clock, Globe, Shield, Star, ArrowRight, FileText, Zap, Award } from 'lucide-react'

export default function TraducaoPage() {
  const [selectedPackage, setSelectedPackage] = useState('express')

  const packages = {
    standard: {
      name: 'Tradução Standard',
      price: 'R$ 180',
      originalPrice: 'R$ 250',
      pricePerPage: '/página',
      delivery: '3-5 dias úteis',
      description: 'Tradução juramentada profissional',
      features: [
        'Tradução juramentada oficial',
        'Assinatura digital válida',
        'Entrega por email',
        'Suporte durante horário comercial',
        'Garantia de autenticidade',
        'Aceito por consulados'
      ],
      highlight: false,
      icon: '📄'
    },
    express: {
      name: 'Tradução Express',
      price: 'R$ 230',
      originalPrice: 'R$ 320',
      pricePerPage: '/página',
      delivery: '24-48h',
      description: 'Tradução urgente com prioridade',
      features: [
        'Tradução em 24-48h garantido',
        'Prioridade máxima na fila',
        'Revisor especializado',
        'Suporte 24/7 via WhatsApp',
        'Entrega por email + correios',
        'Garantia de prazo ou reembolso',
        'Certificado de urgência'
      ],
      highlight: true,
      icon: '⚡'
    },
    premium: {
      name: 'Tradução Premium',
      price: 'R$ 280',
      originalPrice: 'R$ 380',
      pricePerPage: '/página',
      delivery: '12-24h',
      description: 'Máxima urgência e qualidade',
      features: [
        'Tradução em 12-24h',
        'Dupla revisão obrigatória',
        'Tradutor especializado por área',
        'Gerente dedicado ao projeto',
        'Entrega presencial se necessário',
        'Apostilamento incluso',
        'Garantia estendida 1 ano'
      ],
      highlight: false,
      icon: '👑'
    }
  }

  const documentTypes = [
    { name: 'Diploma/Histórico Escolar', pages: '2-4 páginas', popular: true },
    { name: 'Certidão de Nascimento', pages: '1 página', popular: true },
    { name: 'Certidão de Casamento', pages: '1 página', popular: true },
    { name: 'Carteira de Trabalho', pages: '3-8 páginas', popular: false },
    { name: 'Declaração de Imposto de Renda', pages: '8-15 páginas', popular: false },
    { name: 'Atestado Médico', pages: '1-2 páginas', popular: true },
    { name: 'Procuração', pages: '1-2 páginas', popular: false },
    { name: 'Contrato Social', pages: '5-12 páginas', popular: false }
  ]

  const languages = [
    { flag: '🇺🇸', name: 'Inglês', demand: 'Alta' },
    { flag: '🇫🇷', name: 'Francês', demand: 'Média' },
    { flag: '🇪🇸', name: 'Espanhol', demand: 'Média' },
    { flag: '🇮🇹', name: 'Italiano', demand: 'Média' },
    { flag: '🇩🇪', name: 'Alemão', demand: 'Média' },
    { flag: '🇯🇵', name: 'Japonês', demand: 'Baixa' }
  ]

  const testimonials = [
    {
      name: 'Carlos Mendes',
      text: 'Tradução express em 36h para meu visto americano. Perfeita! Aprovado na primeira tentativa.',
      rating: 5,
      country: '🇺🇸',
      document: 'Diploma + Histórico'
    },
    {
      name: 'Lucia Ferreira', 
      text: 'Precisava traduzir 15 páginas urgente. Entregaram em 24h com qualidade excepcional.',
      rating: 5,
      country: '🇨🇦',
      document: 'Documentos Completos'
    },
    {
      name: 'Roberto Silva',
      text: 'Melhor custo-benefício do mercado. Tradutor especializado em documentos médicos.',
      rating: 5,
      country: '🇵🇹',
      document: 'Atestados Médicos'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Globe className="h-5 w-5" />
              <span className="font-semibold">Tradução Juramentada Oficial</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🌐 Tradução Juramentada
              <br />
              <span className="text-indigo-200">Express 24-48h</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Traduções oficiais aceitas por consulados do mundo todo.
              <br />
              <strong>A partir de R$ 180/página • Entrega garantida no prazo</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                TRADUZIR AGORA
              </Button>
              <Button 
                className="border-2 border-white text-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                <FileText className="mr-2 h-5 w-5" />
                Calcular Preço
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-300" />
                <span>Tradutores Certificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-300" />
                <span>Aceito Mundialmente</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <span>Prazo Garantido</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Documentos */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Documentos Mais Traduzidos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentTypes.map((doc, index) => (
              <div key={index} className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                doc.popular ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {doc.popular && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="text-2xl mb-3">{doc.popular ? '⭐' : '📄'}</div>
                <h3 className="font-bold text-lg mb-2">{doc.name}</h3>
                <p className="text-gray-600 text-sm">{doc.pages}</p>
                <div className="mt-4 text-sm">
                  <span className={`font-semibold ${doc.popular ? 'text-indigo-600' : 'text-gray-700'}`}>
                    A partir de R$ {doc.popular ? '180' : '200'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Idiomas Disponíveis */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Idiomas Disponíveis</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {languages.map((lang, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">{lang.flag}</div>
                <h3 className="font-bold text-lg mb-2">{lang.name}</h3>
                <div className={`text-sm font-semibold ${
                  lang.demand === 'Alta' ? 'text-green-600' : 
                  lang.demand === 'Média' ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  Demanda {lang.demand}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Outros idiomas disponíveis sob consulta • 
              <strong> Russo, Chinês, Árabe, Hebraico e mais</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha Seu Pacote</h2>
            <p className="text-lg text-gray-600">Preços promocionais • Qualidade garantida</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight ? 'border-indigo-500 ring-4 ring-indigo-100' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS ESCOLHIDO
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-indigo-600">{pkg.price}</span>
                    <div className="text-left">
                      <div className="text-sm text-gray-600">{pkg.pricePerPage}</div>
                      <div className="text-lg text-gray-400 line-through">{pkg.originalPrice}</div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg px-3 py-2 inline-block mb-2">
                    <span className="text-indigo-700 font-semibold text-sm">
                      ⏱️ Entrega: {pkg.delivery}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    📱 PDF imediato + física opcional
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
                    onClick={() => window.open(`/checkout?product=traducao-diploma-${key}`, '_blank')}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    🎓 Diploma/Histórico
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=traducao-certidao-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    📜 Certidões
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=traducao-outros-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    📄 Outros Documentos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📤</span>
              </div>
              <h3 className="font-bold text-lg mb-2">1. Envie Documentos</h3>
              <p className="text-gray-600">Upload dos documentos em PDF ou foto clara</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold text-lg mb-2">2. Orçamento</h3>
              <p className="text-gray-600">Receba orçamento detalhado em até 1 hora</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3. Tradução</h3>
              <p className="text-gray-600">Tradutor especializado inicia o trabalho</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">4. Entrega</h3>
              <p className="text-gray-600">Receba por email no prazo acordado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Diferenciais */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Somos os Melhores?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tradutores Certificados</h3>
              <p className="text-gray-600">
                Profissionais registrados na JUCESP com especialização
                por área. Garantia de qualidade técnica e jurídica.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Prazo Garantido</h3>
              <p className="text-gray-600">
                Cumprimos 99.8% dos prazos prometidos. Não cumpriu?
                Reembolso total + compensação pelos transtornos.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Aceito Mundialmente</h3>
              <p className="text-gray-600">
                Nossas traduções são aceitas por consulados, universidades
                e órgãos oficiais em mais de 50 países.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Depoimentos Reais</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-2xl">{testimonial.country}</span>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.document}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não Deixe Seus Documentos Atrasarem Seus Planos
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Mais de 15.000 traduções entregues com sucesso.
            <br />
            <strong>Seja aprovado no seu visto na primeira tentativa!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              TRADUZIR DOCUMENTOS AGORA
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/5511519447117?text=Olá! Gostaria de falar com um tradutor sobre meus documentos.', '_blank')}
              className="border-2 border-white text-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              Falar com Tradutor
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-indigo-200">
            ✅ Tradutores certificados • ⚡ Entrega garantida • 🌍 Aceito mundialmente
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}