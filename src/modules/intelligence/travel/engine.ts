import { getLocalDateKey } from '@/modules/daily/date'
import { hasAnsweredQuestion, MEMORY_QUESTIONS } from '../memory/questions'
import { resolveTravelLocation } from './detect'
import type { TravelIntelligenceState, TravelTripType } from '../types'

export function shouldShowTravelPrompt(
  travel: TravelIntelligenceState,
  homeTimezone: string,
  currentTimezone: string,
  dateKey = getLocalDateKey(),
): { show: boolean; location: ReturnType<typeof resolveTravelLocation> } {
  const location = resolveTravelLocation(currentTimezone, homeTimezone)
  if (!location.isAbroad) {
    return { show: false, location }
  }
  if (travel.neverAskAgain || hasAnsweredQuestion(MEMORY_QUESTIONS.travelNeverAsk)) {
    return { show: false, location }
  }
  if (travel.lastPromptDateKey === dateKey && travel.lastTimezone === currentTimezone) {
    return { show: false, location }
  }
  return { show: true, location }
}

export function applyTravelResponse(
  travel: TravelIntelligenceState,
  response: TravelTripType | 'never_ask',
  currentTimezone: string,
  countryLabel: string,
  dateKey = getLocalDateKey(),
): TravelIntelligenceState {
  const now = new Date().toISOString()
  if (response === 'never_ask') {
    return {
      ...travel,
      neverAskAgain: true,
      lastTimezone: currentTimezone,
      lastCountryLabel: countryLabel,
      lastPromptDateKey: dateKey,
      answeredAt: now,
    }
  }
  return {
    ...travel,
    neverAskAgain: false,
    lastResponse: response,
    lastTimezone: currentTimezone,
    lastCountryLabel: countryLabel,
    lastPromptDateKey: dateKey,
    answeredAt: now,
  }
}

export function travelResponseToDayMode(
  response: TravelTripType,
): 'vacation' | 'travel' | 'busy_workday' {
  switch (response) {
    case 'vacation':
      return 'vacation'
    case 'work_trip':
      return 'busy_workday'
    case 'just_visiting':
      return 'travel'
  }
}

export function hasAnsweredTravelQuestion(answeredQuestions: string[]): boolean {
  return answeredQuestions.includes('travel:never_ask_again')
}
