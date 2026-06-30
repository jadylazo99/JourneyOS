export { INTELLIGENCE_STORAGE_KEY, MAX_OBSERVATIONS, MAX_PATTERNS } from './constants'
export { loadIntelligenceStore, saveIntelligenceStore, emptyIntelligenceStore } from './storage'
export { useIntelligenceStore, recordIntelligenceObservation } from './store'
export { buildAIContextPacket } from './ai/contextBuilder'
export { getRecommendations, getTopRecommendation } from './secondBrain/recommendations'
export { applyPersonalizationPreset, matchPresetForGoal } from './personalization/presets'
export { personalizeModules, shouldApplyPersonalization } from './personalization/engine'
export { derivePatterns } from './learning/patterns'
export { createObservation } from './learning/observations'
export { resolveTravelLocation, detectTimezoneChange } from './travel/detect'
export { shouldShowTravelPrompt, travelResponseToDayMode } from './travel/engine'
export {
  syncVacationFromProfile,
  shouldAutoActivateVacation,
  isDateInVacationRange,
  isScheduledVacationDay,
  isVacationPausedToday,
  getVacationGreeting,
  applyVacationToToday,
  vacationGuidedOverrides,
  isVacationDayMode,
} from './vacation/engine'
export { buildWeeklyReview, getWeeklyReviewCards, isSundayEvening, weeklyReviewId } from './review/weekly'
export { buildMonthlyReview, getCurrentMonthlyReview, isEndOfMonth, monthlyReviewId } from './review/monthly'
export { shouldDeliverNotification, isQuietHours } from './notifications/preferences'
export { buildDailyNotificationSchedule } from './notifications/scheduler'
export {
  MEMORY_QUESTIONS,
  hasAnsweredQuestion,
  markQuestionAnswered,
  shouldAskQuestion,
  getUpcomingExams,
  getNextExam,
  examCountdownLabel,
} from './memory'
export type {
  IntelligenceObservation,
  LearnedPattern,
  Recommendation,
  RecommendationAction,
  NotificationKind,
  NotificationPreferences,
  TravelTripType,
  WeeklyReview,
  MonthlyReview,
  AIContextPacket,
  IntelligenceStoreData,
} from './types'
