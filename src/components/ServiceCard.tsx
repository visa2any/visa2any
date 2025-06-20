import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  color: 'blue' | 'green' | 'purple' | 'orange'
  onLearnMore?: () => void
  isNew?: boolean
}

export default function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  onLearnMore 
}: ServiceCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-50 to-indigo-100',
      iconBg: 'bg-blue-600',
      iconText: 'text-white'
    },
    green: {
      gradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-600',
      iconText: 'text-white'
    },
    purple: {
      gradient: 'from-purple-50 to-violet-100',
      iconBg: 'bg-purple-600',
      iconText: 'text-white'
    },
    orange: {
      gradient: 'from-orange-50 to-red-100',
      iconBg: 'bg-orange-600',
      iconText: 'text-white'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="group cursor-pointer">
      <div className={`bg-gradient-to-br ${colors.gradient} p-8 rounded-xl group-hover:shadow-xl transition-all duration-300`}>
        <div className={`${colors.iconBg} w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className={`h-8 w-8 ${colors.iconText}`} />
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {onLearnMore && (
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
            onClick={onLearnMore}
          >
            Saiba Mais
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}