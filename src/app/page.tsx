/* Updated: 1749920015029 */
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import SocialProof from '@/components/SocialProof'
import UrgencyBanner from '@/components/UrgencyBanner'
import ActivityIndicators from '@/components/ActivityIndicators'
import SimpleCheckout from '@/components/SimpleCheckout'
import { ArrowRight, Globe, Shield, Clock, CheckCircle, Star, Users, MapPin, Calculator, Calendar, CreditCard, Zap, MessageCircle, Phone } from 'lucide-react'

// Lazy load componentes pesados
const ContactForm = dynamic(() => import('@/components/ContactForm'), { 
  ssr: false,
  loading: () => <div className="min-h-96 bg-gray-50 animate-pulse rounded-lg"></div>
})
const ServiceCard = dynamic(() => import('@/components/ServiceCard'), { 
  ssr: false,
  loading: () => <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse"><div className="h-24 bg-gray-200 rounded"></div></div>
})
const ChatBot = dynamic(() => import('@/components/ChatBot'), { 
  ssr: false,
  loading: () => null
})
const EligibilityCalculator = dynamic(() => import('@/components/EligibilityCalculator'), { 
  ssr: false,
  loading: () => <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse"><div className="h-96 bg-gray-200 rounded"></div></div>
})
const SmartScheduler = dynamic(() => import('@/components/SmartScheduler'), { 
  ssr: false,
  loading: () => <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse"><div className="h-96 bg-gray-200 rounded"></div></div>
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Banner Países Premium - SCROLL AUTOMÁTICO */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 pt-20 md:pt-24 pb-6 overflow-hidden">
        {/* Background Pattern Sofisticado */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)] bg-[length:20px_20px]"></div>
        
        {/* Título Elegante */}
        <div className="relative z-20 text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-white font-semibold text-lg">
              <Globe className="inline h-5 w-5 text-blue-400 mr-2" />
              Destinos Mais Procurados em 2024-2025
            </span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
          </div>
        </div>
        
        {/* Container do Slider */}
        <div className="relative z-10 overflow-hidden">
          {/* Gradientes de fade nas bordas */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-indigo-900 to-transparent z-10"></div>
          
          {/* Slider automático - SUAVE */}
          <div className="flex animate-smooth-scroll whitespace-nowrap">
            {/* Primeira sequência de países */}
            <div className="flex items-center gap-8 mr-8">
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇺🇸</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Estados Unidos</div>
                  <div className="text-blue-200 text-sm">B1/B2, H1B, EB-5</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇨🇦</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Canadá</div>
                  <div className="text-green-200 text-sm">Express Entry, Study</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇵🇹</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Portugal</div>
                  <div className="text-yellow-200 text-sm">D7, Golden Visa, D1</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇦🇺</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Austrália</div>
                  <div className="text-purple-200 text-sm">Work, Study, Investment</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇬🇧</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Reino Unido</div>
                  <div className="text-red-200 text-sm">Visitor, Work, Study</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇯🇵</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Japão</div>
                  <div className="text-indigo-200 text-sm">Work, Study, Tourist</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇳🇿</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Nova Zelândia</div>
                  <div className="text-green-200 text-sm">Visitor, Work, Study</div>
                </div>
              </div>
            </div>
            
            {/* Segunda sequência (duplicada para loop infinito) */}
            <div className="flex items-center gap-8 mr-8">
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇺🇸</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Estados Unidos</div>
                  <div className="text-blue-200 text-sm">B1/B2, H1B, EB-5</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇨🇦</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Canadá</div>
                  <div className="text-green-200 text-sm">Express Entry, Study</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇵🇹</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Portugal</div>
                  <div className="text-yellow-200 text-sm">D7, Golden Visa, D1</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇦🇺</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Austrália</div>
                  <div className="text-purple-200 text-sm">Work, Study, Investment</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇬🇧</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Reino Unido</div>
                  <div className="text-red-200 text-sm">Visitor, Work, Study</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇯🇵</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Japão</div>
                  <div className="text-indigo-200 text-sm">Work, Study, Tourist</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 shadow-xl">
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">🇳🇿</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Nova Zelândia</div>
                  <div className="text-green-200 text-sm">Visitor, Work, Study</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Elegante */}
        <div className="relative z-20 text-center mt-6">
          <a href="/precos" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
            <span>Ver Todos os 50+ Países</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        
        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-indigo-400/20 rounded-full animate-bounce"></div>
        </div>
      </div>
      
      <SocialProof />

      {/* Hero Section - OTIMIZADO PARA CONVERSÃO */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Urgência estratégica */}
            <div className="inline-block bg-orange-100 text-orange-800 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
              🔥 ANÁLISE GRATUITA - ÚLTIMAS 48H COM DESCONTO
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Descubra se Você Pode 
              <span className="gradient-text block">Conseguir Seu Visto</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              <strong>IA Especializada analisa seu perfil em 15 minutos</strong> e mostra suas chances reais de aprovação + estratégia personalizada para cada país.
            </p>
            
            {/* Social proof integrado */}
            <div className="flex flex-wrap gap-4 text-sm justify-center items-center mb-8">
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-semibold">8.420+ aprovações este ano</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <Star className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700 font-semibold">98% recomendam nossa IA</span>
              </div>
            </div>
            
            {/* CTA ÚNICO E FOCADO */}
            <div className="mb-6">
              <a href="/consultoria-ia">
                <Button className="btn-gradient text-xl px-12 py-5 shadow-2xl hover:scale-105 transition-all">
                  <Zap className="mr-3 h-6 w-6" />
                  COMEÇAR ANÁLISE GRATUITA
                </Button>
              </a>
            </div>
            
            {/* Micro-compromissos */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                ✅ 100% Gratuito • ⚡ 15 minutos • 🛡️ Dados protegidos
              </p>
              <p className="text-xs text-gray-500">
                <a href="/precos" className="text-blue-600 hover:underline">Ver todos os pacotes e preços →</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - PROCESSO TRANSPARENTE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Nossa IA Analisa Seu Perfil
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Processo usado por <strong>8.420+ brasileiros</strong> para conseguir visto em 2024
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responda 12 Perguntas</h3>
              <p className="text-gray-600">Nosso questionário inteligente coleta informações sobre seu perfil, objetivos e país de destino em apenas 3 minutos.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">IA Processa Dados</h3>
              <p className="text-gray-600">Algoritmo treinado com 15+ anos de casos reais analisa seu perfil contra base de dados consulares atualizada.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Receba Relatório</h3>
              <p className="text-gray-600">Score de elegibilidade + roadmap personalizado + documentação necessária direto no seu email.</p>
            </div>
          </div>
          
          {/* CTA secundário */}
          <div className="text-center">
            <a href="/consultoria-ia">
              <Button className="btn-gradient text-lg px-8 py-4">
                <Calculator className="mr-2 h-5 w-5" />
                Testar Minha Elegibilidade Agora
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Upgrade Path - FUNIL ESTRATÉGICO */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Acelere Seu Processo <span className="text-blue-600">Com Suporte Humano</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <strong>Começou gratis?</strong> Veja como nossos especialistas podem acelerar sua aprovação em até <strong>300%</strong>.
            </p>
            {/* Prova social */}
            <div className="flex flex-wrap gap-4 text-sm justify-center items-center mb-8">
              <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700 font-semibold">23 pessoas compraram nas últimas 2h</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-semibold">48h restantes com desconto</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Pacote Gratuito */}
            <div className="lg:col-span-1">
              <SimpleCheckout
                productId="pre-analise"
                productName="🆓 Análise Gratuita"
                price={0}
                description="Perfeita para começar"
                features={[
                  "Análise IA em 15 minutos",
                  "Score de elegibilidade",
                  "3 recomendações principais",
                  "Resumo completo por email"
                ]}
                variant="default"
              />
            </div>

            {/* Pacote Premium - DESTAQUE */}
            <div className="lg:col-span-1">
              <SimpleCheckout
                productId="relatorio-premium"
                productName="📄 Relatório Premium"
                price={97}
                description="Análise completa e detalhada"
                features={[
                  "Tudo do pacote gratuito",
                  "Relatório PDF de 15+ páginas",
                  "Lista completa de documentos",
                  "Timeline personalizado",
                  "Custos estimados detalhados",
                  "Estratégias por nacionalidade"
                ]}
                variant="premium"
                popular={true}
              />
            </div>

            {/* Pacote Consultoria */}
            <div className="lg:col-span-1">
              <SimpleCheckout
                productId="consultoria-express"
                productName="👨‍💼 Consultoria 1:1"
                price={297}
                description="Orientação especializada humana"
                features={[
                  "Tudo do pacote anterior",
                  "60min com especialista humano",
                  "Análise ao vivo do seu caso",
                  "Plano de ação personalizado",
                  "Suporte WhatsApp 30 dias"
                ]}
                variant="default"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              🎯 <strong>Preços variam por país e complexidade.</strong> Comece grátis e faça upgrade quando precisar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/precos">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Ver Todos os Pacotes e Preços
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="/consultoria-ia">
                <Button variant="outline" className="px-8 py-3">
                  <Zap className="mr-2 h-5 w-5" />
                  Começar Análise Gratuita
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vaga Express Section - NOVO PRODUTO */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 NOVO PRODUTO - EXCLUSIVO VISA2ANY
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <Zap className="inline h-10 w-10 text-orange-600 mr-3" />
              Vaga Express
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              O primeiro sistema do Brasil que monitora cancelamentos consulares em tempo real. 
              Adiante sua entrevista automaticamente!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🥉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaga Express Basic</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">R$ 297</div>
                <p className="text-gray-600">Monitoramento por 30 dias</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Notificações WhatsApp + Email
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  1 país/consulado
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Vagas até 30 dias de antecedência
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Prioridade média (15 min)
                </li>
              </ul>
              <a href="/vaga-express">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Quero Adiantar Minha Entrevista
                </Button>
              </a>
            </div>

            {/* Premium Plan - DESTAQUE */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-500 relative hover:scale-105 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </div>
              </div>
              <div className="text-center mb-6 pt-4">
                <div className="text-4xl mb-4">🥈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaga Express Premium</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">R$ 497</div>
                <p className="text-gray-600">Monitoramento por 60 dias</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Notificações multi-canal prioritárias
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Até 2 países/consulados
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  💰 Garantia de reembolso
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Prioridade alta (5 min)
                </li>
              </ul>
              <a href="/vaga-express">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  Escolher Premium com Garantia
                </Button>
              </a>
            </div>

            {/* VIP Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaga Express VIP</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">R$ 797</div>
                <p className="text-gray-600">Monitoramento por 90 dias</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Notificação imediata (2 minutos)
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Países ilimitados
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  👨‍💼 Consultoria inclusa
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Prioridade máxima (urgente)
                </li>
              </ul>
              <a href="/vaga-express">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Escolher Serviço VIP
                </Button>
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ⚡ Como Funciona o Vaga Express?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Monitore Cancelamentos</h4>
                  <p className="text-sm text-gray-600">
                    Nosso sistema verifica consulados a cada 2 minutos procurando vagas liberadas
                  </p>
                </div>
                <div>
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Receba Alerta Instant</h4>
                  <p className="text-sm text-gray-600">
                    Notificação imediata via WhatsApp quando uma vaga aparecer
                  </p>
                </div>
                <div>
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adiante sua Entrevista</h4>
                  <p className="text-sm text-gray-600">
                    Agende rapidamente e adiante sua entrevista em semanas ou meses
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <a href="/vaga-express">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3">
                    <Zap className="mr-2 h-5 w-5" />
                    Começar Monitoramento Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Visa2Any?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos tecnologia de ponta com expertise humana para oferecer a melhor experiência em assessoria internacional.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Segurança Garantida</h3>
              <p className="text-gray-600">
                Seus documentos e informações pessoais são protegidos com os mais altos padrões de segurança digital.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Processo Agilizado</h3>
              <p className="text-gray-600">
                Nossa tecnologia automatiza etapas burocráticas, reduzindo significativamente o tempo de processamento.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Atendimento Global</h3>
              <p className="text-gray-600">
                Atendimento 100% online para clientes no Brasil e no mundo. IA disponível 24/7 e especialistas humanos em horário comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo - PROVA DO PRODUTO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Teste Nossa IA <span className="text-blue-600">Gratuitamente</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>Mesma tecnologia</strong> que aprovou 8.420+ vistos em 2024. 
              Descubra suas chances <strong>sem compromisso</strong>.
            </p>
            
            {/* Prova social para credibilidade */}
            <div className="flex justify-center items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Usado por 8.420+ pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Star className="h-4 w-4" />
                <span className="font-medium">4.9/5 estrelas</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Dados 100% seguros</span>
              </div>
            </div>
          </div>
          <EligibilityCalculator />
        </div>
      </section>

      {/* Services Overview - AUTORIDADE */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por Que <span className="text-blue-600">8.420+ Brasileiros</span> Escolheram a Visa2Any?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>3 pilares</strong> que nos tornam referência em assessoria internacional desde 2009.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Globe}
              title="Assessoria de Vistos"
              description="Orientação completa para obtenção de vistos de turismo, trabalho, estudo e investimento."
              features={[
                "Análise de elegibilidade",
                "Preparação de documentos",
                "Acompanhamento do processo"
              ]}
              color="blue"
            />
            
            <ServiceCard
              icon={Zap}
              title="Vaga Express ⚡"
              description="NOVO! Monitore cancelamentos consulares e adiante sua entrevista em tempo real."
              features={[
                "Monitoramento a cada 2 minutos",
                "Notificação imediata de vagas",
                "3 planos: Basic, Premium e VIP"
              ]}
              color="orange"
              isNew={true}
            />
            
            <ServiceCard
              icon={Users}
              title="Imigração"
              description="Suporte completo para processos de imigração permanente e obtenção de cidadania."
              features={[
                "Residência permanente",
                "Cidadania por descendência",
                "Reunificação familiar"
              ]}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Milhares de pessoas já realizaram seus sonhos internacionais conosco.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "A Visa2Any tornou meu sonho de morar no Canadá uma realidade. O processo foi muito mais simples do que imaginava, e o suporte foi excepcional em cada etapa."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Rodrigues</div>
                  <div className="text-sm text-gray-500">Canadá - Visto de Trabalho</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Profissionalismo e eficiência incomparáveis. Consegui minha cidadania italiana em tempo recorde. Recomendo a todos que sonham com a vida internacional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">JS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">João Silva</div>
                  <div className="text-sm text-gray-500">Itália - Cidadania</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "O suporte 24/7 fez toda a diferença. Sempre tive alguém para esclarecer minhas dúvidas durante todo o processo de visto para os Estados Unidos."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">AC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ana Costa</div>
                  <div className="text-sm text-gray-500">EUA - Visto de Turismo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Scheduler Section */}
      <section id="agendamento" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Agende sua Consultoria Especializada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Sistema inteligente de agendamento com nossos especialistas. Escolha data, horário e tipo de atendimento.
            </p>
            {/* Indicadores de agendamento */}
            <div className="flex flex-wrap gap-4 text-sm justify-center items-center mb-8">
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full border border-orange-200">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700 font-medium">6 horários disponíveis hoje</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">Próximo slot: 14:30</span>
              </div>
            </div>
          </div>
          <SmartScheduler />
          
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Ou acelere seu processo com nossos planos premium
              </h3>
              <p className="text-gray-600 mb-6">
                Não quer esperar? Nossos relatórios premium e consultorias express estão disponíveis imediatamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/precos">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Comprar Relatório Premium
                  </Button>
                </a>
                <a href="/precos">
                  <Button variant="outline" className="px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-50">
                    Ver Todos os Preços
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* Final CTA - ÚLTIMA CHANCE DE CONVERSÃO */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Elementos visuais de urgência */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Urgência estratégica */}
          <div className="inline-block bg-red-500/20 border border-red-300/30 text-red-100 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
            ⏰ ÚLTIMAS 48H COM ANÁLISE GRATUITA + DESCONTO
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Não Deixe Seu Sonho{' '}
            <span className="text-yellow-300">Passar Mais Um Ano</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            <strong>8.420 brasileiros</strong> já estão vivendo no exterior graças à nossa IA. 
            <strong>Você será o próximo?</strong>
          </p>
          
          {/* Prova social final */}
          <div className="flex flex-wrap gap-4 text-sm justify-center items-center mb-10">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">47 pessoas fazendo análise agora</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Clock className="h-4 w-4 text-yellow-300" />
              <span className="text-white font-semibold">48h restantes com desconto</span>
            </div>
          </div>
          
          {/* CTA principal gigante */}
          <div className="mb-8">
            <a href="/consultoria-ia">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-16 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all border-2 border-green-400/50">
                <Zap className="mr-3 h-6 w-6" />
                DESCOBRIR MINHAS CHANCES AGORA
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </a>
          </div>
          
          {/* Garantias e micro-compromissos */}
          <div className="grid md:grid-cols-3 gap-4 text-center text-blue-100 text-sm mb-6">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-green-300" />
              <span><strong>100% Gratuito</strong><br/>Sem cartão</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span><strong>15 Minutos</strong><br/>Resultado imediato</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-300" />
              <span><strong>Dados Seguros</strong><br/>LGPD Compliance</span>
            </div>
          </div>
          
          <p className="text-blue-200 text-xs">
            Mais de 8.420 brasileiros confiaram em nossa tecnologia em 2024
          </p>
        </div>
      </section>

      
      <ChatBot />
    </div>
  )
}