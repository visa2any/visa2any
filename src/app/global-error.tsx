'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('💥 CRITICAL ROOT ERROR:', error)
        fetch('/api/admin/report-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: 'CRITICAL ROOT BOUNDARY',
                message: error.message,
                stack: error.stack
            })
        }).catch(e => console.error(e))
    }, [error])

    return (
        <html>
            <body>
                <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Erro Crítico</h1>
                        <p className="text-gray-600 mb-6">O sistema encontrou um erro irrecuperável.</p>
                        <button
                            onClick={() => reset()}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                        >
                            Recarregar Aplicação
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
