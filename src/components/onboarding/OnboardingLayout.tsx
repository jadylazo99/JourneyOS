import type { ReactNode } from 'react'
import type { OnboardingSection } from '@/modules/onboarding/types'
import { OnboardingProgressBar } from './OnboardingProgressBar'
import { OnboardingBackground } from './OnboardingBackground'

interface OnboardingLayoutProps {
  currentStep: number
  totalSteps: number
  sectionTitle: OnboardingSection
  children: ReactNode
  footer: ReactNode
}

export function OnboardingLayout({
  currentStep,
  totalSteps,
  sectionTitle,
  children,
  footer,
}: OnboardingLayoutProps) {
  return (
    <OnboardingBackground>
      <div className="flex flex-col min-h-dvh min-h-screen max-w-[560px] mx-auto w-full px-5 py-6 md:py-8">
        <div className="mb-6 shrink-0">
          <OnboardingProgressBar
            current={currentStep}
            total={totalSteps}
            sectionTitle={sectionTitle}
          />
        </div>

        <div className="flex flex-col flex-1 justify-center min-h-0 py-4">{children}</div>

        <div className="mt-6 pt-2 shrink-0">{footer}</div>
      </div>
    </OnboardingBackground>
  )
}
