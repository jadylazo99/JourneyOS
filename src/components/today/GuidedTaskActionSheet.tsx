import { motion, AnimatePresence } from 'framer-motion'
import { GUIDED_TASK_ACTIONS, type GuidedTaskStatus } from '@/modules/daily/guided'

interface GuidedTaskActionSheetProps {
  open: boolean
  onClose: () => void
  onSelect: (status: GuidedTaskStatus) => void
}

export function GuidedTaskActionSheet({ open, onClose, onSelect }: GuidedTaskActionSheetProps) {
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
              Choose what works today. Skipping never reduces your momentum unfairly.
            </p>
            <div className="space-y-2">
              {GUIDED_TASK_ACTIONS.filter((a) => a.status !== 'completed').map((opt) => (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => {
                    onSelect(opt.status)
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
