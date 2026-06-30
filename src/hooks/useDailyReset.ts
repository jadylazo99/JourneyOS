import { useEffect, useRef } from 'react'
import { getLocalDateKey } from '@/modules/daily/date'
import { useDailyStore } from '@/modules/daily'

const CHECK_MS = 60_000

/**
 * Detects local midnight / date changes while the app is open.
 * Triggers hydrate() so a fresh Daily Record is created without overwriting past days.
 */
export function useDailyReset(): void {
  const hydrate = useDailyStore((s) => s.hydrate)
  const todayKey = useDailyStore((s) => s.todayRecord?.dateKey)
  const lastKeyRef = useRef<string | null>(null)

  useEffect(() => {
    lastKeyRef.current = todayKey ?? getLocalDateKey()
  }, [todayKey])

  useEffect(() => {
    const checkDate = () => {
      const now = getLocalDateKey()
      if (lastKeyRef.current && lastKeyRef.current !== now) {
        hydrate()
      }
      lastKeyRef.current = now
    }

    checkDate()
    const timer = window.setInterval(checkDate, CHECK_MS)
    document.addEventListener('visibilitychange', checkDate)
    window.addEventListener('focus', checkDate)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', checkDate)
      window.removeEventListener('focus', checkDate)
    }
  }, [hydrate])
}
