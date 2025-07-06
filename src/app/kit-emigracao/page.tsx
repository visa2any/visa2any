/* Updated: 1749940800000 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Star, ArrowRight, FileText, Zap, Globe, Award, Shield } from 'lucide-react'

export default function KitEmigracao() {
  const [selectedCountry, setSelectedCountry] = useState('eua')

  const packages = {
    basico: {
      name: 'Kit Básico',
      price: 'R$ 750',
      originalPrice: 'R$ 1.200',
      description: 'Documentação essencial para emigração',
      features: [
        'Certidões de nascimento/casamento',
        'Antecedentes criminais federal',
        'Apostilamento completo',
        'Organização digital',
        'Checklist personalizado',
        'Suporte por 30 dias'
      ],
      highlight: false,
      icon: '📋',
      savings: 'Economize R$ 450'
    },
    completo: {
      name: 'Kit Completo',
      price: 'R$ 1.200',
      originalPrice: 'R$ 1.950',
      description: 'Tudo que você precisa para emigrar',
      features: [
        'Todas as certidões necessárias',
        'Antecedentes federal + estadual',
        'Tradução juramentada',
        'Apostilamento completo',
        'Consultoria especializada',
        'Suporte por 90 dias',
        'Garantia de aprovação',
        'Timeline personalizada'
      ],
      highlight: true,
      icon: '🏆',
      savings: 'Economize R$ 750'
    },
    premium: {
      name: 'Kit Premium VIP',
      price: 'R$ 1.950',
      originalPrice: 'R$ 3.200',
      description: 'Serviço completo premium',
      features: [
        'Documentação completa ilimitada',
        'Tradução + apostilamento expressos',
        'Consultoria jurídica especializada',
        'Gerente dedicado',
        'Suporte 24/7 por 1 ano',
        'Reagendamento de consulados',
        'Mock interview gratuita',
        'Garantia de aprovação estendida'
      ],
      highlight: false,
      icon: '👑',
      savings: 'Economize R$ 1.250'
    }
  }

  const countries: { [key: string]: {
    name: string
    flag: string
    documents: string[]
    timeline: string
    price: string
  }} = {
    eua: {
      name: 'Estados Unidos',
      flag: '🇺🇸',
      documents: [
        'Certidão de nascimento apostilada',
        'Antecedentes criminais federal',
        'Diploma + histórico traduzidos',
        'Certidão de casamento (se aplicável)',
        'Atestado médico específico',
        'Comprovante financeiro'
      ],
      timeline: '4-8 semanas',
      price: 'R$ 1.200'
    },
    canada: {
      name: 'Canadá',
      flag: '🇨🇦',
      documents: [
        'Certidões civis apostiladas',
        'Antecedentes federal + provincial',
        'Documentos acadêmicos traduzidos',
        'Exames médicos aprovados',
        'Comprovação de fundos',
        'Teste de idioma'
      ],
      timeline: '6-12 semanas',
      price: 'R$ 1.400'
    },
    portugal: {
      name: 'Portugal',
      flag: '🇵🇹',
      documents: [
        'Certidão de nascimento apostilada',
        'Antecedentes brasileiro completo',
        'Comprovante de meios de subsistência',
        'Seguro saúde internacional',
        'Contrato de arrendamento',
        'Declaração de responsabilidade'
      ],
      timeline: '3-6 semanas',
      price: 'R$ 950'
    },
    australia: {
      name: 'Austrália',
      flag: '🇦🇺',
      documents: [
        'Certidões apostiladas',
        'Antecedentes federal certificado',
        'Qualificações traduzidas',
        'Exame médico específico',
        'Evidência de fundos',
        'Teste de inglês'
      ],
      timeline: '8-16 semanas',
      price: 'R$ 1.600'
    }
  }

  const benefits = [
    {
      icon: '💰',
      title: 'Economia Garantida',
      description: 'Até R$ 1.250 de economia vs serviços individuais'
    },
    {
      icon: '⏰',
      title: 'Tempo Otimizado',
      description: 'Processamento paralelo reduz tempo em 60%'
    },
    {
      icon: '🎯',
      title: 'Zero Retrabalho',
      description: 'Checklist especializado evita erros custosos'
    },
    {
      icon: '🛡️',
      title: 'Garantia Total',
      description: 'Aprovação garantida ou reembolso integral'
    },
    {
      icon: '📞',
      title: 'Suporte Dedicado',
      description: 'Consultor especializado acompanha seu caso'
    },
    {
      icon: '🚀',
      title: 'Prioridade Máxima',
      description: 'Atendimento VIP em todos os processos'
    }
  ]

  const testimonials = [
    {
      name: 'Carlos & Marina',
      text: 'Kit completo nos poupou 3 meses de processo. Aprovados no visto americano na primeira tentativa!',
      rating: 5,
      country: '🇺🇸',
      type: 'Kit Completo',
      time: '6 semanas'
    },
    {
      name: 'Família Rodrigues',
      text: 'Migração para o Canadá com 4 pessoas. Visa2Any organizou tudo perfeitamente. Recomendo!',
      rating: 5,
      country: '🇨🇦',
      type: 'Kit Premium VIP',
      time: '8 semanas'
    },
    {
      name: 'Ana & Pedro',
      text: 'D7 Portugal aprovado! O kit premium valeu cada centavo. Suporte excepcional.',
      rating: 5,
      country: '🇵🇹',
      type: 'Kit Premium VIP',
      time: '4 semanas'
    }
  ]

  const process = [
    {
      step: '1',
      title: 'Consultoria Inicial',
      description: 'Análise do seu perfil e país de destino',
      time: '30 min'
    },
    {
      step: '2',
      title: 'Checklist Personalizado',
      description: 'Lista exata de documentos necessários',
      time: '24h'
    },
    {
      step: '3',
      title: 'Coleta de Documentos',
      description: 'Obtemos todos os documentos brasileiros',
      time: '5-10 dias'
    },
    {
      step: '4',
      title: 'Tradução & Apostilamento',
      description: 'Processamento simultâneo e organizado',
      time: '3-7 dias'
    },
    {
      step: '5',
      title: 'Organização Final',
      description: 'Pasta digital + física pronta para uso',
      time: '1-2 dias'
    },
    {
      step: '6',
      title: 'Acompanhamento',
      description: 'Suporte até aprovação do visto',
      time: 'Até 1 ano'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Globe className="h-5 w-5" />
              <span className="font-semibold">Solução Completa para Emigração</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              📋 Kit Emigração Premium
              <br />
              <span className="text-yellow-200">Tudo Incluso</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Todos os documentos necessários para emigrar.
              <br />
              <strong>A partir de R$ 750 • Aprovação garantida ou reembolso</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                COMEÇAR AGORA
              </Button>
              <Button 
                className="border-2 border-white text-white hover:bg-orange-600 hover:text-white hover:border-orange-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                <FileText className="mr-2 h-5 w-5" />
                Ver Checklist
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-300" />
                <span>8.420+ Aprovações</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Garantia Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                <span>3-8 semanas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de País */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Escolha Seu Destino</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {Object.entries(countries).map(([key, country]) => (
              <button
                key={key}
                onClick={() => setSelectedCountry(key)}
                className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                  selectedCountry === key 
                    ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' 
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="text-4xl mb-3">{country.flag}</div>
                <h3 className="font-bold text-lg mb-2">{country.name}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  ⏱️ {country.timeline}
                </div>
                <div className="text-lg font-bold text-orange-600">
                  A partir de {country.price}
                </div>
              </button>
            ))}
          </div>

          {/* Documentos por País */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {countries[selectedCountry]?.flag} Documentos para {countries[selectedCountry]?.name}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-4">📄 Documentos Necessários:</h4>
                <ul className="space-y-3">
                  {countries[selectedCountry]?.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">⚡ O que Incluímos:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Obtenção de todos os documentos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Tradução juramentada completa</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Apostilamento oficial</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Organização profissional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Consultoria especializada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">Suporte até aprovação</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vantagens */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Kit Emigração?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-2xl font-bold text-orange-600">{step.step}</span>
                  {index < process.length - 1 && (
                    <ArrowRight className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-300 hidden lg:block" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                <div className="text-xs text-orange-600 font-semibold">⏱️ {step.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="packages" className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha Seu Kit</h2>
            <p className="text-lg text-gray-600">Preços promocionais • Garantia de aprovação</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight ? 'border-orange-500 ring-4 ring-orange-100' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MAIS VENDIDO
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-orange-600">{pkg.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-400 line-through">{pkg.originalPrice}</div>
                      <div className="text-sm text-green-600 font-semibold">{pkg.savings}</div>
                    </div>
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
                
                <button 
                  onClick={() => window.open(`/checkout?product=kit-emigracao-${key}`, '_blank')}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                    pkg.highlight 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Escolher {pkg.name}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Depoimentos */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Famílias que Realizaram o Sonho</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-lg">
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
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>{testimonial.type}</span>
                    <span>⏱️ {testimonial.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sua Emigração Começa Aqui
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Mais de 2.500 famílias emigraram com sucesso usando nossos kits.
            <br />
            <strong>Próxima família pode ser a sua!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              COMEÇAR MINHA EMIGRAÇÃO
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/5511519447117?text=Olá! Gostaria de falar com um especialista sobre o kit emigração.', '_blank')}
              className="border-2 border-white text-white hover:bg-orange-600 hover:text-white hover:border-orange-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              Falar com Especialista
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-yellow-200">
            ✅ Garantia de aprovação • ⚡ Tudo incluso • 🌍 Suporte mundial
          </div>
        </div>
      </div>
      
    </div>
  )
}