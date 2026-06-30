import { create } from 'zustand'
import type { AppState, User } from '@/types'

interface AppStore extends AppState {
  setInitialized: (value: boolean) => void
  setUser: (user: User | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  isInitialized: false,
  user: null,
  setInitialized: (value) => set({ isInitialized: value }),
  setUser: (user) => set({ user }),
}))
