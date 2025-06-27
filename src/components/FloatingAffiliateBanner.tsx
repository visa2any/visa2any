'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, DollarSign, TrendingUp } from 'lucide-react'

export default function FloatingAffiliateBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Mostrar banner após 30 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const closeBanner = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isClosing ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl shadow-2xl p-4 max-w-sm relative">
        <button
          onClick={closeBanner}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">💰 Ganhe Dinheiro!</h3>
            <p className="text-xs text-yellow-100 mb-3">
              Indique nossos serviços e ganhe até 30% de comissão
            </p>
            
            <Button 
              onClick={() => window.open('/afiliados', '_blank')}
              className="w-full bg-orange-600 text-white hover:bg-orange-700 font-bold text-xs py-2 shadow-lg"
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              Quero Participar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}