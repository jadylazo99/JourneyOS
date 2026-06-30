import { DAY_MODE_LABELS } from '@/modules/daily/constants'
import { getConsistencyHighlights, getDayConsistencyScore } from '@/modules/daily/consistency'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadAchievementStore } from '@/modules/achievements/storage'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { loadFitnessStore } from '@/modules/fitness/storage'
import { loadPetsStore } from '@/modules/pets/storage'
import { loadWeightStore } from '@/modules/weight/storage'
import { useNutritionStore } from '@/modules/nutrition/store'
import type { DayDetails } from './types'

function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getDayDetails(dateKey: string): DayDetails | null {
  const dailyStore = loadDailyStore()
  const record = dailyStore.records[dateKey]
  const profile = loadOnboardingData()?.profile

  if (!record && !profile) return null

  const achievements = loadAchievementStore().timeline.filter(
    (e) => e.dateKey === dateKey,
  )

  const weightStore = loadWeightStore()
  const weightEntry = weightStore.entries.find((e) => e.dateKey === dateKey)
  const recordWeight = record?.weighIn.logged ? record.weighIn.weight : undefined

  const fitnessStore = loadFitnessStore()
  const completedWorkout = fitnessStore.completedWorkouts.find(
    (w) => w.dateKey === dateKey,
  )
  const skip =
    fitnessStore.todaySkip?.dateKey === dateKey ? fitnessStore.todaySkip : null

  let workout: DayDetails['workout'] = null
  if (completedWorkout) {
    workout = { completed: true, skipped: false, title: completedWorkout.title }
  } else if (skip) {
    workout = {
      completed: false,
      skipped: true,
      message: skip.message,
    }
  }

  const petsStore = loadPetsStore()
  const petTasks = petsStore.tasks[dateKey] ?? []

  let meals: DayDetails['meals'] = null
  if (
    profile &&
    isModuleEnabled(profile, 'nutrition') &&
    record
  ) {
    useNutritionStore.getState().hydrate()
    const summary = useNutritionStore.getState().getTodaySummary(
      record.nutrition?.proteinGrams ?? 0,
      record.nutrition?.waterOz ?? 0,
    )
    if (summary) {
      meals = {
        breakfast: summary.breakfast ?? undefined,
        lunchReminder: summary.lunchReminder ?? undefined,
        dinnerIdea: summary.dinnerIdea ?? undefined,
      }
    }
  }

  const mode = record?.dayMode.mode ?? 'normal'

  return {
    dateKey,
    displayDate: formatDisplayDate(dateKey),
    dayMode: mode,
    dayModeLabel: DAY_MODE_LABELS[mode] ?? mode,
    momentumScore: record?.snapshot?.momentumScore ?? (record ? getDayConsistencyScore(record) : 0),
    weight: weightEntry?.weight ?? recordWeight,
    weightLogged: !!(weightEntry || record?.weighIn.logged),
    workout,
    waterOz: record?.nutrition?.waterOz ?? 0,
    proteinGrams: record?.nutrition?.proteinGrams ?? 0,
    notes: record?.notes,
    petTasks: profile && isModuleEnabled(profile, 'pets') ? petTasks : [],
    achievements,
    meals,
    highlights: record ? getConsistencyHighlights(record) : [],
    hasData: !!record,
  }
}
