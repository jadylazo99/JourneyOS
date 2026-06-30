import { create } from 'zustand'
import { getDeviceTimezone, getLocalDateKey } from '@/modules/daily/date'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadOnboardingData, persistProfile } from '@/modules/onboarding/storage'
import { buildAIContextPacket } from './ai/contextBuilder'
import { createObservation, appendObservation } from './learning/observations'
import { derivePatterns } from './learning/patterns'
import { buildDailyNotificationSchedule } from './notifications/scheduler'
import { personalizeModules } from './personalization/engine'
import { getTopRecommendation, getRecommendations } from './secondBrain/recommendations'
import { detectDateChange } from './travel/detect'
import { MEMORY_QUESTIONS, markQuestionAnswered as persistQuestionAnswered } from './memory/questions'
import {
  applyTravelResponse,
  shouldShowTravelPrompt,
  travelResponseToDayMode,
} from './travel/engine'
import { syncVacationFromProfile } from './vacation/engine'
import {
  buildWeeklyReview,
  isSundayEvening,
  weeklyReviewId,
} from './review/weekly'
import {
  getCurrentMonthlyReview,
  isEndOfMonth,
  monthlyReviewId,
} from './review/monthly'
import {
  emptyIntelligenceStore,
  loadIntelligenceStore,
  saveIntelligenceStore,
} from './storage'
import type {
  AIContextPacket,
  IntelligenceEventSource,
  IntelligenceStoreData,
  NotificationKind,
  NotificationPreferences,
  Recommendation,
  RecommendationAction,
  TravelTripType,
  WeeklyReview,
  MonthlyReview,
} from './types'
import type { ModuleId } from '@/modules/onboarding/types'

interface IntelligenceStore {
  hydrated: boolean
  data: IntelligenceStoreData
  showTravelPrompt: boolean
  travelCountryLabel: string
  travelFlag: string
  topRecommendation: Recommendation | null
  pendingWeeklyReview: WeeklyReview | null
  pendingMonthlyReview: MonthlyReview | null

  hydrate: () => void
  recordObservation: (
    kind: string,
    source: IntelligenceEventSource,
    payload?: Record<string, unknown>,
  ) => void
  syncPatterns: () => void
  respondToTravel: (response: TravelTripType | 'never_ask') => DayModeId | null
  needsTravelPrompt: () => boolean
  dismissRecommendation: (id: string) => void
  handleRecommendationAction: (id: string, action: RecommendationAction) => void
  getRecommendations: () => Recommendation[]
  getAIContext: () => AIContextPacket
  updateNotificationPreferences: (partial: Partial<NotificationPreferences>) => void
  setNotificationKind: (kind: NotificationKind, enabled: boolean) => void
  markQuestionAnswered: (questionId: string) => void
  hasAnsweredQuestion: (questionId: string) => boolean
  applyPersonalizationForGoal: (mainGoal: string) => void
  markWeeklyReviewSeen: (id: string) => void
  markMonthlyReviewSeen: (id: string) => void
  refreshReviews: () => void
}

type DayModeId = import('@/modules/daily/types').DayModeId

function persist(data: IntelligenceStoreData): void {
  saveIntelligenceStore(data)
}

export const useIntelligenceStore = create<IntelligenceStore>((set, get) => ({
  hydrated: false,
  data: emptyIntelligenceStore(),
  showTravelPrompt: false,
  travelCountryLabel: '',
  travelFlag: '🌍',
  topRecommendation: null,
  pendingWeeklyReview: null,
  pendingMonthlyReview: null,

  hydrate: () => {
    let data = loadIntelligenceStore()
    const daily = loadDailyStore()
    const currentTz = getDeviceTimezone()
    const todayKey = getLocalDateKey()

    const { intelligenceUpdated } = syncVacationFromProfile(data)
    data = intelligenceUpdated

    if (daily.lastKnownTimezone && daily.lastKnownTimezone !== currentTz) {
      data = {
        ...data,
        observations: appendObservation(
          data.observations,
          createObservation('timezone_change', 'travel', {
            from: daily.lastKnownTimezone,
            to: currentTz,
          }),
        ),
      }
    }

    if (detectDateChange(data.lastKnownDateKey, todayKey)) {
      data = {
        ...data,
        observations: appendObservation(
          data.observations,
          createObservation('date_change', 'system', {
            from: data.lastKnownDateKey,
            to: todayKey,
          }),
        ),
        lastKnownDateKey: todayKey,
      }
    } else if (!data.lastKnownDateKey) {
      data = { ...data, lastKnownDateKey: todayKey }
    }

    data = {
      ...data,
      patterns: derivePatterns(data.observations),
      scheduledNotifications: buildDailyNotificationSchedule(data.notifications, todayKey),
    }
    persist(data)

    const travelCheck = shouldShowTravelPrompt(
      data.travel,
      daily.homeTimezone,
      currentTz,
      todayKey,
    )

    const profile = loadOnboardingData()?.profile
    if (profile?.mainGoal) {
      const { modules, questionId } = personalizeModules(
        profile.mainGoal,
        profile.enabledModules,
        profile.journeyMemory.answeredQuestions,
      )
      if (questionId) {
        persistProfile(
          {
            ...profile,
            enabledModules: modules,
            journeyMemory: {
              ...profile.journeyMemory,
              answeredQuestions: [...profile.journeyMemory.answeredQuestions, questionId],
            },
          },
          loadOnboardingData()!.onboardingComplete,
        )
      }
    }

    const topRec = getTopRecommendation()
    get().refreshReviews()

    set({
      hydrated: true,
      data,
      showTravelPrompt: travelCheck.show,
      travelCountryLabel: travelCheck.location.countryLabel,
      travelFlag: travelCheck.location.flag,
      topRecommendation: topRec,
    })
  },

  recordObservation: (kind, source, payload = {}) => {
    const data = get().data
    const next = {
      ...data,
      observations: appendObservation(
        data.observations,
        createObservation(kind, source, payload),
      ),
    }
    next.patterns = derivePatterns(next.observations)
    persist(next)
    set({ data: next, topRecommendation: getTopRecommendation() })
  },

  syncPatterns: () => {
    const data = get().data
    const next = { ...data, patterns: derivePatterns(data.observations) }
    persist(next)
    set({ data: next })
  },

  needsTravelPrompt: () => get().showTravelPrompt,

  respondToTravel: (response) => {
    const currentTz = getDeviceTimezone()
    const todayKey = getLocalDateKey()
    const { travelCountryLabel } = get()

    let data = get().data
    data = {
      ...data,
      travel: applyTravelResponse(
        data.travel,
        response,
        currentTz,
        travelCountryLabel,
        todayKey,
      ),
    }
    persist(data)

    if (response === 'never_ask') {
      persistQuestionAnswered(MEMORY_QUESTIONS.travelNeverAsk)
      get().recordObservation('travel_never_ask', 'travel', { timezone: currentTz })
    } else {
      get().recordObservation('travel_response', 'travel', { response })
    }

    set({ data, showTravelPrompt: false })

    if (response === 'never_ask') return null
    return travelResponseToDayMode(response) as DayModeId
  },

  dismissRecommendation: (_id) => {
    set({ topRecommendation: null })
    get().recordObservation('recommendation_dismissed', 'system', { id: _id })
  },

  handleRecommendationAction: (id, action) => {
    get().recordObservation('recommendation_action', 'system', { id, action })
    if (action === 'dismiss') {
      set({ topRecommendation: null })
    }
  },

  getRecommendations: () => getRecommendations(),

  getAIContext: () => buildAIContextPacket(get().data),

  updateNotificationPreferences: (partial) => {
    const data = get().data
    const next = {
      ...data,
      notifications: { ...data.notifications, ...partial },
    }
    persist(next)
    set({ data: next })
  },

  setNotificationKind: (kind, enabled) => {
    const data = get().data
    const next = {
      ...data,
      notifications: {
        ...data.notifications,
        kinds: { ...data.notifications.kinds, [kind]: enabled },
      },
    }
    persist(next)
    set({ data: next })
  },

  markQuestionAnswered: (questionId) => {
    persistQuestionAnswered(questionId)
  },

  hasAnsweredQuestion: (questionId) => {
    const profile = loadOnboardingData()?.profile
    return profile?.journeyMemory.answeredQuestions.includes(questionId) ?? false
  },

  applyPersonalizationForGoal: (mainGoal) => {
    const stored = loadOnboardingData()
    if (!stored) return
    const { modules, questionId } = personalizeModules(
      mainGoal,
      stored.profile.enabledModules,
      stored.profile.journeyMemory.answeredQuestions,
    )
    const answered = questionId
      ? [...stored.profile.journeyMemory.answeredQuestions, questionId]
      : stored.profile.journeyMemory.answeredQuestions
    persistProfile(
      {
        ...stored.profile,
        mainGoal,
        enabledModules: modules as ModuleId[],
        journeyMemory: { ...stored.profile.journeyMemory, answeredQuestions: answered },
      },
      stored.onboardingComplete,
    )
  },

  refreshReviews: () => {
    const data = get().data
    let pendingWeekly: WeeklyReview | null = null
    let pendingMonthly: MonthlyReview | null = null

    if (isSundayEvening()) {
      const review = buildWeeklyReview(0)
      const id = weeklyReviewId(review)
      if (!data.reviewsSeen.weekly.includes(id)) {
        pendingWeekly = review
      }
    }

    if (isEndOfMonth()) {
      const review = getCurrentMonthlyReview()
      const id = monthlyReviewId(review)
      if (!data.reviewsSeen.monthly.includes(id)) {
        pendingMonthly = review
      }
    }

    set({ pendingWeeklyReview: pendingWeekly, pendingMonthlyReview: pendingMonthly })
  },

  markWeeklyReviewSeen: (id) => {
    const data = get().data
    if (data.reviewsSeen.weekly.includes(id)) return
    const next = {
      ...data,
      reviewsSeen: {
        ...data.reviewsSeen,
        weekly: [...data.reviewsSeen.weekly, id],
      },
    }
    persist(next)
    set({ data: next, pendingWeeklyReview: null })
  },

  markMonthlyReviewSeen: (id) => {
    const data = get().data
    if (data.reviewsSeen.monthly.includes(id)) return
    const next = {
      ...data,
      reviewsSeen: {
        ...data.reviewsSeen,
        monthly: [...data.reviewsSeen.monthly, id],
      },
    }
    persist(next)
    set({ data: next, pendingMonthlyReview: null })
  },
}))

export function recordIntelligenceObservation(
  kind: string,
  source: IntelligenceEventSource,
  payload?: Record<string, unknown>,
): void {
  useIntelligenceStore.getState().recordObservation(kind, source, payload)
}
