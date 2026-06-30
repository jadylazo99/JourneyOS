import { motion, AnimatePresence } from 'framer-motion'
import { SKIP_OPTIONS, type WorkoutSkipReason } from '@/modules/fitness'

interface WorkoutSkipSheetProps {
  open: boolean
  onClose: () => void
  onSelect: (reason: WorkoutSkipReason) => void
}

export function WorkoutSkipSheet({ open, onClose, onSelect }: WorkoutSkipSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-primary px-5 pt-6 pb-10 safe-bottom"
          >
            <p className="text-lg font-semibold text-white mb-1">No pressure</p>
            <p className="text-sm text-white/50 mb-5">
              Choose what works today. Showing up still counts.
            </p>
            <div className="space-y-2">
              {SKIP_OPTIONS.map((opt) => (
                <button
                  key={opt.reason}
                  type="button"
                  onClick={() => {
                    onSelect(opt.reason)
                    onClose()
                  }}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-left hover:bg-white/[0.1] transition-colors"
                >
                  <p className="text-sm font-semibold text-white">{opt.label}</p>
                  <p className="text-xs text-white/45 mt-0.5">{opt.message}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
