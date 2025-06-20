import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://visa2any.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/blog/*',
          '/consultoria-ia',
          '/precos',
          '/sobre',
          '/contato',
          '/certidoes',
          '/traducao',
          '/apostilamento',
          '/antecedentes',
          '/assessoria-juridica',
          '/kit-emigracao',
          '/vaga-express'
        ],
        disallow: [
          '/admin/*',
          '/cliente/*',
          '/api/*',
          '/checkout/*',
          '/_next/*',
          '/static/*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog',
          '/blog/*'
        ],
        disallow: [
          '/admin/*',
          '/cliente/*',
          '/api/*'
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}