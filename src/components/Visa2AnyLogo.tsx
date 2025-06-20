'use client'

import { Plane, Globe, Zap, Star } from 'lucide-react'

interface Visa2AnyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dark' | 'light' | 'gradient'
  showText?: boolean
  animated?: boolean
  className?: string
}

export function Visa2AnyLogo({ 
  size = 'md', 
  variant = 'default', 
  showText = true, 
  animated = true,
  className = '' 
}: Visa2AnyLogoProps) {
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm',
      iconContainer: 'p-1'
    },
    md: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-lg',
      iconContainer: 'p-2'
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-2xl',
      iconContainer: 'p-3'
    },
    xl: {
      container: 'w-20 h-20',
      icon: 'w-10 h-10',
      text: 'text-3xl',
      iconContainer: 'p-4'
    }
  }

  const variantConfig = {
    default: {
      background: 'bg-gradient-to-r from-blue-600 to-purple-600',
      text: 'text-gray-900',
      subtext: 'text-gray-600'
    },
    dark: {
      background: 'bg-gradient-to-r from-gray-800 to-gray-900',
      text: 'text-white',
      subtext: 'text-gray-300'
    },
    light: {
      background: 'bg-gradient-to-r from-blue-100 to-purple-100',
      text: 'text-blue-900',
      subtext: 'text-blue-700'
    },
    gradient: {
      background: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      text: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
      subtext: 'text-gray-600'
    }
  }

  const config = sizeConfig[size]
  const colors = variantConfig[variant]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={`
          ${config.container} ${config.iconContainer} ${colors.background} 
          rounded-xl shadow-lg relative overflow-hidden
          ${animated ? 'hover:scale-110 transition-all duration-300' : ''}
        `}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 opacity-50"></div>
          
          {/* Main Plane Icon */}
          <Plane className={`${config.icon} text-white relative z-10`} />
          
          {/* Floating Elements */}
          {animated && (
            <>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </>
          )}
        </div>
        
        {/* Travel Trail Effect */}
        {animated && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-100"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-200"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <h1 className={`font-bold ${config.text} ${colors.text}`}>
              Visa2Any
            </h1>
            {size !== 'sm' && (
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            )}
          </div>
          {size !== 'sm' && (
            <p className={`text-xs ${colors.subtext} font-medium`}>
              Global Immigration Platform
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Logo Premium para Headers
export function Visa2AnyLogoPremium({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Premium Logo Container */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-0.5 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[length:8px_8px]"></div>
            
            {/* Main Icon */}
            <Plane className="w-10 h-10 text-white relative z-10 transform rotate-12" />
            
            {/* Floating Elements */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Orbit Elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
        </div>
      </div>

      {/* Premium Text */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Visa2Any
          </h1>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
          </div>
        </div>
        <p className="text-gray-600 font-medium text-sm tracking-wide">
          🌍 Your Gateway to the World
        </p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">AI-Powered</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Trusted by 12k+</span>
        </div>
      </div>
    </div>
  )
}

// Logo Compacto para Navigation
export function Visa2AnyLogoCompact({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300">
          <Plane className="w-6 h-6 text-white" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Visa2Any</h2>
        <p className="text-xs text-gray-500 -mt-1">Admin Panel</p>
      </div>
    </div>
  )
}

// Logo para Documentos/Relatórios
export function Visa2AnyLogoDocument({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2.5 shadow-sm">
        <Plane className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-900">Visa2Any</h3>
        <p className="text-sm text-gray-600">Global Immigration Solutions</p>
        <div className="flex items-center space-x-2 mt-0.5">
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Certified • Trusted • Worldwide</span>
        </div>
      </div>
    </div>
  )
}

export default Visa2AnyLogo