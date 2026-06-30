export type WeightUnit = 'lb' | 'kg'

export type WeightEntry = {
  id: string
  dateKey: string
  time: string
  weight: number
  unit: WeightUnit
  notes?: string
  createdAt: string
}

export type WeightProgress = {
  startWeight: number | null
  currentWeight: number | null
  goalWeight: number | null
  totalPoundsToLose: number | null
  poundsLost: number | null
  poundsRemaining: number | null
  percentComplete: number | null
}

export type WeightMilestone = {
  targetWeight: number
  poundsFromStart: number
  reached: boolean
}

export type NextMilestoneInfo = {
  targetWeight: number | null
  poundsRemaining: number | null
  progressPercent: number
  previousTarget: number | null
}

export type WeightStoreData = {
  entries: WeightEntry[]
  celebratedMilestones: number[]
}

export type WeightCelebration = {
  type: 'milestone'
  poundsLost: number
  milestoneTarget: number
  isFirstMilestone: boolean
  title: string
  message: string
}
