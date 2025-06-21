'use client'

import { MessageCircle, Phone, Mail, Video } from 'lucide-react'

export default function CommunicationHub() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Central de Comunicação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <p className="font-medium text-gray-900">WhatsApp</p>
          <p className="text-sm text-gray-500">23 mensagens</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <p className="font-medium text-gray-900">Email</p>
          <p className="text-sm text-gray-500">15 não lidos</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Phone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <p className="font-medium text-gray-900">Ligações</p>
          <p className="text-sm text-gray-500">5 agendadas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Video className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <p className="font-medium text-gray-900">Videochamadas</p>
          <p className="text-sm text-gray-500">2 hoje</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Mensagens Recentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Maria Silva</p>
                <p className="text-sm text-gray-600">Enviou documentos para revisão</p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">João Santos</p>
                <p className="text-sm text-gray-600">Solicitou reagendamento de entrevista</p>
                <p className="text-xs text-gray-500">4 horas atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}