import type { DayModeId } from '../types'
import type { GuidedTaskType } from './types'

type WeightMap = Partial<Record<GuidedTaskType, number>>

const NORMAL_WEIGHTS: WeightMap = {
  workout: 30,
  protein: 20,
  water: 15,
  hydration: 15,
  pet_walk: 15,
  pet_evening: 15,
  breakfast: 10,
  lunch: 10,
  dinner: 10,
  movement: 10,
  reflection: 10,
  weigh_in: 10,
  work_block: 5,
  check_in: 10,
  study: 20,
}

const VACATION_WEIGHTS: WeightMap = {
  walking_goal: 35,
  hydration: 25,
  protein: 20,
  photo_memory: 10,
  enjoy: 5,
  reflection: 10,
  water: 15,
}

const SICK_WEIGHTS: WeightMap = {
  rest: 30,
  water: 25,
  hydration: 25,
  medication: 15,
  sleep: 20,
  check_in: 10,
}

const BUSY_WEIGHTS: WeightMap = {
  water: 20,
  hydration: 20,
  lunch: 25,
  movement: 20,
  dinner: 15,
  reflection: 20,
}

const REST_WEIGHTS: WeightMap = {
  walking_goal: 25,
  water: 20,
  reflection: 20,
  check_in: 15,
  pet_walk: 15,
}

export function getTaskPoints(dayMode: DayModeId, type: GuidedTaskType): number {
  let map = NORMAL_WEIGHTS
  if (dayMode === 'vacation' || dayMode === 'travel') map = VACATION_WEIGHTS
  else if (dayMode === 'sick') map = SICK_WEIGHTS
  else if (dayMode === 'busy_workday') map = BUSY_WEIGHTS
  else if (dayMode === 'rest' || dayMode === 'recovery') map = REST_WEIGHTS

  return map[type] ?? NORMAL_WEIGHTS[type] ?? 10
}

export function pointsForStatus(maxPoints: number, status: string): number {
  if (status === 'completed') return maxPoints
  if (status === 'short') return Math.round(maxPoints * 0.65)
  return 0
}
