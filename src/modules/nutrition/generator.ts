import {
  CARB_KEYWORDS,
  PROTEIN_KEYWORDS,
  QUICK_KEYWORDS,
  SUGGESTIONS_PER_SECTION,
} from './constants'
import { getApprovedFoods, getForbiddenFoods } from './profile'
import { MEAL_TEMPLATES } from './templates'
import type {
  FoodSection,
  MealSuggestion,
  MealTag,
  MealTemplate,
  NutritionProfile,
} from './types'

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function containsKeyword(text: string, keyword: string): boolean {
  const t = normalize(text)
  const k = normalize(keyword)
  return t.includes(k) || k.includes(t)
}

function isForbiddenText(text: string, forbidden: string[]): boolean {
  const lower = normalize(text)
  return forbidden.some((f) => {
    const fl = normalize(f)
    return lower.includes(fl) || fl.includes(lower)
  })
}

function matchesTemplate(template: MealTemplate, approved: string[]): boolean {
  return template.keywords.every((keyword) =>
    approved.some((food) => containsKeyword(food, keyword)),
  )
}

function scoreTemplate(
  template: MealTemplate,
  profile: NutritionProfile,
  approved: string[],
): number {
  let score = 0
  const hasMealPrep = profile.mealPrepHabits.length > 0

  if (hasMealPrep && template.tags.includes('Meal Prep')) score += 3
  if (template.tags.includes('High Protein')) score += 2
  if (template.tags.includes('Quick')) score += 1

  for (const habit of profile.mealPrepHabits) {
    if (template.keywords.every((k) => containsKeyword(habit, k))) score += 5
    if (containsKeyword(habit, template.name)) score += 4
  }

  if (profile.mainGoal.toLowerCase().includes('protein') && template.protein >= 35) {
    score += 2
  }

  void approved
  return score
}

function classifyFood(food: string): 'protein' | 'carb' | 'other' {
  const lower = normalize(food)
  if (PROTEIN_KEYWORDS.some((k) => lower.includes(k))) return 'protein'
  if (CARB_KEYWORDS.some((k) => lower.includes(k))) return 'carb'
  return 'other'
}

function buildDynamicMeals(
  profile: NutritionProfile,
  section: FoodSection,
  approved: string[],
): MealSuggestion[] {
  const proteins = approved.filter((f) => classifyFood(f) === 'protein')
  const carbs = approved.filter((f) => classifyFood(f) === 'carb')
  const meals: MealSuggestion[] = []

  if (section === 'breakfast') {
    for (const protein of proteins.slice(0, 3)) {
      for (const carb of carbs.filter((c) => containsKeyword(c, 'bread')).slice(0, 1)) {
        meals.push({
          id: `dyn-b-${normalize(protein)}-${normalize(carb)}`,
          name: `${protein} & ${carb}`,
          section,
          calories: 380,
          protein: 28,
          tags: tagForCombo(protein, carb, profile),
        })
      }
      if (containsKeyword(protein, 'egg')) {
        meals.push({
          id: `dyn-b-eggs-${normalize(protein)}`,
          name: `${protein} Scramble`,
          section,
          calories: 320,
          protein: 26,
          tags: ['High Protein', 'Quick', 'Low Effort'],
        })
      }
    }
    for (const food of approved.filter((f) => containsKeyword(f, 'shake'))) {
      meals.push({
        id: `dyn-b-shake-${normalize(food)}`,
        name: food,
        section,
        calories: 240,
        protein: 42,
        tags: ['High Protein', 'Quick', 'Low Effort'],
      })
    }
  }

  if (section === 'lunch' || section === 'dinner' || section === 'meal_prep') {
    for (const protein of proteins.slice(0, 4)) {
      for (const carb of carbs.slice(0, 2)) {
        const name =
          section === 'meal_prep'
            ? `Meal Prep: ${protein} & ${carb}`
            : `${protein} & ${carb} Bowl`
        meals.push({
          id: `dyn-${section}-${normalize(protein)}-${normalize(carb)}`,
          name,
          section,
          calories: section === 'meal_prep' ? 520 : 540,
          protein: 42,
          tags: tagForCombo(protein, carb, profile, section === 'meal_prep'),
        })
      }
    }
  }

  if (section === 'snacks') {
    for (const food of approved) {
      if (
        QUICK_KEYWORDS.some((k) => containsKeyword(food, k)) ||
        classifyFood(food) === 'protein'
      ) {
        meals.push({
          id: `dyn-snack-${normalize(food)}`,
          name: food,
          section,
          calories: containsKeyword(food, 'jerky') ? 120 : 150,
          protein: classifyFood(food) === 'protein' ? 15 : 4,
          tags: ['Quick', 'Low Effort', ...(classifyFood(food) === 'protein' ? ['High Protein' as MealTag] : [])],
        })
      }
    }
  }

  return meals
}

function tagForCombo(
  protein: string,
  carb: string,
  profile: NutritionProfile,
  forceMealPrep = false,
): MealTag[] {
  const tags: MealTag[] = ['High Protein']
  if (forceMealPrep || profile.mealPrepHabits.length > 0) tags.push('Meal Prep')
  if (QUICK_KEYWORDS.some((k) => containsKeyword(protein, k))) tags.push('Quick')
  if (!containsKeyword(carb, 'rice') && containsKeyword(carb, 'bread')) tags.push('Low Effort')
  void carb
  return tags
}

function mealsFromHabits(profile: NutritionProfile): MealSuggestion[] {
  const forbidden = getForbiddenFoods(profile).map(normalize)
  return profile.mealPrepHabits
    .filter((habit) => !isForbiddenText(habit, forbidden))
    .filter((habit) => !normalize(habit).includes('sunday meal prep'))
    .map((habit, i) => ({
      id: `habit-${i}-${normalize(habit).slice(0, 20)}`,
      name: habit.charAt(0).toUpperCase() + habit.slice(1),
      section: 'meal_prep' as FoodSection,
      calories: 540,
      protein: 45,
      tags: ['High Protein', 'Meal Prep'] as MealTag[],
    }))
}

function mealsFromRestaurants(profile: NutritionProfile): MealSuggestion[] {
  return profile.favoriteRestaurants.map((restaurant, i) => ({
    id: `restaurant-${i}-${normalize(restaurant).slice(0, 16)}`,
    name: restaurant,
    section: 'restaurants' as FoodSection,
    calories: 650,
    protein: 35,
    tags: ['Restaurant', 'Low Effort'] as MealTag[],
  }))
}

function templateToSuggestion(template: MealTemplate): MealSuggestion {
  return {
    id: template.id,
    name: template.name,
    section: template.section,
    calories: template.calories,
    protein: template.protein,
    tags: [...template.tags],
  }
}

function dedupeMeals(meals: MealSuggestion[]): MealSuggestion[] {
  const seen = new Set<string>()
  return meals.filter((meal) => {
    const key = normalize(meal.name)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function pickTop(
  meals: MealSuggestion[],
  limit: number,
): MealSuggestion[] {
  return dedupeMeals(meals).slice(0, limit)
}

export function generateSectionMeals(
  profile: NutritionProfile,
  section: FoodSection,
): MealSuggestion[] {
  const forbidden = getForbiddenFoods(profile)
  const approved = getApprovedFoods(profile)

  if (section === 'restaurants') {
    const restaurants = mealsFromRestaurants(profile)
    if (restaurants.length > 0) return pickTop(restaurants, SUGGESTIONS_PER_SECTION)
    return pickTop(
      [
        {
          id: 'restaurant-add',
          name: 'Add favorite restaurants in Profile',
          section: 'restaurants',
          calories: 0,
          protein: 0,
          tags: ['Restaurant'],
        },
      ],
      1,
    )
  }

  const templateMatches = MEAL_TEMPLATES.filter(
    (t) =>
      t.section === section &&
      matchesTemplate(t, approved) &&
      !isForbiddenText(t.name, forbidden),
  )
    .map((t) => ({ template: t, score: scoreTemplate(t, profile, approved) }))
    .sort((a, b) => b.score - a.score)
    .map(({ template }) => templateToSuggestion(template))

  const dynamic = buildDynamicMeals(profile, section, approved).filter(
    (m) => !isForbiddenText(m.name, forbidden),
  )

  const habits = section === 'meal_prep' ? mealsFromHabits(profile) : []

  const combined = [...habits, ...templateMatches, ...dynamic]

  if (combined.length === 0) {
    return [
      {
        id: `${section}-empty`,
        name: 'Add foods you love in Profile',
        section,
        calories: 0,
        protein: 0,
        tags: ['Low Effort'],
      },
    ]
  }

  return pickTop(combined, SUGGESTIONS_PER_SECTION)
}

export function generateAllMeals(
  profile: NutritionProfile,
): Record<FoodSection, MealSuggestion[]> {
  const sections: FoodSection[] = [
    'breakfast',
    'lunch',
    'dinner',
    'snacks',
    'meal_prep',
    'restaurants',
  ]

  return sections.reduce(
    (acc, section) => {
      acc[section] = generateSectionMeals(profile, section)
      return acc
    },
    {} as Record<FoodSection, MealSuggestion[]>,
  )
}

export function getTodayMealPicks(
  profile: NutritionProfile,
  all: Partial<Record<FoodSection, MealSuggestion[]>>,
): {
  breakfast: MealSuggestion | null
  lunchReminder: string | null
  dinnerIdea: MealSuggestion | null
} {
  const breakfast = all.breakfast?.[0] ?? null
  const dinnerIdea = all.dinner?.[0] ?? null

  let lunchReminder: string | null = null
  if (profile.mealPrepHabits.length > 0) {
    const prep = all.meal_prep?.[0]
    lunchReminder = prep
      ? `Meal prep ready: ${prep.name}`
      : `Don't forget your meal prep lunch`
  } else if (all.lunch?.[0]) {
    lunchReminder = `Lunch idea: ${all.lunch[0].name}`
  }

  return { breakfast, lunchReminder, dinnerIdea }
}
