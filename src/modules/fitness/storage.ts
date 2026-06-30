import { getLocalDateKey } from '@/modules/daily/date'
import type { CompletedWorkout, FitnessStoreData, PersonalRecord } from './types'

export function emptyFitnessStore(): FitnessStoreData {
  return {
    completedWorkouts: [],
    personalRecords: [],
    activeSession: null,
    todaySkip: null,
  }
}

export function loadFitnessStore(): FitnessStoreData {
  try {
    const raw = localStorage.getItem('journeyos_fitness')
    if (!raw) return emptyFitnessStore()
    return { ...emptyFitnessStore(), ...JSON.parse(raw) }
  } catch {
    return emptyFitnessStore()
  }
}

export function saveFitnessStore(store: FitnessStoreData): void {
  localStorage.setItem('journeyos_fitness', JSON.stringify(store))
}

export function computeWorkoutStreak(completed: CompletedWorkout[]): {
  current: number
  longest: number
} {
  if (completed.length === 0) return { current: 0, longest: 0 }

  const dates = [...new Set(completed.map((w) => w.dateKey))].sort()
  let longest = 1
  let current = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      current += 1
      longest = Math.max(longest, current)
    } else if (diff > 1) {
      current = 1
    }
  }

  const today = getLocalDateKey()
  const lastDate = dates[dates.length - 1]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = getLocalDateKey(yesterday)

  if (lastDate !== today && lastDate !== yesterdayKey) {
    current = lastDate === today ? current : 0
  }

  return { current, longest }
}

export function detectNewPRs(
  existing: PersonalRecord[],
  logs: CompletedWorkout['exerciseLogs'],
  dateKey: string,
  nameById: Record<string, string>,
): PersonalRecord[] {
  const newRecords: PersonalRecord[] = []

  for (const [id, log] of Object.entries(logs)) {
    if (!log.weightUsed?.trim()) continue
    const weightNum = parseFloat(log.weightUsed.replace(/[^\d.]/g, ''))
    if (isNaN(weightNum)) continue

    const name = nameById[id] ?? id
    const prev = existing.find((r) => r.exerciseName === name)
    const prevNum = prev ? parseFloat(prev.weight.replace(/[^\d.]/g, '')) : 0

    if (weightNum > prevNum) {
      newRecords.push({ exerciseName: name, weight: log.weightUsed, dateKey })
    }
  }

  return newRecords
}
