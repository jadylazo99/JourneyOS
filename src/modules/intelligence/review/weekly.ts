import { getDayConsistencyScore } from '@/modules/daily/consistency'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadAchievementStore } from '@/modules/achievements/storage'
import { loadFitnessStore } from '@/modules/fitness/storage'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { loadWeightStore } from '@/modules/weight/storage'
import { loadPetsStore } from '@/modules/pets/storage'
import type { WeeklyReview } from '../types'

function dateKeyFromDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getWeekRange(weeksAgo = 0): { start: Date; end: Date; keys: string[]; label: string } {
  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() - weeksAgo * 7)

  const start = new Date(end)
  start.setDate(start.getDate() - 6)

  const keys: string[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    keys.push(dateKeyFromDate(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  const label =
    weeksAgo === 0
      ? 'This week'
      : weeksAgo === 1
        ? 'Last week'
        : `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`

  return { start, end, keys, label }
}

export function isSundayEvening(now = new Date()): boolean {
  return now.getDay() === 0 && now.getHours() >= 17
}

export function buildWeeklyReview(weeksAgo = 0): WeeklyReview {
  const { keys, label, start, end } = getWeekRange(weeksAgo)
  const daily = loadDailyStore()
  const fitness = loadFitnessStore()
  const weight = loadWeightStore()
  const achievements = loadAchievementStore()
  const pets = loadPetsStore()
  const profile = loadOnboardingData()?.profile
  const waterGoal = profile?.nutritionGoals.waterOz ?? 80
  const proteinGoal = profile?.nutritionGoals.protein ?? 150

  const records = keys.map((k) => daily.records[k]).filter(Boolean)

  let weightChange: number | null = null
  const weekWeights = keys
    .map((k) => weight.entries.find((e) => e.dateKey === k))
    .filter(Boolean)
  if (weekWeights.length >= 2) {
    const first = weekWeights[0]!
    const last = weekWeights[weekWeights.length - 1]!
    weightChange = Math.round((last.weight - first.weight) * 10) / 10
  }

  const workoutCount = fitness.completedWorkouts.filter((w) => keys.includes(w.dateKey)).length

  const waterDays = records.filter((r) => (r!.nutrition?.waterOz ?? 0) >= waterGoal * 0.7).length
  const proteinDays = records.filter((r) => (r!.nutrition?.proteinGrams ?? 0) >= proteinGoal * 0.7).length

  const scores = records.map((r) => getDayConsistencyScore(r!))
  const avgMomentum =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const achievementsUnlocked = achievements.unlocked.filter((u) => keys.includes(u.dateKey)).length

  const petTasksCompleted = keys.reduce((sum, k) => {
    const dayTasks = pets.tasks[k] ?? []
    return sum + dayTasks.filter((t) => t.status === 'completed').length
  }, 0)

  const highlights: string[] = []
  if (workoutCount >= 3) highlights.push(`${workoutCount} workouts completed`)
  if (waterDays >= 5) highlights.push('Strong hydration rhythm')
  if (achievementsUnlocked > 0) highlights.push(`${achievementsUnlocked} new achievements`)
  if (avgMomentum >= 70) highlights.push('Momentum stayed high')
  if (highlights.length === 0) highlights.push('Every day you showed up counts')

  return {
    weekLabel: label,
    startDateKey: dateKeyFromDate(start),
    endDateKey: dateKeyFromDate(end),
    weightChange,
    workoutCount,
    waterDays,
    proteinDays,
    avgMomentum,
    achievementsUnlocked,
    petTasksCompleted,
    highlights,
    isCurrentWeek: weeksAgo === 0,
  }
}

export function getWeeklyReviewCards(count = 2): WeeklyReview[] {
  return Array.from({ length: count }, (_, i) => buildWeeklyReview(i))
}

export function weeklyReviewId(review: WeeklyReview): string {
  return `weekly_${review.startDateKey}`
}
