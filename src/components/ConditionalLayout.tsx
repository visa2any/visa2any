'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import ClientHeader from './ClientHeader'
import Footer from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Don't show any header/footer for admin routes
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>
  }
  
  // Show ClientHeader for client routes (except login which handles its own header)
  if (pathname?.startsWith('/cliente') && !pathname?.includes('/login')) {
    return (
      <>
        {children}
        <Footer />
      </>
    )
  }
  
  // Show main Header for all other routes
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}