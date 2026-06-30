import type { UserProfile } from '@/modules/onboarding/types'
import { applyJadyDefaults, isJadyProfile } from './defaults'
import type { NutritionProfile } from './types'

export function buildNutritionProfile(profile: UserProfile): NutritionProfile {
  let food = profile.foodPreferences

  if (isJadyProfile(profile.firstName)) {
    food = applyJadyDefaults(food)
  }

  return {
    foodsLove: food.foodsLove,
    foodsDisliked: food.foodsDislike,
    allergies: food.allergies,
    favoriteRestaurants: food.favoriteRestaurants,
    mealPrepHabits: food.mealPrepHabits,
    mainGoal: profile.mainGoal,
    goals: profile.nutritionGoals,
  }
}

export function getForbiddenFoods(profile: NutritionProfile): string[] {
  return [...profile.foodsDisliked, ...profile.allergies]
}

export function getApprovedFoods(profile: NutritionProfile): string[] {
  const forbidden = getForbiddenFoods(profile).map((f) => f.toLowerCase())
  return profile.foodsLove.filter((food) => {
    const lower = food.toLowerCase()
    return !forbidden.some((f) => lower.includes(f) || f.includes(lower))
  })
}
