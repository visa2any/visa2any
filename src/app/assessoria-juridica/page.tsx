'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Shield, Star, ArrowRight, Scale, Zap, Globe, Users, Award } from 'lucide-react'

export default function AssessoriaJuridicaPage() {
  const [selectedCountry, setSelectedCountry] = useState('eua')

  const services = {
    cidadania: {
      name: 'Cidadania Italiana',
      price: 'R$ 8.500',
      originalPrice: 'R$ 12.000',
      description: 'Processo completo de cidadania por descendência',
      features: [
        'Pesquisa genealógica completa',
        'Busca de documentos na Itália',
        'Tradução e apostilamento',
        'Assessoria jurídica especializada',
        'Acompanhamento no consulado',
        'Suporte até obtenção do passaporte'
      ],
      highlight: true,
      icon: '🇮🇹',
      successRate: '89%'
    },
    residencia: {
      name: 'Residência Permanente',
      price: 'R$ 12.800',
      originalPrice: 'R$ 18.500',
      description: 'Green Card, Express Entry e outros',
      features: [
        'Análise de elegibilidade completa',
        'Preparação de petições (I-140, Express Entry)',
        'Assessoria jurídica no país destino',
        'Acompanhamento de todo o processo',
        'Suporte para entrevistas',
        'Garantia de resubmissão se negado'
      ],
      highlight: false,
      icon: '🏠',
      successRate: '85%'
    },
    familiar: {
      name: 'Reunificação Familiar',
      price: 'R$ 5.800',
      originalPrice: 'R$ 8.200',
      description: 'Visto de cônjuge, filhos e pais',
      features: [
        'Petições I-130, sponsorship familiar',
        'Documentação comprobatória completa',
        'Assessoria jurídica especializada',
        'Preparação para entrevista consular',
        'Acompanhamento processual',
        'Suporte pós-aprovação'
      ],
      highlight: false,
      icon: '👪',
      successRate: '91%'
    }
  }

  const countries = {
    eua: {
      name: 'Estados Unidos',
      flag: '🇺🇸',
      services: [
        'Green Card EB-2 NIW, EB-1, EB-5',
        'Cidadania americana (naturalização)',
        'Petições I-130, I-140, I-485',
        'Recursos de negativa e waivers',
        'Representação em USCIS e tribunais'
      ],
      partners: 'Escritórios licenciados em NY, LA, Miami',
      price: 'A partir de R$ 5.800'
    },
    canada: {
      name: 'Canadá',
      flag: '🇨🇦',
      services: [
        'Express Entry (Federal Skilled Worker)',
        'Programas Provinciais (PNP)',
        'Cidadania canadense',
        'Reunificação familiar completa',
        'Recursos e representação em IRCC'
      ],
      partners: 'RCICs licenciados em Toronto, Vancouver',
      price: 'A partir de R$ 4.200'
    },
    italia: {
      name: 'Itália',
      flag: '🇮🇹',
      services: [
        'Cidadania italiana por descendência',
        'Naturalização por residência',
        'Permesso di Soggiorno',
        'Carta di Soggiorno UE',
        'Recursos administrativos'
      ],
      partners: 'Advogados especializados em Roma, Milão',
      price: 'A partir de R$ 6.500'
    },
    portugal: {
      name: 'Portugal',
      flag: '🇵🇹',
      services: [
        'Cidadania portuguesa',
        'Autorização de residência',
        'Estatuto de residente de longa duração',
        'Reagrupamento familiar',
        'Recursos em AIMA/SEF'
      ],
      partners: 'Advogados OA em Lisboa, Porto',
      price: 'A partir de R$ 3.800'
    }
  }

  const legalPartners = [
    {
      name: 'Martinez & Associates',
      country: '🇺🇸 Estados Unidos',
      specialty: 'Green Card e Cidadania',
      experience: '15+ anos',
      rating: 4.9,
      cases: '2.500+ casos aprovados'
    },
    {
      name: 'Immigration Law Group',
      country: '🇨🇦 Canadá',
      specialty: 'Express Entry e Cidadania',
      experience: '12+ anos',
      rating: 4.8,
      cases: '1.800+ casos aprovados'
    },
    {
      name: 'Studio Legale Roma',
      country: '🇮🇹 Itália',
      specialty: 'Cidadania por Descendência',
      experience: '20+ anos',
      rating: 4.9,
      cases: '5.200+ cidadanias aprovadas'
    },
    {
      name: 'Silva & Advogados',
      country: '🇵🇹 Portugal',
      specialty: 'Nacionalidade e Residência',
      experience: '18+ anos',
      rating: 4.7,
      cases: '3.100+ casos aprovados'
    }
  ]

  const testimonials = [
    {
      name: 'Carlos Silva',
      text: 'Cidadania italiana aprovada em 18 meses! Processo complexo mas a assessoria foi impecável do início ao fim.',
      rating: 5,
      country: '🇮🇹',
      service: 'Cidadania Italiana'
    },
    {
      name: 'Marina Santos',
      text: 'Green Card EB-2 NIW aprovado! O escritório em Miami fez toda diferença no processo. Recomendo!',
      rating: 5,
      country: '🇺🇸',
      service: 'Residência Permanente'
    },
    {
      name: 'Roberto Lima',
      text: 'Express Entry no Canadá. Processo demorou 14 meses mas valeu cada centavo. Hoje sou residente permanente!',
      rating: 5,
      country: '🇨🇦',
      service: 'Residência Permanente'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Scale className="h-5 w-5" />
              <span className="font-semibold">Assessoria Jurídica Especializada</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ⚖️ Assessoria de Imigração
              <br />
              <span className="text-indigo-200">Cidadania & Residência</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Cidadania italiana, Green Card, Express Entry e mais.
              <br />
              <strong>85-91% de sucesso • Parceiros licenciados em 4 países</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                CONSULTAR ESPECIALISTA
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold px-8 py-4 text-lg rounded-xl">
                <Scale className="mr-2 h-5 w-5" />
                Analisar Meu Caso
              </button>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-300" />
                <span>12.600+ Casos</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Advogados Licenciados</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-yellow-300" />
                <span>4 Países</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nossos Serviços */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços de Imigração</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
              <div className="text-3xl mb-3">🇮🇹</div>
              <h3 className="font-bold text-lg mb-3 text-green-700">Cidadania Italiana</h3>
              <p className="text-gray-600">
                Processo completo por descendência. 110 mil brasileiros na fila. Urgente devido às mudanças de 2025.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-bold text-lg mb-3 text-blue-700">Residência Permanente</h3>
              <p className="text-gray-600">
                Green Card americano, Express Entry canadense, residência europeia e australiana.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
              <div className="text-3xl mb-3">👪</div>
              <h3 className="font-bold text-lg mb-3 text-purple-700">Reunificação Familiar</h3>
              <p className="text-gray-600">
                Trazer cônjuge, filhos e pais. Petições I-130, sponsorship e casos especiais.
              </p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
              <div className="text-3xl mb-3">📜</div>
              <h3 className="font-bold text-lg mb-3 text-orange-700">Naturalização</h3>
              <p className="text-gray-600">
                Cidadania americana, canadense e europeia por residência. Testes e requisitos.
              </p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-3 text-red-700">Visto de Investidor</h3>
              <p className="text-gray-600">
                EB-5 americano, Golden Visa português, investimento grego e outros programas.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-bold text-lg mb-3 text-indigo-700">Recursos & Defesa</h3>
              <p className="text-gray-600">
                Recursos de negação, waivers, defesa contra deportação e casos complexos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de País */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Serviços por País</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {Object.entries(countries).map(([key, country]) => (
              <button
                key={key}
                onClick={() => setSelectedCountry(key)}
                className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                  selectedCountry === key 
                    ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' 
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-3">{country.flag}</div>
                <h3 className="font-bold text-lg mb-2">{country.name}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  👥 {country.partners}
                </div>
                <div className="text-lg font-bold text-indigo-600">
                  {country.price}
                </div>
              </button>
            ))}
          </div>

          {/* Serviços por País */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {countries[selectedCountry].flag} Serviços de Imigração - {countries[selectedCountry].name}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-4">🌆 Serviços Disponíveis:</h4>
                <ul className="space-y-3">
                  {countries[selectedCountry].services.map((service, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">🏢 Nossos Parceiros:</h4>
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{countries[selectedCountry].partners}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    <span className="text-gray-700">Licenciados oficialmente</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Especialistas em imigração</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Representação local</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pacotes de Imigração</h2>
            <p className="text-lg text-gray-600">Assessoria especializada • Parceiros licenciados</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(services).map(([key, service]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  service.highlight ? 'border-indigo-500 ring-4 ring-indigo-100' : 'border-gray-200'
                }`}
              >
                {service.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS PROCURADO
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-indigo-600">{service.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-400 line-through">{service.originalPrice}</div>
                      <div className="text-sm text-green-600 font-semibold">{service.successRate} sucesso</div>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => window.open(`/checkout?product=assessoria-${key}`, '_blank')}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                    service.highlight 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Contratar {service.name}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parceiros */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Parceiros Especialistas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {legalPartners.map((partner, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl">{partner.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-bold">{partner.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{partner.country.split(' ')[0]}</span>
                    <span className="text-gray-600">{partner.country.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div className="text-gray-600">📋 {partner.specialty}</div>
                  <div className="text-gray-600">⏱️ {partner.experience}</div>
                  <div className="text-green-600 font-semibold">✅ {partner.cases}</div>
                </div>
                
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Consultar Este Especialista
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Casos de Sucesso</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg">
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
                  <div className="text-sm text-gray-500">{testimonial.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Realize Seu Sonho de Imigração
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Mais de 12.600 casos de sucesso em cidadania e residência permanente.
            <br />
            <strong>Especialistas licenciados em 4 países!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Scale className="mr-2 h-5 w-5" />
              CONSULTAR ESPECIALISTA AGORA
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold px-8 py-4 text-lg rounded-xl">
              Analisar Minha Elegibilidade
            </button>
          </div>
          
          <div className="mt-8 text-sm text-indigo-200">
            ⚖️ Licenciados oficialmente • 🛡️ Garantia de qualidade • 🌍 Suporte mundial
          </div>
        </div>
      </div>
      
    </div>
  )
}