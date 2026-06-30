import type { AchievementDefinition } from './types'

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'started_journey', category: 'journey', title: 'Started JourneyOS', description: 'Your story begins.', icon: '🚀' },
  { id: 'first_weigh_in', category: 'weight', title: 'First Weigh-In', description: 'Logged your first weight.', icon: '⚖️' },
  { id: 'lost_first_pound', category: 'weight', title: 'Lost First Pound', description: 'The first pound is the hardest.', icon: '🎯' },
  { id: 'lost_5_pounds', category: 'weight', title: 'Lost 5 Pounds', description: 'Five pounds of real progress.', icon: '🎉' },
  { id: 'lost_10_pounds', category: 'weight', title: 'Lost 10 Pounds', description: 'Double digits down.', icon: '💪' },
  { id: 'lost_25_pounds', category: 'weight', title: 'Lost 25 Pounds', description: 'A quarter century of progress.', icon: '🏆' },
  { id: 'lost_50_pounds', category: 'weight', title: 'Lost 50 Pounds', description: 'Transformation in motion.', icon: '⭐' },
  { id: 'lost_75_pounds', category: 'weight', title: 'Lost 75 Pounds', description: 'Remarkable dedication.', icon: '👑' },
  { id: 'goal_weight', category: 'weight', title: 'Goal Weight', description: 'You reached your goal.', icon: '🎊' },
  { id: 'maintained_goal_30', category: 'weight', title: 'Maintained Goal 30 Days', description: 'Thirty days at goal.', icon: '📅' },
  { id: 'maintained_goal_90', category: 'weight', title: 'Maintained Goal 90 Days', description: 'Ninety days of consistency.', icon: '🌟' },
  { id: 'first_workout', category: 'fitness', title: 'First Workout', description: 'Movement counts.', icon: '🏋️' },
  { id: 'workouts_10', category: 'fitness', title: '10 Workouts', description: 'Building the habit.', icon: '🔥' },
  { id: 'workouts_25', category: 'fitness', title: '25 Workouts', description: 'Quarter century of sessions.', icon: '💪' },
  { id: 'workouts_50', category: 'fitness', title: '50 Workouts', description: 'Fifty sessions strong.', icon: '💥' },
  { id: 'workouts_100', category: 'fitness', title: '100 Workouts', description: 'A hundred workouts deep.', icon: '🏅' },
  { id: 'walked_pet_30', category: 'pets', title: 'Walked Pet 30 Days', description: 'Thirty days of walks.', icon: '🐾' },
  { id: 'protein_goal_7', category: 'nutrition', title: 'Protein Goal 7 Days', description: 'A week of protein goals.', icon: '🥩' },
  { id: 'water_goal_30', category: 'nutrition', title: 'Water Goal 30 Days', description: 'Thirty days hydrated.', icon: '💧' },
  { id: 'saved_1000', category: 'finance', title: 'Saved First $1,000', description: 'Your first thousand saved.', icon: '💰' },
  { id: 'paid_first_debt', category: 'finance', title: 'Paid Off First Debt', description: 'Debt freedom begins.', icon: '🎈' },
  { id: 'pet_added', category: 'pets', title: 'Pet Added', description: 'A new companion on your journey.', icon: '🐕' },
  { id: 'consistent_7', category: 'journey', title: '7 Consistent Days', description: 'A week of showing up.', icon: '📅' },
  { id: 'consistent_30', category: 'journey', title: '30 Consistent Days', description: 'A month of momentum.', icon: '🌟' },
  { id: 'consistent_100', category: 'journey', title: '100 Consistent Days', description: 'One hundred days strong.', icon: '💯' },
]

export function getAchievementDef(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
