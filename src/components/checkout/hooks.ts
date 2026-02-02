'use client'

import { useReducer, useCallback, useMemo } from 'react'
import {
    CheckoutState,
    CheckoutAction,
    CustomerData,
    ProductConfig,
    PricingResult,
    INITIAL_CHECKOUT_STATE,
} from './types'

/**
 * Checkout State Reducer
 */
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload }
        case 'SET_ADULTS':
            return { ...state, adults: Math.max(1, action.payload) }
        case 'SET_CHILDREN':
            return { ...state, children: Math.max(0, action.payload) }
        case 'SELECT_PRODUCT':
            return { ...state, selectedProduct: action.payload }
        case 'UPDATE_CUSTOMER':
            return { ...state, customerData: { ...state.customerData, ...action.payload } }
        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload }
        case 'SET_COMPLETE':
            return { ...state, isComplete: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        case 'SET_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload }
        case 'RESET':
            return INITIAL_CHECKOUT_STATE
        default:
            return state
    }
}

/**
 * Main Checkout State Hook
 */
export function useCheckoutState(initialState?: Partial<CheckoutState>) {
    const [state, dispatch] = useReducer(
        checkoutReducer,
        { ...INITIAL_CHECKOUT_STATE, ...initialState }
    )

    const setStep = useCallback((step: number) => {
        dispatch({ type: 'SET_STEP', payload: step })
    }, [])

    const setAdults = useCallback((adults: number) => {
        dispatch({ type: 'SET_ADULTS', payload: adults })
    }, [])

    const setChildren = useCallback((children: number) => {
        dispatch({ type: 'SET_CHILDREN', payload: children })
    }, [])

    const selectProduct = useCallback((product: ProductConfig) => {
        dispatch({ type: 'SELECT_PRODUCT', payload: product })
    }, [])

    const updateCustomer = useCallback((data: Partial<CustomerData>) => {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: data })
    }, [])

    const setProcessing = useCallback((processing: boolean) => {
        dispatch({ type: 'SET_PROCESSING', payload: processing })
    }, [])

    const setComplete = useCallback((complete: boolean) => {
        dispatch({ type: 'SET_COMPLETE', payload: complete })
    }, [])

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error })
    }, [])

    const setPaymentMethod = useCallback((method: 'pix' | 'card' | null) => {
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
    }, [])

    return {
        state,
        actions: {
            setStep,
            setAdults,
            setChildren,
            selectProduct,
            updateCustomer,
            setProcessing,
            setComplete,
            setError,
            setPaymentMethod,
            reset,
        },
    }
}

/**
 * Checkout Pricing Hook
 */
export function useCheckoutPricing(
    product: ProductConfig | null,
    adults: number,
    children: number
): PricingResult {
    return useMemo(() => {
        if (!product) {
            return {
                subtotal: 0,
                discount: 0,
                groupDiscount: 0,
                childDiscount: 0,
                total: 0,
                savings: 0,
                installmentValue: 0,
                installmentCount: 12,
            }
        }

        const basePrice = product.price
        const originalPrice = product.originalPrice || product.price
        const childPrice = product.childPrice || basePrice * 0.5

        // Calculate subtotal
        const adultTotal = basePrice * adults
        const childTotal = childPrice * children
        const subtotal = adultTotal + childTotal

        // Calculate discounts
        const discount = (originalPrice - basePrice) * adults
        const groupDiscount = adults > 1 ? subtotal * 0.1 : 0 // 10% for groups
        const childDiscount = product.childDiscount ? (basePrice - childPrice) * children : 0

        const total = subtotal - groupDiscount
        const savings = discount + groupDiscount + childDiscount

        // Calculate installments
        const installmentCount = 12
        const installmentValue = total / installmentCount

        return {
            subtotal,
            discount,
            groupDiscount,
            childDiscount,
            total,
            savings,
            installmentValue,
            installmentCount,
        }
    }, [product, adults, children])
}

/**
 * Checkout Validation Hook
 */
export function useCheckoutValidation(customerData: CustomerData) {
    const validateCPF = useCallback((cpf: string): boolean => {
        const cleaned = cpf.replace(/\D/g, '')
        if (cleaned.length !== 11) return false
        if (/^(\d)\1+$/.test(cleaned)) return false

        let sum = 0
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleaned.charAt(i)) * (10 - i)
        }
        let remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.charAt(9))) return false

        sum = 0
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleaned.charAt(i)) * (11 - i)
        }
        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.charAt(10))) return false

        return true
    }, [])

    const validateEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }, [])

    const validatePhone = useCallback((phone: string): boolean => {
        const cleaned = phone.replace(/\D/g, '')
        return cleaned.length >= 10 && cleaned.length <= 11
    }, [])

    const errors = useMemo(() => {
        const result: Partial<Record<keyof CustomerData, string>> = {}

        if (!customerData.name || customerData.name.length < 3) {
            result.name = 'Nome deve ter pelo menos 3 caracteres'
        }

        if (!customerData.email || !validateEmail(customerData.email)) {
            result.email = 'Email inválido'
        }

        if (!customerData.phone || !validatePhone(customerData.phone)) {
            result.phone = 'Telefone inválido'
        }

        if (!customerData.cpf || !validateCPF(customerData.cpf)) {
            result.cpf = 'CPF inválido'
        }

        if (!customerData.targetCountry) {
            result.targetCountry = 'Selecione um país'
        }

        if (!customerData.terms) {
            result.terms = 'Você deve aceitar os termos'
        }

        return result
    }, [customerData, validateCPF, validateEmail, validatePhone])

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

    return { errors, isValid, validateCPF, validateEmail, validatePhone }
}

/**
 * Checkout Form Persistence Hook
 */
export function useCheckoutPersistence(key: string = 'checkout_data') {
    const save = useCallback((data: Partial<CustomerData>, adults: number, children: number) => {
        if (typeof window === 'undefined') return

        const saveData = {
            customerData: {
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                phoneCountry: data.phoneCountry || '+55',
                targetCountry: data.targetCountry || '',
                newsletter: data.newsletter || false,
            },
            adults,
            children,
            savedAt: Date.now(),
        }

        try {
            localStorage.setItem(key, JSON.stringify(saveData))
        } catch (e) {
            console.warn('Failed to save checkout data:', e)
        }
    }, [key])

    const load = useCallback(() => {
        if (typeof window === 'undefined') return null

        try {
            const saved = localStorage.getItem(key)
            if (!saved) return null

            const data = JSON.parse(saved)
            const oneDay = 24 * 60 * 60 * 1000

            // Expire after 24 hours
            if (Date.now() - data.savedAt > oneDay) {
                localStorage.removeItem(key)
                return null
            }

            return data
        } catch (e) {
            console.warn('Failed to load checkout data:', e)
            return null
        }
    }, [key])

    const clear = useCallback(() => {
        if (typeof window === 'undefined') return

        try {
            localStorage.removeItem(key)
        } catch (e) {
            console.warn('Failed to clear checkout data:', e)
        }
    }, [key])

    return { save, load, clear }
}
