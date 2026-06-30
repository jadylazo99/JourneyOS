export type PetTaskType =
  | 'walk'
  | 'feed'
  | 'water'
  | 'training'
  | 'play'
  | 'grooming'
  | 'vet'
  | 'medication'
  | 'handoff'
  | 'custom'

export type PetTaskStatus =
  | 'pending'
  | 'completed'
  | 'skipped'
  | 'rescheduled'
  | 'not_needed'

export type PetTask = {
  id: string
  petId: string
  petName: string
  type: PetTaskType
  label: string
  time?: string
  status: PetTaskStatus
  dateKey: string
}

export type PetNoteEntry = {
  id: string
  petId: string
  petName: string
  text: string
  dateKey: string
  timestamp: string
}

export type PetVacationState = {
  dateKey: string
  travelingWithUser: boolean | null
  handoffChecklist: PetTask[]
}

export type PetProgressStats = {
  walkStreak: number
  trainingDays: number
  groomingCompleted: number
  vetRemindersCompleted: number
  totalTasksCompleted: number
  notesCount: number
}

export type PetsStoreData = {
  tasks: Record<string, PetTask[]>
  notes: PetNoteEntry[]
  vacationState: Record<string, PetVacationState>
}

export const PET_TASK_ACTIONS: {
  status: PetTaskStatus
  label: string
  message: string
}[] = [
  { status: 'completed', label: 'Completed', message: 'Nice work — Bruno appreciates it.' },
  { status: 'skipped', label: 'Skipped', message: 'No problem. Tomorrow is a new day.' },
  { status: 'rescheduled', label: 'Rescheduled', message: 'Moved to another time. Still counts as planning ahead.' },
  { status: 'not_needed', label: 'Not needed today', message: 'Got it — not every task fits every day.' },
]

export const HANDOFF_CHECKLIST = [
  'Food portions prepared',
  'Walk schedule shared',
  'Medications written down',
  'Vet contact left',
  'Emergency notes shared',
]
