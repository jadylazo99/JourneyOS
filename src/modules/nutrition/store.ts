import { create } from 'zustand'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { buildNutritionProfile } from './profile'
import { generateAllMeals, getTodayMealPicks } from './generator'
import { loadSuggestionsStore, saveSuggestionsStore } from './storage'
import type {
  FoodSection,
  MealSuggestion,
  NutritionTodaySummary,
} from './types'

interface NutritionStore {
  suggestions: Partial<Record<FoodSection, MealSuggestion[]>>
  generatedAt: string | null
  hydrated: boolean

  hydrate: () => void
  generateSuggestions: () => void
  getSectionMeals: (section: FoodSection) => MealSuggestion[]
  getTodaySummary: (proteinGrams: number, waterOz: number) => NutritionTodaySummary | null
  isNutritionEnabled: () => boolean
}

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  suggestions: {},
  generatedAt: null,
  hydrated: false,

  hydrate: () => {
    const store = loadSuggestionsStore()
    set({
      suggestions: store.suggestions,
      generatedAt: store.generatedAt,
      hydrated: true,
    })

    if (!store.generatedAt) {
      get().generateSuggestions()
    }
  },

  generateSuggestions: () => {
    const data = loadOnboardingData()
    if (!data?.profile) return

    const nutritionProfile = buildNutritionProfile(data.profile)
    const suggestions = generateAllMeals(nutritionProfile)
    const generatedAt = new Date().toISOString()

    saveSuggestionsStore({ suggestions, generatedAt })
    set({ suggestions, generatedAt })
  },

  getSectionMeals: (section) => get().suggestions[section] ?? [],

  getTodaySummary: (proteinGrams, waterOz) => {
    const data = loadOnboardingData()
    if (!data?.profile || !isModuleEnabled(data.profile, 'nutrition')) return null

    const nutritionProfile = buildNutritionProfile(data.profile)
    const picks = getTodayMealPicks(nutritionProfile, get().suggestions)

    return {
      proteinGrams,
      proteinGoal: nutritionProfile.goals.protein,
      waterOz,
      waterGoal: nutritionProfile.goals.waterOz,
      breakfast: picks.breakfast,
      lunchReminder: picks.lunchReminder,
      dinnerIdea: picks.dinnerIdea,
    }
  },

  isNutritionEnabled: () => {
    const data = loadOnboardingData()
    return data?.profile ? isModuleEnabled(data.profile, 'nutrition') : false
  },
}))
