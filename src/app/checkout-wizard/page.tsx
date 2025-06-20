'use client'

import { Suspense } from 'react'
import CheckoutWizard from '@/components/CheckoutWizard'
import { Loader2, Sparkles } from 'lucide-react'

export default function CheckoutWizardPage() {
  return (
    <>
      <title>Checkout - Visa2Any</title>
      <meta name="description" content="Checkout rápido e seguro - Complete sua compra em 3 etapas simples" />
      <meta name="robots" content="noindex, nofollow" />
      
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">Carregando checkout...</p>
            <div className="mt-4 text-sm text-gray-500">
              3 etapas rápidas ⚡
            </div>
          </div>
        </div>
      }>
        <CheckoutWizard />
      </Suspense>
    </>
  )
}