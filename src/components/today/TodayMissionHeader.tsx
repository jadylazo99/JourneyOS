import { useDailyStore } from '@/modules/daily'

interface TodayMissionHeaderProps {
  mainGoal?: string
}

export function TodayMissionHeader({ mainGoal }: TodayMissionHeaderProps) {
  const getFirstName = useDailyStore((s) => s.getFirstName)

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/70">
        Today&apos;s Mission
      </p>
      <p className="text-lg font-medium text-white/90">Become 1% Better</p>
      {mainGoal ? (
        <p className="text-sm text-white/45 leading-relaxed">
          {getFirstName()}, {mainGoal}
        </p>
      ) : (
        <p className="text-sm text-white/45">One step at a time.</p>
      )}
    </div>
  )
}
