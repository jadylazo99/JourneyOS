import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

function readFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  }
}

export function isFirebaseConfigured(): boolean {
  const config = readFirebaseConfig()
  return Boolean(config.apiKey && config.projectId && config.authDomain && config.appId)
}

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseDb: Firestore | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null
  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(readFirebaseConfig())
  }
  return firebaseApp
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) return null
  if (!firebaseAuth) firebaseAuth = getAuth(app)
  return firebaseAuth
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp()
  if (!app) return null
  if (!firebaseDb) firebaseDb = getFirestore(app)
  return firebaseDb
}
