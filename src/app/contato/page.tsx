import { Button } from '@/components/ui/button'
import { MessageCircle, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="page-content py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h1>
            <p className="text-xl text-gray-600">
              Estamos aqui para ajudar você a realizar seus sonhos internacionais
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Fale Conosco</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
                    <p className="text-gray-600 mb-2">Atendimento 24/7 para emergências</p>
                    <a 
                      href="https://wa.me/5511519447117" 
                      target="_blank"
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Iniciar Conversa
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Email</h3>
                    <p className="text-gray-600 mb-2">Resposta em até 2 horas</p>
                    <a 
                      href="mailto:contato@visa2any.com" 
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      contato@visa2any.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Consultoria Online</h3>
                    <p className="text-gray-600 mb-2">Análise gratuita em 15 minutos</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Agendar Consulta
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Horários</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>🌅 Segunda a Sexta: 8h às 20h</p>
                      <p>🌅 Sábados: 9h às 17h</p>
                      <p>🚨 Emergências: 24/7 via WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone/WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Consultoria de Visto</option>
                    <option>Documentação</option>
                    <option>Tradução</option>
                    <option>Apostilamento</option>
                    <option>Kit Emigração</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva como podemos ajudá-lo..."
                  ></textarea>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>

          {/* FAQ Rápido */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Quanto tempo demora o processo?</h3>
                <p className="text-gray-600">Varia por país, mas em média 4-12 semanas para documentação completa.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Oferecem garantia?</h3>
                <p className="text-gray-600">Sim, garantia de aprovação ou reembolso integral em nossos pacotes premium.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Atendem emergências?</h3>
                <p className="text-gray-600">Sim, temos serviços expressos e atendimento 24/7 via WhatsApp para urgências.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Primeira consulta é gratuita?</h3>
                <p className="text-gray-600">Sim, análise inicial de 15 minutos totalmente gratuita e sem compromisso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}