import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AdaptiveWorkoutResult } from '@/modules/fitness/types'

interface FitnessTodayPanelProps {
  workout: AdaptiveWorkoutResult
  completed: boolean
  skippedMessage?: string | null
}

export function FitnessTodayPanel({ workout, completed, skippedMessage }: FitnessTodayPanelProps) {
  if (skippedMessage) {
    return (
      <div
        className="rounded-2xl border border-white/15 p-4"
        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/80 mb-2">
          Workout
        </p>
        <p className="text-sm text-white/70">{skippedMessage}</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border border-white/15 p-4 space-y-3"
      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
          {completed ? 'Workout done' : "Today's workout"}
        </p>
        <Link
          to="/workout"
          className="text-[11px] font-medium text-white/45 hover:text-white/70 transition-colors"
        >
          Open →
        </Link>
      </div>

      {workout.message && (
        <p className="text-sm text-white/60 leading-relaxed">{workout.message}</p>
      )}

      {workout.walkingGoal && (
        <p className="text-sm text-accent/90">{workout.walkingGoal}</p>
      )}

      {workout.showWorkout && (
        <>
          <div>
            <p className="text-base font-semibold text-white">{workout.title}</p>
            {workout.subtitle && (
              <p className="text-xs text-white/45 mt-0.5">{workout.subtitle}</p>
            )}
          </div>
          <div className="flex gap-4 text-xs text-white/45 tabular-nums">
            <span>{workout.estimatedMinutes} min</span>
            <span>{workout.exercises.length} exercises</span>
            {workout.variant === 'short' && (
              <span className="text-accent">Short version</span>
            )}
          </div>
        </>
      )}

      {!completed && workout.showWorkout && (
        <Link to="/workout">
          <motion.span
            whileTap={{ scale: 0.98 }}
            className="block w-full rounded-xl bg-white/10 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Start Workout
          </motion.span>
        </Link>
      )}
    </div>
  )
}
