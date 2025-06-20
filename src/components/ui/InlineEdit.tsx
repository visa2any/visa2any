'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X, Edit2 } from 'lucide-react'

interface InlineEditProps {
  value: string
  onSave: (value: string) => Promise<void>
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea'
  placeholder?: string
  className?: string
  displayClassName?: string
  editClassName?: string
  validation?: (value: string) => string | null
  multiline?: boolean
  disabled?: boolean
}

export function InlineEdit({
  value,
  onSave,
  type = 'text',
  placeholder,
  className = '',
  displayClassName = '',
  editClassName = '',
  validation,
  multiline = false,
  disabled = false
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (disabled) return
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value)
    setError(null)
  }

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    if (validation) {
      const validationError = validation(editValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isEditing) {
    return (
      <div 
        className={`group inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors ${className} ${displayClassName} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleStartEdit}
      >
        <span className={`${!value ? 'text-gray-400 italic' : ''}`}>
          {value || placeholder || 'Clique para editar'}
        </span>
        {!disabled && (
          <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${editClassName}`}
            placeholder={placeholder}
            rows={2}
            disabled={isLoading}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editClassName}`}
            placeholder={placeholder}
            disabled={isLoading}
          />
        )}
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 whitespace-nowrap z-10">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
          title={multiline ? "Salvar (Ctrl+Enter)" : "Salvar (Enter)"}
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
          title="Cancelar (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Select inline component
interface InlineSelectProps {
  value: string
  options: { value: string; label: string }[]
  onSave: (value: string) => Promise<void>
  placeholder?: string
  className?: string
  displayClassName?: string
  disabled?: boolean
}

export function InlineSelect({
  value,
  options,
  onSave,
  placeholder,
  className = '',
  displayClassName = '',
  disabled = false
}: InlineSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentOption = options.find(opt => opt.value === value)

  const handleSelect = async (newValue: string) => {
    if (newValue === value || disabled) return

    setIsLoading(true)
    try {
      await onSave(newValue)
      setIsOpen(false)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (disabled) {
    return (
      <span className={`px-2 py-1 rounded ${displayClassName} opacity-50`}>
        {currentOption?.label || placeholder || 'N/A'}
      </span>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`group inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors ${displayClassName}`}
      >
        <span className={`${!value ? 'text-gray-400 italic' : ''}`}>
          {currentOption?.label || placeholder || 'Selecionar'}
        </span>
        <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-full">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                    option.value === value ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}