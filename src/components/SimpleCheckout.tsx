'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CreditCard, Shield, Check, Clock, Star } from 'lucide-react'

interface SimpleCheckoutProps {
  productId: string
  productName: string
  price: number
  description?: string
  features?: string[]
  className?: string
  variant?: 'default' | 'premium' | 'vip'
  popular?: boolean
  disabled?: boolean
  onSuccess?: () => void
}

export default function SimpleCheckout({
  productId,
  productName,
  price,
  description,
  features = [],
  className = '',
  variant = 'default',
  popular = false,
  disabled = false,
  onSuccess
}: SimpleCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (disabled) return
    
    if (price === 0) {
      // Para produtos gratuitos, ir direto para o formulário,      window.location.href = '/consultoria-ia'
      return
    }
    
    // ✅ Redirecionar DIRETAMENTE para checkout moderno sem modal,    const checkoutUrl = `/checkout-moderno?product=${encodeURIComponent(productId)}`
    window.location.href = checkoutUrl
    onSuccess?.()
  }

  const getButtonStyle = () => {
    switch (variant) {
      case 'premium':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
      case 'vip':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-transparent'
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600'
    }
  }

  const getCardStyle = () => {
    if (popular) {
      return 'border-2 border-blue-500 shadow-xl scale-105 relative'
    }
    if (variant === 'vip') {
      return 'border-2 border-purple-300 shadow-lg relative bg-gradient-to-br from-purple-50 to-blue-50'
    }
    return 'border border-gray-200 shadow-md'
  }

  // ✅ APENAS O CARD DO PRODUTO - SEM MODAL,  return (
    <div className={`bg-white rounded-2xl p-6 ${getCardStyle()} ${className || ''} flex flex-col justify-between`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-1">
            <Star className="h-4 w-4" />
            Mais Popular
          </div>
        </div>
      )}
      
      {variant === 'vip' && (
        <div className="absolute -top-3 right-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold">
            👑 VIP
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{productName}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-bold text-blue-600">
            {price === 0 ? 'GRÁTIS' : `R$ ${price.toLocaleString('pt-BR')}`}
          </span>
          {variant === 'premium' && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Economia de R$ 100+
            </div>
          )}
        </div>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* Trust Signals */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <span className="text-xs text-gray-600">Seguro</span>
          </div>
          <div>
            <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <span className="text-xs text-gray-600">Rápido</span>
          </div>
          <div>
            <Check className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <span className="text-xs text-gray-600">Garantido</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handlePurchase}
        disabled={disabled || isProcessing}
        className={`w-full py-3 text-lg font-semibold ${
          variant === 'vip' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            : variant === 'premium'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
        } text-white`}
      >
        {isProcessing ? (
          'Processando...'
        ) : price === 0 ? (
          <>
            Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
          </>
        ) : (
          <>
            {variant === 'vip' ? 'Contratar VIP' : 'Escolher Pacote'} <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      {/* Payment Methods */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <CreditCard className="h-4 w-4" />
          <span>PIX, Cartão, Boleto</span>
        </div>
      </div>
    </div>
  )
}