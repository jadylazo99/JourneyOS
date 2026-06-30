import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'
import { useAppStore } from '@/modules/app/store'
import type { User } from '@/types'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase'
import {
  applyCloudDataToLocal,
  hasLocalJourneyData,
  hasRemoteJourneyData,
  pushLocalDataToCloud,
  startCloudSyncListeners,
  stopCloudSyncListeners,
} from './cloudSyncService'

export type AuthErrorCode =
  | 'not-configured'
  | 'invalid-email'
  | 'wrong-password'
  | 'user-not-found'
  | 'email-in-use'
  | 'weak-password'
  | 'network'
  | 'popup-closed'
  | 'unknown'

export class AuthServiceError extends Error {
  code: AuthErrorCode

  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

let persistenceReady = false

async function ensureAuthPersistence(auth: Auth): Promise<void> {
  if (persistenceReady) return
  await setPersistence(auth, browserLocalPersistence)
  persistenceReady = true
}

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    id: user.uid,
    name: user.displayName ?? user.email?.split('@')[0] ?? 'Traveler',
    email: user.email ?? '',
    avatarUrl: user.photoURL ?? undefined,
  }
}

function mapAuthError(error: unknown): AuthServiceError {
  const code = (error as { code?: string })?.code ?? ''
  switch (code) {
    case 'auth/invalid-email':
      return new AuthServiceError('invalid-email', 'Please enter a valid email address.')
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new AuthServiceError('wrong-password', 'Incorrect email or password.')
    case 'auth/user-not-found':
      return new AuthServiceError('user-not-found', 'No account found with that email.')
    case 'auth/email-already-in-use':
      return new AuthServiceError('email-in-use', 'An account with this email already exists.')
    case 'auth/weak-password':
      return new AuthServiceError('weak-password', 'Password must be at least 6 characters.')
    case 'auth/network-request-failed':
      return new AuthServiceError('network', 'Network error. Check your connection and try again.')
    case 'auth/popup-closed-by-user':
      return new AuthServiceError('popup-closed', 'Sign in was cancelled.')
    default:
      return new AuthServiceError('unknown', 'Something went wrong. Please try again.')
  }
}

function requireAuth() {
  const auth = getFirebaseAuth()
  if (!auth) {
    throw new AuthServiceError(
      'not-configured',
      'Firebase is not configured. Add your Firebase environment variables.',
    )
  }
  return auth
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const auth = requireAuth()
  await ensureAuthPersistence(auth)
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
    return mapFirebaseUser(credential.user)
  } catch (error) {
    throw mapAuthError(error)
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = requireAuth()
  await ensureAuthPersistence(auth)
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
    return mapFirebaseUser(credential.user)
  } catch (error) {
    throw mapAuthError(error)
  }
}

export async function signInWithGoogle(): Promise<User> {
  const auth = requireAuth()
  await ensureAuthPersistence(auth)
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const credential = await signInWithPopup(auth, provider)
    return mapFirebaseUser(credential.user)
  } catch (error) {
    throw mapAuthError(error)
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth()
  if (!auth) return
  stopCloudSyncListeners()
  await signOut(auth)
  useAppStore.getState().setUser(null)
}

export async function sendPasswordReset(email: string): Promise<void> {
  const auth = requireAuth()
  try {
    await sendPasswordResetEmail(auth, email.trim())
  } catch (error) {
    throw mapAuthError(error)
  }
}

export type AuthSessionResult = 'restored-from-cloud' | 'migrated-local' | 'ready'

export async function handleAuthenticatedUser(userId: string): Promise<AuthSessionResult> {
  const remoteExists = await hasRemoteJourneyData(userId)
  const localExists = hasLocalJourneyData()

  if (remoteExists) {
    await applyCloudDataToLocal(userId)
    startCloudSyncListeners(userId)
    return 'restored-from-cloud'
  }

  if (localExists) {
    await pushLocalDataToCloud(userId)
    startCloudSyncListeners(userId)
    return 'migrated-local'
  }

  startCloudSyncListeners(userId)
  return 'ready'
}

export function subscribeToAuthChanges(onReady?: () => void): () => void {
  if (!isFirebaseConfigured()) {
    useAppStore.getState().setInitialized(true)
    onReady?.()
    return () => {}
  }

  const auth = getFirebaseAuth()
  if (!auth) {
    useAppStore.getState().setInitialized(true)
    onReady?.()
    return () => {}
  }

  void ensureAuthPersistence(auth)

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      useAppStore.getState().setUser(mapFirebaseUser(firebaseUser))
      try {
        await handleAuthenticatedUser(firebaseUser.uid)
      } catch {
        startCloudSyncListeners(firebaseUser.uid)
      }
    } else {
      stopCloudSyncListeners()
      useAppStore.getState().setUser(null)
    }
    useAppStore.getState().setInitialized(true)
    onReady?.()
  })
}

export function getCurrentAuthUserId(): string | null {
  return getFirebaseAuth()?.currentUser?.uid ?? null
}
