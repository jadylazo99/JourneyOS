import { motion } from 'framer-motion'
import { Card } from '@/components/ui'
import type { FitnessProgressStats } from '@/modules/fitness/types'

export function FitnessProgressSection({ stats }: { stats: FitnessProgressStats }) {
  return (
    <Card padding="lg" className="overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 0%, #2563EB 0%, transparent 50%)',
        }}
      />
      <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total workouts', value: stats.totalWorkouts },
          { label: 'Current streak', value: stats.currentStreak },
          { label: 'Longest streak', value: stats.longestStreak },
          { label: 'Exercises done', value: stats.exercisesCompleted },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {item.label}
            </p>
            <p className="text-2xl font-semibold text-primary tabular-nums">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {stats.personalRecords.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Personal records
          </p>
          <div className="space-y-2">
            {stats.personalRecords.slice(0, 5).map((pr) => (
              <div key={pr.exerciseName} className="flex justify-between text-sm">
                <span className="text-primary font-medium">{pr.exerciseName}</span>
                <span className="text-blue tabular-nums">{pr.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
