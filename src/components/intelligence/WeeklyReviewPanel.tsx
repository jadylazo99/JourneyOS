import { motion } from 'framer-motion'
import { Card } from '@/components/ui'
import type { WeeklyReview } from '@/modules/intelligence'

interface WeeklyReviewPanelProps {
  review: WeeklyReview
  onDismiss?: () => void
}

export function WeeklyReviewPanel({ review, onDismiss }: WeeklyReviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-accent/10" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue">
                Weekly Review
              </p>
              <h3 className="text-lg font-semibold text-primary mt-1">{review.weekLabel}</h3>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Dismiss
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {review.weightChange !== null && (
              <Stat label="Weight" value={`${review.weightChange > 0 ? '+' : ''}${review.weightChange}`} />
            )}
            <Stat label="Workouts" value={String(review.workoutCount)} />
            <Stat label="Water days" value={String(review.waterDays)} />
            <Stat label="Protein days" value={String(review.proteinDays)} />
            <Stat label="Momentum" value={String(review.avgMomentum)} />
            <Stat label="Achievements" value={String(review.achievementsUnlocked)} />
            {review.petTasksCompleted > 0 && (
              <Stat label="Pet care" value={String(review.petTasksCompleted)} />
            )}
          </div>

          <div className="rounded-2xl bg-white/70 border border-slate-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Highlights
            </p>
            <ul className="space-y-1">
              {review.highlights.map((h) => (
                <li key={h} className="text-sm text-slate-600">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-semibold text-primary tabular-nums">{value}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  )
}
