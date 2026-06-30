import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface OnboardingScreenProps {
  stepKey: string
  title: string
  subtitle?: string
  direction: 1 | -1
  children: ReactNode
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 56 : -56,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -56 : 56,
    opacity: 0,
    scale: 0.97,
  }),
}

export function OnboardingScreen({
  stepKey,
  title,
  subtitle,
  direction,
  children,
}: OnboardingScreenProps) {
  return (
    <motion.div
      key={stepKey}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      <div
        className="rounded-[32px] p-6 md:p-8 w-full shadow-glass-lg border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <h1 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-white/55 leading-relaxed">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  )
}
