import { create } from 'zustand'
import { buildOnboardingSteps, isStepValid } from './steps'
import { emptyProfile, emptyWorkSchedule, loadOnboardingData, persistProfile } from './storage'
import { emptyPet } from '@/modules/pets/petUtils'
import { personalizeModules } from '@/modules/intelligence/personalization/engine'
import type { OnboardingProfile, OnboardingStep, Pet, WorkSchedule } from './types'

interface OnboardingStore {
  onboardingComplete: boolean
  profile: OnboardingProfile
  currentStepIndex: number
  direction: 1 | -1
  hydrated: boolean

  hydrate: () => void
  getSteps: () => OnboardingStep[]
  getCurrentStep: () => OnboardingStep | null
  updateField: <K extends keyof OnboardingProfile>(field: K, value: OnboardingProfile[K]) => void
  updateWorkSchedule: (partial: Partial<WorkSchedule>) => void
  setWorkDays: (days: string[]) => void
  updatePet: (index: number, data: Partial<Pet>) => void
  setPetCount: (count: number) => void
  nextStep: () => boolean
  prevStep: () => void
  canProceed: () => boolean
  completeOnboarding: () => void
}

function ensurePetsArray(profile: OnboardingProfile, count: number): Pet[] {
  const pets = [...profile.pets]
  while (pets.length < count) {
    pets.push(emptyPet())
  }
  return pets.slice(0, count)
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  onboardingComplete: false,
  profile: emptyProfile(),
  currentStepIndex: 0,
  direction: 1,
  hydrated: false,

  hydrate: () => {
    const stored = loadOnboardingData()
    if (stored) {
      set({
        onboardingComplete: stored.onboardingComplete,
        profile: stored.profile,
        hydrated: true,
      })
    } else {
      set({ hydrated: true })
    }
  },

  getSteps: () => buildOnboardingSteps(get().profile),

  getCurrentStep: () => {
    const steps = get().getSteps()
    return steps[get().currentStepIndex] ?? null
  },

  updateField: (field, value) => {
    let profile = { ...get().profile, [field]: value }

    if (field === 'works') {
      const works = value === true
      profile = {
        ...profile,
        works: value as boolean | null,
        workSchedule: works
          ? { ...profile.workSchedule, works: true }
          : emptyWorkSchedule(),
      }
    }

    if (field === 'hasPets' && value === false) {
      profile.petCount = 0
      profile.pets = []
    }

    if (field === 'hasPets' && value === true && profile.petCount === 0) {
      profile.petCount = 1
      profile.pets = [emptyPet()]
    }

    if (field === 'gymAccess' && value === true) {
      profile = {
        ...profile,
        fitness: {
          ...profile.fitness,
          gymType: profile.fitness.gymType === 'none' ? 'commercial' : profile.fitness.gymType,
        },
      }
    }

    const steps = buildOnboardingSteps(profile)
    const currentStepIndex = Math.min(get().currentStepIndex, steps.length - 1)

    set({ profile, currentStepIndex })
    persistProfile(profile, get().onboardingComplete)
  },

  updateWorkSchedule: (partial) => {
    const profile = {
      ...get().profile,
      workSchedule: { ...get().profile.workSchedule, ...partial },
    }
    profile.works = profile.workSchedule.works

    const steps = buildOnboardingSteps(profile)
    const currentStepIndex = Math.min(get().currentStepIndex, steps.length - 1)

    set({ profile, currentStepIndex })
    persistProfile(profile, get().onboardingComplete)
  },

  setWorkDays: (days) => {
    get().updateWorkSchedule({ days })
  },

  updatePet: (index, data) => {
    const profile = { ...get().profile }
    const pets = [...profile.pets]
    pets[index] = { ...pets[index], ...data }
    profile.pets = pets
    set({ profile })
    persistProfile(profile, get().onboardingComplete)
  },

  setPetCount: (count) => {
    const safeCount = Math.min(20, Math.max(1, count))
    const profile = {
      ...get().profile,
      petCount: safeCount,
      pets: ensurePetsArray(get().profile, safeCount),
    }
    const steps = buildOnboardingSteps(profile)
    const currentStepIndex = Math.min(get().currentStepIndex, steps.length - 1)

    set({ profile, currentStepIndex })
    persistProfile(profile, get().onboardingComplete)
  },

  canProceed: () => {
    const step = get().getCurrentStep()
    if (!step) return false
    return isStepValid(step, get().profile)
  },

  nextStep: () => {
    if (!get().canProceed()) return false

    const steps = get().getSteps()
    const nextIndex = get().currentStepIndex + 1

    if (nextIndex >= steps.length) {
      get().completeOnboarding()
      return true
    }

    set({ currentStepIndex: nextIndex, direction: 1 })
    return true
  },

  prevStep: () => {
    const prevIndex = Math.max(0, get().currentStepIndex - 1)
    set({ currentStepIndex: prevIndex, direction: -1 })
  },

  completeOnboarding: () => {
    let profile = get().profile

    if (profile.gymAccess === true && profile.fitness.gymType === 'none') {
      profile = {
        ...profile,
        fitness: { ...profile.fitness, gymType: 'commercial' },
      }
    }

    const { modules, questionId } = personalizeModules(
      profile.mainGoal,
      profile.enabledModules,
      profile.journeyMemory.answeredQuestions,
    )

    if (questionId) {
      profile = {
        ...profile,
        enabledModules: modules,
        journeyMemory: {
          ...profile.journeyMemory,
          answeredQuestions: [...profile.journeyMemory.answeredQuestions, questionId],
        },
      }
    }

    set({ onboardingComplete: true, profile })
    persistProfile(profile, true)
  },
}))
