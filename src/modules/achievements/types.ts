import type { WeightCelebration } from '@/modules/weight/types'

export type AchievementCategory =
  | 'fitness'
  | 'nutrition'
  | 'weight'
  | 'study'
  | 'finance'
  | 'pets'
  | 'mindset'
  | 'journey'

export type AchievementId =
  | 'first_weigh_in'
  | 'lost_first_pound'
  | 'lost_5_pounds'
  | 'lost_10_pounds'
  | 'lost_25_pounds'
  | 'lost_50_pounds'
  | 'lost_75_pounds'
  | 'goal_weight'
  | 'maintained_goal_30'
  | 'maintained_goal_90'
  | 'first_workout'
  | 'workouts_10'
  | 'workouts_25'
  | 'workouts_50'
  | 'workouts_100'
  | 'walked_pet_30'
  | 'protein_goal_7'
  | 'water_goal_30'
  | 'saved_1000'
  | 'paid_first_debt'
  | 'started_journey'
  | 'pet_added'
  | 'consistent_7'
  | 'consistent_30'
  | 'consistent_100'

export type AchievementDefinition = {
  id: AchievementId
  category: AchievementCategory
  title: string
  description: string
  icon: string
}

export type UnlockedAchievement = {
  id: AchievementId
  unlockedAt: string
  dateKey: string
}

export type TimelineEventType = 'achievement' | 'life' | 'system'

export type TimelineEventCategory =
  | AchievementCategory
  | 'life'
  | 'system'
  | 'consistency'
  | 'travel'

export type TimelineEvent = {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  dateKey: string
  timestamp: string
  achievementId?: AchievementId
  icon?: string
  category?: TimelineEventCategory
}

export type AchievementStoreData = {
  unlocked: UnlockedAchievement[]
  timeline: TimelineEvent[]
}

export type AchievementCelebration = {
  type: 'achievement'
  achievementId: AchievementId
  title: string
  description: string
  icon: string
}

export type TodayAchievementBanner = AchievementCelebration & {
  id: string
  dateKey: string
}

export type CelebrationPayload = WeightCelebration | AchievementCelebration

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  weight: 'Weight',
  study: 'Study',
  finance: 'Finance',
  pets: 'Pets',
  mindset: 'Mindset',
  journey: 'Journey',
}
