import { motion } from 'framer-motion'
import { getWeeklySummaries } from '@/modules/calendar'
import { Card } from '@/components/ui'

export function WeeklySummaryCards() {
  const summaries = getWeeklySummaries(4)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {summaries.map((week, index) => (
        <motion.div
          key={week.startDateKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
        >
          <Card padding="sm" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue mb-3">
              {week.weekLabel}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-lg font-semibold text-primary tabular-nums">
                  {week.strongDays}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Strong days</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary tabular-nums">
                  {week.avgMomentum}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg momentum</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary tabular-nums">
                  {week.workoutsCompleted}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Workouts</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary tabular-nums">
                  {week.achievementsUnlocked}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Unlocked</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
