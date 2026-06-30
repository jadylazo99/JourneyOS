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

export const BRUNO_DEFAULTS: Partial<Pet> = {
  name: 'Bruno',
  type: 'Dog',
  breed: 'Goldendoodle',
  birthday: '2026-01-10',
  walkSchedule: [{ id: 'bruno-am-walk', label: 'Morning walk', time: '08:00' }],
  feedingSchedule: [
    { id: 'bruno-feed-am', label: 'Morning food', time: '08:30' },
    { id: 'bruno-water', label: 'Fresh water', time: '' },
  ],
  trainingGoals: ['Training practice', 'Evening play'],
  groomingSchedule: [{ id: 'bruno-groom', label: 'Grooming reminder', time: '' }],
}

export function applyBrunoDefaults(pet: Pet): Pet {
  if (pet.name.trim().toLowerCase() !== 'bruno') return pet
  return {
    ...emptyPet(),
    ...pet,
    name: 'Bruno',
    type: pet.type || 'Dog',
    breed: pet.breed || 'Goldendoodle',
    birthday: pet.birthday || '2026-01-10',
    walkSchedule: pet.walkSchedule.length
      ? pet.walkSchedule
      : [{ id: 'bruno-am-walk', label: 'Morning walk', time: '08:00' }],
    feedingSchedule: pet.feedingSchedule.length
      ? pet.feedingSchedule
      : [
          { id: 'bruno-feed-am', label: 'Morning food', time: '08:30' },
          { id: 'bruno-water', label: 'Fresh water', time: '' },
        ],
    trainingGoals: pet.trainingGoals.length
      ? pet.trainingGoals
      : ['Training practice', 'Evening play'],
    groomingSchedule: pet.groomingSchedule.length
      ? pet.groomingSchedule
      : [{ id: 'bruno-groom', label: 'Grooming reminder', time: '' }],
  }
}

export function isJadyProfile(firstName: string): boolean {
  return firstName.trim().toLowerCase() === 'jady'
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
