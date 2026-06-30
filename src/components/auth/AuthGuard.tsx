import { Navigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/modules/app/store'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isInitialized = useAppStore((s) => s.isInitialized)
  const user = useAppStore((s) => s.user)
  const location = useLocation()

  if (!isInitialized) {
    return (
      <div className="min-h-dvh min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const isInitialized = useAppStore((s) => s.isInitialized)
  const user = useAppStore((s) => s.user)

  if (!isInitialized) {
    return (
      <div className="min-h-dvh min-h-screen bg-gradient-to-br from-primary via-primary to-blue flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}