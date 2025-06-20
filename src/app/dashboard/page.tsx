import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

export const metadata = {
  title: 'Dashboard - Visa2Any',
  description: 'Gerencie agendamentos, pagamentos e notificações'
}