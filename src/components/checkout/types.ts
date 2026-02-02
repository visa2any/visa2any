/**
 * Unified Checkout Types
 * Consolidated type definitions for all checkout variants
 */

// Product configuration
export interface ProductConfig {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    childPrice?: number
    childDiscount?: number
    features: string[]
    variant: CheckoutVariant
    category: string
    popular?: boolean
    disabled?: boolean
    badge?: string
    badgeColor?: string
}

// Checkout variants
export type CheckoutVariant = 'free' | 'basic' | 'premium' | 'vip' | 'consultation' | 'default'

// Customer data collected during checkout
export interface CustomerData {
    name: string
    email: string
    phone: string
    phoneCountry: string
    cpf: string
    targetCountry: string
    terms: boolean
    newsletter: boolean
    contractAccepted: boolean
}

// Checkout feature flags
export interface CheckoutFeatures {
    showUpsells: boolean
    showQuantity: boolean
    showGroupDiscount: boolean
    showContract: boolean
    enableInstallments: boolean
    enablePix: boolean
    enableCard: boolean
    showTrustSignals: boolean
    showSocialProof: boolean
    enableExitIntent: boolean
}

// Checkout styling options
export interface CheckoutStyling {
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    showGradients: boolean
    showAnimations: boolean
}

// Main checkout configuration
export interface CheckoutConfig {
    variant: 'simple' | 'standard' | 'premium' | 'wizard'
    product: ProductConfig
    products?: ProductConfig[] // For multi-product checkout
    customer?: Partial<CustomerData>
    features: CheckoutFeatures
    styling: CheckoutStyling
    successUrl?: string
    cancelUrl?: string
    consultationId?: string
    clientId?: string
}

// Checkout state
export interface CheckoutState {
    step: number
    adults: number
    children: number
    selectedProduct: ProductConfig | null
    customerData: CustomerData
    isProcessing: boolean
    isComplete: boolean
    error: string | null
    paymentMethod: 'pix' | 'card' | null
}

// Checkout actions
export type CheckoutAction =
    | { type: 'SET_STEP'; payload: number }
    | { type: 'SET_ADULTS'; payload: number }
    | { type: 'SET_CHILDREN'; payload: number }
    | { type: 'SELECT_PRODUCT'; payload: ProductConfig }
    | { type: 'UPDATE_CUSTOMER'; payload: Partial<CustomerData> }
    | { type: 'SET_PROCESSING'; payload: boolean }
    | { type: 'SET_COMPLETE'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_PAYMENT_METHOD'; payload: 'pix' | 'card' | null }
    | { type: 'RESET' }

// Pricing calculation result
export interface PricingResult {
    subtotal: number
    discount: number
    groupDiscount: number
    childDiscount: number
    total: number
    savings: number
    installmentValue: number
    installmentCount: number
}

// Payment result
export interface PaymentResult {
    success: boolean
    paymentId?: string
    transactionId?: string
    status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    pixCode?: string
    pixQrCode?: string
    errorMessage?: string
}

// Default configurations
export const DEFAULT_FEATURES: CheckoutFeatures = {
    showUpsells: true,
    showQuantity: true,
    showGroupDiscount: true,
    showContract: true,
    enableInstallments: true,
    enablePix: true,
    enableCard: true,
    showTrustSignals: true,
    showSocialProof: true,
    enableExitIntent: true,
}

export const DEFAULT_STYLING: CheckoutStyling = {
    theme: 'dark',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    borderRadius: 'lg',
    showGradients: true,
    showAnimations: true,
}

export const INITIAL_CUSTOMER_DATA: CustomerData = {
    name: '',
    email: '',
    phone: '',
    phoneCountry: '+55',
    cpf: '',
    targetCountry: '',
    terms: false,
    newsletter: false,
    contractAccepted: false,
}

export const INITIAL_CHECKOUT_STATE: CheckoutState = {
    step: 1,
    adults: 1,
    children: 0,
    selectedProduct: null,
    customerData: INITIAL_CUSTOMER_DATA,
    isProcessing: false,
    isComplete: false,
    error: null,
    paymentMethod: null,
}
