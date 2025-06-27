'use client'

import { useState, useEffect } from 'react'
import { Clock, Users, TrendingUp, Zap } from 'lucide-react'

interface UrgencyBannerProps {
  type?: 'timer' | 'slots' | 'demand' | 'special'
  className?: string
}

export default function UrgencyBanner({ type = 'slots', className = '' }: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })
  
  const [slotsLeft, setSlotsLeft] = useState(7)
  const [recentActivity, setRecentActivity] = useState(12)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    // Simulate slot reduction

    const slotTimer = setInterval(() => {
      if (Math.random() < 0.3 && slotsLeft > 2) {
        setSlotsLeft(prev => prev - 1)
      }
    }, 180000) // Every 3 minutes

    // Simulate activity

    const activityTimer = setInterval(() => {
      setRecentActivity(prev => prev + Math.floor(Math.random() * 3))
    }, 45000) // Every 45 seconds

    return () => {
      clearInterval(timer)
      clearInterval(slotTimer)
      clearInterval(activityTimer)
    }
  }, [slotsLeft])

  const renderTimer = () => (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-lg">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="h-6 w-6 animate-pulse" />
        <div className="text-center">
          <div className="text-sm font-medium">OFERTA ESPECIAL EXPIRA EM:</div>
          <div className="text-2xl font-bold">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
        <Clock className="h-6 w-6 animate-pulse" />
      </div>
    </div>
  )

  const renderSlots = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg">
      <div className="flex items-center justify-center space-x-4">
        <Users className="h-6 w-6" />
        <div className="text-center">
          <div className="text-sm font-medium">VAGAS LIMITADAS ESTA SEMANA</div>
          <div className="text-xl font-bold">
            Apenas {slotsLeft} consultorias disponíveis
          </div>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-6 rounded ${
                i < slotsLeft ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderDemand = () => (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg">
      <div className="flex items-center justify-center space-x-4">
        <TrendingUp className="h-6 w-6" />
        <div className="text-center">
          <div className="text-sm font-medium">ALTA DEMANDA AGORA</div>
          <div className="text-xl font-bold">
            {recentActivity} pessoas visualizaram nas últimas 2 horas
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        </div>
      </div>
    </div>
  )

  const renderSpecial = () => (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg">
      <div className="flex items-center justify-center space-x-4">
        <Zap className="h-6 w-6 animate-bounce" />
        <div className="text-center">
          <div className="text-sm font-medium">PROMOÇÃO RELÂMPAGO</div>
          <div className="text-xl font-bold">
            Desconto especial válido até meia-noite
          </div>
        </div>
        <Zap className="h-6 w-6 animate-bounce" />
      </div>
    </div>
  )

  const banners = {
    timer: renderTimer(),
    slots: renderSlots(),
    demand: renderDemand(),
    special: renderSpecial()
  }

  return (
    <div className={`${className}`}>
      {banners[type]}
    </div>
  )
}