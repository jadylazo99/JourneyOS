export { useNutritionStore } from './store'
export { buildNutritionProfile, getApprovedFoods, getForbiddenFoods } from './profile'
export { generateAllMeals, generateSectionMeals, getTodayMealPicks } from './generator'
export { applyJadyDefaults, JADY_LOVED_FOODS } from './defaults'
export { FOOD_SECTION_LABELS, FOOD_SECTION_ORDER } from './types'
export type {
  FoodSection,
  MealSuggestion,
  MealTag,
  NutritionProfile,
  NutritionTodaySummary,
} from './types'
