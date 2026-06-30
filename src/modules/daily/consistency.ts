import { CONSISTENCY_POINTS } from './constants'
import type { ConsistencyEvent, ConsistencyEventType, DayRecord } from './types'

export function createConsistencyEvent(type: ConsistencyEventType): ConsistencyEvent {
  return {
    id: `${type}-${Date.now()}`,
    type,
    timestamp: new Date().toISOString(),
    points: CONSISTENCY_POINTS[type] ?? 5,
  }
}

export function addConsistencyEvent(
  record: DayRecord,
  type: ConsistencyEventType,
): DayRecord {
  const exists = record.consistencyEvents.some((e) => e.type === type)
  if (exists && type === 'opened_app') return record

  return {
    ...record,
    consistencyEvents: [...record.consistencyEvents, createConsistencyEvent(type)],
    updatedAt: new Date().toISOString(),
  }
}

export function getDayConsistencyScore(record: DayRecord): number {
  return record.consistencyEvents.reduce((sum, e) => sum + e.points, 0)
}

export function getRollingConsistencyScore(records: DayRecord[], days = 7): number {
  const sorted = [...records]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .slice(0, days)

  return sorted.reduce((sum, r) => sum + getDayConsistencyScore(r), 0)
}

export function getConsistencyHighlights(record: DayRecord): string[] {
  const labels: Record<ConsistencyEventType, string> = {
    opened_app: 'Opened JourneyOS',
    logged_weight: 'Logged weight',
    skipped_weigh_in: 'Checked in on health',
    completed_flow: 'Completed daily flow',
    walked_pet: 'Walked your pet',
    completed_workout: 'Completed workout',
    studied: 'Studied',
    drank_water: 'Drank water',
  }

  return record.consistencyEvents.map((e) => labels[e.type] ?? e.type)
}
