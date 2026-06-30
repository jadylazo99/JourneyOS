import type { AchievementCategory } from '@/modules/achievements/types'
import type { ModuleId, UserProfile } from '@/modules/onboarding/types'

export const ACHIEVEMENT_CATEGORY_MODULE: Record<
  AchievementCategory,
  ModuleId | 'always'
> = {
  weight: 'weight_loss',
  fitness: 'fitness',
  nutrition: 'nutrition',
  study: 'study',
  finance: 'finance',
  pets: 'pets',
  mindset: 'mental_wellness',
  journey: 'always',
}

export function isModuleEnabled(
  profile: UserProfile | null | undefined,
  moduleId: ModuleId,
): boolean {
  if (!profile) return true
  return profile.enabledModules.includes(moduleId)
}

export function isAchievementCategoryVisible(
  profile: UserProfile | null | undefined,
  category: AchievementCategory,
): boolean {
  const moduleId = ACHIEVEMENT_CATEGORY_MODULE[category]
  if (moduleId === 'always') return true
  return isModuleEnabled(profile, moduleId)
}

export function getEnabledModules(
  profile: UserProfile | null | undefined,
): ModuleId[] {
  return profile?.enabledModules ?? []
}
