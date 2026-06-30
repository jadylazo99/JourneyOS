import { create } from 'zustand'
import { getLocalDateKey } from '@/modules/daily/date'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { useAchievementStore } from '@/modules/achievements/store'
import { addConsistencyEvent } from '@/modules/daily/consistency'
import { completeGuidedWorkoutTask } from '@/modules/daily/guided/sync'
import { recordIntelligenceObservation } from '@/modules/intelligence'
import { loadDailyStore, saveDailyStore } from '@/modules/daily/storage'
import { getTodayAdaptiveWorkout } from './adaptive'
import {
  computeWorkoutStreak,
  detectNewPRs,
  loadFitnessStore,
  saveFitnessStore,
} from './storage'
import type {
  AdaptiveWorkoutResult,
  ExerciseLogState,
  FitnessProgressStats,
  WorkoutActiveSession,
  WorkoutSkipReason,
} from './types'
import type { DayModeId } from '@/modules/daily/types'

interface FitnessStore {
  completedWorkouts: ReturnType<typeof loadFitnessStore>['completedWorkouts']
  personalRecords: ReturnType<typeof loadFitnessStore>['personalRecords']
  activeSession: WorkoutActiveSession | null
  todaySkip: ReturnType<typeof loadFitnessStore>['todaySkip']
  hydrated: boolean

  hydrate: () => void
  getTodayWorkout: (dayMode?: DayModeId) => AdaptiveWorkoutResult | null
  startSession: (workout: AdaptiveWorkoutResult) => void
  updateExercise: (exerciseId: string, partial: Partial<ExerciseLogState>) => void
  toggleExercise: (exerciseId: string) => void
  completeWorkout: () => void
  skipWorkout: (reason: WorkoutSkipReason) => void
  applyShortVersion: () => void
  getProgressStats: () => FitnessProgressStats
  isFitnessEnabled: () => boolean
  isTodayCompleted: () => boolean
}

function initExerciseStates(
  workout: AdaptiveWorkoutResult,
): Record<string, ExerciseLogState> {
  return Object.fromEntries(
    workout.exercises.map((e) => [
      e.id,
      { completed: false, weightUsed: '', notes: '' },
    ]),
  )
}

export const useFitnessStore = create<FitnessStore>((set, get) => ({
  completedWorkouts: [],
  personalRecords: [],
  activeSession: null,
  todaySkip: null,
  hydrated: false,

  hydrate: () => {
    const store = loadFitnessStore()
    const todayKey = getLocalDateKey()

    if (store.todaySkip && store.todaySkip.dateKey !== todayKey) {
      store.todaySkip = null
      saveFitnessStore(store)
    }

    if (store.activeSession && store.activeSession.dateKey !== todayKey) {
      store.activeSession = null
      saveFitnessStore(store)
    }

    set({
      completedWorkouts: store.completedWorkouts,
      personalRecords: store.personalRecords,
      activeSession: store.activeSession,
      todaySkip: store.todaySkip,
      hydrated: true,
    })
  },

  getTodayWorkout: (dayMode = 'normal') => getTodayAdaptiveWorkout(dayMode),

  startSession: (workout) => {
    const todayKey = getLocalDateKey()
    const session: WorkoutActiveSession = {
      dateKey: todayKey,
      workoutId: workout.plan?.id ?? `custom-${todayKey}`,
      variant: workout.variant,
      title: workout.title,
      exerciseStates: initExerciseStates(workout),
    }
    const store = loadFitnessStore()
    store.activeSession = session
    store.todaySkip = null
    saveFitnessStore(store)
    set({ activeSession: session, todaySkip: null })
  },

  updateExercise: (exerciseId, partial) => {
    const session = get().activeSession
    if (!session) return
    const exerciseStates = {
      ...session.exerciseStates,
      [exerciseId]: { ...session.exerciseStates[exerciseId], ...partial },
    }
    const updated = { ...session, exerciseStates }
    const store = loadFitnessStore()
    store.activeSession = updated
    saveFitnessStore(store)
    set({ activeSession: updated })
  },

  toggleExercise: (exerciseId) => {
    const session = get().activeSession
    if (!session) return
    const current = session.exerciseStates[exerciseId]
    get().updateExercise(exerciseId, { completed: !current?.completed })
  },

  completeWorkout: () => {
    const session = get().activeSession
    if (!session) return

    const todayKey = getLocalDateKey()
    const completedCount = Object.values(session.exerciseStates).filter(
      (e) => e.completed,
    ).length
    const total = Object.keys(session.exerciseStates).length

    const completed = {
      id: `workout-${Date.now()}`,
      dateKey: todayKey,
      workoutId: session.workoutId,
      title: session.title,
      variant: session.variant,
      completedAt: new Date().toISOString(),
      estimatedMinutes: 0,
      exercisesCompleted: completedCount,
      exercisesTotal: total,
      exerciseLogs: session.exerciseStates,
    }

    const store = loadFitnessStore()
    store.completedWorkouts.push(completed)
    store.activeSession = null

    const workout = get().getTodayWorkout()
    const nameById = Object.fromEntries(
      (workout?.exercises ?? []).map((e) => [e.id, e.name]),
    )

    const newPRs = detectNewPRs(
      store.personalRecords,
      session.exerciseStates,
      todayKey,
      nameById,
    )
    for (const pr of newPRs) {
      const idx = store.personalRecords.findIndex((r) => r.exerciseName === pr.exerciseName)
      if (idx >= 0) store.personalRecords[idx] = pr
      else store.personalRecords.push(pr)
    }

    saveFitnessStore(store)

    const dailyStore = loadDailyStore()
    const todayRecord = dailyStore.records[todayKey]
    if (todayRecord) {
      dailyStore.records[todayKey] = addConsistencyEvent(todayRecord, 'completed_workout')
      saveDailyStore(dailyStore)
    }

    useAchievementStore.getState().processFitnessWorkout(store.completedWorkouts.length)
    completeGuidedWorkoutTask()
    recordIntelligenceObservation('workout_completed', 'fitness', {
      hour: new Date().getHours(),
      workoutId: session.workoutId,
    })

    set({
      completedWorkouts: store.completedWorkouts,
      personalRecords: store.personalRecords,
      activeSession: null,
    })
  },

  skipWorkout: (reason) => {
    const todayKey = getLocalDateKey()
    const messages: Record<WorkoutSkipReason, string> = {
      short_version: 'Short version it is. You showed up.',
      reschedule: 'Rescheduled — tomorrow is open.',
      planned_skip: 'Planned skip. Rest is part of the plan.',
      walk_instead: 'A walk counts. Movement is movement.',
    }

    const store = loadFitnessStore()
    store.todaySkip = { dateKey: todayKey, reason, message: messages[reason] }
    store.activeSession = null
    saveFitnessStore(store)
    set({ todaySkip: store.todaySkip, activeSession: null })

    if (reason === 'walk_instead') {
      const dailyStore = loadDailyStore()
      const todayRecord = dailyStore.records[todayKey]
      if (todayRecord) {
        dailyStore.records[todayKey] = addConsistencyEvent(todayRecord, 'completed_workout')
        saveDailyStore(dailyStore)
      }
    }
  },

  applyShortVersion: () => {
    const workout = get().getTodayWorkout('busy_workday')
    if (workout) get().startSession(workout)
  },

  getProgressStats: () => {
    const completed = get().completedWorkouts
    const streak = computeWorkoutStreak(completed)
    const exercisesCompleted = completed.reduce((sum, w) => sum + w.exercisesCompleted, 0)
    return {
      totalWorkouts: completed.length,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      exercisesCompleted,
      personalRecords: get().personalRecords,
    }
  },

  isFitnessEnabled: () => {
    const data = loadOnboardingData()
    return data?.profile ? isModuleEnabled(data.profile, 'fitness') : false
  },

  isTodayCompleted: () => {
    const todayKey = getLocalDateKey()
    return get().completedWorkouts.some((w) => w.dateKey === todayKey)
  },
}))
