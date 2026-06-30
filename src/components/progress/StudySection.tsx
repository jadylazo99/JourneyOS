import { useEffect, useMemo } from 'react'
import { useStudyStore } from '@/modules/study'
import { Card } from '@/components/ui'

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 text-center px-1">
      <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-base sm:text-xl font-semibold tracking-tight text-primary tabular-nums">
        {value}
      </p>
    </div>
  )
}

export function StudySection() {
  const hydrate = useStudyStore((s) => s.hydrate)
  const hydrated = useStudyStore((s) => s.hydrated)
  const studyingFor = useStudyStore((s) => s.studyingFor)
  const sessions = useStudyStore((s) => s.sessions)

  const stats = useMemo(
    () => (hydrated ? useStudyStore.getState().getProgressStats() : null),
    [hydrated, studyingFor, sessions.length],
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated || !stats) {
    return (
      <Card className="text-center py-10">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin mx-auto" />
      </Card>
    )
  }

  return (
    <Card padding="lg" className="space-y-5">
      {studyingFor ? (
        <p className="text-sm text-slate-500">
          Studying for: <span className="font-medium text-primary">{studyingFor}</span>
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          Set what you are studying for in Profile to personalize study tracking.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCell label="This week" value={`${stats.minutesThisWeek} min`} />
        <StatCell label="Total" value={`${stats.totalMinutes} min`} />
        <StatCell
          label="Latest score"
          value={stats.latestPracticeScore != null ? `${stats.latestPracticeScore}%` : '—'}
        />
        <StatCell label="Streak" value={`${stats.streak} day${stats.streak === 1 ? '' : 's'}`} />
      </div>
    </Card>
  )
}
