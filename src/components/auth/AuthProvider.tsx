import { useEffect } from 'react'
import { initOfflineSyncRecovery } from '@/services/cloudSyncService'
import { subscribeToAuthChanges } from '@/services/authService'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initOfflineSyncRecovery()
    const unsubscribe = subscribeToAuthChanges()
    return unsubscribe
  }, [])

  return children
}
