import { getLocalDateKey } from '@/modules/daily/date'
import { applyDayMode, createDayMode } from '@/modules/daily/dayMode'
import { loadDailyStore, saveDailyStore, isRecordLocked } from '@/modules/daily/storage'
import { loadOnboardingData, persistProfile } from '@/modules/onboarding/storage'
import { useAchievementStore } from '@/modules/achievements/store'
import { getTimelineMessage } from '@/modules/achievements/messages'
import { reducedVacationNotifications } from '../notifications/preferences'
import type { VacationSettings } from '@/modules/onboarding/types'
import type { DayRecord, LifeEngineSettings } from '@/modules/daily/types'
import type { IntelligenceStoreData, NotificationPreferences } from '../types'

export function isDateInVacationRange(
  dateKey: string,
  start: string,
  end: string,
): boolean {
  if (!start) return false
  const endKey = end || start
  return dateKey >= start && dateKey <= endKey
}

export function shouldAutoActivateVacation(
  vacation: VacationSettings,
  dateKey = getLocalDateKey(),
): boolean {
  if (!vacation.startDate) return false
  return isDateInVacationRange(
    dateKey,
    vacation.startDate,
    vacation.endDate || vacation.startDate,
  )
}

export function isVacationPausedToday(
  vacation: VacationSettings,
  dateKey = getLocalDateKey(),
): boolean {
  return vacation.pausedForDate === dateKey
}

export function isScheduledVacationDay(dateKey: string): boolean {
  const data = loadOnboardingData()
  if (!data) return false
  const vacation = data.profile.vacation
  if (!vacation.active || !vacation.startDate) return false
  if (isVacationPausedToday(vacation, dateKey)) return false
  return shouldAutoActivateVacation(vacation, dateKey)
}

export function getVacationGreeting(
  vacation: VacationSettings,
  firstName: string,
): string {
  const tripName = vacation.name.trim()
  if (tripName) return `Enjoy ${tripName}, ${firstName}.`
  if (vacation.destination.trim()) {
    return `Enjoy your trip to ${vacation.destination.trim()}, ${firstName}.`
  }
  return `Enjoy your vacation, ${firstName}.`
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
  const shouldActive =
    shouldAutoActivateVacation(vacation, todayKey) &&
    !isVacationPausedToday(vacation, todayKey)
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
  } else if (
    !shouldAutoActivateVacation(vacation, todayKey) &&
    vacation.active &&
    vacation.endDate &&
    todayKey > vacation.endDate
  ) {
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
  const inRange = shouldAutoActivateVacation(nextProfile.vacation, todayKey)
  const paused = isVacationPausedToday(nextProfile.vacation, todayKey)
  daily.lifeEngineSettings.vacationModeEnabled =
    nextProfile.vacation.active && inRange && !paused
  saveDailyStore(daily)

  let intelligenceUpdated = applyVacationNotifications(
    intelligence,
    nextProfile.vacation.active && inRange && !paused,
  )

  if (!nextProfile.vacation.active && wasActive && !profileUpdated) {
    intelligenceUpdated = applyVacationNotifications(intelligenceUpdated, false)
  }

  return { profileUpdated, intelligenceUpdated }
}

export function applyVacationToToday(
  record: DayRecord,
  lifeSettings: LifeEngineSettings,
): { record: DayRecord; lifeEngineSettings: LifeEngineSettings } {
  const data = loadOnboardingData()
  if (!data || isRecordLocked(record)) {
    return { record, lifeEngineSettings: lifeSettings }
  }

  const vacation = data.profile.vacation
  const todayKey = getLocalDateKey()
  const inRange = shouldAutoActivateVacation(vacation, todayKey)
  const paused = isVacationPausedToday(vacation, todayKey)
  const shouldApply = vacation.active && inRange && !paused

  if (shouldApply) {
    const lifeEngineSettings: LifeEngineSettings = {
      ...lifeSettings,
      vacationModeEnabled: true,
      sickModeEnabled: false,
    }
    const updated = applyDayMode(
      record,
      createDayMode('vacation', {
        source: 'auto',
        confidence: 100,
        signals: ['vacation_scheduled'],
        userConfirmed: true,
      }),
    )
    return { record: updated, lifeEngineSettings }
  }

  if (paused && lifeSettings.vacationModeEnabled) {
    return {
      record,
      lifeEngineSettings: { ...lifeSettings, vacationModeEnabled: false },
    }
  }

  return { record, lifeEngineSettings: lifeSettings }
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
