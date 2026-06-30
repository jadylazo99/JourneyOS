import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DAY_MODE_LABELS } from '@/modules/daily/constants'
import type { DayModeId } from '@/modules/daily'

const ALL_MODES: DayModeId[] = [
  'normal',
  'busy_workday',
  'gym',
  'rest',
  'vacation',
  'travel',
  'sick',
  'recovery',
  'custom',
]

interface DayModeSelectorProps {
  currentMode: DayModeId
  onSelect: (mode: DayModeId) => void
  disabled?: boolean
}

export function DayModeSelector({ currentMode, onSelect, disabled }: DayModeSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className="text-sm text-white/50 hover:text-white/75 transition-colors disabled:opacity-50"
      >
        {DAY_MODE_LABELS[currentMode]} · Change
      </motion.button>

      <AnimatePresence>
        {open && !disabled && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 top-full mt-2 z-50 w-52 rounded-2xl border border-white/15 shadow-glass-lg overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <p className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Today's mode
              </p>
              {ALL_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    onSelect(mode)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                    mode === currentMode
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {DAY_MODE_LABELS[mode]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
