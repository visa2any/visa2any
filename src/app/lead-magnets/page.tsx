'use client'

import { useState } from 'react'

// Metadata removido - não compatível com 'use client'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/Breadcrumb'
import { Download, CheckCircle, FileText, Calculator, BookOpen, Gift, ArrowRight, Star, Users } from 'lucide-react'

interface LeadMagnet {
  id: string
  title: string
  description: string
  icon: any
  preview: string
  benefits: string[]
  file: string
  popular?: boolean
  exclusive?: boolean
}

const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'ebook-50-erros',
    title: '📖 E-book: 50 Erros que Reprovam Vistos',
    description: 'O guia completo dos erros mais comuns que levam à reprovação de vistos. Baseado em análise de 10.000+ casos reais.',
    icon: BookOpen,
    preview: 'Lista detalhada com exemplos reais de documentos rejeitados e como evitar cada erro.',
    benefits: [
      'Lista dos 50 erros mais comuns',
      'Exemplos reais de reprovações',
      'Como corrigir cada erro',
      'Checklist de verificação',
      'Casos de sucesso pós-correção'
    ],
    file: '/downloads/ebook-50-erros-vistos.pdf',
    popular: true
  },
  {
    id: 'checklist-documentos',
    title: '📋 Checklist: Documentos por País',
    description: 'Checklist completo e atualizado dos documentos necessários para cada país e tipo de visto.',
    icon: CheckCircle,
    preview: 'Listas organizadas por país com todos os documentos obrigatórios e opcionais.',
    benefits: [
      'Documentos para 15+ países',
      'Organizado por tipo de visto',
      'Templates e exemplos',
      'Dicas de formatação',
      'Atualizações gratuitas por 1 ano'
    ],
    file: '/downloads/checklist-documentos-por-pais.pdf'
  },
  {
    id: 'calculadora-tempo',
    title: '⏱️ Calculadora: Tempo Real de Aprovação',
    description: 'Ferramenta interativa que calcula o tempo estimado de aprovação baseado no seu perfil e país escolhido.',
    icon: Calculator,
    preview: 'Algoritmo baseado em dados de 50.000+ aplicações reais dos últimos 3 anos.',
    benefits: [
      'Estimativa personalizada',
      'Baseado em dados reais',
      'Fatores que aceleram',
      'Cronograma detalhado',
      'Alertas de timing ideal'
    ],
    file: '/downloads/calculadora-tempo-aprovacao.html',
    exclusive: true
  },
  {
    id: 'guia-entrevista',
    title: '🎯 Guia: Como Passar na Entrevista',
    description: 'Estratégias comprovadas para ter sucesso em entrevistas consulares. Perguntas e respostas que funcionam.',
    icon: Users,
    preview: '100+ perguntas reais de entrevistas com respostas que levaram à aprovação.',
    benefits: [
      '100+ perguntas e respostas',
      'Linguagem corporal ideal',
      'O que NÃO falar nunca',
      'Scripts por tipo de visto',
      'Casos de sucesso'
    ],
    file: '/downloads/guia-entrevista-consular.pdf'
  },
  {
    id: 'planilha-financeira',
    title: '💰 Planilha: Comprovação Financeira',
    description: 'Planilha Excel completa para organizar e apresentar sua situação financeira de forma convincente.',
    icon: FileText,
    preview: 'Template profissional usado por consultores que já aprovou R$ 50M+ em aplicações.',
    benefits: [
      'Template profissional',
      'Cálculos automáticos',
      'Gráficos convincentes',
      'Múltiplas moedas',
      'Aprovado por consulados'
    ],
    file: '/downloads/planilha-comprovacao-financeira.xlsx'
  },
  {
    id: 'kit-emergencia',
    title: '🚨 Kit Emergência: Visto Negado',
    description: 'O que fazer quando seu visto é negado. Estratégias para reverter a decisão e ter sucesso na nova aplicação.',
    icon: Gift,
    preview: 'Protocolo passo-a-passo usado para reverter 73% das negações em nossa consultoria.',
    benefits: [
      'Análise do motivo da negação',
      'Estratégia de reversão',
      'Novos documentos necessários',
      'Timeline de reaplicação',
      'Scripts para apelação'
    ],
    file: '/downloads/kit-emergencia-visto-negado.pdf',
    exclusive: true
  }
]

export default function LeadMagnetsPage() {
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const handleDownload = async (magnetId: string) => {
    if (!email || !name) {
      alert('Por favor, preencha seu nome e email para baixar.')
      return
    }

    setDownloading(true)
    
    try {
      // Capturar lead
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          source: 'lead_magnet',
          leadMagnet: magnetId,
          utmSource: 'organic',
          utmMedium: 'website',
          utmCampaign: 'lead_magnets'
        })
      })

      // Simular download

      const magnet = LEAD_MAGNETS.find(m => m.id === magnetId)
      if (magnet) {
        // Em produção
        servir arquivo real
        console.log(`Downloading: ${magnet.file}`)
        
        // Trigger email automático
        
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            template: 'lead_magnet_delivery',
            variables: {
              client_name: name,
              magnet_title: magnet.title,
              download_link: `https://visa2any.com${magnet.file}`
            }
          })
        })

        setDownloadComplete(true)
        
        // Reset form
        
        setTimeout(() => {
          setSelectedMagnet(null)
          setEmail('')
          setName('')
          setDownloadComplete(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Erro no download:', error)
      alert('Erro ao processar download. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🎁 Materiais <span className="text-blue-600">Gratuitos</span> Exclusivos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Baixe nossos guias, checklists e ferramentas que já ajudaram 10.000+ brasileiros 
              a conseguirem seus vistos. <strong>100% gratuito, sem pegadinha!</strong>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Download imediato
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Sem spam, prometido
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Baseado em casos reais
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Downloads realizados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
              <div className="text-gray-600">Taxa de aprovação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <div className="text-gray-600">Entrega por email</div>
            </div>
          </div>

          {/* Lead Magnets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LEAD_MAGNETS.map((magnet) => (
              <div key={magnet.id} className="relative">
                {magnet.popular && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    🔥 Mais Baixado
                  </div>
                )}
                {magnet.exclusive && (
                  <div className="absolute -top-3 -right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    ⭐ Exclusivo
                  </div>
                )}
                
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 h-full border border-gray-200 hover:border-blue-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <magnet.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {magnet.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {magnet.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 italic">
                      📋 <strong>Prévia:</strong> {magnet.preview}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">O que você vai receber:</h4>
                    <ul className="space-y-1">
                      {magnet.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                      {magnet.benefits.length > 3 && (
                        <li className="text-xs text-blue-600 font-medium">
                          + {magnet.benefits.length - 3} benefícios adicionais
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedMagnet(magnet.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Grátis Agora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Modal */}
      {selectedMagnet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              {downloadComplete ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🎉 Download Enviado!
                  </h3>
                  <p className="text-gray-600">
                    Verifique seu email <strong>{email}</strong> para acessar o material.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Quase lá! 🚀
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Preencha os dados abaixo para receber o material gratuitamente:
                  </p>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Seu melhor email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-4 mb-6">
                    ✅ Seus dados estão seguros. Usamos apenas para enviar o material e dicas valiosas sobre vistos.
                  </div>
                </>
              )}
            </div>
            
            {!downloadComplete && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedMagnet(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={downloading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDownload(selectedMagnet)}
                  disabled={downloading || !email || !name}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Agora
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Por que nossos materiais são diferentes? 🤔
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Baseado em Casos Reais</h3>
              <p className="text-gray-600 text-sm">
                Analisamos 50.000+ aplicações reais para criar conteúdo que realmente funciona na prática.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Atualizado Constantemente</h3>
              <p className="text-gray-600 text-sm">
                Monitoramos mudanças nas leis de imigração e atualizamos nossos materiais mensalmente.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consultores Especialistas</h3>
              <p className="text-gray-600 text-sm">
                Criado por consultores que já aprovaram R$ 500M+ em aplicações ao redor do mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para acelerar seu processo? 🚀
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Se você gostou dos materiais gratuitos, imagine o que conseguimos fazer 
            com nossa consultoria personalizada!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/precos">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4">
                Ver Planos Premium
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="/assessment">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Análise Gratuita
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}