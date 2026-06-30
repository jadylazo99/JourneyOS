import { applyPersonalizationPreset } from './presets'
import type { ModuleId } from '@/modules/onboarding/types'

export function shouldApplyPersonalization(
  mainGoal: string,
  answeredQuestions: string[],
): boolean {
  if (!mainGoal.trim()) return false
  const key = `personalization:${mainGoal.trim().toLowerCase()}`
  return !answeredQuestions.includes(key)
}

export function personalizeModules(
  mainGoal: string,
  currentModules: ModuleId[],
  answeredQuestions: string[],
): { modules: ModuleId[]; questionId: string | null } {
  if (!shouldApplyPersonalization(mainGoal, answeredQuestions)) {
    return { modules: currentModules, questionId: null }
  }
  return {
    modules: applyPersonalizationPreset(mainGoal, currentModules),
    questionId: `personalization:${mainGoal.trim().toLowerCase()}`,
  }
}

export function isModuleVisibleForGoal(
  moduleId: ModuleId,
  mainGoal: string,
  enabledModules: ModuleId[],
): boolean {
  if (!enabledModules.includes(moduleId)) return false
  const g = mainGoal.trim().toLowerCase()
  if (g.includes('study') && !enabledModules.includes('weight_loss')) {
    if (moduleId === 'weight_loss') return false
  }
  if ((g.includes('weight') || g.includes('lose')) && !enabledModules.includes('study')) {
    if (moduleId === 'study') return false
  }
  return true
}
