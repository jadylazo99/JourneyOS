import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { PetTask } from '@/modules/pets'

const STATUS_LABELS: Record<string, string> = {
  completed: 'Done',
  skipped: 'Skipped',
  rescheduled: 'Rescheduled',
  not_needed: 'Not needed',
}

interface PetTaskCardProps {
  task: PetTask
  onAction: () => void
  compact?: boolean
}

export function PetTaskCard({ task, onAction, compact }: PetTaskCardProps) {
  const done = task.status !== 'pending'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onAction}
      className={`w-full text-left rounded-2xl border transition-colors ${
        done
          ? 'border-white/10 bg-white/[0.03]'
          : 'border-white/15 bg-white/[0.06] hover:bg-white/[0.09]'
      } ${compact ? 'px-3 py-2.5' : 'px-4 py-3.5'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-base opacity-60 shrink-0">🐾</span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              done ? 'text-white/45 line-through' : 'text-white'
            }`}
          >
            {task.label}
          </p>
          {task.time && !compact && (
            <p className="text-xs text-white/35 mt-0.5 flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {task.time}
            </p>
          )}
        </div>
        {done ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35 shrink-0">
            {STATUS_LABELS[task.status]}
          </span>
        ) : (
          <CheckCircleIcon className="h-5 w-5 text-white/25 shrink-0" />
        )}
      </div>
    </motion.button>
  )
}
