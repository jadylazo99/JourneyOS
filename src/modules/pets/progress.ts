import { getLocalDateKey } from '@/modules/daily/date'
import type { PetNoteEntry, PetProgressStats, PetTask } from './types'

function datesWithCompletedType(tasks: Record<string, PetTask[]>, type: string): string[] {
  return Object.entries(tasks)
    .filter(([, dayTasks]) =>
      dayTasks.some((t) => t.type === type && t.status === 'completed'),
    )
    .map(([dateKey]) => dateKey)
    .sort()
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const today = getLocalDateKey()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = getLocalDateKey(yesterday)

  const last = dates[dates.length - 1]
  if (last !== today && last !== yesterdayKey) return 0

  let streak = 1
  for (let i = dates.length - 1; i > 0; i--) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) streak += 1
    else break
  }
  return streak
}

export function computePetProgress(
  tasks: Record<string, PetTask[]>,
  notes: PetNoteEntry[],
  petId?: string,
): PetProgressStats {
  const filterPet = (t: PetTask) => !petId || t.petId === petId
  const filterNotes = (n: PetNoteEntry) => !petId || n.petId === petId

  const allTasks = Object.values(tasks).flat().filter(filterPet)
  const walkDates = datesWithCompletedType(
    Object.fromEntries(
      Object.entries(tasks).map(([k, v]) => [k, v.filter(filterPet)]),
    ),
    'walk',
  )

  const trainingDays = new Set(
    allTasks
      .filter((t) => t.type === 'training' && t.status === 'completed')
      .map((t) => t.dateKey),
  ).size

  return {
    walkStreak: computeStreak(walkDates),
    trainingDays,
    groomingCompleted: allTasks.filter(
      (t) => t.type === 'grooming' && t.status === 'completed',
    ).length,
    vetRemindersCompleted: allTasks.filter(
      (t) => t.type === 'vet' && t.status === 'completed',
    ).length,
    totalTasksCompleted: allTasks.filter((t) => t.status === 'completed').length,
    notesCount: notes.filter(filterNotes).length,
  }
}

export function getTaskHistoryByDate(
  tasks: Record<string, PetTask[]>,
  petId?: string,
  limit = 14,
): { dateKey: string; tasks: PetTask[] }[] {
  return Object.entries(tasks)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, limit)
    .map(([dateKey, dayTasks]) => ({
      dateKey,
      tasks: petId ? dayTasks.filter((t) => t.petId === petId) : dayTasks,
    }))
    .filter((d) => d.tasks.length > 0)
}
