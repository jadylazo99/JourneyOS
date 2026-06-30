import type { Pet } from '@/modules/onboarding/types'

export function createPetId(): string {
  return `pet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function emptyPet(partial?: Partial<Pet>): Pet {
  return {
    id: createPetId(),
    name: '',
    type: '',
    breed: '',
    birthday: '',
    weight: '',
    food: '',
    feedingSchedule: [],
    walkSchedule: [],
    trainingGoals: [],
    groomingSchedule: [],
    vetName: '',
    vetPhone: '',
    vaccineReminders: [],
    medications: [],
    notes: '',
    ...partial,
  }
}

export function normalizePet(stored: Partial<Pet> & { name: string; type: string }): Pet {
  const base = emptyPet({
    id: stored.id ?? createPetId(),
    name: stored.name ?? '',
    type: stored.type ?? '',
    breed: stored.breed,
    birthday: stored.birthday,
    weight: stored.weight,
    food: stored.food,
    vetName: stored.vetName,
    vetPhone: stored.vetPhone,
    notes: stored.notes ?? stored.dailyNeeds,
    feedingSchedule: stored.feedingSchedule ?? [],
    walkSchedule: stored.walkSchedule ?? [],
    trainingGoals: stored.trainingGoals ?? [],
    groomingSchedule: stored.groomingSchedule ?? [],
    vaccineReminders: stored.vaccineReminders ?? [],
    medications: stored.medications ?? [],
  })

  if (stored.dailyNeeds && !stored.notes) {
    base.notes = stored.dailyNeeds
  }

  return base
}
