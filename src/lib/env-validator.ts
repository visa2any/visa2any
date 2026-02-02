/**
 * Environment Variable Validator
 * Validates critical environment variables at startup
 */

interface EnvValidationResult {
    valid: boolean
    missing: string[]
    warnings: string[]
}

const REQUIRED_VARS = [
    'NEXTAUTH_SECRET',
    'DATABASE_URL'
] as const

const RECOMMENDED_VARS = [
    'MERCADOPAGO_ACCESS_TOKEN',
    'SENDGRID_API_KEY',
    'TELEGRAM_BOT_TOKEN',
    'OPENAI_API_KEY'
] as const

/**
 * Validate critical environment variables
 * @throws Error in production if critical vars are missing
 */
export function validateCriticalEnvVars(): EnvValidationResult {
    const missing: string[] = []
    const warnings: string[] = []

    // Check required variables
    for (const varName of REQUIRED_VARS) {
        if (!process.env[varName]) {
            missing.push(varName)
        }
    }

    // Check recommended variables (warning only)
    for (const varName of RECOMMENDED_VARS) {
        if (!process.env[varName]) {
            warnings.push(varName)
        }
    }

    const valid = missing.length === 0

    // Log results
    if (!valid) {
        console.error('❌ Missing CRITICAL environment variables:', missing)
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing critical environment variables: ${missing.join(', ')}`)
        }
    }

    if (warnings.length > 0) {
        console.warn('⚠️ Missing recommended environment variables:', warnings)
    }

    if (valid && warnings.length === 0) {
        console.log('✅ All environment variables configured correctly')
    }

    return { valid, missing, warnings }
}

/**
 * Get required environment variable or throw
 * @param name Environment variable name
 * @throws Error if variable is not set
 */
export function requireEnv(name: string): string {
    const value = process.env[name]
    if (!value) {
        const errorMsg = `Required environment variable ${name} is not configured`
        console.error(`❌ ${errorMsg}`)
        throw new Error(errorMsg)
    }
    return value
}

/**
 * Get optional environment variable with default
 * @param name Environment variable name
 * @param defaultValue Default value if not set
 */
export function optionalEnv(name: string, defaultValue: string = ''): string {
    return process.env[name] || defaultValue
}

export default {
    validateCriticalEnvVars,
    requireEnv,
    optionalEnv
}
