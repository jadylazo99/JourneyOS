import { create } from 'zustand'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { getLocalDateKey } from '@/modules/daily/date'
import { getRollingConsistencyScore } from '@/modules/daily/consistency'
import { loadDailyStore } from '@/modules/daily/storage'
import { parseWeightExact } from '@/utils/weight'
import { getStartWeight } from '@/modules/weight/calculations'
import { loadWeightStore } from '@/modules/weight/storage'
import { useWeightStore } from '@/modules/weight/store'
import { ACHIEVEMENTS, getAchievementDef } from './definitions'
import { checkWeightAchievements } from './engine'
import { checkFitnessAchievements } from '@/modules/fitness/achievements'
import { checkConsistencyAchievements } from './consistency'
import { getTimelineMessage } from './messages'
import {
  isUnlocked,
  loadAchievementStore,
  saveAchievementStore,
  sortTimeline,
} from './storage'
import type {
  AchievementCategory,
  AchievementCelebration,
  AchievementDefinition,
  AchievementId,
  CelebrationPayload,
  TimelineEvent,
  UnlockedAchievement,
  TodayAchievementBanner,
  TimelineEventCategory,
} from './types'

interface AchievementStore {
  unlocked: UnlockedAchievement[]
  timeline: TimelineEvent[]
  pendingCelebrations: AchievementCelebration[]
  todayBanners: TodayAchievementBanner[]
  hydrated: boolean

  hydrate: () => void
  unlock: (id: AchievementId, date?: Date, showBanner?: boolean) => AchievementCelebration | null
  addLifeEvent: (event: {
    title: string
    description?: string
    icon?: string
    category?: TimelineEventCategory
    date?: Date
  }) => void
  processWeightLog: (currentWeight: number) => void
  processFitnessWorkout: (totalWorkouts: number) => void
  processConsistency: () => void
  seedFromOnboarding: () => void
  getByCategory: () => Record<AchievementCategory, AchievementDefinition[]>
  isAchievementUnlocked: (id: AchievementId) => boolean
  getTimeline: () => TimelineEvent[]
  dismissCelebration: () => void
  dismissNextCelebration: () => void
  dismissTodayBanner: (id: string) => void
}

function addTimelineEvent(
  timeline: TimelineEvent[],
  event: Omit<TimelineEvent, 'id'>,
): TimelineEvent[] {
  return sortTimeline([
    { ...event, id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
    ...timeline,
  ])
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  unlocked: [],
  timeline: [],
  pendingCelebrations: [],
  todayBanners: [],
  hydrated: false,

  hydrate: () => {
    const store = loadAchievementStore()
    set({
      unlocked: store.unlocked,
      timeline: sortTimeline(store.timeline),
      hydrated: true,
    })
    get().seedFromOnboarding()
  },

  seedFromOnboarding: () => {
    const data = loadOnboardingData()
    if (!data?.onboardingComplete) return

    const store = loadAchievementStore()
    let changed = false
    const now = new Date()

    if (!isUnlocked(store.unlocked, 'started_journey')) {
      const unlocked: UnlockedAchievement = {
        id: 'started_journey',
        unlockedAt: now.toISOString(),
        dateKey: getLocalDateKey(now),
      }
      store.unlocked.push(unlocked)
      store.timeline = addTimelineEvent(store.timeline, {
        type: 'system',
        title: 'Started JourneyOS',
        description: getTimelineMessage('started_journey', 'Your journey begins.'),
        dateKey: unlocked.dateKey,
        timestamp: unlocked.unlockedAt,
        icon: '🚀',
        achievementId: 'started_journey',
        category: 'journey',
      })
      changed = true
    }

    for (const pet of data.profile.pets.filter((p) => p.name)) {
      if (!store.timeline.some((t) => t.title === `${pet.name} Added`)) {
        store.timeline = addTimelineEvent(store.timeline, {
          type: 'life',
          title: `${pet.name} Added`,
          description: `${pet.type || 'Pet'} joined your journey.`,
          dateKey: getLocalDateKey(now),
          timestamp: now.toISOString(),
          icon: '🐾',
          category: 'pets',
        })
        changed = true
      }
    }

    const weightStore = loadWeightStore()
    if (weightStore.entries.length >= 1 && !isUnlocked(store.unlocked, 'first_weigh_in')) {
      const entry = weightStore.entries[weightStore.entries.length - 1]
      const ids = checkWeightAchievements({
        entries: weightStore.entries,
        startWeight: getStartWeight(
          weightStore.entries,
          parseWeightExact(data.profile.currentWeight),
        ),
        currentWeight: entry.weight,
        goalWeight: parseWeightExact(data.profile.goalWeight),
        unlocked: store.unlocked.map((u) => u.id),
      })
      for (const id of ids) {
        const def = getAchievementDef(id)
        if (!def) continue
        store.unlocked.push({
          id,
          unlockedAt: entry.createdAt,
          dateKey: entry.dateKey,
        })
        store.timeline = addTimelineEvent(store.timeline, {
          type: 'achievement',
          title: def.title,
          description: getTimelineMessage(id, def.description),
          dateKey: entry.dateKey,
          timestamp: entry.createdAt,
          achievementId: id,
          icon: def.icon,
          category: def.category,
        })
        changed = true
      }
    }

    if (changed) {
      saveAchievementStore(store)
      set({ unlocked: store.unlocked, timeline: store.timeline })
    }
  },

  unlock: (id, date = new Date(), showBanner = true) => {
    if (get().isAchievementUnlocked(id)) return null

    const def = getAchievementDef(id)
    if (!def) return null

    const unlocked: UnlockedAchievement = {
      id,
      unlockedAt: date.toISOString(),
      dateKey: getLocalDateKey(date),
    }

    const store = loadAchievementStore()
    store.unlocked.push(unlocked)
    store.timeline = addTimelineEvent(store.timeline, {
      type: 'achievement',
      title: def.title,
      description: getTimelineMessage(id, def.description),
      dateKey: unlocked.dateKey,
      timestamp: unlocked.unlockedAt,
      achievementId: id,
      icon: def.icon,
      category: def.category,
    })
    saveAchievementStore(store)

    const celebration: AchievementCelebration = {
      type: 'achievement',
      achievementId: id,
      title: def.title,
      description: getTimelineMessage(id, def.description),
      icon: def.icon,
    }

    const banner: TodayAchievementBanner = {
      ...celebration,
      id: `banner-${Date.now()}`,
      dateKey: unlocked.dateKey,
    }

    set({
      unlocked: store.unlocked,
      timeline: store.timeline,
      todayBanners: showBanner
        ? [...get().todayBanners, banner]
        : get().todayBanners,
    })

    return celebration
  },

  addLifeEvent: (event) => {
    const date = event.date ?? new Date()
    const dateKey = getLocalDateKey(date)
    const title = event.title

    if (get().timeline.some((t) => t.title === title && t.dateKey === dateKey)) {
      return
    }

    const store = loadAchievementStore()
    store.timeline = addTimelineEvent(store.timeline, {
      type: 'life',
      title,
      description: event.description,
      dateKey,
      timestamp: date.toISOString(),
      icon: event.icon,
      category: event.category ?? 'life',
    })
    saveAchievementStore(store)
    set({ timeline: store.timeline })
  },

  processWeightLog: (currentWeight) => {
    const weightStore = loadWeightStore()
    const data = loadOnboardingData()
    const goalWeight = parseWeightExact(data?.profile.goalWeight ?? '')
    const onboardingStart = parseWeightExact(data?.profile.currentWeight ?? '')
    const startWeight = getStartWeight(weightStore.entries, onboardingStart)

    const ids = checkWeightAchievements({
      entries: weightStore.entries,
      startWeight,
      currentWeight,
      goalWeight,
      unlocked: get().unlocked.map((u) => u.id),
    })

    for (const id of ids) {
      get().unlock(id)
    }
  },

  processFitnessWorkout: (totalWorkouts) => {
    const ids = checkFitnessAchievements(
      totalWorkouts,
      get().unlocked.map((u) => u.id),
    )
    for (const id of ids) {
      get().unlock(id)
    }
  },

  processConsistency: () => {
    const store = loadDailyStore()
    const records = Object.values(store.records)
    const activeDays = records.filter((r) => r.consistencyEvents.length > 0).length
    const rolling = getRollingConsistencyScore(records, 7)

    const ids = checkConsistencyAchievements(
      activeDays,
      rolling,
      get().unlocked.map((u) => u.id),
    )
    for (const id of ids) {
      get().unlock(id)
    }
  },

  getByCategory: () => {
    const grouped = {} as Record<AchievementCategory, AchievementDefinition[]>
    for (const a of ACHIEVEMENTS) {
      if (!grouped[a.category]) grouped[a.category] = []
      grouped[a.category].push(a)
    }
    return grouped
  },

  isAchievementUnlocked: (id) => isUnlocked(get().unlocked, id),

  getTimeline: () => get().timeline,

  dismissCelebration: () =>
    set((state) => ({ pendingCelebrations: state.pendingCelebrations.slice(1) })),

  dismissNextCelebration: () => get().dismissCelebration(),

  dismissTodayBanner: (id) =>
    set((state) => ({
      todayBanners: state.todayBanners.filter((b) => b.id !== id),
    })),
}))

export function getActiveCelebration(): CelebrationPayload | null {
  const weight = useWeightStore.getState().pendingCelebration
  if (weight) return weight
  return null
}

export function dismissActiveCelebration(): void {
  const weight = useWeightStore.getState().pendingCelebration
  if (weight) {
    useWeightStore.getState().dismissCelebration()
  }
}

/** @deprecated use dismissActiveCelebration */
export function dismissAllCelebrations(): void {
  dismissActiveCelebration()
}
