import { ACHIEVEMENTS_STORAGE_KEY } from './constants'
import type { AchievementStoreData, TimelineEvent, UnlockedAchievement } from './types'

export function emptyAchievementStore(): AchievementStoreData {
  return { unlocked: [], timeline: [] }
}

export function loadAchievementStore(): AchievementStoreData {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
    if (!raw) return emptyAchievementStore()
    return { ...emptyAchievementStore(), ...JSON.parse(raw) } as AchievementStoreData
  } catch {
    return emptyAchievementStore()
  }
}

export function saveAchievementStore(data: AchievementStoreData): void {
  localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data))
}

export function sortTimeline(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function isUnlocked(unlocked: UnlockedAchievement[], id: string): boolean {
  return unlocked.some((a) => a.id === id)
}
