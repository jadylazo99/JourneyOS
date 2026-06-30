import { create } from 'zustand'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { parseWeightExact } from '@/utils/weight'
import { getLocalDateKey } from '@/modules/daily/date'
import {
  computeWeightProgress,
  getLatestEntry,
  getNewlyReachedMilestones,
  getNextMilestone,
  getStartWeight,
  getChartData,
  buildMilestoneList,
} from './calculations'
import { loadWeightStore, saveWeightStore, sortEntries } from './storage'
import type {
  WeightEntry,
  WeightProgress,
  NextMilestoneInfo,
  WeightCelebration,
  WeightUnit,
} from './types'

interface WeightStore {
  entries: WeightEntry[]
  celebratedMilestones: number[]
  pendingCelebration: WeightCelebration | null
  hydrated: boolean

  hydrate: () => void
  addEntry: (weight: number, unit?: WeightUnit, notes?: string) => WeightCelebration | null
  getProgress: () => WeightProgress
  getNextMilestoneInfo: () => NextMilestoneInfo | null
  getMilestones: () => ReturnType<typeof buildMilestoneList>
  getChartPoints: () => ReturnType<typeof getChartData>
  dismissCelebration: () => void
}

function getGoalWeight(): number | null {
  const data = loadOnboardingData()
  return parseWeightExact(data?.profile.goalWeight ?? '')
}

function getOnboardingStart(): number | null {
  const data = loadOnboardingData()
  return parseWeightExact(data?.profile.currentWeight ?? '')
}

function buildCelebration(
  milestoneTarget: number,
  startWeight: number,
  isFirst: boolean,
): WeightCelebration {
  const poundsLost = startWeight - milestoneTarget
  return {
    type: 'milestone',
    poundsLost,
    milestoneTarget,
    isFirstMilestone: isFirst,
    title: 'Congratulations!',
    message: isFirst
      ? `You've officially lost ${poundsLost} pounds.\nThat's your first milestone.\nKeep going.`
      : `You've officially lost ${poundsLost} pounds.\nKeep going — you're building momentum.`,
  }
}

export const useWeightStore = create<WeightStore>((set, get) => ({
  entries: [],
  celebratedMilestones: [],
  pendingCelebration: null,
  hydrated: false,

  hydrate: () => {
    const store = loadWeightStore()
    let entries = sortEntries(store.entries)

    if (entries.length === 0) {
      const onboardingStart = getOnboardingStart()
      if (onboardingStart != null) {
        const now = new Date()
        const entry: WeightEntry = {
          id: `seed-${Date.now()}`,
          dateKey: getLocalDateKey(now),
          time: now.toTimeString().slice(0, 5),
          weight: onboardingStart,
          unit: 'lb',
          notes: 'Starting weight from onboarding',
          createdAt: now.toISOString(),
        }
        entries = [entry]
        store.entries = entries
        saveWeightStore(store)
      }
    }

    set({
      entries,
      celebratedMilestones: store.celebratedMilestones ?? [],
      hydrated: true,
    })
  },

  addEntry: (weight, unit = 'lb', notes) => {
    const now = new Date()
    const previous = getLatestEntry(get().entries)
    const previousWeight = previous?.weight ?? getOnboardingStart() ?? weight

    const entry: WeightEntry = {
      id: `w-${Date.now()}`,
      dateKey: getLocalDateKey(now),
      time: now.toTimeString().slice(0, 5),
      weight,
      unit,
      notes,
      createdAt: now.toISOString(),
    }

    const store = loadWeightStore()
    store.entries = sortEntries([...store.entries, entry])

    const startWeight = getStartWeight(store.entries, getOnboardingStart())
    const goalWeight = getGoalWeight()
    let celebration: WeightCelebration | null = null

    if (startWeight != null && goalWeight != null) {
      const newlyReached = getNewlyReachedMilestones(
        startWeight,
        goalWeight,
        previousWeight,
        weight,
        store.celebratedMilestones ?? [],
      )

      if (newlyReached.length > 0) {
        const target = newlyReached[0]
        const isFirst = (store.celebratedMilestones ?? []).length === 0
        celebration = buildCelebration(target, startWeight, isFirst)
        store.celebratedMilestones = [...(store.celebratedMilestones ?? []), target]
      }
    }

    saveWeightStore(store)
    set({
      entries: store.entries,
      celebratedMilestones: store.celebratedMilestones ?? [],
      pendingCelebration: celebration,
    })

    return celebration
  },

  getProgress: () =>
    computeWeightProgress(get().entries, getGoalWeight(), getOnboardingStart()),

  getNextMilestoneInfo: () => {
    const progress = get().getProgress()
    if (
      progress.startWeight == null ||
      progress.currentWeight == null ||
      progress.goalWeight == null
    ) {
      return null
    }
    return getNextMilestone(
      progress.startWeight,
      progress.currentWeight,
      progress.goalWeight,
    )
  },

  getMilestones: () => {
    const progress = get().getProgress()
    if (
      progress.startWeight == null ||
      progress.currentWeight == null ||
      progress.goalWeight == null
    ) {
      return []
    }
    return buildMilestoneList(
      progress.startWeight,
      progress.goalWeight,
      progress.currentWeight,
    )
  },

  getChartPoints: () => getChartData(get().entries),

  dismissCelebration: () => set({ pendingCelebration: null }),
}))
