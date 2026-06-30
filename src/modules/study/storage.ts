import { getLocalDateKey } from '@/modules/daily/date'
import { STUDY_STORAGE_KEY } from './types'
import type { StudySession, StudyStoreData, StudyProgressStats } from './types'

export function emptyStudyStore(): StudyStoreData {
  const todayKey = getLocalDateKey()
  return {
    studyingFor: '',
    examDate: '',
    dailyGoalMinutes: 30,
    minutesStudiedToday: 0,
    todayDateKey: todayKey,
    latestPracticeScore: null,
    practiceTestDate: '',
    notes: '',
    streak: 0,
    totalMinutes: 0,
    lastStudiedDateKey: '',
    sessions: [],
  }
}

export function loadStudyStore(): StudyStoreData {
  try {
    const raw = localStorage.getItem(STUDY_STORAGE_KEY)
    if (!raw) return emptyStudyStore()
    return { ...emptyStudyStore(), ...JSON.parse(raw) } as StudyStoreData
  } catch {
    return emptyStudyStore()
  }
}

export function saveStudyStore(data: StudyStoreData): void {
  localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(data))
}

function getWeekStartKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const day = date.getDay()
  date.setDate(date.getDate() - day)
  return getLocalDateKey(date)
}

export function computeStudyProgress(data: StudyStoreData): StudyProgressStats {
  const todayKey = getLocalDateKey()
  const weekStart = getWeekStartKey(todayKey)
  const minutesToday =
    data.todayDateKey === todayKey ? data.minutesStudiedToday : 0

  const minutesThisWeek = data.sessions
    .filter((s) => s.dateKey >= weekStart && s.dateKey <= todayKey)
    .reduce((sum, s) => sum + s.minutes, 0)

  return {
    minutesThisWeek,
    totalMinutes: data.totalMinutes,
    latestPracticeScore: data.latestPracticeScore,
    streak: data.streak,
    minutesToday,
    dailyGoalMinutes: data.dailyGoalMinutes,
  }
}

export function createStudySession(
  minutes: number,
  options?: { notes?: string; practiceScore?: number },
): StudySession {
  const now = new Date()
  return {
    id: `study-${Date.now()}`,
    dateKey: getLocalDateKey(now),
    minutes,
    notes: options?.notes,
    practiceScore: options?.practiceScore,
    timestamp: now.toISOString(),
  }
}

export function updateStreak(
  streak: number,
  lastStudiedDateKey: string,
  todayKey: string,
): number {
  if (!lastStudiedDateKey) return 1
  if (lastStudiedDateKey === todayKey) return streak

  const last = new Date(lastStudiedDateKey)
  const today = new Date(todayKey)
  const diffDays = Math.round(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays === 1) return streak + 1
  if (diffDays === 0) return streak
  return 1
}
