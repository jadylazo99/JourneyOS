import { motion } from 'framer-motion'

interface OnboardingNavigationProps {
  onBack: () => void
  onNext: () => void
  canGoBack: boolean
  canGoNext: boolean
  isLastStep: boolean
}

export function OnboardingNavigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastStep,
}: OnboardingNavigationProps) {
  return (
    <div className="flex items-center gap-3 safe-bottom">
      <motion.button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        initial={false}
        animate={{ opacity: canGoBack ? 1 : 0, scale: canGoBack ? 1 : 0.95 }}
        whileTap={canGoBack ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.2 }}
        className="flex-1 h-13 h-[52px] rounded-2xl text-sm font-medium text-white/80 border border-white/15 disabled:pointer-events-none transition-colors duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        Back
      </motion.button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        whileHover={canGoNext ? { scale: 1.02 } : undefined}
        whileTap={canGoNext ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.2 }}
        className="flex-[2] h-[52px] rounded-2xl text-sm font-semibold text-primary bg-white disabled:opacity-35 disabled:cursor-not-allowed shadow-glass transition-all duration-200"
      >
        {isLastStep ? 'Get Started' : 'Continue'}
      </motion.button>
    </div>
  )
}
