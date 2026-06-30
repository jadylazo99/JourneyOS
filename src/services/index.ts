export { isFirebaseConfigured, getFirebaseApp, getFirebaseAuth, getFirebaseDb } from './firebase'
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  handleAuthenticatedUser,
  subscribeToAuthChanges,
  getCurrentAuthUserId,
  AuthServiceError,
} from './authService'
export type { AuthSessionResult, AuthErrorCode } from './authService'
export {
  queueCloudSync,
  startCloudSyncListeners,
  stopCloudSyncListeners,
  pushLocalDataToCloud,
  pullCloudDataToLocal,
  hasLocalJourneyData,
  hasRemoteJourneyData,
  getSyncStatus,
  subscribeSyncStatus,
  initOfflineSyncRecovery,
} from './cloudSyncService'
export type { SyncStatus } from './cloudSyncService'
