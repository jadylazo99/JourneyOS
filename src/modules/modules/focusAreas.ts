import type { FocusAreaId, ModuleId } from '@/modules/onboarding/types'

export type { FocusAreaId }

export const FOCUS_AREA_OPTIONS: {
  id: FocusAreaId
  label: string
  description: string
}[] = [
  { id: 'weight_loss', label: 'Weight Loss', description: 'Weigh-ins, milestones, and progress' },
  { id: 'fitness', label: 'Fitness', description: 'Workouts and movement' },
  { id: 'nutrition', label: 'Nutrition', description: 'Food preferences and meals' },
  { id: 'study', label: 'Study', description: 'Exams, sessions, and learning goals' },
  { id: 'pets', label: 'Pets', description: 'Pet care and daily routines' },
  { id: 'finance', label: 'Finance', description: 'Savings and money goals' },
  { id: 'sleep', label: 'Sleep', description: 'Wake-up and bedtime routines' },
  { id: 'mental_wellness', label: 'Mental Wellness', description: 'Mindset and wellbeing' },
  { id: 'travel', label: 'Travel', description: 'Travel days and vacation mode' },
  { id: 'work', label: 'Work', description: 'Work schedule and busy days' },
  { id: 'home', label: 'Home', description: 'Home projects and life admin' },
  { id: 'custom', label: 'Custom', description: 'Describe your own focus' },
]

export function focusAreaToModuleId(id: FocusAreaId): ModuleId | null {
  return id === 'custom' ? null : id
}

export function isFocusAreaSelected(
  focusAreas: FocusAreaId[],
  id: FocusAreaId,
): boolean {
  return focusAreas.includes(id)
}

export function syncModulesFromFocusAreas(focusAreas: FocusAreaId[]): ModuleId[] {
  return focusAreas
    .filter((id): id is ModuleId => id !== 'custom')
    .filter((id, index, arr) => arr.indexOf(id) === index)
}
