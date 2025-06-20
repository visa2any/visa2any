'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send, Bot, User, Phone, Calendar, FileText, Globe } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  options?: ChatOption[]
}

interface ChatOption {
  id: string
  text: string
  action: () => void
}

interface UserData {
  name?: string
  email?: string
  phone?: string
  country?: string
  visaType?: string
  timeline?: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState('welcome')
  const [userData, setUserData] = useState<UserData>({})
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [isHidden, setIsHidden] = useState(false) // Esconder durante análises
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Escutar eventos para esconder ChatBot durante análises
  useEffect(() => {
    const handleHideChatBot = () => setIsHidden(true)
    const handleShowChatBot = () => setIsHidden(false)

    window.addEventListener('hideChatBot', handleHideChatBot)
    window.addEventListener('showChatBot', handleShowChatBot)

    return () => {
      window.removeEventListener('hideChatBot', handleHideChatBot)
      window.removeEventListener('showChatBot', handleShowChatBot)
    }
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem de boas-vindas
      setTimeout(() => {
        addBotMessage(
          "👋 Olá! Sou a Sofia, assistente virtual da Visa2Any. Estou aqui para ajudar você a realizar seu sonho internacional! Como posso te ajudar hoje?",
          getWelcomeOptions()
        )
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (text: string, options?: ChatOption[]) => {
    setIsTyping(true)
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        options
      }
      setMessages(prev => [...prev, newMessage])
      setIsTyping(false)
    }, 1000)
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const getWelcomeOptions = (): ChatOption[] => [
    {
      id: 'visa-info',
      text: '🌍 Quero informações sobre vistos',
      action: () => handleVisaInquiry()
    },
    {
      id: 'eligibility',
      text: '📋 Verificar minha elegibilidade',
      action: () => handleEligibilityCheck()
    },
    {
      id: 'consultation',
      text: '💬 Agendar consultoria gratuita',
      action: () => handleConsultationRequest()
    },
    {
      id: 'speak-human',
      text: '👨‍💼 Falar com especialista',
      action: () => handleHumanAgent()
    }
  ]

  const getVisaTypeOptions = (): ChatOption[] => [
    {
      id: 'tourism',
      text: '🏖️ Visto de Turismo',
      action: () => handleVisaTypeSelection('turismo')
    },
    {
      id: 'work',
      text: '💼 Visto de Trabalho',
      action: () => handleVisaTypeSelection('trabalho')
    },
    {
      id: 'study',
      text: '🎓 Visto de Estudo',
      action: () => handleVisaTypeSelection('estudo')
    },
    {
      id: 'investment',
      text: '💰 Visto de Investimento',
      action: () => handleVisaTypeSelection('investimento')
    }
  ]

  const getCountryOptions = (): ChatOption[] => [
    {
      id: 'usa',
      text: '🇺🇸 Estados Unidos',
      action: () => handleCountrySelection('Estados Unidos')
    },
    {
      id: 'canada',
      text: '🇨🇦 Canadá',
      action: () => handleCountrySelection('Canadá')
    },
    {
      id: 'australia',
      text: '🇦🇺 Austrália', 
      action: () => handleCountrySelection('Austrália')
    },
    {
      id: 'europe',
      text: '🇪🇺 União Europeia',
      action: () => handleCountrySelection('União Europeia')
    },
    {
      id: 'other',
      text: '🌏 Outro país',
      action: () => handleCountrySelection('Outro')
    }
  ]

  const handleVisaInquiry = () => {
    addUserMessage('Quero informações sobre vistos')
    addBotMessage(
      "Perfeito! Para te dar as melhores informações, qual tipo de visto você está interessado?",
      getVisaTypeOptions()
    )
    setCurrentStep('visa-type')
  }

  const handleEligibilityCheck = () => {
    addUserMessage('Verificar minha elegibilidade')
    addBotMessage(
      "Ótima escolha! Vou fazer algumas perguntas para avaliar seu perfil. Primeiro, qual seu nome?"
    )
    setCurrentStep('collect-name')
  }

  const handleConsultationRequest = () => {
    addUserMessage('Agendar consultoria gratuita')
    addBotMessage(
      "Excelente! Oferecemos dois tipos de consultoria gratuita:",
      [
        {
          id: 'ai-consultation',
          text: '🤖 Consultoria IA (30min) - Imediata',
          action: () => handleAIConsultation()
        },
        {
          id: 'human-consultation', 
          text: '👨‍💼 Consultoria Humana - Agendada',
          action: () => handleHumanConsultation()
        }
      ]
    )
  }

  const handleAIConsultation = () => {
    addUserMessage('Consultoria IA (30min) - Imediata')
    addBotMessage(
      "Perfeita escolha! Nossa IA Sofia fará uma análise completa de 30 minutos do seu perfil. Você receberá:\n\n" +
      "✅ Score de elegibilidade personalizado\n" +
      "✅ Lista de documentos necessários\n" +
      "✅ Timeline e custos estimados\n" +
      "✅ Relatório PDF completo\n\n" +
      "Vamos começar agora mesmo?",
      [
        {
          id: 'start-ai-consultation',
          text: '🚀 Começar Consultoria IA Agora',
          action: () => window.open('/consultoria-ia', '_blank')
        },
        {
          id: 'learn-more-ai',
          text: 'ℹ️ Quero saber mais sobre a IA',
          action: () => handleLearnMoreAI()
        }
      ]
    )
  }

  const handleHumanConsultation = () => {
    addUserMessage('Consultoria Humana - Agendada')
    addBotMessage(
      "Ótima opção! Nossos especialistas humanos oferecem consultoria para casos mais complexos ou quando você prefere atendimento personalizado. Para agendar, preciso de alguns dados básicos. Qual seu nome?"
    )
    setCurrentStep('collect-name-consultation')
  }

  const handleLearnMoreAI = () => {
    addUserMessage('Quero saber mais sobre a IA')
    addBotMessage(
      "🤖 **Nossa IA Sofia** é especializada em imigração com:\n\n" +
      "• **Algoritmo proprietário** que analisa +50 variáveis\n" +
      "• **Base de dados** de 10.000+ casos de sucesso\n" +
      "• **Precisão de 95%** em predições de elegibilidade\n" +
      "• **Atualização constante** com mudanças nas leis\n\n" +
      "Se o caso for complexo, a própria IA recomenda escalação para humano.\n\n" +
      "Gostaria de testar agora?",
      [
        {
          id: 'test-ai-now',
          text: '✨ Sim, vamos testar!',
          action: () => window.open('/consultoria-ia', '_blank')
        },
        {
          id: 'human-instead',
          text: '👨‍💼 Prefiro consultoria humana',
          action: () => handleHumanConsultation()
        }
      ]
    )
  }

  const handleHumanAgent = () => {
    addUserMessage('Falar com especialista')
    addBotMessage(
      "Claro! Vou te conectar com um especialista agora. Enquanto isso, você pode me dar seu WhatsApp para que ele entre em contato?",
      [
        {
          id: 'whatsapp',
          text: '📱 Enviar WhatsApp',
          action: () => window.open('https://wa.me/5511999999999?text=Olá! Vim do site da Visa2Any e gostaria de falar com um especialista sobre vistos.', '_blank')
        },
        {
          id: 'phone',
          text: '📞 Ligação',
          action: () => window.open('tel:+5511999999999')
        }
      ]
    )
  }

  const handleVisaTypeSelection = (type: string) => {
    setUserData(prev => ({ ...prev, visaType: type }))
    addUserMessage(`Visto de ${type}`)
    addBotMessage(
      `Excelente escolha! O visto de ${type} é uma das nossas especialidades. Para qual país você gostaria de viajar?`,
      getCountryOptions()
    )
    setCurrentStep('country-selection')
  }

  const handleCountrySelection = (country: string) => {
    setUserData(prev => ({ ...prev, country }))
    addUserMessage(country)
    
    const visaType = userData.visaType || 'este tipo de visto'
    addBotMessage(
      `Perfeito! ${country} é um destino muito procurado para ${visaType}. ` +
      `Nossa taxa de aprovação para ${country} é de 98%! ` +
      `Gostaria de uma análise gratuita do seu perfil agora mesmo?`,
      [
        {
          id: 'free-analysis',
          text: '✅ Sim, quero análise gratuita',
          action: () => handleFreeAnalysis()
        },
        {
          id: 'schedule',
          text: '📅 Prefiro agendar consulta',
          action: () => handleConsultationRequest()
        },
        {
          id: 'more-info',
          text: 'ℹ️ Quero mais informações',
          action: () => handleMoreInfo()
        }
      ]
    )
  }

  const handleFreeAnalysis = () => {
    addUserMessage('Sim, quero análise gratuita')
    addBotMessage(
      "Fantástico! Para fazer sua análise personalizada, preciso de alguns dados. Qual seu nome completo?"
    )
    setCurrentStep('collect-name-analysis')
  }

  const handleMoreInfo = () => {
    addUserMessage('Quero mais informações')
    const country = userData.country || 'este país'
    const visaType = userData.visaType || 'este visto'
    
    addBotMessage(
      `📋 **Informações sobre ${visaType} para ${country}:**\n\n` +
      `✅ **Taxa de aprovação:** 98%\n` +
      `⏱️ **Tempo de processamento:** 15-30 dias\n` +
      `📄 **Documentos necessários:** Análise personalizada\n` +
      `💰 **Investimento:** A partir de R$ 2.500\n\n` +
      `Gostaria de agendar uma consultoria gratuita para discutir seu caso específico?`,
      [
        {
          id: 'schedule-now',
          text: '📅 Agendar agora',
          action: () => handleConsultationRequest()
        },
        {
          id: 'whatsapp-info',
          text: '📱 Receber por WhatsApp',
          action: () => window.open('https://wa.me/5511999999999?text=Quero receber informações sobre vistos e assessoria internacional.', '_blank')
        }
      ]
    )
  }

  const getIntelligentResponse = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    // Análise de sentimento e intenção
    const keywords = {
      pricing: ['preço', 'valor', 'custo', 'quanto', 'custa', 'barato', 'caro', 'investimento', 'pagar'],
      time: ['tempo', 'prazo', 'demora', 'rapidez', 'quanto tempo', 'quando', 'urgente', 'rápido'],
      documents: ['documento', 'papel', 'certidão', 'passaporte', 'rg', 'comprovante', 'exigência'],
      countries: ['eua', 'estados unidos', 'canadá', 'canada', 'portugal', 'austrália', 'alemanha', 'frança', 'italia'],
      visa_types: ['turismo', 'trabalho', 'estudo', 'estudar', 'trabalhar', 'investimento', 'negócio'],
      success: ['aprovado', 'conseguiu', 'deu certo', 'sucesso', 'aprovação', 'taxa'],
      difficulty: ['difícil', 'complicado', 'problema', 'negado', 'rejeitado', 'dificuldade'],
      urgent: ['urgente', 'emergência', 'rápido', 'pressa', 'logo'],
      help: ['ajuda', 'socorro', 'não sei', 'perdido', 'confuso', 'dúvida']
    }

    // Detectar intenção principal
    let intent = 'general'
    let confidence = 0
    
    for (const [key, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowerMessage.includes(word)).length
      const score = matches / words.length
      if (score > confidence) {
        confidence = score
        intent = key
      }
    }

    // Respostas inteligentes baseadas na intenção
    switch (intent) {
      case 'pricing':
        return {
          text: "💰 **Nossos preços são transparentes e competitivos:**\n\n" +
                "🆓 **Análise Gratuita** - Começe sem gastar nada\n" +
                "📄 **Relatório Premium** - R$ 97 a R$ 497 (varia por país)\n" +
                "👨‍💼 **Consultoria 1:1** - R$ 297 a R$ 797\n" +
                "👑 **Serviço VIP** - R$ 1.497 a R$ 4.997\n\n" +
                "💡 O preço varia conforme país e complexidade. Quer uma cotação específica?",
          options: [
            { id: 'pricing-calc', text: '🧮 Calcular meu preço', action: () => window.open('/precos', '_blank') },
            { id: 'free-analysis', text: '🆓 Começar grátis', action: () => window.open('/consultoria-ia', '_blank') }
          ]
        }

      case 'time':
        return {
          text: "⏰ **Nossos prazos otimizados:**\n\n" +
                "🚀 **Análise IA**: 15 minutos\n" +
                "📋 **Relatório Premium**: Imediato\n" +
                "👨‍💼 **Consultoria**: Agendamento em 24h\n" +
                "📄 **Prep. Documentos**: 7-15 dias\n" +
                "🏛️ **Processamento Oficial**: 15-45 dias (gov.)\n\n" +
                "💡 Processos urgentes têm prioridade no serviço VIP!",
          options: [
            { id: 'urgent-service', text: '🚨 Serviço Urgente', action: () => handleVipService() },
            { id: 'normal-timeline', text: '📅 Timeline Normal', action: () => handleConsultationRequest() }
          ]
        }

      case 'documents':
        return {
          text: "📋 **Documentos variam por país e tipo de visto:**\n\n" +
                "🇺🇸 **EUA**: Passaporte, DS-160, foto, comprovantes financeiros\n" +
                "🇨🇦 **Canadá**: Passaporte, formulários, biometria, exames\n" +
                "🇵🇹 **Portugal**: Passaporte, PB4, comprovantes, seguro\n\n" +
                "📊 Nossa análise identifica EXATAMENTE quais você precisa!",
          options: [
            { id: 'doc-analysis', text: '📋 Ver meus documentos', action: () => handleEligibilityCheck() },
            { id: 'doc-templates', text: '📄 Templates gratuitos', action: () => handleDownloadGuide() }
          ]
        }

      case 'countries':
        const country = detectCountry(lowerMessage)
        return {
          text: `🌍 **${country || 'País de interesse'}:**\n\n` +
                "✅ Temos especialistas para todos os destinos\n" +
                "📊 Taxa de aprovação média: 95%\n" +
                "🎯 Estratégias personalizadas por país\n" +
                "📞 Consultores nativos disponíveis\n\n" +
                "Quer saber sua elegibilidade específica?",
          options: [
            { id: 'country-analysis', text: `🎯 Analisar para ${country}`, action: () => handleEligibilityCheck() },
            { id: 'country-info', text: '📚 Informações detalhadas', action: () => handleMoreInfo() }
          ]
        }

      case 'success':
        return {
          text: "🏆 **Nossa taxa de sucesso é excepcional:**\n\n" +
                "✅ **95% de aprovação geral**\n" +
                "🇺🇸 EUA: 92% | 🇨🇦 Canadá: 97% | 🇵🇹 Portugal: 98%\n" +
                "🎯 **+10.000 vistos aprovados**\n" +
                "⭐ 4.9/5 estrelas de satisfação\n\n" +
                "Nossa metodologia comprovada maximiza suas chances!",
          options: [
            { id: 'testimonials', text: '💬 Ver depoimentos', action: () => window.open('/#depoimentos', '_blank') },
            { id: 'start-process', text: '🚀 Começar agora', action: () => handleEligibilityCheck() }
          ]
        }

      case 'difficulty':
        return {
          text: "😰 **Casos complexos são nossa especialidade:**\n\n" +
                "🔧 Perfis desafiadores: Nossa expertise\n" +
                "📈 Estratégias de fortalecimento\n" +
                "🎯 Abordagens alternativas\n" +
                "👨‍💼 Consultores senior especializados\n\n" +
                "📞 Não desista! Vamos encontrar uma solução juntos.",
          options: [
            { id: 'complex-case', text: '🆘 Caso complexo', action: () => handleComplexCase() },
            { id: 'specialist-call', text: '📞 Falar com especialista', action: () => handleHumanAgent() }
          ]
        }

      case 'urgent':
        return {
          text: "🚨 **Casos urgentes - Serviço Expresso:**\n\n" +
                "⚡ Prioridade máxima\n" +
                "📞 Atendimento imediato\n" +
                "🏃‍♂️ Processamento acelerado\n" +
                "📋 Documentação expressa\n\n" +
                "💡 Serviço VIP garante máxima agilidade!",
          options: [
            { id: 'urgent-vip', text: '🚨 Serviço VIP Urgente', action: () => handleVipService() },
            { id: 'urgent-call', text: '📞 Ligar agora', action: () => window.open('tel:+5511999999999') }
          ]
        }

      case 'help':
        return {
          text: "🤝 **Estou aqui para te guiar:**\n\n" +
                "1️⃣ **Primeiro**: Análise gratuita (15min)\n" +
                "2️⃣ **Segundo**: Relatório personalizado\n" +
                "3️⃣ **Terceiro**: Consultoria especializada\n" +
                "4️⃣ **Quarto**: Execução completa\n\n" +
                "📞 Ou fale direto com um humano!",
          options: [
            { id: 'step-by-step', text: '👣 Guia passo a passo', action: () => handleStepByStep() },
            { id: 'human-help', text: '🙋‍♂️ Falar com humano', action: () => handleHumanAgent() }
          ]
        }

      default:
        return {
          text: "🤖 **Sou Sofia, sua assistente de imigração!**\n\n" +
                "Posso te ajudar com:\n" +
                "🌍 Informações sobre qualquer país\n" +
                "📋 Análise de elegibilidade\n" +
                "💰 Cotações personalizadas\n" +
                "📅 Agendamento de consultorias\n\n" +
                "O que você gostaria de saber?",
          options: getWelcomeOptions()
        }
    }
  }

  const detectCountry = (message: string) => {
    const countries = {
      'eua': 'EUA', 'estados unidos': 'EUA', 'america': 'EUA',
      'canada': 'Canadá', 'canadá': 'Canadá',
      'portugal': 'Portugal', 'português': 'Portugal',
      'australia': 'Austrália', 'austrália': 'Austrália',
      'alemanha': 'Alemanha', 'germany': 'Alemanha',
      'frança': 'França', 'france': 'França',
      'italia': 'Itália', 'italy': 'Itália'
    }
    
    for (const [key, value] of Object.entries(countries)) {
      if (message.includes(key)) return value
    }
    return null
  }

  const handleVipService = () => {
    addUserMessage('Serviço VIP')
    addBotMessage(
      "👑 **Serviço VIP - Fazemos tudo para você:**\n\n" +
      "✅ Preparação completa de documentos\n" +
      "✅ Submissão da aplicação\n" +
      "✅ Acompanhamento até aprovação\n" +
      "✅ Suporte ilimitado 24/7\n" +
      "✅ Garantia de retrabalho\n\n" +
      "📞 Conectando com especialista VIP...",
      [
        { id: 'vip-pricing', text: '💎 Ver preços VIP', action: () => window.open('/precos', '_blank') },
        { id: 'vip-call', text: '📞 Ligar para VIP', action: () => window.open('tel:+5511999999999') }
      ]
    )
  }

  const handleComplexCase = () => {
    addUserMessage('Caso complexo')
    addBotMessage(
      "🔧 **Casos complexos são nossa especialidade:**\n\n" +
      "📊 Análise detalhada do seu histórico\n" +
      "🎯 Estratégias específicas para seu perfil\n" +
      "📈 Plano de fortalecimento personalizado\n" +
      "👨‍💼 Consultores senior especializados\n\n" +
      "Vamos encontrar a melhor solução juntos!",
      [
        { id: 'complex-analysis', text: '🔍 Análise especializada', action: () => handleEligibilityCheck() },
        { id: 'senior-consultant', text: '👨‍💼 Consultor senior', action: () => handleHumanAgent() }
      ]
    )
  }

  const handleStepByStep = () => {
    addUserMessage('Guia passo a passo')
    addBotMessage(
      "👣 **Seu caminho para o visto:**\n\n" +
      "🆓 **PASSO 1**: Análise gratuita (15min)\n" +
      "📄 **PASSO 2**: Relatório premium detalhado\n" +
      "👨‍💼 **PASSO 3**: Consultoria especializada\n" +
      "📋 **PASSO 4**: Preparação documentos\n" +
      "✈️ **PASSO 5**: Seu visto aprovado!\n\n" +
      "Vamos começar pelo primeiro passo?",
      [
        { id: 'start-step1', text: '🚀 Começar PASSO 1', action: () => window.open('/consultoria-ia', '_blank') },
        { id: 'see-all-steps', text: '👀 Ver todos os passos', action: () => window.open('/', '_blank') }
      ]
    )
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    const message = inputValue.toLowerCase()
    
    // Processamento inteligente baseado no step atual
    if (currentStep === 'collect-name' || currentStep === 'collect-name-consultation' || currentStep === 'collect-name-analysis') {
      setUserData(prev => ({ ...prev, name: inputValue }))
      addBotMessage(
        `Prazer em conhecer você, ${inputValue}! Agora, qual seu melhor email?`
      )
      setCurrentStep('collect-email')
    } else if (currentStep === 'collect-email') {
      setUserData(prev => ({ ...prev, email: inputValue }))
      addBotMessage(
        "Perfeito! E qual seu WhatsApp para eu te enviar as informações?"
      )
      setCurrentStep('collect-phone')
    } else if (currentStep === 'collect-phone') {
      setUserData(prev => ({ ...prev, phone: inputValue }))
      addBotMessage(
        `Excelente, ${userData.name}! Tenho todos os dados necessários. ` +
        `Um especialista entrará em contato em até 2 horas. ` +
        `Enquanto isso, que tal agendar sua consultoria gratuita?`,
        [
          {
            id: 'schedule-consultation',
            text: '📅 Agendar consultoria',
            action: () => window.open('/agendamento', '_blank')
          },
          {
            id: 'download-guide',
            text: '📚 Baixar guia gratuito',
            action: () => handleDownloadGuide()
          }
        ]
      )
      setCurrentStep('completed')
    } else {
      // Usar resposta inteligente
      const response = getIntelligentResponse(message)
      addBotMessage(response.text, response.options)
    }

    setInputValue('')
  }

  const handleDownloadGuide = () => {
    addUserMessage('Baixar guia gratuito')
    addBotMessage(
      "📚 Perfeito! Estou enviando o **'Guia Completo de Vistos 2024'** para seu email. " +
      "Você receberá em alguns minutos com tudo que precisa saber!"
    )
    // Aqui integraria com sistema de email marketing
  }

  const quickActions = [
    { icon: Globe, text: 'Vistos', action: () => handleVisaInquiry() },
    { icon: FileText, text: 'Elegibilidade', action: () => handleEligibilityCheck() },
    { icon: Calendar, text: 'Agendar', action: () => handleConsultationRequest() },
    { icon: Phone, text: 'Contato', action: () => handleHumanAgent() }
  ]

  // Não renderizar se ChatBot estiver escondido
  if (isHidden) return null

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Sofia - Assistente IA</div>
                <div className="text-xs opacity-90">🟢 Online • Resposta em segundos</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center mb-1">
                      <Bot className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Sofia</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{message.text}</div>
                  
                  {/* Options */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={option.action}
                          className="block w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium mr-2">Sofia</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && messages.length === 0 && (
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500 mb-2">Ações rápidas:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                  >
                    <action.icon className="h-4 w-4 mr-1" />
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={handleSendMessage} className="p-2">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}