import { create } from 'zustand'
import { getLocalDateKey } from '@/modules/daily/date'
import {
  computeStudyProgress,
  createStudySession,
  emptyStudyStore,
  loadStudyStore,
  saveStudyStore,
  updateStreak,
} from './storage'
import type { StudyProgressStats, StudyStoreData } from './types'

interface StudyStore extends StudyStoreData {
  hydrated: boolean
  hydrate: () => void
  updateSettings: (
    partial: Partial<
      Pick<
        StudyStoreData,
        | 'studyingFor'
        | 'examDate'
        | 'dailyGoalMinutes'
        | 'notes'
        | 'latestPracticeScore'
        | 'practiceTestDate'
      >
    >,
  ) => void
  logSession: (minutes: number, options?: { notes?: string; practiceScore?: number }) => void
  getProgressStats: () => StudyProgressStats
}

function rollDailyState(data: StudyStoreData): StudyStoreData {
  const todayKey = getLocalDateKey()
  if (data.todayDateKey === todayKey) return data
  return { ...data, todayDateKey: todayKey, minutesStudiedToday: 0 }
}

function persist(data: StudyStoreData, set: (state: Partial<StudyStore>) => void) {
  saveStudyStore(data)
  set(data)
}

export const useStudyStore = create<StudyStore>((set) => ({
  ...emptyStudyStore(),
  hydrated: false,

  hydrate: () => {
    const data = rollDailyState(loadStudyStore())
    saveStudyStore(data)
    set({ ...data, hydrated: true })
  },

  updateSettings: (partial) => {
    const data = { ...rollDailyState(loadStudyStore()), ...partial }
    persist(data, set)
  },

  logSession: (minutes, options) => {
    if (minutes <= 0) return
    const todayKey = getLocalDateKey()
    let data = rollDailyState(loadStudyStore())
    const session = createStudySession(minutes, options)

    data.sessions = [session, ...data.sessions].slice(0, 500)
    data.minutesStudiedToday += minutes
    data.totalMinutes += minutes
    data.todayDateKey = todayKey
    data.streak = updateStreak(data.streak, data.lastStudiedDateKey, todayKey)
    data.lastStudiedDateKey = todayKey

    if (options?.notes) data.notes = options.notes
    if (options?.practiceScore != null) {
      data.latestPracticeScore = options.practiceScore
      data.practiceTestDate = todayKey
    }

    persist(data, set)
  },

  getProgressStats: () => computeStudyProgress(rollDailyState(loadStudyStore())),
}))
