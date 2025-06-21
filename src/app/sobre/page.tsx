import { Button } from '@/components/ui/button'
import AffiliateBanner from '@/components/AffiliateBanner'
import { Globe, Users, Award, Shield, Star, CheckCircle, MessageCircle, Zap } from 'lucide-react'

export default function SobrePage() {
  const timeline = [
    { year: '2009', event: 'Fundação da Visa2Any', description: 'Início dos serviços de consultoria em imigração' },
    { year: '2015', event: 'Expansão Digital', description: 'Lançamento da plataforma online' },
    { year: '2020', event: 'IA Consultoria', description: 'Implementação de inteligência artificial' },
    { year: '2024', event: '8.420+ Aprovações', description: 'Marco de vistos aprovados com sucesso' }
  ]

  const team = [
    {
      name: 'Maria Santos',
      role: 'Diretora Geral',
      experience: '15+ anos',
      specialty: 'Imigração EUA e Canadá',
      image: '👩‍💼'
    },
    {
      name: 'João Silva',
      role: 'Consultor Sênior',
      experience: '12+ anos',
      specialty: 'Vistos Europeus',
      image: '👨‍💼'
    },
    {
      name: 'Ana Costa',
      role: 'Especialista Documentação',
      experience: '10+ anos',
      specialty: 'Tradução e Apostilamento',
      image: '👩‍⚖️'
    }
  ]

  const certifications = [
    '🏛️ Registro na OAB',
    '🤖 Certificação IA Avançada',
    '🔒 ISO 27001 Segurança',
    '📋 LGPD Compliance',
    '🌍 Membro IAMRA',
    '⭐ 5 Estrelas Google'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="page-content py-16">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sobre a Visa2Any</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformando sonhos internacionais em realidade desde 2009. 
              Somos a ponte entre você e seu futuro no exterior.
            </p>
          </div>

          {/* Nossa História */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                A Visa2Any nasceu da necessidade de simplificar e democratizar o acesso aos processos de imigração e obtenção de vistos. 
                Com mais de 15 anos de experiência, já ajudamos milhares de brasileiros a realizarem seus sonhos de morar, estudar e trabalhar no exterior.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nossa missão é tornar o processo de imigração mais acessível, transparente e eficiente, utilizando tecnologia de ponta 
                combinada com a expertise de nossos consultores especializados.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar com Especialista
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Nossa Trajetória</h3>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.year}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{item.event}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Números Impressionantes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-600">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900 mb-2">8.420+</h3>
              <p className="text-gray-600">Vistos Aprovados</p>
              <p className="text-xs text-green-600 mt-1">✅ Só em 2024</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-green-600">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Países Atendidos</p>
              <p className="text-xs text-blue-600 mt-1">🌍 Cobertura global</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-purple-600">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Anos de Experiência</p>
              <p className="text-xs text-purple-600 mt-1">⭐ Desde 2009</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-orange-600">
              <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900 mb-2">85.2%</h3>
              <p className="text-gray-600">Taxa de Sucesso</p>
              <p className="text-xs text-orange-600 mt-1">🎯 Acima da média</p>
            </div>
          </div>

          {/* Nossos Valores */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Excelência</h3>
                <p className="text-gray-600">Buscamos sempre a mais alta qualidade em nossos serviços e resultados excepcionais para nossos clientes.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Transparência</h3>
                <p className="text-gray-600">Mantemos comunicação clara e honesta em todas as etapas do processo, sem custos ocultos.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Inovação</h3>
                <p className="text-gray-600">Utilizamos tecnologia de ponta para tornar os processos mais eficientes e acessíveis.</p>
              </div>
            </div>
          </div>

          {/* Nossa Equipe */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa Equipe Especialista</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-2">{member.experience}</p>
                  <p className="text-gray-500 text-xs">{member.specialty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Certificações e Reconhecimentos</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Depoimentos */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">O Que Nossos Clientes Dizem</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"Processo impecável do início ao fim. Aprovado no visto americano na primeira tentativa!"</p>
                <div className="font-semibold">Carlos M. - 🇺🇸 Visto B1/B2</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"Suporte excepcional durante todo o processo de imigração para o Canadá. Recomendo!"</p>
                <div className="font-semibold">Ana S. - 🇨🇦 Express Entry</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"D7 Portugal aprovado! Equipe profissional e resultados que superam expectativas."</p>
                <div className="font-semibold">João P. - 🇵🇹 Visto D7</div>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para Realizar Seu Sonho?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Junte-se aos mais de 8.420 brasileiros que já conseguiram seus vistos conosco
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 text-lg">
                <Zap className="mr-2 h-5 w-5" />
                Consultoria Gratuita
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-3 text-lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Compacto de Afiliados */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <AffiliateBanner variant="compact" />
        </div>
      </div>
      
    </div>
  )
}