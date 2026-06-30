import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import type { WorkoutExercise, ExerciseLogState } from '@/modules/fitness/types'
import { cn } from '@/utils/cn'

interface ExerciseCardProps {
  exercise: WorkoutExercise
  state: ExerciseLogState
  index: number
  onToggle: () => void
  onUpdate: (partial: Partial<ExerciseLogState>) => void
  readOnly?: boolean
}

export function ExerciseCard({
  exercise,
  state,
  index,
  onToggle,
  onUpdate,
  readOnly = false,
}: ExerciseCardProps) {
  const inputClass = cn(
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2',
    'text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30',
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        state.completed
          ? 'border-emerald-400/30 bg-emerald-500/[0.08]'
          : 'border-white/15 bg-white/[0.04]',
      )}
    >
      <div className="flex items-start gap-3">
        {!readOnly && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors',
              state.completed
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'border-white/25 hover:border-white/40',
            )}
          >
            {state.completed && <CheckIcon className="h-4 w-4" />}
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold', state.completed ? 'text-white/70 line-through' : 'text-white')}>
            {exercise.name}
          </p>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-white/45 tabular-nums">
            {exercise.sets != null && exercise.reps && (
              <span>{exercise.sets} × {exercise.reps}</span>
            )}
            {exercise.duration && <span>{exercise.duration}</span>}
            {exercise.restSeconds != null && (
              <span>{exercise.restSeconds}s rest</span>
            )}
          </div>
          {exercise.notes && (
            <p className="text-xs text-white/35 mt-1">{exercise.notes}</p>
          )}
        </div>
      </div>

      {!readOnly && exercise.kind === 'strength' && (
        <div className="grid grid-cols-2 gap-2 mt-3 pl-9">
          <input
            type="text"
            value={state.weightUsed}
            onChange={(e) => onUpdate({ weightUsed: e.target.value })}
            placeholder="Weight used"
            className={inputClass}
          />
          <input
            type="text"
            value={state.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Notes"
            className={inputClass}
          />
        </div>
      )}
    </motion.div>
  )
}
