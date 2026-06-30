import { getLocalDateKey, getDeviceTimezone } from '@/modules/daily/date'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { getTopRecommendation } from '../secondBrain/recommendations'
import type { AIContextPacket, IntelligenceStoreData } from '../types'

export function buildAIContextPacket(
  intelligence: IntelligenceStoreData,
): AIContextPacket {
  const profile = loadOnboardingData()?.profile
  const daily = loadDailyStore()
  const todayKey = getLocalDateKey()
  const record = daily.records[todayKey]

  const rec = getTopRecommendation()

  return {
    generatedAt: new Date().toISOString(),
    dateKey: todayKey,
    timezone: getDeviceTimezone(),
    profile: profile
      ? {
          firstName: profile.firstName,
          mainGoal: profile.mainGoal,
          enabledModules: profile.enabledModules,
          wakeUpTime: profile.wakeUpTime,
          bedtime: profile.bedtime,
          works: profile.workSchedule.works,
        }
      : {
          firstName: '',
          mainGoal: '',
          enabledModules: [],
          wakeUpTime: '',
          bedtime: '',
          works: false,
        },
    memory: profile
      ? {
          foodsLove: profile.foodPreferences.foodsLove,
          foodsDislike: profile.foodPreferences.foodsDislike,
          favoriteRestaurants: profile.foodPreferences.favoriteRestaurants,
          pets: profile.pets.map((p) => ({ name: p.name, type: p.type })),
          fitnessPreferences: {
            ...profile.fitness,
            ...profile.journeyMemory.fitnessExtras,
          },
          studyPreferences: profile.journeyMemory.study,
          financialGoals: profile.journeyMemory.finance,
          travelHabits: profile.journeyMemory.travel,
          answeredQuestions: profile.journeyMemory.answeredQuestions,
        }
      : {
          foodsLove: [],
          foodsDislike: [],
          favoriteRestaurants: [],
          pets: [],
          fitnessPreferences: {},
          studyPreferences: {},
          financialGoals: {},
          travelHabits: {},
          answeredQuestions: [],
        },
    today: record
      ? {
          dayMode: record.dayMode.mode,
          momentumScore: record.snapshot?.momentumScore ?? 0,
          waterOz: record.nutrition?.waterOz ?? 0,
          proteinGrams: record.nutrition?.proteinGrams ?? 0,
        }
      : null,
    patterns: intelligence.patterns,
    recentObservations: intelligence.observations.slice(0, 20),
    recommendations: rec ? [rec] : [],
  }
}
