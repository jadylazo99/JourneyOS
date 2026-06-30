import type { AchievementId } from '@/modules/achievements/types'

export function checkPetAchievements(
  walkDaysCompleted: number,
  unlocked: AchievementId[],
): AchievementId[] {
  const set = new Set(unlocked)
  const newly: AchievementId[] = []

  if (walkDaysCompleted >= 30 && !set.has('walked_pet_30')) {
    newly.push('walked_pet_30')
  }

  return newly
}
