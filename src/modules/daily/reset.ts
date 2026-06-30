import { getDeviceTimezone, getLocalDateKey } from './date'
import { loadDailyStore, saveDailyStore } from './storage'

/** Re-open weigh-in when user returns to home timezone after deferUntilHome. */
export function reconcileTravelWeighIn(
  homeTimezone: string,
  currentTimezone: string = getDeviceTimezone(),
): void {
  const store = loadDailyStore()
  const todayKey = getLocalDateKey()
  const record = store.records[todayKey]
  if (!record?.weighIn.deferUntilHome) return
  if (homeTimezone !== currentTimezone) return

  store.records[todayKey] = {
    ...record,
    weighIn: {
      ...record.weighIn,
      asked: false,
      deferUntilHome: false,
      skipped: undefined,
    },
    updatedAt: new Date().toISOString(),
  }
  saveDailyStore(store)
}

/** When user is back at home timezone after travel, keep homeTimezone stable. */
export function syncHomeTimezoneAfterTravel(): void {
  const store = loadDailyStore()
  const current = getDeviceTimezone()
  if (store.lastKnownTimezone !== current && store.homeTimezone === current) {
    store.lastKnownTimezone = current
    saveDailyStore(store)
  }
}

export function getStoredTodayKey(): string | null {
  const store = loadDailyStore()
  const today = getLocalDateKey()
  return store.records[today]?.dateKey ?? null
}

export function hasDateChanged(storedDateKey: string | null): boolean {
  if (!storedDateKey) return false
  return storedDateKey !== getLocalDateKey()
}
