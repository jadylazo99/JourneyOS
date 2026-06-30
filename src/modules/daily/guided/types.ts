import type { DayModeId } from '../types'
import type { DayPhase } from '../schedule'

export type GuidedTaskType =
  | 'weigh_in'
  | 'water'
  | 'pet_walk'
  | 'pet_evening'
  | 'breakfast'
  | 'work_block'
  | 'lunch'
  | 'movement'
  | 'workout'
  | 'dinner'
  | 'reflection'
  | 'walking_goal'
  | 'hydration'
  | 'protein'
  | 'photo_memory'
  | 'enjoy'
  | 'rest'
  | 'medication'
  | 'sleep'
  | 'check_in'
  | 'study'

export type GuidedTaskStatus =
  | 'pending'
  | 'completed'
  | 'skipped'
  | 'rescheduled'
  | 'short'
  | 'not_needed'

export type GuidedTask = {
  id: string
  type: GuidedTaskType
  title: string
  subtitle?: string
  message: string
  status: GuidedTaskStatus
  maxPoints: number
  earnedPoints: number
  actionLabel: string
  link?: string
  phase?: DayPhase | 'any'
}

export type GuidedFlowState = {
  tasks: GuidedTask[]
  generationMode: DayModeId
}

export type GuidedTaskAction = {
  status: GuidedTaskStatus
  label: string
  message: string
}

export const GUIDED_TASK_ACTIONS: GuidedTaskAction[] = [
  { status: 'completed', label: 'Complete', message: 'Nice work — momentum builds quietly.' },
  { status: 'skipped', label: 'Skip today', message: 'No problem. Today adapts to you.' },
  { status: 'rescheduled', label: 'Reschedule', message: 'Moved to later. Still counts as planning ahead.' },
  { status: 'short', label: 'Short version', message: 'A lighter version still counts.' },
  { status: 'not_needed', label: 'Not needed', message: 'Got it — not every task fits every day.' },
]

export type MomentumSummary = {
  score: number
  possible: number
  completedCount: number
  totalCount: number
}
