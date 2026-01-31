import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  author?: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    type?: string
    image?: string
    url?: string
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: string
  }
  structuredData?: object
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://visa2any.com'

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords ? config.keywords.join(', ') : null,
    authors: config.author ? [{ name: config.author }] : [{ name: 'Visa2Any' }],
    creator: 'Visa2Any',
    publisher: 'Visa2Any',
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.canonical || '/'
    },
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      url: config.openGraph?.url || baseUrl,
      siteName: 'Visa2Any',
      images: [
        {
          url: config.openGraph?.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: config.openGraph?.title || config.title
        }
      ],
      locale: 'pt_BR',
      type: (config.openGraph?.type as any) || 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: config.twitter?.title || config.title,
      description: config.twitter?.description || config.description,
      images: [config.twitter?.image || '/twitter-image.jpg']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION ? {
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION
      }
    } : {})
  }
}

// Structured Data Schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Visa2Any',
  url: 'https://visa2any.com',
  logo: 'https://visa2any.com/logo.png',
  description: 'Plataforma líder em assessoria de vistos, imigração e relocação internacional',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-5197-1375',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'English']
  },
  sameAs: [
    'https://facebook.com/visa2any',
    'https://instagram.com/visa2any',
    'https://linkedin.com/company/visa2any',
    'https://twitter.com/visa2any'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2847',
    bestRating: '5',
    worstRating: '1'
  }
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Assessoria de Vistos e Imigração',
  provider: {
    '@type': 'Organization',
    name: 'Visa2Any'
  },
  description: 'Serviços especializados em assessoria de vistos, imigração e relocação internacional',
  serviceType: 'Consultoria de Imigração',
  areaServed: {
    '@type': 'Country',
    name: 'Brasil'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Visto',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visto de Turismo',
          description: 'Assessoria completa para vistos de turismo'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visto de Trabalho',
          description: 'Orientação especializada para vistos de trabalho'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visto de Estudo',
          description: 'Suporte completo para vistos de estudo'
        }
      }
    ]
  }
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual a taxa de aprovação da Visa2Any?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossa taxa de aprovação é de 98%, uma das mais altas do mercado brasileiro.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo leva o processo de visto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O tempo varia por país e tipo de visto, mas nosso processo otimizado reduz significativamente os prazos tradicionais.'
      }
    },
    {
      '@type': 'Question',
      name: 'Qual o valor da consulta inicial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossa pré-análise com IA custa R$ 29,90 para analisar seu perfil detalhadamente.'
      }
    }
  ]
}

export const breadcrumbSchema = (items: Array<{ name: string, url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

// SEO Performance Tracking
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    })
  }
}

export const trackConversion = (eventName: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      value: value,
      currency: 'BRL'
    })
  }
}
