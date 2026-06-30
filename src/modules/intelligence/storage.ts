import { INTELLIGENCE_STORAGE_KEY } from './constants'
import type {
  IntelligenceStoreData,
  NotificationPreferences,
  TravelIntelligenceState,
} from './types'

export function defaultNotificationPreferences(): NotificationPreferences {
  return {
    enabled: true,
    kinds: {
      workout: true,
      meal: true,
      water: true,
      protein: true,
      pet: true,
      study: true,
      finance: true,
      travel: true,
      medication: true,
      appointment: true,
      morning_greeting: true,
      night_reflection: true,
    },
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    weekendsEnabled: true,
    vacationEnabled: false,
    timezoneAware: true,
  }
}

export function defaultTravelState(): TravelIntelligenceState {
  return {
    neverAskAgain: false,
    lastResponse: null,
    lastTimezone: '',
    lastCountryLabel: '',
    lastPromptDateKey: '',
    answeredAt: '',
  }
}

export function emptyIntelligenceStore(): IntelligenceStoreData {
  return {
    observations: [],
    patterns: [],
    travel: defaultTravelState(),
    notifications: defaultNotificationPreferences(),
    notificationsBaseline: null,
    scheduledNotifications: [],
    reviewsSeen: { weekly: [], monthly: [] },
    lastKnownDateKey: '',
  }
}

export function loadIntelligenceStore(): IntelligenceStoreData {
  try {
    const raw = localStorage.getItem(INTELLIGENCE_STORAGE_KEY)
    if (!raw) return emptyIntelligenceStore()
    const parsed = JSON.parse(raw) as Partial<IntelligenceStoreData>
    const base = emptyIntelligenceStore()
    return {
      ...base,
      ...parsed,
      travel: { ...base.travel, ...parsed.travel },
      notifications: {
        ...base.notifications,
        ...parsed.notifications,
        kinds: { ...base.notifications.kinds, ...parsed.notifications?.kinds },
      },
      notificationsBaseline: parsed.notificationsBaseline ?? null,
      lastKnownDateKey: parsed.lastKnownDateKey ?? '',
      reviewsSeen: {
        weekly: parsed.reviewsSeen?.weekly ?? [],
        monthly: parsed.reviewsSeen?.monthly ?? [],
      },
    }
  } catch {
    return emptyIntelligenceStore()
  }
}

export function saveIntelligenceStore(data: IntelligenceStoreData): void {
  localStorage.setItem(INTELLIGENCE_STORAGE_KEY, JSON.stringify(data))
}
