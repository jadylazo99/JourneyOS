export const STUDY_STORAGE_KEY = 'journeyos_study'

export type StudySession = {
  id: string
  dateKey: string
  minutes: number
  notes?: string
  practiceScore?: number
  timestamp: string
}

export type StudyStoreData = {
  studyingFor: string
  examDate: string
  dailyGoalMinutes: number
  minutesStudiedToday: number
  todayDateKey: string
  latestPracticeScore: number | null
  practiceTestDate: string
  notes: string
  streak: number
  totalMinutes: number
  lastStudiedDateKey: string
  sessions: StudySession[]
}

export type StudyProgressStats = {
  minutesThisWeek: number
  totalMinutes: number
  latestPracticeScore: number | null
  streak: number
  minutesToday: number
  dailyGoalMinutes: number
}
