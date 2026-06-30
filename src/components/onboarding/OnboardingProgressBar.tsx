import { motion, AnimatePresence } from 'framer-motion'
import type { OnboardingSection } from '@/modules/onboarding/types'

interface OnboardingProgressBarProps {
  current: number
  total: number
  sectionTitle: OnboardingSection
}

export function OnboardingProgressBar({ current, total, sectionTitle }: OnboardingProgressBarProps) {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <div className="mt-3 text-center">
        <motion.p
          key={`step-${current}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-medium text-white/50 tracking-wide"
        >
          Step {current + 1} of {total}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.p
            key={sectionTitle}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-1 text-sm font-semibold text-white/90 tracking-tight"
          >
            {sectionTitle}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
