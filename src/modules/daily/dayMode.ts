import type { DayMode, DayModeId, DayRecord } from './types'

export function createDayMode(
  mode: DayModeId = 'normal',
  partial?: Partial<DayMode>,
): DayMode {
  return {
    mode,
    source: 'auto',
    confidence: 85,
    signals: [],
    userConfirmed: false,
    ...partial,
  }
}

export function syncDayModeToRecord(record: DayRecord): DayRecord {
  return {
    ...record,
    dayType: record.dayMode.mode,
    dayTypeSource: record.dayMode.source,
    detectedSignals: record.dayMode.signals,
  }
}

export function applyDayMode(record: DayRecord, dayMode: DayMode): DayRecord {
  return syncDayModeToRecord({
    ...record,
    dayMode,
    updatedAt: new Date().toISOString(),
  })
}

export function normalizeDayRecord(record: DayRecord): DayRecord {
  const normalized = record.nutrition
    ? record
    : { ...record, nutrition: { proteinGrams: 0, waterOz: 0 } }

  if (normalized.dayMode) {
    return syncDayModeToRecord(normalized)
  }

  const legacy = normalized as DayRecord & {
    travelPromptAnswered?: boolean
    dayType?: DayModeId
    dayTypeSource?: 'auto' | 'user'
    detectedSignals?: string[]
  }

  const dayMode = createDayMode(legacy.dayType ?? 'normal', {
    source: legacy.dayTypeSource ?? 'auto',
    confidence: legacy.dayTypeSource === 'user' ? 100 : 85,
    signals: legacy.detectedSignals ?? [],
    userConfirmed:
      legacy.dayTypeSource === 'user' || legacy.travelPromptAnswered === true,
  })

  return syncDayModeToRecord({ ...normalized, dayMode })
}