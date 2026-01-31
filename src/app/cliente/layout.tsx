'use client'

import { ReactNode } from 'react'
import { CustomerAuthProvider } from '@/hooks/useCustomerAuth'

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <CustomerAuthProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </CustomerAuthProvider>
  )
}