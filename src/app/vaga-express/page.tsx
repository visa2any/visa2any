'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VagaExpressPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return null
}