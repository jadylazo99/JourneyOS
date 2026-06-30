import { useEffect } from 'react'
import { useDailyStore } from '@/modules/daily'
import { TodayBackground, TodayAchievementBanner, GuidedToday } from '@/components/today'

export function TodayPage() {
  const hydrated = useDailyStore((s) => s.hydrated)
  const hydrate = useDailyStore((s) => s.hydrate)
  const todayRecord = useDailyStore((s) => s.todayRecord)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated || !todayRecord) {
    return (
      <TodayBackground>
        <div className="flex flex-1 items-center justify-center min-h-[40vh]">
          <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      </TodayBackground>
    )
  }

  return (
    <TodayBackground>
      <TodayAchievementBanner />
      <GuidedToday />
    </TodayBackground>
  )
}
