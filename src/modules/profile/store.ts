import { create } from 'zustand'
import { loadDailyStore, saveDailyStore } from '@/modules/daily/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import type { FocusAreaId, ModuleId } from '@/modules/onboarding/types'
import { syncModulesFromFocusAreas } from '@/modules/modules/focusAreas'
import type {
  FitnessSettings,
  FoodPreferences,
  NutritionGoals,
  Pet,
  PreferredUnits,
  ThemeSettings,
  UserProfile,
  VacationSettings,
  WorkSchedule,
} from '@/modules/onboarding/types'
import {
  emptyProfile,
  emptyWorkSchedule,
  emptyThemeSettings,
  loadOnboardingData,
  persistProfile,
} from '@/modules/onboarding/storage'
import { emptyPet } from '@/modules/pets/petUtils'
import { useAchievementStore } from '@/modules/achievements/store'
import { getTimelineMessage } from '@/modules/achievements/messages'
import { useDailyStore } from '@/modules/daily/store'
import { getLocalDateKey } from '@/modules/daily/date'
import { useNutritionStore } from '@/modules/nutrition/store'
import { useIntelligenceStore } from '@/modules/intelligence'
import {
  shouldAutoActivateVacation,
  isVacationPausedToday,
} from '@/modules/intelligence/vacation/engine'
import type { JourneyMemory } from '@/modules/onboarding/types'

function applyTheme(theme: ThemeSettings): void {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark =
    theme.mode === 'dark' || (theme.mode === 'system' && prefersDark)
  root.classList.toggle('dark', isDark)
}

interface ProfileStore {
  onboardingComplete: boolean
  profile: UserProfile
  hydrated: boolean

  hydrate: () => void
  updateField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void
  updateWorkSchedule: (partial: Partial<WorkSchedule>) => void
  setWorkDays: (days: string[]) => void
  updateFoodPreferences: (partial: Partial<FoodPreferences>) => void
  updateNutritionGoals: (partial: Partial<NutritionGoals>) => void
  updateFitness: (partial: Partial<FitnessSettings>) => void
  updateVacation: (partial: Partial<VacationSettings>) => void
  endVacationEarly: () => void
  pauseVacationToday: () => void
  resumeVacationToday: () => void
  updateTheme: (partial: Partial<ThemeSettings>) => void
  updateJourneyMemory: (partial: Partial<JourneyMemory>) => void
  updatePreferredUnits: (partial: Partial<PreferredUnits>) => void
  toggleModule: (moduleId: ModuleId) => void
  toggleFocusArea: (focusId: FocusAreaId) => void
  setEnabledModules: (modules: ModuleId[]) => void
  addPet: () => void
  updatePet: (index: number, data: Partial<Pet>) => void
  removePet: (index: number) => void
  isModuleEnabled: (moduleId: ModuleId) => boolean
}

function syncVacationToDaily(profile: UserProfile): void {
  const store = loadDailyStore()
  const todayKey = getLocalDateKey()
  const inRange = shouldAutoActivateVacation(profile.vacation, todayKey)
  const paused = isVacationPausedToday(profile.vacation, todayKey)
  store.lifeEngineSettings.vacationModeEnabled =
    profile.vacation.active && inRange && !paused
  saveDailyStore(store)
}

function saveProfile(
  profile: UserProfile,
  onboardingComplete: boolean,
  set: (state: Partial<ProfileStore>) => void,
): void {
  persistProfile(profile, onboardingComplete)
  set({ profile })
  applyTheme(profile.theme)
  syncVacationToDaily(profile)
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  onboardingComplete: false,
  profile: emptyProfile(),
  hydrated: false,

  hydrate: () => {
    const stored = loadOnboardingData()
    if (stored) {
      applyTheme(stored.profile.theme)
      syncVacationToDaily(stored.profile)
      set({
        onboardingComplete: stored.onboardingComplete,
        profile: stored.profile,
        hydrated: true,
      })
    } else {
      applyTheme(emptyThemeSettings())
      set({ hydrated: true })
    }
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

    saveProfile(profile, get().onboardingComplete, set)
    useDailyStore.getState().refreshFlowSteps()

    if (field === 'mainGoal' && typeof value === 'string' && value.trim()) {
      useIntelligenceStore.getState().applyPersonalizationForGoal(value)
      const refreshed = loadOnboardingData()?.profile
      if (refreshed) set({ profile: refreshed })
    }
  },

  updateWorkSchedule: (partial) => {
    const profile = {
      ...get().profile,
      workSchedule: { ...get().profile.workSchedule, ...partial },
    }
    profile.works = profile.workSchedule.works
    saveProfile(profile, get().onboardingComplete, set)
    useDailyStore.getState().refreshFlowSteps()
  },

  setWorkDays: (days) => {
    get().updateWorkSchedule({ days })
  },

  updateFoodPreferences: (partial) => {
    const foodPreferences = { ...get().profile.foodPreferences, ...partial }
    const profile = {
      ...get().profile,
      foodPreferences,
      foodsLove: foodPreferences.foodsLove.join(', '),
      foodsDislike: foodPreferences.foodsDislike.join(', '),
      allergies: foodPreferences.allergies.join(', '),
    }
    saveProfile(profile, get().onboardingComplete, set)
    useNutritionStore.getState().generateSuggestions()
  },

  updateNutritionGoals: (partial) => {
    const profile = {
      ...get().profile,
      nutritionGoals: { ...get().profile.nutritionGoals, ...partial },
    }
    saveProfile(profile, get().onboardingComplete, set)
    useNutritionStore.getState().generateSuggestions()
  },

  updateFitness: (partial) => {
    const fitness = { ...get().profile.fitness, ...partial }
    const profile = {
      ...get().profile,
      fitness,
      gymAccess: fitness.gymType !== 'none',
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  updateVacation: (partial) => {
    const prev = get().profile.vacation
    const vacation = { ...prev, ...partial }
    const profile = {
      ...get().profile,
      vacation,
    }
    saveProfile(profile, get().onboardingComplete, set)

    const achievementStore = useAchievementStore.getState()
    if (partial.active === true && !prev.active) {
      achievementStore.addLifeEvent({
        title: 'Vacation Started',
        description: getTimelineMessage(
          'vacation_started',
          vacation.destination
            ? `Heading to ${vacation.destination}.`
            : 'Time to rest and recharge.',
        ),
        icon: '🏖️',
        category: 'travel',
      })
    }
    if (partial.active === false && prev.active) {
      achievementStore.addLifeEvent({
        title: 'Vacation Ended',
        description: getTimelineMessage(
          'vacation_completed',
          'Welcome back. Pick up where you left off.',
        ),
        icon: '🏠',
        category: 'travel',
      })
    }

    useDailyStore.getState().hydrate()
    useIntelligenceStore.getState().hydrate()
  },

  endVacationEarly: () => {
    const todayKey = getLocalDateKey()
    get().updateVacation({
      active: false,
      endDate: todayKey,
      pausedForDate: '',
    })
    useDailyStore.getState().setVacationMode(false)
    useDailyStore.getState().setTodayMode('normal')
  },

  pauseVacationToday: () => {
    const todayKey = getLocalDateKey()
    get().updateVacation({ pausedForDate: todayKey })
    useDailyStore.getState().setVacationMode(false)
    useDailyStore.getState().setTodayMode('normal')
  },

  resumeVacationToday: () => {
    get().updateVacation({ pausedForDate: '', active: true })
    useDailyStore.getState().setVacationMode(true)
  },

  updateTheme: (partial) => {
    const profile = {
      ...get().profile,
      theme: { ...get().profile.theme, ...partial },
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  updateJourneyMemory: (partial) => {
    const journeyMemory = { ...get().profile.journeyMemory, ...partial }
    const profile = { ...get().profile, journeyMemory }
    saveProfile(profile, get().onboardingComplete, set)
  },

  updatePreferredUnits: (partial) => {
    const profile = {
      ...get().profile,
      preferredUnits: { ...get().profile.preferredUnits, ...partial },
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  toggleModule: (moduleId) => {
    get().toggleFocusArea(moduleId)
  },

  toggleFocusArea: (focusId) => {
    const current = get().profile.focusAreas ?? get().profile.enabledModules
    const focusAreas = current.includes(focusId)
      ? current.filter((f) => f !== focusId)
      : [...current, focusId]
    const enabledModules = syncModulesFromFocusAreas(focusAreas)
    const profile = { ...get().profile, focusAreas, enabledModules }
    saveProfile(profile, get().onboardingComplete, set)
    useDailyStore.getState().refreshFlowSteps()
  },

  setEnabledModules: (modules) => {
    const profile = { ...get().profile, enabledModules: modules }
    saveProfile(profile, get().onboardingComplete, set)
    useDailyStore.getState().refreshFlowSteps()
  },

  addPet: () => {
    const newPet = emptyPet()
    const profile = {
      ...get().profile,
      hasPets: true,
      petCount: get().profile.pets.length + 1,
      pets: [...get().profile.pets, newPet],
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  updatePet: (index, data) => {
    const pets = [...get().profile.pets]
    pets[index] = { ...pets[index], ...data }
    const profile = {
      ...get().profile,
      pets,
      hasPets: pets.length > 0,
      petCount: pets.length,
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  removePet: (index) => {
    const pets = get().profile.pets.filter((_, i) => i !== index)
    const profile = {
      ...get().profile,
      pets,
      hasPets: pets.length > 0,
      petCount: pets.length,
    }
    saveProfile(profile, get().onboardingComplete, set)
  },

  isModuleEnabled: (moduleId) => isModuleEnabled(get().profile, moduleId),
}))

export { applyTheme }
