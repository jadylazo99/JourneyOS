import { PETS_STORAGE_KEY } from './constants'
import type { PetsStoreData } from './types'

export function emptyPetsStore(): PetsStoreData {
  return { tasks: {}, notes: [], vacationState: {} }
}

export function loadPetsStore(): PetsStoreData {
  try {
    const raw = localStorage.getItem(PETS_STORAGE_KEY)
    if (!raw) return emptyPetsStore()
    return { ...emptyPetsStore(), ...JSON.parse(raw) }
  } catch {
    return emptyPetsStore()
  }
}

export function savePetsStore(store: PetsStoreData): void {
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(store))
}
