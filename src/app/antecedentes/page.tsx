/* Updated: 1749940800000 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { CheckCircle, Clock, Shield, Star, ArrowRight, FileCheck, Zap, MapPin } from 'lucide-react'

export default function AntecedentesPage() {
  const [selectedPackage, setSelectedPackage] = useState('completo')

  const packages = {
    federal: {
      name: 'Federal Básico',
      price: 'R$ 150',
      originalPrice: 'R$ 200',
      description: 'Certidão Federal Polícia Federal',
      features: [
        'Antecedentes criminais federais',
        'Emissão via Polícia Federal',
        'Válido por 90 dias',
        'Entrega em 1-3 dias úteis',
        'Formato digital oficial',
        'Suporte por email'
      ],
      highlight: false,
      icon: '🛡️'
    },
    completo: {
      name: 'Federal + Estadual',
      price: 'R$ 250',
      originalPrice: 'R$ 350',
      description: 'Certidão completa para vistos',
      features: [
        'Antecedentes federais + estaduais',
        'Cobertura nacional completa',
        'Ideal para vistos internacionais',
        'Entrega em 2-5 dias úteis',
        'Validação jurídica incluída',
        'Suporte prioritário',
        'Garantia de autenticidade'
      ],
      highlight: true,
      icon: '🏆'
    },
    premium: {
      name: 'Premium Express',
      price: 'R$ 350',
      originalPrice: 'R$ 450',
      description: 'Antecedentes + apostilamento',
      features: [
        'Federal + estadual + municipal',
        'Apostilamento incluso',
        'Válido internacionalmente',
        'Entrega express 24-48h',
        'Consultoria jurídica',
        'Suporte 24/7',
        'Garantia estendida'
      ],
      highlight: false,
      icon: '👑'
    }
  }

  const states = [
    { name: 'São Paulo', abbr: 'SP', available: true, time: '1-2 dias' },
    { name: 'Rio de Janeiro', abbr: 'RJ', available: true, time: '1-3 dias' },
    { name: 'Minas Gerais', abbr: 'MG', available: true, time: '2-3 dias' },
    { name: 'Rio Grande do Sul', abbr: 'RS', available: true, time: '1-2 dias' },
    { name: 'Paraná', abbr: 'PR', available: true, time: '2-3 dias' },
    { name: 'Santa Catarina', abbr: 'SC', available: true, time: '1-2 dias' },
    { name: 'Goiás', abbr: 'GO', available: true, time: '2-4 dias' },
    { name: 'Bahia', abbr: 'BA', available: true, time: '3-5 dias' },
    { name: 'Distrito Federal', abbr: 'DF', available: true, time: '1-2 dias' },
    { name: 'Espírito Santo', abbr: 'ES', available: true, time: '2-3 dias' },
    { name: 'Ceará', abbr: 'CE', available: true, time: '3-4 dias' },
    { name: 'Pernambuco', abbr: 'PE', available: true, time: '3-4 dias' },
    { name: 'Amazonas', abbr: 'AM', available: false, time: 'Sob consulta' },
    { name: 'Pará', abbr: 'PA', available: false, time: 'Sob consulta' },
  ]

  const useCases = [
    {
      title: 'Visto Americano',
      description: 'B1/B2, H1B, EB-5',
      requirement: 'Federal obrigatório',
      icon: '🇺🇸'
    },
    {
      title: 'Visto Canadense',
      description: 'Express Entry, Study',
      requirement: 'Federal + provincial',
      icon: '🇨🇦'
    },
    {
      title: 'Visto Português',
      description: 'D7, Golden Visa',
      requirement: 'Federal + estadual',
      icon: '🇵🇹'
    },
    {
      title: 'Visto Australiano',
      description: 'Work, Study, Investment',
      requirement: 'Federal certificado',
      icon: '🇦🇺'
    },
    {
      title: 'Trabalho no Exterior',
      description: 'Empregos internacionais',
      requirement: 'Completo + apostilamento',
      icon: '💼'
    },
    {
      title: 'Estudo Internacional',
      description: 'Universidades estrangeiras',
      requirement: 'Federal ou completo',
      icon: '🎓'
    }
  ]

  const testimonials = [
    {
      name: 'Andre Silva',
      text: 'Consegui federal e estadual em 3 dias. Processo super rápido para meu visto americano.',
      rating: 5,
      country: '🇺🇸',
      type: 'Visto B1/B2'
    },
    {
      name: 'Mariana Costa',
      text: 'Excelente! Antecedentes de 3 estados diferentes organizados em uma semana.',
      rating: 5,
      country: '🇨🇦',
      type: 'Express Entry'
    },
    {
      name: 'Ricardo Mendes',
      text: 'Serviço impecável. Apostilamento incluso facilitou todo o processo no consulado.',
      rating: 5,
      country: '🇵🇹',
      type: 'D7 Portugal'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white page-content">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Certidão Oficial Polícia Federal</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🛡️ Antecedentes Criminais
              <br />
              <span className="text-red-200">Federal + Estadual</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Certidões oficiais aceitas por consulados mundialmente.
              <br />
              <strong>A partir de R$ 150 • Entrega em 1-5 dias úteis</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-red-600 text-white hover:bg-red-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="mr-2 h-5 w-5" />
                SOLICITAR AGORA
              </Button>
              <Button 
                className="border-2 border-white text-white hover:bg-red-600 hover:text-white hover:border-red-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                <FileCheck className="mr-2 h-5 w-5" />
                Verificar Necessidade
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-300" />
                <span>Polícia Federal</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-300" />
                <span>Todos os Estados</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                <span>1-5 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Para que Serve */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Para que Você Precisa?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-red-50 p-6 rounded-xl border-2 border-red-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">{useCase.icon}</div>
                <h3 className="font-bold text-lg mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{useCase.description}</p>
                <div className="bg-red-100 rounded-lg px-3 py-2">
                  <span className="text-red-700 font-semibold text-sm">
                    📋 {useCase.requirement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estados Disponíveis */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cobertura por Estado</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {states.map((state, index) => (
              <div key={index} className={`p-4 rounded-xl border-2 transition-all ${
                state.available 
                  ? 'bg-white border-green-200 hover:shadow-lg' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{state.abbr}</h3>
                  <span className={`text-2xl ${state.available ? '✅' : '⏳'}`}></span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{state.name}</p>
                <div className={`text-xs font-semibold ${
                  state.available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  ⏱️ {state.time}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <strong>Estados em cinza:</strong> Disponíveis sob consulta • 
              <a href="#" className="text-red-600 hover:underline ml-1">Verificar disponibilidade</a>
            </p>
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
              <h3 className="font-bold text-lg mb-2">1. Dados Pessoais</h3>
              <p className="text-gray-600">Preencha formulário com RG, CPF e endereços</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">2. Solicitação</h3>
              <p className="text-gray-600">Fazemos pedido nos órgãos oficiais</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3. Processamento</h3>
              <p className="text-gray-600">Verificação e emissão oficial</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-bold text-lg mb-2">4. Entrega</h3>
              <p className="text-gray-600">Receba por email em formato oficial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <div id="packages" className="py-16 bg-gradient-to-br from-red-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha Seu Pacote</h2>
            <p className="text-lg text-gray-600">Preços promocionais • Garantia de autenticidade</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-200'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      RECOMENDADO
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-red-600">{pkg.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-400 line-through">{pkg.originalPrice}</div>
                      <div className="text-sm text-red-600 font-semibold">Economize até 30%</div>
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
                  onClick={() => window.open(`/checkout?product=antecedentes-${key}`, '_blank')}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                    pkg.highlight 
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Solicitar {pkg.name}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dúvidas Frequentes */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dúvidas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Qual certidão preciso para meu visto?</h3>
                <p className="text-gray-600">
                  Depende do país. EUA exige federal, Canadá federal + provincial, 
                  Portugal federal + estadual. Consultamos gratuitamente.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Por quanto tempo é válida?</h3>
                <p className="text-gray-600">
                  Federal: 90 dias. Estaduais: variam entre 30-90 dias. 
                  Recomendamos solicitar próximo ao uso.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">E se eu morei em vários estados?</h3>
                <p className="text-gray-600">
                  Precisará de certidão de cada estado onde residiu por mais de 6 meses 
                  após os 18 anos. Fazemos o levantamento completo.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Precisa apostilar?</h3>
                <p className="text-gray-600">
                  Sim, para uso internacional. Oferecemos apostilamento como 
                  serviço adicional ou no pacote premium.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">E se aparecer alguma pendência?</h3>
                <p className="text-gray-600">
                  Orientamos sobre regularização e podemos indicar 
                  advogados especializados se necessário.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Fazem para menores de idade?</h3>
                <p className="text-gray-600">
                  Sim, mas apenas federal (não há antecedentes estaduais para menores). 
                  Necessária autorização dos pais.
                </p>
              </div>
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
                  <div className="text-sm text-gray-500">{testimonial.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-br from-red-600 to-rose-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não Deixe Pendências Atrasarem Seus Planos
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Mais de 12.000 certidões emitidas com sucesso.
            <br />
            <strong>Aprovação garantida no seu visto!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 text-white hover:bg-red-700 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              SOLICITAR ANTECEDENTES AGORA
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/5511519447117?text=Olá! Gostaria de consultar sobre antecedentes criminais.', '_blank')}
              className="border-2 border-white text-white hover:bg-red-600 hover:text-white hover:border-red-600 font-bold px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              Consultar Necessidade
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-red-200">
            ✅ Polícia Federal oficial • ⚡ Entrega garantida • 🌍 Aceito mundialmente
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}