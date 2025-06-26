import { ReactNode } from 'react'

export const metadata = {
  title: 'Portal do Cliente - Visa2Any',
  description: 'Acompanhe o progresso da sua jornada internacional no portal exclusivo Visa2Any.'
}

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}