'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs if not provided

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Início', href: '/' }
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`

      // Custom labels for common paths

      const labels: Record<string, string> = {
        'precos': 'Preços',
        'consultoria-ia': 'Consultoria IA',
        'checkout': 'Finalizar Compra',
        'success': 'Compra Realizada',
        'assessment': 'Avaliação',
        'lead-magnets': 'Materiais Exclusivos',
        'cliente': 'Portal do Cliente',
        'admin': 'Admin',
        'consultorias': 'Consultorias',
        'documentos': 'Documentos',
        'pagamentos': 'Pagamentos',
        'clients': 'Clientes',
        'reports': 'Relatórios',
        'settings': 'Configurações',
        'revenue': 'Revenue'
      }

      const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1)
      breadcrumbs.push({ label, href: currentPath })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  if (breadcrumbItems.length <= 1) return null

  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}

          {index === 0 ? (
            <Link
              href={item.href}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="sr-only">{item.label}</span>
            </Link>
          ) : index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-gray-900" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}