'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
  disabled?: boolean
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 500,
  className = '',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let x = 0, y = 0

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Ajustar para manter dentro da viewport,    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8))
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8))

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (disabled) return
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
    }
  }, [isVisible, placement])

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        updatePosition()
      }
    }

    const handleResize = () => {
      if (isVisible) {
        updatePosition()
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  const tooltipElement = isVisible && typeof window !== 'undefined' ? (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200 max-w-xs ${className}`}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {content}
      {/* Arrow */}
      <div
        className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
          placement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
          placement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
          placement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
          'left-[-4px] top-1/2 -translate-y-1/2'
        }`}
      />
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  )
}

// Helper para tooltip de ajuda
export function HelpTooltip({ content, className = '' }: { content: string | React.ReactNode, className?: string }) {
  return (
    <Tooltip content={content} placement="top" className={className}>
      <div className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-600 rounded-full text-xs cursor-help hover:bg-gray-200 transition-colors">
        ?
      </div>
    </Tooltip>
  )
}