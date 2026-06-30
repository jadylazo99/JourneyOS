import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useOnboardingStore } from '@/modules/onboarding'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { onboardingComplete, hydrated, hydrate } = useOnboardingStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="min-h-dvh min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
