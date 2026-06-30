import type { AchievementId } from './types'

export const TIMELINE_MESSAGES: Partial<Record<AchievementId | string, string>> = {
  started_journey: 'Your story begins here.',
  first_weigh_in: 'The first step is always the bravest.',
  lost_first_pound: 'Real progress starts with one.',
  lost_5_pounds: 'Your first major milestone. Keep going.',
  lost_10_pounds: 'Double digits down — momentum is building.',
  goal_weight: 'You reached your goal. Celebrate this moment.',
  first_workout: 'Movement counts. You showed up.',
  workouts_10: 'Ten sessions in — the habit is forming.',
  consistent_7: 'Seven days of showing up. That matters.',
  consistent_30: 'Thirty days strong. This is who you are becoming.',
  consistent_100: 'One hundred days of showing up. Remarkable.',
  vacation_started: 'Time to rest and recharge.',
  vacation_completed: 'Welcome back. Pick up where you left off.',
}

export function getTimelineMessage(
  key: AchievementId | string,
  fallback?: string,
): string {
  return TIMELINE_MESSAGES[key] ?? fallback ?? ''
}
