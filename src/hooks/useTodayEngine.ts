import { useEffect } from 'react'
import { useDailyStore } from '@/modules/daily'

export function useTodayEngine() {
  const store = useDailyStore()

  useEffect(() => {
    if (!store.hydrated) {
      store.hydrate()
    }
  }, [store.hydrated, store.hydrate])

  return store
}
