import { NUTRITION_SUGGESTIONS_KEY } from './constants'
import type { NutritionSuggestionsStore } from './types'

export function emptySuggestionsStore(): NutritionSuggestionsStore {
  return { suggestions: {}, generatedAt: null }
}

export function loadSuggestionsStore(): NutritionSuggestionsStore {
  try {
    const raw = localStorage.getItem(NUTRITION_SUGGESTIONS_KEY)
    if (!raw) return emptySuggestionsStore()
    return { ...emptySuggestionsStore(), ...JSON.parse(raw) }
  } catch {
    return emptySuggestionsStore()
  }
}

export function saveSuggestionsStore(store: NutritionSuggestionsStore): void {
  localStorage.setItem(NUTRITION_SUGGESTIONS_KEY, JSON.stringify(store))
}
