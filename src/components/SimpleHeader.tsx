'use client'

import { Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SimpleHeader() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center">
            <Globe className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-2xl font-bold text-gray-900">Visa2Any</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/precos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Preços
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Sobre
            </Link>
            <Link href="/cliente/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg">
              Área Cliente
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}