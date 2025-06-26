'use client'

import { useState, useRef } from 'react'
import { 
  X, User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, Camera, Save, Edit3, Globe, Flag
} from 'lucide-react'
import { FormField } from '@/components/ui/FormField'
import { formatters, validators, combineValidators } from '@/lib/formatters'

interface ProfileData {
  name: string
  email: string
  phone: string
  country: string
  nationality: string
  age: number
  profession: string
  education: string
  targetCountry: string
  visaType: string
  profilePhoto?: string
}

interface ProfileEditorProps {
  isOpen: boolean
  onClose: () => void
  profileData: ProfileData
  onSave: (data: ProfileData) => void
}

const countries = [
  'Brasil', 'Estados Unidos', 'Canadá', 'Portugal', 'Espanha', 
  'França', 'Alemanha', 'Reino Unido', 'Austrália', 'Nova Zelândia'
]

const visaTypes = [
  'Turismo/Negócios', 'Estudo/Educação', 'Trabalho/Carreira', 
  'Investimento/Negócios', 'Família/Relacionamento', 'Aposentadoria'
]

const educationLevels = [
  'Ensino Fundamental', 'Ensino Médio', 'Tecnólogo', 'Superior',
  'Pós-graduação', 'Mestrado', 'Doutorado', 'Pós-doutorado'
]

export default function ProfileEditor({ isOpen, onClose, profileData, onSave }: ProfileEditorProps) {
  const [formData, setFormData] = useState<ProfileData>(profileData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing,    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB),      if (file.size > 5 * 1024 * 1024) {
        alert('Foto deve ter no máximo 5MB')
        return
      }

      // Validate file type,      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          profilePhoto: e.target?.result as string 
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation,    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    // Email validation,    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Phone validation,    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Telefone inválido'
    }

    // Age validation,    if (!formData.age || formData.age < 16 || formData.age > 100) {
      newErrors.age = 'Idade deve estar entre 16 e 100 anos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call,      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage,      localStorage.setItem('customer-profile', JSON.stringify(formData))
      
      // Also update the main customer data with the profile photo,      const existingCustomer = localStorage.getItem('customer')
      if (existingCustomer) {
        const customerData = JSON.parse(existingCustomer)
        customerData.profilePhoto = formData.profilePhoto
        customerData.name = formData.name
        customerData.email = formData.email
        customerData.phone = formData.phone
        localStorage.setItem('customer', JSON.stringify(customerData))
      }
      
      onSave(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Editar Perfil</h2>
                <p className="text-blue-100 text-sm">Mantenha suas informações atualizadas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                  {formData.profilePhoto ? (
                    <img 
                      src={formData.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Clique no ícone para alterar a foto</p>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nome Completo"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  formatValue={formatters.titleCase}
                  validation={combineValidators(validators.required, validators.minLength(2))}
                  error={errors.name}
                  leftIcon={<User className="h-4 w-4" />}
                  tooltip="Nome completo como aparece nos documentos oficiais"
                />

                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  validation={validators.email}
                  error={errors.email}
                  leftIcon={<Mail className="h-4 w-4" />}
                  tooltip="Email principal para comunicações"
                />

                <FormField
                  label="Telefone/WhatsApp"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  formatValue={formatters.phone}
                  validation={validators.phone}
                  error={errors.phone}
                  leftIcon={<Phone className="h-4 w-4" />}
                  tooltip="Telefone com WhatsApp preferencial"
                />

                <FormField
                  label="Idade"
                  type="number"
                  value={formData.age?.toString() || ''}
                  onChange={(value) => handleInputChange('age', parseInt(value) || 0)}
                  validation={validators.required}
                  error={errors.age}
                  leftIcon={<Calendar className="h-4 w-4" />}
                  tooltip="Idade em anos completos"
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País de Origem
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o país</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <FormField
                  label="Nacionalidade"
                  value={formData.nationality}
                  onChange={(value) => handleInputChange('nationality', value)}
                  formatValue={formatters.titleCase}
                  leftIcon={<Flag className="h-4 w-4" />}
                  tooltip="Nacionalidade conforme passaporte"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-500" />
                Informações Profissionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Profissão/Ocupação"
                  value={formData.profession}
                  onChange={(value) => handleInputChange('profession', value)}
                  formatValue={formatters.titleCase}
                  leftIcon={<Briefcase className="h-4 w-4" />}
                  tooltip="Sua profissão ou ocupação atual"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Educação
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o nível</option>
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Immigration Goals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                Objetivos de Imigração
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País de Destino
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o destino</option>
                    {countries.filter(c => c !== formData.country).map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Visto
                  </label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => handleInputChange('visaType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o tipo</option>
                    {visaTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}