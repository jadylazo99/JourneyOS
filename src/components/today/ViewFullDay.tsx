import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { GuidedTask } from '@/modules/daily/guided'

const STATUS_LABEL: Record<string, string> = {
  completed: 'Done',
  short: 'Short',
  skipped: 'Skipped',
  rescheduled: 'Later',
  not_needed: 'N/A',
  pending: '',
}

interface ViewFullDayProps {
  tasks: GuidedTask[]
  defaultOpen?: boolean
}

export function ViewFullDay({ tasks, defaultOpen = false }: ViewFullDayProps) {
  const [open, setOpen] = useState(defaultOpen)

  if (tasks.length === 0) return null

  return (
    <div className="max-w-[560px] mx-auto w-full mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-sm font-medium text-white/70">View full day</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2 space-y-1.5"
          >
            {tasks.map((task) => {
              const done = task.status !== 'pending' && task.status !== 'rescheduled'
              return (
                <li
                  key={task.id}
                  className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 ${
                    done ? 'bg-white/[0.03]' : 'bg-white/[0.06] border border-white/10'
                  }`}
                >
                  <span
                    className={`text-sm truncate ${
                      done ? 'text-white/40 line-through' : 'text-white/80'
                    }`}
                  >
                    {task.title}
                  </span>
                  {done && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 shrink-0">
                      {STATUS_LABEL[task.status]}
                    </span>
                  )}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
