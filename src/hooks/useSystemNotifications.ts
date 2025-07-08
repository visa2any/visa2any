'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/components/NotificationSystem'

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  actionUrl: string
  actionLabel: string
}

interface SystemNotificationResponse {
  success: boolean
  notifications: Notification[]
}

export function useSystemNotifications() {
  const { addNotification } = useNotifications()

  // Function to check for new system events
  const checkForUpdates = async () => {
    try {
      const response = await fetch('/api/notifications/system', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const data = await response.json() as SystemNotificationResponse
        if (data.success && data.notifications) {
          data.notifications.forEach(notification => {
            try {
              addNotification(notification)
            } catch (err) {
              console.error('Failed to add notification:', notification, err)
            }
          })
        }
      }
    } catch (error) {
      console.error('Error checking for system notifications:', error)
    }
  }

  // Check for updates every 30 seconds when page is visible
  useEffect(() => {
    let interval: NodeJS.Timeout

    const startPolling = () => {
      interval = setInterval(checkForUpdates, 30000)
    }

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else {
        startPolling()
        checkForUpdates() // Check immediately when page becomes visible
      }
    }

    // Start polling initially
    checkForUpdates()
    startPolling()

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Listen for custom notification events
  useEffect(() => {
    const handleCustomNotification = (event: CustomEvent) => {
      addNotification(event.detail)
    }

    window.addEventListener('visa2any:notification', handleCustomNotification as EventListener)

    return () => {
      window.removeEventListener('visa2any:notification', handleCustomNotification as EventListener)
    }
  }, [addNotification])

  return {
    // Utility functions for common notification types
    notifySuccess: (title: string, message: string, actionUrl = '', actionLabel = '') => {
      const notification = {
        type: 'success' as const,
        title,
        message,
        actionUrl,
        actionLabel
      }
      addNotification(notification)
    },

    notifyError: (title: string, message: string, actionUrl = '', actionLabel = '') => {
      const notification = {
        type: 'error' as const,
        title,
        message,
        actionUrl,
        actionLabel
      }
      addNotification(notification)
    },

    notifyWarning: (title: string, message: string, actionUrl = '', actionLabel = '') => {
      const notification = {
        type: 'warning' as const,
        title,
        message,
        actionUrl,
        actionLabel
      }
      addNotification(notification)
    },

    notifyInfo: (title: string, message: string, actionUrl = '', actionLabel = '') => {
      const notification = {
        type: 'info' as const,
        title,
        message,
        actionUrl,
        actionLabel
      }
      addNotification(notification)
    },

    // Function to trigger global notification from anywhere
    triggerGlobalNotification: (notification: {
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message: string
      actionUrl?: string
      actionLabel?: string
    }) => {
      const normalizedNotification = {
        ...notification,
        actionUrl: notification.actionUrl || '',
        actionLabel: notification.actionLabel || ''
      }
      window.dispatchEvent(new CustomEvent('visa2any:notification', {
        detail: normalizedNotification
      }))
    }
  }
}

// Global notification functions that can be called from anywhere
export const globalNotifications = {
  success: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    window.dispatchEvent(new CustomEvent('visa2any:notification', {
      detail: { type: 'success', title, message, actionUrl, actionLabel }
    }))
  },

  error: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    window.dispatchEvent(new CustomEvent('visa2any:notification', {
      detail: { type: 'error', title, message, actionUrl, actionLabel }
    }))
  },

  warning: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    window.dispatchEvent(new CustomEvent('visa2any:notification', {
      detail: { type: 'warning', title, message, actionUrl, actionLabel }
    }))
  },

  info: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    window.dispatchEvent(new CustomEvent('visa2any:notification', {
      detail: { type: 'info', title, message, actionUrl, actionLabel }
    }))
  }
}
