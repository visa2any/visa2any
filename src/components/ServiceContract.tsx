'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, Check, AlertTriangle } from 'lucide-react'

interface ServiceContractProps {
  serviceType: 'relatorio-premium' | 'consultoria-express' | 'assessoria-vip'
  clientName: string
  clientEmail: string
  clientCPF?: string
  price: number
  onAccept: () => void
  onDecline: () => void
}

export default function ServiceContract({ 
  serviceType, 
  clientName, 
  clientEmail, 
  clientCPF, 
  price, 
  onAccept, 
  onDecline 
}: ServiceContractProps) {
  const [accepted, setAccepted] = useState(false)
  const [showContract, setShowContract] = useState(false)

  const getServiceDescription = () => {
    switch (serviceType) {
      case 'relatorio-premium':
        return {
          name: 'Relatório Premium de Elegibilidade',
          includes: [
            'Análise detalhada do perfil do cliente',
            'Relatório PDF personalizado',
            'Lista de documentos necessários',
            'Timeline estimado',
            'Recomendações estratégicas'
          ]
        }
      case 'consultoria-express':
        return {
          name: 'Consultoria Express 60 minutos',
          includes: [
            'Consultoria de 60 minutos com especialista',
            'Análise personalizada do caso',
            'Plano de ação detalhado',
            'Suporte WhatsApp por 30 dias',
            'Revisão de documentos básica'
          ]
        }
      case 'assessoria-vip':
        return {
          name: 'Assessoria VIP Completa',
          includes: [
            'Acompanhamento completo do processo',
            'Preparação de toda documentação',
            'Submissão da aplicação',
            'Suporte até decisão final',
            'Retrabalho em caso de erro nosso'
          ]
        }
    }
  }

  const service = getServiceDescription()

  const contractText = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSESSORIA EM IMIGRAÇÃO

CONTRATANTE: ${clientName}
CPF: ${clientCPF || 'A ser informado'}
EMAIL: ${clientEmail}
CONTRATADA: Visa2Any Consultoria Internacional LTDA

1. OBJETO DO CONTRATO
A CONTRATADA se compromete a prestar o serviço "${service.name}" pelo valor de R$ ${price.toFixed(2).replace('.', ',')}, incluindo:

${service.includes.map(item => `• ${item}`).join('\n')}

2. LIMITAÇÕES DE RESPONSABILIDADE
2.1. A CONTRATADA NÃO GARANTE a aprovação de visto ou imigração
2.2. A aprovação é decisão EXCLUSIVA das autoridades governamentais
2.3. A CONTRATADA se responsabiliza apenas pela qualidade da assessoria prestada
2.4. Mudanças nas leis de imigração podem afetar o processo sem responsabilidade da CONTRATADA

3. NACIONALIDADE E ESPECIFICIDADES
3.1. As orientações consideram a nacionalidade do CONTRATANTE
3.2. Cada país possui regras específicas para diferentes nacionalidades
3.3. Acordos bilaterais podem facilitar ou dificultar processos
3.4. A CONTRATADA informará sobre especificidades conhecidas na data do contrato

4. OBRIGAÇÕES DO CONTRATANTE
4.1. Fornecer informações verdadeiras e completas
4.2. Seguir integralmente as orientações fornecidas
4.3. Comunicar mudanças em sua situação
4.4. Efetuar pagamento nas condições acordadas

5. OBRIGAÇÕES DA CONTRATADA
5.1. Prestar assessoria com diligência e conhecimento técnico
5.2. Manter sigilo sobre informações do CONTRATANTE
5.3. Informar sobre mudanças relevantes nas leis (quando conhecidas)
5.4. Cumprir prazos e escopo acordados

6. GARANTIAS E REEMBOLSO
6.1. Garantimos a qualidade da assessoria prestada
6.2. Em caso de erro comprovadamente nosso, refazemos o trabalho gratuitamente
6.3. NÃO há reembolso por decisões negativas das autoridades
6.4. Reembolso apenas se não cumprirmos o escopo contratado

7. PROTEÇÃO DE DADOS (LGPD)
7.1. Dados pessoais utilizados apenas para prestação do serviço
7.2. Não compartilhamos dados com terceiros sem autorização
7.3. Cliente pode solicitar exclusão de dados após conclusão do serviço
7.4. Dados mantidos conforme exigências legais

8. MUDANÇAS NAS LEIS
8.1. Leis de imigração podem mudar durante o processo
8.2. CONTRATADA informará mudanças relevantes quando possível
8.3. Mudanças podem afetar timeline e requisitos
8.4. Não há responsabilidade por mudanças governamentais

9. FORO E LEGISLAÇÃO
9.1. Foro da comarca de [SUA CIDADE]
9.2. Aplicação do Código de Defesa do Consumidor
9.3. Resolução de conflitos prioritariamente por mediação

10. VALIDADE
Este contrato é válido a partir da aceitação eletrônica e permanece vigente até conclusão dos serviços ou rescisão por qualquer das partes.

11. ASSINATURA ELETRÔNICA
Ao aceitar este contrato eletronicamente, o CONTRATANTE declara:
- Ter lido e compreendido todas as cláusulas
- Aceitar integralmente os termos e condições
- Confirmar a veracidade das informações fornecidas
- Autorizar o uso de sua assinatura eletrônica para fins contratuais

ASSINADO ELETRONICAMENTE EM: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

CONTRATANTE: ${clientName}
CPF: ${clientCPF || 'A ser informado'}
ASSINATURA ELETRÔNICA: [Aceito eletronicamente]

CONTRATADA: Visa2Any Consultoria Internacional LTDA
CNPJ: XX.XXX.XXX/0001-XX
ASSINATURA ELETRÔNICA: [Sistema automatizado]
  `

  if (!showContract) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Contrato de Prestação de Serviços
          </h3>
          <p className="text-gray-600">
            Antes de prosseguir, é necessário aceitar os termos do contrato
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-2">Importante - Leia com Atenção:</p>
              <ul className="space-y-1 text-xs">
                <li>• Cada nacionalidade tem regras específicas para imigração</li>
                <li>• Não garantimos aprovação de visto (decisão governamental)</li>
                <li>• Leis de imigração podem mudar durante o processo</li>
                <li>• Garantimos apenas a qualidade da assessoria prestada</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setShowContract(true)}
            className="w-full btn-gradient"
          >
            <FileText className="mr-2 h-4 w-4" />
            Ler Contrato Completo
          </Button>
          
          <div className="text-center">
            <button
              onClick={onDecline}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-gray-900">
          Contrato de Prestação de Serviços
        </h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
          {contractText}
        </pre>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">
              Declaro que li e aceito integralmente os termos deste contrato
            </p>
            <p className="text-xs text-gray-500">
              Ao aceitar, você concorda com todas as cláusulas, limitações e responsabilidades descritas
            </p>
          </div>
        </label>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={onAccept}
          disabled={!accepted}
          className="flex-1 btn-gradient"
        >
          <Check className="mr-2 h-4 w-4" />
          Aceitar e Prosseguir
        </Button>
        
        <Button
          onClick={onDecline}
          variant="outline"
          className="flex-1"
        >
          Recusar
        </Button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            const element = document.createElement('a')
            const file = new Blob([contractText], { type: 'text/plain' })
            element.href = URL.createObjectURL(file)
            element.download = `contrato-visa2any-${Date.now()}.txt`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          }}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
        >
          <Download className="mr-1 h-3 w-3" />
          Baixar Cópia do Contrato
        </button>
      </div>
    </div>
  )
}