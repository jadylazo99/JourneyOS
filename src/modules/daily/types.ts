import type { GuidedFlowState } from './guided/types'

export type DayModeId =
  | 'normal'
  | 'busy_workday'
  | 'gym'
  | 'rest'
  | 'vacation'
  | 'travel'
  | 'sick'
  | 'recovery'
  | 'custom'

/** @deprecated Use DayModeId — kept for migration */
export type DayType = DayModeId

export type DayModeSource = 'auto' | 'user'

export type DayMode = {
  mode: DayModeId
  source: DayModeSource
  confidence: number
  signals: string[]
  userConfirmed: boolean
  confirmedAt?: string
}

export type LifeEngineSettings = {
  vacationModeEnabled: boolean
  sickModeEnabled: boolean
}

export type FlowStepId =
  | 'greeting'
  | 'mode_prompt'
  | 'ready'
  | 'weigh_in'
  | 'focus'
  | 'next_action'
  | 'celebrate'
  | 'done'

export type ConsistencyEventType =
  | 'opened_app'
  | 'logged_weight'
  | 'skipped_weigh_in'
  | 'completed_flow'
  | 'walked_pet'
  | 'completed_workout'
  | 'studied'
  | 'drank_water'

export type ConsistencyEvent = {
  id: string
  type: ConsistencyEventType
  timestamp: string
  points: number
}

export type WeighInSkipReason = 'today' | 'until_home' | 'not_now'

export type WeighInState = {
  asked: boolean
  logged: boolean
  weight?: number
  skipped?: WeighInSkipReason
  deferUntilHome: boolean
}

export type NutritionDayState = {
  proteinGrams: number
  waterOz: number
}

export type DaySnapshot = {
  momentumScore: number
  momentumPossible: number
  tasksCompleted: number
  tasksTotal: number
  dayMode: DayModeId
  mood?: string
  updatedAt: string
}

export type DayRecord = {
  dateKey: string
  timezone: string
  dayMode: DayMode
  /** @deprecated synced from dayMode.mode */
  dayType: DayModeId
  /** @deprecated synced from dayMode.source */
  dayTypeSource: DayModeSource
  consistencyEvents: ConsistencyEvent[]
  weighIn: WeighInState
  nutrition: NutritionDayState
  flowStep: FlowStepId
  flowCompleted: boolean
  detectedSignals: string[]
  notes?: string
  guidedFlow?: GuidedFlowState
  snapshot?: DaySnapshot
  createdAt: string
  updatedAt: string
}

export type DailyRecordsStore = {
  records: Record<string, DayRecord>
  homeTimezone: string
  lastKnownTimezone: string
  achievedMilestones: MilestoneId[]
  lifeEngineSettings: LifeEngineSettings
}

export type ModeInferenceResult = {
  mode: DayModeId
  confidence: number
  signals: string[]
  reason: string
}

export type ModeJourneyConfig = {
  label: string
  focus: string
  journeyItems: string[]
  nextAction: { title: string; body: string }
  hideWeighIn: boolean
  hideWorkoutPressure: boolean
  skipOptionalTasks: boolean
}

export type MilestoneId =
  | 'first_weigh_in'
  | 'lost_first_pound'
  | 'lost_5_pounds'
  | 'lost_10_pounds'
  | 'goal_weight'
  | 'consistent_7_days'
  | 'consistent_30_days'
  | 'consistent_100_days'
  | 'workout_pr'
  | 'study_milestone'
  | 'debt_milestone'
  | 'savings_milestone'

export type MilestoneDefinition = {
  id: MilestoneId
  title: string
  description: string
}

export const CONFIDENCE_AUTO_THRESHOLD = 90

export const MODE_PROMPT_OPTIONS: { mode: DayModeId; label: string }[] = [
  { mode: 'normal', label: 'Normal Day' },
  { mode: 'busy_workday', label: 'Busy Workday' },
  { mode: 'travel', label: 'Traveling' },
  { mode: 'vacation', label: 'Vacation' },
  { mode: 'sick', label: 'Sick' },
  { mode: 'recovery', label: 'Recovery' },
]
