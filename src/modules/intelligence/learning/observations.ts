import { MAX_OBSERVATIONS } from '../constants'
import type { IntelligenceEventSource, IntelligenceObservation } from '../types'

function observationId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function createObservation(
  kind: string,
  source: IntelligenceEventSource,
  payload: Record<string, unknown> = {},
  dateKey?: string,
): IntelligenceObservation {
  const now = new Date()
  const dk =
    dateKey ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return {
    id: observationId(),
    dateKey: dk,
    timestamp: now.toISOString(),
    source,
    kind,
    payload,
  }
}

export function appendObservation(
  observations: IntelligenceObservation[],
  obs: IntelligenceObservation,
): IntelligenceObservation[] {
  return [obs, ...observations].slice(0, MAX_OBSERVATIONS)
}

export function observationsForKind(
  observations: IntelligenceObservation[],
  kind: string,
): IntelligenceObservation[] {
  return observations.filter((o) => o.kind === kind)
}

export function observationsOnWeekday(
  observations: IntelligenceObservation[],
  weekday: string,
): IntelligenceObservation[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const target = days.indexOf(weekday)
  if (target < 0) return []
  return observations.filter((o) => {
    const d = new Date(o.dateKey + 'T12:00:00')
    return d.getDay() === target
  })
}
