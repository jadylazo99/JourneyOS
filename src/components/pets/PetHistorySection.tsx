import type { PetTask } from '@/modules/pets'

interface PetHistorySectionProps {
  history: { dateKey: string; tasks: PetTask[] }[]
}

const STATUS_DOT: Record<string, string> = {
  completed: 'bg-emerald-400',
  skipped: 'bg-white/25',
  rescheduled: 'bg-amber-400/70',
  not_needed: 'bg-white/15',
  pending: 'bg-white/10',
}

export function PetHistorySection({ history }: PetHistorySectionProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-white/35 text-center py-6">
        Complete pet tasks to build your care history.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {history.map(({ dateKey, tasks }) => {
        const completed = tasks.filter((t) => t.status === 'completed').length
        return (
          <li key={dateKey} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white/70">{dateKey}</p>
              <p className="text-xs text-white/35 tabular-nums">
                {completed}/{tasks.length} done
              </p>
            </div>
            <ul className="space-y-1.5">
              {tasks.slice(0, 5).map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-xs text-white/50">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[task.status]}`} />
                  <span className="truncate">{task.label}</span>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
