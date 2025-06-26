// Input formatters and validators for forms

export const formatters = {
  // Phone number formatting
  phone: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 11) {
      // Brazilian phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
      if (numbers.length <= 2) return numbers
      if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
      if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
      }
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else if (numbers.startsWith('55')) {
      // International format with +55
      if (numbers.length <= 4) return `+${numbers}`
      if (numbers.length <= 6) return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`
      if (numbers.length <= 11) return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`
      if (numbers.length <= 13) {
        return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`
      }
      return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`
    }
    
    return value // Return original if doesn't match patterns
  },

  // CPF formatting
  cpf: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
  },

  // CNPJ formatting
  cnpj: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 14)
    
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    }
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
  },

  // CEP formatting
  cep: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8)
    
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
  },

  // Currency formatting (Brazilian Real)
  currency: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseInt(numbers) / 100
    
    if (isNaN(amount)) return ''
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  },

  // Numeric only
  numeric: (value: string): string => {
    return value.replace(/\D/g, '')
  },

  // Alpha only
  alpha: (value: string): string => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
  },

  // Alphanumeric only
  alphanumeric: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '')
  },

  // Capitalize first letter of each word
  titleCase: (value: string): string => {
    return value.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  // Passport number (alphanumeric
 uppercase)
  passport: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9)
  },

  // Email (basic cleanup)
  email: (value: string): string => {
    return value.toLowerCase().trim()
  }
}

export const validators = {
  // Email validation
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Email inválido'
    }
    return null
  },

  // Phone validation
  phone: (value: string): string | null => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length < 10 || numbers.length > 13) {
      return 'Telefone deve ter entre 10 e 13 dígitos'
    }
    return null
  },

  // CPF validation
  cpf: (value: string): string | null => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length !== 11) {
      return 'CPF deve ter 11 dígitos'
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(numbers)) {
      return 'CPF inválido'
    }

    // Validate CPF algorithm
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let digit1 = (sum * 10) % 11
    if (digit1 === 10) digit1 = 0

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    let digit2 = (sum * 10) % 11
    if (digit2 === 10) digit2 = 0

    if (parseInt(numbers[9]) !== digit1 || parseInt(numbers[10]) !== digit2) {
      return 'CPF inválido'
    }

    return null
  },

  // CNPJ validation
  cnpj: (value: string): string | null => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length !== 14) {
      return 'CNPJ deve ter 14 dígitos'
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(numbers)) {
      return 'CNPJ inválido'
    }

    // Validate CNPJ algorithm
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i]) * weights1[i]
    }
    let digit1 = sum % 11
    digit1 = digit1 < 2 ? 0 : 11 - digit1

    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i]) * weights2[i]
    }
    let digit2 = sum % 11
    digit2 = digit2 < 2 ? 0 : 11 - digit2

    if (parseInt(numbers[12]) !== digit1 || parseInt(numbers[13]) !== digit2) {
      return 'CNPJ inválido'
    }

    return null
  },

  // CEP validation
  cep: (value: string): string | null => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 8) {
      return 'CEP deve ter 8 dígitos'
    }
    return null
  },

  // Required field validation
  required: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Campo obrigatório'
    }
    return null
  },

  // Minimum length validation
  minLength: (min: number) => (value: string): string | null => {
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`
    }
    return null
  },

  // Maximum length validation
  maxLength: (max: number) => (value: string): string | null => {
    if (value.length > max) {
      return `Máximo de ${max} caracteres`
    }
    return null
  },

  // Age validation
  age: (value: string): string | null => {
    const age = parseInt(value)
    if (isNaN(age) || age < 16 || age > 120) {
      return 'Idade deve estar entre 16 e 120 anos'
    }
    return null
  },

  // URL validation
  url: (value: string): string | null => {
    try {
      new URL(value)
      return null
    } catch {
      return 'URL inválida'
    }
  },

  // Passport validation
  passport: (value: string): string | null => {
    const clean = value.replace(/[^a-zA-Z0-9]/g, '')
    if (clean.length < 6 || clean.length > 9) {
      return 'Passaporte deve ter entre 6 e 9 caracteres'
    }
    return null
  }
}

// Combine validators
export const combineValidators = (...validators: Array<(value: string) => string | null>) => {
  return (value: string): string | null => {
    for (const validator of validators) {
      const error = validator(value)
      if (error) return error
    }
    return null
  }
}