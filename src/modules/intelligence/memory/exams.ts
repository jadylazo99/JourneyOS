import type { StudyPreferences } from '@/modules/onboarding/types'

export type UpcomingExam = {
  id: string
  name: string
  date: string
  daysUntil: number
}

export function getUpcomingExams(
  study: StudyPreferences,
  now = new Date(),
): UpcomingExam[] {
  const todayKey = formatDateKey(now)
  return study.examDates
    .filter((e) => e.date >= todayKey)
    .map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date,
      daysUntil: daysBetween(todayKey, e.date),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export function getNextExam(
  study: StudyPreferences,
  now = new Date(),
): UpcomingExam | null {
  return getUpcomingExams(study, now)[0] ?? null
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(fromKey: string, toKey: string): number {
  const from = new Date(fromKey + 'T12:00:00')
  const to = new Date(toKey + 'T12:00:00')
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
}

export function examCountdownLabel(exam: UpcomingExam): string {
  if (exam.daysUntil === 0) return `${exam.name} is today`
  if (exam.daysUntil === 1) return `${exam.name} is tomorrow`
  return `${exam.name} in ${exam.daysUntil} days`
}
