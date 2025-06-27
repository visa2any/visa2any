'use client'

import { Button } from '@/components/ui/button'
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Mapear serviço para tipo de visto
      const serviceToVisaType: Record<string, string> = {
        'visto-turismo': 'turismo',
        'visto-trabalho': 'trabalho',
        'visto-estudo': 'estudo',
        'imigracao': 'trabalho',
        'cidadania': 'familia',
        'relocacao': 'trabalho',
        'outros': 'turismo'
      }

      // Criar conta do cliente automaticamente (integração unificada)

      const accountData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        targetCountry: 'A definir', // Será atualizado baseado no serviço,        nationality: 'Brasileira', // Padrão
        source: 'contact_form',
        product: `Contato via formulário - ${formData.service}`,
        amount: 0
      }

      const accountResponse = await fetch('/api/auth/unified/auto-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      })

      const accountResult = await accountResponse.json()

      if (accountResult.success) {
        // Criar interação registrando o contato
        await fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: accountResult.user.id,
            type: 'EMAIL',
            channel: 'contact_form',
            direction: 'inbound',
            subject: `Contato via formulário - ${formData.service}`,
            content: formData.message
          })
        })

        // Mensagem de sucesso com opção de acessar portal

        const confirmationMessage = `✅ Mensagem enviada com sucesso!

🎉 CONTA CRIADA AUTOMATICAMENTE!
👤 Você pode acompanhar nossa resposta no seu portal pessoal.
📧 Email enviado para: ${formData.email}`

        if (confirm(`${confirmationMessage}

Deseja acessar seu portal agora?`)) {
          window.location.href = '/cliente'
        } else {
          alert('📧 Entraremos em contato em breve via email e WhatsApp!')
        }
      } else {
        throw new Error(accountResult.error || 'Erro ao processar solicitação')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.')
    }

    // Limpar formulário

    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pronto para iniciar sua jornada internacional? Nossa equipe está aqui para ajudar você a cada passo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Fale Conosco
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telefone</h4>
                  <p className="text-gray-600">+55 (11) 9999-9999</p>
                  <p className="text-sm text-gray-500">Segunda à Sexta, 8h às 18h</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">contato@visa2any.com</p>
                  <p className="text-sm text-gray-500">Resposta em até 24h</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Atendimento Global</h4>
                  <p className="text-gray-600">100% Online</p>
                  <p className="text-sm text-gray-500">Clientes no Brasil e no mundo</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Suporte 24/7</h4>
                  <p className="text-gray-600">WhatsApp sempre disponível</p>
                  <p className="text-sm text-gray-500">Para clientes em andamento</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Consultoria Gratuita</h4>
              <p className="text-blue-700 text-sm mb-4">
                Agende uma conversa de 30 minutos sem compromisso para entender como podemos ajudar você.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Agendar Consultoria
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Envie sua Mensagem
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Serviço de Interesse
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um serviço</option>
                  <option value="visto-turismo">Visto de Turismo</option>
                  <option value="visto-trabalho">Visto de Trabalho</option>
                  <option value="visto-estudo">Visto de Estudo</option>
                  <option value="imigracao">Imigração</option>
                  <option value="cidadania">Cidadania</option>
                  <option value="relocacao">Relocação</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conte-nos sobre seus objetivos e como podemos ajudar..."
                />
              </div>
              
              <Button type="submit" className="w-full btn-gradient">
                <Send className="mr-2 h-5 w-5" />
                Enviar Mensagem
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Ao enviar este formulário, você concorda com nossa política de privacidade e 
                aceita receber comunicações da Visa2Any.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}