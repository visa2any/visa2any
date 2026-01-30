'use client'

import { Globe, Shield } from 'lucide-react'

export default function SimpleFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Visa2Any</span>
            </div>
            <p className="text-gray-300 text-sm">
              Referência em assessoria internacional desde 2009.
              Tecnologia + expertise para aprovar seu visto.
            </p>
          </div>

          {/* Links principais */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="/consultoria-ia" className="hover:text-white transition-colors">IA Consultoria</a></li>
              <li><a href="/vaga-express" className="hover:text-white transition-colors">Vaga Express</a></li>
              <li><a href="/precos" className="hover:text-white transition-colors">Preços</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>WhatsApp: (11) 5194-47170</li>
              <li>Email: visa2any@gmail.com</li>
              <li className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Checkout Seguro
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © 2024 Visa2Any. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}