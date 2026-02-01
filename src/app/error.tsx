'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

// This special file catches errors in any client component in the app
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log exception to console
        console.error('💥 GLOBAL UI ERROR CAUGHT:', error)

        // Send critical alert to Admin Telegram
        // Note: We use fetch/API here because we are client-side
        fetch('/api/admin/report-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: 'Global UI Boundary (Client-Side)',
                message: error.message,
                stack: error.stack,
                digest: error.digest
            })
        }).catch(e => console.error('Failed to report error:', e))

    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo deu errado</h2>
                <p className="text-gray-500 mb-6">
                    Não se preocupe, nosso time de engenharia já foi notificado automaticamente.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Tentar novamente
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Voltar ao Início
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 text-left bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <p className="text-red-400 font-mono text-xs mb-2">DEV DEBUG INFO:</p>
                        <code className="text-white font-mono text-xs whitespace-pre-wrap">
                            {error.message}
                        </code>
                    </div>
                )}
            </div>
        </div>
    )
}
