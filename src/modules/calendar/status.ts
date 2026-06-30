import { getDayConsistencyScore } from '@/modules/daily/consistency'
import { getLocalDateKey, isPastDateKey } from '@/modules/daily/date'
import { isScheduledVacationDay } from '@/modules/intelligence/vacation/engine'
import type { DayRecord } from '@/modules/daily/types'
import type { DayStatus, DayStatusConfig } from './types'

const PLANNED_MODES = new Set(['rest', 'recovery', 'sick'])
const TRAVEL_MODES = new Set(['vacation', 'travel'])

export const DAY_STATUS_CONFIG: Record<DayStatus, DayStatusConfig> = {
  strong: {
    status: 'strong',
    label: 'Strong day',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.18)',
  },
  vacation: {
    status: 'vacation',
    label: 'Vacation / travel',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.18)',
  },
  rest: {
    status: 'rest',
    label: 'Rest / recovery',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.18)',
  },
  empty: {
    status: 'empty',
    label: 'No data',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.12)',
  },
  missed: {
    status: 'missed',
    label: 'Missed',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
  },
}

export function getDayStatus(
  record: DayRecord | null | undefined,
  dateKey: string,
): DayStatus {
  const today = getLocalDateKey()

  if (dateKey > today) return 'empty'

  if (isScheduledVacationDay(dateKey)) return 'vacation'

  if (!record) return 'empty'

  const mode = record.dayMode.mode
  if (TRAVEL_MODES.has(mode)) return 'vacation'
  if (PLANNED_MODES.has(mode)) return 'rest'

  const score = record.snapshot?.momentumScore ?? getDayConsistencyScore(record)
  const engaged =
    score >= 15 ||
    record.flowCompleted ||
    record.weighIn.logged ||
    record.consistencyEvents.some((e) =>
      ['completed_workout', 'walked_pet', 'logged_weight', 'completed_flow'].includes(e.type),
    )

  if (engaged) return 'strong'

  if (isPastDateKey(dateKey) && dateKey !== today) {
    const openedOnly =
      record.consistencyEvents.length <= 1 &&
      record.consistencyEvents.every((e) => e.type === 'opened_app')
    if (openedOnly && !record.flowCompleted) return 'missed'
  }

  if (dateKey === today) {
    if (record.snapshot && record.snapshot.momentumScore > 0) return 'strong'
    if (score > 0) return 'strong'
    return 'empty'
  }

  return score > 0 ? 'strong' : 'empty'
}

export function getDayStatusConfig(
  record: DayRecord | null | undefined,
  dateKey: string,
): DayStatusConfig {
  return DAY_STATUS_CONFIG[getDayStatus(record, dateKey)]
}
