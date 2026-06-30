import { getLocalDateKey } from '@/modules/daily/date'
import type { Pet } from '@/modules/onboarding/types'
import type { DayModeId } from '@/modules/daily/types'
import type { PetTask, PetTaskType } from './types'

function taskId(petId: string, type: string, suffix: string): string {
  return `${petId}-${type}-${suffix}-${getLocalDateKey()}`
}

function isVaccineDueSoon(dueDate: string, withinDays = 14): boolean {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const now = new Date()
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= withinDays && diff >= -7
}

function addTask(
  tasks: PetTask[],
  pet: Pet,
  type: PetTaskType,
  label: string,
  time?: string,
): void {
  tasks.push({
    id: taskId(pet.id, type, label.replace(/\s+/g, '-').slice(0, 20)),
    petId: pet.id,
    petName: pet.name,
    type,
    label,
    time,
    status: 'pending',
    dateKey: getLocalDateKey(),
  })
}

export function generatePetTasks(pet: Pet, dayMode: DayModeId = 'normal'): PetTask[] {
  const tasks: PetTask[] = []
  const dateKey = getLocalDateKey()

  if (dayMode === 'sick') {
    addTask(tasks, pet, 'feed', `Feed ${pet.name}`)
    addTask(tasks, pet, 'water', `Fresh water for ${pet.name}`)
    return tasks.map((t) => ({ ...t, dateKey }))
  }

  for (const walk of pet.walkSchedule) {
    addTask(tasks, pet, 'walk', `Walk ${pet.name}${walk.label.includes('walk') ? '' : ` — ${walk.label}`}`, walk.time)
  }
  if (pet.walkSchedule.length === 0) {
    addTask(tasks, pet, 'walk', `Walk ${pet.name}`)
  }

  for (const feed of pet.feedingSchedule) {
    const type = feed.label.toLowerCase().includes('water') ? 'water' : 'feed'
    addTask(tasks, pet, type, `${feed.label} for ${pet.name}`, feed.time)
  }
  if (pet.feedingSchedule.length === 0) {
    addTask(tasks, pet, 'feed', `Feed ${pet.name}`)
  }

  for (const goal of pet.trainingGoals) {
    const type: PetTaskType = goal.toLowerCase().includes('play') ? 'play' : 'training'
    addTask(tasks, pet, type, `${goal}${goal.includes(pet.name) ? '' : ` — ${pet.name}`}`)
  }

  for (const groom of pet.groomingSchedule) {
    addTask(tasks, pet, 'grooming', `${groom.label} for ${pet.name}`, groom.time)
  }

  for (const med of pet.medications) {
    addTask(tasks, pet, 'medication', `${med.name} for ${pet.name}`, med.schedule)
  }

  for (const vax of pet.vaccineReminders) {
    if (isVaccineDueSoon(vax.dueDate)) {
      addTask(tasks, pet, 'vet', `${vax.name} reminder for ${pet.name}`)
    }
  }

  if (dayMode === 'busy_workday') {
    return tasks
      .filter((t) => ['walk', 'feed', 'water'].includes(t.type))
      .slice(0, 4)
      .map((t) => ({ ...t, dateKey }))
  }

  if (dayMode === 'recovery' || dayMode === 'rest') {
    return tasks
      .filter((t) => ['walk', 'feed', 'water'].includes(t.type))
      .slice(0, 3)
      .map((t) => ({ ...t, dateKey }))
  }

  return tasks.map((t) => ({ ...t, dateKey }))
}

export function generateHandoffTasks(pet: Pet): PetTask[] {
  const dateKey = getLocalDateKey()
  return HANDOFF_ITEMS.map((item) => ({
    id: taskId(pet.id, 'handoff', item),
    petId: pet.id,
    petName: pet.name,
    type: 'handoff' as const,
    label: `${item} (${pet.name})`,
    status: 'pending' as const,
    dateKey,
  }))
}

const HANDOFF_ITEMS = [
  'Food portions prepared',
  'Walk schedule shared',
  'Medications written down',
  'Vet contact left',
  'Emergency notes shared',
]

export function generateAllPetTasks(
  pets: Pet[],
  dayMode: DayModeId = 'normal',
): PetTask[] {
  return pets.filter((p) => p.name).flatMap((pet) => generatePetTasks(pet, dayMode))
}
