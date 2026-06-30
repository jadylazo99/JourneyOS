import { getLocalDateKey } from '@/modules/daily/date'
import { loadDailyStore, saveDailyStore } from '@/modules/daily/storage'
import { loadOnboardingData, persistProfile } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { useAchievementStore } from '@/modules/achievements/store'
import { getTimelineMessage } from '@/modules/achievements/messages'
import { reducedVacationNotifications } from '../notifications/preferences'
import type { VacationSettings } from '@/modules/onboarding/types'
import type { IntelligenceStoreData, NotificationPreferences } from '../types'

function isDateInRange(dateKey: string, start: string, end: string): boolean {
  if (!start) return false
  const endKey = end || start
  return dateKey >= start && dateKey <= endKey
}

export function shouldAutoActivateVacation(
  vacation: VacationSettings,
  dateKey = getLocalDateKey(),
): boolean {
  if (!vacation.startDate) return false
  return isDateInRange(dateKey, vacation.startDate, vacation.endDate || vacation.startDate)
}

function addVacationTimelineEvent(
  kind: 'started' | 'ended',
  destination: string,
): void {
  const achievementStore = useAchievementStore.getState()
  if (kind === 'started') {
    achievementStore.addLifeEvent({
      title: 'Vacation Started',
      description: getTimelineMessage(
        'vacation_started',
        destination ? `Heading to ${destination}.` : 'Time to rest and recharge.',
      ),
      icon: '🏖️',
      category: 'travel',
    })
  } else {
    achievementStore.addLifeEvent({
      title: 'Vacation Ended',
      description: getTimelineMessage(
        'vacation_completed',
        'Welcome back. Pick up where you left off.',
      ),
      icon: '🏠',
      category: 'travel',
    })
  }
}

function applyVacationNotifications(
  intelligence: IntelligenceStoreData,
  active: boolean,
): IntelligenceStoreData {
  if (active) {
    const baseline = intelligence.notificationsBaseline ?? intelligence.notifications
    return {
      ...intelligence,
      notificationsBaseline: baseline,
      notifications: reducedVacationNotifications(baseline),
    }
  }
  if (intelligence.notificationsBaseline) {
    return {
      ...intelligence,
      notifications: intelligence.notificationsBaseline,
      notificationsBaseline: null,
    }
  }
  return intelligence
}

export function syncVacationFromProfile(intelligence: IntelligenceStoreData): {
  profileUpdated: boolean
  intelligenceUpdated: IntelligenceStoreData
} {
  const data = loadOnboardingData()
  if (!data) return { profileUpdated: false, intelligenceUpdated: intelligence }

  const todayKey = getLocalDateKey()
  const vacation = data.profile.vacation
  const shouldActive = shouldAutoActivateVacation(vacation, todayKey)
  let profileUpdated = false
  let nextProfile = data.profile
  const wasActive = vacation.active

  if (shouldActive && !vacation.active) {
    nextProfile = {
      ...data.profile,
      vacation: { ...vacation, active: true },
    }
    profileUpdated = true
    addVacationTimelineEvent('started', vacation.destination)
  } else if (!shouldActive && vacation.active && vacation.endDate && todayKey > vacation.endDate) {
    nextProfile = {
      ...data.profile,
      vacation: { ...vacation, active: false },
    }
    profileUpdated = true
    addVacationTimelineEvent('ended', vacation.destination)
  }

  if (profileUpdated) {
    persistProfile(nextProfile, data.onboardingComplete)
  }

  const daily = loadDailyStore()
  const travelEnabled = isModuleEnabled(nextProfile, 'travel')
  daily.lifeEngineSettings.vacationModeEnabled = travelEnabled && nextProfile.vacation.active
  saveDailyStore(daily)

  let intelligenceUpdated = applyVacationNotifications(
    intelligence,
    nextProfile.vacation.active,
  )

  if (!nextProfile.vacation.active && wasActive && !profileUpdated) {
    intelligenceUpdated = applyVacationNotifications(intelligenceUpdated, false)
  }

  return { profileUpdated, intelligenceUpdated }
}

export function vacationGuidedOverrides(): {
  hideWeighIn: boolean
  preferWalking: boolean
  optionalPhoto: boolean
  reduceGuilt: boolean
} {
  return {
    hideWeighIn: true,
    preferWalking: true,
    optionalPhoto: true,
    reduceGuilt: true,
  }
}

export function createVacationTimelineNote(destination: string): string {
  return destination
    ? `Vacation memories in ${destination}`
    : 'Vacation memories — savor the moment'
}

export function isVacationDayMode(dayMode: string): boolean {
  return dayMode === 'vacation' || dayMode === 'travel'
}

export type SavedNotificationPrefs = NotificationPreferences
