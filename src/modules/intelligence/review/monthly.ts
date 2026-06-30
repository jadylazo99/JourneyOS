import { getDayConsistencyScore } from '@/modules/daily/consistency'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadAchievementStore } from '@/modules/achievements/storage'
import { loadFitnessStore } from '@/modules/fitness/storage'
import { loadWeightStore } from '@/modules/weight/storage'
import type { MonthlyReview } from '../types'

function monthKeys(year: number, month: number): string[] {
  const last = new Date(year, month + 1, 0).getDate()
  const keys: string[] = []
  for (let d = 1; d <= last; d++) {
    keys.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    )
  }
  return keys
}

export function isEndOfMonth(now = new Date()): boolean {
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.getMonth() !== now.getMonth()
}

export function buildMonthlyReview(year: number, month: number): MonthlyReview {
  const keys = monthKeys(year, month)
  const daily = loadDailyStore()
  const fitness = loadFitnessStore()
  const weight = loadWeightStore()
  const achievements = loadAchievementStore()

  const monthWeights = keys
    .map((k) => weight.entries.find((e) => e.dateKey === k))
    .filter(Boolean)

  const weightChartPoints = monthWeights.map((e) => ({
    dateKey: e!.dateKey,
    weight: e!.weight,
  }))

  const weightStart = monthWeights[0]?.weight ?? null
  const weightEnd = monthWeights[monthWeights.length - 1]?.weight ?? null
  const weightChange =
    weightStart !== null && weightEnd !== null
      ? Math.round((weightEnd - weightStart) * 10) / 10
      : null

  const workoutsCompleted = fitness.completedWorkouts.filter((w) => keys.includes(w.dateKey)).length

  const records = keys.map((k) => daily.records[k]).filter(Boolean)
  const scores = records.map((r) => getDayConsistencyScore(r!))
  const avgMomentum =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const strongDays = scores.filter((s) => s >= 75).length
  const consistencyScore =
    keys.length > 0 ? Math.round((strongDays / keys.length) * 100) : 0

  const achievementsUnlocked = achievements.unlocked.filter((u) => keys.includes(u.dateKey)).length

  let photoMemories = 0
  for (const k of keys) {
    const tasks = daily.records[k]?.guidedFlow?.tasks ?? []
    photoMemories += tasks.filter(
      (t) => t.type === 'photo_memory' && t.status === 'completed',
    ).length
  }

  const weighInCount = monthWeights.length

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const milestones: string[] = []
  if (workoutsCompleted >= 12) milestones.push(`${workoutsCompleted} workouts`)
  if (achievementsUnlocked >= 3) milestones.push(`${achievementsUnlocked} achievements`)
  if (weightChange !== null && weightChange !== 0) {
    milestones.push(
      weightChange < 0 ? `${Math.abs(weightChange)} lb progress` : `${weightChange} lb change`,
    )
  }

  const summaryParts: string[] = []
  if (avgMomentum >= 65) summaryParts.push('You kept steady momentum')
  else summaryParts.push('You navigated real life with grace')
  if (workoutsCompleted > 0) summaryParts.push(`${workoutsCompleted} workouts logged`)
  if (achievementsUnlocked > 0) summaryParts.push(`${achievementsUnlocked} badges earned`)

  return {
    monthLabel,
    year,
    month,
    weightStart,
    weightEnd,
    weightChange,
    weightChartPoints,
    workoutsCompleted,
    avgMomentum,
    achievementsUnlocked,
    strongDays,
    consistencyScore,
    photoMemories,
    weighInCount,
    milestones,
    summary: summaryParts.join(' · ') || 'Your journey continues — one day at a time.',
  }
}

export function getCurrentMonthlyReview(now = new Date()): MonthlyReview {
  return buildMonthlyReview(now.getFullYear(), now.getMonth())
}

export function getPreviousMonthlyReview(now = new Date()): MonthlyReview {
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return buildMonthlyReview(d.getFullYear(), d.getMonth())
}

export function monthlyReviewId(review: MonthlyReview): string {
  return `monthly_${review.year}_${review.month + 1}`
}
