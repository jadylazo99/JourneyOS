import { getLocalDateKey } from '@/modules/daily/date'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { shouldDeliverNotification } from './preferences'
import type { NotificationKind, ScheduledNotification } from '../types'
import type { NotificationPreferences } from '../types'

function scheduleId(kind: NotificationKind, dateKey: string): string {
  return `sched_${kind}_${dateKey}`
}

function atTimeToday(time: string, date = new Date()): string | null {
  const m = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const d = new Date(date)
  d.setHours(Number(m[1]), Number(m[2]), 0, 0)
  return d.toISOString()
}

export function buildDailyNotificationSchedule(
  prefs: NotificationPreferences,
  dateKey = getLocalDateKey(),
): ScheduledNotification[] {
  const profile = loadOnboardingData()?.profile
  if (!profile) return []

  const isWeekend = (() => {
    const d = new Date(dateKey + 'T12:00:00')
    const day = d.getDay()
    return day === 0 || day === 6
  })()

  const isVacation = profile.vacation.active
  const scheduled: ScheduledNotification[] = []

  const add = (kind: NotificationKind, title: string, body: string, time: string) => {
    if (!shouldDeliverNotification(prefs, kind, { isWeekend, isVacation })) return
    const at = atTimeToday(time, new Date(dateKey + 'T12:00:00'))
    if (!at) return
    scheduled.push({
      id: scheduleId(kind, dateKey),
      kind,
      title,
      body,
      scheduledFor: at,
      dateKey,
      dismissed: false,
    })
  }

  add('morning_greeting', 'Good morning', `Ready when you are, ${profile.firstName || 'friend'}.`, profile.wakeUpTime || '07:30')
  add('water', 'Water check-in', 'A sip counts. Hydration is momentum.', '10:00')
  add('workout', 'Movement', 'Your workout window is open — gentle counts.', profile.fitness.workoutTime || '17:00')
  add('protein', 'Protein reminder', 'Fuel that supports your goal.', '13:00')
  add('night_reflection', 'Evening reflection', 'What felt good today?', profile.bedtime || '21:30')

  if (profile.hasPets && profile.pets.length > 0) {
    const petName = profile.pets[0]?.name?.trim() || 'your pet'
    add('pet', 'Pet care', `${petName} might appreciate a walk or check-in.`, '08:00')
  }

  return scheduled
}

export function getDueNotifications(
  scheduled: ScheduledNotification[],
  now = new Date(),
): ScheduledNotification[] {
  return scheduled.filter((n) => !n.dismissed && new Date(n.scheduledFor) <= now)
}
