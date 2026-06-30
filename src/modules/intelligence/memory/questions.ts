import { loadOnboardingData, persistProfile } from '@/modules/onboarding/storage'

export const MEMORY_QUESTIONS = {
  travelNeverAsk: 'travel:never_ask_again',
  personalization: (goal: string) => `personalization:${goal.trim().toLowerCase()}`,
  weighInPreference: 'weigh_in:preference',
  vacationPhotoPrompt: 'vacation:photo_prompt',
} as const

export function hasAnsweredQuestion(questionId: string): boolean {
  const profile = loadOnboardingData()?.profile
  return profile?.journeyMemory.answeredQuestions.includes(questionId) ?? false
}

export function markQuestionAnswered(questionId: string): void {
  const stored = loadOnboardingData()
  if (!stored) return
  const memory = stored.profile.journeyMemory
  if (memory.answeredQuestions.includes(questionId)) return
  persistProfile(
    {
      ...stored.profile,
      journeyMemory: {
        ...memory,
        answeredQuestions: [...memory.answeredQuestions, questionId],
      },
    },
    stored.onboardingComplete,
  )
}

export function shouldAskQuestion(questionId: string): boolean {
  return !hasAnsweredQuestion(questionId)
}
