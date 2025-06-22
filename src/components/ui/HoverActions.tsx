'use client'

import { useState, ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'

interface Action {
  icon: React.ComponentType<{ className?: string | undefined }>
  label: string
  onClick: () => void
  variant?: 'default' | 'danger' | 'primary'
  disabled?: boolean
}

interface HoverActionsProps {
  actions: Action[]
  children: ReactNode
  className?: string
  position?: 'right' | 'left'
}

export function HoverActions({ 
  actions, 
  children, 
  className = '',
  position = 'right'
}: HoverActionsProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div 
      className={`group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Quick Actions (shown on hover) */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${position === 'right' ? 'right-2' : 'left-2'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto`}>
        {actions.slice(0, 3).map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
              }}
              disabled={action.disabled}
              className={`p-1.5 rounded-md transition-colors ${
                action.variant === 'danger' 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                  : action.variant === 'primary'
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
              } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={action.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
        
        {/* More actions menu */}
        {actions.length > 3 && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              title="Mais ações"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className={`absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-40 ${position === 'right' ? 'right-0' : 'left-0'}`}>
                  <div className="py-1">
                    {actions.slice(3).map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={index + 3}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick()
                            setIsMenuOpen(false)
                          }}
                          disabled={action.disabled}
                          className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                            action.variant === 'danger' 
                              ? 'text-red-600 hover:bg-red-50' 
                              : action.variant === 'primary'
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-gray-700 hover:bg-gray-50'
                          } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Icon className="h-4 w-4" />
                          {action.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Row actions for table rows
interface RowActionsProps {
  actions: Action[]
  children: ReactNode
  className?: string
}

export function RowActions({ actions, children, className = '' }: RowActionsProps) {
  return (
    <HoverActions 
      actions={actions} 
      className={`hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
    </HoverActions>
  )
}