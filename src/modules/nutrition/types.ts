export type FoodSection =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'meal_prep'
  | 'restaurants'

export type MealTag =
  | 'High Protein'
  | 'Quick'
  | 'Meal Prep'
  | 'Restaurant'
  | 'Low Effort'

export type MealSuggestion = {
  id: string
  name: string
  section: FoodSection
  calories: number
  protein: number
  tags: MealTag[]
}

export type NutritionProfile = {
  foodsLove: string[]
  foodsDisliked: string[]
  allergies: string[]
  favoriteRestaurants: string[]
  mealPrepHabits: string[]
  mainGoal: string
  goals: {
    calories: number
    protein: number
    waterOz: number
  }
}

export type MealTemplate = {
  id: string
  name: string
  section: FoodSection
  keywords: string[]
  calories: number
  protein: number
  tags: MealTag[]
}

export type NutritionSuggestionsStore = {
  suggestions: Partial<Record<FoodSection, MealSuggestion[]>>
  generatedAt: string | null
}

export type NutritionTodaySummary = {
  proteinGrams: number
  proteinGoal: number
  waterOz: number
  waterGoal: number
  breakfast: MealSuggestion | null
  lunchReminder: string | null
  dinnerIdea: MealSuggestion | null
}

export const FOOD_SECTION_LABELS: Record<FoodSection, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
  meal_prep: 'Meal Prep',
  restaurants: 'Restaurants',
}

export const FOOD_SECTION_ORDER: FoodSection[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'meal_prep',
  'restaurants',
]
