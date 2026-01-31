'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface CustomerData {
    id: string
    name: string
    email: string
    phone?: string
    destinationCountry: string
    visaType: string
    status: string
    eligibilityScore: number
    progress: number
    currentStage?: string
    consultant?: {
        name: string
        email: string
        phone: string
        avatar?: string
    }
    nextMilestone?: {
        title: string
        dueDate: string
        description: string
    }
    documents: any[]
    timeline: any[]
    payments: any[]
    notifications: any[]
    consultations?: any[]
    scoreBreakdown?: {
        age: number
        education: number
        experience: number
        language: number
        funds: number
    }
    automationInsights?: {
        emailsSent: number
        actionsCompleted: number
        nextAction: string
        engagementScore: number
    }
    vagaExpressSubscription?: any
    profilePhoto?: string
}

interface CustomerAuthContextType {
    customer: CustomerData | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
    logout: () => Promise<void>
    refreshProfile: () => Promise<void>
    updateLocalProfile: (updates: Partial<CustomerData>) => void
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<CustomerData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const fetchProfile = useCallback(async (): Promise<CustomerData | null> => {
        try {
            const response = await fetch('/api/customers/profile', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                if (response.status === 401) {
                    // Not authenticated
                    return null
                }
                throw new Error('Failed to fetch profile')
            }

            const data = await response.json()
            return data.customer
        } catch (err) {
            console.error('Error fetching customer profile:', err)
            return null
        }
    }, [])

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true)
            try {
                const customerData = await fetchProfile()
                setCustomer(customerData)
            } catch (err) {
                console.error('Auth check error:', err)
                setCustomer(null)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [fetchProfile])

    const login = async (email: string, password: string): Promise<boolean> => {
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch('/api/customers/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Login failed')
                return false
            }

            // Store customer data
            setCustomer(data.customer)

            // Also store in localStorage for quick access (non-sensitive data only)
            if (typeof window !== 'undefined') {
                localStorage.setItem('customer', JSON.stringify(data.customer))
            }

            return true
        } catch (err) {
            console.error('Login error:', err)
            setError('Erro de conexão. Tente novamente.')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch('/api/customers/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Registration failed')
                return false
            }

            // Store customer data
            setCustomer(data.customer)

            if (typeof window !== 'undefined') {
                localStorage.setItem('customer', JSON.stringify(data.customer))
            }

            return true
        } catch (err) {
            console.error('Registration error:', err)
            setError('Erro de conexão. Tente novamente.')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await fetch('/api/customers/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            setCustomer(null)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('customer')
                localStorage.removeItem('customer-profile')
                localStorage.removeItem('customer-documents')
            }
            router.push('/cliente/login')
        }
    }

    const refreshProfile = async (): Promise<void> => {
        const customerData = await fetchProfile()
        if (customerData) {
            setCustomer(customerData)
            if (typeof window !== 'undefined') {
                localStorage.setItem('customer', JSON.stringify(customerData))
            }
        }
    }

    const updateLocalProfile = (updates: Partial<CustomerData>): void => {
        setCustomer(prev => prev ? { ...prev, ...updates } : null)
    }

    return (
        <CustomerAuthContext.Provider
      value= {{
        customer,
            isLoading,
            isAuthenticated: !!customer,
                error,
                login,
                register,
                logout,
                refreshProfile,
                updateLocalProfile,
      }
}
    >
    { children }
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext)
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider')
    }
    return context
}

// Higher-order component for protected routes
export function withCustomerAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    return function ProtectedRoute(props: P) {
        const { isAuthenticated, isLoading } = useCustomerAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/cliente/login')
            }
        }, [isLoading, isAuthenticated, router])

        if (isLoading) {
            return (
                <div className= "min-h-screen bg-gray-50 flex items-center justify-center" >
                <div className="text-center" >
                    <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto" > </div>
                        < p className = "text-gray-600 mt-3 text-sm" > Verificando autenticação...</p>
                            </div>
                            </div>
      )
        }

        if (!isAuthenticated) {
            return null
        }

        return <WrappedComponent { ...props } />
  }
}
