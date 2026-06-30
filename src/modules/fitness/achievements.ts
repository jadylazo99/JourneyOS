import type { AchievementId } from '@/modules/achievements/types'

export function checkFitnessAchievements(
  totalWorkouts: number,
  unlocked: AchievementId[],
): AchievementId[] {
  const set = new Set(unlocked)
  const newly: AchievementId[] = []

  const queue = (id: AchievementId, condition: boolean) => {
    if (condition && !set.has(id) && !newly.includes(id)) newly.push(id)
  }

  queue('first_workout', totalWorkouts >= 1)
  queue('workouts_10', totalWorkouts >= 10)
  queue('workouts_25', totalWorkouts >= 25)
  queue('workouts_50', totalWorkouts >= 50)
  queue('workouts_100', totalWorkouts >= 100)

  return newly
}
