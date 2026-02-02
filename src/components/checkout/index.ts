/**
 * Checkout Module - Consolidated Exports
 * 
 * This module provides a unified checkout experience by consolidating
 * the 10 previous checkout variants into a single, configurable system.
 * 
 * Usage:
 * ```tsx
 * import { useCheckoutState, useCheckoutPricing, CheckoutConfig } from '@/components/checkout'
 * ```
 */

// Types
export * from './types'

// Hooks
export {
    useCheckoutState,
    useCheckoutPricing,
    useCheckoutValidation,
    useCheckoutPersistence,
} from './hooks'

// Re-export existing components for backward compatibility
// These will be deprecated in future versions
export { default as CheckoutModerno } from '../CheckoutModerno'
export { default as SimpleCheckout } from '../SimpleCheckout'
