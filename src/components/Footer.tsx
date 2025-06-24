'use client'

import { Button } from '@/components/ui/button'
import { Globe, MessageCircle, Phone, Shield, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Final no Footer */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold mb-4">🚀 Ainda não fez sua análise gratuita?</h3>
          <p className="text-blue-100 mb-6">Mais de 8.420 brasileiros já descobriram suas chances em 2024</p>
          <a href="/consultoria-ia">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <Zap className="mr-2 h-5 w-5" />
              COMEÇAR ANÁLISE GRÁTIS
            </Button>
          </a>
        </div>
        
        <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-8">
          {/* Empresa */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold">Visa2Any</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              🏆 <strong>Referência em assessoria internacional</strong> desde 2009. 
              Tecnologia IA + expertise humana para aprovar seu visto.
            </p>
            
            {/* Métricas de autoridade */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">8.420+</div>
                <div className="text-xs text-gray-400">Aprovações 2024</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <div className="text-xs text-gray-400">Taxa Sucesso</div>
              </div>
            </div>
            
            {/* Redes sociais otimizadas */}
            <div className="flex space-x-3">
              <a href="https://wa.me/5511519447117" target="_blank" className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors group">
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://instagram.com/visa2any" target="_blank" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors group">
                <span className="text-sm font-bold group-hover:scale-110 transition-transform">ig</span>
              </a>
              <a href="https://linkedin.com/company/visa2any" target="_blank" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors group">
                <span className="text-sm font-bold group-hover:scale-110 transition-transform">in</span>
              </a>
            </div>
          </div>
          
          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">🛠️ Serviços</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="/consultoria-ia" className="hover:text-white transition-colors hover:underline">🤖 IA Consultoria</a></li>
              <li><a href="/vaga-express" className="hover:text-white transition-colors hover:underline">⚡ Vaga Express</a></li>
              <li><a href="/precos" className="hover:text-white transition-colors hover:underline">💎 Pacotes Premium</a></li>
              <li><a href="/kit-emigracao" className="hover:text-white transition-colors hover:underline">📋 Kit Emigração</a></li>
              <li><a href="/assessoria-juridica" className="hover:text-white transition-colors hover:underline">⚖️ Assessoria Jurídica</a></li>
            </ul>
          </div>
          
          {/* Documentação */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-purple-400">📄 Documentação</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="/certidoes" className="hover:text-white transition-colors hover:underline">📜 Certidões</a></li>
              <li><a href="/traducao" className="hover:text-white transition-colors hover:underline">🌐 Tradução Juramentada</a></li>
              <li><a href="/apostilamento" className="hover:text-white transition-colors hover:underline">✅ Apostilamento</a></li>
              <li><a href="/antecedentes" className="hover:text-white transition-colors hover:underline">🛡️ Antecedentes Criminais</a></li>
              <li><a href="/sobre" className="hover:text-white transition-colors hover:underline">ℹ️ Sobre Nós</a></li>
            </ul>
          </div>
          
          {/* Programa de Afiliados */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">💰 Parceiros</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="/afiliados" className="hover:text-yellow-400 transition-colors hover:underline font-medium">🤝 Seja um Afiliado</a></li>
              <li><a href="/afiliado/dashboard" className="hover:text-white transition-colors hover:underline">📊 Portal do Afiliado</a></li>
              <li><a href="/admin/affiliates" className="hover:text-white transition-colors hover:underline">⚙️ Admin Afiliados</a></li>
              <li className="text-xs text-yellow-300 font-medium">💎 Até 30% de comissão</li>
              <li className="text-xs text-gray-400">🚀 Material de marketing</li>
            </ul>
          </div>

          {/* Suporte ao Cliente */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-green-400">📞 Suporte & FAQ</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="https://wa.me/5511519447117" target="_blank" className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                  <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">WhatsApp 24/7</span>
                </a>
              </li>
              <li>
                <a href="tel:+5511519447117" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                  <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Telefone</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@visa2any.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                  <span className="text-sm">📧</span>
                  <span>info@visa2any.com</span>
                </a>
              </li>
              <li>
                <a href="/faq" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                  <span className="text-sm">❓</span>
                  <span>FAQ Vistos</span>
                </a>
              </li>
              <li className="text-sm text-gray-400">
                🤖 IA Sofia sempre online
              </li>
            </ul>
          </div>
        </div>
        
        {/* Links legais e copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="/termos" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="/sobre" className="hover:text-white transition-colors">Sobre Nós</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              <a href="/afiliados" className="hover:text-yellow-400 transition-colors font-medium">💰 Afiliados</a>
              <a href="/contato" className="hover:text-white transition-colors">Contato</a>
            </div>
            <div className="text-sm text-gray-400">
              © 2024-2025 Visa2Any. Todos os direitos reservados.
            </div>
          </div>
          
          {/* Certificações */}
          <div className="mt-6 text-center">
            <div className="flex justify-center items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                LGPD Compliance
              </span>
              <span className="flex items-center gap-1">
                ⚖️ OAB Registrada
              </span>
              <span className="flex items-center gap-1">
                🏛️ Consulados Oficiais
              </span>
              <span className="flex items-center gap-1">
                🔒 SSL Seguro
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}