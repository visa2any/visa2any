'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Brain, X, MessageCircle, Send, Sparkles, Crown, 
  Zap, Star, Gift, Clock, CheckCircle, AlertCircle
} from 'lucide-react'

interface SofiaMessage {
  id: string
  text: string
  sender: 'user' | 'sofia'
  timestamp: Date
  type?: 'suggestion' | 'action' | 'info' | 'upsell' | 'welcome'
  actions?: SofiaAction[]
}

interface SofiaAction {
  label: string
  action: () => void
  type: 'primary' | 'secondary' | 'upsell'
}

interface CustomerData {
  name: string
  email: string
  eligibilityScore: number
  progress: number
  destinationCountry: string
  visaType: string
  status: string
  package: 'LEAD' | 'BASIC' | 'PREMIUM' | 'VIP'
  automationInsights?: {
    engagementScore: number
  }
}

interface SofiaIAProps {
  isOpen: boolean
  onClose: () => void
  customerData: CustomerData
}

export default function SofiaIA({ isOpen, onClose, customerData }: SofiaIAProps) {
  const [messages, setMessages] = useState<SofiaMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeSofia()
    }
  }, [isOpen, customerData])

  const getPackageFeatures = () => {
    switch (customerData.package) {
      case 'LEAD':
        return {
          name: 'Avaliação Gratuita',
          features: ['Análise básica', 'Informações gerais', '3 recomendações'],
          limitations: ['Sem consultoria humana', 'Sem documentos detalhados'],
          color: 'gray',
          icon: '📊'
        }
      case 'BASIC':
        return {
          name: 'Pacote Básico',
          features: ['Análise IA completa', 'Consultoria 30min', 'Lista de documentos'],
          limitations: ['Suporte limitado', 'Sem acompanhamento'],
          color: 'blue',
          icon: '📋'
        }
      case 'PREMIUM':
        return {
          name: 'Pacote Premium',
          features: ['Consultoria 60min', 'Revisão documentos', 'Acompanhamento 30 dias'],
          limitations: ['Sem preenchimento de formulários'],
          color: 'purple',
          icon: '⭐'
        }
      case 'VIP':
        return {
          name: 'Pacote VIP',
          features: ['Consultor dedicado', 'Suporte 24/7', 'Garantia de reembolso'],
          limitations: [],
          color: 'yellow',
          icon: '👑'
        }
      default:
        return {
          name: 'Avaliação',
          features: ['Análise básica'],
          limitations: ['Acesso limitado'],
          color: 'gray',
          icon: '📊'
        }
    }
  }

  const initializeSofia = () => {
    const packageInfo = getPackageFeatures()
    const welcomeText = `👋 Olá, ${customerData.name.split(' ')[0]}!

Sou a Sofia, sua assistente IA da Visa2Any. 

📊 **Seu Status Atual:**
• Score: ${customerData.eligibilityScore}/100
• Progresso: ${customerData.progress}%
• Destino: ${customerData.destinationCountry}
• Pacote: ${packageInfo.icon} ${packageInfo.name}

Como posso ajudar você hoje?`

    const welcomeMessage: SofiaMessage = {
      id: 'welcome',
      text: welcomeText,
      sender: 'sofia',
      timestamp: new Date(),
      type: 'welcome',
      actions: [
        {
          label: '📈 Melhorar Score',
          action: () => sendMessage('Como posso melhorar meu score de elegibilidade?'),
          type: 'primary'
        },
        {
          label: '📋 Próximos Passos',
          action: () => sendMessage('Quais são meus próximos passos?'),
          type: 'secondary'
        },
        {
          label: '📄 Documentos Necessários',
          action: () => sendMessage('Que documentos preciso para ' + customerData.destinationCountry + '?'),
          type: 'secondary'
        }
      ]
    }

    setMessages([welcomeMessage])
  }

  const generateSofiaResponse = (userMessage: string): SofiaMessage => {
    const lowerMessage = userMessage.toLowerCase()
    const packageInfo = getPackageFeatures()
    
    let response: SofiaMessage

    // Análise de Score
    if (lowerMessage.includes('score') || lowerMessage.includes('melhorar') || lowerMessage.includes('elegibilidade')) {
      if (customerData.package === 'LEAD') {
        response = {
          id: Date.now().toString(),
          text: `📊 **Análise do Seu Score (${customerData.eligibilityScore}/100)**

Posso fornecer uma análise básica gratuita:
• ✅ Você tem potencial para ${customerData.destinationCountry}
• ⚠️ Algumas áreas podem ser melhoradas

**Para análise detalhada:**
🔓 Precisa de um plano pago para:
• Breakdown completo por categoria
• Recomendações específicas
• Estratégias personalizadas`,
          sender: 'sofia',
          timestamp: new Date(),
          type: 'upsell',
          actions: [
            {
              label: '🚀 Upgrade para Premium',
              action: () => console.log('Redirect to premium'),
              type: 'upsell'
            }
          ]
        }
      } else {
        response = {
          id: Date.now().toString(),
          text: `📊 **Análise Detalhada do Score (${customerData.eligibilityScore}/100)**

**Pontos Fortes:**
• Educação: Excelente (95/100)
• Experiência: Boa (80/100)

**Áreas de Melhoria:**
• Idiomas: 90/100 → Certificação pode levar a 95+
• Recursos Financeiros: 75/100 → Diversificar comprovantes

**Próximas Ações:**
1️⃣ Obter certificação IELTS/TOEFL
2️⃣ Atualizar extratos bancários
3️⃣ Documentar experiência internacional`,
          sender: 'sofia',
          timestamp: new Date(),
          type: 'suggestion',
          actions: [
            {
              label: '📚 Agendar Preparação Idiomas',
              action: () => console.log('Schedule language prep'),
              type: 'primary'
            }
          ]
        }
      }
    }
    
    // Próximos Passos
    else if (lowerMessage.includes('próximos') || lowerMessage.includes('passos') || lowerMessage.includes('etapa')) {
      response = {
        id: Date.now().toString(),
        text: `🎯 **Próximos Passos - ${customerData.destinationCountry}**

**Seu Progresso: ${customerData.progress}% completo**

**Próximas Etapas:**
1️⃣ Finalizar formulário DS-160 (Pendente)
2️⃣ Agendar entrevista consular (Até 15/02)
3️⃣ Preparação para entrevista

**Timeline Estimado:**
• Formulário: 2-3 dias
• Agendamento: 1 semana
• Preparação: 1-2 semanas

${customerData.package === 'LEAD' ? '🔓 **Preparação detalhada disponível no plano Premium**' : '✅ **Posso ajudar com cada etapa!**'}`,
        sender: 'sofia',
        timestamp: new Date(),
        type: customerData.package === 'LEAD' ? 'upsell' : 'action',
        actions: customerData.package === 'LEAD' ? [
          {
            label: '🚀 Ver Planos Premium',
            action: () => console.log('Show premium plans'),
            type: 'upsell'
          }
        ] : [
          {
            label: '📝 Ajuda com DS-160',
            action: () => console.log('Help with DS-160'),
            type: 'primary'
          },
          {
            label: '🎭 Simulação de Entrevista',
            action: () => console.log('Interview simulation'),
            type: 'secondary'
          }
        ]
      }
    }
    
    // Documentos
    else if (lowerMessage.includes('documento') || lowerMessage.includes('papéis')) {
      const docs = customerData.destinationCountry === 'Estados Unidos' 
        ? ['Passaporte válido', 'Formulário DS-160', 'Foto 5x5cm', 'Comprovante financeiro', 'Carta do empregador']
        : ['Passaporte válido', 'Formulários consulares', 'Comprovantes financeiros', 'Seguro viagem']

      response = {
        id: Date.now().toString(),
        text: `📄 **Documentos para ${customerData.destinationCountry}**

**Lista Essencial:**
${docs.map((doc, i) => `${i + 1}️⃣ ${doc}`).join('\n')}

${customerData.package === 'LEAD' 
  ? '🔓 **Lista completa + checklist detalhado no plano Premium**'
  : '✅ **Posso analisar seus documentos via upload!**'
}

**Status Atual:**
• Passaporte: ✅ Aprovado (98/100)
• DS-160: ⏳ Pendente
• Financeiro: 🔄 Em análise (85/100)`,
        sender: 'sofia',
        timestamp: new Date(),
        type: customerData.package === 'LEAD' ? 'upsell' : 'info',
        actions: customerData.package === 'LEAD' ? [
          {
            label: '🚀 Upgrade para análise completa',
            action: () => console.log('Upgrade for documents'),
            type: 'upsell'
          }
        ] : [
          {
            label: '📤 Upload de Documentos',
            action: () => console.log('Open document upload'),
            type: 'primary'
          }
        ]
      }
    }
    
    // Custos
    else if (lowerMessage.includes('preço') || lowerMessage.includes('custo') || lowerMessage.includes('valor')) {
      response = {
        id: Date.now().toString(),
        text: `💰 **Custos para ${customerData.destinationCountry}**

**Taxas Consulares:**
• Visto: $185 USD
• SEVIS (se aplicável): $350 USD

**Documentação:**
• Traduções juramentadas: R$ 100-200
• Fotos oficiais: R$ 30-50

**Nossos Serviços:**
${packageInfo.icon} **${packageInfo.name}** (Seu pacote atual)

Quer saber sobre outros pacotes ou serviços adicionais?`,
        sender: 'sofia',
        timestamp: new Date(),
        type: 'info',
        actions: [
          {
            label: '📊 Comparar Pacotes',
            action: () => console.log('Compare plans'),
            type: 'secondary'
          },
          {
            label: '🎯 Serviços Adicionais',
            action: () => console.log('Additional services'),
            type: 'primary'
          }
        ]
      }
    }
    
    // Upsells Contextuais
    else if (lowerMessage.includes('upgrade') || lowerMessage.includes('premium') || lowerMessage.includes('vip')) {
      response = {
        id: Date.now().toString(),
        text: `🚀 **Planos Disponíveis para Você**

**📋 Básico (R$ 299)**
• Análise IA + Consultoria 30min
• Lista de documentos

**⭐ Premium (R$ 599)** ← *Mais Popular*
• Consultoria 60min + Revisão docs
• Acompanhamento 30 dias

**👑 VIP (R$ 1.299)**
• Consultor dedicado + Garantia
• Preenchimento de formulários

**Oferta Especial:** 20% OFF hoje!`,
        sender: 'sofia',
        timestamp: new Date(),
        type: 'upsell',
        actions: [
          {
            label: '⭐ Escolher Premium',
            action: () => console.log('Select premium'),
            type: 'upsell'
          },
          {
            label: '👑 Escolher VIP',
            action: () => console.log('Select VIP'),
            type: 'upsell'
          }
        ]
      }
    }
    
    // Resposta padrão
    else {
      response = {
        id: Date.now().toString(),
        text: `🤖 Entendi! Como sua assistente IA, posso ajudar com:

**Informações Gerais:**
• Análise de elegibilidade
• Documentos necessários
• Timeline do processo
• Custos e taxas

**Seu Acesso (${packageInfo.name}):**
${packageInfo.features.map(f => `• ✅ ${f}`).join('\n')}

${packageInfo.limitations.length > 0 ? '\n**Limitações Atuais:**\n' + packageInfo.limitations.map(l => `• ❌ ${l}`).join('\n') : ''}

O que você gostaria de saber?`,
        sender: 'sofia',
        timestamp: new Date(),
        type: 'info',
        actions: [
          {
            label: '📊 Analisar Elegibilidade',
            action: () => sendMessage('Analise minha elegibilidade'),
            type: 'primary'
          },
          {
            label: '📋 Ver Documentos',
            action: () => sendMessage('Que documentos preciso?'),
            type: 'secondary'
          }
        ]
      }
    }

    return response
  }

  const sendMessage = (message: string) => {
    if (!message.trim()) return

    const userMessage: SofiaMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const sofiaResponse = generateSofiaResponse(message)
      setMessages(prev => [...prev, sofiaResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleSendMessage = () => {
    sendMessage(newMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  const packageInfo = getPackageFeatures()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Sofia IA</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <p className="text-xs text-white opacity-90">Online • {packageInfo.name}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'sofia' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Sofia IA</span>
                    {message.type === 'upsell' && <Crown className="h-3 w-3 text-yellow-500" />}
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : message.type === 'upsell'
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                    : message.type === 'suggestion'
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className={`text-sm whitespace-pre-line ${
                    message.sender === 'user' 
                      ? 'text-white' 
                      : message.type === 'upsell'
                      ? 'text-gray-800'
                      : 'text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                  
                  {message.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            action.type === 'upsell'
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
                              : action.type === 'primary'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => sendMessage('Como melhorar meu score?')}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
            >
              📈 Score
            </button>
            <button
              onClick={() => sendMessage('Próximos passos?')}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              📋 Passos
            </button>
            <button
              onClick={() => sendMessage('Custos do processo')}
              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              💰 Custos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}