export type NavItem = {
  label: string
  path: string
  icon: 'today' | 'progress' | 'journey' | 'resources' | 'profile'
}

export type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export type AppState = {
  isInitialized: boolean
  user: User | null
}
