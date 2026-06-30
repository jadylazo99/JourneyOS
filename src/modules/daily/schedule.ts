import type { WorkSchedule } from '@/modules/onboarding/types'

export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type DayPhase =
  | 'before_work'
  | 'during_work'
  | 'after_work'
  | 'rest_day_morning'
  | 'rest_day'
  | 'evening'

export type WorkBlock = {
  label: string
  startTime: string
  endTime: string
  display: string
}

export function getTodayWeekdayName(date: Date = new Date()): string {
  return WEEKDAY_NAMES[date.getDay()]
}

export function isWorkDayToday(schedule: WorkSchedule, date: Date = new Date()): boolean {
  if (!schedule.works || schedule.days.length === 0) return false
  return schedule.days.includes(getTodayWeekdayName(date))
}

export function parseTimeToMinutes(time: string): number | null {
  if (!time || !time.includes(':')) return null
  const [h, m] = time.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return null
  return h * 60 + m
}

export function getCurrentMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes()
}

export function formatTime12h(time: string): string {
  const minutes = parseTimeToMinutes(time)
  if (minutes === null) return time
  const h24 = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

export function getEffectiveEndTime(schedule: WorkSchedule): string {
  if (schedule.variability === 'sometimes_late' && schedule.latestEndTime) {
    return schedule.latestEndTime
  }
  return schedule.endTime
}

export function getWorkBlock(schedule: WorkSchedule, date: Date = new Date()): WorkBlock | null {
  if (!isWorkDayToday(schedule, date) || !schedule.startTime || !schedule.endTime) {
    return null
  }

  const endTime = getEffectiveEndTime(schedule)
  return {
    label: 'Protected work block',
    startTime: schedule.startTime,
    endTime,
    display: `${formatTime12h(schedule.startTime)} – ${formatTime12h(endTime)}`,
  }
}

export function getDayPhase(
  schedule: WorkSchedule,
  wakeUpTime: string,
  bedtime: string,
  date: Date = new Date(),
): DayPhase {
  const now = getCurrentMinutes(date)

  if (!isWorkDayToday(schedule, date)) {
    const wake = parseTimeToMinutes(wakeUpTime) ?? 7 * 60
    const bed = parseTimeToMinutes(bedtime) ?? 22 * 60
    if (now >= bed || now < 5 * 60) return 'evening'
    if (now < wake) return 'rest_day_morning'
    return 'rest_day'
  }

  const start = parseTimeToMinutes(schedule.startTime)
  const end = parseTimeToMinutes(getEffectiveEndTime(schedule))
  const wake = parseTimeToMinutes(wakeUpTime) ?? 7 * 60
  const bed = parseTimeToMinutes(bedtime) ?? 22 * 60

  if (start === null || end === null) return 'before_work'
  if (now >= bed || now < 5 * 60) return 'evening'
  if (now < wake) return 'before_work'
  if (now < start) return 'before_work'
  if (now >= start && now < end) return 'during_work'
  if (now >= end) return 'after_work'
  return 'before_work'
}

export type ScheduleContext = {
  phase: DayPhase
  isWorkDay: boolean
  workBlock: WorkBlock | null
  petName: string | null
  gymAccess: boolean
}

export function buildScheduleContext(
  schedule: WorkSchedule,
  wakeUpTime: string,
  bedtime: string,
  petName: string | null,
  gymAccess: boolean,
  date: Date = new Date(),
): ScheduleContext {
  return {
    phase: getDayPhase(schedule, wakeUpTime, bedtime, date),
    isWorkDay: isWorkDayToday(schedule, date),
    workBlock: getWorkBlock(schedule, date),
    petName,
    gymAccess,
  }
}

export function getScheduledFocus(
  _dayType: string,
  ctx: ScheduleContext,
  firstName: string,
): string {
  if (ctx.isWorkDay && ctx.workBlock) {
    if (ctx.phase === 'before_work') {
      return `${firstName}, work starts at ${formatTime12h(ctx.workBlock.startTime)}. Ease into your morning first.`
    }
    if (ctx.phase === 'during_work') {
      return `You're in your protected work block. Keep it sustainable — hydrate and move when you can.`
    }
    if (ctx.phase === 'after_work') {
      return `Work is done for today. Shift into what restores you.`
    }
  }

  if (!ctx.isWorkDay) {
    if (ctx.phase === 'rest_day_morning') {
      return `${firstName}, no work today. Start slow — rest days still count.`
    }
    return `It's a rest day. Recovery is progress. You've earned this pace.`
  }

  return `${firstName}, today is about steady progress. Small steps still count.`
}

export function getScheduledNextAction(
  ctx: ScheduleContext,
  mainGoal: string,
): { title: string; body: string } {
  const pet = ctx.petName

  if (ctx.isWorkDay) {
    switch (ctx.phase) {
      case 'before_work':
        return {
          title: 'Morning routine',
          body: 'Wake up gently, hydrate, and set one intention before work begins.',
        }
      case 'during_work':
        return {
          title: 'Low-friction check-in',
          body: 'Drink water, step away for lunch, and take a brief movement break.',
        }
      case 'after_work':
        return {
          title: pet ? `Walk ${pet}` : 'Evening reset',
          body: ctx.gymAccess
            ? 'Consider a workout, plan dinner, and wind down with a night check-in.'
            : pet
              ? `Walk ${pet}, enjoy dinner, and close the day with a calm check-in.`
              : 'Plan dinner, move your body, and wind down with a night check-in.',
        }
      case 'evening':
        return {
          title: 'Night check-in',
          body: 'Reflect lightly on today. No pressure — just notice what went well.',
        }
      default:
        break
    }
  }

  switch (ctx.phase) {
    case 'rest_day_morning':
      return {
        title: 'Slow start',
        body: 'No schedule to protect. Enjoy an unhurried morning.',
      }
    case 'rest_day':
      return {
        title: pet ? `Time with ${pet}` : 'Restore intentionally',
        body: pet
          ? `A walk with ${pet}, something you enjoy, or simply rest.`
          : 'A walk, a stretch, or stillness — whatever your body needs.',
      }
    case 'evening':
      return {
        title: 'Wind down',
        body: 'Ease into your evening routine. Tomorrow starts fresh.',
      }
    default:
      return {
        title: 'Take one meaningful step',
        body: mainGoal
          ? `Move toward: ${mainGoal}`
          : 'Pick one thing that matters and give it five minutes.',
      }
  }
}
