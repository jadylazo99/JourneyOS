export type WorkScheduleVariability = 'same' | 'sometimes_late' | 'often_changes' | 'shifts'

export type WorkSchedule = {
  works: boolean
  days: string[]
  startTime: string
  endTime: string
  variability: WorkScheduleVariability | ''
  latestEndTime: string
}

export type PetScheduleItem = {
  id: string
  label: string
  time?: string
}

export type PetMedication = {
  id: string
  name: string
  schedule: string
  notes?: string
}

export type PetVaccineReminder = {
  id: string
  name: string
  dueDate: string
  notes?: string
}

export type Pet = {
  id: string
  name: string
  type: string
  breed?: string
  birthday?: string
  weight?: string
  food?: string
  feedingSchedule: PetScheduleItem[]
  walkSchedule: PetScheduleItem[]
  trainingGoals: string[]
  groomingSchedule: PetScheduleItem[]
  vetName?: string
  vetPhone?: string
  vaccineReminders: PetVaccineReminder[]
  medications: PetMedication[]
  notes?: string
  /** @deprecated migrated into schedules */
  dailyNeeds?: string
}

export type ModuleId =
  | 'weight_loss'
  | 'fitness'
  | 'nutrition'
  | 'study'
  | 'finance'
  | 'pets'
  | 'travel'
  | 'sleep'
  | 'mental_wellness'
  | 'work'
  | 'home'

export type FocusAreaId = ModuleId | 'custom'

export type PreferredUnits = {
  weight: 'lb' | 'kg'
  height: 'ft_in' | 'cm'
}

export type FoodPreferences = {
  foodsLove: string[]
  foodsDislike: string[]
  allergies: string[]
  favoriteRestaurants: string[]
  mealPrepHabits: string[]
}

export type VacationSettings = {
  active: boolean
  startDate: string
  endDate: string
  destination: string
  notes: string
}

export type ThemeSettings = {
  mode: 'system' | 'light' | 'dark'
}

export type GymType = 'none' | 'home' | 'apartment' | 'commercial'

export type FitnessSettings = {
  gymType: GymType
  workoutDays: string[]
  workoutTime: string
  workoutLengthMinutes: number
  injuriesOrLimitations: string[]
  equipment: string[]
}

export type NutritionGoals = {
  calories: number
  protein: number
  waterOz: number
}

export type StudyPreferences = {
  subjects: string[]
  examDates: { id: string; name: string; date: string }[]
  preferredStudyTimes: string[]
  studyGoals: string[]
}

export type FinancialGoals = {
  savingsGoals: string[]
  debtGoals: string[]
  monthlyBudgetNotes: string[]
}

export type HouseGoals = {
  projects: string[]
  notes: string[]
}

export type TravelHabits = {
  frequentDestinations: string[]
  travelStyle: 'vacation' | 'work' | 'mixed' | ''
  notes: string[]
}

export type FitnessMemory = {
  favoriteExercises: string[]
  dislikedExercises: string[]
  preferredWorkoutOrder: string[]
}

export type JourneyMemory = {
  study: StudyPreferences
  finance: FinancialGoals
  home: HouseGoals
  travel: TravelHabits
  fitnessExtras: FitnessMemory
  /** Question IDs the user has answered — never ask again */
  answeredQuestions: string[]
}

export type UserProfile = {
  firstName: string
  birthday: string
  height: string
  currentWeight: string
  goalWeight: string
  mainGoal: string
  wakeUpTime: string
  bedtime: string
  works: boolean | null
  workSchedule: WorkSchedule
  gymAccess: boolean | null
  /** @deprecated use foodPreferences.foodsLove */
  foodsLove: string
  /** @deprecated use foodPreferences.foodsDislike */
  foodsDislike: string
  /** @deprecated use foodPreferences.allergies */
  allergies: string
  hasPets: boolean | null
  petCount: number
  pets: Pet[]
  preferredUnits: PreferredUnits
  enabledModules: ModuleId[]
  /** Selected focus areas — drives modules, widgets, and recommendations */
  focusAreas: FocusAreaId[]
  foodPreferences: FoodPreferences
  nutritionGoals: NutritionGoals
  fitness: FitnessSettings
  vacation: VacationSettings
  theme: ThemeSettings
  journeyMemory: JourneyMemory
}

/** @deprecated use UserProfile */
export type OnboardingProfile = UserProfile

export type OnboardingStepId =
  | 'firstName'
  | 'birthday'
  | 'height'
  | 'currentWeight'
  | 'goalWeight'
  | 'mainGoal'
  | 'wakeUpTime'
  | 'bedtime'
  | 'works'
  | 'workDays'
  | 'workStartTime'
  | 'workEndTime'
  | 'scheduleVariability'
  | 'workLatestEndTime'
  | 'gymAccess'
  | 'foodsLove'
  | 'foodsDislike'
  | 'allergies'
  | 'hasPets'
  | 'petCount'
  | `petName-${number}`
  | `petType-${number}`
  | `petBirthday-${number}`

export type StepInputType =
  | 'text'
  | 'date'
  | 'time'
  | 'number'
  | 'textarea'
  | 'yesNo'
  | 'height'
  | 'weight'
  | 'daySelect'
  | 'select'

export type OnboardingSection =
  | 'Getting to know you'
  | 'Building your health profile'
  | 'Lifestyle'
  | 'Nutrition'
  | 'Pets'
  | 'Modules'

export type SelectOption = {
  value: string
  label: string
}

export type OnboardingStep = {
  id: OnboardingStepId
  title: string
  subtitle?: string
  inputType: StepInputType
  placeholder?: string
  optional?: boolean
  field?: keyof OnboardingProfile
  workScheduleField?: keyof WorkSchedule
  petIndex?: number
  selectOptions?: SelectOption[]
}

export type StoredOnboardingData = {
  onboardingComplete: boolean
  profile: OnboardingProfile
}

export const WEEKDAY_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const SCHEDULE_VARIABILITY_OPTIONS: SelectOption[] = [
  { value: 'same', label: 'No, usually same schedule' },
  { value: 'sometimes_late', label: 'Sometimes I work late' },
  { value: 'often_changes', label: 'My schedule changes often' },
  { value: 'shifts', label: 'I work shifts' },
]
