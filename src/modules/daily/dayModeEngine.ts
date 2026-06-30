import { isWeekend } from './date'
import { getTodayWeekdayName, isWorkDayToday } from './schedule'
import type { WorkSchedule } from '@/modules/onboarding/types'
import type {
  DayMode,
  DayModeId,
  DayRecord,
  LifeEngineSettings,
  ModeInferenceResult,
} from './types'

export type InferenceContext = {
  settings: LifeEngineSettings
  homeTimezone: string
  currentTimezone: string
  workSchedule?: WorkSchedule
  pastRecords: DayRecord[]
  date?: Date
}

function hasCompleteWorkSchedule(schedule: WorkSchedule): boolean {
  return (
    schedule.works &&
    schedule.days.length > 0 &&
    schedule.startTime.length > 0 &&
    schedule.endTime.length > 0
  )
}

function inferFromBehavior(
  pastRecords: DayRecord[],
  date: Date,
): ModeInferenceResult | null {
  const weekday = getTodayWeekdayName(date)
  const relevant = pastRecords.filter((r) => {
    const d = new Date(r.dateKey + 'T12:00:00')
    return getTodayWeekdayName(d) === weekday && r.dayMode.userConfirmed
  })

  if (relevant.length === 0) return null

  const counts = new Map<DayModeId, number>()
  for (const r of relevant.slice(0, 8)) {
    const m = r.dayMode.mode
    counts.set(m, (counts.get(m) ?? 0) + 1)
  }

  let best: DayModeId = 'normal'
  let bestCount = 0
  for (const [mode, count] of counts) {
    if (count > bestCount) {
      best = mode
      bestCount = count
    }
  }

  const confidence = Math.min(89, 70 + bestCount * 4)
  return {
    mode: best,
    confidence,
    signals: ['previous_behavior'],
    reason: `You often choose ${best} on ${weekday}s.`,
  }
}

export function inferDayMode(ctx: InferenceContext): ModeInferenceResult {
  const date = ctx.date ?? new Date()

  if (ctx.settings.vacationModeEnabled) {
    return {
      mode: 'vacation',
      confidence: 100,
      signals: ['vacation_mode_enabled'],
      reason: 'Vacation mode is enabled.',
    }
  }

  if (ctx.currentTimezone !== ctx.homeTimezone) {
    return {
      mode: 'travel',
      confidence: 94,
      signals: ['timezone_change', 'travel_detected'],
      reason: 'New timezone detected.',
    }
  }

  if (ctx.settings.sickModeEnabled) {
    return {
      mode: 'sick',
      confidence: 100,
      signals: ['sick_mode_enabled'],
      reason: 'Sick mode is enabled.',
    }
  }

  if (ctx.workSchedule && isWorkDayToday(ctx.workSchedule, date)) {
    const complete = hasCompleteWorkSchedule(ctx.workSchedule)
    return {
      mode: 'busy_workday',
      confidence: complete ? 92 : 86,
      signals: ['work_schedule', 'workday'],
      reason: 'Today is on your work schedule.',
    }
  }

  if (isWeekend(date)) {
    return {
      mode: 'rest',
      confidence: 88,
      signals: ['weekend'],
      reason: "It's the weekend.",
    }
  }

  const behavior = inferFromBehavior(ctx.pastRecords, date)
  if (behavior) return behavior

  return {
    mode: 'normal',
    confidence: 87,
    signals: ['default'],
    reason: 'A standard day ahead.',
  }
}

export function shouldPromptForMode(dayMode: DayMode): boolean {
  if (dayMode.userConfirmed) return false
  return dayMode.confidence < 90
}

export function confirmDayMode(
  current: DayMode,
  mode: DayModeId,
  source: 'user' = 'user',
): DayMode {
  return {
    mode,
    source,
    confidence: 100,
    signals: [...current.signals, 'user_confirmed'],
    userConfirmed: true,
    confirmedAt: new Date().toISOString(),
  }
}
