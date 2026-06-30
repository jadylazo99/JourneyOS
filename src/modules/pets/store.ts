import { create } from 'zustand'
import { getLocalDateKey } from '@/modules/daily/date'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { useAchievementStore } from '@/modules/achievements/store'
import { checkPetAchievements } from './achievements'
import { computePetProgress, getTaskHistoryByDate } from './progress'
import { loadPetsStore, savePetsStore } from './storage'
import { generateAllPetTasks, generateHandoffTasks } from './tasks'
import type { DayModeId } from '@/modules/daily/types'
import type {
  PetNoteEntry,
  PetProgressStats,
  PetTask,
  PetTaskStatus,
  PetVacationState,
} from './types'

interface PetsStore {
  tasks: Record<string, PetTask[]>
  notes: PetNoteEntry[]
  vacationState: Record<string, PetVacationState>
  hydrated: boolean

  hydrate: () => void
  isPetsEnabled: () => boolean
  ensureTodayTasks: (dayMode?: DayModeId) => void
  getTodayTasks: () => PetTask[]
  getVacationState: () => PetVacationState | null
  setPetTraveling: (traveling: boolean) => void
  updateTaskStatus: (taskId: string, status: PetTaskStatus) => void
  addNote: (petId: string, petName: string, text: string) => void
  getProgressStats: (petId?: string) => PetProgressStats
  getNotesForPet: (petId: string) => PetNoteEntry[]
  getTaskHistory: (petId?: string, limit?: number) => { dateKey: string; tasks: PetTask[] }[]
}

function countWalkDays(tasks: Record<string, PetTask[]>): number {
  return new Set(
    Object.values(tasks)
      .flat()
      .filter((t) => t.type === 'walk' && t.status === 'completed')
      .map((t) => t.dateKey),
  ).size
}

export const usePetsStore = create<PetsStore>((set, get) => ({
  tasks: {},
  notes: [],
  vacationState: {},
  hydrated: false,

  hydrate: () => {
    const store = loadPetsStore()
    set({
      tasks: store.tasks,
      notes: store.notes,
      vacationState: store.vacationState,
      hydrated: true,
    })
  },

  isPetsEnabled: () => {
    const data = loadOnboardingData()
    return data ? isModuleEnabled(data.profile, 'pets') : false
  },

  ensureTodayTasks: (dayMode = 'normal') => {
    const data = loadOnboardingData()
    if (!data || !isModuleEnabled(data.profile, 'pets')) return

    const todayKey = getLocalDateKey()
    const store = loadPetsStore()
    const pets = data.profile.pets.filter((p) => p.name.trim())

    if (pets.length === 0) return

    if (!store.tasks[todayKey]) {
      if (dayMode === 'vacation') {
        const existing = store.vacationState[todayKey]
        if (!existing) {
          store.vacationState[todayKey] = {
            dateKey: todayKey,
            travelingWithUser: null,
            handoffChecklist: [],
          }
        } else if (existing.travelingWithUser === false) {
          store.tasks[todayKey] = pets.flatMap((pet) => generateHandoffTasks(pet))
        } else if (existing.travelingWithUser === true) {
          store.tasks[todayKey] = generateAllPetTasks(pets, dayMode)
        }
      } else {
        store.tasks[todayKey] = generateAllPetTasks(pets, dayMode)
      }
      savePetsStore(store)
      set({ tasks: store.tasks, vacationState: store.vacationState })
    }
  },

  getTodayTasks: () => {
    const todayKey = getLocalDateKey()
    return get().tasks[todayKey] ?? []
  },

  getVacationState: () => {
    const todayKey = getLocalDateKey()
    return get().vacationState[todayKey] ?? null
  },

  setPetTraveling: (traveling) => {
    const todayKey = getLocalDateKey()
    const data = loadOnboardingData()
    if (!data) return

    const store = loadPetsStore()
    const pets = data.profile.pets.filter((p) => p.name.trim())

    store.vacationState[todayKey] = {
      dateKey: todayKey,
      travelingWithUser: traveling,
      handoffChecklist: traveling
        ? []
        : pets.flatMap((pet) => generateHandoffTasks(pet)),
    }

    store.tasks[todayKey] = traveling
      ? generateAllPetTasks(pets, 'vacation')
      : store.vacationState[todayKey].handoffChecklist

    savePetsStore(store)
    set({ tasks: store.tasks, vacationState: store.vacationState })
  },

  updateTaskStatus: (taskId, status) => {
    const todayKey = getLocalDateKey()
    const store = loadPetsStore()
    const dayTasks = store.tasks[todayKey]
    if (!dayTasks) return

    const idx = dayTasks.findIndex((t) => t.id === taskId)
    if (idx === -1) return

    dayTasks[idx] = { ...dayTasks[idx], status }
    store.tasks[todayKey] = [...dayTasks]
    savePetsStore(store)
    set({ tasks: store.tasks })

    if (status === 'completed' && dayTasks[idx].type === 'walk') {
      const walkDays = countWalkDays(store.tasks)
      const achievementStore = useAchievementStore.getState()
      const newly = checkPetAchievements(
        walkDays,
        achievementStore.unlocked.map((u) => u.id),
      )
      for (const id of newly) {
        achievementStore.unlock(id)
      }
    }
  },

  addNote: (petId, petName, text) => {
    if (!text.trim()) return
    const todayKey = getLocalDateKey()
    const entry: PetNoteEntry = {
      id: `note-${Date.now()}`,
      petId,
      petName,
      text: text.trim(),
      dateKey: todayKey,
      timestamp: new Date().toISOString(),
    }
    const store = loadPetsStore()
    store.notes.unshift(entry)
    savePetsStore(store)
    set({ notes: store.notes })
  },

  getProgressStats: (petId) => computePetProgress(get().tasks, get().notes, petId),

  getNotesForPet: (petId) => get().notes.filter((n) => n.petId === petId),

  getTaskHistory: (petId, limit) =>
    getTaskHistoryByDate(get().tasks, petId, limit),
}))
