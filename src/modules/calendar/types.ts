import type { DayModeId } from '@/modules/daily/types'
import type { MealSuggestion } from '@/modules/nutrition/types'
import type { PetTask } from '@/modules/pets/types'
import type { TimelineEvent } from '@/modules/achievements/types'

export type DayStatus = 'strong' | 'vacation' | 'rest' | 'empty' | 'missed'

export type DayStatusConfig = {
  status: DayStatus
  label: string
  color: string
  bgColor: string
}

export type DayWorkoutStatus = {
  completed: boolean
  skipped: boolean
  title?: string
  message?: string
}

export type DayDetails = {
  dateKey: string
  displayDate: string
  dayMode: DayModeId
  dayModeLabel: string
  momentumScore: number
  weight?: number
  weightLogged: boolean
  workout: DayWorkoutStatus | null
  waterOz: number
  proteinGrams: number
  notes?: string
  petTasks: PetTask[]
  achievements: TimelineEvent[]
  meals: {
    breakfast?: MealSuggestion
    lunchReminder?: string
    dinnerIdea?: MealSuggestion
  } | null
  highlights: string[]
  hasData: boolean
}

export type WeeklySummary = {
  weekLabel: string
  startDateKey: string
  endDateKey: string
  strongDays: number
  restDays: number
  avgMomentum: number
  workoutsCompleted: number
  weighIns: number
  achievementsUnlocked: number
}
