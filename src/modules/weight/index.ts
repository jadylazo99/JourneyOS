export { useWeightStore } from './store'
export {
  computeWeightProgress,
  formatWeightValue,
  getLatestEntry,
  getChartData,
  getNextMilestone,
} from './calculations'
export { loadWeightStore, saveWeightStore } from './storage'
export { WEIGHT_STORAGE_KEY, WEIGHT_MILESTONE_STEP } from './constants'
export type {
  WeightEntry,
  WeightUnit,
  WeightProgress,
  WeightMilestone,
  NextMilestoneInfo,
  WeightCelebration,
} from './types'
