import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/modules/app/store'
import { signOutUser } from '@/services/authService'
import {
  getSyncStatus,
  subscribeSyncStatus,
  type SyncStatus,
} from '@/services/cloudSyncService'
import { CollapsibleSection } from './CollapsibleSection'

const SYNC_LABELS: Record<SyncStatus, string> = {
  idle: 'Ready to sync',
  syncing: 'Syncing…',
  synced: 'Backed up to cloud',
  offline: 'Offline — saved locally',
  error: 'Sync issue — saved locally',
  disabled: 'Cloud backup unavailable',
}

export function ProfileAccountSection() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus())

  useEffect(() => subscribeSyncStatus(setSyncStatus), [])

  const handleSignOut = async () => {
    await signOutUser()
    navigate('/auth/sign-in', { replace: true })
  }

  if (!user) return null

  return (
    <CollapsibleSection
      title="Account"
      description="Your JourneyOS profile is backed up to your account"
      defaultOpen
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue to-accent flex items-center justify-center text-sm font-semibold text-white">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{SYNC_LABELS[syncStatus]}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </CollapsibleSection>
  )
}
