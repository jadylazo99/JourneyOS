import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts'
import { Card } from '@/components/ui'
import type { MonthlyReview } from '@/modules/intelligence'

interface MonthlyReviewPanelProps {
  review: MonthlyReview
  onDismiss?: () => void
}

function formatAxisDate(dateKey: string): string {
  const [, month, day] = dateKey.split('-')
  return `${Number(month)}/${Number(day)}`
}

export function MonthlyReviewPanel({ review, onDismiss }: MonthlyReviewPanelProps) {
  const chartData = review.weightChartPoints.map((p) => ({
    ...p,
    label: formatAxisDate(p.dateKey),
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue/10" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue">
                Monthly Review
              </p>
              <h3 className="text-lg font-semibold text-primary mt-1">{review.monthLabel}</h3>
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

          <p className="text-sm text-slate-600 leading-relaxed">{review.summary}</p>

          {chartData.length >= 2 && (
            <div className="rounded-2xl bg-white/70 border border-slate-100 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Weight trend
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthlyWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(value: number) => [`${value} lb`, 'Weight']}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#monthlyWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {review.weightChange !== null && (
              <Stat
                label="Weight change"
                value={`${review.weightChange > 0 ? '+' : ''}${review.weightChange} lb`}
              />
            )}
            <Stat label="Workouts" value={String(review.workoutsCompleted)} />
            <Stat label="Weigh-ins" value={String(review.weighInCount)} />
            <Stat label="Photo memories" value={String(review.photoMemories)} />
            <Stat label="Consistency" value={`${review.consistencyScore}%`} />
            <Stat label="Momentum" value={String(review.avgMomentum)} />
            <Stat label="Achievements" value={String(review.achievementsUnlocked)} />
          </div>

          {review.milestones.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.milestones.map((m) => (
                <span
                  key={m}
                  className="inline-flex rounded-full bg-blue/10 text-blue text-xs font-medium px-3 py-1"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
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
