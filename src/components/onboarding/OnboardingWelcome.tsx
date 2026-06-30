import { motion } from 'framer-motion'

interface OnboardingWelcomeProps {
  onStart: () => void
}

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export function OnboardingWelcome({ onStart }: OnboardingWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh min-h-screen px-6 py-12 safe-bottom">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center text-center max-w-md w-full"
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="h-20 w-20 rounded-[22px] bg-gradient-to-br from-blue to-accent flex items-center justify-center shadow-glass-lg mx-auto"
          >
            <span className="text-3xl font-bold text-white tracking-tight">J</span>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl md:text-5xl font-semibold tracking-tight text-white"
        >
          JourneyOS
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 text-lg md:text-xl font-medium text-accent/90 tracking-tight"
        >
          Your Life. Organized.
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 text-base md:text-lg text-white/60 leading-relaxed max-w-sm"
        >
          JourneyOS learns about you once, then quietly guides you every day.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 w-full max-w-xs"
        >
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-2xl text-base font-semibold text-primary bg-white shadow-glass-lg hover:bg-white/95 transition-colors duration-200"
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
