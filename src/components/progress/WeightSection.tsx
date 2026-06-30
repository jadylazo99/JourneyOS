import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useWeightStore, formatWeightValue } from '@/modules/weight'
import { Card } from '@/components/ui'
import { formatPercent, formatPounds, formatWeightNumber } from '@/utils/format'

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 text-center px-1">
      <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 leading-tight">
        {label}
      </p>
      <p className="text-base sm:text-xl font-semibold tracking-tight text-primary tabular-nums break-words">
        {value}
      </p>
    </div>
  )
}

function MilestoneProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-gradient-to-r from-blue to-accent"
      />
    </div>
  )
}

export function WeightSection() {
  const entries = useWeightStore((s) => s.entries)
  const progress = useMemo(() => useWeightStore.getState().getProgress(), [entries])
  const nextMilestone = useMemo(
    () => useWeightStore.getState().getNextMilestoneInfo(),
    [entries],
  )
  const milestones = useMemo(() => useWeightStore.getState().getMilestones(), [entries])

  const hasData =
    progress.currentWeight != null &&
    progress.goalWeight != null &&
    progress.startWeight != null

  if (!hasData) {
    return (
      <Card className="text-center py-10">
        <p className="text-sm text-slate-500">
          Complete onboarding and log your first weigh-in to track weight progress.
        </p>
      </Card>
    )
  }

  const unit = 'lb'
  const reachedCount = milestones.filter((m) => m.reached).length

  return (
    <Card padding="lg" className="overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 100% 0%, #2563EB 0%, transparent 50%)',
        }}
      />

      <div className="relative space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatCell
            label="Current"
            value={formatWeightValue(progress.currentWeight!, unit)}
          />
          <StatCell
            label="Goal"
            value={formatWeightValue(progress.goalWeight!, unit)}
          />
          <StatCell
            label="Progress"
            value={formatPercent(progress.percentComplete)}
          />
        </div>

        <div className="rounded-2xl bg-slate-50/80 p-3 sm:p-4 border border-slate-100">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatCell label="To lose" value={formatPounds(progress.totalPoundsToLose)} />
            <StatCell label="Lost" value={formatPounds(progress.poundsLost)} />
            <StatCell label="Remaining" value={formatPounds(progress.poundsRemaining)} />
          </div>
        </div>

        {nextMilestone && (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Next 5 lb milestone
                </p>
                <p className="text-2xl font-semibold text-primary tabular-nums mt-1">
                  {formatWeightValue(nextMilestone.targetWeight ?? progress.goalWeight!, unit)}
                </p>
              </div>
              <div className="sm:text-right min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Remaining
                </p>
                <p className="text-lg font-semibold text-blue tabular-nums mt-1">
                  {formatPounds(nextMilestone.poundsRemaining)}
                </p>
              </div>
            </div>
            <MilestoneProgressBar percent={nextMilestone.progressPercent} />
          </div>
        )}

        {milestones.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Milestones · {reachedCount} reached
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 tabular-nums">
                Start {formatWeightNumber(progress.startWeight!)} {unit}
              </span>
              {milestones.slice(0, 8).map((m) => (
                <span
                  key={m.targetWeight}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tabular-nums ${
                    m.reached
                      ? 'bg-blue/10 text-blue'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {formatWeightNumber(m.targetWeight)}
                </span>
              ))}
              {milestones.length > 8 && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400">
                  +{milestones.length - 8} more
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue/10 to-accent/10 px-3 py-1 text-xs font-semibold text-blue tabular-nums">
                Goal {formatWeightNumber(progress.goalWeight!)} {unit}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
