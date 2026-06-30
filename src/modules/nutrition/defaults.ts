import type { FoodPreferences } from '@/modules/onboarding/types'

export const JADY_LOVED_FOODS = [
  'Chicken',
  'Steak',
  'Salmon',
  'Eggs',
  'Turkey sausage',
  'Turkey bacon',
  'Lean ground beef',
  'Ground turkey',
  'Turkey deli meat',
  'White rice',
  'Potatoes',
  'Sweet potatoes',
  'Corn',
  'Onions',
  'Bread',
  'Tortillas',
  'Pasta',
  'Fairlife protein shakes',
  'Jerky',
  'Popcorn',
  'Rice cakes',
]

export const JADY_DISLIKED_FOODS = [
  'Greek yogurt',
  'Oatmeal',
  'English muffins',
  'Protein pancakes',
  'Cottage cheese',
  'Protein bars',
  'Quest bars',
  'Cheese sticks',
  'Sour cream',
  'Most fruits',
  'Most vegetables',
]

export const JADY_MEAL_PREP_HABITS = [
  'Sunday meal prep',
  'Lemon pepper chicken with white rice',
  'Teriyaki chicken with white rice',
]

export function applyJadyDefaults(food: FoodPreferences): FoodPreferences {
  return {
    foodsLove: food.foodsLove.length ? food.foodsLove : [...JADY_LOVED_FOODS],
    foodsDislike: food.foodsDislike.length ? food.foodsDislike : [...JADY_DISLIKED_FOODS],
    allergies: food.allergies,
    favoriteRestaurants: food.favoriteRestaurants,
    mealPrepHabits: food.mealPrepHabits.length
      ? food.mealPrepHabits
      : [...JADY_MEAL_PREP_HABITS],
  }
}

export function isJadyProfile(firstName: string): boolean {
  return firstName.trim().toLowerCase() === 'jady'
}
