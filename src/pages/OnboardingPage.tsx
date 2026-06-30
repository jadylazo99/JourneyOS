import { useEffect, useCallback, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useOnboardingStore, getSectionForStepObject } from '@/modules/onboarding'
import {
  OnboardingLayout,
  OnboardingNavigation,
  OnboardingScreen,
  OnboardingStepInput,
  OnboardingWelcome,
  OnboardingBackground,
} from '@/components/onboarding'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(true)

  const {
    onboardingComplete,
    profile,
    currentStepIndex,
    direction,
    hydrated,
    hydrate,
    getSteps,
    getCurrentStep,
    updateField,
    updateWorkSchedule,
    setWorkDays,
    updatePet,
    setPetCount,
    nextStep,
    prevStep,
    canProceed,
  } = useOnboardingStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hydrated && currentStepIndex > 0) {
      setShowWelcome(false)
    }
  }, [hydrated, currentStepIndex])

  const steps = getSteps()
  const currentStep = getCurrentStep()
  const isLastStep = currentStepIndex === steps.length - 1
  const sectionTitle = currentStep ? getSectionForStepObject(currentStep) : 'Getting to know you'

  const handleNext = useCallback(() => {
    if (!canProceed()) return
    const finished = nextStep()
    if (finished && useOnboardingStore.getState().onboardingComplete) {
      navigate('/', { replace: true })
    }
  }, [nextStep, navigate, canProceed])

  const handleBack = useCallback(() => {
    if (currentStepIndex === 0) {
      setShowWelcome(true)
    } else {
      prevStep()
    }
  }, [currentStepIndex, prevStep])

  const handlePetChange = useCallback(
    (index: number, field: 'name' | 'type' | 'birthday', value: string) => {
      updatePet(index, field === 'birthday' ? { birthday: value || undefined } : { [field]: value })
    },
    [updatePet],
  )

  if (!hydrated) {
    return (
      <OnboardingBackground>
        <div className="min-h-dvh min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      </OnboardingBackground>
    )
  }

  if (onboardingComplete) {
    return <Navigate to="/" replace />
  }

  if (showWelcome) {
    return (
      <OnboardingBackground>
        <OnboardingWelcome onStart={() => setShowWelcome(false)} />
      </OnboardingBackground>
    )
  }

  if (!currentStep) {
    return null
  }

  return (
    <OnboardingLayout
      currentStep={currentStepIndex}
      totalSteps={steps.length}
      sectionTitle={sectionTitle}
      footer={
        <OnboardingNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoBack
          canGoNext={canProceed()}
          isLastStep={isLastStep}
        />
      }
    >
      <AnimatePresence mode="wait" custom={direction}>
        <OnboardingScreen
          key={currentStep.id}
          stepKey={currentStep.id}
          title={currentStep.title}
          subtitle={currentStep.subtitle}
          direction={direction}
        >
          <OnboardingStepInput
            step={currentStep}
            profile={profile}
            onFieldChange={updateField}
            onWorkScheduleChange={updateWorkSchedule}
            onWorkDaysChange={setWorkDays}
            onPetChange={handlePetChange}
            onPetCountChange={setPetCount}
            onSubmit={handleNext}
          />
        </OnboardingScreen>
      </AnimatePresence>
    </OnboardingLayout>
  )
}
