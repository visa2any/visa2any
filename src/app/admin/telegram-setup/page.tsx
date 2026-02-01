'use client'

import { useState } from 'react'
import { Zap, Send, RefreshCw, Copy, Check } from 'lucide-react'

export default function TelegramSetupPage() {
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [updates, setUpdates] = useState<any[]>([])
    const [error, setError] = useState('')
    const [testResult, setTestResult] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const checkUpdates = async () => {
        if (!token) {
            setError('Por favor, insira o Token do Bot')
            return
        }
        setLoading(true)
        setError('')
        setUpdates([])

        try {
            const response = await fetch('/api/admin/telegram-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, action: 'getUpdates' })
            })

            const data = await response.json()

            if (!data.ok) {
                throw new Error(data.description || 'Erro desconhecido')
            }

            setUpdates(data.result)
        } catch (err: any) {
            setError(err.message || 'Falha ao buscar updates')
        } finally {
            setLoading(false)
        }
    }

    const sendTest = async (chatId: string) => {
        setLoading(true)
        setTestResult('')
        try {
            const response = await fetch('/api/admin/telegram-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    action: 'sendMessage',
                    chatId,
                    message: '✅ Visa2Any: Teste de Configuração com Sucesso! 🚀'
                })
            })
            const data = await response.json()
            if (data.ok) {
                setTestResult('Mensagem enviada com sucesso!')
            } else {
                throw new Error(data.description)
            }
        } catch (err: any) {
            setTestResult('Erro ao enviar: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6" />
                        Configuração Telegram Visa2Any
                    </h1>
                    <p className="opacity-90 mt-2">Descubra o ID do seu grupo e teste as notificações</p>
                </div>

                <div className="p-6 space-y-8">

                    {/* PASSO 1 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                            <h2 className="text-lg font-semibold text-gray-800">Token do Bot</h2>
                        </div>

                        <div className="pl-11">
                            <p className="text-sm text-gray-500 mb-2">Cole aqui o token que você recebeu do @BotFather:</p>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Ex: 123456789:AAHg..."
                                className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </section>

                    {/* PASSO 2 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">2</div>
                            <h2 className="text-lg font-semibold text-gray-800">Descobrir ID do Grupo</h2>
                        </div>

                        <div className="pl-11 space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                                <p><strong>Antes de clicar no botão abaixo:</strong></p>
                                <ol className="list-decimal ml-5 mt-2 space-y-1">
                                    <li>Adicione o bot ao grupo que você criou.</li>
                                    <li>Envie uma mensagem qualquer no grupo (ex: "Oi bot").</li>
                                </ol>
                            </div>

                            <button
                                onClick={checkUpdates}
                                disabled={loading}
                                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                                Buscar Mensagens Recentes
                            </button>

                            {error && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {updates.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    <h3 className="font-semibold text-gray-700">Chats Encontrados:</h3>
                                    {updates.map((update, idx) => {
                                        const chat = update.message?.chat || update.my_chat_member?.chat || update.channel_post?.chat
                                        if (!chat) return null

                                        return (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="font-bold text-gray-900">{chat.title || chat.username || 'Chat Privado'}</p>
                                                    <p className="text-sm text-gray-500 font-mono">ID: {chat.id}</p>
                                                    <p className="text-xs text-gray-400">Tipo: {chat.type}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(String(chat.id))}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Copiar ID"
                                                    >
                                                        {copiedId === String(chat.id) ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => sendTest(String(chat.id))}
                                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Enviar Teste"
                                                    >
                                                        <Send className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {testResult && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${testResult.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {testResult}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* PASSO 3 */}
                    <section className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
                            <h2 className="text-lg font-semibold text-gray-800">Finalizar Configuração</h2>
                        </div>

                        <div className="pl-11 text-sm text-gray-600 space-y-2">
                            <p>Copie o <strong>ID</strong> acima e adicione nas variáveis de ambiente:</p>
                            <div className="bg-gray-900 text-gray-200 p-4 rounded-lg font-mono overflow-x-auto">
                                TELEGRAM_ADMIN_BOT_TOKEN={token}<br />
                                TELEGRAM_ADMIN_CHAT_ID={copiedId || '(ID COPIADO AQUI)'}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
