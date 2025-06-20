/* Updated: 1749940800000 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { CheckCircle, Clock, Award, Shield, Star, ArrowRight, FileCheck, Zap, Globe } from 'lucide-react'

export default function ApostilamentoPage() {
  const [selectedPackage, setSelectedPackage] = useState('express')

  const packages = {
    standard: {
      name: 'Apostilamento Standard',
      price: 'R$ 200',
      originalPrice: 'R$ 280',
      delivery: '5-7 dias úteis',
      deliveryOptions: 'PDF: 2-3 dias | Físico: +3-4 dias envio',
      description: 'Apostilamento oficial e seguro',
      features: [
        'Apostilamento e-Apostil CNJ',
        'Válido em 118+ países',
        'Entrega PDF imediata',
        'Via física incluída (correios)',
        'Suporte durante horário comercial',
        'Certificado de autenticidade',
        'Rastreamento do processo'
      ],
      highlight: false,
      icon: '📋'
    },
    express: {
      name: 'Apostilamento Express',
      price: 'R$ 280',
      originalPrice: 'R$ 380',
      delivery: '2-4 dias úteis',
      deliveryOptions: 'PDF: 24h | Físico: +1-2 dias SEDEX',
      description: 'Apostilamento urgente garantido',
      features: [
        'Apostilamento em até 24h',
        'Prioridade máxima',
        'PDF entregue em 24h',
        'SEDEX expresso incluído',
        'Suporte 24/7 via WhatsApp',
        'Garantia de prazo',
        'Consultor dedicado'
      ],
      highlight: true,
      icon: '⚡'
    },
    premium: {
      name: 'Apostilamento Premium',
      price: 'R$ 350',
      originalPrice: 'R$ 480',
      delivery: '1-2 dias úteis',
      deliveryOptions: 'PDF: 4-8h | Motoboy: mesmo dia',
      description: 'Máxima urgência empresarial',
      features: [
        'Apostilamento em 4-8h',
        'PDF entregue no mesmo dia',
        'Coleta e entrega por motoboy',
        'Atendimento VIP exclusivo',
        'Gerente dedicado',
        'Múltiplos documentos',
        'Validação prévia gratuita',
        'Suporte jurídico incluso'
      ],
      highlight: false,
      icon: '👑'
    }
  }

  const countries = [
    { flag: '🇺🇸', name: 'Estados Unidos', validity: 'Aceito' },
    { flag: '🇨🇦', name: 'Canadá', validity: 'Aceito' },
    { flag: '🇵🇹', name: 'Portugal', validity: 'Aceito' },
    { flag: '🇪🇸', name: 'Espanha', validity: 'Aceito' },
    { flag: '🇮🇹', name: 'Itália', validity: 'Aceito' },
    { flag: '🇫🇷', name: 'França', validity: 'Aceito' },
    { flag: '🇩🇪', name: 'Alemanha', validity: 'Aceito' },
    { flag: '🇦🇺', name: 'Austrália', validity: 'Aceito' },
    { flag: '🇬🇧', name: 'Reino Unido', validity: 'Aceito' },
    { flag: '🇯🇵', name: 'Japão', validity: 'Aceito' },
    { flag: '🇰🇷', name: 'Coreia do Sul', validity: 'Aceito' },
    { flag: '🇳🇿', name: 'Nova Zelândia', validity: 'Aceito' }
  ]

  const documentTypes = [
    { 
      name: 'Certidões Civis',
      description: 'Nascimento, casamento, óbito',
      time: '2-24h',
      popular: true
    },
    { 
      name: 'Diplomas/Históricos',
      description: 'Documentos acadêmicos',
      time: '4-48h',
      popular: true
    },
    { 
      name: 'Procurações',
      description: 'Poderes legais',
      time: '2-12h',
      popular: false
    },
    { 
      name: 'Contratos',
      description: 'Documentos empresariais',
      time: '4-24h',
      popular: false
    },
    { 
      name: 'Atestados Médicos',
      description: 'Laudos e exames',
      time: '3-24h',
      popular: true
    },
    { 
      name: 'Documentos Judiciais',
      description: 'Sentenças, certidões',
      time: '6-48h',
      popular: false
    }
  ]

  const testimonials = [
    {
      name: 'Patricia Oliveira',
      text: 'Apostilamento express em 8 horas! Consegui entregar tudo no consulado no mesmo dia.',
      rating: 5,
      country: '🇺🇸',
      document: 'Diploma + Certidões'
    },
    {
      name: 'Fernando Costa',
      text: 'Excelente! Apostilaram 12 documentos em um dia. Processo super organizado.',
      rating: 5,
      country: '🇵🇹',
      document: 'Documentos Empresariais'
    },
    {
      name: 'Julia Santos',
      text: 'Atendimento impecável. Me explicaram todo o processo e cumpriram o prazo.',
      rating: 5,
      country: '🇨🇦',
      document: 'Histórico Escolar'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="h-5 w-5" />
              <span className="font-semibold">e-Apostil CNJ Oficial</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ✅ Apostilamento Express
              <br />
              <span className="text-purple-200">Mesmo Dia</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Apostilamento oficial válido em 118+ países.
              <br />
              <strong>A partir de R$ 200 • Entrega em 2-24h garantido</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-purple-600 text-white hover:bg-purple-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                APOSTILAR AGORA
              </Button>
              <Button 
                className="border-2 border-white text-white hover:bg-purple-600 hover:text-white hover:border-purple-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                <FileCheck className="mr-2 h-5 w-5" />
                Verificar Documentos
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-300" />
                <span>118+ Países</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>CNJ Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                <span>2-24h Garantido</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* O que é Apostilamento */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que é Apostilamento?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              É o processo que torna seus documentos brasileiros válidos internacionalmente, 
              eliminando a necessidade de legalização consular.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Por que Apostilar?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-lg">Validade Internacional</div>
                    <p className="text-gray-600">Seus documentos são aceitos em 118+ países sem burocracia adicional</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-lg">Economia de Tempo</div>
                    <p className="text-gray-600">Evita o processo longo de legalização consular</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-lg">Segurança Jurídica</div>
                    <p className="text-gray-600">Certificação oficial reconhecida pela Convenção de Haia</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl">
              <h4 className="font-bold text-xl mb-4">Antes vs Depois</h4>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="font-semibold text-red-800 mb-2">❌ Sem Apostilamento</div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Legalização consular (2-6 meses)</li>
                    <li>• Custos altos (R$ 500-1.500)</li>
                    <li>• Múltiplas etapas burocráticas</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold text-green-800 mb-2">✅ Com Apostilamento</div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Processo único (2-24h)</li>
                    <li>• Custo baixo (R$ 200-350)</li>
                    <li>• Aceito imediatamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Países que Aceitam */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Países que Aceitam Apostilamento</h2>
          
          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-6">
            {countries.map((country, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-2">{country.flag}</div>
                <h3 className="font-bold text-sm mb-1">{country.name}</h3>
                <div className="text-xs text-green-600 font-semibold">✅ {country.validity}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <strong>+100 outros países</strong> • 
              <a href="#" className="text-purple-600 hover:underline ml-1">Ver lista completa</a>
            </p>
          </div>
        </div>
      </div>

      {/* Tipos de Documentos */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Documentos que Apostilamos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((doc, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                doc.popular ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              }`}>
                {doc.popular && (
                  <div className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
                    POPULAR
                  </div>
                )}
                <div className="text-2xl mb-3">{doc.popular ? '⭐' : '📄'}</div>
                <h3 className="font-bold text-lg mb-2">{doc.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">
                    Prazo: {doc.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="packages" className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha Seu Pacote</h2>
            <p className="text-lg text-gray-600">Preços promocionais • Prazo garantido</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS RÁPIDO
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-purple-600">{pkg.price}</span>
                    <div className="text-left">
                      <div className="text-sm text-gray-600">/documento</div>
                      <div className="text-lg text-gray-400 line-through">{pkg.originalPrice}</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg px-3 py-2 inline-block mb-2">
                    <span className="text-purple-700 font-semibold text-sm">
                      ⏱️ Prazo: {pkg.delivery}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    📱 {pkg.deliveryOptions}
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
                    onClick={() => window.open(`/checkout?product=apostilamento-certidao-${key}`, '_blank')}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    📜 Apostilar Certidões
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=apostilamento-diploma-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    🎓 Apostilar Diplomas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => window.open(`/checkout?product=apostilamento-outros-${key}`, '_blank')}
                    className={`w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center ${
                      pkg.highlight 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📤</span>
              </div>
              <h3 className="font-bold text-lg mb-2">1. Envie Documentos</h3>
              <p className="text-gray-600">Upload dos documentos originais em alta qualidade</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">2. Validação</h3>
              <p className="text-gray-600">Verificamos autenticidade e elegibilidade</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3. Apostilamento</h3>
              <p className="text-gray-600">Processamento oficial via e-Apostil CNJ</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-bold text-lg mb-2">4. Entrega</h3>
              <p className="text-gray-600">Receba digitalmente + via correios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Depoimentos de Sucesso</h2>
          
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

      {/* Opções de Envio */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Opções de Entrega</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-lg text-center border-2 border-purple-100">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-3">Entrega Digital</h3>
              <p className="text-gray-600 mb-4">PDF oficial por email</p>
              <div className="text-2xl font-bold text-purple-600 mb-2">INCLUÍDO</div>
              <p className="text-sm text-gray-500">Aceito pela maioria dos consulados</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-2 border-gray-200">
              <div className="text-4xl mb-4">🇧🇷</div>
              <h3 className="font-bold text-lg mb-3">Envio Nacional</h3>
              <p className="text-gray-600 mb-4">SEDEX para todo Brasil</p>
              <div className="text-2xl font-bold text-blue-600 mb-2">+ R$ 25</div>
              <p className="text-sm text-gray-500">2-5 dias úteis</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-2 border-gray-200">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-bold text-lg mb-3">Envio Internacional</h3>
              <p className="text-gray-600 mb-4">Correios internacionais</p>
              <div className="text-2xl font-bold text-orange-600 mb-2">+ R$ 85</div>
              <p className="text-sm text-gray-500">7-15 dias úteis</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              💡 <strong>Dica:</strong> A versão digital é aceita pela maioria dos consulados. 
              Confirme com o órgão de destino antes de solicitar envio físico.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Seus Documentos Prontos para o Mundo
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Mais de 8.000 apostilamentos realizados com sucesso.
            <br />
            <strong>Válido em 118+ países • Prazo garantido</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-purple-600 text-white hover:bg-purple-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              APOSTILAR DOCUMENTOS AGORA
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/5511519447117?text=Olá! Gostaria de consultar um especialista sobre apostilamento.', '_blank')}
              className="border-2 border-white text-white hover:bg-purple-600 hover:text-white hover:border-purple-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              Consultar Especialista
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-purple-200">
            ✅ e-Apostil CNJ oficial • ⚡ Entrega garantida • 🌍 118+ países
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}