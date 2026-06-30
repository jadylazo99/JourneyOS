import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentReference,
} from 'firebase/firestore'
import { ONBOARDING_STORAGE_KEY } from '@/modules/onboarding/constants'
import { DAILY_STORAGE_KEY } from '@/modules/daily/constants'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { loadDailyStore } from '@/modules/daily/storage'
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebase'

function getCurrentUserId(): string | null {
  return getFirebaseAuth()?.currentUser?.uid ?? null
}

const SYNC_PENDING_KEY = 'journeyos_sync_pending'
const SYNC_DEBOUNCE_MS = 1500

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error' | 'disabled'

type SyncListener = (status: SyncStatus) => void

let activeUserId: string | null = null
let syncTimer: ReturnType<typeof setTimeout> | null = null
let listeners: SyncListener[] = []
let currentStatus: SyncStatus = isFirebaseConfigured() ? 'idle' : 'disabled'

function setSyncStatus(status: SyncStatus) {
  currentStatus = status
  listeners.forEach((listener) => listener(status))
}

export function getSyncStatus(): SyncStatus {
  return currentStatus
}

export function subscribeSyncStatus(listener: SyncListener): () => void {
  listeners.push(listener)
  listener(currentStatus)
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

function userDocRef(userId: string, docName: 'profile' | 'daily' | 'meta'): DocumentReference | null {
  const db = getFirebaseDb()
  if (!db) return null
  return doc(db, 'users', userId, 'data', docName)
}

function markSyncPending() {
  localStorage.setItem(SYNC_PENDING_KEY, 'true')
}

function clearSyncPending() {
  localStorage.removeItem(SYNC_PENDING_KEY)
}

function isSyncPending(): boolean {
  return localStorage.getItem(SYNC_PENDING_KEY) === 'true'
}

export function hasLocalJourneyData(): boolean {
  const profile = loadOnboardingData()
  const daily = loadDailyStore()
  const hasProfile = Boolean(profile?.profile?.firstName || profile?.onboardingComplete)
  const hasDaily = Object.keys(daily.records ?? {}).length > 0
  return hasProfile || hasDaily
}

export async function hasRemoteJourneyData(userId: string): Promise<boolean> {
  const profileRef = userDocRef(userId, 'profile')
  if (!profileRef) return false
  const snapshot = await getDoc(profileRef)
  return snapshot.exists()
}

export async function pushLocalDataToCloud(userId: string): Promise<void> {
  if (!isFirebaseConfigured() || !navigator.onLine) {
    markSyncPending()
    setSyncStatus('offline')
    return
  }

  const db = getFirebaseDb()
  if (!db) return

  setSyncStatus('syncing')

  try {
    const profile = loadOnboardingData()
    const daily = loadDailyStore()
    const profileRef = userDocRef(userId, 'profile')
    const dailyRef = userDocRef(userId, 'daily')
    const metaRef = userDocRef(userId, 'meta')

    if (profileRef) {
      await setDoc(profileRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      })
    }

    if (dailyRef) {
      await setDoc(dailyRef, {
        ...daily,
        updatedAt: serverTimestamp(),
      })
    }

    if (metaRef) {
      await setDoc(
        metaRef,
        {
          lastSyncedAt: serverTimestamp(),
          clientUpdatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
    }

    clearSyncPending()
    setSyncStatus('synced')
  } catch {
    markSyncPending()
    setSyncStatus('error')
    throw new Error('Cloud sync failed')
  }
}

export async function pullCloudDataToLocal(userId: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return false

  const profileRef = userDocRef(userId, 'profile')
  const dailyRef = userDocRef(userId, 'daily')
  if (!profileRef || !dailyRef) return false

  const [profileSnap, dailySnap] = await Promise.all([getDoc(profileRef), getDoc(dailyRef)])

  if (profileSnap.exists()) {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profileSnap.data()))
  }

  if (dailySnap.exists()) {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(dailySnap.data()))
  }

  return profileSnap.exists() || dailySnap.exists()
}

export async function applyCloudDataToLocal(userId: string): Promise<void> {
  setSyncStatus('syncing')
  try {
    await pullCloudDataToLocal(userId)
    clearSyncPending()
    setSyncStatus('synced')
    rehydrateStoresFromLocal()
  } catch {
    setSyncStatus('error')
    throw new Error('Could not restore cloud backup')
  }
}

function rehydrateStoresFromLocal() {
  import('@/modules/profile/store').then(({ useProfileStore }) => {
    useProfileStore.getState().hydrate()
  })
  import('@/modules/onboarding/store').then(({ useOnboardingStore }) => {
    useOnboardingStore.getState().hydrate()
  })
  import('@/modules/daily/store').then(({ useDailyStore }) => {
    useDailyStore.getState().hydrate()
  })
}

function scheduleDebouncedSync() {
  if (!activeUserId) return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    void pushLocalDataToCloud(activeUserId!)
  }, SYNC_DEBOUNCE_MS)
}

export function queueCloudSync(source: 'profile' | 'daily') {
  void source
  const userId = activeUserId ?? getCurrentUserId()
  if (!userId || !isFirebaseConfigured()) return

  if (!navigator.onLine) {
    markSyncPending()
    setSyncStatus('offline')
    return
  }

  scheduleDebouncedSync()
}

export function startCloudSyncListeners(userId: string) {
  activeUserId = userId
  setSyncStatus(navigator.onLine ? 'idle' : 'offline')

  if (isSyncPending() && navigator.onLine) {
    void pushLocalDataToCloud(userId)
  }
}

export function stopCloudSyncListeners() {
  activeUserId = null
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = null
  setSyncStatus(isFirebaseConfigured() ? 'idle' : 'disabled')
}

export function initOfflineSyncRecovery() {
  window.addEventListener('online', () => {
    const userId = activeUserId ?? getCurrentUserId()
    if (!userId) return
    if (isSyncPending()) {
      void pushLocalDataToCloud(userId)
    }
  })
}
