import type { WeightEntry } from '@/modules/weight/types'
import type { AchievementId } from './types'

export type WeightCheckContext = {
  entries: WeightEntry[]
  startWeight: number | null
  currentWeight: number | null
  goalWeight: number | null
  unlocked: AchievementId[]
}

export function checkWeightAchievements(ctx: WeightCheckContext): AchievementId[] {
  const unlockedSet = new Set(ctx.unlocked)
  const newly: AchievementId[] = []

  const queue = (id: AchievementId, condition: boolean) => {
    if (condition && !unlockedSet.has(id) && !newly.includes(id)) {
      newly.push(id)
    }
  }

  queue('first_weigh_in', ctx.entries.length >= 1)

  if (ctx.startWeight != null && ctx.currentWeight != null) {
    const lost = ctx.startWeight - ctx.currentWeight
    queue('lost_first_pound', lost >= 1)
    queue('lost_5_pounds', lost >= 5)
    queue('lost_10_pounds', lost >= 10)
    queue('lost_25_pounds', lost >= 25)
    queue('lost_50_pounds', lost >= 50)
    queue('lost_75_pounds', lost >= 75)
  }

  queue(
    'goal_weight',
    ctx.goalWeight != null &&
      ctx.currentWeight != null &&
      ctx.currentWeight <= ctx.goalWeight,
  )

  return newly
}
