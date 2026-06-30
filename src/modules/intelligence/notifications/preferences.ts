import type { NotificationKind, NotificationPreferences } from '../types'

export function isQuietHours(prefs: NotificationPreferences, now = new Date()): boolean {
  const start = parseTime(prefs.quietHoursStart)
  const end = parseTime(prefs.quietHoursEnd)
  if (start === null || end === null) return false
  const mins = now.getHours() * 60 + now.getMinutes()
  if (start <= end) {
    return mins >= start && mins < end
  }
  return mins >= start || mins < end
}

function parseTime(time: string): number | null {
  const m = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

export function shouldDeliverNotification(
  prefs: NotificationPreferences,
  kind: NotificationKind,
  options: {
    isWeekend?: boolean
    isVacation?: boolean
    now?: Date
  } = {},
): boolean {
  if (!prefs.enabled) return false
  if (!prefs.kinds[kind]) return false
  const now = options.now ?? new Date()
  if (isQuietHours(prefs, now)) return false
  if (options.isWeekend && !prefs.weekendsEnabled) return false
  if (options.isVacation && !prefs.vacationEnabled) return false
  return true
}

export function reducedVacationNotifications(
  prefs: NotificationPreferences,
): NotificationPreferences {
  return {
    ...prefs,
    vacationEnabled: false,
    kinds: {
      ...prefs.kinds,
      workout: false,
      protein: false,
      meal: false,
      morning_greeting: true,
      night_reflection: true,
      travel: true,
    },
  }
}

export function restoreNotificationPreferences(
  prefs: NotificationPreferences,
  saved: NotificationPreferences,
): NotificationPreferences {
  return { ...saved, ...prefs }
}
