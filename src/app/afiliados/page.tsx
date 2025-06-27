'use client'

import { useState } from 'react'
import { 
  Users, DollarSign, TrendingUp, Star, Award, Target, Globe, 
  CheckCircle, ArrowRight, Mail, Phone, Building, User,
  ExternalLink, Calendar, Clock, Zap, Shield, Heart,
  BarChart3, Link, Eye, Download, MessageCircle, Plane,
  UserPlus, FileText
} from 'lucide-react'

export default function AfiliadosPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    bio: '',
    experience: '',
    audience: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Implementar envio do formulário
      console.log('Dados do formulário:', formData)
      
      // Simular processo de envio
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Inscrição enviada com sucesso! Entraremos em contato em até 24 horas.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        bio: '',
        experience: '',
        audience: '',
        socialMedia: {
          instagram: '',
          facebook: '',
          linkedin: '',
          youtube: ''
        }
      })
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar inscrição. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Visa2Any</h1>
              <p className="text-xs text-gray-600">Programa de Afiliados</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Inscrever-se Agora
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              <span>Programa de Afiliados Premium</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme sua audiência em
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> renda passiva</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Junte-se ao programa de afiliados da Visa2Any e ganhe comissões atrativas ajudando pessoas a realizarem o sonho de viver no exterior.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-xl transform hover:scale-105"
              >
                <Zap className="h-5 w-5 mr-2" />
                Começar Agora - É Grátis
              </button>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Sem custos • Aprovação rápida • Suporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Até 25%</div>
              <div className="text-sm text-gray-600">de comissão</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">12.000+</div>
              <div className="text-sm text-gray-600">clientes atendidos</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">países atendidos</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
              <div className="text-sm text-gray-600">taxa de aprovação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Processo simples e transparente para começar a ganhar dinheiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Inscreva-se</h3>
            <p className="text-gray-600 mb-4">
              Preencha o formulário e aguarde nossa aprovação em até 24 horas
            </p>
            <div className="text-sm text-blue-600 font-medium">Processo 100% gratuito</div>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Link className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Compartilhe</h3>
            <p className="text-gray-600 mb-4">
              Use seus links únicos e materiais promocionais exclusivos
            </p>
            <div className="text-sm text-purple-600 font-medium">Material profissional</div>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Ganhe</h3>
            <p className="text-gray-600 mb-4">
              Receba comissões por cada cliente que contratar nossos serviços
            </p>
            <div className="text-sm text-green-600 font-medium">Pagamento garantido</div>
          </div>
        </div>
      </div>

      {/* Tabela de Comissões */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tabela de Comissões</h2>
          <p className="text-gray-600">Comissões competitivas para todos os nossos serviços</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Serviço</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Comissão Bronze</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Comissão Prata</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Comissão Ouro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Valor Médio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Consultoria Inicial</div>
                        <div className="text-sm text-gray-500">Avaliação de perfil e orientação</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">15%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">20%</td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">25%</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">R$ 397</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Processo de Visto</div>
                        <div className="text-sm text-gray-500">Acompanhamento completo</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">8%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">12%</td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">15%</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">R$ 2.500</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Serviço VIP</div>
                        <div className="text-sm text-gray-500">Atendimento premium</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">10%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">15%</td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">20%</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">R$ 5.000</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Cursos e Treinamentos</div>
                        <div className="text-sm text-gray-500">Materiais educacionais</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">30%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">40%</td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">50%</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">R$ 497</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Níveis baseados em performance mensal • Bônus por metas • Pagamento até 15º dia útil
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que ser nosso afiliado?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Benefícios exclusivos que fazem a diferença
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Empresa Confiável</h3>
              <p className="text-gray-600">12+ anos de experiência e mais de 12.000 clientes atendidos com sucesso.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Completo</h3>
              <p className="text-gray-600">Acompanhe suas métricas, comissões e performance em tempo real.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Material Promocional</h3>
              <p className="text-gray-600">Banners, vídeos, posts e conteúdo profissional para suas campanhas.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Suporte Dedicado</h3>
              <p className="text-gray-600">Equipe especializada para te ajudar a maximizar seus resultados.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pagamento Pontual</h3>
              <p className="text-gray-600">Receba suas comissões sempre até o 15º dia útil do mês seguinte.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Programa de Fidelidade</h3>
              <p className="text-gray-600">Bônus especiais e recompensas para afiliados de alto desempenho.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Junte-se a centenas de afiliados que já estão ganhando dinheiro conosco
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Zap className="h-5 w-5 mr-2" />
            Inscrever-se Agora
          </button>
          <div className="mt-4 text-blue-200 text-sm">
            ✓ Gratuito ✓ Aprovação rápida ✓ Sem compromisso
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Inscrição de Afiliado</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2">Preencha os dados abaixo para se tornar nosso parceiro</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Empresa/Blog
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da sua empresa ou blog"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website/Blog
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://seusite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fale sobre você e sua audiência *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conte sobre sua experiência, nicho de atuação e tipo de audiência..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData({
                      ...formData, 
                      socialMedia: {...formData.socialMedia, instagram: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@seuinstagram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => setFormData({
                      ...formData, 
                      socialMedia: {...formData.socialMedia, youtube: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu canal do YouTube"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Inscrição'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}