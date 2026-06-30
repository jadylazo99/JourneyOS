import type { AchievementId } from '@/modules/achievements/types'
import type { MilestoneId } from '@/modules/daily/types'

const MILESTONE_TO_ACHIEVEMENT: Partial<Record<MilestoneId, AchievementId>> = {
  consistent_7_days: 'consistent_7',
  consistent_30_days: 'consistent_30',
  consistent_100_days: 'consistent_100',
}

export function milestoneToAchievement(id: MilestoneId): AchievementId | null {
  return MILESTONE_TO_ACHIEVEMENT[id] ?? null
}

export function checkConsistencyAchievements(
  activeDays: number,
  rollingScore: number,
  unlocked: AchievementId[],
): AchievementId[] {
  const set = new Set(unlocked)
  const newly: AchievementId[] = []

  if (rollingScore >= 70 && activeDays >= 7 && !set.has('consistent_7')) {
    newly.push('consistent_7')
  }
  if (activeDays >= 30 && !set.has('consistent_30')) {
    newly.push('consistent_30')
  }
  if (activeDays >= 100 && !set.has('consistent_100')) {
    newly.push('consistent_100')
  }

  return newly
}
