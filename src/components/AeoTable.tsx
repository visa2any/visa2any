import React from 'react'

interface AeoTableProps {
    title: string
    headers: string[]
    rows: (string | number)[][]
    caption?: string
}

/**
 * A semantic HTML table component optimized for Answer Engines (AEO).
 * This structure helps AI models (Perplexity, Google SGE) extract comparison data easily.
 */
export default function AeoTable({ title, headers, rows, caption }: AeoTableProps) {
    return (
        <div className="my-8 overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-300">
                {caption && (
                    <caption className="p-4 text-sm text-gray-500 bg-gray-50 text-left border-b border-gray-200">
                        {caption}
                    </caption>
                )}
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ${cellIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                                        }`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                Fonte: Dados internos Visa2Any • Atualizado em {new Date().getFullYear()}
            </div>
        </div>
    )
}
