import type { ModuleId } from '@/modules/onboarding/types'

export type PersonalizationPreset = {
  id: string
  label: string
  enabledModules: ModuleId[]
  hiddenByDefault: ModuleId[]
}

const WEIGHT_LOSS_MODULES: ModuleId[] = [
  'weight_loss',
  'fitness',
  'nutrition',
  'sleep',
  'mental_wellness',
  'pets',
  'travel',
  'work',
  'home',
]

const STUDY_MODULES: ModuleId[] = [
  'study',
  'nutrition',
  'sleep',
  'mental_wellness',
  'pets',
  'travel',
  'work',
  'home',
]

const FITNESS_MODULES: ModuleId[] = [
  'fitness',
  'nutrition',
  'weight_loss',
  'sleep',
  'mental_wellness',
  'pets',
  'travel',
  'work',
  'home',
]

const BALANCED_MODULES: ModuleId[] = [
  'weight_loss',
  'fitness',
  'nutrition',
  'study',
  'finance',
  'pets',
  'travel',
  'sleep',
  'mental_wellness',
  'work',
  'home',
]

export const PERSONALIZATION_PRESETS: PersonalizationPreset[] = [
  {
    id: 'weight_loss',
    label: 'Weight Loss',
    enabledModules: WEIGHT_LOSS_MODULES,
    hiddenByDefault: ['study', 'finance'],
  },
  {
    id: 'study',
    label: 'Study',
    enabledModules: STUDY_MODULES,
    hiddenByDefault: ['weight_loss', 'fitness', 'finance'],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    enabledModules: FITNESS_MODULES,
    hiddenByDefault: ['study', 'finance'],
  },
  {
    id: 'balanced',
    label: 'Balanced',
    enabledModules: BALANCED_MODULES,
    hiddenByDefault: [],
  },
]

function normalizeGoalText(goal: string): string {
  return goal.trim().toLowerCase()
}

export function matchPresetForGoal(mainGoal: string): PersonalizationPreset {
  const g = normalizeGoalText(mainGoal)
  if (g.includes('weight') || g.includes('lose') || g.includes('fat')) {
    return PERSONALIZATION_PRESETS[0]
  }
  if (g.includes('study') || g.includes('exam') || g.includes('school') || g.includes('learn')) {
    return PERSONALIZATION_PRESETS[1]
  }
  if (g.includes('fitness') || g.includes('workout') || g.includes('muscle') || g.includes('strength')) {
    return PERSONALIZATION_PRESETS[2]
  }
  return PERSONALIZATION_PRESETS[3]
}

export function applyPersonalizationPreset(
  mainGoal: string,
  currentModules: ModuleId[],
): ModuleId[] {
  const preset = matchPresetForGoal(mainGoal)
  const enabled = new Set(preset.enabledModules)
  for (const mod of currentModules) {
    if (!preset.hiddenByDefault.includes(mod)) {
      enabled.add(mod)
    }
  }
  return [...enabled]
}
