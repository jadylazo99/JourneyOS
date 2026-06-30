import type { DayModeId } from '@/modules/daily/types'
import type { ModuleId } from '@/modules/onboarding/types'

export type IntelligenceEventSource =
  | 'daily'
  | 'fitness'
  | 'nutrition'
  | 'pets'
  | 'profile'
  | 'travel'
  | 'user'
  | 'system'

export type IntelligenceObservation = {
  id: string
  dateKey: string
  timestamp: string
  source: IntelligenceEventSource
  kind: string
  payload: Record<string, unknown>
}

export type LearnedPatternKind =
  | 'workout_after_work'
  | 'skip_weekday'
  | 'meal_prep_day'
  | 'pet_walk_before_breakfast'
  | 'frequent_travel'
  | 'typical_bedtime'
  | 'typical_wake'

export type LearnedPattern = {
  id: string
  kind: LearnedPatternKind
  label: string
  confidence: number
  evidenceCount: number
  lastSeen: string
  metadata?: Record<string, unknown>
}

export type TravelTripType = 'vacation' | 'work_trip' | 'just_visiting'

export type TravelIntelligenceState = {
  neverAskAgain: boolean
  lastResponse: TravelTripType | null
  lastTimezone: string
  lastCountryLabel: string
  lastPromptDateKey: string
  answeredAt: string
}

export type NotificationKind =
  | 'workout'
  | 'meal'
  | 'water'
  | 'protein'
  | 'pet'
  | 'study'
  | 'finance'
  | 'travel'
  | 'medication'
  | 'appointment'
  | 'morning_greeting'
  | 'night_reflection'

export type NotificationPreferences = {
  enabled: boolean
  kinds: Record<NotificationKind, boolean>
  quietHoursStart: string
  quietHoursEnd: string
  weekendsEnabled: boolean
  vacationEnabled: boolean
  timezoneAware: boolean
}

export type ScheduledNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  scheduledFor: string
  dateKey: string
  dismissed: boolean
}

export type RecommendationAction =
  | 'complete'
  | 'short_version'
  | 'walk_instead'
  | 'reschedule'
  | 'dismiss'

export type Recommendation = {
  id: string
  priority: number
  title: string
  message: string
  kind: NotificationKind | 'general'
  actions: { id: RecommendationAction; label: string }[]
  module?: ModuleId
}

export type WeeklyReview = {
  weekLabel: string
  startDateKey: string
  endDateKey: string
  weightChange: number | null
  workoutCount: number
  waterDays: number
  proteinDays: number
  avgMomentum: number
  achievementsUnlocked: number
  petTasksCompleted: number
  highlights: string[]
  isCurrentWeek: boolean
}

export type MonthlyReview = {
  monthLabel: string
  year: number
  month: number
  weightStart: number | null
  weightEnd: number | null
  weightChange: number | null
  weightChartPoints: { dateKey: string; weight: number }[]
  workoutsCompleted: number
  avgMomentum: number
  achievementsUnlocked: number
  strongDays: number
  consistencyScore: number
  photoMemories: number
  weighInCount: number
  milestones: string[]
  summary: string
}

export type IntelligenceStoreData = {
  observations: IntelligenceObservation[]
  patterns: LearnedPattern[]
  travel: TravelIntelligenceState
  notifications: NotificationPreferences
  notificationsBaseline: NotificationPreferences | null
  scheduledNotifications: ScheduledNotification[]
  reviewsSeen: { weekly: string[]; monthly: string[] }
  lastKnownDateKey: string
}

export type AIContextPacket = {
  generatedAt: string
  dateKey: string
  timezone: string
  profile: {
    firstName: string
    mainGoal: string
    enabledModules: ModuleId[]
    wakeUpTime: string
    bedtime: string
    works: boolean
  }
  memory: {
    foodsLove: string[]
    foodsDislike: string[]
    favoriteRestaurants: string[]
    pets: { name: string; type: string }[]
    fitnessPreferences: Record<string, unknown>
    studyPreferences: Record<string, unknown>
    financialGoals: Record<string, unknown>
    travelHabits: Record<string, unknown>
    answeredQuestions: string[]
  }
  today: {
    dayMode: DayModeId
    momentumScore: number
    waterOz: number
    proteinGrams: number
  } | null
  patterns: LearnedPattern[]
  recentObservations: IntelligenceObservation[]
  recommendations: Recommendation[]
}
