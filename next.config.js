/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,    // ✅ Habilita otimizações React
  swcMinify: true,         // ✅ Usa SWC para minificação rápida
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']     // Remove console.log em prod, mantém errors
    } : false,
  },
  experimental: {
    optimizeCss: true,       // ✅ Otimiza CSS
    scrollRestoration: true, // ✅ Melhora UX de navegação
  },
  images: {
    formats: ['image/avif', 'image/webp'], // ✅ Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Headers de performance e cache + MercadoPago
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy', 
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          }
        ]
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ Força correção de erros TypeScript
  },
  eslint: {
    ignoreDuringBuilds: false, // ✅ Força correção de lint
  },
}

module.exports = nextConfig