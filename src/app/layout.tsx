import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Poppins } from 'next/font/google'
import ConditionalLayout from '@/components/ConditionalLayout'

// Otimização de fontes com next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: {
    template: '%s | Visa2Any - Sua Jornada Internacional Simplificada',
    default: 'Visa2Any - Plataforma Líder em Assessoria de Vistos e Imigração',
  },
  description: 'A Visa2Any é a plataforma mais completa para assessoria de vistos, imigração e relocação. Simplifique sua jornada internacional com nossa tecnologia avançada e expertise especializada.',
  keywords: ['visto', 'imigração', 'relocação', 'assessoria de visto', 'documentação internacional', 'cidadania', 'passaporte'],
  authors: [{ name: 'Visa2Any' }],
  creator: 'Visa2Any',
  publisher: 'Visa2Any',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://visa2any.com')

  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Visa2Any - Plataforma Líder em Assessoria de Vistos',
    description: 'Simplifique sua jornada internacional com a plataforma mais completa de assessoria de vistos e imigração.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://visa2any.com'

    siteName: 'Visa2Any',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Visa2Any - Sua Jornada Internacional Simplificada',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visa2Any - Plataforma Líder em Assessoria de Vistos',
    description: 'Simplifique sua jornada internacional com nossa tecnologia avançada.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0284c7" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        
        {/* Analytics Scripts */}
        <Script id="gtag-base" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        
        {/* Schema.org Organization + Service */}
        <Script id="organization-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Visa2Any",
              "url": "https://visa2any.com",
              "logo": "https://visa2any.com/logo.png",
              "description": "Plataforma líder em assessoria de vistos e imigração no Brasil",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR",
                "addressLocality": "São Paulo"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-9999-9999",
                "contactType": "customer service",
                "availableLanguage": ["Portuguese", "English"]
              },
              "sameAs": [
                "https://facebook.com/visa2any",
                "https://instagram.com/visa2any",
                "https://linkedin.com/company/visa2any"
              ]
            }
          `}
        </Script>
        
        {/* Schema.org Service */}
        <Script id="service-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Assessoria de Visto e Imigração",
              "description": "Assessoria especializada para vistos americanos, canadenses, europeus e outros países. Análise de elegibilidade, preparação de documentos e acompanhamento completo.",
              "provider": {
                "@type": "Organization",
                "name": "Visa2Any"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Brazil"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Análise Gratuita",
                  "price": "0",
                  "priceCurrency": "BRL",
                  "description": "Análise de elegibilidade com IA em 15 minutos"
                },
                {
                  "@type": "Offer",
                  "name": "Relatório Premium",
                  "price": "97",
                  "priceCurrency": "BRL",
                  "description": "Relatório completo PDF de 15+ páginas com documentos e timeline"
                },
                {
                  "@type": "Offer",
                  "name": "Consultoria Express",
                  "price": "297",
                  "priceCurrency": "BRL",
                  "description": "60 minutos com especialista + suporte 30 dias"
                }
              ],
              "serviceType": "Assessoria de Imigração",
              "category": "Legal Services"
            }
          `}
        </Script>
        
        {/* Schema.org FAQPage */}
        <Script id="faq-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Quanto tempo demora para conseguir um visto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O tempo varia por país: EUA (3-6 meses), Canadá (2-4 meses), Europa (1-3 meses). Nossa assessoria acelera o processo com preparação adequada."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual é a taxa de aprovação com a Visa2Any?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nossa taxa de aprovação é superior a 85% para clientes que seguem integralmente nossas orientações e preparação."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Vocês garantem a aprovação do visto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Não garantimos aprovação, pois a decisão final é das autoridades governamentais. Garantimos apenas a qualidade da nossa assessoria e suporte."
                  }
                }
              ]
            }
          `}
        </Script>
      </body>
    </html>
  )
}