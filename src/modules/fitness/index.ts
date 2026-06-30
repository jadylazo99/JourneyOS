export { useFitnessStore } from './store'
export { checkFitnessAchievements } from './achievements'
export { getTodayAdaptiveWorkout, buildFitnessContext, adaptWorkout, getWeeklyPlan } from './adaptive'
export { DEFAULT_WEEKLY_PLAN } from './defaultPlan'
export { JADY_WEEKLY_PLAN } from './jadyPlan'
export { getJadyDefaults, isJadyProfile } from './jadyPlan'
export { SKIP_OPTIONS, WEEKDAY_PLAN_ORDER } from './types'
export type {
  WorkoutExercise,
  WorkoutPlan,
  AdaptiveWorkoutResult,
  WorkoutActiveSession,
  ExerciseLogState,
  CompletedWorkout,
  PersonalRecord,
  FitnessProgressStats,
  WorkoutSkipReason,
  WorkoutVariant,
} from './types'
