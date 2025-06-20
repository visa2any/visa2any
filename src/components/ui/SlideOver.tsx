'use client'

import { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function SlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  className = ''
}: SlideOverProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-16">
        <div className={`w-screen ${sizeClasses[size]}`}>
          <div className={`flex h-full flex-col bg-white shadow-xl ${className}`}>
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-3 h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick slide-over for simple views
interface QuickSlideOverProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  width?: string
}

export function QuickSlideOver({
  isOpen,
  onClose,
  children,
  width = 'w-96'
}: QuickSlideOverProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex">
        <div className={`${width} bg-white shadow-xl border-l border-gray-200 overflow-y-auto`}>
          {children}
        </div>
      </div>
    </div>
  )
}