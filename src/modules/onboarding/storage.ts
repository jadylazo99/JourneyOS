import { ONBOARDING_STORAGE_KEY } from './constants'
import { DEFAULT_ENABLED_MODULES } from '@/modules/modules/constants'
import { getJadyDefaults, isJadyProfile } from '@/modules/fitness/jadyPlan'
import { applyBrunoDefaults, normalizePet } from '@/modules/pets/petUtils'
import type { Pet } from './types'
import type {
  FitnessMemory,
  FitnessSettings,
  FinancialGoals,
  FoodPreferences,
  HouseGoals,
  JourneyMemory,
  NutritionGoals,
  PreferredUnits,
  StudyPreferences,
  ThemeSettings,
  TravelHabits,
  UserProfile,
  VacationSettings,
  WorkSchedule,
  StoredOnboardingData,
} from './types'

export function emptyWorkSchedule(): WorkSchedule {
  return {
    works: false,
    days: [],
    startTime: '',
    endTime: '',
    variability: '',
    latestEndTime: '',
  }
}

export function emptyFoodPreferences(): FoodPreferences {
  return {
    foodsLove: [],
    foodsDislike: [],
    allergies: [],
    favoriteRestaurants: [],
    mealPrepHabits: [],
  }
}

export function emptyVacationSettings(): VacationSettings {
  return {
    active: false,
    startDate: '',
    endDate: '',
    destination: '',
    notes: '',
  }
}

export function emptyFitnessSettings(): FitnessSettings {
  return {
    gymType: 'none',
    workoutDays: ['Monday', 'Wednesday', 'Friday'],
    workoutTime: '07:00',
    workoutLengthMinutes: 45,
    injuriesOrLimitations: [],
    equipment: [],
  }
}

export function emptyNutritionGoals(): NutritionGoals {
  return { calories: 2000, protein: 150, waterOz: 80 }
}

export function emptyThemeSettings(): ThemeSettings {
  return { mode: 'system' }
}

export function emptyStudyPreferences(): StudyPreferences {
  return { subjects: [], examDates: [], preferredStudyTimes: [], studyGoals: [] }
}

export function emptyFinancialGoals(): FinancialGoals {
  return { savingsGoals: [], debtGoals: [], monthlyBudgetNotes: [] }
}

export function emptyHouseGoals(): HouseGoals {
  return { projects: [], notes: [] }
}

export function emptyTravelHabits(): TravelHabits {
  return { frequentDestinations: [], travelStyle: '', notes: [] }
}

export function emptyFitnessMemory(): FitnessMemory {
  return { favoriteExercises: [], dislikedExercises: [], preferredWorkoutOrder: [] }
}

export function emptyJourneyMemory(): JourneyMemory {
  return {
    study: emptyStudyPreferences(),
    finance: emptyFinancialGoals(),
    home: emptyHouseGoals(),
    travel: emptyTravelHabits(),
    fitnessExtras: emptyFitnessMemory(),
    answeredQuestions: [],
  }
}

export function emptyPreferredUnits(): PreferredUnits {
  return { weight: 'lb', height: 'ft_in' }
}

function parseListField(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value?.trim()) return []
  return value
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function syncLegacyFoodStrings(profile: UserProfile): UserProfile {
  const fp = profile.foodPreferences
  return {
    ...profile,
    foodsLove: fp.foodsLove.join(', '),
    foodsDislike: fp.foodsDislike.join(', '),
    allergies: fp.allergies.join(', '),
  }
}

export const emptyProfile = (): UserProfile => ({
  firstName: '',
  birthday: '',
  height: '',
  currentWeight: '',
  goalWeight: '',
  mainGoal: '',
  wakeUpTime: '',
  bedtime: '',
  works: null,
  workSchedule: emptyWorkSchedule(),
  gymAccess: null,
  foodsLove: '',
  foodsDislike: '',
  allergies: '',
  hasPets: null,
  petCount: 0,
  pets: [],
  preferredUnits: emptyPreferredUnits(),
  enabledModules: [...DEFAULT_ENABLED_MODULES],
  foodPreferences: emptyFoodPreferences(),
  nutritionGoals: emptyNutritionGoals(),
  fitness: emptyFitnessSettings(),
  vacation: emptyVacationSettings(),
  theme: emptyThemeSettings(),
  journeyMemory: emptyJourneyMemory(),
})

function normalizeProfile(stored: Partial<UserProfile>): UserProfile {
  const base = emptyProfile()
  const works =
    stored.workSchedule?.works ??
    (stored.works === true ? true : stored.works === false ? false : false)

  const legacyLove = stored.foodsLove ?? ''
  const legacyDislike = stored.foodsDislike ?? ''
  const legacyAllergies = stored.allergies ?? ''

  const foodPreferences: FoodPreferences = {
    foodsLove:
      stored.foodPreferences?.foodsLove?.length
        ? stored.foodPreferences.foodsLove
        : parseListField(legacyLove),
    foodsDislike:
      stored.foodPreferences?.foodsDislike?.length
        ? stored.foodPreferences.foodsDislike
        : parseListField(legacyDislike),
    allergies:
      stored.foodPreferences?.allergies?.length
        ? stored.foodPreferences.allergies
        : parseListField(legacyAllergies),
    favoriteRestaurants: stored.foodPreferences?.favoriteRestaurants ?? [],
    mealPrepHabits: stored.foodPreferences?.mealPrepHabits ?? [],
  }

  const profile: UserProfile = {
    ...base,
    ...stored,
    workSchedule: {
      ...emptyWorkSchedule(),
      ...stored.workSchedule,
      works: works === true,
    },
    works: stored.works ?? works,
    pets: (stored.pets ?? []).map((pet) => {
      const normalized = normalizePet(pet as Pet)
      if (
        isJadyProfile(stored.firstName ?? '') &&
        normalized.name.trim().toLowerCase() === 'bruno' &&
        !normalized.breed
      ) {
        return applyBrunoDefaults(normalized)
      }
      return normalized
    }),
    preferredUnits: {
      ...emptyPreferredUnits(),
      ...stored.preferredUnits,
    },
    enabledModules:
      stored.enabledModules?.length ? stored.enabledModules : [...DEFAULT_ENABLED_MODULES],
    foodPreferences,
    nutritionGoals: {
      ...emptyNutritionGoals(),
      ...stored.nutritionGoals,
    },
    fitness: {
      ...emptyFitnessSettings(),
      ...stored.fitness,
      workoutDays: stored.fitness?.workoutDays ?? emptyFitnessSettings().workoutDays,
      equipment: stored.fitness?.equipment ?? [],
      injuriesOrLimitations: stored.fitness?.injuriesOrLimitations ?? [],
    },
    vacation: {
      ...emptyVacationSettings(),
      ...stored.vacation,
    },
    theme: {
      ...emptyThemeSettings(),
      ...stored.theme,
    },
    journeyMemory: {
      ...emptyJourneyMemory(),
      ...stored.journeyMemory,
      study: { ...emptyStudyPreferences(), ...stored.journeyMemory?.study },
      finance: { ...emptyFinancialGoals(), ...stored.journeyMemory?.finance },
      home: { ...emptyHouseGoals(), ...stored.journeyMemory?.home },
      travel: { ...emptyTravelHabits(), ...stored.journeyMemory?.travel },
      fitnessExtras: {
        ...emptyFitnessMemory(),
        ...stored.journeyMemory?.fitnessExtras,
      },
      answeredQuestions: stored.journeyMemory?.answeredQuestions ?? [],
    },
  }

  if (
    isJadyProfile(profile.firstName) &&
    profile.fitness.equipment.length === 0
  ) {
    const jady = getJadyDefaults()
    profile.fitness = { ...profile.fitness, ...jady }
    profile.gymAccess = true
  }

  return syncLegacyFoodStrings(profile)
}

export function loadOnboardingData(): StoredOnboardingData | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredOnboardingData
    return {
      ...parsed,
      profile: normalizeProfile(parsed.profile),
    }
  } catch {
    return null
  }
}

export function saveOnboardingData(data: StoredOnboardingData): void {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data))
  import('@/services/cloudSyncService').then(({ queueCloudSync }) => {
    queueCloudSync('profile')
  })
}

export function persistProfile(profile: UserProfile, onboardingComplete: boolean): void {
  const normalized = normalizeProfile(profile)
  saveOnboardingData({ onboardingComplete, profile: syncLegacyFoodStrings(normalized) })
}
