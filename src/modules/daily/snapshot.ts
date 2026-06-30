import { computeMomentum } from './guided'
import type { DayRecord, DaySnapshot } from './types'

export function buildDaySnapshot(record: DayRecord): DaySnapshot {
  const tasks = record.guidedFlow?.tasks ?? []
  const momentum = computeMomentum(tasks)

  return {
    momentumScore: momentum.score,
    momentumPossible: momentum.possible,
    tasksCompleted: momentum.completedCount,
    tasksTotal: momentum.totalCount,
    dayMode: record.dayMode.mode,
    updatedAt: new Date().toISOString(),
  }
}

export function withDaySnapshot(record: DayRecord): DayRecord {
  if (!record.guidedFlow?.tasks.length) return record
  return { ...record, snapshot: buildDaySnapshot(record) }
}
