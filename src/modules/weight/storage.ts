import { WEIGHT_STORAGE_KEY } from './constants'
import type { WeightEntry, WeightStoreData } from './types'

export function emptyWeightStore(): WeightStoreData {
  return { entries: [], celebratedMilestones: [] }
}

export function loadWeightStore(): WeightStoreData {
  try {
    const raw = localStorage.getItem(WEIGHT_STORAGE_KEY)
    if (!raw) return emptyWeightStore()
    return { ...emptyWeightStore(), ...JSON.parse(raw) } as WeightStoreData
  } catch {
    return emptyWeightStore()
  }
}

export function saveWeightStore(data: WeightStoreData): void {
  localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(data))
}

export function sortEntries(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((a, b) => {
    const dateCompare = b.dateKey.localeCompare(a.dateKey)
    if (dateCompare !== 0) return dateCompare
    return b.time.localeCompare(a.time)
  })
}
