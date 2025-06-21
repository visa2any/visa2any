
export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="page-content py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos de Uso</h1>
            <p className="text-lg text-gray-600">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-600 leading-relaxed">
                Ao utilizar os serviços da Visa2Any, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Descrição dos Serviços</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A Visa2Any oferece serviços de consultoria e assessoria para:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Processos de solicitação de vistos</li>
                <li>Obtenção de documentos oficiais</li>
                <li>Tradução juramentada</li>
                <li>Apostilamento de documentos</li>
                <li>Consultoria em imigração</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Responsabilidades do Cliente</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Apresentar documentos originais e autênticos</li>
                <li>Cumprir prazos estabelecidos</li>
                <li>Efetuar pagamentos conforme acordado</li>
                <li>Comunicar alterações em sua situação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Limitações de Responsabilidade</h2>
              <p className="text-gray-600 leading-relaxed">
                A Visa2Any atua como consultora e intermediária. Não garantimos a aprovação de vistos, pois a decisão 
                final cabe aos órgãos consulares competentes. Nossa responsabilidade limita-se à qualidade dos serviços 
                prestados conforme padrões profissionais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Política de Reembolso</h2>
              <p className="text-gray-600 leading-relaxed">
                Reembolsos são aplicáveis conforme especificado em cada pacote de serviços. Em casos de negativa 
                consular por motivos não relacionados à qualidade de nossos serviços, o reembolso será analisado 
                caso a caso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Confidencialidade</h2>
              <p className="text-gray-600 leading-relaxed">
                Todos os dados e documentos fornecidos são tratados com absoluta confidencialidade, conforme nossa 
                Política de Privacidade e em conformidade com a LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Alterações nos Termos</h2>
              <p className="text-gray-600 leading-relaxed">
                A Visa2Any reserva-se o direito de alterar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contato</h2>
              <p className="text-gray-600 leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato conosco através dos canais oficiais disponíveis 
                em nosso site.
              </p>
            </section>
          </div>
        </div>
      </div>
      
    </div>
  )
}