import Footer from '@/components/Footer'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="page-content py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-lg text-gray-600">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Coletamos as seguintes informações para prestar nossos serviços:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Dados pessoais: nome, CPF, RG, passaporte</li>
                <li>Informações de contato: email, telefone, endereço</li>
                <li>Documentos pessoais necessários para os serviços</li>
                <li>Informações profissionais e acadêmicas</li>
                <li>Dados de navegação no site (cookies)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Como Utilizamos suas Informações</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Suas informações são utilizadas exclusivamente para:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Prestação dos serviços contratados</li>
                <li>Comunicação sobre o andamento dos processos</li>
                <li>Melhoria dos nossos serviços</li>
                <li>Cumprimento de obrigações legais</li>
                <li>Envio de informações relevantes sobre nossos serviços</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Compartilhamento de Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Seus dados podem ser compartilhados apenas com:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Órgãos consulares e governamentais (quando necessário)</li>
                <li>Parceiros de serviços (tradutores, cartórios) sob sigilo</li>
                <li>Autoridades competentes (quando exigido por lei)</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                <strong>Nunca vendemos ou alugamos seus dados pessoais para terceiros.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Segurança dos Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra 
                acesso não autorizado, alteração, divulgação ou destruição, incluindo:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Criptografia de dados sensíveis</li>
                <li>Acesso restrito por colaboradores autorizados</li>
                <li>Sistemas de backup seguros</li>
                <li>Monitoramento contínuo de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Seus Direitos (LGPD)</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Conforme a Lei Geral de Proteção de Dados, você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a exclusão de dados desnecessários</li>
                <li>Revogar consentimento</li>
                <li>Solicitar a portabilidade dos dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Retenção de Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Mantemos seus dados pelo tempo necessário para cumprir as finalidades para as quais foram coletados, 
                respeitando prazos legais e regulamentares aplicáveis aos serviços de consultoria e documentação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos cookies para melhorar sua experiência em nosso site, analisar o tráfego e personalizar 
                conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contato do Encarregado de Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso 
                Encarregado de Proteção de Dados através do email: <strong>privacidade@visa2any.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Alterações nesta Política</h2>
              <p className="text-gray-600 leading-relaxed">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
                através dos nossos canais de comunicação.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}