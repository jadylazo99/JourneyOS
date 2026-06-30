import { DAILY_STORAGE_KEY, emptyLifeEngineSettings } from './constants'
import { createDayMode, normalizeDayRecord, syncDayModeToRecord } from './dayMode'
import type { DailyRecordsStore, DayRecord, NutritionDayState, WeighInState } from './types'
import { getDeviceTimezone, getLocalDateKey, isPastDateKey } from './date'

export function emptyNutritionDayState(): NutritionDayState {
  return { proteinGrams: 0, waterOz: 0 }
}

export function emptyWeighInState(): WeighInState {
  return {
    asked: false,
    logged: false,
    deferUntilHome: false,
  }
}

export function createDayRecord(timezone: string = getDeviceTimezone()): DayRecord {
  const now = new Date().toISOString()
  const dayMode = createDayMode('normal')
  return syncDayModeToRecord({
    dateKey: getLocalDateKey(),
    timezone,
    dayMode,
    dayType: 'normal',
    dayTypeSource: 'auto',
    consistencyEvents: [],
    weighIn: emptyWeighInState(),
    nutrition: emptyNutritionDayState(),
    flowStep: 'greeting',
    flowCompleted: false,
    detectedSignals: [],
    createdAt: now,
    updatedAt: now,
  })
}

export function emptyDailyStore(): DailyRecordsStore {
  const tz = getDeviceTimezone()
  return {
    records: {},
    homeTimezone: tz,
    lastKnownTimezone: tz,
    achievedMilestones: [],
    lifeEngineSettings: emptyLifeEngineSettings(),
  }
}

export function loadDailyStore(): DailyRecordsStore {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY)
    if (!raw) return emptyDailyStore()
    const parsed = { ...emptyDailyStore(), ...JSON.parse(raw) } as DailyRecordsStore
    const records: Record<string, DayRecord> = {}
    for (const [key, record] of Object.entries(parsed.records ?? {})) {
      records[key] = normalizeDayRecord(record as DayRecord)
    }
    return {
      ...parsed,
      records,
      lifeEngineSettings: {
        ...emptyLifeEngineSettings(),
        ...parsed.lifeEngineSettings,
      },
    }
  } catch {
    return emptyDailyStore()
  }
}

export function saveDailyStore(store: DailyRecordsStore): void {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(store))
  import('@/services/cloudSyncService').then(({ queueCloudSync }) => {
    queueCloudSync('daily')
  })
}

export function isRecordLocked(record: DayRecord): boolean {
  return isPastDateKey(record.dateKey)
}
