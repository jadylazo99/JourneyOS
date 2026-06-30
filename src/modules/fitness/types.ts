import type { DayModeId } from '@/modules/daily/types'

export type WorkoutVariant = 'full' | 'short' | 'walk' | 'recovery' | 'rest'

export type ExerciseKind = 'strength' | 'cardio' | 'mobility' | 'activity' | 'rest'

export type WorkoutExercise = {
  id: string
  name: string
  kind: ExerciseKind
  sets?: number
  reps?: string
  duration?: string
  restSeconds?: number
  notes?: string
}

export type WorkoutPlan = {
  id: string
  weekday: string
  title: string
  subtitle?: string
  estimatedMinutes: number
  exercises: WorkoutExercise[]
  isRestDay?: boolean
}

export type ExerciseLogState = {
  completed: boolean
  weightUsed: string
  notes: string
}

export type WorkoutActiveSession = {
  dateKey: string
  workoutId: string
  variant: WorkoutVariant
  title: string
  exerciseStates: Record<string, ExerciseLogState>
}

export type WorkoutSkipReason = 'short_version' | 'reschedule' | 'planned_skip' | 'walk_instead'

export type WorkoutSkipState = {
  dateKey: string
  reason: WorkoutSkipReason
  message: string
}

export type CompletedWorkout = {
  id: string
  dateKey: string
  workoutId: string
  title: string
  variant: WorkoutVariant
  completedAt: string
  estimatedMinutes: number
  exercisesCompleted: number
  exercisesTotal: number
  exerciseLogs: Record<string, ExerciseLogState>
}

export type PersonalRecord = {
  exerciseName: string
  weight: string
  dateKey: string
}

export type FitnessStoreData = {
  completedWorkouts: CompletedWorkout[]
  personalRecords: PersonalRecord[]
  activeSession: WorkoutActiveSession | null
  todaySkip: WorkoutSkipState | null
}

export type FitnessContext = {
  fitnessEnabled: boolean
  weightLossEnabled: boolean
  gymAccess: boolean
  gymType: string
  workoutDays: string[]
  workoutTime: string
  workoutLengthMinutes: number
  injuriesOrLimitations: string[]
  equipment: string[]
  petName: string | null
  dayMode: DayModeId
  todayWeekday: string
}

export type AdaptiveWorkoutResult = {
  showWorkout: boolean
  variant: WorkoutVariant
  title: string
  subtitle: string
  estimatedMinutes: number
  exercises: WorkoutExercise[]
  message?: string
  walkingGoal?: string
  skipOffered: boolean
  plan: WorkoutPlan | null
}

export type FitnessProgressStats = {
  totalWorkouts: number
  currentStreak: number
  longestStreak: number
  exercisesCompleted: number
  personalRecords: PersonalRecord[]
}

export const WEEKDAY_PLAN_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const SKIP_OPTIONS: { reason: WorkoutSkipReason; label: string; message: string }[] = [
  {
    reason: 'short_version',
    label: 'Short version',
    message: 'A shorter session still counts. You showed up.',
  },
  {
    reason: 'reschedule',
    label: 'Reschedule',
    message: 'No problem — tomorrow is open.',
  },
  {
    reason: 'planned_skip',
    label: 'Planned skip',
    message: 'Rest is part of the plan. See you next session.',
  },
  {
    reason: 'walk_instead',
    label: 'Walk instead',
    message: 'Movement is movement. A walk counts today.',
  },
]
