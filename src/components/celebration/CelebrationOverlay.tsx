import { motion, AnimatePresence } from 'framer-motion'
import type { CelebrationPayload } from '@/modules/achievements/types'
import { Confetti } from './Confetti'

interface CelebrationOverlayProps {
  celebration: CelebrationPayload | null
  onContinue: () => void
}

function WeightCelebrationContent({
  celebration,
}: {
  celebration: Extract<CelebrationPayload, { type: 'milestone' }>
}) {
  const lines = celebration.message.split('\n')

  return (
    <>
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="text-6xl mb-6 block"
      >
        🎉
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="text-3xl font-semibold tracking-tight text-white mb-4"
      >
        {celebration.title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="space-y-2 text-lg text-white/75 leading-relaxed"
      >
        <p>You&apos;ve officially lost</p>
        <p className="text-4xl font-semibold text-white tabular-nums">
          {celebration.poundsLost} pounds.
        </p>
        {lines.slice(1).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </motion.div>
    </>
  )
}

function AchievementCelebrationContent({
  celebration,
}: {
  celebration: Extract<CelebrationPayload, { type: 'achievement' }>
}) {
  return (
    <>
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="text-6xl mb-6 block"
      >
        {celebration.icon}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="text-3xl font-semibold tracking-tight text-white mb-3"
      >
        Achievement Unlocked
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.45 }}
        className="text-xl font-medium text-white/90"
      >
        {celebration.title}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="text-base text-white/60 mt-2 leading-relaxed"
      >
        {celebration.description}
      </motion.p>
    </>
  )
}

export function CelebrationOverlay({ celebration, onContinue }: CelebrationOverlayProps) {
  return (
    <>
      <Confetti active={celebration != null} />
      <AnimatePresence>
        {celebration && (
          <motion.div
            key={
              celebration.type === 'milestone'
                ? `milestone-${celebration.milestoneTarget}`
                : `achievement-${celebration.achievementId}`
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[99] flex items-center justify-center px-6"
            style={{
              background:
                'linear-gradient(165deg, rgba(15, 23, 42, 0.96) 0%, rgba(37, 99, 235, 0.88) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="w-full max-w-md text-center"
            >
              {celebration.type === 'milestone' ? (
                <WeightCelebrationContent celebration={celebration} />
              ) : (
                <AchievementCelebrationContent celebration={celebration} />
              )}

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                type="button"
                onClick={onContinue}
                className="mt-10 w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-primary shadow-lg shadow-black/20 transition-transform active:scale-[0.98]"
              >
                Continue Journey
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
