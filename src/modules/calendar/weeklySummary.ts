import { getDayConsistencyScore } from '@/modules/daily/consistency'
import { getLocalDateKey } from '@/modules/daily/date'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadAchievementStore } from '@/modules/achievements/storage'
import { loadFitnessStore } from '@/modules/fitness/storage'
import { loadWeightStore } from '@/modules/weight/storage'
import { getDayStatus } from './status'
import type { WeeklySummary } from './types'

function dateKeyFromDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getWeekRange(weeksAgo = 0): { start: Date; end: Date; keys: string[] } {
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

  return { start, end, keys }
}

export function getWeeklySummaries(count = 4): WeeklySummary[] {
  const dailyStore = loadDailyStore()
  const fitnessStore = loadFitnessStore()
  const weightStore = loadWeightStore()
  const achievementStore = loadAchievementStore()

  return Array.from({ length: count }, (_, i) => {
    const { start, end, keys } = getWeekRange(i)
    const records = keys.map((k) => dailyStore.records[k]).filter(Boolean)

    const strongDays = keys.filter(
      (k) => getDayStatus(dailyStore.records[k], k) === 'strong',
    ).length

    const restDays = keys.filter((k) => {
      const mode = dailyStore.records[k]?.dayMode.mode
      return mode === 'rest' || mode === 'recovery' || mode === 'sick'
    }).length

    const scores = records.map((r) => getDayConsistencyScore(r!))
    const avgMomentum =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

    const workoutsCompleted = fitnessStore.completedWorkouts.filter((w) =>
      keys.includes(w.dateKey),
    ).length

    const weighIns = weightStore.entries.filter((e) =>
      keys.includes(e.dateKey),
    ).length

    const achievementsUnlocked = achievementStore.unlocked.filter((u) =>
      keys.includes(u.dateKey),
    ).length

    const weekLabel =
      i === 0
        ? 'This week'
        : i === 1
          ? 'Last week'
          : `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`

    return {
      weekLabel,
      startDateKey: dateKeyFromDate(start),
      endDateKey: dateKeyFromDate(end),
      strongDays,
      restDays,
      avgMomentum,
      workoutsCompleted,
      weighIns,
      achievementsUnlocked,
    }
  })
}

export function getCalendarMonthDays(year: number, month: number): string[] {
  const last = new Date(year, month + 1, 0)
  const keys: string[] = []

  for (let d = 1; d <= last.getDate(); d++) {
    keys.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    )
  }

  return keys
}

export function getMonthGridPadding(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isTodayKey(dateKey: string): boolean {
  return dateKey === getLocalDateKey()
}
