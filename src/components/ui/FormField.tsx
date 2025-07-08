'use client'

import { useState, forwardRef } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Tooltip, HelpTooltip } from './Tooltip'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | undefined
  helpText?: string
  tooltip?: string | React.ReactNode
  success?: boolean
  loading?: boolean
  formatValue?: (value: string) => string
  validation?: (value: string) => string | null
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  error,
  helpText,
  tooltip,
  success = false,
  loading = false,
  formatValue,
  validation,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  onChange,
  onBlur,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Apply formatting if provided

    if (formatValue) {
      value = formatValue(value)
      e.target.value = value
    }

    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null)
    }

    onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)

    // Validate on blur if validation function provided

    if (validation && e.target.value) {
      const validationError = validation(e.target.value)
      setLocalError(validationError)
    }

    onBlur?.(e)
  }

  const inputType = showPasswordToggle && showPassword ? 'text' : type

  const hasError = error || localError
  const hasSuccess = success && !hasError && props.value

  return (
    <div className="space-y-1">
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <label className="block text-xs font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && <HelpTooltip content={tooltip} />}
      </div>

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showPasswordToggle || hasError || hasSuccess ? 'pr-10' : ''}
            ${hasError ? 
              'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' :
              hasSuccess ?
              'border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500' :
              isFocused ?
              'border-blue-500 ring-2 ring-blue-200' :
              'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            ${loading ? 'bg-gray-50' : 'bg-white'}
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          disabled={loading}
          {...props}
        />

        {/* Right icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          )}
          
          {hasError && !loading && (
            <Tooltip content={hasError} placement="top">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </Tooltip>
          )}
          
          {hasSuccess && !loading && !hasError && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {rightIcon && !loading && !hasError && !hasSuccess && !showPasswordToggle && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Help text and error message */}
      {(helpText || hasError) && (
        <div className="space-y-1">
          {hasError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {hasError}
            </p>
          )}
          {helpText && !hasError && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
        </div>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'

// Textarea version
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helpText?: string
  tooltip?: string | React.ReactNode
  success?: boolean
  loading?: boolean
  showCharCount?: boolean
  maxLength?: number
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  error,
  helpText,
  tooltip,
  success = false,
  loading = false,
  showCharCount = false,
  maxLength,
  className = '',
  onChange,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(props.defaultValue?.toString().length || 0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  const hasError = !!error
  const hasSuccess = success && !hasError && props.value

  return (
    <div className="space-y-1">
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <label className="block text-xs font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && <HelpTooltip content={tooltip} />}
      </div>

      {/* Textarea container */}
      <div className="relative">
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 resize-none
            ${hasError ? 
              'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' :
              hasSuccess ?
              'border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500' :
              isFocused ?
              'border-blue-500 ring-2 ring-blue-200' :
              'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            ${loading ? 'bg-gray-50' : 'bg-white'}
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          disabled={loading}
          maxLength={maxLength}
          {...props}
        />

        {/* Character count */}
        {showCharCount && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {charCount}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>

      {/* Help text and error message */}
      {(helpText || hasError) && (
        <div className="space-y-1">
          {hasError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {hasError}
            </p>
          )}
          {helpText && !hasError && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
        </div>
      )}
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

// Select version
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  helpText?: string | undefined
  tooltip?: string | React.ReactNode
  success?: boolean
  loading?: boolean
  options: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  helpText,
  tooltip,
  success = false,
  loading = false,
  options,
  placeholder,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasError = !!error
  const hasSuccess = success && !hasError && props.value

  return (
    <div className="space-y-1">
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <label className="block text-xs font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && <HelpTooltip content={tooltip} />}
      </div>

      {/* Select container */}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 appearance-none bg-white
            ${hasError ? 
              'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' :
              hasSuccess ?
              'border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500' :
              isFocused ?
              'border-blue-500 ring-2 ring-blue-200' :
              'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            ${loading ? 'bg-gray-50' : ''}
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={loading}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Help text and error message */}
      {(helpText || hasError) && (
        <div className="space-y-1">
          {hasError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {hasError}
            </p>
          )}
          {helpText && !hasError && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
        </div>
      )}
    </div>
  )
})

FormSelect.displayName = 'FormSelect'
